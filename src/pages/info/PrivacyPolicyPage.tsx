import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Politique de Confidentialité</h1>
        <p className="text-xs text-mutedText mt-1">Dernière mise à jour : 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">1. Collecte des données personnelles</h2>
          <p>
            Dans le cadre de l’utilisation de notre boutique en ligne Glow Beauty, nous collectons uniquement les informations nécessaires au traitement et à l’acheminement de vos commandes en Algérie : votre nom, prénom, numéro de téléphone mobile, adresse postale de livraison, et adresse e-mail.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">2. Utilisation de vos coordonnées</h2>
          <p>
            Vos données de contact (numéro de téléphone et adresse) sont exclusivement partagées avec nos transporteurs partenaires (Yalidine Express, ZR Express) dans l'unique but de vous contacter lors de la livraison de vos colis. Nous ne vendons ni ne cédons vos informations à des tiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">3. Sécurité et hébergement</h2>
          <p>
            Toutes les communications sur notre plateforme sont sécurisées via le protocole chiffré SSL/TLS. Les bases de données bénéficient de politiques de sécurité au niveau des lignes (Row Level Security).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">4. Vos droits</h2>
          <p>
            Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles sur simple demande adressée à notre service client à l'adresse contact@glowbeauty.dz.
          </p>
        </section>
      </div>
    </div>
  );
};
