# 🎮 Forensic Game Mode - Quick Start Guide

## What You Just Got

A **complete gaming-style interface** that transforms your pollution analysis data into an interactive investigation experience. Think **Detroit: Become Human** meets **environmental justice**.

## 🚀 30-Second Setup

```bash
# 1. Install Framer Motion
cd subpage/frontend
npm install framer-motion

# 2. Add the route to AppRouter.js
# Add this line to your imports:
import ForensicGame from './components/ForensicGame/ForensicGame';

# Add this route:
<Route path="/forensic-game" element={<ForensicGame />} />

# 3. Start your dev server
npm start

# 4. Visit
# http://localhost:3000/forensic-game
```

## 📂 File Checklist

Make sure these files exist:

✅ `subpage/frontend/src/components/ForensicGame/ForensicGame.js`
✅ `subpage/frontend/src/components/ForensicGame/ForensicGame.css`
✅ `subpage/frontend/public/forensic-assets/ezgif.com-split.mp4`

**Optional** (will work without, but recommended):
- `subpage/frontend/public/forensic-assets/bruckner-overview.jpg`

## 🎯 The Four Levels

### Level 1: Briefing (30 seconds)
- **What happens:** Typewriter intro, satellite view, targeting reticle
- **User action:** Hold button for 3 seconds to start

### Level 2: Investigation (Video duration)
- **What happens:** Video plays with HUD overlay
- **User action:**
  - Adjust speed slider (0.25x - 2.0x)
  - Click "CAPTURE EVIDENCE" when breach detected
- **Visual elements:**
  - Toxicity meter (fills to 100%)
  - System logs (scrolling messages)
  - Recording indicator
  - Frame counter

### Level 3: Debrief (45 seconds)
- **What happens:** Animated data comparison
- **User action:** Review evidence, click "PROCEED"
- **Shows:**
  - State A (Congested): 90% risk
  - State B (Optimized): 20% risk

### Level 4: Decision (1 minute)
- **What happens:** Choose intervention
- **User action:** Click Option A (fail) or Option B (win)
- **Outcome:** Success/failure screen

**Total Experience: 3-4 minutes**

## 🎨 Quick Customizations

### Change When Breach Happens

Open `ForensicGame.js`, find line ~250:

```javascript
// CURRENT: Breach at 8-10 seconds
if (time >= 8 && time <= 10 && !breachDetected) {

// CHANGE TO: Breach at 5-7 seconds
if (time >= 5 && time <= 7 && !breachDetected) {
```

### Change Risk Scores

Find `DebriefScreen` component, line ~85:

```javascript
// Change 90 to your congested risk %
if (congested >= 90) {

// Change 20 to your optimized risk %
if (optimized >= 20) {
```

### Change Colors

Open `ForensicGame.css`:
- Green briefing: `#00ff00`
- Cyan HUD: `#00ffff`
- Red danger: `#ef4444`
- Teal success: `#22d3a5`

Find and replace these hex codes.

## 🐛 Common Issues & Fixes

### "Video won't play"
**Fix:** Check path is exactly `/forensic-assets/ezgif.com-split.mp4`
```bash
# Verify file exists:
ls subpage/frontend/public/forensic-assets/
```

### "No animations"
**Fix:** Install Framer Motion
```bash
npm install framer-motion
```

### "Styles look broken"
**Fix:** Clear browser cache
- Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "Can't find route"
**Fix:** Make sure AppRouter.js has:
```javascript
import ForensicGame from './components/ForensicGame/ForensicGame';
<Route path="/forensic-game" element={<ForensicGame />} />
```

## 🔗 Link from Your Main Site

### From Policy Simulator (App.js)

```javascript
import { Link } from 'react-router-dom';

// Add this button:
<Link to="/forensic-game">
  <button style={{
    border: '2px solid #00ffff',
    background: 'transparent',
    color: '#00ffff',
    padding: '15px 40px',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    cursor: 'pointer'
  }}>
    🎮 ENTER FORENSIC MODE
  </button>
</Link>
```

### From Forensic Dashboard

```javascript
<button
  onClick={() => navigate('/forensic-game')}
  className="game-mode-btn"
>
  ACTIVATE INVESTIGATION PROTOCOL
</button>
```

## 📊 Connect Your Real Data

### From Backend API

Replace static values in `DebriefScreen`:

```javascript
useEffect(() => {
  fetch('https://scroll-y8wn.onrender.com/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tax_amount: 35 })
  })
    .then(r => r.json())
    .then(data => {
      // Use real risk scores
      setCongestedValue(data.baseline_risk * 100);
      setOptimizedValue(data.optimized_risk * 100);
    });
}, []);
```

### From GeoJSON Files

Load your asthma/pollution data:

```javascript
import AsthmaData from '../../../Asthma_Index_Rates.geojson';

// Count high-risk zones
const highRiskCount = AsthmaData.features.filter(
  f => f.properties.asthmaRate > 340
).length;

// Display in briefing
<div>DETECTED: {highRiskCount} HIGH-RISK ZONES</div>
```

## 🎬 Video Requirements

**Current setup expects:**
- Format: MP4
- Duration: 10-15 seconds
- Content: Pollution simulation showing spheres hitting buildings
- Key moment: Breach event (when pollution reaches windows)

**Your video should show:**
1. Start: Highway with traffic
2. Middle: Red particles/spheres expanding
3. Breach: Particles reaching residential buildings
4. End: Full accumulation visible

**Timing:**
- Adjust breach detection (8-10 sec) to match your video's breach moment

## 🎮 Gaming Principles Used

1. **Diegetic UI**: All interface elements feel like part of the investigation world
2. **Progressive Disclosure**: Information revealed step-by-step
3. **Player Agency**: User makes meaningful choices
4. **Feedback Loops**: Visual responses to every action
5. **Tension Building**: Toxicity meter, warnings, critical moments
6. **Narrative Framing**: Everything is part of a "mission"

## 🚀 Deploy to Production

```bash
# Build for production
cd subpage/frontend
npm run build

# Commit build artifacts (required for GitHub Pages)
git add build/
git commit -m "Add Forensic Game Mode"
git push origin main
```

**Live URL will be:**
`https://[yourusername].github.io/Scroll/subpage/frontend/build/#/forensic-game`

## 📈 Next Level Enhancements

**Easy:**
- ✅ Add sound effects (breach alarm, button clicks)
- ✅ Change color scheme to match your brand
- ✅ Update text to match your narrative

**Medium:**
- ✅ Connect to live LSTM predictions
- ✅ Add more system log messages
- ✅ Implement save/load game state

**Advanced:**
- ✅ Multiple investigation scenarios
- ✅ Multiplayer mode (compare decisions)
- ✅ VR/3D integration with Three.js

## 💡 Pro Tips

1. **Test on mobile** - Interface is responsive but check your device
2. **Add your logo** - Replace classification tag with your branding
3. **Customize fonts** - Currently uses JetBrains Mono (included via Google Fonts)
4. **Monitor performance** - Video playback can be heavy on old devices
5. **A/B test** - See if users engage more with game mode vs traditional dashboard

## 📞 Support

**Issues?** Check:
1. Console errors (F12 in browser)
2. File paths (case-sensitive!)
3. Dependencies installed (npm install)

**Still stuck?** Review:
- `FORENSIC_GAME_INTEGRATION.md` (detailed guide)
- Inline comments in `ForensicGame.js`
- CSS class names in `ForensicGame.css`

## 🎯 Success Metrics

Your game mode is working when:
- ✅ All 4 levels transition smoothly
- ✅ Video plays with HUD overlay
- ✅ Speed slider affects playback
- ✅ Breach detection pauses video
- ✅ Evidence capture works
- ✅ Risk bars animate properly
- ✅ Decision screen shows win/fail states

## 🌟 Make It Yours

This is a **prototype foundation**. Customize it to:
- Match your brand colors
- Tell your specific story
- Integrate your unique data
- Add your policy recommendations

**The goal:** Transform passive data viewing into active investigation.

---

**You've built a forensic investigation game. Now make it your own.** 🚀
