import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DataStoreProvider } from './hooks/DataStoreContext';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import TechniciansPage from './pages/TechniciansPage';
import EventDetailsPage from './pages/EventDetailsPage';
import './App.css';

/**
 * Main App Component
 * Sets up routing, navigation, and global state
 */
function App() {
  return (
    <DataStoreProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">
                🎯 AV Labor Coordinator
              </Link>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/events" className="nav-link">
                    Events
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/technicians" className="nav-link">
                    Technicians
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/technicians" element={<TechniciansPage />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>© 2025 AV Labor Coordinator | Built with React & Node.js</p>
          </footer>
        </div>
      </BrowserRouter>
    </DataStoreProvider>
  );
}

export default App;
