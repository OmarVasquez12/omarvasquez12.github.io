import React from 'react';
import { Crown, ShoppingCart } from 'lucide-react';
import { TopBuyer } from '../types';

interface TopBuyersViewProps {
  topBuyers: TopBuyer[];
}

export const TopBuyersView: React.FC<TopBuyersViewProps> = ({ topBuyers }) => {
  const visibleBuyers = topBuyers.filter(b => !b.hideInRanking);

  return (
    <section className="py-16 bg-[#0a0505] border-t border-b border-[#2d2d2d] font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Top <span className="text-[#ef4444]">Compradores</span>
          </h2>
          <p className="text-sm font-medium text-[#a0a0a0] mt-3">
            Nuestros clientes más activos y fieles de la comunidad XF CODE
          </p>
        </div>

        {/* Podium Layout */}
        {visibleBuyers.length >= 3 && (
          <div className="flex flex-wrap items-end justify-center gap-6 mb-12 min-h-[320px]">
            
            {/* Rank #2 Silver */}
            <div className="bg-[#121212] border border-[#c0c0c0]/50 rounded-2xl p-6 text-center w-full max-w-[220px] relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(192,192,192,0.2)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#c0c0c0] text-black font-black text-base flex items-center justify-center shadow-md">
                #2
              </div>
              <div className="w-20 h-20 rounded-full border-3 border-[#c0c0c0] mx-auto mb-4 overflow-hidden p-0.5 bg-[#0d0d0d] mt-2">
                <img src={visibleBuyers[1].avatar} alt={visibleBuyers[1].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-extrabold text-white text-base truncate mb-1">{visibleBuyers[1].username}</h3>
              <div className="text-xs font-bold text-[#a0a0a0] flex items-center justify-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>{visibleBuyers[1].totalPurchases} compras</span>
              </div>
            </div>

            {/* Rank #1 Gold */}
            <div className="bg-[#121212] border-2 border-[#ffd700] rounded-2xl p-8 text-center w-full max-w-[240px] relative shadow-[0_0_35px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-3">
              <Crown className="w-8 h-8 text-[#ffd700] absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#ffd700] text-black font-black text-lg flex items-center justify-center shadow-lg">
                #1
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[#ffd700] mx-auto mb-4 overflow-hidden p-1 bg-[#0d0d0d] mt-2">
                <img src={visibleBuyers[0].avatar} alt={visibleBuyers[0].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-black text-white text-lg truncate mb-1">{visibleBuyers[0].username}</h3>
              <div className="text-xs font-black text-[#ffd700] flex items-center justify-center gap-1">
                <ShoppingCart className="w-4 h-4 text-[#ef4444]" />
                <span>{visibleBuyers[0].totalPurchases} compras</span>
              </div>
            </div>

            {/* Rank #3 Bronze */}
            <div className="bg-[#121212] border border-[#cd7f32]/50 rounded-2xl p-6 text-center w-full max-w-[220px] relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(205,127,50,0.2)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#cd7f32] text-black font-black text-base flex items-center justify-center shadow-md">
                #3
              </div>
              <div className="w-20 h-20 rounded-full border-3 border-[#cd7f32] mx-auto mb-4 overflow-hidden p-0.5 bg-[#0d0d0d] mt-2">
                <img src={visibleBuyers[2].avatar} alt={visibleBuyers[2].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-extrabold text-white text-base truncate mb-1">{visibleBuyers[2].username}</h3>
              <div className="text-xs font-bold text-[#a0a0a0] flex items-center justify-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>{visibleBuyers[2].totalPurchases} compras</span>
              </div>
            </div>

          </div>
        )}

        {/* Additional Ranks (#4, #5...) */}
        {visibleBuyers.length > 3 && (
          <div className="max-w-3xl mx-auto space-y-3">
            {visibleBuyers.slice(3).map((buyer, idx) => (
              <div key={buyer.userId} className="bg-[#121212] border border-[#2d2d2d] rounded-xl p-4 flex items-center justify-between hover:border-[#ef4444]/50 transition-all">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-[#a0a0a0] text-sm w-8">#{idx + 4}</span>
                  <img src={buyer.avatar} alt={buyer.username} className="w-10 h-10 rounded-full object-cover border border-[#2d2d2d]" />
                  <span className="font-extrabold text-white text-sm">{buyer.username}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#ef4444]">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{buyer.totalPurchases} compras</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
