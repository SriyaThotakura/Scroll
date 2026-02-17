# 🔌 Integration Guide - Connect Policy Simulator to Forensic Analysis

## Quick Summary

**Goal:** Make the tax slider in Policy Simulator control the speed/data shown in Forensic Analysis.

**Flow:** User adjusts tax → Speed updates → Click "View Evidence" → See simulation with their data

---

## Step 1: Update App.js (Policy Simulator)

### Import the Hook

```javascript
// At the top of App.js, add:
import { useAppState } from './AppRouter';
import { useNavigate } from 'react-router-dom';
```

### Inside the App Component

```javascript
function App() {
  // Add this at the start of the component:
  const { taxAmount, setTaxAmount, speed, setSpeed, setSimulationData } = useAppState();
  const navigate = useNavigate();
  
  const [localTax, setLocalTax] = useState(0);
  
  // ... rest of existing state ...
```

### Update the Tax Slider Handler

```javascript
const handleTaxChange = async (newTax) => {
  setLocalTax(newTax);
  setTaxAmount(newTax); // Update global state
  
  // Calculate speed based on tax (inverse relationship)
  // Higher tax → Lower congestion → Higher speed
  const calculatedSpeed = newTax < 50 ? 5 + (newTax * 0.5) : 30 + ((newTax - 50) * 0.6);
  setSpeed(Math.round(calculatedSpeed));
  
  // Call your existing simulate API
  const response = await fetch(API_URL + '/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tax_amount: newTax })
  });
  
  const data = await response.json();
  setSimulationData(data); // Store in global state
  
  // Update local state as before
  setTrucksDiverted(data.trucks_diverted);
  setPm25Reduction(data.pm25_reduction_ug_m3);
  // ... etc
};
```

### Add "View Evidence" Button

Add this button below your results cards:

```javascript
{simulationData && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="text-center mt-8"
  >
    <button
      onClick={() => navigate('/analysis')}
      className="px-8 py-4 bg-cyan-400 text-black font-bold text-lg border-2 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-all shadow-lg"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      🎬 VIEW FORENSIC EVIDENCE
      <div className="text-xs mt-1 opacity-75">
        See simulation with Tax: ${taxAmount} | Speed: {speed} MPH
      </div>
    </button>
  </motion.div>
)}
```

---

## Step 2: Update ForensicAnalysis.js

### Import the Hook

```javascript
// At the top of ForensicAnalysis.js:
import { useAppState } from '../../AppRouter';
```

### Inside ForensicAnalysis Component

```javascript
const ForensicAnalysis = () => {
  // Add at the start:
  const { taxAmount, speed, simulationData } = useAppState();
  
  // Use these values instead of hardcoded ones:
  const actualSpeed = speed || 5; // Default to 5 if not set
  const actualTax = taxAmount || 0;
  
  // Calculate PM2.5 based on simulation data:
  const congestedPM25 = 26.25; // Baseline congested
  const optimizedPM25 = simulationData?.new_pm25_ug_m3 || 10.50;
  
  // ... rest of component
```

### Update Baseline Comparison Section

Replace hardcoded values with dynamic ones:

```javascript
// In BaselineComparison component, around line 240-340:

<div className="mono-text text-6xl font-bold text-red-500">
  {actualSpeed} MPH  {/* Was: 5 MPH */}
</div>

<div className="mono-text text-4xl font-bold text-red-400">
  {congestedPM25} µg/m³  {/* Dynamic */}
</div>

{/* In optimized section: */}
<div className="mono-text text-6xl font-bold text-cyan-400">
  {actualSpeed > 25 ? actualSpeed : 30} MPH  {/* Dynamic */}
</div>

<div className="mono-text text-4xl font-bold text-cyan-400">
  {optimizedPM25} µg/m³  {/* Dynamic from API */}
</div>
```

### Update Data Evidence Section

```javascript
// Around line 527-540:
const stateA = {
  speed: actualSpeed,  // Was: 5
  pm25: congestedPM25,  // Dynamic
  radius: 0.75,
  risk: 0.90,
  label: 'CONGESTED',
  color: 'red'
};

const stateB = {
  speed: actualSpeed > 25 ? actualSpeed : 30,  // Dynamic
  pm25: optimizedPM25,  // From API
  radius: 0.30,
  risk: 0.20,
  label: 'OPTIMIZED',
  color: 'cyan'
};
```

### Update Video Playback Speed (Optional Enhancement)

```javascript
// In SimulationViewer, add this effect:
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  
  // Adjust playback speed based on actual speed
  // Slow traffic (5-15 MPH) = slower playback (0.5x)
  // Fast traffic (30-60 MPH) = normal playback (1x)
  const playbackRate = actualSpeed < 15 ? 0.5 : 1.0;
  video.playbackRate = playbackRate;
}, [actualSpeed]);
```

---

## Step 3: Add Navigation Hints

### In App.js Footer

```javascript
<div className="text-center mt-12 p-6 border-t border-gray-700">
  <div className="mono-text text-sm text-gray-400">
    NEXT STEP: View forensic evidence to see visual proof
  </div>
  <div className="flex justify-center gap-4 mt-4">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">1</div>
      <span className="text-cyan-400">Policy Exploration</span>
    </div>
    <div className="text-gray-600">→</div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full border-2 border-gray-600 text-gray-600 flex items-center justify-center font-bold">2</div>
      <span className="text-gray-600">Forensic Proof</span>
    </div>
  </div>
</div>
```

---

## Step 4: Test the Flow

### Testing Checklist:

1. ✅ Start on Policy Simulator (/)
2. ✅ Move tax slider → See tax/speed in nav bar
3. ✅ Click "View Evidence" button
4. ✅ Navigate to /analysis
5. ✅ Nav bar shows step 2 active
6. ✅ Forensic Analysis displays YOUR data
7. ✅ Speed in comparison cards matches slider
8. ✅ PM2.5 values from API are shown
9. ✅ Go back → Data persists
10. ✅ Adjust slider → Navigate again → New data

---

## Quick Code Locations

**Files to Edit:**
1. `subpage/frontend/src/App.js` (Policy Simulator)
2. `subpage/frontend/src/components/ForensicDashboard/ForensicAnalysis.js`

**Key Imports:**
```javascript
import { useAppState } from './AppRouter';  // or ../../AppRouter
import { useNavigate } from 'react-router-dom';
```

**Key Pattern:**
```javascript
// Get from context:
const { taxAmount, speed, setTaxAmount, setSpeed, simulationData, setSimulationData } = useAppState();

// Set when slider changes:
setTaxAmount(newValue);
setSpeed(calculatedSpeed);
setSimulationData(apiResponse);

// Read to display:
<div>{taxAmount}</div>
<div>{speed} MPH</div>
```

---

## 🎯 Expected Result

**User Journey:**
1. User opens app → Sees Policy Simulator
2. Adjusts tax slider to $75
3. Nav bar updates: "TAX: $75 | SPEED: 45 MPH"
4. Clicks "VIEW FORENSIC EVIDENCE" button
5. Page transitions to Forensic Analysis
6. Nav bar shows Step 2 active, still shows TAX: $75 | SPEED: 45 MPH
7. Video plays, comparison shows "CONGESTED: 45 MPH" (their value!)
8. Quiz questions reference THEIR numbers
9. Final verdict uses THEIR data

**The Proof:**
"I set the tax, saw the impact, and the forensic evidence used MY numbers."

---

## 🚨 Common Issues

**Issue:** Nav bar shows "null" for tax/speed  
**Fix:** Make sure you're calling `setTaxAmount()` in the slider handler

**Issue:** Forensic Analysis still shows 5 MPH  
**Fix:** Replace hardcoded `5` with `actualSpeed` variable

**Issue:** Data doesn't persist when going back  
**Fix:** Context state persists automatically, check that you're reading from `useAppState()`

**Issue:** "useAppState is not a function"  
**Fix:** Check import path matches your file structure

---

**Integration Time:** ~30 minutes
**Complexity:** Medium (mostly find-and-replace of hardcoded values)
**Impact:** HIGH - Transforms static demo into interactive proof tool
