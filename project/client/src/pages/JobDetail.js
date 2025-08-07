import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, Clock, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [freelancer, setFreelancer] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedRate: ''
  });

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';


    useEffect(() => {
    if (user?.id) {
        fetch(`${apiUrl}/api/freelancers/by-user/${user.id}`)
        .then(res => res.json())
        .then(setFreelancer)
        .catch(() => setFreelancer(null));
    }
    }, [user, apiUrl]);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/appels-doffre`);
        const jobs = await res.json();
        const foundJob = jobs.find(j => String(j.id) === String(id));
        setJob(foundJob || null);

        if (foundJob) {
          // Récupère la société liée à l'offre
          const resCompany = await fetch(`${apiUrl}/api/companies/${foundJob.entreprise_id}`);
          if (resCompany.ok) {
            const companyData = await resCompany.json();
            setCompany(companyData);
          } else {
            setCompany(null);
          }
        } else {
          setCompany(null);
        }
      } catch (err) {
        setJob(null);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, apiUrl]);

  useEffect(() => {
    if (!user) setShowAuthModal(true);
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour consulter les détails des offres de mission.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Créer un compte
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="register"
        />
      </div>
    );
  }

  if (!job || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Offre non trouvée</p>
      </div>
    );
  }

  // Pour requirements, on splitte si c'est une string
  const requirements = job.requirements
    ? Array.isArray(job.requirements)
      ? job.requirements
      : job.requirements.split('\n').filter(Boolean)
    : [];

  // Pour le budget, on affiche la valeur unique ou min-max si tu veux l'étendre plus tard
  const budget = job.budget ? `${job.budget} €` : '—';

  // Pour la durée
  const duration = job.duree || 'Non précisée';

  // Pour la date limite
  const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Non précisée';

  // Pour le remote
  const remote = job.remote ? true : false;

  // Pour le statut (tu peux l'adapter selon ta logique)
  const status = 'open';

  // Gestion de la candidature (à adapter selon ton backend)
  const handleApply = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Ajoute l'Authorization si besoin :
            // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            jobId: job.id,
            freelancerId: freelancer.id,
            coverLetter: applicationData.coverLetter,
            proposedRate: applicationData.proposedRate,
        }),
        });
        if (!res.ok) throw new Error('Erreur lors de l\'envoi de la candidature');
        // Optionnel : afficher un message de succès
    } catch (err) {
        alert("Erreur lors de l'envoi de la candidature");
    }
    setShowApplicationModal(false);
    navigate('/profile');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/jobs"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour aux offres
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.titre}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <Building2 className="h-5 w-5 mr-2" />
                <span className="font-medium">{company.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{job.lieu || 'Non précisé'}</span>
                {remote && (
                  <span className="ml-2 text-indigo-600">(Remote possible)</span>
                )}
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {status === 'open' ? 'Ouvert' : 'Fermé'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prérequis</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {requirements.length > 0 ? requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  )) : <li>Aucun prérequis spécifié</li>}
                </ul>
              </section>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Durée : {duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Date limite : {deadline}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 mb-2">Budget journalier</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {budget}
                    <span className="text-base font-normal text-gray-600">/jour</span>
                  </p>
                </div>

                {user?.role === 'freelance' && status === 'open' && (
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Postuler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Postuler à l'offre</h2>
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lettre de motivation
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux journalier proposé (€)
                </label>
                <input
                  type="number"
                  value={applicationData.proposedRate}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, proposedRate: e.target.value }))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Envoyer ma candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}