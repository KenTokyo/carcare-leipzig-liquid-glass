/**
 * Wohin „Schaden melden" fuehrt — EINE Stelle fuer die ganze Seite.
 *
 * ENTSCHEIDUNG DES KUNDEN (2026-09-16): Hinter „Schaden melden" liegt die eigene
 * Schadenseite des Betriebs auf reparatur.info. Das beantwortet drei offene Punkte:
 *   - 2.23 „Unfallinstandsetzung → Weiterleitung zu PDR Cloud / reparatur.info, kein eigenes
 *     Formular" — am 2026-09-06 bewusst zurueckgestellt, jetzt umgesetzt
 *   - 3.34 „Wird reparatur.info aktiv genutzt?" — ja
 *   - 3.33 „Bilder-Upload zur Ersteinschaetzung" — dort moeglich („Daten hochladen")
 *
 * WAS reparatur.info IST (geprueft 2026-09-16): eine Anwendung der PDR.cloud GmbH
 * (Schoenefeld). Die Seite `/bs-carcare-gmbh` ist die Schadenseite von BS CarCare selbst —
 * „Schadeninformation uebermitteln" und „Besichtigungstermin vereinbaren". Datenschutz-
 * rechtlich ist das eine Verarbeitung IM AUFTRAG des Betriebs, siehe
 * `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`, Nachtrag 2026-09-16.
 *
 * ⚠️ DAS EIGENE SCHADENFORMULAR IST ABGESCHALTET, NICHT GELOESCHT. `SCHADENMELDUNG_EXTERN`
 * auf `false` gesetzt, und jeder Aufruf fuehrt wieder in das Formular auf der Kontaktseite
 * (`RequestForm` mit `kind="schaden"`, Felder in `data/schadenFelder.ts`, Versand ueber
 * `api/anfrage.ts`). Geloescht wird es erst, wenn der Kunde den externen Weg bestaetigt hat —
 * es ist gebaut, getestet und haengt am Mailversand.
 *
 * Reines Datenmodul ohne Importe: Es wird von Seiten, Navigation und Komponenten gelesen.
 */

/** `true` = „Schaden melden" fuehrt zu reparatur.info. `false` = eigenes Formular. */
export const SCHADENMELDUNG_EXTERN = true;

/** Die Schadenseite des Betriebs, wie vom Kunden vorgegeben. */
export const SCHADENMELDUNG_URL = 'https://reparatur.info/bs-carcare-gmbh';

/** Name des Portals, so wie er auf der Seite genannt wird. */
export const SCHADENMELDUNG_PORTAL = 'reparatur.info';

/** Ziel des eigenen Formulars — Rueckweg, falls der Schalter wieder auf `false` steht. */
export const SCHADEN_FORMULAR = '/kontakt#contact-schaden';

/** Ziel fuer JEDEN „Schaden melden"-Aufruf. Wer einen neuen baut, nimmt diesen Wert. */
export const SCHADEN_ZIEL = SCHADENMELDUNG_EXTERN ? SCHADENMELDUNG_URL : SCHADEN_FORMULAR;
