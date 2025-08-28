'use client';

import { useState, useEffect } from 'react';
import { convertLength, convertToComposite, convertFromComposite, convertBetweenComposites, formatNumber } from '@/lib/conversions';

export default function SAGCalculator() {
  const [radiusOfCurvature, setRadiusOfCurvature] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('');
  const [sag, setSag] = useState<string>('');
  
  // For composite unit fields (feet/inches and meters/centimeters)
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    radiusOfCurvature: { whole: '', fraction: '' },
    diameter: { whole: '', fraction: '' },
    sag: { whole: '', fraction: '' },
  });

  const [units, setUnits] = useState<{ [key: string]: string }>({
    radiusOfCurvature: 'm',
    diameter: 'm',
    sag: 'm'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    radiusOfCurvature: '',
    diameter: '',
    sag: ''
  });

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

  // Handle unit conversions
  const handleUnitChange = (
    field: string,
    oldUnit: string,
    newUnit: string
  ) => {
    // Don't do anything if units are the same
    if (oldUnit === newUnit) return;

    // Update the unit first
    setUnits(prev => ({ ...prev, [field]: newUnit }));

    // Clear any errors
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Check if we have any value to convert
    const hasRegularValue = (field === 'radiusOfCurvature' ? radiusOfCurvature : 
                           field === 'diameter' ? diameter : sag) && 
                           !isNaN(parseFloat(field === 'radiusOfCurvature' ? radiusOfCurvature : 
                                           field === 'diameter' ? diameter : sag));
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
        
        const value = parseFloat(field === 'radiusOfCurvature' ? radiusOfCurvature : 
                               field === 'diameter' ? diameter : sag);
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
        if (field === 'radiusOfCurvature') setRadiusOfCurvature('');
        else if (field === 'diameter') setDiameter('');
        else setSag('');
      }
      
      // Case 2: Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'radiusOfCurvature') setRadiusOfCurvature(formattedValue);
        else if (field === 'diameter') setDiameter(formattedValue);
        else setSag(formattedValue);
        
        // Clear composite units
        setCompositeUnits(prev => ({
          ...prev,
          [field]: { whole: '', fraction: '' }
        }));
      }
      
      // Case 3: Converting BETWEEN composite units (ft/in ↔ m/cm)
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
        
        const value = parseFloat(field === 'radiusOfCurvature' ? radiusOfCurvature : 
                               field === 'diameter' ? diameter : sag);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        if (field === 'radiusOfCurvature') setRadiusOfCurvature(formattedValue);
        else if (field === 'diameter') setDiameter(formattedValue);
        else setSag(formattedValue);
      }

    } catch (error) {
      console.error('Conversion error:', error);
      // Reset to original unit on error
      setUnits(prev => ({ ...prev, [field]: oldUnit }));
    }
  };

  // Calculate SAG based on radius of curvature and diameter
  const calculateSAG = () => {
    // Convert values to meters for calculation
    let radiusInMeters = 0;
    let diameterInMeters = 0;

    try {
      // Convert radius of curvature to meters
      if (units.radiusOfCurvature === 'ft/in' || units.radiusOfCurvature === 'm/cm') {
        const wholeValue = parseFloat(compositeUnits.radiusOfCurvature.whole || '0');
        const fractionValue = parseFloat(compositeUnits.radiusOfCurvature.fraction || '0');
        const sourceCompositeUnit = units.radiusOfCurvature === 'ft/in' ? 'ft / in' : 'm / cm';
        radiusInMeters = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'm');
      } else {
        const radiusValue = parseFloat(radiusOfCurvature);
        if (!isNaN(radiusValue)) {
          radiusInMeters = convertLength(radiusValue, units.radiusOfCurvature, 'm');
        }
      }

      // Convert diameter to meters
      if (units.diameter === 'ft/in' || units.diameter === 'm/cm') {
        const wholeValue = parseFloat(compositeUnits.diameter.whole || '0');
        const fractionValue = parseFloat(compositeUnits.diameter.fraction || '0');
        const sourceCompositeUnit = units.diameter === 'ft/in' ? 'ft / in' : 'm / cm';
        diameterInMeters = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'm');
      } else {
        const diameterValue = parseFloat(diameter);
        if (!isNaN(diameterValue)) {
          diameterInMeters = convertLength(diameterValue, units.diameter, 'm');
        }
      }

      // Calculate SAG using the formula: SAG = R - sqrt(R² - (D/2)²)
      // Where R is radius of curvature and D is diameter
      if (radiusInMeters > 0 && diameterInMeters > 0) {
        const halfDiameter = diameterInMeters / 2;
        
        // Check if calculation is possible (radius must be greater than half diameter)
        if (radiusInMeters <= halfDiameter) {
          setErrors(prev => ({
            ...prev,
            radiusOfCurvature: 'Radius of curvature must be greater than half the diameter'
          }));
          return;
        }

        const sagInMeters = radiusInMeters - Math.sqrt(Math.pow(radiusInMeters, 2) - Math.pow(halfDiameter, 2));

        // Convert SAG result to the selected unit
        let sagResult;
        if (units.sag === 'ft/in' || units.sag === 'm/cm') {
          const targetCompositeUnit = units.sag === 'ft/in' ? 'ft / in' : 'm / cm';
          const result = convertToComposite(sagInMeters, 'm', targetCompositeUnit);
          
          setCompositeUnits(prev => ({
            ...prev,
            sag: {
              whole: Math.floor(result.whole).toString(),
              fraction: formatNumber(result.fraction, { maximumFractionDigits: 6, useCommas: false })
            }
          }));
          setSag('');
        } else {
          sagResult = convertLength(sagInMeters, 'm', units.sag);
          const formattedSag = formatNumber(sagResult, { maximumFractionDigits: 6, useCommas: false });
          setSag(formattedSag);
          setCompositeUnits(prev => ({
            ...prev,
            sag: { whole: '', fraction: '' }
          }));
        }

        // Clear any previous errors
        setErrors(prev => ({
          ...prev,
          radiusOfCurvature: '',
          diameter: ''
        }));
      }
    } catch (error) {
      console.error('SAG calculation error:', error);
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateSAG();
  }, [radiusOfCurvature, diameter, compositeUnits.radiusOfCurvature, compositeUnits.diameter, units.radiusOfCurvature, units.diameter, units.sag]);

  const handleInputChange = (field: string, value: string) => {
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    if (field === 'radiusOfCurvature') setRadiusOfCurvature(value);
    else if (field === 'diameter') setDiameter(value);
    else setSag(value);
  };

  const handleCompositeInputChange = (field: string, type: 'whole' | 'fraction', value: string) => {
    setCompositeUnits(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }));
    
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const renderInputField = (
    field: string,
    label: string,
    value: string,
    placeholder: string,
    unit: string,
    onChange: (value: string) => void
  ) => {
    const isComposite = unit === 'ft/in' || unit === 'm/cm';
    const wholeLabel = unit === 'ft/in' ? 'ft' : 'm';
    const fractionLabel = unit === 'ft/in' ? 'in' : 'cm';

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        <div className="flex gap-2">
          {/* Input fields */}
          {isComposite ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="number"
                  placeholder={`0 ${wholeLabel}`}
                  value={compositeUnits[field]?.whole || ''}
                  onChange={(e) => handleCompositeInputChange(field, 'whole', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="1"
                  min="0"
                />
                <span className="text-xs text-slate-500">{wholeLabel}</span>
              </div>
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="number"
                  placeholder={`0 ${fractionLabel}`}
                  value={compositeUnits[field]?.fraction || ''}
                  onChange={(e) => handleCompositeInputChange(field, 'fraction', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  step="0.01"
                  min="0"
                />
                <span className="text-xs text-slate-500">{fractionLabel}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <input
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                step="0.000001"
                min="0"
              />
            </div>
          )}
          
          {/* Unit selector */}
          <select
            value={unit}
            onChange={(e) => handleUnitChange(field, unit, e.target.value)}
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
        
        {errors[field] && (
          <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          SAG Calculator 
          <span className="ml-3 text-2xl">📏</span>
        </h1>
      </div>

      {/* Calculator Form */}
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
        
        {/* SAG Diagram */}
        <div className="mb-6">
          <div className="w-full h-48 bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg flex items-center justify-center relative overflow-hidden">
            <img 
              src="/sag-removebg-preview.png" 
              alt="SAG (Sagitta) Diagram showing radius of curvature, diameter, and sag measurement" 
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-6">
          {renderInputField(
            'radiusOfCurvature',
            'Radius of curvature',
            radiusOfCurvature,
            'Enter radius of curvature',
            units.radiusOfCurvature,
            (value) => handleInputChange('radiusOfCurvature', value)
          )}
          
          {renderInputField(
            'diameter',
            'Diameter',
            diameter,
            'Enter diameter',
            units.diameter,
            (value) => handleInputChange('diameter', value)
          )}
          
          {renderInputField(
            'sag',
            'SAG (sagitta)',
            sag,
            'Calculated SAG value',
            units.sag,
            (value) => handleInputChange('sag', value)
          )}
        </div>

        {/* Results */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Result</h3>
          <div className="space-y-2">
            {sag || (compositeUnits.sag.whole || compositeUnits.sag.fraction) ? (
              <div className="text-xl font-bold text-blue-800">
                SAG = {units.sag === 'ft/in' || units.sag === 'm/cm' ? 
                  `${compositeUnits.sag.whole || '0'} ${units.sag === 'ft/in' ? 'ft' : 'm'} ${compositeUnits.sag.fraction || '0'} ${units.sag === 'ft/in' ? 'in' : 'cm'}` :
                  `${sag} ${units.sag}`
                }
              </div>
            ) : (
              <p className="text-slate-600">Enter radius of curvature and diameter to calculate SAG</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
