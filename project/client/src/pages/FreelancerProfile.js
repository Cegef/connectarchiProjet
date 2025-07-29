import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Calendar, Clock, ArrowLeft, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function FreelancerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [freelancer, setFreelancer] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [canContact, setCanContact] = useState(true);
  const [contactError, setContactError] = useState('');

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreelancer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/freelancers/${id}`);
        const data = await res.json();
        setFreelancer(data);
      } catch {
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [id, apiUrl]);

  // Récupère le vrai portfolio lié au freelance
  useEffect(() => {
    if (!id) return;
    fetch(`${apiUrl}/api/portfolio/${id}`)
      .then(res => res.json())
      .then(setPortfolio)
      .catch(() => setPortfolio([]));
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Profil non trouvé</p>
      </div>
    );
  }

  // Gestion des champs (camelCase ou snake_case)
  const name = freelancer.username || freelancer.name || 'Freelance';
  const avatar = freelancer.avatar
    ? `${backendUrl}${freelancer.avatar}`
    : `${backendUrl}/uploads/default_freelance_avatar.png`;
  const title = freelancer.title || '';
  const specialization = freelancer.specialization || '';
  const location = freelancer.location || '';
  const description = freelancer.description || '';
  const availability = freelancer.availability || 'Disponible';
  const hourlyRate = freelancer.hourlyRate ?? freelancer.hourly_rate ?? '—';
  const experienceYears = freelancer.experienceYears ?? freelancer.experience_years ?? '—';
  const completedProjects = freelancer.completedProjects ?? freelancer.completed_projects ?? '—';

  // Skills
  let skills = [];
  if (Array.isArray(freelancer.skills)) {
    skills = freelancer.skills;
  } else if (typeof freelancer.skills === 'string') {
    try {
      const parsed = JSON.parse(freelancer.skills);
      skills = Array.isArray(parsed) ? parsed : freelancer.skills.split(',').map(s => s.trim());
    } catch {
      skills = freelancer.skills.split(',').map(s => s.trim());
    }
  }

  // Pour l'image de couverture, on prend la première image du vrai portfolio
  const coverImage =
    portfolio[0] && portfolio[0].image
      ? `${backendUrl}${portfolio[0].image}`
      : `${backendUrl}/uploads/default-portfolio.jpg`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/freelancers"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour à la liste
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 bg-gray-200">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-8">
            <div className="flex items-end">
              <img
                src={avatar}
                alt={name}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-md -mt-16 object-cover"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                <p className="text-xl text-gray-600">{title} {specialization}</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              {contactError && (
                <div className="text-red-500 mb-2">{contactError}</div>
              )}
              {user ? (
                <button 
                  onClick={async () => {
                    if (user?.role === 'entreprise') {
                      // Vérifie la limite côté backend
                      const res = await fetch(`${apiUrl}/api/messages/contacted-count?userId=${user.id}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                      });
                      const data = await res.json();
                      if (data.count >= 10) {
                        setCanContact(false);
                        setContactError("Vous avez atteint la limite de 10 freelances contactés.");
                        return;
                      }
                    }
                    setShowMessageModal(true);
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contacter
                </button>
              ) : (
                <p className="text-gray-600">Connectez-vous pour contacter ce freelance</p>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-600">{description}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.length > 0 ? portfolio.map((item, idx) => {
                    // Si c'est un lien externe
                    if (item.url && !item.image) {
                      return (
                        <div key={item.id} className="rounded-lg overflow-hidden shadow-md p-4 flex items-center">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline break-all"
                          >
                            {item.url}
                          </a>
                        </div>
                      );
                    }
                    // Si c'est un projet avec image
                    if (item.image && item.id) {
                      return (
                        <div
                          key={item.id}
                          className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
                          onClick={() => navigate(`/portfolio/item/${item.id}`)}
                          title="Voir le projet"
                        >
                          <img
                            src={`${backendUrl}${item.image}`}
                            alt={item.title || `Projet ${idx + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900">{item.title || `Projet ${idx + 1}`}</h3>
                            <p className="text-gray-600 text-sm">
                              {item.description && item.description.length > 120
                                ? item.description.slice(0, 120) + '…'
                                : item.description}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }) : <p className="text-gray-500">Aucun projet dans le portfolio.</p>}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )) : <span className="text-gray-500">Aucune compétence renseignée.</span>}
                </div>
              </section>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    {location}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    {completedProjects} projets terminés
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Award className="h-5 w-5 mr-2" />
                    {experienceYears !== '' && experienceYears !== null && experienceYears !== undefined
                      ? `${experienceYears} ${Number(experienceYears) <= 1 ? 'an' : 'ans'} d'expérience`
                      : '—'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    {availability}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 mb-2">Tarif horaire</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {hourlyRate !== '' && hourlyRate !== null && hourlyRate !== undefined
                      ? `${hourlyRate}€`
                      : '—'}
                    <span className="text-base font-normal text-gray-600">/heure</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          receiverId={freelancer.user_id || freelancer.userId}
          senderName={name}
          senderId={user?.id || ''}
        />
      )}
    </div>
  );
}