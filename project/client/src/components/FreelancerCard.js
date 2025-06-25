import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreelancerCard({ freelancer }) {
  const name = freelancer.username || freelancer.name || 'Freelance';
  const avatar = freelancer.avatar || '/uploads/default_freelance_avatar.png';
  const title = freelancer.title || '';
  const location = freelancer.location || '';
  const availability = freelancer.availability || 'Disponible';

  // Skills : array ou string
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

  // Portfolio : array d'objets ou de strings
  let portfolioImage = '/uploads/default-portfolio.jpg';
  if (Array.isArray(freelancer.portfolio) && freelancer.portfolio.length > 0) {
    if (typeof freelancer.portfolio[0] === 'object' && freelancer.portfolio[0] !== null && freelancer.portfolio[0].image) {
      portfolioImage = freelancer.portfolio[0].image;
    } else if (typeof freelancer.portfolio[0] === 'string') {
      portfolioImage = freelancer.portfolio[0];
    }
  } else if (typeof freelancer.portfolio === 'string' && freelancer.portfolio) {
    try {
      const parsed = JSON.parse(freelancer.portfolio);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === 'object' && parsed[0].image) {
          portfolioImage = parsed[0].image;
        } else if (typeof parsed[0] === 'string') {
          portfolioImage = parsed[0];
        }
      }
    } catch {
      portfolioImage = freelancer.portfolio;
    }
  }

  // Gère snake_case et camelCase pour les champs numériques
  const hourlyRate = freelancer.hourlyRate ?? freelancer.hourly_rate ?? '';
  const experienceYears = freelancer.experienceYears ?? freelancer.experience_years ?? '';

  const displayHourlyRate =
    hourlyRate !== null &&
    hourlyRate !== undefined &&
    hourlyRate !== ''
      ? `${hourlyRate}€/heure`
      : '—';

  const displayExperienceYears =
    experienceYears !== null &&
    experienceYears !== undefined &&
    experienceYears !== ''
      ? `${experienceYears} ${Number(experienceYears) <= 1 ? 'an' : 'ans'} d'expérience`
      : '—';

  return (
    <Link to={`/freelancer/${freelancer.id || freelancer.user_id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={portfolioImage}
            alt={name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <img
            src={avatar}
            alt={name}
            className="absolute -bottom-6 left-6 w-16 h-16 rounded-full border-4 border-white bg-white object-cover"
          />
        </div>
        <div className="p-6 pt-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
              <p className="text-gray-600">{title}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="ml-2">{location}</span>
          </div>
          <div className="mt-2 flex items-center text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="ml-2">{displayExperienceYears}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-indigo-600 font-semibold">
              {displayHourlyRate}
            </span>
            <span
              className={`text-sm font-medium ${
                availability === 'Indisponible' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {availability}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}