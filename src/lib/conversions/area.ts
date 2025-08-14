/**
 * Area unit conversion utility functions.
 * Provides standardized conversion factors and functions for area measurements.
 */

// Basic conversion factors to a standard unit (square meters)
export const areaToSquareMeters = {
  'm²': 1,              // square meters to square meters
  'km²': 1000000,       // square kilometers to square meters
  'in²': 0.00064516,    // square inches to square meters
  'ft²': 0.092903,      // square feet to square meters
  'yd²': 0.836127,      // square yards to square meters
  'mi²': 2589988.11,    // square miles to square meters
  'ac': 4046.86,        // acres to square meters
  'ha': 10000,          // hectares to square meters
};

// Conversion factors between any two units
export const areaConversions: Record<string, Record<string, number>> = {
  'm²': {
    'km²': 0.000001,       // square meters to square kilometers
    'in²': 1550.0031,      // square meters to square inches
    'ft²': 10.7639,        // square meters to square feet
    'yd²': 1.19599,        // square meters to square yards
    'mi²': 3.861e-7,       // square meters to square miles
    'ac': 0.000247105,     // square meters to acres
    'ha': 0.0001,          // square meters to hectares
  },
  'km²': {
    'm²': 1000000,         // square kilometers to square meters
    'in²': 1.55e+9,        // square kilometers to square inches
    'ft²': 10763910.4,     // square kilometers to square feet
    'yd²': 1195990.05,     // square kilometers to square yards
    'mi²': 0.386102,       // square kilometers to square miles
    'ac': 247.105,         // square kilometers to acres
    'ha': 100,             // square kilometers to hectares
  },
  'in²': {
    'm²': 0.00064516,      // square inches to square meters
    'km²': 6.4516e-10,     // square inches to square kilometers
    'ft²': 0.00694444,     // square inches to square feet
    'yd²': 0.000771605,    // square inches to square yards
    'mi²': 2.491e-10,      // square inches to square miles
    'ac': 1.5942e-7,       // square inches to acres
    'ha': 6.4516e-8,       // square inches to hectares
  },
  'ft²': {
    'm²': 0.092903,        // square feet to square meters
    'km²': 9.2903e-8,      // square feet to square kilometers
    'in²': 144,            // square feet to square inches
    'yd²': 0.111111,       // square feet to square yards
    'mi²': 3.587e-8,       // square feet to square miles
    'ac': 2.2957e-5,       // square feet to acres
    'ha': 9.2903e-6,       // square feet to hectares
  },
  'yd²': {
    'm²': 0.836127,        // square yards to square meters
    'km²': 8.36127e-7,     // square yards to square kilometers
    'in²': 1296,           // square yards to square inches
    'ft²': 9,              // square yards to square feet
    'mi²': 3.228e-7,       // square yards to square miles
    'ac': 0.000206612,     // square yards to acres
    'ha': 8.36127e-5,      // square yards to hectares
  },
  'mi²': {
    'm²': 2589988.11,      // square miles to square meters
    'km²': 2.58999,        // square miles to square kilometers
    'in²': 4.014e+9,       // square miles to square inches
    'ft²': 27878400,       // square miles to square feet
    'yd²': 3097600,        // square miles to square yards
    'ac': 640,             // square miles to acres
    'ha': 258.999,         // square miles to hectares
  },
  'ac': {
    'm²': 4046.86,         // acres to square meters
    'km²': 0.00404686,     // acres to square kilometers
    'in²': 6.273e+6,       // acres to square inches
    'ft²': 43560,          // acres to square feet
    'yd²': 4840,           // acres to square yards
    'mi²': 0.0015625,      // acres to square miles
    'ha': 0.404686,        // acres to hectares
  },
  'ha': {
    'm²': 10000,           // hectares to square meters
    'km²': 0.01,           // hectares to square kilometers
    'in²': 1.55e+7,        // hectares to square inches
    'ft²': 107639,         // hectares to square feet
    'yd²': 11959.9,        // hectares to square yards
    'mi²': 0.00386102,     // hectares to square miles
    'ac': 2.47105,         // hectares to acres
  },
};

/**
 * Converts a value from one area unit to another
 * @param value The numeric value to convert
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns The converted value
 */
export function convertArea(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  // Use direct conversion if available
  if (areaConversions[fromUnit] && areaConversions[fromUnit][toUnit]) {
    return value * areaConversions[fromUnit][toUnit];
  }
  
  // Otherwise convert via standard unit (square meters)
  const valueInSquareMeters = value * areaToSquareMeters[fromUnit as keyof typeof areaToSquareMeters];
  return valueInSquareMeters / areaToSquareMeters[toUnit as keyof typeof areaToSquareMeters];
}

/**
 * Formats a number for display with appropriate decimal places
 * @param value The number to format
 * @param options Formatting options
 * @returns The formatted string
 */
export function formatNumber(
  value: number, 
  options: { 
    minimumFractionDigits?: number, 
    maximumFractionDigits?: number,
    useCommas?: boolean
  } = {}
): string {
  const { 
    minimumFractionDigits = 0, 
    maximumFractionDigits = 4,
    useCommas = true
  } = options;
  
  if (useCommas) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits
    });
  }
  
  // Determine appropriate decimal places based on magnitude
  let decimalPlaces = maximumFractionDigits;
  if (Math.abs(value) < 0.001) decimalPlaces = 8;
  else if (Math.abs(value) < 0.1) decimalPlaces = 6;
  else if (Math.abs(value) > 1000) decimalPlaces = 2;
  
  // Format the number to the appropriate precision
  const formattedValue = value.toFixed(decimalPlaces);
  
  // Remove trailing zeros and decimal point if needed
  return parseFloat(formattedValue).toString();
}
