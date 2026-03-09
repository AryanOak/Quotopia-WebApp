import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import './QuoteCard.css';

const QuoteCard = ({ quote, deletable, onDelete }) => {
  const token = localStorage.getItem('token');
  const [likes, setLikes] = useState(quote.likedBy ? quote.likedBy.length : 0);
  const [dislikes, setDislikes] = useState(quote.dislikedBy ? quote.dislikedBy.length : 0);

  const handleLike = async () => {
    if (!token) {
      alert('Please log in to like posts.');
      return;
    }
    try {
      const res = await API.post(
        `/api/quotes/${quote._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert('Please log in to dislike posts.');
      return;
    }
    try {
      const res = await API.post(
        `/api/quotes/${quote._id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      alert('Please log in to delete your quote.');
      return;
    }
    try {
      await API.delete(`/api/quotes/${quote._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Call the parent's delete handler to update the UI
      onDelete && onDelete(quote._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="quote-card">
      <Link to={`/view-profile/${quote.user._id}`} className="quote-user-link">
        <div className="quote-user">
          {quote.user && quote.user.profilePhoto ? (
            <img src={quote.user.profilePhoto} alt="Profile" className="quote-user-photo" />
          ) : (
            <div className="quote-user-placeholder">
              {quote.user && quote.user.username[0].toUpperCase()}
            </div>
          )}
          <span className="quote-user-name">{quote.user && quote.user.username}</span>
        </div>
      </Link>
      <p className="quote-text">{quote.text}</p>
      <p className="quote-category">{quote.category}</p>
      <div className="quote-actions">
        <button onClick={handleLike}>
          <i className="fa-solid fa-thumbs-up"></i> ({likes})
        </button>
        <button onClick={handleDislike}>
          <i className="fa-solid fa-thumbs-down"></i> ({dislikes})
        </button>
        {deletable && (
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        )}
      </div>
    </div>  
  );
};

export default QuoteCard; 
