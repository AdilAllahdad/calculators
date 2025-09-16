'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit systemal
type LengthUnitType = 'm' | 'ft' | 'cm' | 'in' | 'm/cm' | 'ft/in';
type AreaUnitType = 'm2' | 'ft2' | 'yd2';
type MaterialAreaUnitType = 'm2' | 'ft2' | 'yd2';
type CostPerUnitUnitType = 'm2' | 'ft2' | 'yd2';
type ConversionMap<T extends string> = Record<T, number>;

// Area conversion factors (to square meters)
const areaConversionFactors: ConversionMap<AreaUnitType> = {
    'm2': 1,          // square meters (base unit)
    'ft2': 0.092903,  // square feet to square meters
    'yd2': 0.836127   // square yards to square meters
};

// Helper functions for type safety
const isLengthUnit = (unit: string): unit is LengthUnitType => {
    return ['m', 'ft', 'cm', 'in', 'm/cm', 'ft/in'].includes(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
    return ['mm2', 'cm2', 'm2', 'ha', 'km2', 'in2', 'ft2', 'yd2', 'ac', 'mi2'].includes(unit);
};

const isMaterialAreaUnit = (unit: string): unit is MaterialAreaUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};

const isCostPerUnitUnit = (unit: string): unit is CostPerUnitUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};


// Define the unit values needed for each dropdown
interface UnitOption {
    value: LengthUnitType;
    label: string;
}

const lengthUnitOptions: UnitOption[] = [
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'ft/in', label: 'feet / inches (ft / in)' },
    { value: 'm/cm', label: 'meters / centimeters (m / cm)' }
];

const lengthUnitValues = lengthUnitOptions.map(option => option.value);
const widthUnitValues = lengthUnitValues;
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2'];
const materialAreaUnitValues: MaterialAreaUnitType[] = ['m2', 'ft2', 'yd2'];
const costPerUnitUnitValues: CostPerUnitUnitType[] = ['m2', 'ft2', 'yd2'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<LengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'cm': 0.01,       // centimeters to meters
  'in': 0.0254,     // inches to meters
  'm/cm': 1,        // meters/centimeters (treated same as meters for base conversion)
  'ft/in': 0.3048   // feet/inches (treated same as feet for base conversion)
};

const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'cm2': 0.0001,    // square centimeters to square meters
  'in2': 0.00064516 // square inches to square meters
};

const materialAreaConversions: ConversionMap<MaterialAreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'yd2': 0.836127   // square yards to square meters
};

// Unit conversion helper
function handleUnitConversion<T extends string>(
  currentUnit: T,
  newUnit: T,
  value: number,
  conversionTable: ConversionMap<T>
): number {
  if (!value) return 0;
  const standardValue = value * conversionTable[currentUnit];
  if (currentUnit === newUnit) return standardValue;
  return standardValue / conversionTable[newUnit];
}

const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

const formatCombinedLength = (value: number, unit: LengthUnitType): string => {
  if (unit === 'm/cm') {
    const meters = Math.floor(value);
    const centimeters = Math.round((value - meters) * 100);
    return `${meters}m ${centimeters}cm`;
  } else if (unit === 'ft/in') {
    const feet = Math.floor(value);
    const inches = Math.round((value - feet) * 12);
    return `${feet}ft ${inches}in`;
  }
  return value.toFixed(4);
};

export default function FlooringCalculator() {
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<LengthUnitType>('m');
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<LengthUnitType>('m');
    const [area, setArea] = useState<string>('');
    const [areaUnit, setAreaUnit] = useState<AreaUnitType>('m2');
    const [wasteFactor, setWasteFactor] = useState<string>('');
    const [materialArea, setMaterialArea] = useState<string>('');
    const [materialAreaUnit, setMaterialAreaUnit] = useState<MaterialAreaUnitType>('m2');
    const [costPerUnit, setCostPerUnit] = useState<string>('');
    const [costPerUnitUnit, setCostPerUnitUnit] = useState<CostPerUnitUnitType>('m2');
    const [totalCost, setTotalCost] = useState<string>('');
    const [showFloorSizeDetails, setShowFloorSizeDetails] = useState<boolean>(true);
    const [showFlooringCosts, setShowFlooringCosts] = useState<boolean>(true);

    const handleLengthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!length || length === '') {
            setLengthUnit(newUnit);
            return;
        }

        if (isLengthUnit(lengthUnit) && isLengthUnit(newUnit)) {
            const result = handleUnitConversion(lengthUnit, newUnit, Number(length), lengthConversions);
            setLength(result.toFixed(4));
        }
        setLengthUnit(newUnit);
    };

    const handleWidthUnitChange = (newUnitValue: string) => {
        if (!isLengthUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!width || width === '') {
            setWidthUnit(newUnit);
            return;
        }

        if (isLengthUnit(widthUnit) && isLengthUnit(newUnit)) {
            const result = handleUnitConversion(widthUnit, newUnit, Number(width), lengthConversions);
            setWidth(result.toFixed(4));
        }
        setWidthUnit(newUnit);
    };

    const handleAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!area || area === '') {
            setArea('0');
            setAreaUnit(newUnit);
            // Also recalculate material area to ensure it never becomes empty
            calculateMaterialArea();
            return;
        }

        if (isAreaUnit(areaUnit) && isAreaUnit(newUnit)) {
            // Convert to base unit (m²) first, then to target unit
            const areaInSqMeters = Number(area) * areaConversionFactors[areaUnit];
            const result = areaInSqMeters / areaConversionFactors[newUnit];
            setArea(result.toFixed(4));
        }
        setAreaUnit(newUnit);
        // Always recalculate material area after area unit change
        setTimeout(() => {
            calculateMaterialArea();
        }, 0);
    };

    const handleMaterialAreaUnitChange = (newUnitValue: string) => {
        if (!isMaterialAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!materialArea || materialArea === '') {
            setMaterialArea('0');
            setMaterialAreaUnit(newUnit);
            return;
        }

        if (isMaterialAreaUnit(materialAreaUnit) && isMaterialAreaUnit(newUnit)) {
            const result = handleUnitConversion(materialAreaUnit, newUnit, Number(materialArea), materialAreaConversions);
            setMaterialArea(result.toFixed(4));
        }
        setMaterialAreaUnit(newUnit);
    };

    const handleCostPerUnitUnitChange = (newUnitValue: string) => {
        if (!isCostPerUnitUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!costPerUnit || costPerUnit === '') {
            setCostPerUnitUnit(newUnit);
            return;
        }   

        if (isCostPerUnitUnit(costPerUnitUnit) && isCostPerUnitUnit(newUnit)) {
            // Store current total cost
            const currentTotalCost = totalCost;
            
            // For cost per unit, we need to apply the inverse conversion
            // because cost per m² = cost per ft² * (ft²/m²)
            const result = Number(costPerUnit) * (materialAreaConversions[newUnit] / materialAreaConversions[costPerUnitUnit]);
            setCostPerUnit(result.toFixed(4));
            
            // Restore the original total cost
            setTotalCost(currentTotalCost);
        }
        setCostPerUnitUnit(newUnit);
    };

    const calculateArea = () => {
        const lengthNum = parseFloat(length) || 0;
        const widthNum = parseFloat(width) || 0;
        if (lengthNum <= 0 || widthNum <= 0) {
            setArea('0');
            return;
        }

        // Convert to meters using type-safe conversion
        const lengthInMeters = lengthNum * lengthConversions[lengthUnit];
        const widthInMeters = widthNum * lengthConversions[widthUnit];

        const areaInSquareMeters = lengthInMeters * widthInMeters;

        // Convert to selected unit using type-safe conversion
        const areaDisplay = areaInSquareMeters / areaConversionFactors[areaUnit];
        setArea(areaDisplay.toFixed(4));
    };

    const calculateMaterialArea = () => {
        const areaNum = parseFloat(area) || 0;
        const wasteFactorNum = parseFloat(wasteFactor) || 0;
        if (areaNum <= 0) {
            setMaterialArea('0');
            return;
        }

        // Convert area to meters using type-safe conversion
        const areaInSquareMeters = areaNum * areaConversions[areaUnit];

        const materialAreaInSquareMeters = areaInSquareMeters * (1 + wasteFactorNum / 100);

        // Convert to selected unit using type-safe conversion
        const materialAreaDisplay = materialAreaInSquareMeters / materialAreaConversions[materialAreaUnit];
        setMaterialArea(materialAreaDisplay.toFixed(4));
    };

    const calculateTotalCost = () => {
        // Don't recalculate if we're just changing units
        if (!materialArea || !costPerUnit || materialArea === '0' || costPerUnit === '0') {
            setTotalCost('0');
            return;
        }

        const materialAreaNum = parseFloat(materialArea);
        const costPerUnitNum = parseFloat(costPerUnit);

        // Convert material area to meters using type-safe conversion
        const materialAreaInSquareMeters = materialAreaNum * materialAreaConversions[materialAreaUnit];
        // Convert cost per unit to base unit (per m²)
        const costPerUnitInBaseUnit = costPerUnitNum / materialAreaConversions[costPerUnitUnit];

        const totalCostNum = materialAreaInSquareMeters * costPerUnitInBaseUnit;
        setTotalCost(totalCostNum.toFixed(4));
    };

    const handleNumberInput = (value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        const cleanValue = value.replace(/[^0-9.]/g, '');
        setValue(cleanValue);
    };

    const handleFocus = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === '' || currentValue === '0') {
          e.target.select();
        }
    };

    const clearAll = () => {
        setLength('');
        setWidth('');
        setArea('');
        setWasteFactor('');
        setMaterialArea('');
        setCostPerUnit('');
        setTotalCost('');
    };

    const reloadCalculator = () => {
        setLength('');
        setWidth('');
        setArea('');
        setWasteFactor('');
        setMaterialArea('');
        setCostPerUnit('');
        setTotalCost('');
    };

    const shareResult = () => {
        const formattedLength = lengthUnit === 'm/cm' || lengthUnit === 'ft/in' 
            ? formatCombinedLength(parseFloat(length) || 0, lengthUnit)
            : `${length} ${lengthUnit}`;
        const formattedWidth = widthUnit === 'm/cm' || widthUnit === 'ft/in'
            ? formatCombinedLength(parseFloat(width) || 0, widthUnit)
            : `${width} ${widthUnit}`;
            
        const result = `Length: ${formattedLength}\nWidth: ${formattedWidth}\nArea: ${area} ${areaUnit}\nWaste Factor: ${wasteFactor}\nMaterial Area: ${materialArea} ${materialAreaUnit}\nCost per Unit: ${costPerUnit} ${costPerUnitUnit}\nTotal Cost: ${totalCost}`;
        if (navigator.share) {
          navigator.share({
            title: 'Flooring Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
    };

    useEffect(() => {
        calculateArea();
    }, [length, width, lengthUnit, widthUnit, areaUnit]);

    useEffect(() => {
        calculateMaterialArea();
    }, [area, wasteFactor, areaUnit, materialAreaUnit]);

    useEffect(() => {
        calculateTotalCost();
    }, [materialArea, costPerUnit, materialAreaUnit, costPerUnitUnit]);

    return (
        <div className="flex justify-center">    
            <div className="max-w-4xl mx-auto my-auto py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Flooring Calculator 
                        <span className="ml-3 text-2xl">🧷</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold mb-6 text-slate-800"> Floor Size Details</h2>
                        <a onClick={() => setShowFloorSizeDetails(!showFloorSizeDetails)}>
                            {showFloorSizeDetails ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                        </div>
                    </div>
                    {showFloorSizeDetails && (
                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Room Length
                            </label>
                            <div className="flex gap-2">
                                {lengthUnit === 'm/cm' ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="number"
                                            value={Math.floor(parseFloat(length) || 0)}
                                            onChange={(e) => {
                                                const meters = parseFloat(e.target.value) || 0;
                                                const centimeters = (parseFloat(length) || 0) % 1 * 100;
                                                setLength((meters + centimeters / 100).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Meters"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={((parseFloat(length) || 0) % 1 * 100).toFixed(4)}
                                            onChange={(e) => {
                                                const meters = Math.floor(parseFloat(length) || 0);
                                                const centimeters = parseFloat(e.target.value) || 0;
                                                setLength((meters + centimeters / 100).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            max="99.9999"
                                            placeholder="CM"
                                        />
                                    </div>
                                ) : lengthUnit === 'ft/in' ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="number"
                                            value={Math.floor(parseFloat(length) || 0)}
                                            onChange={(e) => {
                                                const feet = parseFloat(e.target.value) || 0;
                                                const inches = (parseFloat(length) || 0) % 1 * 12;
                                                setLength((feet + inches / 12).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Feet"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={((parseFloat(length) || 0) % 1 * 12).toFixed(4)}
                                            onChange={(e) => {
                                                const feet = Math.floor(parseFloat(length) || 0);
                                                const inches = parseFloat(e.target.value) || 0;
                                                setLength((feet + inches / 12).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Inches"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        value={length}
                                        onChange={(e) => handleNumberInput(e.target.value, setLength)}
                                        onFocus={(e) => handleFocus(length, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter length"
                                    />
                                )}
                                <UnitDropdown
                                    value={lengthUnit}
                                    onChange={(e) => handleLengthUnitChange(e.target.value)}
                                    unitValues={lengthUnitValues}
                                    options={lengthUnitOptions}
                                    className="w-64 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Room Width
                            </label>
                            <div className="flex gap-2">
                                {widthUnit === 'm/cm' ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="number"
                                            value={Math.floor(parseFloat(width) || 0)}
                                            onChange={(e) => {
                                                const meters = parseFloat(e.target.value) || 0;
                                                const centimeters = (parseFloat(width) || 0) % 1 * 100;
                                                setWidth((meters + centimeters / 100).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Meters"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={((parseFloat(width) || 0) % 1 * 100).toFixed(4)}
                                            onChange={(e) => {
                                                const meters = Math.floor(parseFloat(width) || 0);
                                                const centimeters = parseFloat(e.target.value) || 0;
                                                setWidth((meters + centimeters / 100).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            max="99.9999"
                                            placeholder="CM"
                                        />
                                    </div>
                                ) : widthUnit === 'ft/in' ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="number"
                                            value={Math.floor(parseFloat(width) || 0)}
                                            onChange={(e) => {
                                                const feet = parseFloat(e.target.value) || 0;
                                                const inches = (parseFloat(width) || 0) % 1 * 12;
                                                setWidth((feet + inches / 12).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Feet"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={((parseFloat(width) || 0) % 1 * 12).toFixed(4)}
                                            onChange={(e) => {
                                                const feet = Math.floor(parseFloat(width) || 0);
                                                const inches = parseFloat(e.target.value) || 0;
                                                setWidth((feet + inches / 12).toString());
                                            }}
                                            className="w-[calc(50%-0.25rem)] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            min="0"
                                            placeholder="Inches"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                                        onFocus={(e) => handleFocus(width, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter width"
                                    />
                                )}
                                <UnitDropdown
                                    value={widthUnit}
                                    onChange={(e) => handleWidthUnitChange(e.target.value)}
                                    unitValues={widthUnitValues}
                                    options={lengthUnitOptions}
                                    className="w-64 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Area
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={area}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                    min="0"
                                    placeholder="Calculated area"
                                />
                                <UnitDropdown
                                    value={areaUnit}
                                    onChange={(e) => handleAreaUnitChange(e.target.value)}
                                    options={[
                                        { value: 'm2', label: 'square meters (m²)' },
                                        { value: 'ft2', label: 'square feet (ft²)' },
                                        { value: 'yd2', label: 'square yards (yd²)' }
                                    ]}
                                    className="w-48 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>
                )}
                </div>
                <div className='bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Waste Factor</h2>
                        <a onClick={() => setShowFlooringCosts(!showFlooringCosts)}>
                            {showFlooringCosts ? (
                                <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                            )}
                        </a>
                    </div>
                    {showFlooringCosts && (
                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Waste Factor
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={wasteFactor}
                                    onChange={(e) => handleNumberInput(e.target.value, setWasteFactor)}
                                    onFocus={(e) => handleFocus(wasteFactor, e)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                    min="0"
                                    placeholder="Enter waste factor"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Total Material Area Required
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={materialArea}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                    style={{ color: '#1e293b' }}
                                    min="0"
                                    placeholder="Calculated material area"
                                />
                                <UnitDropdown
                                    value={materialAreaUnit}
                                    onChange={(e) => handleMaterialAreaUnitChange(e.target.value)}
                                    unitValues={materialAreaUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Cost of material per unit area
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                    PKR
                                </div>
                                <input
                                    type="number"
                                    value={costPerUnit}
                                    onChange={(e) => handleNumberInput(e.target.value, setCostPerUnit)}
                                    onFocus={(e) => handleFocus(costPerUnit, e)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                    min="0"
                                    placeholder="Enter cost per unit"
                                />
                                <UnitDropdown
                                    value={costPerUnitUnit}
                                    onChange={(e) => handleCostPerUnitUnitChange(e.target.value)}
                                    unitValues={costPerUnitUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Total Cost
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                    PKR
                                </div>
                                <input
                                    type="number"
                                    value={totalCost}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                    style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                                />
                            </div>
                        </div>
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

































































