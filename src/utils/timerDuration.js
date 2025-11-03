export function timerDuration(startTime) {
  const start = new Date(startTime);
  const end = new Date();
  const durationMs = end - start;

  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));

  if (hours > 1) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 1) {
    return `${minutes}m ${seconds}s`;
  } else if (seconds >= 0) {
    return `${seconds}s`;
  }
}
