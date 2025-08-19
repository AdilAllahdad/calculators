'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type SingleLengthUnitType = 'cm' | 'dm' | 'm' | 'yd' | 'ft' | 'in';
type CompositeLengthUnitType = 'ft/in' | 'm/cm';
type LengthUnitType = SingleLengthUnitType | CompositeLengthUnitType;
type AreaUnitType = 'cm2' | 'dm2' | 'm2' | 'yd2' | 'ft2' | 'in2';

type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isSingleLengthUnit = (unit: string): unit is SingleLengthUnitType => {
  return ['cm', 'dm', 'm', 'yd', 'ft', 'in'].includes(unit);
};

const isCompositeLengthUnit = (unit: string): unit is CompositeLengthUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return isSingleLengthUnit(unit) || isCompositeLengthUnit(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['cm2', 'dm2', 'm2', 'yd2', 'ft2', 'in2'].includes(unit);
};

// Define the unit values needed for each dropdown
const sideUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];
const areaUnitvalues: AreaUnitType[] = ['cm2', 'dm2', 'm2', 'yd2', 'ft2', 'in2'];
const priceUnitvalues: AreaUnitType[] = ['cm2', 'dm2', 'm2', 'yd2', 'ft2', 'in2'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<SingleLengthUnitType> = {
  'm': 1,           // meters (base)
  'cm': 0.01,       // centimeters to meters
  'dm': 0.1,        // decimeters to meters
  'yd': 0.9144,     // yards to meters
  'ft': 0.3048,     // feet to meters
  'in': 0.0254      // inches to meters
};

const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'cm2': 0.0001,    // square centimeters to square meters
  'dm2': 0.01,      // square decimeters to square meters
  'yd2': 0.836127,  // square yards to square meters
  'ft2': 0.092903,  // square feet to square meters
  'in2': 0.00064516 // square inches to square meters
};

// Unit conversion helper for single units
const handleUnitConversion = <T extends string>(
  currentUnit: T,
  newUnit: T,
  value: string,
  conversionTable: ConversionMap<T>
): number => {
  if (!value) return 0;
  const numValue = Number(value);
  if (isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Helper functions for composite units
const convertFtInToMCm = (feet: string, inches: string) => {
  const totalFeet = Number(feet || 0);
  const totalInches = Number(inches || 0);
  const totalMeters = (totalFeet * 0.3048) + (totalInches * 0.0254);
  const meters = Math.floor(totalMeters);
  const centimeters = Math.round((totalMeters - meters) * 100);
  return { meters, centimeters };
};

const convertMCmToFtIn = (meters: string, centimeters: string) => {
  const totalMeters = Number(meters || 0) + (Number(centimeters || 0) / 100);
  const totalInches = totalMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Number((totalInches % 12).toFixed(2));
  return { feet, inches };
};

// Format number helper
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

export default function CarpetCalculator() {
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<LengthUnitType>('m');
    const [widthUnit, setWidthUnit] = useState<LengthUnitType>('m');
    const [radius, setRadius] = useState<string>('');
    const [radiusUnit, setRadiusUnit] = useState<LengthUnitType>('m');
    const [axisA, setAxisA] = useState<string>('');
    const [axisAUnit, setAxisAUnit] = useState<LengthUnitType>('m');
    const [axisB, setAxisB] = useState<string>('');
    const [axisBUnit, setAxisBUnit] = useState<LengthUnitType>('m');
    const [side, setSide] = useState<string>('');
    const [shape, setShape] = useState<string>('square');
    const [sideUnit, setSideUnit] = useState<LengthUnitType>('m');
    const [area, setArea] = useState<number>(0);
    const [areaUnit, setAreaUnit] = useState<AreaUnitType>('m2');
    const [price, setPrice] = useState<string>('');
    const [priceUnit, setPriceUnit] = useState<AreaUnitType>('m2');
    const [totalCost, setTotalCost] = useState<number>(0);

    // Composite unit states for ft/in and m/cm
    const [lengthFeet, setLengthFeet] = useState<string>('');
    const [lengthInches, setLengthInches] = useState<string>('');
    const [lengthMeters, setLengthMeters] = useState<string>('');
    const [lengthCentimeters, setLengthCentimeters] = useState<string>('');

    const [widthFeet, setWidthFeet] = useState<string>('');
    const [widthInches, setWidthInches] = useState<string>('');
    const [widthMeters, setWidthMeters] = useState<string>('');
    const [widthCentimeters, setWidthCentimeters] = useState<string>('');

    const lengthUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];
    const widthUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];
    const radiusUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];
    const axisAUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];
    const axisBUnitvalues: LengthUnitType[] = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft/in', 'm/cm'];

    // Unit change handlers with composite unit support
    const handleLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isCompositeLengthUnit(lengthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting from composite to single unit
            if (lengthUnit === 'ft/in') {
                const totalMeters = (Number(lengthFeet || 0) * 0.3048) + (Number(lengthInches || 0) * 0.0254);
                const result = totalMeters / lengthConversions[newUnit];
                setLength(result.toFixed(4));
            } else if (lengthUnit === 'm/cm') {
                const totalMeters = Number(lengthMeters || 0) + (Number(lengthCentimeters || 0) / 100);
                const result = totalMeters / lengthConversions[newUnit];
                setLength(result.toFixed(4));
            }
        } else if (isSingleLengthUnit(lengthUnit) && isCompositeLengthUnit(newUnit)) {
            // Converting from single to composite unit
            if (newUnit === 'ft/in') {
                const totalMeters = Number(length || 0) * lengthConversions[lengthUnit];
                const { feet, inches } = convertMCmToFtIn(totalMeters.toString(), '0');
                setLengthFeet(feet.toString());
                setLengthInches(inches.toString());
            } else if (newUnit === 'm/cm') {
                const totalMeters = Number(length || 0) * lengthConversions[lengthUnit];
                const { meters, centimeters } = convertFtInToMCm(totalMeters.toString(), '0');
                setLengthMeters(meters.toString());
                setLengthCentimeters(centimeters.toString());
            }
        } else if (isSingleLengthUnit(lengthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (length && length !== '') {
                const result = handleUnitConversion(lengthUnit, newUnit, length, lengthConversions);
                setLength(result.toFixed(4));
            }
        }

        setLengthUnit(newUnit);
    };

    const handleWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!width || width === '') {
            setWidthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(widthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(widthUnit, newUnit, width, lengthConversions);
            setWidth(result.toFixed(4));
        }
        setWidthUnit(newUnit);
    };

    const handleRadiusUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!radius || radius === '') {
            setRadiusUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(radiusUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(radiusUnit, newUnit, radius, lengthConversions);
            setRadius(result.toFixed(4));
        }
        setRadiusUnit(newUnit);
    };

    const handleAxisAUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setAxisAUnit(newUnitValue);
    };

    const handleAxisBUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setAxisBUnit(newUnitValue);
    };

    const handleSideUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setSideUnit(newUnitValue);
    };

    const handleAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        setAreaUnit(newUnitValue);
    };

    const handlePriceUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!price || price === '') {
            setPriceUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(priceUnit, newUnit, price, areaConversions);
        setPrice(result.toFixed(4));
        setPriceUnit(newUnit);
    };

    useEffect(() => {
        calculateArea();
        calculateCost();
    }, [length, width, lengthUnit, widthUnit, radius, radiusUnit, axisA, axisB, axisAUnit, axisBUnit, side, sideUnit, shape, area, areaUnit, price, priceUnit]);

    const calculateArea = () => {
        const roundToThreeDecimals = (num: number) => {
            return Math.round(num * 1000) / 1000;
        };

        if (shape === 'rectangle') {
            const lengthNum = parseFloat(length) || 0;
            const widthNum = parseFloat(width) || 0;
            if (lengthNum <= 0 || widthNum <= 0) {
                setArea(0);
                return;
            }
            // Convert to meters using type-safe conversion for single units only
            const lengthInMeters = isSingleLengthUnit(lengthUnit)
                ? lengthNum * lengthConversions[lengthUnit]
                : lengthNum; // For composite units, assume already in meters
            const widthInMeters = isSingleLengthUnit(widthUnit)
                ? widthNum * lengthConversions[widthUnit]
                : widthNum; // For composite units, assume already in meters
            const areaInSquareMeters = roundToThreeDecimals(lengthInMeters * widthInMeters);
            // Convert to selected unit using type-safe conversion
            const areaDisplay = roundToThreeDecimals(areaInSquareMeters / areaConversions[areaUnit]);
            setArea(areaDisplay);
        } else if (shape === 'circle') {
            const radiusNum = parseFloat(radius) || 0;
            if (radiusNum <= 0) {
                setArea(0);
                return;
            }
            // Convert to meters using type-safe conversion for single units only
            const radiusInMeters = isSingleLengthUnit(radiusUnit)
                ? radiusNum * lengthConversions[radiusUnit]
                : radiusNum; // For composite units, assume already in meters
            const areaInSquareMeters = roundToThreeDecimals(Math.PI * radiusInMeters * radiusInMeters);
            // Convert to selected unit using type-safe conversion
            const areaDisplay = roundToThreeDecimals(areaInSquareMeters / areaConversions[areaUnit]);
            setArea(areaDisplay);
        } else if (shape === 'ellipse') {
            const axisANum = parseFloat(axisA) || 0;
            const axisBNum = parseFloat(axisB) || 0;
            if (axisANum <= 0 || axisBNum <= 0) {
                setArea(0);
                return;
            }
            // Convert to meters using type-safe conversion for single units only
            const axisAInMeters = isSingleLengthUnit(axisAUnit)
                ? axisANum * lengthConversions[axisAUnit]
                : axisANum; // For composite units, assume already in meters
            const axisBInMeters = isSingleLengthUnit(axisBUnit)
                ? axisBNum * lengthConversions[axisBUnit]
                : axisBNum; // For composite units, assume already in meters
            const areaInSquareMeters = roundToThreeDecimals(Math.PI * axisAInMeters * axisBInMeters);
            // Convert to selected unit using type-safe conversion
            const areaDisplay = roundToThreeDecimals(areaInSquareMeters / areaConversions[areaUnit]);
            setArea(areaDisplay);
        } else if (shape === 'pentagon') {
            const sideNum = parseFloat(side) || 0;
            if (sideNum <= 0) {
                setArea(0);
                return;
            }
            // Convert to meters using type-safe conversion for single units only
            const sideInMeters = isSingleLengthUnit(sideUnit)
                ? sideNum * lengthConversions[sideUnit]
                : sideNum; // For composite units, assume already in meters
            const areaInSquareMeters = roundToThreeDecimals((Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) / 4) * Math.pow(sideInMeters, 2));
            // Convert to selected unit using type-safe conversion
            const areaDisplay = roundToThreeDecimals(areaInSquareMeters / areaConversions[areaUnit]);
            setArea(areaDisplay);
        } else if (shape === 'hexagon') {
            const sideNum = parseFloat(side) || 0;
            if (sideNum <= 0) {
                setArea(0);
                return;
            }
            // Convert to meters using type-safe conversion for single units only
            const sideInMeters = isSingleLengthUnit(sideUnit)
                ? sideNum * lengthConversions[sideUnit]
                : sideNum; // For composite units, assume already in meters
            const areaInSquareMeters = roundToThreeDecimals((3 * Math.sqrt(3) / 2) * Math.pow(sideInMeters, 2));
            // Convert to selected unit using type-safe conversion
            const areaDisplay = roundToThreeDecimals(areaInSquareMeters / areaConversions[areaUnit]);
            setArea(areaDisplay);
        }
    };

    const getShapesImg = () => {
        const getImageSrc = () => {
          switch (shape) {
            case 'rectangle':
              return '/rectangle.png';
            case 'circle':
              return '/circle.png';
            case 'ellipse':
              return '/ellipse.png';
            case 'pentagon':
              return '/pentagon.png';
            case 'hexagon':
              return '/hexagon.png';
            default:
              return null;
          }
        };
        const imageSrc = getImageSrc();

        if (!imageSrc) {
          return (
            <div className="w-full mt-4 mb-4 h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center">
              <div className="text-green-700 text-lg font-semibold">Select a shape</div>
            </div>
          );
        }
        return (
          <div className="w-full mt-4 mb-4 h-48 bg-gradient-to-br from-white-200 to-white-400 rounded-lg flex items-center justify-center relative overflow-hidden">
            <img
              src={imageSrc}
              alt={shape}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        );
    }

    const calculateCost = () => {
      const roundToThreeDecimals = (num: number) => {
            return Math.round(num * 1000) / 1000;
        };
        const priceNum = parseFloat(price) || 0;
        if (priceNum <= 0) {
            setTotalCost(0);
            return;
        }
        // Convert area to pricing unit using type-safe conversion
        const areaInPricingUnit = area / areaConversions[areaUnit] * areaConversions[priceUnit];
        const cost = roundToThreeDecimals(priceNum * areaInPricingUnit);
        setTotalCost(cost);
    };

    const handleNumberInput = (value: string, setter: (val: string) => void) => {
        // Allow only digits and a single dot
        let sanitized = value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
          sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setter(sanitized);
      };

      const handleFocus = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === '' || currentValue === '0') {
          e.target.select();
        }
      };

      const clearAll = () => {
        setSide('');
        setArea(0);
        setPrice('');
        setTotalCost(0);
        setLength('');
        setWidth('');
        setRadius('');
        setAxisA('');
        setAxisB('');
      };

      const reloadCalculator = () => {
        setSide('');
        setArea(0);
        setPrice('');
        setTotalCost(0);
        setLength('');
        setWidth('');
        setRadius('');
        setAxisA('');
        setAxisB('');
      };

      const shareResult = () => {
        const result = `Side: ${side} ${sideUnit}\nArea: ${area} ${areaUnit}\nPrice: ${price} ${priceUnit}\nTotal Cost: ${totalCost}`;
        if (navigator.share) {
          navigator.share({
            title: 'Carpet Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

      return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto py-8">    
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Carpet Calculator 
                        <span className="ml-3 text-2xl">🧷</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-6 text-slate-800">Carpet dimensions</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select a Shape
                            <select
                                value={shape}
                                onChange={(e) => setShape(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                                <option value="ellipse">Ellipse</option>
                                <option value="pentagon">Pentagon</option>
                                <option value="hexagon">Hexagon</option>
                            </select>
                        </label>
                        {getShapesImg()}
                    </div>
                    {shape === 'rectangle' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Length
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={length}
                                        onChange={(e) => handleNumberInput(e.target.value, setLength)}
                                        onFocus={(e) => handleFocus(length, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter length"
                                    />
                                    <UnitDropdown
                                        value={lengthUnit}
                                        onChange={(e) => handleLengthUnitChange(e.target.value)}
                                        unitValues={lengthUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Width
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                                        onFocus={(e) => handleFocus(width, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter width"
                                    />
                                    <UnitDropdown
                                        value={widthUnit}
                                        onChange={(e) => handleWidthUnitChange(e.target.value)}
                                        unitValues={widthUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                                        style={{ color: '#1e293b' }}
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => handleAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            
                        </div>
                    )}
                    {shape === 'circle' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Radius
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={radius}
                                        onChange={(e) => handleNumberInput(e.target.value, setRadius)}
                                        onFocus={(e) => handleFocus(radius, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter radius"
                                    />
                                    <UnitDropdown
                                        value={radiusUnit}
                                        onChange={(e) => handleRadiusUnitChange(e.target.value)}
                                        unitValues={radiusUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => handleAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {shape === 'ellipse' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Axis A
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={axisA}
                                        onChange={(e) => handleNumberInput(e.target.value, setAxisA)}
                                        onFocus={(e) => handleFocus(axisA, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter axis A"
                                    />
                                    <UnitDropdown
                                        value={axisAUnit}
                                        onChange={(e) => handleAxisAUnitChange(e.target.value)}
                                        unitValues={axisAUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Axis B
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={axisB}
                                        onChange={(e) => handleNumberInput(e.target.value, setAxisB)}
                                        onFocus={(e) => handleFocus(axisB, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter axis B"
                                    />
                                    <UnitDropdown
                                        value={axisBUnit}
                                        onChange={(e) => handleAxisBUnitChange(e.target.value)}
                                        unitValues={axisBUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value as AreaUnitType)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                     )}
                     { shape === 'pentagon' && (
                      <div>
                        <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Side
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={side}
                                        onChange={(e) => handleNumberInput(e.target.value, setSide)}
                                        onFocus={(e) => handleFocus(side, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter side"
                                    />
                                    <UnitDropdown
                                        value={sideUnit}
                                        onChange={(e) => handleSideUnitChange(e.target.value)}
                                        unitValues={sideUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        step="0.01"
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value as AreaUnitType)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                          </div>
                     )}
                     { shape === 'hexagon' && (
                      <div>
                        <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Side
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={side}
                                        onChange={(e) => handleNumberInput(e.target.value, setSide)}
                                        onFocus={(e) => handleFocus(side, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter side"
                                    />
                                    <UnitDropdown
                                        value={sideUnit}
                                        onChange={(e) => handleSideUnitChange(e.target.value)}
                                        unitValues={sideUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        step="0.01"
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value as AreaUnitType)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                          </div>
                     )}
                </div>
                <div className="bg-white rounded-xl mt-4 p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                     <h2 className='text-xl font-semibold mb-6 text-slate-800'> Cost Calculations</h2>
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Price per unit area
                        </label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                PKR
                            </div>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => handleNumberInput(e.target.value, setPrice)}
                                onFocus={(e) => handleFocus(price, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                                placeholder="Enter price"
                            />
                            <UnitDropdown
                                value={priceUnit}
                                onChange={(e) => handlePriceUnitChange(e.target.value)}
                                unitValues={priceUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                     </div>
                     <div className='mb-6'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            Carpet Cost
                        </label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                PKR
                            </div>
                            <input
                                type="number"
                                value={totalCost}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                            />
                        </div>
                     </div>
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
                </div>
        </div>
        </div>
      );
}