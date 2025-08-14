/**
 * Length unit conversion utility functions.
 * Provides standardized conversion factors and functions for length measurements.
 */

// Basic conversion factors to a standard unit (meters)
export const lengthToMeters = {
  'mm': 0.001,         // millimeters to meters
  'cm': 0.01,          // centimeters to meters
  'm': 1,              // meters to meters
  'in': 0.0254,        // inches to meters
  'ft': 0.3048,        // feet to meters
  'yd': 0.9144,        // yards to meters
  'mi': 1609.344,      // miles to meters
  'km': 1000,          // kilometers to meters
};

// Conversion factors between any two units
export const lengthConversions: Record<string, Record<string, number>> = {
  'mm': {
    'cm': 0.1,            // millimeters to centimeters
    'm': 0.001,           // millimeters to meters
    'in': 0.0393701,      // millimeters to inches
    'ft': 0.00328084,     // millimeters to feet
    'yd': 0.00109361,     // millimeters to yards
    'mi': 6.2137e-7,      // millimeters to miles
    'km': 1e-6,           // millimeters to kilometers
  },
  'cm': {
    'mm': 10,             // centimeters to millimeters
    'm': 0.01,            // centimeters to meters
    'in': 0.393701,       // centimeters to inches
    'ft': 0.0328084,      // centimeters to feet
    'yd': 0.0109361,      // centimeters to yards
    'mi': 6.2137e-6,      // centimeters to miles
    'km': 1e-5,           // centimeters to kilometers
  },
  'm': {
    'mm': 1000,           // meters to millimeters
    'cm': 100,            // meters to centimeters
    'in': 39.3701,        // meters to inches
    'ft': 3.28084,        // meters to feet
    'yd': 1.09361,        // meters to yards
    'mi': 0.000621371,    // meters to miles
    'km': 0.001,          // meters to kilometers
  },
  'in': {
    'mm': 25.4,           // inches to millimeters
    'cm': 2.54,           // inches to centimeters
    'm': 0.0254,          // inches to meters
    'ft': 1/12,           // inches to feet
    'yd': 1/36,           // inches to yards
    'mi': 1.5783e-5,      // inches to miles
    'km': 0.0000254,      // inches to kilometers
  },
  'ft': {
    'mm': 304.8,          // feet to millimeters
    'cm': 30.48,          // feet to centimeters
    'm': 0.3048,          // feet to meters
    'in': 12,             // feet to inches
    'yd': 1/3,            // feet to yards
    'mi': 0.000189394,    // feet to miles
    'km': 0.0003048,      // feet to kilometers
  },
  'yd': {
    'mm': 914.4,          // yards to millimeters
    'cm': 91.44,          // yards to centimeters
    'm': 0.9144,          // yards to meters
    'in': 36,             // yards to inches
    'ft': 3,              // yards to feet
    'mi': 0.000568182,    // yards to miles
    'km': 0.0009144,      // yards to kilometers
  },
  'mi': {
    'mm': 1609344,        // miles to millimeters
    'cm': 160934.4,       // miles to centimeters
    'm': 1609.344,        // miles to meters
    'in': 63360,          // miles to inches
    'ft': 5280,           // miles to feet
    'yd': 1760,           // miles to yards
    'km': 1.60934,        // miles to kilometers
  },
  'km': {
    'mm': 1000000,        // kilometers to millimeters
    'cm': 100000,         // kilometers to centimeters
    'm': 1000,            // kilometers to meters
    'in': 39370.1,        // kilometers to inches
    'ft': 3280.84,        // kilometers to feet
    'yd': 1093.61,        // kilometers to yards
    'mi': 0.621371,       // kilometers to miles
  },
};

// Composite unit types
export type CompositeUnit = 'ft / in' | 'm / cm';

/**
 * Converts a value from one length unit to another
 * @param value The numeric value to convert
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns The converted value
 */
export function convertLength(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  // Use direct conversion if available
  if (lengthConversions[fromUnit] && lengthConversions[fromUnit][toUnit]) {
    return value * lengthConversions[fromUnit][toUnit];
  }
  
  // Otherwise convert via standard unit (meters)
  const valueInMeters = value * lengthToMeters[fromUnit as keyof typeof lengthToMeters];
  return valueInMeters / lengthToMeters[toUnit as keyof typeof lengthToMeters];
}

/**
 * Converts a value from a single unit to a composite unit (ft/in or m/cm)
 * @param value The numeric value to convert
 * @param fromUnit The source unit
 * @param toUnit The target composite unit ('ft / in' or 'm / cm')
 * @returns An object with the whole and fractional parts
 */
export function convertToComposite(value: number, fromUnit: string, toUnit: CompositeUnit): { whole: number, fraction: number } {
  if (toUnit === 'ft / in') {
    // Convert to feet first
    const valueInFeet = convertLength(value, fromUnit, 'ft');
    
    // Extract whole feet and remaining inches
    const wholeFeet = Math.floor(valueInFeet);
    const remainingFeetDecimal = valueInFeet - wholeFeet;
    const remainingInches = remainingFeetDecimal * 12;
    
    return {
      whole: wholeFeet,
      fraction: remainingInches
    };
  } 
  else if (toUnit === 'm / cm') {
    // Convert to meters first
    const valueInMeters = convertLength(value, fromUnit, 'm');
    
    // Extract whole meters and remaining centimeters
    const wholeMeters = Math.floor(valueInMeters);
    const remainingMetersDecimal = valueInMeters - wholeMeters;
    const remainingCentimeters = remainingMetersDecimal * 100;
    
    return {
      whole: wholeMeters,
      fraction: remainingCentimeters
    };
  }
  
  throw new Error(`Unsupported composite unit: ${toUnit}`);
}

/**
 * Converts from a composite unit to a single unit
 * @param whole The whole part (feet or meters)
 * @param fraction The fractional part (inches or centimeters)
 * @param fromUnit The source composite unit ('ft / in' or 'm / cm')
 * @param toUnit The target unit
 * @returns The converted value
 */
export function convertFromComposite(whole: number, fraction: number, fromUnit: CompositeUnit, toUnit: string): number {
  if (fromUnit === 'ft / in') {
    // Calculate total in feet
    const totalFeet = whole + (fraction / 12);
    
    // Convert from feet to target unit
    return convertLength(totalFeet, 'ft', toUnit);
  } 
  else if (fromUnit === 'm / cm') {
    // Calculate total in meters
    const totalMeters = whole + (fraction / 100);
    
    // Convert from meters to target unit
    return convertLength(totalMeters, 'm', toUnit);
  }
  
  throw new Error(`Unsupported composite unit: ${fromUnit}`);
}

/**
 * Converts from one composite unit to another composite unit
 * @param whole The whole part (feet or meters)
 * @param fraction The fractional part (inches or centimeters)
 * @param fromUnit The source composite unit ('ft / in' or 'm / cm')
 * @param toUnit The target composite unit ('ft / in' or 'm / cm')
 * @returns An object with the whole and fractional parts
 */
export function convertBetweenComposites(
  whole: number, 
  fraction: number, 
  fromUnit: CompositeUnit, 
  toUnit: CompositeUnit
): { whole: number, fraction: number } {
  if (fromUnit === toUnit) {
    return { whole, fraction };
  }
  
  // First convert to a single unit
  let valueInSingleUnit: number;
  let singleUnit: string;
  
  if (fromUnit === 'ft / in') {
    valueInSingleUnit = whole + (fraction / 12);
    singleUnit = 'ft';
  } else { // m / cm
    valueInSingleUnit = whole + (fraction / 100);
    singleUnit = 'm';
  }
  
  // Then convert to the target composite unit
  return convertToComposite(valueInSingleUnit, singleUnit, toUnit);
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
