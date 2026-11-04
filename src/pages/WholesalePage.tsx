import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import { formatPriceDZD, ALGERIA_WILAYAS } from '@/data/wilayas';
import { 
  Package, Truck, ShieldCheck, PhoneCall, Sparkles, Check, 
  ArrowRight, FileText, Building2, Store, ShoppingBag, CheckCircle2, MessageCircle 
} from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const { addWholesalePack } = useCart();
  const { language, t, getProductName, getCategoryName, formatPrice } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Quote Form State
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('salon');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [estimatedBudget, setEstimatedBudget] = useState('50k-100k');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const products = useMemo(() => {
    return StorageService.getProducts().filter(p => p.isWholesaleAvailable && p.wholesalePrice);
  }, []);

  const storeSettings = useMemo(() => StorageService.getSettings(), []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.categorySlug)));
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.categorySlug === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddPack = (product: Product) => {
    const minQty = product.wholesaleMinQty || 6;
    const res = addWholesalePack(product, undefined, minQty);
    if (res.success) {
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2500);
    }
  };

  const handleSendWhatsAppQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !businessName || !contactName) return;

    const wilayaObj = ALGERIA_WILAYAS.find(w => w.code === Number(wilayaCode));
    const targetPhone = (storeSettings.wholesaleNotificationPhone || storeSettings.contactPhone || '213555000000').replace(/\D/g, '');

    const typeLabel = 
      businessType === 'salon' ? 'Salon / Institut de Beauté' :
      businessType === 'parapharmacie' ? 'Parapharmacie / Pharmacie' :
      businessType === 'revendeur' ? 'Boutique Cosmétique / Magasin' :
      'Revendeur Web / Grossiste';

    const msgLines = [
      `*DEMANDE DE DEVIS GROSSISTE - JIN MAKEUP PRO*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏢 *Établissement* : ${businessName} (${typeLabel})`,
      `👤 *Responsable* : ${contactName}`,
      `📞 *Téléphone* : ${phone}`,
      `📍 *Wilaya* : ${wilayaCode} - ${wilayaObj ? wilayaObj.nameFr : 'Algérie'}`,
      `💼 *Budget prévisionnel* : ${estimatedBudget}`,
      notes ? `📝 *Besoin spécifique* : ${notes}` : '',
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Merci de me faire parvenir votre catalogue grossiste et vos conditions tarifaires.`
    ].filter(Boolean);

    const fullMessage = encodeURIComponent(msgLines.join('\n'));
    window.open(`https://wa.me/${targetPhone}?text=${fullMessage}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-deep via-stone-900 to-rose-950 text-ivory rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-luxury">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Espace Vente en Gros & Professionnels</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Approvisionnez votre Salon, Parapharmacie ou Boutique de Beauté
          </h1>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-light max-w-2xl">
            Bénéficiez de remises directes jusqu'à <strong>-40%</strong> sur nos soins haut de gamme. Conditionnements en lots scellés et livraison sécurisée sur les <strong>58 wilayas d’Algérie</strong> avec paiement à la réception.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#catalogue-gros"
              className="bg-brand-rose hover:bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition shadow-md flex items-center gap-1.5"
            >
              <span>Découvrir les Lots Grossiste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#demande-devis"
              className="bg-white/10 hover:bg-white/20 text-ivory font-semibold text-xs px-5 py-2.5 rounded-full transition border border-white/20 flex items-center gap-1.5 backdrop-blur-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Demander un devis sur mesure</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4 Pillars of B2B Service - 2 by 2 on mobile */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-100/80 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-deep text-xs sm:text-sm">Lots dès 6 Pièces</h3>
          <p className="text-[10px] sm:text-xs text-mutedText leading-relaxed">
            Tarifs grossistes automatiques dès 6 ou 10 unités par référence.
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-100/80 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-deep text-xs sm:text-sm">Expédition 58 Wilayas</h3>
          <p className="text-[10px] sm:text-xs text-mutedText leading-relaxed">
            Cartons scellés sous 24h à 48h directement dans votre local.
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-100/80 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-deep text-xs sm:text-sm">100% Authentiques</h3>
          <p className="text-[10px] sm:text-xs text-mutedText leading-relaxed">
            Dates optimales, conformité et traçabilité fabricant garantie.
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-100/80 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-deep flex items-center justify-center font-bold">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-serif font-bold text-deep text-xs sm:text-sm">WhatsApp B2B Dédié</h3>
          <p className="text-[10px] sm:text-xs text-mutedText leading-relaxed">
            Conseiller attitré pour préparer vos devis et réassorts rapides.
          </p>
        </div>
      </section>

      {/* Wholesale Product Catalog */}
      <section id="catalogue-gros" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-rose-700 uppercase tracking-widest">Offres en Vigueur</span>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-deep">
              Catalogue des Lots Grossistes
            </h2>
            <p className="text-[11px] sm:text-xs text-mutedText mt-0.5">
              Commandez directement vos packs en ligne. Les remises grossiste s'appliquent automatiquement au panier.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer capitalize shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-deep text-ivory shadow-xs'
                    : 'bg-white text-stone-600 border border-rose-100 hover:border-rose-300'
                }`}
              >
                {cat === 'all' ? 'Tous les soins' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-rose-100 p-6">
            <p className="text-xs text-stone-500">Aucun lot disponible dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.map(product => {
              const minQty = product.wholesaleMinQty || 6;
              const wholesaleUnitPrice = product.wholesalePrice || product.price;
              const retailUnitPrice = product.price;
              const packTotal = wholesaleUnitPrice * minQty;
              const retailPackTotal = retailUnitPrice * minQty;
              const savings = retailPackTotal - packTotal;
              const savingsPercent = Math.round((savings / retailPackTotal) * 100);
              const isAdded = addedProductId === product.id;

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-rose-100 shadow-xs hover:shadow-card hover:border-rose-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
                    <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-ivory">
                      <img 
                        src={product.images[0]?.url} 
                        alt={getProductName(product)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
                        {language === 'ar' ? `حزمة : ${minQty} قطع` : `Lot : ${minQty} pcs`}
                      </span>
                      <span className="absolute top-1.5 right-1.5 bg-deep text-ivory text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
                        -{savingsPercent}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-rose-700/80 uppercase tracking-wider truncate block">
                        {product.brand}
                      </span>
                      <Link 
                        to={`/products/${product.slug}`} 
                        className="font-serif text-xs sm:text-sm font-semibold text-deep hover:text-rose-800 transition line-clamp-2 leading-tight min-h-[2rem] block"
                      >
                        {getProductName(product)}
                      </Link>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-light">
                        {product.wholesalePackDescription || (language === 'ar' ? `حزمة اقتصادية من ${minQty} قطع.` : `Lot économique de ${minQty} unités.`)}
                      </p>
                    </div>

                    {/* Compact Pricing grid */}
                    <div className="bg-rose-50/60 rounded-lg p-1.5 sm:p-2 border border-rose-100/70 space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-mutedText">{language === 'ar' ? 'سعر الجملة :' : 'Tarif gros :'}</span>
                        <strong className="text-deep font-bold font-serif">{formatPrice(wholesaleUnitPrice)}</strong>
                      </div>
                      <div className="flex justify-between items-baseline text-[9px] sm:text-[10px] text-mutedText">
                        <span>{language === 'ar' ? 'السعر العادي :' : 'Prix public :'}</span>
                        <span className="line-through">{formatPrice(retailUnitPrice)}</span>
                      </div>
                      <div className="pt-1 border-t border-rose-200/50 flex justify-between items-baseline">
                        <span className="font-semibold text-deep text-[10px] sm:text-[11px]">{language === 'ar' ? `المجموع (${minQty} قطع) :` : `Total (${minQty} pcs) :`}</span>
                        <span className="font-bold text-rose-900 text-xs sm:text-sm font-serif">
                          {formatPrice(packTotal)}
                        </span>
                      </div>
                      <div className="text-[9px] text-emerald-700 font-semibold truncate">
                        ✓ {language === 'ar' ? 'توفير :' : 'Éco :'} {formatPrice(savings)}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 pt-0">
                    <button
                      onClick={() => handleAddPack(product)}
                      className={`w-full py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-deep hover:bg-rose-950 text-ivory'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('product.addedSuccess')}</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span className="truncate">{language === 'ar' ? `إضافة الحزمة (${minQty} قطع)` : `Ajouter le Lot (${minQty} pcs)`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Target Audiences */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-card">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-widest">Partenaires Privilégiés</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep">
            À qui s’adresse notre offre de gros ?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Nous collaborons avec tous les professionnels de l'esthétique et de la santé en Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-ivory/50 border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-deep text-base">Instituts & Salons de Beauté</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Sublimez vos clientes lors de leurs soins en cabine et proposez notre gamme en revente exclusive à votre comptoir.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ivory/50 border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-deep text-base">Parapharmacies & Spas</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Enrichissez vos rayons de soins haute tolérance formulés à base d'actifs scientifiquement validés (Niacinamide, Céramides, Acide Hyaluronique).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ivory/50 border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-deep flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-deep text-base">Boutiques Cosmétiques & E-commerçants</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Bénéficiez de marges confortables, de matériel visuel haute définition pour vos réseaux sociaux et d'un approvisionnement continu sans rupture.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Quote & WhatsApp Request Form */}
      <section id="demande-devis" className="bg-gradient-to-br from-ivory via-rose-50/50 to-amber-50/30 rounded-3xl p-6 sm:p-12 border border-rose-200/80 shadow-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep text-amber-300 text-xs font-bold uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Devis Rapide & Direct</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep">
              Vous avez un besoin volumineux ou une demande spécifique ?
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Remplissez ce formulaire express pour recevoir instantanément une offre personnalisée sur WhatsApp ou par téléphone avec nos meilleures conditions tarifaires.
            </p>

            <div className="space-y-3 pt-2 text-xs text-deep">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Réponse garantie sous 2 heures ouvrées</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Échantillons professionnels disponibles sur demande</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Possibilité de facturation pro et bon de livraison</span>
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl border border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-mutedText">Assistance Grossiste directe</p>
                <p className="text-sm font-bold text-deep">
                  {storeSettings.wholesaleNotificationPhone || storeSettings.contactPhone || '+213 (0) 555 00 00 00'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-rose-100 shadow-card">
            {formSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-deep">Demande transmise avec succès !</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Votre demande a été acheminée à notre équipe commerciale B2B. Un conseiller prendra contact avec vous dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="bg-deep text-ivory text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-stone-900 transition"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWhatsAppQuote} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Nom de l'établissement / Salon *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="Ex: Institut Éclat, Para Santé..."
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Type d'activité *
                    </label>
                    <select
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    >
                      <option value="salon">Salon de Coiffure / Beauté</option>
                      <option value="parapharmacie">Parapharmacie / Pharmacie</option>
                      <option value="revendeur">Boutique Cosmétique</option>
                      <option value="grossiste">Revendeur Web / Grossiste</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Nom du responsable *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="Votre nom et prénom"
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Numéro Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Ex: 0555 12 34 56"
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Wilaya d'implantation *
                    </label>
                    <select
                      value={wilayaCode}
                      onChange={e => setWilayaCode(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    >
                      {ALGERIA_WILAYAS.map(w => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deep mb-1">
                      Volume prévisionnel de commande
                    </label>
                    <select
                      value={estimatedBudget}
                      onChange={e => setEstimatedBudget(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30"
                    >
                      <option value="Moins de 50 000 DZD">Moins de 50 000 DZD (Test)</option>
                      <option value="50 000 - 150 000 DZD">50 000 - 150 000 DZD</option>
                      <option value="150 000 - 300 000 DZD">150 000 - 300 000 DZD</option>
                      <option value="Plus de 300 000 DZD">Plus de 300 000 DZD (Grand Compte)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep mb-1">
                    Références souhaitées ou message
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Précisez les références qui vous intéressent ou toute question logistique..."
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:border-deep bg-ivory/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer ma demande et ouvrir WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
