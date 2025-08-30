'use client'
import React, { useState, useEffect } from 'react'

interface MaterialUnitWeight {
  value: string;
  unit: string;
}

interface Option {
  label: string;
  value: string;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  unitOptions: Option[] | null;
  onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  info?: string;
  disabled?: boolean;
  error?: string;
}

interface State {
  material: string;
  unitWeight: string;
  unitWeightUnit: string;
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  area: string;
  areaUnit: string;
  depth: string;
  depthUnit: string;
  volume: string;
  volumeUnit: string;
  tonnage: string;
  tonnageUnit: string;
  wastage: string;
  weightNeeded: string;
  weightNeededUnit: string;
  price: string;
  priceUnit: string;
  pricePerWeightUnit: string;
  basePricePerKg: number; // Store the actual price per kg for calculation
  totalCost: string;
  // Flags to track if user manually entered values
  isManualArea: boolean;
  isManualVolume: boolean;
  isManualTonnage: boolean;
  isManualWeightNeeded: boolean;
  isManualTotalCost: boolean;
}

// Expanded material options
const materialOptions: Option[] = [
  { label: 'Aggregate base course', value: 'aggregate_base_course' },
  { label: 'Anti-skid type 3 (1/4")', value: 'anti_skid_type_3' },
  { label: 'Barn dry', value: 'barn_dry' },
  { label: 'Concrete sand (C-33 Spec)', value: 'concrete_sand_c33' },
  { label: 'Crushed asphalt', value: 'crushed_asphalt' },
  { label: 'Crushed concrete (fines – 1.5")', value: 'crushed_concrete_fines' },
  { label: 'Crushed concrete compacted (Fines – 1.5")', value: 'crushed_concrete_compacted_fines' },
  { label: 'Crushed granite', value: 'crushed_granite' },
  { label: 'Crushed stone', value: 'crushed_stone' },
  { label: 'DEP manufactured sand', value: 'dep_manufactured_sand' },
  { label: 'DEP manufactured sand compacted', value: 'dep_manufactured_sand_compacted' },
  { label: 'Feed cal', value: 'feed_cal' },
  { label: 'Free access sand', value: 'free_access_sand' },
  { label: 'Granite', value: 'granite' },
  { label: 'Gravel', value: 'gravel' },
  { label: 'Mason sand/play Sand', value: 'mason_sand_play_sand' },
  { label: 'Pea gravel', value: 'pea_gravel' },
  { label: 'River rock', value: 'river_rock' },
  { label: 'Sand', value: 'sand' },
  { label: 'Screenings', value: 'screenings' },
  { label: 'Washed gravel', value: 'washed_gravel' },
  { label: 'Enter a custom unit weight', value: 'custom' },
]

const unitWeightOptions: Option[] = [
  { label: "tons per cubic meter(t/m³)", value: "t/m³" },
  { label: "kilograms per cubic meter(kg/m³)", value: "kg/m³" },
  { label: "grams per cubic centimeter(g/cm³)", value: "g/cm³" },
  { label: "pounds per cubic inch(lb/cu in)", value: "lb/cu in" },
  { label: "pounds per cubic feet(lb/cu ft)", value: "lb/cu ft" },
  { label: "pounds per cubic yard(lb/cu yd)", value: "lb/cu yd" },
];

const lengthUnitOptions: Option[] = [
  { label: "centimeters(cm)", value: "cm" },
  { label: "meters(m)", value: "m" },
  { label: "kilometers(km)", value: "km" },
  { label: "inches(in)", value: "in" },
  { label: "feet(ft)", value: "ft" },
  { label: "yards(yd)", value: "yd" },
  { label: "miles(mi)", value: "mi" },
];

const widthUnitOptions: Option[] = lengthUnitOptions;
const depthUnitOptions: Option[] = lengthUnitOptions;

const areaUnitOptions: Option[] = [
  { label: "square centimeters(cm²)", value: "cm²" },
  { label: "square meters(m²)", value: "m²" },
  { label: "square kilometers(km²)", value: "km²" },
  { label: "square inches(in²)", value: "in²" },
  { label: "square feet(ft²)", value: "ft²" },
  { label: "square yards(yd²)", value: "yd²" },
  { label: "square miles(mi²)", value: "mi²" },
];

const volumeUnitOptions: Option[] = [
  { label: "cubic centimeters(cm³)", value: "cm³" },
  { label: "cubic meters(m³)", value: "m³" },
  { label: "cubic inches(in³)", value: "in³" },
  { label: "cubic feet(ft³)", value: "ft³" },
  { label: "cubic yards(yd³)", value: "yd³" },
];

const tonnageUnitOptions: Option[] = [
  { label: "kilograms(kg)", value: "kg" },
  { label: "metric tons(t)", value: "t" },
  { label: "pounds(lb)", value: "lb" },
  { label: "stones(st)", value: "st" },
  { label: "US short tons(US ton)", value: "US ton" },
  { label: "imperial tons(long ton)", value: "long ton" },
];

const priceUnitOptions: Option[] = [
  { label: 'PKR', value: 'PKR' }
]
const pricePerWeightUnitOptions: Option[] = tonnageUnitOptions

// Material unit weights mapping
const materialUnitWeights: { [key: string]: MaterialUnitWeight } = {
  aggregate_base_course: { value: '2242.6', unit: 'kg/m³' },
  anti_skid_type_3: { value: '1466.3', unit: 'kg/m³' },
  barn_dry: { value: '1710.3', unit: 'kg/m³' },
  concrete_sand_c33: { value: '1625.2', unit: 'kg/m³' },
  crushed_asphalt: { value: '720.8', unit: 'kg/m³' },
  crushed_concrete_fines: { value: '1553.8', unit: 'kg/m³' },
  crushed_concrete_compacted_fines: { value: '1871.7', unit: 'kg/m³' },
  crushed_granite: { value: '1320', unit: 'kg/m³' },
  crushed_stone: { value: '1602', unit: 'kg/m³' },
  dep_manufactured_sand: { value: '1476.1', unit: 'kg/m³' },
  dep_manufactured_sand_compacted: { value: '1719.8', unit: 'kg/m³' },
  feed_cal: { value: '1710.3', unit: 'kg/m³' },
  free_access_sand: { value: '1642', unit: 'kg/m³' },
  granite: { value: '2643', unit: 'kg/m³' },
  gravel: { value: '1481.7', unit: 'kg/m³' },
  mason_sand_play_sand: { value: '1398.3', unit: 'kg/m³' },
  pea_gravel: { value: '1787.7', unit: 'kg/m³' },
  river_rock: { value: '1425.6', unit: 'kg/m³' },
  sand: { value: '1602', unit: 'kg/m³' },
  screenings: { value: '1762', unit: 'kg/m³' },
  washed_gravel: { value: '1682', unit: 'kg/m³' },
  custom: { value: '', unit: 'kg/m³' },
};

const initialState: State = {
  material: 'crushed_concrete_fines',
  unitWeight: '1553.8',
  unitWeightUnit: 'kg/m³',
  length: '',
  lengthUnit: 'm',
  width: '',
  widthUnit: 'm',
  area: '',
  areaUnit: 'm²',
  depth: '',
  depthUnit: 'cm',
  volume: '',
  volumeUnit: 'm³',
  tonnage: '',
  tonnageUnit: 't',
  wastage: '5',
  weightNeeded: '',
  weightNeededUnit: 't',
  price: '',
  priceUnit: 'PKR',
  pricePerWeightUnit: 't',
  totalCost: '',
  basePricePerKg: 0, // Initialize base price
  isManualArea: false,
  isManualVolume: false,
  isManualTonnage: false,
  isManualWeightNeeded: false,
  isManualTotalCost: false,
};

// Conversion functions
const convertToBaseUnit = (value: string, fromUnit: string, type: 'length' | 'area' | 'volume' | 'unitWeight' | 'weight'): number => {
  if (!value || value.trim() === '' || isNaN(Number(value))) return 0;
  const num = parseFloat(value);
  
  const conversions: Record<string, Record<string, number>> = {
    length: {
      cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    },
    area: {
      'cm²': 0.0001, 'm²': 1, 'km²': 1000000, 'in²': 0.00064516, 'ft²': 0.09290304, 'yd²': 0.83612736, 'mi²': 2590000
    },
    volume: {
      'cm³': 0.000001, 'm³': 1, 'in³': 0.000016387064, 'ft³': 0.0283168466, 'yd³': 0.764554858
    },
    unitWeight: {
      't/m³': 1000, 'kg/m³': 1, 'g/cm³': 1000, 'lb/cu in': 27679.9047, 'lb/cu ft': 16.0184634, 'lb/cu yd': 0.593276421
    },
    weight: {
      kg: 1, t: 1000, lb: 0.45359237, st: 6.35029318, 'US ton': 907.18474, 'long ton': 1016.0469088
    }
  };
  
  const factor = conversions[type]?.[fromUnit] || 1;
  return num * factor;
};

const convertFromBaseUnit = (value: number, toUnit: string, type: 'length' | 'area' | 'volume' | 'unitWeight' | 'weight'): string => {
  if (value === 0 || isNaN(value)) return '';
  
  const conversions: Record<string, Record<string, number>> = {
    length: {
      cm: 100, m: 1, km: 0.001, in: 39.3700787, ft: 3.2808399, yd: 1.0936133, mi: 0.000621371
    },
    area: {
      'cm²': 10000, 'm²': 1, 'km²': 0.000001, 'in²': 1550.0031, 'ft²': 10.7639104, 'yd²': 1.19599005, 'mi²': 0.000000386
    },
    volume: {
      'cm³': 1000000, 'm³': 1, 'in³': 61023.7441, 'ft³': 35.3146667, 'yd³': 1.30795062
    },
    unitWeight: {
      't/m³': 0.001, 'kg/m³': 1, 'g/cm³': 0.001, 'lb/cu in': 0.0000361273, 'lb/cu ft': 0.0624279606, 'lb/cu yd': 1.686
    },
    weight: {
      kg: 1, t: 0.001, lb: 2.20462262, st: 0.157473044, 'US ton': 0.00110231131, 'long ton': 0.000984206528
    }
  };
  
  const factor = conversions[type]?.[toUnit] || 1;
  const result = value * factor;
  
  // Format the result to avoid scientific notation and excessive decimals
  if (result < 0.01) {
    return result.toExponential(3);
  } else if (result < 1) {
    return result.toFixed(4).replace(/\.?0+$/, '');
  } else if (result < 1000) {
    return result.toFixed(3).replace(/\.?0+$/, '');
  } else {
    return result.toFixed(2).replace(/\.?0+$/, '');
  }
};

// Validation function for positive numbers
const getPositiveNumberError = (value: string, label: string) => {
  if (value === '') return '';
  if (isNaN(Number(value)) || Number(value) <= 0) {
    return `Please enter a positive value for the ${label.toLowerCase()}.`;
  }
  return '';
};

// Field component
const Field: React.FC<FieldProps> = ({
  label, value, onChange, unit, unitOptions, onUnitChange, placeholder = '', info, disabled = false, error
}) => (
  <div className="mb-4 w-full">
    <div className="flex items-center mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {info && (
        <span
          className="ml-1 text-gray-400 cursor-pointer"
          title={typeof info === 'string' ? info : ''}
          tabIndex={-1}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="8"/>
          </svg>
        </span>
      )}
    </div>
    <div className="flex w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-w-0 ${disabled ? 'bg-gray-100 text-gray-400' : ''}`}
        disabled={disabled}
        style={{ borderTopRightRadius: unitOptions ? 0 : '0.5rem', borderBottomRightRadius: unitOptions ? 0 : '0.5rem' }}
      />
      {unitOptions && (
        <select
          value={unit}
          onChange={onUnitChange}
          className="w-32 min-w-[6rem] px-2 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-white text-base"
          disabled={disabled}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {unitOptions.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      )}
    </div>
    {error && (
      <div className="text-red-500 text-sm mt-1 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="8"/>
        </svg>
        {error}
      </div>
    )}
  </div>
)

const TonnageCalculator: React.FC = () => {
  const [state, setState] = useState<State>(initialState);

  // Main calculation effect
  useEffect(() => {
    const calculate = () => {
      try {
        const newState = { ...state };

        // Get unit weight in base unit (kg/m³)
        const unitWeightBase = convertToBaseUnit(state.unitWeight, state.unitWeightUnit, 'unitWeight');
        
        // Step 1: Calculate Area (Length × Width)
        if (!state.isManualArea) {
          const lengthBase = convertToBaseUnit(state.length, state.lengthUnit, 'length');
          const widthBase = convertToBaseUnit(state.width, state.widthUnit, 'length');
          
          if (lengthBase > 0 && widthBase > 0) {
            const areaBase = lengthBase * widthBase; // Area in m²
            newState.area = convertFromBaseUnit(areaBase, state.areaUnit, 'area');
          } else {
            newState.area = '';
          }
        }

        // Step 2: Calculate Volume (Area × Depth)
        if (!state.isManualVolume) {
          const areaBase = convertToBaseUnit(newState.area || state.area, state.areaUnit, 'area');
          const depthBase = convertToBaseUnit(state.depth, state.depthUnit, 'length');
          
          if (areaBase > 0 && depthBase > 0) {
            const volumeBase = areaBase * depthBase; // Volume in m³
            newState.volume = convertFromBaseUnit(volumeBase, state.volumeUnit, 'volume');
          } else {
            newState.volume = '';
          }
        }

        // Step 3: Calculate Tonnage (Volume × Unit Weight)
        if (!state.isManualTonnage) {
          const volumeBase = convertToBaseUnit(newState.volume || state.volume, state.volumeUnit, 'volume');
          
          if (volumeBase > 0 && unitWeightBase > 0) {
            const tonnageKg = volumeBase * unitWeightBase; // Weight in kg
            newState.tonnage = convertFromBaseUnit(tonnageKg, state.tonnageUnit, 'weight');
          } else {
            newState.tonnage = '';
          }
        }

        // Step 4: Calculate Weight Needed (Tonnage + Wastage)
        if (!state.isManualWeightNeeded) {
          const tonnageBase = convertToBaseUnit(newState.tonnage || state.tonnage, state.tonnageUnit, 'weight');
          const wastagePercent = parseFloat(state.wastage) || 0;
          
          if (tonnageBase > 0) {
            const weightNeededKg = tonnageBase * (1 + wastagePercent / 100);
            newState.weightNeeded = convertFromBaseUnit(weightNeededKg, state.weightNeededUnit, 'weight');
          } else {
            newState.weightNeeded = '';
          }
        }

        // Step 5: Calculate Total Cost (Weight Needed × Base Price per kg)
        if (!state.isManualTotalCost) {
          const weightNeededBase = convertToBaseUnit(newState.weightNeeded || state.weightNeeded, state.weightNeededUnit, 'weight');
          
          if (weightNeededBase > 0 && state.basePricePerKg > 0) {
            const totalCost = weightNeededBase * state.basePricePerKg;
            newState.totalCost = totalCost.toFixed(2);
          } else {
            newState.totalCost = '';
          }
        }

        setState(newState);

      } catch (error) {
        console.error('Calculation error:', error);
      }
    };

    calculate();
  }, [
    state.unitWeight, state.unitWeightUnit,
    state.length, state.lengthUnit,
    state.width, state.widthUnit, 
    state.depth, state.depthUnit,
    state.wastage, state.price, state.pricePerWeightUnit, state.basePricePerKg,
    state.areaUnit, state.volumeUnit, state.tonnageUnit, state.weightNeededUnit,
    state.isManualArea, state.isManualVolume, state.isManualTonnage, state.isManualWeightNeeded, state.isManualTotalCost
  ]);

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const material = e.target.value;
    const unitWeightData = materialUnitWeights[material];
    
    setState(prev => ({
      ...prev,
      material,
      unitWeight: unitWeightData?.value || '',
      unitWeightUnit: unitWeightData?.unit || 'kg/m³',
    }));
  };

  const handleFieldChange = (field: keyof State, isManualFlag?: keyof State) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({
      ...prev,
      [field]: value,
      ...(isManualFlag && { [isManualFlag]: value.trim() !== '' })
    }));
  };

  const handleUnitChange = (unitField: keyof State, valueField: keyof State, type: 'length' | 'area' | 'volume' | 'unitWeight' | 'weight') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = state[valueField] as string;
    const currentUnit = state[unitField] as string;
    
    let convertedValue = currentValue;
    
    if (currentValue && currentValue.trim() !== '' && !isNaN(Number(currentValue))) {
      const baseValue = convertToBaseUnit(currentValue, currentUnit, type);
      convertedValue = convertFromBaseUnit(baseValue, newUnit, type);
    }
    
    setState(prev => ({
      ...prev,
      [unitField]: newUnit,
      [valueField]: convertedValue,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const priceValue = parseFloat(value) || 0;
    
    // Calculate base price per kg for consistent calculation
    let basePricePerKg = 0;
    if (priceValue > 0) {
      const pricePerWeightUnitInKg = convertToBaseUnit('1', state.pricePerWeightUnit, 'weight');
      basePricePerKg = priceValue / pricePerWeightUnitInKg;
    }
    
    setState(prev => ({
      ...prev,
      price: value,
      basePricePerKg: basePricePerKg,
    }));
  };

  const handlePricePerWeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentPrice = state.price;
    const currentUnit = state.pricePerWeightUnit;
    
    let convertedPrice = currentPrice;
    
    // Convert the price value when unit changes (for display only)
    if (currentPrice && currentPrice.trim() !== '' && !isNaN(Number(currentPrice))) {
      const currentUnitWeightInKg = convertToBaseUnit('1', currentUnit, 'weight');
      const newUnitWeightInKg = convertToBaseUnit('1', newUnit, 'weight');
      
      // Convert price: price per old unit * (old unit in kg) / (new unit in kg) = price per new unit
      const priceValue = parseFloat(currentPrice);
      convertedPrice = ((priceValue * currentUnitWeightInKg) / newUnitWeightInKg).toFixed(2);
    }
    
    setState(prev => ({
      ...prev,
      price: convertedPrice,
      pricePerWeightUnit: newUnit,
      // basePricePerKg stays the same - this is the key fix!
    }));
  };

  const handleClear = () => {
    setState(initialState);
  };

  // Validation errors for each field
  const errors = {
    unitWeight: getPositiveNumberError(state.unitWeight, 'unit weight'),
    length: getPositiveNumberError(state.length, 'length'),
    width: getPositiveNumberError(state.width, 'width'),
    area: getPositiveNumberError(state.area, 'area'),
    depth: getPositiveNumberError(state.depth, 'depth'),
    volume: getPositiveNumberError(state.volume, 'volume'),
    tonnage: getPositiveNumberError(state.tonnage, 'tonnage'),
    wastage: getPositiveNumberError(state.wastage, 'wastage'),
    weightNeeded: getPositiveNumberError(state.weightNeeded, 'weight needed'),
    price: getPositiveNumberError(state.price, 'price per unit of weight'),
    totalCost: getPositiveNumberError(state.totalCost, 'total cost'),
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-b from-slate-50 to-indigo-50">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 tracking-tight">Tonnage Calculator</h1>
      <div className="w-full max-w-lg space-y-8">
        {/* Material */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border w-full">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-gray-700 text-lg">Material</span>
          </div>
          <select
            value={state.material}
            onChange={handleMaterialChange}
            className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg bg-white text-base"
          >
            {materialOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Field
            label="Unit weight"
            value={state.unitWeight}
            onChange={handleFieldChange('unitWeight')}
            unit={state.unitWeightUnit}
            unitOptions={unitWeightOptions}
            onUnitChange={handleUnitChange('unitWeightUnit', 'unitWeight', 'unitWeight')}
            placeholder=""
            error={errors.unitWeight}
          />
        </div>

        {/* Material requirements */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border w-full">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-gray-700 text-lg">Material requirements</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Field
              label="Length"
              value={state.length}
              onChange={handleFieldChange('length')}
              unit={state.lengthUnit}
              unitOptions={lengthUnitOptions}
              onUnitChange={handleUnitChange('lengthUnit', 'length', 'length')}
              info="Length of the area"
              error={errors.length}
            />
            <Field
              label="Width"
              value={state.width}
              onChange={handleFieldChange('width')}
              unit={state.widthUnit}
              unitOptions={widthUnitOptions}
              onUnitChange={handleUnitChange('widthUnit', 'width', 'length')}
              info="Width of the area"
              error={errors.width}
            />
            <Field
              label="Area"
              value={state.area}
              onChange={handleFieldChange('area', 'isManualArea')}
              unit={state.areaUnit}
              unitOptions={areaUnitOptions}
              onUnitChange={handleUnitChange('areaUnit', 'area', 'area')}
              info="Area (auto calculated from length × width, or enter manually)"
              error={errors.area}
            />
            <Field
              label="Depth"
              value={state.depth}
              onChange={handleFieldChange('depth')}
              unit={state.depthUnit}
              unitOptions={depthUnitOptions}
              onUnitChange={handleUnitChange('depthUnit', 'depth', 'length')}
              info="Depth of material"
              error={errors.depth}
            />
            <Field
              label="Volume"
              value={state.volume}
              onChange={handleFieldChange('volume', 'isManualVolume')}
              unit={state.volumeUnit}
              unitOptions={volumeUnitOptions}
              onUnitChange={handleUnitChange('volumeUnit', 'volume', 'volume')}
              info="Volume (auto calculated from area × depth, or enter manually)"
              error={errors.volume}
            />
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border w-full">
          <div className="mb-4 font-semibold text-gray-700 text-lg">Result</div>
          <Field
            label="Tonnage"
            value={state.tonnage}
            onChange={handleFieldChange('tonnage', 'isManualTonnage')}
            unit={state.tonnageUnit}
            unitOptions={tonnageUnitOptions}
            onUnitChange={handleUnitChange('tonnageUnit', 'tonnage', 'weight')}
            error={errors.tonnage}
          />
        </div>

        {/* Material cost */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border w-full">
          <div className="mb-4 font-semibold text-gray-700 text-lg">Material cost</div>
          <div className="grid grid-cols-1 gap-2">
            <Field
              label="Wastage"
              value={state.wastage}
              onChange={handleFieldChange('wastage')}
              unit="%"
              unitOptions={null}
              onUnitChange={() => {}}
              info="Wastage percentage"
              error={errors.wastage}
            />
            <Field
              label="Weight needed"
              value={state.weightNeeded}
              onChange={handleFieldChange('weightNeeded', 'isManualWeightNeeded')}
              unit={state.weightNeededUnit}
              unitOptions={tonnageUnitOptions}
              onUnitChange={handleUnitChange('weightNeededUnit', 'weightNeeded', 'weight')}
              error={errors.weightNeeded}
            />
          </div>
          <div className="flex flex-row gap-2 mb-4 mt-2 w-full items-end">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price per unit of weight</label>
              <div className="flex w-full">
                <input
                  type="text"
                  value={state.price}
                  onChange={handlePriceChange}
                  className={`flex-1 px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-slate-300'} rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-w-0`}
                  placeholder=""
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                />
                <select
                  value={state.pricePerWeightUnit}
                  onChange={handlePricePerWeightUnitChange}
                  className="w-32 min-w-[6rem] px-2 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-white text-base"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  {pricePerWeightUnitOptions.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.price && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12" y2="8"/>
                  </svg>
                  {errors.price}
                </div>
              )}
            </div>
          </div>
          <Field
            label="Total cost"
            value={state.totalCost}
            onChange={handleFieldChange('totalCost', 'isManualTotalCost')}
            unit={state.priceUnit}
            unitOptions={null}
            onUnitChange={() => {}}
            error={errors.totalCost}
          />
        </div>
        <button
          className="w-full mt-4 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-400 transition text-lg font-semibold"
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default TonnageCalculator