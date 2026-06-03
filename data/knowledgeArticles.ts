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
    metaTitle: 'Was ist Autoaufbereitung? Definition, Ablauf und Tipps | CarCare Wissen',
    metaDescription:
      'Was Autoaufbereitung bedeutet, wann sie sich lohnt, wie der Ablauf aussieht und welche Fehler Sie vermeiden sollten. Fachlicher Ratgeber von CarCare.',
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
    metaTitle: 'Innenaufbereitung: Ablauf, Kostenfaktoren und Tipps | CarCare Wissen',
    metaDescription:
      'Innenaufbereitung verständlich erklärt: Polster, Leder, Cockpit, Gerüche, Ablauf, Kostenfaktoren und typische Fehler.',
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
    metaTitle: 'Lackaufbereitung: Politur, Versiegelung und Ablauf | CarCare Wissen',
    metaDescription:
      'Lackaufbereitung fachlich erklärt: Lackreinigung, Politur, Versiegelung, Kostenfaktoren, Profi-Tipps und häufige Fehler.',
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
    metaTitle: 'Leasingrückgabe vorbereiten: Checkliste und Tipps | CarCare Wissen',
    metaDescription:
      'Leasingrückgabe vorbereiten: typische Gebrauchsspuren, Aufbereitung, Smart Repair, Kostenfaktoren und professionelle Tipps.',
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
    metaTitle: 'Dellen ohne Lackieren entfernen: Möglichkeiten und Grenzen | CarCare Wissen',
    metaDescription:
      'Dellen ohne Lackieren entfernen: Wann Smart Repair funktioniert, welche Grenzen es gibt, Ablauf, Kostenfaktoren und Profi-Tipps.',
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
    relatedSlugs: ['leasingrueckgabe-vorbereiten', 'lackaufbereitung', 'was-ist-autoaufbereitung'],
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
    articleSlugs: ['dellen-ohne-lackieren-entfernen'],
  },
];

export const getKnowledgeArticleByPath = (path: string) => knowledgeArticles.find((article) => article.path === path);

export const getKnowledgeArticleBySlug = (slug: string) => knowledgeArticles.find((article) => article.slug === slug);
