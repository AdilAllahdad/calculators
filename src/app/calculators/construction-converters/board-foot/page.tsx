'use client';

import { useState, useEffect } from 'react';

export default function BoardFootCalculator() {
  const [numPieces, setNumPieces] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [thicknessUnit, setThicknessUnit] = useState<string>('in');
  const [width, setWidth] = useState<string>('');
  const [widthUnit, setWidthUnit] = useState<string>('in');
  const [length, setLength] = useState<string>('');
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
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

  // Conversion factors to inches/feet
  const lengthConversions = {
    'mm': 0.0393701 / 12, // mm to feet
    'cm': 0.393701 / 12,  // cm to feet
    'm': 3.28084,         // m to feet
    'in': 1/12,           // inches to feet
    'ft': 1,              // feet to feet
    'ft/in': 1,           // feet/inches stays as feet
    'm/cm': 3.28084       // meters/cm stays as meters for conversion
  };

  const dimensionConversions = {
    'mm': 0.0393701,      // mm to inches
    'cm': 0.393701,       // cm to inches
    'm': 39.3701,         // m to inches
    'in': 1,              // inches to inches
    'ft': 12,             // feet to inches
    'ft/in': 1,           // feet/inches stays as inches for width/thickness
    'm/cm': 39.3701       // meters/cm stays as meters for conversion
  };

  useEffect(() => {
    calculateBoardFeet();
  }, [numPieces, thickness, thicknessUnit, width, widthUnit, length, lengthUnit, lengthFeet, lengthInches, lengthMeters, lengthCentimeters, price]);

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
    oldUnit: string, 
    newUnit: string, 
    setter: (val: string) => void, 
    conversionTable: Record<string, number>
  ) => {
    // If there's no value, no need to convert
    if (!value || value === '') {
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return;
    }
    
    // Convert to a standardized value first (inches for dimensions, feet for length)
    const standardValue = numValue * conversionTable[oldUnit];
    
    // Then convert from standard to new unit
    const newValue = standardValue / conversionTable[newUnit];
    
    // Format the number to a reasonable precision (4 decimal places max)
    setter(Number(newValue.toFixed(4)).toString());
  };
  
  // Helper function to format numbers with commas
  const formatWithCommas = (value: number, decimalPlaces: number = 2): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };

  const calculateBoardFeet = () => {
    // Parse all input strings to numbers, default to 0 if empty
    const numPiecesValue = numPieces ? Number(numPieces) : 0;
    const thicknessValue = thickness ? Number(thickness) : 0;
    const widthValue = width ? Number(width) : 0;
    const lengthFeetValue = lengthFeet ? Number(lengthFeet) : 0;
    const lengthInchesValue = lengthInches ? Number(lengthInches) : 0;
    const lengthMetersValue = lengthMeters ? Number(lengthMeters) : 0;
    const lengthCentimetersValue = lengthCentimeters ? Number(lengthCentimeters) : 0;
    const priceValue = price ? Number(price) : 0;
    
    // Convert all dimensions to proper units
    let lengthInFeet = 0;
    
    // Calculate length based on the selected unit
    if (lengthUnit === 'ft/in') {
      // Feet + inches format
      lengthInFeet = lengthFeetValue + (lengthInchesValue / 12);
    } else if (lengthUnit === 'm/cm') {
      // Meters + centimeters format
      const totalMeters = lengthMetersValue + (lengthCentimetersValue / 100);
      lengthInFeet = totalMeters * lengthConversions['m'];
    } else {
      // Standard single unit
      const lengthValue = length ? Number(length) : 0;
      lengthInFeet = lengthValue * (lengthConversions[lengthUnit as keyof typeof lengthConversions] || 1);
    }
    
    const widthInInches = widthValue * (dimensionConversions[widthUnit as keyof typeof dimensionConversions] || 1);
    const thicknessInInches = thicknessValue * (dimensionConversions[thicknessUnit as keyof typeof dimensionConversions] || 1);

    // Board feet formula: length (ft) × width (in) × thickness (in) / 12
    const boardFeetPerPiece = (lengthInFeet * widthInInches * thicknessInInches) / 12;
    const total = numPiecesValue * boardFeetPerPiece;
    
    setTotalBoardFeet(total);
    setTotalCost(total * priceValue);
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
                />
                {thicknessError && <p className="text-red-500 text-xs mt-1">{thicknessError}</p>}
              </div>
              <select
                value={thicknessUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  // Convert the value when unit changes
                  handleUnitChange(thickness, thicknessUnit, newUnit, setThickness, dimensionConversions);
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
          </div>

          {/* Width */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width
            </label>
            <div className="flex gap-2">
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
                />
                {widthError && <p className="text-red-500 text-xs mt-1">{widthError}</p>}
              </div>
              <select
                value={widthUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  // Convert the value when unit changes
                  handleUnitChange(width, widthUnit, newUnit, setWidth, dimensionConversions);
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
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length
            </label>
            <div className="flex gap-2 items-center">
              {lengthUnit !== 'ft/in' && lengthUnit !== 'm/cm' && (
                <>
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
                      placeholder="Enter length"
                    />
                    {lengthFeetError && <p className="text-red-500 text-xs mt-1">{lengthFeetError}</p>}
                  </div>
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      if (newUnit === 'ft/in' || newUnit === 'm/cm') {
                        // Special case for switching to dual unit fields
                        setLengthUnit(newUnit);
                      } else {
                        // Normal unit conversion
                        handleUnitChange(length, lengthUnit, newUnit, setLength, lengthConversions);
                        setLengthUnit(newUnit);
                      }
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
                </>
              )}

              {/* Feet/Inches dual fields */}
              {lengthUnit === 'ft/in' && (
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
                        placeholder="2"
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
                        placeholder="35"
                      />
                      {lengthInchesError && <p className="text-red-500 text-xs mt-1">{lengthInchesError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">in</span>
                  </div>
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
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
                </>
              )}

              {/* Meters/Centimeters dual fields */}
              {lengthUnit === 'm/cm' && (
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
                        placeholder="20"
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
                        placeholder="38"
                      />
                      {lengthCentimetersError && <p className="text-red-500 text-xs mt-1">{lengthCentimetersError}</p>}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">cm</span>
                  </div>
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
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
                </>
              )}
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
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="USD">USD</option>
                  <option value="PKR">PKR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
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
