import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ conversationId, userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const apiUrl = process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_API_URL  // URL sur Render
      : 'http://localhost:5000';  // URL en développement local
  

  // Récupère les messages de la conversation
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/messages/${conversationId}`);
        const data = await res.json();
        setMessages(data);
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
      }
    } catch (err) {
      // Optionnel: gestion d'erreur
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Chat</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          X
        </button>
      </div>
      <div className="overflow-y-auto h-64 mb-4">
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="mb-2">
              <div className="text-sm text-gray-600">{message.senderId}</div>
              <div className="text-gray-900">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Tapez votre message..."
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}