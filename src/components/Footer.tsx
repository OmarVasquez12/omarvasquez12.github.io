import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenMtaApiDocs: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMtaApiDocs,
  setActiveTab
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0505] border-t border-[#2d2d2d] py-12 text-[#a0a0a0] font-['Poppins',sans-serif] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-[#2d2d2d]">
          
          {/* Section 1: About XF CODE */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="XF CODE Logo" className="w-8 h-8 object-contain" />
              <h6 className="text-lg font-black text-white">XF <span className="text-[#ef4444]">CODE</span></h6>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-xl text-[#a0a0a0]">
              Bienvenido a XF CODE, MTA Modeling & Scripting Store. Sumérgete en un universo de creatividad, innovación y rendimiento. Tienda oficial para modelos y scripts excepcionales de GTA MTA:SA.
            </p>
          </div>

          {/* Section 2: Support Links */}
          <div className="md:text-right space-y-2">
            <h6 className="text-lg font-black text-white mb-3">Soporte</h6>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <button 
                  onClick={onOpenMtaApiDocs}
                  className="hover:text-[#ef4444] transition-colors cursor-pointer"
                >
                  API de Licencias
                </button>
              </li>
              <li>
                <a 
                  href="https://discord.gg/Y6UteCZ2Mp" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#ef4444] transition-colors"
                >
                  Feedback & Soporte Discord
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="hover:text-[#ef4444] transition-colors cursor-pointer"
                >
                  Términos y Condiciones
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 text-center text-xs font-bold text-[#6b7280]">
          <p>© 2026 XF CODE. Todos los derechos reservados.</p>
        </div>

      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#121212] border border-[#2d2d2d] text-white hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] shadow-2xl flex items-center justify-center transition-all cursor-pointer transform hover:scale-110"
          title="Subir al inicio"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </footer>
  );
};
