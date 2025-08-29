"use client"
import React, { useState, useEffect } from 'react';

// Type for boilerData to allow string indexing
type BoilerDataType = Record<string, any>;
import { Info, ClipboardCopy, RotateCcw } from 'lucide-react';

// Main App component to contain the entire application.
export default function App() {
  const [boilerType, setBoilerType] = useState('Combi');
  const [ageOfProperty, setAgeOfProperty] = useState('pre 1900 (poorly insulated)');
  const [combiOption, setCombiOption] = useState('1 bedrooms + 1 bathrooms');
  const [numBedrooms, setNumBedrooms] = useState('1');
  const [boilerSizeOutput, setBoilerSizeOutput] = useState({
    heatingOutput: 0,
    hotWaterLpm: { min: 0, max: 0 },
    totalBoilerSize: { min: 0, max: 0 },
    minimumSize: 0,
  });
  const [message, setMessage] = useState('');

  // Options for the combi boiler dropdown
  const combiOptions = [
    '1 bedrooms + 1 bathrooms',
    '2 bedrooms + 1 bathrooms',
    '2 bedrooms + 2 bathrooms',
    '3 bedrooms + 1 bathrooms',
    '3 bedrooms + 2 bathrooms',
    '4 bedrooms + 1 bathrooms',
    '4 bedrooms + 2 bathrooms',
    '5 bedrooms + 2 bathrooms',
    '5+ bedrooms + 2+ bathrooms',
  ];

  // Data map to hold the pre-calculated values based on user's examples
  const boilerData: BoilerDataType = {
    'Combi': {
      '1 bedrooms + 1 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 7, lpm: {min: 9, max: 12}, size: {min: 20, max: 22} },
        '1920-1930s (some insulated)': { heating: 7, lpm: {min: 9, max: 12}, size: {min: 20, max: 22} },
        '1950-1980s (moderately insulated)': { heating: 6, lpm: {min: 9, max: 12}, size: {min: 18, max: 19} },
        '1990s (reasonably insulated)': { heating: 6, lpm: {min: 9, max: 12}, size: {min: 18, max: 19} },
        '2000 onwards (well insulated)': { heating: 4, lpm: {min: 9, max: 12}, size: {min: 18, max: 19} },
      },
      '2 bedrooms + 1 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 8, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 8, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 7, lpm: {min: 9, max: 12}, size: {min: 20, max: 22} },
        '1990s (reasonably insulated)': { heating: 7, lpm: {min: 9, max: 12}, size: {min: 20, max: 22} },
        '2000 onwards (well insulated)': { heating: 6, lpm: {min: 9, max: 12}, size: {min: 18, max: 19} },
      },
      '2 bedrooms + 2 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 8, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 8, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 7, lpm: {min: 12, max: 16}, size: {min: 20, max: 22} },
        '1990s (reasonably insulated)': { heating: 7, lpm: {min: 12, max: 16}, size: {min: 20, max: 22} },
        '2000 onwards (well insulated)': { heating: 7, lpm: {min: 12, max: 16}, size: {min: 20, max: 22} },
      },
      '3 bedrooms + 1 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 9, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 9, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 8, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1990s (reasonably insulated)': { heating: 8, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '2000 onwards (well insulated)': { heating: 7, lpm: {min: 9, max: 12}, size: {min: 20, max: 22} },
      },
      '3 bedrooms + 2 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 9, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 9, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 9, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1990s (reasonably insulated)': { heating: 8, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '2000 onwards (well insulated)': { heating: 4, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
      },
      '4 bedrooms + 1 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 10, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 10, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 9, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '1990s (reasonably insulated)': { heating: 9, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
        '2000 onwards (well insulated)': { heating: 8, lpm: {min: 9, max: 12}, size: {min: 24, max: 26} },
      },
      '4 bedrooms + 2 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 10, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1920-1930s (some insulated)': { heating: 10, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1950-1980s (moderately insulated)': { heating: 10, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '1990s (reasonably insulated)': { heating: 9, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
        '2000 onwards (well insulated)': { heating: 9, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
      },
      '5 bedrooms + 2 bathrooms': {
        'pre 1900 (poorly insulated)': { heating: 14, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '1920-1930s (some insulated)': { heating: 14, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '1950-1980s (moderately insulated)': { heating: 12, lpm: {min: 12, max: 16}, size: {min: 30, max: 34} },
        '1990s (reasonably insulated)': { heating: 12, lpm: {min: 12, max: 16}, size: {min: 30, max: 34} },
        '2000 onwards (well insulated)': { heating: 10, lpm: {min: 12, max: 16}, size: {min: 24, max: 26} },
      },
      '5+ bedrooms + 2+ bathrooms': {
        'pre 100 (poorly insulated)': { heating: 16, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '1920-1930s (some insulated)': { heating: 16, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '1950-1980s (moderately insulated)': { heating: 14, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '1990s (reasonably insulated)': { heating: 14, lpm: {min: 12, max: 16}, size: {min: 35, max: 40} },
        '2000 onwards (well insulated)': { heating: 12, lpm: {min: 12, max: 16}, size: {min: 30, max: 34} },
      },
    },
    'Heat Only': {
      'pre 1900 (poorly insulated)': {
        '1': { size: 7 },
        '2': { size: 8 },
        '3': { size: 9 },
        '4': { size: 10 },
        '5': { size: 14 },
        '5+': { size: 16 },
      },
      '1920-1930s (some insulated)': {
        '1': { size: 7 },
        '2': { size: 8 },
        '3': { size: 9 },
        '4': { size: 10 },
        '5': { size: 12 },
        '5+': { size: 15 },
      },
      '1950-1980s (moderately insulated)': {
        '1': { size: 6 },
        '2': { size: 7 },
        '3': { size: 8 },
        '4': { size: 9 },
        '5': { size: 10 },
        '5+': { size: 14 },
      },
      '1990s (reasonably insulated)': {
        '1': { size: 6 },
        '2': { size: 6 },
        '3': { size: 7 },
        '4': { size: 8 },
        '5': { size: 10 },
        '5+': { size: 12 },
      },
      '2000 onwards (well insulated)': {
        '1': { size: 4 },
        '2': { size: 5 },
        '3': { size: 6 },
        '4': { size: 7 },
        '5': { size: 9 },
        '5+': { size: 10 },
      },
    },
    'System': {
      'pre 1900 (poorly insulated)': {
        '1': { size: 7 },
        '2': { size: 8 },
        '3': { size: 9 },
        '4': { size: 10 },
        '5': { size: 14 },
        '5+': { size: 16 },
      },
      '1920-1930s (some insulated)': {
        '1': { size: 7 },
        '2': { size: 8 },
        '3': { size: 9 },
        '4': { size: 10 },
        '5': { size: 12 },
        '5+': { size: 15 },
      },
      '1950-1980s (moderately insulated)': {
        '1': { size: 6 },
        '2': { size: 7 },
        '3': { size: 8 },
        '4': { size: 8 },
        '5': { size: 10 },
        '5+': { size: 14 },
      },
      '1990s (reasonably insulated)': {
        '1': { size: 6 },
        '2': { size: 6 },
        '3': { size: 7 },
        '4': { size: 8 },
        '5': { size: 10 },
        '5+': { size: 12 },
      },
      '2000 onwards (well insulated)': {
        '1': { size: 4 },
        '2': { size: 5 },
        '3': { size: 6 },
        '4': { size: 7 },
        '5': { size: 9 },
        '5+': { size: 10 },
      },
    },
  };

  // Main calculation logic
  const calculateBoilerSizes = () => {
    if (boilerType === 'Combi') {
      const selectedData =
        boilerData[boilerType] &&
        boilerData[boilerType][combiOption] &&
        boilerData[boilerType][combiOption][ageOfProperty];
      if (selectedData) {
        setBoilerSizeOutput({
          heatingOutput: selectedData.heating,
          hotWaterLpm: selectedData.lpm,
          totalBoilerSize: selectedData.size,
          minimumSize: 0,
        });
      }
    } else {
      const selectedData =
        boilerData[boilerType] &&
        boilerData[boilerType][ageOfProperty] &&
        boilerData[boilerType][ageOfProperty][numBedrooms];
      if (selectedData) {
        setBoilerSizeOutput({
          ...boilerSizeOutput,
          minimumSize: selectedData.size,
        });
      }
    }
  };

  // Resets the calculator to its initial state
  const resetCalculator = () => {
    setBoilerType('Combi');
    setAgeOfProperty('pre 1900 (poorly insulated)');
    setCombiOption('1 bedrooms + 1 bathrooms');
    setNumBedrooms('1');
    setMessage('');
  };

  // Shares the result by copying to clipboard
  const shareResult = async () => {
    let resultText = '';
    if (boilerType === 'Combi') {
      const { heatingOutput, hotWaterLpm, totalBoilerSize } = boilerSizeOutput;
      resultText = `Boiler Size Calculator Result:\nBoiler Type: ${boilerType}\nAge of Property: ${ageOfProperty}\nHeating Output: ${heatingOutput} kW\nHot Water Flow: ${hotWaterLpm.min}-${hotWaterLpm.max} LPM\nRecommended Boiler Size: ${totalBoilerSize.min}-${totalBoilerSize.max} kW`;
    } else {
      const { minimumSize } = boilerSizeOutput;
      resultText = `Boiler Size Calculator Result:\nBoiler Type: ${boilerType}\nAge of Property: ${ageOfProperty}\nNumber of Bedrooms: ${numBedrooms}\nMinimum Boiler Size: ${minimumSize} kW`;
    }

    try {
      await navigator.clipboard.writeText(resultText);
      setMessage('Result copied to clipboard!');
    } catch (err) {
      setMessage('Failed to copy result.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // Re-calculate on every change
  useEffect(() => {
    calculateBoilerSizes();
  }, [boilerType, ageOfProperty, combiOption, numBedrooms]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thermometer-sun">
              <path d="M12 9a4 4 0 1 0 0 8a4 4 0 0 0 0-8"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="M19.07 4.93l-1.42 1.42"/><path d="M5.05 18.95l1.42-1.42"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="M19.07 19.07l-1.42-1.42"/><path d="M5.05 5.05l1.42 1.42"/>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold">Boiler Sizer</h1>
        </div>

        {/* Calculator Inputs */}
        <div className="space-y-6">
          {/* Boiler Type */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Boiler Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Combi', 'Heat Only', 'System'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBoilerType(type)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    boilerType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Age of Property */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
              Age of Property
              <span className="relative group ml-2">
                <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
                <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-2 w-64 shadow-lg">
                  Enter your property's construction time. If your building was renovated recently, choose the option that best represents its insulation level.
                </span>
              </span>
            </label>
            <div className="flex flex-col gap-3">
              {[
                'pre 1900 (poorly insulated)',
                '1920-1930s (some insulated)',
                '1950-1980s (moderately insulated)',
                '1990s (reasonably insulated)',
                '2000 onwards (well insulated)'
              ].map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeOfProperty(age)}
                  className={`py-2 px-4 text-left rounded-lg transition-colors border ${
                    ageOfProperty === age ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Input */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              {boilerType === 'Combi' ? 'Bedrooms & Bathrooms' : 'Number of Bedrooms'}
            </label>
            {boilerType === 'Combi' ? (
              <select
                className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={combiOption}
                onChange={(e) => setCombiOption(e.target.value)}
              >
                {combiOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <select
                className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={numBedrooms}
                onChange={(e) => setNumBedrooms(e.target.value)}
              >
                {[...Array(5).keys()].map(i => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1} bedrooms</option>
                ))}
                <option value="5+">5+ bedrooms</option>
              </select>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recommended Boiler Size</h2>
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl space-y-4">
            {boilerType === 'Combi' ? (
                <>
                <div>
                    <p className="text-sm opacity-80 mb-1">Heating Output</p>
                    <p className="text-3xl font-bold">{boilerSizeOutput.heatingOutput} kW</p>
                </div>
                <div>
                    <p className="text-sm opacity-80 mb-1">Hot Water Flow</p>
                    <p className="text-3xl font-bold">{boilerSizeOutput.hotWaterLpm.min}-{boilerSizeOutput.hotWaterLpm.max} LPM</p>
                </div>
                <div>
                    <p className="text-sm opacity-80 mb-1">Total Recommended Boiler Size</p>
                    <p className="text-3xl font-bold">
                      {boilerSizeOutput.totalBoilerSize.min === boilerSizeOutput.totalBoilerSize.max
                        ? `${boilerSizeOutput.totalBoilerSize.min} kW`
                        : `${boilerSizeOutput.totalBoilerSize.min}-${boilerSizeOutput.totalBoilerSize.max} kW`}
                    </p>
                </div>
                </>
            ) : (
                <div>
                    <p className="text-sm opacity-80 mb-1">Minimum {boilerType} Boiler Size</p>
                    <p className="text-3xl font-bold">{boilerSizeOutput.minimumSize} kW</p>
                </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1  gap-4">
          <button
            onClick={resetCalculator}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 rounded-full font-semibold shadow-sm hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-5 h-5" /> Reset Calculator
          </button>
        </div>

        {/* Message Box */}
        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-center py-3 px-6 rounded-full shadow-lg transition-all duration-300">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
