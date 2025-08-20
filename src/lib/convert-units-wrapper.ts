/**
 * Utility wrapper for the convert-units package
 */
import convert from 'convert-units';

type UnitType = 'length' | 'area' | 'volume' | 'mass' | 'weight';

// Map our unit codes to convert-units codes
const unitMap: Record<string, string> = {
  // Length
  'mm': 'mm',
  'cm': 'cm',
  'm': 'm',
  'in': 'in',
  'ft': 'ft',
  'yd': 'yd',
  'mi': 'mi',
  'km': 'km',

  // Area
  'mm2': 'mm2',
  'cm2': 'cm2',
  'm2': 'm2',
  'ha': 'ha',
  'km2': 'km2',
  'in2': 'in2',
  'ft2': 'ft2',
  'yd2': 'yd2',
  'ac': 'ac',
  'mi2': 'mi2',

  // Volume
  'mm3': 'mm3',
  'cm3': 'cm3',
  'dm3': 'l', // 1 dm3 = 1 l
  'ml': 'ml',
  'l': 'l',
  'kl': 'kl',
  'm3': 'm3',
  'in3': 'in3',
  'cu in': 'in3',
  'fl-oz': 'fl-oz',
  'cup': 'cup',
  'pnt': 'pnt',
  'qt': 'qt',
  'gal': 'gal',
  'gal-uk': 'gal-uk',
  'ft3': 'ft3',
  'cu ft': 'ft3',
  'yd3': 'yd3',
  'cu yd': 'yd3',

  // Mass/Weight
  'µg': 'mcg', // microgram
  'mg': 'mg',
  'g': 'g',
  'dag': 'g', // decagram, fallback to g
  'kg': 'kg',
  't': 't', // metric ton
  'ton': 't', // US ton (short ton) fallback to metric ton
  'ton-uk': 'lt', // long ton (imperial ton)
  'US ton': 't', // fallback to metric ton
  'long ton': 'lt', // long ton (imperial ton)
  'gr': 'gr',
  'dr': 'dr',
  'oz': 'oz',
  'lb': 'lb',
  'st': 'st',

  // Density (custom, not natively supported by convert-units, but for mapping)
  't/m3': 't/m3',
  'kg/m3': 'kg/m3',
  'kg/L': 'kg/l',
  'g/L': 'g/l',
  'g/mL': 'g/ml',
  'g/cm3': 'g/cm3',
  'oz/in3': 'oz/in3',
  'lb/in3': 'lb/in3',
  'lb/ft3': 'lb/ft3',
  'lb/yd3': 'lb/yd3',
  'lb/US gal': 'lb/gal',
  'lb/UK gal': 'lb/gal-uk',
};

/**
 * Convert a value from one unit to another using the convert-units package
 * 
 * @param value The value to convert
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns The converted value
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  // --- DENSITY CONVERSIONS ---
  // Supported: kg/m3, lb/ft3, lb/yd3, g/cm3
  const densityFactors: Record<string, number> = {
    'kg/m3': 1,
    'g/cm3': 1000, // 1 g/cm3 = 1000 kg/m3
    'lb/ft3': 16.0184634, // 1 lb/ft3 = 16.0184634 kg/m3
    'lb/yd3': 0.593276421, // 1 lb/yd3 = 0.593276421 kg/m3
  };
  if (fromUnit in densityFactors && toUnit in densityFactors) {
    // Convert from source to kg/m3, then to target
    const valueInKgM3 = value * densityFactors[fromUnit];
    return valueInKgM3 / densityFactors[toUnit];
  }

  try {
    // Handle special cases for units that may not be directly supported
    // Volume conversions
    if (fromUnit === 'cm3' && toUnit === 'm3') {
      return value / 1000000; // 1 m³ = 1,000,000 cm³
    }
    if (fromUnit === 'm3' && toUnit === 'cm3') {
      return value * 1000000; // 1 m³ = 1,000,000 cm³
    }

    // Area conversions
    if (fromUnit === 'cm2' && toUnit === 'm2') {
      return value / 10000; // 1 m² = 10,000 cm²
    }
    if (fromUnit === 'm2' && toUnit === 'cm2') {
      return value * 10000; // 1 m² = 10,000 cm²
    }

    // Use the convert-units package for other conversions
    const from = unitMap[fromUnit] || fromUnit;
    const to = unitMap[toUnit] || toUnit;

    return convert(value).from(from).to(to);
  } catch (error) {
    console.error(`Conversion error: ${fromUnit} to ${toUnit}`, error);

    // Add manual fallbacks for common conversions that might fail
    // Volume conversions
    if (fromUnit === 'cm3' && toUnit === 'm3') return value / 1000000;
    if (fromUnit === 'm3' && toUnit === 'cm3') return value * 1000000;
    if (fromUnit === 'mm3' && toUnit === 'm3') return value / 1000000000;
    if (fromUnit === 'm3' && toUnit === 'mm3') return value * 1000000000;

    // Area conversions
    if (fromUnit === 'cm2' && toUnit === 'm2') return value / 10000;
    if (fromUnit === 'm2' && toUnit === 'cm2') return value * 10000;
    if (fromUnit === 'mm2' && toUnit === 'm2') return value / 1000000;
    if (fromUnit === 'm2' && toUnit === 'mm2') return value * 1000000;

    // Length conversions
    if (fromUnit === 'cm' && toUnit === 'm') return value / 100;
    if (fromUnit === 'm' && toUnit === 'cm') return value * 100;
    if (fromUnit === 'mm' && toUnit === 'm') return value / 1000;
    if (fromUnit === 'm' && toUnit === 'mm') return value * 1000;

    // Fallback to original value if all else fails
    return value;
  }
}

/**
 * Get all available units for a specific unit type
 * 
 * @param unitType The type of unit (length, area, volume, mass, etc.)
 * @returns Array of unit possibilities
 */
export function getUnitsForType(unitType: UnitType): string[] {
  try {
    switch(unitType) {
      case 'length':
        return convert().possibilities('length');
      case 'area':
        return convert().possibilities('area');
      case 'volume':
        return convert().possibilities('volume');
      case 'mass':
      case 'weight':
        return convert().possibilities('mass');
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error getting unit possibilities for ${unitType}`, error);
    return [];
  }
}

/**
 * Check if a conversion is possible
 * 
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns Boolean indicating if conversion is possible
 */
export function canConvert(fromUnit: string, toUnit: string): boolean {
  try {
    const from = unitMap[fromUnit] || fromUnit;
    const to = unitMap[toUnit] || toUnit;
    
    // This will throw if conversion is not possible
    convert().from(from).to(to);
    return true;
  } catch {
    return false;
  }
}
