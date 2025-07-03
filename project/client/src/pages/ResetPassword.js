import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // adapte le chemin si besoin

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || !confirm) {
      setError('Veuillez remplir les deux champs.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
        : 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la réinitialisation.");
      }
    } catch (err) {
      setError("Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>
          {success ? (
            <div className="text-green-600">
              Mot de passe modifié ! Redirection vers la connexion...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Confirmez le mot de passe"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Réinitialiser
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}