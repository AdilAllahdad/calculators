'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type AreaUnitType = 'm2' | 'ft2' | 'yd2';
type HeightUnitType = 'm' | 'ft' | 'cm' | 'in' | 'ft/in' | 'm/cm';
type VolumeUnitType = 'm3' | 'cm3' | 'cu ft' | 'cu in' | 'cu yd' | 'l';
type TimeUnitType = 'min' | 'sec' | 'hr';

type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'yd2'].includes(unit);
};

const isHeightUnit = (unit: string): unit is HeightUnitType => {
  return ['m', 'ft', 'cm', 'in', 'ft/in', 'm/cm'].includes(unit);
};

const isVolumeUnit = (unit: string): unit is VolumeUnitType => {
  return ['m3', 'cm3', 'cu ft', 'cu in', 'cu yd', 'l'].includes(unit);
};

const isTimeUnit = (unit: string): unit is TimeUnitType => {
  return ['min', 'sec', 'hr'].includes(unit);
};

// Define the unit values needed for each dropdown
const areaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'yd2'];
const heightUnitValues: HeightUnitType[] = ['m', 'ft', 'cm', 'in', 'ft/in', 'm/cm'];
const airflowUnitValues: VolumeUnitType[] = ['m3', 'cm3', 'cu ft', 'cu in', 'cu yd', 'l'];
const timeUnitValues: TimeUnitType[] = ['min', 'sec', 'hr'];

// Conversion maps (all to base units)
const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,           // square meters (base)
  'ft2': 0.092903,   // square feet to square meters
  'yd2': 0.836127    // square yards to square meters
};

const heightConversions: ConversionMap<HeightUnitType> = {
  'm': 1,            // meters (base)
  'ft': 0.3048,      // feet to meters
  'cm': 0.01,        // centimeters to meters
  'in': 0.0254,      // inches to meters
  'ft/in': 0.3048,   // feet/inches to meters (handled specially)
  'm/cm': 1          // meters/centimeters to meters (handled specially)
};

const volumeConversions: ConversionMap<VolumeUnitType> = {
  'm3': 1,           // cubic meters (base)
  'cm3': 0.000001,   // cubic centimeters to cubic meters
  'cu ft': 0.0283168, // cubic feet to cubic meters
  'cu in': 0.0000163871, // cubic inches to cubic meters
  'cu yd': 0.764555,  // cubic yards to cubic meters
  'l': 0.001         // liters to cubic meters
};

const timeConversions: ConversionMap<TimeUnitType> = {
  'min': 1,          // minutes (base)
  'sec': 1/60,       // seconds to minutes
  'hr': 60           // hours to minutes
};

// Unit conversion helper
const handleUnitConversion = <T extends string>(
  currentUnit: T,
  newUnit: T,
  value: string,
  conversionTable: ConversionMap<T>
): number => {
  if (!value) return 0;
  const numValue = Number(value);
  if (isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Helper function to format numbers with commas
const formatWithCommas = (value: number, decimalPlaces: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
};

// Format number helper (simplified version)
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

export default function AirChangesCalculator() {
    const [area, setArea] = useState<string>('');
    const [areaUnit, setAreaUnit] = useState<AreaUnitType>('m2');
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<HeightUnitType>('m');
    const [airflow, setAirflow] = useState<string>('');
    const [airflowUnit, setAirflowUnit] = useState<VolumeUnitType>('m3');
    const [airflowtimeUnit, setAirflowtimeUnit] = useState<TimeUnitType>('min');
    const [airChanges, setAirChanges] = useState<number>(0);

    const calculateAirChanges = () => {
        const areaNum = parseFloat(area);
        const heightNum = parseFloat(height);
        const airflowNum = parseFloat(airflow);

        if (isNaN(areaNum) || isNaN(heightNum) || isNaN(airflowNum) || areaNum <= 0 || heightNum <= 0 || airflowNum <= 0) {
            setAirChanges(0);
            return;
        }

        // Convert area to square meters using type-safe conversion
        const areaInSqM = areaNum * areaConversions[areaUnit];

        // Convert height to meters using type-safe conversion
        const heightInM = heightNum * heightConversions[heightUnit];

        // Calculate volume in cubic meters
        const volumeInCubicM = areaInSqM * heightInM;

        // Convert airflow to cubic meters using type-safe conversion
        const airflowInCubicM = airflowNum * volumeConversions[airflowUnit];

        // Convert time to minutes using type-safe conversion
        const timeInMin = timeConversions[airflowtimeUnit];

        // Calculate airflow per minute
        const airflowInCubicMPerMin = airflowInCubicM / timeInMin;

        // Calculate air changes per hour
        const airChangesPerHour = (airflowInCubicMPerMin * 60) / volumeInCubicM;

        setAirChanges(airChangesPerHour);
    };

    useEffect(() => {
        calculateAirChanges();
    }, [area, areaUnit, height, heightUnit, airflow, airflowUnit, airflowtimeUnit]);

    // Unit change handlers with type safety
    const handleAreaUnitChange = (newUnitValue: string) => {
        if (!isAreaUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!area || area === '') {
            setAreaUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(areaUnit, newUnit, area, areaConversions);
        setArea(result.toFixed(4));
        setAreaUnit(newUnit);
    };

    const handleHeightUnitChange = (newUnitValue: string) => {
        if (!isHeightUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!height || height === '') {
            setHeightUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(heightUnit, newUnit, height, heightConversions);
        setHeight(result.toFixed(4));
        setHeightUnit(newUnit);
    };

    const handleAirflowUnitChange = (newUnitValue: string) => {
        if (!isVolumeUnit(newUnitValue)) return;
        const newUnit = newUnitValue;

        if (!airflow || airflow === '') {
            setAirflowUnit(newUnit);
            return;
        }

        const result = handleUnitConversion(airflowUnit, newUnit, airflow, volumeConversions);
        setAirflow(result.toFixed(4));
        setAirflowUnit(newUnit);
    };

    const handleTimeUnitChange = (newUnitValue: string) => {
        if (!isTimeUnit(newUnitValue)) return;
        setAirflowtimeUnit(newUnitValue);
    };

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

      const clearAll = () => {
        setArea('');
        setHeight('');
        setAirflow('');
        setAirChanges(0);
      };

      const reloadCalculator = () => {
        setArea('');
        setHeight('');
        setAirflow('');
        setAirChanges(0);
      };

      const shareResult = () => {
        const result = `Area: ${area} ${areaUnit}\nHeight: ${height} ${heightUnit}\nAirflow: ${airflow} ${airflowUnit} / ${airflowtimeUnit}\nAir Changes per Hour: ${formatNumber(airChanges)}`;
        if (navigator.share) {
          navigator.share({
            title: 'Air Changes Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

      return(
        <div className="flex justify-center">
          <div className="max-w-4xl mx-auto py-8">    
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                Air Changes Calculator 
                <span className="ml-3 text-2xl">💨</span>
              </h1>
              <p className="text-lg text-slate-700">
                Calculate air changes per hour for ventilation.
              </p>
            </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={area}
                      onChange={(e) => handleNumberInput(e.target.value.replace(',', '.'), setArea)}
                      onFocus={(e) => handleFocus(area, e)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      placeholder="Enter area"
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
                    Height
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={height}
                      onChange={(e) => handleNumberInput(e.target.value.replace(',', '.'), setHeight)}
                      onFocus={(e) => handleFocus(height, e)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      placeholder="Enter height"
                    />
                    <UnitDropdown
                      value={heightUnit}
                      onChange={(e) => handleHeightUnitChange(e.target.value)}
                      unitValues={heightUnitValues}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Airflow
                  </label>
                  <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        value={airflow}
                        onChange={(e) => handleNumberInput(e.target.value.replace(',', '.'), setAirflow)}
                        onFocus={(e) => handleFocus(airflow, e)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        placeholder="Enter airflow"
                      />
                      <UnitDropdown
                        value={airflowUnit}
                        onChange={(e) => handleAirflowUnitChange(e.target.value)}
                        unitValues={airflowUnitValues}
                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      />
                      <UnitDropdown
                        value={airflowtimeUnit}
                        onChange={(e) => handleTimeUnitChange(e.target.value)}
                        unitValues={timeUnitValues}
                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      />
                  </div>
                </div>
              <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Air Changes per Hour
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formatNumber(airChanges, 4)}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}
                    />
                  </div>
                </div>
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