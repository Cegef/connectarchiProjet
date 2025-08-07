import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function JobSeekerProfileSetup() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  // État pour le formulaire utilisateur
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'jobseeker' // Par défaut, le rôle est "jobseeker"
  });

  // État pour le formulaire de profil demandeur d'emploi
  const [formData, setFormData] = useState({
    title: '',
    specialization: '',
    location: '',
    expectedSalary: '',
    description: '',
    skills: '',
    availability: 'Disponible immédiatement',
    experienceYears: '0',
    avatar: '',
    cv: '' // URL du CV uploadé
  });


  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const sendVerificationCode = async () => {
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
      : 'http://localhost:5000';

    try {
      const res = await fetch(`${apiUrl}/api/verification/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: userFormData.phone })
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setError('');
      } else {
        setError('Erreur lors de l’envoi du code.');
      }
    } catch (err) {
      setError('Erreur lors de l’envoi du code SMS.');
    }
  };

  const verifyCode = async () => {
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
      : 'http://localhost:5000';

    try {
      const res = await fetch(`${apiUrl}/api/verification/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: userFormData.phone,
          code: verificationCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsPhoneVerified(true);
        setError('');
      } else {
        setError('Code invalide ou expiré.');
      }
    } catch (err) {
      setError('Erreur lors de la vérification du code.');
    }
  };

  // Gestion des changements dans le formulaire utilisateur
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion des changements dans le formulaire demandeur d'emploi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l'upload du CV
  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Seuls les fichiers PDF et Word sont acceptés pour le CV.');
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append('cv', file);
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';
    
    try {
      const res = await fetch(`${apiUrl}/api/upload/cv`, {
        method: 'POST',
        body: formDataFile,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, cv: `${backendUrl}${data.url}` }));
        setError('');
      }
    } catch (err) {
      setError('Erreur lors de l\'upload du CV.');
    }
  };

  // Gestion de la soumission combinée des formulaires
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isPhoneVerified) {
      setError('Veuillez vérifier votre numéro de téléphone avant de continuer.');
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';

    try {
      console.log('Données envoyées :', userFormData);

      // Enregistrement de l'utilisateur
      const userResponse = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userFormData)
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('Erreur backend :', errorData);
        throw new Error(errorData.error || 'Erreur lors de la création du compte utilisateur');
      }

      // Récupère les données utilisateur, y compris le token
      const userData = await userResponse.json();

      // Connexion automatique (si le backend ne renvoie pas déjà le token)
      let token = userData.token;
      let userId = userData.id || userData.user?.id;

      if (!token) {
        // Si pas de token, on fait un login
        const loginResponse = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userFormData.email,
            password: userFormData.password,
          }),
        });
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) throw new Error(loginData.error || 'Erreur lors de la connexion');
        token = loginData.token;
        userId = loginData.user.id;
      }

      // Stocker les informations d'authentification
      setAuthData({
        token: token,
        user: {
          id: userId,
          username: userFormData.username,
          email: userFormData.email,
          role: 'jobseeker'
        }
      });

      // Enregistrement du profil demandeur d'emploi
      const jobseekerResponse = await fetch(`${apiUrl}/api/jobseekers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Utilise le token d'authentification
        },
        body: JSON.stringify({
          ...formData,
          expectedSalary: Number(formData.expectedSalary),
          experienceYears: Number(formData.experienceYears),
          user_id: userId // Associe le profil à l'utilisateur créé
        })
      });

      if (!jobseekerResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde du profil demandeur d\'emploi');
      }

      
      navigate('/profile'); // Redirige vers la page de profil
    } catch (err) {
      console.error('Erreur :', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un compte OpenToWork</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Formulaire utilisateur */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informations utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom Prénom
              </label>
              <input
                type="text"
                name="username"
                value={userFormData.username}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: Jean Dupont"
                pattern="^[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)+$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: jean.dupont@example.com"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={userFormData.password}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Mot de passe"
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={userFormData.phone}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: +33612345678"
                required
              />

              {!codeSent ? (
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="mt-2 text-sm text-indigo-600 underline"
                >
                  Envoyer le code de vérification
                </button>
              ) : !isPhoneVerified ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Code reçu par SMS"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={verifyCode}
                    className="text-sm text-indigo-600 underline"
                  >
                    Vérifier le code
                  </button>
                </div>
              ) : (
                <p className="text-green-600 text-sm mt-2">✅ Téléphone vérifié</p>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire demandeur d'emploi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profil OpenToWork</h2>
          
          {/* Avatar */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.avatar ? (
                    <img
                      src={`${backendUrl}${formData.avatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    // Envoi du fichier au backend
                    const formDataFile = new FormData();
                    formDataFile.append('avatar', file);
                    const apiUrl = process.env.NODE_ENV === 'production'
                    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
                    : 'http://localhost:5000';
                    const res = await fetch(`${apiUrl}/api/upload/avatar`, {
                      method: 'POST',
                      body: formDataFile,
                    });
                    const data = await res.json();
                    if (data.url) {
                      setFormData((prev) => ({ ...prev, avatar: data.url }));
                    }
                  }}
                  className="mt-2 w-full text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poste recherché
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: Architecte junior"
                pattern="^[A-Za-zÀ-ÿ''\- ]{2,100}$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spécialisation
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: Architecture résidentielle"
                pattern="^[A-Za-zÀ-ÿ''\- ]{2,100}$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Années d'expérience
              </label>
              <select
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {[...Array(21)].map((_, i) => (
                  <option key={i} value={i}>
                    {i} {i <= 1 ? 'an' : 'ans'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: Paris"
                pattern="^[A-Za-zÀ-ÿ''\- ]{2,100}$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salaire attendu (€/an)
              </label>
              <input
                type="number"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: 45000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilité
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Disponible immédiatement">Disponible immédiatement</option>
                <option value="Disponible sous 1 mois">Disponible sous 1 mois</option>
                <option value="Disponible sous 3 mois">Disponible sous 3 mois</option>
                <option value="En poste, ouvert aux opportunités">En poste, ouvert aux opportunités</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / Objectif professionnel
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Décrivez votre parcours et vos objectifs professionnels..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compétences
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: AutoCAD, Revit, Gestion de projet (séparés par des virgules)"
                required
              />
            </div>
          </div>

          {/* CV Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CV (PDF ou Word)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              {formData.cv && (
                <div className="flex items-center text-green-600">
                  <FileText className="h-5 w-5 mr-2" />
                  <a
                    href={formData.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    Voir le CV
                  </a>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés : PDF, DOC, DOCX (max 5MB)
            </p>
          </div>
        </div>

         {/* Section Politique de confidentialité */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="privacyPolicy"
              checked={acceptPrivacyPolicy}
              onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="privacyPolicy" className="text-sm text-gray-700">
              J'accepte la{' '}
              <a 
                href="/politique-confidentialite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                politique de confidentialité
              </a>{' '}
              et les{' '}
              <a 
                href="/conditions-utilisation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                conditions d'utilisation
              </a>
              . Je consens au traitement de mes données personnelles conformément à ces politiques. *
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-6 py-3 rounded-md transition-colors ${
              acceptPrivacyPolicy && !loading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!acceptPrivacyPolicy || loading}
          >
            {loading ? 'Enregistrement...' : 'Créer le compte et enregistrer le profil'}
          </button>
        </div>
      </form>
    </div>
  );
}