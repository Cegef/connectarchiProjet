import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, SlidersHorizontal, Filter } from 'lucide-react';
import FreelancerCard from '../components/FreelancerCard';
import JobSeekerCard from '../components/JobSeekerCard';
import SearchBar from '../components/SearchBar';

const defaultFilters = {
  specialization: '',
  location: '',
  minRate: 0,
  maxRate: 1000, // très élevé pour ne rien exclure par défaut
  minSalary: 0,
  maxSalary: 200000,
  minExperience: 0,
  availability: '',
  profileType: 'all' // 'all', 'freelance', 'jobseeker'
};

export default function FreelanceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';

  // Récupération + fusion des profils
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupération des freelancers
        const freelancersRes = await fetch(`${apiUrl}/api/freelancers`);
        const freelancersData = await freelancersRes.json();
        const formattedFreelancers = (Array.isArray(freelancersData) ? freelancersData : []).map(f => ({
          ...f,
          type: 'freelance'
        }));

        // Récupération des jobseekers
        const jobseekersRes = await fetch(`${apiUrl}/api/jobseekers`);
        const jobseekersData = await jobseekersRes.json();
        const formattedJobseekers = (Array.isArray(jobseekersData) ? jobseekersData : []).map(j => ({
          ...j,
          type: 'jobseeker'
        }));

        // Mélange aléatoire des profils
        const merged = [...formattedFreelancers, ...formattedJobseekers]
          .sort(() => Math.random() - 0.5);

        setProfiles(merged);
      } catch (err) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    const locationQuery = searchParams.get('location') || '';
    setFilters(prev => ({
      ...prev,
      specialization: searchQuery,
      location: locationQuery
    }));
  }, [searchParams]);

  const handleSearch = (query) => {
    // query est { specialty, location }
    setFilters(prev => ({
      ...prev,
      specialization: query.specialty || '',
      location: query.location || ''
    }));
    const params = [];
    if (query.specialty) params.push(`search=${encodeURIComponent(query.specialty)}`);
    if (query.location) params.push(`location=${encodeURIComponent(query.location)}`);
    setSearchParams(params.length ? params.join('&') : '');
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const filteredProfiles = profiles.filter(profile => {
    // Filtre "Type de profil"
    if (filters.profileType !== 'all' && profile.type !== filters.profileType) {
      return false;
    }

    // Sécurité sur les champs, gère camelCase et snake_case
    const specialization = (profile.specialization ?? profile.specialization ?? '').toLowerCase();
    const title = (profile.title ?? '').toLowerCase();
    const location = (profile.location ?? '').toLowerCase();
    const availability = (profile.availability ?? '').toLowerCase();
    const skills = Array.isArray(profile.skills)
        ? profile.skills.map(s => s.toLowerCase())
        : (typeof profile.skills === 'string'
            ? profile.skills.split(',').map(s => s.trim().toLowerCase())
            : []);

    // Recherche
    const searchTerms = filters.specialization
        ? filters.specialization.toLowerCase().split(' ').filter(Boolean)
        : [];
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term =>
        specialization.includes(term) ||
        title.includes(term) ||
        location.includes(term) ||
        skills.some(skill => skill.includes(term))
    );

    // Champs numériques : gère camelCase et snake_case
    const experienceYears = Number(
        profile.experienceYears ??
        profile.experience_years ??
        0
    );

    // Gestion des tarifs selon le type de profil
    const rate = profile.type === 'freelance'
      ? Number(profile.hourlyRate ?? profile.hourly_rate ?? 0)
      : Number(profile.expectedSalary ?? profile.expected_salary ?? 0);

    const minRate = profile.type === 'freelance' ? filters.minRate : filters.minSalary;
    const maxRate = profile.type === 'freelance' ? filters.maxRate : filters.maxSalary;

    return (
        matchesSearch &&
        (!filters.location || location.includes(filters.location.toLowerCase())) &&
        rate >= minRate &&
        rate <= maxRate &&
        experienceYears >= filters.minExperience &&
        (profile.type !== 'jobseeker' || !filters.availability || availability.includes(filters.availability.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
      {/* Colonne principale */}
      <div className="flex-1 flex flex-col items-center w-full md:ml-auto md:pl-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Professionnels de l'Architecture</h1>
        <p className="text-gray-600 mb-6">
          {filteredProfiles.length} profil{filteredProfiles.length > 1 ? 's' : ''} trouvé{filteredProfiles.length > 1 ? 's' : ''}
        </p>
        <div className="mb-4 w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
        

        {/* Bouton pour afficher les filtres avancés sur mobile */}
        <button
          className="flex items-center gap-2 px-4 py-2 mb-4 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 md:hidden"
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-5 w-5" />
          {showMobileFilters ? 'Masquer les filtres avancés' : 'Filtres avancés'}
        </button>

        {/* Filtres avancés : visible sous la search bar sur mobile, à gauche sur desktop */}
        {showMobileFilters && (
          <div className="block md:hidden w-full mb-6 animate-fade-in">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h2>
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors mb-4"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser les filtres
              </button>
              <div className="space-y-4">
                {/* Type de profil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de profil</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={filters.profileType}
                    onChange={(e) => setFilters({ ...filters, profileType: e.target.value })}
                  >
                    <option value="all">Tous les profils</option>
                    <option value="freelance">Freelances uniquement</option>
                    <option value="jobseeker">OpenToWork uniquement</option>
                  </select>
                </div>

                {/* Localisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="Ex: Paris"
                  />
                </div>

                {/* Expérience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expérience minimum (années)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={filters.minExperience}
                    onChange={(e) => setFilters({ ...filters, minExperience: Number(e.target.value) })}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>{i} {i <= 1 ? 'an' : 'ans'} minimum</option>
                    ))}
                  </select>
                </div>

                {/* Tarif Freelance */}
                <div className="w-full max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarif Freelance (€/h)</label>
                  <div className="relative w-full h-6">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded -translate-y-1/2" />
                    <div
                      className="absolute top-1/2 h-1 bg-blue-500 rounded -translate-y-1/2"
                      style={{
                        left: `${(filters.minRate / 1000) * 100}%`,
                        width: `${((filters.maxRate - filters.minRate) / 1000) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.minRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= filters.maxRate) {
                          setFilters({ ...filters, minRate: value });
                        }
                      }}
                      className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.maxRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= filters.minRate) {
                          setFilters({ ...filters, maxRate: value });
                        }
                      }}
                      className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between mt-2">
                    <span>{filters.minRate} €/h</span>
                    <span>{filters.maxRate >= 1000 ? '∞' : filters.maxRate + ' €/h'}</span>
                  </div>
                </div>

                {/* Filtres spécifiques aux demandeurs d'emploi */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Filtres OpenToWork</h3>

                  {/* Disponibilité */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    >
                      <option value="">Toutes</option>
                      <option value="immédiatement">Immédiatement</option>
                      <option value="1 mois">Sous 1 mois</option>
                      <option value="3 mois">Sous 3 mois</option>
                      <option value="en poste">En poste</option>
                    </select>
                  </div>

                  {/* Salaire attendu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salaire attendu (€/an)</label>
                    <div className="relative w-full h-6">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded -translate-y-1/2" />
                      <div
                        className="absolute top-1/2 h-1 bg-green-500 rounded -translate-y-1/2"
                        style={{
                          left: `${(filters.minSalary / 200000) * 100}%`,
                          width: `${((filters.maxSalary - filters.minSalary) / 200000) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        value={filters.minSalary}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= filters.maxSalary) {
                            setFilters({ ...filters, minSalary: value });
                          }
                        }}
                        className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                          [&::-webkit-slider-thumb]:pointer-events-auto
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-green-500"
                      />
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        value={filters.maxSalary}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= filters.minSalary) {
                            setFilters({ ...filters, maxSalary: value });
                          }
                        }}
                        className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                          [&::-webkit-slider-thumb]:pointer-events-auto
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-green-500"
                      />
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between mt-2">
                      <span>{filters.minSalary.toLocaleString()} €/an</span>
                      <span>{filters.maxSalary >= 200000 ? '∞' : filters.maxSalary.toLocaleString() + ' €/an'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des profils */}
        <br />
        <div className="w-full">
          {loading ? (
            <div className="text-center py-12 text-lg text-gray-500">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProfiles.map((profile) => (
                <div key={profile.id || profile.user_id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.type === 'freelance'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {profile.type === 'freelance' ? 'Freelance' : "OpenToWork"}
                    </span>
                  </div>
                  {profile.type === 'freelance'
                    ? <FreelancerCard freelancer={profile} />
                    : <JobSeekerCard jobseeker={profile} />
                  }
                </div>
              ))}
              {filteredProfiles.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-2xl text-gray-900 mb-4">Erreur de chargement</p>
                  <p className="text-gray-600">Veuillez actualiser la page.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filtres avancés à gauche sur desktop */}
      <div
        className="
          hidden
          md:block
          w-64
          fixed
          left-4
          top-24
          bg-white
          p-4
          rounded-lg
          shadow-md
          h-fit
          max-h-[calc(100vh-120px)]
          overflow-y-auto
        "
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h2>
        <button
          onClick={resetFilters}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors mb-4"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser les filtres
        </button>
        <div className="space-y-4">
          {/* Type de profil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de profil</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.profileType}
              onChange={(e) => setFilters({ ...filters, profileType: e.target.value })}
            >
              <option value="all">Tous les profils</option>
              <option value="freelance">Freelances uniquement</option>
              <option value="jobseeker">OpenToWork uniquement</option>
            </select>
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Ex: Paris"
            />
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expérience minimum (années)</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.minExperience}
              onChange={(e) => setFilters({ ...filters, minExperience: Number(e.target.value) })}
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i} {i <= 1 ? 'an' : 'ans'} minimum</option>
              ))}
            </select>
          </div>

          {/* Tarif Freelance */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarif Freelance (€/h)</label>
            <div className="relative w-full h-6">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded -translate-y-1/2" />
              <div
                className="absolute top-1/2 h-1 bg-blue-500 rounded -translate-y-1/2"
                style={{
                  left: `${(filters.minRate / 1000) * 100}%`,
                  width: `${((filters.maxRate - filters.minRate) / 1000) * 100}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.minRate}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= filters.maxRate) {
                    setFilters({ ...filters, minRate: value });
                  }
                }}
                className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxRate}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= filters.minRate) {
                    setFilters({ ...filters, maxRate: value });
                  }
                }}
                className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 flex justify-between mt-2">
              <span>{filters.minRate} €/h</span>
              <span>{filters.maxRate >= 1000 ? '∞' : filters.maxRate + ' €/h'}</span>
            </div>
          </div>

          {/* Filtres spécifiques aux demandeurs d'emploi */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Filtres OpenToWork</h3>
            
            {/* Disponibilité */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">Disponibilité</label>
              <select
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              >
                <option value="">Toutes</option>
                <option value="immédiatement">Immédiatement</option>
                <option value="1 mois">Sous 1 mois</option>
                <option value="3 mois">Sous 3 mois</option>
                <option value="en poste">En poste</option>
              </select>
            </div>

            {/* Salaire attendu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salaire attendu (€/an)</label>
              <div className="relative w-full h-6">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded -translate-y-1/2" />
                <div
                  className="absolute top-1/2 h-1 bg-green-500 rounded -translate-y-1/2"
                  style={{
                    left: `${(filters.minSalary / 200000) * 100}%`,
                    width: `${((filters.maxSalary - filters.minSalary) / 200000) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={filters.minSalary}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= filters.maxSalary) {
                      setFilters({ ...filters, minSalary: value });
                    }
                  }}
                  className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-green-500"
                />
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={filters.maxSalary}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= filters.minSalary) {
                      setFilters({ ...filters, maxSalary: value });
                    }
                  }}
                  className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
              <div className="text-sm text-gray-600 flex justify-between mt-2">
                <span>{filters.minSalary.toLocaleString()} €/an</span>
                <span>{filters.maxSalary >= 200000 ? '∞' : filters.maxSalary.toLocaleString() + ' €/an'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}