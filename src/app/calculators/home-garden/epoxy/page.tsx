'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const inputUnitvalues = ['mm', 'cm', 'm', 'in', 'ft', 'ft-in', 'm-cm'];
const volumeUnitvalues = ['mm3', 'cm3', 'm3', 'in3', 'ft3', 'yd3', 'cu in', 'cu ft', 'l', 'gal', 'ml', 'US fl oz', 'UK fl oz' ];

export default function EpoxyCalculator() {
    const [coatingDepth, setCoatingDepth] = useState<string>('');
    const [coatingDepthUnit, setCoatingDepthUnit] = useState<string>('mm');
    const [surfaceShape, setSurfaceShape] = useState<string>('rectangle');
    const [surfaceLength, setSurfaceLength] = useState<string>('');
    const [surfaceLengthUnit, setSurfaceLengthUnit] = useState<string>('m');
    const [surfaceWidth, setSurfaceWidth] = useState<string>('');
    const [surfaceWidthUnit, setSurfaceWidthUnit] = useState<string>('m');
    const [surfaceDiameter, setSurfaceDiameter] = useState<string>('');
    const [surfaceDiameterUnit, setSurfaceDiameterUnit] = useState<string>('m');
    const [volume, setVolume] = useState<number>(0);
    const [volumeUnit, setVolumeUnit] = useState<string>('m3');

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
        const depth = parseFloat(coatingDepth) || 0;
        const length = parseFloat(surfaceLength) || 0;
        const width = parseFloat(surfaceWidth) || 0;
        const diameter = parseFloat(surfaceDiameter) || 0;

        if (depth <= 0 || (length <= 0 && width <= 0 && diameter <= 0)) {
            setVolume(0);
            return;
        }

        let volumeInCubicMeters = 0;

        if (length > 0 && width > 0) {
            const lengthInMeters = convertValue(length, surfaceLengthUnit, 'm');
            const widthInMeters = convertValue(width, surfaceWidthUnit, 'm');
            const depthInMeters = convertValue(depth, coatingDepthUnit, 'm');
            volumeInCubicMeters = lengthInMeters * widthInMeters * depthInMeters;
        } else if (diameter > 0) {
            const diameterInMeters = convertValue(diameter, surfaceDiameterUnit, 'm');
            const depthInMeters = convertValue(depth, coatingDepthUnit, 'm');
            volumeInCubicMeters = Math.PI * Math.pow(diameterInMeters / 2, 2) * depthInMeters;
        }

        const volumeDisplay = convertValue(volumeInCubicMeters, 'm3', volumeUnit);
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
                                onChange={(e) => setCoatingDepthUnit(e.target.value)}
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
                                        onChange={(e) => setSurfaceLengthUnit(e.target.value)}
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
                                        onChange={(e) => setSurfaceWidthUnit(e.target.value)}
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
                                        onChange={(e) => setSurfaceDiameterUnit(e.target.value)}
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
                                onChange={(e) => setVolumeUnit(e.target.value)}
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