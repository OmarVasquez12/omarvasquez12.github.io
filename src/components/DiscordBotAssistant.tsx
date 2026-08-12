import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  BookOpen, 
  ListOrdered, 
  MessageCircle, 
  ShieldCheck, 
  Zap,
  Code
} from 'lucide-react';

export const DiscordBotAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu Asistente de IA especializado en Discord (impulsado por Gemini). Puedo ayudarte a redactar reglas con emojis, formatear mensajes en Discord Markdown, diseñar canales y roles, o escribir respuestas automatizadas para tu bot.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    {
      label: '📜 Redactar Reglas del Servidor',
      type: 'rules',
      prompt: 'Genera 5 reglas profesionales para un servidor de Discord con emojis, títulos claros y formato limpio.',
    },
    {
      label: '👋 Mensaje de Bienvenida',
      type: 'welcome',
      prompt: 'Escribe un mensaje de bienvenida cálido e interactivo para nuevos miembros en el canal #bienvenida.',
    },
    {
      label: '🗂️ Estructura de Canales',
      type: 'taxonomy',
      prompt: 'Diseña una jerarquía completa de categorías, canales de texto (#) y canales de voz (🔊) para una comunidad de desarrollo e innovación.',
    },
    {
      label: '🤖 Respuesta de Bot Automatizado',
      type: 'bot',
      prompt: 'Escribe el texto para el comando !ayuda de un bot de Discord en formato Embed con secciones de comandos.',
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (data.text) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ Error: ${data.error || 'No se pudo generar respuesta'}` },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Error de red: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="border-b border-[#2b2d31] pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Asistente de IA para Discord</h1>
            <p className="text-sm text-[#949ba4]">
              Genera contenido de comunidad, redacta avisos con Discord Markdown y diseña arquitecturas de servidor.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#5865F2]" />
              <span>Plantillas de Prompt para Servidores</span>
            </h3>

            <div className="space-y-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  id={`btn-quick-prompt-${idx}`}
                  onClick={() => handleSend(qp.prompt)}
                  disabled={loading}
                  className="w-full text-left bg-[#1e1f22] hover:bg-[#35363c] border border-[#35363c] hover:border-[#5865F2]/40 p-3 rounded-xl transition-all group cursor-pointer disabled:opacity-50"
                >
                  <p className="text-xs font-bold text-white group-hover:text-[#5865F2] transition-colors">
                    {qp.label}
                  </p>
                  <p className="text-[11px] text-[#949ba4] truncate mt-0.5">
                    {qp.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Box */}
        <div className="lg:col-span-8 bg-[#2b2d31] border border-[#35363c] rounded-2xl p-6 flex flex-col h-[550px] shadow-2xl">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                  msg.role === 'user' 
                    ? 'bg-[#5865F2] text-white font-medium rounded-tr-none' 
                    : 'bg-[#1e1f22] text-[#dbdee1] border border-[#35363c] rounded-tl-none font-sans'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.role === 'assistant' && (
                    <button
                      id={`btn-copy-ai-msg-${idx}`}
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="absolute top-2 right-2 text-[#949ba4] hover:text-white p-1 rounded bg-[#2b2d31] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copiar texto"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-3 text-xs text-[#5865F2]">
                <div className="w-8 h-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span>Gemini procesando solicitud de Discord...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="pt-4 border-t border-[#35363c] mt-4 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Escribe tu consulta o pide generar un texto para Discord..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-[#1e1f22] border border-[#35363c] rounded-xl px-4 py-3 text-xs text-white placeholder-[#949ba4] focus:outline-none focus:border-[#5865F2] w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              id="btn-send-ai-query"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white p-3 rounded-xl font-bold text-xs shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
