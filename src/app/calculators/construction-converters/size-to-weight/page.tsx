
"use client";

import { useState, useEffect, ChangeEvent } from "react";
// import { FaArrowDown } from "react-icons/fa";
// import { TbDimensions } from "react-icons/tb";
// import { FaWeight } from "react-icons/fa6";

export default function SizeToWeightPage() {
  // State for dimensions
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  
  // State for compound units (feet-inches, meters-centimeters)
  const [lengthFeet, setLengthFeet] = useState<number>(0);
  const [lengthInches, setLengthInches] = useState<number>(0);
  const [widthFeet, setWidthFeet] = useState<number>(0);
  const [widthInches, setWidthInches] = useState<number>(0);
  const [heightFeet, setHeightFeet] = useState<number>(0);
  const [heightInches, setHeightInches] = useState<number>(0);
  
  const [lengthMeters, setLengthMeters] = useState<number>(0);
  const [lengthCentimeters, setLengthCentimeters] = useState<number>(0);
  const [widthMeters, setWidthMeters] = useState<number>(0);
  const [widthCentimeters, setWidthCentimeters] = useState<number>(0);
  const [heightMeters, setHeightMeters] = useState<number>(0);
  const [heightCentimeters, setHeightCentimeters] = useState<number>(0);
  
  // State for validation errors
  const [lengthError, setLengthError] = useState<string | null>(null);
  const [widthError, setWidthError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);

  // State for units
  const [lengthUnit, setLengthUnit] = useState<string>("in");
  const [widthUnit, setWidthUnit] = useState<string>("cm");
  const [heightUnit, setHeightUnit] = useState<string>("m");
  const [volumeUnit, setVolumeUnit] = useState<string>("cm³");

  // State for density and material
  const [density, setDensity] = useState<number | undefined>(undefined); // No default value
  const [densityUnit, setDensityUnit] = useState<string>("g/L");
  const [densityError, setDensityError] = useState<string | null>(null);

  // State for weight
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<string>("mg");
  
  // State for collapsible sections
  const [sizeExpanded, setSizeExpanded] = useState<boolean>(true);



  // Length unit options
  const lengthUnits = [
    { value: "mm", label: "millimeters (mm)" },
    { value: "cm", label: "centimeters (cm)" },
    { value: "m", label: "meters (m)" },
    { value: "in", label: "inches (in)" },
    { value: "ft", label: "feet (ft)" },
    { value: "yd", label: "yards (yd)" },
    { value: "ft / in", label: "feet / inches (ft / in)" },
    { value: "m / cm", label: "meters / centimeters (m / cm)" }
  ];

  // Volume unit options
  const volumeUnits = [
    { value: "mm³", label: "cubic millimeters (mm³)" },
    { value: "cm³", label: "cubic centimeters (cm³)" },
    { value: "dm³", label: "cubic decimeters (dm³)" },
    { value: "m³", label: "cubic meters (m³)" },
    { value: "cu in", label: "cubic inches (cu in)" },
    { value: "cu ft", label: "cubic feet (cu ft)" },
    { value: "cu yd", label: "cubic yards (cu yd)" },
    { value: "l", label: "liters (l)" }
  ];

  // Density unit options
  const densityUnits = [
    { value: "t/m³", label: "tons per cubic meter (t/m³)" },
    { value: "kg/m³", label: "kilograms per cubic meter (kg/m³)" },
    { value: "kg/L", label: "kilograms per liter (kg/L)" },
    { value: "g/L", label: "grams per liter (g/L)" },
    { value: "g/mL", label: "grams per milliliter (g/mL)" },
    { value: "g/cm³", label: "grams per cubic centimeter (g/cm³)" },
    { value: "oz/cu in", label: "ounces per cubic inch (oz/cu in)" },
    { value: "lb/cu in", label: "pounds per cubic inch (lb/cu in)" },
    { value: "lb/cu ft", label: "pounds per cubic feet (lb/cu ft)" },
    { value: "lb/cu yd", label: "pounds per cubic yard (lb/cu yd)" },
    { value: "lb/US gal", label: "pounds per gallon (US) (lb/US gal)" },
    { value: "lb/UK gal", label: "pounds per gallon (UK) (lb/UK gal)" }
  ];

  // Weight unit options
  const weightUnits = [
    { value: "μg", label: "micrograms (μg)" },
    { value: "mg", label: "milligrams (mg)" },
    { value: "g", label: "grams (g)" },
    { value: "dag", label: "decagrams (dag)" },
    { value: "kg", label: "kilograms (kg)" },
    { value: "t", label: "metric tons (t)" },
    { value: "gr", label: "grains (gr)" },
    { value: "dr", label: "drachms (dr)" },
    { value: "oz", label: "ounces (oz)" },
    { value: "lb", label: "pounds (lb)" },
    { value: "st", label: "stones (st)" },
    { value: "US ton", label: "US short tons (US ton)" },
    { value: "long ton", label: "imperial tons (long ton)" }
  ];

  // Helper function to convert length to meters
  const convertLengthToMeters = (value: number, unit: string): number => {
    switch (unit) {
      case "mm":
        return value * 0.001;
      case "cm":
        return value * 0.01;
      case "m":
        return value;
      case "in":
        return value * 0.0254;
      case "ft":
        return value * 0.3048;
      case "yd":
        return value * 0.9144;
      default:
        return value;
    }
  };
  
  // Helper function to convert meters to the specified unit
  const convertMetersToLength = (valueInMeters: number, unit: string): number => {
    switch (unit) {
      case "mm":
        return valueInMeters * 1000;
      case "cm":
        return valueInMeters * 100;
      case "m":
        return valueInMeters;
      case "in":
        return valueInMeters / 0.0254;
      case "ft":
        return valueInMeters / 0.3048;
      case "yd":
        return valueInMeters / 0.9144;
      default:
        return valueInMeters;
    }
  };
  
  // Helper function to convert feet and inches to meters
  const feetAndInchesToMeters = (feet: number, inches: number): number => {
    return (feet * 0.3048) + (inches * 0.0254);
  };
  
  // Helper function to convert meters and centimeters to meters
  const metersAndCentimetersToMeters = (meters: number, centimeters: number): number => {
    return meters + (centimeters * 0.01);
  };
  
  // Helper function to convert meters to feet and inches
  const metersToFeetAndInches = (meters: number): { feet: number, inches: number } => {
    const totalInches = meters / 0.0254;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round((totalInches % 12) * 100) / 100; // Round to 2 decimal places
    return { feet, inches };
  };
  
  // Helper function to convert meters to meters and centimeters
  const metersToMetersAndCentimeters = (meters: number): { meters: number, centimeters: number } => {
    const wholeMeters = Math.floor(meters);
    const centimeters = Math.round((meters - wholeMeters) * 100 * 100) / 100; // Round to 2 decimal places
    return { meters: wholeMeters, centimeters };
  };
  
  // Helper function to handle compound unit changes for length
  const updateLengthCompoundUnits = (value: number, unit: string): void => {
    if (unit === "ft / in") {
      // Convert value (in inches) to feet and inches
      const feet = Math.floor(value / 12);
      const inches = Math.round((value % 12) * 100) / 100;
      setLengthFeet(feet);
      setLengthInches(inches);
    } else if (unit === "m / cm") {
      // Convert value (in meters) to meters and centimeters
      const wholeMeters = Math.floor(value);
      const centimeters = Math.round((value - wholeMeters) * 100 * 100) / 100;
      setLengthMeters(wholeMeters);
      setLengthCentimeters(centimeters);
    }
  };
  
  // Helper function to handle compound unit changes for width
  const updateWidthCompoundUnits = (value: number, unit: string): void => {
    if (unit === "ft / in") {
      // Convert value (in inches) to feet and inches
      const feet = Math.floor(value / 12);
      const inches = Math.round((value % 12) * 100) / 100;
      setWidthFeet(feet);
      setWidthInches(inches);
    } else if (unit === "m / cm") {
      // Convert value (in meters) to meters and centimeters
      const wholeMeters = Math.floor(value);
      const centimeters = Math.round((value - wholeMeters) * 100 * 100) / 100;
      setWidthMeters(wholeMeters);
      setWidthCentimeters(centimeters);
    }
  };
  
  // Helper function to handle compound unit changes for height
  const updateHeightCompoundUnits = (value: number, unit: string): void => {
    if (unit === "ft / in") {
      // Convert value (in inches) to feet and inches
      const feet = Math.floor(value / 12);
      const inches = Math.round((value % 12) * 100) / 100;
      setHeightFeet(feet);
      setHeightInches(inches);
    } else if (unit === "m / cm") {
      // Convert value (in meters) to meters and centimeters
      const wholeMeters = Math.floor(value);
      const centimeters = Math.round((value - wholeMeters) * 100 * 100) / 100;
      setHeightMeters(wholeMeters);
      setHeightCentimeters(centimeters);
    }
  };

  // Helper function to convert volume
  const calculateVolumeInCubicMeters = (): number => {
    const lengthInM = convertLengthToMeters(length, lengthUnit);
    const widthInM = convertLengthToMeters(width, widthUnit);
    const heightInM = convertLengthToMeters(height, heightUnit);
    
    return lengthInM * widthInM * heightInM;
  };

  // Helper function to convert volume to selected unit
  const convertVolumeToUnit = (volumeInCubicMeters: number, unit: string): number => {
    switch (unit) {
      case "mm³":
        return volumeInCubicMeters * 1_000_000_000;
      case "cm³":
        return volumeInCubicMeters * 1_000_000;
      case "dm³":
        return volumeInCubicMeters * 1_000;
      case "m³":
        return volumeInCubicMeters;
      case "cu in":
        return volumeInCubicMeters * 61_023.7;
      case "cu ft":
        return volumeInCubicMeters * 35.3147;
      case "cu yd":
        return volumeInCubicMeters * 1.30795;
      case "l":
        return volumeInCubicMeters * 1_000;
      default:
        return volumeInCubicMeters;
    }
  };
  
  // Helper function to convert a volume from the specified unit to cubic meters
  const convertUnitToVolume = (value: number, unit: string): number => {
    switch (unit) {
      case "mm³":
        return value / 1_000_000_000;
      case "cm³":
        return value / 1_000_000;
      case "dm³":
        return value / 1_000;
      case "m³":
        return value;
      case "cu in":
        return value / 61_023.7;
      case "cu ft":
        return value / 35.3147;
      case "cu yd":
        return value / 1.30795;
      case "l":
        return value / 1_000;
      default:
        return value;
    }
  };

  // Helper function to convert density to kg/m³
  const convertDensityToKgPerCubicMeter = (value: number, unit: string): number => {
    switch (unit) {
      case "t/m³":
        return value * 1000;
      case "kg/m³":
        return value;
      case "kg/L":
        return value * 1000;
      case "g/L":
        return value;
      case "g/mL":
        return value * 1000;
      case "g/cm³":
        return value * 1000;
      case "oz/cu in":
        return value * 1729.994;
      case "lb/cu in":
        return value * 27679.9;
      case "lb/cu ft":
        return value * 16.0185;
      case "lb/cu yd":
        return value * 0.593276;
      case "lb/US gal":
        return value * 119.826;
      case "lb/UK gal":
        return value * 99.7763;
      default:
        return value;
    }
  };
  
  // Helper function to convert kg/m³ to the specified unit
  const convertKgPerCubicMeterToDensity = (valueInKgPerCubicMeter: number, unit: string): number => {
    switch (unit) {
      case "t/m³":
        return valueInKgPerCubicMeter / 1000;
      case "kg/m³":
        return valueInKgPerCubicMeter;
      case "kg/L":
        return valueInKgPerCubicMeter / 1000;
      case "g/L":
        return valueInKgPerCubicMeter;
      case "g/mL":
        return valueInKgPerCubicMeter / 1000;
      case "g/cm³":
        return valueInKgPerCubicMeter / 1000;
      case "oz/cu in":
        return valueInKgPerCubicMeter / 1729.994;
      case "lb/cu in":
        return valueInKgPerCubicMeter / 27679.9;
      case "lb/cu ft":
        return valueInKgPerCubicMeter / 16.0185;
      case "lb/cu yd":
        return valueInKgPerCubicMeter / 0.593276;
      case "lb/US gal":
        return valueInKgPerCubicMeter / 119.826;
      case "lb/UK gal":
        return valueInKgPerCubicMeter / 99.7763;
      default:
        return valueInKgPerCubicMeter;
    }
  };

  // Helper function to convert weight from kg to selected unit
  const convertWeightToUnit = (weightInKg: number, unit: string): number => {
    switch (unit) {
      case "μg":
        return weightInKg * 1_000_000_000;
      case "mg":
        return weightInKg * 1_000_000;
      case "g":
        return weightInKg * 1_000;
      case "dag":
        return weightInKg * 100;
      case "kg":
        return weightInKg;
      case "t":
        return weightInKg * 0.001;
      case "gr":
        return weightInKg * 15432.4;
      case "dr":
        return weightInKg * 564.383;
      case "oz":
        return weightInKg * 35.274;
      case "lb":
        return weightInKg * 2.20462;
      case "st":
        return weightInKg * 0.157473;
      case "US ton":
        return weightInKg * 0.00110231;
      case "long ton":
        return weightInKg * 0.000984207;
      default:
        return weightInKg;
    }
  };
  
  // Helper function to convert weight from the selected unit to kg
  const convertUnitToWeight = (value: number, unit: string): number => {
    switch (unit) {
      case "μg":
        return value / 1_000_000_000;
      case "mg":
        return value / 1_000_000;
      case "g":
        return value / 1_000;
      case "dag":
        return value / 100;
      case "kg":
        return value;
      case "t":
        return value / 0.001;
      case "gr":
        return value / 15432.4;
      case "dr":
        return value / 564.383;
      case "oz":
        return value / 35.274;
      case "lb":
        return value / 2.20462;
      case "st":
        return value / 0.157473;
      case "US ton":
        return value / 0.00110231;
      case "long ton":
        return value / 0.000984207;
      default:
        return value;
    }
  };

  // Handle material change
  const handleMaterialChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Placeholder for materials selection
    // This will be implemented later when materials data is available
    // const selectedMaterial = materials.find(m => m.name === e.target.value);
    // if (selectedMaterial) {
    //   setDensity(selectedMaterial.density);
    // }
  };

  // Format number with commas for thousands separators
  const formatNumberWithCommas = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  // Validate all inputs
  useEffect(() => {
    setLengthError(length < 0 ? "Length cannot be negative." : null);
    setWidthError(width < 0 ? "Width cannot be negative." : null);
    setHeightError(height < 0 ? "Height cannot be negative." : null);
    if (density !== undefined) {
      setDensityError(density < 0 ? "Density cannot be negative." : null);
    }
  }, [length, width, height, density]);

  // Update compound units when single units change
  useEffect(() => {
    if (lengthUnit === "ft / in") {
      updateLengthCompoundUnits(length, lengthUnit);
    } else if (lengthUnit === "m / cm") {
      updateLengthCompoundUnits(length, lengthUnit);
    }
  }, [length, lengthUnit]);

  useEffect(() => {
    if (widthUnit === "ft / in") {
      updateWidthCompoundUnits(width, widthUnit);
    } else if (widthUnit === "m / cm") {
      updateWidthCompoundUnits(width, widthUnit);
    }
  }, [width, widthUnit]);

  useEffect(() => {
    if (heightUnit === "ft / in") {
      updateHeightCompoundUnits(height, heightUnit);
    } else if (heightUnit === "m / cm") {
      updateHeightCompoundUnits(height, heightUnit);
    }
  }, [height, heightUnit]);
  
  // Calculate volume and weight whenever dimensions or density change, but not when units change
  useEffect(() => {
    // Only calculate when all values are valid (not negative)
    const hasNegativeValues = length < 0 || width < 0 || height < 0 || (density !== undefined && density < 0);
    
    if (hasNegativeValues) {
      setVolume(0);
      setWeight(0);
      return;
    }

    const volumeInCubicMeters = calculateVolumeInCubicMeters();
    const volumeInSelectedUnit = convertVolumeToUnit(volumeInCubicMeters, volumeUnit);
    setVolume(volumeInSelectedUnit);

    // Calculate weight (mass = density × volume)
    if (density !== undefined) {
      const densityInKgPerCubicMeter = convertDensityToKgPerCubicMeter(density, densityUnit);
      const weightInKg = volumeInCubicMeters * densityInKgPerCubicMeter;
      const weightInSelectedUnit = convertWeightToUnit(weightInKg, weightUnit);
      setWeight(weightInSelectedUnit);
    } else {
      setWeight(0); // Set weight to 0 when density is undefined
    }
  }, [length, width, height, lengthUnit, widthUnit, heightUnit, volumeUnit, density, densityUnit, weightUnit]); // Include units in dependencies since they're used in calculations

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Size to Weight Calculator</h1>
      
      {/* Size Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600"
          onClick={() => setSizeExpanded(!sizeExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {sizeExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Size</span>
          </div>
        </button>
        
        {sizeExpanded && (
          <div className="p-4">
            {/* Length */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Length</label>
               
              </div>
              
              {lengthUnit === "ft / in" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={lengthFeet || ''}
                      onChange={(e) => {
                        const feet = Number(e.target.value);
                        setLengthFeet(feet);
                        // Update length in inches (for internal calculations)
                        const totalInches = (feet * 12) + lengthInches;
                        setLength(totalInches);
                        setLengthError(feet < 0 ? "Length cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      ft
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={lengthInches || ''}
                      onChange={(e) => {
                        const inches = Number(e.target.value);
                        setLengthInches(inches);
                        // Update length in inches (for internal calculations)
                        const totalInches = (lengthFeet * 12) + inches;
                        setLength(totalInches);
                        setLengthError(inches < 0 ? "Length cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={lengthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "ft / in") {
                          const lengthInMeters = feetAndInchesToMeters(lengthFeet, lengthInches);
                          const convertedLength = convertMetersToLength(lengthInMeters, newUnit);
                          setLength(convertedLength);
                        }
                        setLengthUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : lengthUnit === "m / cm" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={lengthMeters || ''}
                      onChange={(e) => {
                        const meters = Number(e.target.value);
                        setLengthMeters(meters);
                        // Update length in meters (for internal calculations)
                        const totalMeters = meters + (lengthCentimeters / 100);
                        setLength(totalMeters);
                        setLengthError(meters < 0 ? "Length cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      m
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={lengthCentimeters || ''}
                      onChange={(e) => {
                        const cm = Number(e.target.value);
                        setLengthCentimeters(cm);
                        // Update length in meters (for internal calculations)
                        const totalMeters = lengthMeters + (cm / 100);
                        setLength(totalMeters);
                        setLengthError(cm < 0 ? "Length cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={lengthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "m / cm") {
                          const lengthInMeters = metersAndCentimetersToMeters(lengthMeters, lengthCentimeters);
                          const convertedLength = convertMetersToLength(lengthInMeters, newUnit);
                          setLength(convertedLength);
                        }
                        setLengthUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <input 
                    type="number" 
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                    value={length || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setLength(value);
                      setLengthError(value < 0 ? "Length cannot be negative." : null);
                    }}
                    placeholder="0"
                  />
                  <select 
                    className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      // Convert the current length to meters, then to the new unit
                      const lengthInMeters = convertLengthToMeters(length, lengthUnit);
                      
                      if (newUnit === "ft / in") {
                        // Convert meters to feet and inches
                        const { feet, inches } = metersToFeetAndInches(lengthInMeters);
                        setLengthFeet(feet);
                        setLengthInches(inches);
                        // Calculate total inches for internal value
                        setLength(feet * 12 + inches);
                      } else if (newUnit === "m / cm") {
                        // Convert meters to meters and centimeters
                        const { meters, centimeters } = metersToMetersAndCentimeters(lengthInMeters);
                        setLengthMeters(meters);
                        setLengthCentimeters(centimeters);
                        // Use meters for internal value
                        setLength(lengthInMeters);
                      } else {
                        // Standard conversion
                        const convertedLength = convertMetersToLength(lengthInMeters, newUnit);
                        setLength(convertedLength);
                      }
                      
                      setLengthUnit(newUnit);
                    }}
                  >
                    {lengthUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                </div>
              )}
              {lengthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {lengthError}
                </div>
              )}
            </div>
            
            {/* Width */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Width</label>
             
              </div>
              {widthUnit === "ft / in" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={widthFeet || ''}
                      onChange={(e) => {
                        const feet = Number(e.target.value);
                        setWidthFeet(feet);
                        // Update width in inches (for internal calculations)
                        const totalInches = (feet * 12) + widthInches;
                        setWidth(totalInches);
                        setWidthError(feet < 0 ? "Width cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      ft
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={widthInches || ''}
                      onChange={(e) => {
                        const inches = Number(e.target.value);
                        setWidthInches(inches);
                        // Update width in inches (for internal calculations)
                        const totalInches = (widthFeet * 12) + inches;
                        setWidth(totalInches);
                        setWidthError(inches < 0 ? "Width cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={widthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "ft / in") {
                          const widthInMeters = feetAndInchesToMeters(widthFeet, widthInches);
                          const convertedWidth = convertMetersToLength(widthInMeters, newUnit);
                          setWidth(convertedWidth);
                        }
                        setWidthUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : widthUnit === "m / cm" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={widthMeters || ''}
                      onChange={(e) => {
                        const meters = Number(e.target.value);
                        setWidthMeters(meters);
                        // Update width in meters (for internal calculations)
                        const totalMeters = meters + (widthCentimeters / 100);
                        setWidth(totalMeters);
                        setWidthError(meters < 0 ? "Width cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      m
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={widthCentimeters || ''}
                      onChange={(e) => {
                        const cm = Number(e.target.value);
                        setWidthCentimeters(cm);
                        // Update width in meters (for internal calculations)
                        const totalMeters = widthMeters + (cm / 100);
                        setWidth(totalMeters);
                        setWidthError(cm < 0 ? "Width cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={widthUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "m / cm") {
                          const widthInMeters = metersAndCentimetersToMeters(widthMeters, widthCentimeters);
                          const convertedWidth = convertMetersToLength(widthInMeters, newUnit);
                          setWidth(convertedWidth);
                        }
                        setWidthUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <input 
                    type="number" 
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                    value={width || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setWidth(value);
                      setWidthError(value < 0 ? "Width cannot be negative." : null);
                    }}
                    placeholder="0"
                  />
                  <select 
                    className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                    value={widthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      // Convert the current width to meters, then to the new unit
                      const widthInMeters = convertLengthToMeters(width, widthUnit);
                      
                      if (newUnit === "ft / in") {
                        // Convert meters to feet and inches
                        const { feet, inches } = metersToFeetAndInches(widthInMeters);
                        setWidthFeet(feet);
                        setWidthInches(inches);
                        // Calculate total inches for internal value
                        setWidth(feet * 12 + inches);
                      } else if (newUnit === "m / cm") {
                        // Convert meters to meters and centimeters
                        const { meters, centimeters } = metersToMetersAndCentimeters(widthInMeters);
                        setWidthMeters(meters);
                        setWidthCentimeters(centimeters);
                        // Use meters for internal value
                        setWidth(widthInMeters);
                      } else {
                        // Standard conversion
                        const convertedWidth = convertMetersToLength(widthInMeters, newUnit);
                        setWidth(convertedWidth);
                      }
                      
                      setWidthUnit(newUnit);
                    }}
                  >
                    {lengthUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                </div>
              )}
              {widthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {widthError}
                </div>
              )}
            </div>
            
            {/* Height */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Height</label>
              
              </div>
              {heightUnit === "ft / in" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${heightError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={heightFeet || ''}
                      onChange={(e) => {
                        const feet = Number(e.target.value);
                        setHeightFeet(feet);
                        // Update height in inches (for internal calculations)
                        const totalInches = (feet * 12) + heightInches;
                        setHeight(totalInches);
                        setHeightError(feet < 0 ? "Height cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      ft
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${heightError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={heightInches || ''}
                      onChange={(e) => {
                        const inches = Number(e.target.value);
                        setHeightInches(inches);
                        // Update height in inches (for internal calculations)
                        const totalInches = (heightFeet * 12) + inches;
                        setHeight(totalInches);
                        setHeightError(inches < 0 ? "Height cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={heightUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "ft / in") {
                          const heightInMeters = feetAndInchesToMeters(heightFeet, heightInches);
                          const convertedHeight = convertMetersToLength(heightInMeters, newUnit);
                          setHeight(convertedHeight);
                        }
                        setHeightUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : heightUnit === "m / cm" ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${heightError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={heightMeters || ''}
                      onChange={(e) => {
                        const meters = Number(e.target.value);
                        setHeightMeters(meters);
                        // Update height in meters (for internal calculations)
                        const totalMeters = meters + (heightCentimeters / 100);
                        setHeight(totalMeters);
                        setHeightError(meters < 0 ? "Height cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <div className="px-3 py-2 border-t border-b bg-gray-50 text-gray-500">
                      m
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className={`flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 ${heightError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={heightCentimeters || ''}
                      onChange={(e) => {
                        const cm = Number(e.target.value);
                        setHeightCentimeters(cm);
                        // Update height in meters (for internal calculations)
                        const totalMeters = heightMeters + (cm / 100);
                        setHeight(totalMeters);
                        setHeightError(cm < 0 ? "Height cannot be negative." : null);
                      }}
                      placeholder="0"
                    />
                    <select 
                      className="w-24 px-3 py-2 border-t border-b border-r rounded-r-md bg-white text-blue-500 focus:outline-none"
                      value={heightUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        // Convert the compound value to the simple unit format
                        if (newUnit !== "m / cm") {
                          const heightInMeters = metersAndCentimetersToMeters(heightMeters, heightCentimeters);
                          const convertedHeight = convertMetersToLength(heightInMeters, newUnit);
                          setHeight(convertedHeight);
                        }
                        setHeightUnit(newUnit);
                      }}
                    >
                      {lengthUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <input 
                    type="number" 
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${heightError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                    value={height || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setHeight(value);
                      setHeightError(value < 0 ? "Height cannot be negative." : null);
                    }}
                    placeholder="0"
                  />
                  <select 
                    className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                    value={heightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      // Convert the current height to meters, then to the new unit
                      const heightInMeters = convertLengthToMeters(height, heightUnit);
                      
                      if (newUnit === "ft / in") {
                        // Convert meters to feet and inches
                        const { feet, inches } = metersToFeetAndInches(heightInMeters);
                        setHeightFeet(feet);
                        setHeightInches(inches);
                        // Calculate total inches for internal value
                        setHeight(feet * 12 + inches);
                      } else if (newUnit === "m / cm") {
                        // Convert meters to meters and centimeters
                        const { meters, centimeters } = metersToMetersAndCentimeters(heightInMeters);
                        setHeightMeters(meters);
                        setHeightCentimeters(centimeters);
                        // Use meters for internal value
                        setHeight(heightInMeters);
                      } else {
                        // Standard conversion
                        const convertedHeight = convertMetersToLength(heightInMeters, newUnit);
                        setHeight(convertedHeight);
                      }
                      
                      setHeightUnit(newUnit);
                    }}
                  >
                    {lengthUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                </div>
              )}
              {heightError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {heightError}
                </div>
              )}
            </div>
            
            {/* Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Volume</label>
            
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none "
                  value={formatNumberWithCommas(volume)}
                  readOnly

                />
                <select 
                  className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                  value={volumeUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    // Convert the current volume to cubic meters, then to the new unit
                    const volumeInCubicMeters = calculateVolumeInCubicMeters();
                    const convertedVolume = convertVolumeToUnit(volumeInCubicMeters, newUnit);
                    setVolume(convertedVolume);
                    setVolumeUnit(newUnit);
                  }}
                >
                  {volumeUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Weight Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <div className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Weight</span>
          </div>
        </div>
        
        <div className="p-4">
          {/* Density */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Density</label>
            
            </div>
            <div className="flex">
              <input 
                type="number" 
                className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${densityError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                value={density ?? ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (isNaN(value) || e.target.value === '') {
                    setDensity(undefined);
                    setDensityError(null);
                  } else {
                    setDensity(value);
                    setDensityError(value < 0 ? "Density cannot be negative." : null);
                  }
                }}
                placeholder="0"
              />
              <select 
                className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                value={densityUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  // Convert the current density to kg/m³, then to the new unit
                  if (density !== undefined) {
                    const densityInKgPerCubicMeter = convertDensityToKgPerCubicMeter(density, densityUnit);
                    const convertedDensity = convertKgPerCubicMeterToDensity(densityInKgPerCubicMeter, newUnit);
                    setDensity(convertedDensity);
                  }
                  setDensityUnit(newUnit);
                }}
              >
                {densityUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.value}</option>
                ))}
              </select>
            </div>
            {densityError && (
              <div className="mt-1 flex items-center text-red-500 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {densityError}
              </div>
            )}
          </div>
          
          {/* Weight */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Weight</label>
            
            </div>
            <div className="flex">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none "
                value={formatNumberWithCommas(weight)}
                readOnly />
               <select 
                className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                value={weightUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  // First convert current weight to kg, then to the new unit
                  if (density !== undefined) {
                    const volumeInCubicMeters = calculateVolumeInCubicMeters();
                    const densityInKgPerCubicMeter = convertDensityToKgPerCubicMeter(density, densityUnit);
                    const weightInKg = volumeInCubicMeters * densityInKgPerCubicMeter;
                    const convertedWeight = convertWeightToUnit(weightInKg, newUnit);
                    setWeight(convertedWeight);
                  }
                  setWeightUnit(newUnit);
                }}
              >
                {weightUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.value}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
