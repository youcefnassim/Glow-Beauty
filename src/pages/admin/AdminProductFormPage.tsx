import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { CATEGORIES, BRANDS } from '@/data/categories';
import { Product, ProductImage, ProductVariant } from '@/types';
import { ArrowLeft, Save, Plus, Trash2, Image, CheckCircle2, Package } from 'lucide-react';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form State
  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [brand, setBrand] = useState('Glow Botanical');
  const [categorySlug, setCategorySlug] = useState('soins-du-visage');
  const [price, setPrice] = useState<number>(3200);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(30);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [skinType, setSkinType] = useState<Product['skinType']>('all');
  const [skinConcern, setSkinConcern] = useState<Product['skinConcern']>('hydration');
  const [imageUrl, setImageUrl] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Wholesale / Gros State
  const [isWholesaleAvailable, setIsWholesaleAvailable] = useState(false);
  const [wholesalePrice, setWholesalePrice] = useState<number | undefined>(undefined);
  const [wholesaleMinQty, setWholesaleMinQty] = useState<number>(6);
  const [wholesalePackDescription, setWholesalePackDescription] = useState<string>('');

  useEffect(() => {
    if (isEditing && id) {
      const p = StorageService.getProductById(id);
      if (p) {
        setNameFr(p.nameFr);
        setNameAr(p.nameAr || '');
        setBrand(p.brand);
        setCategorySlug(p.categorySlug);
        setPrice(p.price);
        setCompareAtPrice(p.compareAtPrice);
        setStock(p.stock);
        setShortDescription(p.shortDescription);
        setFullDescription(p.fullDescription);
        setIngredients(p.ingredients || '');
        setUsageInstructions(p.usageInstructions || '');
        setSkinType(p.skinType || 'all');
        setSkinConcern(p.skinConcern || 'hydration');
        setImageUrl(p.images[0]?.url || '');
        setIsNewArrival(Boolean(p.isNewArrival));
        setIsPromo(Boolean(p.isPromo));
        setIsFeatured(Boolean(p.isFeatured));
        setIsBestSeller(Boolean(p.isBestSeller));
        setIsWholesaleAvailable(Boolean(p.isWholesaleAvailable));
        setWholesalePrice(p.wholesalePrice);
        setWholesaleMinQty(p.wholesaleMinQty || 6);
        setWholesalePackDescription(p.wholesalePackDescription || '');
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFr.trim()) return;

    const slug = nameFr
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const images: ProductImage[] = [
      {
        id: `img-${Date.now()}`,
        productId: id || `prod-${Date.now()}`,
        url: imageUrl.trim() || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        altText: nameFr,
        isPrimary: true,
        orderIndex: 0,
      },
    ];

    const updatedProduct: Product = {
      id: id || `prod-${Date.now()}`,
      slug: slug || `produit-${Date.now()}`,
      nameFr: nameFr.trim(),
      nameAr: nameAr.trim() || undefined,
      brand,
      categorySlug,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      ingredients: ingredients.trim() || undefined,
      usageInstructions: usageInstructions.trim() || undefined,
      skinType,
      skinConcern,
      images,
      variants: [
        {
          id: `var-${Date.now()}`,
          productId: id || `prod-${Date.now()}`,
          name: 'Format Standard',
          sku: `GLW-${Date.now().toString().slice(-4)}`,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          stock: Number(stock),
        },
      ],
      rating: 5.0,
      reviewsCount: 1,
      isNewArrival,
      isPromo,
      isFeatured,
      isBestSeller,
      isWholesaleAvailable,
      wholesalePrice: isWholesaleAvailable && wholesalePrice ? Number(wholesalePrice) : undefined,
      wholesaleMinQty: isWholesaleAvailable ? Number(wholesaleMinQty) : undefined,
      wholesalePackDescription: isWholesaleAvailable ? wholesalePackDescription.trim() || undefined : undefined,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveProduct(updatedProduct);
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Top Header */}
      <div>
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-2 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la liste des produits</span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-deep">
          {isEditing ? 'Modifier la fiche produit' : 'Créer un nouveau produit de beauté'}
        </h1>
        <p className="text-xs text-mutedText mt-0.5">
          Renseignez avec précision les informations dermatologiques, le prix en DZD et le stock.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            1. Informations Principales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Nom du produit (Français) *
              </label>
              <input
                type="text"
                required
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                placeholder="Ex: Sérum Éclat Niacinamide 10%"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Nom du produit (Arabe)
              </label>
              <input
                type="text"
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="Ex: سيروم النضارة نياسيناميد 10%"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Marque *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              >
                {BRANDS.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Catégorie *</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.slug}>{c.nameFr}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              URL de l’image principale (Haute résolution) *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200 max-w-sm">
                <img src={imageUrl} alt="Aperçu" className="w-12 h-12 rounded-lg object-cover bg-white" />
                <span className="text-xs text-mutedText">Aperçu direct de l'image</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            2. Prix & Inventaire (Marché Algérien)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Prix de vente (DZD / DA) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Prix d'origine (Optionnel promo DA)
              </label>
              <input
                type="number"
                min="0"
                value={compareAtPrice || ''}
                onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 3800"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Quantité en Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Wholesale & B2B Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-base font-bold text-deep">
                3. Option Vente en Gros (B2B / Salons & Revendeurs)
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={isWholesaleAvailable}
                onChange={(e) => {
                  setIsWholesaleAvailable(e.target.checked);
                  if (e.target.checked && !wholesalePrice) {
                    setWholesalePrice(Math.round(price * 0.7));
                  }
                }}
                className="w-4 h-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Proposer à la vente en gros</span>
            </label>
          </div>

          {isWholesaleAvailable && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Prix unitaire en gros (DZD) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={wholesalePrice || ''}
                    onChange={(e) => setWholesalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 2200"
                    className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-amber-50/40 font-bold text-deep"
                  />
                  {wholesalePrice && price > wholesalePrice && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      ✓ Remise grossiste : -{Math.round(((price - wholesalePrice) / price) * 100)}%
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Quantité minimum par lot / carton *
                  </label>
                  <input
                    type="number"
                    min="2"
                    value={wholesaleMinQty}
                    onChange={(e) => setWholesaleMinQty(Math.max(2, Number(e.target.value)))}
                    placeholder="6"
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                  />
                  <p className="text-[11px] text-mutedText mt-1">
                    Ex: 6 ou 10 unités pour déclencher ce tarif
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Description du conditionnement
                  </label>
                  <input
                    type="text"
                    value={wholesalePackDescription}
                    onChange={(e) => setWholesalePackDescription(e.target.value)}
                    placeholder="Ex: Carton scellé de 6 flacons"
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
                  />
                  <p className="text-[11px] text-mutedText mt-1">
                    Mention affichée sur la fiche pro
                  </p>
                </div>
              </div>

              {wholesalePrice && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>
                    Valeur totale du lot ({wholesaleMinQty} pcs) : <strong>{(wholesalePrice * wholesaleMinQty).toLocaleString('fr-DZ')} DZD</strong>
                  </span>
                  <span className="font-semibold text-emerald-800">
                    Économie cliente pro : {((price - wholesalePrice) * wholesaleMinQty).toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Descriptions & Formulations */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            4. Fiche Technique & Formulations
          </h2>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Description Courte (Aperçu catalogue) *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ex: Soin hydratant concentré aux céramides et acide hyaluronique."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Description Complète du Rituel *
            </label>
            <textarea
              required
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Détaillez les bienfaits, la texture sensorielle et l'efficacité..."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Liste Officielle des Ingrédients (INCI)
            </label>
            <textarea
              rows={2}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Aqua (Water), Niacinamide, Glycerin, Rosa Damascena Flower Water..."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Conseils d’Utilisation
            </label>
            <input
              type="text"
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              placeholder="Ex: Appliquer 3 à 4 gouttes matin et soir sur le visage propre."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Type de peau conseillé</label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value as Product['skinType'])}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              >
                <option value="all">Tous types de peaux</option>
                <option value="dry">Peau Sèche</option>
                <option value="oily">Peau Grasse</option>
                <option value="combination">Peau Mixte</option>
                <option value="sensitive">Peau Sensible</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Préoccupation ciblée</label>
              <select
                value={skinConcern}
                onChange={(e) => setSkinConcern(e.target.value as Product['skinConcern'])}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
              >
                <option value="hydration">Hydratation profonde</option>
                <option value="radiance">Éclat du teint</option>
                <option value="blemishes">Imperfections & Pores</option>
                <option value="anti-aging">Anti-âge & Fermeté</option>
                <option value="sun-protection">Protection Solaire SPF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Marketing Badges */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            4. Badges & Mise en Avant
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded border-stone-300 text-rose-600"
              />
              <span>Badge « Nouveau »</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={isPromo}
                onChange={(e) => setIsPromo(e.target.checked)}
                className="rounded border-stone-300 text-rose-600"
              />
              <span>Badge « Promo »</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded border-stone-300 text-rose-600"
              />
              <span>Badge « Best-Seller »</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-deep cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-stone-300 text-rose-600"
              />
              <span>En vedette (Homepage)</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Enregistrer les modifications' : 'Publier le produit'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
