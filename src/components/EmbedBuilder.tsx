import React, { useState } from 'react';
import { DiscordEmbed, DiscordWebhookPayload } from '../types/discord';
import { 
  Send, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  User, 
  Palette, 
  Code, 
  Eye, 
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface EmbedBuilderProps {
  defaultWebhookUrl?: string;
}

export const EmbedBuilder: React.FC<EmbedBuilderProps> = ({ defaultWebhookUrl = '' }) => {
  const [webhookUrl, setWebhookUrl] = useState(defaultWebhookUrl);
  const [content, setContent] = useState('¡Hola servidor! 👋 Aquí está una actualización oficial.');
  const [username, setUsername] = useState('Anuncios Oficiales');
  const [avatarUrl, setAvatarUrl] = useState('https://cdn.discordapp.com/embed/avatars/0.png');

  // Embed state
  const [embed, setEmbed] = useState<DiscordEmbed>({
    title: '🚀 Nueva Actualización del Servidor',
    description: 'Hemos añadido características increíbles para mejorar la experiencia de la comunidad. Revisa los detalles abajo.',
    url: 'https://discord.com',
    color: 5793266, // #5865F2
    author: {
      name: 'Equipo de Soporte',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
    },
    fields: [
      { name: '✨ Novedades', value: '• Sistema de Webhooks activo\n• Creador de Embeds interactivo\n• Bot con Inteligencia Artificial', inline: true },
      { name: '🛡️ Estado', value: 'Operacional 100%', inline: true },
    ],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    },
    footer: {
      text: 'Discord Suite Hub • Actualizado hoy',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
    },
    timestamp: new Date().toISOString(),
  });

  const [hexColor, setHexColor] = useState('#5865F2');
  const [copiedJson, setCopiedJson] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [themePreview, setThemePreview] = useState<'dark' | 'light'>('dark');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Convert decimal color to HEX
  const handleColorChange = (hex: string) => {
    setHexColor(hex);
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);
    if (!isNaN(num)) {
      setEmbed({ ...embed, color: num });
    }
  };

  // Add field
  const addField = () => {
    if ((embed.fields?.length || 0) >= 25) return;
    const newFields = [...(embed.fields || []), { name: 'Nuevo Campo', value: 'Valor del campo...', inline: true }];
    setEmbed({ ...embed, fields: newFields });
  };

  // Update field
  const updateField = (index: number, key: 'name' | 'value' | 'inline', val: any) => {
    const newFields = [...(embed.fields || [])];
    newFields[index] = { ...newFields[index], [key]: val };
    setEmbed({ ...embed, fields: newFields });
  };

  // Remove field
  const removeField = (index: number) => {
    const newFields = (embed.fields || []).filter((_, i) => i !== index);
    setEmbed({ ...embed, fields: newFields });
  };

  // Full Payload JSON
  const payload: DiscordWebhookPayload = {
    content,
    username,
    avatar_url: avatarUrl,
    embeds: [embed],
  };

  // Copy JSON
  const copyPayloadJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Send to Webhook
  const handleSendWebhook = async () => {
    if (!webhookUrl) {
      setSendResult({ success: false, message: 'Por favor ingresa una URL de Webhook válida.' });
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSendResult({ success: true, message: '¡Embed enviado a Discord exitosamente!' });
      } else {
        setSendResult({ success: false, message: data.error || 'Error al enviar a Discord' });
      }
    } catch (err: any) {
      setSendResult({ success: false, message: err.message || 'Fallo de conexión al enviar el mensaje' });
    } finally {
      setSending(false);
    }
  };

  // AI Generator with Gemini
  const handleGenerateAIEmbed = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Crea los campos para un Embed de Discord basado en este tema: "${aiPrompt}". Devuelve título atractivo, descripción en vivo con emojis, y 2 campos organizados.`,
          type: 'embed',
        }),
      });

      const data = await res.json();
      if (data.text) {
        try {
          const match = data.text.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            setEmbed({
              ...embed,
              title: parsed.title || embed.title,
              description: parsed.description || embed.description,
              fields: parsed.fields || embed.fields,
            });
          } else {
            setEmbed({
              ...embed,
              description: data.text,
            });
          }
        } catch {
          setEmbed({ ...embed, description: data.text });
        }
      }
    } catch (err: any) {
      console.error('AI Embed Gen Error:', err);
    } finally {
      setAiGenerating(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2b2d31] pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Creador de Embeds para Discord</h1>
              <p className="text-sm text-[#949ba4]">
                Diseña mensajes enriquecidos con visualización en tiempo real y envío instantáneo a Webhooks.
              </p>
            </div>
          </div>
        </div>

        {/* AI Prompt Box */}
        <div className="bg-[#2b2d31] p-2 rounded-xl border border-[#35363c] flex items-center space-x-2 max-w-md w-full">
          <Sparkles className="w-4 h-4 text-[#5865F2] shrink-0 ml-2" />
          <input 
            type="text"
            placeholder="Ej: 'Anuncio de evento de torneo este fin de semana'..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-[#949ba4] focus:outline-none w-full"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAIEmbed()}
          />
          <button
            id="btn-generate-ai-embed"
            onClick={handleGenerateAIEmbed}
            disabled={aiGenerating || !aiPrompt.trim()}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            {aiGenerating ? 'Generando...' : 'IA Generar'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor, Right Discord Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Webhook URL Target & Basic Bot Settings */}
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Send className="w-4 h-4 text-[#5865F2]" />
              <span>Configuración del Webhook de Envío</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">URL del Webhook de Discord</label>
                <input 
                  type="text" 
                  placeholder="https://discord.com/api/webhooks/123456789/abcxyz..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-[#949ba4] focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Nombre del Bot / Webhook</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Avatar URL</label>
                  <input 
                    type="text" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Mensaje de Texto (Content fuera del Embed)</label>
                <textarea 
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Embed Editor Fields */}
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#35363c] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Palette className="w-4 h-4 text-[#5865F2]" />
                <span>Propiedades del Embed</span>
              </h3>
              
              {/* Color Picker */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#949ba4]">Color de Barra:</span>
                <input 
                  type="color" 
                  value={hexColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs font-mono text-white">{hexColor}</span>
              </div>
            </div>

            {/* Author */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Autor - Nombre</label>
                <input 
                  type="text" 
                  value={embed.author?.name || ''}
                  onChange={(e) => setEmbed({ ...embed, author: { ...embed.author, name: e.target.value } })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Autor - Avatar Icon URL</label>
                <input 
                  type="text" 
                  value={embed.author?.icon_url || ''}
                  onChange={(e) => setEmbed({ ...embed, author: { ...embed.author, name: embed.author?.name || '', icon_url: e.target.value } })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            {/* Title & URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Título</label>
                <input 
                  type="text" 
                  value={embed.title || ''}
                  onChange={(e) => setEmbed({ ...embed, title: e.target.value })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Enlace del Título (URL)</label>
                <input 
                  type="text" 
                  value={embed.url || ''}
                  onChange={(e) => setEmbed({ ...embed, url: e.target.value })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Descripción</label>
              <textarea 
                rows={3}
                value={embed.description || ''}
                onChange={(e) => setEmbed({ ...embed, description: e.target.value })}
                className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            {/* Dynamic Fields Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wide">
                  Campos Personalizados ({embed.fields?.length || 0}/25)
                </label>
                <button
                  id="btn-add-embed-field"
                  onClick={addField}
                  className="flex items-center space-x-1 bg-[#35363c] hover:bg-[#404249] text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Campo</span>
                </button>
              </div>

              {embed.fields?.map((field, idx) => (
                <div key={idx} className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-3 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5865F2]">Campo #{idx + 1}</span>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-1 text-xs text-[#949ba4] cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.inline || false}
                          onChange={(e) => updateField(idx, 'inline', e.target.checked)}
                          className="rounded border-[#35363c] bg-[#2b2d31] text-[#5865F2] focus:ring-0"
                        />
                        <span>En línea (Inline)</span>
                      </label>
                      <button
                        id={`btn-remove-field-${idx}`}
                        onClick={() => removeField(idx)}
                        className="text-[#f23f43] hover:text-red-400 p-1 rounded hover:bg-[#2b2d31] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Nombre del campo"
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value)}
                      className="bg-[#2b2d31] border border-[#35363c] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                    />
                    <input 
                      type="text" 
                      placeholder="Valor del campo"
                      value={field.value}
                      onChange={(e) => updateField(idx, 'value', e.target.value)}
                      className="bg-[#2b2d31] border border-[#35363c] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Images (Thumbnail & Large Image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">URL de Miniatura (Thumbnail)</label>
                <input 
                  type="text" 
                  value={embed.thumbnail?.url || ''}
                  onChange={(e) => setEmbed({ ...embed, thumbnail: e.target.value ? { url: e.target.value } : undefined })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">URL de Imagen Grande</label>
                <input 
                  type="text" 
                  value={embed.image?.url || ''}
                  onChange={(e) => setEmbed({ ...embed, image: e.target.value ? { url: e.target.value } : undefined })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Texto del Pie (Footer)</label>
                <input 
                  type="text" 
                  value={embed.footer?.text || ''}
                  onChange={(e) => setEmbed({ ...embed, footer: { ...embed.footer, text: e.target.value } })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Icono del Pie (URL)</label>
                <input 
                  type="text" 
                  value={embed.footer?.icon_url || ''}
                  onChange={(e) => setEmbed({ ...embed, footer: { ...embed.footer, text: embed.footer?.text || '', icon_url: e.target.value } })}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-send-discord-embed"
              onClick={handleSendWebhook}
              disabled={sending}
              className="w-full sm:flex-1 bg-[#23a55a] hover:bg-[#1f924e] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#23a55a]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensaje a Discord</span>
                </>
              )}
            </button>

            <button
              id="btn-copy-payload-json"
              onClick={copyPayloadJson}
              className="w-full sm:w-auto bg-[#35363c] hover:bg-[#404249] text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              {copiedJson ? <Check className="w-4 h-4 text-[#23a55a]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedJson ? '¡Copiado!' : 'Copiar JSON'}</span>
            </button>
          </div>

          {/* Send Status Banner */}
          {sendResult && (
            <div className={`p-4 rounded-xl text-xs flex items-center space-x-3 border ${
              sendResult.success 
                ? 'bg-[#23a55a]/10 border-[#23a55a]/30 text-[#23a55a]' 
                : 'bg-[#f23f43]/10 border-[#f23f43]/30 text-[#f23f43]'
            }`}>
              {sendResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{sendResult.message}</span>
            </div>
          )}

        </div>

        {/* Right Column: Live Discord Frame Preview */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#5865F2]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Vista Previa en Vivo (Estilo Oficial Discord)
              </span>
            </div>

            {/* Theme Toggle */}
            <div className="bg-[#2b2d31] border border-[#35363c] p-1 rounded-lg flex items-center space-x-1">
              <button
                id="btn-preview-dark-theme"
                onClick={() => setThemePreview('dark')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  themePreview === 'dark' ? 'bg-[#5865F2] text-white' : 'text-[#949ba4] hover:text-white'
                }`}
              >
                Oscuro
              </button>
              <button
                id="btn-preview-light-theme"
                onClick={() => setThemePreview('light')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  themePreview === 'light' ? 'bg-[#5865F2] text-white' : 'text-[#949ba4] hover:text-white'
                }`}
              >
                Claro
              </button>
            </div>
          </div>

          {/* Discord Chat Container */}
          <div className={`rounded-2xl border border-[#35363c] p-6 shadow-2xl transition-colors min-h-[500px] ${
            themePreview === 'dark' ? 'bg-[#313338] text-[#dbdee1]' : 'bg-[#f2f3f5] text-[#313338]'
          }`}>
            
            {/* Channel Bar Mock */}
            <div className="flex items-center space-x-2 border-b border-black/10 dark:border-white/10 pb-3 mb-4">
              <span className="text-lg font-bold text-[#949ba4]">#</span>
              <span className="font-semibold text-sm">anuncios-servidor</span>
              <span className="text-xs text-[#949ba4] ml-auto">Hoy a las 12:00</span>
            </div>

            {/* Chat Message Row */}
            <div className="flex space-x-4">
              {/* Avatar */}
              <img 
                src={avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                alt="Bot Avatar"
                className="w-10 h-10 rounded-full shrink-0 mt-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }}
              />

              {/* Message Content */}
              <div className="space-y-2 flex-1 overflow-hidden">
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold text-sm hover:underline cursor-pointer ${
                    themePreview === 'dark' ? 'text-white' : 'text-[#060607]'
                  }`}>
                    {username || 'Bot Webhook'}
                  </span>
                  <span className="bg-[#5865F2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    BOT
                  </span>
                  <span className="text-[11px] text-[#949ba4]">Hoy a las 12:00</span>
                </div>

                {/* Content text if present */}
                {content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                )}

                {/* Embed Container */}
                <div 
                  className={`rounded-lg p-4 space-y-3 max-w-lg shadow-md border-l-4 transition-all ${
                    themePreview === 'dark' ? 'bg-[#2b2d31]' : 'bg-[#e3e5e8]'
                  }`}
                  style={{ borderLeftColor: hexColor || '#5865F2' }}
                >
                  
                  {/* Author Row */}
                  {embed.author?.name && (
                    <div className="flex items-center space-x-2">
                      {embed.author.icon_url && (
                        <img src={embed.author.icon_url} alt="" className="w-5 h-5 rounded-full" />
                      )}
                      <span className={`text-xs font-semibold ${themePreview === 'dark' ? 'text-white' : 'text-[#060607]'}`}>
                        {embed.author.name}
                      </span>
                    </div>
                  )}

                  {/* Title & Thumbnail Row */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 flex-1">
                      {embed.title && (
                        <h4 className={`font-bold text-base hover:underline cursor-pointer ${
                          themePreview === 'dark' ? 'text-white' : 'text-[#060607]'
                        }`}>
                          {embed.title}
                        </h4>
                      )}
                      {embed.description && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap opacity-90">
                          {embed.description}
                        </p>
                      )}
                    </div>

                    {embed.thumbnail?.url && (
                      <img 
                        src={embed.thumbnail.url} 
                        alt="Thumbnail" 
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                  </div>

                  {/* Fields Grid */}
                  {embed.fields && embed.fields.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {embed.fields.map((field, idx) => (
                        <div 
                          key={idx} 
                          className={field.inline ? 'col-span-1' : 'col-span-full'}
                        >
                          <div className={`text-xs font-bold ${themePreview === 'dark' ? 'text-[#f2f3f5]' : 'text-[#060607]'}`}>
                            {field.name}
                          </div>
                          <div className="text-xs opacity-90 whitespace-pre-wrap mt-0.5">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Large Image */}
                  {embed.image?.url && (
                    <div className="pt-2">
                      <img 
                        src={embed.image.url} 
                        alt="Embed Attachment" 
                        className="rounded-lg max-h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Footer */}
                  {embed.footer?.text && (
                    <div className="flex items-center space-x-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px] opacity-75">
                      {embed.footer.icon_url && (
                        <img src={embed.footer.icon_url} alt="" className="w-4 h-4 rounded-full" />
                      )}
                      <span>{embed.footer.text}</span>
                      <span>•</span>
                      <span>Hoy a las 12:00</span>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

          {/* JSON Payload Code Snippet */}
          <div className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#949ba4]">
              <span className="flex items-center space-x-1">
                <Code className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Payload JSON de Discord API</span>
              </span>
              <span>application/json</span>
            </div>
            <pre className="bg-[#2b2d31] p-3 rounded-lg text-xs font-mono text-[#3ba55d] overflow-x-auto max-h-48">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
