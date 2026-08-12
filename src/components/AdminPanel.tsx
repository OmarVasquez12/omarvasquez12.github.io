import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Package, 
  KeyRound, 
  Gift, 
  Plus, 
  Trash2, 
  Ticket as TicketIcon, 
  FileText, 
  X, 
  Search, 
  Layers,
  Download,
  Image as ImageIcon,
  Sparkles,
  DollarSign,
  Settings
} from 'lucide-react';
import { Product, License, Order, Ticket, AuditLog, CustomOrderItem } from '../types';

interface AdminPanelProps {
  products: Product[];
  licenses: License[];
  orders: Order[];
  tickets: Ticket[];
  logs: AuditLog[];
  customOrders: CustomOrderItem[];
  onCreateProduct: (pData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onGiftProduct: (targetUsername: string, productId: string) => Promise<void>;
  onChangeLicenseStatus: (licenseKey: string, status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED') => Promise<void>;
  onAdminReplyTicket: (ticketId: string, message: string) => Promise<void>;
  onCreateCustomOrder: (cData: Omit<CustomOrderItem, 'id'>) => Promise<void>;
  onDeleteCustomOrder: (id: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  licenses,
  orders,
  tickets,
  logs,
  customOrders,
  onCreateProduct,
  onDeleteProduct,
  onGiftProduct,
  onChangeLicenseStatus,
  onAdminReplyTicket,
  onCreateCustomOrder,
  onDeleteCustomOrder
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'licenses' | 'tickets' | 'logs' | 'custom_orders' | 'settings'>('products');

  // System Settings State
  const [wbPurchases, setWbPurchases] = useState('');
  const [wbReviews, setWbReviews] = useState('');
  const [paypalMail, setPaypalMail] = useState('pagos@xfcode.com');
  const [paypalClient, setPaypalClient] = useState('');
  const [paypalEnv, setPaypalEnv] = useState<'sandbox' | 'live'>('sandbox');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.settings) {
          setWbPurchases(data.settings.discordWebhookPurchases || '');
          setWbReviews(data.settings.discordWebhookReviews || '');
          setPaypalMail(data.settings.paypalEmail || 'pagos@xfcode.com');
          setPaypalClient(data.settings.paypalClientId || '');
          setPaypalEnv(data.settings.paypalMode || 'sandbox');
        }
      })
      .catch(err => console.error('Error fetching admin settings:', err));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discordWebhookPurchases: wbPurchases,
          discordWebhookReviews: wbReviews,
          paypalEmail: paypalMail,
          paypalClientId: paypalClient,
          paypalMode: paypalEnv
        })
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      alert('Error guardando la configuración de PayPal y Webhooks.');
    } finally {
      setLoadingSettings(false);
    }
  };

  // Gift modal state
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftTargetUser, setGiftTargetUser] = useState('');
  const [giftProductId, setGiftProductId] = useState('');
  const [giftSuccessMsg, setGiftSuccessMsg] = useState('');

  // Create Product modal state
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCode, setNewProdCode] = useState('XF-RES-01');
  const [newProdPrice, setNewProdPrice] = useState('14.99');
  const [newProdIsFree, setNewProdIsFree] = useState(false);
  const [newProdCategory, setNewProdCategory] = useState('TODOS');
  const [newProdBadge, setNewProdBadge] = useState('NUEVO');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFullDesc, setNewProdFullDesc] = useState('');
  const [newProdImageUrl, setNewProdImageUrl] = useState('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80');
  const [newProdDownloadUrl, setNewProdDownloadUrl] = useState('https://mediafire.com/file/xf-resource.zip');
  const [newProdRequirements, setNewProdRequirements] = useState('MTA:SA 1.5.9+, ACL Admin Access');

  // Create Custom Order modal state
  const [showCreateCustomModal, setShowCreateCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
  const [customCategory, setCustomCategory] = useState('Lua Scripting');
  const [customDeliveryTime, setCustomDeliveryTime] = useState('3-5 Días');

  // Search in licenses
  const [licenseSearch, setLicenseSearch] = useState('');

  // Ticket reply
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<Ticket | null>(null);
  const [adminReplyMsg, setAdminReplyMsg] = useState('');

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftProductId) return;
    try {
      await onGiftProduct(giftTargetUser, giftProductId);
      setGiftSuccessMsg('¡Recurso regalado con éxito! Licencia generada y enviada.');
      setGiftTargetUser('');
      setTimeout(() => {
        setGiftSuccessMsg('');
        setShowGiftModal(false);
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Error regalando recurso.');
    }
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    await onCreateProduct({
      name: newProdName,
      productIdCode: newProdCode || `XF-${Math.floor(Math.random() * 900 + 100)}`,
      price: newProdIsFree ? 0 : parseFloat(newProdPrice),
      isFree: newProdIsFree,
      category: newProdCategory as any,
      badge: newProdBadge as any,
      image: newProdImageUrl,
      downloadUrl: newProdDownloadUrl,
      shortDescription: newProdDesc || 'Resource optimizado XF CODE para servidores MTA:SA.',
      fullDescription: newProdFullDesc || newProdDesc || 'Resource optimizado XF CODE para servidores MTA:SA.',
      requirements: newProdRequirements ? newProdRequirements.split(',') : ['MTA:SA v1.5.9+'],
      screenshots: [newProdImageUrl],
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      changelog: ['v1.0.0: Publicación inicial del recurso en XF CODE.'],
      mtaCompatibility: 'MTA 1.5.9 & 1.6',
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0
    });
    setShowCreateProductModal(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdFullDesc('');
  };

  const handleCreateCustomOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    await onCreateCustomOrder({
      title: customTitle,
      description: customDesc,
      imageUrl: customImageUrl,
      category: customCategory,
      deliveryTime: customDeliveryTime
    });
    setShowCreateCustomModal(false);
    setCustomTitle('');
    setCustomDesc('');
  };

  const handleReplyTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminTicket || !adminReplyMsg.trim()) return;
    await onAdminReplyTicket(selectedAdminTicket.id, adminReplyMsg);
    setAdminReplyMsg('');
  };

  const filteredLicenses = licenses.filter(l => 
    l.licenseKey.toLowerCase().includes(licenseSearch.toLowerCase()) ||
    l.username.toLowerCase().includes(licenseSearch.toLowerCase()) ||
    l.productName.toLowerCase().includes(licenseSearch.toLowerCase()) ||
    l.serverIp.includes(licenseSearch)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-['Poppins',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white">Panel de Administración XF CODE</h1>
              <span className="bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-black px-2 py-0.5 rounded border border-[#ef4444]/30">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Gestión de catálogo, enlaces de descarga, pedidos personalizados y licencias.</p>
          </div>
        </div>

        {/* REGALAR RESOURCE BUTTON */}
        <button
          onClick={() => setShowGiftModal(true)}
          className="px-6 py-3 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
        >
          <Gift className="w-4 h-4 animate-bounce" />
          <span>REGALAR RESOURCE</span>
        </button>
      </div>

      {/* Admin Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Clientes Totales</p>
          <p className="text-xl font-black text-white font-mono mt-1">{orders.length + 65}</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Productos Activos</p>
          <p className="text-xl font-black text-[#ef4444] font-mono mt-1">{products.length}</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Ventas Reales</p>
          <p className="text-xl font-black text-[#ef4444] font-mono mt-1">{orders.length}</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Licencias Activas</p>
          <p className="text-xl font-black text-[#ef4444] font-mono mt-1">{licenses.filter(l => l.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Revenue PayPal</p>
          <p className="text-xl font-black text-[#ef4444] font-mono mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d]">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Custom Showcase</p>
          <p className="text-xl font-black text-[#ef4444] font-mono mt-1">{customOrders.length}</p>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex border-b border-[#2d2d2d] mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'products', label: 'Gestión de Productos', icon: Package, count: products.length },
          { id: 'custom_orders', label: 'Pedidos Personalizados', icon: Sparkles, count: customOrders.length },
          { id: 'licenses', label: 'Control de Licencias', icon: KeyRound, count: licenses.length },
          { id: 'tickets', label: 'Soporte Clientes', icon: TicketIcon, count: tickets.length },
          { id: 'settings', label: 'Ajustes Webhooks & PayPal', icon: Settings },
          { id: 'logs', label: 'Audit Logs', icon: FileText, count: logs.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`pb-3 px-5 font-black text-xs sm:text-sm border-b-2 flex items-center space-x-2 shrink-0 transition-colors cursor-pointer ${
                isActive ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-[#ef4444]" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] bg-[#0d0d0d] text-[#ef4444] font-black px-1.5 py-0.5 rounded font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: PRODUCTS CRUD */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Subir / Administrar Resources en la Tienda</h2>
            <button
              onClick={() => setShowCreateProductModal(true)}
              className="px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Subir Nuevo Resource</span>
            </button>
          </div>

          <div className="bg-[#121212] rounded-3xl border border-[#2d2d2d] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2d2d2d] text-gray-400 uppercase font-mono bg-[#0d0d0d]">
                  <th className="py-3.5 px-4">Código / Imagen</th>
                  <th className="py-3.5 px-4">Nombre del Resource</th>
                  <th className="py-3.5 px-4">Precio (PayPal)</th>
                  <th className="py-3.5 px-4">Enlace de Descarga</th>
                  <th className="py-3.5 px-4">Ventas</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d2d]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-[#2d2d2d]" />
                        <span className="font-mono text-[10px] text-[#ef4444] font-black">{p.productIdCode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-black text-white">{p.name}</td>
                    <td className="py-3 px-4 font-mono font-black text-white">
                      {p.isFree ? <span className="text-[#ef4444]">GRATIS</span> : `$${p.price.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4">
                      {p.downloadUrl ? (
                        <a 
                          href={p.downloadUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-mono font-bold text-[#ef4444] hover:underline flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{p.downloadUrl}</span>
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">No configurado</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300 font-bold">{p.salesCount}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/30 cursor-pointer transition-colors"
                        title="Eliminar Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: CUSTOM ORDERS SHOWCASE MANAGEMENT */}
      {activeAdminTab === 'custom_orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Administración de Pedidos Personalizados</h2>
              <p className="text-xs text-gray-400">Edita las fotos y descripciones que aparecen en la sección de Trabajos Custom de la página de inicio.</p>
            </div>
            <button
              onClick={() => setShowCreateCustomModal(true)}
              className="px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Trabajo Personalizado</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customOrders.map((co) => (
              <div key={co.id} className="bg-[#121212] p-5 rounded-2xl border border-[#2d2d2d] relative group">
                <img src={co.imageUrl} alt={co.title} className="w-full h-40 object-cover rounded-xl mb-3 border border-[#2d2d2d]" />
                <span className="text-[10px] font-black text-[#ef4444] uppercase bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded">
                  {co.category}
                </span>
                <h3 className="text-sm font-black text-white mt-2">{co.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{co.description}</p>
                
                <div className="mt-4 pt-3 border-t border-[#2d2d2d] flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Entrega: <strong className="text-white">{co.deliveryTime}</strong></span>
                  <button
                    onClick={() => onDeleteCustomOrder(co.id)}
                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg cursor-pointer"
                    title="Eliminar Trabajo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: CONTROL DE LICENCIAS */}
      {activeAdminTab === 'licenses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-white">Control y Revocación de Licencias</h2>
            
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={licenseSearch}
                onChange={(e) => setLicenseSearch(e.target.value)}
                placeholder="Buscar por Licencia, IP o Usuario..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
              />
            </div>
          </div>

          <div className="bg-[#121212] rounded-3xl border border-[#2d2d2d] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2d2d2d] text-gray-400 uppercase font-mono bg-[#0d0d0d]">
                  <th className="py-3.5 px-4">License Key</th>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">IP & Puerto Servidor</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d2d]">
                {filteredLicenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[#ef4444]">{lic.licenseKey}</td>
                    <td className="py-3 px-4 font-bold text-white">{lic.username}</td>
                    <td className="py-3 px-4 text-gray-300">{lic.productName}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">
                      {lic.serverIp ? `${lic.serverIp}:${lic.serverPort}` : <span className="italic text-gray-600">No vinculado</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        lic.status === 'ACTIVE' 
                          ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {lic.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {lic.status === 'ACTIVE' ? (
                        <button
                          onClick={() => onChangeLicenseStatus(lic.licenseKey, 'REVOKED')}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px] font-bold border border-red-500/40 cursor-pointer"
                        >
                          Revocar
                        </button>
                      ) : (
                        <button
                          onClick={() => onChangeLicenseStatus(lic.licenseKey, 'ACTIVE')}
                          className="px-2.5 py-1 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] rounded-lg text-[10px] font-bold border border-[#ef4444]/40 cursor-pointer"
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: TICKETS DESK */}
      {activeAdminTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#2d2d2d] lg:col-span-1 space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-2">Tickets de Clientes</h3>
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedAdminTicket(t)}
                className={`p-3 rounded-xl border cursor-pointer ${
                  selectedAdminTicket?.id === t.id ? 'bg-[#ef4444]/10 border-[#ef4444]' : 'bg-[#0d0d0d] border-[#2d2d2d]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-[#ef4444] font-bold">{t.ticketNumber}</span>
                  <span className="font-bold text-white">{t.username}</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">{t.subject}</h4>
              </div>
            ))}
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-[#2d2d2d] lg:col-span-2 flex flex-col h-[480px]">
            {selectedAdminTicket ? (
              <>
                <div className="pb-3 border-b border-[#2d2d2d]">
                  <h3 className="text-base font-bold text-white">{selectedAdminTicket.subject}</h3>
                  <p className="text-xs text-[#ef4444] font-bold">Cliente: {selectedAdminTicket.username}</p>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {selectedAdminTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl max-w-lg text-xs ${
                        m.senderRole === 'ADMIN' ? 'bg-[#ef4444]/10 border border-[#ef4444]/30 ml-auto text-white' : 'bg-[#0d0d0d] border border-[#2d2d2d] text-gray-200'
                      }`}
                    >
                      <span className="font-bold text-[10px] text-gray-400 block mb-1">{m.sender} ({m.createdAt})</span>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleReplyTicketSubmit} className="pt-3 border-t border-[#2d2d2d] flex space-x-2">
                  <input
                    type="text"
                    value={adminReplyMsg}
                    onChange={(e) => setAdminReplyMsg(e.target.value)}
                    placeholder="Escribir respuesta administrativa oficial..."
                    className="flex-1 p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white text-xs focus:outline-none focus:border-[#ef4444]"
                  />
                  <button type="submit" className="px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs rounded-xl cursor-pointer">
                    Responder
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-xs text-gray-500">
                Selecciona un ticket para responder como Administrador.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 5: SYSTEM AUDIT LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d]">
          <h3 className="text-base font-bold text-white mb-4">Logs de Auditoría XF CODE</h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-xs flex items-start justify-between font-mono">
                <div>
                  <span className="text-[#ef4444] font-bold mr-2">[{log.action}]</span>
                  <span className="text-white font-bold mr-2">{log.target}</span>
                  <span className="text-gray-400">{log.details}</span>
                </div>
                <div className="text-right text-[10px] text-gray-500">
                  <div>{log.timestamp}</div>
                  <div>IP: {log.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 6: WEBHOOKS & PAYPAL SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d] space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-[#ef4444]" />
              <span>Configuración de PayPal y Webhooks de Discord</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Edita las URLs de webhooks de Discord para ventas y reseñas, y vincula tu cuenta de PayPal para recibir pagos.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Discord Webhooks */}
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#2d2d2d] space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2]" />
                <span>Webhooks de Discord</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Webhook de Compras y Ventas
                </label>
                <input
                  type="url"
                  value={wbPurchases}
                  onChange={(e) => setWbPurchases(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-mono focus:outline-none focus:border-[#ef4444]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Envía notificaciones automáticas con los datos del comprador y la licencia generada cuando alguien realice una compra.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Webhook de Reseñas de Clientes
                </label>
                <input
                  type="url"
                  value={wbReviews}
                  onChange={(e) => setWbReviews(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-mono focus:outline-none focus:border-[#ef4444]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Notifica en Discord cuando un usuario deje una reseña real sobre un recurso.
                </p>
              </div>
            </div>

            {/* PayPal Configuration */}
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#2d2d2d] space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC439]" />
                <span>Configuración de Pagos PayPal</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Cuenta / Email de PayPal Receptor
                </label>
                <input
                  type="email"
                  required
                  value={paypalMail}
                  onChange={(e) => setPaypalMail(e.target.value)}
                  placeholder="tu-correo-paypal@ejemplo.com"
                  className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-medium focus:outline-none focus:border-[#ef4444]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Los fondos de las compras de recursos irán dirigidos a esta dirección de PayPal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    value={paypalClient}
                    onChange={(e) => setPaypalClient(e.target.value)}
                    placeholder="PayPal Client ID..."
                    className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-mono focus:outline-none focus:border-[#ef4444]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Entorno
                  </label>
                  <select
                    value={paypalEnv}
                    onChange={(e) => setPaypalEnv(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-[#121212] border border-[#2d2d2d] text-white text-xs font-bold focus:outline-none focus:border-[#ef4444]"
                  >
                    <option value="sandbox">Sandbox (Pruebas)</option>
                    <option value="live">Live (Producción Real)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loadingSettings}
                className="px-8 py-3 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer"
              >
                {loadingSettings ? 'Guardando...' : 'Guardar Ajustes'}
              </button>
              {settingsSaved && (
                <span className="text-xs text-green-400 font-extrabold animate-pulse">
                  ✓ Configuración actualizada con éxito.
                </span>
              )}
            </div>

          </form>
        </div>
      )}

      {/* REGALAR RESOURCE MODAL */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121212] p-6 rounded-3xl border border-[#ef4444]/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2d2d]">
              <h3 className="text-base font-black text-[#ef4444] flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>REGALAR RESOURCE GRATUITAMENTE</span>
              </h3>
              <button onClick={() => setShowGiftModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGiftSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Usuario Destinatario</label>
                <input
                  type="text"
                  placeholder="ej: XF_Client_Vip (deja vacío para añadirlo a tu cuenta actual)"
                  value={giftTargetUser}
                  onChange={(e) => setGiftTargetUser(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Seleccionar Resource a Regalar</label>
                <select
                  required
                  value={giftProductId}
                  onChange={(e) => setGiftProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                >
                  <option value="">-- Selecciona el Producto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Otorgar Resource & Generar Licencia
              </button>

              {giftSuccessMsg && (
                <p className="text-center text-[#ef4444] font-bold">{giftSuccessMsg}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* CREATE RESOURCE MODAL */}
      {showCreateProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#121212] p-6 sm:p-8 rounded-3xl border border-[#2d2d2d] shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2d2d]">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#ef4444]" />
                <span>Publicar Resource en XF CODE</span>
              </h3>
              <button onClick={() => setShowCreateProductModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Nombre del Resource</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="ej: XF Radar GPS 3D"
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Código Identificador</label>
                  <input
                    type="text"
                    required
                    value={newProdCode}
                    onChange={(e) => setNewProdCode(e.target.value)}
                    placeholder="ej: XF-HUD-01"
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Precio PayPal ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={newProdIsFree}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444] font-mono"
                  />
                  <label className="inline-flex items-center space-x-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProdIsFree}
                      onChange={(e) => setNewProdIsFree(e.target.checked)}
                      className="accent-[#ef4444]"
                    />
                    <span className="text-gray-300 font-bold">Es Recurso Gratis</span>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Insignia (Badge)</label>
                  <select
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                  >
                    <option value="NUEVO">NUEVO</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="DESTACADO">DESTACADO</option>
                    <option value="FREE">FREE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 flex items-center justify-between">
                  <span>URL Foto del Producto (Imagen Principal)</span>
                  <ImageIcon className="w-3.5 h-3.5 text-[#ef4444]" />
                </label>
                <input
                  type="url"
                  required
                  value={newProdImageUrl}
                  onChange={(e) => setNewProdImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444] font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1 flex items-center justify-between">
                  <span>Botón de Archivo / Enlace Directo de Descarga</span>
                  <Download className="w-3.5 h-3.5 text-[#ef4444]" />
                </label>
                <input
                  type="url"
                  required
                  value={newProdDownloadUrl}
                  onChange={(e) => setNewProdDownloadUrl(e.target.value)}
                  placeholder="ej: https://mediafire.com/file/xf-script.zip"
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Descripción Corta</label>
                <textarea
                  rows={2}
                  required
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Descripción resumida..."
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl cursor-pointer transition-all shadow-lg text-sm"
              >
                Publicar Resource
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ORDER MODAL */}
      {showCreateCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] p-6 rounded-3xl border border-[#2d2d2d] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2d2d]">
              <h3 className="text-base font-black text-white">Añadir Trabajo Personalizado al Showcase</h3>
              <button onClick={() => setShowCreateCustomModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomOrderSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Título del Proyecto Custom</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="ej: Sistema de Guerra de Bandas 3D"
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Descripción corta</label>
                <textarea
                  rows={2}
                  required
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Detalles sobre el desarrollo custom..."
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">URL de Imagen del Trabajo</label>
                <input
                  type="url"
                  required
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Categoría</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Tiempo de Entrega</label>
                  <input
                    type="text"
                    value={customDeliveryTime}
                    onChange={(e) => setCustomDeliveryTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#ef4444]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl cursor-pointer transition-all shadow-lg text-sm"
              >
                Guardar Trabajo Personalizado
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
