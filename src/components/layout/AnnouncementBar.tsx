import React from 'react';
import { StorageService } from '@/services/storage';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Globe, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const settings = StorageService.getSettings();
  const { language, setLanguage } = useLanguage();

  if (!settings.announcementActive || !settings.announcementText) {
    return null;
  }

  return (
    <aside aria-label="Bannière d'annonces promotionnelles" className="bg-blush text-deep py-2 px-4 text-xs font-medium border-b border-rose-200/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-700 animate-pulse hidden sm:inline" />
          <span>{settings.announcementText}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-deep/80">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-rose-700" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-none text-deep text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              aria-label="Sélectionner la langue"
            >
              <option value="fr">Français (DZ)</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <span>•</span>
          <a href="/track-order" className="hover:text-rose-800 transition">
            Suivre mon colis
          </a>
        </div>
      </div>
    </aside>
  );
};
