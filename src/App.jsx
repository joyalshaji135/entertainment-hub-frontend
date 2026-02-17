// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Footer from "./components/Footer/Footer";
import SeriesPage from "./pages/Series/SeriesPage";
import MusicPage from "./pages/Music/MusicPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import SeriesDetail from "./pages/SeriesDetail/SeriesDetail";
import MusicDetail from "./pages/MusicDetail/MusicDetail";
import AnimePage from "./pages/Anime/AnimePage";
import AnimeDetail from "./pages/AnimeDetail/AnimeDetail";
import WishListPage from "./pages/Wishlist/WishlistPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

function AppContent() {
  return (
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
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/series/:id"
          element={
            <ProtectedRoute>
              <SeriesDetail />
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

        <Route path="/music/:id" element={<MusicDetail />} />

        <Route path="/anime" element={<AnimePage />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />

        <Route path="/wishlist" element={<ProtectedRoute>
          <WishListPage />
        </ProtectedRoute>} />
        <Route
          path="/profile"
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
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
