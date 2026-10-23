export function formatScore(score) {
  return new Intl.NumberFormat('en-US').format(
    Number(score) || 0
  );
}

export function formatTime(seconds) {
  const total = Math.max(0, Number(seconds) || 0);

  const minutes = Math.floor(total / 60);
  const remaining = total % 60;

  return `${String(minutes).padStart(2, '0')}:${String(
    remaining
  ).padStart(2, '0')}`;
}
