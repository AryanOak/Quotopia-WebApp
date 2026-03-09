// src/components/Home.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import API from '../api';
import QuoteCard from './QuoteCard';
import './Home.css';

const AMBIENT_CHORDS = {
  motivational: [130.81, 164.81, 196.00, 261.63],
  philosophical: [110.00, 130.81, 164.81, 220.00],
  spiritual: [146.83, 185.00, 220.00, 293.66],
  funny: [164.81, 196.00, 246.94, 329.63],
};

const Home = ({ filter }) => {
  const [quotes, setQuotes] = useState([]);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await API.get(`/api/quotes?category=${filter}`);
        const shuffled = res.data.sort(() => Math.random() - 0.5);
        setQuotes(shuffled);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuotes();
  }, [filter]);

  const stopAmbient = useCallback(() => {
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { /* ignore */ }
      audioCtxRef.current = null;
    }
  }, []);

  const startAmbient = useCallback((theme) => {
    stopAmbient();
    const freqs = AMBIENT_CHORDS[theme];
    if (!freqs) return;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = (i - 1.5) * 5;

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.5;
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });
    } catch (e) {
      // AudioContext blocked by browser — silent fail
    }
  }, [stopAmbient]);

  useEffect(() => {
    if (filter !== 'none' && !muted) {
      startAmbient(filter);
    } else {
      stopAmbient();
    }
    return stopAmbient;
  }, [filter, muted, startAmbient, stopAmbient]);

  const toggleMute = () => setMuted(prev => !prev);

  const theme = filter === 'none' ? 'default' : filter;

  return (
    <div className={`home-container theme-${theme}`}>
      {theme !== 'default' && (
        <div className="theme-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ animationDelay: `${i * 1.2}s` }} />
          ))}
        </div>
      )}

      <div className="home-header">
        <h2 className="all-quotes">
          {filter === 'none'
            ? 'All Quotes'
            : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Quotes`}
        </h2>
        {theme !== 'default' && (
          <button className="mute-btn" onClick={toggleMute} title={muted ? 'Unmute ambient' : 'Mute ambient'}>
            <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
          </button>
        )}
      </div>

      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <div
            key={quote._id}
            className="quote-card-wrapper"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <QuoteCard quote={quote} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
