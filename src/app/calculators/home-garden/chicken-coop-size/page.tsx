'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const coopSizeUnitValues = ['m2', 'ft2', 'yd2'];

export default function ChickenCoopSizeCalculator() {
    const [coopSize,setCoopSize] = useState<number>(0);
    const [chickenLocation, setChickenLocation] = useState<string>('Run'); // Default to Run for now
    const [coopSizeUnit,setCoopSizeUnit] = useState<string>('m2');
    const [numRegularChickens,setNumRegularChickens] = useState<number>(0);
    const [numBantamChickens,setNumBantamChickens] = useState<number>(0);
    const [recommendedCoopSizeDisplay, setRecommendedCoopSizeDisplay] = useState<boolean>(false);

    const calculateCoopSize = () => {
        if (numRegularChickens <= 0 && numBantamChickens <= 0) {
            setCoopSize(0);
            return;
        }
        // Updated space requirements: 0.37161 m² (4 ft²) for regular chickens and 0.18581 m² (2 ft²) for bantams
        const coopSizeInSquareMeters = (numRegularChickens * 0.37161) + (numBantamChickens * 0.18581);
        const coopSizeDisplay = convertValue(coopSizeInSquareMeters, 'm2', coopSizeUnit);
        setCoopSize(coopSizeDisplay);
    };

    const recCoopSizeDisplay = () => {
        if (numRegularChickens > 0 || numBantamChickens > 0) {  // Changed to show if either type of chicken is present
            setRecommendedCoopSizeDisplay(true);
        } else {
            setRecommendedCoopSizeDisplay(false);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const clearAll = () => {
        setNumRegularChickens(0);
        setNumBantamChickens(0);
        setCoopSize(0);
    };

    const reloadCalculator = () => {
        setNumRegularChickens(0);
        setNumBantamChickens(0);
        setCoopSize(0);
    };

    const shareResult = () => {
        const result = `Number of Regular Chickens: ${numRegularChickens}\nNumber of Bantam Chickens: ${numBantamChickens}\nRecommended Coop Size: ${coopSize} ${coopSizeUnit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Chicken Coop Size Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    useEffect(() => {
        calculateCoopSize();
        recCoopSizeDisplay();
    }, [numRegularChickens, numBantamChickens, coopSizeUnit, chickenLocation]);

    return (
        <div className="flex justify-center">
        <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-slate-800">Chicken Coop Size Calculator</h1>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            During the day, where are your chickens mostly?
                        </label>
                        <div className="flex flex-col gap-4">
                            <label className="inline-flex">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Run"
                                checked={chickenLocation === 'Run'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">Run</span>
                            </label>
                            <label className="inline-flex">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Coop"
                                checked={chickenLocation === 'Coop'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className='ml-2 text-black'>Coop</span>
                            </label>
                            <label className="inline-flex">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Yard"
                                checked={chickenLocation === 'Yard'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className='ml-2 text-black'>Yard</span>
                            </label>
                        </div>
                </div>
                <div className="mb-6">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        How many regular chickens do you have?
                    </label>
                    <input
                        type="number"
                        value={numRegularChickens}
                        onChange={(e) => setNumRegularChickens(Number(e.target.value) || 0)}
                        onFocus={(e) => { if (numRegularChickens === 0) e.target.select(); }}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        min="0"
                    />
                </div>
                <div className="mb-6">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        How many bantam chickens do you have?
                    </label>
                    <input
                        type="number"
                        value={numBantamChickens}
                        onChange={(e) => setNumBantamChickens(Number(e.target.value) || 0)}
                        onFocus={(e) => { if (numBantamChickens === 0) e.target.select(); }}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        min="0"
                    />
                </div>
                {recommendedCoopSizeDisplay && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Recommended Coop Size</h3>
                        <p className="text-base font-medium text-slate-700 mb-3">
                            Based on the number of chickens you have, we recommend a coop size of:
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={coopSize.toFixed(coopSizeUnit === 'm2' ? 2 : 0)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                            />
                            <UnitDropdown
                                value={coopSizeUnit}
                                onChange={(e) => setCoopSizeUnit(e.target.value)}
                                unitValues={coopSizeUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
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