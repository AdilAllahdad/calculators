'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type SingleLengthUnitType = 'm' | 'ft' | 'in' | 'cm' | 'yd';
type CompositeLengthUnitType = 'ft/in' | 'm/cm';
type LengthUnitType = SingleLengthUnitType | CompositeLengthUnitType;
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isSingleLengthUnit = (unit: string): unit is SingleLengthUnitType => {
  return ['m', 'ft', 'in', 'cm', 'yd'].includes(unit);
};

const isCompositeLengthUnit = (unit: string): unit is CompositeLengthUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return isSingleLengthUnit(unit) || isCompositeLengthUnit(unit);
};

// Define the unit values needed for each dropdown
const lengthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'yd', 'ft/in', 'm/cm'];
const heightUnitvalues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'yd', 'ft/in', 'm/cm'];
const postDepthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'yd', 'ft/in', 'm/cm'];

// Conversion map (all to meters as base unit)
const lengthConversions: ConversionMap<SingleLengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'in': 0.0254,     // inches to meters
  'cm': 0.01,       // centimeters to meters
  'yd': 0.9144      // yards to meters
};

// Unit conversion helper for single units
const handleUnitConversion = (
  currentUnit: SingleLengthUnitType,
  newUnit: SingleLengthUnitType,
  value: string,
  conversionTable: ConversionMap<SingleLengthUnitType>
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

export default function FencePostDepthCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<LengthUnitType>('m');
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<LengthUnitType>('m');
    const [postDepthUnit, setPostDepthUnit] = useState<LengthUnitType>('m');
    const [showDepthToHeightRatio, setShowDepthToHeightRatio] = useState(false);
    const [depthToHeightRatio, setDepthToHeightRatio] = useState<number>(0.33);
    const [calculatedPostDepth, setCalculatedPostDepth] = useState<number>(0);

    // Composite unit states for ft/in and m/cm
    const [lengthFeet, setLengthFeet] = useState<string>('');
    const [lengthInches, setLengthInches] = useState<string>('');
    const [lengthMeters, setLengthMeters] = useState<string>('');
    const [lengthCentimeters, setLengthCentimeters] = useState<string>('');

    const [heightFeet, setHeightFeet] = useState<string>('');
    const [heightInches, setHeightInches] = useState<string>('');
    const [heightMeters, setHeightMeters] = useState<string>('');
    const [heightCentimeters, setHeightCentimeters] = useState<string>('');

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

    const handleHeightUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isCompositeLengthUnit(heightUnit) && isSingleLengthUnit(newUnit)) {
            // Converting from composite to single unit
            if (heightUnit === 'ft/in') {
                const totalMeters = (Number(heightFeet || 0) * 0.3048) + (Number(heightInches || 0) * 0.0254);
                const result = totalMeters / lengthConversions[newUnit];
                setHeight(result.toFixed(4));
            } else if (heightUnit === 'm/cm') {
                const totalMeters = Number(heightMeters || 0) + (Number(heightCentimeters || 0) / 100);
                const result = totalMeters / lengthConversions[newUnit];
                setHeight(result.toFixed(4));
            }
        } else if (isSingleLengthUnit(heightUnit) && isCompositeLengthUnit(newUnit)) {
            // Converting from single to composite unit
            if (newUnit === 'ft/in') {
                const totalMeters = Number(height || 0) * lengthConversions[heightUnit];
                const { feet, inches } = convertMCmToFtIn(totalMeters.toString(), '0');
                setHeightFeet(feet.toString());
                setHeightInches(inches.toString());
            } else if (newUnit === 'm/cm') {
                const totalMeters = Number(height || 0) * lengthConversions[heightUnit];
                const { meters, centimeters } = convertFtInToMCm(totalMeters.toString(), '0');
                setHeightMeters(meters.toString());
                setHeightCentimeters(centimeters.toString());
            }
        } else if (isSingleLengthUnit(heightUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (height && height !== '') {
                const result = handleUnitConversion(heightUnit, newUnit, height, lengthConversions);
                setHeight(result.toFixed(4));
            }
        }

        setHeightUnit(newUnit);
    };

    const handlePostDepthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setPostDepthUnit(newUnitValue);
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

    const calculatePostHeight = () => {
        let lengthNum = 0;

        // Get length value from appropriate source
        if (isCompositeLengthUnit(lengthUnit)) {
            if (lengthUnit === 'ft/in') {
                lengthNum = (Number(lengthFeet || 0) * 0.3048) + (Number(lengthInches || 0) * 0.0254);
            } else if (lengthUnit === 'm/cm') {
                lengthNum = Number(lengthMeters || 0) + (Number(lengthCentimeters || 0) / 100);
            }
        } else {
            lengthNum = parseFloat(length) || 0;
            // Convert to meters using type-safe conversion
            lengthNum = lengthNum * lengthConversions[lengthUnit];
        }

        const depthToHeightRatioNum = parseFloat(depthToHeightRatio.toString()) || 0;
        if (lengthNum <= 0 || depthToHeightRatioNum <= 0) {
            setHeight('');
            return;
        }

        // Post Height = Post Length - Post Depth
        // Post Depth = Post Height × Ratio, so Post Height = Post Length / (1 + Ratio)
        const heightInMeters = lengthNum / (1 + depthToHeightRatioNum);

        // Convert to selected unit using type-safe conversion
        if (isCompositeLengthUnit(heightUnit)) {
            if (heightUnit === 'ft/in') {
                const { feet, inches } = convertMCmToFtIn(heightInMeters.toString(), '0');
                setHeightFeet(feet.toString());
                setHeightInches(inches.toString());
            } else if (heightUnit === 'm/cm') {
                const { meters, centimeters } = convertFtInToMCm(heightInMeters.toString(), '0');
                setHeightMeters(meters.toString());
                setHeightCentimeters(centimeters.toString());
            }
        } else {
            const convertedHeight = heightInMeters / lengthConversions[heightUnit];
            // Round to 1 decimal place for cleaner display
            const roundedHeight = Math.round(convertedHeight * 10) / 10;
            setHeight(roundedHeight.toString());
        }
    };

    const calculatePostDepth = () => {
        let heightNum = 0;

        // Get height value from appropriate source
        if (isCompositeLengthUnit(heightUnit)) {
            if (heightUnit === 'ft/in') {
                heightNum = (Number(heightFeet || 0) * 0.3048) + (Number(heightInches || 0) * 0.0254);
            } else if (heightUnit === 'm/cm') {
                heightNum = Number(heightMeters || 0) + (Number(heightCentimeters || 0) / 100);
            }
        } else {
            heightNum = parseFloat(height) || 0;
            // Convert to meters using type-safe conversion
            heightNum = heightNum * lengthConversions[heightUnit];
        }

        const depthToHeightRatioNum = parseFloat(depthToHeightRatio.toString()) || 0;

        if (heightNum <= 0 || depthToHeightRatioNum <= 0) {
            setCalculatedPostDepth(0);
            return;
        }

        const postDepthInMeters = heightNum * depthToHeightRatioNum;

        // Convert to selected unit using type-safe conversion
        const convertedPostDepth = isSingleLengthUnit(postDepthUnit)
            ? postDepthInMeters / lengthConversions[postDepthUnit]
            : postDepthInMeters; // For composite units, keep in meters for now

        // Round to 1 decimal place for cleaner display
        const roundedPostDepth = Math.round(convertedPostDepth * 10) / 10;
        setCalculatedPostDepth(roundedPostDepth);
    };



    const handleDepthToHeightRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Sanitize and convert to number before setting
        let sanitized = e.target.value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
            sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setDepthToHeightRatio(parseFloat(sanitized) || 0);
    };



    const reloadCalculator = () => {
        setLength('');
        setHeight('');
        setCalculatedPostDepth(0);
        setDepthToHeightRatio(0.33);
    };

    const clearAll = () => {
        setLength('');
        setHeight('');
        setCalculatedPostDepth(0);
        setDepthToHeightRatio(0.33);
    };

    const shareResult = () => {
        const result = `Length: ${length} ${lengthUnit}\nHeight: ${height} ${heightUnit}\nPost Depth: ${calculatedPostDepth} ${postDepthUnit}\nDepth to Height Ratio: ${depthToHeightRatio}`;
        if (navigator.share) {
          navigator.share({
            title: 'Fence Post Depth Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    useEffect(() => {
        calculatePostHeight();
    }, [length, lengthUnit, heightUnit, depthToHeightRatio]);

    useEffect(() => {
        calculatePostDepth();
    }, [height, heightUnit, postDepthUnit, depthToHeightRatio]);

    return (
        <div className="flex justify-center">    
            <div className="max-w-4xl mx-auto my-auto py-8">    
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Fence Post Depth Calculator 
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <img src="/fence-post-depth_DC.png" alt="Fence Post Depth" />
                    </div>
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Length  
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
                            />  
                            <UnitDropdown
                                id="length-unit"
                                value={lengthUnit}
                                onChange={(e) => handleLengthUnitChange(e.target.value)}
                                unitValues={lengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>  
                    </div>  
                    {showDepthToHeightRatio && (  
                        <div className="mb-6">  
                            <label className="block text-sm font-medium text-slate-700 mb-2">  
                                Depth-to-height ratio  
                            </label>
                            <div className="flex gap-2">  
                                <input  
                                    type="number"  
                                    value={depthToHeightRatio}  
                                    onChange={handleDepthToHeightRatioChange}  
                                    onFocus={(e) => handleFocus(depthToHeightRatio.toString(), e)}  
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                    min="0"  
                                />  
                            </div>  
                        </div>  
                    )} 
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Height  
                        </label>  
                        <div className="flex gap-2">  
                            <input
                                type="text"
                                value={height ? formatNumber(parseFloat(height)) : ''}
                                placeholder="Enter post length to calculate height"
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                id="height-unit"
                                value={heightUnit}
                                onChange={(e) => handleHeightUnitChange(e.target.value)}
                                unitValues={heightUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>  
                    </div>  
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Depth  
                        </label>  
                        <div className="flex gap-2">  
                            <input
                                type="text"
                                value={calculatedPostDepth > 0 ? formatNumber(calculatedPostDepth) : ''}
                                placeholder="Enter height to calculate depth"
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                id="post-depth-unit"
                                value={postDepthUnit}
                                onChange={(e) => handlePostDepthUnitChange(e.target.value)}
                                unitValues={postDepthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                        <div className="mt-4">  
                            <input
                                type="checkbox"
                                checked={showDepthToHeightRatio}
                                onChange={() => setShowDepthToHeightRatio(!showDepthToHeightRatio)}
                                className="form-checkbox text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <label className="text-sm font-medium text-slate-700">Modify the depth-to-height ratio</label>
                        </div>
                    </div>  
                    <hr className='border-black opacity-10 m-8' />
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
