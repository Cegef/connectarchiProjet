import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UserSquare2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChooseType() {
  const navigate = useNavigate();
  const { setUserType } = useAuth();

  const handleTypeSelection = (type) => {
    setUserType(type);
    if (type === 'freelancer') {
      navigate('/freelance-setup');
    } else if (type === 'company') {
      navigate('/company-setup');
    } else if (type === 'jobseeker') {
      navigate('/jobseeker-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Choisissez votre profil
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Freelance */}
          <button
            onClick={() => handleTypeSelection('freelancer')}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left group"
          >
            <div className="flex items-center mb-4">
              <UserSquare2 className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
              <h2 className="text-xl font-semibold ml-3">Freelance</h2>
            </div>
            <p className="text-gray-600">
              Créez votre profil professionnel, trouvez des projets et connectez-vous avec des entreprises à la recherche de vos compétences.
            </p>
            <div className="mt-6 text-indigo-600 group-hover:text-indigo-700 font-medium">
              Continuer comme freelance →
            </div>
          </button>

          {/* Entreprise */}
          <button
            onClick={() => handleTypeSelection('company')}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left group"
          >
            <div className="flex items-center mb-4">
              <Building2 className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
              <h2 className="text-xl font-semibold ml-3">Entreprise</h2>
            </div>
            <p className="text-gray-600">
              Publiez des appels d'offres, trouvez les meilleurs talents et gérez vos projets avec des professionnels qualifiés.
            </p>
            <div className="mt-6 text-indigo-600 group-hover:text-indigo-700 font-medium">
              Continuer comme entreprise →
            </div>
          </button>

          {/* Demandeur d'emploi */}
          <button
            onClick={() => handleTypeSelection('jobseeker')}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left group"
          >
            <div className="flex items-center mb-4">
              <Briefcase className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
              <h2 className="text-xl font-semibold ml-3">OpenToWork</h2>
            </div>
            <p className="text-gray-600">
              Créez votre profil, explorez les opportunités d’emploi et connectez-vous avec des entreprises qui recrutent.
            </p>
            <div className="mt-6 text-indigo-600 group-hover:text-indigo-700 font-medium">
              Continuer comme OpenToWork →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
