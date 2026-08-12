import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  userPurchasedIds: string[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  userPurchasedIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceType, setPriceType] = useState<'ALL' | 'PREMIUM' | 'FREE'>('ALL');
  const [sortBy, setSortBy] = useState<'BEST_SELLING' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH'>('BEST_SELLING');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'TODOS') {
        if (selectedCategory === 'Free Resources' && !p.isFree) return false;
        if (selectedCategory !== 'Free Resources' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesCode = (p.productIdCode || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCode) return false;
      }

      // Price type filter
      if (priceType === 'FREE' && !p.isFree) return false;
      if (priceType === 'PREMIUM' && p.isFree) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'BEST_SELLING') return b.salesCount - a.salesCount;
      if (sortBy === 'RATING') return b.rating - a.rating;
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, priceType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-['Poppins',sans-serif]">
      
      {/* Search & Sort Controls Header */}
      <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, script o código (ej: XF-HUD-01)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs font-bold focus:outline-none focus:border-[#ef4444] transition-colors placeholder:text-gray-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Price Type Selector */}
          <div className="flex items-center bg-[#0d0d0d] p-1 rounded-xl border border-[#2d2d2d] text-xs font-extrabold">
            <button
              onClick={() => setPriceType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${priceType === 'ALL' ? 'bg-[#ef4444] text-white font-black' : 'text-gray-400 hover:text-white'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setPriceType('PREMIUM')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${priceType === 'PREMIUM' ? 'bg-[#ef4444] text-white font-black' : 'text-gray-400 hover:text-white'}`}
            >
              Premium
            </button>
            <button
              onClick={() => setPriceType('FREE')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${priceType === 'FREE' ? 'bg-[#ef4444] text-white font-black' : 'text-gray-400 hover:text-white'}`}
            >
              Gratis
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center bg-[#0d0d0d] px-3 py-2 rounded-xl border border-[#2d2d2d] text-xs font-extrabold text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#ef4444] mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-2 font-bold"
            >
              <option value="BEST_SELLING" className="bg-[#121212]">Más Vendidos</option>
              <option value="RATING" className="bg-[#121212]">Mejor Valorados</option>
              <option value="PRICE_LOW" className="bg-[#121212]">Precio: Menor a Mayor</option>
              <option value="PRICE_HIGH" className="bg-[#121212]">Precio: Mayor a Menor</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <span>Catálogo XF CODE</span>
          <span className="text-xs font-mono font-black bg-[#121212] text-[#ef4444] px-2.5 py-1 rounded-md border border-[#ef4444]/30">
            {filteredProducts.length} disponibles
          </span>
        </h2>

        {selectedCategory !== 'TODOS' && (
          <button
            onClick={() => onSelectCategory('TODOS')}
            className="text-xs text-[#ef4444] hover:underline font-black cursor-pointer"
          >
            Mostrar todos los productos
          </button>
        )}
      </div>

      {/* Grid List */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              isOwned={userPurchasedIds.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#121212] p-12 rounded-2xl text-center border border-[#2d2d2d] my-8">
          <Filter className="w-12 h-12 text-[#ef4444] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-black text-white">No se encontraron productos</h3>
          <p className="text-sm font-medium text-gray-400 mt-1 max-w-md mx-auto">
            Intenta cambiar los términos de búsqueda o filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('TODOS');
              setPriceType('ALL');
            }}
            className="mt-4 px-4 py-2 bg-[#ef4444] text-white text-xs font-black rounded-xl hover:bg-[#dc2626] transition-colors cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

    </div>
  );
};
