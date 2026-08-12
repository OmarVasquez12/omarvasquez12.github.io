import React, { useState } from 'react';
import { 
  PackageCheck, 
  KeyRound, 
  Download, 
  ShoppingBag, 
  Heart, 
  Ticket as TicketIcon, 
  Settings as SettingsIcon, 
  RefreshCw, 
  ShieldCheck, 
  Plus, 
  Send, 
  Copy, 
  Check, 
  Server, 
  X 
} from 'lucide-react';
import { User, License, Order, Product, Ticket } from '../types';

interface ClientDashboardProps {
  user: User;
  licenses: License[];
  orders: Order[];
  products: Product[];
  tickets: Ticket[];
  onBindLicenseIp: (licenseKey: string, serverIp: string, serverPort: number) => Promise<void>;
  onResetLicenseIp: (licenseKey: string) => Promise<void>;
  onDownloadResource: (productId: string) => void;
  onCreateTicket: (subject: string, category: string, message: string, productId?: string) => Promise<void>;
  onSendMessageTicket: (ticketId: string, message: string) => Promise<void>;
  onUpdateUserSettings: (settings: Partial<User>) => Promise<void>;
  onOpenProductDetail: (product: Product) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  user,
  licenses,
  orders,
  products,
  tickets,
  onBindLicenseIp,
  onResetLicenseIp,
  onDownloadResource,
  onCreateTicket,
  onSendMessageTicket,
  onUpdateUserSettings,
  onOpenProductDetail
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'resources' | 'licenses' | 'downloads' | 'orders' | 'favorites' | 'tickets' | 'settings'
  >('resources');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // License bind form state
  const [bindLicenseKey, setBindLicenseKey] = useState('');
  const [bindIp, setBindIp] = useState('');
  const [bindPort, setBindPort] = useState<number>(22003);
  const [bindStatusMsg, setBindStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ticket creation state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Licencias & IP');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketProductId, setTicketProductId] = useState('');

  // Ticket chat active view
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  // User Settings state
  const [editUsername, setEditUsername] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editDiscordId, setEditDiscordId] = useState(user.discordId || '');
  const [editHideInRanking, setEditHideInRanking] = useState(user.hideInRanking || false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bindLicenseKey || !bindIp) {
      setBindStatusMsg({ type: 'error', text: 'Seleccione una licencia e indique la IP del servidor.' });
      return;
    }
    try {
      await onBindLicenseIp(bindLicenseKey, bindIp, bindPort);
      setBindStatusMsg({ type: 'success', text: '¡Servidor MTA vinculado exitosamente a tu licencia!' });
      setBindIp('');
    } catch (err: any) {
      setBindStatusMsg({ type: 'error', text: err.message || 'Error vinculando servidor.' });
    }
  };

  const handleResetIp = async (licenseKey: string) => {
    if (!confirm('¿Seguro que deseas resetear la IP y puerto de esta licencia? Podrás ingresar una nueva IP de inmediato.')) return;
    try {
      await onResetLicenseIp(licenseKey);
      alert('IP de la licencia reseteada. Ahora puedes ingresar los datos de tu nuevo VPS.');
    } catch (err: any) {
      alert(err.message || 'Error ejecutando Reset IP.');
    }
  };

  const handleTicketCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    await onCreateTicket(ticketSubject, ticketCategory, ticketMessage, ticketProductId);
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    await onSendMessageTicket(selectedTicket.id, replyText);
    setReplyText('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateUserSettings({
      username: editUsername,
      email: editEmail,
      discordId: editDiscordId,
      hideInRanking: editHideInRanking
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const myProductsList = products.filter(p => user.purchasedProductIds.includes(p.id) || p.isFree);
  const myFavoriteProducts = products.filter(p => user.favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-['Poppins',sans-serif]">
      
      {/* Header Overview Card */}
      <div className="bg-[#121212] p-6 sm:p-8 rounded-3xl border border-[#2d2d2d] mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-16 h-16 rounded-full object-cover border-2 border-[#ef4444] shadow-xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{user.username}</h1>
                <span className="bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-black px-2 py-0.5 rounded border border-[#ef4444]/30">
                  CLIENTE VERIFICADO
                </span>
              </div>
              <p className="text-xs font-medium text-gray-400 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-[#ef4444] mt-1 font-mono font-black">
                Registrado el {user.registeredAt} • Discord ID: {user.discordId || 'No vinculado'}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setActiveSubTab('settings')}
            className="px-4 py-2.5 rounded-xl bg-[#0d0d0d] hover:bg-[#171717] hover:border-[#ef4444] text-xs font-black text-gray-300 border border-[#2d2d2d] flex items-center space-x-2 cursor-pointer transition-colors"
          >
            <SettingsIcon className="w-4 h-4 text-[#ef4444]" />
            <span>Editar Perfil & Discord</span>
          </button>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
            <p className="text-xs font-bold text-gray-400 uppercase">Total de Compras</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{orders.length}</p>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Gastado</p>
            <p className="text-2xl font-black text-[#ef4444] mt-1 font-mono">${user.totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
            <p className="text-xs font-bold text-gray-400 uppercase">Licencias Activas</p>
            <p className="text-2xl font-black text-[#ef4444] mt-1 font-mono">{licenses.filter(l => l.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-2xl border border-[#2d2d2d]">
            <p className="text-xs font-bold text-gray-400 uppercase">Resources Adquiridos</p>
            <p className="text-2xl font-black text-[#ef4444] mt-1 font-mono">{user.purchasedProductIds.length}</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar space-x-2 border-b border-[#2d2d2d] pb-3 mb-8">
        {[
          { id: 'resources', label: 'Mis Resources', icon: PackageCheck, count: myProductsList.length },
          { id: 'licenses', label: 'Licencias & Servidores', icon: KeyRound, count: licenses.length },
          { id: 'downloads', label: 'Downloads Center', icon: Download },
          { id: 'orders', label: 'Historial de Compras', icon: ShoppingBag, count: orders.length },
          { id: 'favorites', label: 'Favoritos', icon: Heart, count: myFavoriteProducts.length },
          { id: 'tickets', label: 'Soporte & Tickets', icon: TicketIcon, count: tickets.length },
          { id: 'settings', label: 'Ajustes', icon: SettingsIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-[#ef4444] text-white shadow-md' 
                  : 'bg-[#121212] text-gray-400 hover:text-white border border-[#2d2d2d]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[#0d0d0d] text-[#ef4444]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: MIS RESOURCES */}
      {activeSubTab === 'resources' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white mb-4">Tus Recursos de MTA Adquiridos</h2>
          {myProductsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProductsList.map((product) => {
                const lic = licenses.find(l => l.productId === product.id);
                return (
                  <div key={product.id} className="bg-[#121212] p-5 rounded-2xl border border-[#2d2d2d] flex flex-col justify-between">
                    <div>
                      <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-black">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#0d0d0d]/80 text-[#ef4444] text-[10px] font-mono font-black px-2 py-0.5 rounded border border-[#ef4444]/30">
                          {product.productIdCode}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.shortDescription}</p>
                      
                      {lic && (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d]">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">License Key:</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="font-mono text-xs font-black text-[#ef4444]">{lic.licenseKey}</span>
                            <button
                              onClick={() => copyToClipboard(lic.licenseKey)}
                              className="text-xs text-gray-400 hover:text-white p-1 cursor-pointer"
                              title="Copiar Licencia"
                            >
                              {copiedKey === lic.licenseKey ? <Check className="w-3.5 h-3.5 text-[#ef4444]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2d2d2d] flex items-center justify-between">
                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="text-xs text-[#ef4444] hover:underline font-black cursor-pointer"
                      >
                        Ver Documentación
                      </button>

                      {product.downloadUrl ? (
                        <a
                          href={product.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar ZIP</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => onDownloadResource(product.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar ZIP</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-8 text-center bg-[#121212] border border-[#2d2d2d] rounded-2xl">Aún no has adquirido recursos premium.</p>
          )}
        </div>
      )}

      {/* Sub-tab 2: LICENCIAS & VINCULACIÓN DE SERVIDOR MTA */}
      {activeSubTab === 'licenses' && (
        <div className="space-y-8">
          
          {/* Server Binding Form */}
          <div className="bg-[#121212] p-6 rounded-3xl border border-[#ef4444]/30">
            <h3 className="text-base font-black text-white flex items-center space-x-2 mb-2">
              <Server className="w-5 h-5 text-[#ef4444]" />
              <span>Vincular Servidor VPS / Dedicado MTA</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Ingresa la IP pública y puerto UDP de tu servidor MTA para asociar tu licencia. El recurso validará automáticamente contra la API de XF CODE.
            </p>

            <form onSubmit={handleBindSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-300 mb-1">Seleccionar Licencia</label>
                <select
                  value={bindLicenseKey}
                  onChange={(e) => setBindLicenseKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
                >
                  <option value="">-- Elige una Licencia --</option>
                  {licenses.map(l => (
                    <option key={l.id} value={l.licenseKey}>
                      {l.productName} ({l.licenseKey})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">IP Pública del Servidor</label>
                <input
                  type="text"
                  placeholder="ej: 185.220.101.45"
                  value={bindIp}
                  onChange={(e) => setBindIp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Puerto del Servidor MTA</label>
                <input
                  type="number"
                  value={bindPort}
                  onChange={(e) => setBindPort(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vincular Servidor</span>
                </button>
              </div>
            </form>

            {bindStatusMsg && (
              <div className={`mt-4 p-3 rounded-xl text-xs font-bold ${bindStatusMsg.type === 'success' ? 'bg-[#ef4444]/20 text-white border border-[#ef4444]/40' : 'bg-red-950/60 text-red-300 border border-red-500/30'}`}>
                {bindStatusMsg.text}
              </div>
            )}
          </div>

          {/* Licenses Table */}
          <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d] overflow-hidden">
            <h3 className="text-base font-black text-white mb-4">Gestión de Licencias Activas</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2d2d2d] text-gray-400 uppercase font-mono">
                    <th className="pb-3 px-2">Resource</th>
                    <th className="pb-3 px-2">License Key</th>
                    <th className="pb-3 px-2">IP & Puerto Vinculado</th>
                    <th className="pb-3 px-2">Estado</th>
                    <th className="pb-3 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2d2d]">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 font-black text-white">{lic.productName}</td>
                      <td className="py-4 px-2 font-mono text-[#ef4444] font-black">
                        <div className="flex items-center space-x-1.5">
                          <span>{lic.licenseKey}</span>
                          <button
                            onClick={() => copyToClipboard(lic.licenseKey)}
                            className="p-1 text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-mono text-gray-300">
                        {lic.serverIp ? `${lic.serverIp}:${lic.serverPort}` : <span className="text-[#ef4444] italic">Sin vincular</span>}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                          lic.status === 'ACTIVE' 
                            ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {lic.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => handleResetIp(lic.licenseKey)}
                          className="px-3 py-1.5 rounded-lg bg-[#0d0d0d] hover:bg-[#171717] text-gray-300 border border-[#2d2d2d] text-[11px] font-black transition-colors inline-flex items-center space-x-1 cursor-pointer"
                          title="Cambiar IP de Servidor"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset IP</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Sub-tab 3: DOWNLOADS CENTER */}
      {activeSubTab === 'downloads' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white mb-2">Centro de Descargas Directas XF CODE</h2>
          <p className="text-xs text-gray-400 mb-6">Todos los paquetes contienen archivos .zip optimizados y listos para ejecutar en MTA:SA.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProductsList.map((p) => (
              <div key={p.id} className="bg-[#121212] p-5 rounded-2xl border border-[#2d2d2d] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">{p.name}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">Paquete: {p.slug || 'xf-resource'}-v{p.version}.zip</p>
                  <p className="text-[10px] text-[#ef4444] font-mono mt-1 font-bold">Verificado y Limpio (SHA256)</p>
                </div>

                {p.downloadUrl ? (
                  <a
                    href={p.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onDownloadResource(p.id)}
                    className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: HISTORIAL DE COMPRAS */}
      {activeSubTab === 'orders' && (
        <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d] overflow-hidden">
          <h3 className="text-base font-black text-white mb-4">Historial de Órdenes PayPal</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2d2d2d] text-gray-400 uppercase font-mono">
                  <th className="pb-3 px-2">Orden</th>
                  <th className="pb-3 px-2">Resource</th>
                  <th className="pb-3 px-2">Monto</th>
                  <th className="pb-3 px-2">Método</th>
                  <th className="pb-3 px-2">Estado</th>
                  <th className="pb-3 px-2">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d2d]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-black text-[#ef4444]">{o.orderNumber}</td>
                    <td className="py-3.5 px-2 text-white font-black">{o.productName}</td>
                    <td className="py-3.5 px-2 font-mono text-white font-black">${o.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-2 text-gray-300 font-bold">{o.paymentMethod}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-gray-400 font-mono">{o.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 5: FAVORITOS */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white">Tus Resources Favoritos</h2>
          {myFavoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myFavoriteProducts.map(p => (
                <div key={p.id} className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
                  <h4 className="font-black text-white text-sm">{p.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">${p.price.toFixed(2)}</p>
                  <button
                    onClick={() => onOpenProductDetail(p)}
                    className="mt-3 w-full py-2 bg-[#ef4444] text-white text-xs font-black rounded-xl hover:bg-[#dc2626] transition-colors cursor-pointer"
                  >
                    Ver Producto
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-8 text-center bg-[#121212] border border-[#2d2d2d] rounded-2xl">Aún no tienes elementos en tu lista de favoritos.</p>
          )}
        </div>
      )}

      {/* Sub-tab 6: SOPORTE & TICKETS */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Soporte Técnico XF CODE</h2>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2.5 bg-[#ef4444] text-white text-xs font-black rounded-xl shadow flex items-center space-x-1.5 hover:bg-[#dc2626] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Ticket de Soporte</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List Column */}
            <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d] space-y-2 lg:col-span-1">
              <h3 className="text-xs font-black text-gray-400 uppercase px-2 mb-2">Tus Tickets</h3>
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedTicket?.id === t.id 
                      ? 'bg-[#ef4444]/10 border-[#ef4444]' 
                      : 'bg-[#0d0d0d] border-[#2d2d2d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#ef4444] font-black">{t.ticketNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#ef4444]/20 text-white font-black border border-[#ef4444]/30">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white mt-1 line-clamp-1">{t.subject}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{t.updatedAt}</p>
                </div>
              ))}
            </div>

            {/* Ticket Chat Messages Area */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2d2d] lg:col-span-2 flex flex-col h-[480px]">
              {selectedTicket ? (
                <>
                  <div className="pb-3 border-b border-[#2d2d2d] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-[#ef4444]">{selectedTicket.ticketNumber}</span>
                      <h3 className="text-base font-black text-white">{selectedTicket.subject}</h3>
                    </div>
                    <span className="text-xs text-gray-400 font-bold">{selectedTicket.category}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          m.senderRole === 'ADMIN'
                            ? 'bg-[#ef4444]/10 border border-[#ef4444]/30 ml-auto text-white'
                            : 'bg-[#0d0d0d] border border-[#2d2d2d] text-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[10px] text-gray-400 mb-1">
                          <span>{m.sender} {m.senderRole === 'ADMIN' && '⚡ (Soporte Oficial XF CODE)'}</span>
                          <span>{m.createdAt}</span>
                        </div>
                        <p>{m.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleReplyTicket} className="pt-3 border-t border-[#2d2d2d] flex space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe una respuesta a tu ticket..."
                      className="flex-1 p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 text-xs">
                  <TicketIcon className="w-10 h-10 mb-2 opacity-40 text-[#ef4444]" />
                  <p>Selecciona un ticket a la izquierda para ver la conversación.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 7: SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="bg-[#121212] p-6 sm:p-8 rounded-3xl border border-[#2d2d2d] max-w-2xl mx-auto">
          <h2 className="text-lg font-black text-white mb-4">Configuración de Cuenta XF CODE</h2>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Nombre de Usuario</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white font-semibold focus:outline-none focus:border-[#ef4444]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white font-semibold focus:outline-none focus:border-[#ef4444]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Discord User ID (Para vinculación de rol)</label>
              <input
                type="text"
                value={editDiscordId}
                onChange={(e) => setEditDiscordId(e.target.value)}
                placeholder="ej: 772910293817263549"
                className="w-full p-3 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white font-mono focus:outline-none focus:border-[#ef4444]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-[#2d2d2d] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Ocultarme del Ranking Top Compradores</p>
                <p className="text-[11px] text-gray-400">Tu usuario no aparecerá públicamente en la tabla de clasificación.</p>
              </div>
              <input
                type="checkbox"
                checked={editHideInRanking}
                onChange={(e) => setEditHideInRanking(e.target.checked)}
                className="w-5 h-5 accent-[#ef4444] rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              Guardar Cambios
            </button>

            {settingsSuccess && (
              <p className="text-center text-[#ef4444] font-bold pt-2">¡Configuración guardada correctamente!</p>
            )}
          </form>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2d2d]">
              <h3 className="text-base font-black text-white">Abrir Ticket de Soporte XF CODE</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTicketCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Asunto</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="ej: Consulta sobre descarga de HUD 3D"
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Categoría</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                >
                  <option value="Licencias & IP">Licencias & IP</option>
                  <option value="Soporte de Instalación">Soporte de Instalación</option>
                  <option value="Duda de Compra">Duda de Compra</option>
                  <option value="Bug / Error de Script">Bug / Error de Script</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Mensaje Explicativo</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe los detalles de tu consulta..."
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl transition-colors cursor-pointer"
              >
                Enviar Ticket a Soporte
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
