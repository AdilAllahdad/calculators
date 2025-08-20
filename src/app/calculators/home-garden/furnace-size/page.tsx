'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type AreaUnitType = 'm2' | 'ft2' | 'yd2';
type FurnaceCapacityUnitType = 'kW' | 'BTU/h' | 'tons' | 'W' | '(hp(E))';
type TemperatureUnitType = 'C' | 'F' | 'K';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};

const isFurnaceCapacityUnit = (unit: string): unit is FurnaceCapacityUnitType => {
  return ['kW', 'BTU/h', 'tons', 'W', '(hp(E))'].includes(unit);
};

const isTemperatureUnit = (unit: string): unit is TemperatureUnitType => {
  return ['C', 'F', 'K'].includes(unit);
};

// Define the unit values needed for each dropdown
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2'];
const furnaceCapacityUnitValues: FurnaceCapacityUnitType[] = ['kW', 'BTU/h', 'tons', 'W', '(hp(E))'];
const temperatureUnitValues: TemperatureUnitType[] = ['C', 'F', 'K'];

// Conversion maps (all to base units)
const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'yd2': 0.836127   // square yards to square meters
};

const furnaceCapacityConversions: ConversionMap<FurnaceCapacityUnitType> = {
  'kW': 1,              // kilowatts (base)
  'BTU/h': 0.000293071, // BTU per hour to kilowatts (1 BTU/h = 0.000293071 kW)
  'tons': 3.51685,      // tons to kilowatts (1 ton = 3.51685 kW)
  'W': 0.001,           // watts to kilowatts (1 W = 0.001 kW)
  '(hp(E))': 0.745699872 // horsepower (electric) to kilowatts (1 hp = 0.745699872 kW)
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

export default function FurnaceSizeCalculator() {
    const [indicator, setIndicator] = useState<string>('Climate zone');
    const [climateZone, setClimateZone] = useState<string>('Zone 1');
    const [area, setArea] = useState<string>('');
    const [areaUnit, setAreaUnit] = useState<AreaUnitType>('m2');
    const [insulation, setInsulation] = useState<string>('Lightly insulated (with lots of leakage)');
    const [sunlightExposure, setSunlightExposure] = useState<string>('Sunny room');
    const [furnaceEfficiency, setFurnaceEfficiency] = useState<string>('');
    const [minFurnaceCapacity, setMinFurnaceCapacity] = useState<number>(0);
    const [maxFurnaceCapacity, setMaxFurnaceCapacity] = useState<number>(0);
    const [furnaceCapacityUnit, setFurnaceCapacityUnit] = useState<FurnaceCapacityUnitType>('kW');
    const [averageOutdoorTemperature, setAverageOutdoorTemperature] = useState<string>('');
    const [averageOutdoorTemperatureUnit, setAverageOutdoorTemperatureUnit] = useState<TemperatureUnitType>('C');

    const calculateFurnaceCapacity = () => {
    let minBTUPerFt2 = 0;
    let maxBTUPerFt2 = 0;

  switch (climateZone) {
    case 'Zone 1': // 21°C and up
      minBTUPerFt2 = 30;
      maxBTUPerFt2 = 35;
      break;

    case 'Zone 2': // 16 to 20°C
      minBTUPerFt2 = 35;
      maxBTUPerFt2 = 40;
      break;

    case 'Zone 3': // 11 to 15°C
      minBTUPerFt2 = 40;
      maxBTUPerFt2 = 45;
      break;

    case 'Zone 4': // 6 to 10°C
      minBTUPerFt2 = 45;
      maxBTUPerFt2 = 55;
      break;

    case 'Zone 5': // -4 to 5°C
      minBTUPerFt2 = 55;
      maxBTUPerFt2 = 70;
      break;

    case 'Zone 6': // -9 to -5°C
      minBTUPerFt2 = 70;
      maxBTUPerFt2 = 80;
      break;

    case 'Zone 7': // -19 to -10°C
      minBTUPerFt2 = 80;
      maxBTUPerFt2 = 90;
      break;

    case 'Zone 8': // -24 to -20°C
      minBTUPerFt2 = 90;
      maxBTUPerFt2 = 100;
      break;

    case 'Zone 9': // -25°C and below
      minBTUPerFt2 = 100;
      maxBTUPerFt2 = 110; // using 100+ as an open upper bound
      break;

    default:
      minBTUPerFt2 = 0;
      maxBTUPerFt2 = 0;
  }

  let areaInFt2: number = Number(area);
  if (isAreaUnit(areaUnit)) {
    areaInFt2 = handleUnitConversion(areaUnit, 'ft2', area, areaConversions);
  }

  // Furnace capacity in BTU/h
  const minCapacityBTU = Number(areaInFt2) * minBTUPerFt2;
  const maxCapacityBTU = Number(areaInFt2) * maxBTUPerFt2;

  // Convert to selected unit (kW, BTU/h, tons, W, (hp(E)))
  const minCapacityConverted = handleUnitConversion('BTU/h', furnaceCapacityUnit, minCapacityBTU, furnaceCapacityConversions);
  const maxCapacityConverted = handleUnitConversion('BTU/h', furnaceCapacityUnit, maxCapacityBTU, furnaceCapacityConversions);

  setMinFurnaceCapacity(minCapacityConverted);
  setMaxFurnaceCapacity(maxCapacityConverted);
};

useEffect(() => {
  calculateFurnaceCapacity();
}, [climateZone, area, areaUnit, insulation, sunlightExposure, furnaceEfficiency, furnaceCapacityUnit, averageOutdoorTemperature, averageOutdoorTemperatureUnit]);

const clearAll = () => {
  setClimateZone('Zone 1'); 
  setArea('');
  setAreaUnit('m2');    
  setInsulation('Lightly insulated (with lots of leakage)');
  setSunlightExposure('Sunny room');
  setFurnaceEfficiency('');
  setMinFurnaceCapacity(0);
  setMaxFurnaceCapacity(0);
  setFurnaceCapacityUnit('kW');
  setAverageOutdoorTemperature('');
  setAverageOutdoorTemperatureUnit('C');
  setIndicator('Climate zone'); 
    
};

const reloadCalculator = () => {
  clearAll();
};

const shareResult = () => {
  const result = `Climate Zone: ${climateZone}\nArea: ${area} ${areaUnit}\nInsulation: ${insulation}\nSunlight Exposure: ${sunlightExposure}\nFurnace Efficiency: ${furnaceEfficiency}\nMinimum Furnace Capacity: ${minFurnaceCapacity} ${furnaceCapacityUnit}\nMaximum Furnace Capacity: ${maxFurnaceCapacity} ${furnaceCapacityUnit}\nAverage
  Outdoor Temperature: ${averageOutdoorTemperature} ${averageOutdoorTemperatureUnit}`;
  if (navigator.share) {
    navigator.share({
      title: 'Furnace Size Calculator Result',
      text: result
    });
  } else {
    navigator.clipboard.writeText(result);
    alert('Result copied to clipboard!');
  } 
};

const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  const regex = /^[0-9]*\.?[0-9]*$/;
  if (regex.test(value)) {
    setArea(value);
  }
};

const handleAreaUnitChange = (newUnitValue: string) => {
  if (!isAreaUnit(newUnitValue)) return;
  const newUnit = newUnitValue;

  if (!area || area === '') {
    setAreaUnit(newUnit);
    return;
  }

  const result = handleUnitConversion(areaUnit, newUnit, Number(area), areaConversions);
  setArea(result.toFixed(4));
  setAreaUnit(newUnit);
};

const handleFurnaceCapacityUnitChange = (newUnitValue: string) => {
  if (!isFurnaceCapacityUnit(newUnitValue)) return;
  setFurnaceCapacityUnit(newUnitValue);
};

const handleAverageOutdoorTemperatureUnitChange = (newUnitValue: string) => {
  if (!isTemperatureUnit(newUnitValue)) return;
  setAverageOutdoorTemperatureUnit(newUnitValue);
};

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  if (event.target.value === '' || event.target.value === '0') {
    event.target.select();
  }
};

return (
    <div className="flex justify-center">    
        <div className="max-w-4xl mx-auto my-auto py-8">    
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                    Furnace Size Calculator 
                    <span className="ml-3 text-2xl">🔥</span>
                </h1>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-6 text-slate-800">Indicator</h2>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <input 
                            type="radio" 
                            name="indicator" 
                            value="Climate zone" 
                            checked={indicator === 'Climate zone'} 
                            onChange={() => setIndicator('Climate zone')} />
                            <span className="ml-2 text-black">Climate zone</span>
                    </label>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <input 
                            type="radio" 
                            name="indicator" 
                            value="Average outdoor temperature" 
                            checked={indicator === 'Average outdoor temperature'} 
                            onChange={() => setIndicator('Average outdoor temperature')} />
                            <span className="ml-2 text-black">Average outdoor temperature</span>
                    </label>
                </div>
                {indicator === 'Climate zone' && (
                    <>
                    <div className="mb-6">
                        <img src="/climate_zones.png" alt="Climate Zone" />
                    </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Climate Zone
                            </label>
                            <select
                                value={climateZone}
                                onChange={(e) => setClimateZone(e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                            >
                                <option value="Zone 1">Zone 1</option>
                                <option value="Zone 2">Zone 2</option>
                                <option value="Zone 3">Zone 3</option>
                                <option value="Zone 4">Zone 4</option>
                                <option value="Zone 5">Zone 5</option>
                                <option value="Zone 6">Zone 6</option>
                                <option value="Zone 7">Zone 7</option>
                                <option value="Zone 8">Zone 8</option>
                                <option value="Zone 9">Zone 9</option>
                            </select>
                        </div>
                    <div/>  
                    </>
                )}
                {indicator === 'Average outdoor temperature' && (
                    <>
                        <div className="mb-6">
                            <img src="/climate_zones_temperature.png" alt="" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Average Outdoor Temperature
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={averageOutdoorTemperature}
                                    onChange={(e) => setAverageOutdoorTemperature(e.target.value)}
                                    onFocus={(e) => handleFocus(e)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                />
                                <UnitDropdown
                                    value={averageOutdoorTemperatureUnit}
                                    onChange={(e) => handleAverageOutdoorTemperatureUnitChange(e.target.value)}
                                    unitValues={temperatureUnitValues}
                                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                />
                            </div>
                        </div>
                    </>
                )}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Room Floor Area
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => handleNumberInput(e)}
                            onFocus={(e) => handleFocus(e)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        />
                        <UnitDropdown
                            value={areaUnit}
                            onChange={(e) => handleAreaUnitChange(e.target.value)}
                            unitValues={areaUnitValues}
                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Insulation
                    </label>
                    <select
                        value={insulation}
                        onChange={(e) => setInsulation(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                        <option value="Lightly insulated (with lots of leakage)">Lightly insulated (with lots of leakage)</option>
                        <option value="Average insulation">Average insulation</option>
                        <option value="Heavily Insulated (No Leakage)">Heavily Insulated (No Leakage)</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sunlight Exposure
                    </label>
                    <select
                        value={sunlightExposure}
                        onChange={(e) => setSunlightExposure(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                        <option value="Sunny room">Sunny room</option>
                        <option value="Neither shady nor sunny">Neither shady nor sunny</option>
                        <option value="Shaded room">Shaded room</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Furnace Efficiency
                    </label>
                    <input
                        type="text"
                        value={furnaceEfficiency}
                        onChange={(e) => setFurnaceEfficiency(e.target.value)}
                        onFocus={(e) => handleFocus(e)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    />
                </div>
            </div>
            {indicator === 'Climate zone' && (
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Minimum Furnace Capacity
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={minFurnaceCapacity}
                                onChange={(e) => handleNumberInput(e)}
                                onFocus={(e) => handleFocus(e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                            />
                            <UnitDropdown
                                value={furnaceCapacityUnit}
                                onChange={(e) => handleFurnaceCapacityUnitChange(e.target.value)}
                                unitValues={furnaceCapacityUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Maximum Furnace Capacity
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={maxFurnaceCapacity}
                                onChange={(e) => handleNumberInput(e)}
                                onFocus={(e) => handleFocus(e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                            />
                            <UnitDropdown
                                value={furnaceCapacityUnit}
                                onChange={(e) => handleFurnaceCapacityUnitChange(e.target.value)}
                                unitValues={furnaceCapacityUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
);

}