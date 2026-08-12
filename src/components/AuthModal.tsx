import React, { useState } from 'react';
import { User as UserIcon, X, Lock, Mail, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (emailOrUsername: string, pass: string) => Promise<void>;
  onRegister: (username: string, email: string, pass: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email || username, password);
      } else {
        await onRegister(username, email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error autenticando cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordOAuth = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await onLogin('Discord_User', 'pass123');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-['Poppins',sans-serif]">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#2d2d2d] bg-[#121212] shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0d0d0d] text-gray-400 hover:text-white border border-[#2d2d2d] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <img src="https://i.imgur.com/BEMAQNVgqjdQ.png" alt="Logo" className="h-12 w-auto mx-auto mb-3 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
          <h2 className="text-xl font-black text-white">
            Iniciar Sesión
          </h2>
          <p className="text-xs font-medium text-gray-400 mt-1">Accede a tus recursos, licencias e historial de compras MTA con tu cuenta de Discord.</p>
        </div>

        {/* Discord OAuth Direct Button */}
        <button
          type="button"
          onClick={handleDiscordOAuth}
          disabled={loading}
          className="w-full py-3.5 mb-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>{loading ? 'Iniciando sesión...' : 'Continuar con Discord'}</span>
        </button>

        {errorMsg && (
          <p className="text-xs text-red-400 font-extrabold text-center my-2">{errorMsg}</p>
        )}

        <p className="text-[11px] text-gray-500 font-medium text-center mt-4">
          Al iniciar sesión aceptas los Términos de Servicio y la Política de Privacidad.
        </p>

      </div>
    </div>
  );
};
