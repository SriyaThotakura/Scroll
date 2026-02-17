# Taxing Speed
## A Multi-Method Urban Planning Tool for the South Bronx

---

## The Problem

**The South Bronx bears a disproportionate burden of freight traffic.**

| Statistic | Value |
|-----------|-------|
| Daily truck crossings | 15,000+ |
| Asthma hospitalization rate | **#1 in NYC** |
| Pedestrian collision rate | 2.3x city average |
| Primary affected area | Mott Haven / Port Morris |

The neighborhood serves as a throughway for trucks traveling between New Jersey, Manhattan, and Long Island—communities that receive the economic benefit while the South Bronx absorbs the health and safety costs.

---

## The Intervention: Speed Taxation

**What if we could price the externality?**

A graduated speed tax on freight corridors that:
- Discourages cut-through truck traffic
- Reduces speeds in vulnerable areas (schools, residential)
- Generates revenue for local air quality improvements
- Creates data for evidence-based policy

---

## Product Architecture: Three Layers

### Layer 1: Inference
> *Replacing static GIS with activity-based risk modeling*

- Identifies high-risk corridors based on **pedestrian density vs. truck intensity**
- Visual output: Color-coded risk corridors (red → green)
- Toggle between traditional GIS view and model output

### Layer 2: Simulation
> *Agent-Based Modeling of behavioral response*

Three agent types with different responses to taxation:
| Agent | Tax Sensitivity | Behavior |
|-------|-----------------|----------|
| 🟢 Residents | Low | Benefit from reduced traffic |
| 🔵 Commuters | Medium | May reroute around tax zones |
| 🔴 Trucks | High | Reroute, slow down, or pay |

### Layer 3: Forensic / Counterfactual
> *"What if the tax had been in place?"*

- Select historical collision events
- Rewind timeline to moment of impact
- Adjust tax rate to see counterfactual probability
- Quantify lives that could have been protected

---

## What's Been Built

### 1. Main Scrollytelling Page (`index.html`)
- Mapbox-powered narrative scroll experience
- Animated truck flow visualization on priority corridors
- Introduces the problem and model

### 2. Policy Simulator (`/`)
- Interactive tax slider ($0 - $100)
- Real-time impact metrics:
  - Trucks diverted
  - PM2.5 reduction
  - Health outcomes improved
  - CO₂ equivalent saved
- Leaflet map with Heat Vulnerability Index overlay
- Bilingual (English/Spanish)

### 3. Forensic Dashboard (`/forensic`)
- 5-step scrollytelling narrative panel
- Mapbox GL with multiple data layers
- Agent-Based Simulation engine
- Before/After comparison toggle
- Forensic mode with counterfactual graphs

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Main page | Vanilla JS, Mapbox GL, Scrollama, Turf.js |
| Policy Simulator | React, Leaflet, Recharts |
| Forensic Dashboard | React, Mapbox GL, Framer Motion |
| Backend API | Python FastAPI, TensorFlow (LSTM), scikit-learn |
| Deployment | GitHub Pages (frontend), Render (backend) |

---

## Data Status: Real vs. Prototype

### Policy Simulator (Real ML Backend)
| Element | Status |
|---------|--------|
| LSTM Traffic Prediction | ✅ Real trained model |
| Hidden Markov Model | ✅ Real environmental state model |
| Monte Carlo Simulation | ✅ Real uncertainty quantification |
| Health impact formulas | ✅ Based on EPA research |
| Map geography | ✅ Real (Leaflet + OpenStreetMap) |

### Forensic Dashboard (UI Prototype)
| Element | Status |
|---------|--------|
| Map geography | ✅ Real (Mapbox) |
| South Bronx corridors | ✅ Real locations |
| Agent simulation | ⚠️ Behavioral rules (theoretical) |
| Accident database | ⚠️ Placeholder (needs Vision Zero data) |
| Risk corridors | ⚠️ Formula-based (could connect to backend) |

**The UI demonstrates the full vision. Data integration is the next phase.**

---

## Data Sets

### Currently Integrated

| Dataset | Source | Usage |
|---------|--------|-------|
| Mapbox Base Tiles | Mapbox API | Map rendering, street network, satellite imagery |
| South Bronx Geography | OpenStreetMap via Mapbox | Corridor locations (Bruckner Blvd, Willis Ave, 3rd Ave) |
| UHF District Boundaries | NYC DOHMH | Health district overlay (UHF 402 - Soundview) |

### Referenced / Estimated (Placeholder Values)

| Dataset | Current State | Real Source |
|---------|---------------|-------------|
| Truck Traffic Volumes | Hardcoded (15,000/day estimate) | NYC DOT Traffic Volume Counts |
| Corridor Risk Scores | Formula-based calculation | Needs trained ML model |
| Accident Records | 4 simulated incidents | NYC Vision Zero / NYPD Crash Data |
| PM2.5 Baseline | Estimated values | EPA Air Quality System (AQS) |
| Asthma Hospitalization | Statistics cited | NYC Community Health Survey |
| Heat Vulnerability Index | Referenced in UI | NYC DOHMH HVI Dataset |

### Health Impact Formulas (Evidence-Based)

| Metric | Source | Formula Basis |
|--------|--------|---------------|
| PM2.5 per truck | EPA Mobile Source Emissions | 0.12 µg/m³ per 1,000 trucks |
| Asthma concentration-response | Khreis et al. (2017) | 2.2% risk reduction per µg/m³ |
| Freight demand elasticity | FHWA research | -0.4 (inelastic) |

### Recommended for Integration (NYC Open Data)

| Dataset | URL | Records |
|---------|-----|---------|
| Motor Vehicle Collisions | [NYC Open Data](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95) | 2M+ crashes |
| Traffic Volume Counts | [NYC DOT](https://data.cityofnewyork.us/Transportation/Traffic-Volume-Counts/btm5-ppia) | 16K+ counts |
| Air Quality Data | [EPA AQS](https://www.epa.gov/aqs) | Continuous monitoring |
| Community Health Survey | [NYC EPIQUERY](https://a816-health.nyc.gov/hdi/epiquery/) | By UHF district |

---

## Key Design Decisions

1. **Scrollytelling as pedagogy** — Users learn the problem before interacting with the tool
2. **Counterfactual framing** — "What if?" is more compelling than "What is"
3. **Multi-agent perspective** — Shows policy affects different groups differently
4. **Bilingual by default** — Serves the actual community (60%+ Spanish-speaking)

---

## Questions the Tool Answers

1. **Where** should speed taxes be applied? (Inference layer)
2. **How** will different users respond? (Simulation layer)
3. **What** could have been prevented? (Forensic layer)
4. **How much** tax creates meaningful change? (Interactive slider)

---

## Next Steps

- [ ] Integrate NYC Vision Zero crash data (real accidents)
- [ ] Connect to NYC DOT traffic count API
- [ ] Train actual risk model on historical data
- [ ] User testing with South Bronx community members
- [ ] Add revenue projection calculator
- [ ] Mobile-responsive refinements

---

## Live URLs

| Environment | URL |
|-------------|-----|
| Main Page | https://sriyathotakura.github.io/Scroll/ |
| Policy Simulator | https://sriyathotakura.github.io/Scroll/subpage/frontend/build/ |
| Backend API | https://scroll-y8wn.onrender.com |

---

## One-Liner

> **Taxing Speed** is a computational urban design tool that models how speed taxation could reduce truck-pedestrian collisions in the South Bronx, using agent-based simulation and counterfactual analysis to make the case for policy intervention.

---

*Capstone Project — Computational Urban Design*
