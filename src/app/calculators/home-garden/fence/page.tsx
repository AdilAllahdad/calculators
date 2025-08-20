'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Type definitions for unit system
type SingleLengthUnitType = 'm' | 'ft' | 'in' | 'cm' | 'km' | 'yd' | 'mm';
type CompositeLengthUnitType = 'ft/in' | 'm/cm';
type LengthUnitType = SingleLengthUnitType | CompositeLengthUnitType;
type VolumeUnitType = 'm3' | 'dm3' | 'cm3' | 'cu ft' | 'cu in' | 'cu yd';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isSingleLengthUnit = (unit: string): unit is SingleLengthUnitType => {
  return ['m', 'ft', 'in', 'cm', 'km', 'yd', 'mm'].includes(unit);
};

const isCompositeLengthUnit = (unit: string): unit is CompositeLengthUnitType => {
  return unit === 'ft/in' || unit === 'm/cm';
};

const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return isSingleLengthUnit(unit) || isCompositeLengthUnit(unit);
};

const isVolumeUnit = (unit: string): unit is VolumeUnitType => {
  return ['m3', 'dm3', 'cm3', 'cu ft', 'cu in', 'cu yd'].includes(unit);
};

// Define the unit values needed for each dropdown
const lengthUnitValues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'km', 'yd', 'ft/in', 'm/cm'];
const heightUnitvalues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'km', 'yd', 'ft/in', 'm/cm'];
const widthUnitvalues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'mm', 'ft/in', 'm/cm'];
const spacingUnitvalues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'mm', 'ft/in', 'm/cm'];
const thicknessUnitvalues: LengthUnitType[] = ['m', 'ft', 'in', 'cm', 'mm', 'ft/in', 'm/cm'];
const concreteVolumeUnitValues: VolumeUnitType[] = ['m3', 'dm3', 'cm3', 'cu ft', 'cu in', 'cu yd'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<SingleLengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'in': 0.0254,     // inches to meters
  'cm': 0.01,       // centimeters to meters
  'km': 1000,       // kilometers to meters
  'yd': 0.9144,     // yards to meters
  'mm': 0.001       // millimeters to meters
};

const volumeConversions: ConversionMap<VolumeUnitType> = {
  'm3': 1,          // cubic meters (base)
  'dm3': 0.001,     // cubic decimeters to cubic meters
  'cm3': 1e-6,      // cubic centimeters to cubic meters
  'cu ft': 0.0283168, // cubic feet to cubic meters
  'cu in': 1.6387e-5, // cubic inches to cubic meters
  'cu yd': 0.764555   // cubic yards to cubic meters
};

// Unit conversion helper
const handleUnitConversion = <T extends string>(
  currentUnit: T,
  newUnit: T,
  value: number | string,
  conversionTable: ConversionMap<T>
): number => {
  const numValue = Number(value);
  if (!numValue || isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Format number helper
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

export default function FenceCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<LengthUnitType>('m');
    const [space, setSpace] = useState<string>('2.5');
    const [spaceUnit, setSpaceUnit] = useState<LengthUnitType>('m');
    const [numPosts, setNumPosts] = useState<number | string>('');
    const [numSections, setNumSections] = useState<number>(0);
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<LengthUnitType>('m');
    const [postLength, setPostLength] = useState<number>(0);
    const [postLengthUnit, setPostLengthUnit] = useState<LengthUnitType>('m');
    const [railsPerSection, setRailsPerSection] = useState<string>('');
    const [numRails, setNumRails] = useState<number>(0);
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<LengthUnitType>('m');
    const [spacing, setSpacing] = useState<string>('');
    const [spacingUnit, setSpacingUnit] = useState<LengthUnitType>('m');
    const [numPickets, setNumPickets] = useState<number>(0);
    const [shape, setShape] = useState<string>('');
    const [postDiameter, setPostDiameter] = useState<string>('');
    const [postDiameterUnit, setPostDiameterUnit] = useState<LengthUnitType>('m');
    const [postDepth, setPostDepth] = useState<string>('5');
    const [postDepthUnit, setPostDepthUnit] = useState<LengthUnitType>('m');
    const [postWidth, setPostWidth] = useState<string>('');
    const [postWidthUnit, setPostWidthUnit] = useState<LengthUnitType>('m');
    const [postThickness, setPostThickness] = useState<string>('');
    const [postThicknessUnit, setPostThicknessUnit] = useState<LengthUnitType>('m');
    const [concreteVolume, setConcreteVolume] = useState<number>(0);
    const [concreteVolumeUnit, setConcreteVolumeUnit] = useState<VolumeUnitType>('m3');
    const [showNumLPosts, setShowNumLPosts] = useState<boolean>(true);
    const [showNumRails, setShowNumRails] = useState<boolean>(true);
    const [showNumPickets, setShowNumPickets] = useState<boolean>(true);
    const [showConcrete, setShowConcrete] = useState<boolean>(true);
    const [showCuboid, setShowCuboid] = useState<boolean>(false);
    const [showCylinder, setShowCylinder] = useState<boolean>(false);
    

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

    // Type-safe unit change handlers with value preservation
    const handleLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!length || length === '') {
            setLengthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(lengthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(lengthUnit, newUnit, Number(length), lengthConversions);
            setLength(result.toFixed(4));
        }
        setLengthUnit(newUnit);
    };

    const handleSpaceUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!space || space === '') {
            setSpaceUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(spaceUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(spaceUnit, newUnit, Number(space), lengthConversions);
            setSpace(result.toFixed(4));
        }
        setSpaceUnit(newUnit);
    };

    const handleWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!width || width === '') {
            setWidthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(widthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(widthUnit, newUnit, Number(width), lengthConversions);
            setWidth(result.toFixed(4));
        }
        setWidthUnit(newUnit);
    };

    const handleSpacingUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!spacing || spacing === '') {
            setSpacingUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(spacingUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(spacingUnit, newUnit, Number(spacing), lengthConversions);
            setSpacing(result.toFixed(4));
        }
        setSpacingUnit(newUnit);
    };

    const handlePostWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!postWidth || postWidth === '') {
            setPostWidthUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(postWidthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(postWidthUnit, newUnit, Number(postWidth), lengthConversions);
            setPostWidth(result.toFixed(4));
        }
        setPostWidthUnit(newUnit);
    };

    const handlePostThicknessUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!postThickness || postThickness === '') {
            setPostThicknessUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(postThicknessUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(postThicknessUnit, newUnit, Number(postThickness), lengthConversions);
            setPostThickness(result.toFixed(4));
        }
        setPostThicknessUnit(newUnit);
    };

    const handlePostDiameterUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!postDiameter || postDiameter === '') {
            setPostDiameterUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(postDiameterUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(postDiameterUnit, newUnit, Number(postDiameter), lengthConversions);
            setPostDiameter(result.toFixed(4));
        }
        setPostDiameterUnit(newUnit);
    };

    const handleHeightUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!height || height === '') {
            setHeightUnit(newUnit);
            return;
        }

        if (isSingleLengthUnit(heightUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(heightUnit, newUnit, Number(height), lengthConversions);
            setHeight(result.toFixed(4));
        }
        setHeightUnit(newUnit);
    };

    const handlePostLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        // Convert the current post length value to the new unit (only for single units)
        if (postLength && postLength > 0 && isSingleLengthUnit(postLengthUnit) && isSingleLengthUnit(newUnit)) {
            const result = handleUnitConversion(postLengthUnit, newUnit, Number(postLength), lengthConversions);
            setPostLength(result);
        }
        setPostLengthUnit(newUnit);
    };

    const calculateNumPosts = () => {
        const lengthNum = parseFloat(length) || 0;
        const spaceNum = parseFloat(space) || 0;
        if (lengthNum <= 0 || spaceNum <= 0) {
            setNumPosts(0);
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        const spaceInMeters = convertValue(spaceNum, spaceUnit, 'm');
        const numPosts = Math.ceil((lengthInMeters / spaceInMeters)) + 1;
        setNumPosts(numPosts);
    };

    const calculateNumSections = () => {   
        const numPostsValue = parseFloat(numPosts as unknown as string) || 0;
        if (numPostsValue <= 0) {
            setNumSections(0);
            return;
        }
        const numSections = (parseFloat(numPosts as unknown as string) || 0) - 1;
        setNumSections(numSections);
    };

    const calculatePostLength = () => {   
        const heightNum = parseFloat(height) || 0;
        if (heightNum <= 0) {
            setPostLength(0);
            return;
        }
        const heightInMeters = convertValue(heightNum, heightUnit, 'm');
        const postLength = heightInMeters * 1.5;
        setPostLength(postLength);
    };

    const calculateRailsPerSection = () => {   
        const railsPerSectionNum = parseFloat(railsPerSection) || 0;
        if (railsPerSectionNum <= 0) {
            setNumRails(0);
            return;
        }
        const numRails = railsPerSectionNum * numSections;
        setNumRails(numRails);
    };

    const calculateNumPickets = () => {   
        const widthNum = parseFloat(width) || 0;
        const spacingNum = parseFloat(spacing) || 0;
        const lengthNum = parseFloat(length) || 0;
        if (widthNum <= 0 || spacingNum <= 0) {
            setNumPickets(0);
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        const widthInMeters = convertValue(widthNum, widthUnit, 'm');
        const spacingInMeters = convertValue(spacingNum, spacingUnit, 'm');
        const numPickets = Math.floor(lengthInMeters / (widthInMeters + spacingInMeters)) + 1;
        setNumPickets(numPickets);
    };

    const calculateConcreteVolume = () => {
        const postDiameterNum = parseFloat(postDiameter) || 0;
        const postWidthNum = parseFloat(postWidth) || 0;
        const postThicknessNum = parseFloat(postThickness) || 0;
        const postDepthNum = parseFloat(postDepth) || 0;
        if (postDiameterNum <= 0 && (postWidthNum <= 0 || postThicknessNum <= 0)) {
            setConcreteVolume(0);
            return;
        }
        let volume = 0;
        // Calculate volume for cylindrical posts
        if (postDiameterNum > 0) {
            const postDiameterInMeters = convertValue(postDiameterNum, postDiameterUnit, 'm');
            const postDepthInMeters = convertValue(postDepthNum, postDepthUnit, 'm');
            volume = (2 * Math.PI * Math.pow(postDiameterInMeters, 2) * postDepthInMeters) * (parseFloat(numPosts as unknown as string) || 0);
        }
        // Calculate volume for Cuboid posts
        else if (postWidthNum > 0 && postThicknessNum > 0) {
            const postWidthInMeters = convertValue(postWidthNum, postWidthUnit, 'm');
            const postThicknessInMeters = convertValue(postThicknessNum, postThicknessUnit, 'm');
            const postDepthInMeters = convertValue(postDepthNum, postDepthUnit, 'm');
            volume = (8 * postWidthInMeters * postThicknessInMeters * postDepthInMeters) * (parseFloat(numPosts as unknown as string) || 0);
        }

        // Convert volume to selected unit and set it
        const volumeInSelectedUnit = convertValue(volume, 'm3', concreteVolumeUnit);
        setConcreteVolume(volumeInSelectedUnit);
    };

    useEffect(() => {
        calculateNumPosts();
        calculateNumSections();
        calculatePostLength();
        calculateRailsPerSection();
        calculateNumPickets();
        calculateConcreteVolume();
    }, [
        length, lengthUnit, space, spaceUnit, numPosts, numSections,
        height, heightUnit, railsPerSection, width, widthUnit, spacing, spacingUnit,
        postDiameter, postDiameterUnit, postWidth, postWidthUnit, postThickness, postThicknessUnit,
        postDepth, postDepthUnit, concreteVolumeUnit
    ]);

    const reloadCalculator = () => {
        setLength('');
        setSpace('2.5');
        setNumPosts(0);
        setNumSections(0);
        setHeight('');
        setPostLength(0);
        setRailsPerSection('');
        setNumRails(0);
        setWidth('');
        setSpacing('');
        setNumPickets(0);
        setShape('');
        setPostDiameter('');
        setPostWidth('');
        setPostThickness('');
        setPostDepth('0.5');
        setConcreteVolume(0);
    };

    const clearAll = () => {
        setLength('');
        setSpace('2.5');
        setNumPosts(0);
        setNumSections(0);
        setHeight('');
        setPostLength(0);
        setRailsPerSection('');
        setNumRails(0);
        setWidth('');
        setSpacing('');
        setNumPickets(0);
        setShape('');
        setPostDiameter('');
        setPostWidth('');
        setPostThickness('');
        setPostDepth('0.5');
        setConcreteVolume(0);
    };

    const shareResult = () => {
        const result = `Length: ${length} ${lengthUnit}\nSpace: ${space} ${spaceUnit}\nNumber of Posts: ${numPosts}\nNumber of Sections: ${numSections}\nHeight: ${height} ${heightUnit}\nPost Length: ${postLength} ${postLengthUnit}\nRails per Section: ${railsPerSection}\nNumber of Rails: ${numRails}\nWidth: ${width} ${widthUnit}\nSpacing:
        ${spacing} ${spacingUnit}\nNumber of Pickets: ${numPickets}\nShape: ${shape}\nPost Diameter: ${postDiameter} ${postDiameterUnit}\nPost Width: ${postWidth} ${postWidthUnit}\nPost Thickness: ${postThickness} ${postThicknessUnit}\nPost Depth: ${postDepth} ${postDepthUnit}\nConcrete Volume: ${concreteVolume} ${concreteVolumeUnit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Fence Calculator Result',
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
                        Fence Calculator 
                        <span className="ml-3 text-2xl">蓠</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <img src="/fencetransparent.png" alt="fence" />
                </div>
                <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Fence Dimensions</h2>
                        <button onClick={() => setShowNumLPosts(!showNumLPosts)} className="text-blue-500 hover:text-blue-600 transition-colors">
                            {showNumLPosts ? (
                                <ChevronUp className="hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="hover:scale-110 transition-transform duration-200" />
                            )}
                        </button>
                    </div>
                    {showNumLPosts && (
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fence length
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
                                value={lengthUnit}
                                onChange={(e) => handleLengthUnitChange(e.target.value)}
                                unitValues={lengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Post space
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={space}
                                onChange={(e) => handleNumberInput(e.target.value, setSpace)}
                                onFocus={(e) => handleFocus(space, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />
                            <UnitDropdown
                                value={spaceUnit}
                                onChange={(e) => handleSpaceUnitChange(e.target.value)}
                                unitValues={lengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Number of posts
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(Number(numPosts))}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Number of sections
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(numSections)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fence height
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => handleNumberInput(e.target.value, setHeight)}
                                onFocus={(e) => handleFocus(height, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />
                            <UnitDropdown
                                value={heightUnit}
                                onChange={(e) => handleHeightUnitChange(e.target.value)}
                                unitValues={heightUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Post length
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(postLength)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                            <UnitDropdown
                                value={postLengthUnit}
                                onChange={(e) => handlePostLengthUnitChange(e.target.value)}
                                unitValues={lengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
              )}
                </div>
                <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Number of Rails needed</h2>
                        <button
                            onClick={() => setShowNumRails(!showNumRails)}
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {showNumRails ? (
                                <ChevronUp className="hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="hover:scale-110 transition-transform duration-200" />
                            )}
                        </button>
                    </div>
                    {showNumRails && (
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Rails per section
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={railsPerSection}
                                onChange={(e) => handleNumberInput(e.target.value, setRailsPerSection)}
                                onFocus={(e) => handleFocus(railsPerSection, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Number of Rails
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(numRails)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                        </div>
                    </div>
                </div>
              )}
                </div>
                <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Number of Pickets needed</h2>
                        <button
                            onClick={() => setShowNumPickets(!showNumPickets)}
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {showNumPickets ? (
                                <ChevronUp className="hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="hover:scale-110 transition-transform duration-200" />
                            )}
                        </button>
                    </div>
                    {showNumPickets && (
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Picket width
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                                onFocus={(e) => handleFocus(width, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />
                            <UnitDropdown
                                value={widthUnit}
                                onChange={(e) => handleWidthUnitChange(e.target.value)}
                                unitValues={widthUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Picket spacing
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={spacing}
                                onChange={(e) => handleNumberInput(e.target.value, setSpacing)}
                                onFocus={(e) => handleFocus(spacing, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                            />  
                            <UnitDropdown
                                value={spacingUnit}
                                onChange={(e) => handleSpacingUnitChange(e.target.value)}
                                unitValues={spacingUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Number of Pickets
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formatNumber(numPickets)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                            />
                        </div>  
                    </div>  
                </div>  
              )}  
            </div>  
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">Concrete for post footing</h2>
                    <button
                        onClick={() => setShowConcrete(!showConcrete)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showConcrete ? (
                            <ChevronUp className="hover:scale-110 transition-transform duration-200" />
                        ) : (
                            <ChevronDown className="hover:scale-110 transition-transform duration-200" />
                        )}
                    </button>
                </div>
                {showConcrete && (
                <div>  
                    <div className="mb-6">  
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Post Shape
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="Cuboid"
                                        checked={shape === 'Cuboid'}
                                        onChange={(e) => setShape(e.target.value)}
                                        className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                                    />
                                    <span className="ml-2 text-slate-700">Cuboid</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="Cylinderical"
                                        checked={shape === 'Cylinderical'}
                                        onChange={(e) => setShape(e.target.value)}
                                        className="form-radio text-blue-500 transition-all duration-200 ease-in-out transform scale-100 hover:scale-110"
                                    />
                                    <span className="ml-2 text-slate-700">Cylinder</span>
                                </label>
                            </div>
                        </div>
                </div>
                    {shape === 'Cuboid' && (  
                        <div>  
                            <div className="mb-6">  
                                <label className="block text-sm font-medium text-slate-700 mb-2">  
                                    Post Width 
                                </label>  
                                <div className="flex gap-2">  
                                    <input  
                                        type="number"  
                                        value={postWidth}  
                                        onChange={(e) => handleNumberInput(e.target.value, setPostWidth)}  
                                        onFocus={(e) => handleFocus(postWidth, e)}  
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                        min="0"  
                                    />  
                                    <UnitDropdown
                                        value={postWidthUnit}
                                        onChange={(e) => handlePostWidthUnitChange(e.target.value)}
                                        unitValues={lengthUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>  
                            </div>  
                            <div className="mb-6">  
                                <label className="block text-sm font-medium text-slate-700 mb-2">  
                                    Post thickness  
                                </label>  
                                <div className="flex gap-2">  
                                    <input  
                                        type="number"  
                                        value={postThickness}  
                                        onChange={(e) => handleNumberInput(e.target.value, setPostThickness)}  
                                        onFocus={(e) => handleFocus(postThickness, e)}  
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                        min="0"  
                                    />  
                                    <UnitDropdown
                                        value={postThicknessUnit}
                                        onChange={(e) => handlePostThicknessUnitChange(e.target.value)}
                                        unitValues={thicknessUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>  
                            </div>  
                            <div className="mb-6">  
                                <label className="block text-sm font-medium text-slate-700 mb-2">  
                                    Concrete Volume
                                </label>  
                                <div className="flex gap-2">  
                                    <input
                                        type="text"
                                        value={formatNumber(concreteVolume)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                        style={{ color: '#1e293b' }}
                                    />
                                    <UnitDropdown   
                                        value={concreteVolumeUnit}  
                                        onChange={(e) => setConcreteVolumeUnit(e.target.value as VolumeUnitType)}  
                                        unitValues={concreteVolumeUnitValues}    
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"  
                                    />
                                </div>  
                            </div>  
                        </div>  
                    )}
                    {shape === 'Cylinderical' && (  
                        <div>   
                            <div className="mb-6">  
                                <label className="block text-sm font-medium text-slate-700 mb-2">  
                                    Post Diameter    
                                </label>  
                                <div className="flex gap-2">  
                                    <input  
                                        type="number"  
                                        value={postDiameter}  
                                        onChange={(e) => handleNumberInput(e.target.value, setPostDiameter)}  
                                        onFocus={(e) => handleFocus(postDiameter, e)}  
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                        min="0"  
                                    />  
                                    <UnitDropdown
                                        value={postDiameterUnit}
                                        onChange={(e) => handlePostDiameterUnitChange(e.target.value)}
                                        unitValues={lengthUnitValues}
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
                                        type="number"  
                                        value={postDepth}  
                                        onChange={(e) => handleNumberInput(e.target.value, setPostDepth)}  
                                        onFocus={(e) => handleFocus(postDepth, e)}  
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}  
                                        min="0"  
                                    />  
                                    <UnitDropdown   
                                        value={postDepthUnit}  
                                        onChange={(e) => setPostDepthUnit(e.target.value as LengthUnitType)}  
                                        unitValues={lengthUnitValues}    
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"  
                                    />  
                                </div>  
                            </div>  
                            <div className="mb-6">  
                                <label className="block text-sm font-medium text-slate-700 mb-2">  
                                    Concrete Volume  
                                </label>  
                                <div className="flex gap-2">  
                                    <input
                                        type="text"
                                        value={formatNumber(concreteVolume)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                        style={{ color: '#1e293b' }}
                                    />
                                    <UnitDropdown   
                                        value={concreteVolumeUnit}  
                                        onChange={(e) => setConcreteVolumeUnit(e.target.value as VolumeUnitType)}  
                                        unitValues={concreteVolumeUnitValues}    
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"  
                                    />  
                                </div>  
                            </div>  
                        </div>  
                    )}  
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