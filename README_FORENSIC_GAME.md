# 🎮 Forensic Game Mode

> Transform your South Bronx pollution analysis into an interactive gaming experience inspired by Detroit: Become Human and Cyberpunk 2077.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.18.0-purple)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd subpage/frontend
npm install framer-motion

# 2. Start dev server
npm start

# 3. Visit
open http://localhost:3000/forensic-game
```

**That's it!** The game mode is ready to play.

---

## 📖 What Is This?

A **4-level interactive investigation** where users:
1. 📋 Receive a classified briefing
2. 🎥 Analyze live pollution simulation
3. 📊 Review forensic data evidence
4. ⚖️ Make policy decisions

**Total playtime:** 3-4 minutes
**Engagement:** Active vs passive
**Goal:** Transform data into action

---

## 🎯 The Four Levels

| Level | Name | Duration | User Action | Outcome |
|-------|------|----------|-------------|---------|
| **1** | Briefing | 30s | Hold button 3s | Initialize investigation |
| **2** | Investigation | Video | Control speed, capture evidence | Witness the breach |
| **3** | Debrief | 45s | Review data | Understand impact |
| **4** | Decision | 60s | Choose intervention | Win or fail state |

---

## 🎨 Visual Style

```
┌─────────────────────────────────────┐
│  ███ FORENSIC UTILITY TOOL ███     │
│  [ CLASSIFIED INVESTIGATION ]       │
│                                     │
│  > LOCATION: SOUTH BRONX            │
│  > STATUS: CRITICAL                 │
│  > MISSION: ANALYZE TOXIC EVENT     │
│                                     │
│  [TARGETING RETICLE ON SATELLITE]   │
│                                     │
│  [ HOLD TO INITIALIZE SCAN ]        │
└─────────────────────────────────────┘
```

**Colors:**
- 🟢 Green: Briefing/Mission
- 🔵 Cyan: HUD/Interface
- 🔴 Red: Danger/Critical
- 🟩 Teal: Success/Optimized

**Effects:**
- ▒ CRT scanlines
- ░ Digital noise
- ⚡ Glitch animations
- 🎯 Targeting reticles
- 📊 Animated data bars

---

## 📂 Files Structure

```
subpage/frontend/src/components/ForensicGame/
├── ForensicGame.js          # Main component (750 lines)
│   ├── MissionBriefing      # Level 1
│   ├── SimulationHUD        # Level 2
│   ├── DebriefScreen        # Level 3
│   └── DecisionScreen       # Level 4
└── ForensicGame.css         # All styles (1200 lines)
    ├── Diegetic UI
    ├── HUD overlays
    ├── Gaming effects
    └── Responsive design
```

---

## 🔧 Integration

### Add to Router

```javascript
// AppRouter.js
import ForensicGame from './components/ForensicGame/ForensicGame';

<Route path="/forensic-game" element={<ForensicGame />} />
```

### Add Navigation Button

```javascript
// App.js
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<button onClick={() => navigate('/forensic-game')}>
  🎮 ENTER FORENSIC MODE
</button>
```

**Full integration example:** See `AppRouter_EXAMPLE.js`

---

## 📹 Video Setup

**Required:**
- Path: `public/forensic-assets/ezgif.com-split.mp4`
- Format: MP4
- Duration: 10-15 seconds
- Content: Pollution simulation

**Optional:**
- Satellite imagery: `public/forensic-assets/bruckner-overview.jpg`

**Don't have assets?** The game will work with placeholder backgrounds.

---

## ⚙️ Customization

### Change Breach Timing

```javascript
// ForensicGame.js, line ~250
if (time >= 8 && time <= 10) {  // ← Change these values
  setBreachDetected(true);
}
```

### Change Risk Scores

```javascript
// ForensicGame.js, line ~85
setCongestedValue(90);   // ← Your congested %
setOptimizedValue(20);   // ← Your optimized %
```

### Change Colors

```css
/* ForensicGame.css */
#00ff00  →  Your green
#00ffff  →  Your cyan
#ef4444  →  Your red
#22d3a5  →  Your teal
```

---

## 🔗 Connect Your Data

### Backend API

```javascript
fetch('https://scroll-y8wn.onrender.com/simulate', {
  method: 'POST',
  body: JSON.stringify({ tax_amount: 35 })
})
  .then(r => r.json())
  .then(data => {
    setCongestedValue(data.baseline_risk * 100);
    setOptimizedValue(data.optimized_risk * 100);
  });
```

### GeoJSON Files

```javascript
import AsthmaData from '../../../Asthma_Index_Rates.geojson';

const highRiskZones = AsthmaData.features.filter(
  f => f.properties.asthmaRate > 340
);

// Show in briefing
<div>DETECTED: {highRiskZones.length} HIGH-RISK ZONES</div>
```

---

## 🎮 Key Features

### ✨ Level 1: Mission Briefing
- Typewriter text effect
- Satellite imagery with targeting reticle
- Hold-to-proceed button (3s)
- CRT scanline effects

### 🎬 Level 2: Simulation HUD
- Video player with diegetic overlay
- Real-time toxicity meter (0-100%)
- System logs with timestamps
- **Speed slider** (0.25x - 2.0x) controls video playback
- Evidence capture QTE (Quick Time Event)
- Recording indicator, frame counter

### 📊 Level 3: Data Debrief
- Animated risk score comparison
- State A (90% risk) vs State B (20% risk)
- Progress bars with smooth easing
- Evidence capture confirmation

### ⚖️ Level 4: Decision
- Two policy choices (fail vs win)
- Interactive choice cards
- Success/failure result screen
- Return to main site link

---

## 🧪 Testing Checklist

- [ ] All 4 levels transition smoothly
- [ ] Video plays at all speeds (0.25x - 2.0x)
- [ ] Breach detection pauses video
- [ ] Evidence capture button works
- [ ] Risk bars animate correctly
- [ ] Decision shows win/fail states
- [ ] Mobile responsive
- [ ] No console errors

---

## 🚀 Deploy

```bash
# Build for production
cd subpage/frontend
npm run build

# Commit build artifacts
git add build/
git commit -m "Add Forensic Game Mode"
git push origin main
```

**Live URL:**
```
https://[your-username].github.io/Scroll/subpage/frontend/build/#/forensic-game
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `FORENSIC_GAME_COMPLETE.md` | Full overview + architecture |
| `FORENSIC_GAME_INTEGRATION.md` | Detailed setup guide |
| `FORENSIC_GAME_QUICKSTART.md` | 30-second setup + troubleshooting |
| `AppRouter_EXAMPLE.js` | Integration code example |
| `CLAUDE.md` | Updated project documentation |

---

## 🎯 Success Metrics

**Engagement:**
- Completion rate (% finishing all 4 levels)
- Evidence capture rate
- Decision split (A vs B choice)
- Time per level

**Technical:**
- Load time < 3 seconds
- Video playback 60fps
- Mobile compatibility
- Zero console errors

---

## 💡 Next Steps

**Easy:**
- [ ] Add sound effects
- [ ] Customize colors
- [ ] Update text/narrative
- [ ] Test on mobile

**Medium:**
- [ ] Connect backend API
- [ ] Load GeoJSON data
- [ ] Add save/load state
- [ ] Implement leaderboard

**Advanced:**
- [ ] Multiple scenarios
- [ ] Multiplayer mode
- [ ] VR integration
- [ ] AI-generated narratives

---

## 🐛 Troubleshooting

**Video won't play?**
```bash
# Check file path
ls public/forensic-assets/ezgif.com-split.mp4
```

**Styles broken?**
```bash
# Clear cache
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

**Route not found?**
```javascript
// Verify in AppRouter.js
<Route path="/forensic-game" element={<ForensicGame />} />
```

**More help:** Check `FORENSIC_GAME_QUICKSTART.md`

---

## 🌟 Built With

- **React 18** - Component framework
- **Framer Motion** - Smooth animations
- **React Router** - Navigation
- **CSS3** - Gaming effects
- **Tailwind** - (Optional) Utility classes

---

## 📝 License

Part of the "Taxing Speed" / "CROSS BRONX: Concrete Severance" project.

---

## 🎮 Game On!

**You've built a forensic investigation game.**

Now customize it to:
- ✅ Tell your story
- ✅ Use your data
- ✅ Match your brand
- ✅ Drive your mission

**Transform passive data viewing into active investigation.** 🚀

---

<p align="center">
  <strong>Questions? Check the docs above or inspect the code.</strong><br>
  <em>All comments are inline. Everything is documented.</em>
</p>
