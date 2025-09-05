'use client'
import React, { useState } from 'react'
import { FiInfo, FiChevronDown } from 'react-icons/fi'


const roadLengthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
];

const roadDepthUnitOptions = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" }
];

const roadAreaUnitOptions = [
  { label: "square millimeters (mm²)", value: "mm2" },
  { label: "square centimeters (cm²)", value: "cm2" },
  { label: "square decimeters (dm²)", value: "dm2" },
  { label: "square meters (m²)", value: "m2" },
  { label: "square inches (in²)", value: "in2" },
  { label: "square feet (ft²)", value: "ft2" },
  { label: "square yards (yd²)", value: "yd2" },
  { label: "acres (ac)", value: "ac" },
  { label: "soccer fields (sf)", value: "sf" }
];

const roadBaseVolumeUnitOptions = [
  { label: "cubic millimeters (mm³)", value: "mm3" },
  { label: "cubic centimeters (cm³)", value: "cm3" },
  { label: "cubic decimeters (dm³)", value: "dm3" },
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic inches (cu in)", value: "cu_in" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" },
  { label: "milliliters (ml)", value: "ml" },
  { label: "centiliters (cl)", value: "cl" },
  { label: "liters (l)", value: "l" },
  { label: "gallons (US) (US gal)", value: "us_gal" },
  { label: "gallons (UK) (UK gal)", value: "uk_gal" }
];

const gravelDensityUnitOptions = [
  { label: "kilograms per cubic meter (kg/m³)", value: "kg_m3" },
  { label: "pounds per cubic feet (lb/cu ft)", value: "lb_cu_ft" },
  { label: "pounds per cubic yard (lb/cu yd)", value: "lb_cu_yd" }
];

const gravelAmountUnitOptions = [
  { label: "kilograms (kg)", value: "kg" },
  { label: "metric tons (t)", value: "t" },
  { label: "pounds (lb)", value: "lb" },
  { label: "stones (st)", value: "st" },
  { label: "US short tons (US ton)", value: "us_ton" },
  { label: "imperial tons (long ton)", value: "long_ton" }
];

const pricePerTonUnitOptions = [
  { label: "gram (g)", value: "g" },
  { label: "kilogram (kg)", value: "kg" },
  { label: "metric ton (t)", value: "t" },
  { label: "pound (lb)", value: "lb" },
  { label: "stone (st)", value: "st" },
  { label: "US short ton (US ton)", value: "us_ton" },
  { label: "imperial ton (long ton)", value: "long_ton" },
  { label: "electron rest mass (me)", value: "me" }
];

const pricePerVolumeUnitOptions = [
  { label: "cubic millimeters (mm³)", value: "mm3" },
  { label: "cubic centimeters (cm³)", value: "cm3" },
  { label: "cubic decimeters (dm³)", value: "dm3" },
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic inches (cu in)", value: "cu_in" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" },
  { label: "milliliters (ml)", value: "ml" },
  { label: "centiliters (cl)", value: "cl" },
  { label: "liters (l)", value: "l" },
  { label: "gallons (US) (US gal)", value: "us_gal" },
  { label: "gallons (UK) (UK gal)", value: "uk_gal" }
];

// --- Conversion Functions ---

// Length conversion (all to meters as base)
function convertLength(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };
  if (!(from in toMeters) || !(to in toMeters)) return value;
  if (isNaN(value) || value < 0) return 0;
  const meters = value * toMeters[from];
  return meters / toMeters[to];
}

// Area conversion (all to m² as base)
function convertArea(value: number, from: string, to: string): number {
  const toM2: Record<string, number> = {
    mm2: 1e-6,
    cm2: 1e-4,
    dm2: 1e-2,
    m2: 1,
    in2: 0.00064516,
    ft2: 0.09290304,
    yd2: 0.83612736,
    ac: 4046.8564224,
    sf: 7140, // 1 soccer field ≈ 7140 m²
  };
  if (!(from in toM2) || !(to in toM2)) return value;
  if (isNaN(value) || value < 0) return 0;
  const m2 = value * toM2[from];
  return m2 / toM2[to];
}

// Volume conversion (all to m³ as base)
function convertVolume(value: number, from: string, to: string): number {
  const toM3: Record<string, number> = {
    mm3: 1e-9,
    cm3: 1e-6,
    dm3: 1e-3,
    m3: 1,
    cu_in: 0.000016387064,
    cu_ft: 0.028316846592,
    cu_yd: 0.764554857984,
    ml: 1e-6,
    cl: 1e-5,
    l: 1e-3,
    us_gal: 0.003785411784,
    uk_gal: 0.00454609,
  };
  if (!(from in toM3) || !(to in toM3)) return value;
  if (isNaN(value) || value < 0) return 0;
  const m3 = value * toM3[from];
  return m3 / toM3[to];
}

// Mass conversion (all to kg as base)
function convertMass(value: number, from: string, to: string): number {
  const toKg: Record<string, number> = {
    g: 0.001,
    kg: 1,
    t: 1000,
    lb: 0.45359237,
    st: 6.35029318,
    us_ton: 907.18474,
    long_ton: 1016.0469088,
    earth: 5.972e24,
    me: 9.10938356e-31,
  };
  if (!(from in toKg) || !(to in toKg)) return value;
  if (isNaN(value) || value < 0) return 0;
  const kg = value * toKg[from];
  return kg / toKg[to];
}

// Density conversion (all to kg/m³ as base)
function convertDensity(value: number, from: string, to: string): number {
  // kg/m³, lb/cu ft, lb/cu yd
  const toKgM3: Record<string, number> = {
    kg_m3: 1,
    lb_cu_ft: 16.0184634,
    lb_cu_yd: 0.593276421,
  };
  if (!(from in toKgM3) || !(to in toKgM3)) return value;
  if (isNaN(value) || value < 0) return 0;
  const kgm3 = value * toKgM3[from];
  return kgm3 / toKgM3[to];
}

// --- Calculation Functions ---

// Calculate area (length × width)
function calcArea(length: number, width: number, lengthUnit: string, widthUnit: string, areaUnit: string): number {
  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) return 0;
  
  // Convert length and width to meters
  const lengthM = convertLength(length, lengthUnit, 'm');
  const widthM = convertLength(width, widthUnit, 'm');
  const areaM2 = lengthM * widthM;
  // Convert area to selected unit
  return convertArea(areaM2, 'm2', areaUnit);
}

// Calculate volume (area × depth)
function calcVolume(area: number, depth: number, areaUnit: string, depthUnit: string, volumeUnit: string): number {
  if (isNaN(area) || isNaN(depth) || area <= 0 || depth <= 0) return 0;
  
  // Convert area to m² and depth to meters
  const areaM2 = convertArea(area, areaUnit, 'm2');
  const depthM = convertLength(depth, depthUnit, 'm');
  const volumeM3 = areaM2 * depthM;
  // Convert volume to selected unit
  return convertVolume(volumeM3, 'm3', volumeUnit);
}

// Calculate mass (volume × density)
function calcMass(volume: number, density: number, volumeUnit: string, densityUnit: string, massUnit: string): number {
  if (isNaN(volume) || isNaN(density) || volume <= 0 || density <= 0) return 0;
  
  // Convert volume to m³ and density to kg/m³
  const volumeM3 = convertVolume(volume, volumeUnit, 'm3');
  const densityKgM3 = convertDensity(density, densityUnit, 'kg_m3');
  const massKg = (volumeM3 * densityKgM3);
  // Convert mass to selected unit
  return convertMass(massKg, 'kg', massUnit);
}

// Calculate mass with compression
function calcMassWithCompression(mass: number, compressionPercent: number): number {
  if (isNaN(mass) || mass <= 0) return 0;
  if (isNaN(compressionPercent)) compressionPercent = 0;
  
  return mass * (1 + (compressionPercent || 0) / 100);
}

// Calculate cost (by mass or by volume)
function calcCostByMass(mass: number, pricePerTon: number, massUnit: string, priceUnit: string): number {
  if (isNaN(mass) || isNaN(pricePerTon) || mass <= 0 || pricePerTon <= 0) return 0;
  
  // Convert mass to selected price unit
  const massForPrice = convertMass(mass, massUnit, priceUnit);
  return massForPrice * pricePerTon;
}

function calcCostByVolume(volume: number, pricePerVolume: number, volumeUnit: string, priceUnit: string): number {
  if (isNaN(volume) || isNaN(pricePerVolume) || volume <= 0 || pricePerVolume <= 0) return 0;
  
  // Convert volume to selected price unit
  const volumeForPrice = convertVolume(volume, volumeUnit, priceUnit);
  return volumeForPrice * pricePerVolume;
}

// Update: Price per volume calculation should always use metric ton (t) as the pricePerTon unit for conversion
function calcPricePerVolumeFromTon(
  pricePerTon: number,
  gravelDensity: number,
  gravelDensityUnit: string,
  pricePerVolumeUnit: string
): number {
  if (isNaN(pricePerTon) || isNaN(gravelDensity) || pricePerTon <= 0 || gravelDensity <= 0) return 0;
  
  // Always treat pricePerTon as per metric ton (t)
  const pricePerKg = pricePerTon / 1000; // 1 t = 1000 kg
  const densityKgM3 = convertDensity(gravelDensity, gravelDensityUnit, 'kg_m3');
  const pricePerM3 = pricePerKg * densityKgM3;
  const m3ToTarget = convertVolume(1, 'm3', pricePerVolumeUnit);
  return pricePerM3 / m3ToTarget;
}

interface InputRowProps {
  label: string;
  unit: string;
  value: string;
  onValueChange: (value: string) => void;
  unitOptions: Array<{ label: string; value: string } | string>;
  onUnitChange: (unit: string) => void;
  placeholder?: string;
  info?: string;
  disabled?: boolean;
  type?: string;
}

const InputRow = ({
  label,
  unit,
  value,
  onValueChange,
  unitOptions,
  onUnitChange,
  placeholder,
  info,
  disabled,
  type = "text"
}: InputRowProps) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={info}>
          <FiInfo size={16} />
        </span>
      )}
    </div>
    <div className="flex">
      <input
        type={type}
        className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
        placeholder={placeholder || "Enter value"}
        disabled={disabled}
        value={value}
        onChange={e => {
          const val = e.target.value;
          if (type === 'number' && val !== '') {
            const num = parseFloat(val);
            if (isNaN(num) || num < 0) return; // Don't update for negative values
          }
          onValueChange && onValueChange(val);
        }}
        style={{ minWidth: 0 }}
      />
      {unitOptions && (
        <div className="relative w-48">
          <select
            className="w-full border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white focus:outline-none truncate"
            disabled={disabled}
            value={unit}
            onChange={e => onUnitChange && onUnitChange(e.target.value)}
            style={{ maxWidth: '100%' }}
          >
            {unitOptions.map((opt: any) =>
              typeof opt === "string"
                ? <option key={opt} value={opt}>{opt}</option>
                : <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
          <span className="absolute right-2 top-2 text-gray-400 pointer-events-none">
            <FiChevronDown size={14} />
          </span>
        </div>
      )}
    </div>
  </div>
)

const Page = () => {
  // State for each input and unit
  const [roadLength, setRoadLength] = useState('');
  const [roadLengthUnit, setRoadLengthUnit] = useState('m');
  const [roadWidth, setRoadWidth] = useState('');
  const [roadWidthUnit, setRoadWidthUnit] = useState('m');
  const [roadDepth, setRoadDepth] = useState('');
  const [roadDepthUnit, setRoadDepthUnit] = useState('cm');
  const [roadArea, setRoadArea] = useState('');
  const [roadAreaUnit, setRoadAreaUnit] = useState('ac');
  const [roadBaseVolume, setRoadBaseVolume] = useState('');
  const [roadBaseVolumeUnit, setRoadBaseVolumeUnit] = useState('l');

  const [gravelDensity, setGravelDensity] = useState('');
  const [gravelDensityUnit, setGravelDensityUnit] = useState('kg_m3');
  const [gravelAmount, setGravelAmount] = useState('');
  const [gravelAmountUnit, setGravelAmountUnit] = useState('t');
  const [compression, setCompression] = useState('');
  const [amountWithCompression, setAmountWithCompression] = useState('');
  const [amountWithCompressionUnit, setAmountWithCompressionUnit] = useState('t');
  
  // Store pricePerTon in metric tons (base unit) and add display value for UI
  const [pricePerTonBase, setPricePerTonBase] = useState(''); // Always stored in metric tons
  const [pricePerTonDisplay, setPricePerTonDisplay] = useState(''); // Display value in selected unit
  const [pricePerTonUnit, setPricePerTonUnit] = useState('t');
  
  const [pricePerVolume, setPricePerVolume] = useState('');
  const [pricePerVolumeUnit, setPricePerVolumeUnit] = useState('m3');
  const [totalCost, setTotalCost] = useState('');
  const [totalCostUnit, setTotalCostUnit] = useState('PKR');

  // --- Calculation logic ---
  // Parse values as numbers, fallback to 0 if not valid
  const lengthNum = parseFloat(roadLength) || 0;
  const widthNum = parseFloat(roadWidth) || 0;
  const depthNum = parseFloat(roadDepth) || 0;
  const densityNum = parseFloat(gravelDensity) || 1430; // default 1430 kg/m³
  const compressionNum = parseFloat(compression) || 0;
  
  // Use pricePerTonBase (always in metric tons) for calculations
  const pricePerTonNum = parseFloat(pricePerTonBase) || 0;
  
  const pricePerVolumeNum = parseFloat(pricePerVolume) || 0;

  // Area calculation
  const computedArea = lengthNum && widthNum
    ? calcArea(lengthNum, widthNum, roadLengthUnit, roadWidthUnit, roadAreaUnit)
    : 0;
  // Volume calculation
  const computedVolume = computedArea && depthNum
    ? calcVolume(Number(computedArea), depthNum, roadAreaUnit, roadDepthUnit, roadBaseVolumeUnit)
    : 0;
  // Mass calculation
  const computedMass = computedVolume && densityNum
    ? calcMass(Number(computedVolume), densityNum, roadBaseVolumeUnit, gravelDensityUnit, gravelAmountUnit)
    : 0;
  // Mass with compression
  const computedMassWithCompression = computedMass
    ? calcMassWithCompression(Number(computedMass), compressionNum)
    : 0;
  // Mass with compression in selected unit
  const computedMassWithCompressionConverted = computedMassWithCompression
    ? convertMass(Number(computedMassWithCompression), gravelAmountUnit, amountWithCompressionUnit)
    : 0;
  // Cost calculation (by mass)
  const computedCostByMass = computedMassWithCompressionConverted && pricePerTonNum
    ? calcCostByMass(Number(computedMassWithCompressionConverted), pricePerTonNum, amountWithCompressionUnit, 't') // Always use 't' (metric tons) as price unit
    : 0;
  // Cost calculation (by volume)
  const computedCostByVolume = computedVolume && pricePerVolumeNum
    ? calcCostByVolume(Number(computedVolume), pricePerVolumeNum, roadBaseVolumeUnit, pricePerVolumeUnit)
    : 0;
  // Total cost (prefer cost by mass if pricePerTon is set, else by volume)
  const computedTotalCost = pricePerTonNum
    ? computedCostByMass
    : (pricePerVolumeNum ? computedCostByVolume : 0);

  // Calculate price per volume from price per ton (always treat pricePerTon as per metric ton)
  const computedPricePerVolumeFromTon =
    pricePerTonNum && gravelDensity && gravelDensityUnit && pricePerVolumeUnit
      ? calcPricePerVolumeFromTon(
          pricePerTonNum,
          densityNum,
          gravelDensityUnit,
          pricePerVolumeUnit
        )
      : 0;

  // Handle price per ton unit change - only convert display value
  const handlePricePerTonUnitChange = (newUnit: string) => {
    if (pricePerTonBase && !isNaN(parseFloat(pricePerTonBase))) {
      // Convert the base value (in metric tons) to the new display unit
      const baseValue = parseFloat(pricePerTonBase);
      const displayValue = convertMass(baseValue, 't', newUnit);
      setPricePerTonDisplay(displayValue > 0 ? String(Number(displayValue.toFixed(6))) : '');
    } else {
      setPricePerTonDisplay('');
    }
    setPricePerTonUnit(newUnit);
  };

  // Handle price per ton value change
  const handlePricePerTonChange = (value: string) => {
    setPricePerTonDisplay(value);
    
    if (value && !isNaN(parseFloat(value))) {
      // Convert the input value (in selected unit) to metric tons (base unit)
      const inputValue = parseFloat(value);
      if (inputValue < 0) return; // Don't update for negative values
      
      const baseValue = convertMass(inputValue, pricePerTonUnit, 't');
      setPricePerTonBase(baseValue > 0 ? String(Number(baseValue.toFixed(6))) : '');
    } else {
      setPricePerTonBase('');
    }
  };

  // Example: convert value on unit change for Road Length
  const handleRoadLengthUnitChange = (newUnit: string) => {
    if (roadLength) {
      const converted = convertLength(Number(roadLength), roadLengthUnit, newUnit);
      setRoadLength(converted ? String(Number(converted.toFixed(6))) : roadLength);
    }
    setRoadLengthUnit(newUnit);
  };

  const handleRoadWidthUnitChange = (newUnit: string) => {
    if (roadWidth) {
      const converted = convertLength(Number(roadWidth), roadWidthUnit, newUnit);
      setRoadWidth(converted ? String(Number(converted.toFixed(6))) : roadWidth);
    }
    setRoadWidthUnit(newUnit);
  };

  const handleRoadDepthUnitChange = (newUnit: string) => {
    if (roadDepth) {
      const converted = convertLength(Number(roadDepth), roadDepthUnit, newUnit);
      setRoadDepth(converted ? String(Number(converted.toFixed(6))) : roadDepth);
    }
    setRoadDepthUnit(newUnit);
  };

  const handleRoadAreaUnitChange = (newUnit: string) => {
    if (roadArea) {
      const converted = convertArea(Number(roadArea), roadAreaUnit, newUnit);
      setRoadArea(converted ? String(Number(converted.toFixed(6))) : roadArea);
    }
    setRoadAreaUnit(newUnit);
  };

  const handleRoadBaseVolumeUnitChange = (newUnit: string) => {
    if (roadBaseVolume) {
      const converted = convertVolume(Number(roadBaseVolume), roadBaseVolumeUnit, newUnit);
      setRoadBaseVolume(converted ? String(Number(converted.toFixed(6))) : roadBaseVolume);
    }
    setRoadBaseVolumeUnit(newUnit);
  };

  const handleGravelDensityUnitChange = (newUnit: string) => {
    if (gravelDensity) {
      const converted = convertDensity(Number(gravelDensity), gravelDensityUnit, newUnit);
      setGravelDensity(converted ? String(Number(converted.toFixed(6))) : gravelDensity);
    }
    setGravelDensityUnit(newUnit);
  };

  const handleGravelAmountUnitChange = (newUnit: string) => {
    if (gravelAmount) {
      const converted = convertMass(Number(gravelAmount), gravelAmountUnit, newUnit);
      setGravelAmount(converted ? String(Number(converted.toFixed(6))) : gravelAmount);
    }
    setGravelAmountUnit(newUnit);
  };

  const handleAmountWithCompressionUnitChange = (newUnit: string) => {
    if (amountWithCompression) {
      const converted = convertMass(Number(amountWithCompression), amountWithCompressionUnit, newUnit);
      setAmountWithCompression(converted ? String(Number(converted.toFixed(6))) : amountWithCompression);
    }
    setAmountWithCompressionUnit(newUnit);
  };

  const handlePricePerVolumeUnitChange = (newUnit: string) => {
    if (pricePerVolume) {
      const converted = convertVolume(Number(pricePerVolume), pricePerVolumeUnit, newUnit);
      setPricePerVolume(converted ? String(Number(converted.toFixed(6))) : pricePerVolume);
    }
    setPricePerVolumeUnit(newUnit);
  };

  // Clear all fields
  const handleClear = () => {
    setRoadLength(''); setRoadLengthUnit('m');
    setRoadWidth(''); setRoadWidthUnit('m');
    setRoadDepth(''); setRoadDepthUnit('cm');
    setRoadArea(''); setRoadAreaUnit('ac');
    setRoadBaseVolume(''); setRoadBaseVolumeUnit('l');
    setGravelDensity(''); setGravelDensityUnit('kg_m3');
    setGravelAmount(''); setGravelAmountUnit('t');
    setCompression('');
    setAmountWithCompression(''); setAmountWithCompressionUnit('t');
    
    // Reset price per ton fields
    setPricePerTonBase('');
    setPricePerTonDisplay('');
    setPricePerTonUnit('t');
    
    setPricePerVolume(''); setPricePerVolumeUnit('m3');
    setTotalCost(''); setTotalCostUnit('PKR');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">Road Base Calculator</h1>
        {/* Coverage Card */}
        <div className="bg-white rounded-xl shadow p-5 mb-6 border overflow-x-auto">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 font-semibold mr-2">▸</span>
            <span className="font-medium text-gray-800">Coverage</span>
          </div>
          <InputRow
            label="Road length"
            value={roadLength}
            onValueChange={setRoadLength}
            unit={roadLengthUnit}
            unitOptions={roadLengthUnitOptions}
            onUnitChange={handleRoadLengthUnitChange}
          />
          <InputRow
            label="Road width"
            value={roadWidth}
            onValueChange={setRoadWidth}
            unit={roadWidthUnit}
            unitOptions={roadLengthUnitOptions}
            onUnitChange={handleRoadWidthUnitChange}
          />
          <InputRow
            label="Road depth"
            value={roadDepth}
            onValueChange={setRoadDepth}
            unit={roadDepthUnit}
            unitOptions={roadDepthUnitOptions}
            onUnitChange={handleRoadDepthUnitChange}
          />
          <InputRow
            label="Road area"
            value={computedArea > 0 ? String(Number(computedArea.toFixed(6))) : ''}
            onValueChange={setRoadArea}
            unit={roadAreaUnit}
            unitOptions={roadAreaUnitOptions}
            onUnitChange={handleRoadAreaUnitChange}
          />
          <InputRow
            label="Road base volume"
            value={computedVolume > 0 ? String(Number(computedVolume.toFixed(6))) : ''}
            onValueChange={setRoadBaseVolume}
            unit={roadBaseVolumeUnit}
            unitOptions={roadBaseVolumeUnitOptions}
            onUnitChange={handleRoadBaseVolumeUnitChange}
            
          />
        </div>
        {/* Cost Card */}
        <div className="bg-white rounded-xl shadow p-5 mb-6 border overflow-x-auto">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 font-semibold mr-2">▸</span>
            <span className="font-medium text-gray-800">Cost</span>
          </div>
          <InputRow
            label="Gravel density"
            value={gravelDensity}
            onValueChange={setGravelDensity}
            unit={gravelDensityUnit}
            unitOptions={gravelDensityUnitOptions}
            onUnitChange={handleGravelDensityUnitChange}
          />
          <InputRow
            label="Estimated amount of gravel"
            value={computedMass > 0 ? String(Number(computedMass.toFixed(6))) : ''}
            onValueChange={setGravelAmount}
            unit={gravelAmountUnit}
            unitOptions={gravelAmountUnitOptions}
            onUnitChange={handleGravelAmountUnitChange}
            info="Calculated from volume and density"
          />
          <InputRow
            label="% compression"
            value={compression}
            onValueChange={setCompression}
            unit="%"
            unitOptions={['%']}
            onUnitChange={() => {}}
            info="Percentage of compaction"
          />
          <InputRow
            label="Amount + % compression"
            value={computedMassWithCompressionConverted > 0 ? String(Number(computedMassWithCompressionConverted.toFixed(6))) : ''}
            onValueChange={setAmountWithCompression}
            unit={amountWithCompressionUnit}
            unitOptions={gravelAmountUnitOptions}
            onUnitChange={handleAmountWithCompressionUnitChange}
            info="Total after compaction"
          />
          <InputRow
            label="Price per ton"
            value={pricePerTonDisplay}
            onValueChange={handlePricePerTonChange}
            unit={pricePerTonUnit}
            unitOptions={pricePerTonUnitOptions}
            onUnitChange={handlePricePerTonUnitChange}
          />
          <InputRow
            label="Price per volume"
            value={
              pricePerTonBase
                ? computedPricePerVolumeFromTon > 0
                  ? String(Number(computedPricePerVolumeFromTon.toFixed(6)))
                  : ''
                : pricePerVolume
            }
            onValueChange={setPricePerVolume}
            unit={pricePerVolumeUnit}
            unitOptions={pricePerVolumeUnitOptions}
            onUnitChange={handlePricePerVolumeUnitChange}
          />
          <InputRow
            label="Total cost"
            value={computedTotalCost > 0 ? String(Number(computedTotalCost.toFixed(2))) : ''}
            onValueChange={setTotalCost}
            unit={totalCostUnit}
            unitOptions={['PKR']}
            onUnitChange={setTotalCostUnit}
            info="Calculated total cost"
          />
        </div>
        <div className="mt-4">
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition"
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