'use client'

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import UnitDropdown from "@/components/UnitDropdown";
import { formatNumber } from "@/lib/utils";

type DimensionsUnitType = 'm' | 'ft' | 'in' | 'cm' | 'yd' | 'mm';
type TemperatureUnitType = 'C' | 'F' | 'K';
type PowerUnitType = 'W' | 'kW' | 'Btu/h' | 'mW' | 'MW' | 'GW';
type AreaUnitType = 'm2' | 'ft2' | 'yd2';

type GreenhouseType = 'gable' | 'quonset' | 'arched' | 'lean-to';

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

export default function HoopHouseCalculator() {
    const [greenhouseType, setGreenhouseType] = useState<GreenhouseType>('gable');
    const [totalHeight, setTotalHeight] = useState<string>('');
    const [sidewallHeight, setSidewallHeight] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('Polyethylene (6 mm)');
    const [insideTemperature, setInsideTemperature] = useState<string>('');
    const [outsideTemperature, setOutsideTemperature] = useState<string>('');
    const [heaterEfficiency, setHeaterEfficiency] = useState<string>('0.8');
    const [pricePerUnit, setPricePerUnit] = useState<string>('');

    const [surfaceArea, setSurfaceArea] = useState<string>('');
    const [heatLoss, setHeatLoss] = useState<string>('');
    const [heaterCapacity, setHeaterCapacity] = useState<string>('');
    const [materialCost, setMaterialCost] = useState<string>('');

    // Calculate all values when inputs change
    useEffect(() => {
        if (!totalHeight || !sidewallHeight || !width || !length || !insideTemperature || !outsideTemperature) {
            setSurfaceArea('');
            setHeatLoss('');
            setHeaterCapacity('');
            setMaterialCost('');
            return;
        }

        // Calculate surface area
        const area = calculateSurfaceArea(
            greenhouseType,
            Number(totalHeight),
            Number(sidewallHeight),
            Number(width),
            Number(length)
        );
        setSurfaceArea(formatNumber(area));

        // Get heat loss coefficient
        const material = materials.find(m => m.name === selectedMaterial);
        let heatLossCoeff = material?.heatLossCoeff || 0;

        if (heatLossCoeff > 0) {
            // Calculate heat loss in watts
            const heatLossWatts = calculateHeatLoss(area, heatLossCoeff, Number(insideTemperature), Number(outsideTemperature));

            // Convert to kilowatts for display
            const heatLossKW = heatLossWatts / 1000;
            setHeatLoss(formatNumber(heatLossKW));

            // Calculate heater capacity
            const efficiency = Number(heaterEfficiency) || 0.8;
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
        selectedMaterial, insideTemperature, outsideTemperature, heaterEfficiency, pricePerUnit
    ]);

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
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Greenhouse Type</h2>
                    <select
                        value={greenhouseType}
                        onChange={(e) => setGreenhouseType(e.target.value as GreenhouseType)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                        <option value="gable">Gable Type</option>
                        <option value="quonset">Quonset</option>
                        <option value="arched">Arched Roof</option>
                        <option value="lean-to">Lean-to</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Dimensions</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Height</label>
                            <input
                                type="text"
                                value={totalHeight}
                                onChange={(e) => setTotalHeight(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter total height"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Sidewall Height</label>
                            <input
                                type="text"
                                value={sidewallHeight}
                                onChange={(e) => setSidewallHeight(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter sidewall height"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Width</label>
                            <input
                                type="text"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter width"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Length</label>
                            <input
                                type="text"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter length"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Material & Environment</h2>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Inside Temperature (°C)</label>
                        <input
                            type="text"
                            value={insideTemperature}
                            onChange={(e) => setInsideTemperature(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter inside temperature"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Outside Temperature (°C)</label>
                        <input
                            type="text"
                            value={outsideTemperature}
                            onChange={(e) => setOutsideTemperature(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter outside temperature"
                        />
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
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Material Cost (Optional)</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Price per Square Meter ($/m²)</label>
                        <input
                            type="text"
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter price per square meter"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Results</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Surface Area</label>
                            <input
                                type="text"
                                value={surfaceArea}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                placeholder="Calculated automatically"
                            />
                            <span className="text-sm text-gray-500">m²</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Heat Loss</label>
                            <input
                                type="text"
                                value={heatLoss}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                placeholder="Calculated automatically"
                            />
                            <span className="text-sm text-gray-500">kW</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Heater Capacity Needed</label>
                            <input
                                type="text"
                                value={heaterCapacity}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                placeholder="Calculated automatically"
                            />
                            <span className="text-sm text-gray-500">kW</span>
                        </div>

                        {materialCost && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Material Cost</label>
                                <input
                                    type="text"
                                    value={materialCost}
                                    readOnly
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-50"
                                    placeholder="Calculated automatically"
                                />
                                <span className="text-sm text-gray-500">$</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setTotalHeight('');
                                setSidewallHeight('');
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
                            }}
                            className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => {
                                const result = `Hoop House Calculator Results:\n\nGreenhouse Type: ${greenhouseType}\nDimensions:\nTotal Height: ${totalHeight} m\nSidewall Height: ${sidewallHeight} m\nWidth: ${width} m\nLength: ${length} m\n\nSurface Area: ${surfaceArea} m²\nMaterial: ${selectedMaterial}\nInside Temperature: ${insideTemperature} °C\nOutside Temperature: ${outsideTemperature} °C\n\nHeat Loss: ${heatLoss} kW\nHeater Capacity Needed: ${heaterCapacity} kW${materialCost ? `\nMaterial Cost: $${materialCost}` : ''}`;

                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Hoop House Calculator Result',
                                        text: result
                                    });
                                } else {
                                    navigator.clipboard.writeText(result);
                                    alert('Result copied to clipboard!');
                                }
                            }}
                            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Share Result
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
