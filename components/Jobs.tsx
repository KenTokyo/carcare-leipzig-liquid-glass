/**
 * ⚠️ BEWUSST GEPARKT — KEIN TOTER CODE, NICHT LÖSCHEN.
 *
 * Diese Jobkarten-Sektion ist aktuell absichtlich nirgends eingebunden: Sie wurde nur vorübergehend
 * von der Startseite entfernt (zu viel Information für die Mainpage). Sie kommt zu einem späteren
 * Zeitpunkt auf die Subseite `/karriere` (CareerPage). Ein automatischer „unused component"-Sweep
 * würde sie fälschlich als verwaist melden — sie bleibt jedoch bewusst erhalten.
 *
 * Hinweis für die spätere Einbindung: Der Sticky-Infobereich (`sticky top-32`, siehe unten) funktioniert
 * seit dem Shell-Fix `overflow: clip` in components/Layout.tsx wieder korrekt.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Briefcase, Paintbrush, Cog } from 'lucide-react';

const jobs = [
  { 
      id: 1, 
      title: 'Kfz-Aufbereiter (m/w/d)', 
      type: 'Vollzeit', 
      area: 'Aufbereitung', 
      icon: <Briefcase />,
      description: 'Aufwertung und Reparatur von Fahrzeugen für anspruchsvolle Privat- und Geschäftskunden.'
  },
  { 
      id: 2, 
      title: 'Fahrzeuglackierer (m/w/d)', 
      type: 'Vollzeit', 
      area: 'Lackierung', 
      icon: <Paintbrush />,
      description: 'Lackierarbeiten, Schadenssteuerung und Smart Repair auf höchstem Niveau.'
  },
  { 
      id: 3, 
      title: 'Karosserie-Mechaniker (m/w/d)', 
      type: 'Vollzeit', 
      area: 'Werkstatt', 
      icon: <Cog />,
      description: 'Fahrzeugbau und Instandsetzung in einem modernen Arbeitsumfeld.'
  },
  { 
      id: 4, 
      title: 'Serviceberater (m/w/d)', 
      type: 'Vollzeit', 
      area: 'Kundenbetreuung', 
      icon: <User />,
      description: 'Erster Ansprechpartner für unsere Kunden und Koordination der Aufträge.'
  },
];

const Jobs: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50 px-6 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Info */}
        <div className="lg:col-span-5 space-y-8 sticky top-32">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4">Karriere bei CarCare</p>
             <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-8 text-gray-900">
               Werde Teil <br/> des Teams.
             </h2>
             <p className="text-gray-600 text-lg leading-relaxed max-w-md mb-8">
               Als Full-Service-Dienstleister mit über 50 Mitarbeitern an 10 Standorten bieten wir unseren Kunden das komplette Spektrum zur Aufwertung.
             </p>
             <a href="#contact" className="inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
                Initiativ bewerben <ArrowRight size={16} />
             </a>
           </motion.div>
        </div>

        {/* Right List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           {jobs.map((job, index) => (
             <motion.div
               key={job.id}
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
             >
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex items-start gap-6 flex-1">
                      <div className="p-4 bg-gray-50 rounded-xl text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 shrink-0">
                         {React.cloneElement(job.icon as React.ReactElement<any>, { size: 24 })}
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                         <p className="text-sm text-gray-500 mb-4 leading-relaxed">{job.description}</p>
                         <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
                            <span className="bg-gray-50 px-3 py-1 rounded-md">{job.area}</span>
                            <span className="bg-gray-50 px-3 py-1 rounded-md">Leipzig</span>
                            <span className="bg-gray-50 px-3 py-1 rounded-md">{job.type}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-end md:justify-center md:pl-6 md:border-l border-gray-100">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                         <ArrowRight size={16} />
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default Jobs;