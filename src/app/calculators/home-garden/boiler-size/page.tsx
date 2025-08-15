'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

export default function BoilerSizeCalculator() {
    const [boilerType, setBoilerType] = useState<string>('Combi');
    const [ageOfProperty, setAgeOfProperty] = useState<string>('pre 1900 (poorly insulated)');
    const [numBathrooms, setNumBathrooms] = useState<number>(1);
    const [numBedrooms, setNumBedrooms] = useState<number>(1);
    const [boilerSize, setBoilerSize] = useState<number>(0);
    const calculateBoilerSize = () => {
        let baseSize = 0;

        // Much lower base sizes to match realistic outputs
        switch (boilerType) {
            case 'Combi': baseSize = 4; break;
            case 'System': baseSize = 4; break;
            case 'Heat Only': baseSize = 4; break;
        }

        // More conservative adjustments for property age
        switch (ageOfProperty) {
            case 'pre 1900 (poorly insulated)': baseSize *= 1.75; break;
            case '1920-1930s (some insulated)': baseSize *= 1.75; break;
            case '1950-1980s (moderately insulated)': baseSize *= 1.25; break;
            case '1990s (reasonably insulated)': baseSize *= 1.1; break;
            case '2000 onwards (well insulated)': baseSize *= 1; break;
        }

        // Smaller adjustments for bedrooms and bathrooms
        if (boilerType === 'Combi') {
            baseSize += (numBathrooms - 1) * 1;
        }
        baseSize += (numBedrooms - 1) * 1;

        setBoilerSize(baseSize);
    };

    // Realistic boiler sizing calculations to match Omni results
    const getHeatingOutputKw = (boilerSize: number) => {
        // Direct conversion - the calculated size IS the heating output
        return Math.round(boilerSize);
    };

    const getHotWaterLPM = (boilerSize: number) => {
        // LPM calculation for combi boilers
        const baseLPM = Math.round(boilerSize * 1.3);
        const maxLPM = Math.round(boilerSize * 1.7);
        return { min: baseLPM, max: maxLPM };
    };

    const getBoilerSizeKw = (boilerSize: number) => {
        // Total boiler size - direct conversion with small range
        const baseKw = Math.round(boilerSize);
        return baseKw;
    };

    const clearAll = () => {
        setBoilerType('Combi');
        setAgeOfProperty('pre 1900 (poorly insulated)');
        setNumBathrooms(1);
        setNumBedrooms(1);
        setBoilerSize(0);
    };

    const reloadCalculator = () => {
        setBoilerType('Combi');
        setAgeOfProperty('pre 1900 (poorly insulated)');
        setNumBathrooms(1);
        setNumBedrooms(1);
        setBoilerSize(0);
    };

    const shareResult = () => {
        const result = `Boiler Type: ${boilerType}\nAge of Property: ${ageOfProperty}\nNumber of Bathrooms: ${numBathrooms}\nNumber of Bedrooms: ${numBedrooms}\nBoiler Size: ${boilerSize} kW`;
        if (navigator.share) {
          navigator.share({
            title: 'Boiler Size Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    // Check if Combi is selected
    const isCombiSelected = boilerType === 'Combi';

    useEffect(() => {
        calculateBoilerSize();
    }, [boilerType, ageOfProperty, numBathrooms, numBedrooms]);

    return (
        <div className="flex justify-center">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl text-slate-800 font-bold mb-4">Boiler Size Calculator</h1>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Boiler Type
                    </label>
                    <div className="flex flex-col gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="Combi"
                                checked={boilerType === 'Combi'}
                                onChange={(e) => setBoilerType(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">Combi</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="Heat Only"
                                checked={boilerType === 'Heat Only'}
                                onChange={(e) => setBoilerType(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">Heat Only</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="System"
                                checked={boilerType === 'System'}
                                onChange={(e) => setBoilerType(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">System</span>
                        </label>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Age of Property
                    </label>
                    <div className="flex flex-col gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="pre 1900 (poorly insulated)"
                                checked={ageOfProperty === 'pre 1900 (poorly insulated)'}
                                onChange={(e) => setAgeOfProperty(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">pre 1900 (poorly insulated)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="1920-1930s (some insulated)"
                                checked={ageOfProperty === '1920-1930s (some insulated)'}
                                onChange={(e) => setAgeOfProperty(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">1920-1930s (some insulated)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="1950-1980s (moderately insulated)"
                                checked={ageOfProperty === '1950-1980s (moderately insulated)'}
                                onChange={(e) => setAgeOfProperty(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">1950-1980s (moderately insulated)</span>
                        </label>
                        <label className="inline-flex items-center">    
                            <input
                                type="radio"
                                value="1990s (reasonably insulated)"
                                checked={ageOfProperty === '1990s (reasonably insulated)'}
                                onChange={(e) => setAgeOfProperty(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">1990s (reasonably insulated)</span>
                        </label>
                        <label className="inline-flex items-center">    
                            <input
                                type="radio"
                                value="2000 onwards (well insulated)"
                                checked={ageOfProperty === '2000 onwards (well insulated)'}
                                onChange={(e) => setAgeOfProperty(e.target.value)}
                                className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <span className="ml-2 text-black">2000 onwards (well insulated)</span>
                        </label>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {isCombiSelected ? 'Number of Bedrooms and Bathrooms (for Combi)' : 'Number of Bedrooms (for Heat Only and System)'}
                    </label>
                    <div className="flex gap-2">
                        {isCombiSelected ? (
                            <>
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Bedrooms</label>
                                    <select 
                                        className="p-2 border border-slate-300 rounded-md"
                                        onChange={(e) => setNumBedrooms(parseInt(e.target.value))}
                                        value={numBedrooms}
                                    >
                                        <option value="1">1 bedrooms</option>
                                        <option value="2">2 bedrooms</option>
                                        <option value="3">3 bedrooms</option>
                                        <option value="4">4 bedrooms</option>
                                        <option value="5">5 bedrooms</option>
                                        <option value="6">5+ bedrooms</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Bathrooms</label>
                                    <select 
                                        className="p-2 border border-slate-300 rounded-md"
                                        onChange={(e) => setNumBathrooms(parseInt(e.target.value))}
                                        value={numBathrooms}
                                    >
                                        <option value="1">1 bathrooms</option>
                                        <option value="2">2 bathrooms</option>
                                        <option value="3">3 bathrooms</option>
                                        <option value="4">4 bathrooms</option>
                                        <option value="5">5 bathrooms</option>
                                        <option value="6">5+ bathrooms</option>                                         
                                    </select>
                                </div>
                            </div>
                            </>
                        ): (
                            <>
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Bedrooms</label>
                                    <select 
                                        className="p-2 border border-slate-300 rounded-md"
                                        onChange={(e) => setNumBedrooms(parseInt(e.target.value))}
                                        value={numBedrooms}
                                    >
                                        <option value="1">1 bedrooms</option>
                                        <option value="2">2 bedrooms</option>
                                        <option value="3">3 bedrooms</option>   
                                        <option value="4">4 bedrooms</option>
                                        <option value="5">5 bedrooms</option>
                                        <option value="6">5+ bedrooms</option>
                                    </select>
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Results Section */}
                <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-slate-800 mb-4'>Results</h2>

                    {isCombiSelected && (
                        <>
                            <p className='text-base font-medium text-slate-700 mb-3'>
                                Given your preferences, your minimum combi boiler heating output is:
                            </p>
                            <div className='bg-slate-100 p-4 rounded-lg mb-4'>
                                <p className='text-lg font-bold text-slate-800'>
                                    {getHeatingOutputKw(boilerSize)} kW / {getHotWaterLPM(boilerSize).min}-{getHotWaterLPM(boilerSize).max} LPM
                                </p>
                            </div>
                        </>
                    )}

                    {!isCombiSelected && (
                        <>
                            <p className='text-base font-medium text-slate-700 mb-3'>
                                Given your preferences, your minimum boiler size is:
                            </p>
                            <div className='bg-slate-100 p-4 rounded-lg mb-4'>
                                <p className='text-lg font-bold text-slate-800'>
                                    {getBoilerSizeKw(boilerSize)} kW
                                </p>
                            </div>
                        </>
                    )}

                    {isCombiSelected && (
                        <>
                            <p className='text-base font-medium text-slate-700 mb-3'>
                        Your minimum {isCombiSelected ? 'combi ' : ''}boiler size is:
                    </p>
                    <div className='bg-slate-100 p-4 rounded-lg mb-4'>
                        <p className='text-lg font-bold text-slate-800'>
                            {getBoilerSizeKw(boilerSize)}-{getBoilerSizeKw(boilerSize) + 2} kW
                        </p>
                    </div>
                        </>
                    )}

                    {isCombiSelected && (
                        <div className='text-sm text-slate-600 mt-4 space-y-2'>
                            <p>
                                <em>The LPM (liters per minute) value indicates how quickly the boiler can provide hot water.</em>
                            </p>
                            <p>
                                <strong>Higher LPM means better performance for homes with multiple bathrooms</strong>, as running two showers at once will halve the flow rate.
                            </p>
                        </div>
                    )}
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
                            <button
                                onClick={clearAll}
                                className="col-span-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
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
