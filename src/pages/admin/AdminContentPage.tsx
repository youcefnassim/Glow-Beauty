import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Megaphone, Mail, Save, CheckCircle2 } from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Marketing & Bannières</h1>
        <p className="text-xs text-mutedText mt-1">
          Personnalisez la barre d’annonces supérieure et consultez vos abonnées à la lettre d’information.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Modifications enregistrées et visibles immédiatement sur le site !</span>
        </div>
      )}

      {/* Announcement Bar Settings */}
      <form onSubmit={handleSaveAnnouncement} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-rose-600" />
          Barre d’annonces supérieure (Header)
        </h2>

        <div>
          <label className="font-semibold text-deep block mb-1">
            Message promotionnel affiché
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

      {/* Newsletter Subscribers List */}
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
