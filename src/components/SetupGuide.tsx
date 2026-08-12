import React, { useState } from 'react';
import { 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  KeyRound, 
  ShieldCheck, 
  Bot, 
  Terminal, 
  CheckCircle2, 
  Zap,
  Globe
} from 'lucide-react';

interface SetupGuideProps {
  config: {
    appUrl: string;
    redirectUri: string;
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasDefaultWebhook: boolean;
  };
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ config }) => {
  const [copiedRedirect, setCopiedRedirect] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Bot Permission Bitwise Calculator state
  const [permissions, setPermissions] = useState({
    ADMINISTRATOR: false,
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    EMBED_LINKS: true,
    ATTACH_FILES: true,
    READ_MESSAGE_HISTORY: true,
    MANAGE_WEBHOOKS: true,
    USE_EXTERNAL_EMOJIS: true,
  });

  const permissionBits: Record<string, number> = {
    ADMINISTRATOR: 0x8,
    VIEW_CHANNEL: 0x400,
    SEND_MESSAGES: 0x800,
    EMBED_LINKS: 0x4000,
    ATTACH_FILES: 0x8000,
    READ_MESSAGE_HISTORY: 0x10000,
    MANAGE_WEBHOOKS: 0x20000000,
    USE_EXTERNAL_EMOJIS: 0x40000,
  };

  const calculateBitwise = () => {
    let bits = 0;
    Object.entries(permissions).forEach(([key, active]) => {
      if (active && permissionBits[key]) {
        bits |= permissionBits[key];
      }
    });
    return bits;
  };

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(config.redirectUri);
    setCopiedRedirect(true);
    setTimeout(() => setCopiedRedirect(false), 2000);
  };

  const copyEnvSample = () => {
    const envText = `DISCORD_CLIENT_ID="TU_CLIENT_ID"
DISCORD_CLIENT_SECRET="TU_CLIENT_SECRET"
DISCORD_WEBHOOK_URL="TU_WEBHOOK_URL"`;
    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-[#2b2d31] pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Guía de Configuración con Discord Developer Portal</h1>
            <p className="text-sm text-[#949ba4]">
              Pasos detallados para enlazar tu aplicación web con Discord API, OAuth2 y Webhooks.
            </p>
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#23a55a]" />
          <span>Estado de Configuración de la Aplicación</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#1e1f22] p-3.5 rounded-xl border border-[#35363c] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Client ID</p>
              <p className="text-[10px] text-[#949ba4]">DISCORD_CLIENT_ID</p>
            </div>
            {config.hasClientId ? (
              <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-bold px-2 py-0.5 rounded">Configurado</span>
            ) : (
              <span className="text-xs bg-[#f0b232]/20 text-[#f0b232] font-bold px-2 py-0.5 rounded">Pendiente</span>
            )}
          </div>

          <div className="bg-[#1e1f22] p-3.5 rounded-xl border border-[#35363c] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Client Secret</p>
              <p className="text-[10px] text-[#949ba4]">DISCORD_CLIENT_SECRET</p>
            </div>
            {config.hasClientSecret ? (
              <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-bold px-2 py-0.5 rounded">Configurado</span>
            ) : (
              <span className="text-xs bg-[#f0b232]/20 text-[#f0b232] font-bold px-2 py-0.5 rounded">Pendiente</span>
            )}
          </div>

          <div className="bg-[#1e1f22] p-3.5 rounded-xl border border-[#35363c] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Webhook por Defecto</p>
              <p className="text-[10px] text-[#949ba4]">DISCORD_WEBHOOK_URL</p>
            </div>
            {config.hasDefaultWebhook ? (
              <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-bold px-2 py-0.5 rounded">Configurado</span>
            ) : (
              <span className="text-xs bg-[#80848e]/20 text-[#80848e] font-bold px-2 py-0.5 rounded">Opcional</span>
            )}
          </div>

          <div className="bg-[#1e1f22] p-3.5 rounded-xl border border-[#35363c] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Gemini AI Key</p>
              <p className="text-[10px] text-[#949ba4]">GEMINI_API_KEY</p>
            </div>
            <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-bold px-2 py-0.5 rounded">Activa</span>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Step-by-Step Instructions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#35363c] pb-3">
              <Zap className="w-5 h-5 text-[#5865F2]" />
              <span>Pasos para Configurar en Discord Developer Portal</span>
            </h3>

            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#5865F2] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h4 className="text-sm font-bold text-white">Crear la Aplicación en Discord</h4>
              </div>
              <p className="text-xs text-[#b5bac1] pl-8 leading-relaxed">
                Ingresa al Portal de Desarrolladores de Discord e inicia sesión. Haz clic en el botón <strong className="text-white">"New Application"</strong> y asigna un nombre a tu app.
              </p>
              <div className="pl-8 pt-1">
                <a 
                  href="https://discord.com/developers/applications" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Abrir Discord Developer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#5865F2] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h4 className="text-sm font-bold text-white">Configurar Redirect URL en OAuth2</h4>
              </div>
              <p className="text-xs text-[#b5bac1] pl-8 leading-relaxed">
                Ve a la pestaña <strong className="text-white">OAuth2 → General</strong> en el menú lateral. Haz clic en <strong className="text-white">"Add Redirect"</strong> e introduce esta dirección exacta:
              </p>
              
              <div className="pl-8">
                <div className="flex items-center space-x-2 bg-[#1e1f22] p-2.5 rounded-xl border border-[#35363c]">
                  <input 
                    type="text" 
                    readOnly 
                    value={config.redirectUri}
                    className="bg-transparent text-xs text-[#23a55a] font-mono w-full focus:outline-none select-all"
                  />
                  <button
                    id="btn-copy-redirect-guide"
                    onClick={copyRedirectUri}
                    className="bg-[#35363c] hover:bg-[#404249] text-white p-1.5 rounded text-xs shrink-0 transition-colors"
                  >
                    {copiedRedirect ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#5865F2] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h4 className="text-sm font-bold text-white">Obtener Client ID y Client Secret</h4>
              </div>
              <p className="text-xs text-[#b5bac1] pl-8 leading-relaxed">
                Copia el <strong className="text-white">Client ID</strong> y presiona <strong className="text-white">"Reset Secret"</strong> para copiar tu Client Secret. Guárdalos en el panel de secretos de AI Studio o tu archivo <code className="bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#23a55a]">.env</code>.
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Bitwise Permission Calculator */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Bot className="w-4 h-4 text-[#5865F2]" />
              <span>Calculadora de Permisos para Bot</span>
            </h3>

            <p className="text-xs text-[#949ba4]">
              Selecciona los permisos requeridos para generar el código de enteros (Permissions Integer) para el enlace de invitación de tu Bot.
            </p>

            <div className="space-y-2 bg-[#1e1f22] p-4 rounded-xl border border-[#35363c]">
              {Object.keys(permissions).map((key) => (
                <label key={key} className="flex items-center justify-between text-xs text-[#dbdee1] cursor-pointer hover:text-white transition-colors">
                  <span>{key}</span>
                  <input 
                    type="checkbox" 
                    checked={(permissions as any)[key]}
                    onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                    className="rounded border-[#35363c] bg-[#2b2d31] text-[#5865F2] focus:ring-0"
                  />
                </label>
              ))}
            </div>

            <div className="bg-[#1e1f22] p-3 rounded-xl border border-[#35363c] text-center space-y-1">
              <p className="text-[10px] text-[#949ba4] uppercase tracking-wider font-bold">Permissions Integer Result</p>
              <p className="text-xl font-mono font-bold text-[#5865F2]">{calculateBitwise()}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
