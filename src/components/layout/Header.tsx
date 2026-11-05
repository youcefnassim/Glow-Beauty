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
      <header className="sticky top-1.5 sm:top-2.5 z-40 px-2 sm:px-4 lg:px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Floating Glassmorphism Capsule Bar */}
          <div
            className={`rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 flex items-center justify-between transition-all duration-300 border ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-xl border-rose-200/80 shadow-[0_8px_30px_rgba(225,29,72,0.08)]'
                : 'bg-white/90 backdrop-blur-md border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Left section: Hamburger (mobile) + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-deep p-1.5 rounded-xl hover:bg-rose-100/50 transition cursor-pointer"
                aria-label="Menu principal"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-800" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Brand Logo & Name */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Jin Makeup"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-1 ring-rose-200/80 shadow-2xs transition-transform duration-300 group-hover:scale-105 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-serif text-sm sm:text-base font-bold tracking-tight text-deep leading-none group-hover:text-rose-900 transition">
                    {language === 'ar' ? 'جين ميكب' : 'JIN MAKEUP'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-rose-700 font-medium leading-none mt-0.5">
                    {language === 'ar' ? 'مستحضرات التجميل' : 'Cosmétiques & Beauté'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 flex items-center ${
                      isActive
                        ? 'text-rose-900'
                        : link.isPromo
                        ? 'text-rose-600 hover:text-rose-800'
                        : link.isPro
                        ? 'text-amber-900 hover:text-amber-700'
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

            {/* Right section: Language Switcher (FR/AR) & Search */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Switcher Toggle (FR/AR) */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full border border-rose-200/90 bg-white/95 hover:bg-white text-deep text-[11px] font-bold shadow-2xs hover:border-rose-300 transition cursor-pointer"
                title={language === 'fr' ? 'Passer en Arabe (AR)' : 'Passer en Français (FR)'}
                aria-label="Changer de langue FR/AR"
              >
                <Globe className="w-3 h-3 text-rose-700 shrink-0" />
                <span className="tracking-wider flex items-center gap-0.5">
                  <span className={language === 'fr' ? 'text-rose-900 font-extrabold underline decoration-rose-500 decoration-1.5 underline-offset-2' : 'text-stone-400 font-medium'}>
                    FR
                  </span>
                  <span className="text-stone-300 font-normal">/</span>
                  <span className={language === 'ar' ? 'text-rose-900 font-extrabold underline decoration-rose-500 decoration-1.5 underline-offset-2' : 'text-stone-400 font-medium'}>
                    AR
                  </span>
                </span>
              </button>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-deep hover:text-rose-800 hover:bg-rose-100/50 rounded-full transition cursor-pointer"
                title={t('nav.search')}
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Floating Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-rose-100 shadow-xl rounded-2xl p-3.5 space-y-2.5 animate-fadeIn">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium ${
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

              <div className="border-t border-rose-100 pt-2.5 flex flex-col gap-2">
                {/* Language Switcher in Mobile Drawer */}
                <div className="flex items-center justify-between text-xs px-3 py-1 bg-ivory rounded-xl border border-rose-100">
                  <span className="text-stone-600 font-medium text-[11px]">
                    {language === 'ar' ? 'اللغة :' : 'Langue :'}
                  </span>
                  <div className="flex items-center rounded-lg bg-stone-200/60 p-0.5 gap-1">
                    <button
                      type="button"
                      onClick={() => setLanguage('fr')}
                      className={`px-3 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        language === 'fr' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-deep'
                      }`}
                    >
                      FR
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ar')}
                      className={`px-3 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        language === 'ar' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-deep'
                      }`}
                    >
                      AR
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-stone-500">
                  <Link
                    to="/track-order"
                    className="hover:text-deep flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    <span>{t('nav.trackOrder')}</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="hover:text-deep flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 text-rose-500" />
                    <span>{t('nav.wishlist')} ({wishlistCount})</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
