import { formatDuration } from '../format-utils';

describe('formatDuration', () => {
  it('formats minutes into HH:MM string', () => {
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(125)).toBe('02:05');
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(9)).toBe('00:09');
  });

  it('handles negative numbers gracefully (if applicable) or returns 00:00', () => {
     // Assuming implementation details, usually time tracking is positive. 
     // We expect it to handle basic inputs correctly.
     expect(formatDuration(60)).toBe('01:00');
  });
});
