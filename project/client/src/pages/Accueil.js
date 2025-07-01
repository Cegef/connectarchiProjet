import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ArrowRight, Users, Building, Briefcase, Award } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

export default function Accueil() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowCookieBanner(true);
    } else {
      setCookieConsent(consent);
      setShowCookieBanner(false);
    }
  }, []);

  useEffect(() => {

    if (!Cookies.get('csrf_token')) {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        Cookies.set('csrf_token', token, { sameSite: 'strict', secure: true });
    }
    // Tracking activé seulement si cookieConsent === 'accepted'
    if (cookieConsent === 'accepted') {
      // Exemple : Google Analytics (remplace par ton script réel)
      if (!window.gtag) {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X';
        script.async = true;
        document.body.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'UA-XXXXXXXXX-X');
      }
    }
    // Si refusé, tu peux désactiver/retirer le tracking ici si besoin
  }, [cookieConsent]);


  const handleAcceptCookies = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setCookieConsent('accepted');
    setShowCookieBanner(false);
  };

  const handleRefuseCookies = () => {
    Cookies.set('cookieConsent', 'refused', { expires: 365 });
    setCookieConsent('refused');
    setShowCookieBanner(false);
    // Ici tu peux aussi supprimer les cookies de tracking si besoin
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Trouvez le freelance idéal pour votre projet
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Freelances, trouvez votre prochaine mission et répondez aux appels d’offres en un clic sans intermédiaire
          </p>

          <div>
            <SearchBar />
          </div>
          <br></br>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Expertise Variée',
                description: 'Des architectes spécialisés dans différents domaines',
              },
              {
                title: 'Collaboration Simple',
                description: 'Un processus de mise en relation fluide et efficace',
              },
              {
                title: 'Projets Garantis',
                description: 'Des freelances vérifiés et des projets sécurisés',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <Link
            to="/freelancers"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Explorer les profils
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Section descriptive de l'entreprise */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ConnectArchi : Renouer le lien entre architectes et entreprises
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre mission est de créer un écosystème dynamique où les jeunes talents d'architecture peuvent s'épanouir et où les entreprises trouvent l'expertise dont elles ont besoin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Vision</h3>
              <p className="text-gray-600 mb-6">
                Fondée en 2023, ConnectArchi est née d'un constat simple : le secteur de l'architecture connaît une transformation profonde, avec de plus en plus de professionnels choisissant la voie du freelancing, tandis que les entreprises peinent à trouver les compétences spécifiques dont elles ont besoin.
              </p>
              <p className="text-gray-600">
                Notre plateforme vise à combler ce fossé en offrant un espace où les jeunes architectes peuvent mettre en valeur leur talent et où les entreprises peuvent facilement trouver les compétences adaptées à leurs projets spécifiques.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                alt="Bâtiment moderne"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
                alt="Architectes collaborant"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Approche</h3>
              <p className="text-gray-600 mb-6">
                Nous croyons en la puissance de la collaboration et de l'innovation. ConnectArchi n'est pas qu'une simple plateforme de mise en relation, c'est un écosystème complet qui accompagne les architectes freelances dans leur développement professionnel et aide les entreprises à concrétiser leurs visions architecturales.
              </p>
              <p className="text-gray-600">
                Grâce à notre processus de vérification rigoureux, nous garantissons la qualité des profils et la sécurité des transactions, créant ainsi un environnement de confiance pour tous nos utilisateurs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="h-10 w-10 text-indigo-600 mb-4" />,
                title: 'Communauté Grandissante',
                description:
                  'Rejoignez plus de 500 architectes et 200 entreprises déjà actifs sur notre plateforme.',
              },
              {
                icon: <Building className="h-10 w-10 text-indigo-600 mb-4" />,
                title: 'Projets Diversifiés',
                description:
                  'De la rénovation résidentielle aux grands projets commerciaux, trouvez des opportunités adaptées à vos compétences.',
              },
              {
                icon: <Award className="h-10 w-10 text-indigo-600 mb-4" />,
                title: 'Excellence Reconnue',
                description:
                  'Notre plateforme a été récompensée pour son innovation dans le secteur de l\'architecture.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Témoignages de nos utilisateurs
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "ConnectArchi m'a permis de développer mon activité freelance et de trouver des projets passionnants qui correspondent parfaitement à mes compétences.",
                  author: 'Marie Dupont',
                  role: "Architecte d'intérieur",
                  image:
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
                },
                {
                  quote:
                    'Grâce à cette plateforme, nous avons pu trouver rapidement un architecte spécialisé pour notre projet d\'extension commerciale. Un gain de temps considérable !',
                  author: 'Thomas Martin',
                  role: 'Directeur de projet, Bâtiments Modernes SA',
                  image:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                },
                {
                  quote:
                    'La qualité des profils et la simplicité d\'utilisation de la plateforme en font un outil indispensable pour tout architecte souhaitant se lancer en freelance.',
                  author: 'Sophie Lefèvre',
                  role: 'Architecte urbaniste',
                  image:
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white px-4 py-4 flex flex-col md:flex-row items-center justify-between z-50">
          <span>
            Ce site utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez notre politique de confidentialité.
          </span>
          <div className="flex mt-2 md:mt-0 md:ml-4 space-x-2">
            <button
              onClick={handleAcceptCookies}
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              J'accepte
            </button>
            <button
              onClick={handleRefuseCookies}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
            >
              Je refuse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}