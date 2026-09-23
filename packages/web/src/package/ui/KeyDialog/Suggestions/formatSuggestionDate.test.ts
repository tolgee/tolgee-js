import { formatSuggestionDate } from './formatSuggestionDate';

const NOW = new Date('2026-09-23T12:00:00Z');

describe('formatSuggestionDate', () => {
  it('says now for anything under a minute', () => {
    expect(formatSuggestionDate('2026-09-23T11:59:30Z', NOW)).toBe('now');
  });

  it('counts minutes, hours and days', () => {
    expect(formatSuggestionDate('2026-09-23T11:20:00Z', NOW)).toBe('40m ago');
    expect(formatSuggestionDate('2026-09-23T04:00:00Z', NOW)).toBe('8h ago');
    expect(formatSuggestionDate('2026-09-20T12:00:00Z', NOW)).toBe('3d ago');
    expect(formatSuggestionDate('2026-08-25T12:00:00Z', NOW)).toBe('29d ago');
  });

  it('shows a calendar date, not an age, once thirty days have passed', () => {
    const exactlyThirtyDays = formatSuggestionDate('2026-08-24T12:00:00Z', NOW);
    expect(exactlyThirtyDays).not.toContain('ago');
    expect(exactlyThirtyDays).toContain('2026');

    const older = formatSuggestionDate('2026-01-15T12:00:00Z', NOW);
    expect(older).not.toContain('ago');
    expect(older).toContain('2026');
  });

  it('says now rather than a negative age when the clock is skewed', () => {
    expect(formatSuggestionDate('2026-09-23T12:05:00Z', NOW)).toBe('now');
  });
});
