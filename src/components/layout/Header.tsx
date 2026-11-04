import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SearchModal } from './SearchModal';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles, LogOut, Shield, Globe 
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { language, setLanguage, isRtl, t } = useLanguage();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  // Listen for open-search-modal event from mobile bottom nav
  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpenSearch);
    return () => window.removeEventListener('open-search-modal', handleOpenSearch);
  }, []);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.skincare'), path: '/categories/soins-du-visage' },
    { label: t('nav.makeup'), path: '/categories/maquillage' },
    { label: t('nav.perfumes'), path: '/categories/parfums' },
    { label: t('nav.promotions'), path: '/shop?filter=promo', isPromo: true },
    { label: t('nav.wholesale'), path: '/wholesale', isPro: true },
    { label: t('nav.newArrivals'), path: '/shop?filter=new' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-rose-100'
            : 'bg-ivory border-b border-rose-100/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-deep p-2 rounded-lg hover:bg-rose-100/60 transition cursor-pointer"
                aria-label="Menu principal"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center py-2">
              <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <img
                  src="/logo.jpg"
                  alt="Jin Makeup - Cosmétiques & Beauté"
                  className="h-12 sm:h-16 w-12 sm:w-16 rounded-full object-cover border border-rose-200/80 shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-deep leading-tight group-hover:text-rose-900 transition">
                    {language === 'ar' ? 'جين ميكب' : 'JIN MAKEUP'}
                  </span>
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-rose-700 font-medium">
                    {language === 'ar' ? 'مستحضرات التجميل والعناية' : 'Cosmétiques & Beauté'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-medium tracking-wide uppercase transition-colors relative py-1 flex items-center ${
                      isActive
                        ? 'text-rose-900 font-semibold'
                        : link.isPromo
                        ? 'text-rose-600 font-semibold hover:text-rose-800'
                        : link.isPro
                        ? 'text-amber-900 font-bold hover:text-amber-700'
                        : 'text-deep/80 hover:text-rose-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isPromo && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 ml-1 mb-0.5" />
                    )}
                    {link.isPro && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 font-extrabold text-[9px] tracking-tight">
                        PRO
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Language Switcher Toggle */}
              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-rose-200/80 bg-white/90 hover:bg-white text-deep text-xs font-semibold shadow-2xs hover:border-rose-300 transition cursor-pointer"
                title={language === 'fr' ? 'Passer en Arabe (العربية)' : 'Passer en Français'}
                aria-label="Changer de langue / تغيير اللغة"
              >
                <Globe className="w-3.5 h-3.5 text-rose-700" />
                <span className="font-bold text-[11px] tracking-wide text-rose-900">
                  {language === 'fr' ? 'العربية' : 'FR'}
                </span>
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-deep hover:text-rose-800 hover:bg-rose-50 rounded-full transition cursor-pointer"
                title={t('nav.search')}
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-deep hover:text-rose-800 hover:bg-rose-50 rounded-full transition relative hidden sm:flex cursor-pointer"
                title="Mes Favoris"
                aria-label="Mes Favoris"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="p-2 text-deep hover:text-rose-800 hover:bg-rose-50 rounded-full transition flex items-center gap-1 cursor-pointer"
                  title="Mon Compte"
                  aria-label="Menu du compte utilisateur"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3 text-mutedText hidden md:inline" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury border border-rose-100 py-2 z-50 animate-fadeIn">
                    {user ? (
                      <div>
                        <div className="px-4 py-2 border-b border-rose-100">
                          <p className="text-xs text-mutedText">Connecté en tant que</p>
                          <p className="text-sm font-semibold text-deep truncate">{user.fullName}</p>
                          <p className="text-[11px] text-rose-700 capitalize font-medium">{user.role}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-rose-800 hover:bg-rose-50 font-semibold"
                          >
                            <Shield className="w-4 h-4 text-rose-700" />
                            Tableau de bord Admin
                          </Link>
                        )}

                        <Link
                          to="/account"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-deep hover:bg-ivory"
                        >
                          <User className="w-4 h-4 text-mutedText" />
                          Mon profil
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-deep hover:bg-ivory"
                        >
                          <ShoppingBag className="w-4 h-4 text-mutedText" />
                          Mes commandes
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-deep hover:bg-ivory sm:hidden"
                        >
                          <Heart className="w-4 h-4 text-mutedText" />
                          Mes favoris ({wishlistCount})
                        </Link>

                        <div className="border-t border-rose-100 mt-1 pt-1">
                          <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        <Link
                          to="/login"
                          className="block text-center bg-deep hover:bg-rose-900 text-ivory text-xs font-semibold py-2 rounded-xl transition"
                        >
                          Se connecter
                        </Link>
                        <Link
                          to="/register"
                          className="block text-center text-xs text-deep hover:bg-rose-50 py-2 rounded-xl font-medium"
                        >
                          Créer un compte
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-deep hover:text-rose-800 hover:bg-rose-50 rounded-full transition relative cursor-pointer"
                title="Panier d'achats"
                aria-label="Panier d'achats"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-deep text-ivory text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-rose-50 text-rose-900 font-bold'
                      : link.isPromo
                      ? 'text-rose-600 font-bold'
                      : link.isPro
                      ? 'text-amber-900 font-bold bg-amber-50/60'
                      : 'text-deep hover:bg-ivory'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isPro && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-extrabold text-[10px]">
                      PRO
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="border-t border-rose-100 pt-3 flex flex-col gap-2">
              {/* Language Switcher in Mobile Drawer */}
              <div className="flex items-center justify-between text-xs px-3 py-1 bg-ivory rounded-xl border border-rose-100">
                <span className="text-stone-600 font-medium">
                  {language === 'ar' ? 'اللغة :' : 'Langue :'}
                </span>
                <div className="flex items-center rounded-lg bg-stone-200/60 p-0.5 gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('fr')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      language === 'fr' ? 'bg-white text-deep shadow-xs' : 'text-stone-600 hover:text-deep'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      language === 'ar' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-deep'
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              <Link
                to="/track-order"
                className="text-xs text-stone-600 hover:text-deep flex items-center gap-1.5 px-3 py-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('nav.trackOrder')}</span>
              </Link>
              <Link
                to="/wishlist"
                className="text-xs text-stone-600 hover:text-deep flex items-center gap-1.5 px-3 py-1"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('nav.wishlist')} ({wishlistCount})</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
