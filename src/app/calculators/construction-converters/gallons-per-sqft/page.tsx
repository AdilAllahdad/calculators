'use client';

import { useState, useEffect } from 'react';

export default function GallonsPerSquareFootCalculator() {
  const [areaValue, setAreaValue] = useState<string>('0');
  // const [areaValue, setAreaValue] = useState<string>('0');
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  // const [heightValue, setHeightValue] = useState<string>('0');
  const [heightValue, setHeightValue] = useState<string>('0');
  const [heightUnit, setHeightUnit] = useState<string>('ft');
  const [volumeValue, setVolumeValue] = useState<string>('0');
  // const [volumeValue, setVolumeValue] = useState<string>('0');
  const [volumeUnit, setVolumeUnit] = useState<string>('US gal');
  const [gallonsPerSqFtValue, setGallonsPerSqFtValue] = useState<string>('0');
  // const [gallonsPerSqFtValue, setGallonsPerSqFtValue] = useState<string>('0');
  const [gallonsPerSqFtUnit, setGallonsPerSqFtUnit] = useState<string>('US gal');
  
  // Area calculation states
  const [lengthValue, setLengthValue] = useState<string>('0');
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [widthValue, setWidthValue] = useState<string>('0');
  // const [widthValue, setWidthValue] = useState<string>('0');
  const [widthUnit, setWidthUnit] = useState<string>('ft');

  // Add useEffect to calculate area when component mounts or when length/width values change
  useEffect(() => {
    if (lengthValue !== '0' && widthValue !== '0') {
      calculateArea();
    }
  }, [lengthValue, widthValue, lengthUnit, widthUnit]);

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
    return value * (areaConversions[unit as keyof typeof areaConversions] || 1);
  };

  const convertToBaseFt = (value: number, unit: string): number => {
    return value * (lengthConversions[unit as keyof typeof lengthConversions] || 1);
    return value * (lengthConversions[unit as keyof typeof lengthConversions] || 1);
  };

  const convertToBaseGallons = (value: number, unit: string): number => {
    return value * (volumeConversions[unit as keyof typeof volumeConversions] || 1);
    return value * (volumeConversions[unit as keyof typeof volumeConversions] || 1);
  };

  const convertFromBaseSqFt = (value: number, unit: string): number => {
    return value / (areaConversions[unit as keyof typeof areaConversions] || 1);
    return value / (areaConversions[unit as keyof typeof areaConversions] || 1);
  };

  const convertFromBaseGallons = (value: number, unit: string): number => {
    return value / (volumeConversions[unit as keyof typeof volumeConversions] || 1);
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
          
          {/* Length Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={lengthValue}
                onChange={(e) => handleLengthChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter length"
              />
              <div className="relative min-w-[120px]">
                <select
                  value={lengthUnit}
                  onChange={(e) => setLengthUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none pr-8"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm" className="text-blue-600">millimeters (mm)</option>
                  <option value="cm" className="text-blue-600">centimeters (cm)</option>
                  <option value="m" className="text-blue-600">meters (m)</option>
                  <option value="km" className="text-blue-600">kilometers (km)</option>
                  <option value="in" className="text-blue-600">inches (in)</option>
                  <option value="ft" className="text-blue-600">feet (ft)</option>
                  <option value="yd" className="text-blue-600">yards (yd)</option>
                  <option value="mi" className="text-blue-600">miles (mi)</option>
                  <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                  <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-slate-500">▼</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Width Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={widthValue}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter width"
              />
              <div className="relative min-w-[120px]">
                <select
                  value={widthUnit}
                  onChange={(e) => setWidthUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none pr-8"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm" className="text-blue-600">millimeters (mm)</option>
                  <option value="cm" className="text-blue-600">centimeters (cm)</option>
                  <option value="m" className="text-blue-600">meters (m)</option>
                  <option value="km" className="text-blue-600">kilometers (km)</option>
                  <option value="in" className="text-blue-600">inches (in)</option>
                  <option value="ft" className="text-blue-600">feet (ft)</option>
                  <option value="yd" className="text-blue-600">yards (yd)</option>
                  <option value="mi" className="text-blue-600">miles (mi)</option>
                  <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                  <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-slate-500">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area <span className="text-slate-400">⋯</span>
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
              <div className="relative min-w-[120px]">
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none pr-8"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm²" className="text-blue-600">square millimeters (mm²)</option>
                  <option value="cm²" className="text-blue-600">square centimeters (cm²)</option>
                  <option value="dm²" className="text-blue-600">square decimeters (dm²)</option>
                  <option value="m²" className="text-blue-600">square meters (m²)</option>
                  <option value="km²" className="text-blue-600">square kilometers (km²)</option>
                  <option value="in²" className="text-blue-600">square inches (in²)</option>
                  <option value="ft²" className="text-blue-600">square feet (ft²)</option>
                  <option value="yd²" className="text-blue-600">square yards (yd²)</option>
                  <option value="mi²" className="text-blue-600">square miles (mi²)</option>
                  <option value="a" className="text-blue-600">ares (a)</option>
                  <option value="da" className="text-blue-600">decares (da)</option>
                  <option value="ha" className="text-blue-600">hectares (ha)</option>
                  <option value="ac" className="text-blue-600">acres (ac)</option>
                  <option value="sf" className="text-blue-600">square feet (sf)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-slate-500">▼</span>
                </div>
              </div>
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
              <div className="relative min-w-[120px]">
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none pr-8"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm" className="text-blue-600">millimeters (mm)</option>
                  <option value="cm" className="text-blue-600">centimeters (cm)</option>
                  <option value="m" className="text-blue-600">meters (m)</option>
                  <option value="km" className="text-blue-600">kilometers (km)</option>
                  <option value="in" className="text-blue-600">inches (in)</option>
                  <option value="ft" className="text-blue-600">feet (ft)</option>
                  <option value="yd" className="text-blue-600">yards (yd)</option>
                  <option value="mi" className="text-blue-600">miles (mi)</option>
                  <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                  <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-slate-500">▼</span>
                </div>
              </div>
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
              <div className="relative min-w-[120px]">
                <select
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  style={{ color: '#2563eb' }}
                >
                  <option value="m³" className="text-blue-600">cubic meters (m³)</option>
                  <option value="cu in" className="text-blue-600">cubic inches (cu in)</option>
                  <option value="cu ft" className="text-blue-600">cubic feet (cu ft)</option>
                  <option value="cu yd" className="text-blue-600">cubic yards (cu yd)</option>
                  <option value="ml" className="text-blue-600">milliliters (ml)</option>
                  <option value="cl" className="text-blue-600">centiliters (cl)</option>
                  <option value="l" className="text-blue-600">liters (l)</option>
                  <option value="US gal" className="bg-blue-500 text-white">gallons (US) (US gal)</option>
                  <option value="UK gal" className="text-blue-600">gallons (UK) (UK gal)</option>
                  <option value="US fl oz" className="text-blue-600">fluid ounces (US) (US fl oz)</option>
                  <option value="UK fl oz" className="text-blue-600">fluid ounces (UK) (UK fl oz)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-blue-600">▼</span>
                </div>
              </div>
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
              <div className="relative min-w-[120px]">
                <select
                  value={gallonsPerSqFtUnit}
                  onChange={(e) => setGallonsPerSqFtUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  style={{ color: '#2563eb' }}
                                >
                  <option value="m³" className="text-blue-600">cubic meters (m³)</option>
                  <option value="cu in" className="text-blue-600">cubic inches (cu in)</option>
                  <option value="cu ft" className="text-blue-600">cubic feet (cu ft)</option>
                  <option value="cu yd" className="text-blue-600">cubic yards (cu yd)</option>
                  <option value="ml" className="text-blue-600">milliliters (ml)</option>
                  <option value="cl" className="text-blue-600">centiliters (cl)</option>
                  <option value="l" className="text-blue-600">liters (l)</option>
                  <option value="US gal" className="bg-blue-500 text-white">gallons (US) (US gal)</option>
                  <option value="UK gal" className="text-blue-600">gallons (UK) (UK gal)</option>
                  <option value="US fl oz" className="text-blue-600">fluid ounces (US) (US fl oz)</option>
                  <option value="UK fl oz" className="text-blue-600">fluid ounces (UK) (UK fl oz)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-blue-600">▼</span>
                </div>
              </div>
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
