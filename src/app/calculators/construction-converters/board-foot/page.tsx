'use client';

import { useState, useEffect } from 'react';

export default function BoardFootCalculator() {
  const [numPieces, setNumPieces] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(0);
  const [thicknessUnit, setThicknessUnit] = useState<string>('in');
  const [width, setWidth] = useState<number>(0);
  const [widthUnit, setWidthUnit] = useState<string>('in');
  const [length, setLength] = useState<number>(0);
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [lengthFeet, setLengthFeet] = useState<number>(0);
  const [lengthInches, setLengthInches] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  
  const [totalBoardFeet, setTotalBoardFeet] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Conversion factors to inches/feet
  const lengthConversions = {
    'mm': 0.0393701 / 12, // mm to feet
    'cm': 0.393701 / 12,  // cm to feet
    'm': 3.28084,         // m to feet
    'in': 1/12,           // inches to feet
    'ft': 1,              // feet to feet
    'ft/in': 1            // feet/inches stays as feet
  };

  const dimensionConversions = {
    'mm': 0.0393701,      // mm to inches
    'cm': 0.393701,       // cm to inches
    'm': 39.3701,         // m to inches
    'in': 1,              // inches to inches
    'ft': 12,             // feet to inches
    'ft/in': 1            // feet/inches stays as inches for width/thickness
  };

  useEffect(() => {
    calculateBoardFeet();
  }, [numPieces, thickness, thicknessUnit, width, widthUnit, length, lengthUnit, lengthFeet, lengthInches, price]);

  const handleNumberInput = (value: string, setter: (val: number) => void) => {
    if (value === '' || value === '0') {
      setter(0);
    } else {
      // Remove leading zeros and convert to number
      const cleanValue = value.replace(/^0+/, '') || '0';
      setter(Number(cleanValue) || 0);
    }
  };

  const handleFocus = (currentValue: number, e: React.FocusEvent<HTMLInputElement>) => {
    if (currentValue === 0) {
      e.target.select();
    }
  };

  const calculateBoardFeet = () => {
    // Convert all dimensions to proper units
    // Always use feet + inches for length calculation
    const lengthInFeet = lengthFeet + (lengthInches / 12);
    
    const widthInInches = width * (dimensionConversions[widthUnit as keyof typeof dimensionConversions] || 1);
    const thicknessInInches = thickness * (dimensionConversions[thicknessUnit as keyof typeof dimensionConversions] || 1);

    // Board feet formula: length (ft) × width (in) × thickness (in) / 12
    const boardFeetPerPiece = (lengthInFeet * widthInInches * thicknessInInches) / 12;
    const total = numPieces * boardFeetPerPiece;
    
    setTotalBoardFeet(total);
    setTotalCost(total * price);
  };

  const unitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' }
  ];

  const clearAll = () => {
    setNumPieces(0);
    setThickness(0);
    setThicknessUnit('in');
    setWidth(0);
    setWidthUnit('in');
    setLength(0);
    setLengthUnit('ft');
    setLengthFeet(0);
    setLengthInches(0);
    setPrice(0);
    setCurrency('USD');
    // Reset totals
    setTotalBoardFeet(0);
    setTotalCost(0);
  };

  const reloadCalculator = () => {
    // Clear everything first
    setNumPieces(0);
    setThickness(0);
    setWidth(0);
    setLength(0);
    setLengthFeet(0);
    setLengthInches(0);
    setPrice(0);
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
        <p className="text-lg text-slate-700">
          Calculate board feet for lumber purchases. Unlike square footage which measures area, board footage measures volume for purchasing lumber in various sizes.
        </p>
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
            <input
              type="number"
              value={numPieces}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value === '0') {
                  setNumPieces(0);
                } else {
                  // Remove leading zeros and convert to number
                  const cleanValue = value.replace(/^0+/, '') || '0';
                  setNumPieces(Number(cleanValue) || 0);
                }
              }}
              onFocus={(e) => {
                // Clear the field if it's 0 when focused
                if (numPieces === 0) {
                  e.target.select();
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              min="0"
            />
          </div>

          {/* Thickness */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Thickness
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={thickness}
                onChange={(e) => handleNumberInput(e.target.value, setThickness)}
                onFocus={(e) => handleFocus(thickness, e)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                min="0"
              />
              <select
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value)}
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
              <input
                type="number"
                value={width}
                onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                onFocus={(e) => handleFocus(width, e)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                min="0"
              />
              <select
                value={widthUnit}
                onChange={(e) => setWidthUnit(e.target.value)}
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
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lengthFeet}
                  onChange={(e) => handleNumberInput(e.target.value, setLengthFeet)}
                  onFocus={(e) => handleFocus(lengthFeet, e)}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="1"
                  min="0"
                  placeholder="2"
                />
                <span className="text-slate-600 text-sm font-medium">ft</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lengthInches}
                  onChange={(e) => handleNumberInput(e.target.value, setLengthInches)}
                  onFocus={(e) => handleFocus(lengthInches, e)}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  min="0"
                  placeholder="35"
                />
                <span className="text-slate-600 text-sm font-medium">in</span>
              </div>
              <button
                onClick={() => setLengthUnit(lengthUnit === 'ft/in' ? 'ft' : 'ft/in')}
                className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Switch to single field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Total Board Feet */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {totalBoardFeet.toFixed(2)} board feet
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
                <input
                  type="number"
                  value={price}
                  onChange={(e) => handleNumberInput(e.target.value, setPrice)}
                  onFocus={(e) => handleFocus(price, e)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Price per board foot"
                  min="0"
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">/ board foot</div>
            </div>

            {/* Total Cost */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total cost
              </label>
              <div className="text-2xl font-bold text-green-600">
                {currency} {totalCost.toFixed(2)}
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
