/**
 * AppRouter - Main Application Router
 *
 * Narrative Flow:
 * 1. Policy Simulator (/) - Interactive tax/speed slider
 * 2. Forensic Analysis (/analysis) - Evidence-based scrollytelling
 *
 * Flow: User adjusts policy → See real-time impact → View forensic proof
 */

import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import App from './App';
import ForensicAnalysis from './components/ForensicDashboard/ForensicAnalysis';
import ForensicGame from './components/ForensicGame/ForensicGame';
import './AppRouter.css';

// Create context for shared state between pages
export const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

// Narrative Progress Bar Component
const NarrativeProgress = () => {
  const location = useLocation();
  const isAnalysis = location.pathname === '/analysis';

  return (
    <div className="narrative-progress">
      <div className="progress-steps">
        <div className={`progress-step ${!isAnalysis ? 'active' : 'completed'}`}>
          <Link to="/" className="step-link">
            <div className="step-number">1</div>
            <div className="step-label">Explore Policy</div>
          </Link>
        </div>
        <div className="progress-connector">
          <div className={`connector-line ${isAnalysis ? 'completed' : ''}`} />
          <div className="connector-arrow">→</div>
        </div>
        <div className={`progress-step ${isAnalysis ? 'active' : ''}`}>
          <Link to="/analysis" className="step-link">
            <div className="step-number">2</div>
            <div className="step-label">View Evidence</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const { taxAmount, speed } = useAppState();

  return (
    <motion.nav
      className="app-navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🚛</span>
          <span className="brand-text">CROSS BRONX</span>
          <span className="brand-subtitle">Forensic Proof</span>
        </Link>
      </div>

      <NarrativeProgress />

      <div className="nav-info">
        <div className="live-stats">
          {taxAmount !== null && (
            <>
              <div className="stat-item">
                <span className="stat-label">TAX:</span>
                <span className="stat-value">${taxAmount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">SPEED:</span>
                <span className="stat-value">{speed || 5} MPH</span>
              </div>
            </>
          )}
        </div>
        <Link to="/forensic-game" className="game-mode-link">
          <button className="game-mode-btn">
            🎮 GAME MODE
          </button>
        </Link>
        <span className="location-badge">South Bronx</span>
      </div>
    </motion.nav>
  );
};

// Animated Route Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              className="page-container policy-page"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <App />
            </motion.div>
          }
        />
        <Route
          path="/analysis"
          element={
            <motion.div
              className="page-container forensic-analysis-page"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ForensicAnalysis />
            </motion.div>
          }
        />
        {/* Forensic Game Mode */}
        <Route
          path="/forensic-game"
          element={
            <motion.div
              className="page-container forensic-game-page"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ForensicGame />
            </motion.div>
          }
        />
        {/* Redirect old routes */}
        <Route path="/forensic" element={<Navigate to="/analysis" replace />} />
        <Route path="/forensic-analysis" element={<Navigate to="/analysis" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main Router Component
const AppRouter = () => {
  // Shared state between Policy Simulator and Forensic Analysis
  const [taxAmount, setTaxAmount] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [simulationData, setSimulationData] = useState(null);

  const appState = {
    taxAmount,
    setTaxAmount,
    speed,
    setSpeed,
    simulationData,
    setSimulationData
  };

  return (
    <AppStateContext.Provider value={appState}>
      <Router>
        <div className="app-wrapper">
          <Navigation />
          <main className="app-main">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AppStateContext.Provider>
  );
};

export default AppRouter;
