import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white shadow-lg mt-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bimply</h3>
            <p className="text-gray-600">
              Plateforme de mise en relation entre freelances et entreprises du secteur architecture/BTP.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-indigo-600">Accueil</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-indigo-600">À propos</Link>
              </li>
              <li>
                <Link to="/freelancers" className="text-gray-700 hover:text-indigo-600">Freelances</Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-700 hover:text-indigo-600">Appels d'offres</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Mon Profil</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
            <p className="text-gray-600">Email : contact@bimply.com</p>
            <p className="text-gray-600">Téléphone : +33 1 23 45 67 89</p>
            <p className="text-gray-600">Adresse : 123 Avenue du Bâtiment, 75001 Paris, France</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Bimply. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}