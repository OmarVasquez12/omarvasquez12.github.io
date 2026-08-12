import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      username: 'demonnyc64',
      avatar: 'https://cdn.discordapp.com/avatars/1458895574282666119/bbb2cf1141c601a639789b851967212f_size%3D128.png',
      comment: 'el loco aquí atento a todo el mejor',
      rating: 5
    },
    {
      username: 'psychovx12',
      avatar: 'https://cdn.discordapp.com/avatars/1451327489128268079/271a16ae57ad458de3ccbda66a1a69a1_size%3D128.png',
      comment: 'responden muy rapido',
      rating: 5
    },
    {
      username: 'soypitico05',
      avatar: 'https://cdn.discordapp.com/avatars/1298839069866070037/9cf8043505120d78dd3ecc2da65e71dd_size%3D128.png',
      comment: 'atiende de una vez y si ay un problema te lo resuelven de una vezzzzz',
      rating: 5
    },
    {
      username: 'mayonesa1212',
      avatar: 'https://cdn.discordapp.com/avatars/1294705349554602030/ac5ee00d9870eb0a3f32faca486172db_size%3D128.png',
      comment: 'muy buenos productor y responden rapido los recomiendo pueden comprar con confianza',
      rating: 5
    },
    {
      username: 'by_demon0785',
      avatar: 'https://cdn.discordapp.com/avatars/1458895574282666119/e287410a5df6736098f290b177c4d6f4_size%3D128.png',
      comment: 'Buena atencion y muy rapido me ayudo y me atendio en todo lo que necesite',
      rating: 5
    },
    {
      username: 'adrisg3',
      avatar: 'https://cdn.discordapp.com/avatars/1336804728415322132/1a3283064043f846e591054318745783_size%3D128.png',
      comment: 'Responde rápido el pana compren a confianza!',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-[#0a0505] font-['Poppins',sans-serif] border-t border-[#2d2d2d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Lo que dicen nuestros <span className="text-[#ef4444]">clientes</span>
          </h2>
          <p className="text-sm font-medium text-[#a0a0a0] mt-3">
            Conoce las experiencias de quienes ya confían en XF CODE
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#121212] border border-[#2d2d2d] hover:border-[#ef4444] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#ef4444] overflow-hidden shrink-0 bg-[#0d0d0d]">
                  <img 
                    src={item.avatar} 
                    alt={item.username} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.username}&background=ef4444&color=fff`;
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">{item.username}</h4>
                  <span className="text-[10px] font-black tracking-wider text-[#ef4444] uppercase">Cliente Verificado</span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm font-medium text-[#a0a0a0] leading-relaxed italic">
                "{item.comment}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
