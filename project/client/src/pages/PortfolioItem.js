import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://back-connectarchi.onrender.com';

export default function PortfolioItem() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/api/portfolio/item/${id}`)
      .then(res => res.json())
      .then(data => {
        // Si c'est juste un lien sans image/titre/description, redirige directement
        if (data.url && !data.image && !data.title && !data.description) {
          window.location.href = data.url;
        } else {
          setProject(data);
        }
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id, apiUrl]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-gray-600">Chargement…</div>;
  }

  if (!project) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-gray-600">Projet non trouvé</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to={`/freelancer/${project.freelance_id}`}
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour au profil
      </Link>
      {project.image && (
        <img
          src={`${backendUrl}${project.image}`}
          alt={project.title || 'Projet'}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{project.title || 'Projet du portfolio'}</h1>
      {project.description && (
        <p className="text-gray-700 mb-4 whitespace-pre-line">{project.description}</p>
      )}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Voir le projet en ligne
        </a>
      )}
    </div>
  );
}