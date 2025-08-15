'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

/* ----------------- Constants ------------------ */
const DEFAULT_DENSITY = 150; // lb/ft³ for concrete
const DEFAULT_BAG_SIZE = 94; // lb (standard US Portland cement bag)
const DEFAULT_WASTE = 10; // 10% waste factor

/* ----------------- Length + Volume Units ------------------ */

const lengthToCm: Record<string, number> = {
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
  'ft-in': 30.48,
  'm-cm': 100
};

const volumeUnits = [
  { value: 'm3', label: 'cubic meters (m³)', factorFromCm3: 1 / 1_000_000 },
  { value: 'cu-ft', label: 'cubic feet (cu ft)', factorFromCm3: 1 / 28_316.846592 },
  { value: 'cu-yd', label: 'cubic yards (cu yd)', factorFromCm3: 1 / 764_554.857984 },
  { value: 'us-gal', label: 'gallons (US) (US gal)', factorFromCm3: 1 / 3785.411784 },
  { value: 'uk-gal', label: 'gallons (UK) (UK gal)', factorFromCm3: 1 / 4546.09 }
];

const lengthUnits = [
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'm', label: 'meters (m)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' },
  { value: 'ft-in', label: 'feet / inches (ft / in)' },
  { value: 'm-cm', label: 'meters / centimeters (m / cm)' }
];

const heightOnlyUnits = lengthUnits.filter(u => u.value !== 'm-cm');

/* ----------------- Density / Mass Units ------------------ */

const densityUnits = [
  { value: 'kg-m3', label: 'kilograms per cubic meter (kg/m³)', toKgPerM3: (v: number) => v, fromKgPerM3: (v: number) => v },
  { value: 'lb-ft3', label: 'pounds per cubic feet (lb/cu ft)', toKgPerM3: (v: number) => v * 16.01846337, fromKgPerM3: (v: number) => v / 16.01846337 },
  { value: 'lb-yd3', label: 'pounds per cubic yard (lb/cu yd)', toKgPerM3: (v: number) => v * 0.593276, fromKgPerM3: (v: number) => v / 0.593276 },
  { value: 'g-cm3', label: 'grams per cubic centimeter (g/cm³)', toKgPerM3: (v: number) => v * 1000, fromKgPerM3: (v: number) => v / 1000 }
];

const massUnits = [
  { value: 'kg', label: 'kilograms (kg)', fromKg: (v: number) => v, toKg: (v: number) => v },
  { value: 't', label: 'metric tons (t)', fromKg: (v: number) => v / 1000, toKg: (v: number) => v * 1000 },
  { value: 'lb', label: 'pounds (lb)', fromKg: (v: number) => v * 2.2046226218, toKg: (v: number) => v / 2.2046226218 },
  { value: 'st', label: 'stones (st)', fromKg: (v: number) => v * 0.157473, toKg: (v: number) => v / 0.157473 },
  { value: 'US-st', label: 'US short tons (US ton)', fromKg: (v: number) => v / 907.18474, toKg: (v: number) => v * 907.18474 },
  { value: 'long-ton', label: 'imperial tons (long ton)', fromKg: (v: number) => v / 1016.047, toKg: (v: number) => v * 1016.047 }
];

const bagSizeUnits = [
  { value: 'kg', label: 'kilogram (kg)', fromKg: (v: number) => v, toKg: (v: number) => v },
  { value: 'lb', label: 'pound (lb)', fromKg: (v: number) => v * 2.2046226218, toKg: (v: number) => v / 2.2046226218 }
];

/* ----------------- Cost Units ------------------ */
const perVolumeCostUnits = [
  { value: 'm3', label: 'per cubic meter (m³)', factor: 1 },
  { value: 'cu-ft', label: 'per cubic foot (cu ft)', factor: 0.028317 },
  { value: 'cu-yd', label: 'per cubic yard (cu yd)', factor: 0.764555 },
  { value: 'us-gal', label: 'per US gallon', factor: 0.003785 },
  { value: 'uk-gal', label: 'per UK gallon', factor: 0.004546 }
];

/* ----------------- Shared Field Group Component ------------------ */

interface FieldProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  menu?: boolean;
  info?: boolean;
  error?: string;
}

const FieldGroup = ({ label, children, icon, menu, info, error }: FieldProps) => (
  <div className="pt-5 first:pt-0">
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="text-gray-400" title={label + ' info'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8.2v.2M12 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {icon && <span className="text-gray-400">{icon}</span>}
      {menu && (
        <button
          type="button"
          aria-label="More options"
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      )}
    </div>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const RulerIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 5v4M11 5v2M15 5v4M19 5v2M7 13v2M11 13v4M15 13v2M19 13v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ----------------- Style Tokens ------------------ */

const inputBase = 'h-11 w-full text-sm rounded-l-md border-2 border-gray-300 bg-white px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400';
const unitSelectBase = 'h-11 w-[120px] text-sm px-4 rounded-r-md bg-white border-2 border-l-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none';
const readonlyInputBase = 'h-11 w-full text-sm rounded-l-md border-2 border-gray-300 bg-gray-50 px-4 text-gray-700 cursor-not-allowed';
const smallSelectLeft = 'h-11 w-[70px] rounded-l-md border-2 border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none';
const trailingStatic = 'h-11 flex items-center rounded-r-md border-2 border-l-0 border-gray-300 bg-gray-50 text-sm px-4 text-gray-600 select-none w-[120px]';
const trailingSelect = 'h-11 w-[120px] border-2 border-l-0 border-gray-300 bg-white px-4 text-sm rounded-r-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500';

/* ----------------- Volume Conversion Factors ------------------ */
const volumeConversionFactors: Record<string, Record<string, number>> = {
  'cu-ft': {
    'cu-ft': 1,
    'cu-yd': 1/27,
    'm3': 0.0283168,
    'us-gal': 7.48052,
    'uk-gal': 6.22884
  },
  'cu-yd': {
    'cu-ft': 27,
    'cu-yd': 1,
    'm3': 0.764555,
    'us-gal': 201.974,
    'uk-gal': 168.178
  },
  'm3': {
    'cu-ft': 35.3147,
    'cu-yd': 1.30795,
    'm3': 1,
    'us-gal': 264.172,
    'uk-gal': 219.969
  }
};

/* ----------------- Component ------------------ */

const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
  const meterValue = value * lengthToCm[fromUnit] / 100;
  return meterValue / (lengthToCm[toUnit] / 100);
};

/* Add these conversion helpers before the component */
const convertDensity = (value: number, fromUnit: string, toUnit: string): number => {
  // First convert to kg/m³
  let kgPerM3 = value;
  switch (fromUnit) {
    case 'lb-ft3': kgPerM3 *= 16.0185;
      break;
    case 'lb-yd3': kgPerM3 *= 0.593276;
      break;
    case 'g-cm3': kgPerM3 *= 1000;
      break;
  }
  
  // Then convert to target unit
  switch (toUnit) {
    case 'lb-ft3': return kgPerM3 / 16.0185;
    case 'lb-yd3': return kgPerM3 / 0.593276;
    case 'g-cm3': return kgPerM3 / 1000;
    default: return kgPerM3;
  }
};

const convertMass = (value: number, fromUnit: string, toUnit: string): number => {
  // First convert to kg
  let kg = value;
  switch (fromUnit) {
    case 'lb': kg /= 2.20462;
      break;
    case 't': kg *= 1000;
      break;
    case 'st': kg /= 0.157473;
      break;
    case 'US-st': kg *= 907.185;
      break;
    case 'long-ton': kg *= 1016.047;
      break;
  }
  
  // Then convert to target unit
  switch (toUnit) {
    case 'lb': return kg * 2.20462;
    case 't': return kg / 1000;
    case 'st': return kg * 0.157473;
    case 'US-st': return kg / 907.185;
    case 'long-ton': return kg / 1016.047;
    default: return kg;
  }
};

/* Add these new conversion helpers */
const getConversionFactor = (value: number, currentUnit: string, targetUnit: string, conversionMap: Record<string, number>): number => {
  if (currentUnit === targetUnit) return value;
  const baseValue = value * conversionMap[currentUnit];
  return baseValue / conversionMap[targetUnit];
};

const convertCost = (cost: number, fromUnit: string, toUnit: string): number => {
  const conversionFactors = {
    'm3': 1,
    'cu-ft': 0.028317,
    'cu-yd': 0.764555,
    'us-gal': 0.003785,
    'uk-gal': 0.004546
  };
  return getConversionFactor(cost, fromUnit, toUnit, conversionFactors);
};

const ConcreteEstimatorTubePage = () => {
  /* Tube geometry */
  const [outerDiameter, setOuterDiameter] = useState('24');
  const [outerDiameterUnit, setOuterDiameterUnit] = useState('in');
  const [innerDiameter, setInnerDiameter] = useState('20');
  const [innerDiameterUnit, setInnerDiameterUnit] = useState('in');
  const [height, setHeight] = useState('6');
  const [heightUnit, setHeightUnit] = useState('ft');
  const [quantity, setQuantity] = useState('1');
  const [volumeUnit, setVolumeUnit] = useState('cu-yd');
  const [volumeDisplay, setVolumeDisplay] = useState('0');
  const [diameterError, setDiameterError] = useState('');

  /* Pre-mixed concrete section */
  const [densityValue, setDensityValue] = useState('2400'); // Default to 2400 kg/m³ for standard concrete
  const [densityUnit, setDensityUnit] = useState('kg-m3'); // Default to kg/m³
  const [massUnit, setMassUnit] = useState('kg'); // Change default to kg
  const [massDisplay, setMassDisplay] = useState('');
  const [bagSize, setBagSize] = useState(DEFAULT_BAG_SIZE.toString());
  const [bagSizeUnit, setBagSizeUnit] = useState('lb');
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE.toString());
  const [bagsNeeded, setBagsNeeded] = useState('');

  /* Costs section */
  const [pricePerBag, setPricePerBag] = useState('5');
  const [pricePerUnitVolume, setPricePerUnitVolume] = useState('');
  const [pricePerUnitVolumeBasis, setPricePerUnitVolumeBasis] = useState('cu-yd');
  const [pricePerTube, setPricePerTube] = useState('');
  const [totalCost, setTotalCost] = useState('');

  /* Validate diameters */
  useEffect(() => {
    const od = parseFloat(outerDiameter);
    const id = parseFloat(innerDiameter);
    
    if (isNaN(od)) {
      setDiameterError('');
      return;
    }

    if (od <= 0) {
      setDiameterError('Outer diameter must be greater than 0');
      return;
    }

    if (!isNaN(id) && id >= 0) {
      const odCm = od * lengthToCm[outerDiameterUnit];
      const idCm = id * lengthToCm[innerDiameterUnit];

      if (odCm <= idCm) {
        setDiameterError('Outer diameter must be greater than inner diameter');
      } else {
        setDiameterError('');
      }
    } else {
      setDiameterError('');
    }
  }, [outerDiameter, innerDiameter, outerDiameterUnit, innerDiameterUnit]);

  /* Volume Calculation with independent unit handling */
  useEffect(() => {
    const od = parseFloat(outerDiameter);
    const id = parseFloat(innerDiameter);
    const h = parseFloat(height);
    const q = parseFloat(quantity);

    if (diameterError || isNaN(od) || od <= 0 || isNaN(h) || h <= 0 || isNaN(q) || q <= 0) {
      setVolumeDisplay('0.00');
      return;
    }

    // Convert all measurements to meters for calculation
    const odM = convertLength(od, outerDiameterUnit, 'm');
    const idM = isNaN(id) || id < 0 ? 0 : convertLength(id, innerDiameterUnit, 'm');
    const hM = convertLength(h, heightUnit, 'm');

    // Calculate volume in cubic meters
    const volumeM3 = Math.PI * (Math.pow(odM/2, 2) - Math.pow(idM/2, 2)) * hM * q;

    // Convert to target volume unit
    let result = volumeM3;
    switch (volumeUnit) {
      case 'cu-ft': result *= 35.3147;
        break;
      case 'cu-yd': result *= 1.30795;
        break;
      case 'us-gal': result *= 264.172;
        break;
      case 'uk-gal': result *= 219.969;
        break;
    }

    setVolumeDisplay(result.toFixed(4));
  }, [
    outerDiameter,
    innerDiameter,
    height,
    quantity,
    outerDiameterUnit,
    innerDiameterUnit,
    heightUnit,
    volumeUnit,
    diameterError
  ]);

  /* Mass + Bags Calculation with independent unit handling */
  useEffect(() => {
    const volume = parseFloat(volumeDisplay);
    if (isNaN(volume) || volume <= 0) {
      setMassDisplay('0.00');
      setBagsNeeded('0');
      return;
    }

    // 1. Convert volume to m³
    let volumeM3 = volume;
    switch (volumeUnit) {
      case 'cu-ft': volumeM3 /= 35.3147;
        break;
      case 'cu-yd': volumeM3 /= 1.30795;
        break;
      case 'us-gal': volumeM3 /= 264.172;
        break;
      case 'uk-gal': volumeM3 /= 219.969;
        break;
    }

    // 2. Get density in kg/m³
    const densityValue_kgm3 = convertDensity(parseFloat(densityValue), densityUnit, 'kg-m3');

    // 3. Calculate base mass in kg
    const baseMassKg = volumeM3 * densityValue_kgm3;

    // 4. Apply waste factor
    const waste = parseFloat(wastePercent) || 0;
    const totalMassKg = baseMassKg * (1 + waste / 100);

    // 5. Convert to display unit
    const massInDisplayUnit = convertMass(totalMassKg, 'kg', massUnit);
    setMassDisplay(massInDisplayUnit.toFixed(2));

    // 6. Calculate bags needed
    const bagMassInKg = bagSizeUnit === 'kg' 
      ? parseFloat(bagSize)
      : convertMass(parseFloat(bagSize), bagSizeUnit, 'kg');

    if (bagMassInKg > 0) {
      const bagsCount = Math.ceil(totalMassKg / bagMassInKg);
      setBagsNeeded(bagsCount.toString());
    } else {
      setBagsNeeded('0');
    }

  }, [
    volumeDisplay,
    volumeUnit,
    densityValue,
    densityUnit,
    wastePercent,
    massUnit,
    bagSize,
    bagSizeUnit
  ]);

  /* Cost Calculation */
  useEffect(() => {
    let total = 0;

    // Per bag cost
    const bagPrice = parseFloat(pricePerBag);
    const bags = parseInt(bagsNeeded);
    if (!isNaN(bagPrice) && !isNaN(bags)) {
      total += bagPrice * bags;
    }

    // Per volume cost
    const volPrice = parseFloat(pricePerUnitVolume);
    const volume = parseFloat(volumeDisplay);
    if (!isNaN(volPrice) && !isNaN(volume)) {
      const convertedVolume = convertCost(volume, volumeUnit, pricePerUnitVolumeBasis);
      total += volPrice * convertedVolume;
    }

    // Per piece cost
    const piecePrice = parseFloat(pricePerTube);
    const pieces = parseInt(quantity);
    if (!isNaN(piecePrice) && !isNaN(pieces)) {
      total += piecePrice * pieces;
    }

    setTotalCost(total.toFixed(2));
  }, [
    pricePerBag, bagsNeeded,
    pricePerUnitVolume, volumeDisplay, volumeUnit, pricePerUnitVolumeBasis,
    pricePerTube, quantity
  ]);

  /* Helper functions */
  const convertToInches = (value: number, unit: string): number => {
    switch (unit) {
      case 'in': return value;
      case 'ft': return value * 12;
      case 'cm': return value / 2.54;
      case 'm': return value * 39.3701;
      default: return value;
    }
  };

  const formatDecimal = (value: number): string => {
    if (isNaN(value)) return '0';
    // Format with 2 decimal places, remove trailing zeros after decimal
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  const convertVolume = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return value;
    
    // First convert to cubic feet if not already
    let inCuFt = value;
    if (fromUnit !== 'cu-ft') {
      const factor = volumeConversionFactors[fromUnit]?.['cu-ft'];
      if (factor) inCuFt = value * factor;
    }
    
    // Then convert to target unit
    const toFactor = volumeConversionFactors['cu-ft']?.[toUnit];
    return toFactor ? inCuFt * toFactor : value;
  };

  const lengthOptions = useMemo(
    () =>
      lengthUnits.map(u => (
        <option key={u.value} value={u.value}>
          {u.label}
        </option>
      )),
    []
  );

  return (
    <div className="w-[450px] max-w-xl mx-auto p-4 md:p-6 space-y-4">
      {/* Card 1: Tube Details */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 pb-5 pt-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Concrete tube details
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-52 h-52">
            <Image
              src="/cylinder.webp"
              alt="Concrete tube diagram showing outer diameter, inner diameter and height"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-500 tracking-wide">
            © Omni Calculator
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <FieldGroup label="Outer diameter" icon={RulerIcon} menu error={diameterError}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={outerDiameter}
                onChange={(e) => setOuterDiameter(e.target.value)}
                className={`${inputBase} ${diameterError ? 'border-red-500' : ''}`}
                aria-label="Outer diameter value"
                min="0"
                step="any"
              />
              <select
                value={outerDiameterUnit}
                onChange={(e) => setOuterDiameterUnit(e.target.value)}
                className={`${unitSelectBase} ${diameterError ? 'border-red-500' : ''}`}
                aria-label="Outer diameter unit"
              >
                {lengthOptions}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Inner diameter (optional)" icon={RulerIcon} menu error={diameterError}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={innerDiameter}
                onChange={(e) => setInnerDiameter(e.target.value)}
                className={`${inputBase} ${diameterError ? 'border-red-500' : ''}`}
                aria-label="Inner diameter value"
                min="0"
                step="any"
              />
              <select
                value={innerDiameterUnit}
                onChange={(e) => setInnerDiameterUnit(e.target.value)}
                className={`${unitSelectBase} ${diameterError ? 'border-red-500' : ''}`}
                aria-label="Inner diameter unit"
              >
                {lengthOptions}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Height" icon={RulerIcon} menu>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={inputBase}
                aria-label="Height value"
                min="0"
                step="any"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className={unitSelectBase}
                aria-label="Height unit"
              >
                {heightOnlyUnits.map(u => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Quantity" menu>
            <div className="flex">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputBase}
                aria-label="Quantity"
              />
              <div className={trailingStatic}>pieces</div>
            </div>
          </FieldGroup>

          <FieldGroup label="Volume" menu>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={volumeDisplay}
                className={readonlyInputBase}
                aria-label="Computed volume"
              />
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value)}
                className={unitSelectBase + ' bg-gray-50'}
                aria-label="Volume unit"
              >
                {volumeUnits.map(u => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldGroup>
        </form>
      </div>

      {/* Card 2: Pre-mixed concrete */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 pb-5 pt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Pre-mixed concrete
        </h2>

        <div>
          <FieldGroup label="Concrete density" menu>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={densityValue}
                onChange={(e) => setDensityValue(e.target.value)}
                className={inputBase}
                aria-label="Concrete density"
                min="0"
                step="any"
              />
              <select
                value={densityUnit}
                onChange={(e) => setDensityUnit(e.target.value)}
                className={unitSelectBase}
                aria-label="Density unit"
              >
                {densityUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Weight" menu>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={massDisplay}
                placeholder=""
                className={readonlyInputBase}
                aria-label="Total mass"
              />
              <select
                value={massUnit}
                onChange={(e) => setMassUnit(e.target.value)}
                className={unitSelectBase + ' bg-gray-50'}
                aria-label="Mass unit"
              >
                {massUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Bag size" menu icon={RulerIcon}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                value={bagSize}
                onChange={(e) => setBagSize(e.target.value)}
                className={inputBase}
                aria-label="Bag size"
                min="0"
                step="any"
              />
              <select
                value={bagSizeUnit}
                onChange={(e) => setBagSizeUnit(e.target.value)}
                className={unitSelectBase}
                aria-label="Bag size unit"
              >
                {bagSizeUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Waste" info menu>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={wastePercent}
                onChange={(e) => setWastePercent(e.target.value)}
                className={inputBase}
                aria-label="Waste percent"
                min="0"
                step="any"
              />
              <div className={trailingStatic}>%</div>
            </div>
          </FieldGroup>

          <FieldGroup label="Bags needed" menu>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={bagsNeeded}
                className={readonlyInputBase}
                aria-label="Bags needed"
              />
              <div className={trailingStatic}>bags</div>
            </div>
          </FieldGroup>
        </div>
      </div>

      {/* Card 3: Costs */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 pb-5 pt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Costs
        </h2>

        <FieldGroup label="Price of concrete per bag" icon={RulerIcon} menu>
          <div className="flex items-center">
            <div className={trailingStatic}>PKR</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerBag}
              onChange={(e) => setPricePerBag(e.target.value)}
              className={inputBase}
              aria-label="Price per bag"
              placeholder="0"
              min="0"
              step="any"
            />
            <div className={trailingStatic}>/bag</div>
          </div>
        </FieldGroup>

        <FieldGroup label="Price of concrete per unit volume" icon={RulerIcon} menu>
          <div className="flex items-center">
            <div className={trailingStatic}>PKR</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerUnitVolume}
              onChange={(e) => setPricePerUnitVolume(e.target.value)}
              className={inputBase}
              aria-label="Price per volume"
              placeholder="0"
              min="0"
              step="any"
            />
            <select
              value={pricePerUnitVolumeBasis}
              onChange={(e) => setPricePerUnitVolumeBasis(e.target.value)}
              className={trailingSelect}
              aria-label="Per volume basis"
            >
              {perVolumeCostUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </FieldGroup>

        <FieldGroup label="Price of concrete tube per piece" icon={RulerIcon} menu>
          <div className="flex items-center">
            <div className={trailingStatic}>PKR</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerTube}
              onChange={(e) => setPricePerTube(e.target.value)}
              className={inputBase}
              aria-label="Price per tube"
              placeholder="0"
              min="0"
              step="any"
            />
            <div className={trailingStatic}>/tube</div>
          </div>
        </FieldGroup>

        <FieldGroup label="Total cost" menu>
          <div className="flex items-center">
            <div className={trailingStatic}>PKR</div>
            <input
              type="text"
              readOnly
              value={totalCost}
              className={readonlyInputBase}
              aria-label="Total cost"
              placeholder="0"
            />
          </div>
        </FieldGroup>
      </div>
    </div>
  );
};

export default ConcreteEstimatorTubePage;