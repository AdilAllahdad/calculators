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

    const calculateCoopSize = () => {
        if (numRegularChickens <= 0 && numBantamChickens <= 0) {
            setCoopSize(0);
            return;
        }
        const coopSizeInSquareMeters = (numRegularChickens * 0.092903) + (numBantamChickens * 0.04572);
        const coopSizeDisplay = convertValue(coopSizeInSquareMeters, 'm2', coopSizeUnit);
        setCoopSize(coopSizeDisplay);
    };

    useEffect(() => {
        calculateCoopSize();
    }, [numRegularChickens, numBantamChickens, coopSizeUnit, chickenLocation]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Chicken Coop Size Calculator</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="mb-6">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        During the day, where are your chickens mostly?
                    </label>
                    <div className="flex gap-2">
                        <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Run"
                                checked={chickenLocation === 'Run'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="mr-2"
                            />
                            <span className='ml-2 text-black'>Run</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Coop"
                                checked={chickenLocation === 'Coop'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="mr-2"
                            />
                            <span className='ml-2 text-black'>Coop</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                type="radio"
                                name="chickenLocation"
                                value="Yard"
                                checked={chickenLocation === 'Yard'} // Check the selected value
                                onChange={(e) => setChickenLocation(e.target.value)} // Update the state on change
                                className="mr-2"
                            />
                            <span className='ml-2 text-black'>Yard</span>
                            </label>
                        </div>
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
            </div>
        </div>
    );
}