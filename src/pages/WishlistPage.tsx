import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, wishlistCount } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-mutedText mb-2">
            <Link to="/" className="hover:text-deep transition">Accueil</Link>
            <span>/</span>
            <span className="text-deep font-semibold">Mes Favoris</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-deep">Mes Soins Favoris</h1>
          <p className="text-xs text-mutedText mt-0.5">
            {wishlistCount} produit{wishlistCount > 1 ? 's' : ''} sauvegardé{wishlistCount > 1 ? 's' : ''}
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:text-rose-950 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continuer mes découvertes</span>
        </Link>
      </div>

      {wishlistCount === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-card space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-deep">Votre liste de favoris est vide</h2>
          <p className="text-xs text-mutedText leading-relaxed">
            Parcourez nos rituels de beauté et cliquez sur le cœur pour conserver vos soins préférés.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-3 rounded-full transition shadow-luxury"
          >
            Explorer la boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
