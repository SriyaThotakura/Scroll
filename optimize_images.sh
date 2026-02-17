#!/bin/bash

# Optional: Optimize images for web (requires ImageMagick)
# This reduces file sizes while maintaining quality

echo "🖼️  Optimizing images for web..."

cd subpage/frontend/public/forensic-assets

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not installed. Install with:"
    echo "   - macOS: brew install imagemagick"
    echo "   - Linux: sudo apt-get install imagemagick"
    echo "   - Windows: Download from https://imagemagick.org"
    exit 1
fi

# Backup originals
mkdir -p originals
cp *.jpg originals/

# Optimize images (resize to 1920px width, 85% quality)
for img in *.jpg; do
    echo "  Optimizing $img..."
    convert "$img" -resize 1920x1080\> -quality 85 "${img%.jpg}_optimized.jpg"
    mv "${img%.jpg}_optimized.jpg" "$img"
done

echo "✅ Optimization complete!"
echo ""
echo "Before → After:"
du -h originals/* | awk '{print "  " $2 ": " $1}'
echo "  →"
du -h *.jpg | awk '{print "  " $2 ": " $1}'
