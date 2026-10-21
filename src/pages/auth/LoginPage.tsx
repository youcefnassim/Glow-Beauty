import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Veuillez renseigner votre adresse e-mail.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Identifiants incorrects.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-luxury space-y-6">
        
        <div className="text-center space-y-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-deep">
            Glow Beauty
          </span>
          <h1 className="font-serif text-xl font-bold text-deep">Connexion à votre espace</h1>
          <p className="text-xs text-mutedText">
            Accédez à vos commandes, vos adresses sauvegardées et vos avantages exclusifs.
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-deep">Mot de passe</label>
              <Link to="/forgot-password" className="text-[11px] text-rose-700 hover:text-rose-900 underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-mutedText absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-3.5 rounded-xl transition shadow-md text-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-rose-100 text-xs text-mutedText">
          <span>Vous n'avez pas encore de compte ? </span>
          <Link to="/register" className="text-rose-800 font-bold hover:underline">
            Créer un compte client
          </Link>
        </div>

      </div>
    </div>
  );
};
