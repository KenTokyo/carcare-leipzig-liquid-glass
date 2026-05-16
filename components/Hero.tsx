import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-black">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2500&auto=format&fit=crop" 
            alt="Premium Car Detailing" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          {/* Dark Mode Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center pt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
             <div className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm">Seit 2010</div>
             <span className="text-gray-300 text-xs font-semibold tracking-widest uppercase border-l border-gray-500 pl-3">Premium Fahrzeugaufbereitung</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
            PREMIUM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">CARE.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed font-light mb-12 drop-shadow-md">
            Wir verstehen uns als Premium-Anbieter mit der Fokussierung auf Dienstleistung auf qualitativ höchstem Niveau. Ihr Partner für Werksniederlassungen und anspruchsvolle Privatkunden.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
             <a href="#services" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               Leistungen entdecken
             </a>
             <a href="#contact" className="bg-transparent text-white border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors">
               Termin vereinbaren
             </a>
          </motion.div>
        </motion.div>

        {/* Floating "Current Offer" Card - positioned neatly */}
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-12 right-6 md:bottom-24 md:right-12 lg:right-24 max-w-xs md:max-w-sm hidden md:block"
        >
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl cursor-pointer hover:bg-white/20 transition-all group">
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/20">
                      <Star size={20} fill="currentColor" />
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Aktuell</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">Fahrzeugdesinfektion</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                   Sorgen Sie für hygienische Reinheit in Ihrem Innenraum. Mehr Sicherheit mit Ozon oder Verneblung.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  Details ansehen <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Scroll</span>
        <ArrowDown className="text-gray-600 animate-bounce w-4 h-4" />
      </motion.div>
    </div>
  );
};

export default Hero;