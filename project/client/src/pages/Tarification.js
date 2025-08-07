import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

function Tarification() {
  const { user, token } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [localCompanyData, setLocalCompanyData] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Récupérer les données de l'entreprise si connectée
  useEffect(() => {
    if (user?.role === 'entreprise' && token) {
      fetch(`${apiUrl}/api/companies/by-user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Erreur API');
          const data = await res.json();
          return data;
        })
        .then((company) => {
          setLocalCompanyData(company);
        })
        .catch((err) => console.error('Erreur lors du chargement des données entreprise :', err));
    }
  }, [user, token, apiUrl]);

  // Utilisateur non connecté
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
              Tarification & Fonctionnement
            </h1>
            <p className="text-center text-indigo-700 font-semibold mb-6">
              Connectez-vous ou créez un compte pour découvrir les détails de notre tarification adaptée à votre profil.
            </p>

            {/* Section Freelance */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Pour les freelances et opentowork</h2>
              <div className="bg-indigo-50 p-6 rounded-lg shadow">
                <p className="text-gray-700 text-lg mb-4">
                  💸 Tout est <span className="font-bold">100% gratuit</span> pour les freelances et opentowork :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Création de profil
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Réponse aux offres de mission
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Mise en relation directe avec les entreprises
                  </li>
                </ul>
              </div>
            </div>

            {/* Section Entreprise (non connecté) */}
            <div className="cursor-pointer" onClick={() => setShowAuthModal(true)}>
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Pour les entreprises</h2>
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-700 text-lg mb-4">
                  Vous pouvez utiliser la plateforme <strong>gratuitement</strong> avec quelques limitations :
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <XCircle className="text-yellow-500 w-5 h-5 mr-2" />
                    Consultation de maximum <strong>10 profils de freelances et opentowork</strong>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <XCircle className="text-yellow-500 w-5 h-5 mr-2" />
                    Publication de <strong>10 offres de mission</strong> maximum
                  </li>
                </ul>
                <p className="text-gray-700 text-lg mb-6">
                  Pour lever ces limites, vous pouvez souscrire à notre offre premium :
                </p>
                <div className="bg-white p-4 border rounded-lg shadow-sm text-center">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Abonnement Premium Entreprise
                  </p>
                  <p className="text-2xl text-indigo-600 font-bold mb-4">
                    29,99€ / mois
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2 text-left max-w-sm mx-auto">
                    <li className="flex items-center">
                      <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                      Consultation illimitée des profils freelance et opentowork
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                      Publication illimitée d'offres de mission
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                      Mise en avant de vos offres
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Tarification & Fonctionnement
        </h1>

        {/* Freelance connecté */}
        {user?.role === 'freelance' && 'jobseeker' && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Pour les freelances et opentowork</h2>
            <div className="bg-indigo-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 text-lg mb-4">
                💸 Tout est <span className="font-bold">100% gratuit</span> pour vous :
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  Création de profil
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  Réponse aux offres de mission
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  Mise en relation directe avec les entreprises
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Entreprise connectée */}
        {user?.role === 'entreprise' && (
          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Pour les entreprises</h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 text-lg mb-4">
                Utilisez la plateforme <strong>gratuitement</strong> avec les limites suivantes :
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <XCircle className="text-yellow-500 w-5 h-5 mr-2" />
                  Accès à <strong>10 profils</strong> freelance et opentowork maximum
                </li>
                <li className="flex items-center text-gray-700">
                  <XCircle className="text-yellow-500 w-5 h-5 mr-2" />
                  <strong>10 offres de mission</strong> maximum
                </li>
              </ul>
              <p className="text-gray-700 text-lg mb-6">
                Pour un accès illimité, souscrivez à notre offre premium :
              </p>

              <div className="bg-white p-4 border rounded-lg shadow-sm text-center">
                <p className="text-xl font-bold text-gray-900 mb-2">Abonnement Premium Entreprise</p>
                <p className="text-2xl text-indigo-600 font-bold mb-4">29,99€ / mois</p>

                <ul className="text-gray-700 mb-6 space-y-2 text-left max-w-sm mx-auto">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Consultation illimitée des profils
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Publication illimitée d'offres de mission
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                    Mise en avant de vos offres
                  </li>
                </ul>
                
                {localCompanyData?.is_subscribed ? (
                  <p className="text-green-600 font-semibold mt-4">
                    ✅ Vous êtes déjà abonné à l'offre illimitée.
                  </p>
                ) : (
                  <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={async () => {
                      const res = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ userId: user.id }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert('Erreur lors de la redirection vers Stripe');
                      }
                    }}
                  >
                    S'abonner maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tarification;