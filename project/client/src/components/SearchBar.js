import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch, className = '' }) {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ specialty, location });
    } else {
      const params = [];
      if (specialty) params.push(`search=${encodeURIComponent(specialty)}`);
      if (location) params.push(`location=${encodeURIComponent(location)}`);
      navigate(`/freelancers?${params.join('&')}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-[2]">
          <input
            type="text"
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 shadow-sm"
            placeholder="Recherchez le métier, la specialité..."
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 shadow-sm"
            placeholder="Localisation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="h-full px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
}