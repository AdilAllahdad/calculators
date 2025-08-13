'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Share2, RefreshCcw } from '@/components/icons';
import { formatNumber, validatePositiveNumber } from '@/lib/utils';

// Simple utility to conditionally join classNames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define unit conversion factors
const lengthUnits = [
  { label: "millimeters (mm)", value: "mm", factor: 0.1 },
  { label: "centimeters (cm)", value: "cm", factor: 1 },
  { label: "meters (m)", value: "m", factor: 100 },
  { label: "inches (in)", value: "in", factor: 2.54 },
  { label: "feet (ft)", value: "ft", factor: 30.48 },
  { label: "yards (yd)", value: "yd", factor: 91.44 },
  { label: "feet / inches (ft / in)", value: "ft/in", factor: 30.48 },
  { label: "meters / centimeters (m / cm)", value: "m/cm", factor: 100 }
];

const volumeUnits = [
  { label: "cubic millimeters (mm³)", value: "mm³", factor: 0.001 },
  { label: "cubic centimeters (cm³)", value: "cm³", factor: 1 },
  { label: "cubic decimeters (dm³)", value: "dm³", factor: 1000 },
  { label: "cubic meters (m³)", value: "m³", factor: 1000000 },
  { label: "cubic inches (cu in)", value: "cu in", factor: 16.387 },
  { label: "cubic feet (cu ft)", value: "cu ft", factor: 28316.846 },
  { label: "cubic yards (cu yd)", value: "cu yd", factor: 764554.858 },
  { label: "liters (l)", value: "l", factor: 1000 }
];

const densityUnits = [
  { label: "tons per cubic meter (t/m³)", value: "t/m³", factor: 1000 },
  { label: "kilograms per cubic meter (kg/m³)", value: "kg/m³", factor: 1 },
  { label: "kilograms per liter (kg/L)", value: "kg/L", factor: 1000 },
  { label: "grams per liter (g/L)", value: "g/L", factor: 1 },
  { label: "grams per milliliter (g/mL)", value: "g/mL", factor: 1000 },
  { label: "grams per cubic centimeter (g/cm³)", value: "g/cm³", factor: 1000 },
  { label: "ounces per cubic inch (oz/cu in)", value: "oz/cu in", factor: 1729.994 },
  { label: "pounds per cubic inch (lb/cu in)", value: "lb/cu in", factor: 27679.904 },
  { label: "pounds per cubic feet (lb/cu ft)", value: "lb/cu ft", factor: 16.018 },
  { label: "pounds per cubic yard (lb/cu yd)", value: "lb/cu yd", factor: 0.593 },
  { label: "pounds per gallon (US) (lb/US gal)", value: "lb/US gal", factor: 119.826 },
  { label: "pounds per gallon (UK) (lb/UK gal)", value: "lb/UK gal", factor: 99.776 }
];

const weightUnits = [
  { label: "micrograms (μg)", value: "μg", factor: 0.000001 },
  { label: "milligrams (mg)", value: "mg", factor: 0.001 },
  { label: "grams (g)", value: "g", factor: 1 },
  { label: "decagrams (dag)", value: "dag", factor: 10 },
  { label: "kilograms (kg)", value: "kg", factor: 1000 },
  { label: "metric tons (t)", value: "t", factor: 1000000 },
  { label: "grains (gr)", value: "gr", factor: 0.0648 },
  { label: "drachms (dr)", value: "dr", factor: 1.772 },
  { label: "ounces (oz)", value: "oz", factor: 28.35 },
  { label: "pounds (lb)", value: "lb", factor: 453.592 },
  { label: "stones (st)", value: "st", factor: 6350.29 },
  { label: "US short tons (US ton)", value: "US ton", factor: 907184.74 },
  { label: "imperial tons (long ton)", value: "long ton", factor: 1016046.91 }
];

export default function SizeToWeightCalculator() {
  // State for form values
  const [expanded, setExpanded] = useState({
    size: true,
    weight: true
  });
  
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [density, setDensity] = useState<string>('');
  
  const [lengthUnit, setLengthUnit] = useState<string>('cm');
  const [widthUnit, setWidthUnit] = useState<string>('cm');
  const [heightUnit, setHeightUnit] = useState<string>('cm');
  const [volumeUnit, setVolumeUnit] = useState<string>('cm³');
  const [densityUnit, setDensityUnit] = useState<string>('kg/m³');
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  
  const [volume, setVolume] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [problemSolved, setProblemSolved] = useState<boolean | null>(null);
  
  // Helper function to convert length to cm
  const convertToCm = (value: string, unit: string) => {
    if (!value) return 0;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;
    
    const selectedUnit = lengthUnits.find(u => u.value === unit);
    return numValue * (selectedUnit?.factor || 1);
  };
  
  // Helper function to convert between length units
  const convertLength = (value: string, fromUnit: string, toUnit: string): string => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    const fromUnitObj = lengthUnits.find(u => u.value === fromUnit);
    const toUnitObj = lengthUnits.find(u => u.value === toUnit);
    
    if (!fromUnitObj || !toUnitObj) return value;
    
    // Convert to cm then to target unit
    const valueInCm = numValue * (fromUnitObj.factor || 1);
    const convertedValue = valueInCm / (toUnitObj.factor || 1);
    
    return convertedValue.toFixed(4).replace(/\.?0+$/, '');
  };
  
  // Helper function to convert between density units
  const convertDensity = (value: string, fromUnit: string, toUnit: string): string => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    const fromUnitObj = densityUnits.find(u => u.value === fromUnit);
    const toUnitObj = densityUnits.find(u => u.value === toUnit);
    
    if (!fromUnitObj || !toUnitObj) return value;
    
    // Convert to kg/m³ then to target unit
    const valueInKgM3 = numValue * (fromUnitObj.factor || 1);
    const convertedValue = valueInKgM3 / (toUnitObj.factor || 1);
    
    return convertedValue.toFixed(4).replace(/\.?0+$/, '');
  };
  
  // Calculate volume when dimensions or units change
  useEffect(() => {
    if (length && width && height) {
      // Convert all dimensions to cm
      const lengthInCm = convertToCm(length, lengthUnit);
      const widthInCm = convertToCm(width, widthUnit);
      const heightInCm = convertToCm(height, heightUnit);
      
      // Calculate volume in cubic cm
      const volumeInCm3 = lengthInCm * widthInCm * heightInCm;
      
      // Convert to selected volume unit
      const selectedVolumeUnit = volumeUnits.find(u => u.value === volumeUnit);
      const convertedVolume = volumeInCm3 / (selectedVolumeUnit?.factor || 1);
      
      setVolume(convertedVolume);
    } else {
      setVolume(null);
    }
  }, [length, width, height, lengthUnit, widthUnit, heightUnit, volumeUnit]);
  
  // Calculate weight when volume, density, or any unit changes
  useEffect(() => {
    if (volume !== null && density) {
      const densityValue = parseFloat(density);
      if (isNaN(densityValue)) {
        setWeight(null);
        return;
      }
      
      // Convert volume to m³
      const selectedVolumeUnit = volumeUnits.find(u => u.value === volumeUnit);
      const volumeInCm3 = volume * (selectedVolumeUnit?.factor || 1);
      const volumeInM3 = volumeInCm3 / 1000000;
      
      // Convert density to kg/m³
      const selectedDensityUnit = densityUnits.find(u => u.value === densityUnit);
      const densityInKgM3 = densityValue * (selectedDensityUnit?.factor || 1);
      
      // Calculate weight in kg
      const weightInKg = volumeInM3 * densityInKgM3;
      
      // Convert to selected weight unit
      const selectedWeightUnit = weightUnits.find(u => u.value === weightUnit);
      const convertedWeight = weightInKg * 1000 / (selectedWeightUnit?.factor || 1);
      
      setWeight(convertedWeight);
    } else {
      setWeight(null);
    }
  }, [volume, density, densityUnit, volumeUnit, weightUnit]);
  
  // Toggle sections
  const toggleSection = (section: 'size' | 'weight') => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Reset calculator
  const resetCalculator = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setDensity('');
    setVolume(null);
    setWeight(null);
    setProblemSolved(null);
  };
  
  // Clear all changes
  const clearAllChanges = () => {
    resetCalculator();
  };
  
  // Handle feedback
  const handleFeedback = (solved: boolean) => {
    setProblemSolved(solved);
  };
  
  // Format number for display
  const formatDisplayNumber = (num: number | null): string => {
    if (num === null) return '';
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center">
        Size to Weight Calculator
        <span className="ml-3 text-2xl">📋</span>
      </h1>
      
      <p className="text-slate-700 mb-8">
        Calculate the weight of objects based on their dimensions and material density. Perfect for estimating shipping weights, material quantities, and construction planning.
      </p>
      
      <div className="space-y-6">
        {/* Size Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
          >
            <div className="flex items-center">
              <div className={cn(
                "w-6 h-6 flex items-center justify-center transition-transform",
                expanded.size ? "transform rotate-180" : ""
              )}>
                {expanded.size ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-blue-500" />}
              </div>
              <h2 className="ml-2 text-xl font-semibold">Size</h2>
            </div>
          </button>
          
          {expanded.size && (
            <div className="px-4 pb-4 pt-2 space-y-4">
              {/* Length */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Length</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="block w-full rounded-l-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={lengthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert length value from old unit to new unit
                        if (length) {
                          const convertedValue = convertLength(length, lengthUnit, newUnit);
                          setLength(convertedValue);
                        }
                        setLengthUnit(newUnit);
                      }}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {lengthUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Width */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Width</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="block w-full rounded-l-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={widthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert width value from old unit to new unit
                        if (width) {
                          const convertedValue = convertLength(width, widthUnit, newUnit);
                          setWidth(convertedValue);
                        }
                        setWidthUnit(newUnit);
                      }}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {lengthUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Height */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="block w-full rounded-l-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={heightUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert height value from old unit to new unit
                        if (height) {
                          const convertedValue = convertLength(height, heightUnit, newUnit);
                          setHeight(convertedValue);
                        }
                        setHeightUnit(newUnit);
                      }}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {lengthUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Volume */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Volume</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={volume !== null ? formatDisplayNumber(volume) : ''}
                    readOnly
                    className="block w-full rounded-l-lg border-slate-300 bg-slate-50 shadow-sm"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={volumeUnit}
                      onChange={(e) => setVolumeUnit(e.target.value)}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {volumeUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Weight Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => toggleSection('weight')}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
          >
            <div className="flex items-center">
              <div className={cn(
                "w-6 h-6 flex items-center justify-center transition-transform",
                expanded.weight ? "transform rotate-180" : ""
              )}>
                {expanded.weight ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-blue-500" />}
              </div>
              <h2 className="ml-2 text-xl font-semibold">Weight</h2>
            </div>
          </button>
          
          {expanded.weight && (
            <div className="px-4 pb-4 pt-2 space-y-4">
              {/* Density */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Density</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    className="block w-full rounded-l-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={densityUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert density value from old unit to new unit
                        if (density) {
                          const convertedValue = convertDensity(density, densityUnit, newUnit);
                          setDensity(convertedValue);
                        }
                        setDensityUnit(newUnit);
                      }}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {densityUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Weight */}
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <div className="text-slate-400">...</div>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={weight !== null ? formatDisplayNumber(weight) : ''}
                    readOnly
                    className="block w-full rounded-l-lg border-slate-300 bg-slate-50 shadow-sm"
                    placeholder="0"
                  />
                  <div className="relative">
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="h-full py-0 pl-2 pr-7 border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {weightUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-2 border-t border-slate-200">
                <button
                  className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-lg flex-1"
                  onClick={() => {}}>
                  <Share2 size={20} />
                  <span className="font-medium">Share result</span>
                </button>
                
                <div className="flex flex-col gap-2 flex-1">
                  <button
                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-lg"
                    onClick={resetCalculator}>
                    <RefreshCcw size={16} />
                    <span className="font-medium">Reload calculator</span>
                  </button>
                  <button
                    className="text-slate-400 hover:text-slate-600 text-sm"
                    onClick={clearAllChanges}>
                    Clear all changes
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 text-sm">
                <p className="text-slate-600">Did we solve your problem today?</p>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded ${problemSolved === true ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    onClick={() => handleFeedback(true)}>
                    Yes
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${problemSolved === false ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    onClick={() => handleFeedback(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 text-sm">
            Check out <span className="font-medium text-blue-600 hover:underline">6 similar</span> construction converters
          </p>
        </div>
      </div>
    </div>
  );
}
