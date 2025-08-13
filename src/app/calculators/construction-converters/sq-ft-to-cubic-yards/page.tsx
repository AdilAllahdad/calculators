'use client';

import { useState, useEffect } from 'react';

export default function GallonsPerSquareFootCalculator() {
  // Calculate area section states
  const [showAreaCalculator, setShowAreaCalculator] = useState(false);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [widthUnit, setWidthUnit] = useState<string>('ft');

  // Main calculator states
  const [area, setArea] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState<string>('ft');
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('US gal');
  const [gallonsPerSqFt, setGallonsPerSqFt] = useState<number>(0);

  // Area unit conversion factors to square feet
  const areaConversions = {
    'mm²': 0.0000107639,  // square millimeters to square feet
    'cm²': 0.00107639,    // square centimeters to square feet
    'dm²': 0.107639,      // square decimeters to square feet
    'm²': 10.7639,        // square meters to square feet
    'km²': 10763910.4,    // square kilometers to square feet
    'in²': 1/144,         // square inches to square feet
    'ft²': 1,             // square feet to square feet
    'yd²': 9,             // square yards to square feet
    'mi²': 27878400,      // square miles to square feet
    'a': 1076.391,        // acres to square feet
    'da': 107639.1,       // decares to square feet
    'ha': 107639.1,       // hectares to square feet
    'ac': 43560,          // acres to square feet
    'sf': 1               // soccer fields to square feet (approximate)
  };

  // Height/depth unit conversion factors to feet
  const heightConversions = {
    'mm': 0.00328084,     // millimeters to feet
    'cm': 0.0328084,      // centimeters to feet
    'm': 3.28084,         // meters to feet
    'km': 3280.84,        // kilometers to feet
    'in': 1/12,           // inches to feet
    'ft': 1,              // feet to feet
    'yd': 3,              // yards to feet
    'mi': 5280,           // miles to feet
    'ft / in': 1,         // feet/inches stays as feet
    'm / cm': 3.28084     // meters/centimeters to feet
  };

  // Volume unit conversion factors from US gallons
  const volumeConversions = {
    'm³': 0.00378541,     // US gallons to cubic meters
    'cu in': 231,         // US gallons to cubic inches
    'cu ft': 0.133681,    // US gallons to cubic feet
    'cu yd': 0.00495113,  // US gallons to cubic yards
    'ml': 3785.41,        // US gallons to milliliters
    'cl': 378.541,        // US gallons to centiliters
    'l': 3.78541,         // US gallons to liters
    'US gal': 1,          // US gallons to US gallons
    'UK gal': 0.832674,   // US gallons to UK gallons
    'US fl oz': 128,      // US gallons to US fluid ounces
    'UK fl oz': 133.228   // US gallons to UK fluid ounces
  };

  const areaUnitOptions = [
    { value: 'mm²', label: 'square millimeters (mm²)' },
    { value: 'cm²', label: 'square centimeters (cm²)' },
    { value: 'dm²', label: 'square decimeters (dm²)' },
    { value: 'm²', label: 'square meters (m²)' },
    { value: 'km²', label: 'square kilometers (km²)' },
    { value: 'in²', label: 'square inches (in²)' },
    { value: 'ft²', label: 'square feet (ft²)' },
    { value: 'yd²', label: 'square yards (yd²)' },
    { value: 'mi²', label: 'square miles (mi²)' },
    { value: 'a', label: 'acres (a)' },
    { value: 'da', label: 'decares (da)' },
    { value: 'ha', label: 'hectares (ha)' },
    { value: 'ac', label: 'acres (ac)' },
    { value: 'sf', label: 'soccer fields (sf)' }
  ];

  const heightUnitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'km', label: 'kilometers (km)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'mi', label: 'miles (mi)' },
    { value: 'ft / in', label: 'feet / inches (ft / in)' },
    { value: 'm / cm', label: 'meters / centimeters (m / cm)' }
  ];

  const volumeUnitOptions = [
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'cu in', label: 'cubic inches (cu in)' },
    { value: 'cu ft', label: 'cubic feet (cu ft)' },
    { value: 'cu yd', label: 'cubic yards (cu yd)' },
    { value: 'ml', label: 'milliliters (ml)' },
    { value: 'cl', label: 'centiliters (cl)' },
    { value: 'l', label: 'liters (l)' },
    { value: 'US gal', label: 'gallons (US) (US gal)' },
    { value: 'UK gal', label: 'gallons (UK) (UK gal)' },
    { value: 'US fl oz', label: 'fluid ounces (US) (US fl oz)' },
    { value: 'UK fl oz', label: 'fluid ounces (UK) (UK fl oz)' }
  ];

  const lengthUnitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'km', label: 'kilometers (km)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'mi', label: 'miles (mi)' }
  ];

  useEffect(() => {
    calculateAreaFromDimensions();
  }, [length, lengthUnit, width, widthUnit]);

  useEffect(() => {
    calculateLiquidCoverage();
  }, [area, areaUnit, height, heightUnit, volumeUnit]);

  const calculateAreaFromDimensions = () => {
    if (!showAreaCalculator) return;
    
    // Convert length and width to feet
    const lengthInFt = length * (heightConversions[lengthUnit as keyof typeof heightConversions] || 1);
    const widthInFt = width * (heightConversions[widthUnit as keyof typeof heightConversions] || 1);
    
    // Calculate area in square feet
    const areaInSqFt = lengthInFt * widthInFt;
    setArea(areaInSqFt);
    setAreaUnit('ft²');
  };

  const calculateLiquidCoverage = () => {
    // Convert area to square feet
    const areaInSqFt = area * (areaConversions[areaUnit as keyof typeof areaConversions] || 1);
    
    // Convert height to feet
    const heightInFt = height * (heightConversions[heightUnit as keyof typeof heightConversions] || 1);
    
    // Calculate gallons per square foot (7.48052 gallons per cubic foot)
    const gallonsPerSqFoot = heightInFt * 7.48052;
    setGallonsPerSqFt(gallonsPerSqFoot);
    
    // Calculate total volume in gallons
    const volumeInGallons = areaInSqFt * gallonsPerSqFoot;
    
    // Convert to selected unit
    const finalVolume = volumeInGallons * (volumeConversions[volumeUnit as keyof typeof volumeConversions] || 1);
    
    setVolume(finalVolume);
  };

  const clearAll = () => {
    setArea(0);
    setHeight(0);
    setVolume(0);
    setGallonsPerSqFt(0);
    setLength(0);
    setWidth(0);
  };

  const reloadCalculator = () => {
    setArea(0);
    setHeight(0);
    setVolume(0);
    setGallonsPerSqFt(0);
    setLength(0);
    setWidth(0);
  };

  const shareResult = () => {
    const result = `Area: ${area} ${areaUnit}\nHeight: ${height} ${heightUnit}\nVolume: ${volume.toFixed(4)} ${volumeUnit}\nGallons per sq ft: ${gallonsPerSqFt.toFixed(4)} US gal / sq ft`;
    if (navigator.share) {
      navigator.share({
        title: 'Gallons per Square Foot Calculator Result',
        text: result
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
          Gallons per Square Foot Calculator 
          <span className="ml-3 text-2xl">�</span>
        </h1>
        <p className="text-lg text-slate-700">
          Welcome to our gallons per square foot calculator, the perfect tool to convert square feet to gallons and gallons to square feet. If you're building a swimming pool or an aquarium and wish to calculate how many gallons of water per square foot you need, you've come to the right place!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
          
          {/* Calculate Area Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowAreaCalculator(!showAreaCalculator)}
              className="flex items-center justify-between w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="text-lg font-medium text-slate-800">Calculate area</span>
              <span className={`transform transition-transform ${showAreaCalculator ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showAreaCalculator && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 gap-4">
                  {/* Length */}
                  <div>
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
                        placeholder="Enter length"
                      />
                      <select
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value)}
                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      >
                        {lengthUnitOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Width */}
                  <div>
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
                        placeholder="Enter width"
                      />
                      <select
                        value={widthUnit}
                        onChange={(e) => setWidthUnit(e.target.value)}
                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      >
                        {lengthUnitOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
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
              Area in square feet <span className="text-slate-400">ⓘ</span>
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

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Height
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
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
              Volume
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

          {/* Gallons per Square Foot Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gallons per square foot
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={gallonsPerSqFt.toFixed(4)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
              />
              <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600">
                US gal / sq.ft
              </div>
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

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Square feet and cubic yards explanation */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Square feet and cubic yards</h3>
            <p className="text-slate-600 mb-4">
              Square feet or ft² is a unit of area, whereas cubic yards or yd³ is a unit of volume.
            </p>
            <p className="text-slate-600 mb-4">
              Often we need to calculate the volume for construction or landscape material, for example, soil, mulch, etc., and we use cubic yards to express this volume. For example, if you are preparing a flower bed and want to know how much mulch and soil you need.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-center font-semibold text-blue-800">
                1 yard = 3 feet<br/>
                1 cubic yard = 27 cubic feet
              </div>
            </div>
          </div>

          {/* How to convert */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">How to convert square feet to cubic yards</h3>
            <p className="text-slate-600 mb-4">
              Since square feet is a measure of area, and cubic yards is a measure of volume, to convert square feet to cubic yards, we need to follow these steps:
            </p>
            <div className="space-y-2 text-slate-600">
              <p><strong>1.</strong> Determine the area by using the appropriate formula and converting the unit of area to square feet.</p>
              <p><strong>2.</strong> Measure the depth/height of the area and convert it to feet as well.</p>
              <p><strong>3.</strong> Multiply the area and depth/height, and you will get volume in cubic feet.</p>
              <p><strong>4.</strong> Divide the volume in cubic feet by 27 to get the volume in cubic yards.</p>
            </div>
          </div>

          {/* Example calculation */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Example calculation</h3>
            <p className="text-slate-600 mb-4">
              Consider a rectangular plot that is 9 feet long and 6 feet wide:
            </p>
            <div className="space-y-3 text-slate-600">
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <div className="font-mono text-sm">
                  <strong>Area calculation:</strong><br/>
                  Area = length × width<br/>
                  Area = 9 ft × 6 ft = 54 ft²
                </div>
              </div>
              <p>If we dig up the whole plot to 6-inch (or 0.5 ft) depth:</p>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="font-mono text-sm">
                  <strong>Volume calculation:</strong><br/>
                  Volume = Area × depth<br/>
                  Volume = 54 ft² × 0.5 ft = 27 ft³<br/>
                  Volume = 27 ft³ ÷ 27 = 1 yd³
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">What is a cubic yard?</h4>
                <p className="text-slate-600 text-sm">
                  A cubic yard is a unit of volume. We can define a cubic yard as the volume of a cube with length, width, and height of one yard.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">How many cubic feet are in a cubic yard?</h4>
                <p className="text-slate-600 text-sm">
                  27 cubic feet. One yard is equal to 3 feet. Hence to determine the number of cubic feet in a cubic yard, take the cube of both sides, and you will get 1 cubic yard = 27 cubic feet.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">How do I convert cubic yards to square feet?</h4>
                <p className="text-slate-600 text-sm">
                  Multiply the volume in cubic yards with 27 to get the volume in cubic feet, then divide the volume by depth or height measured in feet to get the area in square feet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
