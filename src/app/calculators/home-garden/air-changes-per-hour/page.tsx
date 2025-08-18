'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown
const areaUnitValues = ['m2', 'ft2', 'yd2'];
const heightUnitValues = ['m', 'ft', 'cm', 'in', 'ft-in', 'm-cm'];
const airflowUnitValues = ['m3', 'cm3', 'cu ft', 'cu in', 'cu yd', 'l'];
const timeUnitValues = ['min', 'sec', 'hr'];

export default function AirChangesCalculator() {
    const [area,setArea] = useState<string>('');
    const [areaUnit,setAreaUnit] = useState<string>('m2');
    const [height,setHeight] = useState<string>('');
    const [heightUnit,setHeightUnit] = useState<string>('m');
    const [airflow,setAirflow] = useState<string>('');
    const [airflowUnit,setAirflowUnit] = useState<string>('m3');
    const [airflowtimeUnit,setAirflowtimeUnit] = useState<string>('min');
    const [airChanges,setAirChanges] = useState<number>(0);

    // Simple time conversion factors (to minutes)
    const timeConversions = {
        'min': 1,               // minutes to minutes
        'sec': 1/60,            // seconds to minutes
        'hr': 60                // hours to minutes
    };

    const calculateAirChanges = () => {
        const areaNum = parseFloat(area);
        const heightNum = parseFloat(height);
        const airflowNum = parseFloat(airflow);

        if (isNaN(areaNum) || isNaN(heightNum) || isNaN(airflowNum) || areaNum <= 0 || heightNum <= 0 || airflowNum <= 0) {
            setAirChanges(0);
            return;
        }

        // Convert area to square meters using convertValue
        const areaInSqM = convertValue(areaNum, areaUnit, 'm2');

        // Convert height to meters using convertValue
        const heightInM = convertValue(heightNum, heightUnit, 'm');

        // Calculate volume in cubic meters
        const volumeInCubicM = areaInSqM * heightInM;

        // Convert airflow to cubic meters using convertValue
        const airflowInCubicM = convertValue(airflowNum, airflowUnit, 'm3');

        // Convert time to minutes using simple conversion
        const timeInMin = timeConversions[airflowtimeUnit as keyof typeof timeConversions] || 1;

        // Calculate airflow per minute
        const airflowInCubicMPerMin = airflowInCubicM / timeInMin;

        // Calculate air changes per hour
        const airChangesPerHour = (airflowInCubicMPerMin * 60) / volumeInCubicM;

        setAirChanges(airChangesPerHour);
    };

    useEffect(() => {
        calculateAirChanges();
    }, [area, areaUnit, height, heightUnit, airflow, airflowUnit, airflowtimeUnit]);

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
                      onChange={(e) => setAreaUnit(e.target.value)}
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
                      onChange={(e) => setHeightUnit(e.target.value)}
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
                        onChange={(e) => setAirflowUnit(e.target.value)}
                        unitValues={airflowUnitValues}
                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      />
                      <UnitDropdown
                        value={airflowtimeUnit}
                        onChange={(e) => setAirflowtimeUnit(e.target.value)}
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