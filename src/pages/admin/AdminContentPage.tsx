import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { HomepageBanner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Megaphone, Mail, Save, CheckCircle2, Image as ImageIcon, Plus, 
  Trash2, Edit3, Sparkles, X, ArrowUp, ArrowDown, Eye, ExternalLink, Upload 
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export const AdminContentPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Banners State
  const [banners, setBanners] = useState<HomepageBanner[]>(() => StorageService.getBanners());
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('Nouveauté');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerButtonText, setBannerButtonText] = useState('Découvrir');
  const [bannerButtonLink, setBannerButtonLink] = useState('/shop');
  const [bannerIsActive, setBannerIsActive] = useState(true);

  const subscribers = StorageService.getNewsletterSubscribers();

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      announcementText: announcementText.trim(),
      announcementActive,
    };
    StorageService.saveSettings(updated);
    setSettings(updated);
    showFeedback(language === 'ar' ? 'تم تحديث شريط الإعلانات بنجاح !' : 'Barre d’annonces mise à jour avec succès !');
  };

  const showFeedback = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerBadge(language === 'ar' ? 'جديد' : 'Nouveauté');
    setBannerImageUrl('');
    setBannerButtonText(language === 'ar' ? 'اكتشفي الآن' : 'Découvrir');
    setBannerButtonLink('/shop');
    setBannerIsActive(true);
    setIsBannerFormOpen(false);
  };

  const handleOpenAddBanner = () => {
    resetBannerForm();
    setIsBannerFormOpen(true);
  };

  const handleOpenEditBanner = (b: HomepageBanner) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle);
    setBannerBadge(b.badge || '');
    setBannerImageUrl(b.imageUrl);
    setBannerButtonText(b.buttonText);
    setBannerButtonLink(b.buttonLink);
    setBannerIsActive(b.isActive);
    setIsBannerFormOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImageUrl.trim()) {
      alert(language === 'ar' ? 'يرجى إدخال عنوان وصورة للافتة.' : 'Veuillez renseigner au moins un titre et une image.');
      return;
    }

    const bannerToSave: HomepageBanner = {
      id: editingBannerId || `banner-${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      badge: bannerBadge.trim() || undefined,
      imageUrl: bannerImageUrl.trim(),
      buttonText: bannerButtonText.trim() || (language === 'ar' ? 'اكتشفي' : 'Découvrir'),
      buttonLink: bannerButtonLink.trim() || '/shop',
      isActive: bannerIsActive,
      orderIndex: editingBannerId 
        ? banners.find(b => b.id === editingBannerId)?.orderIndex ?? banners.length 
        : banners.length,
    };

    StorageService.saveBanner(bannerToSave);
    const updatedBanners = StorageService.getBanners();
    setBanners(updatedBanners);
    resetBannerForm();
    showFeedback(editingBannerId 
      ? (language === 'ar' ? 'تم تعديل اللافتة بنجاح !' : 'Bannière modifiée avec succès !')
      : (language === 'ar' ? 'تمت إضافة اللافتة الجديدة بنجاح !' : 'Nouvelle bannière ajoutée au carousel !'));
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه اللافتة ؟' : 'Voulez-vous vraiment supprimer cette diapositive du carousel d’accueil ?')) {
      StorageService.deleteBanner(id);
      setBanners(StorageService.getBanners());
      showFeedback(language === 'ar' ? 'تم حذف اللافتة.' : 'Bannière supprimée.');
    }
  };

  const handleToggleBannerActive = (banner: HomepageBanner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    StorageService.saveBanner(updated);
    setBanners(StorageService.getBanners());
    showFeedback(updated.isActive 
      ? (language === 'ar' ? 'تم تفعيل اللافتة في المتجر.' : 'Bannière activée sur le site public.')
      : (language === 'ar' ? 'تم تعطيل اللافتة مؤقتاً.' : 'Bannière désactivée temporairement.'));
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    newBanners.forEach((b, idx) => {
      b.orderIndex = idx;
    });

    StorageService.reorderBanners(newBanners);
    setBanners([...newBanners]);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.content.pageTitle')}</h1>
        <p className="text-xs text-mutedText mt-1">
          {t('admin.content.pageSubtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* SECTION 1: HOMEPAGE BANNERS SLIDER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-deep">
                {t('admin.content.bannersTitle')}
              </h2>
              <p className="text-[11px] text-mutedText">
                {t('admin.content.bannersDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddBanner}
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.content.newBanner')}</span>
          </button>
        </div>

        {/* Modal / Slide Edit Form */}
        {isBannerFormOpen && (
          <form onSubmit={handleSaveBanner} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-deep text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>{editingBannerId ? (language === 'ar' ? 'تعديل اللافتة' : 'Modifier la diapositive') : t('admin.content.newBanner')}</span>
              </h3>
              <button
                type="button"
                onClick={resetBannerForm}
                className="text-stone-400 hover:text-deep p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploadField
                label={t('admin.content.bannerImage')}
                required
                value={bannerImageUrl}
                onChange={setBannerImageUrl}
                aspectRatio="banner"
              />

              <div>
                <label className="font-semibold text-deep block mb-1">
                  {t('admin.content.bannerBadge')}
                </label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="Ex: Formule Signature, Promo -20%..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                {t('admin.content.bannerTitle')} *
              </label>
              <input
                type="text"
                required
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Ex: Sérum Éclat Niacinamide 10%"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-serif font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                {t('admin.content.bannerSubtitle')}
              </label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-deep block mb-1">
                  {t('admin.content.bannerBtnText')}
                </label>
                <input
                  type="text"
                  value={bannerButtonText}
                  onChange={(e) => setBannerButtonText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-deep block mb-1">
                  {t('admin.content.bannerBtnLink')} *
                </label>
                <input
                  type="text"
                  required
                  value={bannerButtonLink}
                  onChange={(e) => setBannerButtonLink(e.target.value)}
                  placeholder="/shop"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerIsActive}
                  onChange={(e) => setBannerIsActive(e.target.checked)}
                  className="rounded border-stone-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium text-stone-700">{t('admin.content.bannerActive')}</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetBannerForm}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {t('admin.content.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('admin.content.saveBanner')}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing Banners List */}
        <div className="space-y-3">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`p-3 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                banner.isActive 
                  ? 'bg-white border-stone-200 hover:border-rose-300 shadow-xs' 
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 end-1 bg-black/60 text-white font-mono text-[9px] px-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {banner.badge && (
                      <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {banner.badge}
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                      banner.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {banner.isActive ? t('admin.coupons.active') : t('admin.coupons.inactive')}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-deep text-xs sm:text-sm truncate">
                    {banner.title}
                  </h4>
                  <p className="text-[11px] text-mutedText truncate max-w-md">
                    {banner.subtitle || '—'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleMoveBanner(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                  title={t('admin.content.orderUp')}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveBanner(index, 'down')}
                  disabled={index === banners.length - 1}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                  title={t('admin.content.orderDown')}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleToggleBannerActive(banner)}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title={banner.isActive ? t('admin.coupons.inactive') : t('admin.coupons.active')}
                >
                  <Eye className={`w-3.5 h-3.5 ${banner.isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                </button>
                <button
                  onClick={() => handleOpenEditBanner(banner)}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title={t('admin.products.edit')}
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-700" />
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-red-600 cursor-pointer"
                  title={t('admin.products.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TOP ANNOUNCEMENT BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Megaphone className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="font-serif text-base font-bold text-deep">
              {t('admin.content.announcementTitle')}
            </h2>
            <p className="text-[11px] text-mutedText">
              {t('admin.content.announcementDesc')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-deep block mb-1">
              {t('admin.content.announcementText')}
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ex: Livraison offerte dès 8 000 DA d'achats !"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="rounded border-stone-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="font-semibold text-deep">
              {t('admin.content.announcementActive')}
            </span>
          </label>

          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{t('admin.content.saveAnnouncement')}</span>
          </button>
        </form>
      </div>

      {/* SECTION 3: NEWSLETTER SUBSCRIBERS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-600" />
            <h2 className="font-serif text-base font-bold text-deep">
              {t('admin.content.newsletterTitle')}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-stone-500">
            {t('admin.content.newsletterCount', { count: subscribers.length })}
          </span>
        </div>

        <div className="space-y-2">
          {subscribers.map((email, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <span className="font-mono text-deep font-medium">{email}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                ✓ {language === 'ar' ? 'مؤكد' : 'Vérifié'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
