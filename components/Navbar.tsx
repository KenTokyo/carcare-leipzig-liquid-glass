import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Startseite', href: '#home' },
  { label: 'Leistungen', href: '#services' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'Kontakt', href: '#contact' },
];

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // --- Animation Transforms ---
  
  // Width: Start full width (100%), shrink slightly to 96% to give a subtle "detached" feel, 
  // but keep it WIDE enough so content doesn't crash.
  const width = useTransform(scrollY, [0, 100], ['100%', '96%']);
  
  // Top: Stick to top initially, then float down slightly
  const top = useTransform(scrollY, [0, 100], ['0px', '16px']);
  
  // Height: Start tall (Premium), compact later
  const height = useTransform(scrollY, [0, 100], ['6rem', '4.5rem']);
  
  // Radius: Square initially, pill later
  const borderRadius = useTransform(scrollY, [0, 100], ['0px', '16px']);
  
  // Backgrounds: Transparent -> Glassmorphism White
  const backgroundColor = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const backdropFilter = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(16px)']);

  const boxShadow = useTransform(
    scrollY, 
    [0, 100], 
    ['0 0 0 rgba(0,0,0,0)', '0 20px 40px -10px rgba(0,0,0,0.1)']
  );

  // Colors
  const textColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 1)', 'rgba(17, 24, 39, 1)'] // White -> Gray-900
  );

  // Button Styles
  const buttonBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.1)', 'rgba(243, 244, 246, 1)']
  );
  
  const buttonText = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 1)', 'rgba(17, 24, 39, 1)']
  );

  // Gradient for readability on initial hero (Top shadow)
  const backgroundGradient = useTransform(
    scrollY,
    [0, 50],
    [
      'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', 
      'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)'
    ]
  );

  useEffect(() => {
    const checkResize = () => setIsDesktop(window.innerWidth > 1024); // Desktop trigger at 1024px
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  // Handle Smooth Scroll with Offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Offset accounting for the navbar height (approx 80px)
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setIsMobileMenuOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          style={isDesktop ? {
            width,
            top,
            height,
            borderRadius,
            backgroundColor,
            backdropFilter,
            boxShadow,
            backgroundImage: backgroundGradient
          } : {
            width: '100%',
            top: 0,
            height: '5rem',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
          className="pointer-events-auto transition-all duration-300 max-w-[1920px]"
        >
            {/* 
               THE FIX: Grid Layout 
               1fr - auto - 1fr guarantees the center is centered and sides take equal space.
               Px-8 ensures padding without squashing.
            */}
            <div className="h-full w-full px-6 md:px-12 grid grid-cols-[1fr_auto_1fr] items-center">

                {/* Left: Brand */}
                <div className="flex justify-start">
                  <motion.a 
                    href="#home"
                    onClick={(e) => handleNavClick(e, '#home')}
                    className="flex items-center gap-3 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                      <span className="font-bold text-lg">C</span>
                    </div>
                    <motion.span 
                      style={{ color: isDesktop ? textColor : '#111827' }}
                      className="font-bold text-xl tracking-tight uppercase hidden sm:block"
                    >
                      CarCare
                    </motion.span>
                  </motion.a>
                </div>

                {/* Center: Navigation */}
                <div className="flex justify-center">
                   {isDesktop ? (
                      <nav className="flex items-center gap-8 lg:gap-12">
                        {navLinks.map((link) => (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            style={{ color: textColor }}
                            className="text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity relative group whitespace-nowrap cursor-pointer"
                          >
                            {link.label}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
                          </motion.a>
                        ))}
                      </nav>
                   ) : null}
                </div>

                {/* Right: Actions */}
                <div className="flex justify-end items-center gap-4">
                  <motion.a 
                    href="#contact"
                    onClick={(e) => handleNavClick(e, '#contact')}
                    style={isDesktop ? { 
                      backgroundColor: buttonBg, 
                      color: buttonText,
                    } : {}}
                    className={`
                       hidden md:flex
                       items-center gap-3 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest
                       hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap cursor-pointer
                    `}
                  >
                     <Phone size={14} className="group-hover:rotate-12 transition-transform" />
                     <span>0341 - 261 77 90</span>
                  </motion.a>

                  {/* Mobile Menu Trigger */}
                  <button 
                    className="lg:hidden p-2 text-gray-900 bg-white/90 rounded-full shadow-sm"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu size={24} />
                  </button>
                </div>

            </div>
        </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-6 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-sm">C</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">CarCare</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                 <X size={24} />
               </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="text-3xl font-light text-gray-900"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto pb-8">
                <p className="text-gray-400 text-sm mb-2">Kontaktieren Sie uns</p>
                <a href="tel:03412617790" className="text-xl font-bold text-gray-900">0341 - 261 77 90</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;