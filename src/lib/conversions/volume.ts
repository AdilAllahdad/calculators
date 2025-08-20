/**
 * Volume unit conversion utility functions.
 * Provides standardized conversion factors and functions for volume measurements.
 */

// Basic conversion factors to a standard unit (cubic meters)
export const volumeToCubicMeters = {
  'm³': 1,                    // cubic meters to cubic meters
  'dm³': 0.001,               // cubic decimeters to cubic meters
  'cm³': 0.000001,            // cubic centimeters to cubic meters
  'mm³': 1e-9,                // cubic millimeters to cubic meters
  'cu in': 0.0000163871,      // cubic inches to cubic meters
  'cu ft': 0.0283168,         // cubic feet to cubic meters
  'cu yd': 0.764555,          // cubic yards to cubic meters
  'gal': 0.003785411784,      // US gallons to cubic meters (legacy)
  'US gal': 0.003785411784,   // US gallons to cubic meters
  'UK gal': 0.00454609,       // UK gallons to cubic meters
  'US fl oz': 0.0000295735,   // US fluid ounces to cubic meters
  'UK fl oz': 0.0000284131,   // UK fluid ounces to cubic meters
  'L': 0.001,                 // liters to cubic meters
  'mL': 0.000001,             // milliliters to cubic meters
  'cL': 0.00001,              // centiliters to cubic meters
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
    'gal': 264.172,        // cubic meters to US gallons (legacy)
    'US gal': 264.172,     // cubic meters to US gallons
    'UK gal': 219.969,     // cubic meters to UK gallons
    'US fl oz': 33814.0,   // cubic meters to US fluid ounces
    'UK fl oz': 35195.1,   // cubic meters to UK fluid ounces
    'L': 1000,             // cubic meters to liters
    'mL': 1000000,         // cubic meters to milliliters
    'cL': 100000,          // cubic meters to centiliters
  },
  'dm³': {
    'm³': 0.001,           // cubic decimeters to cubic meters
    'cm³': 1000,           // cubic decimeters to cubic centimeters
    'mm³': 1000000,        // cubic decimeters to cubic millimeters
    'cu in': 61.0237,      // cubic decimeters to cubic inches
    'cu ft': 0.0353147,    // cubic decimeters to cubic feet
    'cu yd': 0.00130795,   // cubic decimeters to cubic yards
    'gal': 0.264172,       // cubic decimeters to US gallons (legacy)
    'US gal': 0.264172,    // cubic decimeters to US gallons
    'UK gal': 0.219969,    // cubic decimeters to UK gallons
    'US fl oz': 33.814,    // cubic decimeters to US fluid ounces
    'UK fl oz': 35.1951,   // cubic decimeters to UK fluid ounces
    'L': 1,                // cubic decimeters to liters (they are equivalent)
    'mL': 1000,            // cubic decimeters to milliliters
    'cL': 100,             // cubic decimeters to centiliters
  },
  'cm³': {
    'm³': 0.000001,        // cubic centimeters to cubic meters
    'dm³': 0.001,          // cubic centimeters to cubic decimeters
    'mm³': 1000,           // cubic centimeters to cubic millimeters
    'cu in': 0.0610237,    // cubic centimeters to cubic inches
    'cu ft': 0.0000353147, // cubic centimeters to cubic feet
    'cu yd': 0.00000130795, // cubic centimeters to cubic yards
    'gal': 0.000264172,    // cubic centimeters to US gallons (legacy)
    'US gal': 0.000264172, // cubic centimeters to US gallons
    'UK gal': 0.000219969, // cubic centimeters to UK gallons
    'US fl oz': 0.033814,  // cubic centimeters to US fluid ounces
    'UK fl oz': 0.0351951, // cubic centimeters to UK fluid ounces
    'L': 0.001,            // cubic centimeters to liters
    'mL': 1,               // cubic centimeters to milliliters
    'cL': 0.1,             // cubic centimeters to centiliters
  },
  'mm³': {
    'm³': 1e-9,            // cubic millimeters to cubic meters
    'dm³': 1e-6,           // cubic millimeters to cubic decimeters
    'cm³': 0.001,          // cubic millimeters to cubic centimeters
    'cu in': 0.0000610237, // cubic millimeters to cubic inches
    'cu ft': 3.53147e-8,   // cubic millimeters to cubic feet
    'cu yd': 1.30795e-9,   // cubic millimeters to cubic yards
    'gal': 2.64172e-7,     // cubic millimeters to US gallons (legacy)
    'US gal': 2.64172e-7,  // cubic millimeters to US gallons
    'UK gal': 2.19969e-7,  // cubic millimeters to UK gallons
    'US fl oz': 3.3814e-5, // cubic millimeters to US fluid ounces
    'UK fl oz': 3.51951e-5, // cubic millimeters to UK fluid ounces
    'L': 0.000001,         // cubic millimeters to liters
    'mL': 0.001,           // cubic millimeters to milliliters
    'cL': 0.0001,          // cubic millimeters to centiliters
  },
  'cu in': {
    'm³': 0.0000163871,    // cubic inches to cubic meters
    'dm³': 0.0163871,      // cubic inches to cubic decimeters
    'cm³': 16.3871,        // cubic inches to cubic centimeters
    'mm³': 16387.1,        // cubic inches to cubic millimeters
    'cu ft': 0.000578704,  // cubic inches to cubic feet
    'cu yd': 0.0000214335, // cubic inches to cubic yards
    'gal': 0.00432900,     // cubic inches to US gallons (legacy)
    'US gal': 0.00432900,  // cubic inches to US gallons
    'UK gal': 0.00360465,  // cubic inches to UK gallons
    'US fl oz': 0.554113,  // cubic inches to US fluid ounces
    'UK fl oz': 0.576744,  // cubic inches to UK fluid ounces
    'L': 0.0163871,        // cubic inches to liters
    'mL': 16.3871,         // cubic inches to milliliters
    'cL': 1.63871,         // cubic inches to centiliters
  },
  'cu ft': {
    'm³': 0.0283168,       // cubic feet to cubic meters
    'dm³': 28.3168,        // cubic feet to cubic decimeters
    'cm³': 28316.8,        // cubic feet to cubic centimeters
    'mm³': 28316800,       // cubic feet to cubic millimeters
    'cu in': 1728,         // cubic feet to cubic inches
    'cu yd': 0.037037,     // cubic feet to cubic yards
    'gal': 7.48052,        // cubic feet to US gallons (legacy)
    'US gal': 7.48052,     // cubic feet to US gallons
    'UK gal': 6.22884,     // cubic feet to UK gallons
    'US fl oz': 957.506,   // cubic feet to US fluid ounces
    'UK fl oz': 996.613,   // cubic feet to UK fluid ounces
    'L': 28.3168,          // cubic feet to liters
    'mL': 28316.8,         // cubic feet to milliliters
    'cL': 2831.68,         // cubic feet to centiliters
  },
  'cu yd': {
    'm³': 0.764555,        // cubic yards to cubic meters
    'dm³': 764.555,        // cubic yards to cubic decimeters
    'cm³': 764555,         // cubic yards to cubic centimeters
    'mm³': 764555000,      // cubic yards to cubic millimeters
    'cu in': 46656,        // cubic yards to cubic inches
    'cu ft': 27,           // cubic yards to cubic feet
    'gal': 201.974,        // cubic yards to US gallons (legacy)
    'US gal': 201.974,     // cubic yards to US gallons
    'UK gal': 168.179,     // cubic yards to UK gallons
    'US fl oz': 25852.7,   // cubic yards to US fluid ounces
    'UK fl oz': 26908.5,   // cubic yards to UK fluid ounces
    'L': 764.555,          // cubic yards to liters
    'mL': 764555,          // cubic yards to milliliters
    'cL': 76455.5,         // cubic yards to centiliters
  },
  'gal': {
    'm³': 0.003785411784,  // US gallons to cubic meters (legacy)
    'dm³': 3.785411784,    // US gallons to cubic decimeters
    'cm³': 3785.411784,    // US gallons to cubic centimeters
    'mm³': 3785411.784,    // US gallons to cubic millimeters
    'cu in': 231,          // US gallons to cubic inches
    'cu ft': 0.133681,     // US gallons to cubic feet
    'cu yd': 0.00495179,   // US gallons to cubic yards
    'US gal': 1,           // US gallons to US gallons
    'UK gal': 0.832674,    // US gallons to UK gallons
    'US fl oz': 128,       // US gallons to US fluid ounces
    'UK fl oz': 133.228,   // US gallons to UK fluid ounces
    'L': 3.785411784,      // US gallons to liters
    'mL': 3785.411784,     // US gallons to milliliters
    'cL': 378.5411784,     // US gallons to centiliters
  },
  'US gal': {
    'm³': 0.003785411784,  // US gallons to cubic meters
    'dm³': 3.785411784,    // US gallons to cubic decimeters
    'cm³': 3785.411784,    // US gallons to cubic centimeters
    'mm³': 3785411.784,    // US gallons to cubic millimeters
    'cu in': 231,          // US gallons to cubic inches
    'cu ft': 0.133681,     // US gallons to cubic feet
    'cu yd': 0.00495179,   // US gallons to cubic yards
    'gal': 1,              // US gallons to US gallons (legacy)
    'UK gal': 0.832674,    // US gallons to UK gallons
    'US fl oz': 128,       // US gallons to US fluid ounces
    'UK fl oz': 133.228,   // US gallons to UK fluid ounces
    'L': 3.785411784,      // US gallons to liters
    'mL': 3785.411784,     // US gallons to milliliters
    'cL': 378.5411784,     // US gallons to centiliters
  },
  'UK gal': {
    'm³': 0.00454609,      // UK gallons to cubic meters
    'dm³': 4.54609,        // UK gallons to cubic decimeters
    'cm³': 4546.09,        // UK gallons to cubic centimeters
    'mm³': 4546090,        // UK gallons to cubic millimeters
    'cu in': 277.419,      // UK gallons to cubic inches
    'cu ft': 0.160544,     // UK gallons to cubic feet
    'cu yd': 0.00594606,   // UK gallons to cubic yards
    'gal': 1.20095,        // UK gallons to US gallons (legacy)
    'US gal': 1.20095,     // UK gallons to US gallons
    'US fl oz': 153.722,   // UK gallons to US fluid ounces
    'UK fl oz': 160,       // UK gallons to UK fluid ounces
    'L': 4.54609,          // UK gallons to liters
    'mL': 4546.09,         // UK gallons to milliliters
    'cL': 454.609,         // UK gallons to centiliters
  },
  'US fl oz': {
    'm³': 0.0000295735,    // US fluid ounces to cubic meters
    'dm³': 0.0295735,      // US fluid ounces to cubic decimeters
    'cm³': 29.5735,        // US fluid ounces to cubic centimeters
    'mm³': 29573.5,        // US fluid ounces to cubic millimeters
    'cu in': 1.80469,      // US fluid ounces to cubic inches
    'cu ft': 0.00104438,   // US fluid ounces to cubic feet
    'cu yd': 0.0000386808, // US fluid ounces to cubic yards
    'gal': 0.0078125,      // US fluid ounces to US gallons (legacy)
    'US gal': 0.0078125,   // US fluid ounces to US gallons
    'UK gal': 0.00650527,  // US fluid ounces to UK gallons
    'UK fl oz': 1.04084,   // US fluid ounces to UK fluid ounces
    'L': 0.0295735,        // US fluid ounces to liters
    'mL': 29.5735,         // US fluid ounces to milliliters
    'cL': 2.95735,         // US fluid ounces to centiliters
  },
  'UK fl oz': {
    'm³': 0.0000284131,    // UK fluid ounces to cubic meters
    'dm³': 0.0284131,      // UK fluid ounces to cubic decimeters
    'cm³': 28.4131,        // UK fluid ounces to cubic centimeters
    'mm³': 28413.1,        // UK fluid ounces to cubic millimeters
    'cu in': 1.73387,      // UK fluid ounces to cubic inches
    'cu ft': 0.00100351,   // UK fluid ounces to cubic feet
    'cu yd': 0.0000371669, // UK fluid ounces to cubic yards
    'gal': 0.00750594,     // UK fluid ounces to US gallons (legacy)
    'US gal': 0.00750594,  // UK fluid ounces to US gallons
    'UK gal': 0.00625,     // UK fluid ounces to UK gallons
    'US fl oz': 0.960760,  // UK fluid ounces to US fluid ounces
    'L': 0.0284131,        // UK fluid ounces to liters
    'mL': 28.4131,         // UK fluid ounces to milliliters
    'cL': 2.84131,         // UK fluid ounces to centiliters
  },
  'L': {
    'm³': 0.001,           // liters to cubic meters
    'dm³': 1,              // liters to cubic decimeters (they are equivalent)
    'cm³': 1000,           // liters to cubic centimeters
    'mm³': 1000000,        // liters to cubic millimeters
    'cu in': 61.0237,      // liters to cubic inches
    'cu ft': 0.0353147,    // liters to cubic feet
    'cu yd': 0.00130795,   // liters to cubic yards
    'gal': 0.264172,       // liters to US gallons (legacy)
    'US gal': 0.264172,    // liters to US gallons
    'UK gal': 0.219969,    // liters to UK gallons
    'US fl oz': 33.814,    // liters to US fluid ounces
    'UK fl oz': 35.1951,   // liters to UK fluid ounces
    'mL': 1000,            // liters to milliliters
    'cL': 100,             // liters to centiliters
  },
  'mL': {
    'm³': 0.000001,            // milliliters to cubic meters
    'dm³': 0.001,              // milliliters to cubic decimeters
    'cm³': 1,                  // milliliters to cubic centimeters
    'mm³': 1000,               // milliliters to cubic millimeters
    'cu in': 0.0610237,        // milliliters to cubic inches
    'cu ft': 0.0000353147,     // milliliters to cubic feet
    'cu yd': 0.00000130795,    // milliliters to cubic yards
    'gal': 0.0002641720524,    // milliliters to US gallons (legacy)
    'US gal': 0.0002641720524, // milliliters to US gallons
    'UK gal': 0.000219969,     // milliliters to UK gallons
    'US fl oz': 0.033814,      // milliliters to US fluid ounces
    'UK fl oz': 0.0351951,     // milliliters to UK fluid ounces
    'L': 0.001,                // milliliters to liters
    'cL': 0.1,                 // milliliters to centiliters
  },
  'cL': {
    'm³': 0.00001,         // centiliters to cubic meters
    'dm³': 0.01,           // centiliters to cubic decimeters
    'cm³': 10,             // centiliters to cubic centimeters
    'mm³': 10000,          // centiliters to cubic millimeters
    'cu in': 0.610237,     // centiliters to cubic inches
    'cu ft': 0.000353147,  // centiliters to cubic feet
    'cu yd': 0.0000130795, // centiliters to cubic yards
    'gal': 0.00264172,     // centiliters to US gallons (legacy)
    'US gal': 0.00264172,  // centiliters to US gallons
    'UK gal': 0.00219969,  // centiliters to UK gallons
    'US fl oz': 0.33814,   // centiliters to US fluid ounces
    'UK fl oz': 0.351951,  // centiliters to UK fluid ounces
    'L': 0.01,             // centiliters to liters
    'mL': 10,              // centiliters to milliliters
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
  const fromFactor = volumeToCubicMeters[fromUnit as keyof typeof volumeToCubicMeters];
  const toFactor = volumeToCubicMeters[toUnit as keyof typeof volumeToCubicMeters];
  
  if (fromFactor && toFactor) {
    const valueInCubicMeters = value * fromFactor;
    return valueInCubicMeters / toFactor;
  }
  
  // Fallback error handling
  throw new Error(`Conversion from ${fromUnit} to ${toUnit} is not supported`);
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
