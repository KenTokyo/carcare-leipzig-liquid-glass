"""Prueft das ausgelieferte HTML (dist/) auf die Aenderungen vom 2026-09-16."""
import io
import json
import os
import re
import sys

# Windows-Konsolen laufen oft mit cp1252 — dann bricht schon die erste Zeile mit „→" ab
# (2026-09-17 passiert). Ausgabe deshalb fest auf UTF-8.
sys.stdout.reconfigure(encoding='utf-8')

DIST = 'dist'


def seite(route):
    pfad = os.path.join(DIST, route.strip('/'), 'index.html') if route != '/' else os.path.join(DIST, 'index.html')
    return io.open(pfad, encoding='utf-8').read()


def alle_seiten():
    for d, _, dateien in os.walk(DIST):
        for f in dateien:
            if f == 'index.html':
                yield os.path.join(d, f)


fehler = []


def pruefe(bedingung, text):
    print(('  ok   ' if bedingung else '  FEHL ') + text)
    if not bedingung:
        fehler.append(text)


print('== /fahrzeugaufbereitung-leipzig')
h = seite('/fahrzeugaufbereitung-leipzig')
pruefe('Preis nach Absprache' in h, '„Preis nach Absprache" sichtbar')
pruefe('Preis nach Aufwand' in h, '„Preis nach Aufwand" sichtbar')
pruefe('Aufpreis von 20' in h and 'Transporter von 50' in h, 'Aufpreis-Fußnote sichtbar')
pruefe('348' not in h, 'keine 348 mehr')
pruefe('Lackreinigung' not in h, 'keine Lackreinigung')
pruefe('SWIZ' not in h.upper().replace('SWISSVAX', ''), 'kein SWIZÖL (außer Hinweis „früher Swizöl")' if 'Swizöl' in h else 'kein SWIZÖL')
pruefe('Swissvax' in h, 'Swissvax genannt')
pruefe('Intensiv Innenraumreinigung' in h and 'Intensiv Innenreinigung' not in h, 'Paketname Intensiv Innenraumreinigung')
pruefe('Innenraum und Außenpflege, Politur, Versiegelung, Geruchsentfernung' in h, '4.3-Wortlaut im Hero')

# JSON-LD Offers
offers = []
for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
    try:
        daten = json.loads(block)
    except json.JSONDecodeError:
        continue
    for d in daten if isinstance(daten, list) else [daten]:
        if d.get('@type') == 'OfferCatalog':
            offers = d['itemListElement']
namen = {o['name']: o for o in offers}
exkl = namen.get('Premiumpflege „exklusiv“', {})
pruefe(bool(exkl) and 'price' not in exkl and 'priceSpecification' not in exkl and 'priceCurrency' not in exkl,
       'Schema: exklusiv ohne Preisfelder')
lack = namen.get('Lackaufbereitung', {})
pruefe(bool(lack) and 'price' not in lack, 'Schema: Lackaufbereitung vorhanden, ohne Preis')
brill = namen.get('Brillant Außenpflege', {})
pruefe(brill.get('price') == '169.00' and 'Aufpreis' in brill.get('description', ''), 'Schema: Brillant 169.00 mit Aufpreis-Satz')

print('== Schaden melden → reparatur.info (alle Seiten)')
ziel = 'https://reparatur.info/bs-carcare-gmbh'
anzahl_links = 0
ohne_rel = 0
alte_ziele = 0
for pfad in alle_seiten():
    t = io.open(pfad, encoding='utf-8').read()
    for a in re.findall(r'<a\b[^>]*>', t):
        if ziel in a:
            anzahl_links += 1
            if 'target="_blank"' not in a or 'noopener' not in a or 'noreferrer' not in a:
                ohne_rel += 1
        if re.search(r'href="(/kontakt)?#contact-schaden"', a):
            alte_ziele += 1
print(f'  info Links auf reparatur.info im HTML: {anzahl_links}')
pruefe(anzahl_links > 0, 'reparatur.info verlinkt')
pruefe(ohne_rel == 0, 'alle mit target=_blank + noopener noreferrer')
pruefe(alte_ziele == 0, f'keine Links mehr auf #contact-schaden (gefunden: {alte_ziele})')

print('== Partner')
start = seite('/')
gk = seite('/geschaeftskunden')
for name, h2 in [('/', start), ('/geschaeftskunden', gk)]:
    pruefe('/assets/partner/riparo.webp' in h2, f'{name}: riparo-Logo')
    pruefe('href="https://riparo.de/"' in h2, f'{name}: riparo-Link')
    pruefe('href="https://www.porsche-leipzig.de/"' in h2, f'{name}: Porsche-Zentrum-Link')
pruefe('porsche' not in ' '.join(re.findall(r'src="[^"]*partner[^"]*"', start + gk)).lower(), 'kein Porsche-Logo eingebunden')
pruefe('Mit diesen 31 Versicherern und dem Schadensteuerer riparo' in re.sub(r'<!-- -->', '', gk), '/geschaeftskunden: Zähler 31 + riparo')

print('== BVAT')
for route in ['/hagelschadenreparatur-leipzig', '/ueber-uns']:
    h3 = seite(route)
    pruefe('/assets/partner/bvat.webp' in h3, f'{route}: BVAT-Siegel')
    pruefe('Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V.' in h3, f'{route}: offizieller Name')
    pruefe('Bundesverband für' not in h3, f'{route}: kein falscher Name')
    pruefe('href="https://www.bvat.de/"' in h3, f'{route}: Link bvat.de')
pruefe('Audatex- und DAT-Kalkulation' in seite('/ueber-uns'), '/ueber-uns: Audatex- und DAT-Kalkulation')

print('== FAQ /geschaeftskunden (vormals doppelte id)')
# Sichtbar (h3) + FAQPage-Schema = je genau 2 Vorkommen; die neue Antwort steht drin.
pruefe(gk.count('Gibt es digitale Schadenübermittlung?') == 2, 'Frage „digitale Schadenübermittlung" genau einmal sichtbar + einmal im Schema')
pruefe(gk.count('Wie läuft die Abwicklung digital ab?') == 2, 'Frage „Abwicklung digital" genau einmal sichtbar + einmal im Schema')
pruefe('Schäden lassen sich über unsere Schadenseite auf reparatur.info digital übermitteln' in gk, 'neue Antwort ausgeliefert')
pruefe('perspektivisch vorgesehen' not in gk, 'alte, widersprüchliche Antwort weg')

print('== Lackreinigung sitewide (ohne Wissensartikel)')
treffer = []
for pfad in alle_seiten():
    if 'autoaufbereitung-wissen' in pfad.replace('\\', '/'):
        continue
    if 'Lackreinigung' in io.open(pfad, encoding='utf-8').read():
        treffer.append(pfad)
pruefe(not treffer, f'keine Lackreinigung außerhalb der Wissensartikel ({treffer})')

print()
print(f'FEHLER: {fehler}' if fehler else 'ALLES OK')
sys.exit(1 if fehler else 0)
