import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ForensicGame.css';

// ============================================
// MAIN GAME CONTAINER
// ============================================
const ForensicGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState({
    evidenceCaptured: false,
    speedMultiplier: 1.0,
    toxicityLevel: 0,
    investigationComplete: false
  });

  const levels = [
    'briefing',
    'incident',
    'debrief',
    'evidence-lab',
    'climate-forensics',
    'decision'
  ];

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  return (
    <div className="forensic-game-container">
      <AnimatePresence mode="wait">
        {currentLevel === 0 && (
          <MissionBriefing
            key="briefing"
            onComplete={nextLevel}
          />
        )}
        {currentLevel === 1 && (
          <SimulationHUD
            key="incident"
            onComplete={nextLevel}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {currentLevel === 2 && (
          <DebriefScreen
            key="debrief"
            onComplete={nextLevel}
            gameState={gameState}
          />
        )}
        {currentLevel === 3 && (
          <EvidenceLabScreen
            key="evidence-lab"
            onComplete={nextLevel}
            gameState={gameState}
          />
        )}
        {currentLevel === 4 && (
          <ClimateForensicsScreen
            key="climate-forensics"
            onComplete={nextLevel}
            gameState={gameState}
          />
        )}
        {currentLevel === 5 && (
          <DecisionScreen
            key="decision"
            gameState={gameState}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


// ============================================
// LEVEL 1: MISSION BRIEFING
// ============================================
const MissionBriefing = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const briefingText = [
    "LOCATION: SOUTH BRONX, NYC",
    "TIME: 08:00 HOURS",
    "STATUS: CRITICAL ACCUMULATION DETECTED",
    "MISSION: FORENSIC ANALYSIS OF TOXIC EVENT"
  ];

  useEffect(() => {
    if (textIndex < briefingText.length) {
      const timer = setTimeout(() => {
        setTextIndex(textIndex + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsReady(true), 1000);
    }
  }, [textIndex]);

  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);

  const handleMouseDown = () => {
    holdTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdTimerRef.current);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      setHoldProgress(0);
    }
  };

  return (
    <motion.div
      className="level-container briefing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scanline overlay */}
      <div className="scanline-overlay"></div>
      <div className="crt-noise"></div>

      {/* Satellite image background */}
      <div className="satellite-bg">
        <div className="targeting-reticle">
          <div className="reticle-crosshair"></div>
          <div className="reticle-ring"></div>
        </div>
      </div>

      {/* Briefing text */}
      <div className="briefing-content">
        <div className="briefing-header">
          <motion.div
            className="classification-tag"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            [ CLASSIFIED: FORENSIC INVESTIGATION ]
          </motion.div>
        </div>

        <div className="briefing-text-container">
          {briefingText.map((line, index) => (
            <motion.div
              key={index}
              className={`briefing-line ${index < textIndex ? 'visible' : ''}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: index < textIndex ? 1 : 0,
                x: index < textIndex ? 0 : -50
              }}
              transition={{ duration: 0.4 }}
            >
              <span className="line-prefix">&gt;&gt;</span> {line}
            </motion.div>
          ))}
        </div>

        {/* Initialize button */}
        {isReady && (
          <motion.div
            className="initialize-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className="initialize-btn"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="btn-content">
                <span className="btn-text">HOLD TO INITIALIZE SCAN</span>
                <div className="hold-progress-bar">
                  <div
                    className="hold-progress-fill"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
              <div className="btn-glow"></div>
            </button>
            <div className="initialize-hint">
              [ HOLD FOR 3 SECONDS TO PROCEED ]
            </div>
          </motion.div>
        )}
      </div>

      {/* Grid overlay */}
      <div className="grid-overlay"></div>
    </motion.div>
  );
};


// ============================================
// LEVEL 2: SIMULATION HUD (VIDEO + OVERLAY)
// ============================================
const SimulationHUD = ({ onComplete, gameState, setGameState }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [systemLogs, setSystemLogs] = useState([]);
  const [toxicityMeter, setToxicityMeter] = useState(0);
  const [breachDetected, setBreachDetected] = useState(false);
  const [evidenceCaptured, setEvidenceCaptured] = useState(false);
  const [truckSpeed, setTruckSpeed] = useState(60);

  // System log messages based on truck speed
  const getLogForSpeed = (speed) => {
    if (speed >= 55) return "TRAFFIC FLOW: OPTIMAL - 60 MPH";
    if (speed >= 45) return "TRAFFIC FLOW: GOOD - 50 MPH";
    if (speed >= 35) return "WARNING: SPEED DROPPING - 40 MPH";
    if (speed >= 25) return "CAUTION: CONGESTION BUILDING - 30 MPH";
    if (speed >= 15) return "CRITICAL: HEAVY CONGESTION - 20 MPH";
    if (speed >= 10) return "SEVERE: NEAR GRIDLOCK - 10 MPH";
    return "GRIDLOCK: TRAFFIC SPEED 5 MPH";
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);

      // Auto-sync truck speed with video progress
      // Start of video (t=0) → 60 MPH (free flow)
      // End of video (t=duration) → 5 MPH (gridlock)
      if (video.duration > 0) {
        const progress = time / video.duration; // 0 to 1
        const newSpeed = Math.round(60 - (progress * 55)); // 60 → 5
        setTruckSpeed(Math.max(5, Math.min(60, newSpeed)));
      }

      // Breach detection (when toxicity is very high and speed is very low)
      if (toxicityMeter >= 85 && truckSpeed <= 10 && !breachDetected) {
        setBreachDetected(true);
        video.pause();
        setIsPlaying(false);
        addLog("[ BREACH DETECTED ] CAPTURE EVIDENCE NOW!", 'critical');
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [breachDetected, toxicityMeter, truckSpeed]);

  // Calculate toxicity based on truck speed (inverted - low speed = high pollution)
  useEffect(() => {
    // Toxicity increases as speed decreases
    // 60 mph (free flow) = 0% toxicity
    // 5 mph (gridlock) = 100% toxicity
    const toxicity = Math.max(0, Math.min(100, ((60 - truckSpeed) / 55) * 100));
    setToxicityMeter(toxicity);

    // Log speed changes
    const logMessage = getLogForSpeed(truckSpeed);
    if (toxicity > 50) {
      addLog(logMessage, 'warning');
    } else if (toxicity > 80) {
      addLog(logMessage, 'critical');
    }

    // Update game state
    setGameState(prev => ({ ...prev, speedMultiplier: truckSpeed / 60, toxicityLevel: toxicity }));
  }, [truckSpeed]);

  const addLog = (message, type = 'normal') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setSystemLogs(prev => [...prev, { timestamp, message, type }].slice(-8));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const captureEvidence = () => {
    setEvidenceCaptured(true);
    setGameState(prev => ({ ...prev, evidenceCaptured: true }));
    addLog("EVIDENCE CAPTURED SUCCESSFULLY", 'success');
    setTimeout(() => {
      videoRef.current?.play();
      setIsPlaying(true);
      setBreachDetected(false);
    }, 1500);
  };

  const handleVideoEnd = () => {
    setTimeout(() => onComplete(), 2000);
  };

  const handleTruckSpeed = (e) => {
    const speed = parseInt(e.target.value);
    setTruckSpeed(speed);
  };

  // Initial log on mount
  useEffect(() => {
    addLog("INITIALIZING FORENSIC SENSOR ARRAY...");
    setTimeout(() => addLog("BASELINE TRAFFIC: 60 MPH - FREE FLOW"), 500);
  }, []);

  return (
    <motion.div
      className="level-container simulation-screen"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Container */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="simulation-video"
          src="/forensic-assets/ezgif.com-split.mp4"
          onEnded={handleVideoEnd}
        />

        {/* HUD Overlay */}
        <div className="hud-overlay">
          {/* Top Bar */}
          <div className="hud-top-bar">
            <div className="hud-location">
              <span className="hud-label">LOCATION</span>
              <span className="hud-value">SOUNDVIEW, BRONX</span>
            </div>
            <div className="hud-timestamp">
              <span className="hud-label">TIME</span>
              <span className="hud-value">{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</span>
            </div>
            <div className="hud-status">
              <span className="hud-label">STATUS</span>
              <span className={`hud-value ${breachDetected ? 'critical' : 'active'}`}>
                {breachDetected ? 'BREACH' : 'MONITORING'}
              </span>
            </div>
          </div>

          {/* Toxicity Meter (Top Right) */}
          <div className="toxicity-meter">
            <div className="meter-label">TOXICITY LEVEL</div>
            <div className="meter-container">
              <div
                className="meter-fill"
                style={{
                  height: `${toxicityMeter}%`,
                  backgroundColor: toxicityMeter > 80 ? '#ef4444' : toxicityMeter > 50 ? '#f97316' : '#22d3a5'
                }}
              />
              <div className="meter-markers">
                {[0, 25, 50, 75, 100].map(mark => (
                  <div key={mark} className="meter-mark" style={{ bottom: `${mark}%` }}>
                    <span>{mark}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="meter-value">{toxicityMeter.toFixed(0)}%</div>
          </div>

          {/* System Logs (Bottom Left) */}
          <div className="system-logs">
            <div className="logs-header">[ SYSTEM LOGS ]</div>
            <div className="logs-content">
              {systemLogs.map((log, index) => (
                <motion.div
                  key={index}
                  className={`log-entry ${log.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-message">{log.message}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Targeting Reticle (Center) */}
          <div className="targeting-overlay">
            <div className="target-crosshair"></div>
            {breachDetected && (
              <motion.div
                className="breach-warning"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="warning-text">BREACH DETECTED</div>
                <div className="warning-icon">⚠</div>
              </motion.div>
            )}
          </div>

          {/* Recording Indicator */}
          <div className="recording-indicator">
            <div className="rec-dot"></div>
            <span>REC</span>
          </div>

          {/* Frame Counter */}
          <div className="frame-counter">
            FRAME: {Math.floor(currentTime * 30)}
          </div>
        </div>

        {/* Breach Evidence Capture Button */}
        {breachDetected && !evidenceCaptured && (
          <motion.div
            className="evidence-capture-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="capture-prompt">
              <div className="prompt-text">CRITICAL EVIDENCE DETECTED</div>
              <button
                className="capture-btn"
                onClick={captureEvidence}
              >
                <span>CAPTURE EVIDENCE</span>
                <div className="btn-pulse"></div>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-section">
          <button
            className="control-btn play-btn"
            onClick={togglePlay}
          >
            {isPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
          </button>
        </div>

        <div className="control-section speed-control">
          <div className="control-label">
            <span>TRUCK SPEED</span>
            <span className="speed-value">{truckSpeed} MPH</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={truckSpeed}
            onChange={handleTruckSpeed}
            className="speed-slider"
          />
          <div className="speed-markers">
            <span>5</span>
            <span>15</span>
            <span>30</span>
            <span>45</span>
            <span>60 MPH</span>
          </div>
        </div>
      </div>

      {/* Glitch overlay during critical moments */}
      {toxicityMeter > 80 && (
        <div className="glitch-overlay"></div>
      )}
    </motion.div>
  );
};


// ============================================
// LEVEL 3: DEBRIEF SCREEN (DATA ANALYSIS)
// ============================================
const DebriefScreen = ({ onComplete, gameState }) => {
  const [dataRevealed, setDataRevealed] = useState(false);
  const [congestedValue, setCongestedValue] = useState(0);
  const [optimizedValue, setOptimizedValue] = useState(0);
  const [asthmaData, setAsthmaData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const evidenceImages = [
    { src: '/forensic-assets/google-earth-view.png', caption: 'Satellite view: Expressway cuts through neighborhood' },
    { src: '/forensic-assets/bruckner-overview.jpg', caption: 'Aerial View: 40-foot sunken trench' },
    { src: '/forensic-assets/screenshot1.png', caption: 'Ground-level: Residential proximity to highway' },
    { src: '/forensic-assets/highway-detail.jpg', caption: 'Cross-Bronx Expressway canyon design' },
    { src: '/forensic-assets/screenshot2.png', caption: 'Community impact: Homes within exhaust zone' },
    { src: '/forensic-assets/residential-zone.jpg', caption: 'Residential buildings at trench edge' }
  ];

  useEffect(() => {
    setTimeout(() => setDataRevealed(true), 500);

    // Load asthma GeoJSON
    fetch('/Asthma_Index_Rates.geojson')
      .then(res => res.json())
      .then(data => setAsthmaData(data))
      .catch(err => console.error('Failed to load asthma data:', err));
  }, []);

  // Auto-cycle images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % evidenceImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [evidenceImages.length]);

  useEffect(() => {
    if (dataRevealed) {
      let congested = 0;
      const congestedInterval = setInterval(() => {
        congested += 3;
        if (congested >= 90) {
          congested = 90;
          clearInterval(congestedInterval);
        }
        setCongestedValue(congested);
      }, 20);

      setTimeout(() => {
        let optimized = 0;
        const optimizedInterval = setInterval(() => {
          optimized += 1;
          if (optimized >= 20) {
            optimized = 20;
            clearInterval(optimizedInterval);
          }
          setOptimizedValue(optimized);
        }, 30);
      }, 800);
    }
  }, [dataRevealed]);

  // GeoJSON style function
  const getAsthmaStyle = (feature) => {
    const rate = feature.properties?.Asthma_I_R || 0;
    return {
      fillColor: rate > 100 ? '#DC2626' : rate > 75 ? '#F97316' : rate > 50 ? '#FCD34D' : '#34D399',
      weight: 1,
      opacity: 1,
      color: '#FFF',
      fillOpacity: 0.6
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const neighborhood = feature.properties.UHF_NEIGH || feature.properties.BOROUGH || 'Unknown';
      const asthmaRate = feature.properties.Asthma_I_R;

      if (asthmaRate !== null && asthmaRate !== undefined) {
        layer.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong>${neighborhood}</strong><br/>
            Asthma Rate: <span style="color: ${asthmaRate > 75 ? '#EF4444' : '#34D399'}">${asthmaRate.toFixed(1)}%</span>
          </div>
        `);
      }
    }
  };

  return (
    <motion.div
      className="level-container debrief-screen-v2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="debrief-v2-container">
        {/* Header */}
        <motion.div
          className="debrief-v2-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="level-badge">
            <span>◈</span>
            <span>LEVEL 3 / FORENSIC DEBRIEF</span>
          </div>
          <h1 className="debrief-v2-title">EVIDENCE ANALYSIS</h1>
        </motion.div>

        {/* Evidence Status */}
        {gameState.evidenceCaptured && (
          <motion.div
            className="evidence-captured-banner"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="banner-icon">✓</span>
            <span className="banner-text">CRITICAL EVIDENCE SECURED</span>
          </motion.div>
        )}

        {/* Key Finding Section */}
        <motion.div
          className="key-finding-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="section-title">
            <span className="title-icon">▸</span>
            THE SUNKEN TRENCH
          </h2>
          <div className="finding-content">
            <div className="finding-text">
              <div className="finding-stats">
                <div className="stat-box">
                  <div className="stat-value red">40 ft</div>
                  <div className="stat-label">Deep Trench</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value orange">5,200+</div>
                  <div className="stat-label">Daily Trucks</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value red">60,000+</div>
                  <div className="stat-label">Exposed Residents</div>
                </div>
              </div>
              <p className="finding-impact">
                ⚠ Expressway runs 40 ft below street level → Traps diesel exhaust → Spills into apartments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Visual Evidence Slideshow */}
        <motion.div
          className="visual-evidence-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="section-title">
            <span className="title-icon">▸</span>
            VISUAL EVIDENCE
          </h2>
          <div className="evidence-slideshow">
            <div className="slideshow-container">
              {evidenceImages.map((img, index) => (
                <motion.div
                  key={index}
                  className={`evidence-slide ${index === currentImageIndex ? 'active' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={img.src} alt={img.caption} />
                  <div className="slide-caption">{img.caption}</div>
                </motion.div>
              ))}
            </div>
            <div className="slideshow-indicators">
              {evidenceImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          className="comparison-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title">
            <span className="title-icon">▸</span>
            SPEED COMPARISON
          </h2>
          <div className="comparison-grid">
            {/* Congested State */}
            <div className="scenario-card congested-card">
              <div className="card-badge danger">CURRENT STATE</div>
              <h3 className="card-title">CONGESTED (5 MPH)</h3>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">Pollution Radius</span>
                  <span className="metric-value red">0.75 (HIGH)</span>
                </div>
                <div className="metric">
                  <span className="metric-label">PM2.5 Level</span>
                  <span className="metric-value red">26.25 µg/m³</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Breach Status</span>
                  <span className="metric-value red">⚠ CONFIRMED</span>
                </div>
              </div>
              <div className="card-bar">
                <div className="bar-label">Health Risk:</div>
                <motion.div
                  className="bar-fill danger-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${congestedValue}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <span className="bar-value">{congestedValue}%</span>
                </motion.div>
              </div>
              <div className="card-verdict danger">
                <span>☠</span>
                <span>RESIDENTIAL BREACH</span>
              </div>
            </div>

            {/* Optimized State */}
            <div className="scenario-card optimized-card">
              <div className="card-badge success">FORENSIC PROOF</div>
              <h3 className="card-title">OPTIMIZED (60 MPH)</h3>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">Pollution Radius</span>
                  <span className="metric-value green">0.30 (LOW)</span>
                </div>
                <div className="metric">
                  <span className="metric-label">PM2.5 Level</span>
                  <span className="metric-value green">10.50 µg/m³</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Breach Status</span>
                  <span className="metric-value green">✓ PREVENTED</span>
                </div>
              </div>
              <div className="card-bar">
                <div className="bar-label">Health Risk:</div>
                <motion.div
                  className="bar-fill success-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${optimizedValue}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                  <span className="bar-value">{optimizedValue}%</span>
                </motion.div>
              </div>
              <div className="card-verdict success">
                <span>✓</span>
                <span>COMPLIANCE ACHIEVED</span>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="impact-summary">
            <div className="summary-icon">◈</div>
            <div className="summary-text">
              <strong>CONCLUSION:</strong> 60 MPH reduces PM2.5 by <span className="highlight-green">60%</span> → Prevents residential breach
            </div>
          </div>
        </motion.div>

        {/* Data Sources Section */}
        <motion.div
          className="data-sources-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="section-title">
            <span className="title-icon">▸</span>
            DATA SOURCES & MODELS
          </h2>

          <div className="sources-grid">
            {/* Real-Time Data */}
            <div className="source-category">
              <h3 className="category-title">
                <span className="category-icon">📊</span>
                REAL-TIME DATA
              </h3>
              <ul className="source-list">
                <li>
                  <strong>NYC Open Data (Socrata API)</strong>
                  <span className="source-detail">Traffic speeds, truck routes, motor vehicle collisions</span>
                </li>
                <li>
                  <strong>NYC DOT</strong>
                  <span className="source-detail">Cross-Bronx Expressway traffic volumes</span>
                </li>
                <li>
                  <strong>Vision Zero Data</strong>
                  <span className="source-detail">Pedestrian collision database</span>
                </li>
              </ul>
            </div>

            {/* Health & Environmental */}
            <div className="source-category">
              <h3 className="category-title">
                <span className="category-icon">🫁</span>
                HEALTH & ENVIRONMENT
              </h3>
              <ul className="source-list">
                <li>
                  <strong>NYC EHDP (Environmental & Health Data Portal)</strong>
                  <span className="source-detail">Heat Vulnerability Index (HVI), UHF boundaries</span>
                </li>
                <li>
                  <strong>EPA EJScreen</strong>
                  <span className="source-detail">PM2.5 levels, environmental justice indicators</span>
                </li>
                <li>
                  <strong>NYCCAS (Community Air Survey)</strong>
                  <span className="source-detail">Neighborhood air quality monitoring</span>
                </li>
                <li>
                  <strong>NYC Health</strong>
                  <span className="source-detail">Pediatric asthma hospitalization rates (UHF 402)</span>
                </li>
              </ul>
            </div>

            {/* Predictive Models */}
            <div className="source-category">
              <h3 className="category-title">
                <span className="category-icon">🤖</span>
                PREDICTIVE MODELS
              </h3>
              <ul className="source-list">
                <li>
                  <strong>LSTM Neural Network (TensorFlow 2.15)</strong>
                  <span className="source-detail">Traffic speed prediction, temporal patterns</span>
                </li>
                <li>
                  <strong>Hidden Markov Model (HMM)</strong>
                  <span className="source-detail">Environmental state transitions (3 states)</span>
                </li>
                <li>
                  <strong>Agent-Based Simulation</strong>
                  <span className="source-detail">Multi-agent traffic response to taxation</span>
                </li>
                <li>
                  <strong>Freight Tax Policy Model</strong>
                  <span className="source-detail">Elasticity of demand: -0.4, baseline 5,200 trucks/day</span>
                </li>
              </ul>
            </div>

            {/* Geographic Data */}
            <div className="source-category">
              <h3 className="category-title">
                <span className="category-icon">🗺️</span>
                GEOGRAPHIC DATA
              </h3>
              <ul className="source-list">
                <li>
                  <strong>Mapbox GL JS v2.15.0</strong>
                  <span className="source-detail">Satellite imagery, basemaps</span>
                </li>
                <li>
                  <strong>NYC GeoJSON Boundaries</strong>
                  <span className="source-detail">UHF districts, ZIP codes, neighborhoods</span>
                </li>
                <li>
                  <strong>Turf.js</strong>
                  <span className="source-detail">Geospatial calculations, buffer zones</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="methodology-note">
            <span className="note-icon">ℹ</span>
            <span className="note-text">
              All models validated against historical data. Health impact formulas based on EPA guidelines.
              Geographic focus: UHF District 402 (Hunts Point/Mott Haven, Bronx).
            </span>
          </div>
        </motion.div>

        {/* Asthma Map Section */}
        {asthmaData && (
          <motion.div
            className="asthma-map-section"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">
              <span className="title-icon">▸</span>
              HEALTH IMPACT MAP
            </h2>
            <p className="map-description">
              <strong className="highlight-red">Red zones = Highest asthma rates</strong> (near expressway)
            </p>
            <div className="map-container">
              <MapContainer
                center={[40.8250, -73.8667]}
                zoom={13}
                style={{ height: '400px', width: '100%', background: '#0a0a0a' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <GeoJSON
                  data={asthmaData}
                  style={getAsthmaStyle}
                  onEachFeature={onEachFeature}
                />
              </MapContainer>
            </div>
            <div className="map-legend">
              <div className="legend-title">Asthma Hospitalization Rate:</div>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#DC2626' }} />
                  <span>{'>'} 100 (Critical)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#F97316' }} />
                  <span>75-100 (High)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#FCD34D' }} />
                  <span>50-75 (Moderate)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#34D399' }} />
                  <span>{'<'} 50 (Low)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Proceed Button */}
        <motion.button
          className="debrief-v2-proceed-btn"
          onClick={onComplete}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>PROCEED TO EVIDENCE LAB</span>
          <span className="btn-arrow">→</span>
        </motion.button>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />
    </motion.div>
  );
};


// ============================================
// LEVEL 4: EVIDENCE LAB (FORENSIC DIAGRAMS)
// ============================================
const EvidenceLabScreen = ({ onComplete, gameState }) => {
  const [activeEvidence, setActiveEvidence] = useState(0);
  const [allReviewed, setAllReviewed] = useState(false);
  const [reviewedPanels, setReviewedPanels] = useState(new Set());

  const evidencePanels = [
    {
      id: 'network-map',
      title: 'FORENSIC UTILITY TOOL',
      subtitle: 'Actor Network & System Map',
      file: '/forensic-network-map.html',
      badge: 'SYSTEM ARCHITECTURE'
    },
    {
      id: 'actor-network',
      title: 'MULTI-LAYER STACK',
      subtitle: 'Raw Truth → Spatial Consequence',
      file: '/actor_network_diagram.html',
      badge: 'EVIDENCE PIPELINE'
    },
    {
      id: 'model-comparison',
      title: 'MODEL SELECTION',
      subtitle: 'Why LSTM Wins the Argument',
      file: '/model_comparison.html',
      badge: 'SCIENTIFIC PROOF'
    },
    {
      id: 'ssp-scenarios',
      title: 'CLIMATE SCENARIOS',
      subtitle: 'SSP Future Projections',
      file: '/ssp_scenario_diagram.html',
      badge: 'PREDICTIVE ANALYSIS'
    }
  ];

  useEffect(() => {
    const newReviewed = new Set(reviewedPanels);
    newReviewed.add(activeEvidence);
    setReviewedPanels(newReviewed);

    if (newReviewed.size === evidencePanels.length) {
      setAllReviewed(true);
    }
  }, [activeEvidence]);

  const handleProceed = () => {
    if (allReviewed) {
      onComplete();
    }
  };

  return (
    <motion.div
      className="level-container evidence-lab-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="evidence-lab-container">
        {/* Header */}
        <motion.div
          className="evidence-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="evidence-level-badge">
            <span className="badge-icon">◈</span>
            <span className="badge-text">LEVEL 4 / EVIDENCE LAB</span>
          </div>
          <h1 className="evidence-title">FORENSIC EVIDENCE ARCHIVE</h1>
          <p className="evidence-subtitle">
            Review all technical documentation before proceeding to decision protocol
          </p>
          <div className="evidence-progress">
            <span className="progress-label">REVIEWED:</span>
            <span className="progress-count">{reviewedPanels.size} / {evidencePanels.length}</span>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(reviewedPanels.size / evidencePanels.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Evidence Navigation Tabs */}
        <motion.div
          className="evidence-tabs"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {evidencePanels.map((panel, index) => (
            <button
              key={panel.id}
              className={`evidence-tab ${activeEvidence === index ? 'active' : ''} ${reviewedPanels.has(index) ? 'reviewed' : ''}`}
              onClick={() => setActiveEvidence(index)}
            >
              <span className="tab-badge">{panel.badge}</span>
              <span className="tab-title">{panel.title}</span>
              {reviewedPanels.has(index) && <span className="tab-check">✓</span>}
            </button>
          ))}
        </motion.div>

        {/* Evidence Display Area */}
        <motion.div
          className="evidence-display"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="evidence-panel-header">
            <div className="panel-title-section">
              <h2 className="panel-title">{evidencePanels[activeEvidence].title}</h2>
              <p className="panel-subtitle">{evidencePanels[activeEvidence].subtitle}</p>
            </div>
            <div className="panel-controls">
              <button
                className="panel-nav-btn"
                onClick={() => setActiveEvidence(Math.max(0, activeEvidence - 1))}
                disabled={activeEvidence === 0}
              >
                ← PREV
              </button>
              <span className="panel-counter">{activeEvidence + 1} / {evidencePanels.length}</span>
              <button
                className="panel-nav-btn"
                onClick={() => setActiveEvidence(Math.min(evidencePanels.length - 1, activeEvidence + 1))}
                disabled={activeEvidence === evidencePanels.length - 1}
              >
                NEXT →
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvidence}
              className="evidence-iframe-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <iframe
                src={evidencePanels[activeEvidence].file}
                className="evidence-iframe"
                title={evidencePanels[activeEvidence].title}
                frameBorder="0"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Proceed Button */}
        <motion.button
          className={`evidence-proceed-btn ${allReviewed ? 'ready' : 'disabled'}`}
          onClick={handleProceed}
          disabled={!allReviewed}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={allReviewed ? { scale: 1.02 } : {}}
          whileTap={allReviewed ? { scale: 0.98 } : {}}
        >
          <div className="btn-content">
            <span className="btn-icon">{allReviewed ? '✓' : '◈'}</span>
            <div className="btn-text-section">
              <span className="btn-main-text">
                {allReviewed ? 'PROCEED TO DECISION PROTOCOL' : 'REVIEW ALL EVIDENCE TO PROCEED'}
              </span>
              <span className="btn-sub-text">
                {allReviewed ? 'All evidence panels reviewed' : `${reviewedPanels.size}/${evidencePanels.length} panels reviewed`}
              </span>
            </div>
            {allReviewed && <span className="btn-arrow">→</span>}
          </div>
        </motion.button>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />
    </motion.div>
  );
};


// ============================================
// LEVEL 5: CLIMATE FORENSICS DASHBOARD
// ============================================
const ClimateForensicsScreen = ({ onComplete, gameState }) => {
  const [scenario, setScenario] = useState('CURRENT');

  // Real Bronx neighborhood data
  const realBronxData = [
    // THE "SACRIFICE ZONE" (South Bronx / Bruckner Corridor)
    { id: "10474", name: "Hunts Point", income: 22000, pm25: 12.8, zone: "Sacrifice" },
    { id: "10454", name: "Mott Haven", income: 24500, pm25: 13.5, zone: "Sacrifice" },
    { id: "10455", name: "Longwood", income: 26000, pm25: 11.9, zone: "Sacrifice" },
    { id: "10451", name: "Melrose", income: 31000, pm25: 11.2, zone: "Sacrifice" },
    { id: "10459", name: "Foxhurst", income: 28000, pm25: 12.1, zone: "Sacrifice" },

    // THE "MIDDLE GROUND" (Central Bronx)
    { id: "10462", name: "Parkchester", income: 52000, pm25: 9.2, zone: "Middle" },
    { id: "10461", name: "Pelham Bay", income: 61000, pm25: 8.5, zone: "Middle" },
    { id: "10467", name: "Norwood", income: 45000, pm25: 9.8, zone: "Middle" },
    { id: "10469", name: "Baychester", income: 58000, pm25: 8.9, zone: "Middle" },

    // THE "SAFE HAVEN" (North Bronx / Manhattan)
    { id: "10471", name: "Riverdale", income: 95000, pm25: 7.2, zone: "Safe" },
    { id: "10464", name: "City Island", income: 88000, pm25: 6.9, zone: "Safe" },
    { id: "10024", name: "Upper West Side", income: 135000, pm25: 7.1, zone: "Safe" },
    { id: "10021", name: "Upper East Side", income: 142000, pm25: 7.0, zone: "Safe" }
  ];

  // Transform data based on scenario
  const getScenarioData = () => {
    if (scenario === 'SSP1') {
      // Policy success: Reduce Sacrifice zone PM2.5 by 40%
      return realBronxData.map(d =>
        d.zone === 'Sacrifice'
          ? { ...d, pm25: d.pm25 * 0.6 }
          : d
      );
    } else if (scenario === 'SSP3') {
      // Worst case: Increase Sacrifice zone PM2.5 by 50%
      return realBronxData.map(d =>
        d.zone === 'Sacrifice'
          ? { ...d, pm25: d.pm25 * 1.5 }
          : d
      );
    } else if (scenario === 'SSP4') {
      // Inequality: Extreme divergence
      return realBronxData.map(d => {
        if (d.zone === 'Sacrifice') return { ...d, pm25: d.pm25 * 1.6 };
        if (d.zone === 'Safe') return { ...d, pm25: d.pm25 * 0.7 };
        return d;
      });
    }
    return realBronxData; // CURRENT
  };

  // Pollution radius for visualization
  const getRadiusConfig = () => {
    switch(scenario) {
      case 'SSP1': return { radius: 30, color: '#34D399', animation: 'stable', label: 'OPTIMIZED' };
      case 'SSP3': return { radius: 120, color: '#DC2626', animation: 'violent', label: 'CATASTROPHIC' };
      case 'SSP4': return { radius: 100, color: '#F97316', animation: 'pulse', label: 'TARGETED' };
      default: return { radius: 75, color: '#EF4444', animation: 'pulse', label: 'BREACH' };
    }
  };

  const radiusConfig = getRadiusConfig();
  const scenarioData = getScenarioData();

  // Policy verdict
  const getPolicyVerdict = () => {
    switch(scenario) {
      case 'SSP1':
        return {
          title: 'SSP1: SUSTAINABLE PATHWAY',
          text: 'Electric freight transition + speed enforcement achieves environmental justice. PM2.5 reduced by 40% in sacrifice zones. Health equity restored.',
          color: '#34D399'
        };
      case 'SSP3':
        return {
          title: 'SSP3: REGIONAL RIVALRY',
          text: 'Policy failure. Diesel fleet aging + climate warming = 50% pollution increase. Sacrifice zones become uninhabitable. Criminal negligence.',
          color: '#DC2626'
        };
      case 'SSP4':
        return {
          title: 'SSP4: INEQUALITY - FORENSIC EVIDENCE OF TARGETED HARM',
          text: 'Disproportionate impact on low-income sectors detected. Manhattan protected while Bronx suffers 60% increase. Recommended Action: Variable Speed Enforcement + Environmental Justice Litigation.',
          color: '#F97316'
        };
      default:
        return {
          title: 'CURRENT (2024): BASELINE CONDITIONS',
          text: 'Status quo analysis: Poor neighborhoods experience 85% higher PM2.5 exposure than wealthy areas. Traffic speed 5 MPH in congestion = maximum accumulation.',
          color: '#EF4444'
        };
    }
  };

  const verdict = getPolicyVerdict();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: '#0f1720',
          border: `1px solid ${data.zone === 'Sacrifice' ? '#EF4444' : data.zone === 'Safe' ? '#34D399' : '#38BDF8'}`,
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <div style={{ color: '#FFF', fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</div>
          <div style={{ color: '#888' }}>ZIP: {data.id}</div>
          <div style={{ color: '#888' }}>Income: ${(data.income/1000).toFixed(0)}k</div>
          <div style={{ color: '#EF4444', fontWeight: 'bold' }}>PM2.5: {data.pm25.toFixed(1)} µg/m³</div>
          <div style={{
            color: data.pm25 > 10 ? '#DC2626' : '#34D399',
            marginTop: '4px',
            fontSize: '10px',
            textTransform: 'uppercase'
          }}>
            {data.pm25 > 10 ? '⚠ HIGH RISK' : '✓ SAFE'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="level-container climate-forensics-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="climate-forensics-container">
        {/* Header */}
        <div className="climate-header">
          <div className="climate-badge">
            <span>◈</span>
            <span>LEVEL 5 / CLIMATE FORENSICS</span>
          </div>
          <h1 className="climate-title">EXPOSURE INEQUALITY ANALYSIS</h1>
          <p className="climate-subtitle">
            Income vs Pollution: A Forensic Proof of Environmental Crime
          </p>
        </div>

        {/* Control Deck */}
        <div className="scenario-controls">
          <div className="control-label">SELECT CLIMATE SCENARIO:</div>
          <div className="scenario-buttons">
            {['CURRENT', 'SSP1', 'SSP3', 'SSP4'].map(s => (
              <button
                key={s}
                className={`scenario-btn ${scenario === s ? 'active' : ''} ${s.toLowerCase()}`}
                onClick={() => setScenario(s)}
              >
                <span className="btn-icon">
                  {s === 'CURRENT' && '●'}
                  {s === 'SSP1' && '✓'}
                  {s === 'SSP3' && '✕'}
                  {s === 'SSP4' && '◈'}
                </span>
                <span className="btn-text">{s}</span>
                <span className="btn-subtitle">
                  {s === 'CURRENT' && '2024'}
                  {s === 'SSP1' && 'Sustainable'}
                  {s === 'SSP3' && 'Rivalry'}
                  {s === 'SSP4' && 'Inequality'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Panels */}
        <div className="forensics-panels">
          {/* Panel A: Simulation Preview */}
          <div className="forensics-panel simulation-panel">
            <div className="panel-header">
              <h3>POLLUTION RADIUS</h3>
              <span className="panel-badge">{radiusConfig.label}</span>
            </div>
            <div className="simulation-preview">
              <div className="building-boundary" />
              <motion.div
                className={`pollution-cloud ${radiusConfig.animation}`}
                style={{
                  width: radiusConfig.radius * 2,
                  height: radiusConfig.radius * 2,
                  background: `radial-gradient(circle, ${radiusConfig.color}40, ${radiusConfig.color}00)`,
                  border: `2px solid ${radiusConfig.color}`,
                  boxShadow: `0 0 30px ${radiusConfig.color}80`
                }}
                animate={{
                  scale: radiusConfig.animation === 'violent' ? [1, 1.1, 0.95, 1.05, 1] : [1, 1.05, 1],
                  opacity: radiusConfig.animation === 'stable' ? 0.6 : [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: radiusConfig.animation === 'violent' ? 0.8 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {radiusConfig.radius > 70 && (
                <motion.div
                  className="breach-warning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ⚠ BREACH DETECTED
                </motion.div>
              )}
            </div>
            <div className="simulation-stats">
              <div className="stat-row">
                <span>Radius:</span>
                <span style={{ color: radiusConfig.color }}>{radiusConfig.radius}px</span>
              </div>
              <div className="stat-row">
                <span>Building Limit:</span>
                <span>70px</span>
              </div>
              <div className="stat-row">
                <span>Status:</span>
                <span style={{ color: radiusConfig.radius > 70 ? '#EF4444' : '#34D399' }}>
                  {radiusConfig.radius > 70 ? 'UNSAFE' : 'SAFE'}
                </span>
              </div>
            </div>
          </div>

          {/* Panel B: Exposure Cartogram */}
          <div className="forensics-panel cartogram-panel">
            <div className="panel-header">
              <h3>EXPOSURE CARTOGRAM</h3>
              <span className="panel-badge">BUBBLE CHART</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3050" opacity={0.3} />
                  <XAxis
                    type="number"
                    dataKey="income"
                    name="Income"
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }}
                    label={{ value: 'Median Income ($)', position: 'bottom', fill: '#888', fontSize: 12, fontFamily: 'monospace' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="number"
                    dataKey="pm25"
                    name="PM2.5"
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }}
                    label={{ value: 'PM2.5 Exposure (µg/m³)', angle: -90, position: 'left', fill: '#888', fontSize: 12, fontFamily: 'monospace' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Neighborhoods" data={scenarioData}>
                    {scenarioData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.zone === 'Sacrifice' ? '#EF4444' :
                          entry.zone === 'Safe' ? '#34D399' :
                          '#38BDF8'
                        }
                        opacity={0.8}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#EF4444' }} />
                <span>Sacrifice Zone</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#38BDF8' }} />
                <span>Middle Ground</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#34D399' }} />
                <span>Safe Haven</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel C: Policy Verdict */}
        <div className="policy-verdict" style={{ borderColor: verdict.color }}>
          <div className="verdict-header">
            <span className="verdict-icon" style={{ color: verdict.color }}>◈</span>
            <h3 style={{ color: verdict.color }}>{verdict.title}</h3>
          </div>
          <p className="verdict-text">{verdict.text}</p>
        </div>

        {/* Proceed Button */}
        <motion.button
          className="climate-proceed-btn"
          onClick={onComplete}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>PROCEED TO FINAL DECISION</span>
          <span className="btn-arrow">→</span>
        </motion.button>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />
    </motion.div>
  );
};


// ============================================
// LEVEL 6: DECISION SCREEN (CALL TO ACTION)
// ============================================
const DecisionScreen = ({ gameState }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (option) => {
    setSelectedOption(option);
    setTimeout(() => setShowResult(true), 800);
  };

  return (
    <motion.div
      className="level-container decision-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="decision-container">
        {!showResult ? (
          <>
            {/* Decision Prompt */}
            <motion.div
              className="decision-header"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="protocol-badge">
                <span className="badge-blink">◈</span>
                <span>PROTOCOL REQUIRED</span>
              </div>
              <h1 className="decision-title">SELECT INTERVENTION</h1>
              <p className="decision-subtitle">
                BASED ON FORENSIC EVIDENCE, CHOOSE COURSE OF ACTION
              </p>
            </motion.div>

            {/* Choice Cards */}
            <div className="choices-container">
              <motion.div
                className={`choice-card fail ${selectedOption === 'A' ? 'selected' : ''}`}
                onClick={() => handleChoice('A')}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="choice-letter">A</div>
                <div className="choice-title">MAINTAIN STATUS QUO</div>
                <div className="choice-description">
                  Continue current traffic policy
                  <br />
                  <span className="consequence">⚠ Toxicity persists at 0.90 risk</span>
                </div>
                <div className="choice-outcome fail-state">FAIL STATE</div>
              </motion.div>

              <motion.div
                className={`choice-card success ${selectedOption === 'B' ? 'selected' : ''}`}
                onClick={() => handleChoice('B')}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="choice-letter">B</div>
                <div className="choice-title">ENACT VARIABLE SPEED LIMITS</div>
                <div className="choice-description">
                  Implement 60 MPH minimum flow
                  <br />
                  <span className="consequence">✓ Reduces risk to 0.20</span>
                </div>
                <div className="choice-outcome win-state">WIN STATE</div>
              </motion.div>
            </div>

            {/* Evidence Reference */}
            {gameState.evidenceCaptured && (
              <motion.div
                className="evidence-reference"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="ref-icon">📋</span>
                <span>EVIDENCE ON FILE: BREACH EVENT CAPTURED</span>
              </motion.div>
            )}
          </>
        ) : (
          /* Result Screen */
          <motion.div
            className="result-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={`result-badge ${selectedOption === 'B' ? 'success' : 'fail'}`}>
              {selectedOption === 'B' ? (
                <>
                  <div className="result-icon">✓</div>
                  <div className="result-title">MISSION SUCCESS</div>
                  <div className="result-text">
                    Variable speed limits enacted. PM2.5 reduced by 60%.
                    <br />
                    Residential breach prevented.
                  </div>
                </>
              ) : (
                <>
                  <div className="result-icon">✕</div>
                  <div className="result-title">MISSION FAILED</div>
                  <div className="result-text">
                    Status quo maintained. Toxicity levels remain critical.
                    <br />
                    Residential exposure continues.
                  </div>
                </>
              )}
            </div>

            <div className="final-message">
              <p>INVESTIGATION COMPLETE</p>
              <p className="message-subtext">
                Thank you for participating in this forensic simulation.
                <br />
                Real policy change requires real action.
              </p>
            </div>

            <a
              href="/"
              className="return-btn"
            >
              RETURN TO MAIN SITE
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};


export default ForensicGame;
