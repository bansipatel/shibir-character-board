// ============================================================================
// CHARACTER DATA — loaded at runtime from assets/data.csv, so names/quotes
// can be edited in Excel/Google Sheets without touching any code. Open that
// file, edit it, save as CSV (keep the same "category,name,quote" columns),
// and push — no code changes needed. See README for the full workflow.
//
// IMPORTANT: quotes are short factual descriptors written from general
// knowledge, not verbatim scripture quotes. Given how many of these are real
// historical/religious teachers and saints, review every line for accuracy
// and respectfulness before using this at Shibir.
// ============================================================================

// Rotates across every name in the cloud (not per-category) for visual variety.
const TILE_VARIANTS = ['v1', 'v2', 'v3', 'v4'];

let CATEGORIES = [];
let FLAT_CHARACTERS = [];

// Minimal RFC4180-ish CSV parser: handles quoted fields, commas and
// double-quotes inside quoted fields (""), and CRLF/LF line endings.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }
  return rows;
}

// Fetches + parses assets/data.csv and populates CATEGORIES/FLAT_CHARACTERS.
// Category grouping/order follows first-appearance order in the CSV.
async function loadCharacterData() {
  const res = await fetch('assets/data.csv');
  const text = await res.text();
  const rows = parseCSV(text);

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const catIdx = header.indexOf('category');
  const nameIdx = header.indexOf('name');
  const quoteIdx = header.indexOf('quote');

  const byCategory = new Map();
  for (let i = 1; i < rows.length; i++) {
    const name = (rows[i][nameIdx] || '').trim();
    if (!name) continue;
    const category = (rows[i][catIdx] || '').trim();
    const quote = (rows[i][quoteIdx] || '').trim();
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push([name, quote]);
  }

  CATEGORIES = [...byCategory.entries()].map(([name, chars]) => ({ name, chars }));
  FLAT_CHARACTERS = [];
  CATEGORIES.forEach((cat) => cat.chars.forEach(([name, quote]) => {
    FLAT_CHARACTERS.push({ name, quote, epic: cat.name.split(':')[0].trim() });
  }));
}
