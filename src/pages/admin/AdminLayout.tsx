import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Package, Users, 
  Tag, FileText, Settings, ArrowLeft, LogOut, ShieldAlert, Lock, 
  Eye, EyeOff, ChevronLeft, ChevronRight, Menu, X, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, loginAsDemoAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Login form states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sidebar responsive & collapse states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('glow_admin_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('glow_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe administrateur.');
      return;
    }

    const isValid = StorageService.verifyAdminPassword(password);
    if (isValid) {
      loginAsDemoAdmin();
      navigate('/admin');
    } else {
      setError('Mot de passe incorrect. Accès refusé.');
    }
  };

  // Role Protection Guard with Secure Confidential Password Login (No password hint displayed)
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-200 shadow-luxury max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-deep text-rose-300 mx-auto flex items-center justify-center shadow-soft">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-deep">Accès Administrateur</h1>
            <p className="text-xs text-mutedText mt-1">
              Zone confidentielle réservée à la gestion de Glow Beauty.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 text-left animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1.5">
                Mot de passe d'authentification
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs p-3.5 pr-10 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-rose-400 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold py-3.5 px-4 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>S'authentifier</span>
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner à la boutique publique</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Vue d’ensemble', path: '/admin', icon: LayoutDashboard },
    { label: 'Produits', path: '/admin/products', icon: ShoppingBag },
    { label: 'Catégories', path: '/admin/categories', icon: FolderTree },
    { label: 'Commandes', path: '/admin/orders', icon: Package },
    { label: 'Clientes', path: '/admin/customers', icon: Users },
    { label: 'Codes Promo', path: '/admin/coupons', icon: Tag },
    { label: 'Marketing & Bannières', path: '/admin/content', icon: FileText },
    { label: 'Paramètres Boutique', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex text-deep">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Collapse / Close Controls */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen bg-deep text-ivory shrink-0 border-r border-stone-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-72`}
      >
        <div>
          {/* Sidebar Header with Brand & Close Button */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Link to="/" className="bg-white p-1 rounded-xl block shrink-0 shadow-xs">
                <img src="/logo.png" alt="Glow Beauty" className="h-8 w-auto object-contain" />
              </Link>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <Link to="/" className="font-serif text-sm font-bold tracking-tight text-ivory block leading-tight truncate">
                    Glow Beauty
                  </Link>
                  <p className="text-[9px] tracking-widest text-rose-300 uppercase font-semibold">
                    Administration
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Close Button (X) */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Button */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title={isSidebarCollapsed ? "Développer le menu latéral" : "Réduire / Fermer le menu"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-rose-900/60 text-white font-bold border border-rose-700/50 shadow-xs'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info & Store Return Footer */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            title="Voir la boutique publique"
            className={`flex items-center gap-2 text-xs text-rose-300 hover:text-rose-100 px-3 py-2 rounded-xl hover:bg-stone-800/60 transition ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Voir la boutique</span>}
          </Link>

          <div className={`flex items-center justify-between pt-2 border-t border-stone-800/80 px-2 text-xs ${
            isSidebarCollapsed ? 'flex-col gap-2' : ''
          }`}>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <p className="font-semibold text-white truncate text-[11px]">{user.fullName}</p>
                <p className="text-[10px] text-stone-400">Administrateur</p>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Déconnexion sécurisée"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Toggle Bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar with Sidebar Toggle */}
        <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Open Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-deep transition cursor-pointer"
              title="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Toggle Collapse Button */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition cursor-pointer"
              title={isSidebarCollapsed ? "Développer le menu latéral" : "Fermer / Réduire le menu"}
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-rose-700" />
                  <span>Afficher menu</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-stone-600" />
                  <span>Réduire menu</span>
                </>
              )}
            </button>

            <span className="text-xs text-mutedText hidden sm:inline">
              Administration Glow Beauty
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-stone-600 hover:text-deep px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Boutique publique</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-deep hidden md:inline text-[11px]">{user.fullName}</span>
              <button
                onClick={() => logout()}
                className="text-stone-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
