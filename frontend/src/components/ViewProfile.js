// src/components/ViewProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import QuoteCard from './QuoteCard';
import './ViewProfile.css';

const ViewProfile = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({ user: null, quotes: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/api/profile/public/${userId}`);
        setProfileData(res.data);
      } catch (err) {
        setError(err.response?.data.message || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, [userId]);

  if (error) return <div className="view-profile-container"><p>{error}</p></div>;
  if (!profileData.user) return <div className="view-profile-container"><p>Loading...</p></div>;

  return (
    <div className="view-profile-container">
      <div className="profile-header">
        {profileData.user.profilePhoto ? (
          <img src={profileData.user.profilePhoto} alt="Profile" className="profile-photo" />
        ) : (
          <div className="profile-placeholder">
            {profileData.user.username[0].toUpperCase()}
          </div>
        )}
        <div className="profile-info">
          <h2>{profileData.user.username}</h2>
          <p className="headline">{profileData.user.headlineQuote || 'No headline provided.'}</p>
        </div>
      </div>
      <div className="profile-quotes">
        <h3>Quotes</h3>
        {profileData.quotes.length === 0 ? (
          <p>This user hasn’t posted any quotes yet.</p>
        ) : (
          profileData.quotes.map((quote) => (
            <QuoteCard key={quote._id} quote={quote} />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
