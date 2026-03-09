// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import QuoteCard from './QuoteCard';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    headlineQuote: '',
    profilePhoto: '',
  });
  const [myQuotes, setMyQuotes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          username: res.data.username,
          headlineQuote: res.data.headlineQuote || '',
          profilePhoto: res.data.profilePhoto || '',
        });
        setPreview(res.data.profilePhoto || null);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMyQuotes = async () => {
      try {
        const res = await API.get('/api/quotes/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyQuotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchMyQuotes();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePhoto: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await API.put('/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    }
  };

  // Remove a deleted quote from local state
  const handleDeleteQuote = (deletedQuoteId) => {
    setMyQuotes(myQuotes.filter((q) => q._id !== deletedQuoteId));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo-container">
          {preview ? (
            <img src={preview} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-placeholder">
              {profile.username ? profile.username[0].toUpperCase() : 'U'}
            </div>
          )}
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          )}
        </div>
        <div className="profile-info">
          {editMode ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="edit-input"
            />
          ) : (
            <h2>{profile.username}</h2>
          )}
          {editMode ? (
            <textarea
              name="headlineQuote"
              value={profile.headlineQuote}
              onChange={handleChange}
              className="edit-textarea"
              rows="3"
            />
          ) : (
            <p className="headline">
              {profile.headlineQuote || 'No headline provided.'}
            </p>
          )}
          {editMode ? (
            <button onClick={handleSave} className="save-button">
              Save
            </button>
          ) : (
            <button onClick={() => setEditMode(true)} className="edit-button">
              Edit Profile
            </button>
          )}
          {message && <p className="profile-message">{message}</p>}
        </div>
      </div>

      <div className="profile-quotes">
        <h3>Your Quotes</h3>
        {myQuotes.length === 0 ? (
          <p>You haven't posted any quotes yet.</p>
        ) : (
          myQuotes.map((quote) => (
            <QuoteCard
              key={quote._id}
              quote={quote}
              deletable={true}
              onDelete={handleDeleteQuote}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
