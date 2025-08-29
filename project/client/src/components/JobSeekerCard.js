import React from 'react';
import { MapPin, Clock, FileText, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function JobSeekerCard({ jobseeker }) {
  const fullName = jobseeker.username || jobseeker.name || "OpenToWork";
  const firstName = fullName.split(' ')[0];
  const avatarPath = jobseeker.avatar || '/uploads/default_jobseeker_avatar.png';
  const avatar = `${backendUrl}${avatarPath}`;
  const coverImagePath = '/uploads/default_freelance_avatar.png';
  const coverImage = `${backendUrl}${coverImagePath}`;
  const title = jobseeker.title || '';
  const location = jobseeker.location || '';
  const availability = jobseeker.availability || 'Disponible';

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

  // Données
  const expectedSalary = jobseeker.expectedSalary ?? jobseeker.expected_salary ?? '';
  const experienceYears = jobseeker.experienceYears ?? jobseeker.experience_years ?? '';

  const displayExpectedSalary =
    expectedSalary !== null && expectedSalary !== undefined && expectedSalary !== ''
      ? `${expectedSalary}€/an`
      : '—';

  const displayExperienceYears =
    experienceYears !== null && experienceYears !== undefined && experienceYears !== ''
      ? `${experienceYears} ${Number(experienceYears) <= 1 ? 'an' : 'ans'} d'expérience`
      : '—';

  return (
    <Link to={`/jobseeker/${jobseeker.id || jobseeker.user_id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Image + Avatar */}
        <div className="relative">
          <img
            src={avatar}
            alt={firstName}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <img
            src={coverImage}
            alt={firstName}
            className="absolute -bottom-6 left-6 w-16 h-16 rounded-full border-4 border-white bg-white object-cover"
          />
        </div>

        {/* Contenu */}
        <div className="p-6 pt-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{firstName}</h3>
              <p className="text-gray-600">{title}</p>
            </div>
            {jobseeker.cv && (
              <div className="flex items-center text-indigo-600">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">CV</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="ml-2">{location}</span>
          </div>
          <div className="mt-2 flex items-center text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="ml-2">{displayExperienceYears}</span>
          </div>

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                +{skills.length - 3}
              </span>
            )}
          </div>

          {/* Salaire + Dispo */}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-indigo-600 font-semibold">
              {displayExpectedSalary}
            </span>
            <span className="text-green-600 text-sm font-medium">
              {availability}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
