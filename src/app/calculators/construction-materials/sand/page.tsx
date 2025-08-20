'use client';

import { useState, useEffect, useRef } from 'react';
import { convertLength, convertToComposite, convertFromComposite, convertBetweenComposites, convertVolume, formatNumber } from '@/lib/conversions';
import { convertArea } from '@/lib/conversions/area';

export default function SandCalculator() {
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({
    length: '',
    width: '',
    depth: ''
  });
  const [dimensionErrors, setDimensionErrors] = useState<{ [key: string]: string }>({
    length: '',
    width: '',
    depth: ''
  });
  
  // For composite unit fields (feet/inches and meters/centimeters)
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    length: { whole: '', fraction: '' },
    width: { whole: '', fraction: '' },
    depth: { whole: '', fraction: '' },
  });
  
  const [units, setUnits] = useState<{ [key: string]: string }>({
    length: 'ft',
    width: 'ft',
    depth: 'ft'
  });
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('cu yd');
  const [area, setArea] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<string>('lb');
  
  // Sand density in kg/m³ (default value from the requirements) - now editable
  const [sandDensity, setSandDensity] = useState<string>('1601.95');
  const [densityUnit, setDensityUnit] = useState<string>('kg/m³');
  const [densityError, setDensityError] = useState<string>('');
  
  // Price calculations
  const [pricePerWeight, setPricePerWeight] = useState<string>('');
  const [pricePerVolume, setPricePerVolume] = useState<string>('');
  // Track which price field was last edited to avoid infinite loops
  const lastPriceEdit = useRef<'weight' | 'volume' | null>(null);
  const [priceWeightError, setPriceWeightError] = useState<string>('');
  const [priceVolumeError, setPriceVolumeError] = useState<string>('');
  const [priceWeightUnit, setPriceWeightUnit] = useState<string>('lb');
  const [priceVolumeUnit, setPriceVolumeUnit] = useState<string>('cu yd');
  const [currency, setCurrency] = useState<string>('PKR');
  const [totalCost, setTotalCost] = useState<number>(0);

  const volumeUnitOptions = [
    { value: 'cm³', label: 'cubic centimeters (cm³)' },
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'cu in', label: 'cubic inches (cu in)' },
    { value: 'cu ft', label: 'cubic feet (cu ft)' },
    { value: 'cu yd', label: 'cubic yards (cu yd)' }
  ];

  const areaUnitOptions = [
  { value: 'mm²', label: 'square millimeters (mm²)' },
  { value: 'cm²', label: 'square centimeters (cm²)' },
  { value: 'm²', label: 'square meters (m²)' },
  { value: 'in²', label: 'square inches (in²)' },
  { value: 'ft²', label: 'square feet (ft²)' },
  { value: 'yd²', label: 'square yards (yd²)' },
  { value: 'ha', label: 'hectares (ha)' },
  { value: 'ac', label: 'acres (ac)' },
  { value: 'sf', label: 'soccer fields (sf)' }
  ];

  const weightUnitOptions = [
  { value: 'g', label: 'gram (g)' },
  { value: 'kg', label: 'kilogram (kg)' },
  { value: 't', label: 'metric ton (t)' },
  { value: 'lb', label: 'pound (lb)' },
  { value: 'st', label: 'stone (st)' },
  { value: 'ton', label: 'US short ton (US ton)' },
  { value: 'ton-uk', label: 'imperial ton (long ton)' }
  ];

  const densityUnitOptions = [
    { value: 't/m³', label: 'tons per cubic meter (t/m³)' },
    { value: 'kg/m³', label: 'kilograms per cubic meter (kg/m³)' },
    { value: 'g/cm³', label: 'grams per cubic centimeter (g/cm³)' },
    { value: 'oz/cu in', label: 'ounces per cubic inch (oz/cu in)' },
    { value: 'lb/cu in', label: 'pounds per cubic inch (lb/cu in)' },
    { value: 'lb/cu ft', label: 'pounds per cubic feet (lb/cu ft)' },
    { value: 'lb/cu yd', label: 'pounds per cubic yard (lb/cu yd)' }
  ];

  const unitOptions = [
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  // Handle unit conversions
  const handleUnitChange = (
    field: string,
    oldUnit: string,
    newUnit: string
  ) => {
    if (oldUnit === newUnit) return;

    setUnits(prev => ({ ...prev, [field]: newUnit }));
    setDimensionErrors(prev => ({ ...prev, [field]: '' }));

    const hasRegularValue = dimensions[field] && !isNaN(parseFloat(dimensions[field]));
    const hasCompositeValue = (compositeUnits[field]?.whole && !isNaN(parseFloat(compositeUnits[field].whole))) || 
                             (compositeUnits[field]?.fraction && !isNaN(parseFloat(compositeUnits[field].fraction)));

    if (!hasRegularValue && !hasCompositeValue) {
      return;
    }

    try {
      // Converting FROM single unit TO composite unit
      if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(dimensions[field]);
        const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const result = convertToComposite(value, oldUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
        
        setDimensions(prev => ({ ...prev, [field]: '' }));
      }
      // Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setDimensions(prev => ({ ...prev, [field]: formattedValue }));
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: { whole: '', fraction: '' }
        }));
      }
      // Converting BETWEEN composite units
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
      }
      // Converting BETWEEN single units
      else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(dimensions[field]);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setDimensions(prev => ({ ...prev, [field]: formattedValue }));
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setUnits(prev => ({ ...prev, [field]: oldUnit }));
    }
  };

  // Handle density unit conversions
  const handleDensityUnitChange = (newUnit: string) => {
    if (densityUnit === newUnit || !sandDensity || isNaN(parseFloat(sandDensity))) {
      setDensityUnit(newUnit);
      return;
    }

    try {
      const currentDensityValue = parseFloat(sandDensity);
      
      // Convert current density to kg/m³, then to new unit
      const densityInKgPerM3 = convertDensityToKgPerM3(currentDensityValue, densityUnit);
      const convertedDensity = convertDensityFromKgPerM3(densityInKgPerM3, newUnit);
      
      setSandDensity(formatNumber(convertedDensity, { maximumFractionDigits: 4, useCommas: false }));
      setDensityUnit(newUnit);
      setDensityError('');
    } catch (error) {
      console.error('Density conversion error:', error);
    }
  };

  // Convert from kg/m³ to other density units
  const convertDensityFromKgPerM3 = (value: number, toUnit: string): number => {
    switch (toUnit) {
      case 'kg/m³': return value;
      case 't/m³': return value / 1000; // 1000 kg = 1 tonne
      case 'g/cm³': return value / 1000; // 1000 kg/m³ = 1 g/cm³
      case 'lb/cu ft': return value / 16.0185; // 1 kg/m³ = 0.0624 lb/ft³
      case 'lb/cu in': return value / 27679.9; // 1 kg/m³ = 0.0000361 lb/in³
      case 'lb/cu yd': return value / 0.593276; // 1 kg/m³ = 1.686 lb/yd³
      case 'oz/cu in': return value / 1729.99; // 1 kg/m³ = 0.000578 oz/in³
      default: return value;
    }
  };

  // Calculate volume, area, and weight whenever dimensions change
  useEffect(() => {
    const calculateValues = () => {
      try {
        let length = 0, width = 0, depth = 0;

        // Get length value
        if (units.length === 'ft/in' || units.length === 'm/cm') {
          const wholeValue = parseFloat(compositeUnits.length.whole || '0');
          const fractionValue = parseFloat(compositeUnits.length.fraction || '0');
          const sourceCompositeUnit = units.length === 'ft/in' ? 'ft / in' : 'm / cm';
          length = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'ft');
        } else {
          const lengthValue = parseFloat(dimensions.length || '0');
          length = lengthValue ? convertLength(lengthValue, units.length, 'ft') : 0;
        }

        // Get width value
        if (units.width === 'ft/in' || units.width === 'm/cm') {
          const wholeValue = parseFloat(compositeUnits.width.whole || '0');
          const fractionValue = parseFloat(compositeUnits.width.fraction || '0');
          const sourceCompositeUnit = units.width === 'ft/in' ? 'ft / in' : 'm / cm';
          width = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'ft');
        } else {
          const widthValue = parseFloat(dimensions.width || '0');
          width = widthValue ? convertLength(widthValue, units.width, 'ft') : 0;
        }

        // Get depth value
        if (units.depth === 'ft/in' || units.depth === 'm/cm') {
          const wholeValue = parseFloat(compositeUnits.depth.whole || '0');
          const fractionValue = parseFloat(compositeUnits.depth.fraction || '0');
          const sourceCompositeUnit = units.depth === 'ft/in' ? 'ft / in' : 'm / cm';
          depth = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'ft');
        } else {
          const depthValue = parseFloat(dimensions.depth || '0');
          depth = depthValue ? convertLength(depthValue, units.depth, 'ft') : 0;
        }

        // Calculate volume in cubic feet, then convert to selected unit
        const volumeInCubicFeet = length * width * depth;
        const convertedVolume = volumeInCubicFeet > 0 ? convertVolume(volumeInCubicFeet, 'cu ft', volumeUnit) : 0;
        setVolume(convertedVolume);

        // Calculate area in square feet, then convert to selected unit
        const areaInSquareFeet = length * width;
        const convertedArea = areaInSquareFeet > 0 ? convertArea(areaInSquareFeet, 'ft²', areaUnit) : 0;
        setArea(convertedArea);

        // Calculate weight
        if (volumeInCubicFeet > 0 && sandDensity && !isNaN(parseFloat(sandDensity))) {
          // Convert volume to cubic meters for density calculation
          const volumeInCubicMeters = convertVolume(volumeInCubicFeet, 'cu ft', 'm³');
          const densityValue = parseFloat(sandDensity);
          
          // Convert density to kg/m³ for calculation
          const densityInKgPerM3 = convertDensityToKgPerM3(densityValue, densityUnit);
          const weightInKg = volumeInCubicMeters * densityInKgPerM3;
          
          // Convert weight to selected unit
          const convertedWeight = convertWeight(weightInKg, 'kg', weightUnit);
          setWeight(convertedWeight);
        } else {
          setWeight(0);
        }

      } catch (error) {
        console.error('Calculation error:', error);
      }
    };

    calculateValues();
  }, [dimensions, compositeUnits, units, volumeUnit, areaUnit, weightUnit, sandDensity, densityUnit]);

  // Weight conversion function
  // Proper weight conversion including US short ton and imperial ton
  const convertWeight = (value: number, fromUnit: string, toUnit: string): number => {
    // Convert everything to kilograms first
    let kg = 0;
    switch (fromUnit) {
      case 'g': kg = value / 1000; break;
      case 'kg': kg = value; break;
      case 't': kg = value * 1000; break;
      case 'oz': kg = value * 0.0283495; break;
      case 'lb': kg = value * 0.453592; break;
      case 'st': kg = value * 6.35029; break;
      case 'ton': kg = value * 907.18474; break; // US short ton
      case 'ton-uk': kg = value * 1016.0469088; break; // Imperial ton
      default: kg = value;
    }

    // Convert from kilograms to target unit
    switch (toUnit) {
      case 'g': return kg * 1000;
      case 'kg': return kg;
      case 't': return kg / 1000;
      case 'oz': return kg / 0.0283495;
      case 'lb': return kg / 0.453592;
      case 'st': return kg / 6.35029;
      case 'ton': return kg / 907.18474; // US short ton
      case 'ton-uk': return kg / 1016.0469088; // Imperial ton
      default: return kg;
    }
  };

  // Density conversion function - converts to kg/m³ as the standard
  const convertDensityToKgPerM3 = (value: number, fromUnit: string): number => {
    switch (fromUnit) {
      case 'kg/m³': return value;
      case 't/m³': return value * 1000; // 1 tonne = 1000 kg
      case 'g/cm³': return value * 1000; // 1 g/cm³ = 1000 kg/m³
      case 'lb/cu ft': return value * 16.0185; // 1 lb/ft³ = 16.0185 kg/m³
      case 'lb/cu in': return value * 27679.9; // 1 lb/in³ = 27679.9 kg/m³
      case 'lb/cu yd': return value * 0.593276; // 1 lb/yd³ = 0.593276 kg/m³
      case 'oz/cu in': return value * 1729.99; // 1 oz/in³ = 1729.99 kg/m³
      default: return value;
    }
  };

  // Calculate total cost whenever price or volume/weight changes
  useEffect(() => {
    let cost = 0;
    // Only use the last edited price field for total cost calculation
    if ((lastPriceEdit.current === 'weight' || (!lastPriceEdit.current && pricePerWeight)) && pricePerWeight && !isNaN(parseFloat(pricePerWeight)) && weight > 0) {
      const pricePerWeightValue = parseFloat(pricePerWeight);
      const weightInPriceUnit = convertWeight(weight, weightUnit, priceWeightUnit);
      cost = pricePerWeightValue * weightInPriceUnit;
    } else if ((lastPriceEdit.current === 'volume' || (!lastPriceEdit.current && pricePerVolume)) && pricePerVolume && !isNaN(parseFloat(pricePerVolume)) && volume > 0) {
      const pricePerVolumeValue = parseFloat(pricePerVolume);
      const volumeInPriceUnit = convertVolume(volume, volumeUnit, priceVolumeUnit);
      cost = pricePerVolumeValue * volumeInPriceUnit;
    }
    setTotalCost(cost);
  }, [pricePerWeight, pricePerVolume, weight, volume, weightUnit, volumeUnit, priceWeightUnit, priceVolumeUnit]);

  // Auto-calculate price per volume when price per weight changes
  useEffect(() => {
    if (lastPriceEdit.current === 'weight') {
      // Only update if we have valid values
      if (pricePerWeight && !isNaN(parseFloat(pricePerWeight)) && weight > 0 && volume > 0) {
        // Find total price for current weight, then divide by volume in priceVolumeUnit
        const pricePerWeightValue = parseFloat(pricePerWeight);
        const weightInPriceUnit = convertWeight(weight, weightUnit, priceWeightUnit);
        const totalPrice = pricePerWeightValue * weightInPriceUnit;
        const volumeInPriceUnit = convertVolume(volume, volumeUnit, priceVolumeUnit);
        if (volumeInPriceUnit > 0) {
          const newPricePerVolume = totalPrice / volumeInPriceUnit;
          if (!isNaN(newPricePerVolume) && isFinite(newPricePerVolume)) {
            setPricePerVolume(newPricePerVolume.toFixed(4));
          }
        }
      }
      lastPriceEdit.current = null;
    }
    // eslint-disable-next-line
  }, [pricePerWeight, weight, volume, weightUnit, priceWeightUnit, priceVolumeUnit, volumeUnit]);

  // Auto-calculate price per weight when price per volume changes
  useEffect(() => {
    if (lastPriceEdit.current === 'volume') {
      if (pricePerVolume && !isNaN(parseFloat(pricePerVolume)) && weight > 0 && volume > 0) {
        const pricePerVolumeValue = parseFloat(pricePerVolume);
        const volumeInPriceUnit = convertVolume(volume, volumeUnit, priceVolumeUnit);
        const totalPrice = pricePerVolumeValue * volumeInPriceUnit;
        const weightInPriceUnit = convertWeight(weight, weightUnit, priceWeightUnit);
        if (weightInPriceUnit > 0) {
          const newPricePerWeight = totalPrice / weightInPriceUnit;
          if (!isNaN(newPricePerWeight) && isFinite(newPricePerWeight)) {
            setPricePerWeight(newPricePerWeight.toFixed(4));
          }
        }
      }
      lastPriceEdit.current = null;
    }
    // eslint-disable-next-line
  }, [pricePerVolume, weight, volume, weightUnit, priceWeightUnit, priceVolumeUnit, volumeUnit]);

  const clearAll = () => {
    setDimensions({ length: '', width: '', depth: '' });
    setCompositeUnits({
      length: { whole: '', fraction: '' },
      width: { whole: '', fraction: '' },
      depth: { whole: '', fraction: '' },
    });
    setDimensionErrors({ length: '', width: '', depth: '' });
    setPricePerWeight('');
    setPricePerVolume('');
    setPriceWeightError('');
    setPriceVolumeError('');
    setSandDensity('1601.95');
    setDensityError('');
  };

  const reloadCalculator = () => {
    window.location.reload();
  };

  const shareResult = () => {
    const result = `Sand Calculator Results:\nVolume: ${volume.toFixed(4)} ${volumeUnit}\nArea: ${area.toFixed(4)} ${areaUnit}\nWeight: ${weight.toFixed(2)} ${weightUnit}\nTotal Cost: ${currency} ${totalCost.toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Sand Calculator Results',
        text: result
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Sand Calculator 
          <span className="ml-3 text-2xl">🏖️</span>
        </h1>
      </div>

      {/* Calculator Form */}
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
        
        {/* Dimensions section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 mr-2">📐</span>
            <h3 className="text-lg font-semibold text-slate-800">Excavation dimensions</h3>
          </div>
          
          {/* Length */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                {(units.length === 'ft/in' || units.length === 'm/cm') ? (
                  <div className="flex gap-1 relative">
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.length.whole}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, length: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              length: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          const formattedValue = value === '' ? '' : parseInt(value).toString();
                          setCompositeUnits(prev => ({
                            ...prev,
                            length: { ...prev.length, whole: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.length ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.length === 'ft/in' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.length.fraction}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, length: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              length: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          let formattedValue = value;
                          if (value !== '' && !isNaN(parseFloat(value))) {
                            formattedValue = parseFloat(value).toFixed(2);
                            if (formattedValue.endsWith('.00')) {
                              formattedValue = formattedValue.slice(0, -3);
                            } else if (formattedValue.endsWith('0')) {
                              formattedValue = formattedValue.slice(0, -1);
                            }
                          }
                          
                          setCompositeUnits(prev => ({
                            ...prev,
                            length: { ...prev.length, fraction: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.length ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.length === 'ft/in' ? 'in' : 'cm'}
                      </span>
                    </div>
                    {dimensionErrors.length && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.length}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDimensionErrors(prev => ({ ...prev, length: '' }));
                        
                        if (value !== '' && parseFloat(value) < 0) {
                          setDimensionErrors(prev => ({
                            ...prev,
                            length: 'Negative values are not allowed'
                          }));
                          return;
                        }
                        
                        setDimensions(prev => ({ ...prev, length: value }));
                      }}
                      className={`w-full px-3 py-2 border ${dimensionErrors.length ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      placeholder="0"
                      step="0.01"
                    />
                    {dimensionErrors.length && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.length}</p>
                    )}
                  </>
                )}
              </div>
              <select
                value={units.length}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  const currentUnit = units.length;
                  if (newUnit !== currentUnit) {
                    handleUnitChange('length', currentUnit, newUnit);
                  }
                }}
                className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Width */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                {(units.width === 'ft/in' || units.width === 'm/cm') ? (
                  <div className="flex gap-1 relative">
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.width.whole}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, width: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              width: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          const formattedValue = value === '' ? '' : parseInt(value).toString();
                          setCompositeUnits(prev => ({
                            ...prev,
                            width: { ...prev.width, whole: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.width ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.width === 'ft/in' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.width.fraction}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, width: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              width: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          let formattedValue = value;
                          if (value !== '' && !isNaN(parseFloat(value))) {
                            formattedValue = parseFloat(value).toFixed(2);
                            if (formattedValue.endsWith('.00')) {
                              formattedValue = formattedValue.slice(0, -3);
                            } else if (formattedValue.endsWith('0')) {
                              formattedValue = formattedValue.slice(0, -1);
                            }
                          }
                          
                          setCompositeUnits(prev => ({
                            ...prev,
                            width: { ...prev.width, fraction: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.width ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.width === 'ft/in' ? 'in' : 'cm'}
                      </span>
                    </div>
                    {dimensionErrors.width && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.width}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDimensionErrors(prev => ({ ...prev, width: '' }));
                        
                        if (value !== '' && parseFloat(value) < 0) {
                          setDimensionErrors(prev => ({
                            ...prev,
                            width: 'Negative values are not allowed'
                          }));
                          return;
                        }
                        
                        setDimensions(prev => ({ ...prev, width: value }));
                      }}
                      className={`w-full px-3 py-2 border ${dimensionErrors.width ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      placeholder="0"
                      step="0.01"
                    />
                    {dimensionErrors.width && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.width}</p>
                    )}
                  </>
                )}
              </div>
              <select
                value={units.width}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  const currentUnit = units.width;
                  if (newUnit !== currentUnit) {
                    handleUnitChange('width', currentUnit, newUnit);
                  }
                }}
                className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area - Auto-calculated */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={area.toFixed(4)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {areaUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Depth */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Depth
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                {(units.depth === 'ft/in' || units.depth === 'm/cm') ? (
                  <div className="flex gap-1 relative">
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.depth.whole}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, depth: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              depth: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          const formattedValue = value === '' ? '' : parseInt(value).toString();
                          setCompositeUnits(prev => ({
                            ...prev,
                            depth: { ...prev.depth, whole: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.depth ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.depth === 'ft/in' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="number"
                        value={compositeUnits.depth.fraction}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDimensionErrors(prev => ({ ...prev, depth: '' }));
                          
                          if (value !== '' && parseFloat(value) < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              depth: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          let formattedValue = value;
                          if (value !== '' && !isNaN(parseFloat(value))) {
                            formattedValue = parseFloat(value).toFixed(2);
                            if (formattedValue.endsWith('.00')) {
                              formattedValue = formattedValue.slice(0, -3);
                            } else if (formattedValue.endsWith('0')) {
                              formattedValue = formattedValue.slice(0, -1);
                            }
                          }
                          
                          setCompositeUnits(prev => ({
                            ...prev,
                            depth: { ...prev.depth, fraction: formattedValue }
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors.depth ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-500">
                        {units.depth === 'ft/in' ? 'in' : 'cm'}
                      </span>
                    </div>
                    {dimensionErrors.depth && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.depth}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="number"
                      value={dimensions.depth}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDimensionErrors(prev => ({ ...prev, depth: '' }));
                        
                        if (value !== '' && parseFloat(value) < 0) {
                          setDimensionErrors(prev => ({
                            ...prev,
                            depth: 'Negative values are not allowed'
                          }));
                          return;
                        }
                        
                        setDimensions(prev => ({ ...prev, depth: value }));
                      }}
                      className={`w-full px-3 py-2 border ${dimensionErrors.depth ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      placeholder="0"
                      step="0.01"
                    />
                    {dimensionErrors.depth && (
                      <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors.depth}</p>
                    )}
                  </>
                )}
              </div>
              <select
                value={units.depth}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  const currentUnit = units.depth;
                  if (newUnit !== currentUnit) {
                    handleUnitChange('depth', currentUnit, newUnit);
                  }
                }}
                className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Volume needed - Auto-calculated */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Volume needed
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={volume.toFixed(4)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
              />
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value)}
                className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {volumeUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Density - Editable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Density
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={sandDensity}
                onChange={(e) => {
                  const value = e.target.value;
                  setDensityError('');
                  
                  if (value !== '' && parseFloat(value) < 0) {
                    setDensityError('Density cannot be negative');
                    return;
                  }
                  
                  setSandDensity(value);
                }}
                className={`flex-1 px-3 py-2 border ${densityError ? 'border-red-500' : 'border-blue-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                placeholder="1601.95"
                step="0.01"
              />
              <select
                value={densityUnit}
                onChange={(e) => handleDensityUnitChange(e.target.value)}
                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {densityUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {densityError && (
              <p className="text-red-500 text-xs mt-1">{densityError}</p>
            )}
          </div>

          {/* Weight needed - Auto-calculated */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Weight needed
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weight.toFixed(6)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {weightUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cost calculation section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 mr-2">💰</span>
            <h3 className="text-lg font-semibold text-slate-800">Sand cost</h3>
          </div>
          
          {/* Price per weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price per weight
            </label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <input
                type="number"
                value={pricePerWeight}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceWeightError('');
                  if (value !== '' && parseFloat(value) < 0) {
                    setPriceWeightError('Price cannot be negative');
                    return;
                  }
                  lastPriceEdit.current = 'weight';
                  setPricePerWeight(value);
                }}
                className={`flex-1 px-3 py-2 border ${priceWeightError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                placeholder="2.00"
                step="0.01"
              />
              <span className="px-3 py-2 text-slate-600">/</span>
              <select
                value={priceWeightUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (newUnit === priceWeightUnit) return;
                  // Convert the pricePerWeight value to the new unit
                  if (pricePerWeight && !isNaN(parseFloat(pricePerWeight))) {
                    const value = parseFloat(pricePerWeight);
                    // Convert from old unit to new unit (per 1 new unit)
                    // 1 oldUnit = x newUnit => pricePerWeight (per oldUnit) * (oldUnit in newUnit)
                    // But for price, we want to keep the same price for the same weight, so:
                    // pricePerWeight (per oldUnit) => pricePerWeight * (oldUnit in newUnit) (per newUnit)
                    // But for price, we want to keep the same price for the same weight, so:
                    // pricePerWeight (per oldUnit) => pricePerWeight * (oldUnit in newUnit) (per newUnit)
                    // But for price, we want to keep the same price for the same weight, so:
                    // pricePerWeight (per oldUnit) => pricePerWeight * (oldUnit in newUnit) (per newUnit)
                    // Actually, to convert price per oldUnit to price per newUnit:
                    // pricePerWeight (per oldUnit) * (1 newUnit in oldUnit) = price per newUnit
                    // So, convert 1 newUnit to oldUnit:
                    const convertWeight = (value: number, fromUnit: string, toUnit: string): number => {
                      let kg = 0;
                      switch (fromUnit) {
                        case 'g': kg = value / 1000; break;
                        case 'kg': kg = value; break;
                        case 't': kg = value * 1000; break;
                        case 'oz': kg = value * 0.0283495; break;
                        case 'lb': kg = value * 0.453592; break;
                        case 'st': kg = value * 6.35029; break;
                        case 'ton': kg = value * 907.18474; break;
                        case 'ton-uk': kg = value * 1016.0469088; break;
                        default: kg = value;
                      }
                      switch (toUnit) {
                        case 'g': return kg * 1000;
                        case 'kg': return kg;
                        case 't': return kg / 1000;
                        case 'oz': return kg / 0.0283495;
                        case 'lb': return kg / 0.453592;
                        case 'st': return kg / 6.35029;
                        case 'ton': return kg / 907.18474;
                        case 'ton-uk': return kg / 1016.0469088;
                        default: return kg;
                      }
                    };
                    // 1 newUnit in oldUnit:
                    const oneNewUnitInOldUnit = convertWeight(1, newUnit, priceWeightUnit);
                    const newPrice = value * oneNewUnitInOldUnit;
                    setPricePerWeight(newPrice.toString());
                  }
                  setPriceWeightUnit(newUnit);
                }}
                className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {weightUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {priceWeightError && (
              <p className="text-red-500 text-xs mt-1">{priceWeightError}</p>
            )}
          </div>

          {/* Price per volume */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price per volume
            </label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <input
                type="number"
                value={pricePerVolume}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceVolumeError('');
                  if (value !== '' && parseFloat(value) < 0) {
                    setPriceVolumeError('Price cannot be negative');
                    return;
                  }
                  lastPriceEdit.current = 'volume';
                  setPricePerVolume(value);
                }}
                className={`flex-1 px-3 py-2 border ${priceVolumeError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                placeholder="3.20"
                step="0.01"
              />
              <span className="px-3 py-2 text-slate-600">/</span>
              <select
                value={priceVolumeUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (newUnit === priceVolumeUnit) return;
                  // Only update the pricePerVolume field, do not affect total cost
                  if (pricePerVolume && !isNaN(parseFloat(pricePerVolume))) {
                    const value = parseFloat(pricePerVolume);
                    // pricePerVolume (per oldUnit) * (1 newUnit in oldUnit) = price per newUnit
                    let oneNewUnitInOldUnit = 1;
                    try {
                      oneNewUnitInOldUnit = convertVolume(1, newUnit, priceVolumeUnit);
                    } catch {}
                    const newPrice = value * oneNewUnitInOldUnit;
                    setPricePerVolume(newPrice.toString());
                  }
                  setPriceVolumeUnit(newUnit);
                }}
                className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {volumeUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {priceVolumeError && (
              <p className="text-red-500 text-xs mt-1">{priceVolumeError}</p>
            )}
          </div>

          {/* Total cost */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <label className="block text-lg font-medium text-slate-700 mb-1">
              Total cost
            </label>
            <div className="text-2xl font-bold text-green-600">
              {currency} {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 mt-4">
         
          <button
            onClick={clearAll}
            className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear all changes
          </button>
        </div>

     
      </div>
    </div>
  );
}
