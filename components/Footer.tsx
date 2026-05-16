import React from 'react';
import { MapPin, Phone, Mail, Clock, Printer } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
                  <span className="font-bold text-sm">C</span>
               </div>
               <span className="font-bold text-xl tracking-tight text-gray-900">CarCare</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              BS CarCare GmbH<br/>
              Ihr Premium-Partner für Fahrzeugaufbereitung und -pflege in Leipzig.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900">Kontaktinformationen</h4>
            <div className="space-y-4 text-sm text-gray-600">
               <div className="flex items-start gap-3">
                 <MapPin size={18} className="mt-1 shrink-0 text-gray-400" />
                 <p>An den Tierkliniken 42<br/>04103 Leipzig</p>
               </div>
               <div className="flex items-center gap-3">
                 <Phone size={18} className="text-gray-400" />
                 <p>0341 - 261 77 90</p>
               </div>
               <div className="flex items-center gap-3">
                 <Printer size={18} className="text-gray-400" />
                 <p>0341 - 962 74 87</p>
               </div>
               <div className="flex items-center gap-3">
                 <Mail size={18} className="text-gray-400" />
                 <a href="mailto:info@carcare-center.de" className="hover:text-gray-900 underline decoration-gray-300 underline-offset-4">info@carcare-center.de</a>
               </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900">Öffnungszeiten</h4>
            <div className="space-y-2 text-sm text-gray-600">
               <div className="flex items-start gap-3">
                 <Clock size={18} className="mt-1 shrink-0 text-gray-400" />
                 <div>
                    <p><span className="font-semibold text-gray-900">Mo - Fr:</span> 07.00 - 18.00 Uhr</p>
                    <p><span className="font-semibold text-gray-900">Sa:</span> nach Vereinbarung</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900">Bereiche</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#home" className="hover:text-gray-900 transition-colors">Startseite</a></li>
              <li><a href="#services" className="hover:text-gray-900 transition-colors">CarCare-Center & Preise</a></li>
              <li><a href="#jobs" className="hover:text-gray-900 transition-colors">Jobangebote</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Datenschutz</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom */}
        <div className="border-t border-gray-100 pt-8">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} BS CarCare GmbH.
              </p>
              <div className="max-w-2xl text-[10px] text-gray-400 leading-relaxed space-y-2">
                <p><span className="font-semibold">Verantwortliche Stelle:</span> BS CarCare GmbH, An den Tierkliniken 42, 04103 Leipzig.</p>
                <p><span className="font-semibold">Datenschutz:</span> Die Seite nutzt Cookies zur Nutzerfreundlichkeit. Tracking von Nutzungsdaten wird gemäß DSGVO vorerst nicht durchgeführt. Matomo wird als Webanalysedienst verwendet (anonymisierte IP-Adressen). Betroffenenrechte umfassen Widerruf, Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Zuständige Aufsichtsbehörde: Der Sächsische Datenschutzbeauftragte, Dresden.</p>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;