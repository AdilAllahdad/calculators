'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type LengthUnitType = 'm' | 'mm' | 'ft' | 'in' | 'cm';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return ['m', 'mm', 'ft', 'in', 'cm'].includes(unit);
};

// Define the unit values needed for each dropdown
const archHeightUnitValues: LengthUnitType[] = ['m', 'mm', 'ft', 'in', 'cm'];
const archLengthUnitValues: LengthUnitType[] = ['m', 'mm', 'ft', 'in', 'cm'];
const f1UnitValues: LengthUnitType[] = ['m', 'mm', 'ft', 'in', 'cm'];
const f2UnitValues: LengthUnitType[] = ['m', 'mm', 'ft', 'in', 'cm'];

// Conversion map (all to meters as base unit)
const lengthConversions: ConversionMap<LengthUnitType> = {
  'm': 1,           // meters (base)
  'mm': 0.001,      // millimeters to meters
  'ft': 0.3048,     // feet to meters
  'in': 0.0254,     // inches to meters
  'cm': 0.01        // centimeters to meters
};

// Unit conversion helper
const handleUnitConversion = (
  currentUnit: LengthUnitType,
  newUnit: LengthUnitType,
  value: string,
  conversionTable: ConversionMap<LengthUnitType>
): number => {
  if (!value) return 0;
  const numValue = Number(value);
  if (isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Format number helper
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

export default function ArchCalculator() {
    const [archHeight, setArchHeight] = useState<string>('');
    const [archHeightUnit, setArchHeightUnit] = useState<LengthUnitType>('m');
    const [archLength, setArchLength] = useState<string>('');
    const [archLengthUnit, setArchLengthUnit] = useState<LengthUnitType>('m');
    const [showFocus, setShowFocus] = useState<boolean>(false);
    const [f1, setF1] = useState<number>(0);
    const [f1Unit, setF1Unit] = useState<LengthUnitType>('m');
    const [f2, setF2] = useState<number>(0);
    const [f2Unit, setF2Unit] = useState<LengthUnitType>('m');
    const [error, setError] = useState<string>('');

    // Unit change handlers with type safety
    const handleArchHeightUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!archHeight || archHeight === '') {
            setArchHeightUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(archHeightUnit, newUnit, archHeight, lengthConversions);
        setArchHeight(result.toFixed(4));
        setArchHeightUnit(newUnit);
    };

    const handleArchLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!archLength || archLength === '') {
            setArchLengthUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(archLengthUnit, newUnit, archLength, lengthConversions);
        setArchLength(result.toFixed(4));
        setArchLengthUnit(newUnit);
    };

    const handleF1UnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setF1Unit(newUnitValue);
    };

    const handleF2UnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        setF2Unit(newUnitValue);
    };

    const validateDimensions = () => {
        const archHeightNum = parseFloat(archHeight);
        const archLengthNum = parseFloat(archLength);

        if (isNaN(archHeightNum) || isNaN(archLengthNum) || archHeightNum <= 0 || archLengthNum <= 0) {
            setError('Both length and height must be greater than 0');
            return false;
        }

        // Convert to meters using type-safe conversion
        const archHeightInM = archHeightNum * lengthConversions[archHeightUnit];
        const archLengthInM = archLengthNum * lengthConversions[archLengthUnit];

        if (archLengthInM <= 2 * archHeightInM) {
            setError('Base length should be greater than twice the arch height for a proper elliptical arch');
            return false;
        }

        setError('');
        return true;
    };

    const calculateFoci = () => {
        const archHeightNum = parseFloat(archHeight);
        const archLengthNum = parseFloat(archLength);

        // Only calculate if both height and length are greater than 0
        if (isNaN(archHeightNum) || isNaN(archLengthNum) || archHeightNum <= 0 || archLengthNum <= 0) {
            setF1(0);
            setF2(0);
            return;
        }

        if (!validateDimensions()) {
            setF1(0);
            setF2(0);
            return;
        }

        // Convert to meters using type-safe conversion
        const archHeightInM = archHeightNum * lengthConversions[archHeightUnit];
        const archLengthInM = archLengthNum * lengthConversions[archLengthUnit];

        // For elliptical arch: focal distance = sqrt(a² - b²)
        // where a = half the base length, b = rise/height
        const a = archLengthInM / 2;  // half the base length
        const b = archHeightInM;      // rise/height

        // Calculate the value under the square root: a² - b²
        const underSqrt = Math.pow(b, 2) - Math.pow(a, 2);  

        // Calculate focal distance (always positive)
        let focalDistance;
        if (underSqrt < 0) {
            // For cases where height > half-base, focal points are imaginary
            focalDistance = Math.sqrt(Math.abs(underSqrt));
        } else {
            focalDistance = Math.sqrt(underSqrt);
        }

        // Check if the result is NaN or invalid (shouldn't happen)
        if (isNaN(focalDistance) || !isFinite(focalDistance)) {
            setF1(0);
            setF2(0);
            return;
        }

        // F1 is to the left of center (negative), F2 is to the right of center (positive)
        const f1Value = -focalDistance;  // Left focus point (negative)
        const f2Value = focalDistance;   // Right focus point (positive)

        // Convert to selected units using type-safe conversion
        const f1Display = f1Value / lengthConversions[f1Unit];
        const f2Display = f2Value / lengthConversions[f2Unit];

        // Ensure the converted values are valid numbers
        setF1(isNaN(f1Display) || !isFinite(f1Display) ? 0 : f1Display);
        setF2(isNaN(f2Display) || !isFinite(f2Display) ? 0 : f2Display);
    };

    // Check if focus sections should be visible
    const shouldShowFocusSections = parseFloat(archHeight) > 0 && parseFloat(archLength) > 0 && !error;

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

    const handleArchHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNumberInput(e.target.value, setArchHeight);
    };

    const handleArchLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNumberInput(e.target.value, setArchLength);
    };



    const reloadCalculator = () => {
        setArchHeight('');
        setArchLength('');
        setF1(0);
        setF2(0);
        setError('');
    };

    const clearAll = () => {
        setArchHeight('');
        setArchLength('');
        setF1(0);
        setF2(0);
        setError('');
    };

    const shareResult = () => {
        const result = `Arch Height: ${archHeight} ${archHeightUnit}\nArch Length: ${archLength} ${archLengthUnit}\nFocus 1: ${f1} ${f1Unit}\nFocus 2: ${f2} ${f2Unit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Arch Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    useEffect(() => {
        calculateFoci();
    }, [archHeight, archHeightUnit, archLength, archLengthUnit, f1Unit, f2Unit]);

    return (
        <div className="flex justify-center">    
            <div className="max-w-4xl mx-auto my-auto py-8">    
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center">
                        Arch Calculator 
                        <span className="ml-3 text-2xl">拱</span>
                    </h1>
                    <p className="text-lg text-slate-700">
                        Calculate arch dimensions and materials.
                    </p>
                </div>
                <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <img src="/arch.png" alt="arch" />
                    <p className='text-sm-center text-slate-700 mb-2'>Enter values of <b>base length</b> and <b>rise</b> of the desired arch</p>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Length of the Arch (base)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                inputMode="decimal"
                                pattern="[0-9]*[.,]?[0-9]*"
                                value={archLength}
                                onChange={handleArchLengthChange}
                                onFocus={(e) => handleFocus(archLength, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                placeholder='Enter Length'
                            />
                            <UnitDropdown
                                value={archLengthUnit}
                                onChange={(e) => handleArchLengthUnitChange(e.target.value)}
                                unitValues={archLengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Height of the Arch (rise)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                inputMode="decimal"
                                pattern="[0-9]*[.,]?[0-9]*"
                                value={archHeight}
                                onChange={handleArchHeightChange}
                                onFocus={(e) => handleFocus(archHeight, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                placeholder='Enter Height'
                            />
                            <UnitDropdown
                                value={archHeightUnit}
                                onChange={(e) => handleArchHeightUnitChange(e.target.value)}
                                unitValues={archHeightUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className='bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
              <h2 className='text-xl font-semibold text-slate-800'>Focus</h2>
              <a onClick={() => setShowFocus(!showFocus)}>
                {showFocus ? (
                  <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
            </div>
            {showFocus && (
                <div>
                    {shouldShowFocusSections && (  
                            <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Position of focus 1 (F1)
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="number"
                                    value={isNaN(f1) || !isFinite(f1) ? '' : formatNumber(f1)}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    value={f1Unit}
                                    onChange={(e) => handleF1UnitChange(e.target.value)}
                                    unitValues={f1UnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Position of focus 2 (F2)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={isNaN(f2) || !isFinite(f2) ? '' : formatNumber(f2)}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    value={f2Unit}
                                    onChange={(e) => handleF2UnitChange(e.target.value)}
                                    unitValues={f2UnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                )}
                <p className='text-md font-semibold text-slate-800 mt-8 mb-4'>To draw the arch's outline:</p>
                <div className=''>
                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='text-sm font-medium text-slate-600'>Draw a line from the focus to the base of the arch.</li>
                        <li className='text-sm font-medium text-slate-600'>Draw a line from the focus to the top of the arch.</li>
                        <li className='text-sm font-medium text-slate-600'>Draw a line from the base of the arch to the top of the arch.</li>
                    </ol>
                </div>
                <img src="/drawing_an_ellipse.png" alt="ellipse-draw" className='mt-8' />
                <hr className='border-black opacity-10' />
             </div>
            )}
             <div className='bg-white p-6 w-full max-w-lg'>
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
    </div>  
    );
}
