/**
 * ComparisonToggle - View Mode Toggle Component
 *
 * Allows users to switch between:
 * - GIS view (traditional traffic data)
 * - Model view (ML risk corridors)
 * - Comparison view (side-by-side/overlay)
 */

import React from 'react';
import { motion } from 'framer-motion';

const VIEW_MODES = [
  {
    id: 'gis',
    label: 'GIS Data',
    icon: '🗺️',
    description: 'Traditional traffic volume data'
  },
  {
    id: 'model',
    label: 'Model Output',
    icon: '🧠',
    description: 'ML-based risk corridors'
  },
  {
    id: 'comparison',
    label: 'Compare',
    icon: '⚖️',
    description: 'Overlay both views'
  }
];

const ComparisonToggle = ({ mode, onModeChange }) => {
  return (
    <div className="comparison-toggle">
      <div className="toggle-container">
        {VIEW_MODES.map((viewMode) => (
          <motion.button
            key={viewMode.id}
            className={`toggle-btn ${mode === viewMode.id ? 'active' : ''}`}
            onClick={() => onModeChange(viewMode.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={viewMode.description}
          >
            <span className="toggle-icon">{viewMode.icon}</span>
            <span className="toggle-label">{viewMode.label}</span>

            {/* Active indicator */}
            {mode === viewMode.id && (
              <motion.div
                className="active-indicator"
                layoutId="activeToggle"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Current mode description */}
      <motion.div
        className="mode-description"
        key={mode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {VIEW_MODES.find(m => m.id === mode)?.description}
      </motion.div>
    </div>
  );
};

export default ComparisonToggle;
