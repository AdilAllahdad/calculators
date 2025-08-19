'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type SingleLengthUnitType = 'm' | 'ft' | 'in' | 'mi' | 'cm' | 'km' | 'yd';
type CompositeLengthUnitType = 'ft/in' | 'm/cm';
type LengthUnitType = SingleLengthUnitType | CompositeLengthUnitType;
type AreaUnitType = 'm2' | 'ft2' | 'yd2' | 'cm2' | 'a' | 'da' | 'ha' | 'ac' | 'sf';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isSingleLengthUnit = (unit: string): unit is SingleLengthUnitType => {
  return ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd'].includes(unit);
};

const isCompositeLengthUnit = (unit: string): unit is CompositeLengthUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return isSingleLengthUnit(unit) || isCompositeLengthUnit(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'yd2', 'cm2', 'a', 'da', 'ha', 'ac', 'sf'].includes(unit);
};

// Define the unit values needed for each dropdown
const lengthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft/in', 'm/cm'];
const widthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft/in', 'm/cm'];
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2', 'cm2', 'a', 'da', 'ha', 'ac', 'sf'];
const perimeterUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft/in', 'm/cm'];
const gateWidthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'yd', 'ft/in', 'm/cm'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<SingleLengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'in': 0.0254,     // inches to meters
  'mi': 1609.34,    // miles to meters
  'cm': 0.01,       // centimeters to meters
  'km': 1000,       // kilometers to meters
  'yd': 0.9144      // yards to meters
};

const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'yd2': 0.836127,  // square yards to square meters
  'cm2': 0.0001,    // square centimeters to square meters
  'a': 100,         // ares to square meters
  'da': 1000,       // decares to square meters
  'ha': 10000,      // hectares to square meters
  'ac': 4046.86,    // acres to square meters
  'sf': 0.092903    // square feet to square meters (same as ft2)
};

// Unit conversion helper for single units
const handleUnitConversion = <T extends string>(
  currentUnit: T,
  newUnit: T,
  value: number | string,
  conversionTable: ConversionMap<T>
): number => {
  const numValue = Number(value);
  if (!numValue || isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Format number helper
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

export default function RectangleFencePerimeterCalculator() {
    const [length, setLength] = useState<number | string>("");
    const [lengthUnit, setLengthUnit] = useState<LengthUnitType>("m");
    const [fenceLength, setFenceLength] = useState<number | string>("");
    const [fenceLengthUnit, setFenceLengthUnit] = useState<LengthUnitType>("m");
    const [Width, setWidth] = useState<number | string>("");
    const [WidthUnit, setWidthUnit] = useState<LengthUnitType>("m");
    const [areaUnit, setAreaUnit] = useState<AreaUnitType>("m2");
    const [perimeterUnit, setPerimeterUnit] = useState<LengthUnitType>("m");
    const [area, setArea] = useState<number | string>("");
    const [perimeter, setPerimeter] = useState<number | string>("");
    const [gateWidth, setGateWidth] = useState<number | string>("");
    const [gateWidthUnit, setGateWidthUnit] = useState<LengthUnitType>("m");
    const [showGateWidth, setShowGateWidth] = useState(false);
    
    const handleNumberInput = (value: string, setter: (val: string) => void) => {
        // Allow only digits and a single dot
        let sanitized = value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
          sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setter(sanitized);
    };

    const handleLengthChange = (value: string) => {
        handleNumberInput(value, setLength);
    };

    const handleFenceLengthChange = (value: string) => {
        handleNumberInput(value, setFenceLength);
    };

    const handleWidthChange = (value: string) => {
        handleNumberInput(value, setWidth);
    };

    const handleGateWidthChange = (value: string) => {
        handleNumberInput(value, setGateWidth);
    };

    // Type-safe unit change handlers
    const handleLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!length || length === '') {
            setLengthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(lengthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(lengthUnit, newUnit, Number(length), lengthConversions);
            setLength(result.toFixed(4));
        }
        setLengthUnit(newUnit);
    };

    const handleWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!Width || Width === '') {
            setWidthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(WidthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(WidthUnit, newUnit, Number(Width), lengthConversions);
            setWidth(result.toFixed(4));
        }
        setWidthUnit(newUnit);
    };

    const handleAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        setAreaUnit(newUnitValue);
    };

    const handleFenceLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!fenceLength || fenceLength === '') {
            setFenceLengthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(fenceLengthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(fenceLengthUnit, newUnit, Number(fenceLength), lengthConversions);
            setFenceLength(result.toFixed(4));
        }
        setFenceLengthUnit(newUnit);
    };

    const handleGateWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!gateWidth || gateWidth === '') {
            setGateWidthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(gateWidthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(gateWidthUnit, newUnit, Number(gateWidth), lengthConversions);
            setGateWidth(result.toFixed(4));
        }
        setGateWidthUnit(newUnit);
    };

    const handlePerimeterUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setPerimeterUnit(newUnitValue);
    };

    const calculateArea = () => {
        const lengthNum = parseFloat(length.toString()) || 0;
        const widthNum = parseFloat(Width.toString()) || 0;
        if (lengthNum <= 0 || widthNum <= 0) {
            setArea(0);
            return;
        }

        // Convert to meters using type-safe conversion
        const lengthInMeters = isSingleLengthUnit(lengthUnit)
            ? lengthNum * lengthConversions[lengthUnit]
            : lengthNum; // Handle composite units if needed
        const widthInMeters = isSingleLengthUnit(WidthUnit)
            ? widthNum * lengthConversions[WidthUnit]
            : widthNum; // Handle composite units if needed

        const areaInSquareMeters = lengthInMeters * widthInMeters;

        // Convert to selected unit using type-safe conversion
        const areaDisplay = areaInSquareMeters / areaConversions[areaUnit];
        setArea(areaDisplay);
    };

    const calculatePerimeter = () => {
        const lengthNum = parseFloat(length.toString()) || 0;
        const widthNum = parseFloat(Width.toString()) || 0;
        if (lengthNum <= 0 || widthNum <= 0) {
            setPerimeter(0);
            return;
        }

        // Convert to meters using type-safe conversion
        const lengthInMeters = isSingleLengthUnit(lengthUnit)
            ? lengthNum * lengthConversions[lengthUnit]
            : lengthNum; // Handle composite units if needed
        const widthInMeters = isSingleLengthUnit(WidthUnit)
            ? widthNum * lengthConversions[WidthUnit]
            : widthNum; // Handle composite units if needed

        const perimeterInMeters = (lengthInMeters + widthInMeters) * 2;

        // Convert to selected unit using type-safe conversion
        const perimeterDisplay = isSingleLengthUnit(perimeterUnit)
            ? perimeterInMeters / lengthConversions[perimeterUnit]
            : perimeterInMeters; // Handle composite units if needed
        setPerimeter(perimeterDisplay);
    };

    const calculateFenceLength = () => {
        const perimeterNum = parseFloat(perimeter.toString()) || 0;
        const gateWidthNum = parseFloat(gateWidth.toString()) || 0;
        if (perimeterNum <= 0) {
            setFenceLength(0);
            return;
        }

        // Convert to meters using type-safe conversion
        const perimeterInMeters = isSingleLengthUnit(perimeterUnit)
            ? perimeterNum * lengthConversions[perimeterUnit]
            : perimeterNum; // Handle composite units if needed
        const gateWidthInMeters = isSingleLengthUnit(gateWidthUnit)
            ? gateWidthNum * lengthConversions[gateWidthUnit]
            : gateWidthNum; // Handle composite units if needed

        const fenceLengthInMeters = perimeterInMeters - gateWidthInMeters;

        // Convert to selected unit using type-safe conversion
        const fenceLengthDisplay = isSingleLengthUnit(fenceLengthUnit)
            ? fenceLengthInMeters / lengthConversions[fenceLengthUnit]
            : fenceLengthInMeters; // Handle composite units if needed
        setFenceLength(fenceLengthDisplay);
    };

    const getImgSrc = () => {
        switch (showGateWidth) {
            case true:
                return '/fence-perimeter_01.png';
            case false:
                return '/fence-perimeter_02.png';
            default:
                return null;
        };
    };

    const reloadCalculator = () => {
        setLength('');
        setLengthUnit('m');
        setWidth('');
        setWidthUnit('m');
        setAreaUnit('m2');
        setPerimeterUnit('m');
        setArea('');
        setPerimeter('');
        setGateWidth('');
        setGateWidthUnit('m');
        setShowGateWidth(false);
        setFenceLength('');
        setFenceLengthUnit('m');
    };

    const clearAll = () => {
        setLength('');
        setWidth('');
        setArea('');
        setPerimeter('');
        setGateWidth('');
        setFenceLength('');
    };

    const shareResult = () => {
        const result = `Length: ${length} ${lengthUnit}\nWidth: ${Width} ${WidthUnit}\nArea: ${formatNumber(Number(area))} ${areaUnit}\nPerimeter: ${formatNumber(Number(perimeter))} ${perimeterUnit}\nGate Width: ${gateWidth} ${gateWidthUnit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Rectangle Fence Perimeter Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

      const handleFocus = (value: string | number, e: React.FocusEvent<HTMLInputElement>) => {
        if (value === '' || value === '0') {
          e.target.select();
        }
    };

    useEffect(() => {
        calculateArea();
        calculatePerimeter();
        calculateFenceLength();
    }, [length, lengthUnit, Width, WidthUnit, areaUnit, perimeterUnit, gateWidth, gateWidthUnit, fenceLengthUnit, perimeter]);

    return (
        <div className="flex justify-center">    
            <div className="max-w-4xl mx-auto my-auto py-8">    
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Rectangle Fence Perimeter Calculator 
                        <span className="ml-3 text-2xl">蓠</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            checked={showGateWidth}
                            onChange={() => setShowGateWidth(!showGateWidth)}
                            className="form-checkbox text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                        />
                        <label className="text-sm font-medium text-slate-700">Include gate opening in your fence</label>
                    </div>
                    <div className="mb-6">
                        <img src={getImgSrc() ?? undefined} alt="fence-rectangle" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Length (L)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={length}
                                onChange={(e) => handleLengthChange(e.target.value)}
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Width (W)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={Width}
                                onChange={(e) => handleWidthChange(e.target.value)}
                                onFocus={(e) => handleFocus(Width, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />
                            <UnitDropdown
                                id="width-unit"
                                value={WidthUnit}
                                onChange={(e) => handleWidthUnitChange(e.target.value)}
                                unitValues={widthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Area (A)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(Number(area))}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                id="area-unit"
                                value={areaUnit}
                                onChange={(e) => handleAreaUnitChange(e.target.value)}
                                unitValues={areaUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    {showGateWidth && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Gate Width (G)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={gateWidth}
                                    onChange={(e) => handleGateWidthChange(e.target.value)}
                                    onFocus={(e) => handleFocus(gateWidth, e)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                    min="0"
                                />
                                <UnitDropdown
                                    id="gate-width-unit"
                                    value={gateWidthUnit}
                                    onChange={(e) => handleGateWidthUnitChange(e.target.value)}
                                    unitValues={gateWidthUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                            <div className="mb-6">  
                            <label className="block text-sm font-medium text-slate-700 mb-2">  
                                Fence Length (L)  
                            </label>  
                            <div className="flex gap-2">  
                                <input
                                    type="text"
                                    value={formatNumber(Number(fenceLength))}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    id="fence-length-unit"
                                    value={fenceLengthUnit}
                                    onChange={(e) => handleFenceLengthUnitChange(e.target.value)}
                                    unitValues={perimeterUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>  
                        </div>  
                    </div>
                    )}
                    {!showGateWidth && (
                        <>
                        <div className="mb-6">  
                            <label className="block text-sm font-medium text-slate-700 mb-2">  
                                Fence Perimeter (P)  
                            </label>  
                            <div className="flex gap-2">  
                                <input
                                    type="text"
                                    value={formatNumber(Number(perimeter))}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    id="perimeter-unit"
                                    value={perimeterUnit}
                                    onChange={(e) => handlePerimeterUnitChange(e.target.value)}
                                    unitValues={perimeterUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>  
                        </div> 
                        </>
                    )}
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
