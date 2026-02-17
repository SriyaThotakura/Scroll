# 🎬 Forensic Analysis - What's Next

## ✅ Everything Is Ready!

All components, assets, and configurations are complete. Your forensic architecture-style scrollytelling experience is **production-ready**.

---

## 🚀 Quick Start (3 Commands)

```bash
cd subpage/frontend
npm install
npm start
```

Then open: **http://localhost:3000/forensic-analysis**

---

## 🎯 Optional: Optimize Images for Faster Loading

Your Google Earth images are currently:
- `bruckner-overview.jpg`: **9.4 MB** (large!)
- `residential-zone.jpg`: 4.0 MB
- `highway-detail.jpg`: 3.9 MB

To optimize for web (reduces to ~500KB each):

```bash
./optimize_images.sh
```

*(Requires ImageMagick - see script for installation instructions)*

---

## 🎨 Customization Checklist

Before presenting, you may want to adjust:

### 1. Video Breach Timing
If the red spheres hit buildings at a different time than 4-6 seconds:

**File:** `subpage/frontend/src/components/ForensicDashboard/ForensicAnalysis.js`  
**Line:** ~367

```javascript
// Change these numbers to match your video
if (video.currentTime >= 4 && video.currentTime <= 6) {
  setShowBreachWarning(true);
}
```

### 2. Data Values
If your actual measurements differ:

**File:** `ForensicAnalysis.js`, Line ~527-540

```javascript
const stateA = {
  speed: 5,        // Your congested speed
  pm25: 26.25,     // Your PM2.5 measurement
  radius: 0.75,    // Your dispersion radius
  risk: 0.90       // Your risk score
};
```

### 3. Geographic Coordinates
To show your exact location:

**File:** `ForensicAnalysis.js`, Line ~155

```javascript
<div>LAT: 40.8250°N</div>  // Update
<div>LON: 73.8667°W</div>   // Update
```

---

## 📱 Test on Multiple Devices

Before presenting, test on:

- ✅ **Desktop** (1920x1080 or larger)
- ✅ **Tablet** (iPad landscape/portrait)
- ✅ **Mobile** (iPhone, Android)

The design is fully responsive!

---

## 🎬 Grasshopper Integration

Your dashboard slider can now control which state is displayed:

```bash
# When slider is low (congested traffic)
python swap_gh_state.py --state CONGESTED

# When slider is high (optimized traffic)
python swap_gh_state.py --state OPTIMIZED

# Or auto-select based on slider value:
python swap_gh_state.py --tax $SLIDER_VALUE
```

This keeps your Grasshopper animation in sync with the React dashboard!

---

## 📊 Build for Production

When ready to deploy:

```bash
cd subpage/frontend
npm run build
```

Output: `build/` folder (deploy to GitHub Pages, Vercel, Netlify, etc.)

---

## 🐛 Troubleshooting

### Video doesn't play
- Check browser console for errors
- Ensure video is H.264 codec (most compatible)
- Try adding `controls` attribute temporarily for debugging

### Images show broken icon
- Check file paths are correct (case-sensitive!)
- Verify files exist in `public/forensic-assets/`
- Check browser Network tab for 404 errors

### Animations are laggy
- Reduce image file sizes (run `./optimize_images.sh`)
- Disable scanline effect in `ForensicAnalysis.css`:
  ```css
  .forensic-layout::after {
    display: none;  /* Disable for performance */
  }
  ```

### Navigation doesn't work
- Ensure `AppRouter.js` is imported correctly in `index.js`
- Check React Router is installed: `npm install react-router-dom`

---

## 📚 Complete File Structure

```
Scroll/
├── CLAUDE.md                           # Project documentation
├── FORENSIC_ANALYSIS_SETUP.md          # Detailed setup guide
├── FORENSIC_ANALYSIS_README.md         # Quick reference
├── NEXT_STEPS.md                       # This file
├── optimize_images.sh                  # Optional image optimizer
├── gh_state_CONGESTED.csv              # Grasshopper state file
├── gh_state_OPTIMIZED.csv              # Grasshopper state file
├── swap_gh_state.py                    # State switcher script
│
└── subpage/frontend/
    ├── QUICKSTART.sh                   # One-command startup
    ├── public/
    │   └── forensic-assets/
    │       ├── ezgif.com-split.mp4     ✅ Your video
    │       ├── bruckner-overview.jpg   ✅ Google Earth image 1
    │       ├── residential-zone.jpg    ✅ Google Earth image 2
    │       └── highway-detail.jpg      ✅ Google Earth image 3
    │
    └── src/
        ├── AppRouter.js                ✅ Updated with new route
        └── components/
            └── ForensicDashboard/
                ├── ForensicAnalysis.js ✅ Main component (900+ lines)
                └── ForensicAnalysis.css ✅ Forensic styling
```

---

## 🎉 You're Ready to Present!

Your complete forensic analysis narrative is configured and ready:

1. **Title Screen** → Dark, clinical aesthetic
2. **The Site** → Google Earth images with HUD overlays
3. **The Setup** → Congested vs Optimized comparison
4. **The Event** → Auto-playing video with breach warnings
5. **The Verdict** → Data evidence with animated charts

All proving that **traffic congestion causes toxic PM2.5 to expand and breach residential buildings**.

---

## 🔗 URLs to Remember

- **Development:** http://localhost:3000/forensic-analysis
- **Policy Simulator:** http://localhost:3000/
- **Forensic Dashboard:** http://localhost:3000/forensic

---

## 💡 Pro Tips

1. **Demo Flow:** Start with Policy Simulator → Show Forensic Dashboard → End with Forensic Analysis (the climax!)

2. **Narrative Arc:** 
   - Policy Simulator: "Here's the problem"
   - Forensic Dashboard: "Here's how agents respond"
   - Forensic Analysis: "Here's the proof"

3. **Presentation Mode:** Hit `F11` for fullscreen before scrolling through

4. **Mobile Demo:** Use Chrome DevTools device emulator to show responsive design

---

**Built with ❤️ for "Taxing Speed" / "CROSS BRONX: Concrete Severance"**

Questions? Check the documentation files or review inline comments in the code.
