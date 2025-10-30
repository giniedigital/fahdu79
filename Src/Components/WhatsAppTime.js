import React from 'react';
import { Text } from 'react-native';

const WhatsAppTime = ({ timestamp, style }) => {
  const formatTimeForWhatsApp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();

    // Start of today (local time)
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Start of yesterday (local time)
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Format time (e.g., "1:26 PM")
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Same day → "1:26 PM"
    if (date >= todayStart) {
      return timeString;
    }
    // Yesterday → "Yesterday 1:26 PM"
    else if (date >= yesterdayStart) {
      return `Yesterday ${timeString}`;
    }
    // Within last 7 days → "Wed 1:26 PM"
    else if (now - date < 7 * 24 * 60 * 60 * 1000) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return `${dayName} ${timeString}`;
    }
    // Older → "03/26/25" (MM/DD/YY format, default in en-US)
    else {
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
    }
  };

  return <Text style={style}>{formatTimeForWhatsApp(timestamp)}</Text>;
};

export default WhatsAppTime;