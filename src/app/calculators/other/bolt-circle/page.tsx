"use client";

// ...existing code...



import React, { useState, useEffect } from 'react';
import { LengthInput } from '@/components/LengthInput';
import Image from 'next/image';

// Types for unit conversions and validation
type LengthUnitType = 'mm' | 'cm' | 'm' | 'in' | 'ft';
type AngleUnitType = 'deg' | 'rad';

interface HoleCoordinate {
  angle: number;
  x: number;
  y: number;
}

// Conversion factors to millimeters (base unit)
const conversionFactors: Record<LengthUnitType, number> = {
  'mm': 1,
  'cm': 10,
  'm': 1000,
  'in': 25.4,
  'ft': 304.8,
};

export default function BoltCircleCalculator() {
  // State for inputs
  const [numberOfHoles, setNumberOfHoles] = useState<string>('');
  const [firstHoleAngle, setFirstHoleAngle] = useState<string>('');
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);
  // Error state for number of holes
  const [numberOfHolesError, setNumberOfHolesError] = useState<string>('');
  
  // State for units
  const [angleUnit, setAngleUnit] = useState<AngleUnitType>('deg');
  const [offsetXUnit, setOffsetXUnit] = useState<LengthUnitType>('mm');
  const [offsetYUnit, setOffsetYUnit] = useState<LengthUnitType>('mm');
  const [radiusUnit, setRadiusUnit] = useState<LengthUnitType>('mm');

  // Handle angle unit conversion when unit changes
  const handleAngleUnitChange = (newUnit: AngleUnitType) => {
    if (firstHoleAngle && !isNaN(parseFloat(firstHoleAngle))) {
      const currentValue = parseFloat(firstHoleAngle);
      if (newUnit === 'rad' && angleUnit === 'deg') {
        // Convert degrees to radians
        setFirstHoleAngle((currentValue * Math.PI / 180).toFixed(6));
      } else if (newUnit === 'deg' && angleUnit === 'rad') {
        // Convert radians to degrees
        setFirstHoleAngle((currentValue * 180 / Math.PI).toFixed(1));
      }
    }
    setAngleUnit(newUnit);
  };

  // State for form validation and coordinates
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [holeCoordinates, setHoleCoordinates] = useState<HoleCoordinate[]>([]);

  // Validate form and calculate coordinates
  useEffect(() => {
    const holes = parseInt(numberOfHoles);
    const angle = parseFloat(firstHoleAngle);

    // Validation for number of holes
    if (!isNaN(holes) && holes > 100) {
      setNumberOfHolesError('Number of holes must be 100 or less.');
    } else {
      setNumberOfHolesError('');
    }

    const isValid = 
      !isNaN(holes) && holes >= 1 && holes <= 100 &&
      !isNaN(angle) &&
      radius > 0;

    setIsFormValid(isValid);

    if (isValid) {
      const coordinates: HoleCoordinate[] = [];
      const angleIncrement = 360 / holes;
      const radiusInMM = radius * conversionFactors[radiusUnit];
      const offsetXInMM = offsetX * conversionFactors[offsetXUnit];
      const offsetYInMM = offsetY * conversionFactors[offsetYUnit];

      for (let i = 0; i < holes; i++) {
        // Convert input angle to degrees for calculation if it's in radians
        const angleInDegrees = angleUnit === 'rad' ? angle * 180 / Math.PI : angle;
        const currentAngle = angleInDegrees + (i * angleIncrement);
        const radians = (currentAngle * Math.PI) / 180;
        
        const x = (radiusInMM * Math.cos(radians)) + offsetXInMM;
        const y = (radiusInMM * Math.sin(radians)) + offsetYInMM;

        coordinates.push({
          angle: currentAngle,
          x: Number(x.toFixed(3)),
          y: Number(y.toFixed(3)),
        });
      }

      setHoleCoordinates(coordinates);
    } else {
      setHoleCoordinates([]);
    }
  }, [numberOfHoles, firstHoleAngle, offsetX, offsetY, radius, angleUnit, offsetXUnit, offsetYUnit, radiusUnit]);
// Add reloadCalculator function to reset all calculator state
function reloadCalculator() {
  // TODO: Reset all relevant state variables to their initial values
  // Example:
  // setRadius('');
  // setDiameter('');
  // setBoltCount('');
  // setResult('');
  // setError('');
  // Add more as needed for your calculator fields
  window.location.reload(); // fallback: reloads the page to reset state
}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bolt Circle Calculator</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Hole parameters</h2>
            
            {/* Number of holes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of holes (n)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={numberOfHoles}
                onChange={(e) => setNumberOfHoles(e.target.value)}
                className={`w-full px-3 py-2 border ${numberOfHolesError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
                placeholder="Enter number of holes "
              />
              {numberOfHolesError && (
                <p className="text-red-500 text-xs mt-1">{numberOfHolesError}</p>
              )}
            </div>

            {/* First hole angle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Angle of first hole (A)
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={firstHoleAngle}
                  onChange={(e) => setFirstHoleAngle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  placeholder={`Enter angle in ${angleUnit}`}
                />
                <select
                  value={angleUnit}
                  onChange={(e) => handleAngleUnitChange(e.target.value as AngleUnitType)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="deg">deg</option>
                  <option value="rad">rad</option>
                </select>
              </div>
            </div>

            {/* Offset X */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offset from center (x<sub>c</sub>)
              </label>
              <LengthInput
                value={offsetX}
                onValueChange={setOffsetX}
                unit={offsetXUnit}
                onUnitChange={setOffsetXUnit as any}
                className="w-full"
              />
            </div>

            {/* Offset Y */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offset from center (y<sub>c</sub>)
              </label>
              <LengthInput
                value={offsetY}
                onValueChange={setOffsetY}
                unit={offsetYUnit}
                onUnitChange={setOffsetYUnit as any}
                className="w-full"
              />
            </div>

            {/* Radius */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radius of bolt circle (R)
              </label>
              <LengthInput
                value={radius}
                onValueChange={setRadius}
                unit={radiusUnit}
                onUnitChange={setRadiusUnit as any}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">Hole coordinates</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Hole</th>
                    <th className="text-left py-2">Angle (degrees)</th>
                    <th className="text-left py-2">X coordinate (mm)</th>
                    <th className="text-left py-2">Y coordinate (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {holeCoordinates.map((hole, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{hole.angle.toFixed(1)}</td>
                      <td className="py-2">{hole.x.toFixed(3)}</td>
                      <td className="py-2">{hole.y.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Reload Calculator Button - placed after table and outside tbody */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <button
                onClick={reloadCalculator}
                className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Reload Calculator
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Visual Reference</h2>
            <div className="relative aspect-square">
              <Image
                src="/bolt.jpg"
                alt="Bolt Circle Diagram"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}
