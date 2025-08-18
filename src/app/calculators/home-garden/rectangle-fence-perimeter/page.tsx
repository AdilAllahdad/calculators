'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const lengthUnitValues = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const widthUnitValues = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const areaUnitValues = ['m2', 'ft2', 'yd2', 'cm2', 'a', 'da', 'ha', 'ac', 'sf'];
const perimeterUnitValues = ['m', 'ft', 'in', 'mi', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const gateWidthUnitValues = ['m', 'ft', 'in', 'cm', 'yd', 'ft in', 'm cm'];

export default function RectangleFencePerimeterCalculator() {
    const [length, setLength] = useState<number | string>("");
    const [lengthUnit, setLengthUnit] = useState("m");
    const [fenceLength, setFenceLength] = useState<number | string>("");
    const [fenceLengthUnit, setFenceLengthUnit] = useState("m");
    const [Width, setWidth] = useState<number | string>("");
    const [WidthUnit, setWidthUnit] = useState("m");
    const [areaUnit, setAreaUnit] = useState("m2");
    const [perimeterUnit, setPerimeterUnit] = useState("m");
    const [area, setArea] = useState<number | string>("");
    const [perimeter, setPerimeter] = useState<number | string>("");
    const [gateWidth, setGateWidth] = useState<number | string>("");
    const [gateWidthUnit, setGateWidthUnit] = useState("m");
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

    const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLengthUnit(e.target.value);
    };

    const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWidthUnit(e.target.value);
    };

    const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAreaUnit(e.target.value);
    };

    const handleFenceLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFenceLengthUnit(e.target.value);
    };

    const handleGateWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGateWidthUnit(e.target.value);
    };

    const handlePerimeterUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerimeterUnit(e.target.value);
    };

    const calculateArea = () => {   
        const lengthNum = parseFloat(length.toString()) || 0;
        const widthNum = parseFloat(Width.toString()) || 0;
        if (lengthNum <= 0 || widthNum <= 0) {
            setArea(0);
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        const widthInMeters = convertValue(widthNum, WidthUnit, 'm');
        const areaInSquareMeters = lengthInMeters * widthInMeters;
        const areaDisplay = convertValue(areaInSquareMeters, 'm2', areaUnit);
        setArea(areaDisplay);
    };

    const calculatePerimeter = () => {
        const lengthNum = parseFloat(length.toString()) || 0;
        const widthNum = parseFloat(Width.toString()) || 0;
        if (lengthNum <= 0 || widthNum <= 0) {
            setPerimeter(0);
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        const widthInMeters = convertValue(widthNum, WidthUnit, 'm');
        const perimeterInMeters = (lengthInMeters + widthInMeters) * 2;
        const perimeterDisplay = convertValue(perimeterInMeters, 'm', perimeterUnit);
        setPerimeter(perimeterDisplay);
    };

    const calculateFenceLength = () => {
        const perimeterNum = parseFloat(perimeter.toString()) || 0;
        const gateWidthNum = parseFloat(gateWidth.toString()) || 0;
        if (perimeterNum <= 0) {
            setFenceLength(0);
            return;
        }
        const perimeterInMeters = convertValue(perimeterNum, perimeterUnit, 'm');
        const gateWidthInMeters = convertValue(gateWidthNum, gateWidthUnit, 'm');
        const fenceLengthInMeters = perimeterInMeters - gateWidthInMeters;
        const fenceLengthDisplay = convertValue(fenceLengthInMeters, 'm', fenceLengthUnit);
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
                                onChange={handleLengthUnitChange}
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
                                onChange={handleWidthUnitChange}
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
                                onChange={handleAreaUnitChange}
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
                                    onChange={handleGateWidthUnitChange}
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
                                    onChange={handleFenceLengthUnitChange}
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
                                    onChange={handlePerimeterUnitChange}
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
