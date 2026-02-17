/**
 * EXAMPLE AppRouter.js with Forensic Game Mode Integration
 *
 * This shows how to add the ForensicGame component to your existing router.
 * Copy the relevant parts to your actual AppRouter.js file.
 */

import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import ForensicGame from './components/ForensicGame/ForensicGame';

// Import your existing components
// import Dashboard from './components/ForensicDashboard/Dashboard';
// import ForensicAnalysis from './components/ForensicDashboard/ForensicAnalysis';

// Global state context (if you're using one)
const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

const AppRouter = () => {
  // Global state for sharing data between routes
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
        {/* Navigation Bar (Optional) */}
        <NavigationBar />

        {/* Route Definitions */}
        <Routes>
          {/* Main Policy Simulator */}
          <Route path="/" element={<App />} />

          {/* Forensic Dashboard (if you have it) */}
          {/* <Route path="/forensic" element={<Dashboard />} /> */}

          {/* NEW: Forensic Game Mode */}
          <Route path="/forensic-game" element={<ForensicGame />} />

          {/* Add other routes here */}
        </Routes>
      </Router>
    </AppStateContext.Provider>
  );
};

/**
 * Optional Navigation Bar
 * Shows links to all modes
 */
const NavigationBar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.95)',
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
      borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{
        color: '#00ffff',
        fontSize: '14px',
        letterSpacing: '2px',
        fontWeight: '700'
      }}>
        SOUTH BRONX FORENSIC ANALYSIS
      </div>

      <div style={{ flex: 1 }} />

      <NavLink to="/" label="POLICY SIM" />
      <NavLink to="/forensic-game" label="🎮 GAME MODE" highlight />

      {/* Add more navigation links as needed */}
    </nav>
  );
};

/**
 * Styled Navigation Link
 */
const NavLink = ({ to, label, highlight = false }) => {
  return (
    <Link
      to={to}
      style={{
        color: highlight ? '#00ff00' : '#00ffff',
        textDecoration: 'none',
        fontSize: '12px',
        letterSpacing: '1px',
        padding: '8px 16px',
        border: `1px solid ${highlight ? '#00ff00' : 'rgba(0, 255, 255, 0.3)'}`,
        transition: 'all 0.3s ease',
        fontWeight: highlight ? '700' : '400'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = highlight ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)';
        e.target.style.boxShadow = highlight ? '0 0 20px rgba(0, 255, 0, 0.3)' : '0 0 20px rgba(0, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.boxShadow = 'none';
      }}
    >
      {label}
    </Link>
  );
};

export default AppRouter;


/**
 * INTEGRATION NOTES:
 *
 * 1. If you already have an AppRouter.js:
 *    - Just add the ForensicGame import
 *    - Add the <Route path="/forensic-game" element={<ForensicGame />} /> line
 *    - Optionally add navigation links
 *
 * 2. If you're using a different routing library:
 *    - Adapt the Route syntax to your router
 *    - The component itself is router-agnostic
 *
 * 3. State Management:
 *    - The example shows React Context for global state
 *    - You can use Redux, Zustand, or any other state library
 *    - ForensicGame can receive data via props or context
 *
 * 4. Navigation from Policy Simulator (App.js):
 *    Add this button anywhere in your App component:
 *
 *    import { useNavigate } from 'react-router-dom';
 *
 *    function App() {
 *      const navigate = useNavigate();
 *
 *      return (
 *        <div>
 *          {... your existing UI ...}
 *
 *          <button
 *            onClick={() => navigate('/forensic-game')}
 *            className="forensic-game-btn"
 *          >
 *            🎮 ENTER FORENSIC INVESTIGATION MODE
 *          </button>
 *        </div>
 *      );
 *    }
 *
 * 5. Styling the Navigation Button:
 *    Add to your App.css:
 *
 *    .forensic-game-btn {
 *      background: transparent;
 *      border: 3px solid #00ff00;
 *      color: #00ff00;
 *      padding: 20px 40px;
 *      font-family: 'JetBrains Mono', monospace;
 *      font-size: 16px;
 *      letter-spacing: 2px;
 *      cursor: pointer;
 *      transition: all 0.3s ease;
 *      margin-top: 40px;
 *    }
 *
 *    .forensic-game-btn:hover {
 *      background: rgba(0, 255, 0, 0.1);
 *      box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
 *      transform: scale(1.05);
 *    }
 */
