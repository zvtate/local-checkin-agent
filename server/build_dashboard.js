'use strict';
const { execSync } = require('child_process');
const Database = require('better-sqlite3');

const SHEET_ID = '1hxwfZBxPJxK8Xa8fn8-4Rm8iAySLUOKE2mFPBZhzHMw';
const db = new Database('./local.db');

const rgb  = (r,g,b) => ({ red: r/255, green: g/255, blue: b/255 });
const WHITE       = rgb(255,255,255);
const DARK_GREEN  = rgb(27,  94,  32);
const MID_GREEN   = rgb(56, 142,  60);
const LIGHT_GREEN = rgb(232,245,233);
const DARK_BLUE   = rgb(13,  71, 161);
const LIGHT_BLUE  = rgb(227,242,253);
const AMBER       = rgb(255,160,  0);
const LIGHT_AMBER = rgb(255,248,225);
const RED         = rgb(183, 28, 28);
const LIGHT_RED   = rgb(255,235,238);
const GREY_HEADER = rgb(55,  71,  79);
const LIGHT_GREY  = rgb(245,245,245);
const GOLD        = rgb(255,214,  0);
const DARK_GOLD   = rgb(180,130,  0);

const THEME_COLORS = {
  A: { dark: rgb(13,  71,161), light: rgb(227,242,253) },
  B: { dark: rgb(27,  94, 32), light: rgb(232,245,233) },
  C: { dark: rgb(230,119,  0), light: rgb(255,243,224) },
  D: { dark: rgb(106, 27,154), light: rgb(243,229,245) },
  E: { dark: rgb(183, 28, 28), light: rgb(255,235,238) },
  F: { dark: rgb(  0,105, 92), light: rgb(224,242,241) },
  G: { dark: rgb( 74, 20,140), light: rgb(237,231,246) },
  H: { dark: rgb( 62, 39, 35), light: rgb(239,235,233) },
};

function gwsBatch(requests) {
  const payload = JSON.stringify({ requests });
  const cmd = `gws sheets spreadsheets batchUpdate --params '{"spreadsheetId":"${SHEET_ID}"}' --json '${payload.replace(/'/g, "'\\''")}'`;
  return JSON.parse(execSync(cmd, { maxBuffer: 20 * 1024 * 1024 }).toString());
}

function gwsWrite(range, values) {
  const body = JSON.stringify({ majorDimension: 'ROWS', values });
  const params = JSON.stringify({ spreadsheetId: SHEET_ID, range, valueInputOption: 'USER_ENTERED' });
  const cmd = `gws sheets spreadsheets values update --params '${params.replace(/'/g, "'\\''")}' --json '${body.replace(/'/g, "'\\''")}'`;
  return JSON.parse(execSync(cmd, { maxBuffer: 20 * 1024 * 1024 }).toString());
}

function gwsGet() {
  const cmd = `gws sheets spreadsheets get --params '{"spreadsheetId":"${SHEET_ID}"}'`;
  return JSON.parse(execSync(cmd, { maxBuffer: 20 * 1024 * 1024 }).toString());
}

// ── Load data from SQLite ─────────────────────────────────────
const provinces = db.prepare('SELECT id, name, code, current_score, exp_weight FROM provinces ORDER BY current_score DESC').all();
const pms = db.prepare('SELECT pm_number, theme, theme_name, label, max_score FROM pms ORDER BY pm_number').all();

const scoreRows = db.prepare(`
  SELECT p.id as prov_id, si.pm_number, SUM(ps.score) as score, SUM(si.max_score) as max_score
  FROM provinces p
  JOIN province_scores ps ON ps.province_id = p.id
  JOIN sub_indicators si ON si.id = ps.sub_indicator
  GROUP BY p.id, si.pm_number
`).all();

// Build lookup: provId → pmNumber → { score, max }
const lookup = {};
scoreRows.forEach(r => {
  if (!lookup[r.prov_id]) lookup[r.prov_id] = {};
  lookup[r.prov_id][r.pm_number] = { score: r.score, max: r.max_score };
});

// ── Step 1: Find or create our dashboard sheets ───────────────
console.log('Getting spreadsheet metadata...');
const spreadsheet = gwsGet();
const existingSheets = {};
spreadsheet.sheets.forEach(s => {
  existingSheets[s.properties.title] = s.properties.sheetId;
});

const NEEDED = ['Province Matrix', 'Submissions Pivot'];
const toDelete = Object.entries(existingSheets)
  .filter(([t]) => NEEDED.includes(t))
  .map(([, id]) => ({ deleteSheet: { sheetId: id } }));

const toCreate = NEEDED.map(title => ({
  addSheet: { properties: { title } }
}));

const setupRequests = [...toDelete, ...toCreate];
console.log(`Recreating ${toCreate.length} dashboard sheets...`);
const setupResp = gwsBatch(setupRequests);

// Get new sheet IDs from replies (only addSheet replies have data)
const addReplies = setupResp.replies.filter(r => r.addSheet);
const SID_MATRIX = addReplies[0].addSheet.properties.sheetId;
const SID_PIVOT  = addReplies[1].addSheet.properties.sheetId;
const SID_SUBMIT = existingSheets['Submissions'] || 2125495364;
console.log(`Province Matrix sheetId: ${SID_MATRIX}`);
console.log(`Submissions Pivot sheetId: ${SID_PIVOT}`);

// ── Step 2: Build Province Matrix data ────────────────────────
// Header row 1: Theme labels spanning PM columns
// Header row 2: Province | Code | Score | Max | % | PM1 | PM2 | ... PM18
// Rows 3–11: Province data
// Row 12: Max row

const pmNumbers = pms.map(p => p.pm_number);  // [1..18]

// Row 1: group headers (we'll merge theme spans later)
// Row 2: column headers
const colHeaders = ['Province', 'Code', 'Score', 'Max', '%', ...pmNumbers.map(n => `PM${n}`)];

// Data rows
const dataRows = provinces.map(prov => {
  const totalMax = pms.reduce((sum, pm) => sum + pm.max_score, 0);
  const pct = Math.round((prov.current_score / totalMax) * 100) + '%';
  const pmScores = pmNumbers.map(n => {
    const d = lookup[prov.id]?.[n];
    return d ? d.score : 0;
  });
  return [prov.name, prov.code, prov.current_score, totalMax, pct, ...pmScores];
});

// Max row
const maxRow = ['MAX', '', pms.reduce((s, p) => s + p.max_score, 0), pms.reduce((s, p) => s + p.max_score, 0), '100%',
  ...pmNumbers.map(n => pms.find(p => p.pm_number === n)?.max_score ?? 0)];

// Theme label row (row 1)
const themeRow = ['', '', '', '', ''];
const themeSpans = [];
let col = 5;
const themeGroups = {};
pms.forEach(pm => {
  if (!themeGroups[pm.theme]) themeGroups[pm.theme] = { theme: pm.theme, name: pm.theme_name, start: col, count: 0 };
  themeGroups[pm.theme].count++;
  col++;
});
const themeRowData = ['', '', '', '', '', ...pms.map(pm => '')];
Object.values(themeGroups).forEach(tg => {
  themeRowData[tg.start] = `${tg.theme}: ${tg.name}`;
});

const matrixValues = [themeRowData, colHeaders, ...dataRows, maxRow];
console.log('Writing Province Matrix data...');
gwsWrite(`Province Matrix!A1`, matrixValues);

// ── Step 3: Build Submissions Pivot header/instructions ───────
const pivotHeader = [
  ['SUBMISSIONS LIVE PIVOT — Province × Check-in'],
  ['This table updates automatically as new form responses arrive.'],
  [''],
  ['Province', 'CI-1 Apr', 'CI-2 Apr', 'CI-3 Jun', 'CI-4 Jul', 'CI-5 Sep', 'CI-6 Oct', 'CI-7 Dec', 'CI-8 Feb', 'CI-9 Mar', 'Total'],
];
const pivotRows = provinces.map(p => [p.name, ...Array(9).fill(''), '']);
gwsWrite(`Submissions Pivot!A1`, [...pivotHeader, ...pivotRows]);

// ── Step 4: Apply formatting ───────────────────────────────────
console.log('Applying formatting...');

// Helper: cell format request
function cellFmt(sheetId, r1, c1, r2, c2, fmt, fields) {
  return {
    repeatCell: {
      range: { sheetId, startRowIndex: r1, endRowIndex: r2, startColumnIndex: c1, endColumnIndex: c2 },
      cell: { userEnteredFormat: fmt },
      fields: fields || 'userEnteredFormat'
    }
  };
}

function colWidth(sheetId, col, pixels) {
  return {
    updateDimensionProperties: {
      range: { sheetId, dimension: 'COLUMNS', startIndex: col, endIndex: col + 1 },
      properties: { pixelSize: pixels }, fields: 'pixelSize'
    }
  };
}

function mergeRange(sheetId, r1, c1, r2, c2) {
  return { mergeCells: { range: { sheetId, startRowIndex: r1, endRowIndex: r2, startColumnIndex: c1, endColumnIndex: c2 }, mergeType: 'MERGE_ALL' } };
}

// Merge theme header cells
const mergeRequests = [];
let pmCol = 5;
Object.values(themeGroups).forEach(tg => {
  if (tg.count > 1) mergeRequests.push(mergeRange(SID_MATRIX, 0, tg.start, 1, tg.start + tg.count));
  pmCol += tg.count;
});

const formatRequests = [
  // Matrix: theme header row
  cellFmt(SID_MATRIX, 0, 0, 1, 5 + pmNumbers.length,
    { backgroundColor: GREY_HEADER, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
  ),
  // Column header row
  cellFmt(SID_MATRIX, 1, 0, 2, 5 + pmNumbers.length,
    { backgroundColor: DARK_GREEN, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
  ),
  // Province name column
  cellFmt(SID_MATRIX, 2, 0, 2 + provinces.length, 1,
    { textFormat: { bold: true, fontSize: 9 } },
    'userEnteredFormat(textFormat)'
  ),
  // Score/Max/% columns (C–E)
  cellFmt(SID_MATRIX, 2, 2, 2 + provinces.length, 5,
    { horizontalAlignment: 'CENTER', textFormat: { bold: true, fontSize: 9 } },
    'userEnteredFormat(horizontalAlignment,textFormat)'
  ),
  // Max row
  cellFmt(SID_MATRIX, 2 + provinces.length, 0, 3 + provinces.length, 5 + pmNumbers.length,
    { backgroundColor: GREY_HEADER, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
  ),
  // Column widths
  colWidth(SID_MATRIX, 0, 150),  // Province
  colWidth(SID_MATRIX, 1, 40),   // Code
  colWidth(SID_MATRIX, 2, 50),   // Score
  colWidth(SID_MATRIX, 3, 50),   // Max
  colWidth(SID_MATRIX, 4, 45),   // %
  // PM columns
  ...pmNumbers.map((_, i) => colWidth(SID_MATRIX, 5 + i, 38)),
  // Freeze rows 1+2
  { updateSheetProperties: { properties: { sheetId: SID_MATRIX, gridProperties: { frozenRowCount: 2, frozenColumnCount: 2 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } },
  // Freeze Pivot col A
  { updateSheetProperties: { properties: { sheetId: SID_PIVOT, gridProperties: { frozenRowCount: 4, frozenColumnCount: 1 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } },
  ...mergeRequests,
];

// Theme colour bands on PM columns
Object.values(themeGroups).forEach(tg => {
  const theme = THEME_COLORS[tg.theme];
  if (!theme) return;
  // Theme header row - use theme dark colour
  formatRequests.push(cellFmt(SID_MATRIX, 0, tg.start, 1, tg.start + tg.count,
    { backgroundColor: theme.dark, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
  ));
  // PM column header - lighter shade
  formatRequests.push(cellFmt(SID_MATRIX, 1, tg.start, 2, tg.start + tg.count,
    { backgroundColor: theme.dark, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
  ));
});

// Conditional formatting: PM score cells
// Green = full marks, amber = partial, red = zero
const pmDataRange = { sheetId: SID_MATRIX, startRowIndex: 2, endRowIndex: 2 + provinces.length, startColumnIndex: 5, endColumnIndex: 5 + pmNumbers.length };
formatRequests.push(
  // Full marks
  { addConditionalFormatRule: { index: 0, rule: { ranges: [pmDataRange],
    booleanRule: { condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '4' }] },
      format: { backgroundColor: LIGHT_GREEN, textFormat: { bold: true, foregroundColor: MID_GREEN } } } } } },
  // Zero
  { addConditionalFormatRule: { index: 1, rule: { ranges: [pmDataRange],
    booleanRule: { condition: { type: 'NUMBER_EQ', values: [{ userEnteredValue: '0' }] },
      format: { backgroundColor: LIGHT_RED, textFormat: { foregroundColor: RED } } } } } },
  // Partial
  { addConditionalFormatRule: { index: 2, rule: { ranges: [pmDataRange],
    booleanRule: { condition: { type: 'NUMBER_BETWEEN', values: [{ userEnteredValue: '1' }, { userEnteredValue: '4' }] },
      format: { backgroundColor: LIGHT_AMBER, textFormat: { foregroundColor: AMBER } } } } } },
);

// Score column % conditional
const pctRange = { sheetId: SID_MATRIX, startRowIndex: 2, endRowIndex: 2 + provinces.length, startColumnIndex: 2, endColumnIndex: 3 };
formatRequests.push(
  { addConditionalFormatRule: { index: 3, rule: { ranges: [pctRange],
    booleanRule: { condition: { type: 'NUMBER_GREATER_THAN_EQ', values: [{ userEnteredValue: '50' }] },
      format: { backgroundColor: LIGHT_GREEN, textFormat: { bold: true, foregroundColor: MID_GREEN } } } } } },
  { addConditionalFormatRule: { index: 4, rule: { ranges: [pctRange],
    booleanRule: { condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '50' }] },
      format: { backgroundColor: LIGHT_AMBER, textFormat: { foregroundColor: AMBER } } } } } },
);

// Pivot sheet header formatting
formatRequests.push(
  cellFmt(SID_PIVOT, 0, 0, 1, 11,
    { backgroundColor: DARK_BLUE, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 11 }, horizontalAlignment: 'LEFT', verticalAlignment: 'MIDDLE' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
  ),
  cellFmt(SID_PIVOT, 3, 0, 4, 11,
    { backgroundColor: GREY_HEADER, textFormat: { bold: true, foregroundColor: WHITE, fontSize: 9 }, horizontalAlignment: 'CENTER' },
    'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
  ),
  cellFmt(SID_PIVOT, 4, 0, 4 + provinces.length, 1,
    { textFormat: { bold: true, fontSize: 9 } },
    'userEnteredFormat(textFormat)'
  ),
  colWidth(SID_PIVOT, 0, 160),
  ...Array(10).fill(null).map((_, i) => colWidth(SID_PIVOT, i + 1, 70)),
);

// ── Province Scores: Theme chips on column H (index 7) ───────
const SID_SCORES = 1557381689;
Object.entries(THEME_COLORS).forEach(([theme, colors], i) => {
  formatRequests.push({
    addConditionalFormatRule: {
      index: i + 20,
      rule: {
        ranges: [{ sheetId: SID_SCORES, startRowIndex: 1, endRowIndex: 300, startColumnIndex: 7, endColumnIndex: 8 }],
        booleanRule: {
          condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: theme }] },
          format: { backgroundColor: colors.dark, textFormat: { bold: true, foregroundColor: WHITE } }
        }
      }
    }
  });
  // Also chip the Theme Name column in Province Matrix (col index 7 in Province Scores = Theme letter)
});

// ── Step 5: Add dropdown validations to Submissions tab ────────
// Province dropdown (col 1 = B)
const provinceValues = provinces.map(p => p.name);
const answerValues = ['YES', 'NO', 'BOTH', 'NONE', 'YES_ALL', 'SUBMITTED', 'OVER_75'];
const followupValues = ['YES', 'NO', 'PARTIAL'];

formatRequests.push(
  // Province validation
  {
    setDataValidation: {
      range: { sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 1, endColumnIndex: 2 },
      rule: {
        condition: { type: 'ONE_OF_LIST', values: provinceValues.map(v => ({ userEnteredValue: v })) },
        inputMessage: 'Select a province',
        strict: true,
        showCustomUi: true
      }
    }
  },
  // Answer validation
  {
    setDataValidation: {
      range: { sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 5, endColumnIndex: 6 },
      rule: {
        condition: { type: 'ONE_OF_LIST', values: answerValues.map(v => ({ userEnteredValue: v })) },
        inputMessage: 'Select an answer',
        strict: false,
        showCustomUi: true
      }
    }
  },
  // Follow-up validation
  {
    setDataValidation: {
      range: { sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 6, endColumnIndex: 7 },
      rule: {
        condition: { type: 'ONE_OF_LIST', values: followupValues.map(v => ({ userEnteredValue: v })) },
        inputMessage: 'Select follow-up response',
        strict: false,
        showCustomUi: true
      }
    }
  },
);

// ── Step 6: Add actual pivot table to Submissions Pivot sheet ──
// Province × CI# count of submissions
formatRequests.push({
  updateCells: {
    rows: [{
      values: [{
        pivotTable: {
          source: {
            sheetId: SID_SUBMIT,
            startRowIndex: 0, endRowIndex: 1000,
            startColumnIndex: 0, endColumnIndex: 8
          },
          rows: [{
            sourceColumnOffset: 1,  // Province name (col B)
            showTotals: true,
            sortOrder: 'ASCENDING',
            valueBucket: {}
          }],
          columns: [{
            sourceColumnOffset: 3,  // CI# (col D)
            showTotals: true,
            sortOrder: 'ASCENDING',
            valueBucket: {}
          }],
          values: [{
            summarizeFunction: 'COUNTA',
            sourceColumnOffset: 0,   // Timestamp (count rows)
            name: 'Responses'
          }],
          valueLayout: 'HORIZONTAL'
        }
      }]
    }],
    start: { sheetId: SID_PIVOT, rowIndex: 6, columnIndex: 0 },
    fields: 'pivotTable'
  }
});

gwsBatch(formatRequests);
console.log('✓ Dashboard built: Province Matrix + Submissions Pivot + Dropdowns');
