'use client';

import { useState, useEffect, useCallback } from 'react';
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
  
  // For composite unit fields (feet/inches and meters/centimeters) - like cubic yard calculator
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    length: { whole: '', fraction: '' },
    width: { whole: '', fraction: '' },
    height: { whole: '', fraction: '' },
  });
  
  // Error states
  const [lengthError, setLengthError] = useState<string>('');
  const [widthError, setWidthError] = useState<string>('');
  const [areaError, setAreaError] = useState<string>('');
  const [heightError, setHeightError] = useState<string>('');
  const [volumeError, setVolumeError] = useState<string>('');

  // We'll add the useEffect after calculateArea is defined to avoid circular dependency

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
 
  // Handle unit conversions for length and width using ONLY the conversion utility functions from conversion folder (like cubic yard calculator)
  const handleLengthWidthUnitChange = (
    field: string,
    oldUnit: string,
    newUnit: string
  ) => {
    // Don't do anything if units are the same
    if (oldUnit === newUnit) return;

    // Update the unit first
    if (field === 'length') {
      setLengthUnit(newUnit);
    } else if (field === 'width') {
      setWidthUnit(newUnit);
    }

    // Clear any errors
    if (field === 'length') {
      setLengthError('');
    } else if (field === 'width') {
      setWidthError('');
    }

    // Check if we have any value to convert
    const currentValue = field === 'length' ? lengthValue : widthValue;
    const hasRegularValue = currentValue && !isNaN(parseFloat(currentValue));
    const hasCompositeValue = (compositeUnits[field]?.whole && !isNaN(parseFloat(compositeUnits[field].whole))) || 
                             (compositeUnits[field]?.fraction && !isNaN(parseFloat(compositeUnits[field].fraction)));

    // If no value exists, just return (unit is already updated)
    if (!hasRegularValue && !hasCompositeValue) {
      return;
    }

    try {
      // Case 1: Converting FROM single unit TO composite unit
      if ((oldUnit !== 'ft / in' && oldUnit !== 'm / cm') && (newUnit === 'ft / in' || newUnit === 'm / cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(currentValue);
        const targetCompositeUnit = newUnit;
        
        const result = convertToComposite(value, oldUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
        
        // Clear the regular dimension field
        if (field === 'length') {
          setLengthValue('');
        } else if (field === 'width') {
          setWidthValue('');
        }
      }
      
      // Case 2: Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft / in' || oldUnit === 'm / cm') && (newUnit !== 'ft / in' && newUnit !== 'm / cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit;
        
        const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'length') {
          setLengthValue(formattedValue);
        } else if (field === 'width') {
          setWidthValue(formattedValue);
        }
        
        // Clear composite units
        setCompositeUnits(prev => ({
          ...prev,
          [field]: { whole: '', fraction: '' }
        }));
      }
      
      // Case 3: Converting BETWEEN composite units (ft/in ↔ m/cm)
      else if ((oldUnit === 'ft / in' || oldUnit === 'm / cm') && (newUnit === 'ft / in' || newUnit === 'm / cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit;
        const targetCompositeUnit = newUnit;
        
        const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
      }
      
      // Case 4: Converting BETWEEN single units
      else if ((oldUnit !== 'ft / in' && oldUnit !== 'm / cm') && (newUnit !== 'ft / in' && newUnit !== 'm / cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(currentValue);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'length') {
          setLengthValue(formattedValue);
        } else if (field === 'width') {
          setWidthValue(formattedValue);
        }
      }

    } catch (error) {
      console.error('Conversion error:', error);
      // Reset to original unit on error
      if (field === 'length') {
        setLengthUnit(oldUnit);
      } else if (field === 'width') {
        setWidthUnit(oldUnit);
      }
    }

    // Recalculate area after conversion
    setTimeout(() => calculateArea(), 0);
  };

  // Handle unit conversions for height using the same system as length/width
  const handleHeightUnitChange = (
    oldUnit: string,
    newUnit: string
  ) => {
    // Don't do anything if units are the same
    if (oldUnit === newUnit) return;

    // Update the unit first
    setHeightUnit(newUnit);

    // Clear any errors
    setHeightError('');

    // Check if we have any value to convert
    const hasRegularValue = heightValue && !isNaN(parseFloat(heightValue));
    const hasCompositeValue = (compositeUnits.height?.whole && !isNaN(parseFloat(compositeUnits.height.whole))) || 
                             (compositeUnits.height?.fraction && !isNaN(parseFloat(compositeUnits.height.fraction)));

    // If no value exists, just return (unit is already updated)
    if (!hasRegularValue && !hasCompositeValue) {
      return;
    }

    try {
      // Case 1: Converting FROM single unit TO composite unit
      if ((oldUnit !== 'ft / in' && oldUnit !== 'm / cm') && (newUnit === 'ft / in' || newUnit === 'm / cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(heightValue);
        const targetCompositeUnit = newUnit;
        
        const result = convertToComposite(value, oldUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          height: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
        
        // Clear the regular height field
        setHeightValue('');
      }
      
      // Case 2: Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft / in' || oldUnit === 'm / cm') && (newUnit !== 'ft / in' && newUnit !== 'm / cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits.height?.whole || '0');
        const fraction = parseFloat(compositeUnits.height?.fraction || '0');
        const sourceCompositeUnit = oldUnit;
        
        const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setHeightValue(formattedValue);
        
        // Clear composite units
        setCompositeUnits(prev => ({
          ...prev,
          height: { whole: '', fraction: '' }
        }));
      }
      
      // Case 3: Converting BETWEEN composite units (ft/in ↔ m/cm)
      else if ((oldUnit === 'ft / in' || oldUnit === 'm / cm') && (newUnit === 'ft / in' || newUnit === 'm / cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits.height?.whole || '0');
        const fraction = parseFloat(compositeUnits.height?.fraction || '0');
        const sourceCompositeUnit = oldUnit;
        const targetCompositeUnit = newUnit;
        
        const result = convertBetweenComposites(whole, fraction, sourceCompositeUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          height: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
      }
      
      // Case 4: Converting BETWEEN single units
      else if ((oldUnit !== 'ft / in' && oldUnit !== 'm / cm') && (newUnit !== 'ft / in' && newUnit !== 'm / cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(heightValue);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setHeightValue(formattedValue);
      }

    } catch (error) {
      console.error('Height conversion error:', error);
      // Reset to original unit on error
      setHeightUnit(oldUnit);
    }
  };

  // Simple unit change handler for other fields (not length/width)
  const handleOtherUnitChange = (
    value: string,
    fromUnit: string,
    toUnit: string,
    setter: (val: string) => void,
    conversionFunc: (val: number, from: string, to: string) => number
  ) => {
    if (fromUnit === toUnit || !value || value === '0') {
      return;
    }
    
    try {
      const numValue = parseFloat(value);
      const convertedValue = conversionFunc(numValue, fromUnit, toUnit);
      const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
      setter(formattedValue);
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  // Helper function to handle input changes
  const handleLengthChange = (value: string) => {
    handleNumberInput(value, setLengthValue, setLengthError);
  };

  const handleWidthChange = (value: string) => {
    handleNumberInput(value, setWidthValue, setWidthError);
  };

  // Calculate the area based on length and width (simplified like cubic yard calculator)
  const calculateArea = useCallback(() => {
    console.log('calculateArea called with:', { lengthValue, widthValue, lengthUnit, widthUnit });
    
    // Check if we have values for both length and width
    const hasLengthValue = lengthValue && !isNaN(parseFloat(lengthValue));
    const hasWidthValue = widthValue && !isNaN(parseFloat(widthValue));
    const hasLengthComposite = (compositeUnits.length?.whole && !isNaN(parseFloat(compositeUnits.length.whole))) || 
                              (compositeUnits.length?.fraction && !isNaN(parseFloat(compositeUnits.length.fraction)));
    const hasWidthComposite = (compositeUnits.width?.whole && !isNaN(parseFloat(compositeUnits.width.whole))) || 
                             (compositeUnits.width?.fraction && !isNaN(parseFloat(compositeUnits.width.fraction)));

    console.log('Has values:', { hasLengthValue, hasWidthValue, hasLengthComposite, hasWidthComposite });

    if ((!hasLengthValue && !hasLengthComposite) || (!hasWidthValue && !hasWidthComposite)) {
      console.log('Early return - missing values');
      return;
    }

    try {
      let lengthInFt, widthInFt;
      
      // Convert length to feet
      if (lengthUnit === 'ft / in' || lengthUnit === 'm / cm') {
        if (hasLengthComposite) {
          const whole = parseFloat(compositeUnits.length?.whole || '0');
          const fraction = parseFloat(compositeUnits.length?.fraction || '0');
          lengthInFt = convertFromComposite(whole, fraction, lengthUnit, 'ft');
        } else {
          lengthInFt = 0;
        }
      } else {
        if (hasLengthValue) {
          lengthInFt = convertLength(parseFloat(lengthValue), lengthUnit, 'ft');
        } else {
          lengthInFt = 0;
        }
      }
      
      // Convert width to feet
      if (widthUnit === 'ft / in' || widthUnit === 'm / cm') {
        if (hasWidthComposite) {
          const whole = parseFloat(compositeUnits.width?.whole || '0');
          const fraction = parseFloat(compositeUnits.width?.fraction || '0');
          widthInFt = convertFromComposite(whole, fraction, widthUnit, 'ft');
        } else {
          widthInFt = 0;
        }
      } else {
        if (hasWidthValue) {
          widthInFt = convertLength(parseFloat(widthValue), widthUnit, 'ft');
        } else {
          widthInFt = 0;
        }
      }
      
      // Calculate area in square feet
      const areaInSqFt = lengthInFt * widthInFt;
      
      // Debug: Log the calculation for troubleshooting
      console.log('Area calculation debug:', {
        lengthValue,
        lengthUnit,
        lengthInFt,
        widthValue,
        widthUnit,
        widthInFt,
        areaInSqFt,
        areaUnit
      });
      
      // Convert to the selected area unit
      const convertedArea = convertArea(areaInSqFt, 'ft²', areaUnit);
      const formattedValue = formatNumber(convertedArea, { maximumFractionDigits: 4, useCommas: false });
      setAreaValue(formattedValue);
      
      // If we have a height value, also recalculate gallons and volume
      if (heightValue && heightValue !== '0') {
        calculateFromAreaAndHeight();
      }
    } catch (error) {
      console.error('Error calculating area:', error);
    }
  }, [lengthValue, widthValue, lengthUnit, widthUnit, compositeUnits, areaUnit, heightValue, setAreaValue]);

  // Add useEffect to calculate area when component mounts or when length/width values change
  useEffect(() => {
    console.log('useEffect triggered:', { lengthValue, widthValue });
    const lengthNum = parseFloat(lengthValue || '0');
    const widthNum = parseFloat(widthValue || '0');
    console.log('Parsed values:', { lengthNum, widthNum });
    
    if (lengthNum > 0 && widthNum > 0) {
      console.log('Calling calculateArea');
      calculateArea();
    } else {
      console.log('Not calling calculateArea - values not both > 0');
    }
  }, [lengthValue, widthValue, calculateArea]);

  const calculateFromAreaAndHeight = (optionalArea?: string) => {
    const areaToUse = optionalArea || areaValue;
    
    if (areaToUse) {
      try {
        // Convert area to square feet for calculation
        const areaInSqFt = convertArea(parseFloat(areaToUse), areaUnit, 'ft²');
        
        // Convert height to feet using the same logic as length/width
        let heightInFt = 0;
        
        // Check if height is in composite unit
        if (heightUnit === 'ft / in' || heightUnit === 'm / cm') {
          const hasCompositeValue = (compositeUnits.height?.whole && !isNaN(parseFloat(compositeUnits.height.whole))) || 
                                   (compositeUnits.height?.fraction && !isNaN(parseFloat(compositeUnits.height.fraction)));
          if (hasCompositeValue) {
            const whole = parseFloat(compositeUnits.height?.whole || '0');
            const fraction = parseFloat(compositeUnits.height?.fraction || '0');
            heightInFt = convertFromComposite(whole, fraction, heightUnit, 'ft');
          }
        } else {
          // For regular units
          if (heightValue && !isNaN(parseFloat(heightValue))) {
            heightInFt = convertLength(parseFloat(heightValue), heightUnit, 'ft');
          }
        }
        
        // Calculate gallons per square foot: height in feet × 7.48052
        const gallonsPerSqFt = heightInFt * 7.48052;
        const convertedGallonsPerSqFt = convertVolume(gallonsPerSqFt, 'US gal', gallonsPerSqFtUnit);
        const formattedGallonsPerSqFt = formatNumber(convertedGallonsPerSqFt, { maximumFractionDigits: 4, useCommas: false });
        setGallonsPerSqFtValue(formattedGallonsPerSqFt);
        
        // Calculate total volume: area (in sq ft) × gallons per square foot
        const totalVolumeInGallons = areaInSqFt * gallonsPerSqFt;
        const convertedVolume = convertVolume(totalVolumeInGallons, 'US gal', volumeUnit);
        const formattedVolume = formatNumber(convertedVolume, { maximumFractionDigits: 4, useCommas: false });
        setVolumeValue(formattedVolume);
      } catch (error) {
        console.error('Error calculating from area and height:', error);
      }
    }
  };

  const calculateFromVolumeAndHeight = () => {
    if (volumeValue) {
      try {
        const volumeInGallons = convertVolume(parseFloat(volumeValue), volumeUnit, 'US gal');
        
        // Convert height to feet using the same logic as length/width
        let heightInFt = 0;
        
        // Check if height is in composite unit
        if (heightUnit === 'ft / in' || heightUnit === 'm / cm') {
          const hasCompositeValue = (compositeUnits.height?.whole && !isNaN(parseFloat(compositeUnits.height.whole))) || 
                                   (compositeUnits.height?.fraction && !isNaN(parseFloat(compositeUnits.height.fraction)));
          if (hasCompositeValue) {
            const whole = parseFloat(compositeUnits.height?.whole || '0');
            const fraction = parseFloat(compositeUnits.height?.fraction || '0');
            heightInFt = convertFromComposite(whole, fraction, heightUnit, 'ft');
          }
        } else {
          // For regular units
          if (heightValue && !isNaN(parseFloat(heightValue))) {
            heightInFt = convertLength(parseFloat(heightValue), heightUnit, 'ft');
          }
        }
        
        // Always calculate gallons per square foot, even if height is 0
        // Gallons per square foot = height in feet × 7.48052 US gallons per cubic foot
        const gallonsPerSqFt = heightInFt * 7.48052;
        const convertedGallonsPerSqFt = convertVolume(gallonsPerSqFt, 'US gal', gallonsPerSqFtUnit);
        setGallonsPerSqFtValue(formatNumber(convertedGallonsPerSqFt, {maximumFractionDigits: 8, useCommas: false})); // Increased precision, no commas
        
        // Only calculate area if we have valid values to avoid division by zero
        if (volumeInGallons > 0 && heightInFt > 0) {
          // Area = volume in gallons / gallons per square foot
          // This is equivalent to: volume (in gallons) / (height (in ft) × 7.48052)
          const areaInSqFt = volumeInGallons / gallonsPerSqFt;
          const convertedArea = convertArea(areaInSqFt, 'ft²', areaUnit);
          setAreaValue(formatNumber(convertedArea, {maximumFractionDigits: 8, useCommas: false})); // Increased precision, no commas
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

  // Handle composite unit input changes (like cubic yard calculator)
  const handleCompositeChange = (field: string, part: 'whole' | 'fraction', value: string) => {
    // Clear any errors
    if (field === 'length') {
      setLengthError('');
    } else if (field === 'width') {
      setWidthError('');
    } else if (field === 'height') {
      setHeightError('');
    }

    // Update the composite value
    setCompositeUnits(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [part]: value
      }
    }));

    // Note: Area calculation is handled by useEffect automatically
  };

  // Handle regular unit input changes (like cubic yard calculator)
  const handleRegularUnitChange = (field: string, value: string) => {
    // Clear any errors
    if (field === 'length') {
      setLengthError('');
      handleNumberInput(value, setLengthValue, setLengthError);
    } else if (field === 'width') {
      setWidthError('');
      handleNumberInput(value, setWidthValue, setWidthError);
    } else if (field === 'height') {
      setHeightError('');
      handleNumberInput(value, setHeightValue, setHeightError);
    }

    // Note: Area calculation is handled by useEffect, no need for setTimeout
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
    
    // Reset composite units
    setCompositeUnits({
      length: { whole: '', fraction: '' },
      width: { whole: '', fraction: '' },
      height: { whole: '', fraction: '' },
    });
    
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
                    value={compositeUnits.length?.whole || ''}
                    onChange={(e) => {
                      handleCompositeChange('length', 'whole', e.target.value);
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
                    value={compositeUnits.length?.fraction || ''}
                    onChange={(e) => {
                      handleCompositeChange('length', 'fraction', e.target.value);
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
                      handleLengthWidthUnitChange('length', lengthUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                    value={compositeUnits.length?.whole || ''}
                    onChange={(e) => {
                      handleCompositeChange('length', 'whole', e.target.value);
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
                    value={compositeUnits.length?.fraction || ''}
                    onChange={(e) => {
                      handleCompositeChange('length', 'fraction', e.target.value);
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
                      handleLengthWidthUnitChange('length', lengthUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                  onChange={(e) => handleRegularUnitChange('length', e.target.value)}
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
                      handleLengthWidthUnitChange('length', lengthUnit, newUnit);
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
                    value={compositeUnits.width.whole}
                    onChange={(e) => handleCompositeChange('width', 'whole', e.target.value)}
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
                    value={compositeUnits.width.fraction}
                    onChange={(e) => handleCompositeChange('width', 'fraction', e.target.value)}
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
                      handleLengthWidthUnitChange('width', widthUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                    value={compositeUnits.width.whole}
                    onChange={(e) => handleCompositeChange('width', 'whole', e.target.value)}
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
                    value={compositeUnits.width.fraction}
                    onChange={(e) => handleCompositeChange('width', 'fraction', e.target.value)}
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
                      handleLengthWidthUnitChange('width', widthUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                  onChange={(e) => handleRegularUnitChange('width', e.target.value)}
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
                      handleLengthWidthUnitChange('width', widthUnit, newUnit);
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
                    handleOtherUnitChange(areaValue, areaUnit, newUnit, setAreaValue, convertArea);
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
                  <option value="sf" className="text-blue-600">soccer fields (sf)</option>
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
                    value={compositeUnits.height?.whole || ''}
                    onChange={(e) => {
                      handleCompositeChange('height', 'whole', e.target.value);
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
                    value={compositeUnits.height?.fraction || ''}
                    onChange={(e) => {
                      handleCompositeChange('height', 'fraction', e.target.value);
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
                      handleHeightUnitChange(heightUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                    value={compositeUnits.height?.whole || ''}
                    onChange={(e) => {
                      handleCompositeChange('height', 'whole', e.target.value);
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
                    value={compositeUnits.height?.fraction || ''}
                    onChange={(e) => {
                      handleCompositeChange('height', 'fraction', e.target.value);
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
                      handleHeightUnitChange(heightUnit, newUnit);
                    }}
                    className="w-full h-full px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm appearance-none"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="m / cm" className="text-blue-600">meters / centimeters (m / cm)</option>
                    <option value="ft / in" className="text-blue-600">feet / inches (ft / in)</option>
                    <option value="mm" className="text-blue-600">millimeters (mm)</option>
                    <option value="cm" className="text-blue-600">centimeters (cm)</option>
                    <option value="m" className="text-blue-600">meters (m)</option>
                    <option value="km" className="text-blue-600">kilometers (km)</option>
                    <option value="in" className="text-blue-600">inches (in)</option>
                    <option value="ft" className="text-blue-600">feet (ft)</option>
                    <option value="yd" className="text-blue-600">yards (yd)</option>
                    <option value="mi" className="text-blue-600">miles (mi)</option>
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
                  onChange={(e) => handleRegularUnitChange('height', e.target.value)}
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
                      handleHeightUnitChange(heightUnit, newUnit);
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
                    handleOtherUnitChange(volumeValue, volumeUnit, newUnit, setVolumeValue, convertVolume);
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
                  <option value="L" className="text-blue-600">liters (L)</option>
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
                    handleOtherUnitChange(gallonsPerSqFtValue, gallonsPerSqFtUnit, newUnit, setGallonsPerSqFtValue, convertVolume);
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
        
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
             
             
            </div>
            <button
              onClick={clearAllChanges}
              className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear all changes
            </button>
          </div>

         
        </div>
      </div>
    </div>
   
  );
}
