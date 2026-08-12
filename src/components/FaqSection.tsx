import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answerHtml: React.ReactNode;
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: '¿Cómo puedo comprar un producto?',
      answerHtml: (
        <div className="space-y-2 text-sm text-[#a0a0a0] font-medium leading-relaxed">
          <p>Para comprar cualquier producto en XF CODE, simplemente:</p>
          <p>1. <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">Inicia sesión</span> con tu cuenta</p>
          <p>2. Navega por nuestro catálogo y selecciona el recurso o script que deseas</p>
          <p>3. Haz clic en "Comprar" y procesa tu pago mediante PayPal</p>
          <p>4. Una vez completado el pago, recibirás acceso inmediato a las descargas y tu clave de licencia</p>
        </div>
      )
    },
    {
      id: 'faq-2',
      question: '¿Qué métodos de pago aceptan?',
      answerHtml: (
        <div className="space-y-2 text-sm text-[#a0a0a0] font-medium leading-relaxed">
          <p>Aceptamos exclusivamente los siguientes métodos seguros:</p>
          <p>• <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">PayPal</span> - Pago oficial instantáneo con protección al comprador</p>
          <p>• <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">Recursos Gratuitos</span> - Descarga sin costo directamente</p>
        </div>
      )
    },
    {
      id: 'faq-3',
      question: '¿Ofrecen productos personalizados?',
      answerHtml: (
        <div className="space-y-2 text-sm text-[#a0a0a0] font-medium leading-relaxed">
          <p>¡Sí! Ofrecemos servicios completos de desarrollo y modelado a medida:</p>
          <p>• <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">Scripts personalizados</span> - Desarrollamos según tus requerimientos específicos</p>
          <p>• <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">Modificaciones</span> - Adaptamos sistemas existentes a tu gusto</p>
          <p>• <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">Modelos únicos</span> - Creación de mapas 3D y assets exclusivos para tu servidor</p>
          <p className="mt-2">Contacta a nuestro equipo en <a href="https://discord.gg/HJFz63bS3t" target="_blank" rel="noreferrer" className="text-[#ef4444] underline font-bold">Discord</a> para cotizar.</p>
        </div>
      )
    },
    {
      id: 'faq-4',
      question: '¿Cómo funciona la protección de licencias por IP/Puerto?',
      answerHtml: (
        <div className="space-y-2 text-sm text-[#a0a0a0] font-medium leading-relaxed">
          <p>Nuestros scripts cuentan con vinculación automática de servidor:</p>
          <p>• Ingresa la <span className="bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded font-extrabold">IP y Puerto de tu VPS</span> en el Panel de Cliente.</p>
          <p>• El servidor de MTA validará la licencia en tiempo real a través de nuestra API cifrada.</p>
          <p>• Puedes transferir tu licencia de IP con un cooldown seguro de autoservicio.</p>
        </div>
      )
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#0a0505] font-['Poppins',sans-serif] border-t border-[#2d2d2d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Preguntas <span className="text-[#ef4444]">Frecuentes</span>
          </h2>
          <p className="text-sm font-medium text-[#a0a0a0] mt-3">
            Resolvemos las dudas más comunes sobre nuestros productos y servicios
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-[#0d0d0d] border border-[#2d2d2d] hover:border-[#ef4444]/50 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#ef4444]/5 transition-colors"
                >
                  <h4 className="text-base sm:text-lg font-bold text-white pr-2">
                    {faq.question}
                  </h4>
                  <ChevronDown className={`w-5 h-5 text-[#ef4444] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#2d2d2d] bg-[#121212]/50 animate-in fade-in duration-200">
                    {faq.answerHtml}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
