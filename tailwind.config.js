/** @type {import('tailwindcss').Config} */
// Portiert aus der frueheren inline-Config in index.html (Play-CDN abgeloest).
// Farben als 'rgb(<kanal> / <alpha-value>)' -> Opacity-Modifier (bg-white/90 ...) funktionieren.
// gray-300..700 behalten bewusst eingebackene Alphas (Text-Ramp, nie mit /xx genutzt).
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './seo/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted Variable Font (300-700), @font-face in index.css.
        // KEIN 800 vorhanden -> `font-extrabold` rendert als 700.
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        white: 'rgb(var(--cc-white-rgb) / <alpha-value>)',
        black: 'rgb(var(--cc-carbon-rgb) / <alpha-value>)',
        gray: {
          50: 'rgb(var(--cc-soft-ice-rgb) / <alpha-value>)',
          100: 'rgb(var(--cc-gray-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--cc-ice-blue-rgb) / <alpha-value>)',
          300: 'rgb(var(--cc-ice-blue-rgb) / 0.82)',
          400: 'rgb(var(--cc-graphite-rgb) / 0.42)',
          500: 'rgb(var(--cc-graphite-rgb) / 0.58)',
          600: 'rgb(var(--cc-graphite-rgb) / 0.72)',
          700: 'rgb(var(--cc-graphite-rgb) / 0.84)',
          800: 'rgb(var(--cc-graphite-rgb) / <alpha-value>)',
          900: 'rgb(var(--cc-graphite-rgb) / <alpha-value>)',
          950: 'rgb(var(--cc-carbon-rgb) / <alpha-value>)',
        },
        blue: {
          50: 'rgb(var(--cc-blue-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--cc-ice-blue-rgb) / <alpha-value>)',
          200: 'rgb(var(--cc-blue-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--cc-ice-blue-rgb) / <alpha-value>)',
          400: 'rgb(var(--cc-signal-blue-rgb) / <alpha-value>)',
          500: 'rgb(var(--cc-signal-blue-rgb) / <alpha-value>)',
          600: 'rgb(var(--cc-trust-blue-rgb) / <alpha-value>)',
          700: 'rgb(var(--cc-signal-blue-rgb) / <alpha-value>)',
          800: 'rgb(var(--cc-trust-blue-rgb) / <alpha-value>)',
          900: 'rgb(var(--cc-trust-blue-rgb) / <alpha-value>)',
        },
        premium: {
          50: 'rgb(var(--cc-soft-ice-rgb) / <alpha-value>)',
          100: 'rgb(var(--cc-ice-blue-rgb) / <alpha-value>)',
          200: 'rgb(var(--cc-signal-blue-rgb) / <alpha-value>)',
          900: 'rgb(var(--cc-carbon-rgb) / <alpha-value>)',
        },
        tech: {
          white: 'rgb(var(--cc-white-rgb) / <alpha-value>)',
          ice: 'rgb(var(--cc-soft-ice-rgb) / <alpha-value>)',
          carbon: 'rgb(var(--cc-carbon-rgb) / <alpha-value>)',
          graphite: 'rgb(var(--cc-graphite-rgb) / <alpha-value>)',
          trust: 'rgb(var(--cc-trust-blue-rgb) / <alpha-value>)',
          signal: 'rgb(var(--cc-signal-blue-rgb) / <alpha-value>)',
          blueice: 'rgb(var(--cc-ice-blue-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
