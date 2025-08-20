'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type AreaUnitType = 'm2' | 'ft2' | 'yd2' | 'cm2' | 'ha' | 'ac';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'yd2', 'cm2', 'ha', 'ac'].includes(unit);
};

// Define the unit values needed for each dropdown
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2', 'cm2'];
const commonAreaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2', 'cm2', 'ha', 'ac'];

// Conversion maps (all to base units)
const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'yd2': 0.836127,  // square yards to square meters
  'cm2': 0.0001,    // square centimeters to square meters
  'ha': 10000,      // hectares to square meters
  'ac': 4046.86     // acres to square meters
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

export default function FloorAreaRatioCalculator() {
    const [carpetArea, setCarpetArea] = useState<string>('');
    const [carpetAreaUnit, setCarpetAreaUnit] = useState<AreaUnitType>('m2');
    const [builtUpArea, setBuiltUpArea] = useState<string>('');
    const [builtUpAreaUnit, setBuiltUpAreaUnit] = useState<AreaUnitType>('m2');
    const [carpetRatio, setCarpetRatio] = useState<number>(0);
    const [numUnits, setNumUnits] = useState<string>('');
    const [superBuiltUpArea, setSuperBuiltUpArea] = useState<string>('');
    const [superBuiltUpAreaUnit, setSuperBuiltUpAreaUnit] = useState<AreaUnitType>('m2');
    const [totalBuiltUpArea, setTotalBuiltUpArea] = useState<number>(0);
    const [totalBuiltUpAreaUnit, setTotalBuiltUpAreaUnit] = useState<AreaUnitType>('m2');
    const [indoorArea, setIndoorArea] = useState<number>(0);
    const [indoorAreaUnit, setIndoorAreaUnit] = useState<AreaUnitType>('m2');
    const [wallsArea, setWallsArea] = useState<number>(0);
    const [wallsAreaUnit, setWallsAreaUnit] = useState<AreaUnitType>('m2');
    const [commonArea, setCommonArea] = useState<string>('0');
    const [commonAreaUnit, setCommonAreaUnit] = useState<AreaUnitType>('m2');
    const [openSpaceArea, setOpenSpaceArea] = useState<string>('');
    const [openSpaceAreaUnit, setOpenSpaceAreaUnit] = useState<AreaUnitType>('m2');
    const [totalLandArea, setTotalLandArea] = useState<string>('');
    const [totalLandAreaUnit, setTotalLandAreaUnit] = useState<AreaUnitType>('m2');
    const [loadingFactor, setLoadingFactor] = useState<number>(0);
    const [openSpaceRatio, setOpenSpaceRatio] = useState<number>(0);
    const [floorAreaRatio, setFloorAreaRatio] = useState<number>(0);
    const [showAreas, setShowAreas] = useState<boolean>(true);
    const [showIndoorArea, setShowIndoorArea] = useState<boolean>(true);
    const [showOutdoorArea, setShowOutdoorArea] = useState<boolean>(true);
    const [showIndices, setShowIndices] = useState<boolean>(true);

    // Validation error states
    const [builtUpAreaError, setBuiltUpAreaError] = useState<string>('');
    const [loadingFactorError, setLoadingFactorError] = useState<string>('');

    const calculatecarpetToBuiltAreaRatio = () => {
        const carpetAreaNum = parseFloat(carpetArea) || 0;
        const builtUpAreaNum = parseFloat(builtUpArea) || 0;

        // Clear previous error
        setBuiltUpAreaError('');

        if (carpetAreaNum <= 0 || builtUpAreaNum <= 0) {
            setCarpetRatio(0);
            return;
        }

        // Validate that built-up area is greater than carpet area
        if (builtUpAreaNum <= carpetAreaNum) {
            setBuiltUpAreaError('Built-up area must be greater than carpet area');
            setCarpetRatio(0);
            return;
        }

        // Convert to square meters using type-safe conversion
        const carpetAreaInSquareMeters = carpetAreaNum * areaConversions[carpetAreaUnit];
        const builtUpAreaInSquareMeters = builtUpAreaNum * areaConversions[builtUpAreaUnit];
        const carpetRatio = (carpetAreaInSquareMeters / builtUpAreaInSquareMeters) * 100;
        setCarpetRatio(carpetRatio);
    }

    // Type-safe unit change handlers with value preservation
    const handleCarpetAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!carpetArea || carpetArea === '') {
            setCarpetAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(carpetAreaUnit, newUnit, Number(carpetArea), areaConversions);
        setCarpetArea(result.toFixed(4));
        setCarpetAreaUnit(newUnit);
    };

    const handleBuiltUpAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!builtUpArea || builtUpArea === '') {
            setBuiltUpAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(builtUpAreaUnit, newUnit, Number(builtUpArea), areaConversions);
        setBuiltUpArea(result.toFixed(4));
        setBuiltUpAreaUnit(newUnit);
    };

    const handleSuperBuiltUpAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!superBuiltUpArea || superBuiltUpArea === '') {
            setSuperBuiltUpAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(superBuiltUpAreaUnit, newUnit, Number(superBuiltUpArea), areaConversions);
        setSuperBuiltUpArea(result.toFixed(4));
        setSuperBuiltUpAreaUnit(newUnit);
    };

    const handleTotalBuiltUpAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        // Convert the current total built-up area value to the new unit
        if (totalBuiltUpArea && totalBuiltUpArea > 0) {
            const result = handleUnitConversion(totalBuiltUpAreaUnit, newUnit, Number(totalBuiltUpArea), areaConversions);
            setTotalBuiltUpArea(result);
        }
        setTotalBuiltUpAreaUnit(newUnit);
    };

    const handleIndoorAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        // Convert the current indoor area value to the new unit
        if (indoorArea && indoorArea > 0) {
            const result = handleUnitConversion(indoorAreaUnit, newUnit, Number(indoorArea), areaConversions);
            setIndoorArea(result);
        }
        setIndoorAreaUnit(newUnit);
    };

    const handleWallsAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        // Convert the current walls area value to the new unit
        if (wallsArea && wallsArea > 0) {
            const result = handleUnitConversion(wallsAreaUnit, newUnit, Number(wallsArea), areaConversions);
            setWallsArea(result);
        }
        setWallsAreaUnit(newUnit);
    };

    const handleCommonAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!commonArea || commonArea === '') {
            setCommonAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(commonAreaUnit, newUnit, Number(commonArea), areaConversions);
        setCommonArea(result.toFixed(4));
        setCommonAreaUnit(newUnit);
    };

    const handleOpenSpaceAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!openSpaceArea || openSpaceArea === '') {
            setOpenSpaceAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(openSpaceAreaUnit, newUnit, Number(openSpaceArea), areaConversions);
        setOpenSpaceArea(result.toFixed(4));
        setOpenSpaceAreaUnit(newUnit);
    };

    const handleTotalLandAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!totalLandArea || totalLandArea === '') {
            setTotalLandAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(totalLandAreaUnit, newUnit, Number(totalLandArea), areaConversions);
        setTotalLandArea(result.toFixed(4));
        setTotalLandAreaUnit(newUnit);
    };

    const calculateTotalBuiltUpArea = () => {
        const numUnitsNum = parseFloat(numUnits) || 0;
        const builtUpAreaNum = parseFloat(builtUpArea) || 0;
        if (numUnitsNum <= 0 || builtUpAreaNum <= 0) {
            setTotalBuiltUpArea(0);
            return;
        }
        const totalBuiltUpArea = numUnitsNum * builtUpAreaNum;
        setTotalBuiltUpArea(totalBuiltUpArea);
    }



    // Custom handlers for bidirectional calculation
    const handleSuperBuiltUpAreaChange = (value: string) => {
        setSuperBuiltUpArea(value);
        // Only calculate common area if we have valid inputs
        const builtUpAreaNum = parseFloat(builtUpArea.toString()) || 0;
        const numUnitsNum = parseFloat(numUnits) || 0;
        const superBuiltUpAreaNum = parseFloat(value) || 0;

        if (builtUpAreaNum > 0 && numUnitsNum > 0 && superBuiltUpAreaNum > 0) {
            const commonArea = numUnitsNum * (superBuiltUpAreaNum - builtUpAreaNum);
            if (commonArea >= 0) {
                setCommonArea(commonArea.toString());
            }
        }
    };

    const handleCommonAreaChange = (value: number) => {
    setCommonArea(value.toString());
        // Only calculate super built-up area if we have valid inputs
        const builtUpAreaNum = parseFloat(builtUpArea.toString()) || 0;
        const numUnitsNum = parseFloat(numUnits) || 0;

        if (builtUpAreaNum > 0 && numUnitsNum > 0 && value >= 0) {
            const superBuiltUpArea = builtUpAreaNum + value / numUnitsNum;
            setSuperBuiltUpArea(superBuiltUpArea.toString());
        }
    };

    const calculateIndoorArea = () => {
        const builtUpAreaNum = parseFloat(builtUpArea) || 0;
        if (builtUpAreaNum <= 0) {
            setIndoorArea(0);
            return; 
        }
        // Indoor area should not be affected by number of units
        const indoorArea = builtUpAreaNum;
        setIndoorArea(indoorArea);
    }

    const calculateWallsArea = () => {
        const builtUpAreaNum = parseFloat(builtUpArea.toString()) || 0;
        const carpetAreaNum = parseFloat(carpetArea.toString()) || 0;
        if (builtUpAreaNum <= 0 || carpetAreaNum <= 0) {
            setWallsArea(0);
            return;
        }
        const wallsArea = builtUpAreaNum - carpetAreaNum;
        setWallsArea(wallsArea);
    }

    const calculateLoadingFactor = () => {
        const carpetAreaNum = parseFloat(carpetArea.toString()) || 0;
        const superBuiltUpAreaNum = parseFloat(superBuiltUpArea) || 0;

        // Clear previous error
        setLoadingFactorError('');

        if (carpetAreaNum <= 0 || superBuiltUpAreaNum <= 0) {
            setLoadingFactor(0);
            return;
        }

        const loadingFactor = (superBuiltUpAreaNum - carpetAreaNum) / carpetAreaNum;

        // Validate that loading factor is greater than zero
        if (loadingFactor <= 0) {
            setLoadingFactorError('Loading factor must be greater than zero');
            setLoadingFactor(0);
            return;
        }

        setLoadingFactor(loadingFactor);
    }
    
    const calculateOpenSpaceRatio = () => {
        const openSpaceAreaNum = parseFloat(openSpaceArea) || 0;
        const totalLandAreaNum = parseFloat(totalLandArea) || 0;
        if (openSpaceAreaNum <= 0 || totalLandAreaNum <= 0) {
            setOpenSpaceRatio(0);
            return;
        }
        const openSpaceRatio = openSpaceAreaNum / totalLandAreaNum;
        setOpenSpaceRatio(openSpaceRatio);
    }

    const calculateFloorAreaRatio = () => {
        const totalBuiltUpAreaNum = parseFloat(totalBuiltUpArea.toString()) || 0;
        const totalLandAreaNum = parseFloat(totalLandArea) || 0;
        if (totalBuiltUpAreaNum <= 0 || totalLandAreaNum <= 0) {
            setFloorAreaRatio(0);
            return;
        }
        const floorAreaRatio = totalBuiltUpAreaNum / totalLandAreaNum;
        setFloorAreaRatio(floorAreaRatio);
    }

    useEffect(() => {
        calculatecarpetToBuiltAreaRatio();
    }, [carpetArea, carpetAreaUnit, builtUpArea, builtUpAreaUnit]);
    useEffect(() => {
        calculateTotalBuiltUpArea();
    }, [numUnits, builtUpArea]);
    useEffect(() => {
        calculateIndoorArea();
    }, [builtUpArea]);
    useEffect(() => {
        calculateWallsArea();
    }, [totalBuiltUpArea, carpetArea]);

    // Remove automatic calculations for Super Built-up Area and Common Area
    // These will only be calculated when user manually changes the other field

    useEffect(() => {
        calculateLoadingFactor();
    }, [carpetArea, superBuiltUpArea]);
    useEffect(() => {
        calculateOpenSpaceRatio();
    }, [openSpaceArea, superBuiltUpArea]);
    useEffect(() => {
        calculateFloorAreaRatio();
    }, [totalBuiltUpArea, totalLandArea]);
    
    const clearAll = () => {
        setCarpetArea('');
        setBuiltUpArea('');
        setCarpetRatio(0);
        setNumUnits('');
        setSuperBuiltUpArea('');
        setTotalBuiltUpArea(0);
        setIndoorArea(0);
        setWallsArea(0);
        setCommonArea('0');
        setOpenSpaceArea('');
        setTotalLandArea('');
        setLoadingFactor(0);
        setOpenSpaceRatio(0);
        setFloorAreaRatio(0);
        setBuiltUpAreaError('');
        setLoadingFactorError('');
    };

    const reloadCalculator = () => {
        clearAll();
    };

    const shareResult = () => {
        const result = `Carpet Area: ${carpetArea} ${carpetAreaUnit}\nBuilt-up Area: ${builtUpArea} ${builtUpAreaUnit}\nCarpet Ratio: ${carpetRatio}\nNumber of Units: ${numUnits}\nSuper Built-up Area: ${superBuiltUpArea} ${superBuiltUpAreaUnit}\nTotal Built-up Area: ${totalBuiltUpArea} ${totalBuiltUpAreaUnit}\nIndoor Area
        : ${indoorArea} ${indoorAreaUnit}\nWalls Area: ${wallsArea} ${wallsAreaUnit}\nCommon Area: ${commonArea} ${commonAreaUnit}\nOpen Space Area: ${openSpaceArea} ${openSpaceAreaUnit}\nTotal Land Area: ${totalLandArea} ${totalLandAreaUnit}\nLeading Factor: ${loadingFactor}\nOpen Space Ratio: ${openSpaceRatio}\nFloor Area Ratio: ${floorAreaRatio}`;
        if (navigator.share) {
          navigator.share({
            title: 'Floor Area Ratio Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto py-8 space-y-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Floor Area Ratio Calculator
                        <span className="ml-3 text-2xl">📏</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Areas</h2>
                    <button 
                        onClick={() => setShowAreas(!showAreas)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showAreas ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
                {showAreas && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Carpet Area
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={carpetArea}
                                    onChange={(e) => setCarpetArea(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter carpet area"
                                />
                                <UnitDropdown
                                    value={carpetAreaUnit}
                                    onChange={(e) => handleCarpetAreaUnitChange(e.target.value)}
                                    unitValues={areaUnitValues}
                                    className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Built-up Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={builtUpArea}
                                        onChange={(e) => setBuiltUpArea(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter built-up area"
                                    />
                                    <UnitDropdown
                                        value={builtUpAreaUnit}
                                        onChange={(e) => handleBuiltUpAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {builtUpAreaError && (
                                    <p className="mt-2 text-sm text-red-600">{builtUpAreaError}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Carpet Ratio
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formatNumber(carpetRatio)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        placeholder="Calculated carpet ratio"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Number of Units
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={numUnits}
                                        onChange={(e) => setNumUnits(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="1"
                                        min="0"
                                        placeholder="Enter number of units"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Super Built-up Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={superBuiltUpArea}
                                        onChange={(e) => handleSuperBuiltUpAreaChange(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter super built-up area"
                                    />
                                    <UnitDropdown
                                        value={superBuiltUpAreaUnit}
                                        onChange={(e) => handleSuperBuiltUpAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Total Built-up Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formatNumber(totalBuiltUpArea)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        placeholder="Calculated total built-up area"
                                    />
                                    <UnitDropdown
                                        value={totalBuiltUpAreaUnit}
                                        onChange={(e) => handleTotalBuiltUpAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Indoor Area</h2>
                    <button 
                        onClick={() => setShowIndoorArea(!showIndoorArea)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showIndoorArea ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
                {showIndoorArea && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Indoor Area
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formatNumber(indoorArea)}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    placeholder="Calculated indoor area"
                                />
                                <UnitDropdown
                                    value={indoorAreaUnit}
                                    onChange={(e) => handleIndoorAreaUnitChange(e.target.value)}
                                    unitValues={areaUnitValues}
                                    className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Walls Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formatNumber(wallsArea)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        placeholder="Calculated walls area"
                                    />
                                    <UnitDropdown
                                        value={wallsAreaUnit}
                                        onChange={(e) => handleWallsAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Outdoor Area</h2>
                    <button 
                        onClick={() => setShowOutdoorArea(!showOutdoorArea)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showOutdoorArea ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
                {showOutdoorArea && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Common Area
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={commonArea}
                                    onChange={(e) => handleCommonAreaChange(Number(e.target.value))}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter common area"
                                />
                                <UnitDropdown
                                    value={commonAreaUnit}
                                    onChange={(e) => handleCommonAreaUnitChange(e.target.value)}
                                    unitValues={areaUnitValues}
                                    className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Open Space area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={openSpaceArea}
                                        onChange={(e) => setOpenSpaceArea(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter open space area"
                                    />
                                    <UnitDropdown
                                        value={openSpaceAreaUnit}
                                        onChange={(e) => handleOpenSpaceAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Total Land area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={totalLandArea}
                                        onChange={(e) => setTotalLandArea(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter total land area"
                                    />
                                    <UnitDropdown
                                        value={totalLandAreaUnit}
                                        onChange={(e) => handleTotalLandAreaUnitChange(e.target.value)}
                                        unitValues={areaUnitValues}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Indices</h2>
                    <button 
                        onClick={() => setShowIndices(!showIndices)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showIndices ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
                {showIndices && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Loading factor (LF)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formatNumber(loadingFactor)}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    placeholder="Calculated loading factor"
                                />
                            </div>
                            {loadingFactorError && (
                                <p className="mt-2 text-sm text-red-600">{loadingFactorError}</p>
                            )}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Open space ratio (OSR)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formatNumber(openSpaceRatio)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        placeholder="Calculated open space ratio"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Floor area ratio (FAR) or Floor space index (FSI)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formatNumber(floorAreaRatio)}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        placeholder="Calculated floor area ratio"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}
