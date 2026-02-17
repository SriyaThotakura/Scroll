/**
 * mapVizModule.js
 *
 * Standalone Mapbox GL JS module for two dynamic layers:
 *   1. HVI Zone Choropleth  — Soundview ZIP codes, colored by risk score
 *   2. CBX Truck Flow Line  — Cross-Bronx Expressway, width/color by diversion
 *
 * Usage:
 *   const viz = await initVizModule(map);
 *   viz.showLayers();
 *   viz.updateMapLayers({ riskScore: 0.62, pm25Level: 13.2, trucksDiverted: 200 });
 */

// ==================== CONSTANTS ====================

const SOUNDVIEW_API = 'https://scroll-y8wn.onrender.com/geojson/soundview';

// Cross-Bronx Expressway polyline (Scroll_HACK/script.js line 826)
const CBX_COORDINATES = [
    [-73.9288, 40.8133],
    [-73.9100, 40.8180],
    [-73.8900, 40.8200],
    [-73.8700, 40.8220],
    [-73.8500, 40.8240],
    [-73.8300, 40.8260],
    [-73.8100, 40.8280]
];

const VIZ_SOURCES = {
    soundviewZones: 'soundview-zones-source',
    cbxRoute:       'cbx-route-source'
};

const VIZ_LAYERS = {
    hviZoneFill:    'hvi-zone-choropleth',
    hviZoneOutline: 'hvi-zone-outline',
    cbxFlowGlow:    'cbx-flow-glow',
    cbxFlowLine:    'cbx-flow-line'
};

// Max trucks diverted at $100 tax (from gh_input.csv)
const MAX_TRUCKS_DIVERTED = 416;

// ==================== COLOR HELPERS ====================

/** Multi-stop color ramp: risk score (0-1) → RGB string */
function riskToColor(score) {
    const stops = [
        { t: 0.00, r: 212, g: 212, b: 212 },  // #d4d4d4 neutral grey
        { t: 0.20, r: 245, g: 198, b: 198 },  // #f5c6c6 light pink
        { t: 0.40, r: 232, g: 142, b: 142 },  // #e88e8e medium pink
        { t: 0.50, r: 212, g:  95, b:  95 },  // #d45f5f salmon
        { t: 0.62, r: 185, g:  28, b:  28 },  // #b91c1c deep red
        { t: 0.80, r: 127, g:  29, b:  29 },  // #7f1d1d dark red
        { t: 1.00, r:  69, g:  10, b:  10 }   // #450a0a near-black red
    ];

    const v = Math.min(1, Math.max(0, score));
    let lo = stops[0], hi = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
        if (v >= stops[i].t && v <= stops[i + 1].t) {
            lo = stops[i];
            hi = stops[i + 1];
            break;
        }
    }

    const range = hi.t - lo.t;
    const ratio = range === 0 ? 0 : (v - lo.t) / range;
    const r = Math.round(lo.r + (hi.r - lo.r) * ratio);
    const g = Math.round(lo.g + (hi.g - lo.g) * ratio);
    const b = Math.round(lo.b + (hi.b - lo.b) * ratio);
    return `rgb(${r},${g},${b})`;
}

/** Hex (#rrggbb) → {r,g,b} */
function hexRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

/** Linear lerp between two hex colors */
function lerpColor(hex1, hex2, t) {
    const a = hexRgb(hex1), b = hexRgb(hex2);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${bl})`;
}

// ==================== SOURCE / LAYER SETUP ====================

async function addSources(map) {
    // 1. Soundview ZIP code zones from backend
    try {
        const res = await fetch(SOUNDVIEW_API);
        if (res.ok) {
            const geojson = await res.json();
            map.addSource(VIZ_SOURCES.soundviewZones, { type: 'geojson', data: geojson });
            console.log('[VizModule] Soundview zones loaded');
        } else {
            console.warn('[VizModule] Soundview API returned', res.status);
        }
    } catch (err) {
        console.error('[VizModule] Failed to fetch Soundview GeoJSON:', err);
    }

    // 2. Cross-Bronx Expressway inline LineString
    map.addSource(VIZ_SOURCES.cbxRoute, {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: { name: 'Cross Bronx Expressway' },
                geometry: { type: 'LineString', coordinates: CBX_COORDINATES }
            }]
        }
    });
}

function addLayers(map) {
    // ---- HVI Zone Choropleth ----
    if (map.getSource(VIZ_SOURCES.soundviewZones)) {
        map.addLayer({
            id: VIZ_LAYERS.hviZoneFill,
            type: 'fill',
            source: VIZ_SOURCES.soundviewZones,
            paint: {
                'fill-color': '#d4d4d4',
                'fill-opacity': 0.75
            },
            layout: { visibility: 'none' }
        });

        map.addLayer({
            id: VIZ_LAYERS.hviZoneOutline,
            type: 'line',
            source: VIZ_SOURCES.soundviewZones,
            paint: {
                'line-color': '#ffffff',
                'line-width': 1.5,
                'line-opacity': 0.6
            },
            layout: { visibility: 'none' }
        });
    }

    // ---- CBX Flow Line ----
    // Outer glow (wider, blurred)
    map.addLayer({
        id: VIZ_LAYERS.cbxFlowGlow,
        type: 'line',
        source: VIZ_SOURCES.cbxRoute,
        paint: {
            'line-color': '#991b1b',
            'line-width': 12,
            'line-opacity': 0.4,
            'line-blur': 6
        },
        layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' }
    });

    // Core line
    map.addLayer({
        id: VIZ_LAYERS.cbxFlowLine,
        type: 'line',
        source: VIZ_SOURCES.cbxRoute,
        paint: {
            'line-color': '#991b1b',
            'line-width': 6,
            'line-opacity': 0.9
        },
        layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' }
    });
}

// ==================== UPDATE FUNCTION ====================

/**
 * Update both visualization layers based on simulation data.
 *
 * @param {mapboxgl.Map} map
 * @param {Object} data
 * @param {number} data.riskScore      0-1  (0.62 = deep red threshold)
 * @param {number} data.pm25Level      µg/m³ (affects zone opacity)
 * @param {number} data.trucksDiverted count  (0 = baseline, ~416 = max)
 */
function _updateMapLayers(map, data) {
    const { riskScore, pm25Level, trucksDiverted } = data;

    // ---- HVI Zone Choropleth ----
    if (map.getLayer(VIZ_LAYERS.hviZoneFill)) {
        // Color from risk score ramp
        map.setPaintProperty(VIZ_LAYERS.hviZoneFill, 'fill-color', riskToColor(riskScore));

        // Opacity scales with PM2.5 (range ~10-15 µg/m³ → 0.3-0.85)
        const pm25Norm = Math.min(1, Math.max(0, (pm25Level - 10) / 5));
        map.setPaintProperty(VIZ_LAYERS.hviZoneFill, 'fill-opacity', 0.3 + pm25Norm * 0.55);
    }

    // ---- CBX Flow Line ----
    if (map.getLayer(VIZ_LAYERS.cbxFlowLine)) {
        const ratio = Math.min(1, Math.max(0, trucksDiverted / MAX_TRUCKS_DIVERTED));

        // Color: dark red → green as trucks divert
        const lineColor = lerpColor('#991b1b', '#16a34a', ratio);
        map.setPaintProperty(VIZ_LAYERS.cbxFlowLine, 'line-color', lineColor);
        map.setPaintProperty(VIZ_LAYERS.cbxFlowGlow, 'line-color', lineColor);

        // Width: 6px baseline → 2px at max diversion
        const lineWidth = 6 - ratio * 4;
        map.setPaintProperty(VIZ_LAYERS.cbxFlowLine, 'line-width', lineWidth);
        map.setPaintProperty(VIZ_LAYERS.cbxFlowGlow, 'line-width', lineWidth * 2);

        // Glow fades as trucks leave
        map.setPaintProperty(VIZ_LAYERS.cbxFlowGlow, 'line-opacity', Math.max(0.05, 0.4 - ratio * 0.35));
    }

    console.log('[VizModule] updated — risk:', riskScore, 'pm25:', pm25Level, 'diverted:', trucksDiverted);
}

// ==================== VISIBILITY HELPERS ====================

function _showLayers(map) {
    Object.values(VIZ_LAYERS).forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'visible');
    });
}

function _hideLayers(map) {
    Object.values(VIZ_LAYERS).forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none');
    });
}

// ==================== CSV LOADER ====================

/**
 * Parse gh_input.csv into an array indexed by tax_amount (0-100).
 * @param {string} csvUrl - path to gh_input.csv
 * @returns {Array<Object>}
 */
async function loadGHData(csvUrl) {
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(',');
            const row = {};
            headers.forEach((h, idx) => { row[h.trim()] = parseFloat(vals[idx]) || 0; });
            rows[Math.round(row.tax_amount)] = row;
        }

        console.log('[VizModule] gh_input.csv loaded —', lines.length - 1, 'rows');
        return rows;
    } catch (err) {
        console.error('[VizModule] Failed to load gh_input.csv:', err);
        return [];
    }
}

// ==================== PUBLIC INIT ====================

/**
 * Initialize the visualization module on an existing Mapbox GL map.
 * Call inside map.on('load', ...) or after the map is fully loaded.
 *
 * @param {mapboxgl.Map} map
 * @param {string} [csvUrl='gh_input.csv'] - path to the Grasshopper CSV
 * @returns {Object} { updateMapLayers, showLayers, hideLayers, ghData, LAYERS, SOURCES }
 */
async function initVizModule(map, csvUrl) {
    await addSources(map);
    addLayers(map);

    const ghData = await loadGHData(csvUrl || 'gh_input.csv');

    return {
        /** Update layers with { riskScore, pm25Level, trucksDiverted } */
        updateMapLayers: (data) => _updateMapLayers(map, data),

        /** Convenience: pass a tax amount (0-100), looks up gh_input.csv */
        updateFromTax: (taxAmount) => {
            const row = ghData[Math.round(taxAmount)];
            if (!row) return;
            _updateMapLayers(map, {
                riskScore:      row.risk_score,
                pm25Level:      row.pm25_ug_m3,
                trucksDiverted: row.trucks_diverted
            });
        },

        showLayers: () => _showLayers(map),
        hideLayers: () => _hideLayers(map),

        ghData,
        LAYERS: VIZ_LAYERS,
        SOURCES: VIZ_SOURCES
    };
}
