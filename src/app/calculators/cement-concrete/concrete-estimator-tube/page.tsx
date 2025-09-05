'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

/* ----------------- Constants ------------------ */
const DEFAULT_DENSITY_LBFT3 = 0;
const DEFAULT_BAG_SIZE_LB = 0; // Changed to match your example
const DEFAULT_WASTE = 0;

const VALIDATION_MESSAGES = {
  outerDiameterRequired: 'Outer diameter must be greater than zero.',
  innerDiameterInvalid: 'Inner diameter must be less than outer diameter.',
  heightRequired: 'Height must be greater than zero.',
  quantityRequired: 'Quantity must be at least 1.',
  densityRequired: 'Concrete density must be greater than zero.',
  bagSizeRequired: 'Bag size must be greater than zero.'
};

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
  { value: 'm3', label: 'cubic meters (m³)' },
  { value: 'cu-ft', label: 'cubic feet (cu ft)' },
  { value: 'cu-yd', label: 'cubic yards (cu yd)' },
  { value: 'us-gal', label: 'gallons (US) (US gal)' },
  { value: 'uk-gal', label: 'gallons (UK) (UK gal)' }
];

const lengthUnits = [
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'm', label: 'meters (m)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' },
];

const heightOnlyUnits = lengthUnits.filter(u => u.value !== 'm-cm');

/* ----------------- Density / Mass Units ------------------ */
const densityUnits = [
  { value: 'kg-m3', label: 'kilograms per cubic meter (kg/m³)' },
  { value: 'lb-ft3', label: 'pounds per cubic foot (lb/cu ft)' },
  { value: 'lb-yd3', label: 'pounds per cubic yard (lb/cu yd)' },
  { value: 'g-cm3', label: 'grams per cubic centimeter (g/cm³)' }
];

const massUnits = [
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 't', label: 'metric tons (t)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'st', label: 'stones (st)' },
  { value: 'US-st', label: 'US short tons (US ton)' },
  { value: 'long-ton', label: 'imperial tons (long ton)' }
];

const bagSizeUnits = [
  { value: 'kg', label: 'kilogram (kg)' },
  { value: 'lb', label: 'pound (lb)' }
];

/* ----------------- Cost Units ------------------ */
const perVolumeCostUnits = [
  { value: 'm3', label: 'per cubic meter (m³)' },
  { value: 'cu-ft', label: 'per cubic foot (cu ft)' },
  { value: 'cu-yd', label: 'per cubic yard (cu yd)' },
  { value: 'us-gal', label: 'per US gallon' },
  { value: 'uk-gal', label: 'per UK gallon' }
];

/* ----------------- Shared Field Group ------------------ */
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
const unitSelectBase = 'h-11 w-[140px] text-sm px-4 rounded-r-md bg-white border-2 border-l-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer';
const readonlyInputBase = 'h-11 w-full text-sm rounded-l-md border-2 border-gray-300 bg-gray-50 px-4 text-gray-700 cursor-not-allowed';
const trailingStatic = 'h-11 flex items-center rounded-r-md border-2 border-l-0 border-gray-300 bg-gray-50 text-sm px-4 text-gray-600 select-none w-[140px] justify-center';
const trailingSelect = 'h-11 w-[140px] border-2 border-l-0 border-gray-300 bg-white px-4 text-sm rounded-r-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer';

/* ----------------- Conversion Helpers ------------------ */
const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
  if (isNaN(value) || value < 0) return 0;
  const meterValue = value * lengthToCm[fromUnit] / 100;
  return meterValue / (lengthToCm[toUnit] / 100);
};

const convertDensity = (value: number, fromUnit: string, toUnit: string): number => {
  if (isNaN(value) || value < 0) return 0;
  let kgPerM3 = value;
  
  // Convert to kg/m³ first
  switch (fromUnit) {
    case 'lb-ft3': kgPerM3 *= 16.01846337; break;
    case 'lb-yd3': kgPerM3 *= 0.593276; break;
    case 'g-cm3': kgPerM3 *= 1000; break;
    case 'kg-m3': default: break;
  }
  
  // Convert from kg/m³ to target unit
  switch (toUnit) {
    case 'lb-ft3': return kgPerM3 / 16.01846337;
    case 'lb-yd3': return kgPerM3 / 0.593276;
    case 'g-cm3': return kgPerM3 / 1000;
    case 'kg-m3': default: return kgPerM3;
  }
};

const convertMass = (value: number, fromUnit: string, toUnit: string): number => {
  if (isNaN(value) || value < 0) return 0;
  let kg = value;
  
  // Convert to kg first
  switch (fromUnit) {
    case 'lb': kg /= 2.2046226218; break;
    case 't': kg *= 1000; break;
    case 'st': kg /= 0.157473; break;
    case 'US-st': kg *= 907.18474; break;
    case 'long-ton': kg *= 1016.047; break;
    case 'kg': default: break;
  }
  
  // Convert from kg to target unit
  switch (toUnit) {
    case 'lb': return kg * 2.2046226218;
    case 't': return kg / 1000;
    case 'st': return kg * 0.157473;
    case 'US-st': return kg / 907.18474;
    case 'long-ton': return kg / 1016.047;
    case 'kg': default: return kg;
  }
};

const formatNumber = (v: number, d = 2) =>
  isFinite(v) && v >= 0 ? parseFloat(v.toFixed(d)).toString() : '0';

const unitVolumeInM3: Record<string, number> = {
  'm3': 1,
  'cu-ft': 0.0283168467117,
  'cu-yd': 0.764554857984,
  'us-gal': 0.003785411784,
  'uk-gal': 0.00454609
};

/* ----------------- Component ------------------ */
const ConcreteEstimatorTubePage = () => {
  // Dimension states - keeping display values and canonical values separate
  const [outerDiameter, setOuterDiameter] = useState('');
  const [outerDiameterUnit, setOuterDiameterUnit] = useState('in');
  const [innerDiameter, setInnerDiameter] = useState('');
  const [innerDiameterUnit, setInnerDiameterUnit] = useState('in');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('ft');
  const [quantity, setQuantity] = useState('1');

  // Volume display
  const [volumeUnit, setVolumeUnit] = useState('cu-yd');
  const [diameterError, setDiameterError] = useState('');

  // Density - display and canonical
  const [densityUnit, setDensityUnit] = useState('lb-ft3');
  const [densityDisplay, setDensityDisplay] = useState(DEFAULT_DENSITY_LBFT3.toString());

  // Mass output
  const [massUnit, setMassUnit] = useState('lb');

  // Bag size - display and canonical
  const [bagSizeUnit, setBagSizeUnit] = useState('lb');
  const [bagSizeDisplay, setBagSizeDisplay] = useState(DEFAULT_BAG_SIZE_LB.toString());

  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE.toString());

  // Costs
  const [pricePerBag, setPricePerBag] = useState('');
  const [pricePerUnitVolume, setPricePerUnitVolume] = useState('');
  const [pricePerUnitVolumeBasis, setPricePerUnitVolumeBasis] = useState('cu-yd');
  const [pricePerTube, setPricePerTube] = useState('');

  // Calculated values
  const [volumeDisplay, setVolumeDisplay] = useState('0');
  const [massDisplay, setMassDisplay] = useState('0');
  const [bagsNeeded, setBagsNeeded] = useState('0');
  const [totalCost, setTotalCost] = useState('0.00');

  // Canonical volume in m3
  const [volumeM3, setVolumeM3] = useState(0);

  // Canonical bag size in kg
  const [bagSizeKg, setBagSizeKg] = useState(0);

  // --- Price Per Unit Volume Canonical Value (in PKR/m3) ---
  const [pricePerUnitVolumeM3, setPricePerUnitVolumeM3] = useState(0);

  // Validate diameters
  useEffect(() => {
    const outer = parseFloat(outerDiameter);
    const inner = parseFloat(innerDiameter);
    
    if (!isNaN(outer) && !isNaN(inner) && outer > 0 && inner >= 0) {
      // Convert both to same unit for comparison
      const outerInMeters = convertLength(outer, outerDiameterUnit, 'm');
      const innerInMeters = convertLength(inner, innerDiameterUnit, 'm');
      
      if (outerInMeters <= innerInMeters) {
        setDiameterError('Outer diameter must be greater than inner diameter');
      } else {
        setDiameterError('');
      }
    } else {
      setDiameterError('');
    }
  }, [outerDiameter, outerDiameterUnit, innerDiameter, innerDiameterUnit]);

  // Independent unit change handlers
  const handleOuterDiameterUnitChange = (newUnit: string) => {
    const currentVal = parseFloat(outerDiameter);
    if (!isNaN(currentVal) && currentVal > 0) {
      const converted = convertLength(currentVal, outerDiameterUnit, newUnit);
      setOuterDiameter(formatNumber(converted, 4));
    }
    setOuterDiameterUnit(newUnit);
  };

  const handleInnerDiameterUnitChange = (newUnit: string) => {
    const currentVal = parseFloat(innerDiameter);
    if (!isNaN(currentVal) && currentVal >= 0) {
      const converted = convertLength(currentVal, innerDiameterUnit, newUnit);
      setInnerDiameter(formatNumber(converted, 4));
    }
    setInnerDiameterUnit(newUnit);
  };

  const handleHeightUnitChange = (newUnit: string) => {
    const currentVal = parseFloat(height);
    if (!isNaN(currentVal) && currentVal > 0) {
      const converted = convertLength(currentVal, heightUnit, newUnit);
      setHeight(formatNumber(converted, 4));
    }
    setHeightUnit(newUnit);
  };

  const handleDensityUnitChange = (newUnit: string) => {
    const currentVal = parseFloat(densityDisplay);
    if (!isNaN(currentVal) && currentVal > 0) {
      const converted = convertDensity(currentVal, densityUnit, newUnit);
      setDensityDisplay(formatNumber(converted, 4));
    }
    setDensityUnit(newUnit);
  };

  // When density changes, auto-calculate bag size in kg (if density > 0)
  useEffect(() => {
    const density = parseFloat(densityDisplay);
    if (!isNaN(density) && density > 0) {
      // Example: set bag size to 1/40th of density (arbitrary, adjust as needed)
      // If you have a specific formula, use it here.
      // For now, let's keep it as a placeholder:
      // setBagSizeKg(density / 40);
      // But since you want to let user input bag size, only auto-calculate if empty:
      if (!bagSizeDisplay || bagSizeDisplay === '0') {
        // Default to 25kg or 60lb bag, converted to kg if needed
        let defaultBagKg = 25;
        if (bagSizeUnit === 'lb') defaultBagKg = convertMass(60, 'lb', 'kg');
        setBagSizeKg(defaultBagKg);
        setBagSizeDisplay(formatNumber(convertMass(defaultBagKg, 'kg', bagSizeUnit), 4));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [densityDisplay]);

  // Keep bagSizeKg in sync with bagSizeDisplay and bagSizeUnit
  useEffect(() => {
    const val = parseFloat(bagSizeDisplay);
    if (!isNaN(val) && val > 0) {
      setBagSizeKg(convertMass(val, bagSizeUnit, 'kg'));
    } else {
      setBagSizeKg(0);
    }
  }, [bagSizeDisplay, bagSizeUnit]);

  // When bag size unit changes, only convert the display value, not the canonical value
  const handleBagSizeUnitChange = (newUnit: string) => {
    // Convert current canonical bag size to new unit for display
    setBagSizeDisplay(formatNumber(convertMass(bagSizeKg, 'kg', newUnit), 4));
    setBagSizeUnit(newUnit);
  };

  // Volume calculation (always in m3)
  useEffect(() => {
    const outerD = parseFloat(outerDiameter);
    const innerD = parseFloat(innerDiameter) || 0;
    const h = parseFloat(height);
    const q = parseFloat(quantity);

    if (diameterError || isNaN(outerD) || outerD <= 0 || isNaN(h) || h <= 0 || isNaN(q) || q <= 0) {
      setVolumeM3(0);
      setVolumeDisplay('0.00');
      return;
    }

    // Convert all dimensions to meters for calculation
    const outerDMeters = convertLength(outerD, outerDiameterUnit, 'm');
    const innerDMeters = convertLength(innerD, innerDiameterUnit, 'm');
    const hMeters = convertLength(h, heightUnit, 'm');

    // Calculate volume in cubic meters (π * (R₁² - R₂²) * h * quantity)
    const outerRadius = outerDMeters / 2;
    const innerRadius = innerDMeters / 2;
    const volumeM3Val = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * hMeters * q;

    setVolumeM3(volumeM3Val);
  }, [outerDiameter, outerDiameterUnit, innerDiameter, innerDiameterUnit, height, heightUnit, quantity, diameterError]);

  // Display volume in selected unit
  useEffect(() => {
    let displayVolume = volumeM3;
    switch (volumeUnit) {
      case 'cu-ft': displayVolume /= 0.0283168467117; break;
      case 'cu-yd': displayVolume /= 0.764554857984; break;
      case 'us-gal': displayVolume /= 0.003785411784; break;
      case 'uk-gal': displayVolume /= 0.00454609; break;
      // m3: do nothing
    }
    setVolumeDisplay(formatNumber(displayVolume, 4));
  }, [volumeM3, volumeUnit]);

  // Mass and bags calculation (use canonical volumeM3)
  useEffect(() => {
    const density = parseFloat(densityDisplay);
    const waste = parseFloat(wastePercent) || 0;
    const bagSize = parseFloat(bagSizeDisplay);

    if (isNaN(volumeM3) || volumeM3 <= 0 || isNaN(density) || density <= 0) {
      setMassDisplay('0.00');
      setBagsNeeded('0');
      return;
    }

    // Convert density to kg/m³ for calculation
    const densityKgM3 = convertDensity(density, densityUnit, 'kg-m3');
    
    // Calculate mass in kg
    const massKg = volumeM3 * densityKgM3;
    const massWithWasteKg = massKg * (1 + waste / 100);

    // Convert to display unit
    const massForDisplay = convertMass(massWithWasteKg, 'kg', massUnit);
    setMassDisplay(formatNumber(massForDisplay, 2));

    // Calculate bags needed
    if (!isNaN(bagSize) && bagSize > 0) {
      const bagSizeKg = convertMass(bagSize, bagSizeUnit, 'kg');
      const bags = Math.ceil(massWithWasteKg / bagSizeKg);
      setBagsNeeded(bags.toString());
    } else {
      setBagsNeeded('0');
    }
  }, [volumeM3, densityDisplay, densityUnit, wastePercent, massUnit, bagSizeDisplay, bagSizeUnit]);

  // Bags needed calculation (using canonical values and correct formula)
  useEffect(() => {
    const waste = parseFloat(wastePercent) || 0;
    if (isNaN(volumeM3) || volumeM3 <= 0 || isNaN(bagSizeKg) || bagSizeKg <= 0) {
      setBagsNeeded('0');
      return;
    }
    // Density in kg/m³
    const density = parseFloat(densityDisplay);
    const densityKgM3 = convertDensity(density, densityUnit, 'kg-m3');
    // Bags = ceil(V_total * ρ * (1 + w) / W_bag)
    const bags = Math.ceil(volumeM3 * densityKgM3 * (1 + waste / 100) / bagSizeKg);
    setBagsNeeded(bags.toString());
  }, [volumeM3, densityDisplay, densityUnit, wastePercent, bagSizeKg]);

  // Cost calculation (use canonical volumeM3)
  useEffect(() => {
    let total = 0;

    // Cost from bags
    const bagPrice = parseFloat(pricePerBag) || 0;
    const bags = parseInt(bagsNeeded) || 0;
    total += bagPrice * bags;

    // Cost from volume
    const volumePrice = parseFloat(pricePerUnitVolume) || 0;
    if (volumePrice > 0 && volumeM3 > 0) {
      // Convert volumeM3 to pricing basis unit
      let volumeForPricing = volumeM3;
      switch (pricePerUnitVolumeBasis) {
        case 'cu-ft': volumeForPricing /= 0.0283168467117; break;
        case 'cu-yd': volumeForPricing /= 0.764554857984; break;
        case 'us-gal': volumeForPricing /= 0.003785411784; break;
        case 'uk-gal': volumeForPricing /= 0.00454609; break;
        // m3: do nothing
      }
      total += volumePrice * volumeForPricing;
    }

    // Cost from tubes
    const tubePrice = parseFloat(pricePerTube) || 0;
    const qty = parseInt(quantity) || 0;
    total += tubePrice * qty;

    setTotalCost(formatNumber(total, 2));
  }, [pricePerBag, bagsNeeded, pricePerUnitVolume, volumeM3, pricePerUnitVolumeBasis, pricePerTube, quantity]);

  const lengthOptions = useMemo(
    () => lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>),
    []
  );

  // Add a clearAll function to reset all input fields to their initial values
  const clearAll = () => {
    // Reset dimensions
    setOuterDiameter('');
    setInnerDiameter('');
    setHeight('');
    setQuantity('1');
    
    // Reset units to defaults
    setOuterDiameterUnit('in');
    setInnerDiameterUnit('in');
    setHeightUnit('ft');
    setVolumeUnit('cu-yd');
    setDensityUnit('lb-ft3');
    setMassUnit('lb');
    setBagSizeUnit('lb');
    
    // Reset numerical values
    setDensityDisplay('0');
    setBagSizeDisplay('0');
    setWastePercent('0');
    
    // Reset prices
    setPricePerBag('');
    setPricePerUnitVolume('');
    setPricePerUnitVolumeBasis('cu-yd');
    setPricePerTube('');
    
    // Reset calculated values
    setVolumeDisplay('0');
    setMassDisplay('0');
    setBagsNeeded('0');
    setTotalCost('0.00');
    setVolumeM3(0);
    setBagSizeKg(0);
    setPricePerUnitVolumeM3(0);
    
    // Clear errors
    setDiameterError('');

    // Clear validation errors
    setErrors({
      outerDiameter: '',
      innerDiameter: '',
      height: '',
      quantity: '',
      density: '',
      bagSize: ''
    });

    // Reset touched state
    setTouched({
      outerDiameter: false,
      innerDiameter: false,
      height: false,
      quantity: false,
      density: false,
      bagSize: false,
    });
  };

  // When pricePerUnitVolume or its basis changes, update canonical PKR/m3 value
  useEffect(() => {
    const price = parseFloat(pricePerUnitVolume);
    if (!isNaN(price) && price > 0) {
      const factor = unitVolumeInM3[pricePerUnitVolumeBasis] || 1;
      setPricePerUnitVolumeM3(price / factor);
    } else {
      setPricePerUnitVolumeM3(0);
    }
  }, [pricePerUnitVolume, pricePerUnitVolumeBasis]);

  // When dropdown changes, only convert the display value, not the canonical value
  const handlePricePerUnitVolumeBasisChange = (newUnit: string) => {
    // Convert canonical PKR/m3 to new unit for display
    const factor = unitVolumeInM3[newUnit] || 1;
    setPricePerUnitVolume(
      pricePerUnitVolumeM3 > 0 ? formatNumber(pricePerUnitVolumeM3 * factor, 4) : ''
    );
    setPricePerUnitVolumeBasis(newUnit);
  };

  // --- Bags Needed Calculation (standard formula, using canonical units) ---
  useEffect(() => {
    const waste = parseFloat(wastePercent) || 0;
    if (isNaN(volumeM3) || volumeM3 <= 0 || isNaN(bagSizeKg) || bagSizeKg <= 0) {
      setBagsNeeded('0');
      return;
    }
    // Use display unit for volume (cu-ft or cu-yd) if user selected, else m3
    let V_total = volumeM3;
    let density = parseFloat(densityDisplay);
    let densityUnitLocal = densityUnit;
    if (volumeUnit === 'cu-ft') {
      V_total = volumeM3 / unitVolumeInM3['cu-ft'];
      density = convertDensity(density, densityUnit, 'lb-ft3');
      densityUnitLocal = 'lb-ft3';
    } else if (volumeUnit === 'cu-yd') {
      V_total = volumeM3 / unitVolumeInM3['cu-yd'];
      density = convertDensity(density, densityUnit, 'lb-yd3');
      densityUnitLocal = 'lb-yd3';
    }
    // Bag size in lb if density is in lb/ft3 or lb/yd3, else kg
    let bagSize = bagSizeKg;
    if (densityUnitLocal.startsWith('lb')) {
      bagSize = convertMass(bagSizeKg, 'kg', 'lb');
    }
    // Bags = ceil(V_total * density * (1 + w) / bagSize)
    const bags = Math.ceil(V_total * density * (1 + waste / 100) / bagSize);
    setBagsNeeded(isFinite(bags) && bags > 0 ? bags.toString() : '0');
  }, [volumeM3, volumeUnit, densityDisplay, densityUnit, wastePercent, bagSizeKg]);

  // --- Total Cost Calculation (bags only, as per your formula) ---
  useEffect(() => {
    const bagPrice = parseFloat(pricePerBag) || 0;
    const bags = parseInt(bagsNeeded) || 0;
    let total = bagPrice * bags;
    setTotalCost(formatNumber(total, 2));
  }, [pricePerBag, bagsNeeded]);

  // --- Cost Per Unit Volume (optional, for direct estimate) ---
  // If you want to show cost per cubic yard or cubic foot, you can add:
  // const costPerCuYd = pricePerUnitVolumeM3 * unitVolumeInM3['cu-yd'];
  // const costPerCuFt = pricePerUnitVolumeM3 * unitVolumeInM3['cu-ft'];

  // Auto-calculate price per unit volume when price per bag or bags needed changes
  useEffect(() => {
    const bagPrice = parseFloat(pricePerBag);
    const bags = parseInt(bagsNeeded);
    if (
      !isNaN(bagPrice) && bagPrice > 0 &&
      !isNaN(bags) && bags > 0 &&
      volumeM3 > 0
    ) {
      // Total cost for all bags
      const totalBagCost = bagPrice * bags;
      // Price per m3
      const pricePerM3 = totalBagCost / volumeM3;
      setPricePerUnitVolumeM3(pricePerM3);
      // Convert to selected unit for display
      const factor = unitVolumeInM3[pricePerUnitVolumeBasis] || 1;
      setPricePerUnitVolume(formatNumber(pricePerM3 * factor, 4));
    }
    // If bag price is cleared, clear price per unit volume
    if (!pricePerBag) {
      setPricePerUnitVolume('');
      setPricePerUnitVolumeM3(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricePerBag, bagsNeeded, volumeM3, pricePerUnitVolumeBasis]);

  // Auto-calculate price per tube per piece when price per bag or bags needed changes
  useEffect(() => {
    const bagPrice = parseFloat(pricePerBag);
    const bags = parseInt(bagsNeeded);
    const qty = parseInt(quantity);
    if (
      !isNaN(bagPrice) && bagPrice > 0 &&
      !isNaN(bags) && bags > 0 &&
      !isNaN(qty) && qty > 0
    ) {
      // Total cost for all bags
      const totalBagCost = bagPrice * bags;
      // Price per tube per piece
      const pricePerTubePiece = totalBagCost / qty;
      setPricePerTube(formatNumber(pricePerTubePiece, 2));
    }
    // If bag price is cleared, clear price per tube
    if (!pricePerBag) {
      setPricePerTube('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricePerBag, bagsNeeded, quantity]);

  // Add validation function
  const validateInputs1 = () => {
    const newErrors = {
      outerDiameter: '',
      innerDiameter: '',
      height: '',
      quantity: '',
      density: '',
      bagSize: ''
    };

    // Convert values to numbers for comparison
    const outerD = parseFloat(outerDiameter);
    const innerD = parseFloat(innerDiameter);
    const h = parseFloat(height);
    const qty = parseFloat(quantity);
    const density = parseFloat(densityDisplay);
    const bagSize = parseFloat(bagSizeDisplay);

    // Validate each field
    if (touched.outerDiameter && (!outerD || outerD <= 0)) {
      newErrors.outerDiameter = VALIDATION_MESSAGES.outerDiameterRequired;
    }

    if (touched.innerDiameter && innerD && (innerD >= outerD || innerD < 0)) {
      newErrors.innerDiameter = VALIDATION_MESSAGES.innerDiameterInvalid;
    }

    if (touched.height && (!h || h <= 0)) {
      newErrors.height = VALIDATION_MESSAGES.heightRequired;
    }

    if (touched.quantity && (!qty || qty < 1)) {
      newErrors.quantity = VALIDATION_MESSAGES.quantityRequired;
    }

    if (touched.density && (!density || density <= 0)) {
      newErrors.density = VALIDATION_MESSAGES.densityRequired;
    }

    if (touched.bagSize && (!bagSize || bagSize <= 0)) {
      newErrors.bagSize = VALIDATION_MESSAGES.bagSizeRequired;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Add missing state for errors
  const [errors, setErrors] = useState<{
    outerDiameter: string;
    innerDiameter: string;
    height: string;
    quantity: string;
    density: string;
    bagSize: string;
  }>({
    outerDiameter: '',
    innerDiameter: '',
    height: '',
    quantity: '',
    density: '',
    bagSize: ''
  });

  // Add missing stub for calculateMaterials (so validation effect doesn't break)
  const calculateMaterials = () => {
    // No-op: calculations are already handled by other useEffects
    // This is just to satisfy the validation effect dependency
  };

  // Add validation to calculation effects
  useEffect(() => {
    if (validateInputs()) {
      calculateMaterials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerDiameter, innerDiameter, height, quantity, densityDisplay, bagSizeDisplay]);

  // Add touched state for each input field
  const [touched, setTouched] = useState<{
    outerDiameter: boolean;
    innerDiameter: boolean;
    height: boolean;
    quantity: boolean;
    density: boolean;
    bagSize: boolean;
  }>({
    outerDiameter: false,
    innerDiameter: false,
    height: false,
    quantity: false,
    density: false,
    bagSize: false,
  });

  // Update validateInputs to only show errors if touched
  const validateInputs = () => {
    const newErrors = {
      outerDiameter: '',
      innerDiameter: '',
      height: '',
      quantity: '',
      density: '',
      bagSize: ''
    };

    const outerD = parseFloat(outerDiameter);
    const innerD = parseFloat(innerDiameter);
    const h = parseFloat(height);
    const qty = parseFloat(quantity);
    const density = parseFloat(densityDisplay);
    const bagSize = parseFloat(bagSizeDisplay);

    if (touched.outerDiameter && (!outerD || outerD <= 0)) {
      newErrors.outerDiameter = VALIDATION_MESSAGES.outerDiameterRequired;
    }
    if (touched.innerDiameter && innerD && (innerD >= outerD || innerD < 0)) {
      newErrors.innerDiameter = VALIDATION_MESSAGES.innerDiameterInvalid;
    }
    if (touched.height && (!h || h <= 0)) {
      newErrors.height = VALIDATION_MESSAGES.heightRequired;
    }
    if (touched.quantity && (!qty || qty < 1)) {
      newErrors.quantity = VALIDATION_MESSAGES.quantityRequired;
    }
    if (touched.density && (!density || density <= 0)) {
      newErrors.density = VALIDATION_MESSAGES.densityRequired;
    }
    if (touched.bagSize && (!bagSize || bagSize <= 0)) {
      newErrors.bagSize = VALIDATION_MESSAGES.bagSizeRequired;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  return (
    <div className="w-[500px] max-w-xl mx-auto p-4 md:p-6 space-y-4">
      {/* Add main heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Concrete Estimator - Tube
        </h1>
        <p className="text-gray-600">
          Calculate concrete requirements for circular columns and tubes
        </p>
      </div>

      {/* Card 1: Tube Details */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 pb-5 pt-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Concrete tube details
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-52 h-52 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/cylinder.webp"
              alt="Concrete Tube Cross-Section"
              width={208}
              height={208}
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-500 tracking-wide">
            © Concrete Calculator
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <FieldGroup label="Outer diameter" icon={RulerIcon} menu error={errors.outerDiameter || diameterError}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={outerDiameter}
                onChange={e => {
                  setOuterDiameter(e.target.value);
                  if (!touched.outerDiameter) setTouched(t => ({ ...t, outerDiameter: true }));
                }}
                className={`${inputBase} ${errors.outerDiameter || diameterError ? 'border-red-500' : ''}`}
                aria-label="Outer diameter value"
                min="0"
                step="any"
              />
              <select
                value={outerDiameterUnit}
                onChange={e => handleOuterDiameterUnitChange(e.target.value)}
                className={`${unitSelectBase} ${errors.outerDiameter || diameterError ? 'border-red-500' : ''}`}
                aria-label="Outer diameter unit"
              >
                {lengthOptions}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Inner diameter (optional)" icon={RulerIcon} menu error={errors.innerDiameter || diameterError}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={innerDiameter}
                onChange={e => {
                  setInnerDiameter(e.target.value);
                  if (!touched.innerDiameter) setTouched(t => ({ ...t, innerDiameter: true }));
                }}
                className={`${inputBase} ${errors.innerDiameter || diameterError ? 'border-red-500' : ''}`}
                aria-label="Inner diameter value"
                min="0"
                step="any"
              />
              <select
                value={innerDiameterUnit}
                onChange={e => handleInnerDiameterUnitChange(e.target.value)}
                className={`${unitSelectBase} ${errors.innerDiameter || diameterError ? 'border-red-500' : ''}`}
                aria-label="Inner diameter unit"
              >
                {lengthOptions}
              </select>
            </div>
          </FieldGroup>

          <FieldGroup label="Height" icon={RulerIcon} menu error={errors.height}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={height}
                onChange={e => {
                  setHeight(e.target.value);
                  if (!touched.height) setTouched(t => ({ ...t, height: true }));
                }}
                className={inputBase}
                aria-label="Height value"
                min="0"
                step="any"
              />
              <select
                value={heightUnit}
                onChange={e => handleHeightUnitChange(e.target.value)}
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

          <FieldGroup label="Quantity" menu error={errors.quantity}>
            <div className="flex">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => {
                  setQuantity(e.target.value);
                  if (!touched.quantity) setTouched(t => ({ ...t, quantity: true }));
                }}
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
                onChange={e => setVolumeUnit(e.target.value)}
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
          <FieldGroup label="Concrete density" menu error={errors.density}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={densityDisplay}
                onChange={e => {
                  setDensityDisplay(e.target.value);
                  if (!touched.density) setTouched(t => ({ ...t, density: true }));
                }}
                className={inputBase}
                aria-label="Concrete density"
                min="0"
                step="any"
              />
              <select
                value={densityUnit}
                onChange={e => handleDensityUnitChange(e.target.value)}
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
                onChange={e => setMassUnit(e.target.value)}
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

          <FieldGroup label="Bag size" menu icon={RulerIcon} error={errors.bagSize}>
            <div className="flex">
              <input
                type="number"
                inputMode="decimal"
                value={bagSizeDisplay}
                onChange={e => {
                  setBagSizeDisplay(e.target.value);
                  if (!touched.bagSize) setTouched(t => ({ ...t, bagSize: true }));
                }}
                className={inputBase}
                aria-label="Bag size"
                min="0"
                step="any"
              />
              <select
                value={bagSizeUnit}
                onChange={e => handleBagSizeUnitChange(e.target.value)}
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
              onChange={(e) => handlePricePerUnitVolumeBasisChange(e.target.value)}
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
      {/* Move Clear button to the bottom with better styling */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={clearAll}
          className="px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg border border-blue-300 font-semibold transition-all duration-200 hover:shadow-md active:transform active:scale-95"
        >
          Clear All Fields
        </button>
      </div>
    </div>
  );
};

export default ConcreteEstimatorTubePage;