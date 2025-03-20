
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'processing':
      return 'default';
    case 'failed':
      return 'error';
    case 'canceled':
      return 'secondary';
    default:
      return 'secondary';
  }
};

export const formatPaymentMethod = (method: string) => {
  if (!method) return 'Unknown';
  
  // Capitalize and format special cases
  const methodMap: Record<string, string> = {
    'ach': 'ACH',
    'bank_transfer': 'Bank Transfer',
    'swift': 'SWIFT',
    'fedwire': 'FEDWIRE',
    'zelle': 'Zelle',
    'card_push': 'Card Push',
    'wire': 'Wire Transfer',
    'ACH': 'ACH',
    'SWIFT': 'SWIFT',
    'ZELLE': 'Zelle',
    'WIRE': 'Wire Transfer',
    'FEDWIRE': 'FEDWIRE',
    'CARD_PUSH': 'Card Push',
    'BANK_TRANSFER': 'Bank Transfer'
  };
  
  return methodMap[method] || method;
};
