/**
 * Utility functions for calculations
 */

// Convert units to a common base
export const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
  // Length conversions to feet
  const lengthConversions: { [key: string]: number } = {
    'mm': 0.0032808,
    'cm': 0.032808,
    'm': 3.28084,
    'in': 0.083333,
    'ft': 1,
    'ft/in': 1
  };

  // Area conversions to square feet
  const areaConversions: { [key: string]: number } = {
    'mm²': 0.0000107639,
    'cm²': 0.00107639,
    'm²': 10.7639,
    'in²': 0.00694444,
    'ft²': 1
  };

  // Volume conversions to cubic feet
  const volumeConversions: { [key: string]: number } = {
    'mm³': 0.0000000353147,
    'cm³': 0.0000353147,
    'm³': 35.3147,
    'in³': 0.000578704,
    'ft³': 1
  };

  // Determine conversion type and apply conversion
  if (lengthConversions[fromUnit] && lengthConversions[toUnit]) {
    return (value * lengthConversions[fromUnit]) / lengthConversions[toUnit];
  } else if (areaConversions[fromUnit] && areaConversions[toUnit]) {
    return (value * areaConversions[fromUnit]) / areaConversions[toUnit];
  } else if (volumeConversions[fromUnit] && volumeConversions[toUnit]) {
    return (value * volumeConversions[fromUnit]) / volumeConversions[toUnit];
  }

  return value; // No conversion needed
};

// Format number with proper decimals
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

// Validate positive number input
export const validatePositiveNumber = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) || num < 0 ? 0 : num;
};
