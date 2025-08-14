"use client";

import { useState } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

export default function AluminumWeightCalculatorPage() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [thickness, setThickness] = useState<number>(0.25);
  const [pieces, setPieces] = useState<number>(1);
  const [dimensionUnit, setDimensionUnit] = useState<string>('in');
  const [weightUnit, setWeightUnit] = useState<string>('lb');

  // Aluminum density is approximately 2.7 g/cm³ or 0.0975 lb/in³
  const aluminumDensity = 0.0975; // lb/in³
  
  // Calculate aluminum weight
  const calculateWeight = () => {
    // Calculate volume in cubic inches
    let volume = length * width * thickness * pieces;
    
    // Convert dimensions to inches based on unit selection
    if (dimensionUnit === 'mm') {
      // 1 cubic mm = 0.000061024 cubic inches
      volume *= 0.000061024;
    } else if (dimensionUnit === 'cm') {
      // 1 cubic cm = 0.061024 cubic inches
      volume *= 0.061024;
    } else if (dimensionUnit === 'm') {
      // 1 cubic m = 61,024 cubic inches
      volume *= 61024;
    } else if (dimensionUnit === 'ft') {
      // 1 cubic foot = 1728 cubic inches
      volume *= 1728;
    }
    
    // Calculate weight in pounds
    let weight = volume * aluminumDensity;
    
    // Convert weight based on unit selection
    if (weightUnit === 'kg') {
      // 1 lb = 0.453592 kg
      weight *= 0.453592;
    } else if (weightUnit === 'g') {
      // 1 lb = 453.592 g
      weight *= 453.592;
    } else if (weightUnit === 't') {
      // 1 lb = 0.000453592 metric tons
      weight *= 0.000453592;
    } else if (weightUnit === 'ton') {
      // 1 lb = 0.0005 US tons
      weight *= 0.0005;
    }
    
    return weight.toFixed(2);
  };

  const weight = calculateWeight();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Aluminum Weight Calculator ⚖️</h1>
      <p className="mb-6">
        Calculate the weight of aluminum pieces based on their dimensions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Dimensions</h2>
          
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
            <label className="block text-sm font-medium mb-1">Thickness</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={thickness}
              onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Number of Pieces</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={pieces}
              onChange={(e) => setPieces(parseInt(e.target.value) || 1)}
              min="1"
              step="1"
            />
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Weight</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Weight Unit</label>
            <UnitDropdown
              unitType="weight"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            />
          </div>
          
          <div className="p-6 bg-blue-50 rounded-lg mt-8">
            <h3 className="text-lg font-medium mb-2">Result</h3>
            <div className="flex items-center justify-between p-4 bg-white rounded-md border">
              <span className="font-medium">Total Weight:</span>
              <span className="text-xl font-bold">{weight} {weightUnit}</span>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">
              Based on aluminum density of 2.7 g/cm³ or 0.0975 lb/in³.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
