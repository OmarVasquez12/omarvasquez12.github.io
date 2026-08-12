import React from 'react';
import { Grid, Sparkles } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORIES_WITH_ICONS: { name: string; value: string; icon: any }[] = [
  { name: 'TODOS LOS RESOURCES', value: 'TODOS', icon: Grid }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full py-3 border-b border-[#2d2d2d] bg-[#0a0505]/95 sticky top-20 z-30 backdrop-blur-md font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSelectCategory('TODOS')}
            className="px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 bg-[#ef4444] text-white shadow-[0_2px_15px_rgba(239,68,68,0.4)] cursor-pointer"
          >
            <Grid className="w-4 h-4 text-white" />
            <span>TODOS LOS RESOURCES</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-black text-gray-400">
          <Sparkles className="w-4 h-4 text-[#ef4444]" />
          <span>Catálogo Unificado XF CODE — Licencias Instantáneas por PayPal</span>
        </div>
      </div>
    </div>
  );
};
