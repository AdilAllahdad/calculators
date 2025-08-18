'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const lengthUnitValues = ['m', 'ft', 'in', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const spaceUnitvalues = ['m', 'ft', 'in', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const heightUnitvalues = ['m', 'ft', 'in', 'cm', 'km', 'yd', 'ft in', 'm cm'];
const widthUnitvalues = ['m', 'ft', 'in', 'cm', 'mm', 'ft in', 'm cm'];
const spacingUnitvalues = ['m', 'ft', 'in', 'cm', 'mm', 'ft in', 'm cm'];
const thicknessUnitvalues = ['m', 'ft', 'in', 'cm', 'mm', 'ft in', 'm cm'];

export default function FenceCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<string>('m');
    const [space, setSpace] = useState<string>('2.5');
    const [spaceUnit, setSpaceUnit] = useState<string>('m');
    const [numPosts, setNumPosts] = useState<number | string>('');
    const [numSections, setNumSections] = useState<number>(0);
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<string>('m');
    const [postLength, setPostLength] = useState<number>(0);
    const [postLengthUnit, setPostLengthUnit] = useState<string>('m');
    const [railsPerSection, setRailsPerSection] = useState<string>('');
    const [numRails, setNumRails] = useState<number>(0);
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<string>('m');
    const [spacing, setSpacing] = useState<string>('');
    const [spacingUnit, setSpacingUnit] = useState<string>('m');
    const [numPickets, setNumPickets] = useState<number>(0);
    const [shape, setShape] = useState<string>('');
    const [postDiameter, setPostDiameter] = useState<string>('');
    const [postDiameterUnit, setPostDiameterUnit] = useState<string>('m');
    const [postDepth, setPostDepth] = useState<string>('0.5');
    const [postDepthUnit, setPostDepthUnit] = useState<string>('m');
    const [postWidth, setPostWidth] = useState<string>('');
    const [postWidthUnit, setPostWidthUnit] = useState<string>('m');
    const [postThickness, setPostThickness] = useState<string>('');
    const [postThicknessUnit, setPostThicknessUnit] = useState<string>('m');
    const [concreteVolume, setConcreteVolume] = useState<number>(0);
    const [concreteVolumeUnit, setConcreteVolumeUnit] = useState<string>('m3');
    const [showNumLPosts, setShowNumLPosts] = useState<boolean>(true);
    const [showNumRails, setShowNumRails] = useState<boolean>(true);
    const [showNumPickets, setShowNumPickets] = useState<boolean>(true);
    const [showConcrete, setShowConcrete] = useState<boolean>(true);
    

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

    const calculateNumPosts = () => {   
        const lengthNum = parseFloat(length) || 0;
        const spaceNum = parseFloat(space) || 0;
        if (lengthNum <= 0 || spaceNum <= 0) {
            setNumPosts(0);
            return;
        }
        const lengthInMeters = convertValue(lengthNum, lengthUnit, 'm');
        const spaceInMeters = convertValue(spaceNum, spaceUnit, 'm');
        const numPosts = Math.floor((lengthInMeters / spaceInMeters)+1) + 1;
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
        const postLength = heightInMeters + 1.5; // Add 0.5m for ground
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
            volume = (2 * Math.PI * Math.pow(postDiameterInMeters, 2) * postDepthNum) * (parseFloat(numPosts as unknown as string) || 0);
        }
        // Calculate volume for Cuboid posts
        else if (postWidthNum > 0 && postThicknessNum > 0) {
            const postWidthInMeters = convertValue(postWidthNum, postWidthUnit, 'm');
            const postThicknessInMeters = convertValue(postThicknessNum, postThicknessUnit, 'm');
            const postDepthInMeters = convertValue(postDepthNum, 'm', 'm');
            volume =( 8 * postWidthInMeters * postThicknessInMeters * postDepthInMeters) * (parseFloat(numPosts as unknown as string) || 0);
        } 
    };

    useEffect(() => {
        calculateNumPosts();
        calculateNumSections();
        calculatePostLength();  
        calculateRailsPerSection();  
        calculateNumPickets();  
        calculateConcreteVolume();  
    }, [length, lengthUnit, space, spaceUnit]);

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
                    <h2 className="text-xl font-semibold mb-6 text-slate-800">Fence Length and Post Space</h2>
                    <a onClick={() => setShowNumLPosts(!showNumLPosts)}>
                {showNumLPosts ? (
                  <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
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
                                onChange={(e) => setLengthUnit(e.target.value)}
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
                                onChange={(e) => setSpaceUnit(e.target.value)}
                                unitValues={spaceUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );

}