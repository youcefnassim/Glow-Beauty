import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const settings = StorageService.getSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-700">À votre écoute</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Contactez Notre Maison</h1>
        <p className="text-xs sm:text-sm text-mutedText">
          Une question sur un produit, une recommandation de routine personnalisée ou une commande en cours ? Nos conseillères vous répondent avec bienveillance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-rose-100 shadow-card space-y-6">
          <h2 className="font-serif text-xl font-bold text-deep">Coordonnées du Service Client</h2>
          
          <div className="space-y-4 text-xs text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-deep">Showroom & Siège Social</p>
                <p className="text-mutedText">{settings.contactAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-deep">Service Client Téléphonique</p>
                <p className="text-rose-800 font-semibold">{settings.contactPhone}</p>
                <p className="text-[11px] text-mutedText">Disponible pour toute l'Algérie</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-deep">E-mail Officiel</p>
                <p className="text-rose-800 font-semibold">{settings.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-deep">Horaires d'Ouverture</p>
                <p className="text-mutedText">Du Samedi au Jeudi : 9h00 - 18h30</p>
                <p className="text-[11px] text-mutedText">Vendredi : Fermé (Permanence e-mail)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-rose-100 shadow-card">
          <h2 className="font-serif text-xl font-bold text-deep mb-4">Envoyez-nous un message</h2>
          
          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Message envoyé avec succès !</span>
              </div>
              <p>
                Merci <strong>{name}</strong>. Une conseillère beauté vous répondra par e-mail ou vous contactera au <strong>{phone}</strong> sous 24 heures.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Amina Boudiaf"
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">Numéro de Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550 12 34 56"
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-deep block mb-1">Adresse E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amina@gmail.com"
                  className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-deep block mb-1">Votre Message ou Question *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Détaillez votre demande ou votre question de soin..."
                  className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                />
              </div>

              <button
                type="submit"
                className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer ma demande</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
