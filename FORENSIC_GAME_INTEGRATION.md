# Forensic Game Mode - Integration Guide

## 🎮 What You've Built

A fully interactive, gaming-style forensic investigation interface with:
- **Level 1**: Mission Briefing with satellite imagery and targeting reticle
- **Level 2**: Video simulation with HUD overlay, toxicity meter, and system logs
- **Level 3**: Data debrief with animated risk scores and comparison
- **Level 4**: Decision interface with win/fail states

## 📁 Files Created

1. `subpage/frontend/src/components/ForensicGame/ForensicGame.js` - Main React component
2. `subpage/frontend/src/components/ForensicGame/ForensicGame.css` - All gaming styles

## 🚀 Integration Steps

### Step 1: Update AppRouter.js

Add the new route to your existing `subpage/frontend/src/AppRouter.js`:

```javascript
import ForensicGame from './components/ForensicGame/ForensicGame';

// Inside your Routes:
<Route path="/forensic-game" element={<ForensicGame />} />
```

### Step 2: Add Navigation Link

From your main Policy Simulator or Forensic Dashboard, add a link:

```javascript
import { Link } from 'react-router-dom';

<Link to="/forensic-game">
  <button className="game-mode-btn">
    🎮 ENTER FORENSIC GAME MODE
  </button>
</Link>
```

### Step 3: Required Assets Setup

Create the forensic-assets directory if it doesn't exist:

```bash
mkdir -p subpage/frontend/public/forensic-assets
```

**Copy these files:**
1. `ezgif.com-split.mp4` → `subpage/frontend/public/forensic-assets/`
2. Your Google Earth satellite image → `subpage/frontend/public/forensic-assets/bruckner-overview.jpg`

**If you don't have satellite images yet:**
- The component will still work with a dark background
- You can add them later by updating the `satellite-bg` CSS class

### Step 4: Install Required Dependencies

Make sure you have Framer Motion installed:

```bash
cd subpage/frontend
npm install framer-motion
```

### Step 5: Test Locally

```bash
cd subpage/frontend
npm start
```

Navigate to: `http://localhost:3000/forensic-game`

## 🎨 Customization Guide

### Change Colors

Edit `ForensicGame.css`:
- Briefing screen (green): Search for `#00ff00`
- HUD overlay (cyan): Search for `#00ffff`
- Danger/Critical (red): Search for `#ff0000`
- Success (teal): Search for `#22d3a5`

### Adjust Video Timing

In `ForensicGame.js`, find the `SimulationHUD` component:

```javascript
// Breach detection timing (currently 8-10 seconds)
if (time >= 8 && time <= 10 && !breachDetected) {
  setBreachDetected(true);
  // ...
}
```

Change `8` and `10` to match when your video shows pollution hitting buildings.

### Modify System Logs

In `SimulationHUD`, find `logMessages`:

```javascript
const logMessages = {
  0: "INITIALIZING SENSOR ARRAY...",
  3: "WARNING: VELOCITY DROPPING",
  5: "CRITICAL: TRAFFIC SPEED 5 MPH",
  // Add more timestamped messages here
};
```

### Update Data Values

In `DebriefScreen`, change the risk scores:

```javascript
// Congested state (currently 90%)
setCongestedValue(90);

// Optimized state (currently 20%)
setOptimizedValue(20);
```

## 🎯 Key Features Explained

### 1. Hold-to-Proceed Button
The briefing screen requires a 3-second hold to proceed - this adds weight to the user's action.

### 2. Speed Control Slider
The video playback speed slider simulates different traffic conditions:
- 0.25x = Severely congested
- 1.0x = Normal
- 2.0x = Free flowing

### 3. Evidence Capture QTE
When breach is detected, the user must click to "capture evidence" - this is a Quick Time Event borrowed from gaming.

### 4. Toxicity Meter
Auto-fills based on video progress, creating tension as it rises.

### 5. Animated Risk Bars
Use CSS transitions with "easing" to make data feel dynamic.

## 🔧 Advanced Enhancements

### Add Sound Effects

```javascript
// In SimulationHUD, add:
const breachSound = new Audio('/forensic-assets/breach-alarm.mp3');

// When breach detected:
if (time >= 8 && !breachDetected) {
  breachSound.play();
  setBreachDetected(true);
}
```

### Connect to Backend API

Replace static values with your backend data:

```javascript
// In DebriefScreen:
useEffect(() => {
  fetch('https://scroll-y8wn.onrender.com/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tax_amount: gameState.taxAmount || 35 })
  })
    .then(r => r.json())
    .then(data => {
      setCongestedValue(data.baseline_risk * 100);
      setOptimizedValue(data.optimized_risk * 100);
    });
}, []);
```

### Add Google Earth Integration

If you want to load your GeoJSON files:

```javascript
import { useEffect, useState } from 'react';

const [asthmaData, setAsthmaData] = useState(null);

useEffect(() => {
  fetch('/Asthma_Index_Rates.geojson')
    .then(r => r.json())
    .then(data => {
      setAsthmaData(data);
      // Use this data in your briefing or debrief screens
    });
}, []);
```

## 🎮 Gaming UI Principles Used

1. **Diegetic Interface**: HUD elements feel like part of the forensic investigation world
2. **Progressive Disclosure**: Information revealed step-by-step
3. **Player Agency**: User makes meaningful choices (Level 4)
4. **Feedback Loops**: Visual/textual responses to all actions
5. **Tension Building**: Toxicity meter, system logs, breach warnings
6. **Narrative Framing**: Everything is part of a "mission"

## 🐛 Troubleshooting

**Video doesn't play:**
- Check the path: `/forensic-assets/ezgif.com-split.mp4`
- Ensure the video file is in the `public` folder, not `src`

**Styles not loading:**
- Make sure you import the CSS: `import './ForensicGame.css'`
- Clear your browser cache

**Framer Motion animations not working:**
- Run `npm install framer-motion`
- Restart your dev server

**Glitch effects too intense:**
- Reduce opacity in `.glitch-overlay` class
- Lower animation speed in `@keyframes glitch`

## 📊 Using with Your Data

### Integrate GeoJSON Layers

```javascript
// Example: Show Asthma Index on briefing screen
import AsthmaData from '../../../Asthma_Index_Rates.geojson';

const MissionBriefing = ({ onComplete }) => {
  const highRiskZones = AsthmaData.features.filter(
    f => f.properties.asthmaRate > threshold
  );

  return (
    // Display high-risk zone count in briefing text
    <div>TARGET ZONES: {highRiskZones.length} HIGH-RISK AREAS</div>
  );
};
```

### Connect to LSTM Model

```javascript
// In Level 2, use real-time LSTM predictions
const [lstmPrediction, setLstmPrediction] = useState(null);

useEffect(() => {
  const interval = setInterval(() => {
    fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: JSON.stringify({
        speed: currentSpeed,
        timestamp: currentTime
      })
    })
      .then(r => r.json())
      .then(data => {
        setToxicityMeter(data.pm25_level);
      });
  }, 1000);

  return () => clearInterval(interval);
}, [currentSpeed]);
```

## 🚀 Next Steps

1. ✅ Test all four levels
2. ✅ Add your satellite imagery
3. ✅ Customize colors to match your brand
4. ✅ Connect to your backend API
5. ✅ Add sound effects (optional but impactful!)
6. ✅ Deploy to GitHub Pages

## 📝 Notes

- The component is **fully self-contained** - no external dependencies except Framer Motion
- All animations use **CSS** for performance
- Works on **mobile** (with responsive breakpoints)
- **Accessibility**: Can add keyboard navigation if needed

## 🎯 Final Result

Users will experience your pollution analysis as:
1. A classified briefing
2. A live forensic investigation
3. A data-driven casualty report
4. A high-stakes decision

This transforms passive data consumption into active engagement.

---

**Questions?** Check the inline comments in `ForensicGame.js` for detailed explanations of each component.
