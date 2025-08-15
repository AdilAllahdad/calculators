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
    const [f1Visibility, setF1Visibility] = useState<boolean>(false);
    const [f2Visibility, setF2Visibility] = useState<boolean>(false);
    const [f1, setF1] = useState<number>(0);
    const [f1Unit, setF1Unit] = useState<string>('m');
    const [f2, setF2] = useState<number>(0);
    const [f2Unit, setF2Unit] = useState<string>('m');
    const [focusVisibility, setFocusVisibility] = useState<boolean>(false);

    const calculateF1 = () => {
        // Convert arch height to meters using convertValue
        const archHeightInM = convertValue(archHeight, archHeightUnit, 'm');

        // Convert arch length to meters using convertValue
        const archLengthInM = convertValue(archLength, archLengthUnit, 'm');

        // Calculate f1
        const f1Value = Math.sqrt(Math.pow(archHeightInM, 2) - Math.pow(archLengthInM / 2, 2));

        // Convert f1 to selected unit
        const f1Display = convertValue(f1Value, 'm', f1Unit);

        setF1(f1Display);
    }

    const calculateF2 = () => {
        // Convert arch height to meters using convertValue
        const archHeightInM = convertValue(archHeight, archHeightUnit, 'm');

        // Convert arch length to meters using convertValue
        const archLengthInM = convertValue(archLength, archLengthUnit, 'm');

        // Calculate f2
        const f2Value = Math.sqrt(Math.pow(archHeightInM, 2) - Math.pow(archLengthInM / 2, 2));

        // Convert f2 to selected unit
        const f2Display = convertValue(f2Value, 'm', f2Unit);

        setF2(f2Display);
    }

    const handleArchHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        setArchHeight(value);
    };

    const handleArchHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setArchHeightUnit(e.target.value);
    };

    const handleArchLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        setArchLength(value);
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

    const handleF1Visibility = () => {
        setF1Visibility(!f1Visibility);
    };

    const handleF2Visibility = () => {
        setF2Visibility(!f2Visibility);
    };

    const handleFocusVisibility = () => {
        setFocusVisibility(!focusVisibility);
    };

    useEffect(() => {
        calculateF1();
        calculateF2();
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Height of the Arch (rise)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={archHeight}
                                onChange={handleArchHeightChange}
                                onFocus={(e) => handleFocus(archHeight, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                step="0.01"
                                min="0"
                            />
                            <UnitDropdown
                                value={archHeightUnit}
                                onChange={handleArchHeightUnitChange}
                                unitValues={archHeightUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Length of the Arch (base)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={archLength}
                                onChange={handleArchLengthChange}
                                onFocus={(e) => handleFocus(archLength, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                step="0.01"
                                min="0"
                            />
                            <UnitDropdown
                                value={archLengthUnit}
                                onChange={handleArchLengthUnitChange}
                                unitValues={archLengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className='bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className='text-xl font-semibold text-slate-800'>Focus</h2>
                        <button onClick={handleFocusVisibility}>
                            {focusVisibility ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>    
    );
}