'use client';

import { useState, useEffect } from 'react';

export default function CubicYardCalculator() {
  const [shape, setShape] = useState<string>('Cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({
    length: 0,
    width: 0,
    height: 0,
    depth: 0,
    radius: 0,
    diameter: 0
  });
  const [units, setUnits] = useState<{ [key: string]: string }>({
    length: 'ft',
    width: 'ft',
    height: 'ft',
    depth: 'ft',
    radius: 'ft',
    diameter: 'ft'
  });
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('cu yd');
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [priceUnit, setPriceUnit] = useState<string>('cu yd');
  const [currency, setCurrency] = useState<string>('PKR');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const shapeOptions = [
    'Select',
    'Rectangular cuboid',
    'Cube',
    'Cylinder',
    'Hollow cuboid / Rectangular tube',
    'Hollow cylinder',
    'Hemisphere',
    'Cone',
    'Pyramid',
    'Other shape'
  ];

  const volumeUnitOptions = [
    { value: 'cm³', label: 'cubic centimeters (cm³)' },
    { value: 'dm³', label: 'cubic decimeters (dm³)' },
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'cu in', label: 'cubic inches (cu in)' },
    { value: 'cu ft', label: 'cubic feet (cu ft)' },
    { value: 'cu yd', label: 'cubic yards (cu yd)' }
  ];

  const priceUnitOptions = [
    { value: 'cm³', label: 'cubic centimeter (cm³)' },
    { value: 'dm³', label: 'cubic decimeter (dm³)' },
    { value: 'm³', label: 'cubic meter (m³)' },
    { value: 'cu in', label: 'cubic inch (cu in)' },
    { value: 'cu ft', label: 'cubic foot (cu ft)' },
    { value: 'cu yd', label: 'cubic yard (cu yd)' }
  ];

  const unitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  // Conversion factors to feet
  const unitConversions = {
    'mm': 0.00328084,
    'cm': 0.0328084,
    'm': 3.28084,
    'in': 1/12,
    'ft': 1,
    'yd': 3,
    'ft/in': 1,
    'm/cm': 3.28084
  };

  // Volume unit conversion factors from cubic yards
  const volumeConversions = {
    'cm³': 764554.857984, // cubic yards to cubic centimeters
    'dm³': 764.554857984, // cubic yards to cubic decimeters
    'm³': 0.764554857984, // cubic yards to cubic meters
    'cu in': 46656,       // cubic yards to cubic inches
    'cu ft': 27,          // cubic yards to cubic feet
    'cu yd': 1            // cubic yards to cubic yards
  };

  useEffect(() => {
    calculateVolume();
  }, [shape, dimensions, units, volumeUnit, pricePerUnit, priceUnit]);

  const calculateVolume = () => {
    let volumeInCubicFt = 0;

    // Convert all dimensions to feet
    const convertedDims = Object.keys(dimensions).reduce((acc, key) => {
      const conversion = unitConversions[units[key] as keyof typeof unitConversions] || 1;
      acc[key] = dimensions[key] * conversion;
      return acc;
    }, {} as { [key: string]: number });

    const { length, width, height, depth, radius, diameter } = convertedDims;

    switch (shape) {
      case 'Cube':
        volumeInCubicFt = Math.pow(length, 3);
        break;
      case 'Rectangular cuboid':
        volumeInCubicFt = length * width * height;
        break;
      case 'Cylinder':
        const cylRadius = radius || diameter / 2;
        volumeInCubicFt = Math.PI * Math.pow(cylRadius, 2) * height;
        break;
      case 'Hollow cuboid / Rectangular tube':
        const outerVolume = length * width * height;
        const innerVolume = (length - 2 * depth) * (width - 2 * depth) * height;
        volumeInCubicFt = outerVolume - Math.max(0, innerVolume);
        break;
      case 'Hollow cylinder':
        const outerRadius = radius || diameter / 2;
        const innerRadius = Math.max(0, outerRadius - depth);
        volumeInCubicFt = Math.PI * height * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
        break;
      case 'Hemisphere':
        const hemiRadius = radius || diameter / 2;
        volumeInCubicFt = (2/3) * Math.PI * Math.pow(hemiRadius, 3);
        break;
      case 'Cone':
        const coneRadius = radius || diameter / 2;
        volumeInCubicFt = (1/3) * Math.PI * Math.pow(coneRadius, 2) * height;
        break;
      case 'Pyramid':
        volumeInCubicFt = (1/3) * length * width * height;
        break;
      default:
        volumeInCubicFt = 0;
    }

    // Convert to cubic yards (1 cubic yard = 27 cubic feet)
    const volumeInCubicYd = volumeInCubicFt / 27;
    
    // Convert to selected volume unit
    const finalVolume = volumeInCubicYd * (volumeConversions[volumeUnit as keyof typeof volumeConversions] || 1);
    
    // Convert price based on selected price unit
    const priceConversion = volumeConversions[priceUnit as keyof typeof volumeConversions] || 1;
    const volumeInPriceUnit = volumeInCubicYd * priceConversion;
    
    setVolume(finalVolume);
    setTotalPrice(volumeInPriceUnit * pricePerUnit);
  };

  const getShapeImage = () => {
    const getImageSrc = () => {
      switch (shape) {
        case 'Cube':
          return '/cube-removebg-preview.png';
        case 'Rectangular cuboid':
          return '/cuboid-removebg-preview.png';
        case 'Cylinder':
          return '/cylinder2-removebg-preview.png';
        case 'Hollow cuboid / Rectangular tube':
          return '/hollow_cuboid-removebg-preview.png';
        case 'Hollow cylinder':
          return '/hollow_cylinder-removebg-preview.png';
        case 'Hemisphere':
          return '/hemisphere-removebg-preview.png';
        case 'Cone':
          return '/cone-removebg-preview.png';
        case 'Pyramid':
          return '/pyramid-removebg-preview.png';
        case 'Other shape':
          return '/other2-removebg-preview.png';
        default:
          return null;
      }
    };

    const imageSrc = getImageSrc();

    if (!imageSrc) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center">
          <div className="text-green-700 text-lg font-semibold">Select a shape</div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center relative overflow-hidden">
        <img 
          src={imageSrc}
          alt={shape}
          className="max-h-full max-w-full object-contain rounded-lg"
        />
      </div>
    );
  };

  const getRequiredFields = () => {
    switch (shape) {
      case 'Cube':
        return ['length'];
      case 'Rectangular cuboid':
        return ['length', 'width', 'height'];
      case 'Cylinder':
        return ['radius', 'height'];
      case 'Hollow cuboid / Rectangular tube':
        return ['length', 'width', 'height', 'depth'];
      case 'Hollow cylinder':
        return ['radius', 'height', 'depth'];
      case 'Hemisphere':
        return ['radius'];
      case 'Cone':
        return ['radius', 'height'];
      case 'Pyramid':
        return ['length', 'width', 'height'];
      default:
        return [];
    }
  };

  const clearAll = () => {
    setShape('Cube');
    setDimensions({
      length: 0,
      width: 0,
      height: 0,
      depth: 0,
      radius: 0,
      diameter: 0
    });
    setUnits({
      length: 'ft',
      width: 'ft',
      height: 'ft',
      depth: 'ft',
      radius: 'ft',
      diameter: 'ft'
    });
    setVolume(0);
    setVolumeUnit('cu yd');
    setPricePerUnit(0);
    setPriceUnit('cu yd');
    setTotalPrice(0);
  };

  const reloadCalculator = () => {
    clearAll();
  };

  const shareResult = () => {
    const result = `Shape: ${shape}\nVolume: ${volume.toFixed(4)} ${volumeUnit}\nTotal Price: ${currency} ${totalPrice.toFixed(2)}`;
    if (navigator.share) {
      navigator.share({
        title: 'Cubic Yard Calculator Result',
        text: result
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Cubic Yard Calculator 
          <span className="ml-3 text-2xl">📦</span>
        </h1>
       
      </div>

      {/* Calculator Form */}
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
          
          {/* Shape and dimensions section */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-blue-600 mr-2">📐</span>
              <h3 className="text-lg font-semibold text-slate-800">Shape and dimensions</h3>
            </div>
            
            {/* Shape selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Shape
              </label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {shapeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Shape visualization */}
            <div className="mb-6">
              {getShapeImage()}
            </div>

            {/* Dynamic dimension inputs */}
            {getRequiredFields().map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                  {field === 'length' && shape === 'Cube' ? 'Length and Depth / Height' : field}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={dimensions[field]}
                    onChange={(e) => setDimensions(prev => ({ 
                      ...prev, 
                      [field]: Number(e.target.value) || 0 
                    }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder={`Enter ${field}`}
                  />
                  <select
                    value={units[field]}
                    onChange={(e) => setUnits(prev => ({ 
                      ...prev, 
                      [field]: e.target.value 
                    }))}
                    className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
            ))}
          </div>

          {/* Yardage section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Yardage</h3>
            <div>
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
                  className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  {volumeUnitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cost calculation section */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-blue-600 mr-2">💰</span>
              <h3 className="text-lg font-semibold text-slate-800">Cost calculation</h3>
            </div>
            
            {/* Price per unit */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price per unit
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Price per unit"
                />
                <span className="text-slate-600 px-2 py-2 text-sm">/</span>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-44 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  {priceUnitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total price */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total price
              </label>
              <div className="text-2xl font-bold text-green-600">
                {currency} {totalPrice.toFixed(2)}
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
    </div>
  );
}
