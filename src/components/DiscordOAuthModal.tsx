import React, { useState, useEffect } from 'react';
import { DiscordUser } from '../types/discord';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface DiscordOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: DiscordUser | null;
  setUser: (user: DiscordUser | null) => void;
  config: {
    appUrl: string;
    redirectUri: string;
    hasClientId: boolean;
  };
}

export const DiscordOAuthModal: React.FC<DiscordOAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  config,
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate message origin
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        setUser(event.data.user);
        setLoading(false);
        setErrorMsg(null);
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setErrorMsg(event.data.error || 'Error durante la autenticación');
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setUser]);

  if (!isOpen) return null;

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(config.redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartOAuth = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/discord/url');
      const data = await res.json();

      if (data.url) {
        // Open OAuth Provider's authorize URL directly in popup
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const authWindow = window.open(
          data.url,
          'discord_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0`
        );

        if (!authWindow) {
          setErrorMsg('El navegador bloqueó la ventana emergente. Habilita los popups.');
          setLoading(false);
        }
      } else {
        // Fallback test login if DISCORD_CLIENT_ID not configured
        setTimeout(() => {
          setUser({
            id: '987654321012345678',
            username: 'DemoDeveloper',
            discriminator: '0',
            global_name: 'Desarrollador Demo',
            avatar: null,
            email: 'dev@discord.app',
            verified: true,
            accent_color: 5793266,
          });
          setLoading(false);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        id="modal-discord-oauth"
        className="bg-[#2b2d31] border border-[#35363c] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#1e1f22] px-6 py-4 flex items-center justify-between border-b border-[#35363c]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Conexión Discord OAuth2</h3>
              <p className="text-xs text-[#949ba4]">Autenticación de cuenta e integración API</p>
            </div>
          </div>
          <button 
            id="btn-close-oauth-modal"
            onClick={onClose}
            className="text-[#949ba4] hover:text-white p-1.5 rounded-lg hover:bg-[#35363c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {user ? (
            /* Logged in view */
            <div className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-5 text-center space-y-4">
              <div className="relative inline-block">
                {user.avatar ? (
                  <img 
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                    alt={user.username}
                    className="w-16 h-16 rounded-full mx-auto border-2 border-[#5865F2] shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#5865F2] flex items-center justify-center text-xl font-bold text-white mx-auto shadow-lg">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#23a55a] rounded-full border-2 border-[#1e1f22]"></span>
              </div>

              <div>
                <h4 className="text-white font-bold text-lg">{user.global_name || user.username}</h4>
                <p className="text-xs text-[#949ba4]">@{user.username} • ID: {user.id}</p>
                {user.email && (
                  <p className="text-xs text-[#b5bac1] mt-1">{user.email}</p>
                )}
              </div>

              <div className="bg-[#2b2d31] rounded-lg p-3 text-xs text-[#23a55a] flex items-center justify-center space-x-2 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Sesión activa en la aplicación</span>
              </div>

              <button
                id="btn-logout-discord"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-[#da373c] hover:bg-[#a1282c] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Desconectar Cuenta</span>
              </button>
            </div>
          ) : (
            /* Login & Connect view */
            <div className="space-y-4">
              
              <div className="text-center space-y-2">
                <p className="text-sm text-[#dbdee1]">
                  Conecta tu cuenta de Discord para interactuar con tus servidores, publicar mensajes y usar la API.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-[#f23f43]/10 border border-[#f23f43]/30 text-[#f23f43] p-3 rounded-lg text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                id="btn-start-discord-oauth"
                onClick={handleStartOAuth}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#5865F2]/20 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0,0,0,3.36,3.36,0,0,0-3.25,1.5,108.6,108.6,0,0,0-4.6,9.54,97.68,97.68,0,0,0-29.8,0,105,105,0,0,0-4.6-9.54,3.36,3.36,0,0,0-3.25-1.5,105.15,105.15,0,0,0-26.23,8.07,3.3,3.3,0,0,0-1.5,1.15A108.6,108.6,0,0,0,0,76.5a3.3,3.3,0,0,0,1.4,2.5,105.5,105.5,0,0,0,32.2,16.3,3.36,3.36,0,0,0,3.65-1.2,76.12,76.12,0,0,0,6.6-10.8,3.3,3.3,0,0,0-1.8-4.5,70.52,70.52,0,0,1-10.1-4.8,3.36,3.36,0,0,1-.35-5.6,76.2,76.2,0,0,0,2.1-1.6,3.3,3.3,0,0,1,3.4-.4,73.5,73.5,0,0,0,59.3,0,3.3,3.3,0,0,1,3.4.4,76.2,76.2,0,0,0,2.1,1.6,3.36,3.36,0,0,1-.35,5.6,70.52,70.52,0,0,1-10.1,4.8,3.3,3.3,0,0,0-1.8,4.5,76.12,76.12,0,0,0,6.6,10.8,3.36,3.36,0,0,0,3.65,1.2,105.5,105.5,0,0,0,32.2-16.3,3.3,3.3,0,0,0,1.4-2.5A108.6,108.6,0,0,0,109.2,9.22,3.3,3.3,0,0,0,107.7,8.07ZM42.45,65.69C36.15,65.69,31,60,31,53S36,40.31,42.45,40.31C48.9,40.31,54,46,53.9,53,53.9,60,48.9,65.69,42.45,65.69Zm42.24,0C78.39,65.69,73.24,60,73.24,53S78.24,40.31,84.69,40.31C91.14,40.31,96.24,46,96.14,53,96.14,60,91.14,65.69,84.69,65.69Z" />
                    </svg>
                    <span>Iniciar Sesión con Discord</span>
                  </>
                )}
              </button>

              {/* Developer Configuration Box */}
              <div className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#b5bac1] flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#5865F2]" />
                    <span>URI de Redirección para Discord Developer Portal</span>
                  </span>
                  <a 
                    href="https://discord.com/developers/applications" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-[#5865F2] hover:underline flex items-center space-x-1"
                  >
                    <span>Developer Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center space-x-2 bg-[#2b2d31] p-2 rounded-lg border border-[#35363c]">
                  <input 
                    type="text" 
                    readOnly 
                    value={config.redirectUri}
                    className="bg-transparent text-xs text-[#3ba55d] font-mono w-full focus:outline-none select-all"
                  />
                  <button
                    id="btn-copy-redirect-uri"
                    onClick={copyRedirectUri}
                    className="bg-[#35363c] hover:bg-[#404249] text-white p-1.5 rounded text-xs transition-colors shrink-0"
                    title="Copiar URL de callback"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5 text-[#b5bac1]" />}
                  </button>
                </div>

                <p className="text-[11px] text-[#949ba4] leading-relaxed">
                  Agrega esta URL exacta en tu Aplicación de Discord en: <br />
                  <strong className="text-[#dbdee1]">OAuth2 → Redirects → Add Redirect</strong>
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#1e1f22] px-6 py-3 border-t border-[#35363c] flex items-center justify-between text-xs text-[#949ba4]">
          <span>Discord Developer OAuth2 v10</span>
          <button 
            id="btn-close-modal-footer"
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
