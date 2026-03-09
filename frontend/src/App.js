import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import WriteQuote from './components/WriteQuote';
import ViewProfile from './components/ViewProfile';
import InfiniteQuotes from './components/InfiniteQuotes';
import Trending from './components/Trending';

function App() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('none');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  const handleLogin = data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setUser({ token: data.token, username: data.username });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <Router>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onFilterChange={setFilter}
      />
      <Routes>
        <Route path="/" element={<Home filter={filter} />} />
        <Route path="/write-quote" element={<WriteQuote />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view-profile/:userId" element={<ViewProfile />} />
        <Route path="/infinite" element={<InfiniteQuotes />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
    </Router>
  );
}

export default App;
