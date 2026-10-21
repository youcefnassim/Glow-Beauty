import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Shield, Award, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-rose-700 font-bold">Maison de Haute Cosmétique</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-deep">L’Élégance de la Beauté Naturelle</h1>
        <p className="text-sm sm:text-base text-mutedText leading-relaxed font-light">
          Fondée avec la volonté de magnifier l'éclat de chaque femme, Glow Beauty conjugue les plus nobles actifs botaniques méditerranéens avec les découvertes dermatologiques les plus poussées.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-luxury border border-rose-100">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
            alt="Laboratoire cosmétique Glow Beauty"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep leading-tight">
            Des formulations d’exception adaptées à notre climat
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            L'Algérie bénéficie d'une biodiversité végétale exceptionnelle mais impose également des contraintes climatiques spécifiques : ensoleillement généreux, écarts thermiques et air sec. Nos rituels ont été méticuleusement élaborés pour protéger la barrière épidermique contre la déshydratation tout en procurant une sensation de fraîcheur instantanée.
          </p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Huile de pépins de figue de barbarie bio, hydrolat pur de rose de Damas, céramides réparateurs et acide hyaluronique multi-poids moléculaire : chaque molécule est sélectionnée pour son efficacité clinique démontrée.
          </p>
        </div>
      </div>

      {/* Commitments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-3">
          <Leaf className="w-6 h-6 text-rose-600" />
          <h3 className="font-serif text-base font-bold text-deep">Actifs Purs & Sûrs</h3>
          <p className="text-xs text-mutedText leading-relaxed">
            Formulations sans parabènes, sans huiles minérales occlusives et sans sulfates agressifs.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-3">
          <Shield className="w-6 h-6 text-rose-600" />
          <h3 className="font-serif text-base font-bold text-deep">Rigueur Clinique</h3>
          <p className="text-xs text-mutedText leading-relaxed">
            Tolérance testée sous contrôle dermatologique sur peaux sensibles et mixtes.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-3">
          <Award className="w-6 h-6 text-rose-600" />
          <h3 className="font-serif text-base font-bold text-deep">Livraison 58 Wilayas</h3>
          <p className="text-xs text-mutedText leading-relaxed">
            Un réseau logistique rapide assurant l'acheminement sous 24h à 48h partout en Algérie.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-3">
          <Heart className="w-6 h-6 text-rose-600" />
          <h3 className="font-serif text-base font-bold text-deep">Cruelty-Free</h3>
          <p className="text-xs text-mutedText leading-relaxed">
            Aucun produit fini ni ingrédient n'est testé sur les animaux.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link
          to="/shop"
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3.5 rounded-full shadow-luxury inline-block transition"
        >
          Découvrir toute notre collection
        </Link>
      </div>

    </div>
  );
};
