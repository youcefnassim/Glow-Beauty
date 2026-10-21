import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { 
  Phone, Mail, MapPin, Send, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const settings = StorageService.getSettings();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ success: false, message: 'Veuillez saisir une adresse e-mail valide.' });
      return;
    }
    if (!consent) {
      setStatus({ success: false, message: 'Veuillez accepter de recevoir nos communications.' });
      return;
    }

    const res = StorageService.subscribeNewsletter(email);
    setStatus(res);
    if (res.success) {
      setEmail('');
    }
  };

  return (
    <footer className="bg-deep text-ivory/90 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Editorial Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-white p-2.5 rounded-2xl shadow-sm hover:opacity-95 transition">
              <img
                src="/logo.png"
                alt="Glow Beauty DZ - Cosmétiques d'Exception"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Maison de cosmétique d’exception célébrant la splendeur et la vitalité naturelle de chaque femme en Algérie. Formules dermatologiquement rigoureuses, ingrédients précieux et rituels sensoriels inoubliables.
            </p>
            
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{settings.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links: Collections */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-rose-200 tracking-wide uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/categories/soins-du-visage" className="hover:text-rose-300 transition">
                  Soins du visage
                </Link>
              </li>
              <li>
                <Link to="/categories/maquillage" className="hover:text-rose-300 transition">
                  Maquillage & Lèvres
                </Link>
              </li>
              <li>
                <Link to="/categories/cheveux" className="hover:text-rose-300 transition">
                  Cheveux & Huiles rares
                </Link>
              </li>
              <li>
                <Link to="/categories/parfums" className="hover:text-rose-300 transition">
                  Parfums & Eaux de toilette
                </Link>
              </li>
              <li>
                <Link to="/categories/coffrets" className="hover:text-rose-300 transition">
                  Coffrets Cadeaux
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=promo" className="hover:text-rose-300 transition text-rose-400 font-medium">
                  Promotions en cours
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-rose-200 tracking-wide uppercase mb-4">
              Service Client
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/track-order" className="hover:text-rose-300 transition">
                  Suivi de commande (58 wilayas)
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-rose-300 transition">
                  Délais & Tarifs de livraison
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose-300 transition">
                  Foire aux questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-300 transition">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-rose-300 transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-rose-300 transition">
                  Conditions générales de vente
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold text-rose-200 tracking-wide uppercase">
              Lettre d'Élégance
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Inscrivez-vous pour recevoir nos invitations privées, conseils dermatologiques et <strong>10% de réduction</strong> sur votre premier rituel.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  className="w-full bg-stone-900/90 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-ivory placeholder:text-stone-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  aria-label="S'inscrire à la lettre d'élégance"
                  className="absolute right-1.5 top-1.5 bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <label className="flex items-start gap-2 text-[10px] text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-stone-700 bg-stone-900 text-rose-600 focus:ring-0"
                />
                <span>J’accepte de recevoir les nouveautés et offres exclusives de Glow Beauty.</span>
              </label>

              {status && (
                <div
                  className={`flex items-start gap-1.5 text-[11px] p-2 rounded-lg ${
                    status.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'
                  }`}
                >
                  {status.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Glow Beauty Algérie. Tous droits réservés.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400">Modes de règlement acceptés :</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-stone-800 text-stone-200 text-[10px] font-bold px-2 py-0.5 rounded border border-stone-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Paiement à la livraison (Cash)
              </span>
              <span className="bg-stone-800 text-stone-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-stone-700">
                BaridiMob / CCP
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
