import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        // Nutzt den vom Harness zugewiesenen Port (PORT), sonst Standard 3007.
        port: Number(process.env.PORT) || 3007,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          /**
           * Setzt `window.__CC_DEV__` ausschliesslich im Dev-Server (`apply: 'serve'`).
           *
           * Warum: Das Session-Gate des Preloaders (1x pro Session) ist in Produktion
           * richtig — beim Entwickeln macht es das Feature nach dem ersten Reload
           * unsichtbar. Mit diesem Flag laeuft der Preloader lokal bei jedem Reload,
           * waehrend der gebaute Output das Gate unveraendert behaelt.
           *
           * Bewusst KEIN `location.hostname === 'localhost'`-Test im Inline-Script:
           * Der wuerde auch `vite preview` und `scripts/prerender.mjs` (beide laufen auf
           * localhost) als "Entwicklung" einstufen — und damit liesse sich das echte
           * Produktionsverhalten nirgends mehr verifizieren.
           *
           * Einfuegen direkt nach <head>, damit das Flag VOR dem Gate-Script steht.
           */
          name: 'cc-preloader-dev-flag',
          apply: 'serve',
          transformIndexHtml(html: string) {
            return html.replace('<head>', '<head>\n  <script>window.__CC_DEV__ = true;</script>');
          },
        },
      ],
      build: {
        rollupOptions: {
          output: {
            /**
             * Vendor-Bibliotheken in eigene Chunks. Vorher lag alles in einem
             * 568-kB-Bundle (163 kB gzip), Vite warnte beim Build.
             *
             * Warum das hier relevant ist: Der Preloader haelt so lange, bis React
             * gebootet hat. Kuerzere Parse-/Compile-Zeit heisst also direkt kuerzere
             * wahrgenommene Wartezeit — und schuetzt das LCP-Ziel aus
             * SEO-GEO-STANDARDS.md §2.2. Zusaetzlich bleiben React & Co. ueber Deploys
             * hinweg im Browser-Cache, weil sich ihr Chunk-Hash nicht mehr aendert,
             * sobald nur App-Code angefasst wird.
             *
             * BEWUSST kein route-level `React.lazy`: Das waere wirkungsvoller, wuerde
             * aber mit scripts/prerender.mjs kollidieren (jede Route muesste ihren
             * Chunk erst nachladen, bevor der Snapshot steht).
             *
             * Funktionsform statt Objektform `{ react: ['react','react-dom'] }`: Die
             * Objektform matcht Einstiegs-Module, und `index.tsx` importiert
             * `react-dom/client` — ein anderer Einstieg als `react-dom`. Ergebnis war ein
             * 3,8-kB-Alibi-Chunk, waehrend react-dom im Hauptbundle blieb (gemessen).
             * Der Pfad-Match unten erwischt das Paket unabhaengig vom Einstiegspunkt.
             */
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
              // framer-motion v12 liefert Teile ueber motion-dom / motion-utils aus.
              if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion';
              if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return 'icons';
              if (/[\\/]node_modules[\\/]lenis[\\/]/.test(id)) return 'scroll';
            },
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
