'use client';

import { useState, useEffect } from 'react';
import { convertLength, convertVolume, convertToComposite, convertFromComposite, convertBetweenComposites, formatNumber } from '@/lib/conversions';

export default function LumberCalculator() {
  // Input dimensions for a single piece
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  
  // For composite unit fields (feet/inches and meters/centimeters)
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    length: { whole: '', fraction: '' },
    width: { whole: '', fraction: '' },
    thickness: { whole: '', fraction: '' },
  });
  
  // Units
  const [lengthUnit, setLengthUnit] = useState<string>('m');
  const [widthUnit, setWidthUnit] = useState<string>('m');
  const [thicknessUnit, setThicknessUnit] = useState<string>('m');
  const [volumeUnit, setVolumeUnit] = useState<string>('m³');
  const [totalLengthUnit, setTotalLengthUnit] = useState<string>('m');
  
  // Calculated values
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [totalLength, setTotalLength] = useState<number>(0);
  
  // Price fields
  const [pricePerPiece, setPricePerPiece] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('PKR');
  
  // Validation errors
  const [errors, setErrors] = useState<{
    length: string;
    width: string;
    thickness: string;
    quantity: string;
    pricePerPiece: string;
  }>({
    length: '',
    width: '',
    thickness: '',
    quantity: '',
    pricePerPiece: ''
  });

  const lengthUnitOptions = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'km', label: 'kilometers (km)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  const volumeUnitOptions = [
    { value: 'mm³', label: 'cubic millimeters (mm³)' },
    { value: 'cm³', label: 'cubic centimeters (cm³)' },
    { value: 'dm³', label: 'cubic decimeters (dm³)' },
    { value: 'm³', label: 'cubic meters (m³)' },
    { value: 'L', label: 'liters (L)' }
  ];

  // Validate input fields
  const validateInput = (field: string, value: string) => {
    if (value === '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid number' }));
      return false;
    }

    if (numValue < 0) {
      setErrors(prev => ({ ...prev, [field]: 'Value cannot be negative' }));
      return false;
    }

    if (field === 'quantity' && numValue % 1 !== 0) {
      setErrors(prev => ({ ...prev, [field]: 'Quantity must be a whole number' }));
      return false;
    }

    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    validateInput(field, value);
    
    switch (field) {
      case 'length':
        setLength(value);
        break;
      case 'width':
        setWidth(value);
        break;
      case 'thickness':
        setThickness(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'pricePerPiece':
        setPricePerPiece(value);
        break;
    }
  };

  // Handle unit conversions
  const handleUnitChange = (field: string, oldUnit: string, newUnit: string) => {
    // Don't do anything if units are the same
    if (oldUnit === newUnit) return;

    // Update the unit first
    switch (field) {
      case 'length':
        setLengthUnit(newUnit);
        break;
      case 'width':
        setWidthUnit(newUnit);
        break;
      case 'thickness':
        setThicknessUnit(newUnit);
        break;
    }

    // Clear any errors
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Check if we have any value to convert
    const currentValue = field === 'length' ? length : 
                        field === 'width' ? width : thickness;
    const hasRegularValue = currentValue && !isNaN(parseFloat(currentValue));
    const hasCompositeValue = (compositeUnits[field]?.whole && !isNaN(parseFloat(compositeUnits[field].whole))) || 
                             (compositeUnits[field]?.fraction && !isNaN(parseFloat(compositeUnits[field].fraction)));

    // If no value exists, just return (unit is already updated)
    if (!hasRegularValue && !hasCompositeValue) {
      return;
    }

    try {
      // Case 1: Converting FROM single unit TO composite unit
      if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(currentValue);
        const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const result = convertToComposite(value, oldUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
        
        // Clear the regular field
        if (field === 'length') setLength('');
        else if (field === 'width') setWidth('');
        else setThickness('');
      }
      
      // Case 2: Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const result = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(result, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'length') setLength(formattedValue);
        else if (field === 'width') setWidth(formattedValue);
        else setThickness(formattedValue);
        
        // Clear composite values
        setCompositeUnits(prev => ({
          ...prev,
          [field]: { whole: '', fraction: '' }
        }));
      }
      
      // Case 3: Converting BETWEEN composite units
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit === 'ft/in' || newUnit === 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
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
      else if ((oldUnit !== 'ft/in' && oldUnit !== 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasRegularValue) return;
        
        const value = parseFloat(currentValue);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'length') setLength(formattedValue);
        else if (field === 'width') setWidth(formattedValue);
        else setThickness(formattedValue);
      }
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  // Handle volume unit conversion
  const handleVolumeUnitChange = (newUnit: string) => {
    if (volumeUnit === newUnit) return;
    
    if (totalVolume > 0) {
      try {
        const convertedVolume = convertVolume(totalVolume, volumeUnit, newUnit);
        setTotalVolume(convertedVolume);
      } catch (error) {
        console.error('Volume conversion error:', error);
      }
    }
    setVolumeUnit(newUnit);
  };

  // Handle total length unit conversion
  const handleTotalLengthUnitChange = (newUnit: string) => {
    if (totalLengthUnit === newUnit) return;

    try {
      if (totalLength > 0) {
        // If switching TO composite m/cm, store numeric value in meters for consistent display
        if (newUnit === 'm/cm') {
          const valueInMeters = totalLengthUnit === 'm/cm'
            ? totalLength // already in meters when using m/cm mode
            : convertLength(totalLength, totalLengthUnit, 'm');
          setTotalLength(valueInMeters);
        }
        // If switching FROM composite m/cm to a single unit, treat stored value as meters
        else if (totalLengthUnit === 'm/cm') {
          const converted = convertLength(totalLength, 'm', newUnit);
          setTotalLength(converted);
        }
        // Single unit to single unit
        else {
          const convertedLength = convertLength(totalLength, totalLengthUnit, newUnit);
          setTotalLength(convertedLength);
        }
      }
    } catch (error) {
      console.error('Length conversion error:', error);
    }

    setTotalLengthUnit(newUnit);
  };

  // Calculate volume and total length
  useEffect(() => {
    const quantityValue = parseFloat(quantity);

    // Helper function to get dimension value in meters
    const getDimensionInMeters = (field: string, unit: string) => {
      if (unit === 'ft/in' || unit === 'm/cm') {
        // Composite unit
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        
        if ((whole === 0 && fraction === 0) || (isNaN(whole) && isNaN(fraction))) {
          return 0;
        }
        
        const sourceCompositeUnit = unit === 'ft/in' ? 'ft / in' : 'm / cm';
        return convertFromComposite(whole || 0, fraction || 0, sourceCompositeUnit, 'm');
      } else {
        // Single unit
        const value = field === 'length' ? parseFloat(length) : 
                     field === 'width' ? parseFloat(width) : parseFloat(thickness);
        
        if (isNaN(value) || value <= 0) return 0;
        return convertLength(value, unit, 'm');
      }
    };

    const lengthInMeters = getDimensionInMeters('length', lengthUnit);
    const widthInMeters = getDimensionInMeters('width', widthUnit);
    const thicknessInMeters = getDimensionInMeters('thickness', thicknessUnit);

    if (lengthInMeters > 0 && widthInMeters > 0 && thicknessInMeters > 0 && 
        !isNaN(quantityValue) && quantityValue > 0) {
      
      // Calculate volume of one piece in cubic meters
      const volumeOfOnePiece = lengthInMeters * widthInMeters * thicknessInMeters;
      
      // Calculate total volume in cubic meters
      const totalVolumeInCubicMeters = volumeOfOnePiece * quantityValue;
      
      // Convert to desired volume unit
      const volumeInDesiredUnit = convertVolume(totalVolumeInCubicMeters, 'm³', volumeUnit);
      setTotalVolume(volumeInDesiredUnit);

      // Calculate total length
      const totalLengthInMeters = lengthInMeters * quantityValue;
      if (totalLengthUnit === 'm/cm') {
        // Keep stored numeric as meters in composite mode
        setTotalLength(totalLengthInMeters);
      } else {
        const totalLengthInDesiredUnit = convertLength(totalLengthInMeters, 'm', totalLengthUnit);
        setTotalLength(totalLengthInDesiredUnit);
      }
    } else {
      setTotalVolume(0);
      setTotalLength(0);
    }
  }, [length, width, thickness, quantity, lengthUnit, widthUnit, thicknessUnit, volumeUnit, totalLengthUnit, compositeUnits]);

  // Calculate total price
  useEffect(() => {
    const priceValue = parseFloat(pricePerPiece);
    const quantityValue = parseFloat(quantity);

    if (!isNaN(priceValue) && !isNaN(quantityValue) && priceValue > 0 && quantityValue > 0) {
      setTotalPrice(priceValue * quantityValue);
    } else {
      setTotalPrice(0);
    }
  }, [pricePerPiece, quantity]);

  const renderInputField = (
    field: string,
    label: string,
    value: string,
    placeholder: string,
    unit: string,
    unitOptions: { value: string; label: string }[],
    onChange: (value: string) => void,
    onUnitChange: (oldUnit: string, newUnit: string) => void,
    readOnly: boolean = false
  ) => {
    const isCompositeUnit = unit === 'ft/in' || unit === 'm/cm';
    const wholeLabel = unit === 'ft/in' ? 'feet' : 'meters';
    const fractionLabel = unit === 'ft/in' ? 'inches' : 'centimeters';

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        
        {isCompositeUnit ? (
          // Composite unit input (feet/inches or meters/centimeters)
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={`Enter ${wholeLabel}`}
                  value={compositeUnits[field]?.whole || ''}
                  onChange={(e) => {
                    setCompositeUnits(prev => ({
                      ...prev,
                      [field]: { ...prev[field], whole: e.target.value }
                    }));
                  }}
                  className={`w-full px-3 py-2 border ${errors[field as keyof typeof errors] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
                  style={{ color: '#1e293b', backgroundColor: readOnly ? '#f9fafb' : '#ffffff' }}
                  step="1"
                  min="0"
                  readOnly={readOnly}
                />
                <div className="text-xs text-slate-500 mt-1 text-center">{wholeLabel}</div>
              </div>
              
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={`Enter ${fractionLabel}`}
                  value={compositeUnits[field]?.fraction || ''}
                  onChange={(e) => {
                    setCompositeUnits(prev => ({
                      ...prev,
                      [field]: { ...prev[field], fraction: e.target.value }
                    }));
                  }}
                  className={`w-full px-3 py-2 border ${errors[field as keyof typeof errors] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
                  style={{ color: '#1e293b', backgroundColor: readOnly ? '#f9fafb' : '#ffffff' }}
                  step="any"
                  min="0"
                  readOnly={readOnly}
                />
                <div className="text-xs text-slate-500 mt-1 text-center">{fractionLabel}</div>
              </div>
              
              <select
                value={unit}
                onChange={(e) => onUnitChange(unit, e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          // Single unit input
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 border ${errors[field as keyof typeof errors] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
                style={{ color: '#1e293b', backgroundColor: readOnly ? '#f9fafb' : '#ffffff' }}
                step="any"
                min="0"
                readOnly={readOnly}
              />
            </div>
            
            <select
              value={unit}
              onChange={(e) => onUnitChange(unit, e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {errors[field as keyof typeof errors] && (
          <p className="text-red-500 text-xs mt-1">{errors[field as keyof typeof errors]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Lumber Calculator 
          <span className="ml-3 text-2xl">🪵</span>
        </h1>
      
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Input Fields */}
        <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Lumber Dimensions</h2>
          
          <div className="space-y-6 mb-6">
            {renderInputField(
              'length',
              'Length of a single piece',
              length,
              'Enter length',
              lengthUnit,
              lengthUnitOptions,
              (value) => handleInputChange('length', value),
              (oldUnit, newUnit) => handleUnitChange('length', oldUnit, newUnit)
            )}
            
            {renderInputField(
              'width',
              'Width of a single piece',
              width,
              'Enter width',
              widthUnit,
              lengthUnitOptions,
              (value) => handleInputChange('width', value),
              (oldUnit, newUnit) => handleUnitChange('width', oldUnit, newUnit)
            )}
            
            {renderInputField(
              'thickness',
              'Thickness of a single piece',
              thickness,
              'Enter thickness',
              thicknessUnit,
              lengthUnitOptions,
              (value) => handleInputChange('thickness', value),
              (oldUnit, newUnit) => handleUnitChange('thickness', oldUnit, newUnit)
            )}
            
            {renderInputField(
              'quantity',
              'Number of pieces',
              quantity,
              'Enter quantity',
              'pieces',
              [{ value: 'pieces', label: 'pieces' }],
              (value) => handleInputChange('quantity', value),
              () => {} // No unit change for quantity
            )}
          </div>

          {/* Results Section - moved inside Lumber Dimensions */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Results</h3>
            
            {/* Total volume */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total volume of your lumber
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={totalVolume > 0 ? formatNumber(totalVolume, { maximumFractionDigits: 4 }) : ''}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                    placeholder="Total volume will be calculated"
                    readOnly
                    style={{ color: '#1e293b', backgroundColor: '#f9fafb' }}
                  />
                </div>
                <select
                  value={volumeUnit}
                  onChange={(e) => handleVolumeUnitChange(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  {volumeUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total length */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total length of your lumber
              </label>
              {totalLengthUnit === 'm/cm' ? (
                // Split, read-only composite display for meters/centimeters
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={(function () {
                        if (!(totalLength > 0)) return '';
                        try {
                          const comp = convertToComposite(totalLength, 'm', 'm / cm');
                          return Math.floor(comp.whole).toString();
                        } catch {
                          return '';
                        }
                      })()}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                      placeholder="meters"
                      readOnly
                      style={{ color: '#1e293b', backgroundColor: '#f9fafb' }}
                    />
                    <div className="text-xs text-slate-500 mt-1 text-center">meters</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={(function () {
                        if (!(totalLength > 0)) return '';
                        try {
                          const comp = convertToComposite(totalLength, 'm', 'm / cm');
                          return formatNumber(comp.fraction, { maximumFractionDigits: 2, useCommas: false });
                        } catch {
                          return '';
                        }
                      })()}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                      placeholder="centimeters"
                      readOnly
                      style={{ color: '#1e293b', backgroundColor: '#f9fafb' }}
                    />
                    <div className="text-xs text-slate-500 mt-1 text-center">centimeters</div>
                  </div>
                  <select
                    value={totalLengthUnit}
                    onChange={(e) => handleTotalLengthUnitChange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    {lengthUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={totalLength > 0 ? formatNumber(totalLength, { maximumFractionDigits: 4 }) : ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                      placeholder="Total length will be calculated"
                      readOnly
                      style={{ color: '#1e293b', backgroundColor: '#f9fafb' }}
                    />
                  </div>
                  <select
                    value={totalLengthUnit}
                    onChange={(e) => handleTotalLengthUnitChange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    {lengthUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">💰 Price</h2>
          
          <div className="space-y-6">
            {/* Price of one piece */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price of one piece
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-slate-300 rounded-l-lg bg-gray-50 text-slate-500 text-sm">
                  {currency}
                </span>
                <input
                  type="number"
                  value={pricePerPiece}
                  onChange={(e) => handleInputChange('pricePerPiece', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pricePerPiece ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter price per piece"
                  step="any"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
              </div>
              {errors.pricePerPiece && <p className="text-red-500 text-xs mt-1">{errors.pricePerPiece}</p>}
            </div>

            {/* Total price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total price of your lumber
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-slate-300 rounded-l-lg bg-gray-50 text-slate-500 text-sm">
                  {currency}
                </span>
                <input
                  type="text"
                  value={totalPrice > 0 ? formatNumber(totalPrice, { maximumFractionDigits: 2 }) : ''}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg bg-gray-50"
                  placeholder="Total price will be calculated"
                  readOnly
                  style={{ color: '#1e293b', backgroundColor: '#f9fafb' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {(totalVolume > 0 || totalLength > 0 || totalPrice > 0) && (
          <div className="w-full max-w-2xl bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {totalVolume > 0 && (
                <div className="text-center">
                  <p className="text-blue-600 font-medium">Total Volume</p>
                  <p className="text-xl font-bold text-blue-800">
                    {formatNumber(totalVolume, { maximumFractionDigits: 4 })} {volumeUnit}
                  </p>
                </div>
              )}
              {totalLength > 0 && (
                <div className="text-center">
                  <p className="text-blue-600 font-medium">Total Length</p>
                  <p className="text-xl font-bold text-blue-800">
                    {(function () {
                      if (totalLengthUnit === 'm/cm') {
                        try {
                          const comp = convertToComposite(totalLength, 'm', 'm / cm');
                          const m = Math.floor(comp.whole);
                          const cm = formatNumber(comp.fraction, { maximumFractionDigits: 2, useCommas: false });
                          return `${m} m ${cm} cm`;
                        } catch {
                          return '';
                        }
                      }
                      return `${formatNumber(totalLength, { maximumFractionDigits: 4 })} ${totalLengthUnit}`;
                    })()}
                  </p>
                </div>
              )}
              {totalPrice > 0 && (
                <div className="text-center">
                  <p className="text-blue-600 font-medium">Total Cost</p>
                  <p className="text-xl font-bold text-blue-800">
                    {currency} {formatNumber(totalPrice, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
