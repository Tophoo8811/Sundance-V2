/*
Simple utility to generate an `index.json` manifest inside each photo folder.
Run this from the repository root with Node (needs Node.js installed).
It will recurse through `Properties/list/*/Photos` directories and write a
JSON file listing all image filenames.  The front‑end script (script.js)
uses this manifest to load galleries on GitHub Pages.
*/

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'Properties', 'list');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .map(d => path.join(dir, d.name));
}

function processDir(dir) {
  const photos = path.join(dir, 'Photos');
  if (fs.existsSync(photos) && fs.statSync(photos).isDirectory()) {
    const files = fs.readdirSync(photos).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));
    if (files.length) {
      const out = path.join(photos, 'index.json');
      fs.writeFileSync(out, JSON.stringify(files, null, 2));
      console.log('Wrote manifest', out);
    }
  }
}

// walk through each property folder
if (fs.existsSync(root)) {
  walk(root).forEach(p => {
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    }
  });
} else {
  console.error('Properties/list folder not found; run from repo root.');
}
