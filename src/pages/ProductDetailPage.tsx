import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Product, ProductVariant, Review } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { 
  Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, 
  ChevronRight, Check, Minus, Plus, Sparkles, MessageSquare, AlertCircle 
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage' | 'reviews'>('desc');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // New review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const found = StorageService.getProductBySlug(slug);
    if (found) {
      setProduct(found);
      setSelectedImageIndex(0);
      setQuantity(1);
      if (found.variants && found.variants.length > 0) {
        setSelectedVariant(found.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setReviews(StorageService.getReviews(found.id));
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-deep mb-3">Produit introuvable</h2>
        <p className="text-sm text-mutedText mb-6">Le soin que vous recherchez n'est plus disponible ou l'adresse est incorrecte.</p>
        <Link to="/shop" className="bg-deep text-ivory text-xs font-semibold px-6 py-3 rounded-full">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const hasDiscount = comparePrice && comparePrice > currentPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((comparePrice! - currentPrice) / comparePrice!) * 100) 
    : 0;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = () => {
    const res = addItem(product, selectedVariant, quantity);
    if (!res.success) {
      setAddMessage(res.message || 'Erreur lors de l’ajout.');
    } else {
      setAddMessage(null);
    }
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim() || !newReviewComment.trim()) return;

    StorageService.addReview({
      productId: product.id,
      userName: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      isVerifiedPurchase: true,
    });

    setReviews(StorageService.getReviews(product.id));
    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  const allProducts = StorageService.getProducts();
  const relatedProducts = allProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-mutedText">
        <Link to="/" className="hover:text-deep transition">Accueil</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-deep transition">Boutique</Link>
        <span>/</span>
        <Link to={`/categories/${product.categorySlug}`} className="hover:text-deep transition capitalize">
          {product.categorySlug.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-deep font-semibold truncate max-w-xs">{product.nameFr}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Images & Thumbnails (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-rose-100 shadow-luxury">
            <img
              src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
              alt={product.images[selectedImageIndex]?.altText || product.nameFr}
              className="w-full h-full object-cover object-center"
            />
            
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                -{discountPercent}% Promo
              </span>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    selectedImageIndex === idx ? 'border-rose-600 shadow-sm' : 'border-rose-100 hover:border-rose-300'
                  }`}
                >
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-rose-700">
              {product.brand}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-deep mt-1 leading-snug">
              {product.nameFr}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-deep">{product.rating.toFixed(1)} / 5</span>
              <span className="text-xs text-mutedText">({product.reviewsCount} avis clientes)</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-white border border-rose-100/80 shadow-xs flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-deep">
              {formatPriceDZD(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-mutedText line-through">
                {formatPriceDZD(comparePrice!)}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentStock > 0 ? 'En stock disponible' : 'Rupture de stock'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            {product.shortDescription}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-2 pt-2 border-t border-rose-100">
              <label className="text-xs font-bold text-deep uppercase tracking-wider block">
                Sélectionnez votre teinte / format :
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer ${
                        isSelected 
                          ? 'border-deep bg-deep text-ivory shadow-sm' 
                          : 'border-rose-200 bg-white text-deep hover:bg-rose-50'
                      }`}
                    >
                      {v.colorHex && (
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs" 
                          style={{ backgroundColor: v.colorHex }} 
                        />
                      )}
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-rose-200 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-rose-50 text-deep transition cursor-pointer"
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité de produit"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-deep min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="p-3 hover:bg-rose-50 text-deep transition cursor-pointer"
                  disabled={quantity >= currentStock}
                  aria-label="Augmenter la quantité de produit"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 bg-deep hover:bg-rose-950 text-ivory font-semibold py-3.5 px-6 rounded-xl shadow-luxury hover:shadow-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentStock <= 0 ? 'Indisponible' : 'Ajouter au panier'}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={isFavorited ? 'Retirer le produit des favoris' : 'Ajouter le produit aux favoris'}
                className={`p-3.5 rounded-xl border transition shadow-xs cursor-pointer ${
                  isFavorited 
                    ? 'border-rose-400 bg-rose-50 text-rose-600' 
                    : 'border-rose-200 bg-white text-stone-400 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="w-full bg-brand-rose hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-40"
            >
              Commander maintenant (Paiement à la livraison)
            </button>

            {addMessage && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {addMessage}
              </p>
            )}
          </div>

          {/* Delivery & Security Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-rose-100">
            <div className="flex items-center gap-2 text-xs text-deep">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Livraison 58 Wilayas sous 24-48h</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-deep">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Paiement sécurisé à la réception</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-deep">
              <RefreshCw className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Garantie authenticité & retour 48h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Ingredients, Application, Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-card">
        <div className="flex items-center gap-4 sm:gap-8 border-b border-rose-100 pb-4 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'desc' ? 'border-deep text-deep font-bold' : 'border-transparent text-mutedText hover:text-deep'
            }`}
          >
            Description Complète
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'ingredients' ? 'border-deep text-deep font-bold' : 'border-transparent text-mutedText hover:text-deep'
            }`}
          >
            Ingrédients & Actifs (INCI)
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'usage' ? 'border-deep text-deep font-bold' : 'border-transparent text-mutedText hover:text-deep'
            }`}
          >
            Conseils d’Utilisation
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'reviews' ? 'border-deep text-deep font-bold' : 'border-transparent text-mutedText hover:text-deep'
            }`}
          >
            Avis Clientes ({reviews.length})
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl font-light">
              <p>{product.fullDescription}</p>
              {product.skinType && (
                <div className="p-4 bg-ivory rounded-2xl border border-rose-100/60 mt-4">
                  <h4 className="font-serif font-bold text-deep mb-1">Type de peau adapté</h4>
                  <p className="text-xs text-mutedText">
                    Idéal pour peaux {product.skinType === 'all' ? 'toutes natures (sèches, mixtes et sensibles)' : product.skinType}. Formulé pour tolérer les fortes chaleurs et le climat sec.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3 max-w-3xl">
              <h4 className="font-serif text-sm font-bold text-deep">Liste INCI officielle :</h4>
              <p className="text-xs text-stone-500 leading-relaxed font-mono bg-ivory p-4 rounded-2xl border border-rose-100">
                {product.ingredients || 'Aqua (Water), Glycerin, Botanical Extracts, Tocopherol, Natural Parfum.'}
              </p>
              <p className="text-[11px] text-mutedText italic">
                * Formule sans parabènes, sans sulfates agressifs, non testée sur les animaux.
              </p>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-3 max-w-3xl text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              <h4 className="font-serif text-sm font-bold text-deep">Protocole d'application recommandé :</h4>
              <p>{product.usageInstructions || 'Appliquer délicatement sur peau propre matin et soir en effectuant des mouvements circulaires légers.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-mutedText">Aucun avis pour ce produit pour le moment. Soyez la première à donner votre avis !</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-ivory/60 border border-rose-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-deep">{rev.userName}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-semibold text-xs text-deep">{rev.title}</h5>
                      <p className="text-xs text-stone-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="p-6 rounded-2xl bg-white border border-rose-200 space-y-4">
                <h4 className="font-serif text-base font-bold text-deep">Laisser un avis vérifié</h4>
                {reviewSubmitted ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    Merci ! Votre avis a été enregistré avec succès.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-deep block mb-1">Votre Nom / Pseudo</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="Ex: Sarah M."
                          className="w-full text-xs p-2 rounded-xl border border-rose-200 bg-ivory"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-deep block mb-1">Note globale</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-xl border border-rose-200 bg-ivory"
                        >
                          <option value={5}>5 étoiles - Excellent</option>
                          <option value={4}>4 étoiles - Très bon</option>
                          <option value={3}>3 étoiles - Satisfaisant</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-deep block mb-1">Titre de votre commentaire</label>
                      <input
                        type="text"
                        required
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="Ex: Teint sublime et texture légère"
                        className="w-full text-xs p-2 rounded-xl border border-rose-200 bg-ivory"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-deep block mb-1">Votre expérience détaillée</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Racontez votre expérience avec ce produit..."
                        className="w-full text-xs p-2 rounded-xl border border-rose-200 bg-ivory"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-deep text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-950 transition cursor-pointer"
                    >
                      Publier mon avis
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-rose-100">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-deep">Vous pourriez aussi aimer</h3>
            <Link to={`/categories/${product.categorySlug}`} className="text-xs font-bold text-rose-700 hover:text-rose-900">
              Voir toute la gamme →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
