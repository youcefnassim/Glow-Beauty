import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { 
  UserCheck, X, Mail, Phone, Lock, ShieldCheck, 
  CheckCircle2, AlertCircle, Save 
} from 'lucide-react';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Ramzi (Gérant)');
  const [email, setEmail] = useState(user?.email || 'admin@glowbeauty.dz');
  const [phone, setPhone] = useState(user?.phone || '0550123456');

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [feedback, setFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSaving(true);

    try {
      // 1. Validate and update password if provided
      if (isChangingPassword && newPassword) {
        if (!StorageService.verifyAdminPassword(currentPassword)) {
          setFeedback({ success: false, msg: 'Le mot de passe actuel est incorrect.' });
          setIsSaving(false);
          return;
        }

        if (newPassword.length < 6) {
          setFeedback({ success: false, msg: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
          setIsSaving(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setFeedback({ success: false, msg: 'Les deux nouveaux mots de passe ne correspondent pas.' });
          setIsSaving(false);
          return;
        }

        StorageService.setAdminPassword(newPassword);
      }

      // 2. Update admin profile details
      await updateProfile({
        fullName: fullName.trim() || 'Ramzi (Gérant)',
        email: email.trim() || 'admin@glowbeauty.dz',
        phone: phone.trim() || '0550123456',
      });

      setFeedback({ success: true, msg: 'Informations administrateur enregistrées avec succès !' });

      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1200);
    } catch {
      setFeedback({ success: false, msg: 'Erreur lors de la mise à jour des informations.' });
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden text-deep animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-ivory flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <span>Profil Administrateur</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-medium">
                  Principal
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Modifier les informations d'identification et de contact de l'administrateur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs">
          {feedback && (
            <div className={`p-3 rounded-2xl flex items-center gap-2 ${
              feedback.success 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="font-medium">{feedback.msg}</span>
            </div>
          )}

          {/* Full Name / Title */}
          <div>
            <label className="font-semibold text-deep block mb-1">
              Nom complet & Titre affiché *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Ramzi (Gérant)"
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold focus:bg-white focus:border-rose-400 focus:outline-none transition"
            />
            <span className="text-[10px] text-mutedText mt-1 block">
              Ce nom apparaît dans le menu latéral, l'historique des commandes et les confirmations.
            </span>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>Email de l'administrateur *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@glowbeauty.dz"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:border-rose-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>Téléphone / WhatsApp</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550123456"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:border-rose-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password Toggle Section */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-600" />
                <span className="font-semibold text-deep">Mot de passe de l'espace admin</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer underline"
              >
                {isChangingPassword ? 'Annuler modification' : 'Modifier le mot de passe'}
              </button>
            </div>

            {isChangingPassword && (
              <div className="mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-fadeIn">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Mot de passe actuel *
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6 caractères min."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Confirmer *
                    </label>
                    <input
                      type="password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-deep hover:bg-rose-950 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
