import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { formatPriceDZD } from '@/data/wilayas';
import { 
  User, Package, Heart, MapPin, LogOut, Shield, CheckCircle2 
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-deep">Veuillez vous connecter</h2>
        <p className="text-xs text-mutedText">
          Connectez-vous pour accéder à vos informations personnelles et à votre historique de commandes.
        </p>
        <Link to="/login" className="bg-deep text-ivory text-xs font-semibold px-6 py-3 rounded-full inline-block">
          Se connecter
        </Link>
      </div>
    );
  }

  const userOrders = StorageService.getOrders().filter(o => 
    (o.userId && o.userId === user.id) || 
    (user.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase())
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-700">Espace Privilège</span>
          <h1 className="font-serif text-3xl font-bold text-deep">Bonjour, {user.fullName}</h1>
          <p className="text-xs text-mutedText mt-0.5">
            Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-brand-rose hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Accès Administration</span>
            </Link>
          )}
          <button
            onClick={() => logout()}
            className="border border-rose-200 bg-white hover:bg-rose-50 text-deep text-xs font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-stone-500" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Grid Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/account/orders"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card hover:shadow-luxury transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100 text-rose-700 flex items-center justify-center transition">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-deep">Mes Commandes</h3>
            <p className="text-xs text-mutedText">{userOrders.length} commande{userOrders.length > 1 ? 's' : ''} passée{userOrders.length > 1 ? 's' : ''}</p>
          </div>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card hover:shadow-luxury transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100 text-rose-700 flex items-center justify-center transition">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-deep">Mes Soins Favoris</h3>
            <p className="text-xs text-mutedText">Retrouvez votre sélection de cosmétiques</p>
          </div>
        </Link>

        <Link
          to="/track-order"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card hover:shadow-luxury transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100 text-rose-700 flex items-center justify-center transition">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-deep">Suivi de Colis</h3>
            <p className="text-xs text-mutedText">Suivre l'acheminement en temps réel</p>
          </div>
        </Link>
      </div>

      {/* Profile Form & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Profile Settings (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-5">
          <h2 className="font-serif text-lg font-bold text-deep pb-3 border-b border-rose-100 flex items-center gap-2">
            <User className="w-5 h-5 text-rose-600" />
            Mes informations personnelles
          </h2>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Vos informations ont été mises à jour avec succès.</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Adresse e-mail</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-mutedText mt-1 block">L'identifiant e-mail ne peut être modifié.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Téléphone de contact (Algérie)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550 xx xx xx"
                className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
              />
            </div>

            <button
              type="submit"
              className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-3 rounded-xl transition shadow-xs cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>

        {/* Recent Orders Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h2 className="font-serif text-lg font-bold text-deep flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-600" />
              Commandes récentes
            </h2>
            <Link to="/account/orders" className="text-xs font-bold text-rose-700 hover:text-rose-900">
              Voir tout l’historique →
            </Link>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-xs text-mutedText">Vous n'avez pas encore passé de commande avec ce compte.</p>
              <Link to="/shop" className="text-xs text-rose-800 font-bold underline">
                Découvrir nos soins de beauté
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.slice(0, 3).map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-ivory/50 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-deep">{order.orderNumber}</span>
                      <span className="text-mutedText">•</span>
                      <span className="text-mutedText">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-stone-600 mt-1">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''} • Wilaya de {order.shippingAddress.wilayaName}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="font-bold text-rose-900 font-serif text-sm">
                      {formatPriceDZD(order.total)}
                    </span>
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Détails de la commande →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
