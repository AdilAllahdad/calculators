'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const lengthUnitValues = ['m', 'ft', 'in', 'cm', 'yd', 'ft in', 'm cm'];  
const heightUnitvalues = ['m', 'ft', 'in', 'cm', 'yd', 'ft in', 'm cm']; 
const postDepthUnitValues = ['m', 'ft', 'in', 'cm', 'yd', 'ft in', 'm cm'];

export default function FencePostDepthCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<string>('m');
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<string>('m');
    const [postDepthUnit, setPostDepthUnit] = useState<string>('m');
    const [showDepthToHeightRatio, setShowDepthToHeightRatio] = useState(false);
    const [depthToHeightRatio, setDepthToHeightRatio] = useState<number>(0.33);
    const [calculatedPostDepth, setCalculatedPostDepth] = useState<number>(0);

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

    const calculatePostHeight = () => {
        const lengthNum = parseFloat(length) || 0;
        const depthToHeightRatioNum = parseFloat(depthToHeightRatio.toString()) || 0;
        if (lengthNum <= 0 || depthToHeightRatioNum <= 0) {
            setHeight('');
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        // Post Height = Post Length - Post Depth
        // Post Depth = Post Height × Ratio, so Post Height = Post Length / (1 + Ratio)
        const heightInMeters = lengthInMeters / (1 + depthToHeightRatioNum);
        const convertedHeight = convertValue(heightInMeters, 'm', heightUnit);
        // Round to 1 decimal place for cleaner display
        const roundedHeight = Math.round(convertedHeight * 10) / 10;
        setHeight(roundedHeight.toString());
    };

    const calculatePostDepth = () => {
        const heightNum = parseFloat(height) || 0;
        const depthToHeightRatioNum = parseFloat(depthToHeightRatio.toString()) || 0;

        if (heightNum <= 0 || depthToHeightRatioNum <= 0) {
            setCalculatedPostDepth(0);
            return;
        }

        const heightInMeters = convertValue(heightNum, heightUnit, 'm');
        const postDepthInMeters = heightInMeters * depthToHeightRatioNum;
        const convertedPostDepth = convertValue(postDepthInMeters, 'm', postDepthUnit);
        // Round to 1 decimal place for cleaner display
        const roundedPostDepth = Math.round(convertedPostDepth * 10) / 10;
        setCalculatedPostDepth(roundedPostDepth);
    };



    const handleDepthToHeightRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Sanitize and convert to number before setting
        let sanitized = e.target.value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
            sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setDepthToHeightRatio(parseFloat(sanitized) || 0);
    };

    const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLengthUnit(e.target.value);
    };

    const handleHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setHeightUnit(e.target.value);
    };

    const handlePostDepthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPostDepthUnit(e.target.value);
    };

    const reloadCalculator = () => {
        setLength('');
        setHeight('');
        setCalculatedPostDepth(0);
        setDepthToHeightRatio(0.33);
    };

    const clearAll = () => {
        setLength('');
        setHeight('');
        setCalculatedPostDepth(0);
        setDepthToHeightRatio(0.33);
    };

    const shareResult = () => {
        const result = `Length: ${length} ${lengthUnit}\nHeight: ${height} ${heightUnit}\nPost Depth: ${calculatedPostDepth} ${postDepthUnit}\nDepth to Height Ratio: ${depthToHeightRatio}`;
        if (navigator.share) {
          navigator.share({
            title: 'Fence Post Depth Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    useEffect(() => {
        calculatePostHeight();
    }, [length, lengthUnit, heightUnit, depthToHeightRatio]);

    useEffect(() => {
        calculatePostDepth();
    }, [height, heightUnit, postDepthUnit, depthToHeightRatio]);

    return (
        <div className="flex justify-center">    
            <div className="max-w-4xl mx-auto my-auto py-8">    
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Fence Post Depth Calculator 
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <img src="/fence-post-depth_DC.png" alt="Fence Post Depth" />
                    </div>
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Length  
                        </label>
                        <div className="flex gap-2">  
                            <input  
                                type="number"  
                                value={length}  
                                onChange={(e) => handleNumberInput(e.target.value, setLength)}  
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
                    {showDepthToHeightRatio && (  
                        <div className="mb-6">  
                            <label className="block text-sm font-medium text-slate-700 mb-2">  
                                Depth-to-height ratio  
                            </label>
                            <div className="flex gap-2">  
                                <input  
                                    type="number"  
                                    value={depthToHeightRatio}  
                                    onChange={handleDepthToHeightRatioChange}  
                                    onFocus={(e) => handleFocus(depthToHeightRatio.toString(), e)}  
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                    min="0"  
                                />  
                            </div>  
                        </div>  
                    )} 
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Height  
                        </label>  
                        <div className="flex gap-2">  
                            <input
                                type="text"
                                value={height ? formatNumber(parseFloat(height)) : ''}
                                placeholder="Enter post length to calculate height"
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                id="height-unit"
                                value={heightUnit}
                                onChange={handleHeightUnitChange}
                                unitValues={heightUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>  
                    </div>  
                    <div className="mb-6">  
                        <label className="block text-sm font-medium text-slate-700 mb-2">  
                            Post Depth  
                        </label>  
                        <div className="flex gap-2">  
                            <input
                                type="text"
                                value={calculatedPostDepth > 0 ? formatNumber(calculatedPostDepth) : ''}
                                placeholder="Enter height to calculate depth"
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                id="post-depth-unit"
                                value={postDepthUnit}
                                onChange={handlePostDepthUnitChange}
                                unitValues={postDepthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                        <div className="mt-4">  
                            <input
                                type="checkbox"
                                checked={showDepthToHeightRatio}
                                onChange={() => setShowDepthToHeightRatio(!showDepthToHeightRatio)}
                                className="form-checkbox text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                            />
                            <label className="text-sm font-medium text-slate-700">Modify the depth-to-height ratio</label>
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
