const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const THIRTY_DAYS = 30 * DAY;

export const formatSuggestionDate = (date: string, now: Date = new Date()) => {
  const parsed = new Date(date);
  const seconds = (now.valueOf() - parsed.valueOf()) / 1000;

  if (seconds < MINUTE) {
    return 'now';
  }
  if (seconds < HOUR) {
    return `${Math.trunc(seconds / MINUTE)}m ago`;
  }
  if (seconds < DAY) {
    return `${Math.trunc(seconds / HOUR)}h ago`;
  }
  if (seconds < THIRTY_DAYS) {
    return `${Math.trunc(seconds / DAY)}d ago`;
  }
  return parsed.toLocaleDateString(undefined, { dateStyle: 'medium' });
};
