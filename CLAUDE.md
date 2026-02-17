# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Taxing Speed** (also known as "CROSS BRONX: Concrete Severance") is a computational urban design tool that models how speed/freight taxation could reduce truck-pedestrian collisions and pollution in the South Bronx. The project uses agent-based simulation, LSTM neural networks, and counterfactual analysis to make the case for policy intervention.

The tool has three main components:
1. **Root Scrollytelling Page** - Mapbox-powered narrative introducing the problem
2. **Policy Simulator** (`/subpage/frontend`) - Interactive React app with ML-powered tax impact calculations
3. **Forensic Dashboard** - Agent-based simulation for counterfactual "what if" analysis

## Architecture

### Three-Layer Model

1. **Inference Layer**: Identifies high-risk corridors based on pedestrian density vs. truck intensity
2. **Simulation Layer**: Agent-based modeling with three agent types (Residents, Commuters, Trucks) responding differently to taxation
3. **Forensic/Counterfactual Layer**: Historical event analysis showing what could have been prevented

### Tech Stack

**Root Level (Main Scrollytelling Page)**
- Vanilla JavaScript with Mapbox GL JS v2.15.0
- Scrollama for scroll-driven animations
- Turf.js for geospatial calculations
- Files: `index.html`, `script.js`, `style.css`

**Subpage (Policy Simulator & Forensic Dashboard)**
- Frontend: React 18 with react-router-dom for multi-page navigation
- Mapping: Leaflet + react-leaflet, Mapbox GL
- Visualization: Recharts for charts, Framer Motion for animations
- Backend: Python FastAPI with CORS enabled
- ML Models: TensorFlow 2.15 LSTM, scikit-learn, hmmlearn (Hidden Markov Models)
- Data fetching: Socrata Open Data API (sodapy)

**Deployment**
- Frontend: GitHub Pages (entire repo deployed as static site)
- Backend: Render (https://scroll-y8wn.onrender.com)
- Build artifacts: `subpage/frontend/build/` is committed to git (required for GitHub Pages)

## Common Development Commands

### Backend Development

```bash
# Start backend server
cd subpage/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### Frontend Development

```bash
# Start React development server
cd subpage/frontend
npm install
npm start
# Runs on http://localhost:3000

# Build for production
npm run build
# Output goes to subpage/frontend/build/

# Run tests
npm test
```

### Root Page Development

The root-level scrollytelling page (`index.html`) is static and doesn't require a build step. Open it directly in a browser or serve it with:

```bash
# Simple HTTP server (from root directory)
python -m http.server 8080
# or
npx serve
```

## Backend API Endpoints

**Base URL (Production)**: `https://scroll-y8wn.onrender.com`
**Base URL (Local)**: `http://localhost:8000`

Key endpoints:
- `GET /` - Health check
- `GET /baseline` - Current environmental/health metrics for UHF District 402
- `POST /simulate` - Calculate freight tax impact (requires `{"tax_amount": float}`)
- `GET /assumptions` - Model assumptions and limitations
- `GET /geojson/soundview` - GeoJSON for Soundview ZIP codes (10473, 10474)

Full API specification: `subpage/API_SPECIFICATION.md`

## Key Model Constants

Located in `subpage/backend/main.py`:

```python
ELASTICITY_OF_DEMAND = -0.4  # Price elasticity of freight demand
BASELINE_DAILY_TRUCKS = 5200  # Trucks per day on Cross-Bronx Expressway
PM25_PER_1000_TRUCKS_REDUCTION = 0.12  # µg/m³ per 1000 trucks removed
BASELINE_PM25 = 13.2  # Current PM2.5 in UHF 402 (µg/m³)
BASELINE_ASTHMA_ER_VISITS = 340  # Annual pediatric asthma ER visits
```

## Important File Locations

### React Frontend Components

```
subpage/frontend/src/
├── App.js                              # Main Policy Simulator page
├── AppRouter.js                        # React Router configuration
├── components/
│   ├── ForensicDashboard/
│   │   ├── Dashboard.js                # Main forensic dashboard entry point
│   │   ├── ScrollyPanel.js             # 5-step scrollytelling narrative
│   │   ├── AgentSimulation.js          # Agent-based simulation engine
│   │   ├── ForensicMode.js             # Counterfactual analysis UI
│   │   ├── ComparisonToggle.js         # Before/After comparison
│   │   └── MetricsPanel.js             # Live metrics display
│   ├── ForensicGame/
│   │   ├── ForensicGame.js             # Gaming-style forensic investigation (4 levels)
│   │   └── ForensicGame.css            # Diegetic UI, HUD, glitch effects, gaming styles
│   ├── TrafficPredictionChart.js       # LSTM prediction visualization
│   ├── NeuralNetworkViz.js             # Neural network architecture display
│   ├── ScenarioComparison.js           # Multi-scenario comparison
│   ├── SystemStateTimeline.js          # HMM state timeline
│   └── ZoneDetailPanel.js              # Geographic zone details
```

### Backend ML Modules

```
subpage/backend/
├── main.py                     # FastAPI server & endpoints
├── lstm_model.py               # LSTM traffic prediction model
├── analytics.py                # Advanced analytics & Monte Carlo simulation
├── data_fetcher.py             # NYC Open Data API integration
└── requirements.txt            # Python dependencies
```

### Data Files

```
data/
├── Geojson/                    # GeoJSON boundaries
├── hvi-nta-2020.csv           # Heat Vulnerability Index data
└── WhatsApp Image *.jpeg      # Visual assets (environmental impact)
```

## Forensic Game Mode

The project includes an interactive gaming-style interface at `/forensic-game` that transforms the pollution analysis into a 4-level forensic investigation experience inspired by Detroit: Become Human and Cyberpunk 2077.

**Route:** `subpage/frontend/src/components/ForensicGame/`

### Four-Level Structure

1. **Level 1: Mission Briefing**
   - Typewriter text introduction with satellite imagery background
   - CRT scanline effects and targeting reticle overlay
   - Hold-to-proceed button (3 seconds) for intentional user action
   - Files: Uses Google Earth satellite images from `public/forensic-assets/`

2. **Level 2: Simulation HUD (Video + Overlay)**
   - Main simulation video with diegetic HUD overlay
   - Components:
     - Toxicity Meter (top right) - fills based on video progress
     - System Logs (bottom left) - timestamped messages
     - Recording indicator, frame counter
     - Speed control slider (0.25x - 2.0x) affecting video playback
   - Quick Time Event: User must capture evidence when breach detected
   - Breach timing configurable (default: 8-10 seconds into video)

3. **Level 3: Debrief Screen (Data Analysis)**
   - Animated risk score bars (State A vs State B)
   - "Casualty Report" style data cards
   - Congested: 0.90 risk (90% bar) vs Optimized: 0.20 risk (20% bar)
   - Evidence capture status indicator

4. **Level 4: Decision Screen**
   - Two choice cards: [A] Status Quo (Fail) vs [B] Variable Speed Limits (Win)
   - Result screen with mission success/failure feedback
   - Return to main site link

### Key Gaming UI Elements

**Diegetic Interface Design:**
- HUD elements feel part of the investigation world
- Monospace fonts (JetBrains Mono)
- Color scheme: Green (briefing), Cyan (HUD), Red (danger), Teal (success)
- All UI styled with `border-2`, `tracking-widest`, `bg-black/90`

**Visual Effects:**
```css
- Scanline overlay (repeating-linear-gradient animation)
- CRT noise filter
- Glitch effects during critical moments (toxicity > 80%)
- Pulse animations on threat indicators
- Targeting reticles with animated rings
```

**Required Assets:**
- `public/forensic-assets/ezgif.com-split.mp4` - Main simulation video
- `public/forensic-assets/bruckner-overview.jpg` - Satellite imagery
- `public/forensic-assets/*.jpg` - Additional satellite views

### Usage & Customization

**Add to AppRouter.js:**
```javascript
import ForensicGame from './components/ForensicGame/ForensicGame';
<Route path="/forensic-game" element={<ForensicGame />} />
```

**Key Customization Points:**
- Video breach timing: Line ~250 in `SimulationHUD` component
- Risk score values: Line ~85 in `DebriefScreen` component
- System log messages: `logMessages` object in `SimulationHUD`
- Color scheme: CSS variables in `ForensicGame.css`

**Dependencies:**
- Framer Motion (for level transitions and animations)
- React Router DOM (for navigation)

See `FORENSIC_ANALYSIS_INTEGRATION.md` for full setup guide.

## Bilingual Support

The Policy Simulator (`subpage/frontend/src/App.js`) has built-in English/Spanish translations via the `translations` object. All UI strings should be added to both `en` and `es` objects to maintain bilingual support for the Soundview community (60%+ Spanish-speaking).

## API Integration Pattern

Frontend calls backend API with fetch:

```javascript
// Example from App.js
const API_URL = 'https://scroll-y8wn.onrender.com';  // Production
// const API_URL = 'http://localhost:8000';          // Development

fetch(`${API_URL}/simulate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tax_amount: 35 })
})
  .then(r => r.json())
  .then(data => {
    // Update state with trucks_diverted, pm25_reduction, etc.
  });
```

## Mapbox Configuration

Both the root page and Forensic Dashboard use Mapbox GL JS. The access token is hardcoded in:
- `script.js` (line 2)
- `subpage/frontend/src/components/ForensicDashboard/Dashboard.js`

When working with map features, note:
- Basemap: `mapbox://styles/mapbox/light-v11` (or dark-v11 for dark mode)
- Center coordinates: `[-73.8667, 40.8250]` (Soundview, Bronx)
- Key data sources: NYC EHDP GitHub (HVI data), NYC DOT (traffic), Vision Zero (crashes)

## Data Sources & APIs

**NYC Health (EHDP)**
- HVI GeoJSON: `https://raw.githubusercontent.com/nychealth/EHDP-data/production/geography/UHF42.geojson`
- HVI Values: `https://raw.githubusercontent.com/nychealth/EHDP-data/production/indicators/data/2418.json`

**NYC Open Data** (via Socrata API)
- Traffic speeds, truck routes, motor vehicle collisions
- Asthma rates, air quality data

Fetch pattern in `script.js`:
```javascript
const [geoResponse, hviResponse] = await Promise.all([
  fetch('geography_url'),
  fetch('data_url')
]);
```

## Known Prototype Limitations

From `DESK_CRIT.md`:

**Real Data:**
- LSTM traffic prediction model (trained)
- HMM environmental state model
- Health impact formulas (EPA-based)
- Map geography (real coordinates)

**Prototype/Placeholder:**
- Agent simulation behavioral rules (theoretical, not empirically validated)
- Accident database (needs integration with NYC Vision Zero data)
- Risk corridor scoring (formula-based, could connect to backend ML)

## Deployment Notes

### GitHub Pages Deployment

The GitHub Actions workflow (`.github/workflows/static.yml`) automatically deploys on push to `main`. The entire repo is deployed, so both the root `index.html` and `subpage/frontend/build/` are accessible.

**Important**: `subpage/frontend/build/` must be committed to git (it's excluded from `.gitignore`). After making React changes:

```bash
cd subpage/frontend
npm run build
git add build/
git commit -m "Update React build"
git push
```

### Backend Deployment (Render)

The backend is deployed to Render using:
- `subpage/backend/render.yaml` - Render configuration
- `subpage/backend/runtime.txt` - Python version (3.11)
- `subpage/backend/requirements.txt` - Dependencies

Environment variables are set in Render dashboard (not in repo).

## Navigation Between Pages

The root scrollytelling page links to the Policy Simulator. The Policy Simulator has an embedded link to the Forensic Dashboard:

- Root: `https://sriyathotakura.github.io/Scroll/`
- Policy Simulator: `https://sriyathotakura.github.io/Scroll/subpage/frontend/build/`
- Forensic Dashboard: Navigate via React Router at `/forensic`

React routing is configured in `subpage/frontend/src/AppRouter.js`.

## Development Workflow

1. **Backend changes**: Edit files in `subpage/backend/`, test locally with `python main.py`, then deploy to Render
2. **React frontend changes**: Edit in `subpage/frontend/src/`, test with `npm start`, build with `npm run build`, commit build artifacts
3. **Root page changes**: Edit `script.js`/`index.html` directly, test locally, push to trigger GitHub Pages deployment

## Important Constraints

- The backend uses TensorFlow 2.15 (compatibility with Python 3.11)
- Mapbox GL JS version pinned to v2.15.0 (check for breaking changes if upgrading)
- React Scripts 5.0.1 (Create React App, not ejected)
- CORS is enabled on backend for all origins (`allow_origins=["*"]`)
- UHF District 402 (Hunts Point/Mott Haven) is the primary geographic focus
