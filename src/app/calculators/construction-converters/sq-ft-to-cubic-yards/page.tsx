'use client';

import { useState, useEffect } from 'react';

export default function SquareFeetToCubicYardsCalculator() {
  // Main calculator states
  const [area, setArea] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState<string>('in');
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('cu yd');

  // Area unit conversion factors to square feet
  const areaConversions = {
    'm²': 10.7639,        // square meters to square feet
    'km²': 10763910.4,    // square kilometers to square feet
    'in²': 1/144,         // square inches to square feet
    'ft²': 1,             // square feet to square feet
    'yd²': 9,             // square yards to square feet
    'mi²': 27878400,      // square miles to square feet
  };

  // Height/depth unit conversion factors to feet
  const heightConversions = {
    'mm': 0.00328084,     // millimeters to feet
    'cm': 0.0328084,      // centimeters to feet
    'm': 3.28084,         // meters to feet
    'in': 1/12,           // inches to feet
    'ft': 1,              // feet to feet
    'yd': 3,              // yards to feet
    'ft / in': 1,         // feet/inches stays as feet
    'm / cm': 3.28084     // meters/centimeters to feet
  };

  // Volume unit conversion factors from cubic feet
  const volumeConversions = {
    'm³': 0.0283168,      // cubic feet to cubic meters
    'cu in': 1728,        // cubic feet to cubic inches
    'cu ft': 1,           // cubic feet to cubic feet
    'cu yd': 1/27,        // cubic feet to cubic yards
  };

  const areaUnitOptions = [
    { value: 'm²', label: 'square meters (m²)' },
    { value: 'km²', label: 'square kilometers (km²)' },
    { value: 'in²', label: 'square inches (in²)' },
    { value: 'ft²', label: 'square feet (ft²)' },
    { value: 'yd²', label: 'square yards (yd²)' },
    { value: 'mi²', label: 'square miles (mi²)' },
  ];

  const heightUnitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'ft / in', label: 'feet / inches (ft / in)' },
    { value: 'm / cm', label: 'meters / centimeters (m / cm)' }
  ];

  const volumeUnitOptions = [
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'cu in', label: 'cubic inches (cu in)' },
    { value: 'cu ft', label: 'cubic feet (cu ft)' },
    { value: 'cu yd', label: 'cubic yards (cu yd)' },
  ];

  useEffect(() => {
    calculateVolume();
  }, [area, areaUnit, height, heightUnit, volumeUnit]);

  const calculateVolume = () => {
    // Convert area to square feet
    const areaInSqFt = area * (areaConversions[areaUnit as keyof typeof areaConversions] || 1);
    
    // Convert height to feet
    const heightInFt = height * (heightConversions[heightUnit as keyof typeof heightConversions] || 1);
    
    // Calculate volume in cubic feet
    const volumeInCubicFeet = areaInSqFt * heightInFt;
    
    // Convert to selected unit
    const finalVolume = volumeInCubicFeet * (volumeConversions[volumeUnit as keyof typeof volumeConversions] || 1);
    
    setVolume(finalVolume);
  };

  const clearAll = () => {
    setArea(0);
    setHeight(0);
    setVolume(0);
  };

  const reloadCalculator = () => {
    setArea(0);
    setHeight(0);
    setVolume(0);
  };

  const shareResult = () => {
    const result = `Area: ${area} ${areaUnit}\nHeight/Depth: ${height} ${heightUnit}\nVolume: ${volume.toFixed(4)} ${volumeUnit}`;
    if (navigator.share) {
      navigator.share({
        title: 'Square Feet to Cubic Yards Calculator Result',
        text: result
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Square Feet to Cubic Yards Calculator 
          <span className="ml-3 text-2xl">📐</span>
        </h1>
      </div>

      <div className="flex justify-center">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-md">
          
          {/* Area Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter area"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-20 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {areaUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Height/Depth Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Height/depth <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter height/depth"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="w-20 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {heightUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Volume Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Volume <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={volume.toFixed(4)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
              />
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value)}
                className="w-24 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {volumeUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={shareResult}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <span className="text-white">🔗</span>
                Share result
              </button>
              <button
                onClick={reloadCalculator}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Reload calculator
              </button>
            </div>
            <button
              onClick={clearAll}
              className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear all changes
            </button>
          </div>

          {/* Feedback Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3">Did we solve your problem today?</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <span>👍</span>
                Yes
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <span>👎</span>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
