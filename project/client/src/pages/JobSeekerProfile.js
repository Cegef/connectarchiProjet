import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Calendar, Clock, ArrowLeft, Award, FileText, Euro } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function JobSeekerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [jobseeker, setJobseeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobseeker = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/jobseekers/${id}`);
        const data = await res.json();
        setJobseeker(data);
      } catch {
        setJobseeker(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobseeker();
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!jobseeker) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-600">Profil non trouvé</p>
      </div>
    );
  }

  // Gestion des champs (camelCase ou snake_case)
  const fullName = jobseeker.username || jobseeker.name || 'OpenToWork';
  const firstName = fullName.split(' ')[0];
  const avatar = jobseeker.avatar
    ? `${backendUrl}${jobseeker.avatar}`
    : `${backendUrl}/uploads/default_jobseeker_avatar.png`;
  const title = jobseeker.title || '';
  const location = jobseeker.location || '';
  const description = jobseeker.description || '';
  const availability = jobseeker.availability || 'Disponible';
  const expectedSalary = jobseeker.expectedSalary ?? jobseeker.expected_salary ?? '—';
  const experienceYears = jobseeker.experienceYears ?? jobseeker.experience_years ?? '—';
  const cv = jobseeker.cv || null;

  // Skills
  let skills = [];
  if (Array.isArray(jobseeker.skills)) {
    skills = jobseeker.skills;
  } else if (typeof jobseeker.skills === 'string') {
    try {
      const parsed = JSON.parse(jobseeker.skills);
      skills = Array.isArray(parsed) ? parsed : jobseeker.skills.split(',').map(s => s.trim());
    } catch {
      skills = jobseeker.skills.split(',').map(s => s.trim());
    }
  }

  // Couleur de la disponibilité
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Disponible immédiatement':
        return 'text-green-600 bg-green-50';
      case 'Disponible sous 1 mois':
        return 'text-blue-600 bg-blue-50';
      case 'Disponible sous 3 mois':
        return 'text-yellow-600 bg-yellow-50';
      case 'En poste, ouvert aux opportunités':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute top-4 right-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              OpenToWork
            </span>
          </div>
        </div>

        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-8">
            <div className="flex items-end">
              <img
                src={avatar}
                alt={firstName}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-md -mt-16 object-cover"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{firstName}</h1>
                <p className="text-xl text-gray-600">{title}</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              {user ? (
                <button 
                  onClick={() => setShowMessageModal(true)}
                  className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contacter
                </button>
              ) : (
                <p className="text-gray-600">Connectez-vous pour contacter ce candidat</p>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Objectif professionnel</h2>
                <p className="text-gray-600">{description}</p>
              </section>

              {cv && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">CV</h2>
                  <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">Curriculum Vitae</p>
                        <p className="text-sm text-gray-500">Document PDF/Word</p>
                      </div>
                    </div>
                    <a
                      href={cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Télécharger CV
                    </a>
                  </div>
                </section>
              )}

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
                    <Award className="h-5 w-5 mr-2" />
                    {experienceYears !== '' && experienceYears !== null && experienceYears !== undefined
                      ? `${experienceYears} ${Number(experienceYears) <= 1 ? 'an' : 'ans'} d'expérience`
                      : '—'}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(availability)}`}>
                      {availability}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 mb-2">Salaire attendu</p>
                  <div className="flex items-center">
                    <Euro className="h-6 w-6 text-indigo-600 mr-2" />
                    <p className="text-2xl font-bold text-indigo-600">
                      {expectedSalary !== '' && expectedSalary !== null && expectedSalary !== undefined
                        ? `${Number(expectedSalary).toLocaleString()}€`
                        : '—'}
                      <span className="text-base font-normal text-gray-600">/an</span>
                    </p>
                  </div>
                </div>

                {cv && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <p className="text-gray-600 mb-2">Documents</p>
                    <div className="flex items-center text-green-600">
                      <FileText className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">CV disponible</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          receiverId={jobseeker.user_id || jobseeker.userId}
          senderName={fullName}
          senderId={user?.id || ''}
        />
      )}
    </div>
  );
}