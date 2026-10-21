import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password, phone);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.error || 'Erreur lors de l’inscription.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-luxury space-y-6">
        
        <div className="text-center space-y-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-deep">
            Glow Beauty
          </span>
          <h1 className="font-serif text-xl font-bold text-deep">Créer votre compte privilège</h1>
          <p className="text-xs text-mutedText">
            Rejoignez notre communauté et bénéficiez de 10% de réduction immédiate.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Nom et Prénom
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sophia Meziane"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: sophia@gmail.com"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Numéro de Téléphone (Algérie)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0550 12 34 56"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-deep block mb-1">Confirmer</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-3.5 rounded-xl transition shadow-md text-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-rose-100 text-xs text-mutedText">
          <span>Vous avez déjà un compte ? </span>
          <Link to="/login" className="text-rose-800 font-bold hover:underline">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
};
