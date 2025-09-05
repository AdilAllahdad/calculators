"use client"
import React, { useState, useEffect, ChangeEvent, ReactElement } from 'react';
// Image assets for fire pit shapes
import Image from 'next/image';

// Constants for the calculator
const glassTypes = [
  { label: 'Reflective fire glass', value: 'reflective' },
  { label: 'Recycled fire glass', value: 'recycled' },
  { label: 'Enter a custom glass density', value: 'custom' },
];

// Define FirePitShape type
type FirePitShape = 'rectangular' | 'square' | 'triangular' | 'round' | 'trapezoidal';

const firePitShapes = [
  { label: 'Select', value: '' },
  { label: 'Rectangular', value: 'rectangular' as FirePitShape },
  { label: 'Square', value: 'square' as FirePitShape },
  { label: 'Triangular', value: 'triangular' as FirePitShape },
  { label: 'Round', value: 'round' as FirePitShape },
  { label: 'Trapezoidal', value: 'trapezoidal' as FirePitShape },
];

// Unit options for all input fields
const densityUnits = [
  { label: 'kilograms per cubic meter (kg/m³)', value: 'kg/m3' },
  { label: 'grams per cubic centimeter (g/cm³)', value: 'g/cm3' },
  { label: 'pounds per cubic inch (lb/cu in)', value: 'lb/cuin' },
  { label: 'pounds per cubic feet (lb/cu ft)', value: 'lb/cuft' },
];

const lengthUnits = [
  { label: 'millimeters (mm)', value: 'mm' },
  { label: 'centimeters (cm)', value: 'cm' },
  { label: 'meters (m)', value: 'm' },
  { label: 'inches (in)', value: 'in' },
  { label: 'feet (ft)', value: 'ft' },
  { label: 'yards (yd)', value: 'yd' },
];

const areaUnits = [
  { label: 'square millimeters (mm²)', value: 'mm2' },
  { label: 'square centimeters (cm²)', value: 'cm2' },
  { label: 'square meters (m²)', value: 'm2' },
  { label: 'square inches (in²)', value: 'in2' },
  { label: 'square feet (ft²)', value: 'ft2' },
  { label: 'square yards (yd²)', value: 'yd2' },
];

const volumeUnits = [
  { label: 'cubic millimeters (mm³)', value: 'mm3' },
  { label: 'cubic centimeters (cm³)', value: 'cm3' },
  { label: 'cubic meters (m³)', value: 'm3' },
  { label: 'cubic inches (cu in)', value: 'cuin' },
  { label: 'cubic feet (cu ft)', value: 'cuft' },
  { label: 'cubic yards (cu yd)', value: 'cuyd' },
];

const weightUnits = [
  { label: 'milligrams (mg)', value: 'mg' },
  { label: 'grams (g)', value: 'g' },
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' },
];

// Base values for unit conversion
const conversionFactors = {
  // Length: convert to and from meters
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
  },
  // Area: convert to and from square meters
  area: {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    in2: 0.00064516,
    ft2: 0.092903,
    yd2: 0.836127,
  },
  // Volume: convert to and from cubic meters
  volume: {
    mm3: 1e-9,
    cm3: 1e-6,
    m3: 1,
    cuin: 1.63871e-5,
    cuft: 0.0283168,
    cuyd: 0.764555,
  },
  // Density: convert to and from kg/m^3
  density: {
    'kg/m3': 1,
    'g/cm3': 1000,
    'lb/cuin': 27679.9,
    'lb/cuft': 16.0185,
  },
  // Weight: convert to and from kilograms
  weight: {
    mg: 1e-6,
    g: 0.001,
    kg: 1,
    t: 1000,
    lb: 0.453592,
    us_ton: 907.185,
    long_ton: 1016.05,
  },
};

// Type for unit categories
type UnitType = 'length' | 'area' | 'volume' | 'density' | 'weight';

// Main conversion function
const convertUnit = (
  value: number,
  fromUnit: string,
  toUnit: string,
  unitType: UnitType
): number => {
  if (fromUnit === toUnit) {
    return value;
  }
  const baseValue = value * conversionFactors[unitType][fromUnit as keyof typeof conversionFactors[typeof unitType]];
  return baseValue / conversionFactors[unitType][toUnit as keyof typeof conversionFactors[typeof unitType]];
};



interface FirePitImageProps {
  shape: FirePitShape;
}

const FirePitImage = ({ shape }: FirePitImageProps) => {
  const imageMap: Record<FirePitShape, { src: string; alt: string; label: string }> = {
    rectangular: {
      src: '/rectangular.jpeg',
      alt: 'Rectangular Fire Pit',
      label: 'L x W'
    },
    square: {
      src: '/square.jpeg',
      alt: 'Square Fire Pit',
      label: 'S x S'
    },
    triangular: {
      src: '/triangular.jpeg',
      alt: 'Triangular Fire Pit',
      label: 'B x H'
    },
    round: {
      src: '/round.jpeg',
      alt: 'Round Fire Pit',
      label: 'D'
    },
    trapezoidal: {
      src: '/trapezoidal.jpeg',
      alt: 'Trapezoidal Fire Pit',
      label: 'f, b, w'
    },
  };

  const image = imageMap[shape];
  
  return (
    <div className="w-full p-4 max-w-xs mx-auto flex flex-col items-center">
      <Image 
        src={image.src}
        alt={image.alt}
        width={200}
        height={200}
        className="rounded-md object-contain"
      />
      <p className="mt-2 text-sm text-gray-600">{image.label}</p>
    </div>
  );
};

const App = () => {
  // Fire glass properties
  const [glassType, setGlassType] = useState('reflective');
  const [glassDensity, setGlassDensity] = useState('1.457');
  const [densityUnit, setDensityUnit] = useState('g/cm3');

  // Fire pit shape and dimensions
  const [firePitShape, setFirePitShape] = useState<FirePitShape | ''>('rectangular');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [side, setSide] = useState('');
  const [diameter, setDiameter] = useState('');
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');
  const [frontLength, setFrontLength] = useState('');
  const [backLength, setBackLength] = useState('');
  const [trapezoidalWidth, setTrapezoidalWidth] = useState('');
  const [depth, setDepth] = useState('');

  // Units for dimensions
  const [lengthUnit, setLengthUnit] = useState('cm');
  const [widthUnit, setWidthUnit] = useState('cm');
  const [sideUnit, setSideUnit] = useState('cm');
  const [diameterUnit, setDiameterUnit] = useState('cm');
  const [baseUnit, setBaseUnit] = useState('cm');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [frontLengthUnit, setFrontLengthUnit] = useState('cm');
  const [backLengthUnit, setBackLengthUnit] = useState('cm');
  const [trapezoidalWidthUnit, setTrapezoidalWidthUnit] = useState('cm');
  const [depthUnit, setDepthUnit] = useState('cm');

  // Calculated values and their units
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('cm2');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('cm3');
  const [totalWeight, setTotalWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Default densities for each glass type (g/cm³)
  const defaultDensities: Record<string, string> = {
    reflective: '1.457',
    recycled: '1.445',
    custom: glassDensity // fallback for custom
  };

  // State to hold base values for calculations, independent of display units
  const [baseValues, setBaseValues] = useState<Record<string, string>>({
    length: '',
    width: '',
    side: '',
    diameter: '',
    base: '',
    height: '',
    frontLength: '',
    backLength: '',
    trapezoidalWidth: '',
    depth: '',
    density: '',
  });

  type SetterFunction = React.Dispatch<React.SetStateAction<string>>;
  
  // Handle changes for input fields, storing base values in cm/kg/m3
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>, 
    setter: SetterFunction, 
    unitSetter: SetterFunction,
    unitType: UnitType
  ) => {
    const value = e.target.value;
    
    // Check if value is empty or non-negative
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setter(value);
      
      // Only convert and update base values if value is valid
      if (value !== '') {
        const convertedToBase = convertUnit(parseFloat(value), e.target.dataset.unit as string, 'cm', unitType);
        setBaseValues(prev => ({ ...prev, [e.target.dataset.name as string]: convertedToBase.toString() }));
      }
    }
    // Ignore negative values - don't update state
  };

  const handleUnitChange = (
    e: ChangeEvent<HTMLSelectElement>, 
    setter: SetterFunction, 
    unitType: UnitType, 
    valueName: keyof typeof baseValues
  ) => {
    const newUnit = e.target.value;
    setter(newUnit);
    // Convert the base value to the new display unit
    if (baseValues[valueName] !== '' && !isNaN(parseFloat(baseValues[valueName]))) {
      const convertedValue = convertUnit(parseFloat(baseValues[valueName]), 'cm', newUnit, unitType);
      switch (valueName) {
        case 'length':
          setLength(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'width':
          setWidth(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'side':
          setSide(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'diameter':
          setDiameter(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'base':
          setBase(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'height':
          setHeight(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'frontLength':
          setFrontLength(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'backLength':
          setBackLength(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'trapezoidalWidth':
          setTrapezoidalWidth(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        case 'depth':
          setDepth(convertedValue.toFixed(2).replace(/\.0+$/, ''));
          break;
        default:
          break;
      }
    }
  };


  // Effect to update density when glass type or density unit changes
  useEffect(() => {
    if (glassType !== 'custom') {
      // Always store base density in kg/m3, convert to selected unit for display
      const baseDensity = defaultDensities[glassType];
      // First convert base density from g/cm3 to kg/m3 and store it
      const densityInKgM3 = convertUnit(parseFloat(baseDensity), 'g/cm3', 'kg/m3', 'density');
      setBaseValues(prev => ({ ...prev, density: densityInKgM3.toString() }));
      
      // Convert for display
      const converted = convertUnit(parseFloat(baseDensity), 'g/cm3', densityUnit, 'density');
      setGlassDensity(converted ? converted.toFixed(3).replace(/\.0+$/, '') : '');
    } else {
      // For custom, ensure density field is empty when first selected
      if (glassDensity === defaultDensities.reflective || glassDensity === defaultDensities.recycled) {
        setGlassDensity('');
        setTotalWeight('');
        setBaseValues(prev => ({ ...prev, density: '' }));
      }
    }
  }, [glassType, densityUnit]);

  // Effect to calculate area based on shape dimensions
  useEffect(() => {
    let newAreaCm2 = 0;
    const lInCm = convertUnit(parseFloat(length), lengthUnit, 'cm', 'length');
    const wInCm = convertUnit(parseFloat(width), widthUnit, 'cm', 'length');
    const sInCm = convertUnit(parseFloat(side), sideUnit, 'cm', 'length');
    const dInCm = convertUnit(parseFloat(diameter), diameterUnit, 'cm', 'length');
    const bInCm = convertUnit(parseFloat(base), baseUnit, 'cm', 'length');
    const hInCm = convertUnit(parseFloat(height), heightUnit, 'cm', 'length');
    const fInCm = convertUnit(parseFloat(frontLength), frontLengthUnit, 'cm', 'length');
    const blInCm = convertUnit(parseFloat(backLength), backLengthUnit, 'cm', 'length');
    const twInCm = convertUnit(parseFloat(trapezoidalWidth), trapezoidalWidthUnit, 'cm', 'length');


    if (firePitShape === 'rectangular' && !isNaN(lInCm) && !isNaN(wInCm)) {
      newAreaCm2 = lInCm * wInCm;
    } else if (firePitShape === 'square' && !isNaN(sInCm)) {
      newAreaCm2 = sInCm * sInCm;
    } else if (firePitShape === 'round' && !isNaN(dInCm)) {
      newAreaCm2 = Math.PI * Math.pow(dInCm / 2, 2);
    } else if (firePitShape === 'triangular' && !isNaN(bInCm) && !isNaN(hInCm)) {
      newAreaCm2 = 0.5 * bInCm * hInCm;
    } else if (firePitShape === 'trapezoidal' && !isNaN(fInCm) && !isNaN(blInCm) && !isNaN(twInCm)) {
      newAreaCm2 = 0.5 * (fInCm + blInCm) * twInCm;
    }

    if (newAreaCm2 > 0) {
      const convertedArea = convertUnit(newAreaCm2, 'cm2', areaUnit, 'area');
      setArea(convertedArea.toFixed(4).replace(/\.0+$/, ''));
    } else {
      setArea('');
    }
  }, [firePitShape, length, width, side, diameter, base, height, frontLength, backLength, trapezoidalWidth, lengthUnit, widthUnit, sideUnit, diameterUnit, baseUnit, heightUnit, frontLengthUnit, backLengthUnit, trapezoidalWidthUnit, areaUnit]);

  // Effect to calculate volume based on area and depth
  useEffect(() => {
    const areaVal = parseFloat(area);
    const depthVal = parseFloat(depth);
    if (!isNaN(areaVal) && !isNaN(depthVal) && areaVal > 0 && depthVal > 0) {
      const areaInM2 = convertUnit(areaVal, areaUnit, 'm2', 'area');
      const depthInM = convertUnit(depthVal, depthUnit, 'm', 'length');
      const volumeInM3 = areaInM2 * depthInM;
      const convertedVolume = convertUnit(volumeInM3, 'm3', volumeUnit, 'volume');
      setVolume(convertedVolume.toFixed(4).replace(/\.0+$/, ''));
    } else {
      setVolume('');
    }
  }, [area, depth, areaUnit, depthUnit, volumeUnit]);

  // Effect to calculate total weight based on volume and density
  useEffect(() => {
    // Skip calculation if glass type is custom and no density is entered
    if (glassType === 'custom' && (glassDensity === '' || glassDensity === null)) {
      setTotalWeight('');
      return;
    }
    
    const volumeVal = parseFloat(volume);
    if (!isNaN(volumeVal) && volumeVal > 0) {
      // Get the base density value in kg/m3
      let densityInKgM3;
      
      // If we have a stored base value for density, use it
      if (baseValues.density && !isNaN(parseFloat(baseValues.density))) {
        densityInKgM3 = parseFloat(baseValues.density);
      } else {
        // Otherwise convert from the current display value and unit
        const densityVal = parseFloat(glassDensity);
        if (isNaN(densityVal) || densityVal <= 0) {
          setTotalWeight('');
          return;
        }
        densityInKgM3 = convertUnit(densityVal, densityUnit, 'kg/m3', 'density');
      }
      
      const volumeInM3 = convertUnit(volumeVal, volumeUnit, 'm3', 'volume');
      const weightInKg = (volumeInM3 * densityInKgM3);
      const convertedWeight = convertUnit(weightInKg, 'kg', weightUnit, 'weight');
      setTotalWeight(convertedWeight.toFixed(4).replace(/\.0+$/, ''));
    } else {
      setTotalWeight('');
    }
  }, [volume, glassDensity, volumeUnit, weightUnit, glassType, baseValues.density]);

  // Reload the calculator to reset all values
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 font-sans bg-gray-50 rounded-xl shadow-xl">
      <h2 className="text-center font-extrabold text-3xl mb-9 text-gray-900 tracking-wide">Fire Glass Calculator</h2>

      {/* Fire glass and pit details section */}
      <section className="bg-white rounded-2xl shadow-md p-7 mb-8">
        <div className="text-xl font-bold mb-5 text-gray-800">Fire glass and pit details</div>
        <div className="mb-5">
          <div className="font-medium mb-1 text-base flex items-center gap-1">
            Glass type
            <span title="Choose the type of fire glass" className="text-xs text-gray-400">ⓘ</span>
          </div>
          <div className="flex flex-wrap gap-6">
            {glassTypes.map((type) => (
              <label key={type.value} className="inline-flex items-center font-normal text-base cursor-pointer gap-2">
                <input
                  type="radio"
                  name="glassType"
                  value={type.value}
                  checked={glassType === type.value}
                  onChange={() => {
                    setGlassType(type.value);
                    if (type.value === 'custom') {
                      // Reset glass density and total weight when switching to custom
                      setGlassDensity('');
                      setTotalWeight('');
                      setBaseValues(prev => ({
                        ...prev,
                        density: ''
                      }));
                    }
                  }}
                  className="accent-blue-500 mr-1"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="font-medium mb-1 text-base">Glass density</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              min="0"
              value={glassDensity}
              data-name="density"
              data-unit={densityUnit}
              onChange={e => {
                const value = e.target.value;
                
                // Check if value is empty or non-negative
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setGlassDensity(value);
                  
                  if (value) {
                    // Store the base value in kg/m3
                    const densityInKgM3 = convertUnit(parseFloat(value), densityUnit, 'kg/m3', 'density');
                    setBaseValues(prev => ({
                      ...prev,
                      density: densityInKgM3.toString()
                    }));
                  } else {
                    // If input is cleared, also clear the base value
                    setBaseValues(prev => ({
                      ...prev,
                      density: ''
                    }));
                    setTotalWeight(''); // Clear the total weight when density is empty
                  }
                }
                // Ignore negative values - don't update state
              }}
              className={`w-24 px-3 py-2 border rounded-md text-base ${glassType === 'custom' ? 'bg-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
              disabled={glassType !== 'custom'}
              placeholder={glassType === 'custom' ? "Enter value" : ""}
            />
            <select
              className="w-56 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={densityUnit}
              onChange={e => {
                const newUnit = e.target.value;
                const oldUnit = densityUnit;
                setDensityUnit(newUnit);
                
                // Convert the displayed density value to the new unit without changing the base value
                if (glassDensity && !isNaN(parseFloat(glassDensity))) {
                  // First convert to base unit (kg/m3)
                  const densityInBase = convertUnit(parseFloat(glassDensity), oldUnit, 'kg/m3', 'density');
                  // Then convert from base unit to new display unit
                  const newDisplayValue = convertUnit(densityInBase, 'kg/m3', newUnit, 'density');
                  setGlassDensity(newDisplayValue.toFixed(3).replace(/\.0+$/, ''));
                }
              }}
            >
              {densityUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-2">
          <div className="font-medium mb-1 text-base">Fire pit shape</div>
          <select
            value={firePitShape}
            onChange={e => setFirePitShape(e.target.value as FirePitShape | '')}
            className="w-full px-3 py-2 border rounded-md font-mono font-semibold text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 mb-3"
          >
            {firePitShapes.map(shape => (
              <option key={shape.value} value={shape.value}>{shape.label}</option>
            ))}
          </select>
          <div className="mt-2 text-center">
            {firePitShape && <FirePitImage shape={firePitShape as FirePitShape} />}
          </div>
        </div>
      </section>

      {/* Fire pit dimensions section */}
      <section className="bg-white rounded-2xl shadow-md p-7 mb-8">
        <div className="text-xl font-bold mb-5 text-gray-800">Fire pit dimensions</div>
        <div className="flex flex-col gap-4">
          {firePitShape === 'round' ? (
            <>
              <label className="flex items-center gap-3 text-base">
                Diameter (D)
                <input
                  type="number"
                  min="0"
                  value={diameter}
                  data-name="diameter"
                  data-unit={diameterUnit}
                  onChange={e => handleInputChange(e, setDiameter, setDiameterUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={diameterUnit} onChange={e => handleUnitChange(e, setDiameterUnit, 'length', 'diameter')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
            </>
          ) : firePitShape === 'square' ? (
            <>
              <label className="flex items-center gap-3 text-base">
                Side (s)
                <input
                  type="number"
                  min="0"
                  value={side}
                  data-name="side"
                  data-unit={sideUnit}
                  onChange={e => handleInputChange(e, setSide, setSideUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={sideUnit} onChange={e => handleUnitChange(e, setSideUnit, 'length', 'side')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
            </>
          ) : firePitShape === 'triangular' ? (
            <>
              <label className="flex items-center gap-3 text-base">
                Base (b)
                <input
                  type="number"
                  min="0"
                  value={base}
                  data-name="base"
                  data-unit={baseUnit}
                  onChange={e => handleInputChange(e, setBase, setBaseUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={baseUnit} onChange={e => handleUnitChange(e, setBaseUnit, 'length', 'base')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 text-base">
                Height (h)
                <input
                  type="number"
                  min="0"
                  value={height}
                  data-name="height"
                  data-unit={heightUnit}
                  onChange={e => handleInputChange(e, setHeight, setHeightUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={heightUnit} onChange={e => handleUnitChange(e, setHeightUnit, 'length', 'height')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
            </>
          ) : firePitShape === 'trapezoidal' ? (
            <>
              <label className="flex items-center gap-3 text-base">
                Front length (f)
                <input
                  type="number"
                  min="0"
                  value={frontLength}
                  data-name="frontLength"
                  data-unit={frontLengthUnit}
                  onChange={e => handleInputChange(e, setFrontLength, setFrontLengthUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={frontLengthUnit} onChange={e => handleUnitChange(e, setFrontLengthUnit, 'length', 'frontLength')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 text-base">
                Back length (b)
                <input
                  type="number"
                  min="0"
                  value={backLength}
                  data-name="backLength"
                  data-unit={backLengthUnit}
                  onChange={e => handleInputChange(e, setBackLength, setBackLengthUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={backLengthUnit} onChange={e => handleUnitChange(e, setBackLengthUnit, 'length', 'backLength')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 text-base">
                Width (w)
                <input
                  type="number"
                  min="0"
                  value={trapezoidalWidth}
                  data-name="trapezoidalWidth"
                  data-unit={trapezoidalWidthUnit}
                  onChange={e => handleInputChange(e, setTrapezoidalWidth, setTrapezoidalWidthUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={trapezoidalWidthUnit} onChange={e => handleUnitChange(e, setTrapezoidalWidthUnit, 'length', 'trapezoidalWidth')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="flex items-center gap-3 text-base">
                Length (l)
                <input
                  type="number"
                  min="0"
                  value={length}
                  data-name="length"
                  data-unit={lengthUnit}
                  onChange={e => handleInputChange(e, setLength, setLengthUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={lengthUnit} onChange={e => handleUnitChange(e, setLengthUnit, 'length', 'length')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 text-base">
                Width (w)
                <input
                  type="number"
                  min="0"
                  value={width}
                  data-name="width"
                  data-unit={widthUnit}
                  onChange={e => handleInputChange(e, setWidth, setWidthUnit, 'length')}
                  className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select value={widthUnit} onChange={e => handleUnitChange(e, setWidthUnit, 'length', 'width')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </label>
            </>
          )}
          <label className="flex items-center gap-3 text-base">
            Area
            <input
              type="text"
              value={area}
              readOnly
              className="w-24 px-3 py-2 border rounded-md text-base bg-gray-100 font-semibold text-gray-800"
            />
            <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              {areaUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 text-base">
            Depth (d)
            <input
              type="number"
              min="0"
              value={depth}
              data-name="depth"
              data-unit={depthUnit}
              onChange={e => handleInputChange(e, setDepth, setDepthUnit, 'length')}
              className="w-24 px-3 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select value={depthUnit} onChange={e => handleUnitChange(e, setDepthUnit, 'length', 'depth')} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 text-base">
            Volume
            <input
              type="text"
              value={volume}
              readOnly
              className="w-24 px-3 py-2 border rounded-md text-base bg-gray-100 font-semibold text-gray-800"
            />
            <select value={volumeUnit} onChange={e => setVolumeUnit(e.target.value)} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              {volumeUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* Final output section */}
      <section className="bg-white rounded-2xl shadow-md p-7">
        <div className="text-xl font-bold mb-5 text-gray-800">Final output</div>
        <div className="flex items-center gap-4 text-base mb-4">
          <span className="font-medium">Total weight</span>
          <input
            type="text"
            value={totalWeight}
            readOnly
            className="w-28 px-3 py-2 border rounded-md text-base bg-gray-100 font-semibold text-gray-800"
          />
          <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)} className="w-36 px-2 py-2 border rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
            {weightUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={handleReload} className="bg-gray-100 border border-gray-300 rounded-md px-6 py-2 font-medium text-base hover:bg-gray-200 transition">Reload calculator</button>
        </div>
      </section>
    </div>
  );
};

export default App;
