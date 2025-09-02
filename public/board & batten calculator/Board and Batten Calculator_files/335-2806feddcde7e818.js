'use client'
import React, { useState, useEffect } from 'react'

// Strongly type all unit objects and keys
const areaUnits = {
  'mm²': 1e-6,
  'cm²': 1e-4,
  'm²': 1,
  'km²': 1e6,
  'in²': 0.00064516,
  'ft²': 0.092903,
  'yd²': 0.836127,
} as const;
type AreaUnit = keyof typeof areaUnits;

const depthUnits = {
  'mm': 0.001,
  'cm': 0.01,
  'm': 1,
  'in': 0.0254,
  'ft': 0.3048,
  'yd': 0.9144,
} as const;
type DepthUnit = keyof typeof depthUnits;

const volumeUnits = {
  'm³': 1,
  'ft³': 0.0283168,
  'yd³': 0.764555,
} as const;
type VolumeUnit = keyof typeof volumeUnits;

const densityUnits = {
  't/m³': 1000,
  'kg/m³': 1,
  'g/cm³': 1000,
  'lb/ft³': 16.0185,
  'lb/yd³': 0.593276,
} as const;
type DensityUnit = keyof typeof densityUnits;

const weightUnits = {
  'kg': 1,
  't': 1000,
  'lb': 0.453592,
  'st': 6.35029,
  'us_ton': 907.185,
  'uk_ton': 1016.05,
} as const;
type WeightUnit = keyof typeof weightUnits;

const d50Units = {
  'mm': 0.001,
  'cm': 0.01,
  'm': 1,
  'in': 0.0254,
  'ft': 0.3048,
} as const;
type D50Unit = keyof typeof d50Units;

const velocityUnits = {
  'm/s': 1,
  'km/h': 1/3.6,
  'ft/s': 0.3048,
  'yd/s': 0.9144,
  'mph': 0.44704,
  'ft/min': 0.00508,
} as const;
type VelocityUnit = keyof typeof velocityUnits;

const gravityUnits = {
  'm/s²': 1,
  'g': 9.80665,
  'ft/s²': 0.3048,
} as const;
type GravityUnit = keyof typeof gravityUnits;

// Conversion for price per weight
const priceWeightUnits = {
  kg: 1,
  t: 1000,
  lb: 0.453592,
  st: 6.35029,
  us_ton: 907.185,
  uk_ton: 1016.05,
} as const;
type PriceWeightUnit = keyof typeof priceWeightUnits;

const initialState = {
  find: 'd50',
  // Store base values in SI units
  area: '', areaUnit: 'm²' as AreaUnit, areaDisplay: '',
  depth: '', depthUnit: 'cm' as DepthUnit, depthDisplay: '',
  volume: '', volumeUnit: 'm³' as VolumeUnit, volumeDisplay: '',
  totalVolume: '', totalVolumeUnit: 'm³' as VolumeUnit, totalVolumeDisplay: '',
  density: '1600', densityUnit: 'kg/m³' as DensityUnit, densityDisplay: '1600', // Default to 1680 kg/m³
  weight: '', weightUnit: 't' as WeightUnit, weightDisplay: '',
  d50: '', d50Unit: 'cm' as D50Unit, d50Display: '',
  waterVelocity: '', waterVelocityUnit: 'm/s' as VelocityUnit, waterVelocityDisplay: '',
  gravity: '9.806', gravityUnit: 'm/s²' as GravityUnit, gravityDisplay: '9.806', // Default to Earth's gravity
  isbash: '0.86',
  specificGravity: '2.5', // Default specific gravity for rocks
  wastage: '5',
  unitPrice: '',
  unitPriceWeight: 'kg' as PriceWeightUnit,
  rockCost: '',
}

function convertToBase<T extends string>(
  value: string,
  from: T,
  units: Record<T, number>
): string {
  if (!value || isNaN(parseFloat(value))) return ''
  return (parseFloat(value) * units[from]).toString()
}

function convertFromBase<T extends string>(
  baseValue: string,
  to: T,
  units: Record<T, number>
): string {
  if (!baseValue || isNaN(parseFloat(baseValue))) return ''
  return (parseFloat(baseValue) / units[to]).toString()
}

// --- Add calculation helpers ---

// Isbash equation for D50 (in meters)
function calcD50({
  velocity, // m/s
  gravity,  // m/s²
  isbash,   // constant
  specificGravity // dimensionless
}: { velocity: number, gravity: number, isbash: number, specificGravity: number }): number | null {
  if (!velocity || !gravity || !isbash || !specificGravity || specificGravity <= 1) return null;
  const d50 = (velocity * velocity) / (2 * gravity * isbash * isbash * (specificGravity - 1));
  return d50; // meters
}

// Inverse Isbash: solve for velocity given D50
function calcVelocity({
  d50,      // m
  gravity,  // m/s²
  isbash,   // constant
  specificGravity // dimensionless
}: { d50: number, gravity: number, isbash: number, specificGravity: number }): number | null {
  if (!d50 || !gravity || !isbash || !specificGravity || specificGravity <= 1) return null;
  const v = Math.sqrt(2 * gravity * isbash * isbash * (specificGravity - 1) * d50);
  return v; // m/s
}

// Volume = area * depth (area in m², depth in m)
function calcVolume(area: number, depth: number): number | null {
  if (!area || !depth) return null;
  return area * depth;
}

// Add wastage (percent)
function addWastage(volume: number, wastage: number): number {
  if (!volume) return 0;
  return volume * (1 + (wastage ? wastage / 100 : 0));
}

// Weight = volume * density (volume in m³, density in kg/m³)
function calcWeight(volume: number, density: number): number | null {
  if (!volume || !density) return null;
  return volume * density;
}

// Calculate rock cost
function calcRockCost(weight: number, pricePerKg: number): number | null {
  if (!weight || !pricePerKg) return null;
  return weight * pricePerKg;
}

// --- End calculation helpers ---

const page = () => {
  const [state, setState] = useState(initialState)
  const [pricePerWeightBase, setPricePerWeightBase] = useState('')
  const [pricePerWeightDisplay, setPricePerWeightDisplay] = useState('')
  const [pricePerWeightUnit, setPricePerWeightUnit] = useState<PriceWeightUnit>('kg')

  // --- Validation state ---
  const [specificGravityError, setSpecificGravityError] = useState<string | null>(null);
  const [d50Error, setD50Error] = useState<string | null>(null);
  const [depthError, setDepthError] = useState<string | null>(null);
  const [areaError, setAreaError] = useState<string | null>(null);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  const [totalVolumeError, setTotalVolumeError] = useState<string | null>(null);
  const [densityError, setDensityError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [wastageError, setWastageError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  // --- Validation handlers ---
  useEffect(() => {
    // Area must be positive
    const area = parseFloat(state.areaDisplay || '');
    if (state.areaDisplay && state.areaDisplay.trim() !== '' && (isNaN(area) || area <= 0)) {
      setAreaError('Please input a positive value for the area that will be covered with rip rap.');
    } else {
      setAreaError(null);
    }
  }, [state.areaDisplay]);

  useEffect(() => {
    // Depth must be positive and at least twice D50
    const depthRaw = state.depthDisplay ?? '';
    const d50Raw = state.d50Display ?? '';
    const depth = parseFloat(depthRaw);
    const d50 = parseFloat(d50Raw);
    let error: string | null = null;

    // Only validate if user has entered something (not empty string)
    if (depthRaw.trim() !== '') {
      if (isNaN(depth) || depth <= 0) {
        error = 'Please input a positive value for the depth of the rip rap layer.';
      } else if (
        d50Raw.trim() !== '' &&
        !isNaN(d50)
      ) {
        const d50Meters = d50 * d50Units[state.d50Unit];
        const depthMeters = depth * depthUnits[state.depthUnit];
        if (depthMeters < d50Meters * 2) {
          error = 'Please enter a depth value of at least twice the recommended average rock diameter (D₅₀).';
        }
      }
    }
    setDepthError(error);
  }, [state.depthDisplay, state.depthUnit, state.d50Display, state.d50Unit]);

  useEffect(() => {
    // Volume must be positive
    const volume = parseFloat(state.volumeDisplay || '');
    if (state.volumeDisplay && state.volumeDisplay.trim() !== '' && (isNaN(volume) || volume <= 0)) {
      setVolumeError('Please input a positive value for the volume.');
    } else {
      setVolumeError(null);
    }
  }, [state.volumeDisplay]);

  useEffect(() => {
    // Total volume must be positive
    const totalVolume = parseFloat(state.totalVolumeDisplay || '');
    if (state.totalVolumeDisplay && state.totalVolumeDisplay.trim() !== '' && (isNaN(totalVolume) || totalVolume <= 0)) {
      setTotalVolumeError('Please input a positive value for the total volume.');
    } else {
      setTotalVolumeError(null);
    }
  }, [state.totalVolumeDisplay]);

  useEffect(() => {
    // Density must be positive
    const density = parseFloat(state.densityDisplay || '');
    if (state.densityDisplay && state.densityDisplay.trim() !== '' && (isNaN(density) || density <= 0)) {
      setDensityError('Please input a positive value for the density.');
    } else {
      setDensityError(null);
    }
  }, [state.densityDisplay]);

  useEffect(() => {
    // Weight must be positive
    const weight = parseFloat(state.weightDisplay || '');
    if (state.weightDisplay && state.weightDisplay.trim() !== '' && (isNaN(weight) || weight <= 0)) {
      setWeightError('Please input a positive value for the weight.');
    } else {
      setWeightError(null);
    }
  }, [state.weightDisplay]);

  useEffect(() => {
    // Wastage must be positive or zero
    const wastage = parseFloat(state.wastage || '');
    if (state.wastage && state.wastage.trim() !== '' && (isNaN(wastage) || wastage < 0)) {
      setWastageError('Please input a positive value or zero for wastage.');
    } else {
      setWastageError(null);
    }
  }, [state.wastage]);

  useEffect(() => {
    // Price per weight must be positive
    const price = parseFloat(pricePerWeightDisplay || '');
    if (pricePerWeightDisplay && pricePerWeightDisplay.trim() !== '' && (isNaN(price) || price <= 0)) {
      setPriceError('Please input a positive value for the price per weight.');
    } else {
      setPriceError(null);
    }
  }, [pricePerWeightDisplay]);

  useEffect(() => {
    // Specific gravity must be between 2.5 and 3.0 and positive
    const sg = parseFloat(state.specificGravity);
    if (state.specificGravity && state.specificGravity.trim() !== '' && (isNaN(sg) || sg <= 0)) {
      setSpecificGravityError('Please input a positive value for the specific gravity.');
    } else if (state.specificGravity && state.specificGravity.trim() !== '' && (sg < 2.5 || sg > 3.0)) {
      setSpecificGravityError('Please enter a specific gravity of rock ranging from 2.5 to 3.0.');
    } else {
      setSpecificGravityError(null);
    }
  }, [state.specificGravity]);

  useEffect(() => {
    // D50 must be at most half the rip rap depth and positive
    const d50 = parseFloat(state.d50Display || '');
    const depth = parseFloat(state.depthDisplay || '');
    let error = null;
    if (state.d50Display && state.d50Display.trim() !== '' && (isNaN(d50) || d50 <= 0)) {
      error = 'Please input a positive value for the average rock diameter (D₅₀).';
    } else if (
      state.d50Display && state.d50Display.trim() !== '' &&
      state.depthDisplay && state.depthDisplay.trim() !== '' &&
      !isNaN(d50) && !isNaN(depth)
    ) {
      const d50Meters = d50 * d50Units[state.d50Unit];
      const depthMeters = depth * depthUnits[state.depthUnit];
      if (d50Meters > depthMeters / 2) {
        error = 'The recommended average rock diameter must be at most half the rip rap depth.';
      }
    }
    setD50Error(error);
  }, [state.d50Display, state.d50Unit, state.depthDisplay, state.depthUnit]);

  // Area
  const handleAreaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const unit = state.areaUnit as AreaUnit
    const base = convertToBase(val, unit, areaUnits)
    setState(prev => ({
      ...prev,
      area: base,
      areaDisplay: val
    }))
  }
  const handleAreaUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as AreaUnit
    const display = convertFromBase(state.area, newUnit, areaUnits)
    setState(prev => ({
      ...prev,
      areaUnit: newUnit,
      areaDisplay: display
    }))
  }

  // Depth
  const handleDepthInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.depthUnit, depthUnits)
    setState(prev => ({
      ...prev,
      depth: base,
      depthDisplay: val
    }))
  }
  const handleDepthUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as DepthUnit
    const display = convertFromBase(state.depth, newUnit, depthUnits)
    setState(prev => ({
      ...prev,
      depthUnit: newUnit,
      depthDisplay: display
    }))
  }

  // Volume
  const handleVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.volumeUnit, volumeUnits)
    setState(prev => ({
      ...prev,
      volume: base,
      volumeDisplay: val
    }))
  }
  const handleVolumeUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as VolumeUnit
    const display = convertFromBase(state.volume, newUnit, volumeUnits)
    setState(prev => ({
      ...prev,
      volumeUnit: newUnit,
      volumeDisplay: display
    }))
  }

  // Total Volume
  const handleTotalVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.totalVolumeUnit, volumeUnits)
    setState(prev => ({
      ...prev,
      totalVolume: base,
      totalVolumeDisplay: val
    }))
  }
  const handleTotalVolumeUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as VolumeUnit
    const display = convertFromBase(state.totalVolume, newUnit, volumeUnits)
    setState(prev => ({
      ...prev,
      totalVolumeUnit: newUnit,
      totalVolumeDisplay: display
    }))
  }

  // Density
  const handleDensityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.densityUnit, densityUnits)
    setState(prev => ({
      ...prev,
      density: base,
      densityDisplay: val
    }))
  }
  const handleDensityUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as DensityUnit
    const display = convertFromBase(state.density, newUnit, densityUnits)
    setState(prev => ({
      ...prev,
      densityUnit: newUnit,
      densityDisplay: display
    }))
  }

  // Weight
  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.weightUnit, weightUnits)
    setState(prev => ({
      ...prev,
      weight: base,
      weightDisplay: val
    }))
  }
  const handleWeightUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as WeightUnit
    const display = convertFromBase(state.weight, newUnit, weightUnits)
    setState(prev => ({
      ...prev,
      weightUnit: newUnit,
      weightDisplay: display
    }))
  }

  // D50
  const handleD50Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.d50Unit, d50Units)
    setState(prev => ({
      ...prev,
      d50: base,
      d50Display: val
    }))
  }
  const handleD50Unit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as D50Unit
    const display = convertFromBase(state.d50, newUnit, d50Units)
    setState(prev => ({
      ...prev,
      d50Unit: newUnit,
      d50Display: display
    }))
  }

  // Water velocity
  const handleWaterVelocityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.waterVelocityUnit, velocityUnits)
    setState(prev => ({
      ...prev,
      waterVelocity: base,
      waterVelocityDisplay: val
    }))
  }
  const handleWaterVelocityUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as VelocityUnit
    const display = convertFromBase(state.waterVelocity, newUnit, velocityUnits)
    setState(prev => ({
      ...prev,
      waterVelocityUnit: newUnit,
      waterVelocityDisplay: display
    }))
  }

  // Gravity
  const handleGravityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const base = convertToBase(val, state.gravityUnit, gravityUnits)
    setState(prev => ({
      ...prev,
      gravity: base,
      gravityDisplay: val
    }))
  }
  const handleGravityUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as GravityUnit
    const display = convertFromBase(state.gravity, newUnit, gravityUnits)
    setState(prev => ({
      ...prev,
      gravityUnit: newUnit,
      gravityDisplay: display
    }))
  }

  // Other unchanged handlers
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const handleOtherInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleClear = () => setState(initialState)

  // Handler for price input
  const handlePricePerWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Store as base (per kg)
    if (!val) {
      setPricePerWeightBase('')
      setPricePerWeightDisplay('')
      return
    }
    const unit = pricePerWeightUnit as PriceWeightUnit
    const base = (parseFloat(val) / priceWeightUnits[unit]).toString()
    setPricePerWeightBase(base)
    setPricePerWeightDisplay(val)
  }

  // Handler for price unit dropdown
  const handlePricePerWeightUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as PriceWeightUnit
    setPricePerWeightUnit(newUnit)
    // Convert base to new unit for display
    if (!pricePerWeightBase) {
      setPricePerWeightDisplay('')
      return
    }
    const display = (parseFloat(pricePerWeightBase) * priceWeightUnits[newUnit]).toString()
    setPricePerWeightDisplay(display)
  }

  // --- Derived/calculated values ---

  // Convert inputs to base SI units for calculations
  const velocityBase = parseFloat(state.waterVelocity) || 0;
  const gravityBase = parseFloat(state.gravity) || 0;
  const d50Base = parseFloat(state.d50) || 0;
  const areaBase = parseFloat(state.area) || 0;
  const depthBase = parseFloat(state.depth) || 0;
  const volumeBase = parseFloat(state.volume) || 0;
  const densityBase = parseFloat(state.density) || 0;
  
  const isbash = parseFloat(state.isbash) || 0;
  const specificGravity = parseFloat(state.specificGravity) || 0;
  const wastage = parseFloat(state.wastage) || 0;
  // --- Calculation logic for UI ---

  // D50 calculation (if user wants to find D50)
  let calculatedD50: number | null = null;
  if (state.find === 'd50' || state.find === 'both') {
    if (velocityBase && gravityBase && isbash && specificGravity && !d50Base) {
      calculatedD50 = calcD50({ 
        velocity: velocityBase, 
        gravity: gravityBase, 
        isbash, 
        specificGravity 
      });
    }
  }

  // Velocity calculation (if user enters D50 and wants to find velocity)
  let calculatedVelocity: number | null = null;
  if (state.find === 'd50' || state.find === 'both') {
    if (d50Base && gravityBase && isbash && specificGravity && !velocityBase) {
      calculatedVelocity = calcVelocity({ 
        d50: d50Base, 
        gravity: gravityBase, 
        isbash, 
        specificGravity 
      });
    }
  }

  // Volume calculation (area * depth)
  let calculatedVolume: number | null = null;
  if ((state.find === 'volume' || state.find === 'both') && areaBase && depthBase && !volumeBase) {
    calculatedVolume = calcVolume(areaBase, depthBase);
  }

  // Total volume with wastage
  let calculatedTotalVolume: number | null = null;
  const workingVolume = calculatedVolume || volumeBase;
  if (workingVolume) {
    calculatedTotalVolume = addWastage(workingVolume, wastage);
  }

  // Weight calculation (volume * density)
  let calculatedWeight: number | null = null;
  if (calculatedTotalVolume && densityBase) {
    calculatedWeight = calcWeight(calculatedTotalVolume, densityBase);
  }

  // Cost calculation
  let calculatedCost: number | null = null;
  if (calculatedWeight && pricePerWeightBase) {
    calculatedCost = calcRockCost(calculatedWeight, parseFloat(pricePerWeightBase));
  }

  // Update rock cost when calculated
  useEffect(() => {
    if (calculatedCost !== null) {
      setState(prev => ({
        ...prev,
        rockCost: calculatedCost!.toFixed(2)
      }));
    }
  }, [calculatedCost]);

  // --- UI rendering (show calculated values in the correct fields) ---

  // For D50 field, show calculated value if available
  const d50DisplayValue = calculatedD50 !== null && !state.d50Display
    ? (calculatedD50 / d50Units[state.d50Unit]).toFixed(4)
    : state.d50Display || (state.d50 ? (parseFloat(state.d50) / d50Units[state.d50Unit]).toString() : '');

  // For velocity field, show calculated value if available
  const velocityDisplayValue = calculatedVelocity !== null && !state.waterVelocityDisplay
    ? (calculatedVelocity / velocityUnits[state.waterVelocityUnit]).toFixed(4)
    : state.waterVelocityDisplay || (state.waterVelocity ? (parseFloat(state.waterVelocity) / velocityUnits[state.waterVelocityUnit]).toString() : '');

  // For volume field, show calculated value if available
  const volumeDisplayValue = calculatedVolume !== null && !state.volumeDisplay
    ? (calculatedVolume / volumeUnits[state.volumeUnit]).toFixed(4)
    : state.volumeDisplay || (state.volume ? (parseFloat(state.volume) / volumeUnits[state.volumeUnit]).toString() : '');

  // For total volume field, show calculated value if available
  const totalVolumeDisplayValue = calculatedTotalVolume !== null
    ? (calculatedTotalVolume / volumeUnits[state.totalVolumeUnit]).toFixed(4)
    : state.totalVolumeDisplay || (state.totalVolume ? (parseFloat(state.totalVolume) / volumeUnits[state.totalVolumeUnit]).toString() : '');

  // For weight field, show calculated value if available
  const weightDisplayValue = calculatedWeight !== null
    ? (calculatedWeight / weightUnits[state.weightUnit]).toFixed(2)
    : state.weightDisplay || (state.weight ? (parseFloat(state.weight) / weightUnits[state.weightUnit]).toString() : '');

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Rip-Rap calculator</h1>
        {/* Find options */}
        <div className="mb-6 border rounded-lg p-4">
          <div className="font-semibold mb-2">I want to find the...</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="find"
                value="d50"
                checked={state.find === 'd50'}
                onChange={handleRadioChange}
              />
              average rock diameter (D<sub>50</sub>)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="find"
                value="volume"
                checked={state.find === 'volume'}
                onChange={handleRadioChange}
              />
              rip rap volume
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="find"
                value="both"
                checked={state.find === 'both'}
                onChange={handleRadioChange}
              />
              both D<sub>50</sub> and rip rap volume
            </label>
          </div>
        </div>
        {/* Show Rip rap specifications if find is 'd50' or 'both' */}
        {(state.find === 'd50' || state.find === 'both') && (
          <div className="mb-6 border rounded-lg p-4">
            <div className="font-semibold mb-4">Rip rap specifications</div>
            {/* Water velocity */}
            <div className="mb-4">
              <label className="flex items-center gap-1 mb-1">
                Water velocity (v)
                <span className="text-gray-400 cursor-pointer" title="The velocity of water in m/s or ft/s.">i</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="waterVelocity"
                  value={velocityDisplayValue}
                  onChange={handleWaterVelocityInput}
                  className="border rounded px-2 py-1 w-[75%]"
                  placeholder=""
                />
                <select
                  name="unitVelocity"
                  value={state.waterVelocityUnit}
                  onChange={handleWaterVelocityUnit}
                  className="border rounded px-2 py-1 w-[25%]"
                >
                  <option value="m/s">meters per second (m/s)</option>
                  <option value="km/h">kilometers per hour (km/h)</option>
                  <option value="ft/s">feet per second (ft/s)</option>
                  <option value="yd/s">yards per second (yd/s)</option>
                  <option value="mph">miles per hour (mph)</option>
                  <option value="ft/min">feet per minute (ft/min)</option>
                </select>
              </div>
            </div>
            {/* Isbash constant */}
            <div className="mb-4">
              <label className="block mb-1">Isbash constant (C)</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isbash"
                    value="0.86"
                    checked={state.isbash === '0.86'}
                    onChange={handleRadioChange}
                  />
                  Highly turbulent (0.86)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isbash"
                    value="1.2"
                    checked={state.isbash === '1.2'}
                    onChange={handleRadioChange}
                  />
                  Low turbulence (1.2)
                </label>
              </div>
            </div>
            {/* Gravitational acceleration */}
            <div className="mb-4">
              <label className="block mb-1">Gravitational acceleration (g)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="gravity"
                  value={state.gravityDisplay || convertFromBase(state.gravity, state.gravityUnit, gravityUnits)}
                  onChange={handleGravityInput}
                  className="border rounded px-2 py-1 w-[75%]"
                />
                <select
                  name="unitGravity"
                  value={state.gravityUnit}
                  onChange={handleGravityUnit}
                  className="border rounded px-2 py-1 w-[25%]"
                >
                  <option value="m/s²">meters per second squared (m/s²)</option>
                  <option value="g">gravitational acc. on Earth (g)</option>
                  <option value="ft/s²">feet per second squared (ft/s²)</option>
                </select>
              </div>
            </div>
            {/* Specific gravity */}
            <div className="mb-4">
              <label className="flex items-center gap-1 mb-1">
                Specific gravity (S)
                <span className="text-gray-400 cursor-pointer" title="The ratio of the density of the rock to the density of water.">i</span>
              </label>
              <input
                type="number"
                name="specificGravity"
                value={state.specificGravity}
                onChange={handleOtherInput}
                className={`border rounded px-2 py-1 w-full ${specificGravityError ? 'border-red-500' : ''}`}
              />
              {specificGravityError && (
                <div className="text-red-500 text-xs mt-1">{specificGravityError}</div>
              )}
            </div>
            {/* Average rock diameter */}
            <div>
              <label className="block mb-1">
                Average rock diameter (D<sub>50</sub>)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="d50"
                  value={d50DisplayValue}
                  onChange={handleD50Input}
                  className={`border rounded px-2 py-1 w-[75%] ${d50Error ? 'border-red-500' : ''}`}
                />
                <select
                  name="unitD50"
                  value={state.d50Unit}
                  onChange={handleD50Unit}
                  className="border rounded px-2 py-1 w-[25%]"
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="m">meters (m)</option>
                  <option value="in">inches (in)</option>
                  <option value="ft">feet (ft)</option>
                </select>
              </div>
              {d50Error && (
                <div className="text-red-500 text-xs mt-1">{d50Error}</div>
              )}
            </div>
          </div>
        )}
        {/* Show Rip rap volume and weight + cost if find is 'volume' or 'both' */}
        {(state.find === 'volume' || state.find === 'both') && (
          <>
            {/* Rip rap volume and weight */}
            <div className="mb-6 border rounded-lg p-4">
              <div className="font-semibold mb-4">Rip rap volume and weight</div>
              {/* Area */}
              <div className="mb-4">
                <label className="flex items-center gap-1 mb-1">
                  Area
                  <span className="text-gray-400 cursor-pointer" title="Surface area to be covered.">i</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="area"
                    value={state.areaDisplay || convertFromBase(state.area, state.areaUnit, areaUnits)}
                    onChange={handleAreaInput}
                    className={`border rounded px-2 py-1 w-[75%] ${areaError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitArea"
                    value={state.areaUnit}
                    onChange={handleAreaUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="mm²">square millimeters (mm²)</option>
                    <option value="cm²">square centimeters (cm²)</option>
                    <option value="m²">square meters (m²)</option>
                    <option value="km²">square kilometers (km²)</option>
                    <option value="in²">square inches (in²)</option>
                    <option value="ft²">square feet (ft²)</option>
                    <option value="yd²">square yards (yd²)</option>
                  </select>
                </div>
                {areaError && (
                  <div className="text-red-500 text-xs mt-1">{areaError}</div>
                )}
              </div>
              {/* Depth */}
              <div className="mb-4">
                <label className="flex items-center gap-1 mb-1">
                  Depth
                  <span className="text-gray-400 cursor-pointer" title="Thickness of the rip rap layer.">i</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="depth"
                    value={state.depthDisplay || convertFromBase(state.depth, state.depthUnit, depthUnits)}
                    onChange={handleDepthInput}
                    className={`border rounded px-2 py-1 w-[75%] ${depthError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitDepth"
                    value={state.depthUnit}
                    onChange={handleDepthUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="mm">millimeters (mm)</option>
                    <option value="cm">centimeters (cm)</option>
                    <option value="m">meters (m)</option>
                    <option value="in">inches (in)</option>
                    <option value="ft">feet (ft)</option>
                    <option value="yd">yards (yd)</option>
                  </select>
                </div>
                {depthError && (
                  <div className="text-red-500 text-xs mt-1">{depthError}</div>
                )}
              </div>
              {/* Volume */}
              <div className="mb-4">
                <label className="block mb-1">Volume</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="volume"
                    value={volumeDisplayValue}
                    onChange={handleVolumeInput}
                    className={`border rounded px-2 py-1 w-[75%] ${volumeError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitVolume"
                    value={state.volumeUnit}
                    onChange={handleVolumeUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="m³">cubic meters (m³)</option>
                    <option value="ft³">cubic feet (cu ft)</option>
                    <option value="yd³">cubic yards (cu yd)</option>
                  </select>
                </div>
                {volumeError && (
                  <div className="text-red-500 text-xs mt-1">{volumeError}</div>
                )}
              </div>
              {/* Wastage */}
              <div className="mb-4">
                <label className="flex items-center gap-1 mb-1">
                  Wastage
                  <span className="text-gray-400 cursor-pointer" title="Percentage of extra material for wastage.">i</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="wastage"
                    value={state.wastage || '5'}
                    onChange={handleOtherInput}
                    className={`border rounded px-2 py-1 w-full ${wastageError ? 'border-red-500' : ''}`}
                  />
                  <span className="self-center">%</span>
                </div>
                {wastageError && (
                  <div className="text-red-500 text-xs mt-1">{wastageError}</div>
                )}
              </div>
              {/* Total volume */}
              <div className="mb-4">
                <label className="block mb-1">Total volume</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="totalVolume"
                    value={totalVolumeDisplayValue}
                    onChange={handleTotalVolumeInput}
                    className={`border rounded px-2 py-1 w-[75%] ${totalVolumeError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitTotalVolume"
                    value={state.totalVolumeUnit}
                    onChange={handleTotalVolumeUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="m³">cubic meters (m³)</option>
                    <option value="ft³">cubic feet (cu ft)</option>
                    <option value="yd³">cubic yards (cu yd)</option>
                  </select>
                </div>
                {totalVolumeError && (
                  <div className="text-red-500 text-xs mt-1">{totalVolumeError}</div>
                )}
              </div>
              {/* Density */}
              <div className="mb-4">
                <label className="block mb-1">Density</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="density"
                    value={state.densityDisplay || convertFromBase(state.density, state.densityUnit, densityUnits)}
                    onChange={handleDensityInput}
                    className={`border rounded px-2 py-1 w-[75%] ${densityError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitDensity"
                    value={state.densityUnit}
                    onChange={handleDensityUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="t/m³">tons per cubic meter (t/m³)</option>
                    <option value="kg/m³">kilograms per cubic meter (kg/m³)</option>
                    <option value="g/cm³">grams per cubic centimeter (g/cm³)</option>
                    <option value="lb/ft³">pounds per cubic feet (lb/cu ft)</option>
                    <option value="lb/yd³">pounds per cubic yard (lb/cu yd)</option>
                  </select>
                </div>
                {densityError && (
                  <div className="text-red-500 text-xs mt-1">{densityError}</div>
                )}
              </div>
              {/* Weight */}
              <div>
                <label className="block mb-1">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="weight"
                    value={weightDisplayValue}
                    onChange={handleWeightInput}
                    className={`border rounded px-2 py-1 w-[75%] ${weightError ? 'border-red-500' : ''}`}
                  />
                  <select
                    name="unitWeight"
                    value={state.weightUnit}
                    onChange={handleWeightUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="kg">kilograms (kg)</option>
                    <option value="t">metric tons (t)</option>
                    <option value="lb">pounds (lb)</option>
                    <option value="st">stones (st)</option>
                    <option value="us_ton">US short tons (US ton)</option>
                    <option value="uk_ton">imperial tons (long ton)</option>
                  </select>
                </div>
                {weightError && (
                  <div className="text-red-500 text-xs mt-1">{weightError}</div>
                )}
              </div>
            </div>
            {/* Rip rap cost */}
            <div className="mb-6 border rounded-lg p-4">
              <div className="font-semibold mb-4">Rip rap cost</div>
              {/* Price per weight */}
              <div className="mb-4">
                <label className="block mb-1">Price per weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="unitPrice"
                    value={pricePerWeightDisplay}
                    onChange={handlePricePerWeightInput}
                    className={`border rounded px-2 py-1 w-[75%] ${priceError ? 'border-red-500' : ''}`}
                    placeholder="Enter price"
                  />
                  <span className="self-center w-auto">PKR</span>
                  <span className="self-center w-auto">/</span>
                  <select
                    name="unitPriceWeight"
                    value={pricePerWeightUnit}
                    onChange={handlePricePerWeightUnit}
                    className="border rounded px-2 py-1 w-[25%]"
                  >
                    <option value="kg">kilogram (kg)</option>
                    <option value="t">metric ton (t)</option>
                    <option value="lb">pound (lb)</option>
                    <option value="st">stone (st)</option>
                    <option value="us_ton">US short ton (US ton)</option>
                    <option value="uk_ton">imperial ton (long ton)</option>
                  </select>
                </div>
                {priceError && (
                  <div className="text-red-500 text-xs mt-1">{priceError}</div>
                )}
              </div>
              {/* Rip rap rock cost */}
              <div>
                <label className="block mb-1">Rip rap rock cost</label>
                <input
                  type="number"
                  name="rockCost"
                  value={state.rockCost || ''}
                  onChange={handleOtherInput}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
          </>
        )}
        {/* Clear button */}
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded mt-2"
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default page
