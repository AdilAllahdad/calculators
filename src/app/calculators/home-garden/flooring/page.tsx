'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type LengthUnitType = 'm' | 'ft' | 'cm' | 'in';
type AreaUnitType = 'm2' | 'ft2' | 'cm2' | 'in2';
type MaterialAreaUnitType = 'm2' | 'ft2' | 'yd2';
type CostPerUnitUnitType = 'm2' | 'ft2' | 'yd2';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return ['m', 'ft', 'cm', 'in'].includes(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'cm2', 'in2'].includes(unit);
};

const isMaterialAreaUnit = (unit: string): unit is MaterialAreaUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};

const isCostPerUnitUnit = (unit: string): unit is CostPerUnitUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};


// Define the unit values needed for each dropdown
const lengthUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const widthUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'cm2', 'in2'];
const materialAreaUnitValues: MaterialAreaUnitType[] = ['m2', 'ft2', 'yd2'];
const costPerUnitUnitValues: CostPerUnitUnitType[] = ['m2', 'ft2', 'yd2'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<LengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'cm': 0.01,       // centimeters to meters
  'in': 0.0254      // inches to meters
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
            setAreaUnit(newUnit);
            return;
        }

        if (isAreaUnit(areaUnit) && isAreaUnit(newUnit)) {
            const result = handleUnitConversion(areaUnit, newUnit, Number(area), areaConversions);
            setArea(result.toFixed(4));
        }
        setAreaUnit(newUnit);
    };

    const handleMaterialAreaUnitChange = (newUnitValue: string) => {
        if (!isMaterialAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!materialArea || materialArea === '') {
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
            const result = handleUnitConversion(costPerUnitUnit, newUnit, Number(costPerUnit), materialAreaConversions);
            setCostPerUnit(result.toFixed(4));
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
        const areaDisplay = areaInSquareMeters / areaConversions[areaUnit];
        setArea(areaDisplay.toFixed(4));
    };

    const calculateMaterialArea = () => {
        const areaNum = parseFloat(area) || 0;
        const wasteFactorNum = parseFloat(wasteFactor) || 0;
        if (areaNum <= 0 || wasteFactorNum <= 0) {
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
        const materialAreaNum = parseFloat(materialArea) || 0;
        const costPerUnitNum = parseFloat(costPerUnit) || 0;
        if (materialAreaNum <= 0 || costPerUnitNum <= 0) {
            setTotalCost('0');
            return;
        }

        // Convert material area to meters using type-safe conversion
        const materialAreaInSquareMeters = materialAreaNum * materialAreaConversions[materialAreaUnit];

        const totalCostNum = materialAreaInSquareMeters * costPerUnitNum;
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
        const result = `Length: ${length} ${lengthUnit}\nWidth: ${width} ${widthUnit}\nArea: ${area} ${areaUnit}\nWaste Factor: ${wasteFactor}\nMaterial Area: ${materialArea} ${materialAreaUnit}\nCost per Unit: ${costPerUnit} ${costPerUnitUnit}\nTotal Cost: ${totalCost}`;
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
                                Room Width
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
                                    placeholder="Enter width"
                                />
                                <UnitDropdown
                                    value={widthUnit}
                                    onChange={(e) => handleWidthUnitChange(e.target.value)}
                                    unitValues={widthUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                                    unitValues={areaUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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





























































