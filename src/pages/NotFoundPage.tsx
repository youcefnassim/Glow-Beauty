import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
        <span>Erreur 404 • Page Introuvable</span>
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-deep">
        Ce rituel n'existe pas
      </h1>
      <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
        La page que vous tentez de visiter a été déplacée ou n'est plus disponible. Laissez-vous guider vers nos collections de soins d’exception.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3.5 rounded-full transition shadow-luxury"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retourner à l'accueil</span>
        </Link>
      </div>
    </div>
  );
};
