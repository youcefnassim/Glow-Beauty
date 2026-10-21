import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Package, Users, 
  Tag, FileText, Settings, ArrowLeft, LogOut, ShieldAlert, Sparkles 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, loginAsDemoAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Role Protection Guard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-luxury max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-deep">Accès Réservé à l'Administration</h1>
            <p className="text-xs text-mutedText mt-1">
              Cette zone nécessite des privilèges d'administrateur de Glow Beauty.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                loginAsDemoAdmin();
                navigate('/admin');
              }}
              className="w-full bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold py-3 px-4 rounded-xl transition shadow-md cursor-pointer"
            >
              Se connecter en tant qu'Administrateur Démo
            </button>
            <Link
              to="/"
              className="block text-xs text-mutedText hover:text-deep underline"
            >
              ← Retourner à la boutique
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
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-deep">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-deep text-ivory shrink-0 border-r border-stone-800 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center gap-3">
            <Link to="/" className="bg-white p-1 rounded-xl block shrink-0 shadow-xs">
              <img src="/logo.png" alt="Glow Beauty" className="h-9 w-auto object-contain" />
            </Link>
            <div>
              <Link to="/" className="font-serif text-base font-bold tracking-tight text-ivory block leading-tight">
                Glow Beauty
              </Link>
              <p className="text-[9px] tracking-widest text-rose-300 uppercase font-semibold">
                Administration
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-rose-900/60 text-white font-bold border border-rose-700/50 shadow-xs'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info & Store Return */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-rose-300 hover:text-rose-100 px-3 py-2 rounded-xl hover:bg-stone-800/60 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voir la boutique publique</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 px-3 text-xs">
            <div className="truncate">
              <p className="font-semibold text-white truncate text-[11px]">{user.fullName}</p>
              <p className="text-[10px] text-stone-400">Administrateur</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-stone-400 hover:text-red-400 p-1 cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
