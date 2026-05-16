import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="py-24 md:py-32 bg-white container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Heading & Visual */}
        <div className="col-span-1 md:col-span-5 relative">
           <div className="absolute -top-10 -left-10 text-[12rem] font-bold text-gray-50 select-none z-0 leading-none">
             01
           </div>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="relative z-10"
           >
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-[1px] w-12 bg-blue-600"></div>
                 <span className="text-sm font-bold uppercase tracking-widest text-blue-600">Über Uns</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                CarCare-Center <br/>
                <span className="text-gray-400">Leipzig.</span>
              </h2>
              
              <p className="text-xl md:text-2xl font-medium text-gray-900 leading-snug">
                Als Full-Service Dienstleister im Bereich der modernen Fahrzeugaufbereitung.
              </p>
           </motion.div>
        </div>

        {/* Right Column: Content */}
        <div className="col-span-1 md:col-span-7 space-y-8 pt-12">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
           >
              <h3 className="text-lg font-light leading-relaxed text-gray-600 mb-8 border-l-4 border-gray-100 pl-6">
                Mit insgesamt über <span className="font-semibold text-gray-900">50 Mitarbeitern an 10 Standorten</span> bieten wir unseren Kunden, wie Autohäusern, Firmenfuhrparks oder anspruchsvollen Privat- und Geschäftskunden das komplette Spektrum zur Aufwertung Ihrer Fahrzeuge.
              </h3>
              
              <div className="prose prose-lg text-gray-600 mb-10">
                <p>
                  Wir verstehen uns als Premium-Anbieter, mit der Fokussierung auf Dienstleistung auf qualitativ höchstem Niveau. Nicht ohne Grund betreuen wir an verschiedenen Standorten vor allem Werksniederlassungen der deutschen Premiumhersteller. Ob Privat- oder Geschäftskunde, Autohaus oder Fuhrpark – wir bieten Lösungen für Ihre Anforderungen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Spezial-Service</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                       Leasingbegleitung, Hagel- und Delleninstandsetzung ohne Lackieren sowie unser zertifizierter Desinfektionsservice.
                    </p>
                 </div>
                 <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Referenzen</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                       Wir betreuen u.a. Werksniederlassungen deutscher Premiumhersteller, große Firmenfuhrparks und anspruchsvolle Privatkunden.
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;