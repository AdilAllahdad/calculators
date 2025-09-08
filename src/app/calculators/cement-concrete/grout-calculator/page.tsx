'use client'

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function GroutCalculator() {
  // State for area dimensions
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [lengthUnit, setLengthUnit] = useState<string>('m');
  const [widthUnit, setWidthUnit] = useState<string>('m');
  
  // For composite unit fields (feet/inches and meters/centimeters)
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    length: { whole: '', fraction: '' },
    width: { whole: '', fraction: '' },
    tileLength: { whole: '', fraction: '' },
    tileWidth: { whole: '', fraction: '' },
  });

  // State for tile dimensions
  const [tileLength, setTileLength] = useState<string>('');
  const [tileWidth, setTileWidth] = useState<string>('');
  const [tileLengthUnit, setTileLengthUnit] = useState<string>('m');
  const [tileWidthUnit, setTileWidthUnit] = useState<string>('m');
  const [totalAreaUnit, setTotalAreaUnit] = useState<string>('m²');
  const [tileAreaUnit, setTileAreaUnit] = useState<string>('m²');

  // State for gap details
  const [gapWidth, setGapWidth] = useState<string>('');
  const [gapDepth, setGapDepth] = useState<string>('');
  const [gapWidthUnit, setGapWidthUnit] = useState<string>('mm');
  const [gapDepthUnit, setGapDepthUnit] = useState<string>('mm');
  const [lastGapWidthUnit, setLastGapWidthUnit] = useState<string>('mm');
  const [lastGapDepthUnit, setLastGapDepthUnit] = useState<string>('mm');

  // State for grout material details
  const [showGroutDetails, setShowGroutDetails] = useState<boolean>(false);
  const [weightPerBag, setWeightPerBag] = useState<number>(1);
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  const [groutDensity, setGroutDensity] = useState<number>(1600);
  const [groutDensityUnit, setGroutDensityUnit] = useState<string>('kg/m³');
  const [dryMaterialPercentage, setDryMaterialPercentage] = useState<number>(50);

  // State for calculated results
  const [totalArea, setTotalArea] = useState<number>(0);
  const [groutVolume, setGroutVolume] = useState<number>(0);
  const [groutVolumeUnit, setGroutVolumeUnit] = useState<string>('cm³');
  const [groutWeight, setGroutWeight] = useState<number>(0);
  const [groutWeightUnit, setGroutWeightUnit] = useState<string>('kg');
  const [dryMaterialWeight, setDryMaterialWeight] = useState<number>(0);
  const [dryMaterialWeightUnit, setDryMaterialWeightUnit] = useState<string>('kg');
  const [bagsNeeded, setBagsNeeded] = useState<number>(0);

  const unitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  const areaUnitOptions = [
    { value: 'mm²', label: 'square millimeters (mm²)' },
    { value: 'cm²', label: 'square centimeters (cm²)' },
    { value: 'm²', label: 'square meters (m²)' },
    { value: 'in²', label: 'square inches (in²)' },
    { value: 'ft²', label: 'square feet (ft²)' },
    { value: 'yd²', label: 'square yards (yd²)' }
  ];

  const volumeUnitOptions = [
    { value: 'mm³', label: 'cubic millimeters (mm³)' },
    { value: 'cm³', label: 'cubic centimeters (cm³)' },
    { value: 'dm³', label: 'cubic decimeters (dm³)' },
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'in³', label: 'cubic inches (cu in)' },
    { value: 'ft³', label: 'cubic feet (cu ft)' },
    { value: 'yd³', label: 'cubic yards (cu yd)' },
    { value: 'ml', label: 'milliliters (ml)' },
    { value: 'cl', label: 'centiliters (cl)' },
    { value: 'l', label: 'liters (l)' },
    { value: 'gal_us', label: 'gallons (US) (US gal)' },
    { value: 'gal_uk', label: 'gallons (UK) (UK gal)' }
  ];

  const weightUnitOptions = [
    { value: 'mg', label: 'milligrams (mg)' },
    { value: 'g', label: 'grams (g)' },
    { value: 'kg', label: 'kilograms (kg)' },
    { value: 'lb', label: 'pounds (lb)' },
    { value: 'oz', label: 'ounces (oz)' }
  ];

  const densityUnitOptions = [
    { value: 'kg/m³', label: 'kilograms per cubic meter (kg/m³)' },
    { value: 'lb/ft³', label: 'pounds per cubic feet (lb/cu ft)' },
    { value: 'lb/yd³', label: 'pounds per cubic yard (lb/cu yd)' },
    { value: 'g/cm³', label: 'grams per cubic centimeter (g/cm³)' },
    { value: 'kg/cm³', label: 'kilograms per cubic centimeter (kg/cm³)' },
    { value: 'g/m³', label: 'grams per cubic meter (g/m³)' }
  ];

  const convertDensity = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return value;
    
    // First convert to kg/m³ (base unit)
    let baseValue: number;
    switch (fromUnit) {
      case 'kg/m³':
        baseValue = value;
        break;
      case 'lb/ft³':
        baseValue = value * 16.0185;
        break;
      case 'lb/yd³':
        baseValue = value * 0.593276;
        break;
      case 'g/cm³':
        baseValue = value * 1000;
        break;
      case 'kg/cm³':
        baseValue = value * 1000000;
        break;
      case 'g/m³':
        baseValue = value / 1000;
        break;
      default:
        return value;
    }

    // Convert from base unit (kg/m³) to target unit
    switch (toUnit) {
      case 'kg/m³':
        return baseValue;
      case 'lb/ft³':
        return baseValue / 16.0185;
      case 'lb/yd³':
        return baseValue / 0.593276;
      case 'g/cm³':
        return baseValue / 1000;
      case 'kg/cm³':
        return baseValue / 1000000;
      case 'g/m³':
        return baseValue * 1000;
      default:
        return value;
    }
  };

  const convertWeight = (value: number, fromUnit: string, toUnit: string): number => {
    // First convert to grams
    let grams: number;
    switch (fromUnit) {
      case 'mg': grams = value / 1000;
        break;
      case 'g': grams = value;
        break;
      case 'kg': grams = value * 1000;
        break;
      case 'lb': grams = value * 453.592;
        break;
      case 'oz': grams = value * 28.3495;
        break;
      default: grams = value;
    }

    // Then convert from grams to target unit
    switch (toUnit) {
      case 'mg': return grams * 1000;
      case 'g': return grams;
      case 'kg': return grams / 1000;
      case 'lb': return grams / 453.592;
      case 'oz': return grams / 28.3495;
      default: return grams;
    }
  };

  // Helper functions for unit conversion
  const convertToMeters = (value: number, unit: string): number => {
    switch (unit) {
      case 'mm': return value / 1000;
      case 'cm': return value / 100;
      case 'm': return value;
      case 'in': return value * 0.0254;
      case 'ft': return value * 0.3048;
      case 'yd': return value * 0.9144;
      default: return value;
    }
  };

  const convertToComposite = (value: number, fromUnit: string, toUnit: string): { whole: number; fraction: number } => {
    // Convert to meters first
    let valueInMeters = convertToMeters(value, fromUnit);
    
    if (toUnit === 'ft / in') {
      const totalInches = valueInMeters * 39.3701;
      return {
        whole: Math.floor(totalInches / 12),
        fraction: totalInches % 12
      };
    } else if (toUnit === 'm / cm') {
      return {
        whole: Math.floor(valueInMeters),
        fraction: (valueInMeters % 1) * 100
      };
    }
    return { whole: 0, fraction: 0 };
  };

  const convertFromComposite = (whole: number, fraction: number, fromUnit: string, toUnit: string): number => {
    let valueInMeters;
    if (fromUnit === 'ft / in') {
      valueInMeters = (whole * 12 + fraction) * 0.0254;
    } else if (fromUnit === 'm / cm') {
      valueInMeters = whole + (fraction / 100);
    } else {
      return 0;
    }
    
    return valueInMeters / convertToMeters(1, toUnit);
  };

  const convertBetweenComposites = (whole: number, fraction: number, fromUnit: string, toUnit: string): { whole: number; fraction: number } => {
    // Convert to meters first
    const valueInMeters = convertFromComposite(whole, fraction, fromUnit, 'm');
    // Then convert to target composite unit
    return convertToComposite(valueInMeters, 'm', toUnit);
  };

  const formatNumber = (num: number, options: { maximumFractionDigits: number; useCommas: boolean } = { maximumFractionDigits: 2, useCommas: true }): string => {
    if (isNaN(num)) return '';
    const formatted = num.toFixed(options.maximumFractionDigits);
    return options.useCommas ? formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : formatted;
  };

  const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
    // Convert to meters first
    let meters = convertToMeters(value, fromUnit);
    // Then convert from meters to target unit
    return meters / convertToMeters(1, toUnit);
  };

  const convertToMM = (value: number, unit: string): number => {
    switch (unit) {
      case 'mm': return value;
      case 'cm': return value * 10;
      case 'm': return value * 1000;
      case 'in': return value * 25.4;
      case 'ft': return value * 304.8;
      case 'yd': return value * 914.4;
      default: return value;
    }
  };

  const convertVolume = (value: number, fromUnit: string, toUnit: string): number => {
    // Convert to cubic meters first
    let valueInM3;
    switch (fromUnit) {
      case 'mm³': valueInM3 = value * 0.000000001;
        break;
      case 'cm³': valueInM3 = value * 0.000001;
        break;
      case 'dm³': valueInM3 = value * 0.001;
        break;
      case 'm³': valueInM3 = value;
        break;
      case 'in³': valueInM3 = value * 0.0000163871;
        break;
      case 'ft³': valueInM3 = value * 0.0283168;
        break;
      case 'yd³': valueInM3 = value * 0.764555;
        break;
      case 'ml': valueInM3 = value * 0.000001;
        break;
      case 'cl': valueInM3 = value * 0.00001;
        break;
      case 'l': valueInM3 = value * 0.001;
        break;
      case 'gal_us': valueInM3 = value * 0.00378541;
        break;
      case 'gal_uk': valueInM3 = value * 0.00454609;
        break;
      default: valueInM3 = value;
    }

    // Convert from cubic meters to target unit
    switch (toUnit) {
      case 'mm³': return valueInM3 * 1000000000;
      case 'cm³': return valueInM3 * 1000000;
      case 'dm³': return valueInM3 * 1000;
      case 'm³': return valueInM3;
      case 'in³': return valueInM3 * 61023.7;
      case 'ft³': return valueInM3 * 35.3147;
      case 'yd³': return valueInM3 * 1.30795;
      case 'ml': return valueInM3 * 1000000;
      case 'cl': return valueInM3 * 100000;
      case 'l': return valueInM3 * 1000;
      case 'gal_us': return valueInM3 * 264.172;
      case 'gal_uk': return valueInM3 * 219.969;
      default: return valueInM3;
    }
  };

  const convertArea = (value: number, fromUnit: string, toUnit: string): number => {
    // Convert to square meters first
    let valueInM2;
    switch (fromUnit) {
      case 'mm²': valueInM2 = value * 0.000001;
        break;
      case 'cm²': valueInM2 = value * 0.0001;
        break;
      case 'm²': valueInM2 = value;
        break;
      case 'in²': valueInM2 = value * 0.00064516;
        break;
      case 'ft²': valueInM2 = value * 0.092903;
        break;
      case 'yd²': valueInM2 = value * 0.836127;
        break;
      default: valueInM2 = value;
    }

    // Convert from square meters to target unit
    switch (toUnit) {
      case 'mm²': return valueInM2 * 1000000;
      case 'cm²': return valueInM2 * 10000;
      case 'm²': return valueInM2;
      case 'in²': return valueInM2 * 1550.003;
      case 'ft²': return valueInM2 * 10.76391;
      case 'yd²': return valueInM2 * 1.19599;
      default: return valueInM2;
    }
  };

  // Calculate area when dimensions change
  useEffect(() => {
    let lengthInM = 0;
    let widthInM = 0;
    let shouldCalculate = false;

    // Calculate length in meters
    if (lengthUnit === 'ft/in' || lengthUnit === 'm/cm') {
      const lengthWhole = compositeUnits.length?.whole;
      const lengthFraction = compositeUnits.length?.fraction;
      if (lengthWhole || lengthFraction) {
        const whole = parseFloat(lengthWhole || '0');
        const fraction = parseFloat(lengthFraction || '0');
        const sourceCompositeUnit = lengthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        lengthInM = convertFromComposite(whole, fraction, sourceCompositeUnit, 'm');
        shouldCalculate = true;
      }
    } else if (length) {
      lengthInM = convertToMeters(parseFloat(length), lengthUnit);
      shouldCalculate = true;
    }

    // Calculate width in meters
    if (widthUnit === 'ft/in' || widthUnit === 'm/cm') {
      const widthWhole = compositeUnits.width?.whole;
      const widthFraction = compositeUnits.width?.fraction;
      if (widthWhole || widthFraction) {
        const whole = parseFloat(widthWhole || '0');
        const fraction = parseFloat(widthFraction || '0');
        const sourceCompositeUnit = widthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        widthInM = convertFromComposite(whole, fraction, sourceCompositeUnit, 'm');
        shouldCalculate = shouldCalculate && true;
      }
    } else if (width) {
      widthInM = convertToMeters(parseFloat(width), widthUnit);
      shouldCalculate = shouldCalculate && true;
    }

    if (shouldCalculate) {
      const area = lengthInM * widthInM;
      setTotalArea(area);
      
      // Trigger recalculation of other values when area changes
      calculateResults(area);
    } else {
      setTotalArea(0);
      setGroutVolume(0);
      setGroutWeight(0);
      setDryMaterialWeight(0);
      setBagsNeeded(0);
    }
  }, [length, width, lengthUnit, widthUnit, compositeUnits]);

  // Recalculate when other inputs change
  useEffect(() => {
    if (gapWidth && gapDepth) {
      calculateResults(totalArea);
    }
  }, [tileLength, tileWidth, tileLengthUnit, tileWidthUnit, gapWidth, gapDepth, 
      gapWidthUnit, gapDepthUnit, groutDensity, dryMaterialPercentage, weightPerBag, totalArea, 
      compositeUnits.tileLength?.whole, compositeUnits.tileLength?.fraction,
      compositeUnits.tileWidth?.whole, compositeUnits.tileWidth?.fraction]);

  const calculateResults = (area: number) => {
    if (!tileLength || !tileWidth || !gapWidth || !gapDepth || area === 0) {
      return;
    }

    try {
      // Convert tile dimensions to meters
      let tileLengthInM = 0;
      let tileWidthInM = 0;

      // Calculate length in meters
      if (tileLengthUnit === 'ft/in' || tileLengthUnit === 'm/cm') {
        if (compositeUnits.tileLength?.whole || compositeUnits.tileLength?.fraction) {
          const lengthWhole = parseFloat(compositeUnits.tileLength.whole || '0');
          const lengthFraction = parseFloat(compositeUnits.tileLength.fraction || '0');
          const sourceLengthUnit = tileLengthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
          tileLengthInM = convertFromComposite(lengthWhole, lengthFraction, sourceLengthUnit, 'm');
        }
      } else if (tileLength) {
        tileLengthInM = convertToMeters(parseFloat(tileLength), tileLengthUnit);
      }

      // Calculate width in meters
      if (tileWidthUnit === 'ft/in' || tileWidthUnit === 'm/cm') {
        if (compositeUnits.tileWidth?.whole || compositeUnits.tileWidth?.fraction) {
          const widthWhole = parseFloat(compositeUnits.tileWidth.whole || '0');
          const widthFraction = parseFloat(compositeUnits.tileWidth.fraction || '0');
          const sourceWidthUnit = tileWidthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
          tileWidthInM = convertFromComposite(widthWhole, widthFraction, sourceWidthUnit, 'm');
        }
      } else if (tileWidth) {
        tileWidthInM = convertToMeters(parseFloat(tileWidth), tileWidthUnit);
      }
      // Convert gap measurements to millimeters for calculations
      const gapWidthInMM = convertToMM(parseFloat(gapWidth), gapWidthUnit);
      const gapDepthInMM = convertToMM(parseFloat(gapDepth), gapDepthUnit);

      // Convert to meters for the area calculation
      const gapWidthInM = gapWidthInMM / 1000;
      const gapDepthInM = gapDepthInMM / 1000;

      // Calculate ratio of tile area to total area including gaps
      const R = (tileLengthInM * tileWidthInM) / 
                ((tileLengthInM + gapWidthInM) * (tileWidthInM + gapWidthInM));
      
      // Calculate grout area
      const groutArea = area - (area * R);

      // Calculate grout volume in cubic meters
      const volumeInCubicMeters = groutArea * gapDepthInM;
      setGroutVolume(volumeInCubicMeters);

      // Calculate total grout weight
      const densityInKgM3 = convertDensity(groutDensity, groutDensityUnit, 'kg/m³');
      const totalGroutWeight = volumeInCubicMeters * densityInKgM3;
      setGroutWeight(totalGroutWeight);

      // Calculate dry material weight
      const dryWeight = totalGroutWeight * (dryMaterialPercentage / 100);
      setDryMaterialWeight(dryWeight);

      // Calculate number of bags needed
      if (weightPerBag > 0) {
        setBagsNeeded(Math.ceil(dryWeight / weightPerBag));
      } else {
        setBagsNeeded(0);
      }
    } catch (error) {
      console.error('Error in calculations:', error);
      setGroutVolume(0);
      setGroutWeight(0);
      setDryMaterialWeight(0);
      setBagsNeeded(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Grout Calculator</h1>
      
      {/* Area to be tiled */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Area to be tiled</h2>
          <Info className="text-gray-400" size={20} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length of the area (L)
            </label>
            <div className="flex gap-2">
              {(lengthUnit === 'ft/in' || lengthUnit === 'm/cm') ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${lengthUnit === 'ft/in' ? 'ft' : 'm'}`}
                      value={compositeUnits.length.whole}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          length: { ...prev.length, whole: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="1"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{lengthUnit === 'ft/in' ? 'ft' : 'm'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${lengthUnit === 'ft/in' ? 'in' : 'cm'}`}
                      value={compositeUnits.length.fraction}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          length: { ...prev.length, fraction: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{lengthUnit === 'ft/in' ? 'in' : 'cm'}</span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              )}
              <select
                value={lengthUnit}
                onChange={(e) => {
                  const oldUnit = lengthUnit;
                  const newUnit = e.target.value;
                  
                  // Don't do anything if units are the same
                  if (oldUnit === newUnit) return;

                  // Update the unit first
                  setLengthUnit(newUnit);

                  // Check if we have any value to convert
                  const hasRegularValue = length && !isNaN(parseFloat(length));
                  const hasCompositeValue = (compositeUnits.length.whole && !isNaN(parseFloat(compositeUnits.length.whole))) || 
                                         (compositeUnits.length.fraction && !isNaN(parseFloat(compositeUnits.length.fraction)));

                  // If no value exists, just return (unit is already updated)
                  if (!hasRegularValue && !hasCompositeValue) return;

                  try {
                    // Case 1: Converting FROM single unit TO composite unit
                    if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(length);
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertToComposite(value, oldUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        length: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                      
                      setLength('');
                    }
                    
                    // Case 2: Converting FROM composite unit TO single unit
                    else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.length.whole || '0');
                      const fraction = parseFloat(compositeUnits.length.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setLength(formattedValue);
                      setCompositeUnits(prev => ({
                        ...prev,
                        length: { whole: '', fraction: '' }
                      }));
                    }
                    
                    // Case 3: Converting BETWEEN composite units (ft/in ↔ m/cm)
                    else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.length.whole || '0');
                      const fraction = parseFloat(compositeUnits.length.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        length: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                    }
                    
                    // Case 4: Converting BETWEEN single units
                    else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(length);
                      const convertedValue = convertLength(value, oldUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setLength(formattedValue);
                    }
                  } catch (error) {
                    console.error('Conversion error:', error);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width of the area (W)
            </label>
            <div className="flex gap-2">
              {(widthUnit === 'ft/in' || widthUnit === 'm/cm') ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${widthUnit === 'ft/in' ? 'ft' : 'm'}`}
                      value={compositeUnits.width.whole}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          width: { ...prev.width, whole: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="1"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{widthUnit === 'ft/in' ? 'ft' : 'm'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${widthUnit === 'ft/in' ? 'in' : 'cm'}`}
                      value={compositeUnits.width.fraction}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          width: { ...prev.width, fraction: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{widthUnit === 'ft/in' ? 'in' : 'cm'}</span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              )}
              <select
                value={widthUnit}
                onChange={(e) => {
                  const oldUnit = widthUnit;
                  const newUnit = e.target.value;
                  
                  // Don't do anything if units are the same
                  if (oldUnit === newUnit) return;

                  // Update the unit first
                  setWidthUnit(newUnit);

                  // Check if we have any value to convert
                  const hasRegularValue = width && !isNaN(parseFloat(width));
                  const hasCompositeValue = (compositeUnits.width.whole && !isNaN(parseFloat(compositeUnits.width.whole))) || 
                                         (compositeUnits.width.fraction && !isNaN(parseFloat(compositeUnits.width.fraction)));

                  // If no value exists, just return (unit is already updated)
                  if (!hasRegularValue && !hasCompositeValue) return;

                  try {
                    // Case 1: Converting FROM single unit TO composite unit
                    if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(width);
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertToComposite(value, oldUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        width: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                      
                      setWidth('');
                    }
                    
                    // Case 2: Converting FROM composite unit TO single unit
                    else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.width.whole || '0');
                      const fraction = parseFloat(compositeUnits.width.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setWidth(formattedValue);
                      setCompositeUnits(prev => ({
                        ...prev,
                        width: { whole: '', fraction: '' }
                      }));
                    }
                    
                    // Case 3: Converting BETWEEN composite units (ft/in ↔ m/cm)
                    else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.width.whole || '0');
                      const fraction = parseFloat(compositeUnits.width.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        width: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                    }
                    
                    // Case 4: Converting BETWEEN single units
                    else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(width);
                      const convertedValue = convertLength(value, oldUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setWidth(formattedValue);
                    }
                  } catch (error) {
                    console.error('Conversion error:', error);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total area to be tiled
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {convertArea(totalArea, 'm²', totalAreaUnit).toFixed(2)}
              </div>
              <select
                value={totalAreaUnit}
                onChange={(e) => setTotalAreaUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {areaUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tile details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Tile details</h2>
          <Info className="text-gray-400" size={20} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length of tile (l)
            </label>
            <div className="flex gap-2">
              {(tileLengthUnit === 'ft/in' || tileLengthUnit === 'm/cm') ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${tileLengthUnit === 'ft/in' ? 'ft' : 'm'}`}
                      value={compositeUnits.tileLength?.whole}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          tileLength: { ...prev.tileLength, whole: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="1"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{tileLengthUnit === 'ft/in' ? 'ft' : 'm'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${tileLengthUnit === 'ft/in' ? 'in' : 'cm'}`}
                      value={compositeUnits.tileLength?.fraction}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          tileLength: { ...prev.tileLength, fraction: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{tileLengthUnit === 'ft/in' ? 'in' : 'cm'}</span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={tileLength}
                  onChange={(e) => setTileLength(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              )}
              <select
                value={tileLengthUnit}
                onChange={(e) => {
                  const oldUnit = tileLengthUnit;
                  const newUnit = e.target.value;
                  
                  if (oldUnit === newUnit) return;
                  setTileLengthUnit(newUnit);

                  const hasRegularValue = tileLength && !isNaN(parseFloat(tileLength));
                  const hasCompositeValue = (compositeUnits.tileLength?.whole && !isNaN(parseFloat(compositeUnits.tileLength.whole))) || 
                                         (compositeUnits.tileLength?.fraction && !isNaN(parseFloat(compositeUnits.tileLength.fraction)));

                  if (!hasRegularValue && !hasCompositeValue) return;

                  try {
                    if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(tileLength);
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertToComposite(value, oldUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileLength: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                      
                      setTileLength('');
                    } else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.tileLength?.whole || '0');
                      const fraction = parseFloat(compositeUnits.tileLength?.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setTileLength(formattedValue);
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileLength: { whole: '', fraction: '' }
                      }));
                    } else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.tileLength?.whole || '0');
                      const fraction = parseFloat(compositeUnits.tileLength?.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileLength: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                    } else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(tileLength);
                      const convertedValue = convertLength(value, oldUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setTileLength(formattedValue);
                    }
                  } catch (error) {
                    console.error('Conversion error:', error);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width of tile (w)
            </label>
            <div className="flex gap-2">
              {(tileWidthUnit === 'ft/in' || tileWidthUnit === 'm/cm') ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${tileWidthUnit === 'ft/in' ? 'ft' : 'm'}`}
                      value={compositeUnits.tileWidth?.whole}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          tileWidth: { ...prev.tileWidth, whole: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="1"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{tileWidthUnit === 'ft/in' ? 'ft' : 'm'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="number"
                      placeholder={`0 ${tileWidthUnit === 'ft/in' ? 'in' : 'cm'}`}
                      value={compositeUnits.tileWidth?.fraction}
                      onChange={(e) => {
                        setCompositeUnits(prev => ({
                          ...prev,
                          tileWidth: { ...prev.tileWidth, fraction: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">{tileWidthUnit === 'ft/in' ? 'in' : 'cm'}</span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={tileWidth}
                  onChange={(e) => setTileWidth(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              )}
              <select
                value={tileWidthUnit}
                onChange={(e) => {
                  const oldUnit = tileWidthUnit;
                  const newUnit = e.target.value;
                  
                  if (oldUnit === newUnit) return;
                  setTileWidthUnit(newUnit);

                  const hasRegularValue = tileWidth && !isNaN(parseFloat(tileWidth));
                  const hasCompositeValue = (compositeUnits.tileWidth?.whole && !isNaN(parseFloat(compositeUnits.tileWidth.whole))) || 
                                         (compositeUnits.tileWidth?.fraction && !isNaN(parseFloat(compositeUnits.tileWidth.fraction)));

                  if (!hasRegularValue && !hasCompositeValue) return;

                  try {
                    if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(tileWidth);
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertToComposite(value, oldUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileWidth: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                      
                      setTileWidth('');
                    } else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.tileWidth?.whole || '0');
                      const fraction = parseFloat(compositeUnits.tileWidth?.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setTileWidth(formattedValue);
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileWidth: { whole: '', fraction: '' }
                      }));
                    } else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
                      if (!hasCompositeValue) return;
                      
                      const whole = parseFloat(compositeUnits.tileWidth?.whole || '0');
                      const fraction = parseFloat(compositeUnits.tileWidth?.fraction || '0');
                      const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                      
                      const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
                      
                      setCompositeUnits(prev => ({
                        ...prev,
                        tileWidth: {
                          whole: Math.floor(result.whole).toString(),
                          fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
                        }
                      }));
                    } else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
                      if (!hasRegularValue) return;
                      
                      const value = parseFloat(tileWidth);
                      const convertedValue = convertLength(value, oldUnit, newUnit);
                      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
                      
                      setTileWidth(formattedValue);
                    }
                  } catch (error) {
                    console.error('Conversion error:', error);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area covered by a single tile
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {(() => {
                let tileLengthInM = 0;
                let tileWidthInM = 0;
                let areaValue = 0;

                // Calculate length in meters
                if (tileLengthUnit === 'ft/in' || tileLengthUnit === 'm/cm') {
                  if (compositeUnits.tileLength?.whole || compositeUnits.tileLength?.fraction) {
                    const lengthWhole = parseFloat(compositeUnits.tileLength.whole || '0');
                    const lengthFraction = parseFloat(compositeUnits.tileLength.fraction || '0');
                    const sourceLengthUnit = tileLengthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                    tileLengthInM = convertFromComposite(lengthWhole, lengthFraction, sourceLengthUnit, 'm');
                  }
                } else if (tileLength) {
                  tileLengthInM = convertToMeters(parseFloat(tileLength), tileLengthUnit);
                }

                // Calculate width in meters
                if (tileWidthUnit === 'ft/in' || tileWidthUnit === 'm/cm') {
                  if (compositeUnits.tileWidth?.whole || compositeUnits.tileWidth?.fraction) {
                    const widthWhole = parseFloat(compositeUnits.tileWidth.whole || '0');
                    const widthFraction = parseFloat(compositeUnits.tileWidth.fraction || '0');
                    const sourceWidthUnit = tileWidthUnit === 'ft/in' ? 'ft / in' : 'm / cm';
                    tileWidthInM = convertFromComposite(widthWhole, widthFraction, sourceWidthUnit, 'm');
                  }
                } else if (tileWidth) {
                  tileWidthInM = convertToMeters(parseFloat(tileWidth), tileWidthUnit);
                }

                // Calculate area only if we have both dimensions
                if (tileLengthInM > 0 && tileWidthInM > 0) {
                  areaValue = tileLengthInM * tileWidthInM;
                }

                const displayValue = convertArea(areaValue, 'm²', tileAreaUnit);
                return formatNumber(displayValue, { maximumFractionDigits: 4, useCommas: true });
              })()}
              </div>
              <select
                value={tileAreaUnit}
                onChange={(e) => setTileAreaUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {areaUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gap details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Gap details</h2>
          <Info className="text-gray-400" size={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gap width (g)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={gapWidth}
                onChange={(e) => setGapWidth(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
              <select
                value={gapWidthUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (gapWidth) {
                    // Convert the current value from the old unit to the new unit
                    const valueInMM = convertToMM(parseFloat(gapWidth), lastGapWidthUnit);
                    const newValue = (newUnit === 'mm' ? valueInMM :
                                    newUnit === 'cm' ? valueInMM / 10 :
                                    newUnit === 'm' ? valueInMM / 1000 :
                                    newUnit === 'in' ? valueInMM / 25.4 : valueInMM).toFixed(3);
                    setGapWidth(newValue);
                  }
                  setGapWidthUnit(newUnit);
                  setLastGapWidthUnit(newUnit);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gap depth
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={gapDepth}
                onChange={(e) => setGapDepth(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
              <select
                value={gapDepthUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (gapDepth) {
                    // Convert the current value from the old unit to the new unit
                    const valueInMM = convertToMM(parseFloat(gapDepth), lastGapDepthUnit);
                    const newValue = (newUnit === 'mm' ? valueInMM :
                                    newUnit === 'cm' ? valueInMM / 10 :
                                    newUnit === 'm' ? valueInMM / 1000 :
                                    newUnit === 'in' ? valueInMM / 25.4 : valueInMM).toFixed(3);
                    setGapDepth(newValue);
                  }
                  setGapDepthUnit(newUnit);
                  setLastGapDepthUnit(newUnit);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grout requirements */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Grout requirements</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grout volume
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {convertVolume(groutVolume, 'm³', groutVolumeUnit).toFixed(2)}
              </div>
              <select
                value={groutVolumeUnit}
                onChange={(e) => setGroutVolumeUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {volumeUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight per bag
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weightPerBag}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  setWeightPerBag(newValue);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
              />
              <select
                value={weightUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  const convertedValue = convertWeight(weightPerBag, weightUnit, newUnit);
                  setWeightPerBag(convertedValue);
                  setWeightUnit(newUnit);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {weightUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of bags needed
            </label>
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {bagsNeeded} bags
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={showGroutDetails}
              onChange={(e) => setShowGroutDetails(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">Show grout material details</label>
          </div>

          {showGroutDetails && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grout density
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={groutDensity}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      setGroutDensity(newValue);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                  />
                  <select
                    value={groutDensityUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      const convertedValue = convertDensity(groutDensity, groutDensityUnit, newUnit);
                      setGroutDensity(convertedValue);
                      setGroutDensityUnit(newUnit);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {densityUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grout weight
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {formatNumber(convertWeight(groutWeight, 'kg', groutWeightUnit), { maximumFractionDigits: 4, useCommas: true })}
                  </div>
                  <select
                    value={groutWeightUnit}
                    onChange={(e) => {
                      setGroutWeightUnit(e.target.value);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  >
                    {weightUnitOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dry material percentage
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={dryMaterialPercentage}
                    onChange={(e) => setDryMaterialPercentage(parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    %
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dry material weight
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {formatNumber(convertWeight(dryMaterialWeight, 'kg', dryMaterialWeightUnit), { maximumFractionDigits: 4, useCommas: true })}
                  </div>
                  <select
                    value={dryMaterialWeightUnit}
                    onChange={(e) => {
                      setDryMaterialWeightUnit(e.target.value);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
          )}
        </div>
      </div>
    </div>
  );
}
