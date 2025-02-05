import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Test1 from './pages/Test1';
import Test2 from './pages/Test2';
import Main from './pages/Main';
import Editor from './components/editor/Editor.js';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/test1">Test1</Link>
        </li>
        <li>
          <Link to="/test2">Test2</Link>
        </li>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/editor';

  return (
    <div>
      {!hideNav && <Navigation />}
      <Routes>
        <Route path="/test1" element={<Test1 />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/" element={<Main />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
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
