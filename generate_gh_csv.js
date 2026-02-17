/**
 * generate_gh_csv.js
 *
 * Calls the simulation API for every tax amount ($0–$100),
 * normalizes the results, and writes a complete gh_input.csv.
 *
 * Usage:  node generate_gh_csv.js
 */

const API = 'https://scroll-y8wn.onrender.com';
const fs = require('fs');
const path = require('path');

// ---- normalization (mirrors grasshopperExport.js) ----

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const normalizePM25 = (ug) => clamp01((ug || 0) / 35);

const normalizeSpeed = (mph) => {
  if (mph == null) return 0.5;
  const t = (mph - 5) / (60 - 5);
  return clamp01(0.8 + t * (0.2 - 0.8));
};

const normalizeTrucks = (n) => clamp01((n || 0) / 6000);

const riskScore = (pm, jt, dn) =>
  clamp01(0.4 * pm + 0.35 * jt + 0.25 * (1 - dn));

// ---- fetch helpers ----

async function fetchTraffic() {
  const res = await fetch(`${API}/traffic/current`);
  if (!res.ok) return { latest_speed_mph: null };
  return res.json();
}

async function simulate(tax) {
  const res = await fetch(`${API}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tax_amount: tax }),
  });
  if (!res.ok) throw new Error(`simulate(${tax}) → ${res.status}`);
  return res.json();
}

// ---- main ----

(async () => {
  console.log('Fetching current traffic data...');
  const traffic = await fetchTraffic();
  const speed = traffic.latest_speed_mph;
  console.log(`  speed = ${speed ?? 'unknown'} mph\n`);

  const BASELINE_PM25 = 13.2;
  const header =
    'tax_amount,pm25_ug_m3,speed_mph,trucks_diverted,radius_pm25,jitter_speed,density_trucks,risk_score';
  const lines = [header];

  // $0 through $100 in $1 steps
  for (let tax = 0; tax <= 100; tax++) {
    try {
      const d = await simulate(tax);

      const pm25Eff = Math.max(0, BASELINE_PM25 - (d.pm25_reduction_ug_m3 || 0));
      const trucks = d.trucks_diverted || 0;

      const r = normalizePM25(pm25Eff);
      const j = normalizeSpeed(speed);
      const dn = normalizeTrucks(trucks);
      const rs = riskScore(r, j, dn);

      lines.push(
        [
          tax,
          pm25Eff.toFixed(3),
          speed ?? '',
          trucks,
          r.toFixed(4),
          j.toFixed(4),
          dn.toFixed(4),
          rs.toFixed(4),
        ].join(',')
      );

      // progress every 10
      if (tax % 10 === 0) console.log(`  $${tax} → trucks_diverted=${trucks}, pm25=${pm25Eff.toFixed(3)}`);
    } catch (err) {
      console.error(`  $${tax} FAILED: ${err.message}`);
    }
  }

  const outPath = path.join(__dirname, 'gh_input.csv');
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
  console.log(`\nDone — ${lines.length - 1} rows written to ${outPath}`);
})();
