import React, { useState } from 'react';
import { Menu, X, Building2, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false); // État pour la pop-up AuthModal
  const { user, logout } = useAuth();

  const handleOpenAuthModal = () => {
    setAuthModalOpen(true); // Ouvre la pop-up
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false); // Ferme la pop-up
  };

  const handleRedirectToRegister = () => {
    navigate('/inscription'); // Redirige directement vers la page Inscription.js
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex sm:space-x-8">
              <Link to="/" className="flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">ArchiConnect</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <Link to="/freelancers" className="text-gray-700 hover:text-indigo-600">
                Freelances
              </Link>
              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600">
                Appels d'offres
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center text-gray-700 hover:text-indigo-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleOpenAuthModal} // Ouvre la pop-up
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={handleRedirectToRegister}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/freelancers"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                Freelances
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                Appels d'offres
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenAuthModal} // Ouvre la pop-up
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={handleRedirectToRegister}
                    className="w-full text-left px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Inscription
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
}