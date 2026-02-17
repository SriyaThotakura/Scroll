/**
 * ScrollyPanel - Narrative Scrollytelling Side Panel
 *
 * Guides users through the story:
 * 1. The Problem - South Bronx truck traffic
 * 2. The Inference - ML model for risk identification
 * 3. The Intervention - Speed taxation policy
 * 4. The Simulation - Agent behavior modeling
 * 5. The Forensic - Counterfactual analysis
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ==================== ANIMATION VARIANTS ====================
const panelVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

// ==================== STEP ICONS ====================
const STEP_ICONS = {
  problem: '⚠️',
  inference: '🧠',
  intervention: '📊',
  simulation: '🎮',
  forensic: '🔍'
};

// ==================== SUB-COMPONENTS ====================

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <motion.button
          key={step.id}
          className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          onClick={() => onStepClick(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          title={step.title}
        >
          <span className="step-number">{index + 1}</span>
          {index === currentStep && (
            <motion.div
              className="step-pulse"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      ))}
      <div className="step-line" />
      <motion.div
        className="step-progress"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

const NarrativeStep = ({ step, isActive }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`narrative-step ${isActive ? 'active' : ''}`}
      variants={stepVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      <div className="step-header">
        <span className="step-icon">{STEP_ICONS[step.id]}</span>
        <div className="step-titles">
          <h3 className="step-title">{step.title}</h3>
          <span className="step-subtitle">{step.subtitle}</span>
        </div>
      </div>

      <motion.div
        className="step-content"
        variants={contentVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.p variants={itemVariants}>
          {step.content}
        </motion.p>

        {/* Step-specific interactive elements */}
        {step.id === 'problem' && (
          <motion.div className="step-stats" variants={itemVariants}>
            <div className="stat-item">
              <span className="stat-value">15,000+</span>
              <span className="stat-label">Trucks Daily</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">#1</span>
              <span className="stat-label">Asthma Rate in NYC</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2.3x</span>
              <span className="stat-label">Avg Collision Rate</span>
            </div>
          </motion.div>
        )}

        {step.id === 'inference' && (
          <motion.div className="step-legend" variants={itemVariants}>
            <h5>Risk Classification</h5>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
                <span>Critical Risk</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#eab308' }} />
                <span>Elevated Risk</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
                <span>Managed Risk</span>
              </div>
            </div>
          </motion.div>
        )}

        {step.id === 'simulation' && (
          <motion.div className="step-legend" variants={itemVariants}>
            <h5>Agent Types</h5>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
                <span>Residents</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#3b82f6' }} />
                <span>Commuters</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
                <span>Trucks</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const TaxSlider = ({ value, onChange, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="tax-slider-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="slider-header">
            <label>Speed Tax Rate</label>
            <motion.span
              className="tax-value"
              key={value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              ${value}
            </motion.span>
          </div>

          <div className="slider-track-container">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="tax-slider"
            />
            <div className="slider-labels">
              <span>$0</span>
              <span>$25</span>
              <span>$50</span>
              <span>$75</span>
              <span>$100</span>
            </div>
          </div>

          <div className="tax-impact-preview">
            <div className="impact-item">
              <span className="impact-label">Est. Speed Reduction</span>
              <span className="impact-value">{Math.round(value * 0.15)} mph</span>
            </div>
            <div className="impact-item">
              <span className="impact-label">Est. Volume Reduction</span>
              <span className="impact-value">{Math.round(value * 0.4)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NavigationButtons = ({ currentStep, totalSteps, onPrev, onNext }) => {
  return (
    <div className="nav-buttons">
      <motion.button
        className="nav-btn prev"
        onClick={onPrev}
        disabled={currentStep === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>←</span>
        <span>Previous</span>
      </motion.button>

      <motion.button
        className="nav-btn next"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Next</span>
        <span>→</span>
      </motion.button>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ScrollyPanel = ({
  steps,
  currentStep,
  onStepChange,
  taxRate,
  onTaxChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const panelRef = useRef(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentStep < steps.length - 1) {
          onStepChange(currentStep + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          onStepChange(currentStep - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, steps.length, onStepChange]);

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <motion.div
      ref={panelRef}
      className={`scrolly-panel ${isExpanded ? 'expanded' : 'collapsed'}`}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toggle Button */}
      <motion.button
        className="panel-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isExpanded ? '◀' : '▶'}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="panel-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="panel-header">
              <h2>Taxing Speed</h2>
              <p className="panel-subtitle">South Bronx Traffic Analysis</p>
            </div>

            {/* Step Indicator */}
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={onStepChange}
            />

            {/* Current Step Content */}
            <div className="steps-container">
              <NarrativeStep
                step={steps[currentStep]}
                isActive={true}
              />
            </div>

            {/* Tax Slider (visible on intervention steps) */}
            <TaxSlider
              value={taxRate}
              onChange={onTaxChange}
              visible={currentStep >= 2}
            />

            {/* Navigation */}
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />

            {/* Footer */}
            <div className="panel-footer">
              <span className="keyboard-hint">
                Use ← → arrow keys to navigate
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScrollyPanel;
