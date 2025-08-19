'use client';

import { useState, useEffect } from 'react';

// Update type definitions at the top
type SingleUnitType = 'mm' | 'cm' | 'm' | 'in' | 'ft';
type DualUnitType = 'ft/in' | 'm/cm';
type UnitType = SingleUnitType | DualUnitType;
type ConversionMap = Record<UnitType, number>;

// Helper functions for type safety
const isSingleUnit = (unit: UnitType): unit is SingleUnitType => {
  return ['mm', 'cm', 'm', 'in', 'ft'].includes(unit);
};

const isDualUnit = (unit: UnitType): unit is DualUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isUnitType = (value: string): value is UnitType => {
  return ['mm', 'cm', 'm', 'in', 'ft', 'ft/in', 'm/cm'].includes(value);
};

// Safe conversion helper
const getSafeConversionFactor = (unit: UnitType, conversions: ConversionMap): number => {
  return conversions[unit] || 1;
};

const handleUnitConversion = (
  currentUnit: UnitType,
  newUnit: UnitType,
  value: string,
  conversionTable: ConversionMap
): number => {
  if (!value) return 0;
  const numValue = Number(value);
  if (isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

const lengthConversions: ConversionMap = {
  'mm': 0.0393701 / 12,
  'cm': 0.393701 / 12,
  'm': 3.28084,
  'in': 1/12,
  'ft': 1,
  'ft/in': 1,
  'm/cm': 3.28084
};

const dimensionConversions: ConversionMap = {
  'mm': 0.0393701,
  'cm': 0.393701,
  'm': 39.3701,
  'in': 1,
  'ft': 12,
  'ft/in': 1,
  'm/cm': 39.3701
};

const convertFtInToMCm = (feet: string, inches: string) => {
  const totalFeet = Number(feet || 0);
  const totalInches = Number(inches || 0);
  const totalMeters = (totalFeet * 0.3048) + (totalInches * 0.0254);
  const meters = Math.floor(totalMeters);
  const centimeters = Math.round((totalMeters - meters) * 100);
  return { meters, centimeters };
};

const convertMCmToFtIn = (meters: string, centimeters: string) => {
  const totalMeters = Number(meters || 0) + (Number(centimeters || 0) / 100);
  const totalInches = totalMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Number((totalInches % 12).toFixed(2));
  return { feet, inches };
};

export default function BoardFootCalculator() {
  const [numPieces, setNumPieces] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [thicknessUnit, setThicknessUnit] = useState<UnitType>('in');
  // Add for ft/in and m/cm
  const [thicknessFeet, setThicknessFeet] = useState<string>('');
  const [thicknessInches, setThicknessInches] = useState<string>('');
  const [thicknessMeters, setThicknessMeters] = useState<string>('');
  const [thicknessCentimeters, setThicknessCentimeters] = useState<string>('');
  // Add for ft/in and m/cm for width
  const [width, setWidth] = useState<string>('');
  const [widthUnit, setWidthUnit] = useState<UnitType>('in');
  const [widthFeet, setWidthFeet] = useState<string>('');
  const [widthInches, setWidthInches] = useState<string>('');
  const [widthMeters, setWidthMeters] = useState<string>('');
  const [widthCentimeters, setWidthCentimeters] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [lengthUnit, setLengthUnit] = useState<UnitType>('ft');
  const [lengthFeet, setLengthFeet] = useState<string>('');
  const [lengthInches, setLengthInches] = useState<string>('');
  // For m/cm dual unit
  const [lengthMeters, setLengthMeters] = useState<string>('');
  const [lengthCentimeters, setLengthCentimeters] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<string>('PKR');
  
  // Error states for each input field
  const [numPiecesError, setNumPiecesError] = useState<string>('');
  const [thicknessError, setThicknessError] = useState<string>('');
  const [widthError, setWidthError] = useState<string>('');
  const [lengthFeetError, setLengthFeetError] = useState<string>('');
  const [lengthInchesError, setLengthInchesError] = useState<string>('');
  const [lengthMetersError, setLengthMetersError] = useState<string>('');
  const [lengthCentimetersError, setLengthCentimetersError] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  
  const [totalBoardFeet, setTotalBoardFeet] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    calculateBoardFeet();
  }, [
    numPieces, 
    thickness, thicknessUnit, thicknessFeet, thicknessInches, thicknessMeters, thicknessCentimeters,
    width, widthUnit, widthFeet, widthInches, widthMeters, widthCentimeters,
    length, lengthUnit, lengthFeet, lengthInches, lengthMeters, lengthCentimeters, 
    price
  ]);

  const handleNumberInput = (
    value: string, 
    setter: (val: string) => void,
    errorSetter: (error: string) => void
  ) => {
    // Clear previous error
    errorSetter('');
    
    // Allow empty string
    if (value === '') {
      setter('');
      return;
    }
    
    // Check if value is negative
    const numValue = Number(value);
    if (numValue < 0) {
      errorSetter("Negative values are not allowed");
      setter('');
      return;
    }
    
    // If it's a valid non-negative number, set it
    setter(value);
  };

  const handleFocus = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
    if (currentValue !== '') {
      e.target.select();
    }
  };
  
  // Function to handle unit changes with value conversion
  const handleUnitChange = (
    value: string, 
    oldUnit: UnitType, 
    newUnitValue: string, 
    setter: (val: string) => void, 
    conversionTable: ConversionMap
  ) => {
    if (!isUnitType(newUnitValue)) return;
    const newUnit = newUnitValue;
    
    if (!value || value === '') {
      setter('');
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const result = handleUnitConversion(oldUnit, newUnit, value, conversionTable);
    setter(result.toFixed(4));
  };
  
  // Helper function to format numbers with commas
  const formatWithCommas = (value: number, decimalPlaces: number = 2): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };

  const calculateBoardFeet = () => {
    // Get number of boards
    const numberOfBoards = numPieces ? Number(numPieces) : 0;

    // Convert thickness to inches
    let thicknessInInches = 0;
    if (thicknessUnit === 'ft/in') {
      thicknessInInches = Number(thicknessFeet || 0) * 12 + Number(thicknessInches || 0);
    } else if (thicknessUnit === 'm/cm') {
      const totalMeters = Number(thicknessMeters || 0) + (Number(thicknessCentimeters || 0) / 100);
      thicknessInInches = totalMeters * 39.3701;
    } else {
      thicknessInInches = thickness ? 
        Number(thickness) * (dimensionConversions[thicknessUnit] || 1) : 
        0;
    }

    // Convert width to inches
    let widthInInches = 0;
    if (widthUnit === 'ft/in') {
      widthInInches = Number(widthFeet || 0) * 12 + Number(widthInches || 0);
    } else if (widthUnit === 'm/cm') {
      const totalMeters = Number(widthMeters || 0) + (Number(widthCentimeters || 0) / 100);
      widthInInches = totalMeters * 39.3701;
    } else {
      widthInInches = width ? 
        Number(width) * (dimensionConversions[widthUnit] || 1) : 
        0;
    }

    // Convert length to feet
    let lengthInFeet = 0;
    if (lengthUnit === 'ft/in') {
      lengthInFeet = Number(lengthFeet || 0) + (Number(lengthInches || 0) / 12);
    } else if (lengthUnit === 'm/cm') {
      const totalMeters = Number(lengthMeters || 0) + (Number(lengthCentimeters || 0) / 100);
      lengthInFeet = totalMeters * 3.28084;
    } else {
      lengthInFeet = length ? 
        Number(length) * (lengthConversions[lengthUnit] || 1) : 
        0;
    }

    // Apply the formula: Total Board Feet = (Thickness × Width × Length ÷ 12) × Number of Boards
    const totalBoardFeetValue = (thicknessInInches * widthInInches * lengthInFeet / 12) * numberOfBoards;

    // Calculate total cost using the formula: Total Cost = (Thickness × Width × Length ÷ 12) × Number of Boards × Price
    const priceValue = price ? Number(price) : 0;
    const totalCostValue = totalBoardFeetValue * priceValue;

    // Update state with calculated values (3 decimals for board feet, 2 for cost)
    setTotalBoardFeet(Number(totalBoardFeetValue.toFixed(3)));
    setTotalCost(Number(totalCostValue.toFixed(2)));
  };

  const unitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  const clearAll = () => {
    // Clear input values
    setNumPieces('');
    setThickness('');
    setThicknessUnit('in');
    setWidth('');
    setWidthUnit('in');
    setLength('');
    setLengthUnit('ft');
    setLengthFeet('');
    setLengthInches('');
    setLengthMeters('');
    setLengthCentimeters('');
    setPrice('');
    setCurrency('PKR');
    
    // Clear error states
    setNumPiecesError('');
    setThicknessError('');
    setWidthError('');
    setLengthFeetError('');
    setLengthInchesError('');
    setLengthMetersError('');
    setLengthCentimetersError('');
    setPriceError('');
    
    // Reset totals
    setTotalBoardFeet(0);
    setTotalCost(0);
  };

  const reloadCalculator = () => {
    // Clear input values
    setNumPieces('');
    setThickness('');
    setWidth('');
    setLength('');
    setLengthFeet('');
    setLengthInches('');
    setLengthMeters('');
    setLengthCentimeters('');
    setPrice('');
    
    // Clear error states
    setNumPiecesError('');
    setThicknessError('');
    setWidthError('');
    setLengthFeetError('');
    setLengthInchesError('');
    setLengthMetersError('');
    setLengthCentimetersError('');
    setPriceError('');
    
    // Reset totals
    setTotalBoardFeet(0);
    setTotalCost(0);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Board Foot Calculator 
          <span className="ml-3 text-2xl">📏</span>
        </h1>
      </div>

      <div className="flex justify-center mb-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
          
          {/* Number of pieces */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              No. of pieces
            </label>
            <div>
              <input
                type="number"
                value={numPieces}
                onChange={(e) => {
                  const value = e.target.value;
                  // Clear previous error
                  setNumPiecesError('');
                  
                  // Check if value is negative
                  if (value !== '') {
                    const numValue = Number(value);
                    if (numValue < 0) {
                      setNumPiecesError("Negative values are not allowed");
                      setNumPieces('');
                    } else {
                      setNumPieces(value);
                    }
                  } else {
                    setNumPieces('');
                  }
                }}
                onFocus={(e) => {
                  if (numPieces !== '') {
                    e.target.select();
                  }
                }}
                className={`w-full px-3 py-2 border ${numPiecesError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                min="0"
              />
              {numPiecesError && <p className="text-red-500 text-xs mt-1">{numPiecesError}</p>}
            </div>
          </div>

          {/* Thickness */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Thickness
            </label>
            <div className="flex gap-2">
              {/* Show dual fields for ft/in and m/cm, else single input */}
              {(thicknessUnit === 'ft/in') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={thicknessFeet}
                        onChange={(e) => handleNumberInput(e.target.value, setThicknessFeet, setThicknessError)}
                        onFocus={(e) => handleFocus(thicknessFeet, e)}
                        className={`w-20 px-3 py-2 border ${thicknessError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="ft"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={thicknessInches}
                        onChange={(e) => handleNumberInput(e.target.value, setThicknessInches, setThicknessError)}
                        onFocus={(e) => handleFocus(thicknessInches, e)}
                        className={`w-20 px-3 py-2 border ${thicknessError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="in"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">in</span>
                  </div>
                </>
              ) : (thicknessUnit === 'm/cm') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={thicknessMeters}
                        onChange={(e) => handleNumberInput(e.target.value, setThicknessMeters, setThicknessError)}
                        onFocus={(e) => handleFocus(thicknessMeters, e)}
                        className={`w-20 px-3 py-2 border ${thicknessError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="m"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={thicknessCentimeters}
                        onChange={(e) => handleNumberInput(e.target.value, setThicknessCentimeters, setThicknessError)}
                        onFocus={(e) => handleFocus(thicknessCentimeters, e)}
                        className={`w-20 px-3 py-2 border ${thicknessError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="cm"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">cm</span>
                  </div>
                </>
              ) : (
                <div className="flex-1">
                  <input
                    type="number"
                    value={thickness}
                    onChange={(e) => handleNumberInput(e.target.value, setThickness, setThicknessError)}
                    onFocus={(e) => handleFocus(thickness, e)}
                    className={`w-full px-3 py-2 border ${thicknessError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
                    placeholder=""
                  />
                </div>
              )}
              <select
                value={thicknessUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (!isUnitType(newUnit)) return;
                  
                  // Convert between ft/in and m/cm
                  if (thicknessUnit === 'ft/in' && newUnit === 'm/cm') {
                    const { meters, centimeters } = convertFtInToMCm(thicknessFeet, thicknessInches);
                    setThicknessMeters(meters.toString());
                    setThicknessCentimeters(centimeters.toString());
                    setThicknessFeet('');
                    setThicknessInches('');
                  } 
                  else if (thicknessUnit === 'm/cm' && newUnit === 'ft/in') {
                    const { feet, inches } = convertMCmToFtIn(thicknessMeters, thicknessCentimeters);
                    setThicknessFeet(feet.toString());
                    setThicknessInches(inches.toString());
                    setThicknessMeters('');
                    setThicknessCentimeters('');
                  }
                  // Convert from single unit to ft/in
                  else if (newUnit === 'ft/in' && isSingleUnit(thicknessUnit)) {
                    const totalInches = thickness ? Number(thickness) * dimensionConversions[thicknessUnit] : 0;
                    const feet = Math.floor(totalInches / 12);
                    const inches = totalInches % 12;
                    setThicknessFeet(feet.toString());
                    setThicknessInches(inches.toFixed(2));
                    setThickness('');
                  }
                  // Convert from single unit to m/cm
                  else if (newUnit === 'm/cm' && isSingleUnit(thicknessUnit)) {
                    const totalInches = thickness ? Number(thickness) * dimensionConversions[thicknessUnit] : 0;
                    const totalMeters = totalInches / 39.3701;
                    const meters = Math.floor(totalMeters);
                    const centimeters = (totalMeters - meters) * 100;
                    setThicknessMeters(meters.toString());
                    setThicknessCentimeters(centimeters.toFixed(2));
                    setThickness('');
                  }
                  // Convert from ft/in to single unit
                  else if (isSingleUnit(newUnit) && thicknessUnit === 'ft/in') {
                    const totalInches = Number(thicknessFeet || 0) * 12 + Number(thicknessInches || 0);
                    const newValue = totalInches / dimensionConversions[newUnit];
                    setThickness(newValue.toFixed(4));
                    setThicknessFeet('');
                    setThicknessInches('');
                  }
                  // Convert from m/cm to single unit
                  else if (isSingleUnit(newUnit) && thicknessUnit === 'm/cm') {
                    const totalMeters = Number(thicknessMeters || 0) + (Number(thicknessCentimeters || 0) / 100);
                    const totalInches = totalMeters * 39.3701;
                    const newValue = totalInches / dimensionConversions[newUnit];
                    setThickness(newValue.toFixed(4));
                    setThicknessMeters('');
                    setThicknessCentimeters('');
                  }
                  // Convert between single units
                  else if (isSingleUnit(thicknessUnit) && isSingleUnit(newUnit)) {
                    handleUnitChange(thickness, thicknessUnit, newUnit, setThickness, dimensionConversions);
                  }
                  
                  setThicknessUnit(newUnit);
                }}
                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {thicknessError && <p className="text-red-500 text-xs mt-1">{thicknessError}</p>}
          </div>

          {/* Width */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width
            </label>
            <div className="flex gap-2">
              {/* Show dual fields for ft/in and m/cm, else single input */}
              {(widthUnit === 'ft/in') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={widthFeet}
                        onChange={(e) => handleNumberInput(e.target.value, setWidthFeet, setWidthError)}
                        onFocus={(e) => handleFocus(widthFeet, e)}
                        className={`w-20 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="ft"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={widthInches}
                        onChange={(e) => handleNumberInput(e.target.value, setWidthInches, setWidthError)}
                        onFocus={(e) => handleFocus(widthInches, e)}
                        className={`w-20 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="in"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">in</span>
                  </div>
                </>
              ) : (widthUnit === 'm/cm') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={widthMeters}
                        onChange={(e) => handleNumberInput(e.target.value, setWidthMeters, setWidthError)}
                        onFocus={(e) => handleFocus(widthMeters, e)}
                        className={`w-20 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="m"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={widthCentimeters}
                        onChange={(e) => handleNumberInput(e.target.value, setWidthCentimeters, setWidthError)}
                        onFocus={(e) => handleFocus(widthCentimeters, e)}
                        className={`w-20 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="cm"
                      />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">cm</span>
                  </div>
                </>
              ) : (
                <div className="flex-1">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleNumberInput(e.target.value, setWidth, setWidthError)}
                    onFocus={(e) => handleFocus(width, e)}
                    className={`w-full px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
                    placeholder=""
                  />
                </div>
              )}
              <select
                value={widthUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (!isUnitType(newUnit)) return;
                  
                  // Convert between ft/in and m/cm
                  if (widthUnit === 'ft/in' && newUnit === 'm/cm') {
                    const { meters, centimeters } = convertFtInToMCm(widthFeet, widthInches);
                    setWidthMeters(meters.toString());
                    setWidthCentimeters(centimeters.toString());
                    setWidthFeet('');
                    setWidthInches('');
                  } 
                  else if (widthUnit === 'm/cm' && newUnit === 'ft/in') {
                    const { feet, inches } = convertMCmToFtIn(widthMeters, widthCentimeters);
                    setWidthFeet(feet.toString());
                    setWidthInches(inches.toString());
                    setWidthMeters('');
                    setWidthCentimeters('');
                  }
                  // Convert from single unit to ft/in
                  else if (newUnit === 'ft/in' && isSingleUnit(widthUnit)) {
                    const totalInches = width ? Number(width) * dimensionConversions[widthUnit] : 0;
                    const feet = Math.floor(totalInches / 12);
                    const inches = totalInches % 12;
                    setWidthFeet(feet.toString());
                    setWidthInches(inches.toFixed(2));
                    setWidth('');
                  }
                  // Convert from single unit to m/cm
                  else if (newUnit === 'm/cm' && isSingleUnit(widthUnit)) {
                    const totalInches = width ? Number(width) * dimensionConversions[widthUnit] : 0;
                    const totalMeters = totalInches / 39.3701;
                    const meters = Math.floor(totalMeters);
                    const centimeters = (totalMeters - meters) * 100;
                    setWidthMeters(meters.toString());
                    setWidthCentimeters(centimeters.toFixed(2));
                    setWidth('');
                  }
                  // Convert from ft/in to single unit
                  else if (isSingleUnit(newUnit) && widthUnit === 'ft/in') {
                    const totalInches = Number(widthFeet || 0) * 12 + Number(widthInches || 0);
                    const newValue = totalInches / dimensionConversions[newUnit];
                    setWidth(newValue.toFixed(4));
                    setWidthFeet('');
                    setWidthInches('');
                  }
                  // Convert from m/cm to single unit
                  else if (isSingleUnit(newUnit) && widthUnit === 'm/cm') {
                    const totalMeters = Number(widthMeters || 0) + (Number(widthCentimeters || 0) / 100);
                    const totalInches = totalMeters * 39.3701;
                    const newValue = totalInches / dimensionConversions[newUnit];
                    setWidth(newValue.toFixed(4));
                    setWidthMeters('');
                    setWidthCentimeters('');
                  }
                  // Convert between single units
                  else if (isSingleUnit(widthUnit) && isSingleUnit(newUnit)) {
                    handleUnitChange(width, widthUnit, newUnit, setWidth, dimensionConversions);
                  }
                  
                  setWidthUnit(newUnit);
                }}
                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {widthError && <p className="text-red-500 text-xs mt-1">{widthError}</p>}
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length
            </label>
            <div className="flex gap-2 items-center">
              {(lengthUnit === 'ft/in') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={lengthFeet}
                        onChange={(e) => handleNumberInput(e.target.value, setLengthFeet, setLengthFeetError)}
                        onFocus={(e) => handleFocus(lengthFeet, e)}
                        className={`w-20 px-3 py-2 border ${lengthFeetError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="ft"
                      />
                      {lengthFeetError && <p className="text-red-500 text-xs mt-1">{lengthFeetError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={lengthInches}
                        onChange={(e) => handleNumberInput(e.target.value, setLengthInches, setLengthInchesError)}
                        onFocus={(e) => handleFocus(lengthInches, e)}
                        className={`w-20 px-3 py-2 border ${lengthInchesError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="in"
                      />
                      {lengthInchesError && <p className="text-red-500 text-xs mt-1">{lengthInchesError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">in</span>
                  </div>
                </>
              ) : (lengthUnit === 'm/cm') ? (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={lengthMeters}
                        onChange={(e) => handleNumberInput(e.target.value, setLengthMeters, setLengthMetersError)}
                        onFocus={(e) => handleFocus(lengthMeters, e)}
                        className={`w-20 px-3 py-2 border ${lengthMetersError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="1"
                        min="0"
                        placeholder="m"
                      />
                      {lengthMetersError && <p className="text-red-500 text-xs mt-1">{lengthMetersError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={lengthCentimeters}
                        onChange={(e) => handleNumberInput(e.target.value, setLengthCentimeters, setLengthCentimetersError)}
                        onFocus={(e) => handleFocus(lengthCentimeters, e)}
                        className={`w-20 px-3 py-2 border ${lengthCentimetersError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        min="0"
                        placeholder="cm"
                      />
                      {lengthCentimetersError && <p className="text-red-500 text-xs mt-1">{lengthCentimetersError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">cm</span>
                  </div>
                </>
              ) : (
                <div className="flex-1">
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => handleNumberInput(e.target.value, setLength, setLengthFeetError)}
                    onFocus={(e) => handleFocus(length, e)}
                    className={`w-full px-3 py-2 border ${lengthFeetError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
                    placeholder=""
                  />
                </div>
              )}
              <select
                value={lengthUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  if (!isUnitType(newUnit)) return;
                  
                  // Convert between ft/in and m/cm
                  if (lengthUnit === 'ft/in' && newUnit === 'm/cm') {
                    const { meters, centimeters } = convertFtInToMCm(lengthFeet, lengthInches);
                    setLengthMeters(meters.toString());
                    setLengthCentimeters(centimeters.toString());
                    setLengthFeet('');
                    setLengthInches('');
                  } 
                  else if (lengthUnit === 'm/cm' && newUnit === 'ft/in') {
                    const { feet, inches } = convertMCmToFtIn(lengthMeters, lengthCentimeters);
                    setLengthFeet(feet.toString());
                    setLengthInches(inches.toString());
                    setLengthMeters('');
                    setLengthCentimeters('');
                  }
                  // Convert from single unit to ft/in
                  else if (newUnit === 'ft/in' && isSingleUnit(lengthUnit)) {
                    const totalFeet = length ? Number(length) * lengthConversions[lengthUnit] : 0;
                    const feet = Math.floor(totalFeet);
                    const inches = (totalFeet - feet) * 12;
                    setLengthFeet(feet.toString());
                    setLengthInches(inches.toFixed(2));
                    setLength('');
                  }
                  // Convert from single unit to m/cm
                  else if (newUnit === 'm/cm' && isSingleUnit(lengthUnit)) {
                    const totalFeet = length ? Number(length) * lengthConversions[lengthUnit] : 0;
                    const totalMeters = totalFeet / 3.28084;
                    const meters = Math.floor(totalMeters);
                    const centimeters = (totalMeters - meters) * 100;
                    setLengthMeters(meters.toString());
                    setLengthCentimeters(centimeters.toFixed(2));
                    setLength('');
                  }
                  // Convert from ft/in to single unit
                  else if (isSingleUnit(newUnit) && lengthUnit === 'ft/in') {
                    const totalFeet = Number(lengthFeet || 0) + (Number(lengthInches || 0) / 12);
                    const newValue = totalFeet / lengthConversions[newUnit];
                    setLength(newValue.toFixed(4));
                    setLengthFeet('');
                    setLengthInches('');
                  }
                  // Convert from m/cm to single unit
                  else if (isSingleUnit(newUnit) && lengthUnit === 'm/cm') {
                    const totalMeters = Number(lengthMeters || 0) + (Number(lengthCentimeters || 0) / 100);
                    const totalFeet = totalMeters * 3.28084;
                    const newValue = totalFeet / lengthConversions[newUnit];
                    setLength(newValue.toFixed(4));
                    setLengthMeters('');
                    setLengthCentimeters('');
                  }
                  // Convert between single units
                  else if (isSingleUnit(lengthUnit) && isSingleUnit(newUnit)) {
                    handleUnitChange(length, lengthUnit, newUnit, setLength, lengthConversions);
                  }
                  
                  setLengthUnit(newUnit);
                }}
                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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

          {/* Total Board Feet */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {formatWithCommas(totalBoardFeet, 3)} board feet
            </div>
          </div>

          {/* Cost Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
              <span className="mr-2">💰</span>
              Cost
            </h3>
            
            {/* Price per board foot */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 border border-slate-300 rounded-lg bg-gray-50 text-slate-700">
                  PKR
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handleNumberInput(e.target.value, setPrice, setPriceError)}
                    onFocus={(e) => handleFocus(price, e)}
                    className={`w-full px-3 py-2 border ${priceError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Price per board foot"
                    min="0"
                  />
                  {priceError && <p className="text-red-500 text-xs mt-1">{priceError}</p>}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">/ board foot</div>
            </div>

            {/* Total Cost */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total cost
              </label>
              <div className="text-2xl font-bold text-green-600">
                {currency} {formatWithCommas(totalCost)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={clearAll}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear all changes
            </button>
            <button
              onClick={reloadCalculator}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}