import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ conversationId, userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({}); // Cache des utilisateurs
  const messagesEndRef = useRef(null);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://back-connectarchi.onrender.com'
    : 'http://localhost:5000';

  // Fonction pour récupérer les infos d'un utilisateur
  const fetchUser = async (userId) => {
    if (users[userId]) return users[userId]; // Déjà en cache
    
    try {
      const res = await fetch(`${apiUrl}/api/users/${userId}`);
      if (res.ok) {
        const user = await res.json();
        setUsers(prev => ({ ...prev, [userId]: user }));
        return user;
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    }
    return { username: `Utilisateur ${userId}` }; // Fallback
  };

  // Récupère les messages de la conversation
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/messages/${conversationId}`);
        const data = await res.json();
        setMessages(data);
        
        // Récupérer les infos de tous les utilisateurs mentionnés
        const userIds = [...new Set(data.map(msg => msg.senderId))];
        for (const uid of userIds) {
          await fetchUser(uid);
        }
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, apiUrl]);

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          content: newMessage,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setMessages((prev) => [...prev, saved]);
        setNewMessage('');
        
        // S'assurer que l'utilisateur actuel est dans le cache
        if (!users[userId]) {
          await fetchUser(userId);
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  };

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = (senderId) => {
    const user = users[senderId];
    return user ? user.username : `Utilisateur ${senderId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Chat</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          ✕
        </button>
      </div>
      <div className="overflow-y-auto h-64 mb-4 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="mb-3">
              <div className="text-sm font-medium text-indigo-600">
                {getDisplayName(message.senderId)}
              </div>
              <div className="text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tapez votre message..."
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}