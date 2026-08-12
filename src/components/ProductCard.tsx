import React from 'react';
import { Star, ShoppingBag, Eye, Download, Shield } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isOwned?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isOwned
}) => {

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'BEST SELLER':
        return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/40';
      case 'NUEVO':
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
      case 'FREE':
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
      default:
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
    }
  };

  return (
    <div className="bg-[#121212] border border-[#2d2d2d] hover:border-[#ef4444] rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 font-['Poppins',sans-serif]">
      
      {/* Image Preview Container */}
      <div className="relative h-48 w-full overflow-hidden bg-[#0d0d0d]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider backdrop-blur-md ${getBadgeColor(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#ef4444] text-white shadow-md">
              -{product.discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Product ID Code Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-mono font-black bg-[#0d0d0d]/90 text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/40 backdrop-blur-md">
            {product.productIdCode}
          </span>
        </div>

        {/* Owned Ribbon if purchased */}
        {isOwned && (
          <div className="absolute bottom-3 left-3 z-10 bg-[#ef4444] text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>ADQUIRIDO</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Version */}
          <div className="flex items-center justify-between text-xs text-[#ef4444] font-black mb-1.5">
            <span className="uppercase tracking-wider">{product.category || 'XF RESOURCE'}</span>
            <span className="text-gray-400 font-mono text-[11px]">v{product.version}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="text-base font-black text-white group-hover:text-[#ef4444] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-400 font-medium mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Rating & Sales Stats */}
        <div className="mt-4 pt-3 border-t border-[#2d2d2d] flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
            <span className="text-xs font-black text-white">{product.rating}</span>
            <span className="text-[11px] text-gray-400 font-medium">({product.reviewCount})</span>
          </div>

          <div className="text-[11px] text-gray-400 font-bold font-mono">
            {product.salesCount} ventas
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            {product.isFree ? (
              <span className="text-lg font-black text-[#ef4444] uppercase">
                GRATIS
              </span>
            ) : (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-white font-mono">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-[#6b7280] line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelect(product)}
              className="p-2.5 rounded-xl bg-[#171717] text-gray-300 hover:text-white hover:bg-[#262626] border border-[#2d2d2d] transition-colors cursor-pointer"
              title="Ver Detalles del Resource"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAddToCart(product)}
              className="px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-md active:scale-95"
            >
              {product.isFree ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Obtener</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
