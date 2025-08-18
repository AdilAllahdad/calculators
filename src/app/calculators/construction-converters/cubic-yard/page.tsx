'use client';

import { useState, useEffect } from 'react';
import { convertLength, convertToComposite, convertFromComposite, convertBetweenComposites, convertVolume, formatNumber } from '@/lib/conversions';
import { convertArea } from '@/lib/conversions/area';

export default function CubicYardCalculator() {
  const [shape, setShape] = useState<string>('Cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({
    length: '',
    width: '',
    height: '',
    depth: '',
    radius: '',
    diameter: ''
  });
  const [dimensionErrors, setDimensionErrors] = useState<{ [key: string]: string }>({
    length: '',
    width: '',
    height: '',
    depth: '',
    radius: '',
    diameter: ''
  });
  // Store converted values for display
  const [volumeInCubicYards, setVolumeInCubicYards] = useState<number>(0);
  
  // For composite unit fields (feet/inches and meters/centimeters)
  const [compositeUnits, setCompositeUnits] = useState<{
    [key: string]: { whole: string; fraction: string }
  }>({
    length: { whole: '', fraction: '' },
    width: { whole: '', fraction: '' },
    height: { whole: '', fraction: '' },
    depth: { whole: '', fraction: '' },
    radius: { whole: '', fraction: '' },
    diameter: { whole: '', fraction: '' },
  });
  const [units, setUnits] = useState<{ [key: string]: string }>({
    length: 'ft²',
    width: 'ft',
    height: 'ft',
    depth: 'ft',
    radius: 'ft',
    diameter: 'ft'
  });
  
  const [volume, setVolume] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<string>('cu yd');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState<string>('cu yd');
  const [currency, setCurrency] = useState<string>('PKR');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Store base price (price per cubic yard) for unit conversions
  const [pricePerCubicYard, setPricePerCubicYard] = useState<number>(0);

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
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
  ];

  const areaUnitOptions = [
    { value: 'cm²', label: 'square centimeters (cm²)' },
    { value: 'dm²', label: 'square decimeters (dm²)' },
    { value: 'm²', label: 'square meters (m²)' },
    { value: 'in²', label: 'square inches (in²)' },
    { value: 'ft²', label: 'square feet (ft²)' },
    { value: 'yd²', label: 'square yards (yd²)' },
    { value: 'a', label: 'ares (a)' },
    { value: 'da', label: 'decares (da)' },
    { value: 'ha', label: 'hectares (ha)' },
    { value: 'ac', label: 'acres (ac)' }
  ];

  // Handle unit conversions using ONLY the conversion utility functions from conversion folder
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
    setDimensionErrors(prev => ({ ...prev, [field]: '' }));

    // Special handling for pyramid and other shape area field (length field when shape is pyramid or other shape)
    if ((shape === 'Pyramid' || shape === 'Other shape') && field === 'length') {
      // Handle area unit conversion
      const hasValue = dimensions[field] && !isNaN(parseFloat(dimensions[field]));
      if (hasValue) {
        try {
          const value = parseFloat(dimensions[field]);
          // Convert area from old unit to new unit using the proper area conversion function
          const convertedValue = convertArea(value, oldUnit, newUnit);
          const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
          
          setDimensions(prev => ({ ...prev, [field]: formattedValue }));
        } catch (error) {
          console.error('Area conversion error:', error);
          // Reset to original unit on error
          setUnits(prev => ({ ...prev, [field]: oldUnit }));
        }
      }
      return;
    }

    // Check if we have any value to convert (for non-pyramid area fields)
    const hasRegularValue = dimensions[field] && !isNaN(parseFloat(dimensions[field]));
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
        
        const value = parseFloat(dimensions[field]);
        const targetCompositeUnit = newUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const result = convertToComposite(value, oldUnit, targetCompositeUnit);
        
        setCompositeUnits(prev => ({
          ...prev,
          [field]: {
            whole: Math.floor(result.whole).toString(),
            fraction: formatNumber(result.fraction, { maximumFractionDigits: 2, useCommas: false })
          }
        }));
        
        // Clear the regular dimension field
        setDimensions(prev => ({ ...prev, [field]: '' }));
      }
      
      // Case 2: Converting FROM composite unit TO single unit
      else if ((oldUnit === 'ft/in' || oldUnit === 'm/cm') && (newUnit !== 'ft/in' && newUnit !== 'm/cm')) {
        if (!hasCompositeValue) return;
        
        const whole = parseFloat(compositeUnits[field]?.whole || '0');
        const fraction = parseFloat(compositeUnits[field]?.fraction || '0');
        const sourceCompositeUnit = oldUnit === 'ft/in' ? 'ft / in' : 'm / cm';
        
        const convertedValue = convertFromComposite(whole, fraction, sourceCompositeUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setDimensions(prev => ({ ...prev, [field]: formattedValue }));
        
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
        
        const value = parseFloat(dimensions[field]);
        const convertedValue = convertLength(value, oldUnit, newUnit);
        const formattedValue = formatNumber(convertedValue, { maximumFractionDigits: 4, useCommas: false });
        
        setDimensions(prev => ({ ...prev, [field]: formattedValue }));
      }

    } catch (error) {
      console.error('Conversion error:', error);
      // Reset to original unit on error
      setUnits(prev => ({ ...prev, [field]: oldUnit }));
    }

    // CUBE SHAPE SPECIFIC: Only sync units for internal calculations, don't affect other visible fields
    if (shape === 'Cube' && field === 'length') {
      // Update hidden dimension units for volume calculation only
      setUnits(prev => ({
        ...prev,
        width: newUnit,
        height: newUnit
      }));
      
      // Sync values for calculation purposes only (these are not visible to user)
      if (newUnit === 'ft/in' || newUnit === 'm/cm') {
        // Copy composite values to hidden dimensions
        const wholePart = compositeUnits[field]?.whole || '';
        const fractionPart = compositeUnits[field]?.fraction || '';
        
        setCompositeUnits(prev => ({
          ...prev,
          width: { whole: wholePart, fraction: fractionPart },
          height: { whole: wholePart, fraction: fractionPart }
        }));
      } else {
        // Copy regular values to hidden dimensions
        const value = dimensions[field] || '';
        setDimensions(prev => ({
          ...prev,
          width: value,
          height: value
        }));
      }
    }
  };

  // Validation function for hollow shapes dimensions
  const validateHollowShapeDimensions = (
    field: string,
    value: string,
    currentUnits: { [key: string]: string },
    currentDimensions: { [key: string]: string },
    currentCompositeUnits: { [key: string]: { whole: string; fraction: string } }
  ) => {
    if (shape !== 'Hollow cuboid / Rectangular tube' && shape !== 'Hollow cylinder') return '';
    
    // Create a temporary dimensions object with the new value
    const tempDimensions = { ...currentDimensions, [field]: value };
    const tempUnits = { ...currentUnits };
    const tempCompositeUnits = { ...currentCompositeUnits };
    
    // Convert all dimensions to feet for comparison
    const convertedDims: { [key: string]: number } = {};
    
    const fieldsToConvert = shape === 'Hollow cylinder' ? ['radius', 'diameter', 'height'] : ['length', 'width', 'depth'];
    
    fieldsToConvert.forEach(key => {
      if (tempUnits[key] === 'ft/in' || tempUnits[key] === 'm/cm') {
        const wholeValue = parseFloat(tempCompositeUnits[key]?.whole || '0');
        const fractionValue = parseFloat(tempCompositeUnits[key]?.fraction || '0');
        const sourceCompositeUnit = tempUnits[key] === 'ft/in' ? 'ft / in' : 'm / cm';
        convertedDims[key] = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'ft');
      } else {
        const numValue = tempDimensions[key] ? parseFloat(tempDimensions[key]) : 0;
        if (!isNaN(numValue)) {
          convertedDims[key] = convertLength(numValue, tempUnits[key], 'ft');
        } else {
          convertedDims[key] = 0;
        }
      }
    });
    
    if (shape === 'Hollow cuboid / Rectangular tube') {
      const { length, width, depth } = convertedDims;
      
      // Validate based on the field being changed
      if (field === 'length') {
        if (length > 0 && depth > 0 && length < 2 * depth) {
          return 'Length should be equal to or greater than twice the border width';
        }
        if (length > 0 && depth > 0 && depth > length / 2) {
          return 'Border width can\'t be greater than the half of the length';
        }
      }
      
      if (field === 'width') {
        if (width > 0 && depth > 0 && width < 2 * depth) {
          return 'Width should be equal to or greater than twice the border width';
        }
        if (width > 0 && depth > 0 && depth > width / 2) {
          return 'Border width can\'t be greater than the half of the width';
        }
      }
      
      if (field === 'depth') {
        if (depth > 0 && length > 0 && depth > length / 2) {
          return 'Border width can\'t be greater than the half of the length';
        }
        if (depth > 0 && width > 0 && depth > width / 2) {
          return 'Border width can\'t be greater than the half of the width';
        }
      }
    } else if (shape === 'Hollow cylinder') {
      const { radius, diameter, height } = convertedDims;
      const outerRadius = radius;  // radius field is outer radius
      const innerRadius = diameter;  // diameter field is inner radius
      
      // Validate based on the field being changed
      if (field === 'radius' && outerRadius > 0 && innerRadius > 0 && outerRadius <= innerRadius) {
        return 'Outer radius must be greater than inner radius';
      }
      
      if (field === 'diameter' && innerRadius > 0 && outerRadius > 0 && innerRadius >= outerRadius) {
        return 'Inner radius cannot be greater than outer radius';
      }
    }
    
    return '';
  };

  // Helper function to convert area to square feet
  const convertAreaToSquareFeet = (area: number, fromUnit: string): number => {
    // Use the convertArea function from area.ts to convert to ft²
    return convertArea(area, fromUnit, 'ft²');
  };

  // We're now using the convertVolume function instead of a local conversion object

  useEffect(() => {
    calculateVolume();
  }, [shape, dimensions, compositeUnits, units, volumeUnit]);

  // Separate effect for hollow shapes validation when shape changes
  useEffect(() => {
    if (shape === 'Hollow cuboid / Rectangular tube' || shape === 'Hollow cylinder') {
      // Validate all relevant fields when shape changes to hollow shapes
      const fieldsToValidate = shape === 'Hollow cylinder' ? ['radius', 'diameter', 'height'] : ['length', 'width', 'depth'];
      fieldsToValidate.forEach(field => {
        const validationError = validateHollowShapeDimensions(field, dimensions[field] || '', units, dimensions, compositeUnits);
        if (validationError) {
          setDimensionErrors(prev => ({
            ...prev,
            [field]: validationError
          }));
        }
      });
    }
  }, [shape, dimensions, compositeUnits, units]);

  // Separate effect for price calculations to prevent recalculations on price-related changes
  useEffect(() => {
    if (volumeInCubicYards > 0 && pricePerCubicYard > 0) {
      // Calculate total price based on volume in cubic yards and price per cubic yard
      setTotalPrice(volumeInCubicYards * pricePerCubicYard);
    }
  }, [volumeInCubicYards, pricePerCubicYard]);

  const calculateVolume = () => {
    let volumeInCubicFt = 0;

    // Convert all dimensions to feet using the conversion utilities
    const convertedDims = Object.keys(dimensions).reduce((acc, key) => {
      // Handle composite units first
      if (units[key] === 'ft/in' || units[key] === 'm/cm') {
        const wholeValue = parseFloat(compositeUnits[key].whole || '0');
        const fractionValue = parseFloat(compositeUnits[key].fraction || '0');
        
        // Map UI units to conversion utility format
        const sourceCompositeUnit = units[key] === 'ft/in' ? 'ft / in' : 'm / cm';
        
        // Use the proper conversion utility for composite to single unit
        const valueInFeet = convertFromComposite(wholeValue, fractionValue, sourceCompositeUnit, 'ft');
        acc[key] = valueInFeet;
      } else {
        // For regular single units
        const numValue = dimensions[key] ? parseFloat(dimensions[key]) : 0;
        if (!isNaN(numValue)) {
          // Convert to feet using the conversion utility
          const valueInFeet = convertLength(numValue, units[key], 'ft');
          acc[key] = valueInFeet;
        } else {
          acc[key] = 0;
        }
      }
      return acc;
    }, {} as { [key: string]: number });

    // Clear all dimension errors before validation
    setDimensionErrors({
      length: '',
      width: '',
      height: '',
      depth: '',
      radius: '',
      diameter: ''
    });

    // Validate dimensions for hollow shapes
    if (shape === 'Hollow cuboid / Rectangular tube') {
      const { length, width, depth } = convertedDims;
      let hasErrors = false;

      // Check if length is less than twice the border width
      if (length > 0 && depth > 0 && length < 2 * depth) {
        setDimensionErrors(prev => ({
          ...prev,
          length: 'Length should be equal to or greater than twice the border width'
        }));
        hasErrors = true;
      }

      // Check if width is less than twice the border width
      if (width > 0 && depth > 0 && width < 2 * depth) {
        setDimensionErrors(prev => ({
          ...prev,
          width: 'Width should be equal to or greater than twice the border width'
        }));
        hasErrors = true;
      }

      // Check if border width is greater than half of the length
      if (depth > 0 && length > 0 && depth > length / 2) {
        setDimensionErrors(prev => ({
          ...prev,
          depth: 'Border width can\'t be greater than the half of the length'
        }));
        hasErrors = true;
      }

      // Check if border width is greater than half of the width
      if (depth > 0 && width > 0 && depth > width / 2) {
        setDimensionErrors(prev => ({
          ...prev,
          depth: 'Border width can\'t be greater than the half of the width'
        }));
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }
    } else if (shape === 'Hollow cylinder') {
      const { radius, diameter, height } = convertedDims;
      const outerRadius = radius;  // radius field is outer radius
      const innerRadius = diameter;  // diameter field is inner radius
      let hasErrors = false;

      // Check if inner radius is greater than outer radius
      if (outerRadius > 0 && innerRadius > 0 && innerRadius >= outerRadius) {
        setDimensionErrors(prev => ({
          ...prev,
          radius: 'Outer radius must be greater than inner radius',
          diameter: 'Inner radius cannot be greater than outer radius'
        }));
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }
    }

    const { length, width, height, depth, radius, diameter } = convertedDims;

    switch (shape) {
      case 'Cube':
        // For cube, use the length value converted to feet for all dimensions
        // Make sure we have a valid length value
        if (length > 0) {
          volumeInCubicFt = Math.pow(length, 3);
        } else {
          volumeInCubicFt = 0;
        }
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
        const outerRadius = radius;  // radius field is now outer radius
        const innerRadius = diameter;  // diameter field is now inner radius
        if (outerRadius > 0 && innerRadius >= 0) {
          volumeInCubicFt = Math.PI * height * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
        } else {
          volumeInCubicFt = 0;
        }
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
        // For pyramid, 'length' field represents the area input in area units
        const areaValue = parseFloat(dimensions.length || '0');
        if (!isNaN(areaValue) && areaValue > 0) {
          const pyramidAreaInSqFt = convertAreaToSquareFeet(areaValue, units.length);
          volumeInCubicFt = (1/3) * pyramidAreaInSqFt * convertedDims.height;
        } else {
          volumeInCubicFt = 0;
        }
        break;
      case 'Other shape':
        // For other shape, 'length' field represents the area input in area units
        const otherAreaValue = parseFloat(dimensions.length || '0');
        if (!isNaN(otherAreaValue) && otherAreaValue > 0) {
          const otherAreaInSqFt = convertAreaToSquareFeet(otherAreaValue, units.length);
          volumeInCubicFt = otherAreaInSqFt * convertedDims.height; // Simple area × height calculation
        } else {
          volumeInCubicFt = 0;
        }
        break;
      default:
        volumeInCubicFt = 0;
    }

    // Convert to cubic yards (1 cubic yard = 27 cubic feet)
    const volumeInCubicYd = volumeInCubicFt / 27;
    
    // Save the cubic yard value for display in the conversions section
    setVolumeInCubicYards(volumeInCubicYd);
    
    // Convert to selected volume unit using the convertVolume function
    const finalVolume = convertVolume(volumeInCubicYd, 'cu yd', volumeUnit);
    
    // Set the calculated volume
    setVolume(finalVolume);
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
        return ['radius', 'diameter', 'height'];
      case 'Hemisphere':
        return ['radius'];
      case 'Cone':
        return ['radius', 'height'];
      case 'Pyramid':
        return ['length', 'height'];
      case 'Other shape':
        return ['length', 'height'];
      default:
        return [];
    }
  };

  const clearAll = () => {
    setShape('Cube');
    setDimensions({
      length: '',
      width: '',
      height: '',
      depth: '',
      radius: '',
      diameter: ''
    });
    setDimensionErrors({
      length: '',
      width: '',
      height: '',
      depth: '',
      radius: '',
      diameter: ''
    });
    
    // Reset composite units
    setCompositeUnits({
      length: { whole: '', fraction: '' },
      width: { whole: '', fraction: '' },
      height: { whole: '', fraction: '' },
      depth: { whole: '', fraction: '' },
      radius: { whole: '', fraction: '' },
      diameter: { whole: '', fraction: '' },
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
    setVolumeInCubicYards(0);
    setVolumeUnit('cu yd');
    setPricePerUnit('');
    setPriceError('');
    setPriceUnit('cu yd');
    setPricePerCubicYard(0);
    setTotalPrice(0);
  };

  const reloadCalculator = () => {
    clearAll();
  };

  const shareResult = () => {
    const result = `Volume: ${volume.toFixed(4)} ${volumeUnit}\nTotal Price: ${currency} ${totalPrice.toFixed(2)}`;
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
                onChange={(e) => {
                  const newShape = e.target.value;
                  setShape(newShape);
                  
                  // Clear any dimension errors when shape changes
                  setDimensionErrors({
                    length: '',
                    width: '',
                    height: '',
                    depth: '',
                    radius: '',
                    diameter: ''
                  });
                  
                  // Set appropriate units based on shape
                  if (newShape === 'Pyramid' || newShape === 'Other shape') {
                    setUnits(prev => ({ ...prev, length: 'ft²' })); // Area unit for pyramid and other shape
                  } else if (newShape === 'Cube') {
                    const lengthUnit = units.length === 'ft²' ? 'ft' : units.length; // Convert area unit back to linear
                    
                    // Synchronize all units to match the length unit
                    setUnits(prev => ({
                      ...prev,
                      length: lengthUnit,
                      width: lengthUnit,
                      height: lengthUnit
                    }));
                    
                    // If we have a length value, copy it to width and height
                    if (lengthUnit === 'ft/in' || lengthUnit === 'm/cm') {
                      // For composite units
                      const wholePart = compositeUnits.length.whole;
                      const fractionPart = compositeUnits.length.fraction;
                      
                      if (wholePart || fractionPart) {
                        setCompositeUnits(prev => ({
                          ...prev,
                          width: { whole: wholePart, fraction: fractionPart },
                          height: { whole: wholePart, fraction: fractionPart }
                        }));
                      }
                    } else if (dimensions.length) {
                      // For regular units
                      setDimensions(prev => ({
                        ...prev,
                        width: dimensions.length,
                        height: dimensions.length
                      }));
                    }
                  } else {
                    // For other shapes, ensure length unit is not an area unit
                    if (units.length.includes('²')) {
                      setUnits(prev => ({ ...prev, length: 'ft' }));
                    }
                  }
                }}
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
                  {field === 'length' && shape === 'Cube' ? 'Length and Depth / Height' : 
                   field === 'length' && shape === 'Pyramid' ? 'Area' :
                   field === 'length' && shape === 'Other shape' ? 'Area' :
                   field === 'height' && shape === 'Pyramid' ? 'Depth / Height' :
                   field === 'height' && shape === 'Other shape' ? 'Depth / Height' :
                   field === 'depth' && shape === 'Hollow cuboid / Rectangular tube' ? 'Border width' :
                   field === 'height' && shape === 'Hollow cuboid / Rectangular tube' ? 'Depth / Height' :
                   field === 'radius' && shape === 'Hollow cylinder' ? 'Outer radius' :
                   field === 'diameter' && shape === 'Hollow cylinder' ? 'Inner radius' :
                   field === 'height' && shape === 'Hollow cylinder' ? 'Depth / Height' :
                   field}
                </label>
                <div className="flex gap-2">
                  {/* Render standard input or composite inputs based on unit */}
                  {units[field] !== 'ft/in' && units[field] !== 'm/cm' ? (
                    <div className="flex-1">
                      <input
                        type="number"
                        value={dimensions[field]}
                        onChange={(e) => {
                          const value = e.target.value;
                          
                          // Clear previous error
                          setDimensionErrors(prev => ({
                            ...prev,
                            [field]: ''
                          }));
                          
                          // Allow empty value (for backspace to clear 0)
                          if (value === '') {
                            setDimensions(prev => ({
                              ...prev,
                              [field]: ''
                            }));
                            return;
                          }
                          
                          // Check for negative values
                          const numValue = parseFloat(value);
                          if (numValue < 0) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              [field]: 'Negative values are not allowed'
                            }));
                            return;
                          }
                          
                          // Format the value using utility function
                          const formattedValue = formatNumber(numValue, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 4,
                            useCommas: false
                          });
                          
                          // Check for hollow shapes validation errors
                          const validationError = validateHollowShapeDimensions(field, formattedValue, units, dimensions, compositeUnits);
                          if (validationError) {
                            setDimensionErrors(prev => ({
                              ...prev,
                              [field]: validationError
                            }));
                          }
                          
                          // Set the formatted value
                          setDimensions(prev => ({
                            ...prev,
                            [field]: formattedValue
                          }));
                        }}
                        className={`w-full px-3 py-2 border ${dimensionErrors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        step="0.01"
                        placeholder={`Enter ${field}`}
                      />
                      {dimensionErrors[field] && (
                        <p className="text-red-500 text-xs mt-1">{dimensionErrors[field]}</p>
                      )}
                    </div>
                  ) : (
                    // Composite inputs (feet/inches or meters/centimeters)
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="number"
                          value={compositeUnits[field].whole}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            // Clear previous error
                            setDimensionErrors(prev => ({
                              ...prev,
                              [field]: ''
                            }));
                            
                            // Check for negative values
                            if (value !== '' && parseFloat(value) < 0) {
                              setDimensionErrors(prev => ({
                                ...prev,
                                [field]: 'Negative values are not allowed'
                              }));
                              return;
                            }
                            
                            // Format the whole part (should be integers for whole units)
                            const formattedValue = value === '' ? '' : parseInt(value).toString();
                            
                            // Create temporary composite units for validation
                            const tempCompositeUnits = {
                              ...compositeUnits,
                              [field]: {
                                ...compositeUnits[field],
                                whole: formattedValue
                              }
                            };
                            
                            // Check for hollow shapes validation errors
                            const validationError = validateHollowShapeDimensions(field, '', units, dimensions, tempCompositeUnits);
                            if (validationError) {
                              setDimensionErrors(prev => ({
                                ...prev,
                                [field]: validationError
                              }));
                            }
                            
                            // Update the whole part with the formatted value
                            setCompositeUnits(prev => ({
                              ...prev,
                              [field]: {
                                ...prev[field],
                                whole: formattedValue
                              }
                            }));
                          }}
                          className={`w-full px-3 py-2 border ${dimensionErrors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                          placeholder="0"
                        />
                        <span className="text-xs text-slate-500">
                          {units[field] === 'ft/in' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="number"
                          value={compositeUnits[field].fraction}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            // Clear previous error
                            setDimensionErrors(prev => ({
                              ...prev,
                              [field]: ''
                            }));
                            
                            // Check for negative values
                            if (value !== '' && parseFloat(value) < 0) {
                              setDimensionErrors(prev => ({
                                ...prev,
                                [field]: 'Negative values are not allowed'
                              }));
                              return;
                            }
                            
                            // Format fractional part for proper display - use 2 decimal places for cm/inches
                            let formattedValue = value;
                            if (value !== '' && !isNaN(parseFloat(value))) {
                              formattedValue = parseFloat(value).toFixed(2);
                              // Remove trailing zeros
                              if (formattedValue.endsWith('.00')) {
                                formattedValue = formattedValue.slice(0, -3);
                              } else if (formattedValue.endsWith('0')) {
                                formattedValue = formattedValue.slice(0, -1);
                              }
                            }
                            
                            // Create temporary composite units for validation
                            const tempCompositeUnits = {
                              ...compositeUnits,
                              [field]: {
                                ...compositeUnits[field],
                                fraction: formattedValue
                              }
                            };
                            
                            // Check for hollow shapes validation errors
                            const validationError = validateHollowShapeDimensions(field, '', units, dimensions, tempCompositeUnits);
                            if (validationError) {
                              setDimensionErrors(prev => ({
                                ...prev,
                                [field]: validationError
                              }));
                            }
                            
                            // Update the fractional part with formatted value
                            setCompositeUnits(prev => ({
                              ...prev,
                              [field]: {
                                ...prev[field],
                                fraction: formattedValue
                              }
                            }));
                          }}
                          className={`w-full px-3 py-2 border ${dimensionErrors[field] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                          step="0.01"
                          placeholder="0"
                        />
                        <span className="text-xs text-slate-500">
                          {units[field] === 'ft/in' ? 'in' : 'cm'}
                        </span>
                      </div>
                      {dimensionErrors[field] && (
                        <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{dimensionErrors[field]}</p>
                      )}
                    </div>
                  )}
                  <select
                    value={units[field]}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      const currentUnit = units[field];
                      if (newUnit !== currentUnit) {
                        handleUnitChange(field, currentUnit, newUnit);
                      }
                    }}
                    className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    {(shape === 'Pyramid' && field === 'length' || shape === 'Other shape' && field === 'length' ? areaUnitOptions : unitOptions).map(option => (
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
                <div className="flex-1">
                  <input
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => {
                      const value = e.target.value;
                      
                      // Clear previous error
                      setPriceError('');
                      
                      // Allow empty value (for backspace to clear 0)
                      if (value === '') {
                        setPricePerUnit('');
                        setPricePerCubicYard(0); // Clear the base price
                        return;
                      }
                      
                      // Check for negative values
                      const numValue = parseFloat(value);
                      if (numValue < 0) {
                        setPriceError('Negative values are not allowed');
                        return;
                      }
                      
                      // Set the valid value using formatNumber for consistent precision
                      const formattedValue = formatNumber(numValue, { 
                        maximumFractionDigits: 8, 
                        useCommas: false 
                      });
                      setPricePerUnit(formattedValue);
                      
                      // Always update the base price (price per cubic yard)
                      // This ensures that total price calculations remain consistent
                      // regardless of which unit is displayed
                      
                      // If the price is in cubic yards, use it directly
                      if (priceUnit === 'cu yd') {
                        setPricePerCubicYard(numValue);
                      } else {
                        // Convert from current unit to cubic yards
                        // For example, if price is $10 per cubic foot:
                        // 1 cubic yard = 27 cubic feet
                        // So price per cubic yard = $10 * 27 = $270
                        const ratio = convertVolume(1, priceUnit, 'cu yd');
                        setPricePerCubicYard(numValue / ratio);
                      }
                    }}
                    className={`w-full px-3 py-2 border ${priceError ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    placeholder="Price per unit"
                  />
                  {priceError && <p className="text-red-500 text-xs mt-1">{priceError}</p>}
                </div>
                <span className="text-slate-600 px-2 py-2 text-sm">/</span>
                <select
                  value={priceUnit}
                  onChange={(e) => {
                    const newPriceUnit = e.target.value;
                    const currentPrice = parseFloat(pricePerUnit || '0');
                    
                    if (currentPrice > 0 && priceUnit !== newPriceUnit) {
                      // Direct conversion between volume units
                      // For example, if changing from cu yd to cu ft:
                      // 1 cu yd = 27 cu ft, so price per cu ft = price per cu yd / 27
                      
                      // Get the direct conversion ratio between the units
                      const conversionRatio = convertVolume(1, priceUnit, newPriceUnit);
                      
                      // Convert the price - divide by the ratio because:
                      // If going from smaller unit to larger unit (e.g., cu ft to cu yd),
                      // the price per unit should increase
                      // If going from larger unit to smaller unit (e.g., cu yd to cu ft),
                      // the price per unit should decrease
                      const convertedPrice = currentPrice / conversionRatio;
                      
                      // Use formatNumber to handle very small values appropriately
                      // This will show more decimal places for very small numbers
                      const newPrice = formatNumber(convertedPrice, { 
                        maximumFractionDigits: 8, 
                        useCommas: false 
                      });
                      setPricePerUnit(newPrice);
                      
                      // Make sure to update the base price per cubic yard to keep total consistent
                      if (newPriceUnit === 'cu yd') {
                        // If converting to cubic yard, just use the converted price directly
                        setPricePerCubicYard(convertedPrice);
                      } else {
                        // Calculate equivalent price per cubic yard
                        const yardRatio = convertVolume(1, newPriceUnit, 'cu yd');
                        setPricePerCubicYard(convertedPrice / yardRatio);
                      }
                    }
                    
                    setPriceUnit(newPriceUnit);
                  }}
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

            {/* Results Section - Only Total Price */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-medium text-slate-700">
                  Volume
                </label>
                <div className="text-lg font-semibold text-green-700">
                  {volume.toFixed(4)} {volumeUnit}
                </div>
              </div>
              
              {/* Price Results */}
              <div className="pt-3 border-t border-green-200">
                <label className="block text-lg font-medium text-slate-700 mb-1">
                  Total Price
                </label>
                <div className="text-2xl font-bold text-green-600">
                  {currency} {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Helpful Information */}
       

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 mt-4">
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
