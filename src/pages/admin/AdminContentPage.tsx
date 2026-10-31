import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { HomepageBanner } from '@/types';
import { 
  Megaphone, Mail, Save, CheckCircle2, Image as ImageIcon, Plus, 
  Trash2, Edit3, Sparkles, X, ArrowUp, ArrowDown, Eye, ExternalLink, Upload 
} from 'lucide-react';

export const AdminContentPage: React.FC = () => {
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
    showFeedback('Barre d’annonces mise à jour avec succès !');
  };

  const showFeedback = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerBadge('Nouveauté');
    setBannerImageUrl('');
    setBannerButtonText('Découvrir');
    setBannerButtonLink('/shop');
    setBannerIsActive(true);
    setIsBannerFormOpen(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 4 Mo). Veuillez compresser l'image ou coller un lien URL.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBannerImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenAddBanner = () => {
    resetBannerForm();
    setIsBannerFormOpen(true);
  };

  const handleEditBanner = (banner: HomepageBanner) => {
    setEditingBannerId(banner.id);
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle);
    setBannerBadge(banner.badge || '');
    setBannerImageUrl(banner.imageUrl);
    setBannerButtonText(banner.buttonText);
    setBannerButtonLink(banner.buttonLink);
    setBannerIsActive(banner.isActive);
    setIsBannerFormOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImageUrl.trim()) return;

    const bannerToSave: HomepageBanner = {
      id: editingBannerId || `banner-${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      badge: bannerBadge.trim() || undefined,
      imageUrl: bannerImageUrl.trim(),
      buttonText: bannerButtonText.trim() || 'Découvrir',
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
    showFeedback(editingBannerId ? 'Bannière modifiée avec succès !' : 'Nouvelle bannière ajoutée au carousel !');
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette diapositive du carousel d’accueil ?')) {
      StorageService.deleteBanner(id);
      setBanners(StorageService.getBanners());
      showFeedback('Bannière supprimée.');
    }
  };

  const handleToggleBannerActive = (banner: HomepageBanner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    StorageService.saveBanner(updated);
    setBanners(StorageService.getBanners());
    showFeedback(updated.isActive ? 'Bannière activée sur le site public.' : 'Bannière désactivée temporairement.');
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    // Re-assign order indices
    newBanners.forEach((b, idx) => {
      b.orderIndex = idx;
    });

    StorageService.reorderBanners(newBanners);
    setBanners([...newBanners]);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Marketing, Bannières & Slider</h1>
        <p className="text-xs text-mutedText mt-1">
          Gérez le carousel automatique d’accueil (photos, textes, liens) et la barre d’annonces supérieure.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: HOMEPAGE BANNERS SLIDER (CAROUSEL AUTOMATIQUE) */}
      {/* ======================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-deep">
                Bannières de l'Accueil (Carousel Automatique)
              </h2>
              <p className="text-[11px] text-mutedText">
                Ces diapositives défilent automatiquement sur la page d'accueil ({banners.filter(b => b.isActive).length} actives sur {banners.length}).
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddBanner}
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une diapositive</span>
          </button>
        </div>

        {/* Modal / Slide Edit Form */}
        {isBannerFormOpen && (
          <form onSubmit={handleSaveBanner} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-deep text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>{editingBannerId ? 'Modifier la diapositive' : 'Créer une nouvelle diapositive'}</span>
              </h3>
              <button
                type="button"
                onClick={resetBannerForm}
                className="text-stone-400 hover:text-deep p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-deep block mb-1">
                  Photo de la bannière (URL ou fichier) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="Lien d'image https://... ou choisissez un fichier"
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 bg-white text-xs"
                  />
                  <label className="shrink-0 px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-deep text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-rose-600" />
                    <span>Téléverser</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[10px] text-mutedText mt-1 block">
                  Collez un lien web OU choisissez une photo directement depuis votre téléphone / ordinateur.
                </span>
              </div>

              <div>
                <label className="font-semibold text-deep block mb-1">
                  Badge flottant (Optionnel)
                </label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="Ex: Formule Signature, Promo -20%, Nouveauté..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>
            </div>

            {/* Live Photo Preview */}
            {bannerImageUrl && (
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center gap-3 max-w-md">
                <img
                  src={bannerImageUrl}
                  alt="Aperçu"
                  className="w-16 h-12 object-cover rounded-lg border border-stone-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-deep truncate text-xs">{bannerTitle || 'Titre de la bannière'}</p>
                  <p className="text-[10px] text-emerald-700">✓ Image chargée avec succès</p>
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-deep block mb-1">
                Titre principal affiché *
              </label>
              <input
                type="text"
                required
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Ex: Sérum Éclat Niacinamide 10% & Zinc"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-serif font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                Sous-titre / Description courte
              </label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Ex: Révélez un teint lumineux et sans imperfections dès 14 jours."
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-deep block mb-1">
                  Texte du bouton CTA
                </label>
                <input
                  type="text"
                  value={bannerButtonText}
                  onChange={(e) => setBannerButtonText(e.target.value)}
                  placeholder="Ex: Découvrir le soin, Commander..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-deep block mb-1">
                  Lien de destination *
                </label>
                <input
                  type="text"
                  required
                  value={bannerButtonLink}
                  onChange={(e) => setBannerButtonLink(e.target.value)}
                  placeholder="Ex: /products/serum-eclat, /shop, /wholesale..."
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
                <span className="font-medium text-stone-700">Activer cette diapositive dans le carousel</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetBannerForm}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBannerId ? 'Mettre à jour' : 'Enregistrer le slide'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing Banners List */}
        <div className="space-y-3">
          {banners.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-100 text-mutedText text-xs">
              Aucune diapositive configurée. Cliquez sur « Ajouter une diapositive » pour créer votre première bannière.
            </div>
          ) : (
            banners.map((banner, index) => (
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
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[9px] px-1 rounded">
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
                        {banner.isActive ? 'Actif sur le site' : 'Inactif'}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-deep text-xs sm:text-sm truncate">
                      {banner.title}
                    </h4>
                    <p className="text-[11px] text-mutedText truncate">
                      {banner.subtitle || 'Sans sous-titre'}
                    </p>
                    <p className="text-[10px] font-mono text-stone-500">
                      Lien : <span className="text-rose-700">{banner.buttonLink}</span> ({banner.buttonText})
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <button
                    onClick={() => handleMoveBanner(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                    title="Monter"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveBanner(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                    title="Descendre"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleBannerActive(banner)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      banner.isActive
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {banner.isActive ? 'Désactiver' : 'Activer'}
                  </button>

                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-600 hover:text-deep transition cursor-pointer"
                    title="Modifier"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 transition cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: ANNOUNCEMENT BAR (TOP HEADER)                  */}
      {/* ======================================================== */}
      <form onSubmit={handleSaveAnnouncement} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-rose-600" />
          Barre d’annonces supérieure (Header)
        </h2>

        <div>
          <label className="font-semibold text-deep block mb-1">
            Message promotionnel affiché tout en haut du site
          </label>
          <input
            type="text"
            required
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Ex: Livraison offerte dès 8 000 DA d’achats ! 🌸"
            className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        <label className="flex items-center gap-2.5 text-stone-700 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={announcementActive}
            onChange={(e) => setAnnouncementActive(e.target.checked)}
            className="rounded border-stone-300 text-rose-600"
          />
          <span>Activer la barre d’annonces sur le site public</span>
        </label>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-6 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Mettre à jour l'annonce</span>
          </button>
        </div>
      </form>

      {/* ======================================================== */}
      {/* SECTION 3: NEWSLETTER SUBSCRIBERS LIST                   */}
      {/* ======================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-600" />
            Abonnées à la Lettre d'Élégance ({subscribers.length})
          </h2>
          <span className="text-[11px] text-mutedText">Opt-in conforme et vérifié</span>
        </div>

        <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
          {subscribers.map((email, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-800">{email}</span>
              <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                Actif (Consentement OK)
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
