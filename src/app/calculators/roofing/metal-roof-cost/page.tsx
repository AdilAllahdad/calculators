'use client'
import React, { useState } from 'react';

const lengthUnits = [
  { label: "centimeters(cm)", short: "cm" },
  { label: "meters(m)", short: "m" },
  { label: "inches(in)", short: "in" },
  { label: "feet(ft)", short: "ft" },
  { label: "yards(yd)", short: "yd" }
];

const areaUnits = [
  { label: "square meters(m²)", short: "m²" },
  { label: "square feet(ft²)", short: "ft²" },
  { label: "square yards(yd²)", short: "yd²" }
];

const panelAreaUnits = [
  { label: "square centimeters (cm²)", short: "cm²" },
  { label: "square decimeters (dm²)", short: "dm²" },
  { label: "square meters (m²)", short: "m²" },
  { label: "square inches (in²)", short: "in²" },
  { label: "square feet (ft²)", short: "ft²" },
  { label: "square yards (yd²)", short: "yd²" }
];

const timeOptions = [
  { value: "1:12", label: "1:12" },
  { value: "2:12", label: "2:12" },
  { value: "3:12", label: "3:12" },
  { value: "4:12", label: "4:12" },
  { value: "5:12", label: "5:12" },
  { value: "6:12", label: "6:12" },
  { value: "7:12", label: "7:12" },
  { value: "8:12", label: "8:12" },
  { value: "9:12", label: "9:12" },
  { value: "10:12", label: "10:12" },
  { value: "11:12", label: "11:12" },
  { value: "12:12", label: "12:12" },
  { value: "13:12", label: "13:12" },
  { value: "14:12", label: "14:12" },
  { value: "15:12", label: "15:12" },
  { value: "16:12", label: "16:12" },
  { value: "17:12", label: "17:12" },
  { value: "18:12", label: "18:12" },
  { value: "19:12", label: "19:12" },
  { value: "20:12", label: "20:12" },
  { value: "21:12", label: "21:12" },
  { value: "22:12", label: "22:12" },
  { value: "23:12", label: "23:12" },
  { value: "24:12", label: "24:12" },
  { value: "25:12", label: "25:12" },
  { value: "26:12", label: "26:12" },
  { value: "27:12", label: "27:12" },
  { value: "28:12", label: "28:12" },
  { value: "29:12", label: "29:12" },
  { value: "30:12", label: "30:12" }
];

// Add pitch multipliers for common pitches
const pitchMultipliers: Record<string, number> = {
  "1:12": 1.003, "2:12": 1.014, "3:12": 1.031, "4:12": 1.054, "5:12": 1.083,
  "6:12": 1.118, "7:12": 1.158, "8:12": 1.202, "9:12": 1.25, "10:12": 1.302,
  "12:12": 1.414, "13:12": 1.455, "14:12": 1.497, "15:12": 1.54, "16:12": 1.585,
  "17:12": 1.63, "18:12": 1.676, "19:12": 1.722, "20:12": 1.769, "21:12": 1.816,
  "22:12": 1.863, "23:12": 1.91, "24:12": 1.958, "25:12": 2.006, "26:12": 2.054,
  "27:12": 2.102, "28:12": 2.15, "29:12": 2.198, "30:12": 2.246
};

const initialState = {
  // Store all values in meters for calculation
  roofLengthM: '',
  roofWidthM: '',
  panelLengthM: '',
  panelWidthM: '',
  panelCost: '',
  canMeasure: 'yes',
  roofPitch: '9:12'
};

const initialDisplayUnits = {
  roofLengthUnit: 'cm',
  roofWidthUnit: 'm',
  roofAreaUnit: 'm²',
  panelLengthUnit: 'cm',
  panelWidthUnit: 'cm',
  panelAreaUnit: 'cm²'
};

// Conversion helpers (reuse your existing convertLength/convertArea)
const convertLength = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  let meters = v;
  switch (from) {
    case 'cm': meters = v / 100; break;
    case 'm': meters = v; break;
    case 'in': meters = v * 0.0254; break;
    case 'ft': meters = v * 0.3048; break;
    case 'yd': meters = v * 0.9144; break;
    default: break;
  }
  switch (to) {
    case 'cm': return (meters * 100).toString();
    case 'm': return meters.toString();
    case 'in': return (meters / 0.0254).toString();
    case 'ft': return (meters / 0.3048).toString();
    case 'yd': return (meters / 0.9144).toString();
    default: return value;
  }
};
const convertArea = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  let m2 = v;
  switch (from) {
    case 'm²': m2 = v; break;
    case 'ft²': m2 = v * 0.092903; break;
    case 'yd²': m2 = v * 0.836127; break;
    case 'cm²': m2 = v / 10000; break;
    default: break;
  }
  switch (to) {
    case 'm²': return m2.toString();
    case 'ft²': return (m2 / 0.092903).toString();
    case 'yd²': return (m2 / 0.836127).toString();
    case 'cm²': return (m2 * 10000).toString();
    default: return value;
  }
};

// Convert to meters (for calculation)
const toMeters = (value: string, from: string): number => {
  if (!value) return 0;
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (from) {
    case 'cm': return v / 100;
    case 'm': return v;
    case 'in': return v * 0.0254;
    case 'ft': return v * 0.3048;
    case 'yd': return v * 0.9144;
    default: return v;
  }
};
// Convert from meters to any unit (for display)
const fromMeters = (meters: number, to: string): string => {
  switch (to) {
    case 'cm': return (meters * 100).toString();
    case 'm': return meters.toString();
    case 'in': return (meters / 0.0254).toString();
    case 'ft': return (meters / 0.3048).toString();
    case 'yd': return (meters / 0.9144).toString();
    default: return meters.toString();
  }
};
// Convert from m² to any area unit (for display)
const fromM2 = (m2: number, to: string): string => {
  switch (to) {
    case 'm²': return m2.toString();
    case 'ft²': return (m2 / 0.092903).toString();
    case 'yd²': return (m2 / 0.836127).toString();
    case 'cm²': return (m2 * 10000).toString();
    case 'dm²': return (m2 * 100).toString();
    case 'in²': return (m2 * 1550.0031).toString();
    default: return m2.toString();
  }
};

const Page = () => {
  const [fields, setFields] = useState(initialState);
  const [displayUnits, setDisplayUnits] = useState(initialDisplayUnits);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper: get display value for a field (convert from meters to display unit)
  const getDisplayValue = (meterValue: string, displayUnit: string) => {
    if (!meterValue) return '';
    return fromMeters(parseFloat(meterValue), displayUnit);
  };

  // Validation logic
  const validateField = (name: string, value: string) => {
    if (value === '' || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      switch (name) {
        case 'roofLengthM': return 'Roof length must be greater than 0.';
        case 'roofWidthM': return 'Roof width must be greater than 0.';
        case 'panelLengthM': return 'Panel length must be greater than 0.';
        case 'panelWidthM': return 'Panel width must be greater than 0.';
        case 'panelCost': return 'Panel cost must be greater than 0.';
        default: return 'Value must be greater than 0.';
      }
    }
    return '';
  };

  // Helper: when user types in a field, convert from display unit to meters for storage
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let displayUnit = '';
    if (name === 'roofLengthM') displayUnit = displayUnits.roofLengthUnit;
    else if (name === 'roofWidthM') displayUnit = displayUnits.roofWidthUnit;
    else if (name === 'panelLengthM') displayUnit = displayUnits.panelLengthUnit;
    else if (name === 'panelWidthM') displayUnit = displayUnits.panelWidthUnit;
    else {
      setFields(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
      return;
    }
    const meters = value ? toMeters(value, displayUnit).toString() : '';
    setFields(prev => ({
      ...prev,
      [name]: meters
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  // Handle dropdown unit change for each field (does not affect stored value)
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisplayUnits(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle radio/select/other fields
  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleClear = () => {
    setFields(initialState);
    setDisplayUnits(initialDisplayUnits);
  };

  // Area calculation always uses stored meter values
  const roofLengthM = parseFloat(fields.roofLengthM) || 0;
  const roofWidthM = parseFloat(fields.roofWidthM) || 0;
  const panelLengthM = parseFloat(fields.panelLengthM) || 0;
  const panelWidthM = parseFloat(fields.panelWidthM) || 0;

  // Calculate roof area
  let roofAreaM2 = 0;
  if (fields.canMeasure === 'no') {
    // Use pitch multiplier for "no"
    const pitch = fields.roofPitch || '9:12';
    const multiplier = pitchMultipliers[pitch] || 1.25;
    roofAreaM2 = roofLengthM && roofWidthM ? roofLengthM * roofWidthM * multiplier : 0;
  } else {
    // Simple area for "yes"
    roofAreaM2 = roofLengthM && roofWidthM ? roofLengthM * roofWidthM : 0;
  }

  const panelAreaM2 = panelLengthM && panelWidthM ? panelLengthM * panelWidthM : 0;

  const getRoofAreaDisplay = () =>
    roofAreaM2 ? fromM2(roofAreaM2, displayUnits.roofAreaUnit) : '';
  const getPanelAreaDisplay = () =>
    panelAreaM2 ? fromM2(panelAreaM2, displayUnits.panelAreaUnit) : '';

  const panelsNeeded = (roofAreaM2 && panelAreaM2) ? Math.ceil(roofAreaM2 / panelAreaM2) : '';
  const totalCost = (fields.panelCost && panelsNeeded)
    ? (parseFloat(fields.panelCost) * Number(panelsNeeded)).toFixed(2)
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Metal Roof Cost Calculator</h1>
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          {/* Checkbox section */}
          <div className="mb-5 p-4 rounded-lg border bg-gray-50">
            <label className="block text-sm font-medium mb-2">
              Can you access your roof and measure it precisely? <span className="text-gray-400 ml-1" title="If you can't measure, use estimates.">ⓘ</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="canMeasure"
                  value="yes"
                  checked={fields.canMeasure === 'yes'}
                  onChange={handleOtherChange}
                  className="accent-blue-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="canMeasure"
                  value="no"
                  checked={fields.canMeasure === 'no'}
                  onChange={handleOtherChange}
                  className="accent-blue-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          {/* Roof measurements */}
          <div className="mb-6 border rounded-xl p-4">
            <h2 className="text-base font-semibold mb-2">Roof measurements</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                {fields.canMeasure === 'no' ? "Footprint's length" : "Length"}
                {fields.canMeasure === 'no' && (
                  <span className="ml-1 text-gray-400" title="The horizontal distance of the building.">ⓘ</span>
                )}
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="roofLengthM"
                  value={getDisplayValue(fields.roofLengthM, displayUnits.roofLengthUnit)}
                  onChange={handleFieldChange}
                  className={`flex-1 border ${errors.roofLengthM ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="roofLengthUnit"
                  value={displayUnits.roofLengthUnit}
                  onChange={handleUnitChange}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {lengthUnits.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.roofLengthM && (
                <div className="text-xs text-red-600 mt-1">{errors.roofLengthM}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                {fields.canMeasure === 'no' ? "Footprint's width" : "Width"}
                {fields.canMeasure === 'no' && (
                  <span className="ml-1 text-gray-400" title="The horizontal width of the building.">ⓘ</span>
                )}
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="roofWidthM"
                  value={getDisplayValue(fields.roofWidthM, displayUnits.roofWidthUnit)}
                  onChange={handleFieldChange}
                  className={`flex-1 border ${errors.roofWidthM ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="roofWidthUnit"
                  value={displayUnits.roofWidthUnit}
                  onChange={handleUnitChange}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {lengthUnits.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.roofWidthM && (
                <div className="text-xs text-red-600 mt-1">{errors.roofWidthM}</div>
              )}
            </div>
            {fields.canMeasure === 'no' && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Roof pitch</label>
                <div className="flex">
                  <select
                    name="roofPitch"
                    value={fields.roofPitch || '9:12'}
                    onChange={handleOtherChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <div className="flex">
                <input
                  type="number"
                  name="roofArea"
                  value={getRoofAreaDisplay()}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                  placeholder=""
                />
                <select
                  name="roofAreaUnit"
                  value={displayUnits.roofAreaUnit}
                  onChange={handleUnitChange}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {areaUnits.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Panel measurements */}
          <div className="mb-6 border rounded-xl p-4">
            <h2 className="text-base font-semibold mb-2">Panel measurements</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Length</label>
              <div className="flex">
                <input
                  type="number"
                  name="panelLengthM"
                  value={getDisplayValue(fields.panelLengthM, displayUnits.panelLengthUnit)}
                  onChange={handleFieldChange}
                  className={`flex-1 border ${errors.panelLengthM ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="panelLengthUnit"
                  value={displayUnits.panelLengthUnit}
                  onChange={handleUnitChange}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {lengthUnits.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.panelLengthM && (
                <div className="text-xs text-red-600 mt-1">{errors.panelLengthM}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Width</label>
              <div className="flex">
                <input
                  type="number"
                  name="panelWidthM"
                  value={getDisplayValue(fields.panelWidthM, displayUnits.panelWidthUnit)}
                  onChange={handleFieldChange}
                  className={`flex-1 border ${errors.panelWidthM ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="panelWidthUnit"
                  value={displayUnits.panelWidthUnit}
                  onChange={handleUnitChange}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {lengthUnits.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.panelWidthM && (
                <div className="text-xs text-red-600 mt-1">{errors.panelWidthM}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Area</label>
              <div className="flex">
                <input
                  type="number"
                  name="panelArea"
                  value={getPanelAreaDisplay()}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                  placeholder=""
                />
                <div className="w-36">
                  <select
                    name="panelAreaUnit"
                    value={displayUnits.panelAreaUnit}
                    onChange={handleUnitChange}
                    className="w-full border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    {panelAreaUnits.map(u => (
                      <option key={u.short} value={u.short}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of panels needed</label>
              <input
                type="number"
                name="panelsNeeded"
                value={panelsNeeded}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                placeholder=""
              />
            </div>
          </div>
          {/* Expenses */}
          <div className="mb-6 border rounded-xl p-4">
            <h2 className="text-base font-semibold mb-2">Expenses</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Cost of one panel</label>
              <input
                type="number"
                name="panelCost"
                value={fields.panelCost}
                onChange={handleOtherChange}
                className={`w-full border ${errors.panelCost ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none`}
                placeholder="PKR"
              />
              {errors.panelCost && (
                <div className="text-xs text-red-600 mt-1">{errors.panelCost}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total expense</label>
              <input
                type="number"
                name="totalCost"
                value={totalCost}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                placeholder="PKR"
              />
            </div>
          </div>
          {/* Clear Button */}
          <div className="flex justify-center">
            <button
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
              onClick={handleClear}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
