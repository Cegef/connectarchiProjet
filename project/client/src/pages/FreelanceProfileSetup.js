import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function FreelanceProfileSetup() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  // État pour le formulaire utilisateur
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'freelance' // Par défaut, le rôle est "freelance"
  });

  // État pour le formulaire de profil freelance
  const [formData, setFormData] = useState({
    title: '',
    specialization: '',
    location: '',
    hourlyRate: '',
    description: '',
    skills: '',
    availability: 'Disponible',
    experienceYears: '0',
    avatar: '',
    portfolio: [], // Tableau pour stocker les éléments du portfolio
    siret: '',
  });

  const [portfolioItem, setPortfolioItem] = useState(''); // État pour gérer l'entrée du portfolio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [portfolioType, setPortfolioType] = useState('link'); // 'link' ou 'project'
  const [project, setProject] = useState({
    title: '',
    description: '',
    image: '',
    url: ''
  });

  // Gestion des changements dans le formulaire utilisateur
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion des changements dans le formulaire freelance
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  // Gestion de l’upload d’image projet
  const handleProjectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataFile = new FormData();
    formDataFile.append('avatar', file);
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
      : 'http://localhost:5000';  // URL en développement local
    const res = await fetch(`${apiUrl}/api/upload/avatar`, {
      method: 'POST',
      body: formDataFile,
    });
    const data = await res.json();
    if (data.url) {
      setProject((prev) => ({ ...prev, image: data.url }));
    }
  };

  const handleAddPortfolioItem = () => {
    if (portfolioType === 'link' && project.url.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, { url: project.url }]
      }));
    } else if (portfolioType === 'project' && project.title.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, {
          title: project.title,
          description: project.description,
          image: project.image
        }]
      }));
    }
    setProject({ title: '', description: '', image: '', url: '' });
  };

  const handleRemovePortfolioItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  

  // Gestion de la soumission combinée des formulaires utilisateur et freelance
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';  // URL en développement local

    try {
        console.log('Données envoyées :', userFormData);

        // Enregistrement de l'utilisateur

        // --- Vérification API entreprise pour freelance via SIREN uniquement
        const siret = formData.siret;
        const sirenFromSiret = siret.substring(0, 9);

        const searchResponse = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${sirenFromSiret}`);
        const searchData = await searchResponse.json();
        const matches = searchData.results || [];

        const sirenMatch = matches.some(company => company.siren === sirenFromSiret);
        if (!sirenMatch) {
          setError("Le SIREN fourni est introuvable dans la base des entreprises.");
          setLoading(false);
          return;
        }

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
                role: 'freelance'
            }
        });

        // Enregistrement du profil freelance
        const freelanceResponse = await fetch(`${apiUrl}/api/freelances`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Utilise le token d'authentification
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: Number(formData.hourlyRate),
          experienceYears: Number(formData.experienceYears),
          user_id: userId, // Associe le profil freelance à l'utilisateur créé
          siret: formData.siret
        })
        });

        if (!freelanceResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde du profil freelance');
        }

        const freelanceData = await freelanceResponse.json();
        const freelanceId = freelanceData.id || freelanceData.freelance?.id;

        for (const item of formData.portfolio) {
          await fetch(`${apiUrl}/api/portfolio`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` // si besoin d'auth
            },
            body: JSON.stringify({
              freelance_id: freelanceId, // récupéré après création du profil freelance
              title: item.title || null,
              description: item.description || null,
              image: item.image || null,
              url: item.url || null
            })
          });
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un compte utilisateur et compléter votre profil freelance</h1>

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
                placeholder="ex: johndoe"
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
                placeholder="ex: johndoe@example.com"
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
          </div>
        </div>

        {/* Formulaire freelance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profil freelance</h2>
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
                Titre professionnel
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: Architecte d'intérieur"
                pattern="^[A-Za-zÀ-ÿ'’\- ]{2,100}$"
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
                placeholder="ex: Design résidentiel"
                pattern="^[A-Za-zÀ-ÿ'’\- ]{2,100}$"
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
                pattern="^[A-Za-zÀ-ÿ'’\- ]{2,100}$"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarif horaire (€)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: 85"
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
                <option value="Disponible">Disponible</option>
                <option value="Indisponible">Indisponible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SIRET
              </label>
              <input
                type="text"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ex: 12345678901234"
                pattern="^\d{14}$"
                title="Le numéro SIRET doit contenir 14 chiffres."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Décrivez votre expérience et vos domaines d'expertise..."
                pattern="^[A-Za-zÀ-ÿ'’\- ]{2,100}$"
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
                placeholder="ex: AutoCAD, Revit, Design durable (séparés par des virgules)"
                required
              />
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio
            </label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${portfolioType === 'link' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setPortfolioType('link')}
              >
                Lien
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${portfolioType === 'project' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setPortfolioType('project')}
              >
                Projet
              </button>
            </div>
            {portfolioType === 'link' ? (
              <input
                type="text"
                value={project.url}
                onChange={e => setProject({ ...project, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Lien du projet"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={project.title}
                  onChange={e => setProject({ ...project, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Titre du projet"
                />
                <textarea
                  value={project.description}
                  onChange={e => setProject({ ...project, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Description du projet"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProjectImageUpload}
                  className="w-full text-sm text-gray-500"
                />
                {project.image && (
                  <img src={project.image} alt="Aperçu" className="w-32 h-32 object-cover mt-2" />
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleAddPortfolioItem}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Ajouter
            </button>
            <ul className="mt-4 space-y-2">
              {formData.portfolio.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline break-all">{item.url}</a>
                  ) : (
                    <div>
                      <b>{item.title}</b>
                      <div>{item.description}</div>
                      {item.image && <img src={`${backendUrl}${item.image}`} alt={item.title} className="w-16 h-16 object-cover mt-1" />}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolioItem(index)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Créer le compte et enregistrer le profil'}
          </button>
        </div>
      </form>
    </div>
  );
}