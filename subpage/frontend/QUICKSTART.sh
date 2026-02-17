#!/bin/bash

# Forensic Analysis - Quick Start Script
# Automatically sets up and runs the development server

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🎬 FORENSIC ANALYSIS - QUICK START                           ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "   Please run this script from: subpage/frontend/"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Assets verification:"
echo ""

# Check video
if [ -f "public/forensic-assets/ezgif.com-split.mp4" ]; then
    echo "  ✓ Video: ezgif.com-split.mp4 ($(du -h public/forensic-assets/ezgif.com-split.mp4 | cut -f1))"
else
    echo "  ✗ Video: MISSING"
fi

# Check images
if [ -f "public/forensic-assets/bruckner-overview.jpg" ]; then
    echo "  ✓ Image 1: bruckner-overview.jpg ($(du -h public/forensic-assets/bruckner-overview.jpg | cut -f1))"
else
    echo "  ✗ Image 1: MISSING"
fi

if [ -f "public/forensic-assets/residential-zone.jpg" ]; then
    echo "  ✓ Image 2: residential-zone.jpg ($(du -h public/forensic-assets/residential-zone.jpg | cut -f1))"
else
    echo "  ✗ Image 2: MISSING"
fi

if [ -f "public/forensic-assets/highway-detail.jpg" ]; then
    echo "  ✓ Image 3: highway-detail.jpg ($(du -h public/forensic-assets/highway-detail.jpg | cut -f1))"
else
    echo "  ✗ Image 3: MISSING"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Access your app at: http://localhost:3000"
echo ""
echo "   Routes available:"
echo "   📊 /                    - Policy Simulator"
echo "   🔍 /forensic            - Forensic Dashboard"
echo "   🎬 /forensic-analysis   - NEW: Forensic Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm start
