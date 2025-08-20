'use client';

import { useState, useEffect } from 'react';
import { 
  convertLength, 
  convertArea, 
  convertVolume, 
  convertToComposite, 
  convertFromComposite, 
  convertBetweenComposites,
  formatNumber 
} from '@/lib/conversions';

export default function SquareFeetToCubicYardsCalculator() {
  // Main calculator states
  const [area, setArea] = useState<string>('');
  const [areaUnit, setAreaUnit] = useState<string>('ft²');
  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<string>('in');
  
  // Additional states for composite height units
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');
  const [heightMeters, setHeightMeters] = useState<string>('');
  const [heightCentimeters, setHeightCentimeters] = useState<string>('');
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('cu yd');
  
  // Error states
  const [areaError, setAreaError] = useState<string>('');
  const [heightError, setHeightError] = useState<string>('');
  const [heightFeetError, setHeightFeetError] = useState<string>('');
  const [heightInchesError, setHeightInchesError] = useState<string>('');
  const [heightMetersError, setHeightMetersError] = useState<string>('');
  const [heightCentimetersError, setHeightCentimetersError] = useState<string>('');

  // Area unit conversion factors to square feet
  const areaConversions = {
    'm²': 10.7639,        // square meters to square feet
    'km²': 10763910.4,    // square kilometers to square feet
    'in²': 1/144,         // square inches to square feet
    'ft²': 1,             // square feet to square feet
    'yd²': 9,             // square yards to square feet
    'mi²': 27878400,      // square miles to square feet
  };

  // Direct conversion factors between area units (for better precision)
  const directAreaConversions: Record<string, Record<string, number>> = {
    'm²': {
      'km²': 0.000001,       // square meters to square kilometers
      'in²': 1550.0031,      // square meters to square inches
      'ft²': 10.7639,        // square meters to square feet
      'yd²': 1.19599,        // square meters to square yards
      'mi²': 3.861e-7,       // square meters to square miles
    },
    'km²': {
      'm²': 1000000,         // square kilometers to square meters
      'in²': 1.55e+9,        // square kilometers to square inches
      'ft²': 10763910.4,     // square kilometers to square feet
      'yd²': 1195990.05,     // square kilometers to square yards
      'mi²': 0.386102,       // square kilometers to square miles
    },
    'in²': {
      'm²': 0.00064516,      // square inches to square meters
      'km²': 6.4516e-10,     // square inches to square kilometers
      'ft²': 0.00694444,     // square inches to square feet
      'yd²': 0.000771605,    // square inches to square yards
      'mi²': 2.491e-10,      // square inches to square miles
    },
    'ft²': {
      'm²': 0.092903,        // square feet to square meters
      'km²': 9.2903e-8,      // square feet to square kilometers
      'in²': 144,            // square feet to square inches
      'yd²': 0.111111,       // square feet to square yards
      'mi²': 3.587e-8,       // square feet to square miles
    },
    'yd²': {
      'm²': 0.836127,        // square yards to square meters
      'km²': 8.36127e-7,     // square yards to square kilometers
      'in²': 1296,           // square yards to square inches
      'ft²': 9,              // square yards to square feet
      'mi²': 3.228e-7,       // square yards to square miles
    },
    'mi²': {
      'm²': 2589988.11,      // square miles to square meters
      'km²': 2.58999,        // square miles to square kilometers
      'in²': 4.014e+9,       // square miles to square inches
      'ft²': 27878400,       // square miles to square feet
      'yd²': 3097600,        // square miles to square yards
    },
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

  // Direct conversion factors between height units (for better precision)
  const directHeightConversions: Record<string, Record<string, number>> = {
    'mm': {
      'cm': 0.1,            // millimeters to centimeters
      'm': 0.001,           // millimeters to meters
      'in': 0.0393701,      // millimeters to inches
      'ft': 0.00328084,     // millimeters to feet
      'yd': 0.00109361,     // millimeters to yards
    },
    'cm': {
      'mm': 10,             // centimeters to millimeters
      'm': 0.01,            // centimeters to meters
      'in': 0.393701,       // centimeters to inches
      'ft': 0.0328084,      // centimeters to feet
      'yd': 0.0109361,      // centimeters to yards
    },
    'm': {
      'mm': 1000,           // meters to millimeters
      'cm': 100,            // meters to centimeters
      'in': 39.3701,        // meters to inches
      'ft': 3.28084,        // meters to feet
      'yd': 1.09361,        // meters to yards
    },
    'in': {
      'mm': 25.4,           // inches to millimeters
      'cm': 2.54,           // inches to centimeters
      'm': 0.0254,          // inches to meters
      'ft': 1/12,           // inches to feet
      'yd': 1/36,           // inches to yards
    },
    'ft': {
      'mm': 304.8,          // feet to millimeters
      'cm': 30.48,          // feet to centimeters
      'm': 0.3048,          // feet to meters
      'in': 12,             // feet to inches
      'yd': 1/3,            // feet to yards
    },
    'yd': {
      'mm': 914.4,          // yards to millimeters
      'cm': 91.44,          // yards to centimeters
      'm': 0.9144,          // yards to meters
      'in': 36,             // yards to inches
      'ft': 3,              // yards to feet
    },
  };

  // Volume unit conversion factors from cubic feet
  const volumeConversions = {
    'm³': 0.0283168,      // cubic feet to cubic meters
    'cu in': 1728,        // cubic feet to cubic inches
    'cu ft': 1,           // cubic feet to cubic feet
    'cu yd': 1/27,        // cubic feet to cubic yards
  };

  // Direct conversion factors between volume units (for better precision)
  const directVolumeConversions: Record<string, Record<string, number>> = {
    'm³': {
      'cu in': 61023.7,      // cubic meters to cubic inches
      'cu ft': 35.3147,      // cubic meters to cubic feet
      'cu yd': 1.30795,      // cubic meters to cubic yards
    },
    'cu in': {
      'm³': 1.6387e-5,       // cubic inches to cubic meters
      'cu ft': 0.000578704,  // cubic inches to cubic feet
      'cu yd': 2.14335e-5,   // cubic inches to cubic yards
    },
    'cu ft': {
      'm³': 0.0283168,       // cubic feet to cubic meters
      'cu in': 1728,         // cubic feet to cubic inches
      'cu yd': 0.037037,     // cubic feet to cubic yards
    },
    'cu yd': {
      'm³': 0.764555,        // cubic yards to cubic meters
      'cu in': 46656,        // cubic yards to cubic inches
      'cu ft': 27,           // cubic yards to cubic feet
    },
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
  }, [area, areaUnit, height, heightUnit, heightFeet, heightInches, heightMeters, heightCentimeters, volumeUnit]);

  // Handler for numeric input fields
  const handleNumberInput = (
    value: string, 
    setter: (val: string) => void,
    errorSetter: (error: string) => void
  ) => {
    // Clear previous error
    errorSetter('');
    
    // Allow empty string
    if (value === '') {
      setter('');
      return;
    }
    
    // Check if value is negative
    const numValue = Number(value);
    if (numValue < 0) {
      errorSetter("Negative values are not allowed");
      setter('');
      return;
    }
    
    // If it's a valid non-negative number, set it
    setter(value);
  };

  // Function to handle unit changes with value conversion
  const handleUnitChange = (
    value: string, 
    oldUnit: string, 
    newUnit: string, 
    setter: (val: string) => void, 
    conversionType: 'length' | 'area' | 'volume'
  ) => {
    // If there's no value, no need to convert
    if (!value || value === '') {
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return;
    }

    // Convert based on the type
    let newValue: number;
    
    switch (conversionType) {
      case 'length':
        newValue = convertLength(numValue, oldUnit, newUnit);
        break;
      case 'area':
        newValue = convertArea(numValue, oldUnit, newUnit);
        break;
      case 'volume':
        newValue = convertVolume(numValue, oldUnit, newUnit);
        break;
      default:
        throw new Error(`Unsupported conversion type: ${conversionType}`);
    }
    
    // Format the result
    const formattedValue = formatNumber(newValue, { useCommas: false });
    
    setter(formattedValue);
  };

  const handleFocus = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
    if (currentValue !== '') {
      e.target.select();
    }
  };

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: number): string => {
    return formatNumber(value, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
      useCommas: true
    });
  };

  // Function to convert between single and composite units
  const convertBetweenSingleAndComposite = (
    value: string,
    fromUnit: string,
    toUnit: string
  ) => {
    // When converting from a single unit to a composite unit, we need the value
    // When converting from a composite unit, we ignore the value and use state directly
    if ((['ft / in', 'm / cm'].includes(fromUnit)) && value === '') {
      // No need to validate value when converting from composite units
    } else if (!value || value === '') {
      return;
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return;
      }
    }

    // For conversions from single to composite, we need the numeric value
    const numValue = value ? Number(value) : 0;

    // Convert from single unit to ft/in
    if (toUnit === 'ft / in' && fromUnit !== 'ft / in' && fromUnit !== 'm / cm') {
      // Use the conversion utility
      const result = convertToComposite(numValue, fromUnit, 'ft / in');
      
      // Update the feet and inches state
      setHeightFeet(result.whole.toString());
      setHeightInches(result.fraction.toFixed(2));
      
      // Clear the single unit value
      setHeight('');
    }
    // Convert from single unit to m/cm
    else if (toUnit === 'm / cm' && fromUnit !== 'ft / in' && fromUnit !== 'm / cm') {
      // Use the conversion utility
      const result = convertToComposite(numValue, fromUnit, 'm / cm');
      
      // Update the meters and centimeters state
      setHeightMeters(result.whole.toString());
      setHeightCentimeters(result.fraction.toFixed(2));
      
      // Clear the single unit value
      setHeight('');
    }
    // Convert from ft/in to single unit
    else if (fromUnit === 'ft / in' && toUnit !== 'm / cm') {
      const feetValue = Number(heightFeet || '0');
      const inchesValue = Number(heightInches || '0');
      
      // Use the conversion utility
      const convertedValue = convertFromComposite(feetValue, inchesValue, 'ft / in', toUnit);
      
      // Set the result with appropriate formatting
      setHeight(formatNumber(convertedValue, { useCommas: false }));
      
      // Clear the composite values
      setHeightFeet('');
      setHeightInches('');
    }
    // Convert from m/cm to single unit
    else if (fromUnit === 'm / cm' && toUnit !== 'ft / in') {
      const metersValue = Number(heightMeters || '0');
      const cmValue = Number(heightCentimeters || '0');
      
      // Use the conversion utility
      const convertedValue = convertFromComposite(metersValue, cmValue, 'm / cm', toUnit);
      
      // Set the result with appropriate formatting
      setHeight(formatNumber(convertedValue, { useCommas: false }));
      
      // Clear the composite values
      setHeightMeters('');
      setHeightCentimeters('');
    }
    // Convert from ft/in to m/cm
    else if (fromUnit === 'ft / in' && toUnit === 'm / cm') {
      const feetValue = Number(heightFeet || '0');
      const inchesValue = Number(heightInches || '0');
      
      // Use the conversion utility
      const result = convertBetweenComposites(feetValue, inchesValue, 'ft / in', 'm / cm');
      
      // Update the meters and centimeters state
      setHeightMeters(result.whole.toString());
      setHeightCentimeters(result.fraction.toFixed(2));
      
      // Clear the previous composite values
      setHeightFeet('');
      setHeightInches('');
    }
    // Convert from m/cm to ft/in
    else if (fromUnit === 'm / cm' && toUnit === 'ft / in') {
      const metersValue = Number(heightMeters || '0');
      const cmValue = Number(heightCentimeters || '0');
      
      // Use the conversion utility
      const result = convertBetweenComposites(metersValue, cmValue, 'm / cm', 'ft / in');
      
      // Update the feet and inches state
      setHeightFeet(result.whole.toString());
      setHeightInches(result.fraction.toFixed(2));
      
      // Clear the previous composite values
      setHeightMeters('');
      setHeightCentimeters('');
    }
  };

  const calculateVolume = () => {
    // Parse all input strings to numbers, default to 0 if empty
    const areaValue = area ? Number(area) : 0;
    let heightValue = 0;
    
    // Calculate height based on the selected unit
    if (heightUnit === 'ft / in') {
      // Feet + inches format
      const feetValue = heightFeet ? Number(heightFeet) : 0;
      const inchesValue = heightInches ? Number(heightInches) : 0;
      heightValue = feetValue + (inchesValue / 12);
    } else if (heightUnit === 'm / cm') {
      // Meters + centimeters format
      const metersValue = heightMeters ? Number(heightMeters) : 0;
      const cmValue = heightCentimeters ? Number(heightCentimeters) : 0;
      heightValue = metersValue + (cmValue / 100);
    } else {
      // Standard single unit
      heightValue = height ? Number(height) : 0;
    }
    
    // Convert area to square feet using the conversion utility
    const areaInSqFt = convertArea(areaValue, areaUnit, 'ft²');
    
    // Convert height to feet using the conversion utility
    const heightInFt = convertLength(heightValue, heightUnit === 'ft / in' ? 'ft' : 
                                             (heightUnit === 'm / cm' ? 'm' : heightUnit), 'ft');
    
    // Calculate volume in cubic feet
    const volumeInCubicFeet = areaInSqFt * heightInFt;
    
    // Convert to selected unit using the conversion utility
    const finalVolume = convertVolume(volumeInCubicFeet, 'cu ft', volumeUnit);
    
    setVolume(finalVolume);
  };

  const clearAll = () => {
    setArea('');
    setHeight('');
    setHeightFeet('');
    setHeightInches('');
    setHeightMeters('');
    setHeightCentimeters('');
    setVolume(0);
    setAreaError('');
    setHeightError('');
    setHeightFeetError('');
    setHeightInchesError('');
    setHeightMetersError('');
    setHeightCentimetersError('');
  };

  const reloadCalculator = () => {
    setArea('');
    setHeight('');
    setHeightFeet('');
    setHeightInches('');
    setHeightMeters('');
    setHeightCentimeters('');
    setVolume(0);
    setAreaError('');
    setHeightError('');
    setHeightFeetError('');
    setHeightInchesError('');
    setHeightMetersError('');
    setHeightCentimetersError('');
  };

  const shareResult = () => {
    const areaValue = area || '0';
    let heightDisplay: string;
    
    // Format the height display based on the unit
    if (heightUnit === 'ft / in') {
      const feet = heightFeet || '0';
      const inches = heightInches || '0';
      heightDisplay = `${feet} ft ${inches} in`;
    } else if (heightUnit === 'm / cm') {
      const meters = heightMeters || '0';
      const cm = heightCentimeters || '0';
      heightDisplay = `${meters} m ${cm} cm`;
    } else {
      heightDisplay = `${height || '0'} ${heightUnit}`;
    }
    
    const result = `Area: ${areaValue} ${areaUnit}\nHeight/Depth: ${heightDisplay}\nVolume: ${formatNumberWithCommas(volume)} ${volumeUnit}`;
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
                onChange={(e) => handleNumberInput(e.target.value, setArea, setAreaError)}
                onFocus={(e) => handleFocus(area, e)}
                className={`flex-1 px-3 py-2 border ${areaError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter area"
              />
              <select
                value={areaUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  const oldUnit = areaUnit;
                  handleUnitChange(area, oldUnit, newUnit, setArea, 'area');
                  setAreaUnit(newUnit);
                }}
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
            {areaError && <p className="text-red-500 text-xs mt-1">{areaError}</p>}
          </div>

          {/* Height/Depth Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Height/depth <span className="text-slate-400">⋯</span>
            </label>
            
            {heightUnit === 'ft / in' ? (
              // Feet and inches input
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => handleNumberInput(e.target.value, setHeightFeet, setHeightFeetError)}
                    onFocus={(e) => handleFocus(heightFeet, e)}
                    className={`flex-1 px-3 py-2 border ${heightFeetError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Feet"
                  />
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-slate-700">ft</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => handleNumberInput(e.target.value, setHeightInches, setHeightInchesError)}
                    onFocus={(e) => handleFocus(heightInches, e)}
                    className={`flex-1 px-3 py-2 border ${heightInchesError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Inches"
                  />
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-slate-700">in</span>
                  </div>
                </div>
                <select
                  value={heightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const oldUnit = heightUnit;
                    
                    if (oldUnit !== newUnit) {
                      if (oldUnit === 'ft / in' && newUnit === 'm / cm') {
                        // Converting from ft/in to m/cm
                        convertBetweenSingleAndComposite('', oldUnit, newUnit);
                      } 
                      else if (oldUnit === 'ft / in' && !['ft / in', 'm / cm'].includes(newUnit)) {
                        // Converting from ft/in to single unit
                        convertBetweenSingleAndComposite('', oldUnit, newUnit);
                      }
                      setHeightUnit(newUnit);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm mt-1"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  {heightUnitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
                {heightFeetError && <p className="text-red-500 text-xs mt-1">{heightFeetError}</p>}
                {heightInchesError && <p className="text-red-500 text-xs mt-1">{heightInchesError}</p>}
              </div>
            ) : heightUnit === 'm / cm' ? (
              // Meters and centimeters input
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightMeters}
                    onChange={(e) => handleNumberInput(e.target.value, setHeightMeters, setHeightMetersError)}
                    onFocus={(e) => handleFocus(heightMeters, e)}
                    className={`flex-1 px-3 py-2 border ${heightMetersError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Meters"
                  />
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-slate-700">m</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightCentimeters}
                    onChange={(e) => handleNumberInput(e.target.value, setHeightCentimeters, setHeightCentimetersError)}
                    onFocus={(e) => handleFocus(heightCentimeters, e)}
                    className={`flex-1 px-3 py-2 border ${heightCentimetersError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Centimeters"
                  />
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-slate-700">cm</span>
                  </div>
                </div>
                <select
                  value={heightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const oldUnit = heightUnit;
                    
                    if (oldUnit !== newUnit) {
                      if (oldUnit === 'm / cm' && newUnit === 'ft / in') {
                        // Converting from m/cm to ft/in
                        convertBetweenSingleAndComposite('', oldUnit, newUnit);
                      }
                      else if (oldUnit === 'm / cm' && !['ft / in', 'm / cm'].includes(newUnit)) {
                        // Converting from m/cm to single unit
                        convertBetweenSingleAndComposite('', oldUnit, newUnit);
                      }
                      setHeightUnit(newUnit);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm mt-1"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  {heightUnitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
                {heightMetersError && <p className="text-red-500 text-xs mt-1">{heightMetersError}</p>}
                {heightCentimetersError && <p className="text-red-500 text-xs mt-1">{heightCentimetersError}</p>}
              </div>
            ) : (
              // Standard single unit input
              <div className="flex gap-2">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleNumberInput(e.target.value, setHeight, setHeightError)}
                  onFocus={(e) => handleFocus(height, e)}
                  className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Enter height/depth"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const oldUnit = heightUnit;
                    
                    if (oldUnit !== newUnit) {
                      // Convert between standard units
                      if (!['ft / in', 'm / cm'].includes(newUnit) && !['ft / in', 'm / cm'].includes(oldUnit)) {
                        handleUnitChange(height, oldUnit, newUnit, setHeight, 'length');
                      } 
                      // Convert from standard to ft/in
                      else if (!['ft / in', 'm / cm'].includes(oldUnit) && newUnit === 'ft / in') {
                        convertBetweenSingleAndComposite(height, oldUnit, newUnit);
                      }
                      // Convert from standard to m/cm
                      else if (!['ft / in', 'm / cm'].includes(oldUnit) && newUnit === 'm / cm') {
                        convertBetweenSingleAndComposite(height, oldUnit, newUnit);
                      }
                      
                      setHeightUnit(newUnit);
                    }
                  }}
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
            )}
            {heightError && <p className="text-red-500 text-xs mt-1">{heightError}</p>}
          </div>

          {/* Volume Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Volume <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formatNumberWithCommas(volume)}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
              />
              <select
                value={volumeUnit}
                onChange={(e) => {
                  setVolumeUnit(e.target.value);
                  // No need to call handleUnitChange here since volume is calculated based on area and height
                }}
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
