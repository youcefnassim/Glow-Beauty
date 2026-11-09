import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { StorageService } from '@/services/storage';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Package, Users, 
  Tag, FileText, Settings, ArrowLeft, LogOut, ShieldAlert, Lock, 
  Eye, EyeOff, ChevronLeft, ChevronRight, Menu, X, PanelLeftClose, PanelLeftOpen,
  UserCheck, Edit3, Globe 
} from 'lucide-react';
import { AdminProfileModal } from '@/components/admin/AdminProfileModal';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, loginAsDemoAdmin } = useAuth();
  const { language, setLanguage, isRtl, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Login form states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Profile Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
      setError(t('admin.login.errorEmpty'));
      return;
    }

    const isValid = StorageService.verifyAdminPassword(password);
    if (isValid) {
      loginAsDemoAdmin();
      navigate('/admin');
    } else {
      setError(t('admin.login.errorWrong'));
    }
  };

  // Role Protection Guard with Secure Password Login
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-200 shadow-luxury max-w-md w-full text-center space-y-6 relative">
          
          {/* Language Switcher in Login Gate */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-200 bg-stone-50 hover:bg-white text-deep text-xs font-bold transition shadow-2xs cursor-pointer"
              title={language === 'fr' ? 'Passer en Arabe (العربية)' : 'Passer en Français'}
            >
              <Globe className="w-3.5 h-3.5 text-rose-700" />
              <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
            </button>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-deep text-rose-300 mx-auto flex items-center justify-center shadow-soft">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-deep">{t('admin.login.title')}</h1>
            <p className="text-xs text-mutedText mt-1">
              {t('admin.login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 text-start animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-start">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1.5">
                {t('admin.login.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.login.passwordPlaceholder')}
                  className="w-full text-xs p-3.5 pe-10 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-rose-400 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
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
              <span>{t('admin.login.submit')}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{t('admin.login.backToStore')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: t('admin.nav.dashboard'), path: '/admin', icon: LayoutDashboard },
    { label: t('admin.nav.products'), path: '/admin/products', icon: ShoppingBag },
    { label: t('admin.nav.categories'), path: '/admin/categories', icon: FolderTree },
    { label: t('admin.nav.orders'), path: '/admin/orders', icon: Package },
    { label: t('admin.nav.customers'), path: '/admin/customers', icon: Users },
    { label: t('admin.nav.coupons'), path: '/admin/coupons', icon: Tag },
    { label: t('admin.nav.content'), path: '/admin/content', icon: FileText },
    { label: t('admin.nav.settings'), path: '/admin/settings', icon: Settings },
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
        className={`fixed lg:sticky top-0 z-50 h-screen bg-deep text-ivory shrink-0 border-e border-stone-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isMobileSidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        } ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-72 ${isRtl ? 'right-0' : 'left-0'}`}
      >
        <div>
          {/* Sidebar Header with Brand & Close Button */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Link to="/" className="bg-white p-0.5 rounded-xl block shrink-0 shadow-xs overflow-hidden">
                <img src="/logo.jpg" alt="Jin Makeup" className="h-8 w-8 rounded-lg object-cover" />
              </Link>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <Link to="/" className="font-serif text-sm font-bold tracking-tight text-ivory block leading-tight truncate">
                    Jin Makeup
                  </Link>
                  <p className="text-[9px] tracking-widest text-rose-300 uppercase font-semibold">
                    {t('admin.nav.title')}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Close Button (X) */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title={t('admin.nav.closeMenu')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Button */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title={isSidebarCollapsed ? t('admin.nav.expand') : t('admin.nav.collapse')}
            >
              {isSidebarCollapsed ? (
                isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              ) : (
                isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              )}
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

        {/* User info, Language Switcher & Store Return Footer */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          {/* Mobile Language Switcher inside Drawer */}
          <div className="lg:hidden pb-1">
            <button
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-400" />
                <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-900/50 px-2 py-0.5 rounded">
                {language.toUpperCase()}
              </span>
            </button>
          </div>

          <Link
            to="/"
            title={t('admin.nav.viewStore')}
            className={`flex items-center gap-2 text-xs text-rose-300 hover:text-rose-100 px-3 py-2 rounded-xl hover:bg-stone-800/60 transition ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0 rtl:rotate-180" />
            {!isSidebarCollapsed && <span className="truncate">{t('admin.nav.viewStore')}</span>}
          </Link>

          <div className={`flex items-center justify-between pt-2 border-t border-stone-800/80 px-2 text-xs ${
            isSidebarCollapsed ? 'flex-col gap-2' : ''
          }`}>
            {!isSidebarCollapsed ? (
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="text-start group cursor-pointer flex-1 min-w-0 me-2 p-1.5 rounded-xl hover:bg-stone-800/80 transition"
                title={t('admin.nav.editProfile')}
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="font-semibold text-white truncate text-[11px] group-hover:text-rose-300 transition">
                    {user.fullName}
                  </p>
                  <Edit3 className="w-3 h-3 text-stone-400 group-hover:text-rose-300 shrink-0" />
                </div>
                <p className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{t('admin.nav.role')} • {t('admin.nav.edit')}</span>
                </p>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="text-stone-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title={t('admin.nav.editProfile')}
              >
                <UserCheck className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => logout()}
              className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer shrink-0"
              title={t('admin.nav.logoutSecure')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Toggle Bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar with Sidebar Toggle & Language Switcher */}
        <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Open Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-deep transition cursor-pointer"
              title={t('admin.nav.openMenu')}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Toggle Collapse Button */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition cursor-pointer"
              title={isSidebarCollapsed ? t('admin.nav.expand') : t('admin.nav.collapse')}
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-rose-700 rtl:rotate-180" />
                  <span>{t('admin.nav.expand')}</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-stone-600 rtl:rotate-180" />
                  <span>{t('admin.nav.collapse')}</span>
                </>
              )}
            </button>

            <span className="text-xs text-mutedText hidden sm:inline">
              {t('admin.nav.headerSubtitle')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Language Switcher Button (FR / AR) */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-deep text-xs font-bold transition shadow-2xs cursor-pointer"
              title={language === 'fr' ? 'Passer en Arabe (العربية)' : 'Passer en Français'}
              aria-label="Changer la langue du tableau de bord"
            >
              <Globe className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-stone-600 hover:text-deep px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span className="hidden sm:inline">{t('admin.nav.publicStore')}</span>
            </Link>

            <div className="flex items-center gap-2 ps-2 sm:ps-3 border-s border-stone-200">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-deep transition cursor-pointer border border-stone-200/60"
                title={t('admin.nav.editProfile')}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-deep text-[11px]">{user.fullName}</span>
                <Edit3 className="w-3 h-3 text-stone-400" />
              </button>

              <button
                onClick={() => logout()}
                className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                title={t('admin.nav.logout')}
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

      {/* Admin Profile & Credentials Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
};

export default AdminLayout;
