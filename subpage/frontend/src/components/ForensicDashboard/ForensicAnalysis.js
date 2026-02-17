import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import InteractiveQuiz from './InteractiveQuiz';
import { useAppState } from '../../AppRouter';
import './ForensicAnalysis.css';

// ==================== FORENSIC LAYOUT COMPONENT ====================
const ForensicLayout = ({ children }) => {
  return (
    <div className="forensic-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;600;700&display=swap');

        .forensic-layout {
          background: #1a1a1a;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .forensic-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .forensic-grid::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(#333 1px, transparent 1px),
            linear-gradient(90deg, #333 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
        }

        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }

        .data-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #00FFFF;
          color: #00FFFF;
          letter-spacing: 0.1em;
          backdrop-filter: blur(4px);
        }

        .danger-tag {
          border-color: #FF0000;
          color: #FF0000;
        }

        .crosshair {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid #00FFFF;
          border-radius: 50%;
          pointer-events: none;
        }

        .crosshair::before,
        .crosshair::after {
          content: '';
          position: absolute;
          background: #00FFFF;
        }

        .crosshair::before {
          width: 2px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }

        .crosshair::after {
          height: 2px;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>

      <div className="forensic-grid" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// ==================== SITE CONTEXT COMPONENT ====================
const SiteContext = () => {
  const [activeImage, setActiveImage] = useState(0);

  // Google Earth satellite images - place in public/forensic-assets/
  const satelliteImages = [
    '/forensic-assets/bruckner-overview.jpg',
    '/forensic-assets/residential-zone.jpg',
    '/forensic-assets/highway-detail.jpg'
  ];

  const imageLabels = [
    'BRUCKNER EXPRESSWAY - OVERHEAD VIEW',
    'RESIDENTIAL PROXIMITY ANALYSIS',
    'POLLUTION CORRIDOR DETAIL'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mono-text text-xs text-cyan-400 mb-2 tracking-widest">
            SECTION 01 / GEOSPATIAL CONTEXT
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            THE SITE
          </h2>
          <div className="mono-text text-sm text-gray-400 space-y-1">
            <div>LOCATION: 40.8250°N, 73.8667°W</div>
            <div>SITE: BRUCKNER EXPRESSWAY / HUNTS POINT</div>
            <div>DISTANCE TO RESIDENTIAL: &lt; 15 METERS</div>
            <div className="text-red-500 mt-2">STATUS: CRITICAL EXPOSURE ZONE</div>
          </div>
        </motion.div>

        {/* Image Viewer with HUD Overlay */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-video bg-gray-900 border-2 border-gray-700"
          >
            {/* Satellite Image */}
            <img
              src={satelliteImages[activeImage]}
              alt={imageLabels[activeImage]}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a solid color if image fails to load
                e.target.style.display = 'none';
              }}
            />

            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner Brackets */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-400" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-400" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-400" />

              {/* Targeting Reticle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="crosshair" />
              </div>

              {/* Data Tags */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="data-tag">
                  {imageLabels[activeImage]}
                </div>
              </div>

              <div className="absolute bottom-8 left-8">
                <div className="data-tag danger-tag">
                  RESIDENTIAL STRUCTURES IDENTIFIED
                </div>
              </div>

              <div className="absolute bottom-8 right-8">
                <div className="mono-text text-xs text-cyan-400">
                  <div>SCALE: 1:2000</div>
                  <div>ALT: 400M</div>
                  <div>LAT: 40.8250°N</div>
                  <div>LON: 73.8667°W</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Navigation */}
          <div className="flex gap-4 mt-6 justify-center">
            {satelliteImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`px-4 py-2 mono-text text-xs border transition-all ${
                  activeImage === index
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                VIEW {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== BASELINE COMPARISON COMPONENT ====================
const BaselineComparison = ({ actualSpeed = 5, congestedPM25 = 26.25, optimizedSpeed = 30, optimizedPM25 = 10.50 }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mono-text text-xs text-cyan-400 mb-2 tracking-widest">
            SECTION 02 / BASELINE PARAMETERS
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            THE SETUP
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Establishing baseline conditions for comparative analysis. Two distinct traffic scenarios demonstrate the relationship between vehicle speed and particulate matter dispersion.
          </p>
        </motion.div>

        {/* Split View Comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* State A: Congested */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-2 border-red-500/30 bg-red-500/5 p-8"
          >
            <div className="absolute top-4 left-4 data-tag danger-tag">
              STATE A: CONGESTED
            </div>

            <div className="mt-12 space-y-6">
              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">TRAFFIC SPEED</div>
                <div className="mono-text text-6xl font-bold text-red-500">{actualSpeed} MPH</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">PM2.5 CONCENTRATION</div>
                <div className="mono-text text-4xl font-bold text-red-400">{congestedPM25} µg/m³</div>
                <div className="mono-text text-xs text-red-500 mt-1">↑ 98% ABOVE SAFE LIMIT</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">DISPERSION RADIUS</div>
                <div className="mono-text text-2xl font-bold text-red-400">0.75 (RESIDENTIAL BREACH)</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">TOXICITY SCORE</div>
                <div className="flex items-center gap-3">
                  <div className="mono-text text-3xl font-bold text-red-500">0.90</div>
                  <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* State B: Optimized */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-2 border-cyan-500/30 bg-cyan-500/5 p-8"
          >
            <div className="absolute top-4 left-4 data-tag">
              STATE B: OPTIMIZED
            </div>

            <div className="mt-12 space-y-6">
              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">TRAFFIC SPEED</div>
                <div className="mono-text text-6xl font-bold text-cyan-400">{optimizedSpeed} MPH</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">PM2.5 CONCENTRATION</div>
                <div className="mono-text text-4xl font-bold text-cyan-400">{optimizedPM25.toFixed(2)} µg/m³</div>
                <div className="mono-text text-xs text-cyan-400 mt-1">✓ WITHIN SAFE THRESHOLD</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">DISPERSION RADIUS</div>
                <div className="mono-text text-2xl font-bold text-cyan-400">0.30 (CONTAINED)</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-1">TOXICITY SCORE</div>
                <div className="flex items-center gap-3">
                  <div className="mono-text text-3xl font-bold text-cyan-400">0.20</div>
                  <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center"
        >
          <div className="inline-block border-2 border-yellow-500 bg-yellow-500/10 px-6 py-4">
            <div className="mono-text text-yellow-500 text-sm">
              HYPOTHESIS: REDUCED SPEED → INCREASED PARTICULATE ACCUMULATION → RESIDENTIAL EXPOSURE
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== SIMULATION VIEWER COMPONENT ====================
const SimulationViewer = ({ actualSpeed = 5 }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showBreachWarning, setShowBreachWarning] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Show breach warning at ~4 seconds
      if (video.currentTime >= 4 && video.currentTime <= 6) {
        setShowBreachWarning(true);
      } else {
        setShowBreachWarning(false);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-play when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Auto-play blocked, user interaction required
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mono-text text-xs text-red-500 mb-2 tracking-widest animate-pulse">
            SECTION 03 / SIMULATION EVIDENCE
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            THE EVENT
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Real-time particle dispersion simulation under congested traffic conditions. Red spheres represent PM2.5 particulate matter expansion from highway corridor into adjacent residential structures.
          </p>
        </motion.div>

        {/* Video Player with Overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-video bg-black border-2 border-red-500">
            <video
              ref={videoRef}
              className="w-full h-full"
              loop
              muted
              playsInline
            >
              <source src="/forensic-assets/ezgif.com-split.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Recording Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="mono-text text-xs text-red-500">
                  {isPlaying ? 'RECORDING' : 'PAUSED'}
                </span>
              </div>

              {/* Timestamp */}
              <div className="absolute top-4 right-4 data-tag danger-tag">
                {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
                {Math.floor(currentTime % 60).toString().padStart(2, '0')}:
                {Math.floor((currentTime % 1) * 100).toString().padStart(2, '0')}
              </div>

              {/* Breach Warning */}
              {showBreachWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="border-4 border-red-500 bg-red-500/20 px-12 py-6 backdrop-blur-sm">
                    <div className="mono-text text-3xl font-bold text-red-500 text-center animate-pulse">
                      ⚠ RESIDENTIAL BREACH DETECTED
                    </div>
                    <div className="mono-text text-sm text-red-400 text-center mt-2">
                      PM2.5 PARTICLES PENETRATING BUILDING ENVELOPE
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Measurement Grid */}
              <div className="absolute bottom-4 left-4 mono-text text-xs text-cyan-400 space-y-1">
                <div>SIMULATION MODE: {actualSpeed < 15 ? 'CONGESTED' : actualSpeed < 40 ? 'MODERATE' : 'OPTIMIZED'} ({actualSpeed} MPH)</div>
                <div>PARTICLE DENSITY: {actualSpeed < 15 ? 'HIGH' : actualSpeed < 40 ? 'MEDIUM' : 'LOW'}</div>
                <div>WIND SPEED: 2.1 M/S</div>
                <div>TEMPERATURE: 24°C</div>
                <div>HUMIDITY: 65%</div>
              </div>

              {/* Frame Counter */}
              <div className="absolute bottom-4 right-4 mono-text text-xs text-gray-500">
                FRAME: {Math.floor(currentTime * 30).toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }}
              className="px-6 py-2 mono-text text-sm border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'} SIMULATION
            </button>

            <button
              onClick={() => {
                videoRef.current.currentTime = 0;
              }}
              className="px-6 py-2 mono-text text-sm border border-gray-600 text-gray-400 hover:border-gray-400 transition-colors"
            >
              RESTART
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== DATA EVIDENCE COMPONENT ====================
const DataEvidence = ({ actualSpeed = 5, congestedPM25 = 26.25, optimizedSpeed = 30, optimizedPM25 = 10.50 }) => {
  const stateA = {
    speed: actualSpeed,
    pm25: congestedPM25,
    radius: 0.75,
    risk: 0.90,
    label: 'CONGESTED',
    color: 'red'
  };

  const stateB = {
    speed: optimizedSpeed,
    pm25: optimizedPM25,
    radius: 0.30,
    risk: 0.20,
    label: 'OPTIMIZED',
    color: 'cyan'
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mono-text text-xs text-cyan-400 mb-2 tracking-widest">
            SECTION 04 / FORENSIC ANALYSIS
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            THE VERDICT
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Quantitative analysis confirms direct correlation between traffic congestion and toxic particulate exposure in residential zones.
          </p>
        </motion.div>

        {/* Forensic Dashboard */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Card A: Congested */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-red-500 bg-red-500/5 p-8"
          >
            <div className="data-tag danger-tag mb-6">
              SCENARIO A: CONGESTED CONDITIONS
            </div>

            <div className="space-y-8">
              <div className="border-b border-red-500/30 pb-6">
                <div className="mono-text text-xs text-gray-500 mb-2">TRAFFIC VELOCITY</div>
                <div className="mono-text text-7xl font-bold text-red-500">{stateA.speed} MPH</div>
              </div>

              <div className="border-b border-red-500/30 pb-6">
                <div className="mono-text text-xs text-gray-500 mb-2">PM2.5 CONCENTRATION</div>
                <div className="mono-text text-5xl font-bold text-red-400">{stateA.pm25} µg/m³</div>
                <div className="mono-text text-xs text-red-500 mt-2 uppercase">⚠ Toxic Threshold</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-2">RISK ASSESSMENT</div>
                <div className="flex items-center gap-4">
                  <div className="mono-text text-4xl font-bold text-red-500">{stateA.risk}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stateA.risk * 100}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-red-500"
                      />
                    </div>
                    <div className="mono-text text-xs text-red-500 mt-1">CRITICAL EXPOSURE</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card B: Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-cyan-500 bg-cyan-500/5 p-8"
          >
            <div className="data-tag mb-6">
              SCENARIO B: OPTIMIZED CONDITIONS
            </div>

            <div className="space-y-8">
              <div className="border-b border-cyan-500/30 pb-6">
                <div className="mono-text text-xs text-gray-500 mb-2">TRAFFIC VELOCITY</div>
                <div className="mono-text text-7xl font-bold text-cyan-400">{stateB.speed} MPH</div>
              </div>

              <div className="border-b border-cyan-500/30 pb-6">
                <div className="mono-text text-xs text-gray-500 mb-2">PM2.5 CONCENTRATION</div>
                <div className="mono-text text-5xl font-bold text-cyan-400">{stateB.pm25} µg/m³</div>
                <div className="mono-text text-xs text-cyan-400 mt-2 uppercase">✓ Safe Threshold</div>
              </div>

              <div>
                <div className="mono-text text-xs text-gray-500 mb-2">RISK ASSESSMENT</div>
                <div className="flex items-center gap-4">
                  <div className="mono-text text-4xl font-bold text-cyan-400">{stateB.risk}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stateB.risk * 100}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-cyan-400"
                      />
                    </div>
                    <div className="mono-text text-xs text-cyan-400 mt-1">MINIMAL EXPOSURE</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparative Bar Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="border border-gray-700 p-8"
        >
          <div className="mono-text text-sm text-gray-400 mb-6">COMPARATIVE ANALYSIS</div>

          {/* PM2.5 Comparison */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="mono-text text-xs text-gray-500">PM2.5 CONCENTRATION (µg/m³)</span>
              <span className="mono-text text-xs text-red-500">+150% INCREASE</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="mono-text text-xs text-red-400">CONGESTED</span>
                  <span className="mono-text text-xs text-red-400">{stateA.pm25}</span>
                </div>
                <div className="h-8 bg-gray-800 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(stateA.pm25 / 30) * 100}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-red-500 rounded"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="mono-text text-xs text-cyan-400">OPTIMIZED</span>
                  <span className="mono-text text-xs text-cyan-400">{stateB.pm25}</span>
                </div>
                <div className="h-8 bg-gray-800 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(stateB.pm25 / 30) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-cyan-400 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score Comparison */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="mono-text text-xs text-gray-500">TOXICITY RISK SCORE</span>
              <span className="mono-text text-xs text-red-500">+350% INCREASE</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="mono-text text-xs text-red-400">CONGESTED</span>
                  <span className="mono-text text-xs text-red-400">{stateA.risk}</span>
                </div>
                <div className="h-8 bg-gray-800 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stateA.risk * 100}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-red-500 rounded"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="mono-text text-xs text-cyan-400">OPTIMIZED</span>
                  <span className="mono-text text-xs text-cyan-400">{stateB.risk}</span>
                </div>
                <div className="h-8 bg-gray-800 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stateB.risk * 100}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-cyan-400 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center"
        >
          <div className="inline-block border-2 border-red-500 bg-red-500/10 px-8 py-6">
            <div className="mono-text text-red-500 text-lg font-bold mb-2">
              CONCLUSION: CAUSAL LINK ESTABLISHED
            </div>
            <div className="mono-text text-sm text-gray-400">
              Traffic congestion at {actualSpeed} MPH results in {(congestedPM25 / optimizedPM25).toFixed(1)}x increase in PM2.5 exposure
            </div>
            <div className="mono-text text-sm text-gray-400">
              Residential breach confirmed at dispersion radius 0.75
            </div>
            <div className="mono-text text-xs text-red-400 mt-3">
              RECOMMENDATION: IMMEDIATE TRAFFIC FLOW OPTIMIZATION REQUIRED
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== MAIN FORENSIC ANALYSIS COMPONENT ====================
const ForensicAnalysis = () => {
  // Get shared state from context
  const { taxAmount, speed, simulationData } = useAppState();

  // Use dynamic values from context or defaults
  const actualSpeed = speed || 5; // Default to 5 MPH if not set
  const actualTax = taxAmount || 0;

  // Calculate PM2.5 based on simulation data
  const congestedPM25 = 26.25; // Baseline congested
  const optimizedPM25 = simulationData?.new_pm25_ug_m3 || 10.50;
  const optimizedSpeed = actualSpeed > 25 ? actualSpeed : 30;

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState({});
  const [showBaselineQuiz, setShowBaselineQuiz] = useState(false);
  const [showVideoQuiz, setShowVideoQuiz] = useState(false);
  const [showPolicyQuiz, setShowPolicyQuiz] = useState(false);

  const handleQuizAnswer = (correct, type) => {
    setQuizResults(prev => ({
      ...prev,
      [type]: correct
    }));
    setActiveQuiz(null);
  };

  const handleQuizSkip = () => {
    setActiveQuiz(null);
  };

  // Trigger quizzes based on scroll position
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && activeQuiz) {
        handleQuizSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeQuiz]);

  return (
    <ForensicLayout>
      {/* Interactive Quizzes */}
      <AnimatePresence>
        {activeQuiz && (
          <InteractiveQuiz
            type={activeQuiz}
            onAnswer={handleQuizAnswer}
            onSkip={handleQuizSkip}
          />
        )}
      </AnimatePresence>

      {/* Title Screen */}
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center px-6 max-w-5xl"
        >
          <div className="mono-text text-xs text-cyan-400 mb-4 tracking-widest">
            FORENSIC ANALYSIS / CASE FILE #BX-2026-001
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
            THE SOUTH BRONX
            <br />
            ACCUMULATION
          </h1>
          <div className="mono-text text-sm text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            A COMPUTATIONAL INVESTIGATION INTO TRAFFIC-INDUCED
            <br />
            PARTICULATE MATTER EXPOSURE IN RESIDENTIAL ZONES
          </div>

          {/* Presentation Hook */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-8 max-w-3xl mx-auto"
          >
            <div className="border-2 border-yellow-500 bg-yellow-500/10 p-6">
              <div className="text-lg text-yellow-500 font-semibold mb-3 italic">
                "The algorithmic blackbox usually works against the Bronx."
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                I've turned that blackbox inside out to create a <strong className="text-cyan-400">Community Utility Tool</strong>.
                This isn't just a map; it's a <strong className="text-red-400">Forensic Proof</strong> that proves why our current
                traffic congestion is a regulatory choice to pollute—and exactly what speeds and taxes we need to fix it.
              </div>
            </div>
          </motion.div>

          <div className="data-tag danger-tag inline-block mb-4">
            CLASSIFIED: PUBLIC HEALTH CRISIS
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8"
          >
            <div className="mono-text text-xs text-gray-600">
              SCROLL TO BEGIN ANALYSIS ↓
            </div>
            <div className="mono-text text-xs text-yellow-500 mt-2">
              [Interactive questions will test your understanding]
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Content Sections with Quiz Triggers */}
      <SiteContext />

      <div onMouseEnter={() => !quizResults.magnitude && setShowBaselineQuiz(true)}>
        <BaselineComparison
          actualSpeed={actualSpeed}
          congestedPM25={congestedPM25}
          optimizedSpeed={optimizedSpeed}
          optimizedPM25={optimizedPM25}
        />
        {showBaselineQuiz && !activeQuiz && !quizResults.magnitude && (
          <div className="relative">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveQuiz('magnitude')}
              className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-cyan-400 text-black mono-text text-sm font-bold border-2 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-all shadow-lg"
            >
              ⚡ TEST YOUR UNDERSTANDING (Question 2/3)
            </motion.button>
          </div>
        )}
      </div>

      <div>
        <SimulationViewer actualSpeed={actualSpeed} />
        {/* Trigger Causality Quiz after video section */}
        {!activeQuiz && !quizResults.causality && (
          <div className="relative -mt-20">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveQuiz('causality')}
              className="mx-auto block px-8 py-4 bg-red-500 text-white mono-text text-sm font-bold border-2 border-red-500 hover:bg-black hover:text-red-500 transition-all shadow-lg"
            >
              ⚠️ CRITICAL: TEST YOUR UNDERSTANDING (Question 1/3)
            </motion.button>
          </div>
        )}
      </div>

      <DataEvidence
        actualSpeed={actualSpeed}
        congestedPM25={congestedPM25}
        optimizedSpeed={optimizedSpeed}
        optimizedPM25={optimizedPM25}
      />

      {/* Policy Quiz Trigger */}
      {!activeQuiz && !quizResults.policy && (
        <section className="relative py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mono-text text-sm text-gray-400 mb-4">
                FINAL VALIDATION CHECKPOINT
              </div>
              <h3 className="text-3xl font-bold mb-6">
                Did the Evidence Convince You?
              </h3>
              <p className="text-gray-400 mb-8">
                You've seen the site, the data, and the simulation. Now prove you understand
                the solution by answering the final policy question.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveQuiz('policy')}
                className="px-10 py-4 bg-cyan-400 text-black mono-text text-sm font-bold border-2 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-all shadow-lg"
              >
                🎯 FINAL TEST: THE POLICY QUESTION (3/3)
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quiz Results Summary */}
      {Object.keys(quizResults).length === 3 && (
        <section className="relative py-20 bg-black">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border-2 border-cyan-400 bg-cyan-400/5 p-8"
            >
              <div className="text-center mb-8">
                <div className="mono-text text-sm text-cyan-400 mb-2">
                  FORENSIC NARRATIVE VALIDATION COMPLETE
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Your Understanding: {Object.values(quizResults).filter(Boolean).length}/3
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 border-2 ${quizResults.causality ? 'border-cyan-400 bg-cyan-400/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="mono-text text-xs text-gray-400 mb-1">CAUSALITY TEST</div>
                  <div className={`font-bold ${quizResults.causality ? 'text-cyan-400' : 'text-red-400'}`}>
                    {quizResults.causality ? '✓ PASSED' : '✗ REVIEW'}
                  </div>
                </div>
                <div className={`p-4 border-2 ${quizResults.magnitude ? 'border-cyan-400 bg-cyan-400/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="mono-text text-xs text-gray-400 mb-1">MAGNITUDE TEST</div>
                  <div className={`font-bold ${quizResults.magnitude ? 'text-cyan-400' : 'text-red-400'}`}>
                    {quizResults.magnitude ? '✓ PASSED' : '✗ REVIEW'}
                  </div>
                </div>
                <div className={`p-4 border-2 ${quizResults.policy ? 'border-cyan-400 bg-cyan-400/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="mono-text text-xs text-gray-400 mb-1">POLICY TEST</div>
                  <div className={`font-bold ${quizResults.policy ? 'text-cyan-400' : 'text-red-400'}`}>
                    {quizResults.policy ? '✓ PASSED' : '✗ REVIEW'}
                  </div>
                </div>
              </div>

              <div className="text-center mono-text text-sm text-gray-400">
                {Object.values(quizResults).filter(Boolean).length === 3 ? (
                  <div>
                    <div className="text-cyan-400 font-bold mb-2">🎉 PERFECT SCORE</div>
                    <div>Goal achieved: Visual correlation between "Traffic Stagnation" and "Vertical Pollution Encroachment" understood by viewer within 15 seconds.</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-yellow-500 font-bold mb-2">⚠️ REVIEW RECOMMENDED</div>
                    <div>Scroll back up to review sections where evidence wasn't clear. The visual links should be intuitive.</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Game Mode CTA */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black border-t border-cyan-400/20">
        <motion.div
          className="text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mono-text text-xs text-cyan-400 mb-4 tracking-widest">
            NEXT LEVEL
          </div>
          <h2 className="text-5xl font-bold mb-6 text-white">
            Experience the <span className="text-green-400">Investigation</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            You've seen the evidence. Now step into a fully interactive forensic investigation.
            <br />
            Control the simulation. Capture the breach. Make the decision.
          </p>

          <a
            href="/forensic-game"
            className="inline-block"
          >
            <button className="group relative px-12 py-5 bg-transparent border-3 border-green-400 text-green-400 font-bold text-lg tracking-widest hover:bg-green-400/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] hover:scale-105">
              <span className="relative z-10 flex items-center gap-3">
                🎮 ENTER GAME MODE
              </span>
              <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/5 transition-all duration-300"></div>
            </button>
          </a>

          <div className="mt-8 mono-text text-xs text-gray-600">
            <div className="flex items-center justify-center gap-8">
              <div>4 LEVELS</div>
              <div>•</div>
              <div>3-4 MIN PLAYTIME</div>
              <div>•</div>
              <div>INTERACTIVE INVESTIGATION</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Credits */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-black border-t border-gray-800">
        <div className="text-center px-6">
          <div className="mono-text text-xs text-gray-600 space-y-2">
            <div>FORENSIC ANALYSIS CONDUCTED BY</div>
            <div>URBAN FUTURES LEAP / COMPUTATIONAL DESIGN LAB</div>
            <div>DATA SOURCES: NYC DOT, EPA AQS, NOAA</div>
            <div className="pt-4">© 2026 ALL RIGHTS RESERVED</div>
          </div>
        </div>
      </section>
    </ForensicLayout>
  );
};

export default ForensicAnalysis;
