'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type LengthUnitType = 'mm' | 'in' | 'cm';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return ['mm', 'in', 'cm'].includes(unit);
};

// Define the unit values needed for each dropdown
const fastenerDiameterUnitValues: LengthUnitType[] = ['mm', 'in', 'cm'];
const fastenerHeadUnitValues: LengthUnitType[] = ['mm', 'in', 'cm'];
const clearanceHoleUnitValues: LengthUnitType[] = ['mm', 'in', 'cm'];

// Conversion map (all to millimeters as base unit)
const lengthConversions: ConversionMap<LengthUnitType> = {
  'mm': 1,          // millimeters (base)
  'in': 25.4,       // inches to millimeters
  'cm': 10          // centimeters to millimeters
};

// Unit conversion helper
const handleUnitConversion = (
  currentUnit: LengthUnitType,
  newUnit: LengthUnitType,
  value: number,
  conversionTable: ConversionMap<LengthUnitType>
): number => {
  if (!value) return 0;
  const standardValue = value * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

export default function ClearanceHoleCalculator() {
    const [fastenerDiameter, setFastenerDiameter] = useState<number | null>(null);
    const [fastenerDiameterUnit, setFastenerDiameterUnit] = useState<LengthUnitType>('mm');
    const [fastenerHead, setFastenerHead] = useState<number | null>(null);
    const [fastenerHeadUnit, setFastenerHeadUnit] = useState<LengthUnitType>('mm');
    const [clearanceHole, setClearanceHole] = useState<number | null>(null);
    const [clearanceHoleUnit, setClearanceHoleUnit] = useState<LengthUnitType>('mm');
    const [error, setError] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    // Unit change handlers with type safety
    const handleFastenerDiameterUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (fastenerDiameter === null) {
            setFastenerDiameterUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(fastenerDiameterUnit, newUnit, fastenerDiameter, lengthConversions);
        setFastenerDiameter(Number(result.toFixed(4)));
        setFastenerDiameterUnit(newUnit);
    };

    const handleFastenerHeadUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (fastenerHead === null) {
            setFastenerHeadUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(fastenerHeadUnit, newUnit, fastenerHead, lengthConversions);
        setFastenerHead(Number(result.toFixed(4)));
        setFastenerHeadUnit(newUnit);
    };

    const handleClearanceHoleUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (clearanceHole === null) {
            setClearanceHoleUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(clearanceHoleUnit, newUnit, clearanceHole, lengthConversions);
        setClearanceHole(Number(result.toFixed(4)));
        setClearanceHoleUnit(newUnit);
    };

    const handleNumberInput = (value: string, setValue: React.Dispatch<React.SetStateAction<number | null>>) => {
        if (value === '') {
            setValue(null);
        } else {
            const cleanValue = value.replace(/^0+/, '') || '0';
            setValue(Number(cleanValue) || null);
        }
    };

    const handleFocus = (currentValue: number | null, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === null) {
            e.target.select();
        }
    };

    const calculateClearanceHole = () => {
        if (fastenerDiameter === null || fastenerHead === null) {
            setClearanceHole(null);
            setError('');
            setShowError(false);
            return;
        }

        // Convert to millimeters using type-safe conversion
        const fastenerDiameterInMM = fastenerDiameter * lengthConversions[fastenerDiameterUnit];
        const fastenerHeadInMM = fastenerHead * lengthConversions[fastenerHeadUnit];

        // ✅ Error check only when entering Fastener Head
        if (fastenerHead !== null && (fastenerDiameterInMM >= fastenerHeadInMM || fastenerHeadInMM <= 0)) {
            setError('Fastener head must be greater than fastener diameter');
            setShowError(true);
            setClearanceHole(null);
            return;
        }

        setError('');
        setShowError(false);

        const clearanceHoleInMM = (fastenerDiameterInMM + fastenerHeadInMM) / 2;

        // Convert to selected unit using type-safe conversion
        const clearanceHoleDisplay = clearanceHoleInMM / lengthConversions[clearanceHoleUnit];
        setClearanceHole(clearanceHoleDisplay);
    };

    useEffect(() => {
        calculateClearanceHole();
    }, [fastenerDiameter, fastenerDiameterUnit, fastenerHead, fastenerHeadUnit, clearanceHoleUnit]);

    const clearAll = () => {
        setFastenerDiameter(null);
        setFastenerHead(null);
        setClearanceHole(null);
        setError('');
        setShowError(false);
    };

    const reloadCalculator = () => {
        clearAll();
    };

    const shareResult = () => {
        const result = `Fastener Diameter: ${fastenerDiameter ?? '-'} ${fastenerDiameterUnit}\nFastener Head: ${fastenerHead ?? '-'} ${fastenerHeadUnit}\nClearance Hole: ${clearanceHole ?? '-'} ${clearanceHoleUnit}`;
        if (navigator.share) {
            navigator.share({
                title: 'Clearance Hole Calculator Result',
                text: result
            });
        } else {
            navigator.clipboard.writeText(result);
            alert('Result copied to clipboard!');
        }
    };

    return (
        <div className="flex justify-center">
            <div className='max-w-4xl mx-auto'>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Clearance Hole Calculator 
                        <span className="ml-3 text-2xl">🕳️</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    {showError && error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    <h2 className="text-xl font-semibold mb-6 text-slate-800">Inputs</h2>
                    
                    {/* Fastener Diameter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fastener Diameter
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={fastenerDiameter ?? ''}
                                onChange={(e) => handleNumberInput(e.target.value, setFastenerDiameter)}
                                onFocus={(e) => handleFocus(fastenerDiameter, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                placeholder="Enter fastener diameter"
                            />
                            <UnitDropdown
                                value={fastenerDiameterUnit}
                                onChange={(e) => handleFastenerDiameterUnitChange(e.target.value)}
                                unitValues={fastenerDiameterUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                            />
                        </div>
                    </div>

                    {/* Fastener Head */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fastener Head
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={fastenerHead ?? ''}
                                onChange={(e) => handleNumberInput(e.target.value, setFastenerHead)}
                                onFocus={(e) => handleFocus(fastenerHead, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                placeholder="Enter fastener head"
                            />
                            <UnitDropdown
                                value={fastenerHeadUnit}
                                onChange={(e) => handleFastenerHeadUnitChange(e.target.value)}
                                unitValues={fastenerHeadUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                            />
                        </div>
                    </div>

                    {/* Clearance Hole */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Clearance Hole
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={clearanceHole ?? ''}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                placeholder="Result will appear here"
                            />
                            <UnitDropdown
                                value={clearanceHoleUnit}
                                onChange={(e) => handleClearanceHoleUnitChange(e.target.value)}
                                unitValues={clearanceHoleUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                            />
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
