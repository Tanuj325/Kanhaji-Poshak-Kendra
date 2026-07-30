export function formatDate(date, options = {}) {
  if (!date) return '—';
  const { format: formatType = 'medium' } = options;

  const formatMap = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    medium: { day: 'numeric', month: 'long', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  try {
    return new Intl.DateTimeFormat('en-IN', formatMap[formatType] || formatMap.medium).format(
      new Date(date)
    );
  } catch {
    return '—';
  }
}
