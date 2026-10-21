import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { CATEGORIES, BRANDS } from '@/data/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { 
  Filter, X, Search, RotateCcw, ChevronDown, Check, SlidersHorizontal 
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams<{ slug?: string }>();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(slug || searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(12000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>(searchParams.get('filter') || 'all'); // 'promo' | 'new' | 'all'
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<string>('popularity'); // 'popularity' | 'newest' | 'price_asc' | 'price_desc'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Pagination / Load more
  const [visibleCount, setVisibleCount] = useState<number>(8);

  // Update when URL slug or params change
  useEffect(() => {
    if (slug) {
      setSelectedCategory(slug);
    } else if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search')!);
    }
    if (searchParams.get('filter')) {
      setFilterType(searchParams.get('filter')!);
    }
  }, [slug, searchParams]);

  const allProducts = StorageService.getProducts();

  // Active category info if on category page
  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find(c => c.slug === selectedCategory);
  }, [selectedCategory]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      // Skin type
      if (selectedSkinType !== 'all' && p.skinType && p.skinType !== selectedSkinType && p.skinType !== 'all') {
        return false;
      }
      // In stock
      if (onlyInStock && p.stock <= 0) {
        return false;
      }
      // Promo or New filter
      if (filterType === 'promo' && !p.isPromo) {
        return false;
      }
      if (filterType === 'new' && !p.isNewArrival) {
        return false;
      }
      // Price range
      if (p.price > priceMax) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.nameFr.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesIng = p.ingredients?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesIng) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
  }, [allProducts, selectedCategory, selectedBrand, selectedSkinType, onlyInStock, filterType, priceMax, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSkinType('all');
    setPriceMax(12000);
    setOnlyInStock(false);
    setFilterType('all');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedBrand !== 'all' || 
    selectedSkinType !== 'all' || 
    priceMax < 12000 || 
    onlyInStock || 
    filterType !== 'all' || 
    searchQuery !== '';

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs text-mutedText mb-3">
          <Link to="/" className="hover:text-deep transition">Accueil</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-deep transition">Boutique</Link>
          {activeCategoryInfo && (
            <>
              <span>/</span>
              <span className="text-deep font-semibold">{activeCategoryInfo.nameFr}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">
              {activeCategoryInfo ? activeCategoryInfo.nameFr : filterType === 'promo' ? 'Offres & Promotions' : filterType === 'new' ? 'Nouveautés du Moment' : 'Tous nos soins'}
            </h1>
            <p className="text-xs sm:text-sm text-mutedText mt-1 max-w-xl">
              {activeCategoryInfo?.description || 'Formulations précieuses, textures sensorielles et résultats visibles pour votre routine beauté quotidienne.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-rose-200 text-deep text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <span>Filtres {hasActiveFilters && '(Actifs)'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-medium text-deep shadow-xs">
              <span className="text-mutedText hidden sm:inline">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold cursor-pointer"
                aria-label="Trier les produits"
              >
                <option value="popularity">Popularité & Avis</option>
                <option value="newest">Nouveautés en premier</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-mutedText">Filtres actifs :</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs px-2.5 py-1 rounded-full">
                Catégorie: {CATEGORIES.find(c => c.slug === selectedCategory)?.nameFr || selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-deep"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs px-2.5 py-1 rounded-full">
                Marque: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')} className="hover:text-deep"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSkinType !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs px-2.5 py-1 rounded-full">
                Peau: {selectedSkinType}
                <button onClick={() => setSelectedSkinType('all')} className="hover:text-deep"><X className="w-3 h-3" /></button>
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs px-2.5 py-1 rounded-full">
                En stock seulement
                <button onClick={() => setOnlyInStock(false)} className="hover:text-deep"><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs px-2.5 py-1 rounded-full">
                Recherche: « {searchQuery} »
                <button onClick={() => setSearchQuery('')} className="hover:text-deep"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline ml-2 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-rose-100/80 shadow-card h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2">
              <Filter className="w-4 h-4 text-rose-600" />
              Filtres
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-mutedText hover:text-deep underline"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Search Box in filter */}
          <div>
            <label className="text-xs font-semibold text-deep block mb-1.5 uppercase tracking-wider">
              Recherche directe
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, actif (ex: Zinc)..."
                className="w-full text-xs bg-ivory border border-rose-200 rounded-xl px-3 py-2 text-deep focus:outline-none focus:border-rose-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-mutedText hover:text-deep">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-semibold text-deep block mb-2 uppercase tracking-wider">
              Catégories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-stone-600 hover:bg-ivory'
                }`}
              >
                <span>Toutes les catégories</span>
                <span className="text-[11px] text-mutedText">({allProducts.length})</span>
              </button>
              {CATEGORIES.map(cat => {
                const count = allProducts.filter(p => p.categorySlug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug ? 'bg-rose-100 text-rose-900 font-bold' : 'text-stone-600 hover:bg-ivory'
                    }`}
                  >
                    <span>{cat.nameFr}</span>
                    <span className="text-[11px] text-mutedText">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <h3 className="text-xs font-semibold text-deep block mb-2 uppercase tracking-wider">
              Marques
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedBrand === 'all' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-stone-600 hover:bg-ivory'
                }`}
              >
                Toutes les marques
              </button>
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.name)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedBrand === brand.name ? 'bg-rose-100 text-rose-900 font-bold' : 'text-stone-600 hover:bg-ivory'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div>
            <h3 className="text-xs font-semibold text-deep block mb-2 uppercase tracking-wider">
              Type de peau
            </h3>
            <div className="space-y-1">
              {[
                { label: 'Tous types', value: 'all' },
                { label: 'Peau Sèche / Déshydratée', value: 'dry' },
                { label: 'Peau Mixte à Grasse', value: 'oily' },
                { label: 'Peau Sensible', value: 'sensitive' },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setSelectedSkinType(item.value)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedSkinType === item.value ? 'bg-rose-100 text-rose-900 font-bold' : 'text-stone-600 hover:bg-ivory'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-deep mb-2 uppercase tracking-wider">
              <span>Budget Maximum</span>
              <span className="text-rose-800 font-bold">{priceMax} DA</span>
            </div>
            <input
              type="range"
              min="2000"
              max="12000"
              step="500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              aria-label="Budget Maximum en Dinars Algériens"
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-mutedText mt-1">
              <span>2 000 DA</span>
              <span>12 000 DA</span>
            </div>
          </div>

          {/* In stock toggle */}
          <div className="pt-2 border-t border-rose-100">
            <label className="flex items-center gap-2.5 text-xs font-medium text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-rose-300 text-rose-600 focus:ring-0"
              />
              <span>Afficher uniquement les produits en stock</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-mutedText pb-2 border-b border-rose-100">
            <span>
              Affichage de <strong>{displayedProducts.length}</strong> sur <strong>{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 shadow-card space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-deep">Aucun produit ne correspond à vos critères</h3>
              <p className="text-xs sm:text-sm text-mutedText max-w-md mx-auto">
                Essayez d'élargir votre sélection, d'augmenter votre budget ou de réinitialiser vos filtres.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-2.5 rounded-full transition cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load more button */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="bg-white hover:bg-rose-50 text-deep border border-rose-200 font-semibold text-xs px-8 py-3 rounded-full shadow-xs transition cursor-pointer"
                  >
                    Charger plus de soins ({filteredProducts.length - visibleCount} restants)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-deep/50 backdrop-blur-xs" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <h3 className="font-serif text-lg font-bold text-deep">Filtres</h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 text-mutedText">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div>
                  <h4 className="text-xs font-bold text-deep uppercase mb-2">Catégorie</h4>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-rose-200 bg-ivory text-deep"
                  >
                    <option value="all">Toutes les catégories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.nameFr}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Brands */}
                <div>
                  <h4 className="text-xs font-bold text-deep uppercase mb-2">Marque</h4>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-rose-200 bg-ivory text-deep"
                  >
                    <option value="all">Toutes les marques</option>
                    {BRANDS.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Budget */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Budget Max :</span>
                    <span className="text-rose-800">{priceMax} DA</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>

                {/* In stock toggle */}
                <label className="flex items-center gap-2 text-xs font-medium text-deep">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>En stock uniquement</span>
                </label>
              </div>

              <div className="pt-6 border-t border-rose-100 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="w-1/2 py-2.5 border border-rose-200 text-xs font-semibold rounded-xl"
                >
                  Effacer
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-1/2 bg-deep text-ivory py-2.5 text-xs font-semibold rounded-xl"
                >
                  Voir résultats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
