'use client'

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import UnitDropdown from "@/components/UnitDropdown";
import { formatNumber } from "@/lib/utils";

type SingleDimensionsUnitType = 'm' | 'ft' | 'in' | 'cm' | 'yd' | 'mm';
type CompositeDimensionsUnitType = 'ft/in' | 'm/cm';
type DimensionsUnitType = SingleDimensionsUnitType | CompositeDimensionsUnitType;
type TemperatureUnitType = 'C' | 'F' | 'K';
type HeatLossUnitType = 'W' | 'kW';
type PowerLossUnitType = 'W' | 'kW' | 'Btu/h' | 'mW' | 'MW' | 'GW' | '(hp(1))';

type ConversionMap<T extends string> = Record<T, number>;

const isSingleDimensionsUnit = (unit: string): unit is SingleDimensionsUnitType => {
    return ['m', 'ft', 'in', 'cm', 'yd', 'mm'].includes(unit);
};

const isCompositeDimensionsUnit = (unit: string): unit is CompositeDimensionsUnitType => {
    return ['ft/in', 'm/cm'].includes(unit);
};

const isDimensionsUnit = (unit: string): unit is DimensionsUnitType => {
    return isSingleDimensionsUnit(unit) || isCompositeDimensionsUnit(unit);
};

const isTemperatureUnit = (unit: string): unit is TemperatureUnitType => {
    return ['C', 'F', 'K'].includes(unit);
};

const isHeatLossUnit = (unit: string): unit is HeatLossUnitType => {
    return ['W', 'kW'].includes(unit);
};

const isPowerLossUnit = (unit: string): unit is PowerLossUnitType => {
    return ['W', 'kW', 'Btu/h', 'mW', 'MW', 'GW', '(hp(1))'].includes(unit);
};

const conversionMap: ConversionMap<DimensionsUnitType> = {
    'm': 1,
    'ft': 0.3048,
    'in': 0.0254,
    'cm': 0.01,
    'yd': 0.9144,
    'mm': 0.001,
    'ft/in': 12,
    'm/cm': 100,
};

const heatLossConversionMap: ConversionMap<HeatLossUnitType> = {
    'W': 1,
    'kW': 1000,
};

const powerLossConversionMap: ConversionMap<PowerLossUnitType> = {
    'W': 1,
    'kW': 1000,
    'Btu/h': 0.293071,
    'mW': 1000,
    'MW': 1000000,
    'GW': 1000000000,
    '(hp(1))': 745.7,
};

const handleUnitConversions = (value: number, fromUnit: DimensionsUnitType, toUnit: DimensionsUnitType): number => {
    if (isSingleDimensionsUnit(fromUnit) && isSingleDimensionsUnit(toUnit)) {
        return value * conversionMap[fromUnit] / conversionMap[toUnit];
    }
    if (isCompositeDimensionsUnit(fromUnit) && isCompositeDimensionsUnit(toUnit)) {
        return value * conversionMap[fromUnit] / conversionMap[toUnit];
    }
    if (isDimensionsUnit(fromUnit) && isDimensionsUnit(toUnit)) {
        return value * conversionMap[fromUnit] / conversionMap[toUnit];
    }
    return value; // Return original value if no conversion possible
};

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

// --- HEAT LOSS FORMULA (single surface) ---
// Q = Area × U-value   (W/K)
function calcHeatLoss(
    area: number, // m²
    insulationType: "none" | "mediocre" | "good" | "custom" = "mediocre",
    areaUnit: "m2" | "ft2" = "m2",
    customUValue?: number
): number {
    // Convert area to m² if needed
    let areaM2 = area;
    if (areaUnit === "ft2") {
        areaM2 = area * 0.092903; // 1 ft² = 0.092903 m²
    }

    // Select U-value based on insulation type
    let uValue: number;
    switch (insulationType) {
        case "none":
            uValue = 2.2; // solid brick wall, 9"
            break;
        case "mediocre":
            uValue = 1.0; // cavity wall
            break;
        case "good":
            uValue = 0.6; // cavity wall with insulation
            break;
        case "custom":
            uValue = customUValue ?? 1.0;
            break;
        default:
            uValue = 1.0;
    }

    return areaM2 * uValue; // W/K
}

// --- TOTAL HEAT LOSS (all surfaces) ---
// windows U = 2.5, doors U = 2.4, floor U = 1.0, ceiling U = 0.7
function calcTotalHeatLoss(params: {
    wallArea: number;                // m²
    wallInsulation: "none" | "mediocre" | "good" | "custom";
    customWallU?: number;

    windowArea?: number;             // m²
    doorArea?: number;               // m²
    floorArea?: number;              // m² (only if ground floor)
    ceilingArea?: number;            // m² (only if top floor)
    areaUnit?: "m2" | "ft2";
}): number {
    const {
        wallArea,
        wallInsulation,
        customWallU,
        windowArea = 0,
        doorArea = 0,
        floorArea = 0,
        ceilingArea = 0,
        areaUnit = "m2",
    } = params;

    let totalHeatLoss = 0;

    // Walls
    totalHeatLoss += calcHeatLoss(wallArea, wallInsulation, areaUnit, customWallU);

    // Windows
    totalHeatLoss += calcHeatLoss(windowArea, "custom", areaUnit, 2.5);

    // Doors
    totalHeatLoss += calcHeatLoss(doorArea, "custom", areaUnit, 2.4);

    // Floor (if ground floor)
    if (floorArea > 0) {
        totalHeatLoss += calcHeatLoss(floorArea, "custom", areaUnit, 1.0);
    }

    // Ceiling (if top floor)
    if (ceilingArea > 0) {
        totalHeatLoss += calcHeatLoss(ceilingArea, "custom", areaUnit, 0.7);
    }

    return totalHeatLoss; // W/K
}

// --- POWER REQUIRED FORMULA ---
// P = HeatLoss × ΔT   (W)
function calcPowerRequired(
    heatLoss: number, // W/K
    deltaT: number,   // °C or K
    outputUnit: "W" | "kW" | "Btu/h" = "W"
): number {
    const powerWatts = heatLoss * deltaT;

    switch (outputUnit) {
        case "kW":
            return powerWatts / 1000;
        case "Btu/h":
            return powerWatts * 3.412;
        default:
            return powerWatts;
    }
}

// Temperature conversion function
const convertTemperature = (value: string, from: TemperatureUnitType, to: TemperatureUnitType): string => {
    const temp = parseFloat(value);
    if (isNaN(temp)) return '';

    // Convert to Celsius first
    let celsius = temp;
    if (from === 'F') {
        celsius = (temp - 32) * 5/9;
    } else if (from === 'K') {
        celsius = temp - 273.15;
    }

    // Convert from Celsius to target unit
    if (to === 'F') {
        return ((celsius * 9/5) + 32).toFixed(1);
    } else if (to === 'K') {
        return (celsius + 273.15).toFixed(1);
    }
    return celsius.toFixed(1);
};

export default function HeatLossCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<DimensionsUnitType>('m');
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<DimensionsUnitType>('m');
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<DimensionsUnitType>('m');
    const [level, setLevel] = useState<string>('Ground Floor');
    const [levelUnit, setLevelUnit] = useState<DimensionsUnitType>('m');
    const [insulation, setInsulation] = useState<string>('Mediocre Insulation');
    const [numExternalWalls, setNumExternalWalls] = useState<string>('4');
    const [uValue, setUValue] = useState<number>(1);
    const [numWindows, setNumWindows] = useState<string>('');
    const [numDoors, setNumDoors] = useState<string>('');
    const [ambientTemperature, setAmbientTemperature] = useState<string>('');
    const [ambientTemperatureUnit, setAmbientTemperatureUnit] = useState<TemperatureUnitType>('C');
    const [internalTemperature, setInternalTemperature] = useState<string>('');
    const [internalTemperatureUnit, setInternalTemperatureUnit] = useState<TemperatureUnitType>('C');
    const [heatloss, setHeatloss] = useState<string>('');
    const [powerRequired, setPowerRequired] = useState<string>('');
    const [powerRequiredUnit, setPowerRequiredUnit] = useState<PowerLossUnitType>('W');
    const [showRoomsDimensions, setShowRoomsDimensions] = useState<boolean>(true);
    const [showRoomsFeatures, setShowRoomsFeatures] = useState<boolean>(true);
    const [showAdditionalDetails, setShowAdditionalDetails] = useState<boolean>(false);
    const [showTemperature, setShowTemperature] = useState<boolean>(true);
    const [showHeatinging, setShowHeatinging] = useState<boolean>(true);

    const handleLengthUnitChange = (newUnitValue: string) => {
        if (!isDimensionsUnit(newUnitValue)) return;
        const newUnit = newUnitValue as DimensionsUnitType;
        
        if (!length || length === '') {
            setLengthUnit(newUnit);
            return;
        }

        const result = handleUnitConversions(Number(length), lengthUnit, newUnit);
        setLength(formatNumber(result));
        setLengthUnit(newUnit);
    };

    const handleWidthUnitChange = (newUnitValue: string) => {
        if (!isDimensionsUnit(newUnitValue)) return;
        const newUnit = newUnitValue as DimensionsUnitType;
        
        if (!width || width === '') {
            setWidthUnit(newUnit);
            return;
        }

        const result = handleUnitConversions(Number(width), widthUnit, newUnit);
        setWidth(formatNumber(result));
        setWidthUnit(newUnit);
    };

    const handleHeightUnitChange = (newUnitValue: string) => {
        if (!isDimensionsUnit(newUnitValue)) return;
        const newUnit = newUnitValue as DimensionsUnitType;
        
        if (!height || height === '') {
            setHeightUnit(newUnit);
            return;
        }

        const result = handleUnitConversions(Number(height), heightUnit, newUnit);
        setHeight(formatNumber(result));
        setHeightUnit(newUnit);
    };

    const handleAmbientTemperatureUnitChange = (newUnitValue: string) => {
        if (!isTemperatureUnit(newUnitValue)) return;
        const newUnit = newUnitValue as TemperatureUnitType;
        
        if (!ambientTemperature || ambientTemperature === '') {
            setAmbientTemperatureUnit(newUnit);
            return;
        }

        // Convert temperature using the utility function
        const result = convertTemperature(ambientTemperature, ambientTemperatureUnit, newUnit);
        setAmbientTemperature(result);
        setAmbientTemperatureUnit(newUnit);
    };

    const handleInternalTemperatureUnitChange = (newUnitValue: string) => {
        if (!isTemperatureUnit(newUnitValue)) return;
        const newUnit = newUnitValue as TemperatureUnitType;
        
        if (!internalTemperature || internalTemperature === '') {
            setInternalTemperatureUnit(newUnit);
            return;
        }

        // Convert temperature using the utility function
        const result = convertTemperature(internalTemperature, internalTemperatureUnit, newUnit);
        setInternalTemperature(result);
        setInternalTemperatureUnit(newUnit);
    };

    const handlePowerRequiredUnitChange = (newUnitValue: string) => {
        if (!isPowerLossUnit(newUnitValue)) return;
        const newUnit = newUnitValue as PowerLossUnitType;
        setPowerRequiredUnit(newUnit);
    };

    const calculateHeatLoss = () => {
        // Basic heat loss calculation using the formulas
        if (!length || !width || !height || !ambientTemperature || !internalTemperature) {
            setHeatloss('');
            setPowerRequired('');
            return;
        }

        const lengthM = Number(length) * conversionMap[lengthUnit];
        const widthM = Number(width) * conversionMap[widthUnit];
        const heightM = Number(height) * conversionMap[heightUnit];
        
        // Convert temperatures to Celsius for calculation
        let ambientC = Number(ambientTemperature);
        let internalC = Number(internalTemperature);
        
        if (ambientTemperatureUnit === 'F') {
            ambientC = (ambientC - 32) * 5/9;
        } else if (ambientTemperatureUnit === 'K') {
            ambientC = ambientC - 273.15;
        }
        
        if (internalTemperatureUnit === 'F') {
            internalC = (internalC - 32) * 5/9;
        } else if (internalTemperatureUnit === 'K') {
            internalC = internalC - 273.15;
        }

        // Calculate surface areas
        const wallArea = 2 * (lengthM * heightM + widthM * heightM);
        const floorArea = level === 'Ground Floor' ? lengthM * widthM : 0;
        const ceilingArea = level === 'Top Floor' ? lengthM * widthM : 0;
        
        // Determine insulation type for calculation
        let insulationType: "none" | "mediocre" | "good" | "custom" = "mediocre";
        if (insulation === 'No extra Insulation') insulationType = 'none';
        else if (insulation === 'Mediocre Insulation') insulationType = 'mediocre';
        else if (insulation === 'Very Well Insulated') insulationType = 'good';
        else if (insulation === 'Custom U-Value') insulationType = 'custom';
        
        // Calculate total heat loss using the formula
        const totalHeatLoss = calcTotalHeatLoss({
            wallArea,
            wallInsulation: insulationType,
            customWallU: insulation === 'Custom U-Value' ? uValue : undefined,
            floorArea,
            ceilingArea,
            areaUnit: 'm2'
        });
        
        // Calculate power required using the formula
        const temperatureDiff = Math.abs(internalC - ambientC);
        const powerWatts = calcPowerRequired(totalHeatLoss, temperatureDiff, 'W');
        
        setHeatloss(formatNumber(totalHeatLoss));
        setPowerRequired(formatNumber(powerWatts));
    };

    useEffect(() => {
        calculateHeatLoss();
    }, [length, width, height, lengthUnit, widthUnit, heightUnit, ambientTemperature, internalTemperature, ambientTemperatureUnit, internalTemperatureUnit, level, insulation, uValue]);

    const clearAll = () => {
        setLength('');
        setWidth('');
        setHeight('');
        setLevel('Ground Floor');
        setInsulation('Mediocre Insulation');
        setNumExternalWalls('4');
        setNumWindows('');
        setNumDoors('');
        setAmbientTemperature('');
        setInternalTemperature('');
        setHeatloss('');
        setPowerRequired('');
        setUValue(1);
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto my-auto py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Heat Loss Calculator
                        <span className="ml-3 text-2xl">❄️</span>
                    </h1>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold mb-6 text-slate-800">Environment & Home Details</h2>
                            <a onClick={() => setShowRoomsDimensions(!showRoomsDimensions)}>
                                {showRoomsDimensions ? (
                                    <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                                ) : (
                                    <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                                )}
                            </a>
                        </div>
                        {showRoomsDimensions && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Length
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={length}
                                            onChange={(e) => setLength(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter length"
                                        />
                                        <UnitDropdown
                                            value={lengthUnit}
                                            onChange={(e) => handleLengthUnitChange(e.target.value)}
                                            unitValues={['m', 'ft', 'in', 'cm', 'yd', 'mm']}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Width
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter width"
                                        />
                                        <UnitDropdown
                                            value={widthUnit}
                                            onChange={(e) => handleWidthUnitChange(e.target.value)}
                                            unitValues={['m', 'ft', 'in', 'cm', 'yd', 'mm']}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Height
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter height"
                                        />
                                        <UnitDropdown
                                            value={heightUnit}
                                            onChange={(e) => handleHeightUnitChange(e.target.value)}
                                            unitValues={['m', 'ft', 'in', 'cm', 'yd', 'mm']}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="bg-white mt-4 rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">Rooms Features</h2>
                        <a onClick={() => setShowRoomsFeatures(!showRoomsFeatures)}>
                            {showRoomsFeatures ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showRoomsFeatures && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Level
                                </label>
                                <div className="flex gap-2">
                                    <select 
                                        name="level" 
                                        id="level" 
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    >
                                        <option value="Ground Floor">Ground Floor</option>
                                        <option value="Intermediate Level">Intermediate Level</option>
                                        <option value="Top Floor">Top Floor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Insulation
                                </label>
                                <div className="flex gap-2">
                                    <select 
                                        name="insulation" 
                                        id="insulation" 
                                        value={insulation}
                                        onChange={(e) => setInsulation(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    >
                                        <option value="No extra Insulation">No extra Insulation</option>
                                        <option value="Mediocre Insulation">Mediocre Insulation</option>
                                        <option value="Very Well Insulated">Very Well Insulated</option>
                                        <option value="Custom U-Value">Custom U-Value (Enter in additional Information Section)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Number of External Walls
                                </label>
                                <div className="flex gap-2">
                                    <select 
                                        name="numExternalWalls" 
                                        id="numExternalWalls" 
                                        value={numExternalWalls}
                                        onChange={(e) => setNumExternalWalls(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white mt-4 rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">Additional Information</h2>
                        <a onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}>
                            {showAdditionalDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showAdditionalDetails && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    U-Value
                                </label>
                                <div className="flex gap-2">
                                    {insulation === 'Custom U-Value' && (
                                        <input 
                                            type="text" 
                                            value={uValue}
                                            onChange={(e) => setUValue(Number(e.target.value) || 1)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                            placeholder="Enter U-Value" 
                                        />
                                    )}
                                    {insulation !== 'Custom U-Value' && (
                                        <input 
                                            type="text" 
                                            value={uValue}
                                            onChange={(e) => setUValue(Number(e.target.value) || 1)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                            placeholder="Enter U-Value" 
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Number of Windows
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={numWindows}
                                        onChange={(e) => setNumWindows(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                        placeholder="Enter Number of Windows" 
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Number of Doors
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={numDoors}
                                        onChange={(e) => setNumDoors(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                        placeholder="Enter Number of Doors" 
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white mt-4 rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">Temperature</h2>
                    </div>
                    {showTemperature && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Ambient Temperature
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={ambientTemperature}
                                        onChange={(e) => setAmbientTemperature(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                        placeholder="Enter Ambient Temperature" 
                                    />
                                    <UnitDropdown
                                        value={ambientTemperatureUnit}
                                        onChange={(e) => handleAmbientTemperatureUnitChange(e.target.value)}
                                        unitValues={['C', 'F', 'K']}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Internal Temperature
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={internalTemperature}
                                        onChange={(e) => setInternalTemperature(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                        placeholder="Enter Internal Temperature" 
                                    />
                                    <UnitDropdown
                                        value={internalTemperatureUnit}
                                        onChange={(e) => handleInternalTemperatureUnitChange(e.target.value)}
                                        unitValues={['C', 'F', 'K']}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white mt-4 rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800">Heating</h2>
                    </div>
                    {showHeatinging && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Heat loss
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={heatloss}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50" 
                                        placeholder="Calculated automatically" 
                                    />
                                    <span className="text-gray-500 text-sm ml-2">W/K</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Power required
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={powerRequired}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50" 
                                        placeholder="Calculated automatically" 
                                    />
                                    <UnitDropdown
                                        value={powerRequiredUnit}
                                        onChange={(e) => handlePowerRequiredUnitChange(e.target.value)}
                                        unitValues={['W', 'kW', 'Btu/h', 'mW', 'MW', 'GW', '(hp(1))']}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="bg-white mt-4 rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={clearAll}
                            className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}