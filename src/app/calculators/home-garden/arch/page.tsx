'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const archHeightUnitValues = ['m', 'mm', 'ft', 'in', 'cm'];
const archLengthUnitValues = ['m', 'mm', 'ft', 'in', 'cm'];

const f1UnitValues = ['m', 'mm', 'ft', 'in', 'cm'];
const f2UnitValues = ['m', 'mm', 'ft', 'in', 'cm'];

export default function ArchCalculator() {
    const [archHeight, setArchHeight] = useState<number>(0);
    const [archHeightUnit, setArchHeightUnit] = useState<string>('m');
    const [archLength, setArchLength] = useState<number>(0);
    const [archLengthUnit, setArchLengthUnit] = useState<string>('m');
    const [showFocus, setShowFocus] = useState<boolean>(false);
    const [f1, setF1] = useState<number>(0);
    const [f1Unit, setF1Unit] = useState<string>('m');
    const [f2, setF2] = useState<number>(0);
    const [f2Unit, setF2Unit] = useState<string>('m');
    const [error, setError] = useState<string>('');

    const validateDimensions = () => {
        const archHeightInM = convertValue(archHeight, archHeightUnit, 'm');
        const archLengthInM = convertValue(archLength, archLengthUnit, 'm');

        if (archLengthInM <= 0 || archHeightInM <= 0) {
            setError('Both length and height must be greater than 0');
            return false;
        }

        if (archLengthInM <= archHeightInM) {
            setError('Base length must be greater than the arch height');
            return false;
        }

        setError('');
        return true;
    };

    const calculateFoci = () => {
        // Only calculate if both height and length are greater than 0
        if (archHeight <= 0 || archLength <= 0) {
            setF1(0);
            setF2(0);
            return;
        }

        if (!validateDimensions()) {
            setF1(0);
            setF2(0);
            return;
        }

        const archHeightInM = convertValue(archHeight, archHeightUnit, 'm');
        const archLengthInM = convertValue(archLength, archLengthUnit, 'm');

        // Calculate the value under the square root
        const underSqrt = Math.pow(archHeightInM, 2) - Math.pow(archLengthInM / 2, 2);

        // Calculate foci positions (allow negative values)
        let fociValue;
        if (underSqrt < 0) {
            // For negative values under square root, calculate as imaginary and return negative
            fociValue = -Math.sqrt(Math.abs(underSqrt));
        } else {
            fociValue = Math.sqrt(underSqrt);
        }

        // Check if the result is NaN or invalid (shouldn't happen)
        if (isNaN(fociValue) || !isFinite(fociValue)) {
            setF1(0);
            setF2(0);
            return;
        }

        // Convert to selected units
        const f1Display = convertValue(fociValue, 'm', f1Unit);
        const f2Display = convertValue(fociValue, 'm', f2Unit);

        // Ensure the converted values are valid numbers and round them
        setF1(isNaN(f1Display) || !isFinite(f1Display) ? 0 : Math.round(f1Display * 100) / 100);
        setF2(isNaN(f2Display) || !isFinite(f2Display) ? 0 : Math.round(f2Display * 100) / 100);
    };

    // Check if focus sections should be visible
    const shouldShowFocusSections = archHeight > 0 && archLength > 0 && showFocus;

    const handleArchHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow empty string or valid numbers (including decimals)
        if (inputValue === '' || (!isNaN(Number(inputValue)) && inputValue !== '.')) {
            setArchHeight(inputValue === '' ? 0 : Number(inputValue));
        }
    };

    const handleArchHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setArchHeightUnit(e.target.value);
    };

    const handleArchLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow empty string or valid numbers (including decimals)
        if (inputValue === '' || (!isNaN(Number(inputValue)) && inputValue !== '.')) {
            setArchLength(inputValue === '' ? 0 : Number(inputValue));
        }
    };

    const handleArchLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setArchLengthUnit(e.target.value);
    };

    const handleF1UnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setF1Unit(e.target.value);
    };

    const handleF2UnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setF2Unit(e.target.value);
    };

    const handleFocus = (currentValue: number, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === 0) {
          e.target.select();
        }
    };

    const reloadCalculator = () => {
        setArchHeight(0);
        setArchLength(0);
        setF1(0);
        setF2(0);
    };

    const clearAll = () => {
        setArchHeight(0);
        setArchLength(0);
        setF1(0);
        setF2(0);
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
                                type="number"
                                value={isNaN(archLength) || !isFinite(archLength) ? '' : archLength}
                                onChange={handleArchLengthChange}
                                onFocus={(e) => handleFocus(archLength, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                step="0.01"
                                placeholder='Enter Length'
                            />
                            <UnitDropdown
                                value={archLengthUnit}
                                onChange={handleArchLengthUnitChange}
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
                                type="number"
                                value={isNaN(archHeight) || !isFinite(archHeight) ? '' : archHeight}
                                onChange={handleArchHeightChange}
                                onFocus={(e) => handleFocus(archHeight, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                step="0.01"
                                placeholder='Enter Height'
                            />
                            <UnitDropdown
                                value={archHeightUnit}
                                onChange={handleArchHeightUnitChange}
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
                                    value={isNaN(f1) || !isFinite(f1) ? 0 : f1}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    value={f1Unit}
                                    onChange={handleF1UnitChange}
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
                                    value={isNaN(f2) || !isFinite(f2) ? 0 : f2}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                />
                                <UnitDropdown
                                    value={f2Unit}
                                    onChange={handleF2UnitChange}
                                    unitValues={f2UnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                )}
                <p className='text-md font-semibold text-slate-800 mt-8 mb-4'>To draw the archs outline:</p>
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
