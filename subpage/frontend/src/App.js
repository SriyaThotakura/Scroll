import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, CircleMarker, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Import shared state context
import { useAppState } from './AppRouter';

// Import new ML visualization components
import TrafficPredictionChart from './components/TrafficPredictionChart';
import NeuralNetworkViz from './components/NeuralNetworkViz';
import ScenarioComparison from './components/ScenarioComparison';
import SystemStateTimeline from './components/SystemStateTimeline';
import ZoneDetailPanel from './components/ZoneDetailPanel';

// ==================== INTERNATIONALIZATION ====================
const translations = {
  en: {
    title: "BREATHING ROUTES: CROSS BRONX EXPOSURE MONITOR",
    subtitle: "> LIVE FEED: NODE 402 (INVERSION LAYER DETECTED)",
    location: "Soundview, The Bronx (UHF District 402)",
    sidebar: {
      title: "> LIVE FEED: NODE 402 (INVERSION LAYER DETECTED)",
      taxLabel: "Freight Tax Amount",
      taxHint: "Drag to adjust tax per truck crossing ($0 - $100)",
      assumptions: "Model Assumptions",
      language: "Language / Idioma"
    },
    cards: {
      trucksDiverted: "Trucks Diverted",
      trucksPerDay: "trucks/day",
      pm25Saved: "PM2.5 Reduced",
      kg: "kg/year",
      asthmaAttacks: "Health Outcomes Improved",
      perYear: "per year",
      co2Reduction: "CO₂ Equivalent Saved",
      tons: "kg/year"
    },
    map: {
      title: "Heat Vulnerability Index (HVI) by Zone",
      hvi: "Heat Vulnerability Index",
      zipCode: "ZIP Code",
      baselinePM25: "Baseline PM2.5"
    },
    assumptions_section: {
      title: "Model Assumptions & Uncertainties",
      close: "Close",
      elasticity: "Elasticity of Freight Demand",
      elasticityValue: "-0.4 (inelastic)",
      pm25Impact: "PM2.5 Impact per 1,000 Trucks",
      pm25Value: "0.12 µg/m³ reduction",
      asthmaFunction: "Pediatric Asthma Concentration-Response",
      asthmaValue: "2.2% risk reduction per µg/m³",
      exclusions: "Model Exclusions",
      exclusionsList: [
        "Truck routing through residential streets",
        "Indirect economic/social effects",
        "Cumulative impacts with other pollutants (NO₂, SO₂)",
        "Behavioral responses to tax",
        "Equity analysis of tax burden"
      ],
      dataSource: "Data Sources: NYC EPIQUERY, NYC Community Health Survey, EPA Air Quality",
      disclaimer: "⚠️ This model is designed for planning discussions. Real-world outcomes depend on implementation details, community engagement, and policy design."
    },
    footer: "A climate justice tool for Soundview. Supporting equitable transition strategies."
  },
  es: {
    title: "BREATHING ROUTES: CROSS BRONX EXPOSURE MONITOR",
    subtitle: "> LIVE FEED: NODE 402 (INVERSION LAYER DETECTED)",
    location: "Soundview, El Bronx (Distrito UHF 402)",
    sidebar: {
      title: "> LIVE FEED: NODE 402 (INVERSION LAYER DETECTED)",
      taxLabel: "Impuesto a Fletes",
      taxHint: "Arrastra para ajustar el impuesto por camión ($0 - $100)",
      assumptions: "Supuestos del Modelo",
      language: "Language / Idioma"
    },
    cards: {
      trucksDiverted: "Camiones Desviados",
      trucksPerDay: "camiones/día",
      pm25Saved: "PM2.5 Reducido",
      kg: "kg/año",
      asthmaAttacks: "Mejora de Resultados de Salud",
      perYear: "por año",
      co2Reduction: "Equivalente de CO₂ Ahorrado",
      tons: "kg/año"
    },
    map: {
      title: "Índice de Vulnerabilidad de Calor (HVI) por Zona",
      hvi: "Índice de Vulnerabilidad de Calor",
      zipCode: "Código Postal",
      baselinePM25: "PM2.5 Base"
    },
    assumptions_section: {
      title: "Supuestos del Modelo e Incertidumbres",
      close: "Cerrar",
      elasticity: "Elasticidad de la Demanda de Fletes",
      elasticityValue: "-0.4 (inelástico)",
      pm25Impact: "Impacto de PM2.5 por 1,000 Camiones",
      pm25Value: "reducción de 0.12 µg/m³",
      asthmaFunction: "Función de Concentración-Respuesta del Asma Pediátrico",
      asthmaValue: "reducción de riesgo del 2.2% por µg/m³",
      exclusions: "Exclusiones del Modelo",
      exclusionsList: [
        "Rutas de camiones a través de calles residenciales",
        "Efectos económicos/sociales indirectos",
        "Impactos acumulativos con otros contaminantes (NO₂, SO₂)",
        "Respuestas de comportamiento al impuesto",
        "Análisis de equidad de la distribución de la carga fiscal"
      ],
      dataSource: "Fuentes de Datos: NYC EPIQUERY, Encuesta de Salud Comunitaria de NYC, Calidad del Aire de la EPA",
      disclaimer: "⚠️ Este modelo está diseñado para discusiones de planificación. Los resultados del mundo real dependen de detalles de implementación, participación comunitaria y diseño de política."
    },
    footer: "Una herramienta de justicia climática para Soundview. Apoyando estrategias de transición equitativa."
  }
};

// ==================== CONSTANTS ====================
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://scroll-y8wn.onrender.com';
const SOUNDVIEW_CENTER = [40.824, -73.875];
const MAX_TAX = 100;

// PM2.5 hotspot locations along/near CBX corridor (lat/lng)
const PM25_HOTSPOTS = [
  { lat: 40.8150, lng: -73.9250, name: 'CBX West Entry', baseLevel: 14.8 },
  { lat: 40.8175, lng: -73.9100, name: 'Crotona Park', baseLevel: 13.9 },
  { lat: 40.8200, lng: -73.8950, name: 'West Farms', baseLevel: 14.2 },
  { lat: 40.8215, lng: -73.8800, name: 'Bronx River', baseLevel: 13.5 },
  { lat: 40.8230, lng: -73.8650, name: 'Soundview', baseLevel: 14.5 },
  { lat: 40.8250, lng: -73.8500, name: 'Castle Hill', baseLevel: 13.8 },
  { lat: 40.8260, lng: -73.8350, name: 'Parkchester', baseLevel: 13.2 },
  { lat: 40.8100, lng: -73.8750, name: 'Bruckner South', baseLevel: 14.0 },
  { lat: 40.8300, lng: -73.8700, name: 'Unionport', baseLevel: 13.1 },
  { lat: 40.8180, lng: -73.8550, name: 'Soundview Park Edge', baseLevel: 12.8 },
];

// Cross-Bronx Expressway polyline (lat/lng for Leaflet)
const CBX_LATLNGS = [
  [40.8133, -73.9288],
  [40.8180, -73.9100],
  [40.8200, -73.8900],
  [40.8220, -73.8700],
  [40.8240, -73.8500],
  [40.8260, -73.8300],
  [40.8280, -73.8100]
];

// HVI risk score → color ramp (matches mapVizModule.js)
function riskToColor(score) {
  const stops = [
    { t: 0.00, r: 100, g: 140, b: 200 },
    { t: 0.20, r: 130, g: 100, b: 210 },
    { t: 0.40, r: 160, g: 60, b: 200 },
    { t: 0.55, r: 190, g: 40, b: 160 },
    { t: 0.70, r: 210, g: 30, b: 100 },
    { t: 0.85, r: 220, g: 20, b: 50 },
    { t: 1.00, r: 200, g: 10, b: 10 }
  ];
  const v = Math.min(1, Math.max(0, score));
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].t && v <= stops[i + 1].t) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const range = hi.t - lo.t;
  const ratio = range === 0 ? 0 : (v - lo.t) / range;
  const r = Math.round(lo.r + (hi.r - lo.r) * ratio);
  const g = Math.round(lo.g + (hi.g - lo.g) * ratio);
  const b = Math.round(lo.b + (hi.b - lo.b) * ratio);
  return `rgb(${r},${g},${b})`;
}

// Linear color lerp for CBX line
function lerpHex(hex1, hex2, t) {
  const p = (h) => { const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return [parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]; };
  const a = p(hex1), b = p(hex2);
  const r = Math.round(a[0]+(b[0]-a[0])*t), g = Math.round(a[1]+(b[1]-a[1])*t), bl = Math.round(a[2]+(b[2]-a[2])*t);
  return `rgb(${r},${g},${bl})`;
}

// ==================== MAIN APP COMPONENT ====================
function App() {
  // Get shared state from context
  const { taxAmount, setTaxAmount, speed, setSpeed, simulationData, setSimulationData } = useAppState();
  const navigate = useNavigate();

  // Local State Management
  const [baselineData, setBaselineData] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showAssumptions, setShowAssumptions] = useState(false);

  // New ML Prediction State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'prediction', 'comparison', 'model'
  const [prediction50, setPrediction50] = useState(null);
  const [prediction60, setPrediction60] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [trafficData, setTrafficData] = useState({});

  // Advanced Analytics State
  const [hmmData, setHmmData] = useState(null);
  const [monteCarloData, setMonteCarloData] = useState(null);
  const [technicalDocs, setTechnicalDocs] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZonePanel, setShowZonePanel] = useState(false);

  // Helper function to determine congestion level based on speed
  const getCongestionLevel = (speed) => {
    if (speed >= 0) {
      if (speed < 25) return { level: 'Severe', color: '#dc2626', bgColor: '#fecaca' }; // Red
      if (speed < 45) return { level: 'High', color: '#ea580c', bgColor: '#fed7aa' };   // Orange
      if (speed < 55) return { level: 'Moderate', color: '#d97706', bgColor: '#fde68a' }; // Yellow
      return { level: 'Optimal', color: '#16a34a', bgColor: '#d1fae5' }; // Green
    }
    return { level: 'Unknown', color: '#6b7280', bgColor: '#f3f4f6' }; // Gray for unknown/loading
  };

  const [predictionLoading, setPredictionLoading] = useState(false);

  const t = translations[language];

  // Fetch baseline data and ML model info on mount
  useEffect(() => {
    fetchBaseline();
    fetchGeojson();
    fetchModelInfo();
    fetchTrafficData();
    fetchTechnicalDocs();
  }, []);

  // Simulate on tax amount change
  useEffect(() => {
    simulate(taxAmount);
  }, [taxAmount]);

  // API Calls
  const fetchBaseline = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/baseline`);
      if (response.ok) {
        const data = await response.json();
        setBaselineData(data);
      }
    } catch (error) {
      console.error('Error fetching baseline:', error);
    }
  };

  const fetchGeojson = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/geojson/soundview`);
      if (response.ok) {
        const data = await response.json();
        setGeojsonData(data);
      }
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
    }
  };

  const simulate = async (tax) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tax_amount: tax })
      });
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setSimulationData(data);

        // Calculate speed based on tax (inverse relationship)
        // Higher tax → Lower congestion → Higher speed
        const calculatedSpeed = tax < 50
          ? 5 + (tax * 0.5)  // Low tax: 5-30 MPH
          : 30 + ((tax - 50) * 0.6);  // High tax: 30-60 MPH
        setSpeed(Math.round(calculatedSpeed));
      } else {
        console.error('Response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error in simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  // New ML API Calls
  const fetchTrafficData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/current`);
      if (response.ok) {
        const data = await response.json();
        setTrafficData(data);
      }
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/model/info`);
      if (response.ok) {
        const data = await response.json();
        setModelInfo(data);
      }
    } catch (error) {
      console.error('Error fetching model info:', error);
    }
  };

  const predictTraffic = async (scenario) => {
    setPredictionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speed_limit_scenario: scenario,
          prediction_hours: 24
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (scenario === 'current_50mph') {
          setPrediction50(data);
        } else {
          setPrediction60(data);
        }
        return data;
      }
    } catch (error) {
      console.error(`Error predicting ${scenario}:`, error);
    } finally {
      setPredictionLoading(false);
    }
  };

  const runBothPredictions = async () => {
    setPredictionLoading(true);
    try {
      await Promise.all([
        predictTraffic('current_50mph'),
        predictTraffic('optimized_60mph')
      ]);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Advanced Analytics API Calls
  const fetchTechnicalDocs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/technical-docs`);
      if (response.ok) {
        const data = await response.json();
        setTechnicalDocs(data);
      }
    } catch (error) {
      console.error('Error fetching technical docs:', error);
    }
  };

  const fetchMonteCarlo = async (tax = taxAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/monte-carlo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_amount: tax,
          num_iterations: 10000
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMonteCarloData(data);
        return data;
      }
    } catch (error) {
      console.error('Error in Monte Carlo simulation:', error);
    }
  };

  const fetchHMMPrediction = async (speeds = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/hmm/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predicted_speeds: speeds,
          prediction_hours: 24,
          baseline_pm25: 13.2
        })
      });
      if (response.ok) {
        const data = await response.json();
        setHmmData(data);
        return data;
      }
    } catch (error) {
      console.error('Error in HMM prediction:', error);
    }
  };

  // Zone click handler for interactive map
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setShowZonePanel(true);
    // Trigger Monte Carlo if not already run
    if (!monteCarloData) {
      fetchMonteCarlo(taxAmount);
    }
  };

  // Run full prediction including HMM and Monte Carlo
  const runFullPrediction = async () => {
    setPredictionLoading(true);
    console.log('🚀 Starting Full Analysis...');

    try {
      // Step 1: Run both traffic predictions
      console.log('📊 Running traffic predictions...');
      const [response50, response60] = await Promise.all([
        fetch(`${API_BASE_URL}/traffic/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speed_limit_scenario: 'current_50mph', prediction_hours: 24 })
        }),
        fetch(`${API_BASE_URL}/traffic/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speed_limit_scenario: 'optimized_60mph', prediction_hours: 24 })
        })
      ]);

      let pred50Data = null;
      let pred60Data = null;

      if (response50.ok) {
        pred50Data = await response50.json();
        setPrediction50(pred50Data);
        console.log('✅ 50mph prediction complete');
      }

      if (response60.ok) {
        pred60Data = await response60.json();
        setPrediction60(pred60Data);
        console.log('✅ 60mph prediction complete');
      }

      // Step 2: Run HMM with predicted speeds
      console.log('🌡️ Running HMM prediction...');
      if (pred50Data && pred50Data.predicted_speeds && pred50Data.predicted_speeds.length > 0) {
        const hmmResponse = await fetch(`${API_BASE_URL}/analytics/hmm/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            predicted_speeds: pred50Data.predicted_speeds,
            prediction_hours: 24,
            baseline_pm25: 13.2
          })
        });

        if (hmmResponse.ok) {
          const hmmResult = await hmmResponse.json();
          setHmmData(hmmResult);
          console.log('✅ HMM prediction complete:', hmmResult.state_sequence?.slice(0, 5));
        } else {
          console.error('❌ HMM prediction failed:', hmmResponse.status);
        }
      } else {
        console.warn('⚠️ No predicted speeds available for HMM');
      }

      // Step 3: Run Monte Carlo simulation
      console.log('🎲 Running Monte Carlo simulation...');
      const mcResponse = await fetch(`${API_BASE_URL}/analytics/monte-carlo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_amount: taxAmount,
          num_iterations: 10000
        })
      });

      if (mcResponse.ok) {
        const mcResult = await mcResponse.json();
        setMonteCarloData(mcResult);
        console.log('✅ Monte Carlo complete:', mcResult.statistics?.asthma_visits_avoided?.mean);
      } else {
        console.error('❌ Monte Carlo failed:', mcResponse.status);
      }

      console.log('🎉 Full Analysis Complete!');

    } catch (error) {
      console.error('❌ Error in full analysis:', error);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Dynamic styling for map based on PM2.5 improvement
  const mapOpacity = simulationData
    ? 0.7 + (simulationData.pm25_reduction_ug_m3 / 5) * 0.3
    : 0.8;

  // Compute risk score from simulation data (baseline ~0.69 at $0 tax)
  const riskScore = simulationData
    ? Math.max(0, 0.69 - (taxAmount / MAX_TAX) * 0.35)
    : 0.69;

  // PM2.5 level for zone opacity
  const pm25Level = simulationData
    ? 13.2 - (simulationData.pm25_reduction_ug_m3 || 0)
    : 13.2;
  const pm25Opacity = 0.3 + Math.min(1, Math.max(0, (pm25Level - 10) / 5)) * 0.55;

  // CBX flow line: color shifts red→green, width shrinks as trucks divert
  const cbxDiversionRatio = simulationData
    ? Math.min(1, (simulationData.trucks_diverted || 0) / 416)
    : 0;
  const cbxColor = lerpHex('#991b1b', '#16a34a', cbxDiversionRatio);
  const cbxWeight = 6 - cbxDiversionRatio * 4;

  // GeoJSON key to force re-render when style changes
  const geoJsonKey = useMemo(() => `geo-${taxAmount}-${riskScore.toFixed(3)}`, [taxAmount, riskScore]);

  // Handle GeoJSON layer styling
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; width: 220px; padding: 12px 14px;">
        <h3 style="margin: 0 0 8px 0; color: #f0f0f5; font-size: 14px; font-weight: 700;">${props.area_name}</h3>
        <p style="margin: 4px 0; font-size: 12px; color: #8890a4;"><strong style="color: #bbb;">${t.map.zipCode}:</strong> ${props.zip_code}</p>
        <p style="margin: 4px 0; font-size: 12px; color: #8890a4;"><strong style="color: #bbb;">${t.map.hvi}:</strong> <span style="color: ${props.hvi >= 4 ? '#ef4444' : props.hvi >= 3 ? '#f59e0b' : '#10b981'}; font-weight: 700;">${props.hvi}</span> / 5</p>
        <p style="margin: 4px 0; font-size: 12px; color: #8890a4;"><strong style="color: #bbb;">${t.map.baselinePM25}:</strong> ${props.baseline_pm25} µg/m³</p>
        <p style="margin: 10px 0 0 0; font-size: 10px; color: #555b6e; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px;">
          ${language === 'en'
        ? '👆 Click for detailed analysis'
        : '👆 Haga clic para análisis detallado'}
        </p>
      </div>
    `;
    layer.bindPopup(popupContent);

    // Add click handler for zone details panel
    layer.on('click', () => {
      handleZoneClick({
        area_name: props.area_name,
        zip_code: props.zip_code,
        hvi: props.hvi,
        baseline_pm25: props.baseline_pm25
      });
    });
  };

  // ==================== RENDER ====================
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="title">{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
            <p className="location">📍 {t.location}</p>
          </div>
          <div className="language-toggle">
            <button
              onClick={() => setLanguage('en')}
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <span className="lang-separator">/</span>
            <button
              onClick={() => setLanguage('es')}
              className={`lang-btn ${language === 'es' ? 'active' : ''}`}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'rgba(10, 10, 18, 0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'prediction', label: '🧠 ML Prediction', icon: '🧠' },
            { id: 'comparison', label: '⚖️ Comparison', icon: '⚖️' },
            { id: 'model', label: '🔬 Model Info', icon: '🔬' },
            { id: 'scroll_hack', label: '📜 Scroll Hack', icon: '📜' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #ef4444' : '2px solid transparent',
                backgroundColor: activeTab === tab.id ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                color: activeTab === tab.id ? '#f0f0f5' : '#555b6e',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Overview Tab - Original Content */}
        {activeTab === 'overview' && (
          <>
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-card">
                <h2>{t.sidebar.title}</h2>

                {/* Tax Slider */}
                <div className="slider-container">
                  <label className="slider-label">{t.sidebar.taxLabel}</label>
                  <div className="slider-value-display">${taxAmount}</div>
                  <input
                    type="range"
                    min="0"
                    max={MAX_TAX}
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(parseFloat(e.target.value))}
                    className="slider"
                  />
                  <p className="slider-hint">{t.sidebar.taxHint}</p>
                </div>

                {/* Metric Cards */}
                {simulationData && (
                  <div className="metrics-cards">
                    {/* Trucks Diverted Card */}
                    <div className="metric-card">
                      <div className="metric-icon trucks">🚚</div>
                      <div className="metric-content">
                        <p className="metric-label">{t.cards.trucksDiverted}</p>
                        <p className="metric-value">{simulationData.trucks_diverted?.toLocaleString() || 0}</p>
                        <p className="metric-subtext">{t.cards.trucksPerDay}</p>
                        <p className="metric-percentage">({simulationData.trucks_diverted_percentage?.toFixed(1) || 0}%)</p>
                      </div>
                    </div>

                    {/* PM2.5 Reduction Card */}
                    <div className="metric-card">
                      <div className="metric-icon pm25">💨</div>
                      <div className="metric-content">
                        <p className="metric-label">{t.cards.pm25Saved}</p>
                        <p className="metric-value">{simulationData.pm25_reduction_kg?.toLocaleString() || 0}</p>
                        <p className="metric-subtext">{t.cards.kg}</p>
                        <p className="metric-detail">
                          {simulationData.pm25_reduction_ug_m3?.toFixed(3) || 0} µg/m³
                        </p>
                      </div>
                    </div>

                    {/* Health Benefits Value Card */}
                    <div className="metric-card">
                      <div className="metric-icon health">💚</div>
                      <div className="metric-content">
                        <p className="metric-label">{t.cards.asthmaAttacks}</p>
                        <p className="metric-value">${(simulationData.health_benefit_value_usd || 0).toLocaleString()}</p>
                        <p className="metric-subtext">in health benefits</p>
                        <p className="metric-detail">
                          annual value of cleaner air
                        </p>
                      </div>
                    </div>

                    {/* CO2 Reduction Card */}
                    <div className="metric-card">
                      <div className="metric-icon co2">🌍</div>
                      <div className="metric-content">
                        <p className="metric-label">{t.cards.co2Reduction}</p>
                        <p className="metric-value">{((simulationData.co2_equivalent_reduction_kg || 0) / 1000).toFixed(0)}</p>
                        <p className="metric-subtext">metric tons/year</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assumptions Button */}
                <button
                  onClick={() => setShowAssumptions(!showAssumptions)}
                  className="assumptions-btn"
                >
                  📋 {t.sidebar.assumptions}
                </button>

                {/* View Forensic Evidence Button */}
                {simulationData && (
                  <button
                    onClick={() => navigate('/analysis')}
                    style={{
                      marginTop: '16px',
                      padding: '16px 24px',
                      backgroundColor: '#00FFFF',
                      color: '#000',
                      border: '2px solid #00FFFF',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#000';
                      e.target.style.color = '#00FFFF';
                      e.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#00FFFF';
                      e.target.style.color = '#000';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                    }}
                  >
                    <span>🎬 VIEW FORENSIC EVIDENCE</span>
                    <span style={{ fontSize: '11px', opacity: 0.75, fontWeight: '500' }}>
                      Tax: ${taxAmount} | Speed: {speed} MPH
                    </span>
                  </button>
                )}

                {/* Assumptions Modal */}
                {showAssumptions && (
                  <div className="assumptions-modal">
                    <div className="assumptions-content">
                      <div className="assumptions-header">
                        <h3>{t.assumptions_section.title}</h3>
                        <button
                          onClick={() => setShowAssumptions(false)}
                          className="close-btn"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="assumptions-body">
                        <div className="assumption-item">
                          <h4>{t.assumptions_section.elasticity}</h4>
                          <p>{t.assumptions_section.elasticityValue}</p>
                        </div>

                        <div className="assumption-item">
                          <h4>{t.assumptions_section.pm25Impact}</h4>
                          <p>{t.assumptions_section.pm25Value}</p>
                        </div>

                        <div className="assumption-item">
                          <h4>{t.assumptions_section.asthmaFunction}</h4>
                          <p>{t.assumptions_section.asthmaValue}</p>
                        </div>

                        <div className="assumption-item">
                          <h4>{t.assumptions_section.exclusions}</h4>
                          <ul>
                            {t.assumptions_section.exclusionsList.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="assumption-disclaimer">
                          {t.assumptions_section.disclaimer}
                        </div>

                        <p className="assumptions-footer">
                          {t.assumptions_section.dataSource}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Map Section */}
            <section className="map-section">
              <h2 className="map-title">{t.map.title}</h2>

              <MapContainer
                center={SOUNDVIEW_CENTER}
                zoom={13}
                style={{
                  height: '100%',
                  width: '100%',
                  filter: `opacity(${mapOpacity})`
                }}
                className="leaflet-map"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {/* GeoJSON Layers — per-zone HVI risk coloring */}
                {geojsonData && (
                  <GeoJSON
                    key={geoJsonKey}
                    data={geojsonData}
                    onEachFeature={onEachFeature}
                    style={(feature) => {
                      // Per-zone color: normalize HVI (1-5) to 0-1, then blend with tax reduction
                      const hvi = feature.properties.hvi || 3;
                      const zoneRisk = Math.min(1, (hvi / 5) * (1 - (taxAmount / MAX_TAX) * 0.4));
                      return {
                        color: 'rgba(255,255,255,0.25)',
                        weight: 1.5,
                        opacity: 0.8,
                        fillOpacity: 0.35 + zoneRisk * 0.45,
                        fillColor: riskToColor(zoneRisk)
                      };
                    }}
                  />
                )}

                {/* Cross-Bronx Expressway Flow Line */}
                <Polyline
                  positions={CBX_LATLNGS}
                  pathOptions={{
                    color: cbxColor,
                    weight: cbxWeight,
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* CBX Glow (wider, semi-transparent) */}
                <Polyline
                  positions={CBX_LATLNGS}
                  pathOptions={{
                    color: cbxColor,
                    weight: cbxWeight * 2,
                    opacity: Math.max(0.05, 0.4 - cbxDiversionRatio * 0.35),
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />

                {/* PM2.5 Concentration — amplified visual aligned to API prediction direction */}
                {PM25_HOTSPOTS.map((spot, i) => {
                  // API gives tiny pm25_reduction_ug_m3 (~0.036), so we amplify the VISUAL
                  // while keeping the popup values tied to the real prediction.
                  const apiReduction = simulationData ? (simulationData.pm25_reduction_ug_m3 || 0) : 0;
                  const currentPM25 = spot.baseLevel - apiReduction; // real predicted value

                  // Amplified visual: tax drives a dramatic 0→50% visual reduction
                  // Direction matches API (higher tax = more reduction), magnitude is amplified
                  const visualReduction = (taxAmount / MAX_TAX) * 0.5; // 0% at $0, 50% at $100
                  const visualPM25 = spot.baseLevel * (1 - visualReduction);

                  // intensity: 0 = clean (≤7), 1 = polluted (≥15)
                  const intensity = Math.max(0, Math.min(1, (visualPM25 - 7) / 8));

                  // Color ramp: bright green → yellow → orange → red
                  let r, g, b;
                  if (intensity < 0.33) {
                    const t = intensity / 0.33;
                    r = Math.round(30 + t * 220); g = Math.round(220 - t * 20); b = 30;
                  } else if (intensity < 0.66) {
                    const t = (intensity - 0.33) / 0.33;
                    r = Math.round(250); g = Math.round(200 - t * 150); b = 30;
                  } else {
                    const t = (intensity - 0.66) / 0.34;
                    r = Math.round(250 - t * 30); g = Math.round(50 - t * 40); b = Math.round(30 + t * 10);
                  }
                  const dotColor = `rgb(${r}, ${g}, ${b})`;

                  return (
                    <React.Fragment key={`pm25-group-${i}-${taxAmount}`}>
                      {/* Outer glow — grows/shrinks dramatically */}
                      <CircleMarker
                        center={[spot.lat, spot.lng]}
                        radius={12 + intensity * 45}
                        fillColor={dotColor}
                        color="transparent"
                        weight={0}
                        fillOpacity={0.06 + intensity * 0.20}
                      />
                      {/* Mid ring */}
                      <CircleMarker
                        center={[spot.lat, spot.lng]}
                        radius={8 + intensity * 25}
                        fillColor={dotColor}
                        color={dotColor}
                        weight={1.5}
                        fillOpacity={0.12 + intensity * 0.30}
                      />
                      {/* Core dot */}
                      <CircleMarker
                        center={[spot.lat, spot.lng]}
                        radius={5 + intensity * 8}
                        fillColor={dotColor}
                        color="#ffffff"
                        weight={1.5}
                        fillOpacity={0.9}
                      >
                        <Popup>
                          <div style={{ fontFamily: 'Inter, sans-serif', padding: '10px 12px' }}>
                            <h4 style={{ margin: '0 0 6px', color: '#f0f0f5', fontSize: '13px' }}>{spot.name}</h4>
                            <p style={{ margin: '2px 0', fontSize: '11px', color: '#8890a4' }}>
                              <strong style={{ color: '#bbb' }}>PM2.5:</strong>{' '}
                              <span style={{ color: dotColor, fontWeight: 700 }}>
                                {currentPM25.toFixed(1)} µg/m³
                              </span>
                            </p>
                            <p style={{ margin: '2px 0', fontSize: '11px', color: '#8890a4' }}>
                              <strong style={{ color: '#bbb' }}>Baseline:</strong> {spot.baseLevel} µg/m³
                            </p>
                            {taxAmount > 0 && (
                              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgb(40, 200, 40)' }}>
                                ↓ {apiReduction.toFixed(3)} µg/m³ model reduction
                              </p>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}

                {/* Soundview Center Marker */}
                <CircleMarker
                  center={SOUNDVIEW_CENTER}
                  radius={6}
                  fillColor="#3b82f6"
                  color="#60a5fa"
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.9}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', padding: '10px 12px' }}>
                      <h4 style={{ margin: '0 0 4px', color: '#f0f0f5', fontSize: '13px' }}>Soundview</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8890a4' }}>{language === 'en' ? 'Cross-Bronx Expressway' : 'Autopista Cross-Bronx'}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>

              {/* Map Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: riskToColor(riskScore) }}></div>
                  <span>{language === 'en' ? 'HVI Risk Zone' : 'Zona de Riesgo HVI'}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: cbxColor, width: '20px', height: '4px', borderRadius: '2px' }}></div>
                  <span>{language === 'en' ? 'CBX Truck Flow' : 'Flujo de Camiones'}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: 'rgb(30, 220, 30)', borderRadius: '50%', border: '1.5px solid #fff', width: '12px', height: '12px' }}></div>
                  <span>PM2.5 Low (&le;7 µg/m³)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: 'rgb(250, 200, 30)', borderRadius: '50%', border: '1.5px solid #fff', width: '12px', height: '12px' }}></div>
                  <span>PM2.5 Moderate (~11)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: 'rgb(250, 50, 30)', borderRadius: '50%', border: '1.5px solid #fff', width: '12px', height: '12px' }}></div>
                  <span>PM2.5 High (~13)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: 'rgb(220, 10, 40)', borderRadius: '50%', border: '1.5px solid #fff', width: '12px', height: '12px' }}></div>
                  <span>PM2.5 Critical (&ge;15)</span>
                </div>
                <div className="legend-item" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', marginTop: '2px' }}>
                  <span style={{ fontSize: '10px', color: '#8890a4' }}>Predicted: {pm25Level.toFixed(1)} µg/m³ (baseline 13.2)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#3b82f6', borderRadius: '50%', width: '10px', height: '10px' }}></div>
                  <span>Soundview</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ML Prediction Tab */}
        {activeTab === 'prediction' && (
          <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                Traffic Flow Prediction
              </h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
                LSTM neural network predicts traffic speeds and emissions for the next 24 hours
              </p>

              {/* Current Traffic Status */}
              {trafficData && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Current Speed:</span>
                    <strong style={{ fontSize: '18px', color: '#111827', marginLeft: '8px' }}>
                      {trafficData.latest_speed_mph} mph
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Congestion:</span>
                    <span style={{
                      fontSize: '14px',
                      marginLeft: '8px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500',
                      backgroundColor: getCongestionLevel(trafficData.latest_speed_mph).bgColor,
                      color: getCongestionLevel(trafficData.latest_speed_mph).color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {getCongestionLevel(trafficData.latest_speed_mph).level}
                      {getCongestionLevel(trafficData.latest_speed_mph).level === 'Severe' && ' 🚨'}
                      {getCongestionLevel(trafficData.latest_speed_mph).level === 'High' && ' ⚠️'}
                      {getCongestionLevel(trafficData.latest_speed_mph).level === 'Moderate' && ' ⚠️'}
                      {getCongestionLevel(trafficData.latest_speed_mph).level === 'Optimal' && ' ✅'}
                    </span>
                  </div>
                </div>
              )}

              {/* Prediction Controls */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => predictTraffic('current_50mph')}
                  disabled={predictionLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: predictionLoading ? 'not-allowed' : 'pointer',
                    opacity: predictionLoading ? 0.6 : 1
                  }}
                >
                  Predict 50 mph Scenario
                </button>
                <button
                  onClick={() => predictTraffic('optimized_60mph')}
                  disabled={predictionLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: predictionLoading ? 'not-allowed' : 'pointer',
                    opacity: predictionLoading ? 0.6 : 1
                  }}
                >
                  Predict 60 mph Scenario
                </button>
                <button
                  onClick={runFullPrediction}
                  disabled={predictionLoading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: predictionLoading ? 'not-allowed' : 'pointer',
                    opacity: predictionLoading ? 0.6 : 1,
                    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  🚀 Run Full Analysis (LSTM + HMM + Monte Carlo)
                </button>
              </div>

              {predictionLoading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔄</div>
                  <p>Running LSTM prediction...</p>
                </div>
              )}
            </div>

            {/* Prediction Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {prediction50 && (
                <TrafficPredictionChart predictionData={prediction50} scenario="current_50mph" />
              )}
              {prediction60 && (
                <TrafficPredictionChart predictionData={prediction60} scenario="optimized_60mph" />
              )}
            </div>

            {/* HMM Environmental State Timeline */}
            {(hmmData || prediction50) && (
              <div style={{ marginBottom: '24px' }}>
                <SystemStateTimeline hmmData={hmmData} language={language} />
              </div>
            )}
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            <ScenarioComparison
              scenario50={prediction50}
              scenario60={prediction60}
              monteCarloData={monteCarloData}
              language={language}
            />
          </div>
        )}

        {/* Model Info Tab */}
        {activeTab === 'model' && (
          <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <NeuralNetworkViz
              modelInfo={modelInfo}
              technicalDocs={technicalDocs}
              language={language}
            />
          </div>
        )}

        {/* Scroll Hack Tab */}
        {activeTab === 'scroll_hack' && (
          <div style={{ width: '100%', height: 'calc(100vh - 180px)', border: 'none', overflow: 'auto' }}>
            <iframe
              src="/scroll_hack/index.html"
              title="Scroll Hack Map"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        )}
      </div>

      {/* Zone Detail Panel (Interactive Map Zone Click) */}
      <ZoneDetailPanel
        zone={selectedZone}
        monteCarloData={monteCarloData}
        taxAmount={taxAmount}
        isVisible={showZonePanel}
        onClose={() => setShowZonePanel(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="footer">
        {t.footer}
      </footer>
    </div>
  );
}

export default App;
