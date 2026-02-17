# 🎯 Interactive Quiz System - Validation Guide

## Overview

The Forensic Analysis now includes **3 interactive pop-up questions** that test whether viewers understand the evidence presented. These aren't just "did you like it?" questions—they're designed to validate if the **visual correlation** actually worked.

---

## 🎬 Presentation Hook (Updated)

The intro screen now features your hook:

> **"The algorithmic blackbox usually works against the Bronx. I've turned that blackbox inside out to create a Community Utility Tool. This isn't just a map; it's a Forensic Proof that proves why our current traffic congestion is a regulatory choice to pollute—and exactly what speeds and taxes we need to fix it."**

---

## 📝 The Three Questions

### 1. **THE "CAUSALITY" TEST**
**Appears after:** Video simulation (Section 3)  
**Tests:** Did they understand the logic?

**Question:**  
"Based on the simulation, at what approximate traffic speed did the pollution physically breach the residential windows?"

**Correct Answer:** "Around 5 MPH (when traffic stopped)"

**What This Validates:**  
Whether the visual link between **Speed (5 mph)** and **Volume (Expansion)** was clear.

**If they answer wrong:**  
The video overlay or "BREACH DETECTED" flash didn't capture attention at the right moment.

---

### 2. **THE "MAGNITUDE" TEST**
**Appears after:** Baseline Comparison (Section 2)  
**Tests:** Did they feel the urgency?

**Question:**  
"On a scale of 1-10, how 'safe' did the optimized state (30 MPH, Cyan) feel compared to the congested state (5 MPH, Red)?"

**Correct Answer:** "Optimized: 9-10 | Congested: 1-2 (Huge difference)"

**What This Validates:**  
Whether the **Forensic Aesthetic** (dark mode, stark colors) successfully conveyed risk perception.

**If they answer wrong:**  
The visual difference between red danger zones and cyan safe zones wasn't dramatic enough.

---

### 3. **THE "POLICY" TEST**
**Appears:** At the end, before credits  
**Tests:** Did they buy the solution?

**Question:**  
"If you were a policymaker, would you prioritize 'Variable Speed Limits' or 'Electric Truck Mandates' based strictly on this video evidence?"

**Correct Answer:** "Variable Speed Limits (control traffic flow)"

**What This Validates:**  
Whether the specific argument—**flow/speed controls accumulation**—landed with viewers.

**If they answer wrong:**  
They're bringing outside knowledge rather than trusting your simulation evidence.

---

## 🎮 How It Works

### User Experience Flow:

1. **Watch Section** → Absorb visual evidence
2. **Quiz Button Appears** → Floating "TEST YOUR UNDERSTANDING" button
3. **Click to Answer** → Pop-up with 4 multiple choice options
4. **Immediate Feedback** → Shows if correct + explanation
5. **Auto-closes** → Returns to narrative after 4 seconds
6. **Final Summary** → Shows 3/3 score at the end

### Triggering Logic:

- **Causality Quiz:** Auto-appears after video section
- **Magnitude Quiz:** Triggered when hovering near baseline comparison
- **Policy Quiz:** Manual trigger button at the end

Users can:
- ✅ Answer questions to validate understanding
- ✅ Skip questions (press ESC or click outside)
- ✅ See their final score (X/3) at the end

---

## 📊 Success Criteria

### **Goal:**
"To validate that the visual correlation between 'Traffic Stagnation' and 'Vertical Pollution Encroachment' is understood by non-experts **within 15 seconds**."

### **Metrics:**

**Perfect Score (3/3):**  
- Viewer understood causality (speed → expansion)
- Viewer felt the risk contrast (red vs cyan)
- Viewer trusts the solution (flow control)

**Partial Score (1-2/3):**  
- Some evidence landed, but gaps exist
- Review which questions failed
- Adjust those specific sections

**Zero Score (0/3):**  
- Visual narrative failed completely
- Rethink color contrast, timing, or data presentation

---

## 🎨 Visual Design

### Quiz Pop-up Features:

- **Dark overlay** (90% black with blur)
- **Cyan border** (forensic aesthetic)
- **Monospace font** for questions
- **Color-coded feedback:**
  - ✓ Correct = Cyan background
  - ✗ Wrong = Red background
- **Goal statement** displayed with each question
- **Auto-close timer** (4 seconds after answer)
- **ESC to skip** functionality

---

## 📈 Data Collection (Optional)

If you want to track results:

```javascript
// In ForensicAnalysis.js, add:
const trackQuizResult = (type, correct) => {
  console.log(`Quiz: ${type}, Correct: ${correct}`);
  // Send to analytics:
  // analytics.track('ForensicQuiz', { question: type, correct });
};
```

This lets you measure:
- Which questions fail most often
- Where viewers get confused
- If the narrative needs adjustments

---

## 🔧 Customization

### Change Question Text:

**File:** `InteractiveQuiz.js`  
**Line:** ~12-60

```javascript
const questions = {
  causality: {
    question: 'Your custom question here...',
    options: [
      { id: 'a', text: 'Option A', correct: true, feedback: 'Feedback A' },
      // ...
    ]
  }
};
```

### Adjust Timing:

**Auto-close delay:**  
Line 48: `setTimeout(() => { ... }, 4000);` → Change 4000 to desired milliseconds

**Button appearance:**  
Use IntersectionObserver to trigger based on scroll position

---

## 🎯 For Your Presentation

### Talking Points:

1. **"This isn't passive consumption"**  
   "Viewers actively validate their understanding through embedded questions."

2. **"Evidence-based design"**  
   "If they answer wrong, I know which visual element failed."

3. **"Community utility, not just pretty maps"**  
   "The tool teaches, then tests. It's a pedagogical instrument."

### Demo Flow:

1. Start scrolling through narrative
2. When quiz appears, answer it live
3. Show the immediate feedback
4. At the end, reveal your 3/3 score
5. Say: "This proves the forensic aesthetic worked."

---

## 📚 Documentation Files

- `InteractiveQuiz.js` - Quiz component (160+ lines)
- `ForensicAnalysis.js` - Updated with quiz integration
- `INTERACTIVE_QUIZ_GUIDE.md` - This file

---

## ✨ Key Innovation

**Traditional Scrollytelling:**  
"Here's the story" → Viewer passively consumes → No validation

**Your Forensic Narrative:**  
"Here's the evidence" → Viewer actively validates → Immediate feedback loop

This transforms a **presentation** into a **forensic investigation** where the viewer becomes the analyst.

---

**Built to validate: "Did the visual evidence actually convince them?"**
