import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Projects from './pages/Projects.js';
import Explore from './pages/Explore.js';
import Main from './pages/Main';
import Editor from './components/editor/Editor.js';

function Navigation() {
  return (
    <nav className="navigation">
      {/* Logo at the top left that links to the main page */}
      <div className="logo-container">
        <Link className="logo" to="/">LOGO</Link>
      </div>

      <div className="nav-links">
        <Link className="nav-item" to="/projects">Projects</Link>
        <Link className="nav-item" to="/explore">Explore</Link>
        <Link className="nav-item" to="/">Main</Link>
        <Link className="nav-item" to="/editor">Editor</Link>
      </div>
      <button className="post-project">Post Your Project!</button>
    </nav>
  );
}

// New Header component with a profile dropdown
function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="profile" ref={dropdownRef}>
        <img
          src="https://via.placeholder.com/40"  // Replace with your profile image URL
          alt="Profile"
          className="profile-img"
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div className="dropdown">
            <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
              Your Profile
            </Link>
            <Link to="/settings" className="dropdown-item" onClick={() => setOpen(false)}>
              Settings
            </Link>
            <Link to="/logout" className="dropdown-item" onClick={() => setOpen(false)}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  // Hide navigation when on the Editor page
  const hideNav = location.pathname === '/editor';

  return (
    <div className="app-layout">
      {!hideNav && (
        <aside className="sidebar">
          <Navigation />
        </aside>
      )}
      <main className="main-content">
        {/* The Header appears at the top of the main content */}
        <Header />
        <Routes>
          <Route path="/projects" element={<Projects />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/" element={<Main />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
