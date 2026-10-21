import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { CATEGORIES } from '@/data/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { 
  ArrowRight, Sparkles, Shield, Leaf, HeartHandshake, Star, 
  ChevronDown, ChevronUp, Droplets, Sun, CheckCircle2 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const products = StorageService.getProducts();
  const reviews = StorageService.getReviews();
  const settings = StorageService.getSettings();

  // Featured sections
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quels sont les délais et tarifs de livraison pour les 58 wilayas d’Algérie ?',
      a: 'Nous assurons la livraison sur les 58 wilayas par nos partenaires agréés (Yalidine Express, ZR Express). Le délai est de 24h à 48h pour Alger et le centre, et de 2 à 4 jours ouvrés pour les autres wilayas. La livraison est offerte pour toute commande supérieure à 8 000 DA.'
    },
    {
      q: 'Comment s’effectue le paiement à la livraison (Cash on Delivery) ?',
      a: 'Vous ne payez absolument rien en ligne. Une fois votre commande validée, notre service client vous contacte par téléphone pour confirmer vos coordonnées. Vous réglez en espèces directement au livreur lors de la remise de votre colis en mains propres.'
    },
    {
      q: 'Les formules cosmétiques sont-elles testées dermatologiquement ?',
      a: 'Toutes nos formules sont élaborées selon des normes rigoureuses, sans parabènes, non comédogènes et adaptées aux peaux sensibles ainsi qu’aux climats ensoleillés et arides.'
    },
    {
      q: 'Que faire en cas de produit endommagé ou d’erreur dans le colis ?',
      a: 'Votre satisfaction est primordiale. Vous disposez d’un délai de 48 heures après réception pour contacter notre service client par téléphone ou e-mail. Nous procédons immédiatement au remplacement ou au remboursement sans frais additionnels.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-gradient-to-r from-ivory via-blush-light to-ivory border-b border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/80 text-rose-900 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Haute Cosmétique & Soins Purifiés • Algérie</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-deep tracking-tight leading-[1.15]">
              Révélez votre <br className="hidden sm:inline" />
              <span className="italic font-normal text-rose-700">beauté naturelle</span>
            </h1>

            <p className="text-base sm:text-lg text-mutedText max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Découvrez des rituels de soins formulés avec les actifs botaniques les plus nobles et une rigueur dermatologique absolue. Une expérience sensorielle sur-mesure pour sublimer votre éclat.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-deep hover:bg-rose-950 text-ivory font-semibold px-8 py-3.5 rounded-full transition shadow-luxury hover:shadow-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Découvrir la collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?filter=new"
                className="w-full sm:w-auto bg-white hover:bg-rose-50 text-deep border border-rose-200 font-semibold px-7 py-3.5 rounded-full transition text-sm flex items-center justify-center cursor-pointer"
              >
                Nos nouveautés
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-rose-200/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="font-serif text-2xl font-bold text-deep">58</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">Wilayas desservies</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-deep">100%</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">Paiement à la livraison</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-deep">4.9/5</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">Satisfaction cliente</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-rose-200 to-blush opacity-40 blur-xl transform -rotate-3" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=85"
                  alt="Rituel de beauté Glow Beauty"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Floating Aesthetic Tag */}
                <div className="absolute bottom-5 left-5 right-5 glass-panel p-4 rounded-2xl shadow-luxury">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">Formule Signature</p>
                      <h4 className="font-serif text-sm font-bold text-deep">Sérum Éclat Niacinamide 10%</h4>
                    </div>
                    <span className="font-serif text-sm font-bold text-rose-900 bg-rose-100/80 px-2.5 py-1 rounded-lg">
                      3 200 DA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Nos Univers d'Exception</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Découvrez nos gammes</h2>
          <p className="text-xs sm:text-sm text-mutedText">
            Chaque catégorie a été pensée pour répondre précisément aux besoins spécifiques de votre peau et de vos cheveux.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 shadow-card hover:shadow-luxury transition-all duration-300"
            >
              <img
                src={category.imageUrl}
                alt={category.nameFr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">{category.productCount} produits</span>
                <h3 className="font-serif text-base sm:text-lg font-bold leading-tight group-hover:text-rose-200 transition">
                  {category.nameFr}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-rose-100 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Les Incontournables</span>
            <h2 className="font-serif text-3xl font-bold text-deep mt-1">Nos Meilleures Ventes</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 group"
          >
            <span>Voir toute la collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-deep via-stone-900 to-deep text-ivory overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-rose-900/60 text-rose-200 border border-rose-700/50 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Offre Exclusive de Bienvenue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Rituel Éclat & Sérénité
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Bénéficiez de <strong>10% de réduction immédiate</strong> sur l’ensemble de votre commande avec le code <span className="bg-rose-950 px-2 py-0.5 rounded text-rose-300 font-mono font-bold">BIENVENUE10</span>. Livraison offerte à domicile ou en stop-desk dès 8 000 DA d’achats.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/shop"
                className="bg-brand-rose hover:bg-rose-600 text-white font-semibold px-7 py-3 rounded-full text-xs transition shadow-md cursor-pointer"
              >
                Profiter de l’offre maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-rose-100 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Récemment formulés</span>
            <h2 className="font-serif text-3xl font-bold text-deep mt-1">Dernières Nouveautés</h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 group"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BEAUTY ROUTINE SECTION */}
      <section className="bg-blush-light py-16 border-y border-rose-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Protocole Dermatologique</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Le Rituel en 4 Étapes</h2>
            <p className="text-xs sm:text-sm text-mutedText">
              Adoptez les bons gestes quotidiens pour préserver la barrière cutanée et décupler l’éclat de votre teint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">01</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">Nettoyer en douceur</h3>
              <p className="text-xs text-mutedText leading-relaxed">
                Élimine les impuretés et l’excès de sébum sans altérer le film hydrolipidique de la peau grâce aux acides aminés doux.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">02</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">Cibler avec un sérum</h3>
              <p className="text-xs text-mutedText leading-relaxed">
                Pénètre en profondeur pour traiter les imperfections, unifier le grain de peau et stimuler la synthèse naturelle de collagène.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">03</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">Hydrater & Sceller</h3>
              <p className="text-xs text-mutedText leading-relaxed">
                Apporte les lipides essentiels (céramides, squalane) pour maintenir l’eau dans l’épiderme pendant 48 heures.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">04</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">Protéger du soleil</h3>
              <p className="text-xs text-mutedText leading-relaxed">
                Bouclier indispensable contre les rayons UVA/UVB et la pollution pour prévenir les taches brunes et le vieillissement prématuré.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRAND STORY & VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-luxury border border-rose-100">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80"
              alt="Histoire Glow Beauty"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Notre Philosophie</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep leading-tight">
              L'excellence cosmétique inspirée par la nature
            </h2>
            <p className="text-sm text-mutedText leading-relaxed">
              Chez Glow Beauty, nous croyons qu’une peau éclatante commence par la pureté des ingrédients. Nos formules marient les trésors botaniques méditerranéens — huile d'argan, eau de rose de Damas, figue de barbarie — aux actifs dermatologiques les plus avancés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <Leaf className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">Ingrédients Nobles</h3>
                  <p className="text-[11px] text-mutedText">Sélection rigoureuse</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">Testé & Prouvé</h3>
                  <p className="text-[11px] text-mutedText">Tolérance optimale</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">Service Local</h3>
                  <p className="text-[11px] text-mutedText">Conseillers en Algérie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Témoignages Clients</span>
          <h2 className="font-serif text-3xl font-bold text-deep">Avis vérifiés de nos clientes</h2>
          <p className="text-xs sm:text-sm text-mutedText">
            Retours d'expérience authentiques suite à des achats livrés dans nos 58 wilayas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h3 className="font-serif text-sm font-bold text-deep">« {rev.title} »</h3>
                <p className="text-xs text-mutedText leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-deep">{rev.userName}</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Achat vérifié
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Réponses à vos questions</span>
          <h2 className="font-serif text-3xl font-bold text-deep">Foire Aux Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-card transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base font-semibold text-deep">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-mutedText leading-relaxed border-t border-rose-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
