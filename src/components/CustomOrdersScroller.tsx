import React from 'react';
import { CustomOrderItem } from '../types';
import { Sparkles, MessageSquare } from 'lucide-react';

interface CustomOrdersScrollerProps {
  customOrders?: CustomOrderItem[];
}

export const CustomOrdersScroller: React.FC<CustomOrdersScrollerProps> = ({ customOrders = [] }) => {
  // If customOrders is empty, provide a clean default item list
  const displayItems = customOrders.length > 0 ? customOrders : [
    {
      id: 'c1',
      title: 'Sistema de Facciones & Bandas Lua',
      description: 'Sistemas custom en Lua a medida con interfaz DxDraw y guardado MySQL.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      category: 'Lua Scripting',
      deliveryTime: '3-5 Días'
    },
    {
      id: 'c2',
      title: 'HUD & UI Redesign Completo',
      description: 'Diseño vectorial e implementación en MTA a 60 FPS.',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      category: 'UI / UX',
      deliveryTime: '2-4 Días'
    },
    {
      id: 'c3',
      title: 'Optimización Server & AntiLag Fix',
      description: 'Auditoría de memoria Lua y optimización de rendimiento.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      category: 'Server Opt',
      deliveryTime: '1-2 Días'
    }
  ];

  // Duplicated list for seamless infinite loop
  const infiniteItems = [...displayItems, ...displayItems];

  return (
    <section id="pedidos-personalizados" className="py-20 bg-[#0a0505] font-['Poppins',sans-serif] border-t border-b border-[#2d2d2d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-black text-[#ef4444] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#ef4444]" />
            <span>Desarrollo a Medida</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pedidos <span className="text-[#ef4444]">Personalizados</span>
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-3 leading-relaxed">
            Explora los trabajos a medida realizados para servidores MTA SA. Administra estas publicaciones directamente desde el Panel de Administración.
          </p>
        </div>

        {/* Display Grid / Scroller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#121212] rounded-2xl border border-[#2d2d2d] overflow-hidden hover:border-[#ef4444] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#0a0505]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#ef4444] border border-[#ef4444]/30 uppercase">
                    {item.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-black text-white group-hover:text-[#ef4444] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs font-bold text-gray-400 border-t border-white/5 pt-3">
                <span>Entrega aprox: <strong className="text-white">{item.deliveryTime}</strong></span>
                <a 
                  href="https://discord.gg/HJFz63bS3t"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ef4444] hover:underline font-black flex items-center space-x-1"
                >
                  <span>Pedir similar</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a 
            href="https://discord.gg/HJFz63bS3t" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-sm shadow-[0_4px_25px_rgba(239,68,68,0.35)] hover:shadow-[0_8px_35px_rgba(239,68,68,0.55)] transition-all hover:-translate-y-1 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Ordenar Pedido Personalizado en Discord</span>
          </a>
        </div>

      </div>
    </section>
  );
};
