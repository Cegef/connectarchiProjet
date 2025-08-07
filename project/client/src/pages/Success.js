import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Abonnement réussi !</h1>
        <p className="text-gray-700 mb-6">
          Merci pour votre abonnement. Vous pouvez désormais accéder aux profils freelances et publier autant d'appels d'offres que vous le souhaitez.
        </p>
        <Link to="/profile" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
          Retour au profil
        </Link>
      </div>
    </div>
  );
};

export default Success;