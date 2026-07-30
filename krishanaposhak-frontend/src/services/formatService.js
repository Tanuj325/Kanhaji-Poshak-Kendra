export const formatService = {
  price(amount, options = {}) {
    const { showSymbol = true, compact = false } = options;
    const value = Number(amount);
    if (Number.isNaN(value)) return '—';

    const formatter = new Intl.NumberFormat('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      maximumFractionDigits: 0,
      ...(compact && { notation: 'compact' }),
    });

    return formatter.format(value);
  },

  date(date, options = {}) {
    if (!date) return '—';
    const { format = 'medium' } = options;

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
      return new Intl.DateTimeFormat('en-IN', formatMap[format]).format(
        new Date(date)
      );
    } catch {
      return '—';
    }
  },

  phone(phone) {
    if (!phone) return '—';
    // Indian mobile: 98765 43210
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  truncate(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
  },

  orderNumber(number) {
    if (!number) return '—';
    return `#${number}`;
  },
};

