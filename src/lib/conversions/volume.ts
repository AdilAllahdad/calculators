/**
 * Volume unit conversion utility functions.
 * Provides standardized conversion factors and functions for volume measurements.
 */

// Basic conversion factors to a standard unit (cubic meters)
export const volumeToCubicMeters = {
  'm³': 1,              // cubic meters to cubic meters
  'dm³': 0.001,         // cubic decimeters to cubic meters
  'cm³': 0.000001,      // cubic centimeters to cubic meters
  'mm³': 1e-9,          // cubic millimeters to cubic meters
  'cu in': 0.0000163871, // cubic inches to cubic meters
  'cu ft': 0.0283168,   // cubic feet to cubic meters
  'cu yd': 0.764555,    // cubic yards to cubic meters
  'gal': 0.00378541,    // US gallons to cubic meters
  'L': 0.001,           // liters to cubic meters
  'mL': 0.000001,       // milliliters to cubic meters
};

// Conversion factors between any two units
export const volumeConversions: Record<string, Record<string, number>> = {
  'm³': {
    'dm³': 1000,           // cubic meters to cubic decimeters
    'cm³': 1000000,        // cubic meters to cubic centimeters
    'mm³': 1e+9,           // cubic meters to cubic millimeters
    'cu in': 61023.7,      // cubic meters to cubic inches
    'cu ft': 35.3147,      // cubic meters to cubic feet
    'cu yd': 1.30795,      // cubic meters to cubic yards
    'gal': 264.172,        // cubic meters to US gallons
    'L': 1000,             // cubic meters to liters
    'mL': 1000000,         // cubic meters to milliliters
  },
  'dm³': {
    'm³': 0.001,           // cubic decimeters to cubic meters
    'cm³': 1000,           // cubic decimeters to cubic centimeters
    'mm³': 1000000,        // cubic decimeters to cubic millimeters
    'cu in': 61.0237,      // cubic decimeters to cubic inches
    'cu ft': 0.0353147,    // cubic decimeters to cubic feet
    'cu yd': 0.00130795,   // cubic decimeters to cubic yards
    'gal': 0.264172,       // cubic decimeters to US gallons
    'L': 1,                // cubic decimeters to liters (they are equivalent)
    'mL': 1000,            // cubic decimeters to milliliters
  },
  'cm³': {
    'm³': 0.000001,        // cubic centimeters to cubic meters
    'dm³': 0.001,          // cubic centimeters to cubic decimeters
    'mm³': 1000,           // cubic centimeters to cubic millimeters
    'cu in': 0.0610237,    // cubic centimeters to cubic inches
    'cu ft': 0.0000353147, // cubic centimeters to cubic feet
    'cu yd': 0.00000130795, // cubic centimeters to cubic yards
    'gal': 0.000264172,    // cubic centimeters to US gallons
    'L': 0.001,            // cubic centimeters to liters
    'mL': 1,               // cubic centimeters to milliliters
  },
  'mm³': {
    'm³': 1e-9,            // cubic millimeters to cubic meters
    'dm³': 1e-6,           // cubic millimeters to cubic decimeters
    'cm³': 0.001,          // cubic millimeters to cubic centimeters
    'cu in': 0.0000610237, // cubic millimeters to cubic inches
    'cu ft': 3.53147e-8,   // cubic millimeters to cubic feet
    'cu yd': 1.30795e-9,   // cubic millimeters to cubic yards
    'gal': 2.64172e-7,     // cubic millimeters to US gallons
    'L': 0.000001,         // cubic millimeters to liters
    'mL': 0.001,           // cubic millimeters to milliliters
  },
  'cu in': {
    'm³': 0.0000163871,    // cubic inches to cubic meters
    'dm³': 0.0163871,      // cubic inches to cubic decimeters
    'cm³': 16.3871,        // cubic inches to cubic centimeters
    'mm³': 16387.1,        // cubic inches to cubic millimeters
    'cu ft': 0.000578704,  // cubic inches to cubic feet
    'cu yd': 0.0000214335, // cubic inches to cubic yards
    'gal': 0.00432900,     // cubic inches to US gallons
    'L': 0.0163871,        // cubic inches to liters
    'mL': 16.3871,         // cubic inches to milliliters
  },
  'cu ft': {
    'm³': 0.0283168,       // cubic feet to cubic meters
    'dm³': 28.3168,        // cubic feet to cubic decimeters
    'cm³': 28316.8,        // cubic feet to cubic centimeters
    'mm³': 28316800,       // cubic feet to cubic millimeters
    'cu in': 1728,         // cubic feet to cubic inches
    'cu yd': 0.037037,     // cubic feet to cubic yards
    'gal': 7.48052,        // cubic feet to US gallons
    'L': 28.3168,          // cubic feet to liters
    'mL': 28316.8,         // cubic feet to milliliters
  },
  'cu yd': {
    'm³': 0.764555,        // cubic yards to cubic meters
    'dm³': 764.555,        // cubic yards to cubic decimeters
    'cm³': 764555,         // cubic yards to cubic centimeters
    'mm³': 764555000,      // cubic yards to cubic millimeters
    'cu in': 46656,        // cubic yards to cubic inches
    'cu ft': 27,           // cubic yards to cubic feet
    'gal': 201.974,        // cubic yards to US gallons
    'L': 764.555,          // cubic yards to liters
    'mL': 764555,          // cubic yards to milliliters
  },
  'gal': {
    'm³': 0.00378541,      // US gallons to cubic meters
    'dm³': 3.78541,        // US gallons to cubic decimeters
    'cm³': 3785.41,        // US gallons to cubic centimeters
    'mm³': 3785410,        // US gallons to cubic millimeters
    'cu in': 231,          // US gallons to cubic inches
    'cu ft': 0.133681,     // US gallons to cubic feet
    'cu yd': 0.00495179,   // US gallons to cubic yards
    'L': 3.78541,          // US gallons to liters
    'mL': 3785.41,         // US gallons to milliliters
  },
  'L': {
    'm³': 0.001,           // liters to cubic meters
    'dm³': 1,              // liters to cubic decimeters (they are equivalent)
    'cm³': 1000,           // liters to cubic centimeters
    'mm³': 1000000,        // liters to cubic millimeters
    'cu in': 61.0237,      // liters to cubic inches
    'cu ft': 0.0353147,    // liters to cubic feet
    'cu yd': 0.00130795,   // liters to cubic yards
    'gal': 0.264172,       // liters to US gallons
    'mL': 1000,            // liters to milliliters
  },
  'mL': {
    'm³': 0.000001,        // milliliters to cubic meters
    'dm³': 0.001,          // milliliters to cubic decimeters
    'cm³': 1,              // milliliters to cubic centimeters
    'mm³': 1000,           // milliliters to cubic millimeters
    'cu in': 0.0610237,    // milliliters to cubic inches
    'cu ft': 0.0000353147, // milliliters to cubic feet
    'cu yd': 0.00000130795, // milliliters to cubic yards
    'gal': 0.000264172,    // milliliters to US gallons
    'L': 0.001,            // milliliters to liters
  },
};

/**
 * Converts a value from one volume unit to another
 * @param value The numeric value to convert
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns The converted value
 */
export function convertVolume(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  // Use direct conversion if available
  if (volumeConversions[fromUnit] && volumeConversions[fromUnit][toUnit]) {
    return value * volumeConversions[fromUnit][toUnit];
  }
  
  // Otherwise convert via standard unit (cubic meters)
  const valueInCubicMeters = value * volumeToCubicMeters[fromUnit as keyof typeof volumeToCubicMeters];
  return valueInCubicMeters / volumeToCubicMeters[toUnit as keyof typeof volumeToCubicMeters];
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
