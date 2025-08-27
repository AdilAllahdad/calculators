'use client'

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "@/components/icons";
import UnitDropdown from "@/components/UnitDropdown";
import { formatNumber } from "@/lib/utils";

type DimensionsUnitType = 'm' | 'ft' | 'in' | 'cm' | 'yd' | 'mm';
type TemperatureUnitType = 'C' | 'F' | 'K';
type PowerUnitType = 'W' | 'kW' | 'Btu/h' | 'mW' | 'MW' | 'GW';
type AreaUnitType = 'm2' | 'ft2' | 'yd2';
type HeatLossCoeffUnitType = 'W/m²·K' | 'Btu/h·ft²·°F';
type GreenhouseType = 'gable' | 'quonset' | 'arched' | 'lean-to';
type ConversionMap<T extends string> = Record<T, number>;

const isDimensionUnit = (unit: string): unit is DimensionsUnitType => {
    return ['m', 'ft', 'in', 'cm', 'yd', 'mm'].includes(unit);
};

const isTemperatureUnit = (unit: string): unit is TemperatureUnitType => {
    return ['C', 'F', 'K'].includes(unit);
};

const isPowerUnit = (unit: string): unit is PowerUnitType => {
    return ['W', 'kW', 'Btu/h', 'mW', 'MW', 'GW'].includes(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
    return ['m2', 'ft2', 'yd2'].includes(unit);
};

const isHeatLossCoeffUnit = (unit: string): unit is HeatLossCoeffUnitType => {
    return ['W/m²·K', 'Btu/h·ft²·°F'].includes(unit);
};

const dimensionUnitValues: DimensionsUnitType[] = ['m', 'ft', 'in', 'cm', 'yd', 'mm'];
const temperatureUnitValues: TemperatureUnitType[] = ['C', 'F', 'K'];
const powerUnitValues: PowerUnitType[] = ['W', 'kW', 'Btu/h', 'mW', 'MW', 'GW'];
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2'];
const heatLossCoeffUnitValues: HeatLossCoeffUnitType[] = ['W/m²·K', 'Btu/h·ft²·°F'];

const dimensionConversions: ConversionMap<DimensionsUnitType> = {
    'm': 1,
    'ft': 0.3048,
    'in': 0.0254,
    'cm': 0.01,
    'yd': 0.9144,
    'mm': 0.001
};

const temperatureConversions: ConversionMap<TemperatureUnitType> = {
    'C': 1,
    'F': 1.8,
    'K': 1
};

const powerConversions: ConversionMap<PowerUnitType> = {
    'W': 1,
    'kW': 1000,
    'Btu/h': 0.293071,
    'mW': 0.001,
    'MW': 1000000,
    'GW': 1000000000
};

const areaConversions: ConversionMap<AreaUnitType> = {
    'm2': 1,
    'ft2': 0.092903,
    'yd2': 0.836127
};

const heatLossCoeffConversions: ConversionMap<HeatLossCoeffUnitType> = {
    'W/m²·K': 1,
    'Btu/h·ft²·°F': 0.293071
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
}


interface MaterialOption {
    name: string;
    heatLossCoeff: number;
    unit: string;
}

const materials: MaterialOption[] = [
    { name: 'Polyethylene (4 mm)', heatLossCoeff: 5.7, unit: 'W/m²·K' },
    { name: 'Polyethylene (6 mm)', heatLossCoeff: 5.7, unit: 'W/m²·K' },
    { name: 'Inflated double layer (6 mm)', heatLossCoeff: 3.4, unit: 'W/m²·K' },
    { name: 'Woven polyethylene (11 mm)', heatLossCoeff: 5.7, unit: 'W/m²·K' },
    { name: 'Glass (single layer, 1/8 inch)', heatLossCoeff: 5.9, unit: 'W/m²·K' },
    { name: 'Insulated glass (double layer)', heatLossCoeff: 2.8, unit: 'W/m²·K' },
    { name: 'Fiber glass (single layer)', heatLossCoeff: 5.7, unit: 'W/m²·K' },
    { name: 'Custom heat loss coefficient', heatLossCoeff: 0, unit: 'W/m²·K' }
];

// Calculate surface area based on greenhouse type
const calculateSurfaceArea = (
    type: GreenhouseType,
    totalHeight: number,
    sidewallHeight: number,
    width: number,
    length: number
): number => {
    const h1 = sidewallHeight;
    const h2 = totalHeight - sidewallHeight;
    const w = width;
    const l = length;

    let surfaceArea = 0;

    switch (type) {
        case 'gable':
            // Two sidewalls + two end walls + two roof panels
            surfaceArea = 2 * (h1 * l) + 2 * (h1 * w) + 2 * (Math.sqrt(h2 * h2 + (w / 2) * (w / 2)) * l);
            break;
        case 'quonset':
            // Semi-cylindrical roof + two end walls
            const radius = w / 2;
            const arcLength = Math.PI * radius;
            surfaceArea = arcLength * l + 2 * (Math.PI * radius * radius / 2);
            break;
        case 'arched':
            // Similar to quonset but with different arc calculation
            const archRadius = w / 2;
            const archLength = Math.PI * archRadius;
            surfaceArea = archLength * l + 2 * (Math.PI * archRadius * archRadius / 2);
            break;
        case 'lean-to':
            // One sidewall + one end wall + sloped roof
            const roofLength = Math.sqrt(h2 * h2 + w * w);
            surfaceArea = h1 * l + h1 * w + roofLength * l;
            break;
    }

    return surfaceArea;
};

// Calculate heat loss
const calculateHeatLoss = (
    surfaceArea: number,
    heatLossCoeff: number,
    insideTemp: number,
    outsideTemp: number
): number => {
    const tempDiff = Math.abs(insideTemp - outsideTemp);
    return surfaceArea * heatLossCoeff * tempDiff;
};

// Calculate heater capacity needed
const calculateHeaterCapacity = (heatLoss: number, efficiency: number): number => {
    return heatLoss / efficiency;
};

// Calculate gable height (height from sidewall to peak)
const calculateGableHeight = (totalHeight: number, sidewallHeight: number): number => {
    return totalHeight - sidewallHeight;
};

export default function HoopHouseCalculator() {
    const [greenhouseType, setGreenhouseType] = useState<GreenhouseType>('gable');
    const [totalHeight, setTotalHeight] = useState<string>('');
    const [totalHeightUnit, setTotalHeightUnit] = useState<string>('m');
    const [sidewallHeight, setSidewallHeight] = useState<string>('');
    const [sidewallHeightUnit, setSidewallHeightUnit] = useState<string>('m');
    const [gableHeight, setGableHeight] = useState<string>('');
    const [gableHeightUnit, setGableHeightUnit] = useState<string>('m');
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<string>('m');
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<string>('m');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('Polyethylene (6 mm)');
    const [insideTemperature, setInsideTemperature] = useState<string>('');
    const [insideTemperatureUnit, setInsideTemperatureUnit] = useState<string>('C');
    const [outsideTemperature, setOutsideTemperature] = useState<string>('');
    const [outsideTemperatureUnit, setOutsideTemperatureUnit] = useState<string>('C');
    const [heaterEfficiency, setHeaterEfficiency] = useState<string>('0.8');
    const [pricePerUnit, setPricePerUnit] = useState<string>('');
    const [pricePerUnitUnit, setPricePerUnitUnit] = useState<string>('$/m²');
    const [heatLossCoeff, setHeatLossCoeff] = useState<string>('');
    const [heatLossCoeffUnit, setHeatLossCoeffUnit] = useState<string>('W/m²·K');
    const [surfaceArea, setSurfaceArea] = useState<string>('');
    const [surfaceAreaUnit, setSurfaceAreaUnit] = useState<string>('m²');
    const [heatLoss, setHeatLoss] = useState<string>('');
    const [heatLossUnit, setHeatLossUnit] = useState<string>('W');
    const [heaterCapacity, setHeaterCapacity] = useState<string>('');
    const [heaterCapacityUnit, setHeaterCapacityUnit] = useState<string>('W');
    const [materialCost, setMaterialCost] = useState<string>('');
    const [showGreenhouseDetails, setShowGreenhouseDetails] = useState<boolean>(true);
    const [showMaterialDetails, setShowMaterialDetails] = useState<boolean>(true);
    const [showHeatLossDetails, setShowHeatLossDetails] = useState<boolean>(true);
    const [showMaterialCostDetails, setShowMaterialCostDetails] = useState<boolean>(true);

    // Calculate gable height when total height or sidewall height changes
    useEffect(() => {
        if (totalHeight && sidewallHeight) {
            const totalHeightNum = Number(totalHeight);
            const sidewallHeightNum = Number(sidewallHeight);
            const gableHeightNum = calculateGableHeight(totalHeightNum, sidewallHeightNum);

            if (gableHeightNum > 0) {
                setGableHeight(formatNumber(gableHeightNum));
            } else {
                setGableHeight('');
            }
        } else {
            setGableHeight('');
        }
    }, [totalHeight, sidewallHeight]);

    // Calculate all values when inputs change
    useEffect(() => {
        if (!totalHeight || !sidewallHeight || !width || !length || !insideTemperature || !outsideTemperature) {
            setSurfaceArea('');
            setHeatLoss('');
            setHeaterCapacity('');
            setMaterialCost('');
            return;
        }

        // Validate gable height and sidewall height
        const totalHeightNum = Number(totalHeight);
        const sidewallHeightNum = Number(sidewallHeight);
        const gableHeightNum = calculateGableHeight(totalHeightNum, sidewallHeightNum);

        if (gableHeightNum <= 0) {
            setSurfaceArea('');
            setHeatLoss('');
            setHeaterCapacity('');
            setMaterialCost('');
            return;
        }

        // Validate heater efficiency
        const efficiency = Number(heaterEfficiency);
        if (efficiency <= 0 || efficiency > 1) {
            setSurfaceArea('');
            setHeatLoss('');
            setHeaterCapacity('');
            setMaterialCost('');
            return;
        }

        // Calculate surface area
        const area = calculateSurfaceArea(
            greenhouseType,
            totalHeightNum,
            sidewallHeightNum,
            Number(width),
            Number(length)
        );
        setSurfaceArea(formatNumber(area));

        // Get heat loss coefficient
        const material = materials.find(m => m.name === selectedMaterial);
        let heatLossCoeffValue = material?.heatLossCoeff || 0;

        // If custom material is selected, use the manually entered value
        if (selectedMaterial === 'Custom heat loss coefficient') {
            heatLossCoeffValue = Number(heatLossCoeff) || 0;
        }

        if (heatLossCoeffValue > 0) {
            // Calculate heat loss in watts
            const heatLossWatts = calculateHeatLoss(area, heatLossCoeffValue, Number(insideTemperature), Number(outsideTemperature));

            // Convert to kilowatts for display
            const heatLossKW = heatLossWatts / 1000;
            setHeatLoss(formatNumber(heatLossKW));

            // Calculate heater capacity
            const capacityWatts = calculateHeaterCapacity(heatLossWatts, efficiency);
            const capacityKW = capacityWatts / 1000;
            setHeaterCapacity(formatNumber(capacityKW));
        } else {
            setHeatLoss('');
            setHeaterCapacity('');
        }

        // Calculate material cost if price is provided
        if (pricePerUnit && area > 0) {
            const cost = area * Number(pricePerUnit);
            setMaterialCost(formatNumber(cost));
        } else {
            setMaterialCost('');
        }
    }, [
        greenhouseType, totalHeight, sidewallHeight, width, length,
        selectedMaterial, insideTemperature, outsideTemperature, heaterEfficiency, pricePerUnit, heatLossCoeff
    ]);

    // Handle material selection changes
    useEffect(() => {
        const material = materials.find(m => m.name === selectedMaterial);
        if (material) {
            setHeatLossCoeffUnit(material.unit);
            if (selectedMaterial !== 'Custom heat loss coefficient') {
                setHeatLossCoeff(material.heatLossCoeff.toString());
            }
        }
    }, [selectedMaterial]);

    // Handle unit conversions for dimensions
    const handleDimensionUnitChange = (newUnit: string, oldUnit: string, value: string, setter: (value: string) => void, unitSetter: (unit: string) => void) => {
        if (value && oldUnit !== newUnit) {
            const convertedValue = handleUnitConversion(oldUnit as DimensionsUnitType, newUnit as DimensionsUnitType, value, dimensionConversions);
            setter(convertedValue.toString());
            unitSetter(newUnit);
        }
    };

    const handleTemperatureUnitChange = (newUnit: string, oldUnit: string, value: string, setter: (value: string) => void, unitSetter: (unit: string) => void) => {
        if (value && oldUnit !== newUnit) {
            const convertedValue = handleUnitConversion(oldUnit as TemperatureUnitType, newUnit as TemperatureUnitType, value, temperatureConversions);
            setter(convertedValue.toString());
            unitSetter(newUnit);
        }
    };

    const handlePowerUnitChange = (newUnit: string, oldUnit: string, value: string, setter: (value: string) => void, unitSetter: (unit: string) => void) => {
        if (value && oldUnit !== newUnit) {
            const convertedValue = handleUnitConversion(oldUnit as PowerUnitType, newUnit as PowerUnitType, value, powerConversions);
            setter(convertedValue.toString());
            unitSetter(newUnit);
        }
    };

    const handleAreaUnitChange = (newUnit: string, oldUnit: string, value: string, setter: (value: string) => void, unitSetter: (unit: string) => void) => {
        if (value && oldUnit !== newUnit) {
            const convertedValue = handleUnitConversion(oldUnit as AreaUnitType, newUnit as AreaUnitType, value, areaConversions);
            setter(convertedValue.toString());
            unitSetter(newUnit);
        }
    };

    const handleHeatLossCoeffUnitChange = (newUnit: string, oldUnit: string, value: string, setter: (value: string) => void, unitSetter: (unit: string) => void) => {
        if (value && oldUnit !== newUnit) {
            const convertedValue = handleUnitConversion(oldUnit as HeatLossCoeffUnitType, newUnit as HeatLossCoeffUnitType, value, heatLossCoeffConversions);
            setter(convertedValue.toString());
            unitSetter(newUnit);
        }
    };

    const getImage = () => {
        switch (greenhouseType) {
            case 'gable':
                return '/gabled-roof.png';
            case 'quonset':
                return '/Quonsen-hut.png';
            case 'arched':
                return '/arched-roof.png';
            case 'lean-to':
                return '/Lean-to.png';
            default:
                return '/gabled-roof.png';
        }
    }

    const reloadCalculator = () => {
        setTotalHeight('');
        setSidewallHeight('');
        setWidth('');
        setLength('');
        setInsideTemperature('');
    }

    const shareResult = () => {
        const resultText = `Hoop House Calculator Results:
Surface Area: ${surfaceArea} m²
Heat Loss: ${heatLoss} kW
Heater Capacity: ${heaterCapacity} kW
Material Cost: ${materialCost ? `$${materialCost}` : 'Not calculated'}`;

        if (navigator.share) {
            navigator.share({
                title: 'Hoop House Calculator Result',
                text: resultText
            });
        } else {
            navigator.clipboard.writeText(resultText);
            alert('Result copied to clipboard!');
        }
    }

    const clearAll = () => {
        setTotalHeight('');
        setSidewallHeight('');
        setGableHeight('');
        setWidth('');
        setLength('');
        setInsideTemperature('');
        setOutsideTemperature('');
        setHeaterEfficiency('0.8');
        setPricePerUnit('');
        setSurfaceArea('');
        setHeatLoss('');
        setHeaterCapacity('');
        setMaterialCost('');
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto my-auto py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Hoop House Calculator
                        <span className="ml-3 text-2xl">🏠</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Calculate greenhouse surface area, heat loss, heater requirements, and material costs for different types of hoop houses and greenhouses.
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Greenhouse Type</h2>
                        <a onClick={() => setShowGreenhouseDetails(!showGreenhouseDetails)}>
                            {showGreenhouseDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>

                    <select
                        value={greenhouseType}
                        onChange={(e) => setGreenhouseType(e.target.value as GreenhouseType)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                        <option value="gable">Gabled Roof</option>
                        <option value="quonset">Quonset Hut</option>
                        <option value="lean-to">Lean-to</option>
                        <option value="arched">Arched Roof</option>
                    </select>
                    <img src={getImage()} alt="Greenhouse Type" className="w-full h-auto mt-4 rounded-lg" />
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Height</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={totalHeight}
                                    onChange={(e) => setTotalHeight(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter total height"
                                />
                                <UnitDropdown
                                    value={totalHeightUnit}
                                    onChange={(e) => handleDimensionUnitChange(e.target.value, totalHeightUnit, totalHeight, setTotalHeight, setTotalHeightUnit)}
                                    unitValues={dimensionUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                            {totalHeight && sidewallHeight && Number(totalHeight) <= Number(sidewallHeight) && (
                                <p className="text-red-500 text-sm mt-1">Gable height must be greater than 0. Total height must be greater than sidewall height.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Sidewall Height</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={sidewallHeight}
                                    onChange={(e) => setSidewallHeight(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter sidewall height"
                                />
                                <UnitDropdown
                                    value={sidewallHeightUnit}
                                    onChange={(e) => handleDimensionUnitChange(e.target.value, sidewallHeightUnit, sidewallHeight, setSidewallHeight, setSidewallHeightUnit)}
                                    unitValues={dimensionUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                            {totalHeight && sidewallHeight && Number(sidewallHeight) >= Number(totalHeight) && (
                                <p className="text-red-500 text-sm mt-1">Sidewall height must be smaller than total height.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Gable Height</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={gableHeight}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                    placeholder="Calculated automatically"
                                />
                                <UnitDropdown
                                    value={totalHeightUnit}
                                    onChange={(e) => handleDimensionUnitChange(e.target.value, totalHeightUnit, totalHeight, setTotalHeight, setTotalHeightUnit)}
                                    unitValues={dimensionUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Width</label>
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
                                    onChange={(e) => handleDimensionUnitChange(e.target.value, widthUnit, width, setWidth, setWidthUnit)}
                                    unitValues={dimensionUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Length</label>
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
                                    onChange={(e) => handleDimensionUnitChange(e.target.value, lengthUnit, length, setLength, setLengthUnit)}
                                    unitValues={dimensionUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Material and Environment</h2>
                        <a onClick={() => setShowMaterialDetails(!showMaterialDetails)}>
                            {showMaterialDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showMaterialDetails && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
                                <select
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                >
                                    {materials.map((material) => (
                                        <option key={material.name} value={material.name}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Heat Loss Coefficient</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={heatLossCoeff}
                                        onChange={(e) => setHeatLossCoeff(e.target.value)}
                                        readOnly={selectedMaterial !== 'Custom heat loss coefficient'}
                                        className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${selectedMaterial !== 'Custom heat loss coefficient' ? 'bg-gray-50 cursor-not-allowed' : ''
                                            }`}
                                        placeholder={selectedMaterial === 'Custom heat loss coefficient' ? "Enter heat loss coefficient" : "Auto-filled from material"}
                                    />
                                    <UnitDropdown
                                        value={heatLossCoeffUnit}
                                        onChange={(e) => handleHeatLossCoeffUnitChange(e.target.value, heatLossCoeffUnit, heatLossCoeff, setHeatLossCoeff, setHeatLossCoeffUnit)}
                                        unitValues={heatLossCoeffUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                                {selectedMaterial !== 'Custom heat loss coefficient' && (
                                    <p className="text-sm text-gray-500 mt-1">Value automatically set based on selected material</p>
                                )}
                                {selectedMaterial === 'Custom heat loss coefficient' && (
                                    <p className="text-sm text-gray-500 mt-1">Enter your custom heat loss coefficient value</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Inside Temperature</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={insideTemperature}
                                        onChange={(e) => setInsideTemperature(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter inside temperature"
                                    />
                                    <UnitDropdown
                                        value={insideTemperatureUnit}
                                        onChange={(e) => handleTemperatureUnitChange(e.target.value, insideTemperatureUnit, insideTemperature, setInsideTemperature, setInsideTemperatureUnit)}
                                        unitValues={temperatureUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Outside Temperature</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={outsideTemperature}
                                        onChange={(e) => setOutsideTemperature(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter outside temperature"
                                    />
                                    <UnitDropdown
                                        value={outsideTemperatureUnit}
                                        onChange={(e) => handleTemperatureUnitChange(e.target.value, outsideTemperatureUnit, outsideTemperature, setOutsideTemperature, setOutsideTemperatureUnit)}
                                        unitValues={temperatureUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Heat Loss and Heater Details</h2>
                        <a onClick={() => setShowHeatLossDetails(!showHeatLossDetails)}>
                            {showHeatLossDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showHeatLossDetails && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Heat Loss</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={heatLoss}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                        placeholder="Calculated automatically"
                                    />
                                    <UnitDropdown
                                        value={heatLossUnit}
                                        onChange={(e) => handlePowerUnitChange(e.target.value, heatLossUnit, heatLoss, setHeatLoss, setHeatLossUnit)}
                                        unitValues={powerUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Heater Efficiency</label>
                                <input
                                    type="text"
                                    value={heaterEfficiency}
                                    onChange={(e) => setHeaterEfficiency(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter heater efficiency (0.0 - 1.0)"
                                />
                                <span className="text-sm text-gray-500">Decimal value (e.g., 0.8 for 80%)</span>
                                {heaterEfficiency && (Number(heaterEfficiency) <= 0 || Number(heaterEfficiency) > 1) && (
                                    <p className="text-red-500 text-sm mt-1">Heater efficiency must be between 0 and 1.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Heater Capacity Needed</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={heaterCapacity}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                        placeholder="Calculated automatically"
                                    />
                                    <UnitDropdown
                                        value={heaterCapacityUnit}
                                        onChange={(e) => handlePowerUnitChange(e.target.value, heaterCapacityUnit, heaterCapacity, setHeaterCapacity, setHeaterCapacityUnit)}
                                        unitValues={powerUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Results</h2>
                        <a onClick={() => setShowMaterialCostDetails(!showMaterialCostDetails)}>
                            {showMaterialCostDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showMaterialCostDetails && (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Price per Square Meter</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={pricePerUnit}
                                            onChange={(e) => setPricePerUnit(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter price per square meter"
                                        />
                                        <UnitDropdown
                                            value={pricePerUnitUnit}
                                            onChange={(e) => handleAreaUnitChange(e.target.value, pricePerUnitUnit, pricePerUnit, setPricePerUnit, setPricePerUnitUnit)}
                                            unitValues={areaUnitValues}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Material Cost</label>
                                    <div className="flex flex-row gap-2">
                                        <span className="text-2xl text-gray-500 mt-1">PKR</span>
                                        <input
                                            type="text"
                                            value={materialCost}
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                            placeholder="Calculated automatically"
                                        />
                                    </div>
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
