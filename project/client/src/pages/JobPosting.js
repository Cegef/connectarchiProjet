import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, Clock, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreateJobModal from '../components/CreateJobModal';
import AuthModal from '../components/AuthModal';

export default function JobPostings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';

  const fetchData = async () => {
    setLoading(true);
    try {
        const resJobs = await fetch(`${apiUrl}/api/appels-doffre`);
        const jobs = await resJobs.json();
        setJobPostings(Array.isArray(jobs) ? jobs : []);

        const resCompanies = await fetch(`${apiUrl}/api/companies`);
        const companiesData = await resCompanies.json();
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (err) {
        setJobPostings([]);
        setCompanies([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupère les appels d'offre
        const resJobs = await fetch(`${apiUrl}/api/appels-doffre`);
        const jobs = await resJobs.json();
        setJobPostings(jobs);

        // Récupère les entreprises
        const resCompanies = await fetch(`${apiUrl}/api/companies`);
        const companiesData = await resCompanies.json();
        setCompanies(companiesData);
      } catch (err) {
        setJobPostings([]);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (!user) setShowAuthModal(true);
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appels d'offres</h1>
        </div>
        <p className="text-center text-indigo-700 font-semibold mb-8">
          Connectez-vous ou créez un compte pour découvrir et postuler aux meilleures opportunités du secteur !
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(jobPostings) && jobPostings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 opacity-60 pointer-events-none"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.titre}
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>Accès restreint</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Ouvert
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Accès restreint</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Durée : Accès restreint</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Date limite : Accès restreint</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-900 font-medium">
                      Budget : {job.budget ? `${job.budget} €` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {jobPostings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun appel d'offres disponible pour le moment.</p>
          </div>
        )}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appels d'offres</h1>
        {user?.role === 'entreprise' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Publier un appel d'offres
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobPostings.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {job.titre}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>
                      {companies.find(c => c.id === job.entreprise_id)?.name || 'Entreprise inconnue'}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Ouvert
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.lieu || 'Non précisé'}</span>
                  {job.remote ? (
                    <span className="ml-2 text-indigo-600">(Remote possible)</span>
                  ) : null}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Durée : {job.duree || 'Non précisée'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Date limite : {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Non précisée'}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-gray-900 font-medium">
                    Budget : {job.budget ? `${job.budget} €` : '—'}
                  </div>
                  {user?.type === 'freelancer' && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Postuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {jobPostings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun appel d'offres disponible pour le moment.</p>
        </div>
      )}
      <CreateJobModal isOpen={showCreateModal} onClose={() => {setShowCreateModal(false); fetchData();}} />
    </div>
  );
}