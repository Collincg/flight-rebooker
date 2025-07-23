export const formatFlightTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  });
};

export const formatPrice = (price) => {
  return price?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
};