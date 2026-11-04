import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { SearchModal } from './SearchModal';
import { 
  Search, Heart, Menu, X, Sparkles, Globe 
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { language, setLanguage, isRtl, t } = useLanguage();
  const { wishlistCount } = useWishlist();
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

            {/* Action Icons: Only Language (FR/AR) and Search */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Language Switcher Toggle (FR/AR) */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200/90 bg-white/95 hover:bg-white text-deep text-xs font-semibold shadow-2xs hover:border-rose-300 transition cursor-pointer"
                title={language === 'fr' ? 'Passer en Arabe (AR)' : 'Passer en Français (FR)'}
                aria-label="Changer de langue FR/AR"
              >
                <Globe className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span className="font-bold text-xs tracking-wider flex items-center gap-1">
                  <span className={language === 'fr' ? 'text-rose-900 font-extrabold underline decoration-rose-500 decoration-2 underline-offset-2' : 'text-stone-400 font-medium'}>
                    FR
                  </span>
                  <span className="text-stone-300 font-normal">/</span>
                  <span className={language === 'ar' ? 'text-rose-900 font-extrabold underline decoration-rose-500 decoration-2 underline-offset-2' : 'text-stone-400 font-medium'}>
                    AR
                  </span>
                </span>
              </button>

              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-deep hover:text-rose-800 hover:bg-rose-50 rounded-full transition cursor-pointer"
                title={t('nav.search')}
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
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
                      language === 'fr' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-deep'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      language === 'ar' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-deep'
                    }`}
                  >
                    AR
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
