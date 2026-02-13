import { readFileSync, writeFileSync } from 'fs';

const filePath = '/vercel/share/v0-project/lib/pokemon-data.ts';
let content = readFileSync(filePath, 'utf-8');

// Find the MOVES array section (between "export const MOVES: Move[] = [" and "];")
const movesStart = content.indexOf('export const MOVES: Move[] = [');
const movesEnd = content.indexOf('];', movesStart);
const movesSection = content.substring(movesStart, movesEnd + 2);

// Replace bare { id: entries that aren't already wrapped with m()
// Pattern: lines starting with "  { id:" should become "  m({ id:" 
// and their closing " }," should become " }),"
let newMovesSection = movesSection;

// Replace all bare "  { id:" that are NOT already "  m({ id:"
// We need to be careful - some are already wrapped
const lines = newMovesSection.split('\n');
const transformedLines = lines.map(line => {
  // Match lines that start with "  { id:" but NOT "  m({ id:"
  if (line.match(/^  \{ id: "/) && !line.match(/^  m\(\{ id: "/)) {
    // Wrap with m() - replace leading "  {" with "  m({" and trailing "}," with "}),"
    return '  m(' + line.trim().replace(/\},\s*$/, '}),');
  }
  return line;
});

newMovesSection = transformedLines.join('\n');
content = content.substring(0, movesStart) + newMovesSection + content.substring(movesEnd + 2);

writeFileSync(filePath, content, 'utf-8');
console.log('Migration complete - all moves wrapped with m()');

// Verify
const newContent = readFileSync(filePath, 'utf-8');
const bareCount = (newContent.match(/^  \{ id: "/gm) || []).length;
const wrappedCount = (newContent.match(/^  m\(\{ id: "/gm) || []).length;
console.log(`Bare entries remaining: ${bareCount}`);
console.log(`Wrapped entries: ${wrappedCount}`);
