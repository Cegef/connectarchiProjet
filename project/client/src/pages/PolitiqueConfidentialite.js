import React from 'react';

export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          La présente politique de confidentialité a pour objectif d’informer les utilisateurs de la plateforme Bimply, accessible à l’adresse <a href="https://www.bimply.fr" className="text-indigo-600 underline">https://www.bimply.fr</a>, sur la manière dont leurs données personnelles sont collectées, utilisées, conservées et protégées, conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation française en vigueur.
        </p>
        <p className="mt-2">
          En utilisant la plateforme, vous acceptez les pratiques décrites dans cette politique.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données est :<br />
          Bimply SAS<br />
          Adresse : 123 Avenue du Bâtiment, 75001 Paris, France<br />
          Email : contact@bimply.com
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Données collectées</h2>
        <p className="font-semibold">a. Lors de la création d’un compte :</p>
        <ul className="list-disc ml-6">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Mot de passe (chiffré)</li>
          <li>Statut (freelance ou entreprise)</li>
          <li>Informations professionnelles (portfolio, métier, description, SIRET pour les entreprises)</li>
        </ul>
        <p className="font-semibold mt-2">b. Lors de l’utilisation de la plateforme :</p>
        <ul className="list-disc ml-6">
          <li>Historique des messages et échanges</li>
          <li>Offres publiées / candidatures envoyées</li>
          <li>Notes et avis</li>
        </ul>
        <p className="font-semibold mt-2">c. Données techniques :</p>
        <ul className="list-disc ml-6">
          <li>Adresse IP</li>
          <li>Type de navigateur</li>
          <li>Données de navigation (via cookies)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Finalités du traitement</h2>
        <ul className="list-disc ml-6">
          <li>Création et gestion des comptes utilisateurs</li>
          <li>Mise en relation entre freelances et entreprises</li>
          <li>Communication entre utilisateurs</li>
          <li>Sécurité et prévention des fraudes</li>
          <li>Amélioration des services et statistiques</li>
          <li>Envoi d’actualités ou de communications commerciales (avec consentement)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Base légale du traitement</h2>
        <ul className="list-disc ml-6">
          <li>Votre consentement (pour l’inscription, la newsletter…)</li>
          <li>L’exécution du contrat (utilisation de la plateforme)</li>
          <li>L’intérêt légitime (amélioration continue, lutte contre la fraude)</li>
          <li>Les obligations légales (ex : facturation, conservation comptable)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Durée de conservation</h2>
        <ul className="list-disc ml-6">
          <li>Jusqu’à 3 ans après la dernière activité (à des fins commerciales)</li>
          <li>Jusqu’à 5 ans pour des raisons de preuve ou d'obligations légales</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Destinataires des données</h2>
        <ul className="list-disc ml-6">
          <li>À l’équipe interne de Bimply</li>
          <li>À certains prestataires techniques (hébergement, paiement, maintenance)</li>
          <li>Aux autorités en cas d’obligations légales</li>
        </ul>
        <p>
          Vos données ne sont jamais vendues ni transmises à des tiers à des fins commerciales.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Transferts hors UE</h2>
        <p>
          Les données sont hébergées en France ou dans l’Espace Économique Européen. Si un transfert hors UE devait avoir lieu, il serait encadré par des clauses contractuelles conformes au RGPD.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Vos droits</h2>
        <ul className="list-disc ml-6">
          <li>Droit d’accès : obtenir une copie de vos données</li>
          <li>Droit de rectification : corriger des données inexactes</li>
          <li>Droit à l’effacement : demander la suppression de vos données</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d’opposition</li>
          <li>Droit à la portabilité</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p className="mt-2">
          Pour exercer vos droits, contactez-nous à <a href="mailto:contact@bimply.com" className="text-indigo-600 underline">contact@bimply.com</a>. Une réponse vous sera apportée dans un délai d’un mois.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données (chiffrement, pare-feu, contrôle d’accès…).
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Cookies</h2>
        <p>
          La plateforme utilise des cookies pour :
        </p>
        <ul className="list-disc ml-6">
          <li>Assurer le bon fonctionnement du site</li>
          <li>Améliorer l’expérience utilisateur</li>
          <li>Mesurer l’audience (Google Analytics, etc.)</li>
        </ul>
        <p className="mt-2">
          Vous pouvez gérer vos préférences via le bandeau cookies ou dans les paramètres de votre navigateur.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">12. Modification de la politique</h2>
        <p>
          Nous nous réservons le droit de modifier la présente politique à tout moment. En cas de changement important, nous vous en informerons via la plateforme ou par email.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">13. Contact</h2>
        <p>
          Pour toute question relative à cette politique ou au traitement de vos données :<br />
          Bimply<br />
          Email : <a href="mailto:contact@bimply.com" className="text-indigo-600 underline">contact@bimply.com</a>
        </p>
      </section>
    </div>
  );
}