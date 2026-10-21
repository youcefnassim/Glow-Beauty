import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { StoreSettings } from '@/types';
import { 
  Settings, Save, CheckCircle2, ShieldAlert, Bell, 
  KeyRound, Download, Upload, FileJson, AlertCircle, Lock 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // Backup / Restore Feedback
  const [backupFeedback, setBackupFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleChange = (field: keyof StoreSettings, val: any) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!StorageService.verifyAdminPassword(currentPassword)) {
      setPasswordFeedback({ success: false, msg: 'Le mot de passe actuel est incorrect.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ success: false, msg: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ success: false, msg: 'Les deux nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    StorageService.setAdminPassword(newPassword);
    setPasswordFeedback({ success: true, msg: 'Votre mot de passe administrateur a été modifié avec succès !' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  const handleDownloadBackup = () => {
    try {
      const backupJson = StorageService.backupAllData();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glow-beauty-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupFeedback({ success: true, msg: 'Sauvegarde téléchargée avec succès sur votre ordinateur.' });
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Erreur inconnue';
      setBackupFeedback({ success: false, msg: `Erreur d'export: ${err}` });
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = StorageService.restoreAllData(content);
        setBackupFeedback({ success: res.success, msg: res.message });
        if (res.success) {
          setSettings(StorageService.getSettings());
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

      {/* Security & Admin Password Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <KeyRound className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="font-serif text-base font-bold text-deep">
              Sécurité & Mot de Passe Administrateur
            </h2>
            <p className="text-[11px] text-mutedText">
              Modifiez le mot de passe secret protégeant votre panneau d'administration.
            </p>
          </div>
        </div>

        {passwordFeedback && (
          <div className={`p-3 rounded-2xl flex items-center gap-2 ${
            passwordFeedback.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {passwordFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordFeedback.msg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="font-semibold text-deep block mb-1">
              Mot de passe actuel *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ex: glowadmin2025"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 caractères min."
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-semibold text-deep block mb-1">
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Mettre à jour le mot de passe</span>
          </button>
        </form>
      </div>

      {/* Database Backup & Restore Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <FileJson className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="font-serif text-base font-bold text-deep">
              Sauvegarde & Restauration Complète (Export JSON)
            </h2>
            <p className="text-[11px] text-mutedText">
              Téléchargez une copie intégrale de tous vos produits, commandes, clientes et réglages pour ne jamais rien perdre.
            </p>
          </div>
        </div>

        {backupFeedback && (
          <div className={`p-3 rounded-2xl flex items-center gap-2 ${
            backupFeedback.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {backupFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{backupFeedback.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Download Backup */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <h3 className="font-semibold text-deep flex items-center gap-1.5">
              <Download className="w-4 h-4 text-rose-700" />
              <span>Exporter mes données</span>
            </h3>
            <p className="text-mutedText text-[11px] leading-relaxed">
              Crée un fichier de sauvegarde au format standard JSON contenant l'ensemble de votre catalogue, commandes et avis.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger la Sauvegarde JSON</span>
            </button>
          </div>

          {/* Restore Backup */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <h3 className="font-semibold text-deep flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Restaurer une sauvegarde</span>
            </h3>
            <p className="text-mutedText text-[11px] leading-relaxed">
              Sélectionnez un fichier JSON préalablement exporté pour réinjecter vos données.
            </p>
            <label className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-semibold px-4 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Importer un fichier JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
