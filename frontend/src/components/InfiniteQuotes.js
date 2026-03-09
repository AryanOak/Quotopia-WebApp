import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import './InfiniteQuotes.css';
import clickMp3 from '../assets/click.mp3'; 

const InfiniteQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const audioRef = useRef(new Audio(clickMp3));

  useEffect(() => {
    API.get('/api/quotes')
      .then(res => setQuotes(res.data))
      .catch(console.error);
  }, []);

  const nextQuote = () => {
    if (!quotes.length) return;
    audioRef.current.play();
    setFade(false);
    setTimeout(() => {
  // pick a random index different from current
  let newIdx;
  if (quotes.length === 1) {
    newIdx = 0;
  } else {
    do {
      newIdx = Math.floor(Math.random() * quotes.length);
    } while (newIdx === idx);
  }
  setIdx(newIdx);
  setFade(true);
}, 300);

  };

  if (!quotes.length) return <div className="infinite-loading">Loading...</div>;

  const q = quotes[idx];

  return (
    <div className="infinite-container">
      <div className={`infinite-card ${fade ? 'fade-in' : 'fade-out'}`}>
        <img
          src={q.user.profilePhoto || '/default-avatar.png'}
          alt="Profile"
          className="infinite-avatar"
        />
        <h3 className="infinite-username">{q.user.username}</h3>
        <p className="infinite-text">"{q.text}"</p>
      </div>
      <button className="infinite-next" onClick={nextQuote}>
        Next <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default InfiniteQuotes;
