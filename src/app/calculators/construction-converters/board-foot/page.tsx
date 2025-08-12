'use client';

import { useState, useEffect } from 'react';

export default function BoardFootCalculator() {
  const [numPieces, setNumPieces] = useState<number>(1);
  const [thickness, setThickness] = useState<number>(1);
  const [thicknessUnit, setThicknessUnit] = useState<string>('in');
  const [width, setWidth] = useState<number>(10);
  const [widthUnit, setWidthUnit] = useState<string>('in');
  const [length, setLength] = useState<number>(8);
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [price, setPrice] = useState<number>(4.15);
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
  }, [numPieces, thickness, thicknessUnit, width, widthUnit, length, lengthUnit, price]);

  const calculateBoardFeet = () => {
    // Convert all dimensions to proper units
    const lengthInFeet = length * (lengthConversions[lengthUnit as keyof typeof lengthConversions] || 1);
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
    setNumPieces(1);
    setThickness(1);
    setWidth(10);
    setLength(8);
    setPrice(4.15);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center">
          Board Foot Calculator 
          <span className="ml-3 text-2xl">📏</span>
        </h1>
        <p className="text-lg text-slate-700">
          Calculate board feet for lumber purchases. Unlike square footage which measures area, board footage measures volume for purchasing lumber in various sizes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
          
          {/* Number of pieces */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              No. of pieces
            </label>
            <input
              type="number"
              value={numPieces}
              onChange={(e) => setNumPieces(Number(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              min="1"
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
                onChange={(e) => setThickness(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
              />
              <select
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
              />
              <select
                value={widthUnit}
                onChange={(e) => setWidthUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
            <div className="flex gap-2">
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
              />
              <select
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Price per board foot"
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
              onClick={() => calculateBoardFeet()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload calculator
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* What is a board foot */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">What is a board foot?</h3>
            <p className="text-slate-600 mb-4">
              Unlike square footage, which measures area, board footage measures volume. 
              You use it when purchasing multiple boards of lumber in various sizes.
            </p>
            <p className="text-slate-600 mb-4">
              By definition, one board foot of lumber is one square foot that is one-inch thick. 
              If you would like to convert regular volume units into board feet, use the following relation:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-center font-semibold text-blue-800">
                1 board foot = 144 cubic inches = 1/12 cubic foot
              </div>
            </div>
          </div>

          {/* How to calculate */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">How to calculate board feet?</h3>
            <p className="text-slate-600 mb-4">
              Surprisingly, the calculations are extremely easy! All you need to do is use the board foot formula below:
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="text-center font-semibold text-green-800">
                board feet = length (ft) × width (in) × thickness (in) / 12
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Pay special attention to the units! The length of the wooden board should be expressed in feet, 
              while the width and thickness – in inches.
            </p>
          </div>

          {/* Example calculation */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Using the lumber calculator: an example</h3>
            <div className="space-y-3 text-slate-600">
              <p><strong>1.</strong> Decide on the number of pieces: 5 wooden boards</p>
              <p><strong>2.</strong> Choose dimensions: 8 feet long, 10 inches wide, 1.25 inches thick</p>
              <p><strong>3.</strong> Calculate board feet per piece:</p>
              <div className="bg-orange-50 p-3 rounded border border-orange-200 ml-4">
                <div className="font-mono text-sm">
                  board feet = 8 × 10 × 1.25 / 12<br/>
                  board feet = 8.33 BF
                </div>
              </div>
              <p><strong>4.</strong> Total board footage: 5 × 8.33 = 41.67 BF</p>
              <p><strong>5.</strong> Total cost: 41.67 × $4.15 = $172.92</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
