"use client";

import { useState } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

export default function SandCalculatorPage() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(0.5);
  const [dimensionUnit, setDimensionUnit] = useState<string>('ft');
  const [outputUnit, setOutputUnit] = useState<string>('yd3');
  const [sandType, setSandType] = useState<string>('regular');

  // Conversion factors
  const cubicYardInCubicFeet = 27; // 1 cubic yard = 27 cubic feet
  const tonPerCubicYard: { [key: string]: number } = {
    regular: 1.5, // Regular sand weighs about 1.5 tons per cubic yard
    masonry: 1.6, // Masonry sand weighs about 1.6 tons per cubic yard
    play: 1.3,    // Play sand weighs about 1.3 tons per cubic yard
    concrete: 1.7 // Concrete sand weighs about 1.7 tons per cubic yard
  };

  // Calculate sand volume and weight
  const calculateSand = () => {
    // Convert dimensions to feet
    let lengthInFeet = length;
    let widthInFeet = width;
    let depthInFeet = depth;
    
    if (dimensionUnit === 'in') {
      lengthInFeet /= 12;
      widthInFeet /= 12;
      depthInFeet /= 12;
    } else if (dimensionUnit === 'yd') {
      lengthInFeet *= 3;
      widthInFeet *= 3;
      depthInFeet *= 3;
    } else if (dimensionUnit === 'm') {
      lengthInFeet *= 3.28084;
      widthInFeet *= 3.28084;
      depthInFeet *= 3.28084;
    } else if (dimensionUnit === 'cm') {
      lengthInFeet *= 0.0328084;
      widthInFeet *= 0.0328084;
      depthInFeet *= 0.0328084;
    }
    
    // Calculate volume in cubic feet
    const volumeCubicFeet = lengthInFeet * widthInFeet * depthInFeet;
    
    // Convert to cubic yards
    const volumeCubicYards = volumeCubicFeet / cubicYardInCubicFeet;
    
    // Calculate weight in tons
    const weightTons = volumeCubicYards * tonPerCubicYard[sandType];
    
    // Prepare output
    let result;
    if (outputUnit === 'yd3') {
      result = volumeCubicYards.toFixed(2) + ' cubic yards';
    } else if (outputUnit === 'ft3') {
      result = volumeCubicFeet.toFixed(2) + ' cubic feet';
    } else if (outputUnit === 'm3') {
      result = (volumeCubicFeet * 0.0283168).toFixed(2) + ' cubic meters';
    } else if (outputUnit === 'ton') {
      result = weightTons.toFixed(2) + ' tons';
    }
    
    return {
      volume: volumeCubicYards.toFixed(2),
      weight: weightTons.toFixed(2),
      formatted: result
    };
  };

  const result = calculateSand();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sand Calculator 🏝️</h1>
      <p className="mb-6">
        Calculate the amount of sand needed for your landscaping or construction project.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Area Dimensions</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Dimension Unit</label>
            <UnitDropdown
              unitType="length"
              value={dimensionUnit}
              onChange={(e) => setDimensionUnit(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Length</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Depth</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={depth}
              onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Sand Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Sand Type</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={sandType}
              onChange={(e) => setSandType(e.target.value)}
            >
              <option value="regular">Regular Sand</option>
              <option value="masonry">Masonry Sand</option>
              <option value="play">Play Sand</option>
              <option value="concrete">Concrete Sand</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Output Unit</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={outputUnit}
              onChange={(e) => setOutputUnit(e.target.value)}
            >
              <option value="yd3">Cubic Yards</option>
              <option value="ft3">Cubic Feet</option>
              <option value="m3">Cubic Meters</option>
              <option value="ton">Tons</option>
            </select>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-lg mt-8">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-md border">
                <span className="font-medium">Volume:</span>
                <span className="text-xl font-bold">{result.volume} cubic yards</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-md border">
                <span className="font-medium">Weight:</span>
                <span className="text-xl font-bold">{result.weight} tons</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-md border">
                <span className="font-medium">Need:</span>
                <span className="text-xl font-bold">{result.formatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
