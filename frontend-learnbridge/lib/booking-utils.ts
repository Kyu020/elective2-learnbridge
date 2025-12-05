// lib/booking-utils.ts
import { Booking } from '@/interfaces/bookings.interfaces';

export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

export function getStatusColor(status: Booking["status"]): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'accepted':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
}

export function getStatusIcon(status: Booking["status"]) {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'accepted':
      return '✅';
    case 'completed':
      return '🎯';
    case 'rejected':
      return '❌';
    case 'cancelled':
      return '🚫';
    default:
      return '📋';
  }
}

export function formatPrice(price: number): string {
  return `₱${price.toFixed(2)}`;
}