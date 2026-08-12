import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Check, 
  Download, 
  Clock, 
  Code2, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import { User, Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isOwned?: boolean;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string) => void;
  user?: User | null;
  onOpenAuth?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isOwned,
  reviews,
  onAddReview,
  user,
  onOpenAuth
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'changelog' | 'reviews'>('info');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(product.image);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(product.id, newRating, newComment);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md font-['Poppins',sans-serif]">
      <div className="relative w-full max-w-4xl bg-[#121212] rounded-3xl border border-[#2d2d2d] overflow-hidden shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0d0d0d]/80 text-gray-400 hover:text-white border border-[#2d2d2d] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Media Gallery Header */}
        <div className="relative h-64 sm:h-80 w-full bg-[#0d0d0d] overflow-hidden">
          <img 
            src={selectedScreenshot || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-black px-3 py-1 rounded-lg border border-[#ef4444]/50 backdrop-blur-md">
              {product.productIdCode}
            </span>
            {product.badge && (
              <span className="bg-[#ef4444] text-white text-xs font-black px-3 py-1 rounded-lg shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Screenshots Thumbnails Strip */}
          {product.screenshots.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-2 overflow-x-auto p-2 bg-[#0d0d0d]/80 backdrop-blur-md rounded-2xl border border-[#2d2d2d]">
              {product.screenshots.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Screenshot ${idx}`}
                  onClick={() => setSelectedScreenshot(imgUrl)}
                  className={`w-16 h-10 object-cover rounded-xl cursor-pointer transition-all border-2 ${
                    selectedScreenshot === imgUrl ? 'border-[#ef4444] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2d2d2d]">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-[#ef4444] uppercase tracking-wider mb-1">
                <span>{product.category || 'XF CODE'}</span>
                <span>•</span>
                <span>MTA 1.5.9 / 1.6</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{product.name}</h1>
              <p className="text-sm font-medium text-gray-400 mt-1">{product.shortDescription}</p>
            </div>

            {/* Price & Buy Action */}
            <div className="flex flex-col items-start md:items-end">
              <div className="mb-2">
                {product.isFree ? (
                  <span className="text-2xl font-black text-[#ef4444] font-mono">GRATIS</span>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white font-mono">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#6b7280] line-through font-mono">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                )}
              </div>

              {(isOwned || product.isFree) && product.downloadUrl ? (
                <a
                  href={product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer bg-[#ef4444] hover:bg-[#dc2626] text-white active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo Directo</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer bg-[#ef4444] hover:bg-[#dc2626] text-white active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar con PayPal</span>
                </button>
              )}
            </div>
          </div>

          {/* License Inclusions Banner */}
          <div className="my-6 p-4 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center space-x-3 text-xs text-[#ef4444]">
            <ShieldCheck className="w-6 h-6 text-[#ef4444] shrink-0" />
            <div>
              <p className="font-black text-white">Resource verificado y optimizado por XF CODE.</p>
              <p className="text-gray-400 font-medium">Incluye botón de descarga directa y soporte técnico por ticket.</p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-[#2d2d2d] mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 px-4 font-black text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'info' ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Descripción & Requisitos
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`pb-3 px-4 font-black text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'changelog' ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Changelog (v{product.version})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-4 font-black text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reviews' ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab 1: Info */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">Detalles del Resource</h3>
                <p className="text-sm font-medium text-gray-300 leading-relaxed whitespace-pre-line bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
                  {product.fullDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
                  <h4 className="text-xs font-black text-[#ef4444] uppercase mb-2 flex items-center space-x-1.5">
                    <FileCode className="w-4 h-4" />
                    <span>Requisitos de Instalación</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs font-medium text-gray-300">
                    {product.requirements.map((req, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
                  <h4 className="text-xs font-black text-[#ef4444] uppercase mb-2 flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>Compatibilidad & Rendimiento</span>
                  </h4>
                  <div className="space-y-1 text-xs font-medium text-gray-300">
                    <p><strong className="text-white">MTA Build:</strong> {product.mtaCompatibility}</p>
                    <p><strong className="text-white">Optimización:</strong> ~0.01ms (DxDraw / Lua Pooled)</p>
                    <p><strong className="text-white">Última Actualización:</strong> {product.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Changelog */}
          {activeTab === 'changelog' && (
            <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-[#2d2d2d] space-y-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#ef4444]" />
                <span>Historial de Actualizaciones (Version {product.version})</span>
              </h3>
              <ul className="space-y-2 text-xs font-medium text-gray-300">
                {product.changelog.map((log, index) => (
                  <li key={index} className="p-3 rounded-xl bg-[#121212] border border-[#2d2d2d]">
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {user ? (
                <form onSubmit={handleSubmitReview} className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
                  <div className="flex items-center space-x-2 mb-2">
                    <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full object-cover border border-[#ef4444]" />
                    <span className="text-xs font-bold text-white">Publicando como <strong className="text-[#ef4444]">{user.username}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`w-5 h-5 cursor-pointer transition-colors ${
                          star <= newRating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu reseña o experiencia usando este resource en tu servidor..."
                    className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-medium focus:outline-none focus:border-[#ef4444]"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-[#ef4444] text-white text-xs font-black rounded-xl hover:bg-[#dc2626] transition-colors cursor-pointer"
                  >
                    Publicar Review
                  </button>
                  {reviewSubmitted && (
                    <span className="ml-3 text-xs text-[#ef4444] font-black">¡Gracias! Tu reseña ha sido guardada.</span>
                  )}
                </form>
              ) : (
                <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-[#2d2d2d] text-center">
                  <h4 className="text-xs font-black text-white uppercase mb-1">Reseñas de la Comunidad</h4>
                  <p className="text-xs font-medium text-gray-400 mb-4">Solo los usuarios reales autenticados con Discord pueden dejar reseñas.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-xs shadow-lg transition-all inline-flex items-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Iniciar Sesión con Discord</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#0d0d0d] border border-[#2d2d2d]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img src={rev.userAvatar} alt={rev.username} className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-xs font-extrabold text-white">{rev.username}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/30 font-black">
                              COMPRADOR VERIFICADO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-300">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">Aún no hay reseñas para este resource. ¡Sé el primero!</p>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
