export function getTimeSpanText(datInSec) {
  const now = Date.now();
  const secs = Math.round(now / 1000) - datInSec;
  if (secs < 61) {
    return 'just now';
  }
  const mins = Math.floor(secs / 60);
  if (mins < 60) {
    return mins + ' minute(s) ago';
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return hours + ' hour(s) ago';
  }
  const days = Math.floor(hours / 24);
  if (days <= 31) {
    return days + ' day(s) ago'
  }
  const months = Math.floor(days / 30);
  if (months <= 12) {
    return months + ' month(s) ago'
  }
  const years = Math.floor(months / 12);
  return years + ' year(s) ago';
}