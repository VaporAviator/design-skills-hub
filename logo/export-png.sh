#!/bin/bash
# Export SVG logos to PNG using qlmanage (macOS built-in)
# Run from the logo/ directory

set -e
cd "$(dirname "$0")"
mkdir -p png

SIZES=(32 64 128 256 512)

for variant in dark light; do
  for size in "${SIZES[@]}"; do
    echo "Exporting logo-${variant} @ ${size}px..."
    # Write a temp SVG with explicit size
    cat > /tmp/logo-export-tmp.svg << EOF
<svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
$(tail -n +2 logo-${variant}.svg | head -n -1)
</svg>
EOF
    qlmanage -t -s ${size} -o /tmp/ /tmp/logo-export-tmp.svg 2>/dev/null
    if [ -f "/tmp/logo-export-tmp.svg.png" ]; then
      mv /tmp/logo-export-tmp.svg.png "png/logo-${variant}-${size}.png"
      echo "  → png/logo-${variant}-${size}.png ✓"
    fi
  done
done

echo ""
echo "Done! Files in logo/png/"
ls -lh png/
