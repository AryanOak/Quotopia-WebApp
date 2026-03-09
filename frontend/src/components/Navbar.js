import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, onFilterChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFilterChange = e => {
    onFilterChange(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        {/* Hamburger only on mobile */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <Link to="/" className="navbar__title" >
          <i className="fa-solid fa-quote-left" /> Quotopia{' '}
          <i className="fa-solid fa-quote-right" />
        </Link>

        {/* Always visible filter */}
        <select
          className="navbar__filter"
          onChange={handleFilterChange}
          defaultValue="none"
        >
          <option value="none">All</option>
          <option value="motivational">Motivational</option>
          <option value="philosophical">Philosophical</option>
          <option value="spiritual">Spiritual</option>
          <option value="funny">Funny</option>
        </select>
      </div>

      
      <Link to="/write-quote" className="navbar__button">
        <i className="fa-solid fa-pen-to-square" /> Write Quote
      </Link>

      <div className="navbar__right">
        {user ? (
          <>

            <Link to="/profile" className="navbar__profile">
              {user.username[0].toUpperCase()}
            </Link>
            <button className="navbar__logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/trending" className="navbar__link">Trending</Link>

            <Link to="/login" className="navbar__link">
              Login
            </Link>
            <Link to="/signup" className="navbar__link">
              Signup
            </Link>
          </>
        )}
        {/* Infinite Quotes */}
        <Link to="/infinite" className="navbar__link">
          <i className="fa-solid fa-infinity"></i>
        </Link>
      </div>

      {/* Mobile-only slide-down menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className="navbar__mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        {user ? (
          <>
            <Link
              to="/profile"
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              className="navbar__mobile-link navbar__mobile-logout"
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Signup
            </Link>
          </>
        )}
        <Link
          to="/infinite"
          className="navbar__mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          Infinite
        </Link>
        <Link
          to="/trending"
          className="navbar__mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          Trending
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
