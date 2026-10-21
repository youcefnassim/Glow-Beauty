import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images[1]?.url || primaryImage;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) 
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, defaultVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-rose-100/70 shadow-xs hover:shadow-card hover:border-rose-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Compact Badges in top-left */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
            -{discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-deep text-ivory text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
            Nouveau
          </span>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <span className="bg-brand-rose text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
            Top Vente
          </span>
        )}
      </div>

      {/* Compact Wishlist Button in top-right */}
      <button
        onClick={handleWishlistClick}
        aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition shadow-2xs cursor-pointer ${
          isFavorited 
            ? 'bg-rose-50 text-rose-600 border border-rose-200' 
            : 'bg-white/90 text-stone-400 hover:text-rose-600 hover:bg-white border border-stone-100'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* 1:1 Square Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={primaryImage}
          alt={product.nameFr}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={secondaryImage}
            alt={product.nameFr}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* Desktop Quick Add overlay button */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`w-full text-[11px] font-semibold py-2 px-2.5 rounded-lg shadow-sm backdrop-blur-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
              justAdded 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white/95 hover:bg-deep hover:text-ivory text-deep'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock <= 0 ? 'Épuisé' : 'Ajouter au panier'}</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Compact Content */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-1">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-rose-700/80 truncate block mb-0.5">
            {product.brand}
          </span>

          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-xs sm:text-sm font-semibold text-deep line-clamp-2 leading-tight hover:text-rose-700 transition min-h-[2.1rem] sm:min-h-[2.3rem]">
              {product.nameFr}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px]">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-current" />
            <span className="font-semibold text-deep">{product.rating.toFixed(1)}</span>
            <span className="text-mutedText">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-1.5 pt-2 border-t border-rose-100/60 flex items-center justify-between gap-1">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-serif text-xs sm:text-sm md:text-base font-bold text-deep">
                {formatPriceDZD(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-mutedText line-through">
                  {formatPriceDZD(product.compareAtPrice!)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-[9px] text-amber-700 font-medium truncate mt-0.5">
                Plus que {product.stock} en stock
              </p>
            )}
          </div>

          {/* Mobile / Quick Add Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            aria-label={`Ajouter ${product.nameFr} au panier`}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition border shrink-0 cursor-pointer disabled:opacity-40 ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-rose-50 text-rose-700 hover:bg-deep hover:text-ivory border-rose-200/80'
            }`}
          >
            {justAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
