'use client'
import React, { useState } from 'react'

const speciesOptions = [
  { label: 'Alder, red', value: 'alder_red', density: 46 },
  { label: 'Apple', value: 'apple', density: 55 },
  { label: 'Ash, green', value: 'ash_green', density: 47 },
  { label: 'Ash, Oregon', value: 'ash_oregon', density: 48 },
  { label: 'Ash, white', value: 'ash_white', density: 46 },
  { label: 'Aspen, quaking', value: 'aspen_quaking', density: 43 },
  { label: 'Bald cypress', value: 'bald_cypress', density: 51 },
  { label: 'Basswood', value: 'basswood', density: 42 },
  { label: 'Beech', value: 'beech', density: 54 },
  { label: 'Birch, paper', value: 'birch_paper', density: 50 },
  { label: 'Birch, yellow', value: 'birch_yellow', density: 57 },
  { label: 'Butternut', value: 'butternut', density: 46 },
  { label: 'Cedar, incense', value: 'cedar_incense', density: 45 },
  { label: 'Cedar, western red', value: 'cedar_western_red', density: 28 },
  { label: 'Cherry, black', value: 'cherry_black', density: 45 },
  { label: 'Chestnut', value: 'chestnut', density: 55 },
  { label: 'Chinaberry', value: 'chinaberry', density: 50 },
  { label: 'Cottonwood', value: 'cottonwood', density: 49 },
  { label: 'Elm, American', value: 'elm_american', density: 54 },
  { label: 'Fir, Douglas', value: 'fir_douglas', density: 39 },
  { label: 'Fir, noble', value: 'fir_noble', density: 29 },
  { label: 'Fir, white', value: 'fir_white', density: 47 },
  { label: 'Gum, black', value: 'gum_black', density: 45 },
  { label: 'Gum, red', value: 'gum_red', density: 50 },
  { label: 'Hackberry', value: 'hackberry', density: 50 },
  { label: 'Hemlock eastern', value: 'hemlock_eastern', density: 39 },
  { label: 'Hemlock western', value: 'hemlock_western', density: 41 },
  { label: 'Hickory Shagbark', value: 'hickory_shagbark', density: 64 },
  { label: 'Horse chestnut', value: 'horse_chestnut', density: 41 },
  { label: 'Larch', value: 'larch', density: 51 },
  { label: 'Locust, black', value: 'locust_black', density: 63 },
  { label: 'Locust, honey', value: 'locust_honey', density: 49 },
  { label: 'Magnolia ev.', value: 'magnolia_ev', density: 59 },
  { label: 'Maple, red', value: 'maple_red', density: 50 },
  { label: 'Maple, silver', value: 'maple_silver', density: 45 },
  { label: 'Maple, sugar', value: 'maple_sugar', density: 56 },
  { label: 'Oak, black', value: 'oak_black', density: 62 },
  { label: 'Oak, call black', value: 'oak_call_black', density: 64 },
  { label: 'Oak, English', value: 'oak_english', density: 52 },
  { label: 'Oak, live', value: 'oak_live', density: 76 },
  { label: 'Oak, pin', value: 'oak_pin', density: 64 },
  { label: 'Oak, post', value: 'oak_post', density: 63 },
  { label: 'Oak, red', value: 'oak_red', density: 64 },
  { label: 'Oak, scarlet', value: 'oak_scarlet', density: 64 },
  { label: 'Oak, white', value: 'oak_white', density: 62 },
  { label: 'Osage orange', value: 'osage_orange', density: 62 },
  { label: 'Pecan', value: 'pecan', density: 61 },
  { label: 'Pine, loblolly', value: 'pine_loblolly', density: 53 },
  { label: 'Pine, longleaf', value: 'pine_longleaf', density: 55 },
  { label: 'Pine, ponderosa', value: 'pine_ponderosa', density: 46 },
  { label: 'Pine, slash', value: 'pine_slash', density: 58 },
  { label: 'Pine, sugar', value: 'pine_sugar', density: 52 },
  { label: 'Pine, white', value: 'pine_white', density: 36 },
  { label: 'Poplar, yellow', value: 'poplar_yellow', density: 38 },
  { label: 'Redwood coastal', value: 'redwood_coastal', density: 50 },
  { label: 'Sassafras', value: 'sassafras', density: 44 },
  { label: 'Spruce, Red', value: 'spruce_red', density: 34 },
  { label: 'Spruce, Sitka', value: 'spruce_sitka', density: 32 },
  { label: 'Sweetgum', value: 'sweetgum', density: 55 },
  { label: 'Sycamore', value: 'sycamore', density: 52 },
  { label: 'Tamarack', value: 'tamarack', density: 47 },
  { label: 'Walnut, black', value: 'walnut_black', density: 58 },
  { label: 'Willow', value: 'willow', density: 32 },
  { label: 'Custom', value: 'custom', density: '' }
]

const shapeOptions = [
  { label: 'Log', value: 'log' },
  { label: 'Board', value: 'board' }
]

const unitOptions = {
  density: [
    { label: 'kilograms per cubic meter (kg/m³)', value: 'kgm3' },
    { label: 'pounds per cubic feet (lb/cu ft)', value: 'lbft3' },
    { label: 'pounds per cubic yard (lb/cu yd)', value: 'lbyd3' },
    { label: 'grams per cubic centimeter (g/cm³)', value: 'gcm3' },
    { label: 'kilograms per cubic centimeter (kg/cm³)', value: 'kgcm3' },
    { label: 'grams per cubic meter (g/m³)', value: 'gm3' }
  ],
  diameter: [
    { label: 'cm', value: 'cm' }
  ],
  length: [
    { label: 'm', value: 'm' }
  ],
  volume: [
    { label: 'cubic centimeters (cm³)', value: 'cm3' },
    { label: 'cubic meters (m³)', value: 'm3' },
    { label: 'cubic inches (cu in)', value: 'cu in' },
    { label: 'cubic feet (cu ft)', value: 'cu ft' },
    { label: 'cubic yards (cu yd)', value: 'cu yd' }
  ],
  weight: [
    { label: 'kg', value: 'kg' }
  ]
}

// Add these arrays for price/unit dropdowns
const logWeightPriceUnitOptions = [
  { label: 'grams (g)', value: 'g' },
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'stones (st)', value: 'st' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' }
];

// Add this for board volume dropdown options (before Page)
const boardVolumeUnitOptions: UnitOption[] = [
  { label: 'cubic centimeters (cm³)', value: 'cm3' },
  { label: 'cubic meters (m³)', value: 'm3' },
  { label: 'cubic inches (cu in)', value: 'cu in' },
  { label: 'cubic feet (cu ft)', value: 'cu ft' },
  { label: 'cubic yards (cu yd)', value: 'cu yd' }
];

// Add unit state for each field that needs its own dropdown
type LogWeightState = {
  species: string
  density: number | string
  shape: string
  d1: string
  d1Unit?: string
  d2: string
  d2Unit?: string
  dmid: string
  dmidUnit?: string
  length: string
  lengthUnit?: string
  volume: string
  volumeUnit?: string
  logWeight: string
  logWeightUnit: string
  quantity: string
  totalWeight: string
  inputMode: string
  // Board fields
  boardWidth?: string
  boardWidthUnit?: string
  boardThickness?: string
  boardThicknessUnit?: string
  boardLength?: string
  boardLengthUnit?: string
  boardVolume?: string
  boardVolumeUnit?: string
  stackWidth?: string
  stackWidthUnit?: string
  stackHeight?: string
  stackHeightUnit?: string
  // Add this field for total weight unit
  totalWeightUnit?: string
  densityUnit?: string
}

const initialState: LogWeightState = {
  species: speciesOptions[0].value,
  density: speciesOptions[0].density,
  shape: 'log',
  d1: '',
  d1Unit: 'cm',
  d2: '',
  d2Unit: 'cm',
  dmid: '',
  dmidUnit: 'cm',
  length: '',
  lengthUnit: 'm',
  volume: '',
  volumeUnit: 'm3',
  logWeight: '',
  logWeightUnit: 'kg',
  quantity: '',
  totalWeight: '',
  inputMode: 'quantity',
  boardWidth: '',
  boardWidthUnit: 'cm',
  boardThickness: '',
  boardThicknessUnit: 'cm',
  boardLength: '',
  boardLengthUnit: 'm',
  boardVolume: '',
  boardVolumeUnit: 'm3',
  stackWidth: '',
  stackWidthUnit: 'm',
  stackHeight: '',
  stackHeightUnit: 'm',
  totalWeightUnit: 'kg',
  densityUnit: 'lbft3',
}

// Add type for unit options
type UnitOption = { label: string; value: string }

const totalWeightUnitOptions: UnitOption[] = [
  { label: 'grams (g)', value: 'g' },
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'stones (st)', value: 'st' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' }
]

// Use this for the "Total weight board stack" dropdown
const totalWeightBoardStackUnitOptions: UnitOption[] = [
  { label: 'grams (g)', value: 'g' },
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'stones (st)', value: 'st' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' }
]

// Conversion helpers for each unit type
const convertLength = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Convert to meters
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
  };
  const fromMeters: Record<string, number> = {
    mm: 1000,
    cm: 100,
    m: 1,
    in: 39.3700787,
    ft: 3.2808399,
    yd: 1.0936133,
  };
  if (!(from in toMeters) || !(to in fromMeters)) return value;
  const meters = num * toMeters[from];
  return (meters * fromMeters[to]).toString();
};

// Fix convertVolume to support all units used in dropdowns (cm3, m3, cu in, cu ft, cu yd)
const convertVolume = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Normalize unit keys for consistency
  const normalize = (u: string) =>
    u.replace('³', '3').replace('³', '3').replace('ft³', 'cu ft').replace('cm³', 'cm3').replace('m³', 'm3').replace('in³', 'cu in').replace('yd³', 'cu yd');
  const fromNorm = normalize(from);
  const toNorm = normalize(to);
  // Convert to m3
  const toM3: Record<string, number> = {
    cm3: 1e-6,
    m3: 1,
    'cu in': 0.000016387064,
    'cu ft': 0.028316846592,
    'cu yd': 0.764554857984,
    ft3: 0.028316846592,
    l: 0.001,
    mm3: 1e-9,
  };
  const fromM3: Record<string, number> = {
    cm3: 1e6,
    m3: 1,
    'cu in': 61023.7441,
    'cu ft': 35.3146667,
    'cu yd': 1.30795062,
    ft3: 35.3146667,
    l: 1000,
    mm3: 1e9,
  };
  if (fromNorm === toNorm) return value;
  if (!(fromNorm in toM3) || !(toNorm in fromM3)) return value;
  const m3 = num * toM3[fromNorm];
  return (m3 * fromM3[toNorm]).toString();
};

const convertWeight = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Convert to kg
  const toKg: Record<string, number> = {
    g: 0.001,
    kg: 1,
    t: 1000,
    lb: 0.45359237,
    st: 6.35029318,
    us_ton: 907.18474,
    long_ton: 1016.0469088,
  };
  const fromKg: Record<string, number> = {
    g: 1000,
    kg: 1,
    t: 0.001,
    lb: 2.20462262,
    st: 0.157473044,
    us_ton: 0.00110231131,
    long_ton: 0.000984206528,
  };
  if (!(from in toKg) || !(to in fromKg)) return value;
  const kg = num * toKg[from];
  return (kg * fromKg[to]).toString();
};

// Conversion for density
const convertDensity = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Convert to kg/m3
  const toKgM3: Record<string, number> = {
    kgm3: 1,
    lbft3: 16.0185,
    lbyd3: 0.593276,
    gcm3: 1000,
    kgcm3: 1000000,
    gm3: 0.001,
  };
  const fromKgM3: Record<string, number> = {
    kgm3: 1,
    lbft3: 0.06242796,
    lbyd3: 1.6855549,
    gcm3: 0.001,
    kgcm3: 0.000001,
    gm3: 1000,
  };
  if (!(from in toKgM3) || !(to in fromKgM3)) return value;
  const kgm3 = num * toKgM3[from];
  return (kgm3 * fromKgM3[to]).toString();
};

// Utility: Convert any length to feet
const toFeet = (value: string, unit: string): number => {
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (unit) {
    case 'mm': return v / 304.8;
    case 'cm': return v / 30.48;
    case 'm': return v / 0.3048;
    case 'in': return v / 12;
    case 'ft': return v;
    case 'yd': return v * 3;
    default: return v;
  }
};

// Utility: Convert any volume to cubic feet
const toCubicFeet = (value: string, unit: string): number => {
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (unit) {
    case 'cm3': return v / 28316.8466;
    case 'm3': return v * 35.3146667;
    case 'cu in': return v / 1728;
    case 'cu ft': return v;
    case 'cu yd': return v * 27;
    default: return v;
  }
};

// Utility: Convert any density to lb/ft³
const toLbFt3 = (value: string | number, unit: string): number => {
  const v = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(v)) return 0;
  switch (unit) {
    case 'kgm3': return v * 0.06242796;
    case 'lbft3': return v;
    case 'lbyd3': return v / 27;
    case 'gcm3': return v * 62.42796;
    case 'kgcm3': return v * 62427.96;
    case 'gm3': return v * 0.00006242796;
    default: return v;
  }
};

// Utility: Convert lb to any weight unit
const fromLb = (lb: number, unit: string): number => {
  switch (unit) {
    case 'g': return lb * 453.59237;
    case 'kg': return lb * 0.45359237;
    case 't': return lb * 0.00045359237;
    case 'lb': return lb;
    case 'st': return lb / 14;
    case 'us_ton': return lb / 2000;
    case 'long_ton': return lb / 2240;
    default: return lb;
  }
};

// Utility: Convert cubic meters to cubic feet
const m3ToFt3 = (m3: number) => m3 * 35.3146667;

// --- Calculation helpers for log and board, using the provided formulas and info ---

// Calculate log volume in cubic feet using Huber's formula
function calculateLogVolumeFt3(d1: string, d1Unit: string, d2: string, d2Unit: string, length: string, lengthUnit: string): number {
  const d1ft = toFeet(d1, d1Unit);
  const d2ft = toFeet(d2, d2Unit);
  const lengthFt = toFeet(length, lengthUnit);
  if (!d1ft || !d2ft || !lengthFt) return 0;
  const dmid = (d1ft + d2ft) / 2;
  return lengthFt * Math.PI * Math.pow(dmid, 2) / 4;
}

// Calculate board volume in cubic feet
function calculateBoardVolumeFt3(width: string, widthUnit: string, thickness: string, thicknessUnit: string, length: string, lengthUnit: string): number {
  const wft = toFeet(width, widthUnit);
  const tft = toFeet(thickness, thicknessUnit);
  const lft = toFeet(length, lengthUnit);
  if (!wft || !tft || !lft) return 0;
  return wft * tft * lft;
}

// Get density in lb/ft³ for the selected species or custom value
function getDensityLbFt3(species: string, density: string | number, densityUnit: string | undefined): number {
  if (species !== 'custom') {
    const found = speciesOptions.find(s => s.value === species);
    return found ? Number(found.density) : 0;
  }
  return toLbFt3(density, densityUnit || 'lbft3');
}

// Calculate quantity from stack for boards (if stack dimensions are given)
function calculateBoardStackQuantity(
  stackWidth: string, stackWidthUnit: string,
  stackHeight: string, stackHeightUnit: string,
  boardWidth: string, boardWidthUnit: string,
  boardThickness: string, boardThicknessUnit: string
): number {
  // Stack cross-section area (ft²)
  const stackWidthFt = toFeet(stackWidth, stackWidthUnit);
  const stackHeightFt = toFeet(stackHeight, stackHeightUnit);
  const stackAreaFt2 = stackWidthFt * stackHeightFt;
  // Board cross-section area (ft²)
  const boardWidthFt = toFeet(boardWidth, boardWidthUnit);
  const boardThicknessFt = toFeet(boardThickness, boardThicknessUnit);
  const boardAreaFt2 = boardWidthFt * boardThicknessFt;
  if (!stackAreaFt2 || !boardAreaFt2) return 0;
  // Number of boards in stack cross-section (rounded down)
  return Math.floor(stackAreaFt2 / boardAreaFt2);
}

// Calculate quantity from stack for logs (if stack dimensions are given)
function calculateLogStackQuantity(
  stackWidth: string, stackWidthUnit: string,
  stackHeight: string, stackHeightUnit: string,
  d1: string, d1Unit: string,
  d2: string, d2Unit: string
): number {
  const stackWidthFt = toFeet(stackWidth, stackWidthUnit);
  const stackHeightFt = toFeet(stackHeight, stackHeightUnit);
  const stackAreaFt2 = stackWidthFt * stackHeightFt;
  const d1ft = toFeet(d1, d1Unit);
  const d2ft = toFeet(d2, d2Unit);
  if (!d1ft || !d2ft) return 0;
  const dmid = (d1ft + d2ft) / 2;
  const logAreaFt2 = Math.PI * Math.pow(dmid / 2, 2);
  if (!stackAreaFt2 || !logAreaFt2) return 0;
  const packingFactor = 0.785; // hexagonal close packing for round logs
  return Math.floor((stackAreaFt2 * packingFactor) / logAreaFt2);
}

// Main calculation for log/board weight and total weight
const calculateLogBoardWeight = (fields: LogWeightState) => {
  let logWeight = '';
  let totalWeight = '';
  let quantity = parseFloat(fields.quantity) || 1;

  // Stack mode for board
  if (fields.shape === 'board' && fields.inputMode === 'stock') {
    if (
      fields.stackWidth && fields.stackWidthUnit &&
      fields.stackHeight && fields.stackHeightUnit &&
      fields.boardWidth && fields.boardWidthUnit &&
      fields.boardThickness && fields.boardThicknessUnit
    ) {
      quantity = calculateBoardStackQuantity(
        fields.stackWidth, fields.stackWidthUnit,
        fields.stackHeight, fields.stackHeightUnit,
        fields.boardWidth, fields.boardWidthUnit,
        fields.boardThickness, fields.boardThicknessUnit
      );
    }
  }

  // Stack mode for log
  if (fields.shape === 'log' && fields.inputMode === 'stock') {
    if (
      fields.stackWidth && fields.stackWidthUnit &&
      fields.stackHeight && fields.stackHeightUnit &&
      fields.d1 && fields.d1Unit &&
      fields.d2 && fields.d2Unit
    ) {
      quantity = calculateLogStackQuantity(
        fields.stackWidth, fields.stackWidthUnit,
        fields.stackHeight, fields.stackHeightUnit,
        fields.d1, fields.d1Unit,
        fields.d2, fields.d2Unit
      );
    }
  }

  if (fields.shape === 'log') {
    const density = getDensityLbFt3(fields.species, fields.density, fields.densityUnit);
    let volumeFt3 = 0;
    if (fields.d1 && fields.d2 && fields.length) {
      volumeFt3 = calculateLogVolumeFt3(fields.d1, fields.d1Unit || 'cm', fields.d2, fields.d2Unit || 'cm', fields.length, fields.lengthUnit || 'm');
    } else if (fields.volume && fields.volumeUnit) {
      volumeFt3 = toCubicFeet(fields.volume, fields.volumeUnit);
    }
    const weightPerPieceLb = density * volumeFt3;
    const totalWeightLb = weightPerPieceLb * quantity;
    logWeight = isNaN(weightPerPieceLb) ? '' : fromLb(weightPerPieceLb, fields.logWeightUnit || 'lb').toFixed(2);
    totalWeight = isNaN(totalWeightLb) ? '' : fromLb(totalWeightLb, fields.totalWeightUnit || 'lb').toFixed(2);
  } else if (fields.shape === 'board') {
    const density = getDensityLbFt3(fields.species, fields.density, fields.densityUnit);
    let volumeFt3 = 0;
    if (fields.boardWidth && fields.boardThickness && fields.boardLength) {
      volumeFt3 = calculateBoardVolumeFt3(
        fields.boardWidth, fields.boardWidthUnit || 'cm',
        fields.boardThickness, fields.boardThicknessUnit || 'cm',
        fields.boardLength, fields.boardLengthUnit || 'm'
      );
    } else if (fields.boardVolume && fields.boardVolumeUnit) {
      volumeFt3 = toCubicFeet(fields.boardVolume, fields.boardVolumeUnit);
    }
    const weightPerPieceLb = density * volumeFt3;
    const totalWeightLb = weightPerPieceLb * quantity;
    logWeight = isNaN(weightPerPieceLb) ? '' : fromLb(weightPerPieceLb, fields.logWeightUnit || 'lb').toFixed(2);
    totalWeight = isNaN(totalWeightLb) ? '' : fromLb(totalWeightLb, fields.totalWeightUnit || 'lb').toFixed(2);
  }

  return {
    logWeight,
    totalWeight,
    quantity: quantity.toString()
  };
};

const Page = () => {
  const [fields, setFields] = useState<LogWeightState>(initialState);

  // Calculate dmid automatically if d1 and d2 are entered
  const d1ft = toFeet(fields.d1, fields.d1Unit || 'cm');
  const d2ft = toFeet(fields.d2, fields.d2Unit || 'cm');
  const dmidCalc = fields.d1 && fields.d2 ? ((d1ft + d2ft) / 2) : undefined;

  // Calculate log volume automatically if dmid and length are entered (Huber's formula)
  const lengthFt = toFeet(fields.length, fields.lengthUnit || 'm');
  const volumeCalc = (fields.shape === 'log' && dmidCalc && fields.length)
    ? (lengthFt * Math.PI * Math.pow(dmidCalc, 2) / 4)
    : undefined;

  // Calculate board volume automatically if all board dimensions are entered
  const boardVolumeCalc =
    fields.shape === 'board' &&
    fields.boardWidth && fields.boardWidthUnit &&
    fields.boardThickness && fields.boardThicknessUnit &&
    fields.boardLength && fields.boardLengthUnit
      ? calculateBoardVolumeFt3(
          fields.boardWidth, fields.boardWidthUnit,
          fields.boardThickness, fields.boardThicknessUnit,
          fields.boardLength, fields.boardLengthUnit
        )
      : undefined;

  // --- Auto-calculate quantity for stack mode in Log weight results section ---
  let autoQuantity = fields.quantity;
  let autoTotalWeight = '';
  if (fields.inputMode === 'stock') {
    if (
      fields.shape === 'board' &&
      fields.stackWidth && fields.stackWidthUnit &&
      fields.stackHeight && fields.stackHeightUnit &&
      fields.boardWidth && fields.boardWidthUnit &&
      fields.boardThickness && fields.boardThicknessUnit
    ) {
      const qty = calculateBoardStackQuantity(
        fields.stackWidth, fields.stackWidthUnit,
        fields.stackHeight, fields.stackHeightUnit,
        fields.boardWidth, fields.boardWidthUnit,
        fields.boardThickness, fields.boardThicknessUnit
      );
      autoQuantity = qty > 0 ? qty.toString() : '';
    }
    if (
      fields.shape === 'log' &&
      fields.stackWidth && fields.stackWidthUnit &&
      fields.stackHeight && fields.stackHeightUnit &&
      fields.d1 && fields.d1Unit &&
      fields.d2 && fields.d2Unit
    ) {
      const qty = calculateLogStackQuantity(
        fields.stackWidth, fields.stackWidthUnit,
        fields.stackHeight, fields.stackHeightUnit,
        fields.d1, fields.d1Unit,
        fields.d2, fields.d2Unit
      );
      autoQuantity = qty > 0 ? qty.toString() : '';
      // Calculate total weight for logs in stack mode using the calculated quantity
      const density = getDensityLbFt3(fields.species, fields.density, fields.densityUnit);
      let volumeFt3 = 0;
      if (fields.d1 && fields.d2 && fields.length) {
        volumeFt3 = calculateLogVolumeFt3(fields.d1, fields.d1Unit || 'cm', fields.d2, fields.d2Unit || 'cm', fields.length, fields.lengthUnit || 'm');
      } else if (fields.volume && fields.volumeUnit) {
        volumeFt3 = toCubicFeet(fields.volume, fields.volumeUnit);
      }
      const weightPerPieceLb = density * volumeFt3;
      const totalWeightLb = weightPerPieceLb * (qty > 0 ? qty : 0);
      autoTotalWeight = isNaN(totalWeightLb) ? '' : fromLb(totalWeightLb, fields.totalWeightUnit || 'lb').toFixed(2);
    }
  }

  // Calculate log/board weight and quantity (pass autoQuantity for stack mode)
  const { logWeight, totalWeight, quantity } = calculateLogBoardWeight({
    ...fields,
    quantity: autoQuantity,
    dmid: fields.shape === 'log' && fields.d1 && fields.d2 ? ((dmidCalc || 0).toString()) : fields.dmid,
    volume: fields.shape === 'log' && dmidCalc && fields.length ? (volumeCalc || 0).toString() : fields.volume,
  });

  // Handler for each length/diameter dropdown
  const handleUnitChange = (fieldValue: keyof LogWeightState, fieldUnit: keyof LogWeightState, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertLength(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };

  // Handler for each volume dropdown
  const handleVolumeUnitChange = (fieldValue: keyof LogWeightState, fieldUnit: keyof LogWeightState, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertVolume(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };

  // Handler for each weight dropdown (logWeightUnit, totalWeightUnit, etc.)
  const handleWeightUnitChange = (fieldValue: keyof LogWeightState, fieldUnit: keyof LogWeightState, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertWeight(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };

  // Handler for density dropdown
  const handleDensityUnitChange = (newUnit: string) => {
    setFields(f => ({
      ...f,
      density: convertDensity(String(f.density ?? ''), f.densityUnit || 'kgm3', newUnit),
      densityUnit: newUnit
    }));
  };

  const handleChange = (key: keyof LogWeightState, value: string) => {
    setFields(f => ({ ...f, [key]: value }))
  }

  const handleSpeciesChange = (value: string) => {
    if (value === 'custom') {
      setFields(f => ({
        ...f,
        species: value,
        density: ''
      }))
    } else {
      const selected = speciesOptions.find(s => s.value === value)
      setFields(f => ({
        ...f,
        species: value,
        density: selected ? selected.density : ''
      }))
    }
  }

  const handleClear = () => setFields(initialState)

  // For length/diameter units
  const lengthDropdownOptions = [
    { label: 'millimeters (mm)', value: 'mm' },
    { label: 'centimeters (cm)', value: 'cm' },
    { label: 'meters (m)', value: 'm' },
    { label: 'inches (in)', value: 'in' },
    { label: 'feet (ft)', value: 'ft' },
    { label: 'yards (yd)', value: 'yd' }
  ]

  // Calculate log/board weight and quantity
  const { logWeight: calculatedLogWeight, totalWeight: calculatedTotalWeight, quantity: calculatedQuantity } = calculateLogBoardWeight({
    ...fields,
    dmid: fields.shape === 'log' && fields.d1 && fields.d2 ? ((dmidCalc || 0).toString()) : fields.dmid,
    volume: fields.shape === 'log' && dmidCalc && fields.length ? (volumeCalc || 0).toString() : fields.volume,
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">Log weight calculator</h1>
      <div className="w-full max-w-md">
        {/* Wood specifications */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="font-semibold text-lg text-gray-800 mb-4">Wood specifications</div>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Species</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={fields.species}
              onChange={e => handleSpeciesChange(e.target.value)}
            >
              {speciesOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Density</label>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                className="flex-1 min-w-0 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                value={fields.density}
                onChange={e => handleChange('density', e.target.value)}
                placeholder={fields.species === 'custom' ? 'Enter custom density' : ''}
                style={{ maxWidth: 160 }}
              />
              <select
                className="border border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                style={{ minWidth: 180, maxWidth: 220 }}
                value={fields.densityUnit}
                onChange={e => handleDensityUnitChange(e.target.value)}
              >
                {unitOptions.density.map((opt: UnitOption) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Shape</label>
            <div className="flex gap-4">
              {shapeOptions.map(opt => (
                <label key={opt.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="shape"
                    value={opt.value}
                    checked={fields.shape === opt.value}
                    onChange={() => handleChange('shape', opt.value)}
                    className="mr-2 accent-blue-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-center my-4">
            <img
              src={fields.shape === 'board' ? '/board.png' : '/log.png'}
              alt={fields.shape === 'board' ? 'Board dimensions' : 'Log dimensions'}
              className="w-64 h-24 object-contain"
            />
          </div>
          {/* Conditional fields for Log */}
          {fields.shape === 'log' && (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Diameter at smaller end (dₛ)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.d1}
                    onChange={e => handleChange('d1', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.d1Unit}
                    onChange={e => handleUnitChange('d1', 'd1Unit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Diameter at larger end (dₗ)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.d2}
                    onChange={e => handleChange('d2', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.d2Unit}
                    onChange={e => handleUnitChange('d2', 'd2Unit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Diameter at mid-section (dₘ)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={
                      fields.d1 && fields.d2
                        ? (
                            // Convert calculated dmid to selected unit for display
                            dmidCalc !== undefined && fields.dmidUnit
                              ? convertLength(dmidCalc.toString(), 'ft', fields.dmidUnit)
                              : ''
                          )
                        : fields.dmid
                    }
                    onChange={e => handleChange('dmid', e.target.value)}
                    readOnly={fields.d1 && fields.d2 ? true : false}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.dmidUnit}
                    onChange={e => handleChange('dmidUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length (L)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Volume</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={
                      (fields.d1 && fields.d2 && fields.length)
                        ? (
                            // Convert calculated volume to selected unit for display
                            volumeCalc !== undefined && fields.volumeUnit
                              ? convertVolume(volumeCalc.toString(), 'cu ft', fields.volumeUnit)
                              : ''
                          )
                        : fields.volume
                    }
                    onChange={e => handleChange('volume', e.target.value)}
                    readOnly={fields.d1 && fields.d2 && fields.length ? true : false}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.volumeUnit}
                    onChange={e => handleVolumeUnitChange('volume', 'volumeUnit', e.target.value)}
                  >
                    {unitOptions.volume.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {/* Conditional fields for Board */}
          {fields.shape === 'board' && (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Board width (w)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.boardWidth || ''}
                    onChange={e => handleChange('boardWidth', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.boardWidthUnit}
                    onChange={e => handleUnitChange('boardWidth', 'boardWidthUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Board thickness (t)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.boardThickness || ''}
                    onChange={e => handleChange('boardThickness', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.boardThicknessUnit}
                    onChange={e => handleUnitChange('boardThickness', 'boardThicknessUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length (L)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.boardLength || ''}
                    onChange={e => handleChange('boardLength', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.boardLengthUnit}
                    onChange={e => handleUnitChange('boardLength', 'boardLengthUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Board volume</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={
                      // Show calculated board volume if all dimensions are present, else allow manual entry
                      boardVolumeCalc !== undefined && fields.boardVolumeUnit
                        ? convertVolume(boardVolumeCalc.toString(), 'cu ft', fields.boardVolumeUnit)
                        : fields.boardVolume
                    }
                    onChange={e => handleChange('boardVolume', e.target.value)}
                    readOnly={
                      fields.boardWidth && fields.boardThickness && fields.boardLength ? true : false
                    }
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.boardVolumeUnit}
                    onChange={e => handleVolumeUnitChange('boardVolume', 'boardVolumeUnit', e.target.value)}
                  >
                    {boardVolumeUnitOptions.map((opt: UnitOption) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Log weight results */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="font-semibold text-lg text-gray-800 mb-4">Log weight results</div>
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {fields.shape === 'board' ? 'Board weight per piece' : 'Log weight per piece'}
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                className="flex-1 min-w-0 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                value={logWeight}
                onChange={e => handleChange('logWeight', e.target.value)}
                style={{ maxWidth: 160 }}
                readOnly
              />
              <select
                className="border border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                style={{ minWidth: 180, maxWidth: 220 }}
                value={fields.logWeightUnit}
                onChange={e => handleChange('logWeightUnit', e.target.value)}
              >
                {logWeightPriceUnitOptions.map((opt: UnitOption) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700 mb-1 block">I know the...</span>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="quantity"
                  checked={fields.inputMode === 'quantity'}
                  onChange={() => handleChange('inputMode', 'quantity')}
                  className="mr-2 accent-blue-600"
                />
                quantity of wood pieces
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="stock"
                  checked={fields.inputMode === 'stock'}
                  onChange={() => handleChange('inputMode', 'stock')}
                  className="mr-2 accent-blue-600"
                />
                stack dimensions
              </label>
            </div>
          </div>
          {/* Show stack dimensions UI if shape is board and inputMode is stock */}
          {fields.shape === 'board' && fields.inputMode === 'stock' && (
            <div className="mb-3">
              <div className="flex justify-center my-4">
                <img
                  src="/board1.png"
                  alt="Stack dimensions"
                  className="w-64 h-32 object-contain"
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stack width</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.stackWidth || ''}
                    onChange={e => handleChange('stackWidth', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.stackWidthUnit}
                    onChange={e => handleUnitChange('stackWidth', 'stackWidthUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stack height</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.stackHeight || ''}
                    onChange={e => handleChange('stackHeight', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.stackHeightUnit}
                    onChange={e => handleUnitChange('stackHeight', 'stackHeightUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity of boards in stack</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={autoQuantity}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Total weight board stack</label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="number"
                    className="flex-1 min-w-0 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={totalWeight}
                    readOnly
                    style={{ maxWidth: 160 }}
                  />
                  <select
                    className="border border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    style={{ minWidth: 180, maxWidth: 220 }}
                    value={fields.totalWeightUnit}
                    onChange={e => handleChange('totalWeightUnit', e.target.value)}
                  >
                    {totalWeightBoardStackUnitOptions.map((opt: UnitOption) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {/* Show stack dimensions UI if shape is log and inputMode is stock */}
          {fields.shape === 'log' && fields.inputMode === 'stock' && (
            <div className="mb-3">
              <div className="flex justify-center my-4">
                <img
                  src="/log1.png"
                  alt="Stack dimensions"
                  className="w-64 h-32 object-contain"
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stack width</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.stackWidth || ''}
                    onChange={e => handleChange('stackWidth', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.stackWidthUnit}
                    onChange={e => handleUnitChange('stackWidth', 'stackWidthUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stack height</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.stackHeight || ''}
                    onChange={e => handleChange('stackHeight', e.target.value)}
                  />
                  <select
                    className="w-32 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.stackHeightUnit}
                    onChange={e => handleUnitChange('stackHeight', 'stackHeightUnit', e.target.value)}
                  >
                    {lengthDropdownOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* --- Add these two fields for log stack mode --- */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity of logs in stack</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={autoQuantity}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Total weight</label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="number"
                    className="flex-1 min-w-0 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={autoTotalWeight}
                    readOnly
                    style={{ maxWidth: 160 }}
                  />
                  <select
                    className="border border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    style={{ minWidth: 180, maxWidth: 220 }}
                    value={fields.totalWeightUnit}
                    onChange={e => handleChange('totalWeightUnit', e.target.value)}
                  >
                    {totalWeightUnitOptions.map((opt: UnitOption) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {/* ...existing quantity and total weight fields... */}
          {!(fields.shape === 'board' && fields.inputMode === 'stock') && !(fields.shape === 'log' && fields.inputMode === 'stock') && (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {fields.inputMode === 'stock'
                    ? (fields.shape === 'log'
                        ? 'Quantity of logs in stack'
                        : 'Quantity of boards in stack')
                    : 'Quantity'}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={fields.quantity === '0' ? '' : fields.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {fields.shape === 'board' && fields.inputMode === 'quantity'
                    ? 'Total board weight'
                    : 'Total weight'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="number"
                    className="flex-1 min-w-0 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={totalWeight}
                    onChange={e => handleChange('totalWeight', e.target.value)}
                    style={{ maxWidth: 160 }}
                    readOnly
                  />
                  <select
                    className="border border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    style={{ minWidth: 180, maxWidth: 220 }}
                    value={fields.totalWeightUnit}
                    onChange={e => handleWeightUnitChange('totalWeight', 'totalWeightUnit', e.target.value)}
                  >
                    {totalWeightUnitOptions.map((opt: UnitOption) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
