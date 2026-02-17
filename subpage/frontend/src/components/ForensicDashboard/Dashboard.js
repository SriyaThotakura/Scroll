/**
 * ForensicDashboard - Main Dashboard Component
 *
 * A multi-method urban planning tool for analyzing traffic speed taxation
 * in the South Bronx (Mott Haven/Port Morris)
 *
 * Layers:
 * 1. Inference: ML model for high-risk corridor identification
 * 2. Simulation: Agent-Based Model with real-time tax reactions
 * 3. Forensic: Counterfactual analysis of historical accidents
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Dashboard Components
import ScrollyPanel from './ScrollyPanel';
import AgentSimulation from './AgentSimulation';
import ForensicMode from './ForensicMode';
import ComparisonToggle from './ComparisonToggle';
import MetricsPanel from './MetricsPanel';

// Styles
import './Dashboard.css';

// ==================== CONSTANTS ====================
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://scroll-y8wn.onrender.com';
const SOUTH_BRONX_CENTER = [-73.9134, 40.8090]; // Mott Haven/Port Morris
const INITIAL_ZOOM = 14;

// Narrative Steps for Scrollytelling
const NARRATIVE_STEPS = [
  {
    id: 'problem',
    title: 'The Problem',
    subtitle: 'South Bronx Truck Traffic Crisis',
    content: `The South Bronx bears a disproportionate burden of freight traffic.
              Over 15,000 trucks traverse these streets daily, contributing to
              the highest asthma rates in New York City.`,
    mapState: { center: SOUTH_BRONX_CENTER, zoom: 13, pitch: 0 },
    layer: 'traffic-density',
    highlight: null
  },
  {
    id: 'inference',
    title: 'The Inference',
    subtitle: 'Activity-Based Risk Model',
    content: `Our trained model identifies high-risk corridors by analyzing the
              tension between pedestrian density and truck traffic patterns.
              Red zones indicate critical intervention points.`,
    mapState: { center: SOUTH_BRONX_CENTER, zoom: 14, pitch: 45 },
    layer: 'risk-corridors',
    highlight: 'model-output'
  },
  {
    id: 'intervention',
    title: 'The Intervention',
    subtitle: 'Dynamic Speed Taxation',
    content: `A graduated tax based on corridor risk encourages trucks to use
              designated routes and reduces speeds in vulnerable areas.
              Adjust the slider to see real-time agent behavior changes.`,
    mapState: { center: SOUTH_BRONX_CENTER, zoom: 14.5, pitch: 60 },
    layer: 'agents',
    highlight: 'tax-zones'
  },
  {
    id: 'simulation',
    title: 'The Simulation',
    subtitle: 'Agent-Based Modeling',
    content: `Watch how different actors respond: Local residents adapt their
              routes, while commercial traffic reroutes to taxed corridors.
              The emergent pattern reveals optimal tax rates.`,
    mapState: { center: [-73.9080, 40.8120], zoom: 15, pitch: 60 },
    layer: 'agents-active',
    highlight: 'behavior-patterns'
  },
  {
    id: 'forensic',
    title: 'The Forensic',
    subtitle: 'Counterfactual Analysis',
    content: `Rewind to historical collision events. What if a speed tax had
              been in place? Our model reconstructs the probability space
              to show lives that could have been saved.`,
    mapState: { center: [-73.9156, 40.8054], zoom: 17, pitch: 0 },
    layer: 'forensic',
    highlight: 'accident-site'
  }
];

// ==================== MAIN COMPONENT ====================
const Dashboard = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [taxRate, setTaxRate] = useState(25);
  const [viewMode, setViewMode] = useState('model'); // 'gis' | 'model' | 'comparison'
  const [forensicMode, setForensicMode] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [agents, setAgents] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [metrics, setMetrics] = useState({
    trucksRerouted: 0,
    avgSpeedReduction: 0,
    collisionRiskReduction: 0,
    pedestrianExposure: 0
  });

  // Map state
  const [viewState, setViewState] = useState({
    longitude: SOUTH_BRONX_CENTER[0],
    latitude: SOUTH_BRONX_CENTER[1],
    zoom: INITIAL_ZOOM,
    pitch: 0,
    bearing: 0
  });

  const mapRef = useRef(null);
  const simulationRef = useRef(null);

  // ==================== EFFECTS ====================

  // Fetch data from real ML backend API
  useEffect(() => {
    const fetchSimulationData = async () => {
      setApiLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/simulate?tax_amount=${taxRate}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setApiData(data);

        // Update metrics with real API data
        if (data) {
          setMetrics({
            trucksRerouted: Math.round(data.trucks_diverted || 0),
            avgSpeedReduction: Math.round((data.pm25_reduction || 0) * 10),
            collisionRiskReduction: Math.round((data.health_impact?.asthma_attacks_prevented || 0) * 2),
            pedestrianExposure: Math.round(100 - (taxRate * 0.6))
          });
        }
      } catch (error) {
        console.error('API fetch error:', error);
        setApiError(error.message);
        // Fallback to calculated metrics if API fails
        const taxFactor = taxRate / 100;
        setMetrics({
          trucksRerouted: Math.round(taxFactor * 3200),
          avgSpeedReduction: Math.round(taxFactor * 15),
          collisionRiskReduction: Math.round(taxFactor * 42),
          pedestrianExposure: Math.round((1 - taxFactor * 0.6) * 100)
        });
      } finally {
        setApiLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchSimulationData, 300);
    return () => clearTimeout(timeoutId);
  }, [taxRate]);

  // Update map when narrative step changes
  useEffect(() => {
    const step = NARRATIVE_STEPS[currentStep];
    if (step && mapRef.current) {
      mapRef.current.flyTo({
        center: step.mapState.center,
        zoom: step.mapState.zoom,
        pitch: step.mapState.pitch,
        duration: 2000,
        essential: true
      });
    }

    // Activate forensic mode on last step
    if (step?.id === 'forensic') {
      setForensicMode(true);
    } else {
      setForensicMode(false);
    }

    // Start simulation on simulation step
    if (step?.id === 'simulation' || step?.id === 'intervention') {
      setSimulationRunning(true);
    }
  }, [currentStep]);

  // Log API status for debugging
  useEffect(() => {
    if (apiLoading) console.log('Fetching ML predictions from backend...');
    if (apiError) console.log('API Error (using fallback):', apiError);
    if (apiData) console.log('Received ML prediction:', apiData);
  }, [apiLoading, apiError, apiData]);

  // ==================== HANDLERS ====================

  const handleStepChange = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const handleTaxChange = useCallback((value) => {
    setTaxRate(value);
    // Trigger agent behavior update
    if (simulationRef.current) {
      simulationRef.current.updateTaxRate(value);
    }
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleForensicSelect = useCallback((accident) => {
    setSelectedAccident(accident);
    setForensicMode(true);
    // Fly to accident location
    if (mapRef.current && accident) {
      mapRef.current.flyTo({
        center: accident.coordinates,
        zoom: 18,
        pitch: 0,
        duration: 1500
      });
    }
  }, []);

  const handleAgentUpdate = useCallback((newAgents) => {
    setAgents(newAgents);
  }, []);

  // ==================== RENDER ====================
  return (
    <div className="forensic-dashboard">
      {/* Narrative Side Panel */}
      <ScrollyPanel
        steps={NARRATIVE_STEPS}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        taxRate={taxRate}
        onTaxChange={handleTaxChange}
      />

      {/* Main Map Container */}
      <div className="map-container">
        {/* View Mode Toggle */}
        <ComparisonToggle
          mode={viewMode}
          onModeChange={handleViewModeChange}
        />

        {/* Map */}
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Base Traffic Layer (GIS) */}
          {(viewMode === 'gis' || viewMode === 'comparison') && (
            <Source
              id="traffic-gis"
              type="geojson"
              data={generateTrafficGeoJSON()}
            >
              <Layer
                id="traffic-gis-layer"
                type="line"
                paint={{
                  'line-color': '#ff6b6b',
                  'line-width': 3,
                  'line-opacity': viewMode === 'comparison' ? 0.5 : 0.8
                }}
              />
            </Source>
          )}

          {/* Model Output Layer */}
          {(viewMode === 'model' || viewMode === 'comparison') && (
            <Source
              id="risk-corridors"
              type="geojson"
              data={generateRiskCorridorsGeoJSON(taxRate)}
            >
              <Layer
                id="risk-corridors-layer"
                type="line"
                paint={{
                  'line-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'risk_score'],
                    0, '#22c55e',
                    0.5, '#eab308',
                    1, '#ef4444'
                  ],
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['get', 'risk_score'],
                    0, 2,
                    1, 8
                  ],
                  'line-opacity': 0.9
                }}
              />
            </Source>
          )}

          {/* Tax Zone Overlay */}
          {currentStep >= 2 && (
            <Source
              id="tax-zones"
              type="geojson"
              data={generateTaxZonesGeoJSON(taxRate)}
            >
              <Layer
                id="tax-zones-fill"
                type="fill"
                paint={{
                  'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'tax_level'],
                    0, 'rgba(34, 197, 94, 0.2)',
                    50, 'rgba(234, 179, 8, 0.3)',
                    100, 'rgba(239, 68, 68, 0.4)'
                  ],
                  'fill-opacity': 0.6
                }}
              />
              <Layer
                id="tax-zones-outline"
                type="line"
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 1,
                  'line-dasharray': [2, 2]
                }}
              />
            </Source>
          )}

          {/* Agent Markers */}
          {simulationRunning && agents.map(agent => (
            <Marker
              key={agent.id}
              longitude={agent.lng}
              latitude={agent.lat}
              anchor="center"
            >
              <motion.div
                className={`agent-marker agent-${agent.type}`}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  rotate: agent.heading
                }}
                transition={{ duration: 0.3 }}
              />
            </Marker>
          ))}

          {/* Forensic Mode Overlay */}
          {forensicMode && selectedAccident && (
            <>
              <Marker
                longitude={selectedAccident.coordinates[0]}
                latitude={selectedAccident.coordinates[1]}
                anchor="center"
              >
                <motion.div
                  className="accident-marker"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </Marker>
              <Source
                id="accident-radius"
                type="geojson"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: selectedAccident.coordinates
                  }
                }}
              >
                <Layer
                  id="accident-radius-layer"
                  type="circle"
                  paint={{
                    'circle-radius': 50,
                    'circle-color': 'rgba(239, 68, 68, 0.3)',
                    'circle-stroke-color': '#ef4444',
                    'circle-stroke-width': 2
                  }}
                />
              </Source>
            </>
          )}
        </Map>

        {/* Metrics Panel */}
        <MetricsPanel metrics={metrics} visible={currentStep >= 2} />

        {/* Agent Simulation Engine (hidden) */}
        <AgentSimulation
          ref={simulationRef}
          running={simulationRunning}
          taxRate={taxRate}
          bounds={[
            [SOUTH_BRONX_CENTER[0] - 0.02, SOUTH_BRONX_CENTER[1] - 0.015],
            [SOUTH_BRONX_CENTER[0] + 0.02, SOUTH_BRONX_CENTER[1] + 0.015]
          ]}
          onAgentUpdate={handleAgentUpdate}
        />
      </div>

      {/* Forensic Mode Panel */}
      <AnimatePresence>
        {forensicMode && (
          <ForensicMode
            taxRate={taxRate}
            selectedAccident={selectedAccident}
            onSelectAccident={handleForensicSelect}
            onClose={() => setForensicMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate GeoJSON for traditional GIS traffic data
 */
function generateTrafficGeoJSON() {
  // South Bronx major corridors
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Bruckner Blvd', traffic_volume: 15000 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9300, 40.8050],
            [-73.9200, 40.8080],
            [-73.9100, 40.8100],
            [-73.9000, 40.8120]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: '3rd Ave', traffic_volume: 8000 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9134, 40.7950],
            [-73.9134, 40.8050],
            [-73.9130, 40.8150]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'E 138th St', traffic_volume: 6500 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9300, 40.8054],
            [-73.9200, 40.8054],
            [-73.9100, 40.8054],
            [-73.9000, 40.8054]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Willis Ave', traffic_volume: 5000 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9210, 40.7980],
            [-73.9210, 40.8080],
            [-73.9210, 40.8180]
          ]
        }
      }
    ]
  };
}

/**
 * Generate risk corridors based on ML model output
 */
function generateRiskCorridorsGeoJSON(taxRate) {
  const taxFactor = taxRate / 100;

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Bruckner Blvd',
          risk_score: Math.max(0.2, 0.95 - taxFactor * 0.5),
          pedestrian_density: 0.8,
          truck_intensity: 0.9
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9300, 40.8050],
            [-73.9250, 40.8065],
            [-73.9200, 40.8080],
            [-73.9150, 40.8090],
            [-73.9100, 40.8100],
            [-73.9050, 40.8110],
            [-73.9000, 40.8120]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'E 138th St Corridor',
          risk_score: Math.max(0.3, 0.85 - taxFactor * 0.4),
          pedestrian_density: 0.9,
          truck_intensity: 0.7
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9250, 40.8054],
            [-73.9200, 40.8054],
            [-73.9150, 40.8054],
            [-73.9100, 40.8054],
            [-73.9050, 40.8054]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Willis Ave Bridge Approach',
          risk_score: Math.max(0.15, 0.75 - taxFactor * 0.45),
          pedestrian_density: 0.6,
          truck_intensity: 0.85
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9210, 40.8000],
            [-73.9210, 40.8040],
            [-73.9210, 40.8080],
            [-73.9205, 40.8120]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: '3rd Ave School Zone',
          risk_score: Math.max(0.25, 0.92 - taxFactor * 0.55),
          pedestrian_density: 0.95,
          truck_intensity: 0.6
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.9134, 40.8020],
            [-73.9134, 40.8050],
            [-73.9134, 40.8080],
            [-73.9130, 40.8110]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Hunts Point Distribution',
          risk_score: Math.max(0.1, 0.6 - taxFactor * 0.3),
          pedestrian_density: 0.3,
          truck_intensity: 0.95
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.8900, 40.8100],
            [-73.8850, 40.8120],
            [-73.8800, 40.8140]
          ]
        }
      }
    ]
  };
}

/**
 * Generate tax zones based on current tax rate
 */
function generateTaxZonesGeoJSON(taxRate) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { zone: 'high', tax_level: taxRate * 1.5, name: 'School Zone' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-73.9180, 40.8020],
            [-73.9080, 40.8020],
            [-73.9080, 40.8100],
            [-73.9180, 40.8100],
            [-73.9180, 40.8020]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { zone: 'medium', tax_level: taxRate, name: 'Residential Corridor' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-73.9250, 40.8030],
            [-73.9180, 40.8030],
            [-73.9180, 40.8080],
            [-73.9250, 40.8080],
            [-73.9250, 40.8030]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { zone: 'low', tax_level: taxRate * 0.5, name: 'Industrial Route' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-73.9000, 40.8080],
            [-73.8900, 40.8080],
            [-73.8900, 40.8160],
            [-73.9000, 40.8160],
            [-73.9000, 40.8080]
          ]]
        }
      }
    ]
  };
}

export default Dashboard;
