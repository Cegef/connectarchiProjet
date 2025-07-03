import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import FreelancerCard from '../components/FreelancerCard';
import SearchBar from '../components/SearchBar';

const defaultFilters = {
  specialization: '',
  location: '',
  minRate: 0,
  maxRate: 1000, // très élevé pour ne rien exclure par défaut
  minExperience: 0
};

export default function FreelanceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const apiUrl = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL  // URL sur Render
    : 'http://localhost:5000';  // URL en développement local

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/freelancers`);
        const data = await res.json();
        setFreelancers(Array.isArray(data) ? data : []);
      } catch (err) {
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
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

  const filteredFreelancers = freelancers.filter(freelancer => {
    // Sécurité sur les champs, gère camelCase et snake_case
    const specialization = (freelancer.specialization ?? freelancer.specialization ?? '').toLowerCase();
    const title = (freelancer.title ?? '').toLowerCase();
    const location = (freelancer.location ?? '').toLowerCase();
    const skills = Array.isArray(freelancer.skills)
        ? freelancer.skills.map(s => s.toLowerCase())
        : (typeof freelancer.skills === 'string'
            ? freelancer.skills.split(',').map(s => s.trim().toLowerCase())
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

    // Champs numériques : gère camelCase et snake_case
    const hourlyRate = Number(
        freelancer.hourlyRate ??
        freelancer.hourly_rate ??
        0
    );
    const experienceYears = Number(
        freelancer.experienceYears ??
        freelancer.experience_years ??
        0
    );

    return (
        matchesSearch &&
        (!filters.location || location.includes(filters.location.toLowerCase())) &&
        hourlyRate >= filters.minRate &&
        hourlyRate <= filters.maxRate &&
        experienceYears >= filters.minExperience
    );
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
      {/* Colonne principale */}
      <div className="flex-1 flex flex-col items-center w-full md:ml-auto md:pl-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Je recherche mon Freelance</h1>
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
                {/* Tarif */}
                <div className="w-full max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarif (€/h)</label>
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
              </div>
            </div>
          </div>
        )}

        {/* Liste des freelances */}
        <br />
        <div className="w-full">
          {loading ? (
            <div className="text-center py-12 text-lg text-gray-500">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id || freelancer.user_id} freelancer={freelancer} />
              ))}
              {filteredFreelancers.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-2xl text-gray-900 mb-4">Aucun résultat</p>
                  <p className="text-gray-600">Aucun freelance ne correspond à vos critères de recherche.</p>
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
          {/* Tarif */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarif (€/h)</label>
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
        </div>
      </div>
    </div>
  );
}