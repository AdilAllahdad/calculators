"use client";

import { useState } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { UNIT_OPTIONS } from '@/constants';

export default function BrickCalculatorPage() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [brickLength, setBrickLength] = useState<number>(8);
  const [brickWidth, setBrickWidth] = useState<number>(4);
  const [brickHeight, setBrickHeight] = useState<number>(2.25);
  const [mortarJoint, setMortarJoint] = useState<number>(0.375);
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [brickUnit, setBrickUnit] = useState<string>('in');
  const [wastagePercent, setWastagePercent] = useState<number>(5);

  // Calculate number of bricks needed
  const calculateBricks = () => {
    // Convert all dimensions to the same unit (inches)
    let wallLengthInches = length;
    let wallWidthInches = width;
    let wallHeightInches = height;
    
    // Convert wall dimensions based on unit
    if (lengthUnit === 'ft') {
      wallLengthInches *= 12;
      wallWidthInches *= 12;
      wallHeightInches *= 12;
    } else if (lengthUnit === 'yd') {
      wallLengthInches *= 36;
      wallWidthInches *= 36;
      wallHeightInches *= 36;
    } else if (lengthUnit === 'm') {
      wallLengthInches *= 39.3701;
      wallWidthInches *= 39.3701;
      wallHeightInches *= 39.3701;
    } else if (lengthUnit === 'cm') {
      wallLengthInches *= 0.393701;
      wallWidthInches *= 0.393701;
      wallHeightInches *= 0.393701;
    }
    
    // Calculate brick dimensions including mortar
    const effectiveBrickLength = brickLength + mortarJoint;
    const effectiveBrickHeight = brickHeight + mortarJoint;
    
    // Calculate number of bricks
    const bricksPerRow = Math.ceil(wallLengthInches / effectiveBrickLength);
    const rowsPerWall = Math.ceil(wallHeightInches / effectiveBrickHeight);
    
    let totalBricks = bricksPerRow * rowsPerWall;
    
    // Add wastage
    totalBricks = Math.ceil(totalBricks * (1 + wastagePercent / 100));
    
    return totalBricks;
  };

  const totalBricks = calculateBricks();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Brick Calculator 🧱</h1>
      <p className="mb-6">
        Calculate how many bricks you need for your wall construction project.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Wall Dimensions</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unit of Measurement</label>
            <UnitDropdown
              unitType="length"
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Wall Length</label>
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
            <label className="block text-sm font-medium mb-1">Wall Height</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Wastage (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Brick Dimensions (inches)</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brick Length</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={brickLength}
              onChange={(e) => setBrickLength(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.125"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brick Width</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={brickWidth}
              onChange={(e) => setBrickWidth(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.125"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brick Height</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={brickHeight}
              onChange={(e) => setBrickHeight(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.125"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mortar Joint Thickness</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={mortarJoint}
              onChange={(e) => setMortarJoint(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.125"
            />
          </div>
        </div>
      </div>
      
      <div className="p-6 border rounded-lg shadow-sm bg-blue-50">
        <h2 className="text-xl font-medium mb-4">Results</h2>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-md border">
          <span className="font-medium">Total Bricks Needed:</span>
          <span className="text-xl font-bold">{totalBricks.toLocaleString()}</span>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          This calculation includes a {wastagePercent}% wastage factor to account for cuts, breaks, and additional needs.
        </p>
      </div>
    </div>
  );
}
