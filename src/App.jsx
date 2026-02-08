import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Footer from './components/Footer/Footer';
import SeriesPage from './pages/Series/SeriesPage';
import MusicPage from './pages/Music/MusicPage';
import ProfilePage from './pages/Profile/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/series" 
            element={
              <ProtectedRoute>
                <SeriesPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/music" 
            element={
              <ProtectedRoute>
                <MusicPage />
              </ProtectedRoute>
            } 
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* Redirect any unknown route to home or login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;