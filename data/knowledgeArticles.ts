import { FAQItem } from '../types';

export interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  articleSlugs: string[];
}

export interface KnowledgeArticle {
  slug: string;
  path: string;
  category: string;
  readTime: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  cardTitle: string;
  cardDescription: string;
  introAnswer: string;
  definition: string[];
  whenItPays: string[];
  process: string[];
  costFactors: string[];
  tips: string[];
  mistakes: string[];
  faqs: FAQItem[];
  relatedSlugs: string[];
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'was-ist-autoaufbereitung',
    path: '/autoaufbereitung-wissen/was-ist-autoaufbereitung',
    category: 'Grundlagen',
    readTime: '6 Min.',
    title: 'Was ist Autoaufbereitung?',
    metaTitle: 'Was ist Autoaufbereitung? Definition & Ablauf | CarCare',
    metaDescription:
      'Was Autoaufbereitung bedeutet, wann sie sich lohnt, wie der Ablauf aussieht und welche Fehler Sie vermeiden sollten. Fachlicher Ratgeber vom CarCare Center.',
    cardTitle: 'Was ist Autoaufbereitung?',
    cardDescription: 'Grundlagen zu professioneller Fahrzeugpflege, Werterhalt, Ablauf und sinnvoller Vorbereitung.',
    introAnswer:
      'Autoaufbereitung ist die fachgerechte Reinigung, Pflege und optische Aufwertung eines Fahrzeugs. Sie verbindet Innenraumreinigung, Außenpflege, Lackbearbeitung und Materialpflege mit dem Ziel, Zustand, Eindruck und Werterhalt sichtbar zu verbessern.',
    definition: [
      'Bei einer professionellen Autoaufbereitung wird ein Fahrzeug nicht nur gewaschen. Innenraum, Lack, Felgen, Scheiben, Kunststoffe, Polster und empfindliche Oberflächen werden passend zum Zustand behandelt.',
      'Der Umfang kann von einer gründlichen Innen- und Außenpflege bis zu Lackreinigung, Politur, Versiegelung, Geruchsentfernung oder Leasingrückgabe-Vorbereitung reichen.',
    ],
    whenItPays: [
      'vor dem Verkauf, damit das Fahrzeug gepflegt und nachvollziehbar präsentiert wird',
      'vor einer Leasingrückgabe, um typische Gebrauchsspuren frühzeitig einzuschätzen',
      'nach intensiver Nutzung, Haustieren, Alltagsschmutz oder Geruchsbelastung',
      'bei hochwertigen Fahrzeugen, Fuhrparks oder Fahrzeugen mit hohem Anspruch an den optischen Zustand',
      'wenn Lack, Innenraum oder Materialien sichtbar nach Pflege verlangen',
    ],
    process: [
      'Fahrzeugzustand ansehen und Ziel der Aufbereitung klären',
      'Innenraum und Außenbereich materialgerecht reinigen',
      'Lackzustand prüfen, reinigen und bei Bedarf polieren',
      'Oberflächen, Kunststoffe, Leder oder Polster passend pflegen',
      'Versiegelung, Finish und Übergabe mit Blick auf Details durchführen',
    ],
    costFactors: [
      'Fahrzeuggröße und Karosserieform',
      'Innenraumzustand, Verschmutzung und Geruchsbelastung',
      'Lackzustand, Kratzerbild und gewünschter Glanzgrad',
      'Umfang der gewünschten Leistung, etwa Basisreinigung, Politur oder Versiegelung',
      'Zeitaufwand für Detailarbeiten und schwer zugängliche Bereiche',
    ],
    tips: [
      'Ziel vorab klar benennen: Verkauf, Werterhalt, Leasingrückgabe oder persönliche Pflege.',
      'Nicht jede Politur ist automatisch sinnvoll. Entscheidend ist der Lackzustand.',
      'Bei Leasingfahrzeugen lohnt sich eine frühe Einschätzung, bevor kurz vor Rückgabe Zeitdruck entsteht.',
      'Eine gute Aufbereitung dokumentiert nicht nur Glanz, sondern auch Materialschonung und saubere Übergabe.',
    ],
    mistakes: [
      'zu aggressive Reiniger auf empfindlichen Kunststoffen oder Leder verwenden',
      'Lackpolitur ohne vorherige Lackreinigung starten',
      'Gerüche nur über Duftstoffe überdecken, statt die Ursache zu behandeln',
      'Leasingrückgabe erst wenige Tage vor dem Termin vorbereiten',
    ],
    faqs: [
      {
        id: 'unterschied',
        question: 'Was ist der Unterschied zwischen Autowäsche und Autoaufbereitung?',
        answer:
          'Eine Autowäsche entfernt vor allem oberflächlichen Schmutz. Autoaufbereitung geht tiefer und umfasst je nach Bedarf Innenraum, Lack, Materialpflege, Politur, Versiegelung und Detailarbeiten.',
      },
      {
        id: 'dauer',
        question: 'Wie lange dauert eine Autoaufbereitung?',
        answer:
          'Das hängt vom Zustand und Umfang ab. Eine einfache Pflege ist deutlich schneller erledigt als eine umfangreiche Innen-, Außen- und Lackaufbereitung.',
      },
      {
        id: 'wert',
        question: 'Steigert Autoaufbereitung den Fahrzeugwert?',
        answer:
          'Sie kann den optischen Eindruck und die Verkaufschancen verbessern. Eine realistische Bewertung hängt aber immer von Fahrzeugzustand, Technik, Laufleistung und Markt ab.',
      },
    ],
    relatedSlugs: ['innenaufbereitung', 'lackaufbereitung', 'leasingrueckgabe-vorbereiten'],
  },
  {
    slug: 'innenaufbereitung',
    path: '/autoaufbereitung-wissen/innenaufbereitung',
    category: 'Innenraum',
    readTime: '7 Min.',
    title: 'Was gehört zu einer professionellen Innenaufbereitung?',
    metaTitle: 'Innenaufbereitung: Ablauf und Kosten | CarCare Wissen',
    metaDescription:
      'Innenaufbereitung verständlich erklärt: Polster, Leder, Cockpit und Gerüche. Ablauf, Kostenfaktoren, Profi-Tipps und die häufigsten Fehler im Überblick.',
    cardTitle: 'Innenaufbereitung',
    cardDescription: 'Polster, Leder, Cockpit, Geruchsentfernung und saubere Innenraumdetails fachlich erklärt.',
    introAnswer:
      'Eine Innenaufbereitung reinigt und pflegt den Fahrzeuginnenraum gründlich. Dazu gehören je nach Zustand Cockpit, Kunststoffe, Polster, Teppiche, Leder, Scheiben, Lüftungsbereiche und Geruchsquellen.',
    definition: [
      'Die Innenaufbereitung ist mehr als Aussaugen und Abwischen. Ziel ist ein hygienischer, gepflegter und materialschonend behandelter Innenraum.',
      'Professionell wird vor allem dort gearbeitet, wo Alltagsschmutz lange sitzt: Sitzflächen, Nähte, Fußräume, Ablagen, Bedienelemente und Übergänge zwischen Materialien.',
    ],
    whenItPays: [
      'bei Flecken, Staub, Tierhaaren oder stark genutzten Familien- und Alltagsfahrzeugen',
      'vor Verkauf oder Rückgabe eines Leasingfahrzeugs',
      'bei unangenehmen Gerüchen im Innenraum',
      'nach längerer Nutzung durch mehrere Fahrer oder im Fuhrpark',
      'wenn Leder, Kunststoffe oder Textilien sichtbar Pflege benötigen',
    ],
    process: [
      'Innenraum prüfen und empfindliche Materialien erkennen',
      'Grobe Verschmutzung entfernen und Innenraum gründlich aussaugen',
      'Kunststoffe, Cockpit und Bedienelemente reinigen',
      'Polster, Teppiche oder Leder materialgerecht behandeln',
      'Scheiben, Details und Geruchsquellen nacharbeiten',
    ],
    costFactors: [
      'Größe und Innenraumaufbau des Fahrzeugs',
      'Flecken, Tierhaare, Sand, Nikotin- oder Geruchsbelastung',
      'Materialien wie Leder, Alcantara, Textil oder empfindliche Oberflächen',
      'gewünschte Tiefe der Reinigung und Pflege',
      'Trocknungszeit bei nassen Reinigungsverfahren',
    ],
    tips: [
      'Private Gegenstände vor dem Termin entfernen, damit alle Bereiche erreichbar sind.',
      'Flecken möglichst früh behandeln lassen, bevor sie tief in Fasern ziehen.',
      'Bei Gerüchen die Ursache benennen: Feuchtigkeit, Tier, Rauch, Lebensmittel oder Klimaanlage.',
      'Leder braucht Reinigung und Pflege. Nur Glanz ist kein Qualitätsmerkmal.',
    ],
    mistakes: [
      'zu viel Feuchtigkeit in Sitze oder Teppiche einbringen',
      'Allzweckreiniger auf empfindlichen Oberflächen einsetzen',
      'Leder nur einfetten, ohne es vorher sauber zu reinigen',
      'Gerüche mit Duftsprays kaschieren',
    ],
    faqs: [
      {
        id: 'leder',
        question: 'Kann Leder bei der Innenaufbereitung gepflegt werden?',
        answer:
          'Ja. Leder sollte materialgerecht gereinigt und gepflegt werden. Entscheidend ist, ob es sich um glattes, perforiertes oder besonders empfindliches Leder handelt.',
      },
      {
        id: 'geruch',
        question: 'Hilft Innenaufbereitung gegen Gerüche?',
        answer:
          'Oft ja, wenn die Ursache behandelt wird. Gerüche durch Feuchtigkeit, Textilien oder Rückstände lassen sich besser bearbeiten als Gerüche, die nur überdeckt werden.',
      },
      {
        id: 'leasing',
        question: 'Ist Innenaufbereitung vor Leasingrückgabe sinnvoll?',
        answer:
          'Ja, besonders bei sichtbaren Gebrauchsspuren, Flecken oder stark genutztem Innenraum. Eine vorherige Einschätzung hilft, den Aufwand realistisch zu planen.',
      },
    ],
    relatedSlugs: ['was-ist-autoaufbereitung', 'leasingrueckgabe-vorbereiten', 'lackaufbereitung'],
  },
  {
    slug: 'lackaufbereitung',
    path: '/autoaufbereitung-wissen/lackaufbereitung',
    category: 'Lackpflege',
    readTime: '8 Min.',
    title: 'Wie funktioniert eine professionelle Lackaufbereitung?',
    metaTitle: 'Lackaufbereitung: Politur und Versiegelung | CarCare',
    metaDescription:
      'Lackaufbereitung fachlich erklärt: Lackreinigung, Hochglanzpolitur und Versiegelung. Wann sie sich lohnt, was sie kostet und welche Fehler teuer werden.',
    cardTitle: 'Lackaufbereitung',
    cardDescription: 'Lackreinigung, Politur, Glanz, Schutz und Grenzen professioneller Lackpflege verständlich erklärt.',
    introAnswer:
      'Lackaufbereitung ist die kontrollierte Reinigung, Korrektur und Pflege von Fahrzeuglack. Sie kann Glanz verbessern, leichte Spuren reduzieren und den Lack durch eine passende Versiegelung schützen.',
    definition: [
      'Eine Lackaufbereitung startet mit sauberer Vorbereitung. Anhaftungen, Waschspuren, leichte Kratzer und matte Stellen werden beurteilt, bevor Politur oder Schutzprodukte eingesetzt werden.',
      'Nicht jeder Kratzer lässt sich auspolieren. Tiefe Beschädigungen, Lackabplatzer oder Schäden bis zur Grundierung gehören in die Lackreparatur oder Lackierung.',
    ],
    whenItPays: [
      'wenn der Lack stumpf wirkt oder viele Waschspuren sichtbar sind',
      'vor Verkauf, Präsentation oder Leasingrückgabe',
      'nach längerer Vernachlässigung der Lackpflege',
      'bei hochwertigen Fahrzeugen, die optisch präzise wirken sollen',
      'wenn eine Versiegelung auf sauber vorbereiteten Lack aufgetragen werden soll',
    ],
    process: [
      'Fahrzeug und Lack gründlich reinigen',
      'Anhaftungen entfernen und Lackzustand prüfen',
      'Polierstrategie passend zu Lack, Defekten und Ziel wählen',
      'Lack kontrolliert polieren und Zwischenkontrollen durchführen',
      'Finish, Versiegelung und Pflegehinweise abstimmen',
    ],
    costFactors: [
      'Lackgröße, Fahrzeugform und Zugänglichkeit',
      'Härte und Zustand des Lacks',
      'Tiefe und Anzahl sichtbarer Spuren',
      'Anzahl der Polierstufen',
      'gewünschter Schutz durch Wachs, Polymer- oder Keramik-nahe Versiegelung',
    ],
    tips: [
      'Eine Politur sollte immer zum Lackzustand passen, nicht zum Wunsch nach maximalem Abtrag.',
      'Gute Vorbereitung ist entscheidend: Schmutzreste auf dem Lack können beim Polieren neue Spuren verursachen.',
      'Versiegelungen funktionieren besser, wenn der Lack vorher sauber und entfettet vorbereitet wurde.',
      'Nach der Aufbereitung hilft schonende Handwäsche, das Ergebnis länger zu erhalten.',
    ],
    mistakes: [
      'Polieren ohne gründliche Vorwäsche und Dekontamination',
      'zu aggressive Polituren auf dünnem oder empfindlichem Lack',
      'Kanten, Sicken und Kunststoffteile nicht schützen',
      'Versiegelung auf ungeeignete oder verschmutzte Oberflächen auftragen',
    ],
    faqs: [
      {
        id: 'kratzer',
        question: 'Kann eine Lackaufbereitung Kratzer entfernen?',
        answer:
          'Leichte Waschspuren und oberflächliche Defekte können oft deutlich reduziert werden. Tiefe Kratzer, die durch den Klarlack gehen, brauchen meist Lackreparatur.',
      },
      {
        id: 'versiegelung',
        question: 'Ist eine Versiegelung nach der Politur sinnvoll?',
        answer:
          'Ja, häufig ist sie sinnvoll. Sie schützt den vorbereiteten Lack und kann Reinigung und Pflege erleichtern. Der passende Schutz hängt vom Fahrzeug und Nutzungsprofil ab.',
      },
      {
        id: 'haeufigkeit',
        question: 'Wie oft sollte Lack aufbereitet werden?',
        answer:
          'Das hängt von Nutzung, Pflege und Stellplatz ab. Wichtig ist, nicht unnötig oft zu polieren, weil jede abrasive Politur Lacksubstanz abträgt.',
      },
    ],
    relatedSlugs: ['was-ist-autoaufbereitung', 'dellen-ohne-lackieren-entfernen', 'leasingrueckgabe-vorbereiten'],
  },
  {
    slug: 'leasingrueckgabe-vorbereiten',
    path: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten',
    category: 'Werterhalt',
    readTime: '7 Min.',
    title: 'Wie bereitet man ein Auto auf die Leasingrückgabe vor?',
    metaTitle: 'Leasingrückgabe vorbereiten | CarCare Center Wissen',
    metaDescription:
      'Leasingrückgabe vorbereiten: typische Gebrauchsspuren erkennen, Aufbereitung und Smart Repair richtig einsetzen, Kosten einschätzen und Nachzahlungen vermeiden.',
    cardTitle: 'Leasingrückgabe vorbereiten',
    cardDescription: 'Checkpunkte für Innenraum, Lack, Felgen, Dellen und eine realistische Vorbereitung vor der Rückgabe.',
    introAnswer:
      'Eine gute Vorbereitung auf die Leasingrückgabe beginnt mit einer ehrlichen Zustandsprüfung. Innenraum, Lack, Felgen, Scheiben und kleine Schäden sollten rechtzeitig bewertet und sinnvoll aufbereitet oder repariert werden.',
    definition: [
      'Leasingrückgabe-Vorbereitung bedeutet nicht, jedes Detail zu überarbeiten. Es geht darum, typische Gebrauchsspuren sichtbar zu machen, vermeidbare Mängel zu reduzieren und den Fahrzeugzustand sauber zu übergeben.',
      'Professionelle Unterstützung hilft dabei, zwischen normaler Nutzung, optischer Pflege und reparaturwürdigen Schäden zu unterscheiden.',
    ],
    whenItPays: [
      'mehrere Wochen vor dem Rückgabetermin',
      'bei sichtbaren Flecken, Kratzern, Dellen oder Felgenschäden',
      'wenn das Fahrzeug intensiv genutzt wurde',
      'bei Fuhrparkfahrzeugen oder mehreren gleichzeitigen Rückgaben',
      'wenn Unsicherheit besteht, welche Spuren relevant sein könnten',
    ],
    process: [
      'Rückgabetermin und Vertragsunterlagen prüfen',
      'Fahrzeug außen und innen gründlich ansehen lassen',
      'Pflege-, Aufbereitungs- und Reparaturbedarf priorisieren',
      'Innenaufbereitung, Lackpflege oder Smart Repair gezielt durchführen',
      'Fahrzeug sauber, vollständig und nachvollziehbar übergeben',
    ],
    costFactors: [
      'Anzahl und Art der Gebrauchsspuren',
      'Innenraumzustand, Gerüche und Flecken',
      'Lackdefekte, Dellen, Felgen- oder Glasschäden',
      'Zeit bis zur Rückgabe',
      'ob mehrere Leistungen gebündelt werden können',
    ],
    tips: [
      'Nicht erst kurz vor der Rückgabe starten. Kleine Schäden brauchen manchmal Abstimmung und Terminzeit.',
      'Zubehör, Schlüssel, Serviceunterlagen und Ladekabel früh zusammentragen.',
      'Vorher reinigen lassen, damit Schäden realistisch sichtbar werden.',
      'Bei Dellen, Felgen und Lack immer prüfen lassen, ob Smart Repair wirtschaftlich sinnvoll ist.',
    ],
    mistakes: [
      'Schäden bei verschmutztem Fahrzeug unterschätzen',
      'spontane Eigenreparaturen mit ungeeigneten Produkten durchführen',
      'Innenraumgerüche zu spät behandeln',
      'fehlendes Zubehör erst am Rückgabetag bemerken',
    ],
    faqs: [
      {
        id: 'zeitpunkt',
        question: 'Wann sollte ich mit der Vorbereitung auf die Leasingrückgabe beginnen?',
        answer:
          'Am besten einige Wochen vorher. Dann bleibt genug Zeit für Einschätzung, Aufbereitung und mögliche Smart-Repair-Arbeiten.',
      },
      {
        id: 'dellen',
        question: 'Sind kleine Dellen vor der Leasingrückgabe relevant?',
        answer:
          'Das kann je nach Vertrag, Schadenbild und Rückgabebewertung relevant sein. Eine fachliche Einschätzung zeigt, ob Dellenentfernung sinnvoll ist.',
      },
      {
        id: 'innenraum',
        question: 'Hilft Innenaufbereitung bei der Rückgabe?',
        answer:
          'Ja, besonders bei Flecken, Gerüchen und stark genutzten Innenräumen. Sie ersetzt keine Reparatur, verbessert aber die Übergabequalität.',
      },
    ],
    relatedSlugs: ['innenaufbereitung', 'lackaufbereitung', 'dellen-ohne-lackieren-entfernen'],
  },
  {
    slug: 'dellen-ohne-lackieren-entfernen',
    path: '/autoaufbereitung-wissen/dellen-ohne-lackieren-entfernen',
    category: 'Smart Repair',
    readTime: '7 Min.',
    title: 'Kann man Dellen ohne Lackieren entfernen?',
    metaTitle: 'Dellen ohne Lackieren entfernen | CarCare Center Wissen',
    metaDescription:
      'Dellen ohne Lackieren entfernen: Wann die lackfreie Methode funktioniert, wo ihre Grenzen liegen, wie der Ablauf aussieht und wovon die Kosten abhängen.',
    cardTitle: 'Dellen ohne Lackieren entfernen',
    cardDescription: 'Wann lackschadenfreie Dellenentfernung funktioniert und wann Lack- oder Karosseriearbeiten nötig sind.',
    introAnswer:
      'Viele kleine Dellen lassen sich ohne Lackieren entfernen, wenn der Lack intakt ist und die Stelle gut erreichbar bleibt. Die Methode ist besonders bei Parkdellen, kleinen Druckstellen und Hagelschäden interessant.',
    definition: [
      'Bei der lackschadenfreien Dellenentfernung wird die Karosserie vorsichtig zurückgeformt, ohne den Lack neu aufzubauen. Das Verfahren gehört in den Smart-Repair-Bereich.',
      'Entscheidend sind Lackzustand, Lage, Tiefe, Blechspannung und Zugänglichkeit. Nicht jede Delle eignet sich für diese Methode.',
    ],
    whenItPays: [
      'bei kleinen Parkdellen ohne Lackabplatzer',
      'bei Hagelschäden mit intakter Lackoberfläche',
      'vor Verkauf oder Leasingrückgabe',
      'wenn Original-Lack erhalten bleiben soll',
      'wenn eine schnelle und substanzschonende Lösung möglich ist',
    ],
    process: [
      'Delle, Lackzustand und Bauteilzugang prüfen',
      'Entscheiden, ob lackschadenfreie Reparatur geeignet ist',
      'Bauteil vorsichtig vorbereiten und Zugang schaffen',
      'Delle kontrolliert drücken oder ziehen',
      'Oberfläche unter Licht kontrollieren und Ergebnis besprechen',
    ],
    costFactors: [
      'Anzahl, Größe und Tiefe der Dellen',
      'Position an Kanten, Sicken oder schwer zugänglichen Bereichen',
      'Lackzustand und vorhandene Vorschäden',
      'Bauteilzugang und Demontageaufwand',
      'ob zusätzlich Lackierung oder Karosseriearbeit nötig wird',
    ],
    tips: [
      'Dellen früh prüfen lassen, bevor Rost, Lackschäden oder weitere Belastung hinzukommen.',
      'Bei Hagelschaden nicht nur einzelne Dellen zählen, sondern das gesamte Schadenbild ansehen.',
      'Fotos helfen für die erste Einschätzung, ersetzen aber nicht immer die Prüfung vor Ort.',
      'Wenn Lack bereits beschädigt ist, muss die Reparaturstrategie anders geplant werden.',
    ],
    mistakes: [
      'mit Saugnäpfen oder Heißkleber ohne Erfahrung am Lack arbeiten',
      'Dellen an Kanten unterschätzen',
      'Lackschäden übersehen und nur die Form betrachten',
      'bei Leasingrückgabe zu spät einen Termin einplanen',
    ],
    faqs: [
      {
        id: 'lack',
        question: 'Wann funktioniert Dellenentfernung ohne Lackieren nicht?',
        answer:
          'Wenn der Lack gerissen, abgeplatzt oder stark vorgeschädigt ist, wenn die Delle zu tief sitzt oder an einer ungünstigen Kante liegt, kann Lackierung oder Karosseriearbeit nötig sein.',
      },
      {
        id: 'hagel',
        question: 'Ist die Methode bei Hagelschaden geeignet?',
        answer:
          'Häufig ja, wenn der Lack intakt ist. Bei vielen Dellen wird das Fahrzeug als Ganzes geprüft, damit Aufwand und Reparaturweg realistisch bleiben.',
      },
      {
        id: 'leasing',
        question: 'Lohnt sich Dellenentfernung vor der Leasingrückgabe?',
        answer:
          'Oft lohnt sich eine Prüfung, besonders bei sichtbaren Parkdellen. Ob es wirtschaftlich sinnvoll ist, hängt vom Schadenbild und Rückgabekontext ab.',
      },
    ],
    relatedSlugs: ['spot-repair', 'farbtongenauigkeit', 'lackaufbereitung'],
  },
  {
    slug: 'spot-repair',
    path: '/autoaufbereitung-wissen/spot-repair',
    category: 'Smart Repair',
    readTime: '6 Min.',
    title: 'Was ist Spot Repair?',
    metaTitle: 'Was ist Spot Repair? Ablauf und Grenzen | CarCare Center',
    metaDescription:
      'Spot Repair erklärt: Was die punktuelle Lackreparatur leistet, wann sie funktioniert, wo ihre Grenzen liegen und wovon die Kosten im Einzelfall abhängen.',
    cardTitle: 'Was ist Spot Repair?',
    cardDescription: 'Punktuelle Lackreparatur statt Komplettlackierung — wann sie funktioniert und wo ihre Grenzen liegen.',
    introAnswer:
      'Spot Repair ist die punktuelle Reparatur eines begrenzten Lackschadens: Statt das ganze Bauteil neu zu lackieren, wird nur die beschädigte Stelle bearbeitet und der Übergang in den vorhandenen Lack ausgeblendet. Das spart Material und Zeit und erhält den umgebenden Originallack.',
    definition: [
      'Spot Repair gehört zum Smart Repair, dem Sammelbegriff für reparaturbegrenzte Verfahren. Bearbeitet wird nur der Schaden selbst und ein kleiner Bereich darum herum, nicht die gesamte Tür oder Stoßstange.',
      'Der Unterschied zur Komplettlackierung liegt in der Fläche, nicht in der Sorgfalt: Auch beim Spot Repair werden Grundierung, Basislack und Klarlack aufgebaut. Entscheidend ist, dass der Übergang zum Altlack unsichtbar ausläuft.',
      'Ob ein Schaden dafür geeignet ist, entscheidet sich an Größe, Lage und Tiefe — nicht am Wunsch. Reicht der Schaden bis aufs blanke Blech oder über eine Kante, ist eine andere Reparaturstrategie richtig.',
    ],
    whenItPays: [
      'bei einzelnen Kratzern, Schrammen oder Steinschlägen auf einer begrenzten Fläche',
      'wenn der Schaden mitten in einem Bauteil liegt und keine Kante oder Sicke berührt',
      'wenn der umgebende Originallack erhalten bleiben soll',
      'vor Verkauf oder Leasingrückgabe, wenn einzelne Stellen den Gesamteindruck stören',
      'wenn eine schnelle Lösung gefragt ist und das Fahrzeug kurzfristig wieder gebraucht wird',
    ],
    process: [
      'Schaden ansehen: Tiefe, Fläche, Lage zu Kanten und Zustand des Altlacks',
      'Farbton anhand des Fahrzeugs bestimmen und ausmischen',
      'Schadstelle anschleifen, reinigen und den Arbeitsbereich abgrenzen',
      'Grundierung, Basislack und Klarlack punktuell aufbauen',
      'Übergang in den Altlack auslaufen lassen und die Fläche polieren',
      'Ergebnis unter Licht kontrollieren, auch aus flachem Blickwinkel',
    ],
    costFactors: [
      'Größe und Tiefe des Schadens — bis in den Klarlack, den Basislack oder aufs Blech',
      'Lage: eine freie Fläche ist günstiger als eine Kante, Sicke oder Bauteilfuge',
      'Farbton: Uni-Lacke sind einfacher als Metallic-, Perleffekt- oder Dreischichtlacke',
      'ob Anbauteile für den Zugang demontiert werden müssen',
      'Zustand des Altlacks — verwittert oder bereits nachlackiert erschwert den Übergang',
    ],
    tips: [
      'Schäden früh zeigen: Ein Steinschlag, der bis aufs Blech geht, kann unterrostet werden und ist dann kein Fall mehr für Spot Repair.',
      'Nicht selbst mit Lackstift vorarbeiten — aufgetragenes Material muss vor der Reparatur wieder entfernt werden.',
      'Mehrere kleine Schäden gemeinsam ansehen lassen. Ab einer gewissen Anzahl auf einem Bauteil ist die Lackierung des ganzen Teils sinnvoller.',
      'Bei Leasingrückgabe früh einplanen: Der Termin entscheidet mit darüber, welche Verfahren überhaupt noch infrage kommen.',
    ],
    mistakes: [
      'Spot Repair bei Schäden erwarten, die über eine Bauteilkante laufen',
      'die Fläche unterschätzen, weil der Kratzer schmal, aber lang ist',
      'Rost übersehen und nur die Oberfläche betrachten',
      'den Farbton nach Gefühl statt nach Messung bestimmen lassen',
    ],
    faqs: [
      {
        id: 'unterschied',
        question: 'Was ist der Unterschied zwischen Spot Repair und Smart Repair?',
        answer:
          'Smart Repair ist der Oberbegriff für alle reparaturbegrenzten Verfahren, etwa lackschadenfreie Dellenentfernung, Kunststoff- oder Polsterreparatur. Spot Repair meint davon speziell die punktuelle Lackreparatur.',
      },
      {
        id: 'grenzen',
        question: 'Wann ist Spot Repair nicht möglich?',
        answer:
          'Wenn der Schaden über eine Kante oder Sicke läuft, sehr großflächig ist, bis aufs blanke Blech reicht und bereits Rost gebildet hat, oder wenn der Altlack so verwittert ist, dass kein unsichtbarer Übergang entsteht. Dann ist die Lackierung des Bauteils der richtige Weg.',
      },
      {
        id: 'sichtbar',
        question: 'Sieht man die reparierte Stelle später?',
        answer:
          'Ziel ist ein Ergebnis, das im Alltag nicht auffällt. Möglich wird das durch einen gemessenen Farbton und einen sauber auslaufenden Übergang. Wie gut das gelingt, hängt vom Farbton und vom Zustand des umgebenden Lacks ab — Effektlacke sind anspruchsvoller als Uni-Lacke.',
      },
    ],
    relatedSlugs: ['farbtongenauigkeit', 'dellen-ohne-lackieren-entfernen', 'lackaufbereitung'],
  },
  {
    slug: 'farbtongenauigkeit',
    path: '/autoaufbereitung-wissen/farbtongenauigkeit',
    category: 'Smart Repair',
    readTime: '6 Min.',
    title: 'Was bedeutet Farbtongenauigkeit beim Lackieren?',
    metaTitle: 'Farbtongenauigkeit beim Lackieren | CarCare Center Wissen',
    metaDescription:
      'Warum der Farbcode allein nicht reicht, wie der passende Lackton ermittelt wird und warum Effektlacke schwieriger sind. Fachlicher Ratgeber.',
    cardTitle: 'Farbtongenauigkeit beim Lackieren',
    cardDescription: 'Warum der Farbcode allein nicht reicht und wie ein unsichtbarer Übergang entsteht.',
    introAnswer:
      'Farbtongenauigkeit heißt, dass eine reparierte Stelle farblich nicht vom übrigen Fahrzeug zu unterscheiden ist. Der Farbcode aus dem Fahrzeugpapier ist dabei nur der Startpunkt: Serienlackierungen streuen ab Werk, und Lack verändert sich über die Jahre. Deshalb wird der tatsächliche Ist-Ton am Fahrzeug ermittelt statt aus der Dose übernommen.',
    definition: [
      'Ein Farbcode benennt die Werksfarbe, nicht den Zustand Ihres Fahrzeugs. Zu einem Code gehören oft mehrere zulässige Farbtonvarianten, weil Lackchargen und Werke leicht voneinander abweichen.',
      'Dazu kommt die Alterung: UV-Licht, Waschanlagen und Witterung verändern den Ton über Jahre — ein Neuwagenton passt dann nicht mehr zu einem acht Jahre alten Fahrzeug.',
      'Bei Effektlacken kommt die Ausrichtung der Pigmente hinzu. Metallic- und Perleffektlacke wirken je nach Blickwinkel unterschiedlich, weil das Licht an den Pigmenten gebrochen wird. Der Farbton hängt hier auch davon ab, wie der Lack aufgetragen wird.',
    ],
    whenItPays: [
      'bei jeder Lackreparatur an sichtbaren Außenteilen',
      'besonders bei Metallic-, Perleffekt- und Dreischichtlacken',
      'bei älteren Fahrzeugen, deren Lack sichtbar nachgedunkelt oder ausgeblichen ist',
      'wenn nur ein Teil eines Bauteils repariert wird und der Übergang unsichtbar bleiben soll',
      'vor Verkauf, Leasingrückgabe oder Gutachterprüfung, wo der optische Gesamteindruck zählt',
    ],
    process: [
      'Farbcode am Fahrzeug ablesen und die zugehörigen Farbtonvarianten heraussuchen',
      'Den tatsächlichen Ist-Ton am gereinigten Lack ermitteln statt ihn anzunehmen',
      'Lack nach Rezeptur ausmischen und auf ein Musterblech spritzen',
      'Muster am Fahrzeug im Tageslicht und aus mehreren Blickwinkeln vergleichen',
      'Bei Bedarf nachjustieren, bis Ton und Effekt übereinstimmen',
      'Angrenzende Flächen beilackieren, damit der Übergang für das Auge verschwindet',
    ],
    costFactors: [
      'Art des Lacks: Uni, Metallic, Perleffekt oder Dreischichtlack mit steigendem Aufwand',
      'Zustand und Alter des vorhandenen Lacks',
      'Anzahl der Musterspritzungen, bis der Ton sitzt',
      'ob angrenzende Bauteile beilackiert werden müssen',
      'Sonderlackierungen und Farbtöne außerhalb der Serienpalette',
    ],
    tips: [
      'Vor der Farbtonbestimmung wird der Lack gereinigt — Schmutzfilm und Verwitterung verfälschen den Eindruck.',
      'Beilackierung ist kein Mehraufwand ohne Zweck: Sie ist bei Effektlacken oft der einzige Weg zu einem unsichtbaren Übergang.',
      'Den Vergleich immer bei Tageslicht und aus mehreren Winkeln ansehen. Unter Hallenlicht kann ein Ton passen, der draußen abweicht.',
      'Wir arbeiten als Glasurit-Lackpartner mit dem Farbtonsystem des Herstellers — die Rezepturen sind auf die jeweilige Serienfarbe und ihre Varianten abgestimmt.',
    ],
    mistakes: [
      'den Farbton allein nach dem Farbcode bestellen',
      'auf verschmutztem oder nassem Lack vergleichen',
      'auf Beilackierung verzichten und dann eine sichtbare Kante in Kauf nehmen',
      'das Ergebnis nur frontal und nur im Innenraum der Halle beurteilen',
    ],
    faqs: [
      {
        id: 'code',
        question: 'Reicht der Farbcode aus dem Fahrzeugschein nicht aus?',
        answer:
          'Nein. Der Code benennt die Werksfarbe, zu der oft mehrere zulässige Varianten gehören, weil Lackchargen leicht voneinander abweichen. Dazu kommt die Alterung des vorhandenen Lacks. Deshalb wird der tatsächliche Ist-Ton am Fahrzeug ermittelt.',
      },
      {
        id: 'metallic',
        question: 'Warum sind Metallic- und Perleffektlacke schwieriger?',
        answer:
          'Weil ihre Wirkung von der Ausrichtung der Effektpigmente abhängt. Sie verändern sich mit dem Blickwinkel und reagieren darauf, wie der Lack aufgetragen wird. Der Farbton ist damit nicht nur eine Frage der Mischung, sondern auch der Verarbeitung.',
      },
      {
        id: 'beilackierung',
        question: 'Was ist Beilackierung?',
        answer:
          'Beim Beilackieren wird der neue Lack in die angrenzende Fläche hinein auslaufen gelassen, statt an der Bauteilkante hart abzusetzen. Das Auge nimmt einen weichen Verlauf nicht wahr, eine harte Kante dagegen schon — auch bei einem sehr gut getroffenen Ton.',
      },
    ],
    relatedSlugs: ['spot-repair', 'lackaufbereitung', 'dellen-ohne-lackieren-entfernen'],
  },
];

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'grundlagen',
    title: 'Grundlagen & Pflege',
    description: 'Was Autoaufbereitung leistet, wie Innenraum und Lack fachgerecht gepflegt werden und wo die Grenzen liegen.',
    articleSlugs: ['was-ist-autoaufbereitung', 'innenaufbereitung', 'lackaufbereitung'],
  },
  {
    id: 'werterhalt',
    title: 'Werterhalt & Leasing',
    description: 'Wissenswertes zu Leasingrückgabe, Verkaufsaufbereitung und sinnvoller Vorbereitung vor Bewertung oder Übergabe.',
    articleSlugs: ['leasingrueckgabe-vorbereiten'],
  },
  {
    id: 'smart-repair',
    title: 'Smart Repair & kleine Schäden',
    description: 'Einordnung kleiner Dellen, Lackspuren und reparaturnaher Themen, die vor Rückgabe oder Verkauf wichtig werden.',
    articleSlugs: ['dellen-ohne-lackieren-entfernen', 'spot-repair', 'farbtongenauigkeit'],
  },
];

export const getKnowledgeArticleByPath = (path: string) => knowledgeArticles.find((article) => article.path === path);

export const getKnowledgeArticleBySlug = (slug: string) => knowledgeArticles.find((article) => article.slug === slug);
