'use client';

import { useState, useEffect } from 'react';
import { 
  convertArea, 
  convertLength, 
  convertVolume, 
  convertToComposite,
  convertFromComposite,
  convertBetweenComposites,
  formatNumber 
} from '@/lib/conversions';

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
  const [lengthValue, setLengthValue] = useState<string>('0');
  const [lengthUnit, setLengthUnit] = useState<string>('ft');
  const [widthValue, setWidthValue] = useState<string>('0');
  const [widthUnit, setWidthUnit] = useState<string>('ft');
  
  // Error states
  const [lengthError, setLengthError] = useState<string>('');
  const [widthError, setWidthError] = useState<string>('');
  const [areaError, setAreaError] = useState<string>('');
  const [heightError, setHeightError] = useState<string>('');
  const [volumeError, setVolumeError] = useState<string>('');

  // Add useEffect to calculate area when component mounts or when length/width values change
  // Note: We only recalculate when the values change, not when units change
  useEffect(() => {
    if (lengthValue !== '0' && widthValue !== '0') {
      calculateArea();
    }
  }, [lengthValue, widthValue]); // Removed lengthUnit, widthUnit from dependencies

  // Add useEffect to calculate volume when area or height values change
  // Note: We only recalculate when the values change, not when units change
  useEffect(() => {
    if (areaValue !== '0' && heightValue !== '0') {
      calculateFromAreaAndHeight();
    } else if (volumeValue !== '0' && heightValue !== '0') {
      calculateFromVolumeAndHeight();
    }
  }, [areaValue, heightValue]); // Removed areaUnit, heightUnit from dependencies
  
  // Helper function to parse composite or regular unit values
  const parseUnitValue = (value: string, unit: string): number => {
    // For composite units like "ft / in" or "m / cm"
    if (unit === 'ft / in' || unit === 'm / cm') {
      const parts = value.split('.');
      if (parts.length === 2) {
        const whole = parseFloat(parts[0]);
        const fraction = parseFloat(parts[1]);
        
        if (unit === 'ft / in') {
          // Convert to feet (1 foot = 12 inches)
          return whole + (fraction / 12);
        } else { // m / cm
          // Convert to meters (1 meter = 100 cm)
          return whole + (fraction / 100);
        }
      } else if (parts.length === 1 && parts[0]) {
        // Just whole number with no decimal
        return parseFloat(parts[0]);
      }
    }
    
    // For regular units, just parse as a regular number
    return parseFloat(value);
  };

  // Helper function to check and handle negative values
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
    
    // Special handling for values that might be composite format (e.g., "5.10" for 5 feet 10 inches)
    // Just ensure the overall number isn't negative
    const numValue = parseFloat(value);
    if (numValue < 0) {
      errorSetter("Negative values are not allowed");
      setter('');
      return;
    }
    
    // If it's a valid non-negative number, set it
    setter(value);
  };
 
  // Helper function to handle unit changes with proper conversion
  const handleUnitChange = (
    value: string, 
    fromUnit: string, 
    toUnit: string, 
    setter: (val: string) => void, 
    conversionFunc: (val: number, from: string, to: string) => number,
    shouldRecalculateArea: boolean = false
  ) => {
    // If the units are the same, no conversion needed
    if (fromUnit === toUnit) {
      return;
    }
    
    // If there's no value or it's 0, just set 0 and return
    if (!value || value === '0') {
      setter('0');
      return;
    }
    
    try {
      // Special case: From m/cm to any other unit
      if (fromUnit === 'm / cm') {
        // Parse the composite value correctly
        const parts = value.split('.');
        let meters = 0;
        let centimeters = 0;
        
        if (parts.length === 2) {
          meters = parseFloat(parts[0] || '0');
          centimeters = parseFloat(parts[1] || '0');
        } else if (parts.length === 1) {
          meters = parseFloat(parts[0] || '0');
        }
        
        // Convert to total meters
        const totalMeters = meters + (centimeters / 100);
        
        if (toUnit === 'ft / in') {
          // Convert from m/cm to ft/in
          const result = convertToComposite(totalMeters, 'm', 'ft / in');
          const wholeFormatted = formatNumber(result.whole, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
          
          const fractionFormatted = formatNumber(result.fraction, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
          
          setter(`${wholeFormatted}.${fractionFormatted}`);
        } else {
          // Convert to the target unit from meters
          const convertedValue = conversionFunc(totalMeters, 'm', toUnit);
          
          if (Number.isInteger(convertedValue) || convertedValue > 100) {
            setter(convertedValue.toString());
          } else {
            setter(formatNumber(convertedValue, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 8  // Use same precision as ft/in conversion
            }));
          }
        }
        
        // If this is a length or width unit change, recalculate area
        if (shouldRecalculateArea) {
          setTimeout(() => calculateArea(), 0);
        }
        return;
      }
      
      // Case 1: From composite unit (ft / in) to any unit
      if (fromUnit === 'ft / in') {
        // Parse the composite value
        const parts = value.split('.');
        let wholeValue = 0;
        let fractionValue = 0;
        
        if (parts.length === 2) {
          wholeValue = parseFloat(parts[0] || '0');
          fractionValue = parseFloat(parts[1] || '0');
        } else if (parts.length === 1) {
          wholeValue = parseFloat(parts[0] || '0');
        }
        
        // Case 1a: From composite to another composite unit
        if (toUnit === 'ft / in' || toUnit === 'm / cm') {
          const result = convertBetweenComposites(
            wholeValue, 
            fractionValue, 
            fromUnit as 'ft / in' | 'm / cm', 
            toUnit as 'ft / in' | 'm / cm'
          );
          
          // Format the whole and fraction parts
          const wholeFormatted = formatNumber(result.whole, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
          
          const fractionFormatted = formatNumber(result.fraction, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
          
          // Set the value in the format "whole.fraction"
          setter(`${wholeFormatted}.${fractionFormatted}`);
          
          // If this is a length or width unit change, recalculate area
          if (shouldRecalculateArea) {
            setTimeout(() => calculateArea(), 0);
          }
        } 
        // Case 1b: From composite to single unit
        else {
          const convertedValue = convertFromComposite(
            wholeValue, 
            fractionValue, 
            fromUnit as 'ft / in' | 'm / cm', 
            toUnit
          );
          
          // Format the number for display
          if (Number.isInteger(convertedValue) || convertedValue > 100) {
            setter(convertedValue.toString());
          } else if (convertedValue < 0.0001 && convertedValue > 0) {
            // For very small numbers, use enough decimal places to show the actual value
            const decimalPlaces = Math.abs(Math.floor(Math.log10(convertedValue))) + 6;
            setter(convertedValue.toFixed(decimalPlaces));
          } else {
            setter(formatNumber(convertedValue, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 8  // Increased precision
            }));
          }
          
          // If this is a length or width unit change, recalculate area
          if (shouldRecalculateArea) {
            setTimeout(() => calculateArea(), 0);
          }
        }
      }
      // Case 2: From any unit to composite unit (ft / in or m / cm)
      else if (toUnit === 'ft / in' || toUnit === 'm / cm') {
        // Parse the value to ensure it's a number
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          setter('0');
          return;
        }
        
        const result = convertToComposite(numValue, fromUnit, toUnit as 'ft / in' | 'm / cm');
        
        // Format the whole and fraction parts
        const wholeFormatted = formatNumber(result.whole, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        
        const fractionFormatted = formatNumber(result.fraction, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
        
        // Set the value in the format "whole.fraction"
        setter(`${wholeFormatted}.${fractionFormatted}`);
        
        // If this is a length or width unit change, recalculate area
        if (shouldRecalculateArea) {
          setTimeout(() => calculateArea(), 0);
        }
      } 
      // Case 3: Regular conversion between single units
      else {
        // Parse the value to ensure it's a number
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          setter('0');
          return;
        }
        
        // Perform the conversion using the appropriate conversion function
        const convertedValue = conversionFunc(numValue, fromUnit, toUnit);
        
        // Format the number to a reasonable precision
        if (Number.isInteger(convertedValue) || convertedValue > 100) {
          setter(convertedValue.toString());
        } else if (convertedValue < 0.0001 && convertedValue > 0) {
          // For very small numbers, use enough decimal places to show the actual value
          const decimalPlaces = Math.abs(Math.floor(Math.log10(convertedValue))) + 6;
          setter(convertedValue.toFixed(decimalPlaces));
        } else {
          setter(formatNumber(convertedValue, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8  // Increased precision
          }));
        }
        
        // If this is a length or width unit change, recalculate area
        if (shouldRecalculateArea) {
          setTimeout(() => calculateArea(), 0);
        }
      }
    } catch (error) {
      console.error("Conversion error:", error);
      // In case of error, keep the original value
      setter(value);
    }
  };

  // Calculate the area based on length and width
  const calculateArea = () => {
    if (lengthValue && widthValue) {
      try {
        let lengthInFt, widthInFt;
        
        // Check if length is in composite unit
        if (lengthUnit === 'm / cm') {
          // Special handling for m/cm
          const parts = lengthValue.split('.');
          let meters = 0;
          let centimeters = 0;
          
          if (parts.length === 2) {
            meters = parseFloat(parts[0] || '0');
            centimeters = parseFloat(parts[1] || '0');
          } else if (parts.length === 1) {
            meters = parseFloat(parts[0] || '0');
          }
          
          // Convert to total meters then to feet
          const totalMeters = meters + (centimeters / 100);
          lengthInFt = convertLength(totalMeters, 'm', 'ft');
        }
        else if (lengthUnit === 'ft / in') {
          // For ft/in composite unit
          const parts = lengthValue.split('.');
          if (parts.length === 2) {
            const whole = parseFloat(parts[0] || '0');
            const fraction = parseFloat(parts[1] || '0');
            lengthInFt = convertFromComposite(whole, fraction, lengthUnit as 'ft / in', 'ft');
          } else {
            // If it's a composite unit but doesn't have a decimal point,
            // treat it as a whole number only
            lengthInFt = convertFromComposite(parseFloat(lengthValue), 0, lengthUnit as 'ft / in', 'ft');
          }
        } else {
          lengthInFt = convertLength(parseFloat(lengthValue), lengthUnit, 'ft');
        }
        
        // Check if width is in composite unit
        if (widthUnit === 'm / cm') {
          // Special handling for m/cm
          const parts = widthValue.split('.');
          let meters = 0;
          let centimeters = 0;
          
          if (parts.length === 2) {
            meters = parseFloat(parts[0] || '0');
            centimeters = parseFloat(parts[1] || '0');
          } else if (parts.length === 1) {
            meters = parseFloat(parts[0] || '0');
          }
          
          // Convert to total meters then to feet
          const totalMeters = meters + (centimeters / 100);
          widthInFt = convertLength(totalMeters, 'm', 'ft');
        }
        else if (widthUnit === 'ft / in') {
          // For ft/in composite unit
          const parts = widthValue.split('.');
          if (parts.length === 2) {
            const whole = parseFloat(parts[0] || '0');
            const fraction = parseFloat(parts[1] || '0');
            widthInFt = convertFromComposite(whole, fraction, widthUnit as 'ft / in', 'ft');
          } else {
            // If it's a composite unit but doesn't have a decimal point,
            // treat it as a whole number only
            widthInFt = convertFromComposite(parseFloat(widthValue), 0, widthUnit as 'ft / in', 'ft');
          }
        } else {
          widthInFt = convertLength(parseFloat(widthValue), widthUnit, 'ft');
        }
        
        // Area = Length × Width (formula as specified)
        const areaInSqFt = lengthInFt * widthInFt;
        const convertedArea = convertArea(areaInSqFt, 'ft²', areaUnit);
        
        // For integers or large numbers, don't add decimal places to avoid confusion
        if (Number.isInteger(convertedArea) || convertedArea > 100) {
          setAreaValue(convertedArea.toString());
        } else {
          setAreaValue(formatNumber(convertedArea, {maximumFractionDigits: 8})); // Increased precision
        }
        
        // If we have a height value, also recalculate gallons and volume
        if (heightValue && heightValue !== '0') {
          calculateFromAreaAndHeight(formatNumber(convertedArea, {maximumFractionDigits: 8})); // Increased precision
        }
      } catch (error) {
        console.error('Error calculating area:', error);
      }
    }
  };

  const calculateFromAreaAndHeight = (optionalArea?: string) => {
    // Use the provided area or the current state
    const areaToUse = optionalArea || areaValue;
    
    if (areaToUse !== null && heightValue !== null) {
      try {
        // Convert area to square feet for calculation
        const areaInSqFt = areaToUse ? convertArea(parseFloat(areaToUse), areaUnit, 'ft²') : 0;
        
        // Get height in feet
        let heightInFt = 0;
        if (heightValue) {
          if (heightUnit === 'm / cm') {
            // Special handling for m/cm
            const parts = heightValue.split('.');
            let meters = 0;
            let centimeters = 0;
            
            if (parts.length === 2) {
              meters = parseFloat(parts[0] || '0');
              centimeters = parseFloat(parts[1] || '0');
            } else if (parts.length === 1) {
              meters = parseFloat(parts[0] || '0');
            }
            
            // Convert to total meters then to feet
            const totalMeters = meters + (centimeters / 100);
            heightInFt = convertLength(totalMeters, 'm', 'ft');
          }
          else if (heightUnit === 'ft / in') {
            const parts = heightValue.split('.');
            if (parts.length === 2) {
              const whole = parseFloat(parts[0] || '0');
              const fraction = parseFloat(parts[1] || '0');
              heightInFt = convertFromComposite(whole, fraction, heightUnit as 'ft / in', 'ft');
            } else {
              // If it's a composite unit but doesn't have a decimal point,
              // treat it as a whole number only
              heightInFt = convertFromComposite(parseFloat(heightValue), 0, heightUnit as 'ft / in', 'ft');
            }
          } else {
            heightInFt = convertLength(parseFloat(heightValue), heightUnit, 'ft');
          }
        }
        
        // Calculate gallons per square foot: height in feet × 7.48052
        const gallonsPerSqFt = heightInFt * 7.48052; // US gallons per cubic foot conversion factor
        const convertedGallonsPerSqFt = convertVolume(gallonsPerSqFt, 'US gal', gallonsPerSqFtUnit);
        setGallonsPerSqFtValue(formatNumber(convertedGallonsPerSqFt, {maximumFractionDigits: 8})); // Increased precision
        
        // Calculate total volume: area (in sq ft) × gallons per square foot
        const totalVolumeInGallons = areaInSqFt * gallonsPerSqFt;
        
        // Convert to the selected volume unit
        const convertedVolume = convertVolume(totalVolumeInGallons, 'US gal', volumeUnit);
        
        // Use appropriate formatting for the volume
        if (Number.isInteger(convertedVolume) || convertedVolume > 100) {
          setVolumeValue(convertedVolume.toString());
        } else {
          setVolumeValue(formatNumber(convertedVolume, {maximumFractionDigits: 8})); // Increased precision
        }
      } catch (error) {
        console.error('Error calculating from area and height:', error);
      }
    }
  };

  const calculateFromVolumeAndHeight = () => {
    if (volumeValue && heightValue) {
      try {
        const volumeInGallons = convertVolume(parseFloat(volumeValue), volumeUnit, 'US gal');
        
        let heightInFt;
        // Check if height is in composite unit
        if (heightUnit === 'm / cm') {
          // Special handling for m/cm
          const parts = heightValue.split('.');
          let meters = 0;
          let centimeters = 0;
          
          if (parts.length === 2) {
            meters = parseFloat(parts[0] || '0');
            centimeters = parseFloat(parts[1] || '0');
          } else if (parts.length === 1) {
            meters = parseFloat(parts[0] || '0');
          }
          
          // Convert to total meters then to feet
          const totalMeters = meters + (centimeters / 100);
          heightInFt = convertLength(totalMeters, 'm', 'ft');
        }
        else if (heightUnit === 'ft / in') {
          // For ft/in composite unit
          const parts = heightValue.split('.');
          if (parts.length === 2) {
            const whole = parseFloat(parts[0] || '0');
            const fraction = parseFloat(parts[1] || '0');
            heightInFt = convertFromComposite(whole, fraction, heightUnit as 'ft / in', 'ft');
          } else {
            // If it's a composite unit but doesn't have a decimal point,
            // treat it as a whole number only
            heightInFt = convertFromComposite(parseFloat(heightValue), 0, heightUnit as 'ft / in', 'ft');
          }
        } else {
          heightInFt = convertLength(parseFloat(heightValue), heightUnit, 'ft');
        }
        
        // Always calculate gallons per square foot, even if height is 0
        // Gallons per square foot = height in feet × 7.48052 US gallons per cubic foot
        const gallonsPerSqFt = heightInFt * 7.48052;
        const convertedGallonsPerSqFt = convertVolume(gallonsPerSqFt, 'US gal', gallonsPerSqFtUnit);
        setGallonsPerSqFtValue(formatNumber(convertedGallonsPerSqFt, {maximumFractionDigits: 8})); // Increased precision
        
        // Only calculate area if we have valid values to avoid division by zero
        if (volumeInGallons > 0 && heightInFt > 0) {
          // Area = volume in gallons / gallons per square foot
          // This is equivalent to: volume (in gallons) / (height (in ft) × 7.48052)
          const areaInSqFt = volumeInGallons / gallonsPerSqFt;
          const convertedArea = convertArea(areaInSqFt, 'ft²', areaUnit);
          setAreaValue(formatNumber(convertedArea, {maximumFractionDigits: 8})); // Increased precision
        }
      } catch (error) {
        console.error('Error calculating from volume and height:', error);
      }
    }
  };

  const handleAreaChange = (value: string) => {
    handleNumberInput(value, setAreaValue, setAreaError);
    // No automatic recalculation
  };

  const handleHeightChange = (value: string) => {
    handleNumberInput(value, setHeightValue, setHeightError);
    
    // No automatic recalculation when height changes
    // Let the user click Calculate button instead
  };

  const handleVolumeChange = (value: string) => {
    handleNumberInput(value, setVolumeValue, setVolumeError);
    // No automatic recalculation
  };
  
  const handleLengthChange = (value: string) => {
    handleNumberInput(value, setLengthValue, setLengthError);
    // We only calculate area automatically as it's a direct calculation
    // This is expected behavior when entering dimensions
    if (value && widthValue && !isNaN(Number(value)) && Number(value) >= 0) {
      calculateArea();
    }
  };

  const handleWidthChange = (value: string) => {
    handleNumberInput(value, setWidthValue, setWidthError);
    // We only calculate area automatically as it's a direct calculation
    // This is expected behavior when entering dimensions
    if (lengthValue && value && !isNaN(Number(value)) && Number(value) >= 0) {
      calculateArea();
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
    
    // Reset error states
    setLengthError('');
    setWidthError('');
    setAreaError('');
    setHeightError('');
    setVolumeError('');
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
        <p className="text-slate-600 max-w-2xl mx-auto">
          Calculate how many gallons of water (or any liquid) per square foot you need for your tank, pool, or container. 
          This calculator converts between area units and volume units including US/UK gallons and fluid ounces.
          The formula used is: 1 cubic foot = 7.48052 US gallons.
        </p>
      </div>

      <div className="flex justify-center">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-md">
          
          {/* Length Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length <span className="text-slate-400">⋯</span>
            </label>
            {lengthUnit === 'ft / in' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={lengthValue.includes('.') ? lengthValue.split('.')[0] : lengthValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = lengthValue.includes('.') ? lengthValue.split('.')[1] : '0';
                      handleLengthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${lengthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Feet"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">ft</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={lengthValue.includes('.') ? lengthValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = lengthValue.includes('.') ? lengthValue.split('.')[0] : lengthValue;
                      const fraction = e.target.value;
                      handleLengthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${lengthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Inches"
                    min="0"
                    max="11"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">in</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(lengthValue, lengthUnit, newUnit, setLengthValue, convertLength, true);
                      setLengthUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : lengthUnit === 'm / cm' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={lengthValue.includes('.') ? lengthValue.split('.')[0] : lengthValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = lengthValue.includes('.') ? lengthValue.split('.')[1] : '0';
                      handleLengthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${lengthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Meters"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">m</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={lengthValue.includes('.') ? lengthValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = lengthValue.includes('.') ? lengthValue.split('.')[0] : lengthValue;
                      const fraction = e.target.value;
                      handleLengthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${lengthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Centimeters"
                    min="0"
                    max="99"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">cm</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(lengthValue, lengthUnit, newUnit, setLengthValue, convertLength, true);
                      setLengthUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={lengthValue}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className={`flex-1 px-3 py-2 border ${lengthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Enter length"
                  min="0"
                />
                <div className="relative min-w-[120px]">
                  <select
                    value={lengthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(lengthValue, lengthUnit, newUnit, setLengthValue, convertLength, true);
                      setLengthUnit(newUnit);
                    }}
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
            )}
            {lengthError && <p className="text-red-500 text-xs mt-1">{lengthError}</p>}
          </div>
          
          {/* Width Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width <span className="text-slate-400">⋯</span>
            </label>
            {widthUnit === 'ft / in' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={widthValue.includes('.') ? widthValue.split('.')[0] : widthValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = widthValue.includes('.') ? widthValue.split('.')[1] : '0';
                      handleWidthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Feet"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">ft</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={widthValue.includes('.') ? widthValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = widthValue.includes('.') ? widthValue.split('.')[0] : widthValue;
                      const fraction = e.target.value;
                      handleWidthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Inches"
                    min="0"
                    max="11"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">in</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={widthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(widthValue, widthUnit, newUnit, setWidthValue, convertLength, true);
                      setWidthUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : widthUnit === 'm / cm' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={widthValue.includes('.') ? widthValue.split('.')[0] : widthValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = widthValue.includes('.') ? widthValue.split('.')[1] : '0';
                      handleWidthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Meters"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">m</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={widthValue.includes('.') ? widthValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = widthValue.includes('.') ? widthValue.split('.')[0] : widthValue;
                      const fraction = e.target.value;
                      handleWidthChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Centimeters"
                    min="0"
                    max="99"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">cm</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={widthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(widthValue, widthUnit, newUnit, setWidthValue, convertLength, true);
                      setWidthUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={widthValue}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className={`flex-1 px-3 py-2 border ${widthError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Enter width"
                  min="0"
                />
                <div className="relative min-w-[120px]">
                  <select
                    value={widthUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(widthValue, widthUnit, newUnit, setWidthValue, convertLength, true);
                      setWidthUnit(newUnit);
                    }}
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
            )}
            {widthError && <p className="text-red-500 text-xs mt-1">{widthError}</p>}
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
                className={`flex-1 px-3 py-2 border ${areaError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.01"
                placeholder="Enter area"
                min="0"
              />
              <div className="relative min-w-[120px]">
                <select
                  value={areaUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    handleUnitChange(areaValue, areaUnit, newUnit, setAreaValue, convertArea, false);
                    setAreaUnit(newUnit);
                  }}
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
            {areaError && <p className="text-red-500 text-xs mt-1">{areaError}</p>}
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Height <span className="text-slate-400">⋯</span>
            </label>
            {heightUnit === 'ft / in' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={heightValue.includes('.') ? heightValue.split('.')[0] : heightValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = heightValue.includes('.') ? heightValue.split('.')[1] : '0';
                      handleHeightChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Feet"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">ft</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={heightValue.includes('.') ? heightValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = heightValue.includes('.') ? heightValue.split('.')[0] : heightValue;
                      const fraction = e.target.value;
                      handleHeightChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Inches"
                    min="0"
                    max="11"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">in</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={heightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(heightValue, heightUnit, newUnit, setHeightValue, convertLength);
                      setHeightUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : heightUnit === 'm / cm' ? (
              <div className="flex gap-2">
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={heightValue.includes('.') ? heightValue.split('.')[0] : heightValue}
                    onChange={(e) => {
                      const whole = e.target.value;
                      const fraction = heightValue.includes('.') ? heightValue.split('.')[1] : '0';
                      handleHeightChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Meters"
                    min="0"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">m</span>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    value={heightValue.includes('.') ? heightValue.split('.')[1] : '0'}
                    onChange={(e) => {
                      const whole = heightValue.includes('.') ? heightValue.split('.')[0] : heightValue;
                      const fraction = e.target.value;
                      handleHeightChange(`${whole}.${fraction}`);
                    }}
                    className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg rounded-r-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="1"
                    placeholder="Centimeters"
                    min="0"
                    max="99"
                  />
                  <div className="flex items-center justify-center bg-gray-100 px-2 border-t border-b border-r border-slate-300 rounded-r-lg">
                    <span className="text-sm text-gray-600">cm</span>
                  </div>
                </div>
                <div className="relative w-12">
                  <select
                    value={heightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(heightValue, heightUnit, newUnit, setHeightValue, convertLength);
                      setHeightUnit(newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">m / cm</option>
                    <option value="ft / in" className="text-blue-600">ft / in</option>
                    <option value="mm" className="text-blue-600">mm</option>
                    <option value="cm" className="text-blue-600">cm</option>
                    <option value="m" className="text-blue-600">m</option>
                    <option value="km" className="text-blue-600">km</option>
                    <option value="in" className="text-blue-600">in</option>
                    <option value="ft" className="text-blue-600">ft</option>
                    <option value="yd" className="text-blue-600">yd</option>
                    <option value="mi" className="text-blue-600">mi</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <span className="text-slate-500">▼</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightValue}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className={`flex-1 px-3 py-2 border ${heightError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  placeholder="Enter height"
                  min="0"
                />
                <div className="relative min-w-[120px]">
                  <select
                    value={heightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      handleUnitChange(heightValue, heightUnit, newUnit, setHeightValue, convertLength, false);
                      setHeightUnit(newUnit);
                    }}
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
                type="number"
                value={volumeValue}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className={`flex-1 px-3 py-2 border ${volumeError ? 'border-red-500' : 'border-slate-300'} rounded-lg bg-slate-50`}
                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
                placeholder="Volume will be calculated"
                min="0"
              />
              <div className="relative min-w-[120px]">
                <select
                  value={volumeUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    handleUnitChange(volumeValue, volumeUnit, newUnit, setVolumeValue, convertVolume, false);
                    setVolumeUnit(newUnit);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  style={{ color: '#2563eb' }}
                >
                  <option value="m³" className="text-blue-600">cubic meters (m³)</option>
                  <option value="cu in" className="text-blue-600">cubic inches (cu in)</option>
                  <option value="cu ft" className="text-blue-600">cubic feet (cu ft)</option>
                  <option value="cu yd" className="text-blue-600">cubic yards (cu yd)</option>
                  <option value="mL" className="text-blue-600">milliliters (mL)</option>
                  <option value="cL" className="text-blue-600">centiliters (cL)</option>
                  <option value="L" className="text-blue-600">liters (L)</option>
                  <option value="US fl oz" className="text-blue-600">fluid ounces (US) (US fl oz)</option>
                  <option value="UK fl oz" className="text-blue-600">fluid ounces (UK) (UK fl oz)</option>
                  <option value="US gal" className="bg-blue-500 text-white">gallons (US) (US gal)</option>
                  <option value="UK gal" className="text-blue-600">gallons (UK) (UK gal)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-blue-600">▼</span>
                </div>
              </div>
            </div>
            {volumeError && <p className="text-red-500 text-xs mt-1">{volumeError}</p>}
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
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    handleUnitChange(gallonsPerSqFtValue, gallonsPerSqFtUnit, newUnit, setGallonsPerSqFtValue, convertVolume, false);
                    setGallonsPerSqFtUnit(newUnit);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  style={{ color: '#2563eb' }}
                >
                  <option value="m³" className="text-blue-600">cubic meters (m³)</option>
                  <option value="cu in" className="text-blue-600">cubic inches (cu in)</option>
                  <option value="cu ft" className="text-blue-600">cubic feet (cu ft)</option>
                  <option value="cu yd" className="text-blue-600">cubic yards (cu yd)</option>
                  <option value="mL" className="text-blue-600">milliliters (mL)</option>
                  <option value="cL" className="text-blue-600">centiliters (cL)</option>
                  <option value="L" className="text-blue-600">liters (L)</option>
                  <option value="US fl oz" className="text-blue-600">fluid ounces (US) (US fl oz)</option>
                  <option value="UK fl oz" className="text-blue-600">fluid ounces (UK) (UK fl oz)</option>
                  <option value="US gal" className="bg-blue-500 text-white">gallons (US) (US gal)</option>
                  <option value="UK gal" className="text-blue-600">gallons (UK) (UK gal)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-blue-600">▼</span>
                </div>
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-500">per sq.ft</div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={() => {
                if (lengthValue && widthValue) {
                  calculateArea();
                }
                if (areaValue && heightValue) {
                  calculateFromAreaAndHeight();
                } else if (volumeValue && heightValue) {
                  calculateFromVolumeAndHeight();
                }
              }}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-white">🧮</span>
              Calculate
            </button>
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
          
          {/* Information Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-md font-semibold text-slate-700 mb-2">Understanding Gallons per Square Foot</h3>
            <p className="text-sm text-slate-600 mb-3">
              The number of gallons per square foot depends on the height/depth of your container:
            </p>
            <ul className="text-sm text-slate-600 list-disc pl-5 mb-3">
              <li>1 cubic foot = 7.48052 US gallons</li>
              <li>1 cubic foot = 6.22884 UK gallons</li>
              <li>Gallons per square foot = Height (in feet) × 7.48052</li>
            </ul>
            <p className="text-sm text-slate-600 mb-3">
              This calculator supports multiple volume units including US/UK gallons and fluid ounces, perfect for pool calculations, 
              aquarium setups, water tanks, or any liquid volume per area calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
   
  );
}
