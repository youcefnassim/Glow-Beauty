import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { StoreSettings } from '@/types';
import { Settings, Save, CheckCircle2, ShieldAlert, Bell } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof StoreSettings, val: any) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Paramètres Généraux de la Boutique</h1>
        <p className="text-xs text-mutedText mt-1">
          Configuration des règles de livraison, coordonnées d'Alger et modes de paiement.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres de la boutique enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            Règles de Livraison (Algérie)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                Seuil de livraison gratuite (DZD) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
              <span className="text-[10px] text-mutedText mt-1 block">
                Offerte sur les 58 wilayas au-delà de ce montant.
              </span>
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                Frais standard Domicile (DA)
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.defaultHomeDeliveryFee}
                onChange={(e) => handleChange('defaultHomeDeliveryFee', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                Frais standard Stop-Desk (DA)
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.defaultStopDeskFee}
                onChange={(e) => handleChange('defaultStopDeskFee', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            Coordonnées Officielles & Service Client
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">Nom de l'Enseigne</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">Téléphone Service Client</label>
              <input
                type="text"
                required
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">E-mail de Contact</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">Adresse Siège / Showroom</label>
              <input
                type="text"
                required
                value={settings.contactAddress}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="font-semibold text-deep block mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-semibold text-deep block mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-semibold text-deep block mb-1">TikTok URL</label>
              <input
                type="url"
                value={settings.socialTiktok}
                onChange={(e) => handleChange('socialTiktok', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            Intégrations Bancaires & Monétiques (Algérie)
          </h2>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Agrément SATIM / Edahabia & CIB</span>
            </div>
            <p className="text-mutedText leading-relaxed">
              Pour activer le paiement par carte bancaire en ligne, vous devez souscrire un contrat e-commerce avec votre banque ou Algérie Poste (SATIM). Une fois les clés d'API marchande (Merchant ID & Secret) fournies, l'option sera disponible.
            </p>
          </div>
        </div>

        {/* Real-time Order Alerts & Integrations (Option 2: No Supabase needed) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Bell className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="font-serif text-base font-bold text-deep">
                Notifications en Temps Réel & Synchronisation (Architecture Autonome)
              </h2>
              <p className="text-[11px] text-mutedText">
                Recevez chaque nouvelle commande directement sur WhatsApp, Telegram ou dans votre Google Sheets sans coût de serveur externe.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Phone */}
            <div>
              <label className="font-semibold text-deep block mb-1">
                Numéro WhatsApp Récepteur des Commandes
              </label>
              <input
                type="text"
                value={settings.whatsappNotificationPhone || ''}
                onChange={(e) => handleChange('whatsappNotificationPhone', e.target.value)}
                placeholder="Ex: 0550123456 ou 0661998877"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
              <span className="text-[10px] text-mutedText mt-1 block">
                Numéro algérien sur lequel les clientes envoient la confirmation WhatsApp en 1 clic.
              </span>
            </div>

            {/* Telegram Bot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="font-semibold text-deep block mb-1">
                  Telegram Bot Token (Optionnel)
                </label>
                <input
                  type="password"
                  value={settings.telegramBotToken || ''}
                  onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                  placeholder="Ex: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
                />
                <span className="text-[10px] text-mutedText mt-1 block">
                  Créé via @BotFather sur Telegram pour notifier votre canal de vente en direct.
                </span>
              </div>

              <div>
                <label className="font-semibold text-deep block mb-1">
                  Telegram Chat ID / Canal ID (Optionnel)
                </label>
                <input
                  type="text"
                  value={settings.telegramChatId || ''}
                  onChange={(e) => handleChange('telegramChatId', e.target.value)}
                  placeholder="Ex: -1001234567890 ou @votre_canal"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
                />
                <span className="text-[10px] text-mutedText mt-1 block">
                  Identifiant du groupe Telegram où envoyer instantanément les fiches de commande.
                </span>
              </div>
            </div>

            {/* Google Sheets Webhook */}
            <div className="pt-2 border-t border-stone-100">
              <label className="font-semibold text-deep block mb-1">
                URL Webhook Google Sheets (Optionnel)
              </label>
              <input
                type="url"
                value={settings.googleSheetWebhook || ''}
                onChange={(e) => handleChange('googleSheetWebhook', e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
              />
              <span className="text-[10px] text-mutedText mt-1 block">
                Webhook Google Apps Script pour enregistrer automatiquement chaque commande en direct dans un tableur Google Sheets partagé.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-8 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
