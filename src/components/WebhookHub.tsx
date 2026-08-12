import React, { useState } from 'react';
import { WebhookConfig } from '../types/discord';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Send, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Globe, 
  Sparkles, 
  Layers, 
  Zap,
  Copy,
  Check
} from 'lucide-react';

export const WebhookHub: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'wh-1',
      name: 'Canal de Anuncios General',
      url: 'https://discord.com/api/webhooks/123456789/sample_announcements',
      channelName: '#anuncios',
      serverName: 'Servidor Oficial',
      createdAt: new Date().toLocaleDateString(),
    },
    {
      id: 'wh-[#wh-2]',
      name: 'Bot de Bienvenida',
      url: 'https://discord.com/api/webhooks/987654321/sample_welcome',
      channelName: '#bienvenida',
      serverName: 'Servidor Oficial',
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newChannelName, setNewChannelName] = useState('#general');
  const [newServerName, setNewServerName] = useState('Mi Comunidad');

  const [testResult, setTestResult] = useState<{ id: string; success: boolean; ping: number; message: string } | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Template Quick Actions
  const templates = [
    {
      title: '📢 Anuncio de Mantenimiento',
      channel: '#anuncios',
      content: '🔧 **Mantenimiento Programado del Servidor**\n\nEstaremos realizando mejoras en los canales de voz e infraestructura. Duración estimada: 30 min. ¡Gracias por su paciencia!',
      color: 16098884, // Yellow/Orange
    },
    {
      title: '🎉 Evento de la Comunidad',
      channel: '#eventos',
      content: '🏆 **¡Torneo de Fin de Semana!**\n\nÚnete a nosotros este sábado a las 20:00 UTC. Habrá premios VIP para los mejores equipos. ¡Inscríbete en el canal!',
      color: 5793266, // Discord Blurple
    },
    {
      title: '🚀 Lanzamiento de Parche',
      channel: '#actualizaciones',
      content: '✨ **Notas de la Actualización v2.4**\n\n- Rendimiento mejorado +40%\n- Nuevos roles automatizados\n- Corrección de errores generales',
      color: 2336090, // Green
    },
  ];

  const handleAddWebhook = () => {
    if (!newWebhookName || !newWebhookUrl) return;

    const newWh: WebhookConfig = {
      id: `wh-${Date.now()}`,
      name: newWebhookName,
      url: newWebhookUrl,
      channelName: newChannelName.startsWith('#') ? newChannelName : `#${newChannelName}`,
      serverName: newServerName,
      createdAt: new Date().toLocaleDateString(),
    };

    setWebhooks([...webhooks, newWh]);
    setNewWebhookName('');
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
  };

  const handleTestWebhook = async (wh: WebhookConfig) => {
    setTestingId(wh.id);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: wh.url,
          payload: {
            username: `${wh.name} (Prueba)`,
            content: `⚡ **Prueba de Conexión Webhook** desde Discord Suite Hub.\nTimestamp: ${new Date().toLocaleTimeString()}`,
            embeds: [
              {
                title: '✅ Conexión con Discord Verificada',
                description: `El Webhook asignado al canal **${wh.channelName}** está respondiendo correctamente.`,
                color: 2336090,
                footer: { text: `Servidor: ${wh.serverName}` },
              },
            ],
          },
        }),
      });

      const endTime = performance.now();
      const ping = Math.round(endTime - startTime);

      const data = await res.json();
      if (data.success) {
        setTestResult({
          id: wh.id,
          success: true,
          ping,
          message: `¡Webhook enviado exitosamente en ${ping}ms!`,
        });
      } else {
        setTestResult({
          id: wh.id,
          success: false,
          ping,
          message: data.error || 'Error al conectar con Discord',
        });
      }
    } catch (err: any) {
      setTestResult({
        id: wh.id,
        success: false,
        ping: 0,
        message: err.message || 'Error de red',
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="border-b border-[#2b2d31] pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#23a55a]/20 border border-[#23a55a]/40 flex items-center justify-center text-[#23a55a]">
            <Webhook className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Centro de Control de Webhooks</h1>
            <p className="text-sm text-[#949ba4]">
              Administra tus Webhooks de Discord, envía anuncios masivos y verifica tiempos de respuesta.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Webhooks Management */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Webhook Card */}
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#5865F2]" />
              <span>Registrar Nuevo Webhook</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Nombre Identificador</label>
                <input 
                  type="text" 
                  placeholder="Ej: Anuncios VIP"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Nombre del Servidor</label>
                <input 
                  type="text" 
                  placeholder="Ej: Mi Servidor Gaming"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">URL del Webhook de Discord</label>
                <input 
                  type="text" 
                  placeholder="https://discord.com/api/webhooks/..."
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-[#949ba4] focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b5bac1] mb-1">Canal Destino</label>
                <input 
                  type="text" 
                  placeholder="#general"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#35363c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            <button
              id="btn-save-webhook"
              onClick={handleAddWebhook}
              disabled={!newWebhookName || !newWebhookUrl}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Webhook en Biblioteca</span>
            </button>
          </div>

          {/* Webhooks List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider flex items-center justify-between">
              <span>Webhooks Configurados ({webhooks.length})</span>
              <span className="text-[11px] text-[#949ba4] normal-case">Listos para usar</span>
            </h3>

            {webhooks.map((wh) => (
              <div 
                key={wh.id}
                className="bg-[#2b2d31] border border-[#35363c] hover:border-[#5865F2]/50 rounded-2xl p-4 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                      <Webhook className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{wh.name}</h4>
                      <p className="text-xs text-[#949ba4]">
                        Servidor: <span className="text-white font-medium">{wh.serverName}</span> • Canal: <span className="text-[#5865F2] font-semibold">{wh.channelName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id={`btn-test-webhook-${wh.id}`}
                      onClick={() => handleTestWebhook(wh)}
                      disabled={testingId === wh.id}
                      className="bg-[#23a55a] hover:bg-[#1f924e] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {testingId === wh.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>Probar Conexión</span>
                    </button>

                    <button
                      id={`btn-delete-webhook-${wh.id}`}
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="text-[#949ba4] hover:text-[#f23f43] p-1.5 rounded-lg hover:bg-[#1e1f22] transition-colors"
                      title="Eliminar Webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#1e1f22] p-2 rounded-lg text-xs font-mono text-[#949ba4] truncate flex items-center justify-between">
                  <span className="truncate">{wh.url}</span>
                </div>

                {/* Test Result Feedback */}
                {testResult && testResult.id === wh.id && (
                  <div className={`p-3 rounded-lg text-xs flex items-center space-x-2 border ${
                    testResult.success 
                      ? 'bg-[#23a55a]/10 border-[#23a55a]/30 text-[#23a55a]' 
                      : 'bg-[#f23f43]/10 border-[#f23f43]/30 text-[#f23f43]'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span className="flex-1">{testResult.message}</span>
                    {testResult.ping > 0 && (
                      <span className="font-mono font-bold bg-black/20 px-2 py-0.5 rounded text-[10px]">
                        {testResult.ping}ms
                      </span>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Pre-built Announcement Templates */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#5865F2]" />
              <span>Plantillas Rápidas de Anuncios</span>
            </h3>

            <p className="text-xs text-[#949ba4]">
              Usa estos modelos pre-diseñados para publicar en tus canales de Discord con un clic.
            </p>

            <div className="space-y-3">
              {templates.map((tpl, idx) => (
                <div key={idx} className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{tpl.title}</span>
                    <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] px-2 py-0.5 rounded font-mono">
                      {tpl.channel}
                    </span>
                  </div>

                  <p className="text-xs text-[#dbdee1] whitespace-pre-wrap leading-relaxed bg-[#2b2d31] p-2.5 rounded-lg border border-[#35363c]/50 font-sans">
                    {tpl.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Webhook Instructions */}
            <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#35363c] space-y-2 text-xs">
              <span className="font-bold text-[#5865F2] flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>¿Cómo obtener la URL de Webhook en Discord?</span>
              </span>
              <ol className="list-decimal list-inside text-[#949ba4] space-y-1 text-[11px] leading-relaxed">
                <li>Abre Discord y entra a tu servidor.</li>
                <li>Haz clic en el engranaje de configuración del canal deseado.</li>
                <li>Ve a <strong className="text-white">Integraciones</strong> → <strong className="text-white">Webhooks</strong>.</li>
                <li>Haz clic en <strong className="text-white">Crear Webhook</strong> y copia su URL.</li>
              </ol>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
