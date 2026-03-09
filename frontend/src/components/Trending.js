import React, { useState, useEffect } from 'react';
import API from '../api';
import QuoteCard from './QuoteCard';
import './Trending.css';

const Trending = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    API
      .get('/api/quotes/trending')
      .then(res => {
        // Ensure highest-like first
        const sorted = res.data.sort(
          (a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
        );
        setQuotes(sorted);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="trending-container">
      <h2 className='trendQuote'>Trending Quotes</h2>
      <div className="trending-grid">
        {quotes.map(q => (
          <QuoteCard key={q._id} quote={q} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
