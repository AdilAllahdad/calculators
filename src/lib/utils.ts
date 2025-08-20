import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { UNIT_OPTIONS } from '@/constants';
import { UnitOption } from '@/types/calculator';

// Filter units by type
export const getUnitsByType = (type: string | string[]): UnitOption[] => {
  const types = Array.isArray(type) ? type : [type];
  return UNIT_OPTIONS.filter(unit => types.includes(unit.type));
};

// Filter units by specific values
export const getUnitsByValues = (values: string[]): UnitOption[] => {
  return UNIT_OPTIONS.filter(unit => values.includes(unit.value));
};

// Conversion factors to base units (SI)
const conversionFactors = {
  // Length (base: meters)
  length: {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'mi': 1609.344
  },
  // Area (base: square meters)
  area: {
    'mm2': 0.000001,
    'cm2': 0.0001,
    'm2': 1,
    'ha': 10000,
    'km2': 1000000,
    'in2': 0.00064516,
    'ft2': 0.092903,
    'yd2': 0.836127,
    'ac': 4046.86,
    'mi2': 2589988.11
  },
  // Volume (base: cubic meters)
  volume: {
    'mm3': 0.000000001,
    'cm3': 0.000001,
    'dm3': 0.001,
    'l': 0.001,
    'm3': 1,
    'in3': 0.000016387,
    'cu in': 0.000016387,
    'ft3': 0.028317,
    'cu ft': 0.028317,
    'yd3': 0.764555,
    'cu yd': 0.764555,
    'gal': 0.003785,
    'gal-uk': 0.00454609
  },
  // Weight (base: kilograms)
  weight: {
    'µg': 0.000000001,
    'mg': 0.000001,
    'g': 0.001,
    'dag': 0.01,
    'kg': 1,
    't': 1000,
    'gr': 0.0000648,
    'dr': 0.00177185,
    'oz': 0.0283495,
    'lb': 0.453592,
    'st': 6.35029,
    'ton': 907.185,
    'ton-uk': 1016.05
  },
  // BTU (base: BTU)
  BTU: {
    'BTU': 1,
    'kW': 3412.14,        // 1 kW = 3412.14 BTU/hr
    'watts': 3.41214,     // 1 watt = 3.41214 BTU/hr
    'hp(l)': 2544.43,     // 1 hp (mechanical) = 2544.43 BTU/hr
    'hp(E)': 2544.43,     // 1 hp (electrical) = 2544.43 BTU/hr
    'tons': 12000,         // 1 ton of refrigeration = 12000 BTU/hr
    'US ton': 907.185,
    'long ton': 1016.05
  },
  // Density (base: kg/m³)
  density: {
    't/m3': 1000,
    'kg/m3': 1,
    'kg/L': 1000,
    'g/L': 1,
    'g/mL': 1000,
    'g/cm3': 1000,
    'oz/in3': 1729.994,
    'lb/in3': 27679.904,
    'lb/ft3': 16.01846,
    'lb/yd3': 0.593276,
    'lb/US gal': 119.826,
    'lb/UK gal': 99.776
  },
  // Price (base: USD per square meter for area pricing, USD per cubic meter for volume pricing, USD per kg for weight pricing)
  price: {
    'USD/ft2': 10.7639,      // 1 USD/ft² = 10.7639 USD/m²
    'USD/m2': 1,             // Base unit for area pricing
    'USD/yd2': 1.19599,      // 1 USD/yd² = 1.19599 USD/m²
    'USD/ft3': 35.3147,      // 1 USD/ft³ = 35.3147 USD/m³
    'USD/m3': 1,             // Base unit for volume pricing
    'USD/yd3': 1.30795,      // 1 USD/yd³ = 1.30795 USD/m³
    'USD/lb': 2.20462,       // 1 USD/lb = 2.20462 USD/kg
    'USD/kg': 1,             // Base unit for weight pricing
    'USD/ton': 0.00110231,   // 1 USD/ton = 0.00110231 USD/kg
    'USD/t': 0.001           // 1 USD/t = 0.001 USD/kg
  }
};

// Convert value from one unit to another
export const convertValue = (value: number, fromUnit: string, toUnit: string): number => {
  // Find the unit type for the fromUnit
  const fromUnitOption = UNIT_OPTIONS.find(unit => unit.value === fromUnit);
  const toUnitOption = UNIT_OPTIONS.find(unit => unit.value === toUnit);
  
  if (!fromUnitOption || !toUnitOption) {
    return value; // Can't convert if units are not found
  }
  
  // Check if both units are of the same type
  if (fromUnitOption.type !== toUnitOption.type) {
    return value; // Can't convert between different unit types
  }
  
  const unitType = fromUnitOption.type;
  
  // Special handling for compound units (e.g., ft-in)
  if (fromUnit === 'ft-in' || fromUnit === 'm-cm' || toUnit === 'ft-in' || toUnit === 'm-cm') {
    return value; // Not handling compound units in this basic conversion
  }
  
  // Get conversion factors based on unit type
  if (unitType === 'length' && fromUnit in conversionFactors.length && toUnit in conversionFactors.length) {
    const fromFactor = conversionFactors.length[fromUnit as keyof typeof conversionFactors.length];
    const toFactor = conversionFactors.length[toUnit as keyof typeof conversionFactors.length];
    return (value * fromFactor) / toFactor;
  }
  
  if (unitType === 'area' && fromUnit in conversionFactors.area && toUnit in conversionFactors.area) {
    const fromFactor = conversionFactors.area[fromUnit as keyof typeof conversionFactors.area];
    const toFactor = conversionFactors.area[toUnit as keyof typeof conversionFactors.area];
    return (value * fromFactor) / toFactor;
  }
  
  if (unitType === 'volume' && fromUnit in conversionFactors.volume && toUnit in conversionFactors.volume) {
    const fromFactor = conversionFactors.volume[fromUnit as keyof typeof conversionFactors.volume];
    const toFactor = conversionFactors.volume[toUnit as keyof typeof conversionFactors.volume];
    return (value * fromFactor) / toFactor;
  }
  
  if (unitType === 'weight' && fromUnit in conversionFactors.weight && toUnit in conversionFactors.weight) {
    const fromFactor = conversionFactors.weight[fromUnit as keyof typeof conversionFactors.weight];
    const toFactor = conversionFactors.weight[toUnit as keyof typeof conversionFactors.weight];
    return (value * fromFactor) / toFactor;
  }

  if (unitType === 'BTU' && fromUnit in conversionFactors.BTU && toUnit in conversionFactors.BTU) {
    const fromFactor = conversionFactors.BTU[fromUnit as keyof typeof conversionFactors.BTU];
    const toFactor = conversionFactors.BTU[toUnit as keyof typeof conversionFactors.BTU];
    return (value * fromFactor) / toFactor;
  }
  
  if (unitType === 'density' && fromUnit in conversionFactors.density && toUnit in conversionFactors.density) {
    const fromFactor = conversionFactors.density[fromUnit as keyof typeof conversionFactors.density];
    const toFactor = conversionFactors.density[toUnit as keyof typeof conversionFactors.density];
    return (value * fromFactor) / toFactor;
  }
  
  if (unitType === 'price' && fromUnit in conversionFactors.price && toUnit in conversionFactors.price) {
    const fromFactor = conversionFactors.price[fromUnit as keyof typeof conversionFactors.price];
    const toFactor = conversionFactors.price[toUnit as keyof typeof conversionFactors.price];
    return (value * fromFactor) / toFactor;
  }
  
  return value; // No conversion available
};

// Convert units to a common base (legacy version)
export const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
  // Length conversions to feet
  const lengthConversions: { [key: string]: number } = {
    'mm': 0.0032808,
    'cm': 0.032808,
    'm': 3.28084,
    'in': 0.083333,
    'ft': 1,
    'ft-in': 1
  };

  // Area conversions to square feet
  const areaConversions: { [key: string]: number } = {
    'mm2': 0.0000107639,
    'cm2': 0.00107639,
    'm2': 10.7639,
    'in2': 0.00694444,
    'ft2': 1
  };

  // Volume conversions to cubic feet
  const volumeConversions: { [key: string]: number } = {
    'mm3': 0.0000000353147,
    'cm3': 0.0000353147,
    'm3': 35.3147,
    'in3': 0.000578704,
    'ft3': 1
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


export const formatNumberWithCommas = (num: number, maxDecimals: number = 2): string => {
  // Check if the number is an integer or has decimal values
  const isInteger = Number.isInteger(num);
  
  // For integers, don't show any decimal places
  if (isInteger) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  
  // Round to 2 decimal places for most values
  // If the value is very small (< 0.01), use more decimals as needed
  const absNum = Math.abs(num);
  let actualDecimals = maxDecimals;
  
  if (absNum < 0.01 && absNum > 0) {
    // Find appropriate number of decimals to show non-zero digits
    let tempNum = absNum;
    actualDecimals = maxDecimals;
    while (tempNum < 0.1 && actualDecimals < 6) {
      tempNum *= 10;
      actualDecimals += 1;
    }
  }
  
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: actualDecimals 
  });
};

// Format currency values with 2 decimal places
export const formatCurrency = (num: number): string => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

