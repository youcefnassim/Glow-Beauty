import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { StorageService } from '@/services/storage';
import { StoreSettings } from '@/types';
import { 
  Save, CheckCircle2, ShieldAlert, Bell, 
  KeyRound, Download, Upload, FileJson, AlertCircle, Lock, Package,
  UserCheck 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<StoreSettings>(() => StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin Profile States
  const [adminFullName, setAdminFullName] = useState(user?.fullName || 'Ramzi (Gérant)');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@glowbeauty.dz');
  const [adminPhone, setAdminPhone] = useState(user?.phone || '0550123456');
  const [adminProfileFeedback, setAdminProfileFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setAdminFullName(user.fullName);
      setAdminEmail(user.email);
      setAdminPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: adminFullName.trim() || 'Ramzi (Gérant)',
      email: adminEmail.trim() || 'admin@glowbeauty.dz',
      phone: adminPhone.trim() || '0550123456',
    });
    setAdminProfileFeedback(t('admin.profile.success'));
    setTimeout(() => setAdminProfileFeedback(null), 3500);
  };

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
      setPasswordFeedback({ success: false, msg: t('admin.login.errorWrong') });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ success: false, msg: t('admin.settings.newPassword') + ' (min 6)' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ success: false, msg: t('admin.settings.confirmPassword') });
      return;
    }

    StorageService.setAdminPassword(newPassword);
    setPasswordFeedback({ success: true, msg: t('admin.settings.saveSuccess') });
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
      setBackupFeedback({ success: true, msg: language === 'ar' ? 'تم تنزيل النسخة الاحتياطية بنجاح على جهازك.' : 'Sauvegarde téléchargée avec succès sur votre ordinateur.' });
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Erreur inconnue';
      setBackupFeedback({ success: false, msg: `Error: ${err}` });
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
        <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.settings.pageTitle')}</h1>
        <p className="text-xs text-mutedText mt-1">
          {t('admin.settings.pageSubtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('admin.settings.saveSuccess')}</span>
        </div>
      )}

      {/* Administrator Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2">
                <span>{t('admin.profile.modalTitle')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200/60 uppercase tracking-wider">
                  {t('admin.nav.role')}
                </span>
              </h2>
              <p className="text-[11px] text-mutedText">
                {t('admin.profile.modalSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {adminProfileFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{adminProfileFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-deep block mb-1">
              {t('admin.profile.fullName')}
            </label>
            <input
              type="text"
              required
              value={adminFullName}
              onChange={(e) => setAdminFullName(e.target.value)}
              placeholder="Ex: Ramzi (Gérant)"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-deep"
            />
          </div>

          <div>
            <label className="font-semibold text-deep block mb-1">
              {t('admin.profile.email')}
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@glowbeauty.dz"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div>
            <label className="font-semibold text-deep block mb-1">
              {t('admin.profile.phone')}
            </label>
            <input
              type="tel"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="0550123456"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSaveAdminProfile}
            className="bg-deep hover:bg-rose-950 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('admin.profile.saveBtn')}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            {t('admin.settings.deliveryTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                {t('admin.settings.freeThreshold')} *
              </label>
              <input
                type="number"
                required
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                {t('admin.settings.homeDeliveryFee')}
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
                {t('admin.settings.stopDeskFee')}
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
            {t('admin.settings.general')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.storeName')}</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.contactPhone')}</label>
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
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.contactEmail')}</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.contactAddress')}</label>
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
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.socialInstagram')}</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.socialFacebook')}</label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-semibold text-deep block mb-1">{t('admin.settings.socialTiktok')}</label>
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
            {language === 'ar' ? 'بوابات الدفع الإلكتروني (الجزائر)' : 'Intégrations Bancaires & Monétiques (Algérie)'}
          </h2>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{language === 'ar' ? 'اعتماد بريد الجزائر والبطاقة الذهبية / CIB (SATIM)' : 'Agrément SATIM / Edahabia & CIB'}</span>
            </div>
            <p className="text-mutedText leading-relaxed">
              {language === 'ar'
                ? 'لتفعيل الدفع بالبطاقة الذهبية أو البنكية عبر الإنترنت، يجب إبرام عقد التجارة الإلكترونية مع بريد الجزائر أو البنك. عند ربط مفاتيح الربط (API)، سيتاح الخيار فوراً للمشترين.'
                : 'Pour activer le paiement par carte bancaire en ligne, vous devez souscrire un contrat e-commerce avec votre banque ou Algérie Poste (SATIM). Une fois les clés d\'API marchande fournies, l\'option sera disponible.'}
            </p>
          </div>
        </div>

        {/* Wholesale & B2B Orders Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-base font-bold text-deep">
              {language === 'ar' ? 'إعدادات البيع بالجملة والمحترفين (B2B)' : 'Vente en Gros & Commandes Salons / Revendeurs (B2B)'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                {language === 'ar' ? 'رقم واتساب المباشر لطلبات الجملة' : 'Ligne WhatsApp Directe Grossiste'}
              </label>
              <input
                type="text"
                value={settings.wholesaleNotificationPhone || ''}
                onChange={(e) => handleChange('wholesaleNotificationPhone', e.target.value)}
                placeholder="Ex: 0555000000 ou 213555000000"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">
                {language === 'ar' ? 'الحد الأدنى المقترح لطلبية الجملة (دج)' : 'Seuil minimum recommandé de commande en gros (DZD)'}
              </label>
              <input
                type="number"
                min="0"
                value={settings.wholesaleMinOrderAmount || 15000}
                onChange={(e) => handleChange('wholesaleMinOrderAmount', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Real-time Order Alerts & Integrations */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Bell className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="font-serif text-base font-bold text-deep">
                {language === 'ar' ? 'تنبيهات الطلبيات والمزامنة الفورية' : 'Notifications en Temps Réel & Synchronisation'}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                {language === 'ar' ? 'رقم واتساب لاستقبال إشعارات الطلبيات' : 'Numéro WhatsApp Récepteur des Commandes'}
              </label>
              <input
                type="text"
                value={settings.whatsappNotificationPhone || ''}
                onChange={(e) => handleChange('whatsappNotificationPhone', e.target.value)}
                placeholder="Ex: 0550123456"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="font-semibold text-deep block mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="password"
                  value={settings.telegramBotToken || ''}
                  onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                  placeholder="Ex: 123456789:ABCdef..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-deep block mb-1">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={settings.telegramChatId || ''}
                  onChange={(e) => handleChange('telegramChatId', e.target.value)}
                  placeholder="Ex: -1001234567890"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="font-semibold text-deep block mb-1">
                Google Sheets Webhook URL
              </label>
              <input
                type="url"
                value={settings.googleSheetWebhook || ''}
                onChange={(e) => handleChange('googleSheetWebhook', e.target.value)}
                placeholder="https://script.google.com/macros/s/..."
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-8 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{t('admin.settings.saveAll')}</span>
          </button>
        </div>

      </form>

      {/* Security & Admin Password Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <KeyRound className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="font-serif text-base font-bold text-deep">
              {t('admin.settings.securityTitle')}
            </h2>
            <p className="text-[11px] text-mutedText">
              {t('admin.settings.securityDesc')}
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
              {t('admin.settings.currentPassword')}
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                {t('admin.settings.newPassword')}
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
                {t('admin.settings.confirmPassword')}
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
            <span>{t('admin.settings.changePasswordBtn')}</span>
          </button>
        </form>
      </div>

      {/* Database Backup & Restore Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <FileJson className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="font-serif text-base font-bold text-deep">
              {t('admin.settings.backupTitle')}
            </h2>
            <p className="text-[11px] text-mutedText">
              {t('admin.settings.backupDesc')}
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
              <span>{t('admin.settings.downloadBackup')}</span>
            </h3>
            <p className="text-mutedText text-[11px] leading-relaxed">
              {language === 'ar' ? 'ملف قياسي بتنسيق JSON يضم كافة منتجاتك، طلبياتك، وزبائنك.' : 'Crée un fichier de sauvegarde au format standard JSON contenant l\'ensemble de votre catalogue, commandes et avis.'}
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="bg-deep hover:bg-rose-950 text-ivory font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('admin.settings.downloadBackup')}</span>
            </button>
          </div>

          {/* Restore Backup */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <h3 className="font-semibold text-deep flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>{t('admin.settings.restoreBackup')}</span>
            </h3>
            <p className="text-mutedText text-[11px] leading-relaxed">
              {language === 'ar' ? 'اختر ملف JSON محفوظ مسبقاً لاسترجاع بيانات المتجر بالكامل.' : 'Sélectionnez un fichier JSON préalablement exporté pour réinjecter vos données.'}
            </p>
            <label className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-semibold px-4 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>{t('admin.settings.restoreBackup')}</span>
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
