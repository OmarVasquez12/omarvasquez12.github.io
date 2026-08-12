import React, { useState, useEffect } from 'react';
import { DiscordWidgetData } from '../types/discord';
import { 
  Users, 
  Volume2, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Globe, 
  Radio, 
  Hash, 
  Crown,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const ServerDashboard: React.FC = () => {
  const [guildId, setGuildId] = useState('123456789012345678');
  const [loading, setLoading] = useState(false);
  
  // Sample fallback widget data
  const [widgetData, setWidgetData] = useState<DiscordWidgetData>({
    id: '123456789012345678',
    name: 'Comunidad Oficial Discord Hub',
    instant_invite: 'https://discord.gg/official-hub',
    presence_count: 148,
    channels: [
      { id: '1', name: '🔊 Sala Principal #1', position: 1 },
      { id: '2', name: '🔊 Zona de Chat de Voz VIP', position: 2 },
      { id: '3', name: '🔊 Gaming & Gaming Lounge', position: 3 },
    ],
    members: [
      {
        id: '101',
        username: 'Alex_Admin',
        discriminator: '0',
        avatar: null,
        status: 'online',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
        game: { name: 'Desarrollando en Discord API' },
      },
      {
        id: '102',
        username: 'Elena_Moderadora',
        discriminator: '0',
        avatar: null,
        status: 'dnd',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
        game: { name: 'Moderando #general' },
      },
      {
        id: '103',
        username: 'Carlos_BotMaster',
        discriminator: '0',
        avatar: null,
        status: 'online',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
      },
      {
        id: '104',
        username: 'Soporte_AI_Bot',
        discriminator: '0',
        avatar: null,
        status: 'online',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        game: { name: 'Respondiendo preguntas con Gemini' },
      },
      {
        id: '105',
        username: 'Usuario_Gamer',
        discriminator: '0',
        avatar: null,
        status: 'idle',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<'members' | 'channels' | 'rules'>('members');

  const fetchGuildWidget = async (id: string) => {
    if (!id || id.length < 10) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/discord/widget/${id}`);
      const result = await res.json();

      if (result.success && result.data) {
        setWidgetData(result.data);
      }
    } catch (err) {
      console.log('Using sample widget data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#23a55a]';
      case 'idle': return 'bg-[#f0b232]';
      case 'dnd': return 'bg-[#f23f43]';
      default: return 'bg-[#80848e]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'idle': return 'Ausente';
      case 'dnd': return 'No molestar';
      default: return 'Desconectado';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Banner Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#5865F2] via-[#4752C4] to-[#313338] p-8 text-white shadow-2xl border border-[#5865F2]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                Servidor En Vivo
              </span>
              <span className="flex items-center space-x-1 text-xs text-white/80">
                <Radio className="w-3.5 h-3.5 text-[#23a55a] animate-pulse" />
                <span>Widget Activo</span>
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{widgetData.name}</h1>
            <p className="text-sm text-white/80 max-w-xl">
              Panel interactivo de la comunidad. Observa miembros en línea, canales de voz activos e invitar a nuevos integrantes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {widgetData.instant_invite && (
              <a
                href={widgetData.instant_invite}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-white text-[#5865F2] hover:bg-white/90 px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-transform transform active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Unirse al Servidor</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Guild ID Search Bar */}
      <div className="bg-[#2b2d31] p-4 rounded-2xl border border-[#35363c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3 w-full sm:w-auto flex-1">
          <Search className="w-5 h-5 text-[#949ba4] shrink-0" />
          <input 
            type="text" 
            placeholder="Introduce ID de Servidor de Discord (Widget debe estar habilitado)"
            value={guildId}
            onChange={(e) => setGuildId(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#949ba4] focus:outline-none w-full font-mono"
            onKeyDown={(e) => e.key === 'Enter' && fetchGuildWidget(guildId)}
          />
        </div>

        <button
          id="btn-fetch-widget-id"
          onClick={() => fetchGuildWidget(guildId)}
          disabled={loading}
          className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Cargar Servidor</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-[#2b2d31] border border-[#35363c] p-5 rounded-2xl flex items-center space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#23a55a]/20 border border-[#23a55a]/40 flex items-center justify-center text-[#23a55a]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{widgetData.presence_count}</p>
            <p className="text-xs text-[#949ba4] font-medium">Miembros En Línea</p>
          </div>
        </div>

        <div className="bg-[#2b2d31] border border-[#35363c] p-5 rounded-2xl flex items-center space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{widgetData.channels?.length || 0}</p>
            <p className="text-xs text-[#949ba4] font-medium">Canales de Voz</p>
          </div>
        </div>

        <div className="bg-[#2b2d31] border border-[#35363c] p-5 rounded-2xl flex items-center space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#f0b232]/20 border border-[#f0b232]/40 flex items-center justify-center text-[#f0b232]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">Nivel 3</p>
            <p className="text-xs text-[#949ba4] font-medium">Discord Server Boost</p>
          </div>
        </div>

      </div>

      {/* Tabs Navigation for Members, Channels & Rules */}
      <div className="bg-[#2b2d31] border border-[#35363c] rounded-2xl p-6 space-y-6 shadow-xl">
        
        <div className="flex items-center space-x-3 border-b border-[#35363c] pb-4">
          <button
            id="tab-btn-members"
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'members'
                ? 'bg-[#5865F2] text-white shadow-md'
                : 'text-[#b5bac1] hover:bg-[#35363c]'
            }`}
          >
            Miembros Conectados ({widgetData.members?.length || 0})
          </button>

          <button
            id="tab-btn-channels"
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'channels'
                ? 'bg-[#5865F2] text-white shadow-md'
                : 'text-[#b5bac1] hover:bg-[#35363c]'
            }`}
          >
            Canales de Voz ({widgetData.channels?.length || 0})
          </button>

          <button
            id="tab-btn-rules"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-[#5865F2] text-white shadow-md'
                : 'text-[#b5bac1] hover:bg-[#35363c]'
            }`}
          >
            Reglas del Servidor
          </button>
        </div>

        {/* Tab Content 1: Members */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgetData.members?.map((member) => (
              <div 
                key={member.id}
                className="bg-[#1e1f22] border border-[#35363c] p-3.5 rounded-xl flex items-center space-x-3 hover:border-[#5865F2]/40 transition-all"
              >
                <div className="relative">
                  <img 
                    src={member.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                    alt={member.username} 
                    className="w-10 h-10 rounded-full"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e1f22] ${getStatusColor(member.status)}`}></span>
                </div>

                <div className="overflow-hidden flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-xs truncate">{member.username}</span>
                    {member.username.includes('Admin') && (
                      <Crown className="w-3.5 h-3.5 text-[#f0b232] shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#949ba4] truncate">
                    {member.game?.name ? `Jugando a ${member.game.name}` : getStatusLabel(member.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 2: Voice Channels */}
        {activeTab === 'channels' && (
          <div className="space-y-3">
            {widgetData.channels?.map((chan) => (
              <div 
                key={chan.id}
                className="bg-[#1e1f22] border border-[#35363c] p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-[#5865F2]" />
                  <span className="font-semibold text-white text-sm">{chan.name}</span>
                </div>
                <span className="bg-[#23a55a]/10 text-[#23a55a] text-xs font-bold px-2.5 py-1 rounded-full border border-[#23a55a]/30">
                  Activo
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Server Rules */}
        {activeTab === 'rules' && (
          <div className="bg-[#1e1f22] border border-[#35363c] rounded-xl p-6 space-y-4 text-xs text-[#dbdee1] leading-relaxed">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#5865F2]" />
              <span>Reglas Oficiales de la Comunidad</span>
            </h3>

            <ol className="space-y-2 list-decimal list-inside text-[#b5bac1]">
              <li><strong className="text-white">Respeto Mutuo:</strong> No se tolera el acoso, discurso de odio ni discriminación en ningún canal.</li>
              <li><strong className="text-white">No Spam / Self-Promote:</strong> Prohibido publicar enlaces publicitarios no autorizados o enlaces sospechosos.</li>
              <li><strong className="text-white">Uso de Canales:</strong> Mantén los temas enfocados en sus respectivos canales (e.g. #anuncios, #soporte).</li>
              <li><strong className="text-white">Seguridad de la Cuenta:</strong> Nunca compartas contraseñas ni tokens de bots con terceros.</li>
            </ol>
          </div>
        )}

      </div>

    </div>
  );
};
