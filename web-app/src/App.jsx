import React, { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7071/api/messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages: " + err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setTitle('');
      setDescription('');
      setError(null);
    } catch (err) {
      setError("Failed to send message: " + err.message);
      console.error("Error sending message:", err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <h1>Message Board</h1>

      <div className="message-form">
        <h2>Post a new message</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="message-list">
        <h2>Messages</h2>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div className="message-card" key={message.id}>
              <h3 className="message-title">{message.title}</h3>
              <p className="message-description">{message.description}</p>
              <p className="message-timestamp">
                Posted on {formatDate(message.timestamp)}
              </p>
            </div>
          ))
        ) : (
          <p>No messages yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
}

export default App;
