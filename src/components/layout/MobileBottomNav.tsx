import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { StorageService } from '@/services/storage';
import { Home, Grid, Search, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const settings = StorageService.getSettings();

  // WhatsApp clean phone
  const rawPhone = settings.whatsappNotificationPhone || settings.contactPhone || '0550123456';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
  else if (!cleanPhone.startsWith('213')) cleanPhone = '213' + cleanPhone;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Bonjour Glow Beauty DZ, j'aimerais avoir des renseignements sur vos produits 🌸")}`;

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop' || location.pathname.startsWith('/categories');

  return (
    <nav 
      aria-label="Navigation mobile"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200/60 shadow-luxury py-1.5 px-3 flex items-center justify-around lg:hidden transition-all duration-300"
    >
      {/* 1. Accueil */}
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
          isHome ? 'text-rose-800 font-bold' : 'text-stone-500 hover:text-deep'
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight">Accueil</span>
      </Link>

      {/* 2. Boutique / Catégories */}
      <Link 
        to="/shop" 
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
          isShop ? 'text-rose-800 font-bold' : 'text-stone-500 hover:text-deep'
        }`}
      >
        <Grid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight">Boutique</span>
      </Link>

      {/* 3. WhatsApp Direct (Iconic in DZ E-Commerce) */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 text-emerald-600 hover:text-emerald-700 transition"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.013.82 2.796.82 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.708 0-3.32-.435-4.733-1.2l-5.267 1.382 1.407-5.139c-.878-1.488-1.407-3.232-1.407-5.043 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
          </svg>
        </div>
        <span className="text-[9px] font-bold text-emerald-700">WhatsApp</span>
      </a>

      {/* 4. Recherche */}
      <button 
        onClick={handleOpenSearch}
        type="button"
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-stone-500 hover:text-deep transition cursor-pointer"
      >
        <Search className="w-5 h-5 stroke-2" />
        <span className="text-[10px] tracking-tight">Recherche</span>
      </button>

      {/* 5. Panier */}
      <button 
        onClick={() => setIsCartOpen(true)}
        type="button"
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-stone-500 hover:text-deep transition relative cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-2" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-brand-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Panier</span>
      </button>
    </nav>
  );
};
