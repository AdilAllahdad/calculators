"use client"
import React, { useState, useEffect } from 'react';

const App = () => {
  const [setupType, setSetupType] = useState('wall');
  const [reach, setReach] = useState('');
  const [bottom, setBottom] = useState('');
  const [length, setLength] = useState('');
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState('deg');
  const [flySection, setFlySection] = useState('1');
  const [minTotalLength, setMinTotalLength] = useState('');

  // States for units
  const [reachUnit, setReachUnit] = useState('m');
  const [bottomUnit, setBottomUnit] = useState('m');
  const [lengthUnit, setLengthUnit] = useState('m');
  const [flySectionUnit, setFlySectionUnit] = useState('m');
  const [minTotalLengthUnit, setMinTotalLengthUnit] = useState('m');

  // State for validation
  const [reachError, setReachError] = useState('');
  const [bottomError, setBottomError] = useState('');
  const [flySectionError, setFlySectionError] = useState('');

  // SVG for the three-dot icon
  const threeDotsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );

  // SVG for the info icon
  const infoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );

  // Unit conversion factors relative to meters
  const conversionFactors = {
    'm': 1,
    'cm': 0.01,
    'in': 0.0254,
    'ft': 0.3048,
  };

  /**
   * Converts a value from one unit to another.
   * @param {number} value The numerical value to convert.
   * @param {string} fromUnit The original unit of the value.
   * @param {string} toUnit The target unit for the conversion.
   * @returns {number} The converted value.
   */
  const convertUnits = (
    value: string | number,
    fromUnit: keyof typeof conversionFactors,
    toUnit: keyof typeof conversionFactors
  ): number => {
    if (fromUnit === toUnit || !value) {
      return parseFloat(value as string);
    }
    const valueInMeters = parseFloat(value as string) * conversionFactors[fromUnit];
    return valueInMeters / conversionFactors[toUnit];
  };

  // Function to handle reloading the calculator
  const handleReload = () => {
    setSetupType('wall');
    setReach('');
    setBottom('');
    setLength('');
    setAngle('');
    setAngleUnit('deg');
    setFlySection('1');
    setMinTotalLength('');
    setReachUnit('m');
    setBottomUnit('m');
    setLengthUnit('m');
    setFlySectionUnit('m');
    setMinTotalLengthUnit('m');
    setReachError('');
    setBottomError('');
    setFlySectionError('');
  };

  // Effect hook to validate inputs and calculate values
  useEffect(() => {
  const r_m = convertUnits(reach, reachUnit as keyof typeof conversionFactors, 'm');
  const b_m = convertUnits(bottom, bottomUnit as keyof typeof conversionFactors, 'm');

    let isValid = true;
    if (r_m < 0) {
      setReachError('Value cannot be negative.');
      isValid = false;
    } else {
      setReachError('');
    }

    if (b_m < 0) {
      setBottomError('Value cannot be negative.');
      isValid = false;
    } else {
      setBottomError('');
    }

    if (r_m && b_m && r_m <= b_m) {
      setReachError('The ladder reach must be greater than the ladder bottom.');
      setBottomError('The ladder bottom must be smaller than the ladder reach.');
      isValid = false;
    } else if (r_m && b_m) {
      setReachError('');
      setBottomError('');
    }

    if (isValid && r_m > 0 && b_m > 0) {
      // Calculate ladder length (L) using Pythagorean theorem: L = sqrt(R^2 + B^2)
      const calculatedLengthInMeters = Math.sqrt(Math.pow(r_m, 2) + Math.pow(b_m, 2));
  const finalLength = convertUnits(calculatedLengthInMeters, 'm', lengthUnit as keyof typeof conversionFactors).toFixed(2);
      setLength(finalLength);

      // Calculate ladder angle (α)
      const angleInRadians = Math.atan(r_m / b_m);
      if (angleUnit === 'deg') {
        const angleInDegrees = (angleInRadians * 180) / Math.PI;
        setAngle(angleInDegrees.toFixed(2));
      } else {
        setAngle(angleInRadians.toFixed(2));
      }
    } else {
      setLength('');
      setAngle('');
    }
  }, [reach, bottom, reachUnit, bottomUnit, lengthUnit, angleUnit]);

  // Effect hook to calculate min total length
  useEffect(() => {
  const f_m = convertUnits(flySection, flySectionUnit as keyof typeof conversionFactors, 'm');
    if (f_m < 0) {
      setFlySectionError('Value cannot be negative.');
      setMinTotalLength('');
      return;
    } else {
      setFlySectionError('');
    }
    
    if (setupType === 'roof' && length && flySection) {
  const lengthInMeters = convertUnits(length, lengthUnit as keyof typeof conversionFactors, 'm');
  const flySectionInMeters = convertUnits(flySection, flySectionUnit as keyof typeof conversionFactors, 'm');
  const totalLengthInMeters = lengthInMeters + flySectionInMeters;
  const finalMinTotalLength = convertUnits(totalLengthInMeters, 'm', minTotalLengthUnit as keyof typeof conversionFactors).toFixed(2);
      setMinTotalLength(finalMinTotalLength);
    } else {
      setMinTotalLength('');
    }
  }, [setupType, length, flySection, lengthUnit, flySectionUnit, minTotalLengthUnit]);

  // Handle unit change for Reach (R)
  const handleReachUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as keyof typeof conversionFactors;
    if (reach) {
      const convertedValue = convertUnits(reach, reachUnit as keyof typeof conversionFactors, newUnit);
      setReach(convertedValue.toFixed(2));
    }
    setReachUnit(newUnit);
  };

  // Handle unit change for Bottom (B)
  const handleBottomUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as keyof typeof conversionFactors;
    if (bottom) {
      const convertedValue = convertUnits(bottom, bottomUnit as keyof typeof conversionFactors, newUnit);
      setBottom(convertedValue.toFixed(2));
    }
    setBottomUnit(newUnit);
  };

  // Handle unit change for Length (L)
  const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as keyof typeof conversionFactors;
    if (length) {
      const convertedValue = convertUnits(length, lengthUnit as keyof typeof conversionFactors, newUnit);
      setLength(convertedValue.toFixed(2));
    }
    setLengthUnit(newUnit);
  };

  // Handle unit change for Fly Section (F)
  const handleFlySectionUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as keyof typeof conversionFactors;
    if (flySection) {
      const convertedValue = convertUnits(flySection, flySectionUnit as keyof typeof conversionFactors, newUnit);
      setFlySection(convertedValue.toFixed(2));
    }
    setFlySectionUnit(newUnit);
  };

  // Handle unit change for Min Total Length (TL)
  const handleMinTotalLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as keyof typeof conversionFactors;
    if (minTotalLength) {
      const convertedValue = convertUnits(minTotalLength, minTotalLengthUnit as keyof typeof conversionFactors, newUnit);
      setMinTotalLength(convertedValue.toFixed(2));
    }
    setMinTotalLengthUnit(newUnit);
  };

  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Ladder reach (R) input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="ladder-reach" className="text-xl font-semibold text-gray-800">Ladder reach (R)</label>
            {threeDotsIcon}
          </div>
          <div className={`flex rounded-lg shadow-sm border ${reachError ? 'border-red-500' : 'border-gray-300'} overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow`}>
            <input
              type="number"
              id="ladder-reach"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              className="flex-grow p-3 text-gray-800 focus:outline-none"
              placeholder="Enter value"
            />
            <select
              value={reachUnit}
              onChange={handleReachUnitChange}
              className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
            >
              <option>cm</option>
              <option>m</option>
              <option>in</option>
              <option>ft</option>
            </select>
          </div>
          {reachError && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              {reachError}
            </div>
          )}
        </div>

        {/* Ladder bottom (B) input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="ladder-bottom" className="text-xl font-semibold text-gray-800">Ladder bottom (B)</label>
            <div className="flex items-center space-x-2">
              {infoIcon}
              {threeDotsIcon}
            </div>
          </div>
          <div className={`flex rounded-lg shadow-sm border ${bottomError ? 'border-red-500' : 'border-gray-300'} overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow`}>
            <input
              type="number"
              id="ladder-bottom"
              value={bottom}
              onChange={(e) => setBottom(e.target.value)}
              className="flex-grow p-3 text-gray-800 focus:outline-none"
              placeholder="Enter value"
            />
            <select
              value={bottomUnit}
              onChange={handleBottomUnitChange}
              className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
            >
              <option>cm</option>
              <option>m</option>
              <option>in</option>
              <option>ft</option>
            </select>
          </div>
          {bottomError && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              {bottomError}
            </div>
          )}
        </div>

        {/* Ladder working length (L) input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="ladder-length" className="text-xl font-semibold text-gray-800">Ladder working length (L)</label>
            {threeDotsIcon}
          </div>
          <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <input
              type="text"
              id="ladder-length"
              value={length}
              readOnly
              className="flex-grow p-3 text-gray-800 focus:outline-none bg-gray-100 cursor-not-allowed"
              placeholder="Calculated"
            />
            <select
              value={lengthUnit}
              onChange={handleLengthUnitChange}
              className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
            >
              <option>cm</option>
              <option>m</option>
              <option>in</option>
              <option>ft</option>
            </select>
          </div>
        </div>

        {/* Ladder angle (α) input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="ladder-angle" className="text-xl font-semibold text-gray-800">Ladder angle (<span className="font-serif italic">α</span>)</label>
            {threeDotsIcon}
          </div>
          <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <input
              type="text"
              id="ladder-angle"
              value={angle}
              readOnly
              className="flex-grow p-3 text-gray-800 focus:outline-none bg-gray-100 cursor-not-allowed"
              placeholder="Calculated"
            />
            <select
              className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value)}
            >
              <option value="deg">deg</option>
              <option value="rad">rad</option>
            </select>
          </div>
        </div>

        {/* Fly - upper section (F) input - only for roof setup */}
        {setupType === 'roof' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="fly-section" className="text-xl font-semibold text-gray-800">Fly - upper section (F)</label>
              {threeDotsIcon}
            </div>
            <div className={`flex rounded-lg shadow-sm border ${flySectionError ? 'border-red-500' : 'border-gray-300'} overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow`}>
              <input
                type="number"
                id="fly-section"
                value={flySection}
                onChange={(e) => setFlySection(e.target.value)}
                className="flex-grow p-3 text-gray-800 focus:outline-none"
                placeholder="Enter value"
              />
              <select
                value={flySectionUnit}
                onChange={handleFlySectionUnitChange}
                className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
              >
                  <option>cm</option>
                  <option>m</option>
                  <option>in</option>
                  <option>ft</option>
              </select>
            </div>
            {flySectionError && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                {flySectionError}
              </div>
            )}
          </div>
        )}

        {/* Min. total ladder length (TL) input - only for roof setup */}
        {setupType === 'roof' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="min-total-length" className="text-xl font-semibold text-gray-800">Min. total ladder length (TL)</label>
              <div className="flex items-center space-x-2">
                {infoIcon}
                {threeDotsIcon}
              </div>
            </div>
            <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden">
              <input
                type="text"
                id="min-total-length"
                value={minTotalLength}
                readOnly // This field is read-only as it's a result
                className="flex-grow p-3 text-gray-800 bg-gray-100 cursor-not-allowed focus:outline-none"
                placeholder="Calculated"
              />
              <select
                value={minTotalLengthUnit}
                onChange={handleMinTotalLengthUnitChange}
                className="bg-gray-50 text-gray-600 p-3 border-l border-gray-300 rounded-r-lg focus:outline-none"
              >
                <option>cm</option>
                <option>m</option>
                <option>in</option>
                <option>ft</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">

        {/* Header section with title and icon */}
        <div className="p-6">
          {/* Ladder Setup Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ladder setup</h2>
            {threeDotsIcon}
          </div>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="ladder-setup"
                value="wall"
                checked={setupType === 'wall'}
                onChange={(e) => setSetupType(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600 accent-blue-600 rounded-full"
              />
              <span>leaning against a wall/structure</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="ladder-setup"
                value="roof"
                checked={setupType === 'roof'}
                onChange={(e) => setSetupType(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600 accent-blue-600 rounded-full"
              />
              <span>leaning against a roof/edge</span>
            </label>
          </div>

          {/* Diagram section */}
          <div className="my-6 text-center">
            {setupType === 'wall' ? (
              <img
                src="https://placehold.co/300x200/e0e0e0/555?text=Ladder+Diagram+(Wall)"
                alt="Ladder diagram for wall setup"
                className="mx-auto rounded-lg shadow-md"
              />
            ) : (
              <img
                src="https://placehold.co/300x200/e0e0e0/555?text=Ladder+Diagram+(Roof)"
                alt="Ladder diagram for roof setup"
                className="mx-auto rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Copyright section */}


          <hr className="my-6 border-gray-200" />

          {/* Render inputs based on setupType */}
          {renderInputs()}

          {/* Reload button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleReload}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Reload Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
