// src/components/WriteQuote.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './WriteQuote.css';

const WriteQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    category: 'motivational',
  });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.text.length > 200) {
      setError('Quote must be 200 characters or less');
      return;
    }
    try {
      await API.post('/api/quotes', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/'); // Redirect to Home page after successful post
    } catch (err) {
      setError(err.response.data.message || 'Failed to post quote');
    }
  };

  return (
    <div className="write-quote-container">
      <form className="write-quote-form" onSubmit={handleSubmit}>
        <h2>Write a Quote</h2>
        {error && <p className="error">{error}</p>}
        <textarea
          name="text"
          placeholder="Type your quote here (max 200 characters)..."
          value={formData.text}
          onChange={handleChange}
          maxLength="200"
          required
        />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="motivational">Motivational</option>
          <option value="philosophical">Philosophical</option>
          <option value="spiritual">Spiritual</option>
          <option value="funny">Funny</option>
        </select>
        <button type="submit">Upload Quote</button>
      </form>
    </div>
  );
};

export default WriteQuote;
