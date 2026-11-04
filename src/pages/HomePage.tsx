import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { CATEGORIES } from '@/data/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroBannerSlider } from '@/components/home/HeroBannerSlider';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowRight, Sparkles, Shield, Leaf, HeartHandshake, Star, 
  ChevronDown, ChevronUp, Droplets, Sun, CheckCircle2, Package 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t, getCategoryName } = useLanguage();
  const products = StorageService.getProducts();
  const reviews = StorageService.getReviews();
  const settings = StorageService.getSettings();

  // Featured sections
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = language === 'ar' ? [
    {
      q: 'ما هي مدة وأسعار التوصيل لكافة الـ 58 ولاية جزائرية؟',
      a: 'نوفر خدمة التوصيل السريع لجميع الـ 58 ولاية عبر شركائنا المعتمدين (ياليدين إكسبريس، زد آر إكسبريس). يستغرق التوصيل من 24 إلى 48 ساعة للجزائر العاصمة والوسط، ومن 2 إلى 4 أيام لباقي الولايات. التوصيل مجاني لجميع الطلبات التي تفوق 8,000 دج.'
    },
    {
      q: 'كيف تتم عملية الدفع عند الاستلام (Cash on Delivery)؟',
      a: 'لا تدفعين أي شيء عبر الإنترنت. بمجرد تأكيد طلبك، سيتصل بك فريق خدمة العملاء لتأكيد العنوان والمعلومات، وتدفعين نقداً مباشرة لعامل التوصيل عند استلام طردك يداً بيد.'
    },
    {
      q: 'هل المستحضرات مجربة طبياً وآمنة على البشرة؟',
      a: 'جميع تركيباتنا خاضعة لاختبارات جلدية دقيقة، خالية من البارابين، ومصممة خصيصاً لتناسب البشرة الحساسة وتلائم مناخ الجزائر.'
    },
    {
      q: 'ماذا أفعل في حال وصول منتج متضرر أو غير مطابق؟',
      a: 'رضاكم أولويتنا. لديكم مهلة 48 ساعة بعد الاستلام للتواصل مع خدمة الزبائن، وسنقوم بالاستبدال الفوري أو استرجاع المبلغ دون أي مصاريف إضافية.'
    }
  ] : [
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
              <span>{t('hero.tag')}</span>
            </div>

            {language === 'ar' ? (
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-deep tracking-tight leading-[1.25]">
                أبرزي <br className="hidden sm:inline" />
                <span className="italic font-normal text-rose-700">جمالك الطبيعي</span>
              </h1>
            ) : (
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-deep tracking-tight leading-[1.15]">
                Révélez votre <br className="hidden sm:inline" />
                <span className="italic font-normal text-rose-700">beauté naturelle</span>
              </h1>
            )}

            <p className="text-base sm:text-lg text-mutedText max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-deep hover:bg-rose-950 text-ivory font-semibold px-8 py-3.5 rounded-full transition shadow-luxury hover:shadow-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>{t('hero.ctaCollection')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                to="/shop?filter=new"
                className="w-full sm:w-auto bg-white hover:bg-rose-50 text-deep border border-rose-200 font-semibold px-7 py-3.5 rounded-full transition text-sm flex items-center justify-center cursor-pointer"
              >
                {t('hero.ctaNew')}
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-rose-200/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="font-serif text-2xl font-bold text-deep">58</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">{t('props.wilayas')}</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-deep">100%</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">{t('props.cod')}</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-deep">4.9/5</p>
                <p className="text-[11px] text-mutedText uppercase tracking-wider">{t('props.satisfaction')}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <HeroBannerSlider />
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
            {language === 'ar' ? 'تشكيلاتنا الاستثنائية' : "Nos Univers d'Exception"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep">
            {language === 'ar' ? 'اكتشفي باقات العناية' : 'Découvrez nos gammes'}
          </h2>
          <p className="text-xs sm:text-sm text-mutedText">
            {language === 'ar' 
              ? 'تم ابتكار كل تشكيلة بعناية فائقة لتلبي الاحتياجات الخاصة لبشرتك وشعرك بأعلى معايير الجودة.' 
              : 'Chaque catégorie a été pensée pour répondre précisément aux besoins spécifiques de votre peau et de vos cheveux.'}
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
                alt={getCategoryName(category)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                  {category.productCount} {language === 'ar' ? 'منتج' : 'produits'}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold leading-tight group-hover:text-rose-200 transition">
                  {getCategoryName(category)}
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
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
              {language === 'ar' ? 'المختارات الأكثر تميزاً' : 'Les Incontournables'}
            </span>
            <h2 className="font-serif text-3xl font-bold text-deep mt-1">
              {language === 'ar' ? 'الأكثر طلباً ومبيعاً' : 'Nos Meilleures Ventes'}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 group"
          >
            <span>{language === 'ar' ? 'عرض كامل المجموعة' : 'Voir toute la collection'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-5">
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
              {language === 'ar' ? 'عرض ترحيبي حصري' : 'Offre Exclusive de Bienvenue'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {language === 'ar' ? 'طقوس النضارة والصفاء' : 'Rituel Éclat & Sérénité'}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {language === 'ar' ? (
                <>استفيدي من <strong>خصم فوري 10%</strong> على طلبك الأول باستخدام الرمز <span className="bg-rose-950 px-2 py-0.5 rounded text-rose-300 font-mono font-bold">BIENVENUE10</span>. التوصيل مجاني للطلبات التي تفوق 8,000 دج لكافة الـ 58 ولاية.</>
              ) : (
                <>Bénéficiez de <strong>10% de réduction immédiate</strong> sur l’ensemble de votre commande avec le code <span className="bg-rose-950 px-2 py-0.5 rounded text-rose-300 font-mono font-bold">BIENVENUE10</span>. Livraison offerte à domicile ou en stop-desk dès 8 000 DA d’achats.</>
              )}
            </p>
            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/shop"
                className="bg-brand-rose hover:bg-rose-600 text-white font-semibold px-7 py-3 rounded-full text-xs transition shadow-md cursor-pointer"
              >
                {language === 'ar' ? 'استفيدي من العرض الآن' : 'Profiter de l’offre maintenant'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-rose-100 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
              {language === 'ar' ? 'أحدث الابتكارات' : 'Récemment formulés'}
            </span>
            <h2 className="font-serif text-3xl font-bold text-deep mt-1">
              {language === 'ar' ? 'جديد وصولنا' : 'Dernières Nouveautés'}
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 group"
          >
            <span>{language === 'ar' ? 'استكشفي كل جديد' : 'Voir toutes les nouveautés'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BEAUTY ROUTINE SECTION */}
      <section className="bg-blush-light py-16 border-y border-rose-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
              {language === 'ar' ? 'بروتوكول العناية بالبشرة' : 'Protocole Dermatologique'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep">
              {language === 'ar' ? 'طقوس العناية في 4 خطوات' : 'Le Rituel en 4 Étapes'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText">
              {language === 'ar'
                ? 'اتبعي هذه الخطوات اليومية للحفاظ على الحاجز الطبيعي لبشرتك ومضاعفة نضارتها وإشراقها.'
                : 'Adoptez les bons gestes quotidiens pour préserver la barrière cutanée et décupler l’éclat de votre teint.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">01</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">
                {language === 'ar' ? 'التنظيف اللطيف' : 'Nettoyer en douceur'}
              </h3>
              <p className="text-xs text-mutedText leading-relaxed">
                {language === 'ar'
                  ? 'يزيل الشوائب والإفرازات الزائدة دون المساس بالطبقة الواقية الطبيعية للبشرة.'
                  : 'Élimine les impuretés et l’excès de sébum sans altérer le film hydrolipidique de la peau grâce aux acides aminés doux.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">02</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">
                {language === 'ar' ? 'العلاج بالسيروم' : 'Cibler avec un sérum'}
              </h3>
              <p className="text-xs text-mutedText leading-relaxed">
                {language === 'ar'
                  ? 'يتغلغل بعمق لعلاج التصبغات وتوحيد لون البشرة وتحفيز إنتاج الكولاجين.'
                  : 'Pénètre en profondeur pour traiter les imperfections, unifier le grain de peau et stimuler la synthèse naturelle de collagène.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">03</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">
                {language === 'ar' ? 'الترطيب وحبس الرطوبة' : 'Hydrater & Sceller'}
              </h3>
              <p className="text-xs text-mutedText leading-relaxed">
                {language === 'ar'
                  ? 'يمنح البشرة الدهون الأساسية والسيراميد للاحتفاظ بالرطوبة لمدة 48 ساعة متواصلة.'
                  : 'Apporte les lipides essentiels (céramides, squalane) pour maintenir l’eau dans l’épiderme pendant 48 heures.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-rose-100 relative">
              <span className="font-serif text-4xl font-bold text-rose-200">04</span>
              <h3 className="font-serif text-base font-bold text-deep mt-2 mb-1">
                {language === 'ar' ? 'الحماية من الشمس' : 'Protéger du soleil'}
              </h3>
              <p className="text-xs text-mutedText leading-relaxed">
                {language === 'ar'
                  ? 'درع وقاية لا غنى عنه ضد الأشعة فوق البنفسجية والتلوث لحماية البشرة من التصبغات والشيخوخة.'
                  : 'Bouclier indispensable contre les rayons UVA/UVB et la pollution pour prévenir les taches brunes et le vieillissement prématuré.'}
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
              alt="Histoire Jin Makeup"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
              {language === 'ar' ? 'فلسفتنا' : 'Notre Philosophie'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-deep leading-tight">
              {language === 'ar' ? 'التميز والجمال المستوحى من الطبيعة' : "L'excellence cosmétique inspirée par la nature"}
            </h2>
            <p className="text-sm text-mutedText leading-relaxed">
              {language === 'ar'
                ? 'في جين ميكب، نؤمن بأن جمال وسحر المرأة ينبع من نقاء المكونات ودقة الإبداع. تجمع تشكيلاتنا بين أرقى صيحات الماكياج العالمية وأجود العناصر المغذية للبشرة.'
                : "Chez Jin Makeup, nous croyons qu’une beauté éclatante commence par la pureté des formules et la passion du maquillage. Nos collections allient tendances raffinées et soins protecteurs pour sublimer votre visage au quotidien."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <Leaf className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">
                    {language === 'ar' ? 'مكونات نقية' : 'Ingrédients Nobles'}
                  </h3>
                  <p className="text-[11px] text-mutedText">
                    {language === 'ar' ? 'انتقاء صارم' : 'Sélection rigoureuse'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">
                    {language === 'ar' ? 'مفحوص ومثبت' : 'Testé & Prouvé'}
                  </h3>
                  <p className="text-[11px] text-mutedText">
                    {language === 'ar' ? 'تحمل مثالي' : 'Tolérance optimale'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-deep">
                    {language === 'ar' ? 'خدمة محلية' : 'Service Local'}
                  </h3>
                  <p className="text-[11px] text-mutedText">
                    {language === 'ar' ? 'مستشارون بالجزائر' : 'Conseillers en Algérie'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHOLESALE / PRO B2B BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-deep via-stone-900 to-rose-950 text-white p-8 sm:p-12 shadow-luxury border border-amber-400/20">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar' ? 'صالونات التجميل، شبه الصيدليات والموزعون' : 'Salons de Beauté, Parapharmacies & Revendeurs'}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold">
                {language === 'ar' ? 'هل أنت مهني أو صاحب صالون؟ استفد من أسعار الجملة' : 'Vous êtes professionnel ? Profitez de nos tarifs grossistes'}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-light">
                {language === 'ar' ? (
                  <>اطلب بحزم من 6 أو 10 قطع مع تخفيضات فورية تصل إلى <strong>-40%</strong>. توصيل آمن ومضمون لكافة الـ 58 ولاية مع مستشار B2B خاص.</>
                ) : (
                  <>Commandez par lots de 6 ou 10 pièces avec des réductions immédiates jusqu'à <strong>-40%</strong>. Livraison sécurisée sur les 58 wilayas, emballage pro scellé et conseiller B2B dédié.</>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/wholesale"
                className="bg-brand-rose hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>{language === 'ar' ? 'الدخول إلى فضاء الجملة' : "Accéder à l'Espace Gros"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <a
                href="/wholesale#demande-devis"
                className="bg-white/10 hover:bg-white/20 text-ivory text-xs font-semibold px-6 py-2.5 rounded-full transition border border-white/20 flex items-center justify-center gap-2 text-center"
              >
                <span>{language === 'ar' ? 'طلب عرض سعر سريع' : 'Demander un devis rapide'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
            {language === 'ar' ? 'آراء زبوناتنا' : 'Témoignages Clients'}
          </span>
          <h2 className="font-serif text-3xl font-bold text-deep">
            {language === 'ar' ? 'تقييمات موثوقة من عميلاتنا' : 'Avis vérifiés de nos clientes'}
          </h2>
          <p className="text-xs sm:text-sm text-mutedText">
            {language === 'ar' ? 'تجارب حقيقية لطلبيات تم تسليمها في مختلف ولايات الجزائر الـ 58.' : "Retours d'expérience authentiques suite à des achats livrés dans nos 58 wilayas."}
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
                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'ar' ? 'شراء مؤكد' : 'Achat vérifié'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">
            {language === 'ar' ? 'إجابات على أسئلتكم' : 'Réponses à vos questions'}
          </span>
          <h2 className="font-serif text-3xl font-bold text-deep">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Foire Aux Questions'}
          </h2>
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
                  className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer"
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
