import React, { useState, useEffect } from 'react';
import { Product, User, License, Order, Review, Ticket, TopBuyer, AuditLog, CustomOrderItem } from './types';
import { INITIAL_CUSTOM_ORDERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminPanel } from './components/AdminPanel';
import { TopBuyersView } from './components/TopBuyersView';
import { CustomOrdersScroller } from './components/CustomOrdersScroller';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { MtaApiDocsModal } from './components/MtaApiDocsModal';
import { Footer } from './components/Footer';
import { Sparkles, Award, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');

  // Application Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderItem[]>(INITIAL_CUSTOM_ORDERS);

  // Modals & UI Selection State
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMtaApiDocsOpen, setIsMtaApiDocsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [paypalEmail, setPaypalEmail] = useState('pagos@xfcode.com');

  // Helper for safe JSON parsing from responses
  const safeJson = async (res: Response) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  // Fetch initial data from Express backend
  const fetchData = async () => {
    try {
      // Products
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await safeJson(pRes);
        setProducts(pData.products || []);
      }

      // Current User
      const uRes = await fetch('/api/auth/me');
      if (uRes.ok) {
        const uData = await safeJson(uRes);
        setUser(uData.user);
      }

      // Licenses
      const lRes = await fetch('/api/licenses');
      if (lRes.ok) {
        const lData = await safeJson(lRes);
        setLicenses(lData.licenses || []);
      }

      // Orders
      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const oData = await safeJson(oRes);
        setOrders(oData.orders || []);
      }

      // Top Buyers
      const tbRes = await fetch('/api/top-buyers');
      if (tbRes.ok) {
        const tbData = await safeJson(tbRes);
        setTopBuyers(tbData.topBuyers || []);
      }

      // Tickets
      const tRes = await fetch('/api/tickets');
      if (tRes.ok) {
        const tData = await safeJson(tRes);
        setTickets(tData.tickets || []);
      }

      // Public Settings (PayPal)
      const sRes = await fetch('/api/settings/public');
      if (sRes.ok) {
        const sData = await safeJson(sRes);
        if (sData.paypalEmail) setPaypalEmail(sData.paypalEmail);
      }

    } catch (err) {
      console.log('Error initializing XF CODE Store data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch reviews when product details opened
  useEffect(() => {
    if (selectedProduct) {
      fetch(`/api/reviews/${selectedProduct.id}`)
        .then(safeJson)
        .then((data) => setProductReviews(data.reviews || []))
        .catch(() => setProductReviews([]));
    }
  }, [selectedProduct]);

  // Handler functions
  const handleAddToCart = (product: Product) => {
    if (!cartItems.find(item => item.id === product.id)) {
      setCartItems([...cartItems, product]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleLogin = async (emailOrUsername: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password: pass })
    });
    const data = await safeJson(res);
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }
    if (data.user) {
      setUser(data.user);
    }
    await fetchData();
  };

  const handleRegister = async (username: string, email: string, pass: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password: pass })
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err.error || 'Error al registrar usuario');
    }
    await fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setActiveTab('home');
  };

  const handleCheckout = async (paymentMethod: 'CARD' | 'PAYPAL' | 'DISCORD_PAY' | 'FREE') => {
    for (const item of cartItems) {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id, paymentMethod: paymentMethod === 'FREE' ? 'FREE' : 'PAYPAL' })
      });
      if (!res.ok) {
        throw new Error('Falló el procesamiento del pago.');
      }
    }
    await fetchData();
  };

  const handleBindLicenseIp = async (licenseKey: string, serverIp: string, serverPort: number) => {
    const res = await fetch('/api/licenses/bind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, serverIp, serverPort })
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err.error || 'Error al vincular servidor.');
    }
    await fetchData();
  };

  const handleResetLicenseIp = async (licenseKey: string) => {
    const res = await fetch('/api/licenses/reset-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey })
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err.error || 'Error en Reset IP.');
    }
    await fetchData();
  };

  const handleDownloadResource = async (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (p && p.downloadUrl) {
      window.open(p.downloadUrl, '_blank');
      return;
    }
    const res = await fetch(`/api/downloads/${productId}`);
    if (res.ok) {
      const data = await safeJson(res);
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        alert(`[XF CODE DESCARGA PROTEGIDA]\n\nPaquete: ${data.filename}\nChecksum: ${data.checksum}\n\n${data.instructions}`);
      }
    } else {
      alert('Debes adquirir este recurso antes de descargarlo.');
    }
  };

  const handleAddReview = async (productId: string, rating: number, comment: string) => {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment })
    });
    // refresh reviews
    const rRes = await fetch(`/api/reviews/${productId}`);
    if (rRes.ok) {
      const rData = await safeJson(rRes);
      setProductReviews(rData.reviews || []);
    }
    await fetchData();
  };

  const handleCreateTicket = async (subject: string, category: string, message: string, productId?: string) => {
    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, category, message, productId })
    });
    await fetchData();
  };

  const handleSendMessageTicket = async (ticketId: string, message: string) => {
    await fetch(`/api/tickets/${ticketId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, isAdminResponse: false })
    });
    await fetchData();
  };

  const handleUpdateUserSettings = async (settings: Partial<User>) => {
    const res = await fetch('/api/user/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      const data = await safeJson(res);
      setUser(data.user);
    }
  };

  // Admin Actions
  const handleCreateProduct = async (pData: Partial<Product>) => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pData)
    });
    if (!res.ok) throw new Error('Error al crear producto');
    await fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  const handleGiftProduct = async (targetUsername: string, productId: string) => {
    const res = await fetch('/api/admin/gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUsername, productId })
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err.error || 'Error al regalar producto.');
    }
    await fetchData();
  };

  const handleChangeLicenseStatus = async (licenseKey: string, status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED') => {
    await fetch('/api/admin/licenses/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, status })
    });
    await fetchData();
  };

  const handleAdminReplyTicket = async (ticketId: string, message: string) => {
    await fetch(`/api/tickets/${ticketId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, isAdminResponse: true })
    });
    await fetchData();
  };

  const handleCreateCustomOrder = async (cData: Omit<CustomOrderItem, 'id'>) => {
    const newItem: CustomOrderItem = {
      ...cData,
      id: 'custom-' + Date.now()
    };
    setCustomOrders(prev => [newItem, ...prev]);
  };

  const handleDeleteCustomOrder = async (id: string) => {
    setCustomOrders(prev => prev.filter(c => c.id !== id));
  };

  // Dynamic Metrics Calculation
  const totalClientsCount = Math.max(orders.length + 12, new Set(orders.map(o => o.username)).size + 42);
  const totalProductsCount = products.length;
  const totalSalesCount = orders.length + products.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  const featuredProducts = products.filter(p => p.isFeatured);
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen bg-[#0a0505] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#ef4444] selection:text-white">
      
      {/* Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMtaApiDocs={() => setIsMtaApiDocsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Views */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Banner */}
            <HeroSection
              onExplore={() => setActiveTab('resources')}
              onExploreFree={() => {
                setSelectedCategory('Free Resources');
                setActiveTab('resources');
              }}
              onOpenMtaApiDocs={() => setIsMtaApiDocsOpen(true)}
              totalProductsCount={totalProductsCount}
              totalClientsCount={totalClientsCount}
              totalSalesCount={totalSalesCount}
            />

            {/* Category Filter Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('resources');
              }}
            />

            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#2d2d2d] font-['Poppins',sans-serif]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black text-[#ef4444] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#ef4444]" />
                    <span>Catálogo XF CODE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Resources Destacados</h2>
                </div>
                <button
                  onClick={() => setActiveTab('resources')}
                  className="text-xs font-black text-[#ef4444] hover:underline cursor-pointer"
                >
                  Ver todo el catálogo →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    isOwned={user?.purchasedProductIds.includes(p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Custom Orders Scroller */}
            <CustomOrdersScroller customOrders={customOrders} />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* FAQ Section */}
            <FaqSection />

            {/* Discord & Contact Section */}
            <ContactSection />

          </div>
        )}

        {/* VIEW 2: RESOURCES CATALOG (/resources & free) */}
        {(activeTab === 'resources' || activeTab === 'free') && (
          <div>
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <ProductGrid
              products={products}
              selectedCategory={activeTab === 'free' ? 'Free Resources' : selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
              userPurchasedIds={user?.purchasedProductIds || []}
            />
          </div>
        )}

        {/* VIEW 4: CLIENT DASHBOARD (/dashboard) */}
        {activeTab === 'dashboard' && user && (
          <ClientDashboard
            user={user}
            licenses={licenses}
            orders={orders}
            products={products}
            tickets={tickets}
            onBindLicenseIp={handleBindLicenseIp}
            onResetLicenseIp={handleResetLicenseIp}
            onDownloadResource={handleDownloadResource}
            onCreateTicket={handleCreateTicket}
            onSendMessageTicket={handleSendMessageTicket}
            onUpdateUserSettings={handleUpdateUserSettings}
            onOpenProductDetail={setSelectedProduct}
          />
        )}

        {/* VIEW 5: ADMIN PANEL (/admin) */}
        {activeTab === 'admin' && user?.isAdmin && (
          <AdminPanel
            products={products}
            licenses={licenses}
            orders={orders}
            tickets={tickets}
            logs={logs}
            customOrders={customOrders}
            onCreateProduct={handleCreateProduct}
            onDeleteProduct={handleDeleteProduct}
            onGiftProduct={handleGiftProduct}
            onChangeLicenseStatus={handleChangeLicenseStatus}
            onAdminReplyTicket={handleAdminReplyTicket}
            onCreateCustomOrder={handleCreateCustomOrder}
            onDeleteCustomOrder={handleDeleteCustomOrder}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenMtaApiDocs={() => setIsMtaApiDocsOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isOwned={user?.purchasedProductIds.includes(selectedProduct?.id || '')}
        reviews={productReviews}
        onAddReview={handleAddReview}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        onCheckout={handleCheckout}
        paypalEmail={paypalEmail}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <MtaApiDocsModal
        isOpen={isMtaApiDocsOpen}
        onClose={() => setIsMtaApiDocsOpen(false)}
      />

    </div>
  );
}
