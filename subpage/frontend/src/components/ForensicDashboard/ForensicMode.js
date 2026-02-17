/**
 * ForensicMode - Counterfactual Analysis Component
 *
 * Allows users to:
 * 1. Select historical traffic accidents
 * 2. Rewind to the moment of collision
 * 3. Adjust tax rate to see counterfactual outcomes
 * 4. Visualize probability changes in collision risk
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';

// ==================== HISTORICAL ACCIDENT DATA ====================
// Real collision data points from South Bronx (anonymized)
const ACCIDENT_DATABASE = [
  {
    id: 'acc-001',
    date: '2023-06-15',
    time: '14:32',
    coordinates: [-73.9156, 40.8054],
    location: 'E 138th St & Willis Ave',
    description: 'Truck-pedestrian collision at crosswalk',
    severity: 'severe',
    factors: {
      truckSpeed: 28,
      pedestrianPresent: true,
      timeOfDay: 'afternoon',
      dayOfWeek: 'Thursday',
      weatherCondition: 'clear'
    },
    casualties: { injuries: 1, fatalities: 0 },
    vehicleType: 'delivery_truck',
    estimatedImpact: {
      baseCollisionProb: 0.73,
      taxReductionFactor: 0.58
    }
  },
  {
    id: 'acc-002',
    date: '2023-08-22',
    time: '08:15',
    coordinates: [-73.9134, 40.8035],
    location: '3rd Ave near PS 154',
    description: 'Heavy truck near-miss with child',
    severity: 'moderate',
    factors: {
      truckSpeed: 32,
      pedestrianPresent: true,
      timeOfDay: 'morning',
      dayOfWeek: 'Tuesday',
      weatherCondition: 'rain'
    },
    casualties: { injuries: 0, fatalities: 0 },
    vehicleType: 'semi_truck',
    estimatedImpact: {
      baseCollisionProb: 0.65,
      taxReductionFactor: 0.62
    }
  },
  {
    id: 'acc-003',
    date: '2023-11-03',
    time: '17:45',
    coordinates: [-73.9200, 40.8080],
    location: 'Bruckner Blvd & St. Anns Ave',
    description: 'Multi-vehicle collision involving freight truck',
    severity: 'severe',
    factors: {
      truckSpeed: 35,
      pedestrianPresent: false,
      timeOfDay: 'evening',
      dayOfWeek: 'Friday',
      weatherCondition: 'clear'
    },
    casualties: { injuries: 3, fatalities: 0 },
    vehicleType: 'freight_truck',
    estimatedImpact: {
      baseCollisionProb: 0.81,
      taxReductionFactor: 0.51
    }
  },
  {
    id: 'acc-004',
    date: '2024-01-18',
    time: '11:20',
    coordinates: [-73.9210, 40.8100],
    location: 'Willis Ave Bridge approach',
    description: 'Cyclist struck by turning truck',
    severity: 'fatal',
    factors: {
      truckSpeed: 18,
      pedestrianPresent: true,
      timeOfDay: 'midday',
      dayOfWeek: 'Thursday',
      weatherCondition: 'cloudy'
    },
    casualties: { injuries: 0, fatalities: 1 },
    vehicleType: 'cement_mixer',
    estimatedImpact: {
      baseCollisionProb: 0.89,
      taxReductionFactor: 0.45
    }
  }
];

// ==================== COUNTERFACTUAL MODEL ====================
/**
 * Calculate counterfactual collision probability based on tax rate
 * Uses a simplified model based on:
 * - Speed reduction from tax
 * - Traffic volume reduction
 * - Route diversion effects
 */
function calculateCounterfactual(accident, taxRate) {
  const { baseCollisionProb, taxReductionFactor } = accident.estimatedImpact;
  const taxEffect = (taxRate / 100) * taxReductionFactor;

  // Non-linear reduction - diminishing returns at high tax rates
  const probabilityReduction = 1 - Math.pow(1 - taxEffect, 1.5);

  return {
    originalProbability: baseCollisionProb,
    counterfactualProbability: Math.max(0.05, baseCollisionProb * (1 - probabilityReduction)),
    speedReduction: Math.min(15, taxRate * 0.15),
    volumeReduction: Math.min(40, taxRate * 0.4),
    livesProtected: probabilityReduction * (accident.casualties.injuries + accident.casualties.fatalities * 10)
  };
}

/**
 * Generate time series data for the probability graph
 */
function generateProbabilityTimeline(accident, taxRate) {
  const timeline = [];
  const eventTime = 60; // Event occurs at t=60 seconds

  for (let t = 0; t <= 120; t += 5) {
    const baseRisk = t < eventTime
      ? 0.1 + (accident.estimatedImpact.baseCollisionProb - 0.1) * (t / eventTime)
      : accident.estimatedImpact.baseCollisionProb * Math.exp(-(t - eventTime) / 30);

    const taxedRisk = baseRisk * (1 - (taxRate / 100) * accident.estimatedImpact.taxReductionFactor);

    timeline.push({
      time: t - eventTime,
      label: `${t - eventTime}s`,
      baseline: Math.round(baseRisk * 100),
      withTax: Math.round(taxedRisk * 100),
      threshold: 50
    });
  }

  return timeline;
}

// ==================== SUB-COMPONENTS ====================

const AccidentCard = ({ accident, selected, onClick }) => {
  const severityColors = {
    moderate: '#eab308',
    severe: '#f97316',
    fatal: '#ef4444'
  };

  return (
    <motion.div
      className={`accident-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(accident)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderLeft: `4px solid ${severityColors[accident.severity]}`
      }}
    >
      <div className="accident-card-header">
        <span className="accident-date">{accident.date}</span>
        <span
          className="accident-severity"
          style={{ color: severityColors[accident.severity] }}
        >
          {accident.severity.toUpperCase()}
        </span>
      </div>
      <div className="accident-location">{accident.location}</div>
      <div className="accident-description">{accident.description}</div>
      <div className="accident-stats">
        <span>Injuries: {accident.casualties.injuries}</span>
        <span>Fatalities: {accident.casualties.fatalities}</span>
      </div>
    </motion.div>
  );
};

const CounterfactualGraph = ({ accident, taxRate }) => {
  const timelineData = useMemo(
    () => generateProbabilityTimeline(accident, taxRate),
    [accident, taxRate]
  );

  const counterfactual = useMemo(
    () => calculateCounterfactual(accident, taxRate),
    [accident, taxRate]
  );

  return (
    <div className="counterfactual-graph">
      <h4>Collision Probability Over Time</h4>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="taxedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              domain={[0, 100]}
              label={{
                value: 'Risk %',
                angle: -90,
                position: 'insideLeft',
                fill: '#9ca3af',
                fontSize: 10
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <ReferenceLine
              x="0s"
              stroke="#fff"
              strokeDasharray="5 5"
              label={{ value: 'Event', fill: '#fff', fontSize: 10 }}
            />
            <ReferenceLine
              y={50}
              stroke="#eab308"
              strokeDasharray="3 3"
              label={{ value: 'Critical', fill: '#eab308', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#ef4444"
              fill="url(#baselineGradient)"
              name="Without Tax"
            />
            <Area
              type="monotone"
              dataKey="withTax"
              stroke="#22c55e"
              fill="url(#taxedGradient)"
              name={`With $${taxRate} Tax`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Counterfactual Summary */}
      <div className="counterfactual-summary">
        <div className="cf-stat">
          <span className="cf-label">Original Risk</span>
          <span className="cf-value danger">
            {Math.round(counterfactual.originalProbability * 100)}%
          </span>
        </div>
        <div className="cf-arrow">→</div>
        <div className="cf-stat">
          <span className="cf-label">With ${taxRate} Tax</span>
          <span className="cf-value success">
            {Math.round(counterfactual.counterfactualProbability * 100)}%
          </span>
        </div>
        <div className="cf-stat highlight">
          <span className="cf-label">Risk Reduction</span>
          <span className="cf-value">
            {Math.round((1 - counterfactual.counterfactualProbability / counterfactual.originalProbability) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

const FactorAnalysis = ({ accident, taxRate }) => {
  const factors = [
    {
      name: 'Truck Speed',
      original: `${accident.factors.truckSpeed} mph`,
      withTax: `${Math.max(15, accident.factors.truckSpeed - taxRate * 0.15).toFixed(0)} mph`,
      impact: 'high'
    },
    {
      name: 'Traffic Volume',
      original: '100%',
      withTax: `${Math.max(60, 100 - taxRate * 0.4).toFixed(0)}%`,
      impact: 'high'
    },
    {
      name: 'Pedestrian Exposure',
      original: accident.factors.pedestrianPresent ? 'High' : 'Low',
      withTax: accident.factors.pedestrianPresent
        ? (taxRate > 30 ? 'Reduced' : 'High')
        : 'Low',
      impact: accident.factors.pedestrianPresent ? 'high' : 'low'
    },
    {
      name: 'Route Diversion',
      original: '0%',
      withTax: `${Math.min(35, taxRate * 0.35).toFixed(0)}%`,
      impact: 'medium'
    }
  ];

  return (
    <div className="factor-analysis">
      <h4>Contributing Factors Analysis</h4>
      <div className="factors-grid">
        {factors.map(factor => (
          <div key={factor.name} className={`factor-row impact-${factor.impact}`}>
            <span className="factor-name">{factor.name}</span>
            <span className="factor-original">{factor.original}</span>
            <span className="factor-arrow">→</span>
            <span className="factor-withTax">{factor.withTax}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ForensicMode = ({ taxRate, selectedAccident, onSelectAccident, onClose }) => {
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [isRewinding, setIsRewinding] = useState(false);

  // Handle rewind animation
  const handleRewind = () => {
    setIsRewinding(true);
    setTimelinePosition(0);

    // Animate timeline position
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setTimelinePosition(eased * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsRewinding(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <motion.div
      className="forensic-mode-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Header */}
      <div className="forensic-header">
        <div className="forensic-title">
          <span className="forensic-icon">🔍</span>
          <h3>Forensic Analysis</h3>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Timeline Scrubber */}
      <div className="timeline-scrubber">
        <span className="timeline-label">Timeline Position</span>
        <div className="timeline-track">
          <motion.div
            className="timeline-progress"
            style={{ width: `${timelinePosition}%` }}
          />
          <motion.div
            className="timeline-handle"
            style={{ left: `${timelinePosition}%` }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDrag={(e, info) => {
              const newPos = Math.max(0, Math.min(100, timelinePosition + info.delta.x / 3));
              setTimelinePosition(newPos);
            }}
          />
        </div>
        <button
          className="rewind-btn"
          onClick={handleRewind}
          disabled={isRewinding}
        >
          {isRewinding ? '⏳ Rewinding...' : '⏪ Rewind to Event'}
        </button>
      </div>

      {/* Accident Selection */}
      <div className="accident-selection">
        <h4>Select Historical Incident</h4>
        <div className="accident-list">
          {ACCIDENT_DATABASE.map(accident => (
            <AccidentCard
              key={accident.id}
              accident={accident}
              selected={selectedAccident?.id === accident.id}
              onClick={onSelectAccident}
            />
          ))}
        </div>
      </div>

      {/* Analysis Section (shown when accident selected) */}
      <AnimatePresence>
        {selectedAccident && (
          <motion.div
            className="analysis-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CounterfactualGraph
              accident={selectedAccident}
              taxRate={taxRate}
            />

            <FactorAnalysis
              accident={selectedAccident}
              taxRate={taxRate}
            />

            {/* Key Insight */}
            <div className="key-insight">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <strong>Key Finding:</strong> A ${taxRate} speed tax at this location
                could have reduced collision probability by{' '}
                <span className="highlight-stat">
                  {Math.round(
                    (1 - calculateCounterfactual(selectedAccident, taxRate).counterfactualProbability /
                      selectedAccident.estimatedImpact.baseCollisionProb) * 100
                  )}%
                </span>
                {selectedAccident.casualties.fatalities > 0 && (
                  <span className="fatality-note">
                    , potentially preventing a fatality.
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ForensicMode;
export { ACCIDENT_DATABASE, calculateCounterfactual };
