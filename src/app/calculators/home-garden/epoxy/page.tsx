'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type SingleLengthUnitType = 'mm' | 'cm' | 'm' | 'in' | 'ft';
type CompositeLengthUnitType = 'ft/in' | 'm/cm';
type LengthUnitType = SingleLengthUnitType | CompositeLengthUnitType;
type VolumeUnitType = 'mm3' | 'cm3' | 'm3' | 'in3' | 'ft3' | 'yd3' | 'cu in' | 'cu ft' | 'l' | 'gal' | 'ml' | 'US fl oz' | 'UK fl oz';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isSingleLengthUnit = (unit: string): unit is SingleLengthUnitType => {
  return ['mm', 'cm', 'm', 'in', 'ft'].includes(unit);
};

const isCompositeLengthUnit = (unit: string): unit is CompositeLengthUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return isSingleLengthUnit(unit) || isCompositeLengthUnit(unit);
};

const isVolumeUnit = (unit: string): unit is VolumeUnitType => {
  return ['mm3', 'cm3', 'm3', 'in3', 'ft3', 'yd3', 'cu in', 'cu ft', 'l', 'gal', 'ml', 'US fl oz', 'UK fl oz'].includes(unit);
};

// Define the unit values needed for each dropdown
const inputUnitvalues: LengthUnitType[] = ['mm', 'cm', 'm', 'in', 'ft', 'ft/in', 'm/cm'];
const volumeUnitvalues: VolumeUnitType[] = ['mm3', 'cm3', 'm3', 'in3', 'ft3', 'yd3', 'cu in', 'cu ft', 'l', 'gal', 'ml', 'US fl oz', 'UK fl oz'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<SingleLengthUnitType> = {
  'm': 1,           // meters (base)
  'mm': 0.001,      // millimeters to meters
  'cm': 0.01,       // centimeters to meters
  'in': 0.0254,     // inches to meters
  'ft': 0.3048      // feet to meters
};

const volumeConversions: ConversionMap<VolumeUnitType> = {
  'm3': 1,              // cubic meters (base)
  'mm3': 1e-9,          // cubic millimeters to cubic meters
  'cm3': 1e-6,          // cubic centimeters to cubic meters
  'in3': 1.6387e-5,     // cubic inches to cubic meters
  'ft3': 0.0283168,     // cubic feet to cubic meters
  'yd3': 0.764555,      // cubic yards to cubic meters
  'cu in': 1.6387e-5,   // cubic inches to cubic meters (same as in3)
  'cu ft': 0.0283168,   // cubic feet to cubic meters (same as ft3)
  'l': 0.001,           // liters to cubic meters
  'gal': 0.00378541,    // US gallons to cubic meters
  'ml': 1e-6,           // milliliters to cubic meters
  'US fl oz': 2.9574e-5, // US fluid ounces to cubic meters
  'UK fl oz': 2.8413e-5  // UK fluid ounces to cubic meters
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

export default function EpoxyCalculator() {
    const [coatingDepth, setCoatingDepth] = useState<string>('');
    const [coatingDepthUnit, setCoatingDepthUnit] = useState<LengthUnitType>('mm');
    const [surfaceShape, setSurfaceShape] = useState<string>('rectangle');
    const [surfaceLength, setSurfaceLength] = useState<string>('');
    const [surfaceLengthUnit, setSurfaceLengthUnit] = useState<LengthUnitType>('m');
    const [surfaceWidth, setSurfaceWidth] = useState<string>('');
    const [surfaceWidthUnit, setSurfaceWidthUnit] = useState<LengthUnitType>('m');
    const [surfaceDiameter, setSurfaceDiameter] = useState<string>('');
    const [surfaceDiameterUnit, setSurfaceDiameterUnit] = useState<LengthUnitType>('m');
    const [volume, setVolume] = useState<number>(0);
    const [volumeUnit, setVolumeUnit] = useState<VolumeUnitType>('m3');

    // Composite unit states for ft/in and m/cm
    const [depthFeet, setDepthFeet] = useState<string>('');
    const [depthInches, setDepthInches] = useState<string>('');
    const [depthMeters, setDepthMeters] = useState<string>('');
    const [depthCentimeters, setDepthCentimeters] = useState<string>('');

    const [lengthFeet, setLengthFeet] = useState<string>('');
    const [lengthInches, setLengthInches] = useState<string>('');
    const [lengthMeters, setLengthMeters] = useState<string>('');
    const [lengthCentimeters, setLengthCentimeters] = useState<string>('');

    const [widthFeet, setWidthFeet] = useState<string>('');
    const [widthInches, setWidthInches] = useState<string>('');
    const [widthMeters, setWidthMeters] = useState<string>('');
    const [widthCentimeters, setWidthCentimeters] = useState<string>('');

    const [diameterFeet, setDiameterFeet] = useState<string>('');
    const [diameterInches, setDiameterInches] = useState<string>('');
    const [diameterMeters, setDiameterMeters] = useState<string>('');
    const [diameterCentimeters, setDiameterCentimeters] = useState<string>('');

    // Unit change handlers with composite unit support
    const handleCoatingDepthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isCompositeLengthUnit(coatingDepthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting from composite to single unit
            if (coatingDepthUnit === 'ft/in') {
                const totalMeters = (Number(depthFeet || 0) * 0.3048) + (Number(depthInches || 0) * 0.0254);
                const result = totalMeters / lengthConversions[newUnit];
                setCoatingDepth(result.toFixed(4));
            } else if (coatingDepthUnit === 'm/cm') {
                const totalMeters = Number(depthMeters || 0) + (Number(depthCentimeters || 0) / 100);
                const result = totalMeters / lengthConversions[newUnit];
                setCoatingDepth(result.toFixed(4));
            }
        } else if (isSingleLengthUnit(coatingDepthUnit) && isCompositeLengthUnit(newUnit)) {
            // Converting from single to composite unit
            if (newUnit === 'ft/in') {
                const totalMeters = Number(coatingDepth || 0) * lengthConversions[coatingDepthUnit];
                const { feet, inches } = convertMCmToFtIn(totalMeters.toString(), '0');
                setDepthFeet(feet.toString());
                setDepthInches(inches.toString());
            } else if (newUnit === 'm/cm') {
                const totalMeters = Number(coatingDepth || 0) * lengthConversions[coatingDepthUnit];
                const { meters, centimeters } = convertFtInToMCm(totalMeters.toString(), '0');
                setDepthMeters(meters.toString());
                setDepthCentimeters(centimeters.toString());
            }
        } else if (isSingleLengthUnit(coatingDepthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (coatingDepth && coatingDepth !== '') {
                const result = handleUnitConversion(coatingDepthUnit, newUnit, coatingDepth, lengthConversions);
                setCoatingDepth(result.toFixed(4));
            }
        }

        setCoatingDepthUnit(newUnit);
    };

    const handleVolumeUnitChange = (newUnitValue: string) => {
        if (!isVolumeUnit(newUnitValue)) return;
        setVolumeUnit(newUnitValue);
    };

    const handleSurfaceLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isSingleLengthUnit(surfaceLengthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (surfaceLength && surfaceLength !== '') {
                const result = handleUnitConversion(surfaceLengthUnit, newUnit, surfaceLength, lengthConversions);
                setSurfaceLength(result.toFixed(4));
            }
        }
        setSurfaceLengthUnit(newUnit);
    };

    const handleSurfaceWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isSingleLengthUnit(surfaceWidthUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (surfaceWidth && surfaceWidth !== '') {
                const result = handleUnitConversion(surfaceWidthUnit, newUnit, surfaceWidth, lengthConversions);
                setSurfaceWidth(result.toFixed(4));
            }
        }
        setSurfaceWidthUnit(newUnit);
    };

    const handleSurfaceDiameterUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (isSingleLengthUnit(surfaceDiameterUnit) && isSingleLengthUnit(newUnit)) {
            // Converting between single units
            if (surfaceDiameter && surfaceDiameter !== '') {
                const result = handleUnitConversion(surfaceDiameterUnit, newUnit, surfaceDiameter, lengthConversions);
                setSurfaceDiameter(result.toFixed(4));
            }
        }
        setSurfaceDiameterUnit(newUnit);
    };

    const handleNumberInput = (value: string, setter: (val: string) => void) => {
        // Allow only digits and a single dot
        let sanitized = value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
          sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setter(sanitized);
    }

    const handleFocus = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === '' || currentValue === '0') {
          e.target.select();
        }
    };

    const calculateVolume = () => {
        // Get depth value from appropriate source
        let depthInMeters = 0;
        if (isCompositeLengthUnit(coatingDepthUnit)) {
            if (coatingDepthUnit === 'ft/in') {
                depthInMeters = (Number(depthFeet || 0) * 0.3048) + (Number(depthInches || 0) * 0.0254);
            } else if (coatingDepthUnit === 'm/cm') {
                depthInMeters = Number(depthMeters || 0) + (Number(depthCentimeters || 0) / 100);
            }
        } else {
            const depth = parseFloat(coatingDepth) || 0;
            depthInMeters = depth * lengthConversions[coatingDepthUnit];
        }

        // Get length and width values
        let lengthInMeters = 0;
        let widthInMeters = 0;
        let diameterInMeters = 0;

        if (isSingleLengthUnit(surfaceLengthUnit)) {
            const length = parseFloat(surfaceLength) || 0;
            lengthInMeters = length * lengthConversions[surfaceLengthUnit];
        }

        if (isSingleLengthUnit(surfaceWidthUnit)) {
            const width = parseFloat(surfaceWidth) || 0;
            widthInMeters = width * lengthConversions[surfaceWidthUnit];
        }

        if (isSingleLengthUnit(surfaceDiameterUnit)) {
            const diameter = parseFloat(surfaceDiameter) || 0;
            diameterInMeters = diameter * lengthConversions[surfaceDiameterUnit];
        }

        if (depthInMeters <= 0 || (lengthInMeters <= 0 && widthInMeters <= 0 && diameterInMeters <= 0)) {
            setVolume(0);
            return;
        }

        let volumeInCubicMeters = 0;

        if (lengthInMeters > 0 && widthInMeters > 0) {
            volumeInCubicMeters = lengthInMeters * widthInMeters * depthInMeters;
        } else if (diameterInMeters > 0) {
            volumeInCubicMeters = Math.PI * Math.pow(diameterInMeters / 2, 2) * depthInMeters;
        }

        // Convert to selected unit using type-safe conversion
        const volumeDisplay = volumeInCubicMeters / volumeConversions[volumeUnit];
        setVolume(volumeDisplay);
    };

    useEffect(() => {
        calculateVolume();
    }, [coatingDepth, coatingDepthUnit, surfaceLength, surfaceLengthUnit, surfaceWidth, surfaceWidthUnit, surfaceDiameter, surfaceDiameterUnit, volumeUnit]);

    const clearAll = () => {
        setCoatingDepth('');
        setSurfaceLength('');
        setSurfaceWidth('');
        setSurfaceDiameter('');
        setVolume(0);
    };

    const reloadCalculator = () => {
        setCoatingDepth('');
        setSurfaceLength('');
        setSurfaceWidth('');
        setSurfaceDiameter('');
        setVolume(0);
    };

    const shareResult = () => {
        const result = `Coating Depth: ${coatingDepth} ${coatingDepthUnit}\nSurface Length: ${surfaceLength} ${surfaceLengthUnit}\nSurface Width: ${surfaceWidth} ${surfaceWidthUnit}\nSurface Diameter: ${surfaceDiameter} ${surfaceDiameterUnit}\nVolume: ${volume} ${volumeUnit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Epoxy Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-slate-800">Epoxy Calculator</h1>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">How thick do you want the epoxy coating?</h2>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Coating Depth
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={coatingDepth}
                                onChange={(e) => handleNumberInput(e.target.value, setCoatingDepth)}
                                onFocus={(e) => handleFocus(coatingDepth, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                placeholder="Enter depth"
                            />
                            <UnitDropdown
                                value={coatingDepthUnit}
                                onChange={(e) => handleCoatingDepthUnitChange(e.target.value)}
                                unitValues={inputUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl mt-4 p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">What is the shape and size of your surface?</h2>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Surface Shape
                        </label>
                        <select
                            value={surfaceShape}
                            onChange={(e) => setSurfaceShape(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        >
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                        </select>
                    </div>
                    {surfaceShape === 'rectangle' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Length
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={surfaceLength}
                                        onChange={(e) => handleNumberInput(e.target.value, setSurfaceLength)}
                                        onFocus={(e) => handleFocus(surfaceLength, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter length"
                                    />  
                                    <UnitDropdown
                                        value={surfaceLengthUnit}
                                        onChange={(e) => handleSurfaceLengthUnitChange(e.target.value)}
                                        unitValues={inputUnitvalues}
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
                                        type="text"
                                        value={surfaceWidth}
                                        onChange={(e) => handleNumberInput(e.target.value, setSurfaceWidth)}
                                        onFocus={(e) => handleFocus(surfaceWidth, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter width"
                                    />  
                                    <UnitDropdown
                                        value={surfaceWidthUnit}
                                        onChange={(e) => handleSurfaceWidthUnitChange(e.target.value)}
                                        unitValues={inputUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {surfaceShape === 'circle' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Diameter
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={surfaceDiameter}
                                        onChange={(e) => handleNumberInput(e.target.value, setSurfaceDiameter)}
                                        onFocus={(e) => handleFocus(surfaceDiameter, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter diameter"
                                    />  
                                    <UnitDropdown
                                        value={surfaceDiameterUnit}
                                        onChange={(e) => handleSurfaceDiameterUnitChange(e.target.value)}
                                        unitValues={inputUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl mt-4 p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">
                            Here's how much epoxy resin you'll need:
                        </h2>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Epoxy Volume</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(volume, 2)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
                            />
                            <UnitDropdown
                                value={volumeUnit}
                                onChange={(e) => handleVolumeUnitChange(e.target.value)}
                                unitValues={volumeUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}