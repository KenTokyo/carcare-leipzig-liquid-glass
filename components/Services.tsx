import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Droplets, 
  PaintBucket, 
  Wrench, 
  CircleDot, 
  Hammer, 
  CloudHail, 
  Glasses, 
  ShieldAlert, 
  FileText, 
  Briefcase,
  ArrowUpRight,
  ChevronDown,
  X
} from 'lucide-react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  // Pflegepakete
  { 
    id: 'p1', 
    title: 'Brillant Außenpflege', 
    description: 'Intensive Vorreinigung, Lackreinigung, Hochglanzpolitur und Lackversiegelung.', 
    longDescription: 'Intensive Vorreinigung, Felgenreinigung, Insektenentfernung, schonende Oberwäsche inkl. Abledern, Scheibenreinigung, Lackreinigung, Hochglanzpolitur und Lackversiegelung.',
    category: 'Pflege', 
    iconName: 'Sparkles',
    price: '169,00 €',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p2', 
    title: 'Intensiv Innenreinigung', 
    description: 'Intensive Reinigung des gesamten Innenraumes, Polstershampoonierung.', 
    longDescription: 'Oberwäsche inkl. Abledern, intensive Reinigung des gesamten Innenraumes, Polstershampoonierung alternativ Lederpflege, Scheibenreinigung innen und außen.',
    category: 'Pflege', 
    iconName: 'Sparkles',
    price: '199,00 €',
    image: 'https://images.unsplash.com/photo-1552934526-1c99002fad9e?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p3', 
    title: 'Premiumpflege', 
    description: 'Kombination aus Brillant Außen- und Intensiv Innenpflege.', 
    longDescription: 'Brillant und Intensivpflege, Motorreinigung inkl. Versiegelung. Fahrzeuge die extreme Verschmutzungen aufweisen (z.B. Tierhaare), bedürfen einer gesonderten Absprache.',
    category: 'Pflege', 
    iconName: 'Sparkles',
    price: '299,00 €',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p4', 
    title: 'Premiumpflege „exklusiv“', 
    description: 'Liebevolle Handarbeit mit Carnaubawachsen von SWIZÖL.', 
    longDescription: 'Bei Premiumpflege „exklusiv“ widmen wir uns in liebevoller Handarbeit und mit ausgesuchten Produktlinien Ihrem Fahrzeug. Zum Einsatz kommen u.a. Wachse der Firma SWIZÖL mit Carnaubaanteilen von 30 bis 60%. Je höher dieser Anteil an einer Rezeptur ist, umso höher ist auch der Glanzgrad Ihres Lackes.',
    category: 'Pflege', 
    iconName: 'Sparkles',
    price: 'ab 348,00 €',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'
  },
  
  // Desinfektion
  { 
    id: 'd1', 
    title: 'Ozonbehandlung', 
    description: 'Zerstört zuverlässig Bakterien, Viren und Gerüche in allen Ritzen.', 
    longDescription: 'Ozon ist das zweitstärkste Desinfektionsmittel der Welt. Ozon als Gas hat den großen Vorteil, dass es sich überall, auch in unzugänglichen Bereichen gleichmäßig verteilen kann. Es zerstört zuverlässig die Zellwände der Mikroorganismen. Ca. 30 min Einwirkzeit und danach etwa 30 min sorgfältiges Ablüften.',
    category: 'Spezial', 
    iconName: 'Droplets',
    price: '45,00 €',
    image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd2', 
    title: 'Heißvernebelung', 
    description: 'KC – Refresher. Biologischer Wirkstoff gegen Keime und Schimmel.', 
    longDescription: 'Der KC-Refresher bekämpft Schadstoffe wie Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Die Wirksamkeit einer Desinfektion gegenüber Bakterien und Schimmel wurde durch das international renommierte Institut für Biochemie der Universität Mannheim bestätigt.',
    category: 'Spezial', 
    iconName: 'Droplets',
    price: '59,00 €',
    image: 'https://images.unsplash.com/photo-1585670149963-b6d60d37537e?auto=format&fit=crop&q=80&w=800'
  },

  // Reparatur
  { 
    id: 'r1', 
    title: 'Lackreparatur', 
    description: 'Smart-Repair Verfahren für kleine bis mittlere Beschädigungen.', 
    longDescription: 'Lackschadenbearbeitung im Spot-Repair-Verfahren, hier werden kleine bis mittlere Beschädigungen der Oberfläche punktuell instandgesetzt. Zu einer fachgerechten Lackierung gehört natürlich, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind.',
    category: 'Reparatur', 
    iconName: 'PaintBucket',
    price: 'ab 90,00 €',
    image: 'https://images.unsplash.com/photo-1623963731557-0a67e2213d8c?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'r2', 
    title: 'Felgenreparatur', 
    description: 'TÜV-zertifiziertes Verfahren. Wir sind Wheel-Doctor Fachbetrieb.', 
    longDescription: 'Bearbeitung von leichten Farb- und Oberflächenschäden. Wir können mit unserem TÜV-zertifizierten Alufelgenreparaturverfahren bis zu 90% der Bordstein- und Korrosionschäden kostengünstig beheben. Es dürfen jedoch Beschädigungen bis zu 1 mm Tiefe im Grundmetall der Felge behoben werden.',
    category: 'Reparatur', 
    iconName: 'CircleDot',
    price: 'ab 95,00 €',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'r3', 
    title: 'Dellenentfernung', 
    description: 'Lackierfreie Instandsetzung. Keine Wertminderung, Originallack bleibt.', 
    longDescription: 'Bearbeitung von Schadstellen durch eine Karosserieinstandsetzung ohne Lackieren. Durch eigens entwickelte Druck- bzw. Ziehtechniken wird das Fahrzeugteil soweit bearbeitet, bis der Originalzustand wieder hergestellt ist. Vorteile: Kostenersparnis, keine Wertminderung, keine Farbunterschiede.',
    category: 'Reparatur', 
    iconName: 'Hammer',
    price: 'ab 75,00 €',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'r4', 
    title: 'Lederreparatur', 
    description: 'Oberflächen- und Farbreparatur von beschädigtem Lederinterieur.', 
    category: 'Reparatur', 
    iconName: 'Wrench',
    price: 'ab 95,00 €',
    image: 'https://images.unsplash.com/photo-1549607871-2b02a90e3861?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'r5', 
    title: 'Autoglas', 
    description: 'WINTEC-Partner. Steinschlagreparatur und Scheibentausch.', 
    longDescription: 'Ob Scheibentausch oder Steinschlagreparatur, ob Scheibenfolierung oder Schutzfolien für Ihren Lack - bei unserem WINTEC – Autoglas Partner sind Sie in den besten Händen. Wir geben als WINTEC-Partner 30 Jahre Garantie auf die Autoglas-Reparatur und die Dichtigkeit von ausgetauschten Scheiben.',
    category: 'Reparatur', 
    iconName: 'Glasses',
    image: 'https://images.unsplash.com/photo-1527383214149-c90033107802?auto=format&fit=crop&q=80&w=800'
  },
  
  // Weitere
  { 
    id: 's1', 
    title: 'Leasingbegleitung', 
    description: 'Vorbereitung zur Leasingrückgabe. Spart hohe Nachzahlungen.', 
    longDescription: 'Der Termin der Fahrzeugrückgabe kommt näher. Durch eine vorherige Begutachtung und im Schadenfall fachgerechte Instandsetzung kann Ihnen wertvolle Zeit und letztlich auch ein unnötiger finanzieller Mehraufwand erspart bleiben. Angefahrene Felgen oder verschrammte Stoßfänger können zu erheblichen Kosten führen.',
    category: 'Spezial', 
    iconName: 'FileText',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
];

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  PaintBucket: <PaintBucket className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  CircleDot: <CircleDot className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  CloudHail: <CloudHail className="w-5 h-5" />,
  Glasses: <Glasses className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
};

const Services: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Pflege' | 'Reparatur' | 'Spezial'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredServices = filter === 'All' 
    ? services 
    : services.filter(s => s.category === filter);

  return (
    <div className="bg-gray-50/50 py-24 md:py-32 px-6 min-h-screen">
      <div className="container mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 md:mb-20 gap-12">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-2xl"
           >
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">Preisliste & Angebot</h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                 Leistungen.
                 <br />
                 <span className="text-gray-400 font-light">Transparenz & Qualität.</span>
              </h3>
              <p className="mt-6 text-gray-600 text-lg font-light leading-relaxed max-w-xl">
                Alle Preise inkl. der gesetzlichen Mehrwertsteuer.
              </p>
           </motion.div>

           {/* Filter Tabs */}
           <motion.div 
             className="flex flex-wrap gap-2 md:gap-4 p-1 bg-gray-200/50 rounded-full"
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
              {['All', 'Pflege', 'Reparatur', 'Spezial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat as any); setExpandedId(null); }}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                    filter === cat 
                      ? 'bg-white text-gray-900 shadow-md' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {cat === 'All' ? 'Alle Leistungen' : cat}
                </button>
              ))}
           </motion.div>
        </div>

        {/* Grid */}
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
           <AnimatePresence mode="popLayout">
             {filteredServices.map((service) => (
               <motion.div
                 key={service.id}
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.4 }}
                 className={`group bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 border border-gray-100 flex flex-col ${expandedId === service.id ? 'row-span-2' : ''}`}
               >
                  {/* Image Area */}
                  <div className={`overflow-hidden relative bg-gray-100 transition-all duration-500 ${expandedId === service.id ? 'h-48' : 'h-56'}`}>
                     {service.image && (
                         <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         />
                     )}
                     <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                        <div className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm">
                            {iconMap[service.iconName]}
                        </div>
                        {service.price && (
                           <span className="bg-gray-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                             {service.price}
                           </span>
                        )}
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow relative">
                     <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{service.category}</span>
                        <h4 className="text-2xl font-bold text-gray-900 mt-1 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h4>
                        
                        <AnimatePresence mode="wait">
                          {expandedId === service.id ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-gray-600 text-sm leading-relaxed"
                            >
                                <p className="mb-4 font-medium text-gray-800">{service.description}</p>
                                <p className="mb-4">{service.longDescription || service.description}</p>
                            </motion.div>
                          ) : (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-700 font-medium text-sm leading-relaxed mb-2"
                            >
                                {service.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                     </div>
                     
                     <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
                        <button 
                            onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                            className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 focus:outline-none"
                        >
                            {expandedId === service.id ? 'Weniger anzeigen' : 'Mehr erfahren'}
                        </button>
                        <button 
                           onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                           className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 ${expandedId === service.id ? 'bg-gray-900 text-white rotate-180' : 'group-hover:bg-gray-900 group-hover:text-white'}`}
                        >
                           <ChevronDown size={16} />
                        </button>
                     </div>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;