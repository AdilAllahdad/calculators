'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const lengthUnits = [
  { value: 'mm', label: 'millimeters (mm)' },
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'm', label: 'meters (m)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' }
];

// Add types for unitToMeter and errors
const unitToMeter: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

// Conversion function for display only
function convertDisplayValue(value: string, fromUnit: string, toUnit: string): string {
  const num = parseFloat(value);
  if (isNaN(num) || num === 0) return '';
  // Convert to meters, then to target unit
  const meters = num * unitToMeter[fromUnit];
  const converted = meters / unitToMeter[toUnit];
  return converted ? parseFloat(converted.toFixed(4)).toString() : '';
}

// Add Errors type
interface Errors {
  wallLength?: string;
  spacing?: string;
  pricePerStud?: string;
  waste?: string;
}

const FramingCalculator = () => {
  // States for actual input values (these don't change with unit conversion)
  const [wallLengthInput, setWallLengthInput] = useState('');
  const [wallLengthUnit, setWallLengthUnit] = useState('m');
  const [spacingInput, setSpacingInput] = useState('40');
  const [spacingUnit, setSpacingUnit] = useState('cm');
  const [pricePerStud, setPricePerStud] = useState('');
  const [waste, setWaste] = useState('15');
  
  // States for display values (these change with unit conversion)
  const [wallLengthDisplay, setWallLengthDisplay] = useState('');
  const [spacingDisplay, setSpacingDisplay] = useState('40');
  
  // Original unit states to track what unit the input was originally entered in
  const [originalWallLengthUnit, setOriginalWallLengthUnit] = useState('m');
  const [originalSpacingUnit, setOriginalSpacingUnit] = useState('cm');
  
  const [studsNeeded, setStudsNeeded] = useState('0');
  const [totalCost, setTotalCost] = useState('0');
  const [touched, setTouched] = useState({
    wallLength: false,
    spacing: false,
    pricePerStud: false,
    waste: false,
  });
  const [errors, setErrors] = useState<Errors>({});

  // Update display values when units change
  useEffect(() => {
    if (wallLengthInput && originalWallLengthUnit !== wallLengthUnit) {
      const converted = convertDisplayValue(wallLengthInput, originalWallLengthUnit, wallLengthUnit);
      setWallLengthDisplay(converted);
    } else {
      setWallLengthDisplay(wallLengthInput);
    }
  }, [wallLengthInput, wallLengthUnit, originalWallLengthUnit]);

  useEffect(() => {
    if (spacingInput && originalSpacingUnit !== spacingUnit) {
      const converted = convertDisplayValue(spacingInput, originalSpacingUnit, spacingUnit);
      setSpacingDisplay(converted);
    } else {
      setSpacingDisplay(spacingInput);
    }
  }, [spacingInput, spacingUnit, originalSpacingUnit]);

  // Validation
  const validate = () => {
    const newErrors: Errors = {};
    const length = parseFloat(wallLengthInput);
    const studSpacing = parseFloat(spacingInput);
    const price = parseFloat(pricePerStud);
    const wastePercent = parseFloat(waste);

    if (touched.wallLength && (!length || length <= 0)) {
      newErrors.wallLength = 'Length of the wall must be greater than 0';
    }
    if (touched.spacing && (!studSpacing || studSpacing <= 0)) {
      newErrors.spacing = 'Stud spacing must be greater than 0';
    }
    if (touched.pricePerStud && (!price || price < 0)) {
      newErrors.pricePerStud = 'Price per stud must be greater than or equal to 0';
    }
    if (touched.waste && (!wastePercent || wastePercent < 0)) {
      newErrors.waste = 'Waste percentage must be greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate studs using original input values and original units
  const calculateStuds = () => {
    if (!validate()) return;

    const lengthNum = parseFloat(wallLengthInput);
    const spacingNum = parseFloat(spacingInput);
    const price = parseFloat(pricePerStud) || 0;
    const wastePercent = parseFloat(waste) || 0;

    // Convert original input values to meters for calculation
    const lengthInM = isNaN(lengthNum) ? 0 : lengthNum * unitToMeter[originalWallLengthUnit];
    const spacingInM = isNaN(spacingNum) ? 0 : spacingNum * unitToMeter[originalSpacingUnit];

    // Calculate number of studs using the formula: (length / spacing) + 1
    const baseStuds = spacingInM > 0 ? Math.ceil(lengthInM / spacingInM) : 0;
    const extraStuds = Math.ceil(baseStuds * (wastePercent / 100));
    const totalStuds = baseStuds + extraStuds;

    setStudsNeeded(totalStuds.toString());

    // --- FIX: Total cost calculation ---
    // Total cost = (baseStuds + extraStuds) * pricePerStud
    // If pricePerStud is not provided, total cost is 0
    // If pricePerStud is provided, include wastage in the calculation
    // The cost section should use the same formula as above
    if (price > 0 && totalStuds > 0) {
      setTotalCost((totalStuds * price).toFixed(2));
    } else {
      setTotalCost('0');
    }
  };

  // Handle wall length input change
  const handleWallLengthChange = (value: string) => {
    setWallLengthInput(value);
    setWallLengthDisplay(value);
    setOriginalWallLengthUnit(wallLengthUnit);
  };

  // Handle spacing input change
  const handleSpacingChange = (value: string) => {
    setSpacingInput(value);
    setSpacingDisplay(value);
    setOriginalSpacingUnit(spacingUnit);
  };

  // Handle wall length unit change
  const handleWallLengthUnitChange = (newUnit: string) => {
    setWallLengthUnit(newUnit);
  };

  // Handle spacing unit change
  const handleSpacingUnitChange = (newUnit: string) => {
    setSpacingUnit(newUnit);
  };

  // Clear all fields
  const clearAll = () => {
    setWallLengthInput('');
    setWallLengthDisplay('');
    setWallLengthUnit('m');
    setOriginalWallLengthUnit('m');
    setSpacingInput('');
    setSpacingDisplay('');
    setSpacingUnit('cm');
    setOriginalSpacingUnit('cm');
    setPricePerStud('');
    setWaste('15');
    setStudsNeeded('0');
    setTotalCost('0');
    setTouched({
      wallLength: false,
      spacing: false,
      pricePerStud: false,
      waste: false,
    });
    setErrors({});
  };

  // Recalculate when inputs change (using original input values)
  useEffect(() => {
    if (wallLengthInput && spacingInput) {
      calculateStuds();
    }
  }, [wallLengthInput, spacingInput, pricePerStud, waste, originalWallLengthUnit, originalSpacingUnit]);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Framing Calculator
        </h1>
        {/* Updated image container with matching border style */}
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/framing.svg"
              alt="Framing Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Calculator Container with Border */}
      <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <div className="space-y-6">
          {/* Wall Length Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wall length
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={wallLengthDisplay}
                  onChange={e => {
                    const value = e.target.value;
                    setWallLengthDisplay(value);
                    // Only update input and original unit when user types
                    if (originalWallLengthUnit === wallLengthUnit) {
                      setWallLengthInput(value);
                    } else {
                      // Convert back to original unit for storage
                      const convertedBack = convertDisplayValue(value, wallLengthUnit, originalWallLengthUnit);
                      setWallLengthInput(convertedBack);
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, wallLength: true }))}
                  className={`flex-1 rounded-l-md border ${
                    errors.wallLength ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter wall length"
                />
                <select
                  value={wallLengthUnit}
                  onChange={e => handleWallLengthUnitChange(e.target.value)}
                  className="rounded-r-md border border-l-0 border-gray-300 px-3 py-2 bg-gray-50 focus:outline-none w-[140px]"
                >
                  {lengthUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.wallLength && (
                <p className="mt-1 text-sm text-red-500">{errors.wallLength}</p>
              )}
            </div>

            {/* OC Spacing */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OC spacing <span className="text-gray-400">(on center)</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={spacingDisplay}
                  onChange={e => {
                    const value = e.target.value;
                    setSpacingDisplay(value);
                    // Only update input and original unit when user types
                    if (originalSpacingUnit === spacingUnit) {
                      setSpacingInput(value);
                    } else {
                      // Convert back to original unit for storage
                      const convertedBack = convertDisplayValue(value, spacingUnit, originalSpacingUnit);
                      setSpacingInput(convertedBack);
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, spacing: true }))}
                  className={`flex-1 rounded-l-md border ${
                    errors.spacing ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <select
                  value={spacingUnit}
                  onChange={e => handleSpacingUnitChange(e.target.value)}
                  className="rounded-r-md border border-l-0 border-gray-300 px-3 py-2 bg-gray-50 focus:outline-none w-[140px]"
                >
                  {lengthUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.spacing && (
                <p className="mt-1 text-sm text-red-500">{errors.spacing}</p>
              )}
            </div>
          </div>

          {/* Studs Needed Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Studs needed
            </label>
            <input
              type="text"
              value={studsNeeded}
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
            />
          </div>

          {/* Stud Cost Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stud cost</h2>
            
            {/* Price per stud */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per stud
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  PKR
                </span>
                <input
                  type="number"
                  value={pricePerStud}
                  onChange={(e) => setPricePerStud(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, pricePerStud: true }))}
                  className={`flex-1 rounded-r-md border ${
                    errors.pricePerStud ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="0"
                />
              </div>
              {errors.pricePerStud && (
                <p className="mt-1 text-sm text-red-500">{errors.pricePerStud}</p>
              )}
            </div>

            {/* Estimated waste */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated waste
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={waste}
                  onChange={(e) => setWaste(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, waste: true }))}
                  className={`flex-1 rounded-l-md border ${
                    errors.waste ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  %
                </span>
              </div>
              {errors.waste && (
                <p className="mt-1 text-sm text-red-500">{errors.waste}</p>
              )}
            </div>

            {/* Total cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total cost
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  PKR
                </span>
                <input
                  type="text"
                  value={totalCost}
                  readOnly
                  className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear button - moved outside main container */}
      <div className="flex justify-center mt-6">
        <button
          onClick={clearAll}
          className="px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg border border-blue-300 font-semibold transition-all duration-200 hover:shadow-md active:transform active:scale-95"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FramingCalculator;