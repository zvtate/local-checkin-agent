'use strict';
const { execSync } = require('child_process');

const SHEET_ID       = '1hxwfZBxPJxK8Xa8fn8-4Rm8iAySLUOKE2mFPBZhzHMw';
const SID_SUBMIT     = 2125495364;
const SID_SCORES     = 1557381689;
const SID_PM         = 430546440;

// ── Helpers ───────────────────────────────────────────────────
const rgb  = (r,g,b) => ({ red: r/255, green: g/255, blue: b/255 });
const rgba = (r,g,b,a=1) => ({ red: r/255, green: g/255, blue: b/255, alpha: a });

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
const WHITE       = rgb(255,255,255);
const LIGHT_GREY  = rgb(245,245,245);

// Theme colours for PM summary
const THEME_COLORS = {
  A: rgb(13,  71, 161),   // blue
  B: rgb(27,  94,  32),   // green
  C: rgb(230,119,  0),    // orange
  D: rgb(106, 27,154),    // purple
  E: rgb(183, 28, 28),    // red
  F: rgb( 0, 105,  92),   // teal
  G: rgb( 74, 20,140),    // deep purple
  H: rgb( 62,  39, 35),   // brown
};

function headerFormat(sheetId, numCols, bgColor = GREY_HEADER) {
  return {
    repeatCell: {
      range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: numCols },
      cell: {
        userEnteredFormat: {
          backgroundColor: bgColor,
          textFormat: { bold: true, foregroundColor: WHITE, fontSize: 10 },
          verticalAlignment: 'MIDDLE',
          padding: { top: 6, bottom: 6, left: 8, right: 8 },
        }
      },
      fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment,padding)'
    }
  };
}

function freezeRow(sheetId) {
  return {
    updateSheetProperties: {
      properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
      fields: 'gridProperties.frozenRowCount'
    }
  };
}

function colWidth(sheetId, col, pixels) {
  return {
    updateDimensionProperties: {
      range: { sheetId, dimension: 'COLUMNS', startIndex: col, endIndex: col + 1 },
      properties: { pixelSize: pixels },
      fields: 'pixelSize'
    }
  };
}

function altRows(sheetId, numRows, numCols) {
  return {
    addConditionalFormatRule: {
      rule: {
        ranges: [{ sheetId, startRowIndex: 1, endRowIndex: numRows, startColumnIndex: 0, endColumnIndex: numCols }],
        booleanRule: {
          condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: '=MOD(ROW(),2)=0' }] },
          format: { backgroundColor: LIGHT_GREY }
        }
      },
      index: 0
    }
  };
}

// Conditional format: score column vs max column
function scoreConditional(sheetId, scoreCol, maxCol, numRows) {
  const sc = String.fromCharCode(65 + scoreCol);
  const mc = String.fromCharCode(65 + maxCol);
  const range = { sheetId, startRowIndex: 1, endRowIndex: numRows, startColumnIndex: scoreCol, endColumnIndex: scoreCol + 1 };
  return [
    // Full marks — green
    { addConditionalFormatRule: { index: 1, rule: { ranges: [range],
      booleanRule: { condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=${sc}2=${mc}2` }] },
        format: { backgroundColor: LIGHT_GREEN, textFormat: { bold: true, foregroundColor: MID_GREEN } } } } } },
    // Zero — red
    { addConditionalFormatRule: { index: 2, rule: { ranges: [range],
      booleanRule: { condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=${sc}2=0` }] },
        format: { backgroundColor: LIGHT_RED, textFormat: { foregroundColor: RED } } } } } },
    // Partial — amber
    { addConditionalFormatRule: { index: 3, rule: { ranges: [range],
      booleanRule: { condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=AND(${sc}2>0,${sc}2<${mc}2)` }] },
        format: { backgroundColor: LIGHT_AMBER, textFormat: { foregroundColor: AMBER } } } } } },
  ];
}

// Gap column: red if >0, grey if 0
function gapConditional(sheetId, gapCol, numRows) {
  const gc = String.fromCharCode(65 + gapCol);
  const range = { sheetId, startRowIndex: 1, endRowIndex: numRows, startColumnIndex: gapCol, endColumnIndex: gapCol + 1 };
  return [
    { addConditionalFormatRule: { index: 4, rule: { ranges: [range],
      booleanRule: { condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '0' }] },
        format: { backgroundColor: LIGHT_RED, textFormat: { bold: true, foregroundColor: RED } } } } } },
    { addConditionalFormatRule: { index: 5, rule: { ranges: [range],
      booleanRule: { condition: { type: 'NUMBER_EQ', values: [{ userEnteredValue: '0' }] },
        format: { backgroundColor: LIGHT_GREEN, textFormat: { foregroundColor: MID_GREEN } } } } } },
  ];
}

// ── Build requests ────────────────────────────────────────────
const requests = [

  // ── SUBMISSIONS tab ─────────────────────────────────────────
  headerFormat(SID_SUBMIT, 8, DARK_GREEN),
  freezeRow(SID_SUBMIT),
  altRows(SID_SUBMIT, 1000, 8),
  colWidth(SID_SUBMIT, 0, 180),  // Timestamp
  colWidth(SID_SUBMIT, 1, 140),  // Province
  colWidth(SID_SUBMIT, 2, 60),   // Code
  colWidth(SID_SUBMIT, 3, 60),   // CI#
  colWidth(SID_SUBMIT, 4, 90),   // Month
  colWidth(SID_SUBMIT, 5, 130),  // Answer
  colWidth(SID_SUBMIT, 6, 130),  // Follow-up
  colWidth(SID_SUBMIT, 7, 180),  // Submitted At
  // Answer chip colours
  { addConditionalFormatRule: { index: 6, rule: { ranges: [{ sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 5, endColumnIndex: 6 }],
    booleanRule: { condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: 'YES' }] },
      format: { backgroundColor: LIGHT_GREEN, textFormat: { bold: true, foregroundColor: MID_GREEN } } } } } },
  { addConditionalFormatRule: { index: 7, rule: { ranges: [{ sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 5, endColumnIndex: 6 }],
    booleanRule: { condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: 'NO' }] },
      format: { backgroundColor: LIGHT_RED, textFormat: { foregroundColor: RED } } } } } },
  { addConditionalFormatRule: { index: 8, rule: { ranges: [{ sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 5, endColumnIndex: 6 }],
    booleanRule: { condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: 'BOTH' }] },
      format: { backgroundColor: LIGHT_GREEN, textFormat: { bold: true, foregroundColor: DARK_GREEN } } } } } },
  { addConditionalFormatRule: { index: 9, rule: { ranges: [{ sheetId: SID_SUBMIT, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 5, endColumnIndex: 6 }],
    booleanRule: { condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: 'NONE' }] },
      format: { backgroundColor: LIGHT_RED, textFormat: { bold: true, foregroundColor: RED } } } } } },

  // ── PROVINCE SCORES tab ─────────────────────────────────────
  // Cols: A=Province, B=Code, C=Score, D=ExpWeight, E=SubID, F=PM#, G=Label, H=Theme, I=Max, J=Score, K=Gap
  headerFormat(SID_SCORES, 11, DARK_GREEN),
  freezeRow(SID_SCORES),
  colWidth(SID_SCORES, 0, 140),  // Province
  colWidth(SID_SCORES, 1, 50),   // Code
  colWidth(SID_SCORES, 2, 80),   // Current Score
  colWidth(SID_SCORES, 3, 90),   // Exp Weight
  colWidth(SID_SCORES, 4, 70),   // Sub-id
  colWidth(SID_SCORES, 5, 45),   // PM#
  colWidth(SID_SCORES, 6, 300),  // Label
  colWidth(SID_SCORES, 7, 160),  // Theme
  colWidth(SID_SCORES, 8, 65),   // Max
  colWidth(SID_SCORES, 9, 55),   // Score
  colWidth(SID_SCORES, 10, 45),  // Gap
  ...scoreConditional(SID_SCORES, 9, 8, 300),   // J=Score vs I=Max
  ...gapConditional(SID_SCORES, 10, 300),        // K=Gap

  // ── PM SUMMARY tab ──────────────────────────────────────────
  // Cols: A=PM#, B=Theme, C=Theme Name, D=Label, E=Max, F=Notes
  headerFormat(SID_PM, 6, DARK_BLUE),
  freezeRow(SID_PM),
  colWidth(SID_PM, 0, 45),   // PM#
  colWidth(SID_PM, 1, 50),   // Theme
  colWidth(SID_PM, 2, 160),  // Theme Name
  colWidth(SID_PM, 3, 320),  // Label
  colWidth(SID_PM, 4, 60),   // Max
  colWidth(SID_PM, 5, 400),  // Notes
  altRows(SID_PM, 20, 6),
  // Theme colour chips on column B
  ...Object.entries(THEME_COLORS).map(([theme, color], i) => ({
    addConditionalFormatRule: { index: i + 10, rule: {
      ranges: [{ sheetId: SID_PM, startRowIndex: 1, endRowIndex: 20, startColumnIndex: 1, endColumnIndex: 2 }],
      booleanRule: {
        condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: theme }] },
        format: { backgroundColor: color, textFormat: { bold: true, foregroundColor: WHITE } }
      }
    }}
  })),
];

const payload = JSON.stringify({ requests });
const cmd = `gws sheets spreadsheets batchUpdate --params '{"spreadsheetId":"${SHEET_ID}"}' --json '${payload.replace(/'/g, "'\\''")}'`;
try {
  execSync(cmd, { maxBuffer: 10 * 1024 * 1024 });
  console.log('✓ Sheet formatting applied');
} catch(e) {
  console.error('Error:', e.message);
}
