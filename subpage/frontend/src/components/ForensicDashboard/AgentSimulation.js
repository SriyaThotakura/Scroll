/**
 * AgentSimulation - Agent-Based Model Engine
 *
 * Simulates behavior of different agent types in response to speed taxation:
 * - Residents: Local pedestrians and cyclists
 * - Commuters: Cars passing through the area
 * - Trucks: Commercial freight vehicles
 *
 * Each agent type has different behavioral rules and responses to taxation
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

// ==================== AGENT TYPES ====================
const AGENT_TYPES = {
  RESIDENT: 'resident',
  COMMUTER: 'commuter',
  TRUCK: 'truck'
};

// ==================== AGENT BEHAVIOR PARAMETERS ====================
const BEHAVIOR_PARAMS = {
  resident: {
    baseSpeed: 0.00002,          // Slowest - walking/cycling
    taxSensitivity: 0.1,          // Low - not directly affected by truck tax
    routeFlexibility: 0.9,        // High - knows local shortcuts
    spawnWeight: 0.4,             // 40% of agents
    color: '#22c55e',             // Green
    size: 6
  },
  commuter: {
    baseSpeed: 0.00008,           // Medium - driving cars
    taxSensitivity: 0.3,          // Medium - may avoid taxed zones
    routeFlexibility: 0.5,        // Medium - some route options
    spawnWeight: 0.35,            // 35% of agents
    color: '#3b82f6',             // Blue
    size: 8
  },
  truck: {
    baseSpeed: 0.00006,           // Medium-slow - heavy vehicles
    taxSensitivity: 0.9,          // High - directly affected by tax
    routeFlexibility: 0.2,        // Low - need specific routes
    spawnWeight: 0.25,            // 25% of agents
    color: '#ef4444',             // Red
    size: 12
  }
};

// ==================== ROUTE DEFINITIONS ====================
// Predefined routes through South Bronx
const ROUTES = {
  brucknerEast: [
    [-73.9300, 40.8050],
    [-73.9200, 40.8080],
    [-73.9100, 40.8100],
    [-73.9000, 40.8120],
    [-73.8900, 40.8140]
  ],
  brucknerWest: [
    [-73.8900, 40.8140],
    [-73.9000, 40.8120],
    [-73.9100, 40.8100],
    [-73.9200, 40.8080],
    [-73.9300, 40.8050]
  ],
  willisNorth: [
    [-73.9210, 40.7980],
    [-73.9210, 40.8030],
    [-73.9210, 40.8080],
    [-73.9210, 40.8130],
    [-73.9210, 40.8180]
  ],
  willisSouth: [
    [-73.9210, 40.8180],
    [-73.9210, 40.8130],
    [-73.9210, 40.8080],
    [-73.9210, 40.8030],
    [-73.9210, 40.7980]
  ],
  thirdAveNorth: [
    [-73.9134, 40.7950],
    [-73.9134, 40.8010],
    [-73.9134, 40.8070],
    [-73.9130, 40.8130]
  ],
  localLoop: [
    [-73.9150, 40.8040],
    [-73.9120, 40.8060],
    [-73.9100, 40.8050],
    [-73.9120, 40.8030],
    [-73.9150, 40.8040]
  ],
  industrialRoute: [
    [-73.9000, 40.8100],
    [-73.8950, 40.8120],
    [-73.8900, 40.8140],
    [-73.8850, 40.8160]
  ]
};

// Tax zone definitions (for behavior modification)
const TAX_ZONES = [
  {
    name: 'School Zone',
    bounds: [[-73.9180, 40.8020], [-73.9080, 40.8100]],
    multiplier: 1.5  // 150% tax rate
  },
  {
    name: 'Residential',
    bounds: [[-73.9250, 40.8030], [-73.9180, 40.8080]],
    multiplier: 1.0  // Standard tax rate
  },
  {
    name: 'Industrial',
    bounds: [[-73.9000, 40.8080], [-73.8900, 40.8160]],
    multiplier: 0.5  // 50% tax rate (encouraged)
  }
];

// ==================== AGENT CLASS ====================
class Agent {
  constructor(id, type, startPosition, route) {
    this.id = id;
    this.type = type;
    this.params = BEHAVIOR_PARAMS[type];
    this.route = route;
    this.routeIndex = 0;
    this.position = { lng: startPosition[0], lat: startPosition[1] };
    this.heading = 0;
    this.speed = this.params.baseSpeed;
    this.active = true;
    this.inTaxZone = false;
    this.currentZoneTax = 0;
    this.behaviorState = 'normal'; // 'normal' | 'rerouting' | 'slowing' | 'stopped'
  }

  /**
   * Update agent position and behavior based on tax rate
   */
  update(taxRate, deltaTime = 16) {
    if (!this.active) return;

    // Check if in tax zone
    this.checkTaxZone(taxRate);

    // Update behavior based on tax zone
    this.updateBehavior(taxRate);

    // Move towards next waypoint
    this.moveTowardsTarget(deltaTime);

    // Check if reached destination
    if (this.routeIndex >= this.route.length - 1) {
      this.active = false;
    }
  }

  /**
   * Check if agent is in a tax zone and calculate effective tax
   */
  checkTaxZone(baseTaxRate) {
    this.inTaxZone = false;
    this.currentZoneTax = 0;

    for (const zone of TAX_ZONES) {
      if (
        this.position.lng >= zone.bounds[0][0] &&
        this.position.lng <= zone.bounds[1][0] &&
        this.position.lat >= zone.bounds[0][1] &&
        this.position.lat <= zone.bounds[1][1]
      ) {
        this.inTaxZone = true;
        this.currentZoneTax = baseTaxRate * zone.multiplier;
        break;
      }
    }
  }

  /**
   * Update agent behavior based on tax impact
   */
  updateBehavior(taxRate) {
    const taxImpact = (this.currentZoneTax / 100) * this.params.taxSensitivity;

    if (this.type === AGENT_TYPES.TRUCK) {
      // Trucks respond strongly to tax
      if (taxImpact > 0.5) {
        this.behaviorState = 'rerouting';
        this.speed = this.params.baseSpeed * 0.5; // Slow while deciding
      } else if (taxImpact > 0.3) {
        this.behaviorState = 'slowing';
        this.speed = this.params.baseSpeed * (1 - taxImpact * 0.8);
      } else {
        this.behaviorState = 'normal';
        this.speed = this.params.baseSpeed;
      }
    } else if (this.type === AGENT_TYPES.COMMUTER) {
      // Commuters have moderate response
      if (taxImpact > 0.4) {
        this.behaviorState = 'rerouting';
        this.speed = this.params.baseSpeed * 0.7;
      } else {
        this.behaviorState = 'normal';
        this.speed = this.params.baseSpeed * (1 - taxImpact * 0.3);
      }
    } else {
      // Residents largely unaffected by truck tax
      this.behaviorState = 'normal';
      // But they benefit from reduced traffic (slightly faster)
      const trafficReduction = taxRate / 100 * 0.2;
      this.speed = this.params.baseSpeed * (1 + trafficReduction);
    }
  }

  /**
   * Move agent towards next waypoint
   */
  moveTowardsTarget(deltaTime) {
    if (this.routeIndex >= this.route.length - 1) return;

    const target = this.route[this.routeIndex + 1];
    const dx = target[0] - this.position.lng;
    const dy = target[1] - this.position.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate heading
    this.heading = Math.atan2(dy, dx) * (180 / Math.PI);

    // Move towards target
    const moveDistance = this.speed * (deltaTime / 16);

    if (distance < moveDistance) {
      // Reached waypoint, move to next
      this.position.lng = target[0];
      this.position.lat = target[1];
      this.routeIndex++;
    } else {
      // Continue towards waypoint
      const ratio = moveDistance / distance;
      this.position.lng += dx * ratio;
      this.position.lat += dy * ratio;
    }
  }

  /**
   * Get agent data for rendering
   */
  toRenderData() {
    return {
      id: this.id,
      type: this.type,
      lng: this.position.lng,
      lat: this.position.lat,
      heading: this.heading,
      color: this.params.color,
      size: this.params.size,
      state: this.behaviorState,
      inTaxZone: this.inTaxZone
    };
  }
}

// ==================== SIMULATION ENGINE ====================
class SimulationEngine {
  constructor(bounds, onUpdate) {
    this.bounds = bounds;
    this.onUpdate = onUpdate;
    this.agents = [];
    this.taxRate = 25;
    this.running = false;
    this.agentIdCounter = 0;
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000; // Spawn new agents every 2 seconds
    this.maxAgents = 50;
  }

  /**
   * Start the simulation
   */
  start() {
    this.running = true;
    this.lastUpdateTime = performance.now();
    this.tick();
  }

  /**
   * Stop the simulation
   */
  stop() {
    this.running = false;
  }

  /**
   * Update tax rate (triggers behavior changes)
   */
  setTaxRate(rate) {
    this.taxRate = rate;
  }

  /**
   * Main simulation loop
   */
  tick = () => {
    if (!this.running) return;

    const now = performance.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    // Spawn new agents periodically
    if (now - this.lastSpawnTime > this.spawnInterval && this.agents.length < this.maxAgents) {
      this.spawnAgent();
      this.lastSpawnTime = now;
    }

    // Update all agents
    this.agents.forEach(agent => agent.update(this.taxRate, deltaTime));

    // Remove inactive agents
    this.agents = this.agents.filter(agent => agent.active);

    // Send update to React component
    if (this.onUpdate) {
      const renderData = this.agents.map(agent => agent.toRenderData());
      this.onUpdate(renderData);
    }

    // Schedule next tick
    requestAnimationFrame(this.tick);
  }

  /**
   * Spawn a new agent with random type and route
   */
  spawnAgent() {
    // Determine agent type based on weights
    const random = Math.random();
    let type;
    let cumulativeWeight = 0;

    for (const [agentType, params] of Object.entries(BEHAVIOR_PARAMS)) {
      cumulativeWeight += params.spawnWeight;
      if (random < cumulativeWeight) {
        type = agentType;
        break;
      }
    }

    // Select route based on agent type
    const route = this.selectRouteForType(type);

    // Create agent
    const agent = new Agent(
      `agent-${this.agentIdCounter++}`,
      type,
      route[0],
      route
    );

    this.agents.push(agent);
  }

  /**
   * Select appropriate route for agent type
   */
  selectRouteForType(type) {
    const routeKeys = Object.keys(ROUTES);
    let availableRoutes;

    switch (type) {
      case AGENT_TYPES.TRUCK:
        // Trucks prefer main corridors
        availableRoutes = ['brucknerEast', 'brucknerWest', 'industrialRoute'];
        break;
      case AGENT_TYPES.COMMUTER:
        // Commuters use various routes
        availableRoutes = ['brucknerEast', 'brucknerWest', 'willisNorth', 'willisSouth', 'thirdAveNorth'];
        break;
      case AGENT_TYPES.RESIDENT:
        // Residents use local routes
        availableRoutes = ['localLoop', 'thirdAveNorth', 'willisNorth'];
        break;
      default:
        availableRoutes = routeKeys;
    }

    const selectedKey = availableRoutes[Math.floor(Math.random() * availableRoutes.length)];
    return [...ROUTES[selectedKey]]; // Return copy of route
  }

  /**
   * Get current statistics
   */
  getStatistics() {
    const stats = {
      total: this.agents.length,
      byType: {
        resident: 0,
        commuter: 0,
        truck: 0
      },
      byState: {
        normal: 0,
        rerouting: 0,
        slowing: 0
      },
      inTaxZone: 0
    };

    this.agents.forEach(agent => {
      stats.byType[agent.type]++;
      stats.byState[agent.behaviorState]++;
      if (agent.inTaxZone) stats.inTaxZone++;
    });

    return stats;
  }
}

// ==================== REACT COMPONENT ====================
const AgentSimulation = forwardRef(({
  running,
  taxRate,
  bounds,
  onAgentUpdate
}, ref) => {
  const engineRef = useRef(null);

  // Initialize simulation engine
  useEffect(() => {
    engineRef.current = new SimulationEngine(bounds, onAgentUpdate);

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [bounds, onAgentUpdate]);

  // Handle running state changes
  useEffect(() => {
    if (!engineRef.current) return;

    if (running) {
      engineRef.current.start();
    } else {
      engineRef.current.stop();
    }
  }, [running]);

  // Handle tax rate changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTaxRate(taxRate);
    }
  }, [taxRate]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    updateTaxRate: (rate) => {
      if (engineRef.current) {
        engineRef.current.setTaxRate(rate);
      }
    },
    getStatistics: () => {
      if (engineRef.current) {
        return engineRef.current.getStatistics();
      }
      return null;
    },
    pause: () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    },
    resume: () => {
      if (engineRef.current) {
        engineRef.current.start();
      }
    }
  }));

  // This component doesn't render anything visible
  return null;
});

AgentSimulation.displayName = 'AgentSimulation';

export default AgentSimulation;
export { AGENT_TYPES, BEHAVIOR_PARAMS, SimulationEngine };
