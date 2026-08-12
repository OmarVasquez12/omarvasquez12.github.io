import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: 'CARD' | 'PAYPAL' | 'DISCORD_PAY' | 'FREE') => Promise<void>;
  paypalEmail?: string;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  paypalEmail = 'pagos@xfcode.com'
}) => {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleProcessOrder = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    try {
      for (const item of cartItems) {
        await onCheckout(item.isFree ? 'FREE' : 'PAYPAL');
      }
      onClearCart();
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      alert('Error procesando el pago con PayPal.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-['Poppins',sans-serif]">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-[#2d2d2d] bg-[#121212] shadow-2xl my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0d0d0d] text-gray-400 hover:text-white border border-[#2d2d2d] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#2d2d2d]">
          <div className="p-3 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Carrito & Checkout XF CODE</h2>
            <p className="text-xs font-medium text-gray-400">Procesa tu pago vía PayPal seguro y recibe tu código de descarga / licencia al instante.</p>
          </div>
        </div>

        {checkoutSuccess ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-[#ef4444] mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-white">¡Pago por PayPal Completado!</h3>
            <p className="text-xs font-medium text-gray-300 max-w-sm mx-auto">
              Tus recursos y License Keys han sido activados en tu <strong className="text-[#ef4444]">Panel de Cliente</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-[#0d0d0d] border border-[#2d2d2d] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-mono text-[#ef4444] font-black">{item.productIdCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-black text-white">
                        {item.isFree ? 'GRATIS' : `$${item.price.toFixed(2)}`}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-medium text-gray-500 text-center py-8">Tu carrito está vacío.</p>
              )}
            </div>

            {/* Payment Method Badge */}
            {cartItems.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                <div className="p-4 rounded-2xl bg-[#003087]/20 border border-[#0070BA]/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 bg-[#FFC439] rounded-lg text-[#003087] font-black italic text-base">
                      PayPal
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Pago Directo a PayPal</h4>
                      <p className="text-[10px] font-mono text-[#38bdf8]">
                        Receptor: <strong>{paypalEmail}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-black text-[#0070BA] bg-[#0070BA]/20 px-2 py-0.5 rounded">
                    CONECTADO
                  </span>
                </div>

                {/* Total & Checkout Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Total a Pagar:</p>
                    <p className="text-2xl font-black text-white font-mono">${totalAmount.toFixed(2)} USD</p>
                  </div>

                  <button
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#FFC439] hover:bg-[#ffbb22] text-[#003087] font-black text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span>{isProcessing ? 'Procesando Pago...' : 'Pagar con PayPal'}</span>
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 font-medium text-center flex items-center justify-center space-x-1 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>Cifrado SSL de 256 bits. Entrega automatizada de la licencia e instrucciones de instalación.</span>
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
