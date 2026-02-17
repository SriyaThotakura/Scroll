# 🎬 Forensic Analysis - "The South Bronx Accumulation"

## ✅ What's Been Built

A complete **forensic architecture-style scrollytelling narrative** proving that traffic congestion causes toxic particulate matter to physically expand and breach residential buildings.

### The Four-Act Structure

#### 1. **THE SITE** (Geospatial Context)
- 📸 Interactive satellite image carousel with 3 views
- 🎯 Targeting reticle and HUD overlays
- 📍 Geographic coordinates and metadata
- 🏢 Residential proximity markers

#### 2. **THE SETUP** (Baseline Comparison)
- 🔴 **State A (Congested):** 5 MPH, 26.25 µg/m³, Risk: 0.90
- 🔵 **State B (Optimized):** 30 MPH, 10.50 µg/m³, Risk: 0.20
- 📊 Side-by-side comparison cards
- 💡 Hypothesis statement

#### 3. **THE EVENT** (Simulation Video)
- 🎥 Auto-playing video with HUD overlays
- ⏱️ Live timestamp counter
- ⚠️ **BREACH WARNING** at 4-6 seconds
- 🎮 Play/Pause/Restart controls
- 📈 Environmental conditions display

#### 4. **THE VERDICT** (Data Evidence)
- 🏁 Forensic dashboard with comparative analysis
- 📊 Animated bar charts
- 🔢 Quantitative metrics
- ⚖️ Final conclusion and policy recommendation

---

## 🎨 Design Implementation

### Aesthetic: "Forensic Architecture"
- **Dark Mode:** #1a1a1a background with #333 grid overlay
- **Typography:**
  - Monospace: JetBrains Mono (data/metrics)
  - Sans-serif: Inter (narrative text)
- **Colors:**
  - Danger Red: #FF0000 (congested state)
  - Medical Cyan: #00FFFF (optimized state)
  - Yellow: Hypothesis warnings
- **Animations:** Precise, mechanical (cubic-bezier easing, no bounce)

### UI Elements
- ✓ Scanline overlay effect
- ✓ Grid background (50px spacing)
- ✓ Data tags with cyan/red borders
- ✓ Crosshair targeting reticles
- ✓ Pulsing recording indicator
- ✓ Frame counter
- ✓ Timestamp display
- ✓ Breach warning overlays

---

## 📁 File Structure

```
subpage/frontend/
├── src/
│   ├── components/
│   │   └── ForensicDashboard/
│   │       ├── ForensicAnalysis.js      # Main component (900+ lines)
│   │       └── ForensicAnalysis.css     # Forensic styling
│   └── AppRouter.js                      # ✅ Updated with new route
│
└── public/
    └── forensic-assets/
        ├── ezgif.com-split.mp4          # ✅ Your simulation video
        ├── bruckner-overview.jpg        # ⚠️ ADD THIS
        ├── residential-zone.jpg         # ⚠️ ADD THIS
        └── highway-detail.jpg           # ⚠️ ADD THIS
```

---

## 🚀 How to Test

### 1. Start the Development Server
```bash
cd subpage/frontend
npm install  # If first time
npm start
```

### 2. Navigate to the Forensic Analysis
Open your browser to:
```
http://localhost:3000/forensic-analysis
```

### 3. Navigation Options
You now have 3 pages:
- `/` - Policy Simulator (original)
- `/forensic` - Forensic Dashboard (existing)
- `/forensic-analysis` - **NEW: Forensic Analysis (scrollytelling)**

---

## 📸 Add Your Satellite Images

**Required:** Place 3 Google Earth images in `public/forensic-assets/`

### Recommended Image Specs
- **Format:** JPG or PNG
- **Resolution:** 1920x1080px (16:9 aspect ratio)
- **File size:** < 500KB each (optimized for web)

### Naming Convention
```bash
bruckner-overview.jpg      # Wide shot of expressway
residential-zone.jpg       # Close-up of adjacent apartments
highway-detail.jpg         # Pollution corridor detail
```

### Quick Setup Commands
```bash
# Navigate to assets folder
cd subpage/frontend/public/forensic-assets/

# Copy your images here
cp /path/to/your/satellite1.jpg bruckner-overview.jpg
cp /path/to/your/satellite2.jpg residential-zone.jpg
cp /path/to/your/satellite3.jpg highway-detail.jpg
```

---

## 🎯 Customization Guide

### Update Data Values

**Location:** `ForensicAnalysis.js`, lines ~527-540

```javascript
const stateA = {
  speed: 5,        // Change congested speed
  pm25: 26.25,     // Change PM2.5 concentration
  radius: 0.75,    // Change dispersion radius
  risk: 0.90       // Change risk score
};

const stateB = {
  speed: 30,       // Change optimized speed
  pm25: 10.50,     // Change PM2.5 concentration
  radius: 0.30,    // Change dispersion radius
  risk: 0.20       // Change risk score
};
```

### Adjust Video Breach Timing

**Location:** `ForensicAnalysis.js`, line ~367

```javascript
// Change these numbers to match when spheres hit buildings in YOUR video
if (video.currentTime >= 4 && video.currentTime <= 6) {
  setShowBreachWarning(true);
}
```

### Change Geographic Coordinates

**Location:** `ForensicAnalysis.js`, line ~155

```javascript
<div className="mono-text text-xs text-cyan-400">
  <div>SCALE: 1:2000</div>
  <div>ALT: 400M</div>
  <div>LAT: 40.8250°N</div>  {/* Update this */}
  <div>LON: 73.8667°W</div>   {/* Update this */}
</div>
```

---

## 🎬 Video Integration

### Current Setup
- ✅ **Video file:** `ezgif.com-split.mp4` (3.9 MB)
- ✅ **Location:** `public/forensic-assets/`
- ✅ **Format:** MP4
- ✅ **Controls:** Custom HUD interface
- ✅ **Auto-play:** On scroll into view (intersection observer)

### Video Player Features
1. **Recording Indicator:** Pulsing red dot when playing
2. **Timestamp:** Real-time MM:SS:MS counter
3. **Frame Counter:** 30 FPS frame display
4. **Environmental Data:** Wind speed, temperature, humidity overlays
5. **Breach Warning:** Flashing alert when particles hit buildings
6. **Custom Controls:** Play/Pause/Restart buttons

### Troubleshooting Video
If video doesn't play:
```javascript
// Check browser console for errors
// Ensure video codec is H.264 (most compatible)
// Try adding these video attributes:
<video ... controls>  // Enable native controls temporarily
```

---

## 🎨 Animation Details

### Transition Timing
All animations use **cubic-bezier easing** for precise, mechanical feel:

```javascript
transition={{
  duration: 0.6,              // 600ms
  ease: [0.16, 1, 0.3, 1]     // Custom cubic-bezier
}}
```

### No Bounce
Unlike typical scrollytelling (which uses spring physics), this uses:
- Linear easing for data tags
- Cubic-bezier for section transitions
- Fade-in only (no slide-bounce)

### Scroll-triggered Animations
Uses Framer Motion's `whileInView`:
```javascript
whileInView={{ opacity: 1, y: 0 }}  // Trigger on scroll
viewport={{ once: true }}            // Animate once
```

---

## 🖥️ Responsive Design

### Breakpoints
- **Desktop (1280px+):** Optimal viewing, side-by-side cards
- **Tablet (768-1279px):** Stacked cards, smaller text
- **Mobile (<768px):** Single column, touch-friendly controls

### Mobile Optimizations
- Video controls enlarged for touch
- Data tags repositioned for visibility
- Grid overlay reduced opacity
- Font sizes scaled down

---

## ♿ Accessibility

### Features Included
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Keyboard navigation (focus states)
- ✅ Screen reader compatible
- ✅ High contrast mode support
- ✅ Video controls accessible

### Testing Accessibility
```bash
# Enable reduced motion in your OS, then reload
# Use Tab key to navigate - should see cyan outlines
# Test with screen reader (NVDA, JAWS, VoiceOver)
```

---

## 📊 Integration with Dashboard

### Linking to Forensic Analysis
From your existing dashboard:

```javascript
import { Link } from 'react-router-dom';

<Link to="/forensic-analysis">
  <button className="btn-forensic">
    📋 View Full Analysis
  </button>
</Link>
```

### Passing Data via Route State
```javascript
<Link
  to="/forensic-analysis"
  state={{ taxAmount: 35, currentState: 'CONGESTED' }}
>
  View Analysis
</Link>

// Access in ForensicAnalysis.js:
const { state } = useLocation();
const taxAmount = state?.taxAmount || 0;
```

---

## 🔧 Advanced Customization

### Add More Sections
```javascript
// Create new section component:
const NewSection = () => (
  <section className="relative min-h-screen bg-black">
    {/* Your content */}
  </section>
);

// Add to ForensicAnalysis return:
<SiteContext />
<BaselineComparison />
<NewSection />  {/* Insert here */}
<SimulationViewer />
<DataEvidence />
```

### Customize Grid Overlay
```css
/* In ForensicAnalysis.css */
.forensic-grid::before {
  background-size: 100px 100px;  /* Larger grid */
  opacity: 0.5;                   /* More visible */
}
```

### Add Sound Effects
```javascript
// In SimulationViewer component:
const breachSound = new Audio('/forensic-assets/breach-alarm.mp3');

useEffect(() => {
  if (showBreachWarning) {
    breachSound.play();
  }
}, [showBreachWarning]);
```

---

## 🚀 Deployment

### Production Build
```bash
cd subpage/frontend
npm run build

# Output: build/ folder
# Deploy to GitHub Pages, Vercel, Netlify, etc.
```

### Environment Variables
No API keys or secrets needed - all data is static!

---

## 📝 Testing Checklist

Before presenting:
- [ ] Video plays automatically on scroll
- [ ] Breach warning appears at correct time
- [ ] All 3 satellite images display correctly
- [ ] Data values match your research
- [ ] Navigation between pages works
- [ ] Animations are smooth (60 FPS)
- [ ] Mobile responsive layout works
- [ ] No console errors

---

## 🎯 Key Metrics Display

### What's Shown
| Metric | Congested | Optimized | Source |
|--------|-----------|-----------|--------|
| Speed | 5 MPH | 30 MPH | Your simulation |
| PM2.5 | 26.25 µg/m³ | 10.50 µg/m³ | CSV data |
| Radius | 0.75 | 0.30 | Normalized |
| Risk | 0.90 | 0.20 | Calculated |

### Calculations Shown
- PM2.5 Increase: **+150%**
- Risk Increase: **+350%**
- Conclusion: **Causal link established**

---

## 🆘 Support

### Common Issues

**Q: Video shows black screen**
```bash
# Check video codec
ffmpeg -i ezgif.com-split.mp4
# Should show: Video: h264, yuv420p
```

**Q: Images not loading**
```bash
# Check file paths (case-sensitive!)
ls subpage/frontend/public/forensic-assets/
```

**Q: Animations laggy**
```javascript
// Reduce animation complexity in ForensicAnalysis.css
.forensic-layout::after {
  display: none;  // Disable scanline effect
}
```

**Q: Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📚 Documentation

- **Main Setup Guide:** `/FORENSIC_ANALYSIS_SETUP.md`
- **Component Code:** `/subpage/frontend/src/components/ForensicDashboard/ForensicAnalysis.js`
- **Styles:** `/subpage/frontend/src/components/ForensicDashboard/ForensicAnalysis.css`
- **Router Config:** `/subpage/frontend/src/AppRouter.js`

---

## 🎉 You're Ready!

Your forensic analysis scrollytelling experience is **fully configured** and ready to deploy!

### Next Steps:
1. Add your 3 satellite images
2. Test the video playback
3. Adjust breach warning timing if needed
4. Share the link!

**Access URL:** `http://localhost:3000/forensic-analysis`

---

*Built with React, Framer Motion, and Tailwind CSS*
*Part of the "Taxing Speed" / "CROSS BRONX: Concrete Severance" project*
