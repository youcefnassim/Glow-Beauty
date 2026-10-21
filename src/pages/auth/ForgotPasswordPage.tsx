import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-luxury space-y-6">
        <div>
          <Link to="/login" className="inline-flex items-center gap-1 text-xs text-mutedText hover:text-deep mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la connexion</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-deep">Mot de passe oublié ?</h1>
          <p className="text-xs text-mutedText mt-1">
            Indiquez votre adresse e-mail pour recevoir les instructions de réinitialisation.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>E-mail envoyé avec succès</span>
            </div>
            <p>
              Si un compte est associé à <strong>{email}</strong>, un lien sécurisé de réinitialisation vous a été transmis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">
                Adresse e-mail du compte
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-3.5 rounded-xl transition shadow-md text-xs cursor-pointer"
            >
              Envoyer le lien de réinitialisation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
