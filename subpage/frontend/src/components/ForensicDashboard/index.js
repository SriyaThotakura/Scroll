/**
 * ForensicDashboard - Export Index
 *
 * Central export point for all forensic dashboard components
 */

export { default as Dashboard } from './Dashboard';
export { default as AgentSimulation, AGENT_TYPES, BEHAVIOR_PARAMS, SimulationEngine } from './AgentSimulation';
export { default as ForensicMode, ACCIDENT_DATABASE, calculateCounterfactual } from './ForensicMode';
export { default as ScrollyPanel } from './ScrollyPanel';
export { default as ComparisonToggle } from './ComparisonToggle';
export { default as MetricsPanel } from './MetricsPanel';

// Default export is the main Dashboard component
export { default } from './Dashboard';
