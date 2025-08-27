'use client';

import { useState, useEffect } from 'react';

// Format a number with thousand separators and limit decimals
const formatNumber = (value: number): string => {
  // Get the integer and decimal parts
  const parts = value.toFixed(4).toString().split('.');
  
  // Format integer part with thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // If there's a decimal part, keep it without thousand separators
  // and trim trailing zeros (but keep up to 4 decimal places)
  if (parts.length > 1) {
    // Remove trailing zeros
    parts[1] = parts[1].replace(/0+$/, '');
    
    // If there are still decimal digits, join with dot
    return parts[1] ? `${parts[0]}.${parts[1]}` : parts[0];
  }
  
  return parts[0];
};

export default function RoomCalculator() {
  // Room shape state
  const [roomShape, setRoomShape] = useState<'rectangle' | 'square' | 'other'>('rectangle');
  
  // Track wall area in square meters (base unit for conversion)
  const [wallAreaSqMeters, setWallAreaSqMeters] = useState<number | null>(null);
  
  // Measurement values
  const [wallLength1, setWallLength1] = useState<string>('');
  const [wallLength1Secondary, setWallLength1Secondary] = useState<string>('');
  const [wallLength2, setWallLength2] = useState<string>('');
  const [wallLength2Secondary, setWallLength2Secondary] = useState<string>('');
  const [singleWallLength, setSingleWallLength] = useState<string>('');
  const [singleWallLengthSecondary, setSingleWallLengthSecondary] = useState<string>('');
  const [ceilingHeight, setCeilingHeight] = useState<string>('');
  const [ceilingHeightSecondary, setCeilingHeightSecondary] = useState<string>('');
  const [doors, setDoors] = useState<number>(0);
  const [windows, setWindows] = useState<number>(0);
  
  // Unit states
  const [lengthUnit1, setLengthUnit1] = useState<string>('m');
  const [lengthUnit2, setLengthUnit2] = useState<string>('m');
  const [singleLengthUnit, setSingleLengthUnit] = useState<string>('m');
  const [ceilingUnit, setCeilingUnit] = useState<string>('m');
  const [areaUnit, setAreaUnit] = useState<string>('m²');
  
  // Result state
  const [wallFootage, setWallFootage] = useState<string | null>(null);
  
  // Helper function to handle input changes with validation
  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Allow empty string or non-negative numbers
    if (value === '' || parseFloat(value) >= 0) {
      setter(value);
    }
  };
  
  // Helper function to handle integer input changes with validation
  const handleIntegerChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const parsedValue = parseInt(value);
    // Only set value if it's a non-negative number
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setter(parsedValue);
    } else if (value === '') {
      setter(0); // Reset to 0 if input is cleared
    }
  };
  
  // Conversion factors to meters
  const lengthConversion = {
    'cm': 0.01,        // centimeters
    'dm': 0.1,         // decimeters
    'm': 1,            // meters
    'in': 0.0254,      // inches
    'ft': 0.3048,      // feet
    'ft/in': 0.0254,   // feet/inches (base unit is inches)
    'm/cm': 0.01       // meters/centimeters (base unit is centimeters)
  };
  
  // Conversion factors to square meters
  const areaConversion = {
    'cm²': 0.0001,     // square centimeters
    'dm²': 0.01,       // square decimeters
    'm²': 1,           // square meters
    'in²': 0.00064516, // square inches
    'ft²': 0.092903,   // square feet
    'a': 100,          // ares
    'da': 1000,        // decares
    'ha': 10000,       // hectares
    'ac': 4046.86      // acres
  };
  
  // Convert a value to meters based on selected unit
  const convertToMeters = (value: number, unit: string): number => {
    return value * lengthConversion[unit as keyof typeof lengthConversion];
  };
  
  // Convert meters to a specific unit
  const convertFromMeters = (value: number, unit: string): number => {
    return value / lengthConversion[unit as keyof typeof lengthConversion];
  };
  
  // Convert square meters to a specific area unit
  const convertAreaFromSqMeters = (value: number, unit: string): number => {
    return value / areaConversion[unit as keyof typeof areaConversion];
  };
  
  // Calculate wall footage
  const calculateWallFootage = () => {
    let perimeter = 0;
    
    // Calculate perimeter based on room shape
    if (roomShape === 'rectangle') {
      let length1Meters = 0;
      let length2Meters = 0;
      
      // Handle length 1 based on unit type
      if (lengthUnit1 === 'ft/in') {
        // Convert feet and inches to meters
        const feet = parseFloat(wallLength1 || '0');
        const inches = parseFloat(wallLength1Secondary || '0');
        const totalInches = feet * 12 + inches;
        length1Meters = totalInches * 0.0254;
      } else if (lengthUnit1 === 'm/cm') {
        // Convert meters and centimeters to meters
        const meters = parseFloat(wallLength1 || '0');
        const cm = parseFloat(wallLength1Secondary || '0');
        length1Meters = meters + (cm * 0.01);
      } else {
        // Standard unit conversion
        length1Meters = convertToMeters(parseFloat(wallLength1 || '0'), lengthUnit1);
      }
      
      // Handle length 2 based on unit type
      if (lengthUnit2 === 'ft/in') {
        // Convert feet and inches to meters
        const feet = parseFloat(wallLength2 || '0');
        const inches = parseFloat(wallLength2Secondary || '0');
        const totalInches = feet * 12 + inches;
        length2Meters = totalInches * 0.0254;
      } else if (lengthUnit2 === 'm/cm') {
        // Convert meters and centimeters to meters
        const meters = parseFloat(wallLength2 || '0');
        const cm = parseFloat(wallLength2Secondary || '0');
        length2Meters = meters + (cm * 0.01);
      } else {
        // Standard unit conversion
        length2Meters = convertToMeters(parseFloat(wallLength2 || '0'), lengthUnit2);
      }
      
      perimeter = 2 * (length1Meters + length2Meters);
    } else if (roomShape === 'square') {
      let lengthMeters = 0;
      
      // Handle wall length based on unit type
      if (lengthUnit1 === 'ft/in') {
        // Convert feet and inches to meters
        const feet = parseFloat(wallLength1 || '0');
        const inches = parseFloat(wallLength1Secondary || '0');
        const totalInches = feet * 12 + inches;
        lengthMeters = totalInches * 0.0254;
      } else if (lengthUnit1 === 'm/cm') {
        // Convert meters and centimeters to meters
        const meters = parseFloat(wallLength1 || '0');
        const cm = parseFloat(wallLength1Secondary || '0');
        lengthMeters = meters + (cm * 0.01);
      } else {
        // Standard unit conversion
        lengthMeters = convertToMeters(parseFloat(wallLength1 || '0'), lengthUnit1);
      }
      
      perimeter = 4 * lengthMeters;
    } else {
      let lengthMeters = 0;
      
      // Handle single wall length based on unit type
      if (singleLengthUnit === 'ft/in') {
        // Convert feet and inches to meters
        const feet = parseFloat(singleWallLength || '0');
        const inches = parseFloat(singleWallLengthSecondary || '0');
        const totalInches = feet * 12 + inches;
        lengthMeters = totalInches * 0.0254;
      } else if (singleLengthUnit === 'm/cm') {
        // Convert meters and centimeters to meters
        const meters = parseFloat(singleWallLength || '0');
        const cm = parseFloat(singleWallLengthSecondary || '0');
        lengthMeters = meters + (cm * 0.01);
      } else {
        // Standard unit conversion
        lengthMeters = convertToMeters(parseFloat(singleWallLength || '0'), singleLengthUnit);
      }
      
      perimeter = lengthMeters;
    }
    
    // Calculate ceiling height in meters
    let ceilingHeightMeters = 0;
    if (ceilingUnit === 'ft/in') {
      // Convert feet and inches to meters
      const feet = parseFloat(ceilingHeight || '0');
      const inches = parseFloat(ceilingHeightSecondary || '0');
      const totalInches = feet * 12 + inches;
      ceilingHeightMeters = totalInches * 0.0254;
    } else if (ceilingUnit === 'm/cm') {
      // Convert meters and centimeters to meters
      const meters = parseFloat(ceilingHeight || '0');
      const cm = parseFloat(ceilingHeightSecondary || '0');
      ceilingHeightMeters = meters + (cm * 0.01);
    } else {
      // Standard unit conversion
      ceilingHeightMeters = convertToMeters(parseFloat(ceilingHeight || '0'), ceilingUnit);
    }
    
    // Calculate total wall area in square meters
    const totalWallArea = perimeter * ceilingHeightMeters;
    
    // Subtract area for doors and windows (assuming standard sizes)
    // Standard door: 21 ft² (1.95 m²), Standard window: 12 ft² (1.11 m²)
    const doorArea = doors * 1.95;
    const windowArea = windows * 1.11;
    
    // Final calculation
    const finalFootage = Math.max(0, totalWallArea - doorArea - windowArea);
    
    // Store the result in square meters
    setWallAreaSqMeters(finalFootage);
    
    // Convert to selected area unit
    const convertedFootage = convertAreaFromSqMeters(finalFootage, areaUnit);
    // Format the result with thousand separators and limited decimal places
    setWallFootage(formatNumber(convertedFootage));
  };
  
  // Reset all fields
  const resetCalculator = () => {
    setRoomShape('rectangle');
    setWallLength1('');
    setWallLength1Secondary('');
    setWallLength2('');
    setWallLength2Secondary('');
    setSingleWallLength('');
    setSingleWallLengthSecondary('');
    setCeilingHeight('');
    setCeilingHeightSecondary('');
    setDoors(0);
    setWindows(0);
    setLengthUnit1('m');
    setLengthUnit2('m');
    setSingleLengthUnit('m');
    setCeilingUnit('m');
    setAreaUnit('m²');
    setWallFootage(null);
    setWallAreaSqMeters(null);
  };
  
  // Handle length unit change for wall length 1
  const handleLengthUnit1Change = (newUnit: string) => {
    // Save the old unit to convert from
    const oldUnit = lengthUnit1;
    
    // Special cases for compound units
    if (newUnit === 'ft/in' || newUnit === 'm/cm') {
      // Clear the secondary field
      setWallLength1Secondary('');
      
      if (wallLength1) {
        let valueInMeters = 0;
        
        // If coming from a compound unit, handle differently
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(wallLength1);
          const inches = parseFloat(wallLength1Secondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(wallLength1);
          const cm = parseFloat(wallLength1Secondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(wallLength1), oldUnit);
        }
        
        // Now convert meters to the primary part of the new compound unit
        if (newUnit === 'ft/in') {
          // Get feet (integer) and inches (decimal remainder * 12)
          const totalFeet = valueInMeters / 0.3048;
          const feet = Math.floor(totalFeet);
          setWallLength1(feet.toString());
          const inches = Math.round((totalFeet - feet) * 12);
          setWallLength1Secondary(inches.toString());
        } else if (newUnit === 'm/cm') {
          // Get meters (integer) and centimeters (decimal remainder * 100)
          const meters = Math.floor(valueInMeters);
          setWallLength1(meters.toString());
          const cm = Math.round((valueInMeters - meters) * 100);
          setWallLength1Secondary(cm.toString());
        }
      }
    } else {
      // Regular unit conversion
      if (wallLength1) {
        let valueInMeters = 0;
        
        // Convert from old unit to meters
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(wallLength1);
          const inches = parseFloat(wallLength1Secondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(wallLength1);
          const cm = parseFloat(wallLength1Secondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(wallLength1), oldUnit);
        }
        
        // Convert from meters to new unit
        const convertedValue = convertFromMeters(valueInMeters, newUnit);
        setWallLength1(convertedValue.toFixed(2));
        setWallLength1Secondary('');
      }
    }
    
    // Update the unit state
    setLengthUnit1(newUnit);
  };
  
  // Handle length unit change for wall length 2
  const handleLengthUnit2Change = (newUnit: string) => {
    // Save the old unit to convert from
    const oldUnit = lengthUnit2;
    
    // Special cases for compound units
    if (newUnit === 'ft/in' || newUnit === 'm/cm') {
      // Clear the secondary field
      setWallLength2Secondary('');
      
      if (wallLength2) {
        let valueInMeters = 0;
        
        // If coming from a compound unit, handle differently
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(wallLength2);
          const inches = parseFloat(wallLength2Secondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(wallLength2);
          const cm = parseFloat(wallLength2Secondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(wallLength2), oldUnit);
        }
        
        // Now convert meters to the primary part of the new compound unit
        if (newUnit === 'ft/in') {
          // Get feet (integer) and inches (decimal remainder * 12)
          const totalFeet = valueInMeters / 0.3048;
          const feet = Math.floor(totalFeet);
          setWallLength2(feet.toString());
          const inches = Math.round((totalFeet - feet) * 12);
          setWallLength2Secondary(inches.toString());
        } else if (newUnit === 'm/cm') {
          // Get meters (integer) and centimeters (decimal remainder * 100)
          const meters = Math.floor(valueInMeters);
          setWallLength2(meters.toString());
          const cm = Math.round((valueInMeters - meters) * 100);
          setWallLength2Secondary(cm.toString());
        }
      }
    } else {
      // Regular unit conversion
      if (wallLength2) {
        let valueInMeters = 0;
        
        // Convert from old unit to meters
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(wallLength2);
          const inches = parseFloat(wallLength2Secondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(wallLength2);
          const cm = parseFloat(wallLength2Secondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(wallLength2), oldUnit);
        }
        
        // Convert from meters to new unit
        const convertedValue = convertFromMeters(valueInMeters, newUnit);
        setWallLength2(convertedValue.toFixed(2));
        setWallLength2Secondary('');
      }
    }
    
    // Update the unit state
    setLengthUnit2(newUnit);
  };
  
  // Handle length unit change for single wall length
  const handleSingleLengthUnitChange = (newUnit: string) => {
    // Save the old unit to convert from
    const oldUnit = singleLengthUnit;
    
    // Special cases for compound units
    if (newUnit === 'ft/in' || newUnit === 'm/cm') {
      // Clear the secondary field
      setSingleWallLengthSecondary('');
      
      if (singleWallLength) {
        let valueInMeters = 0;
        
        // If coming from a compound unit, handle differently
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(singleWallLength);
          const inches = parseFloat(singleWallLengthSecondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(singleWallLength);
          const cm = parseFloat(singleWallLengthSecondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(singleWallLength), oldUnit);
        }
        
        // Now convert meters to the primary part of the new compound unit
        if (newUnit === 'ft/in') {
          // Get feet (integer) and inches (decimal remainder * 12)
          const totalFeet = valueInMeters / 0.3048;
          const feet = Math.floor(totalFeet);
          setSingleWallLength(feet.toString());
          const inches = Math.round((totalFeet - feet) * 12);
          setSingleWallLengthSecondary(inches.toString());
        } else if (newUnit === 'm/cm') {
          // Get meters (integer) and centimeters (decimal remainder * 100)
          const meters = Math.floor(valueInMeters);
          setSingleWallLength(meters.toString());
          const cm = Math.round((valueInMeters - meters) * 100);
          setSingleWallLengthSecondary(cm.toString());
        }
      }
    } else {
      // Regular unit conversion
      if (singleWallLength) {
        let valueInMeters = 0;
        
        // Convert from old unit to meters
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(singleWallLength);
          const inches = parseFloat(singleWallLengthSecondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(singleWallLength);
          const cm = parseFloat(singleWallLengthSecondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(singleWallLength), oldUnit);
        }
        
        // Convert from meters to new unit
        const convertedValue = convertFromMeters(valueInMeters, newUnit);
        setSingleWallLength(convertedValue.toFixed(2));
        setSingleWallLengthSecondary('');
      }
    }
    
    // Update the unit state
    setSingleLengthUnit(newUnit);
  };
  
  // Handle ceiling unit change
  const handleCeilingUnitChange = (newUnit: string) => {
    // Save the old unit
    const oldUnit = ceilingUnit;
    
    // Special cases for compound units
    if (newUnit === 'ft/in' || newUnit === 'm/cm') {
      // Clear the secondary field
      setCeilingHeightSecondary('');
      
      if (ceilingHeight) {
        let valueInMeters = 0;
        
        // If coming from a compound unit, handle differently
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(ceilingHeight);
          const inches = parseFloat(ceilingHeightSecondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(ceilingHeight);
          const cm = parseFloat(ceilingHeightSecondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(ceilingHeight), oldUnit);
        }
        
        // Now convert meters to the primary part of the new compound unit
        if (newUnit === 'ft/in') {
          // Get feet (integer) and inches (decimal remainder * 12)
          const totalFeet = valueInMeters / 0.3048;
          const feet = Math.floor(totalFeet);
          setCeilingHeight(feet.toString());
          const inches = Math.round((totalFeet - feet) * 12);
          setCeilingHeightSecondary(inches.toString());
        } else if (newUnit === 'm/cm') {
          // Get meters (integer) and centimeters (decimal remainder * 100)
          const meters = Math.floor(valueInMeters);
          setCeilingHeight(meters.toString());
          const cm = Math.round((valueInMeters - meters) * 100);
          setCeilingHeightSecondary(cm.toString());
        }
      }
    } else {
      // Regular unit conversion
      if (ceilingHeight) {
        let valueInMeters = 0;
        
        // Convert from old unit to meters
        if (oldUnit === 'ft/in') {
          // Convert from feet and inches to meters
          const feet = parseFloat(ceilingHeight);
          const inches = parseFloat(ceilingHeightSecondary || '0');
          valueInMeters = (feet * 12 + inches) * 0.0254;
        } else if (oldUnit === 'm/cm') {
          // Convert from meters and centimeters to meters
          const meters = parseFloat(ceilingHeight);
          const cm = parseFloat(ceilingHeightSecondary || '0');
          valueInMeters = meters + (cm * 0.01);
        } else {
          // Convert from regular unit to meters
          valueInMeters = convertToMeters(parseFloat(ceilingHeight), oldUnit);
        }
        
        // Convert from meters to new unit
        const convertedValue = convertFromMeters(valueInMeters, newUnit);
        setCeilingHeight(convertedValue.toFixed(2));
        setCeilingHeightSecondary('');
      }
    }
    
    // Update the unit state
    setCeilingUnit(newUnit);
  };
  
  // Handle area unit change for result
  const handleAreaUnitChange = (newUnit: string) => {
    // Only convert if we have a wall area value stored
    if (wallAreaSqMeters !== null) {
      // Convert directly from stored square meters to the new unit
      const convertedFootage = convertAreaFromSqMeters(wallAreaSqMeters, newUnit);
      // Format the result with thousand separators and limited decimal places
      setWallFootage(formatNumber(convertedFootage));
    }
    
    // Update the unit state
    setAreaUnit(newUnit);
  };
  
  // Effect to clear secondary inputs when unit changes to/from compound units
  useEffect(() => {
    if (ceilingUnit !== 'ft/in' && ceilingUnit !== 'm/cm') {
      setCeilingHeightSecondary('');
    }
  }, [ceilingUnit]);
  
  useEffect(() => {
    if (lengthUnit1 !== 'ft/in' && lengthUnit1 !== 'm/cm') {
      setWallLength1Secondary('');
    }
  }, [lengthUnit1]);
  
  useEffect(() => {
    if (lengthUnit2 !== 'ft/in' && lengthUnit2 !== 'm/cm') {
      setWallLength2Secondary('');
    }
  }, [lengthUnit2]);
  
  useEffect(() => {
    if (singleLengthUnit !== 'ft/in' && singleLengthUnit !== 'm/cm') {
      setSingleWallLengthSecondary('');
    }
  }, [singleLengthUnit]);
  
  // Auto-calculate when required fields are completed
  useEffect(() => {
    // Check if required fields are filled based on room shape
    let hasRequiredFields = false;
    
    if (roomShape === 'rectangle') {
      // For rectangle: need wall length 1, wall length 2, and ceiling height
      hasRequiredFields = !!wallLength1 && !!wallLength2 && !!ceilingHeight;
      
      // For compound wall length units, check if secondary inputs are filled when needed
      if (hasRequiredFields && (lengthUnit1 === 'ft/in' || lengthUnit1 === 'm/cm')) {
        hasRequiredFields = hasRequiredFields && !!wallLength1Secondary;
      }
      
      if (hasRequiredFields && (lengthUnit2 === 'ft/in' || lengthUnit2 === 'm/cm')) {
        hasRequiredFields = hasRequiredFields && !!wallLength2Secondary;
      }
    } else if (roomShape === 'square') {
      // For square: need wall length 1 and ceiling height
      hasRequiredFields = !!wallLength1 && !!ceilingHeight;
      
      // For compound wall length units, check if secondary inputs are filled when needed
      if (hasRequiredFields && (lengthUnit1 === 'ft/in' || lengthUnit1 === 'm/cm')) {
        hasRequiredFields = hasRequiredFields && !!wallLength1Secondary;
      }
    } else if (roomShape === 'other') {
      // For other: need single wall length and ceiling height
      hasRequiredFields = !!singleWallLength && !!ceilingHeight;
      
      // For compound wall length units, check if secondary inputs are filled when needed
      if (hasRequiredFields && (singleLengthUnit === 'ft/in' || singleLengthUnit === 'm/cm')) {
        hasRequiredFields = hasRequiredFields && !!singleWallLengthSecondary;
      }
    }
    
    // For compound ceiling height units, check if secondary input is filled when needed
    if (hasRequiredFields && (ceilingUnit === 'ft/in' || ceilingUnit === 'm/cm')) {
      hasRequiredFields = hasRequiredFields && !!ceilingHeightSecondary;
    }
    
    // If all required fields are present, calculate
    if (hasRequiredFields) {
      calculateWallFootage();
    }
  }, [wallLength1, wallLength1Secondary, wallLength2, wallLength2Secondary, singleWallLength, singleWallLengthSecondary, ceilingHeight, ceilingHeightSecondary, doors, windows, roomShape, lengthUnit1, lengthUnit2, singleLengthUnit, ceilingUnit]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Room Wall Footage Calculator</h1>
        
        {/* Room Shape Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-medium text-gray-700">Your room's shape</h2>
            <div className="text-gray-400">•••</div>
          </div>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <div className="flex items-center justify-center w-5 h-5 mr-3">
                <input
                  type="radio"
                  name="roomShape"
                  checked={roomShape === 'rectangle'}
                  onChange={() => setRoomShape('rectangle')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                {roomShape === 'rectangle' && (
                  <span className="absolute w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                )}
              </div>
              Rectangle
            </label>
            
            <label className="flex items-center">
              <div className="flex items-center justify-center w-5 h-5 mr-3">
                <input
                  type="radio"
                  name="roomShape"
                  checked={roomShape === 'square'}
                  onChange={() => setRoomShape('square')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                {roomShape === 'square' && (
                  <span className="absolute w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                )}
              </div>
              Square
            </label>
            
            <label className="flex items-center">
              <div className="flex items-center justify-center w-5 h-5 mr-3">
                <input
                  type="radio"
                  name="roomShape"
                  checked={roomShape === 'other'}
                  onChange={() => setRoomShape('other')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                {roomShape === 'other' && (
                  <span className="absolute w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                )}
              </div>
              Other
            </label>
          </div>
        </div>

        {/* Wall Length Inputs */}
        <div className="mb-6">
          {roomShape === 'rectangle' && (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-700">#1 Wall length</label>
                <div className="text-gray-400">•••</div>
              </div>
              
              {(lengthUnit1 === 'ft/in' || lengthUnit1 === 'm/cm') ? (
                <div className="flex space-x-2 mb-4">
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength1}
                      onChange={(e) => handleInputChange(e.target.value, setWallLength1)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit1 === 'ft/in' ? 'ft' : 'm'}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength1Secondary}
                      onChange={(e) => handleInputChange(e.target.value, setWallLength1Secondary)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      max={lengthUnit1 === 'ft/in' ? 11 : 99}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit1 === 'ft/in' ? 'in' : 'cm'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select 
                      value={lengthUnit1}
                      onChange={(e) => handleLengthUnit1Change(e.target.value)}
                      className="h-full py-2 pl-1 pr-5 border border-gray-200 text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="relative mb-4">
                  <input
                    type="number"
                    value={wallLength1}
                    onChange={(e) => handleInputChange(e.target.value, setWallLength1)}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-14"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select 
                      value={lengthUnit1}
                      onChange={(e) => handleLengthUnit1Change(e.target.value)}
                      className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              )}              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-700">#2 Wall length</label>
                <div className="text-gray-400">•••</div>
              </div>
              
              {(lengthUnit2 === 'ft/in' || lengthUnit2 === 'm/cm') ? (
                <div className="flex space-x-2">
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength2}
                      onChange={(e) => handleInputChange(e.target.value, setWallLength2)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit2 === 'ft/in' ? 'ft' : 'm'}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength2Secondary}
                      onChange={(e) => setWallLength2Secondary(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      max={lengthUnit2 === 'ft/in' ? 11 : 99}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit2 === 'ft/in' ? 'in' : 'cm'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select 
                      value={lengthUnit2}
                      onChange={(e) => handleLengthUnit2Change(e.target.value)}
                      className="h-full py-2 pl-1 pr-5 border border-gray-200 text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={wallLength2}
                    onChange={(e) => handleInputChange(e.target.value, setWallLength2)}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-14"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select 
                      value={lengthUnit2}
                      onChange={(e) => handleLengthUnit2Change(e.target.value)}
                      className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {roomShape === 'square' && (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-700">Single wall length</label>
                <div className="text-gray-400">•••</div>
              </div>
              
              {(lengthUnit1 === 'ft/in' || lengthUnit1 === 'm/cm') ? (
                <div className="flex space-x-2">
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength1}
                      onChange={(e) => setWallLength1(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit1 === 'ft/in' ? 'ft' : 'm'}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={wallLength1Secondary}
                      onChange={(e) => setWallLength1Secondary(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      max={lengthUnit1 === 'ft/in' ? 11 : 99}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{lengthUnit1 === 'ft/in' ? 'in' : 'cm'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select 
                      value={lengthUnit1}
                      onChange={(e) => handleLengthUnit1Change(e.target.value)}
                      className="h-full py-2 pl-1 pr-5 border border-gray-200 text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={wallLength1}
                    onChange={(e) => setWallLength1(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-14"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select 
                      value={lengthUnit1}
                      onChange={(e) => handleLengthUnit1Change(e.target.value)}
                      className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {roomShape === 'other' && (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-700">Total wall length</label>
                <div className="text-gray-400">•••</div>
              </div>
              
              {(singleLengthUnit === 'ft/in' || singleLengthUnit === 'm/cm') ? (
                <div className="flex space-x-2">
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={singleWallLength}
                      onChange={(e) => setSingleWallLength(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{singleLengthUnit === 'ft/in' ? 'ft' : 'm'}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="number"
                      value={singleWallLengthSecondary}
                      onChange={(e) => setSingleWallLengthSecondary(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      max={singleLengthUnit === 'ft/in' ? 11 : 99}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-xs">{singleLengthUnit === 'ft/in' ? 'in' : 'cm'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select 
                      value={singleLengthUnit}
                      onChange={(e) => handleSingleLengthUnitChange(e.target.value)}
                      className="h-full py-2 pl-1 pr-5 border border-gray-200 text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={singleWallLength}
                    onChange={(e) => setSingleWallLength(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-14"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select 
                      value={singleLengthUnit}
                      onChange={(e) => handleSingleLengthUnitChange(e.target.value)}
                      className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="dm">dm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="ft/in">ft/in</option>
                      <option value="m/cm">m/cm</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ceiling Height Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-base font-medium text-gray-700">Ceiling height</label>
            <div className="text-gray-400">•••</div>
          </div>
          
          {(ceilingUnit === 'ft/in' || ceilingUnit === 'm/cm') ? (
            <div className="flex space-x-2">
              <div className="flex-grow relative">
                <input
                  type="number"
                  value={ceilingHeight}
                  onChange={(e) => setCeilingHeight(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-xs">{ceilingUnit === 'ft/in' ? 'ft' : 'm'}</span>
                </div>
              </div>
              <div className="flex-grow relative">
                <input
                  type="number"
                  value={ceilingHeightSecondary}
                  onChange={(e) => setCeilingHeightSecondary(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  max={ceilingUnit === 'ft/in' ? 11 : 99}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-xs">{ceilingUnit === 'ft/in' ? 'in' : 'cm'}</span>
                </div>
              </div>
              <div className="flex items-center">
                <select 
                  value={ceilingUnit}
                  onChange={(e) => handleCeilingUnitChange(e.target.value)}
                  className="h-full py-2 pl-1 pr-5 border border-gray-200 text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cm">cm</option>
                  <option value="dm">dm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                  <option value="ft/in">ft/in</option>
                  <option value="m/cm">m/cm</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="number"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-14"
                placeholder="0"
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select 
                  value={ceilingUnit}
                  onChange={(e) => handleCeilingUnitChange(e.target.value)}
                  className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cm">cm</option>
                  <option value="dm">dm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                  <option value="ft/in">ft/in</option>
                  <option value="m/cm">m/cm</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Doors and Windows Inputs */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <label className="block text-base font-medium text-gray-700">No. of doors</label>
              <div className="ml-1 w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs cursor-help" 
                title="Standard door size is assumed to be 21 ft² (1.95 m²). Area of doors will be subtracted from total wall area.">i</div>
            </div>
            <div className="text-gray-400">•••</div>
          </div>
          <div className="relative mb-4">
            <input
              type="number"
              value={doors}
              onChange={(e) => setDoors(parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-8"
              min="0"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-xs">#</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <label className="block text-base font-medium text-gray-700">No. of windows</label>
              <div className="ml-1 w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs cursor-help" 
                title="Standard window size is assumed to be 12 ft² (1.11 m²). Area of windows will be subtracted from total wall area.">i</div>
            </div>
            <div className="text-gray-400">•••</div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={windows}
              onChange={(e) => setWindows(parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-8"
              min="0"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-xs">#</span>
            </div>
          </div>
        </div>

        {/* Wall Footage Result */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <label className="block text-base font-medium text-gray-700">Wall footage</label>
              <div className="ml-2 text-xs text-green-600 font-medium">(Auto-calculated)</div>
            </div>
            <div className="text-gray-400">•••</div>
          </div>
          <div className="relative">
            <input
              type="text"
              value={wallFootage !== null ? wallFootage : ''}
              readOnly
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-md text-gray-700 pr-14"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select 
                value={areaUnit}
                onChange={(e) => handleAreaUnitChange(e.target.value)}
                className="h-full py-0 pl-1 pr-5 border-transparent bg-transparent text-gray-500 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cm²">cm²</option>
                <option value="dm²">dm²</option>
                <option value="m²">m²</option>
                <option value="in²">in²</option>
                <option value="ft²">ft²</option>
                <option value="a">a</option>
                <option value="da">da</option>
                <option value="ha">ha</option>
                <option value="ac">ac</option>
              </select>
            </div>
            {wallFootage !== null && (
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-700">
                {wallFootage}
              </div>
            )}
          </div>
          {/* <div className="mt-2 text-xs text-gray-500">
            <p className="mb-1">Calculation: Total wall area = Perimeter × Height</p>
            <p>Final wall area = Total wall area - (Door area × No. of doors) - (Window area × No. of windows)</p>
          </div> */}
        </div>

        {/* Calculator Actions */}
        <div className="mt-8">
          {/* Reset Button */}
          <button
            onClick={resetCalculator}
            className="w-full text-gray-700 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload calculator
          </button>
          
       
        </div>

      
      </div>
    </div>
  );
}