'use client';

import { useState, useEffect } from 'react';

export default function GallonsPerSquareFootCalculator() {
  const [areaValue, setAreaValue] = useState<string>('0');
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  const [heightValue, setHeightValue] = useState<string>('0');
  const [heightUnit, setHeightUnit] = useState<string>('ft');
  const [volumeValue, setVolumeValue] = useState<string>('0');
  const [volumeUnit, setVolumeUnit] = useState<string>('US gal');
  const [gallonsPerSqFtValue, setGallonsPerSqFtValue] = useState<string>('0');
  const [gallonsPerSqFtUnit, setGallonsPerSqFtUnit] = useState<string>('US gal');
  
  // Area calculation states
  const [showAreaCalculator, setShowAreaCalculator] = useState<boolean>(false);
  const [lengthValue, setLengthValue] = useState<string>('0');
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [widthValue, setWidthValue] = useState<string>('0');
  const [widthUnit, setWidthUnit] = useState<string>('ft');

  // Unit conversion factors to base units
  const areaConversions = {
    'mm²': 0.00001076391,
    'cm²': 0.001076391,
    'dm²': 0.1076391,
    'm²': 10.7639,
    'km²': 10763910.4,
    'in²': 0.00694444,
    'ft²': 1,
    'yd²': 9,
    'mi²': 27878400,
    'a': 107.639,
    'da': 1076.391,
    'ha': 107639.1,
    'ac': 43560,
    'sf': 43560
  };

  const lengthConversions = {
    'mm': 0.00328084,
    'cm': 0.0328084,
    'm': 3.28084,
    'km': 3280.84,
    'in': 0.0833333,
    'ft': 1,
    'yd': 3,
    'mi': 5280,
    'ft / in': 1
  };

  const volumeConversions = {
    'm³': 264.172,
    'cu in': 0.004329,
    'cu ft': 7.48052,
    'cu yd': 202.0,
    'ml': 0.000264172,
    'cl': 0.00264172,
    'l': 0.264172,
    'US gal': 1,
    'UK gal': 1.20095,
    'US fl oz': 0.0078125,
    'UK fl oz': 0.00625
  };

  const convertToBaseSqFt = (value: number, unit: string): number => {
    return value * (areaConversions[unit as keyof typeof areaConversions] || 1);
  };

  const convertToBaseFt = (value: number, unit: string): number => {
    return value * (lengthConversions[unit as keyof typeof lengthConversions] || 1);
  };

  const convertToBaseGallons = (value: number, unit: string): number => {
    return value * (volumeConversions[unit as keyof typeof volumeConversions] || 1);
  };

  const convertFromBaseSqFt = (value: number, unit: string): number => {
    return value / (areaConversions[unit as keyof typeof areaConversions] || 1);
  };

  const convertFromBaseGallons = (value: number, unit: string): number => {
    return value / (volumeConversions[unit as keyof typeof volumeConversions] || 1);
  };

  const calculateArea = () => {
    if (lengthValue && widthValue) {
      const lengthInFt = convertToBaseFt(parseFloat(lengthValue), lengthUnit);
      const widthInFt = convertToBaseFt(parseFloat(widthValue), widthUnit);
      const areaInSqFt = lengthInFt * widthInFt;
      const convertedArea = convertFromBaseSqFt(areaInSqFt, areaUnit);
      setAreaValue(convertedArea.toFixed(6));
      calculateFromAreaAndHeight();
    }
  };

  const calculateFromAreaAndHeight = () => {
    if (areaValue && heightValue) {
      const areaInSqFt = convertToBaseSqFt(parseFloat(areaValue), areaUnit);
      const heightInFt = convertToBaseFt(parseFloat(heightValue), heightUnit);
      
      // Gallons per square foot = height in feet × 7.48052
      const gallonsPerSqFt = heightInFt * 7.48052;
      const convertedGallonsPerSqFt = convertFromBaseGallons(gallonsPerSqFt, gallonsPerSqFtUnit);
      setGallonsPerSqFtValue(convertedGallonsPerSqFt.toFixed(6));
      
      // Total volume = area × gallons per square foot
      const totalVolumeInGallons = areaInSqFt * gallonsPerSqFt;
      const convertedVolume = convertFromBaseGallons(totalVolumeInGallons, volumeUnit);
      setVolumeValue(convertedVolume.toFixed(6));
    }
  };

  const calculateFromVolumeAndHeight = () => {
    if (volumeValue && heightValue) {
      const volumeInGallons = convertToBaseGallons(parseFloat(volumeValue), volumeUnit);
      const heightInFt = convertToBaseFt(parseFloat(heightValue), heightUnit);
      
      // Gallons per square foot = height in feet × 7.48052
      const gallonsPerSqFt = heightInFt * 7.48052;
      const convertedGallonsPerSqFt = convertFromBaseGallons(gallonsPerSqFt, gallonsPerSqFtUnit);
      setGallonsPerSqFtValue(convertedGallonsPerSqFt.toFixed(6));
      
      // Area = volume / gallons per square foot
      const areaInSqFt = volumeInGallons / gallonsPerSqFt;
      const convertedArea = convertFromBaseSqFt(areaInSqFt, areaUnit);
      setAreaValue(convertedArea.toFixed(6));
    }
  };

  const handleAreaChange = (value: string) => {
    setAreaValue(value);
    if (value && heightValue) {
      setTimeout(calculateFromAreaAndHeight, 0);
    }
  };

  const handleHeightChange = (value: string) => {
    setHeightValue(value);
    if (areaValue && value) {
      setTimeout(calculateFromAreaAndHeight, 0);
    } else if (volumeValue && value) {
      setTimeout(calculateFromVolumeAndHeight, 0);
    }
  };

  const handleVolumeChange = (value: string) => {
    setVolumeValue(value);
    if (value && heightValue) {
      setTimeout(calculateFromVolumeAndHeight, 0);
    }
  };

  const handleLengthChange = (value: string) => {
    setLengthValue(value);
    if (value && widthValue) {
      setTimeout(calculateArea, 0);
    }
  };

  const handleWidthChange = (value: string) => {
    setWidthValue(value);
    if (lengthValue && value) {
      setTimeout(calculateArea, 0);
    }
  };

  const reloadCalculator = () => {
    setAreaValue('0');
    setHeightValue('0');
    setVolumeValue('0');
    setGallonsPerSqFtValue('0');
    setLengthValue('0');
    setWidthValue('0');
    setAreaUnit('ft²');
    setHeightUnit('ft');
    setVolumeUnit('US gal');
    setGallonsPerSqFtUnit('US gal');
    setLengthUnit('ft');
    setWidthUnit('ft');
  };

  const clearAllChanges = () => {
    reloadCalculator();
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gallons per Square Foot Calculator Result',
        text: `Area: ${areaValue} ${areaUnit}, Height: ${heightValue} ${heightUnit}, Volume: ${volumeValue} ${volumeUnit}, Gallons per sq ft: ${gallonsPerSqFtValue} ${gallonsPerSqFtUnit}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const result = `Area: ${areaValue} ${areaUnit}, Height: ${heightValue} ${heightUnit}, Volume: ${volumeValue} ${volumeUnit}, Gallons per sq ft: ${gallonsPerSqFtValue} ${gallonsPerSqFtUnit}`;
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Gallons per Square Foot Calculator 
          <span className="ml-3 text-2xl">💧</span>
        </h1>
      </div>

      <div className="flex justify-center">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-md">
          
          {/* Area Calculator Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowAreaCalculator(!showAreaCalculator)}
              className="flex items-center justify-between w-full p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-lg font-semibold text-blue-900">
                Calculate area
              </span>
              <svg
                className={showAreaCalculator 
                  ? "w-5 h-5 text-blue-600 transform transition-transform rotate-180" 
                  : "w-5 h-5 text-blue-600 transform transition-transform"
                }
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAreaCalculator && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={lengthValue}
                        onChange={(e) => handleLengthChange(e.target.value)}
                        placeholder="Enter length"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value)}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="mm">millimeters (mm)</option>
                        <option value="cm">centimeters (cm)</option>
                        <option value="m">meters (m)</option>
                        <option value="km">kilometers (km)</option>
                        <option value="in">inches (in)</option>
                        <option value="ft">feet (ft)</option>
                        <option value="yd">yards (yd)</option>
                        <option value="mi">miles (mi)</option>
                        <option value="ft / in">feet / inches (ft / in)</option>
                        <option value="m / cm">meters / centimeters (m / cm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={widthValue}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        placeholder="Enter width"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={widthUnit}
                        onChange={(e) => setWidthUnit(e.target.value)}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="mm">millimeters (mm)</option>
                        <option value="cm">centimeters (cm)</option>
                        <option value="m">meters (m)</option>
                        <option value="km">kilometers (km)</option>
                        <option value="in">inches (in)</option>
                        <option value="ft">feet (ft)</option>
                        <option value="yd">yards (yd)</option>
                        <option value="mi">miles (mi)</option>
                        <option value="ft / in">feet / inches (ft / in)</option>
                        <option value="m / cm">meters / centimeters (m / cm)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Area Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area in square feet <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={areaValue}
                onChange={(e) => handleAreaChange(e.target.value)}
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
                <option value="mm²">mm²</option>
                <option value="cm²">cm²</option>
                <option value="dm²">dm²</option>
                <option value="m²">m²</option>
                <option value="km²">km²</option>
                <option value="in²">in²</option>
                <option value="ft²">ft²</option>
                <option value="yd²">yd²</option>
                <option value="mi²">mi²</option>
                <option value="a">a</option>
                <option value="da">da</option>
                <option value="ha">ha</option>
                <option value="ac">ac</option>
                <option value="sf">sf</option>
              </select>
            </div>
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Height <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={heightValue}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter height"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="w-20 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="km">km</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
                <option value="yd">yd</option>
                <option value="mi">mi</option>
                <option value="ft / in">ft / in</option>
                <option value="m / cm">m / cm</option>
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
                value={volumeValue}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
                placeholder="Volume will be calculated"
              />
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value)}
                className="w-24 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                <option value="m³">m³</option>
                <option value="cu in">cu in</option>
                <option value="cu ft">cu ft</option>
                <option value="cu yd">cu yd</option>
                <option value="ml">ml</option>
                <option value="cl">cl</option>
                <option value="l">l</option>
                <option value="US gal">US gal</option>
                <option value="UK gal">UK gal</option>
                <option value="US fl oz">US fl oz</option>
                <option value="UK fl oz">UK fl oz</option>
              </select>
            </div>
          </div>

          {/* Gallons per Square Foot Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gallons per square foot <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={gallonsPerSqFtValue}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
                placeholder="Will be calculated"
              />
              <select
                value={gallonsPerSqFtUnit}
                onChange={(e) => setGallonsPerSqFtUnit(e.target.value)}
                className="w-24 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                <option value="US gal">US gal</option>
                <option value="UK gal">UK gal</option>
              </select>
            </div>
            <div className="mt-1 text-xs text-slate-500">per sq.ft</div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={shareResult}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <span className="text-white">⚡</span>
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
              onClick={clearAllChanges}
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
                <span>✓</span>
                Yes
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <span>✗</span>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
