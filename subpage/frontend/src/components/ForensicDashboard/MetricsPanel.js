/**
 * MetricsPanel - Real-time Metrics Display
 *
 * Shows key performance indicators based on current tax rate:
 * - Trucks rerouted
 * - Average speed reduction
 * - Collision risk reduction
 * - Pedestrian exposure index
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const METRICS_CONFIG = [
  {
    key: 'trucksRerouted',
    label: 'Trucks Rerouted',
    unit: '/day',
    icon: '🚛',
    color: '#3b82f6',
    format: (val) => val.toLocaleString()
  },
  {
    key: 'avgSpeedReduction',
    label: 'Avg Speed Reduction',
    unit: ' mph',
    icon: '⚡',
    color: '#22c55e',
    format: (val) => val.toFixed(1)
  },
  {
    key: 'collisionRiskReduction',
    label: 'Collision Risk Reduction',
    unit: '%',
    icon: '🛡️',
    color: '#8b5cf6',
    format: (val) => val.toFixed(0)
  },
  {
    key: 'pedestrianExposure',
    label: 'Pedestrian Exposure',
    unit: '%',
    icon: '🚶',
    color: '#f59e0b',
    format: (val) => val.toFixed(0),
    inverted: true // Lower is better
  }
];

const MetricCard = ({ config, value }) => {
  const formattedValue = config.format(value);
  const isGood = config.inverted ? value < 70 : value > 0;

  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ borderColor: config.color }}
    >
      <div className="metric-icon">{config.icon}</div>
      <div className="metric-content">
        <motion.div
          className="metric-value"
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          style={{ color: config.color }}
        >
          {formattedValue}
          <span className="metric-unit">{config.unit}</span>
        </motion.div>
        <div className="metric-label">{config.label}</div>
      </div>

      {/* Indicator bar */}
      <div className="metric-bar">
        <motion.div
          className="metric-bar-fill"
          initial={{ width: 0 }}
          animate={{
            width: `${config.inverted ? 100 - value : Math.min(value, 100)}%`
          }}
          style={{ backgroundColor: config.color }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

const MetricsPanel = ({ metrics, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="metrics-panel"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="metrics-header">
            <h4>Impact Metrics</h4>
            <span className="metrics-subtitle">Real-time simulation results</span>
          </div>

          <div className="metrics-grid">
            {METRICS_CONFIG.map((config) => (
              <MetricCard
                key={config.key}
                config={config}
                value={metrics[config.key] || 0}
              />
            ))}
          </div>

          {/* Summary insight */}
          <motion.div
            className="metrics-insight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {metrics.collisionRiskReduction > 30 ? (
              <span className="insight-positive">
                ✅ Significant safety improvement projected
              </span>
            ) : metrics.collisionRiskReduction > 10 ? (
              <span className="insight-moderate">
                ⚠️ Moderate impact - consider higher tax rate
              </span>
            ) : (
              <span className="insight-low">
                📊 Adjust tax rate to see impact changes
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MetricsPanel;
