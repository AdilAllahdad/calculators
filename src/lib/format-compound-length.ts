// Utility to format a length value as feet/inches or meters/centimeters
// Usage: formatCompoundLength(value, fromUnit, toCompound)
// toCompound: 'ft-in' or 'm-cm'
import { convertUnit } from '@/lib/convert-units-wrapper';

export function formatCompoundLength(value: number, fromUnit: string, toCompound: 'ft-in' | 'm-cm'): string {
  if (toCompound === 'ft-in') {
    // Convert to inches
    const totalInches = convertUnit(value, fromUnit, 'in');
    const feet = Math.floor(totalInches / 12);
    const inches = +(totalInches - feet * 12).toFixed(2);
    return `${feet} ft ${inches} in`;
  }
  if (toCompound === 'm-cm') {
    // Convert to centimeters
    const totalCm = convertUnit(value, fromUnit, 'cm');
    const meters = Math.floor(totalCm / 100);
    const centimeters = +(totalCm - meters * 100).toFixed(2);
    return `${meters} m ${centimeters} cm`;
  }
  return value.toString();
}
