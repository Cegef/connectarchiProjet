import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat'; // ou ChatModal si tu utilises ce nom

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user, token } = useAuth();
  const [chatMessages, setChatMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  // Charger les messages de la conversation
  useEffect(() => {
    if (!conversationId || !user || !token) return;
    setLoading(true);
    fetch(`${apiUrl}/api/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setChatMessages)
      .catch(() => setChatMessages([]))
      .finally(() => setLoading(false));
  }, [conversationId, user, token, apiUrl]);

  // Envoyer un message
  const handleSendMessage = async (content) => {
    if (!content) return;
    const res = await fetch(`${apiUrl}/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        senderId: user.id,
        content,
        }),
    });
    if (!res.ok) {
        // Affiche une erreur si besoin
        alert("Erreur lors de l'envoi du message");
        return;
    }
    // Recharge les messages après envoi
    fetch(`${apiUrl}/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.json())
        .then(setChatMessages);
  };

  if (!user || !token) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
        onClick={() => navigate(-1)}
      >
        Retour
      </button>
      {chatOpen && (
        <Chat
            conversationId={conversationId}
            userId={user.id}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClose={() => setChatOpen(false)}
            user={user}
            loading={loading}
        />
      )}
      {!chatOpen && (
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => setChatOpen(true)}
        >
          Ouvrir le chat
        </button>
      )}
    </div>
  );
}