# Forensic Analysis - Setup Guide

## 🎬 What's Been Created

A complete "Forensic Architecture" style scrollytelling experience titled **"The South Bronx Accumulation: A Forensic Analysis"** with:

- ✅ Dark, clinical aesthetic with monospace fonts
- ✅ Four narrative sections (Site Context, Baseline, Simulation, Data Evidence)
- ✅ Video player with HUD overlays and breach warnings
- ✅ Precise, mechanical animations (no bounce)
- ✅ Comparative data visualization with bar charts
- ✅ Real-time metrics display

## 📁 Files Created

```
subpage/frontend/src/components/ForensicDashboard/
├── ForensicAnalysis.js       # Main React component
└── ForensicAnalysis.css       # Forensic styling and animations

subpage/frontend/public/forensic-assets/
└── ezgif.com-split.mp4       # Your simulation video (✓ copied)
```

## 🖼️ Add Your Satellite Images

Place your Google Earth images in `subpage/frontend/public/forensic-assets/` with these names:

```bash
# Required images:
bruckner-overview.jpg          # Overhead view of Bruckner Expressway
residential-zone.jpg           # Close-up of residential proximity
highway-detail.jpg             # Pollution corridor detail

# Or use your own naming and update the satelliteImages array in ForensicAnalysis.js
```

## 🚀 Integration Steps

### Option 1: Add as a New Route (Recommended)

1. **Update AppRouter.js:**

```javascript
// subpage/frontend/src/AppRouter.js
import ForensicAnalysis from './components/ForensicDashboard/ForensicAnalysis';

// Add to your routes:
<Route path="/forensic-analysis" element={<ForensicAnalysis />} />
```

2. **Add Navigation Link:**

```javascript
// In your main navigation or Dashboard.js
<Link to="/forensic-analysis">
  <button className="forensic-button">
    View Forensic Analysis
  </button>
</Link>
```

### Option 2: Replace Existing Forensic Dashboard

```javascript
// subpage/frontend/src/AppRouter.js
import ForensicAnalysis from './components/ForensicDashboard/ForensicAnalysis';

// Replace the existing /forensic route:
<Route path="/forensic" element={<ForensicAnalysis />} />
```

### Option 3: Standalone Page

```javascript
// subpage/frontend/src/index.js
import ForensicAnalysis from './components/ForensicDashboard/ForensicAnalysis';

root.render(
  <React.StrictMode>
    <ForensicAnalysis />
  </React.StrictMode>
);
```

## 🎨 Customization

### Adjust Colors

```javascript
// In ForensicAnalysis.js, modify the color variables:
const DANGER_COLOR = '#FF0000';  // Red for congested state
const SAFE_COLOR = '#00FFFF';    // Cyan for optimized state
const BG_COLOR = '#1a1a1a';      // Dark background
```

### Change Data Values

All data is defined in the components. To update:

**Baseline Comparison (Section 2):**
```javascript
// Around line 240-340 in ForensicAnalysis.js
<div className="mono-text text-6xl font-bold text-red-500">5 MPH</div>
<div className="mono-text text-4xl font-bold text-red-400">26.25 µg/m³</div>
```

**Data Evidence (Section 4):**
```javascript
// Around line 527-540
const stateA = {
  speed: 5,        // Update your congested speed
  pm25: 26.25,     // Update your PM2.5 value
  radius: 0.75,    // Update radius
  risk: 0.90       // Update risk score
};
```

### Adjust Video Breach Warning Timing

```javascript
// Around line 367 in ForensicAnalysis.js
if (video.currentTime >= 4 && video.currentTime <= 6) {
  setShowBreachWarning(true);
}

// Change "4" and "6" to match when the red spheres hit buildings in YOUR video
```

### Add More Satellite Images

```javascript
// Around line 145 in ForensicAnalysis.js
const satelliteImages = [
  '/forensic-assets/bruckner-overview.jpg',
  '/forensic-assets/residential-zone.jpg',
  '/forensic-assets/highway-detail.jpg',
  '/forensic-assets/your-fourth-image.jpg',  // Add more!
];

const imageLabels = [
  'BRUCKNER EXPRESSWAY - OVERHEAD VIEW',
  'RESIDENTIAL PROXIMITY ANALYSIS',
  'POLLUTION CORRIDOR DETAIL',
  'YOUR CUSTOM LABEL',  // Add corresponding labels
];
```

## 🎯 Key Features

### 1. Site Context (Section 1)
- Interactive image carousel with 3 satellite views
- HUD overlays with targeting reticles
- Geographic coordinates display
- Data tags showing analysis metadata

### 2. Baseline Comparison (Section 2)
- Side-by-side comparison cards
- Congested (Red) vs. Optimized (Cyan)
- Live data with progress bars
- Key hypothesis statement

### 3. Simulation Viewer (Section 3)
- Auto-playing video on scroll
- Recording indicator (pulsing red dot)
- Live timestamp counter
- **Breach warning** appears at 4-6 seconds
- Environmental conditions overlay
- Frame counter
- Play/Pause/Restart controls

### 4. Data Evidence (Section 4)
- Forensic dashboard with two comparison cards
- Animated bar charts showing PM2.5 and risk scores
- Percentage increase calculations
- Final conclusion with policy recommendation

## 🎬 Video Requirements

Your video (`ezgif.com-split.mp4`) should show:
- Red spheres expanding from highway
- Buildings/residential structures in frame
- Clear moment when pollution reaches buildings (~4 seconds)

**Current video specs:**
- ✓ Size: 3.9 MB
- ✓ Format: MP4
- ✓ Location: `/forensic-assets/ezgif.com-split.mp4`

## 🔧 Troubleshooting

### Video Not Playing
```bash
# Ensure video is in correct location:
ls subpage/frontend/public/forensic-assets/ezgif.com-split.mp4

# Check video format:
file subpage/frontend/public/forensic-assets/ezgif.com-split.mp4
```

### Images Not Showing
1. Place images in `subpage/frontend/public/forensic-assets/`
2. Name them exactly as specified in `satelliteImages` array
3. Use `.jpg`, `.png`, or `.webp` formats
4. Recommended size: 1920x1080px

### Fonts Not Loading
The component uses Google Fonts:
- JetBrains Mono (monospace data)
- Inter (narrative text)

These are loaded via CDN in the component. Ensure internet connection during development.

### Animations Too Slow/Fast
Adjust animation durations in `transition` props:

```javascript
transition={{
  duration: 0.6,  // Change this (in seconds)
  ease: [0.16, 1, 0.3, 1]  // Easing curve
}}
```

## 🌐 Testing

### Local Development
```bash
cd subpage/frontend
npm start
# Navigate to: http://localhost:3000/forensic-analysis
```

### Production Build
```bash
cd subpage/frontend
npm run build
# Deploy the build/ folder
```

## 📊 Data Flow

```
CSV Files (gh_state_CONGESTED.csv / gh_state_OPTIMIZED.csv)
    ↓
Python Script (swap_gh_state.py) ← Dashboard Slider
    ↓
gh_input.csv (Current State)
    ↓
Grasshopper Animation (reads CSV) ↔ React Dashboard (sync)
    ↓
ForensicAnalysis Component (displays video + data)
```

## 🎨 Design Tokens

```css
/* Colors */
--danger: #FF0000 (Red - Congested)
--safe: #00FFFF (Cyan - Optimized)
--bg-dark: #1a1a1a (Background)
--grid: #333333 (Grid lines)
--text: #ffffff (Primary text)
--text-muted: #666666 (Secondary text)

/* Typography */
--font-mono: 'JetBrains Mono', monospace
--font-sans: 'Inter', sans-serif

/* Spacing */
--section-padding: 5rem (80px)
--card-padding: 2rem (32px)
--grid-size: 50px
```

## 🚦 Performance Tips

1. **Optimize Video:**
   ```bash
   # Use FFmpeg to compress if needed:
   ffmpeg -i ezgif.com-split.mp4 -vcodec libx264 -crf 28 output.mp4
   ```

2. **Lazy Load Images:**
   The component uses `loading="lazy"` automatically via React

3. **Reduce Motion:**
   Accessibility is built-in - animations respect `prefers-reduced-motion`

## 📱 Responsive Breakpoints

- **Desktop:** 1280px+ (optimal viewing)
- **Tablet:** 768px - 1279px (stacked cards)
- **Mobile:** < 768px (vertical layout)

## 🎯 Next Steps

1. ✅ Add your 3 Google Earth satellite images
2. ✅ Test video playback
3. ✅ Adjust breach warning timing to match your video
4. ✅ Customize data values if needed
5. ✅ Integrate into your React Router
6. ✅ Deploy and share!

## 📄 License

Part of the "Taxing Speed" / "CROSS BRONX: Concrete Severance" project.

---

**Questions?** Check the inline comments in `ForensicAnalysis.js` for detailed explanations of each component.
