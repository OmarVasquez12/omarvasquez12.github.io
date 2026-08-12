import React from 'react';
import { Users, Box, ShoppingBag, ShoppingCart, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onExploreFree: () => void;
  onOpenMtaApiDocs: () => void;
  totalProductsCount: number;
  totalClientsCount: number;
  totalSalesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onExploreFree,
  totalProductsCount,
  totalClientsCount,
  totalSalesCount
}) => {
  return (
    <section className="relative overflow-hidden bg-[#0a0505] pt-28 pb-16 border-b border-[#2d2d2d] font-['Poppins',sans-serif]">
      
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-15 filter brightness-75 pointer-events-none" 
        style={{ backgroundImage: `url('/logo.png')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0505]/90 via-[#0a0505]/95 to-[#0a0505] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs font-black uppercase mb-4 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping" />
              <span>Tienda Oficial MTA:SA</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-4">
              XF <span className="text-[#ef4444]">CODE</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Bienvenido a <strong className="text-white font-black">XF CODE</strong>. Tu fuente de Models y Scripts premium para MTA. Lleva tu servidor al siguiente nivel con contenido único, funcional y de alta calidad.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <button
                onClick={onExplore}
                className="px-8 py-3.5 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-sm transition-all shadow-[0_4px_25px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_35px_rgba(239,68,68,0.6)] hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver Recursos</span>
              </button>

              <a
                href="https://discord.gg/Y6UteCZ2Mp"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-xl border border-[#2d2d2d] bg-[#121212] hover:bg-[#171717] hover:border-[#ef4444] text-white font-black text-sm transition-all flex items-center space-x-2 cursor-pointer hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Únete a Discord</span>
              </a>

              <button
                onClick={onExploreFree}
                className="px-6 py-3.5 rounded-xl border border-[#2d2d2d] bg-[#121212] hover:bg-[#171717] hover:border-[#ef4444] text-gray-300 hover:text-[#ef4444] font-black text-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Recursos Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Logo Floating Section */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ef4444]/25 blur-3xl rounded-full pointer-events-none animate-pulse" />
              <img 
                src="/logo.png" 
                alt="XF CODE Logo" 
                className="w-full max-w-[360px] h-auto object-contain relative z-10 drop-shadow-[0_10px_35px_rgba(239,68,68,0.5)] transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>

        </div>

        {/* Real Dynamic Stats Grid Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-[#2d2d2d]">
          
          <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2d2d] hover:border-[#ef4444]/50 text-center flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-1">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-4xl font-black text-white tracking-tight font-mono">{totalClientsCount}</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Clientes</p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2d2d] hover:border-[#ef4444]/50 text-center flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-1">
              <Box className="w-7 h-7" />
            </div>
            <p className="text-4xl font-black text-white tracking-tight font-mono">{totalProductsCount}</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Productos</p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2d2d] hover:border-[#ef4444]/50 text-center flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-1">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <p className="text-4xl font-black text-white tracking-tight font-mono">{totalSalesCount}</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Ventas</p>
          </div>

        </div>

      </div>
    </section>
  );
};
