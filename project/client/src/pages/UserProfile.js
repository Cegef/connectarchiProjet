import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [freelancerData, setFreelancerData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', url: '', image: '' });
  const [portfolioError, setPortfolioError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
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
    portfolio: [],
    name: '',
    siret: '',
    vatNumber: '',
    registrationCity: '',
    legalStatus: '',
    address: '',
    website: '',
    logo: '',
  });

  const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
      : 'http://localhost:5000';  // URL en développement local



  useEffect(() => {
    if (!user || !token) {
      navigate('/');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (!user || !token) return;

    if (user.role === 'freelance') {
      fetch(`${apiUrl}/api/freelancers/by-user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Erreur API');
          const data = await res.json();
          console.log('Réponse API freelance:', data);
          return data;
        })
        .then((freelancer) => {
          const skillsArray = Array.isArray(freelancer.skills)
            ? freelancer.skills
            : (typeof freelancer.skills === 'string' ? freelancer.skills.split(',').map(s => s.trim()) : []);
          setFreelancerData({
            ...freelancer,
            skills: skillsArray,
          });
          setFormData((prev) => ({
            ...prev,
            title: freelancer.title || '',
            specialization: freelancer.specialization || '',
            location: freelancer.location || '',
            hourly_rate: freelancer.hourly_rate?.toString() || '',
            description: freelancer.description || '',
            skills: skillsArray.join(', '),
            availability: freelancer.availability || 'Disponible',
            experience_years: freelancer.experience_years?.toString() || '0',
            avatar: freelancer.avatar || '',
            portfolio: Array.isArray(freelancer.portfolio) ? [...freelancer.portfolio] : [],
          }));
        })
        .catch((err) => console.error('Erreur lors du chargement des données freelance :', err));
    } else if (user.role === 'entreprise') {
      fetch(`${apiUrl}/api/companies/by-user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Erreur API');
          const data = await res.json();
          console.log('Réponse API entreprise:', data);
          return data;
        })
        .then((company) => {
          setCompanyData(company);
          fetch(`${apiUrl}/api/applications/by-company/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(res => res.json())
            .then(data => setApplications(Array.isArray(data) ? data : []))
            .catch(() => setApplications([]));
          setFormData((prev) => ({
            ...prev,
            name: company.name || '',
            siret: company.siret || '',
            vatNumber: company.vatNumber || '',
            registrationCity: company.registrationCity || '',
            legalStatus: company.legalStatus || '',
            address: company.address || '',
            website: company.website || '',
            description: company.description || '',
            logo: company.logo || '',
          }));
        })
        .catch((err) => console.error('Erreur lors du chargement des données entreprise :', err));
    }

    // Ce fetch est exécuté pour TOUS les utilisateurs connectés
    fetch(`${apiUrl}/api/conversations/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setConversations)
      .catch(() => setConversations([]));

  }, [user, token, apiUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user?.role === 'freelance' && freelancerData) {
      const updatedFreelancer = {
        title: formData.title,
        specialization: formData.specialization,
        location: formData.location,
        hourly_rate: Number(formData.hourlyRate),
        description: formData.description,
        skills: formData.skills.split(',').map((s) => s.trim()),
        availability: formData.availability,
        experience_years: Number(formData.experienceYears),
        avatar: formData.avatar,
        portfolio: formData.portfolio,
      };

      fetch(`${apiUrl}/api/freelancers/by-user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFreelancer),
      })
        .then((res) => res.json())
        .then(() => {
          setFreelancerData(updatedFreelancer);
          setIsEditing(false);
        })
        .catch((err) => console.error('Erreur lors de la mise à jour des données freelance :', err));
    } else if (user?.role === 'entreprise' && companyData) {
      const updatedCompany = {
        ...companyData,
        name: formData.name,
        siret: formData.siret,
        vatNumber: formData.vatNumber,
        registrationCity: formData.registrationCity,
        legalStatus: formData.legalStatus,
        address: formData.address,
        website: formData.website,
        description: formData.description,
        logo: formData.logo,
      };

      fetch(`${apiUrl}/api/companies/by-user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCompany),
      })
        .then((res) => res.json())
        .then(() => {
          setCompanyData(updatedCompany);
          setIsEditing(false);
        })
        .catch((err) => console.error('Erreur lors de la mise à jour des données entreprise :', err));
    }
  };

  useEffect(() => {
    if (user?.role === 'freelance' && freelancerData?.id) {
      fetch(`${apiUrl}/api/portfolio/by-freelance/${freelancerData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setPortfolioList(Array.isArray(data) ? data : []))
        .catch(() => setPortfolioList([]));
    }
  }, [user, token, apiUrl, freelancerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderFreelanceForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre professionnel</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: Architecte d'intérieur"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: Design résidentiel"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: Paris"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (€)</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
          <input
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: 5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Décrivez votre expérience et vos domaines d'expertise..."
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
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
    </div>
  );

  const renderCompanyForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: BIMPLY SAS"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
          <input
            type="text"
            name="siret"
            value={formData.siret}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: 123 456 789 00012"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de TVA</label>
          <input
            type="text"
            name="vatNumber"
            value={formData.vatNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: FR123456789"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville d'immatriculation</label>
          <input
            type="text"
            name="registrationCity"
            value={formData.registrationCity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: Paris"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut juridique</label>
          <input
            type="text"
            name="legalStatus"
            value={formData.legalStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: SAS, SARL, EI..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: 10 rue de la Paix, 75002 Paris"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ex: https://bimply.fr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Logo entreprise"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">Aucun logo</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formDataFile = new FormData();
                formDataFile.append('logo', file);
                try {
                  const apiUrl = process.env.NODE_ENV === 'production'
                    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
                    : 'http://localhost:5000';
                  const res = await fetch(`${apiUrl}/api/upload/logo`, {
                    method: 'POST',
                    body: formDataFile,
                  });
                  const data = await res.json();
                  if (data.url) {
                    setFormData(prev => ({ ...prev, logo: data.url }));
                  }
                } catch (error) {
                  console.error('Erreur lors de l\'upload du logo:', error);
                }
              }}
              className="w-full text-sm text-gray-500"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Décrivez votre entreprise, vos activités, vos valeurs..."
          />
        </div>
      </div>
    </div>
  );

  const renderFreelanceProfile = () =>
    freelancerData && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <img
            src={freelancerData.avatar || 'uploads/default_freelance_avatar.png'}
            alt={freelancerData.name}
            className="w-20 h-20 rounded mr-4 object-cover"
          />
          <h2 className="text-2xl font-bold">{freelancerData.title}</h2>
          <p className="text-gray-600">{freelancerData.specialization}</p>
        </div>
        <div className="mb-2"><b>Localisation :</b> {freelancerData.location}</div>
        <div className="mb-2">
          <b>Tarif horaire :</b>{" "}
          {freelancerData.hourly_rate !== undefined && freelancerData.hourly_rate !== null && freelancerData.hourly_rate !== ""
            ? `${freelancerData.hourly_rate} €`
            : "Non renseigné"}
        </div>
        <div className="mb-2">
          <b>Années d'expérience :</b>{" "}
          {freelancerData.experience_years !== undefined && freelancerData.experience_years !== null && freelancerData.experience_years !== ""
            ? freelancerData.experience_years
            : "Non renseigné"}
        </div>
        <div className="mb-2"><b>Disponibilité :</b> {freelancerData.availability}</div>
        <div className="mb-2"><b>Description :</b> {freelancerData.description}</div>
        <div className="mb-2">
          <b>Compétences :</b>{" "}
          {Array.isArray(freelancerData.skills)
            ? freelancerData.skills.join(', ')
            : freelancerData.skills}
        </div>

        {/* Portfolio */}
        {user?.role === 'freelance' && user.id === freelancerData?.user_id && (
          <div className="mt-6">
            {/* Affichage des portfolios depuis la table portfolio */}
            {Array.isArray(portfolioList) && portfolioList.length > 0 && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolioList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition bg-white"
                    onClick={() => item.id && navigate(`/portfolio/item/${item.id}`)}
                    title={item.title || item.url || 'Projet'}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || `Projet ${idx + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {item.url && !item.image ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline break-all font-semibold mb-2"
                        >
                          {item.url}
                        </a>
                      ) : (
                        <>
                          <div className="font-bold text-lg mb-1">{item.title}</div>
                          <div className="text-gray-600 text-sm mb-2">
                            {item.description && item.description.length > 120
                              ? item.description.slice(0, 120) + '…'
                              : item.description}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton d'ajout */}
            <button
              type="button"
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => setShowPortfolioForm(v => !v)}
            >
              {showPortfolioForm ? "Annuler" : "Ajouter un projet"}
            </button>
            {showPortfolioForm && (
              <div className="border rounded-lg p-4 bg-white shadow mb-2">
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={e => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Titre du projet"
                />
                <textarea
                  value={newPortfolio.description}
                  onChange={e => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Description du projet"
                />
                <input
                  type="text"
                  value={newPortfolio.url}
                  onChange={e => setNewPortfolio({ ...newPortfolio, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Lien du projet (optionnel)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formDataFile = new FormData();
                    formDataFile.append('image', file);
                    const apiUrl = process.env.NODE_ENV === 'production'
                      ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
                      : 'http://localhost:5000';  // URL en développement local
                    const res = await fetch(`${apiUrl}/api/upload/portfolio`, {
                      method: 'POST',
                      body: formDataFile,
                    });
                    const data = await res.json();
                    if (data.url) {
                      setNewPortfolio(p => ({ ...p, image: data.url }));
                    }
                  }}
                  className="w-full text-sm text-gray-500 mb-2"
                />
                {newPortfolio.image && (
                  <img src={newPortfolio.image} alt="Aperçu" className="w-32 h-32 object-cover mb-2" />
                )}
                {portfolioError && <div className="text-red-500 mb-2">{portfolioError}</div>}
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={async () => {
                    if (!newPortfolio.title && !newPortfolio.url) {
                      setPortfolioError("Titre ou lien requis");
                      return;
                    }
                    setPortfolioError('');
                    // Ajout dans la table portfolio
                    try {
                      const res = await fetch(`${apiUrl}/api/portfolio`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          freelance_id: freelancerData.id,
                          title: newPortfolio.title || null,
                          description: newPortfolio.description || null,
                          image: newPortfolio.image || null,
                          url: newPortfolio.url || null,
                        }),
                      });
                      if (res.ok) {
                        // Recharge la liste des portfolios
                        const updated = await fetch(`${apiUrl}/api/portfolio/by-freelance/${freelancerData.id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        }).then(r => r.json());
                        setPortfolioList(Array.isArray(updated) ? updated : []);
                        setNewPortfolio({ title: '', description: '', url: '', image: '' });
                        setShowPortfolioForm(false);
                      } else {
                        setPortfolioError("Erreur lors de l'ajout du projet");
                      }
                    } catch (err) {
                      setPortfolioError("Erreur lors de l'ajout du projet");
                    }
                  }}
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );

  const renderCompanyProfile = () =>
    companyData && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center">
          <img
            src={companyData.logo || 'uploads/default_entreprise_avatar.png'}
            alt={companyData.name}
            className="w-20 h-20 rounded mr-4 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{companyData.name}</h2>
            <p className="text-gray-600">{companyData.legalStatus}</p>
          </div>
        </div>
        <div className="mb-2"><b>SIRET :</b> {companyData.siret}</div>
        <div className="mb-2">
          <b>Code Postal :</b> {companyData.vatNumber || companyData.vat_number || "Non renseigné"}
        </div>
        <div className="mb-2">
          <b>Ville :</b> {companyData.registrationCity || companyData.registration_city || "Non renseigné"}
        </div>
        <div className="mb-2"><b>Adresse :</b> {companyData.address}</div>
        <div className="mb-2"><b>Site web :</b> {companyData.website && (
          <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">{companyData.website}</a>
        )}</div>
        <div className="mb-2"><b>Description :</b> {companyData.description}</div>
      </div>
    );

  // Pour debug
  console.log('user:', user);
  console.log('token:', token);
  console.log('freelancerData:', freelancerData);
  console.log('companyData:', companyData);

  const handleContactFreelance = async (freelancerId, jobId, jobTitle, freelancerName, companyName) => {
    try {
      let title = '';
      if (jobId && jobTitle) {
        title = `Appel d'offre : ${jobTitle}`;
      } else if (user.role === 'entreprise' && freelancerName) {
        title = `Contact direct avec le freelance ${freelancerName}`;
      } else if (user.role === 'freelance' && companyName) {
        title = `Contact direct avec l'entreprise ${companyName}`;
      } else {
        title = 'Nouvelle conversation';
      }

      const res = await fetch(`${apiUrl}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user1_id: user.id,
          user2_id: freelancerId,
          job_id: jobId,
          title,
        }),
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/chat/${data.id}`);
      }
    } catch (err) {
      alert("Erreur lors de la création de la conversation");
    }
  };

  if (user?.role === 'entreprise' && Array.isArray(applications)) {
    applications.forEach(app => {
      console.log('Candidature reçue :', app);
    });
  }

  if (!user || !token) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        {(user?.role === 'freelance' || user?.role === 'entreprise') && !isEditing && activeTab === 'profile' && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Modifier le profil
          </button>
        )}
      </div>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profil
          </button>
          {user.role === 'entreprise' && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Candidatures reçues
            </button>
          )}
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Messages
          </button>
        </nav>
      </div>

      {/* Affichage conditionnel selon l'onglet */}
      {activeTab === 'profile' && (
        user?.role === 'freelance' ? (
          isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFreelanceForm()}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            renderFreelanceProfile()
          )
        ) : user?.role === 'entreprise' ? (
          isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderCompanyForm()}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            renderCompanyProfile()
          )
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="mt-4 text-gray-600">Type de compte: {user?.role}</p>
            </div>
          </div>
        )
      )}

      {activeTab === 'applications' && user?.role === 'entreprise' && (
        <div>
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Aucune candidature reçue.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div>
                  <b>{app.freelancer_name}</b> a postulé à <b>{app.job_title}</b>
                </div>
                <div>Lettre de motivation : {app.coverLetter}</div>
                <div>Taux proposé : {app.proposedRate} €/jour</div>
                <div>Envoyée le : {new Date(app.createdAt).toLocaleDateString()}</div>
                <button
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={() =>
                    handleContactFreelance(
                      app.freelancer_user_id,
                      app.job_id,
                      app.job_title,
                      app.freelancer_name,
                      companyData?.name // nom de l'entreprise connectée
                    )
                  }
                >
                  Contacter ce freelance
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          {!Array.isArray(conversations) || conversations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Aucune conversation.</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {conv.other_role === 'entreprise' ? (
                      <img
                        src={conv.other_avatar || '/uploads/default_entreprise_avatar.png'}
                        alt={`Logo de ${conv.other_username}`}
                        className="w-16 h-16 object-contain rounded-lg" // Logo carré pour entreprise
                      />
                    ) : (
                      <img
                        src={conv.other_avatar || '/uploads/default_freelance_avatar.png'}
                        alt={`Avatar de ${conv.other_username}`}
                        className="w-12 h-12 object-cover rounded-full" // Avatar rond pour freelance
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {conv.other_username}
                      <span className="ml-2 text-sm text-gray-500">
                        {conv.other_role === 'entreprise' ? (
                          <span className="text-blue-600">Entreprise</span>
                        ) : (
                          <span className="text-green-600">Freelance</span>
                        )}
                      </span>
                    </h3>
                    {conv.title && (
                      <p className="text-gray-600 text-sm">
                        Sujet: {conv.title}
                      </p>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => navigate(`/chat/${conv.id}`)}
                  >
                    Ouvrir le chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}