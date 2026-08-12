import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  ShieldAlert, 
  KeyRound, 
  Award, 
  Menu, 
  X, 
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Code2,
  Globe
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenMtaApiDocs: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  user,
  onOpenAuth,
  onOpenMtaApiDocs,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'es' | 'en' | 'pt'>('es');

  const scrollToSection = (id: string) => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offsetTop = el.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 50);
  };

  const navLinks = [
    { id: 'home', label: 'Inicio', action: () => setActiveTab('home') },
    { id: 'resources', label: 'Productos', action: () => setActiveTab('resources') },
    { id: 'contacto', label: 'Contacto', action: () => scrollToSection('contacto') },
    { id: 'faq', label: 'Preguntas Frecuentes', action: () => scrollToSection('faq') },
    { id: 'api-docs', label: 'API MTA', action: onOpenMtaApiDocs, icon: Code2 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#2d2d2d] transition-all font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="XF CODE Logo" 
              className="h-11 w-auto object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" 
            />
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                XF <span className="text-[#ef4444] font-black">CODE</span>
              </span>
              <span className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase block -mt-1">
                MTA SA Resources & Scripts
              </span>
            </div>
          </div>

          {/* Center Nav Links - Desktop */}
          <div className="hidden lg:flex items-center justify-center space-x-1 flex-1 px-4">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              if (link.isExternal) {
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-[#a0a0a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                );
              }
              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-[#ef4444] text-white shadow-md font-black' 
                      : 'text-[#a0a0a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 text-[#ef4444]" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Discord Direct Icon Button */}
            <a
              href="https://discord.gg/Y6UteCZ2Mp"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:text-[#5865F2] text-gray-300 flex items-center justify-center transition-all shadow-sm"
              title="Comunidad Discord"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 flex items-center space-x-1 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#32d92e]" />
                <span className="uppercase font-mono">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#111214] border border-white/10 shadow-2xl p-1 z-50">
                  <button
                    onClick={() => { setCurrentLang('es'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-between ${currentLang === 'es' ? 'text-[#32d92e] bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    <span>🇪🇸 Español</span>
                    {currentLang === 'es' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('en'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-between ${currentLang === 'en' ? 'text-[#32d92e] bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    <span>🇺🇸 English</span>
                    {currentLang === 'en' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('pt'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-between ${currentLang === 'pt' ? 'text-[#32d92e] bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    <span>🇵🇹 Português</span>
                    {currentLang === 'pt' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-[#ef4444] hover:border-[#ef4444]/40 hover:bg-[#ef4444]/10 transition-all cursor-pointer"
              title="Carrito de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 pr-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#32d92e]/50 transition-all cursor-pointer"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#ef4444]"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-white max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111214] border border-white/10 shadow-2xl p-2 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10 text-center">
                      <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full mx-auto mb-1.5 border-2 border-[#ef4444]" />
                      <p className="text-xs font-extrabold text-white truncate">{user.username}</p>
                      <p className="text-[10px] text-[#ef4444] font-extrabold mt-0.5">CLIENTE VERIFICADO</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-gray-300 hover:text-white hover:bg-white/5 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#ef4444]" />
                        <span>Panel de Cliente</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenMtaApiDocs();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-gray-300 hover:text-white hover:bg-white/5 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-[#ef4444]" />
                        <span>Mis Licencias & API</span>
                      </button>

                      {user.isAdmin && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-black text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Panel Admin</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-full border-1.5 border-white/40 hover:bg-white hover:text-black text-white font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0d0d0d] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.isExternal) {
                  window.open(link.href, '_blank');
                } else if (link.action) {
                  link.action();
                }
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-between ${
                activeTab === link.id 
                  ? 'bg-[#ef4444] text-white font-black' 
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
