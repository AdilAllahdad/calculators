"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue, formatNumberWithCommas, getUnitsByType, getUnitsByValues } from "@/lib/utils";
import { UNIT_OPTIONS } from "@/constants";
import { UnitOption } from "@/types/calculator";

// Define unit values for this calculator
const diameterUnitValues = getUnitsByValues(['mm', 'cm', 'm', 'in', 'ft', 'yd', 'ft-in', 'm-cm']);

const angleUnitValues = getUnitsByType('angle');

const depthUnitValues = diameterUnitValues;

export default function CountersinkDepthCalculator() {
  const [diameter, setDiameter] = useState<number | string>("");
  const [diameterFeet, setDiameterFeet] = useState<number | string>("");
  const [diameterInches, setDiameterInches] = useState<number | string>("");
  const [diameterMeters, setDiameterMeters] = useState<number | string>("");
  const [diameterCentimeters, setDiameterCentimeters] = useState<number | string>("");
  
  const [angle, setAngle] = useState<number | string>("");
  
  const [depth, setDepth] = useState<number | string>("");
  const [depthFeet, setDepthFeet] = useState<number | string>("");
  const [depthInches, setDepthInches] = useState<number | string>("");
  const [depthMeters, setDepthMeters] = useState<number | string>("");
  const [depthCentimeters, setDepthCentimeters] = useState<number | string>("");
  
  const [diameterUnit, setDiameterUnit] = useState("mm");
  const [angleUnit, setAngleUnit] = useState("rad");
  const [depthUnit, setDepthUnit] = useState("cm");
  
  // Helper function to format displayed input values
  const formatInputValue = (value: number | string): string => {
    if (value === "" || value === undefined) return "";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "";
    
    // Format with commas for large numbers and fewer decimals
    // Don't show excessive decimal places
    const isInteger = Number.isInteger(numValue);
    if (isInteger) {
      return numValue.toLocaleString('en-US');
    }
    
    // Round to max 2 decimal places for display
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  const [showFeedback, setShowFeedback] = useState(false);
  
  // State for validation errors
  const [diameterError, setDiameterError] = useState<string | null>(null);
  const [angleError, setAngleError] = useState<string | null>(null);
  
  // Calculate depth in real-time
  const calculateDepth = () => {
    // Skip calculation if inputs aren't valid
    let diameterInMM: number;
    let angleInRadians: number;
    
    // Handle different unit types for diameter
    if (diameterUnit === 'ft-in') {
      const feet = typeof diameterFeet === 'string' ? parseFloat(diameterFeet) || 0 : diameterFeet;
      const inches = typeof diameterInches === 'string' ? parseFloat(diameterInches) || 0 : diameterInches;
      
      // Return if both fields are zero or empty
      if (feet <= 0 && inches <= 0) {
        return;
      }
      
      // Convert to feet first with proper precision
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      // Then convert to mm with full precision
      diameterInMM = convertValue(valueInFeet, 'ft', 'mm');
    } else if (diameterUnit === 'm-cm') {
      const meters = typeof diameterMeters === 'string' ? parseFloat(diameterMeters) || 0 : diameterMeters;
      const centimeters = typeof diameterCentimeters === 'string' ? parseFloat(diameterCentimeters) || 0 : diameterCentimeters;
      
      // Return if both fields are zero or empty
      if (meters <= 0 && centimeters <= 0) {
        return;
      }
      
      // Convert to meters with proper precision
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      // Then convert to mm with full precision
      diameterInMM = convertValue(valueInMeters, 'm', 'mm');
    } else {
      const numDiameter = typeof diameter === 'string' ? parseFloat(diameter) || 0 : diameter;
      if (numDiameter <= 0) {
        return;
      }
      // Always convert to mm with full precision
      diameterInMM = convertValue(numDiameter, diameterUnit, 'mm');
    }
    
    // Handle angle units
    const numAngle = typeof angle === 'string' ? parseFloat(angle) || 0 : angle;
    if (numAngle <= 0) {
      return;
    }
    
    // Convert angle to radians
    if (angleUnit === 'deg') {
      angleInRadians = numAngle * (Math.PI / 180);
    } else if (angleUnit === 'pirad') {
      angleInRadians = numAngle * Math.PI;
    } else { // rad
      angleInRadians = numAngle;
    }
    
    // Calculate depth using the formula: depth = diameter / (2 * tan(angle/2))
    const depthInMM = diameterInMM / (2 * Math.tan(angleInRadians / 2));
    
    // Convert to the selected depth unit
    if (depthUnit === 'ft-in') {
      const depthInFeet = convertValue(depthInMM, 'mm', 'ft');
      const feet = Math.floor(depthInFeet);
      const inches = (depthInFeet - feet) * 12;
      setDepthFeet(feet);
      setDepthInches(parseFloat(inches.toFixed(4)));
    } else if (depthUnit === 'm-cm') {
      const depthInMeters = convertValue(depthInMM, 'mm', 'm');
      const meters = Math.floor(depthInMeters);
      const centimeters = (depthInMeters - meters) * 100;
      setDepthMeters(meters);
      setDepthCentimeters(parseFloat(centimeters.toFixed(4)));
    } else {
      // Convert to the selected unit
      const convertedDepth = convertValue(depthInMM, 'mm', depthUnit);
      setDepth(parseFloat(convertedDepth.toFixed(6)));
    }
  };
  
  // Validate all inputs
  useEffect(() => {
    setDiameterError(diameter !== "" && Number(diameter) <= 0 ? "Diameter must be positive." : null);
    setAngleError(angle !== "" && Number(angle) <= 0 ? "Angle must be positive." : null);
  }, [diameter, angle]);
  
  // Update calculation whenever inputs change
  useEffect(() => {
    // Only calculate when values are valid
    const hasInvalidValues = () => {
      // Regular units
      if (diameter !== "" && Number(diameter) <= 0) return true;
      if (angle !== "" && Number(angle) <= 0) return true;
      
      // ft-in units
      if (diameterFeet !== "" && Number(diameterFeet) < 0) return true;
      if (diameterInches !== "" && Number(diameterInches) < 0) return true;
      
      // m-cm units
      if (diameterMeters !== "" && Number(diameterMeters) < 0) return true;
      if (diameterCentimeters !== "" && Number(diameterCentimeters) < 0) return true;
      
      return false;
    };
      
    if (!hasInvalidValues()) {
      calculateDepth();
    }
  }, [diameter, angle, 
      diameterFeet, diameterInches,
      diameterMeters, diameterCentimeters,
      diameterUnit, angleUnit, depthUnit]);

  const handleDiameterUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof diameter === 'string' ? parseFloat(diameter) || 0 : diameter;
    
    // Convert values when switching to compound unit modes
    if (newUnit === 'ft-in' && diameterUnit !== 'ft-in') {
      // Special handling for m-cm to ft-in conversion
      if (diameterUnit === 'm-cm') {
        const meters = typeof diameterMeters === 'string' ? parseFloat(diameterMeters) || 0 : diameterMeters;
        const centimeters = typeof diameterCentimeters === 'string' ? parseFloat(diameterCentimeters) || 0 : diameterCentimeters;
        
        // Convert to meters with proper precision
        const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
        // Convert to feet with full precision
        const valueInFeet = convertValue(valueInMeters, 'm', 'ft');
        
        // Properly separate feet and inches
        const feet = Math.floor(valueInFeet);
        const inchesExact = (valueInFeet - feet) * 12;
        const inches = parseFloat(inchesExact.toFixed(5));  // Using 5 decimal places for more precision
        
        setDiameterFeet(feet);
        setDiameterInches(inches);
        setDiameterUnit(newUnit);
        return;
      } else {
        // Regular unit to ft-in conversion
        const numDiameter = typeof diameter === 'string' ? parseFloat(diameter) || 0 : diameter;
        // First convert to base unit (meters), then to feet for better precision
        const valueInMeters = convertValue(numDiameter, diameterUnit, 'm');
        const valueInFeet = convertValue(valueInMeters, 'm', 'ft');
        
        // Properly separate feet and inches with higher precision
        const feet = Math.floor(valueInFeet);
        // Use higher precision calculation for inches to prevent rounding errors
        const inchesExact = (valueInFeet - feet) * 12;
        const inches = parseFloat(inchesExact.toFixed(4));
        
        setDiameterFeet(feet);
        setDiameterInches(inches);
        setDiameterUnit(newUnit);
        // Calculate depth after unit change
        setTimeout(() => calculateDepth(), 0);
        return;
      }
    }
    if (newUnit === 'm-cm' && diameterUnit !== 'm-cm') {
      // Special handling for ft-in to m-cm conversion
      if (diameterUnit === 'ft-in') {
        const feet = typeof diameterFeet === 'string' ? parseFloat(diameterFeet) || 0 : diameterFeet;
        const inches = typeof diameterInches === 'string' ? parseFloat(diameterInches) || 0 : diameterInches;
        
        // Convert to feet first with proper precision
        const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
        // Convert to meters with full precision
        const valueInMeters = convertValue(valueInFeet, 'ft', 'm');
        
        // Properly separate meters and centimeters
        const meters = Math.floor(valueInMeters);
        const centimetersExact = (valueInMeters - meters) * 100;
        const centimeters = parseFloat(centimetersExact.toFixed(4));
        
        setDiameterMeters(meters);
        setDiameterCentimeters(centimeters);
        setDiameterUnit(newUnit);
        return;
      } else {
        // Regular unit to m-cm conversion
        const numDiameter = typeof diameter === 'string' ? parseFloat(diameter) || 0 : diameter;
        // Convert to meters with full precision
        const valueInMeters = convertValue(numDiameter, diameterUnit, 'm');
        
        // Properly separate meters and centimeters
        const meters = Math.floor(valueInMeters);
        // Use higher precision calculation for centimeters
        const centimetersExact = (valueInMeters - meters) * 100;
        const centimeters = parseFloat(centimetersExact.toFixed(4));
        
        setDiameterMeters(meters);
        setDiameterCentimeters(centimeters);
        setDiameterUnit(newUnit);
        // Calculate depth after unit change
        setTimeout(() => calculateDepth(), 0);
        return;
      }
    }
    // Converting from ft/in to a regular unit
    else if (diameterUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof diameterFeet === 'string' ? parseFloat(diameterFeet) || 0 : diameterFeet;
      const inches = typeof diameterInches === 'string' ? parseFloat(diameterInches) || 0 : diameterInches;
      // Convert to feet first with proper precision
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      // Convert to base unit (meters) first, then to target unit for better accuracy
      const valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      setDiameter(convertValue(valueInMeters, 'm', newUnit));
    } 
    // Converting from m/cm to a regular unit
    else if (diameterUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof diameterMeters === 'string' ? parseFloat(diameterMeters) || 0 : diameterMeters;
      const centimeters = typeof diameterCentimeters === 'string' ? parseFloat(diameterCentimeters) || 0 : diameterCentimeters;
      // Convert to meters first with proper precision
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      // Then convert to the target unit
      setDiameter(convertValue(valueInMeters, 'm', newUnit));
    } 
    // Regular unit to regular unit conversion
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        // Convert through base unit (meters) for consistent conversions
        const valueInMeters = convertValue(currentValue, diameterUnit, 'm');
        setDiameter(convertValue(valueInMeters, 'm', newUnit));
      }
    }
    
    setDiameterUnit(newUnit);
  };
  
  const handleAngleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof angle === 'string' ? parseFloat(angle) || 0 : angle;
    
    if (currentValue) {
      // Convert from the old unit to the new unit
      if (angleUnit === 'deg' && newUnit === 'rad') {
        // deg to rad
        setAngle(parseFloat((currentValue * (Math.PI / 180)).toFixed(6)));
      } else if (angleUnit === 'deg' && newUnit === 'pirad') {
        // deg to π rad
        setAngle(parseFloat((currentValue / 180).toFixed(6)));
      } else if (angleUnit === 'rad' && newUnit === 'deg') {
        // rad to deg
        setAngle(parseFloat((currentValue * (180 / Math.PI)).toFixed(6)));
      } else if (angleUnit === 'rad' && newUnit === 'pirad') {
        // rad to π rad
        setAngle(parseFloat((currentValue / Math.PI).toFixed(6)));
      } else if (angleUnit === 'pirad' && newUnit === 'deg') {
        // π rad to deg
        setAngle(parseFloat((currentValue * 180).toFixed(6)));
      } else if (angleUnit === 'pirad' && newUnit === 'rad') {
        // π rad to rad
        setAngle(parseFloat((currentValue * Math.PI).toFixed(6)));
      }
    }
    
    setAngleUnit(newUnit);
  };
  
  const handleDepthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    
    // Recalculate the depth value with the new unit
    setDepthUnit(newUnit);
    calculateDepth();
  };
  

  


  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use our calculation function
    calculateDepth();
  };

  const resetCalculator = () => {
    setDiameter("");
    setDiameterFeet("");
    setDiameterInches("");
    setDiameterMeters("");
    setDiameterCentimeters("");
    setAngle("");
    setDepth("");
    setDepthFeet("");
    setDepthInches("");
    setDepthMeters("");
    setDepthCentimeters("");
    setDiameterUnit("mm");
    setAngleUnit("rad");
    setDepthUnit("cm");
    setShowFeedback(false);
  };

  const shareResult = () => {
    // This would typically use the Web Share API or copy to clipboard
    // For now, we'll just show an alert
    alert("Result copied to clipboard!");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Countersink Depth Calculator</h1>
      
      {/* Calculator Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <div className="p-4">
          {/* Diameter Input */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Diameter</label>
            </div>
            
            {/* Different input fields based on the selected unit */}
            {diameterUnit === 'ft-in' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={diameterFeet || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setDiameterFeet(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={diameterInches || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setDiameterInches(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                </div>
                <UnitDropdown
                  value={diameterUnit}
                  onChange={handleDiameterUnitChange}
                  unitValues={diameterUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : diameterUnit === 'm-cm' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={diameterMeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setDiameterMeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={diameterCentimeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setDiameterCentimeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                </div>
                <UnitDropdown
                  value={diameterUnit}
                  onChange={handleDiameterUnitChange}
                  unitValues={diameterUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${diameterError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={formatInputValue(diameter)}
                  onChange={(e) => {
                    // Remove any commas and non-numeric characters (except for decimal point)
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setDiameter(value);
                  }}
                  placeholder="0"
                />
                <UnitDropdown
                  value={diameterUnit}
                  onChange={handleDiameterUnitChange}
                  unitValues={diameterUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            )}
            {diameterError && (
              <div className="mt-1 flex items-center text-red-500 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {diameterError}
              </div>
            )}
          </div>
          
          {/* Angle Input */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Angle</label>
            </div>
            <div className="flex">
              <input 
                type="text" 
                className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${angleError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                value={formatInputValue(angle)}
                onChange={(e) => {
                  // Remove any commas and non-numeric characters (except for decimal point)
                  const rawValue = e.target.value.replace(/,/g, '');
                  const value = rawValue === '' ? '' : Number(rawValue);
                  setAngle(value);
                }}
                placeholder="0"
              />
              <UnitDropdown
                value={angleUnit}
                onChange={handleAngleUnitChange}
                unitValues={angleUnitValues.map((unit: UnitOption) => unit.value)}
                className="w-24 rounded-l-none rounded-r-md border-l-0"
              />
            </div>
            {angleError && (
              <div className="mt-1 flex items-center text-red-500 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {angleError}
              </div>
            )}
          </div>
          
          {/* Depth Output */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Depth</label>
            </div>
            
            {/* Different output fields based on the selected unit */}
            {depthUnit === 'ft-in' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none"
                    value={depthFeet || ''}
                    readOnly
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r bg-gray-50 focus:outline-none"
                    value={depthInches || ''}
                    readOnly
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                </div>
                <UnitDropdown
                  value={depthUnit}
                  onChange={handleDepthUnitChange}
                  unitValues={depthUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : depthUnit === 'm-cm' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none"
                    value={depthMeters || ''}
                    readOnly
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r bg-gray-50 focus:outline-none"
                    value={depthCentimeters || ''}
                    readOnly
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                </div>
                <UnitDropdown
                  value={depthUnit}
                  onChange={handleDepthUnitChange}
                  unitValues={depthUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none"
                  value={formatInputValue(depth)}
                  readOnly
                />
                <UnitDropdown
                  value={depthUnit}
                  onChange={handleDepthUnitChange}
                  unitValues={depthUnitValues.map((unit: UnitOption) => unit.value)}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={resetCalculator}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-medium hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
