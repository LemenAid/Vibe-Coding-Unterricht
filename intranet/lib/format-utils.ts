// lib/time-utils.ts (Appended for testing purposes if not present, but it seems missing from file)
// Re-adding the missing export if it wasn't there, or creating a new utility file for formatting if it's strictly UI.
// Looking at the previous read, formatDuration was NOT in the file. I need to add it or find where it is.
// Since the previous read showed the file ends at line 112 without formatDuration, I will add it.

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
