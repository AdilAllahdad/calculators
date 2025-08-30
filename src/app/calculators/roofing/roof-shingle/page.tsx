'use client'
import React, { useState } from 'react'

const initialState = {
  roofLength: '',
  roofLengthUnit: 'yd',
  roofWidth: '',
  roofWidthUnit: 'm',
  footprintArea: '',
  footprintAreaUnit: 'm²',
  roofPitch: '',
  pitchType: 'x12',
  pitchPercent: '',
  pitchDegrees: '',
  pitchDegreesUnit: 'deg', // <-- Add this line
  multiplier: ' ',
  roofArea: '',
  roofAreaUnit: 'm²',
  roofAreaSquares: '',
  bundleCoverage: '',
  bundleCoverageUnit: 'm²',
  shingleBundles: '',
  bundleSize: '29',
  shingles: ''
};

const units = {
  length: [
  { label: "centimeters(cm)", short: "cm" },
  { label: "decimeters(dm)", short: "dm" },
  { label: "meters(m)", short: "m" },
  { label: "inches(in)", short: "in" },
  { label: "feet(ft)", short: "ft" },
  { label: "yards(yd)", short: "yd" }
  ],
  area: [
{ label: "square meters(m²)", short: "m²" },
  { label: "square feet(ft²)", short: "ft²" },
  { label: "square yards(yd²)", short: "yd²" },
  { label: "ares(a)", short: "a" }
  ],
  bundleCoverage: [
    { label: "square meters(m²)", short: "m²" },
  { label: "square feet(ft²)", short: "ft²" },
  { label: "square yards(yd²)", short: "yd²" },
  { label: "ares(a)", short: "a" }
  ]
};

// Add conversion helpers
const convertLength = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  // Convert to meters first
  let meters = v;
  switch (from) {
    case 'cm': meters = v / 100; break;
    case 'dm': meters = v / 10; break;
    case 'm': meters = v; break;
    case 'in': meters = v * 0.0254; break;
    case 'ft': meters = v * 0.3048; break;
    case 'yd': meters = v * 0.9144; break;
    default: break;
  }
  // Convert from meters to target
  switch (to) {
    case 'cm': return (meters * 100).toString();
    case 'dm': return (meters * 10).toString();
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
  // Convert to m² first
  let m2 = v;
  switch (from) {
    case 'm²': m2 = v; break;
    case 'ft²': m2 = v * 0.092903; break;
    case 'yd²': m2 = v * 0.836127; break;
    case 'a': m2 = v * 100; break;
    default: break;
  }
  // Convert from m² to target
  switch (to) {
    case 'm²': return m2.toString();
    case 'ft²': return (m2 / 0.092903).toString();
    case 'yd²': return (m2 / 0.836127).toString();
    case 'a': return (m2 / 100).toString();
    default: return value;
  }
};

// Add angle conversion helper
const convertAngle = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  if (from === to) return value;
  if (from === 'deg' && to === 'rad') return (v * Math.PI / 180).toString();
  if (from === 'rad' && to === 'deg') return (v * 180 / Math.PI).toString();
  return value;
};

const SQUARE_FEET_PER_SQUARE = 100;
const DEFAULT_BUNDLE_SIZE = 29; // default shingles per bundle

// Helper to get pitch multiplier from x:12, percent, or angle
function getPitchMultiplier({ roofPitch, pitchType, pitchPercent, pitchDegrees, pitchDegreesUnit }: typeof initialState) {
  let slope = 0;
  if (pitchType === 'x12' && roofPitch) {
    // x:12 format (rise/run)
    slope = parseFloat(roofPitch) / 12;
  } else if (pitchType !== 'x12' && pitchPercent) {
    // percent
    slope = parseFloat(pitchPercent) / 100;
  } else if (pitchType !== 'x12' && pitchDegrees) {
    // angle
    let angle = parseFloat(pitchDegrees);
    if (pitchDegreesUnit === 'rad') angle = angle * 180 / Math.PI;
    slope = Math.tan(angle * Math.PI / 180);
  }
  if (isNaN(slope)) return '';
  // Multiplier formula: sqrt(1 + slope^2)
  return (Math.sqrt(1 + slope * slope)).toFixed(4);
}

function toFeet(value: string, from: string): number {
  if (!value) return 0;
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (from) {
    case 'cm': return v / 30.48;
    case 'dm': return v / 3.048;
    case 'm': return v * 3.28084;
    case 'in': return v / 12;
    case 'ft': return v;
    case 'yd': return v * 3;
    default: return v;
  }
}

function areaToFeet(value: string, from: string): number {
  if (!value) return 0;
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (from) {
    case 'm²': return v * 10.7639;
    case 'ft²': return v;
    case 'yd²': return v * 9;
    case 'a': return v * 1076.39;
    default: return v;
  }
}

function areaFromFeet(value: number, to: string): string {
  switch (to) {
    case 'm²': return (value / 10.7639).toFixed(2);
    case 'ft²': return value.toFixed(2);
    case 'yd²': return (value / 9).toFixed(2);
    case 'a': return (value / 1076.39).toFixed(2);
    default: return value.toFixed(2);
  }
}

// --- Add pitch conversion helpers ---
function getPitchPercentFromX12(roofPitch: string) {
  const x = parseFloat(roofPitch);
  if (isNaN(x)) return '';
  return ((x / 12) * 100).toFixed(2);
}
function getPitchAngleFromX12(roofPitch: string, unit: string) {
  const x = parseFloat(roofPitch);
  if (isNaN(x)) return '';
  const angleRad = Math.atan(x / 12);
  if (unit === 'deg') return (angleRad * 180 / Math.PI).toFixed(2);
  if (unit === 'rad') return angleRad.toFixed(4);
  return '';
}
function getPitchPercentFromAngle(angle: string, unit: string) {
  const a = parseFloat(angle);
  if (isNaN(a)) return '';
  const angleRad = unit === 'deg' ? a * Math.PI / 180 : a;
  return (Math.tan(angleRad) * 100).toFixed(2);
}
function getPitchX12FromAngle(angle: string, unit: string) {
  const a = parseFloat(angle);
  if (isNaN(a)) return '';
  const angleRad = unit === 'deg' ? a * Math.PI / 180 : a;
  return (Math.tan(angleRad) * 12).toFixed(2);
}
function getPitchAngleFromPercent(percent: string, unit: string) {
  const p = parseFloat(percent);
  if (isNaN(p)) return '';
  const angleRad = Math.atan(p / 100);
  if (unit === 'deg') return (angleRad * 180 / Math.PI).toFixed(2);
  if (unit === 'rad') return angleRad.toFixed(4);
  return '';
}
function getPitchX12FromPercent(percent: string) {
  const p = parseFloat(percent);
  if (isNaN(p)) return '';
  return ((p / 100) * 12).toFixed(2);
}

const Page = () => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Validation logic ---
  React.useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    // Roof length validation
    if (fields.roofLength && parseFloat(fields.roofLength) <= 0) {
      newErrors.roofLength = "Length must be greater than zero.";
    }

    // Roof width validation
    if (fields.roofWidth && parseFloat(fields.roofWidth) <= 0) {
      newErrors.roofWidth = "Width must be greater than zero.";
    }

    // Roof pitch (x12) validation
    if (fields.pitchType === 'x12' && fields.roofPitch) {
      const pitch = parseFloat(fields.roofPitch);
      if (isNaN(pitch) || pitch < 0 || pitch > 12) {
        newErrors.roofPitch = "Roof pitch must be between 0:12 and 12:12.";
      }
    }

    // Roof pitch (%) validation
    if (fields.pitchType !== 'x12' && fields.pitchPercent) {
      const percent = parseFloat(fields.pitchPercent);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        newErrors.pitchPercent = "Roof pitch percent must be between 0% and 100%.";
      }
    }

    // Roof pitch (angle) validation
    if (fields.pitchType !== 'x12' && fields.pitchDegrees) {
      const angle = parseFloat(fields.pitchDegrees);
      if (fields.pitchDegreesUnit === 'deg') {
        if (isNaN(angle) || angle < 0 || angle > 45) {
          newErrors.pitchDegrees = "Roof pitch angle must be between 0° and 45°.";
        }
      } else if (fields.pitchDegreesUnit === 'rad') {
        if (isNaN(angle) || angle < 0 || angle > Math.PI / 4) {
          newErrors.pitchDegrees = "Roof pitch angle must be between 0 and 0.7854 radians.";
        }
      }
    }

    // Bundle size validation
    if (fields.bundleSize && parseFloat(fields.bundleSize) <= 0) {
      newErrors.bundleSize = "Bundle size must be greater than zero.";
    }

    // Bundle coverage validation
    if (fields.bundleCoverage && parseFloat(fields.bundleCoverage) <= 0) {
      newErrors.bundleCoverage = "Bundle coverage must be greater than zero.";
    }

    setErrors(newErrors);
  }, [
    fields.roofLength,
    fields.roofWidth,
    fields.roofPitch,
    fields.pitchType,
    fields.pitchPercent,
    fields.pitchDegrees,
    fields.pitchDegreesUnit,
    fields.bundleSize,
    fields.bundleCoverage
  ]);

  // --- Calculation logic ---
  // 1. Calculate footprint area (in selected unit)
  let calculatedFootprintArea = '';
  if (fields.roofLength && fields.roofWidth) {
    const lengthFt = toFeet(fields.roofLength, fields.roofLengthUnit);
    const widthFt = toFeet(fields.roofWidth, fields.roofWidthUnit);
    const areaFt2 = lengthFt * widthFt;
    calculatedFootprintArea = areaFromFeet(areaFt2, fields.footprintAreaUnit);
  }

  // 2. Calculate multiplier
  const calculatedMultiplier = getPitchMultiplier(fields);

  // 3. Calculate roof area (in selected unit)
  let calculatedRoofArea = '';
  let roofAreaFt2 = 0;
  if (calculatedFootprintArea && calculatedMultiplier) {
    const areaFt2 = toFeet(fields.roofLength, fields.roofLengthUnit) * toFeet(fields.roofWidth, fields.roofWidthUnit);
    roofAreaFt2 = areaFt2 * parseFloat(calculatedMultiplier);
    calculatedRoofArea = areaFromFeet(roofAreaFt2, fields.roofAreaUnit);
  }

  // 4. Calculate roof area in squares
  let calculatedRoofAreaSquares = '';
  if (roofAreaFt2) {
    calculatedRoofAreaSquares = (roofAreaFt2 / SQUARE_FEET_PER_SQUARE).toFixed(2);
  }

  // 5. Calculate shingle bundles and shingles
  let calculatedShingleBundles = '';
  let calculatedShingles = '';
  // Use bundle coverage (in ft²) if provided, else default to 33.3 ft² per bundle
  let bundleCoverageFt2 = 33.3;
  if (fields.bundleCoverage) {
    bundleCoverageFt2 = areaToFeet(fields.bundleCoverage, fields.bundleCoverageUnit);
  }
  if (roofAreaFt2 && bundleCoverageFt2) {
    calculatedShingleBundles = Math.ceil(roofAreaFt2 / bundleCoverageFt2).toString();
    // Use bundle size if provided, else default to 29
    const bundleSize = fields.bundleSize ? parseInt(fields.bundleSize) : DEFAULT_BUNDLE_SIZE;
    calculatedShingles = (parseInt(calculatedShingleBundles) * bundleSize).toString();
  }

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleAngleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setFields(prev => ({
      ...prev,
      pitchDegreesUnit: newUnit,
      pitchDegrees: convertAngle(prev.pitchDegrees, prev.pitchDegreesUnit, newUnit)
    }));
  };

  const handleClear = () => setFields(initialState);

  // For each input, display value converted to selected unit
  // Fix type error by using keyof typeof initialState for field and unit
  const getDisplayValue = <
    T extends keyof typeof initialState,
    U extends keyof typeof initialState
  >(
    field: T,
    unit: string,
    type: 'length' | 'area'
  ) => {
    const value = fields[field];
    // Find the corresponding unit field name (e.g., 'roofLengthUnit' for 'roofLength')
    const unitField = (field + 'Unit') as U;
    const fromUnit = fields[unitField as keyof typeof fields] as string;
    if (type === 'length') {
      return convertLength(value, fromUnit, unit);
    }
    if (type === 'area') {
      return convertArea(value, fromUnit, unit);
    }
    return value;
  };

  // --- Auto-calculate pitch fields ---
  let autoPitchPercent = '';
  let autoPitchAngle = '';
  if (fields.pitchType === 'x12' && fields.roofPitch) {
    autoPitchPercent = getPitchPercentFromX12(fields.roofPitch);
    autoPitchAngle = getPitchAngleFromX12(fields.roofPitch, fields.pitchDegreesUnit);
  } else if (fields.pitchType !== 'x12' && fields.pitchPercent) {
    autoPitchAngle = getPitchAngleFromPercent(fields.pitchPercent, fields.pitchDegreesUnit);
  } else if (fields.pitchType !== 'x12' && fields.pitchDegrees) {
    autoPitchPercent = getPitchPercentFromAngle(fields.pitchDegrees, fields.pitchDegreesUnit);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h1 className="text-2xl font-bold mb-4 text-center">Roof Shingle Calculator</h1>
          {/* Roof dimensions section */}
          <div className="mb-4 flex flex-col items-center">
            <img
              src="/shingleroof.png"
              alt="Roof dimensions"
              className="mb-2 w-48 h-28 object-contain"
              style={{ background: "#f3f4f6", borderRadius: "8px" }}
            />
          </div>
          {/* Place roof length and width in column */}
          <div className="flex flex-col gap-3 mb-2">
            <div>
              <label className="block text-sm font-medium mb-1">Roof length</label>
              <div className="flex">
                <input
                  type="number"
                  name="roofLength"
                  value={fields.roofLength}
                  onChange={handleChange}
                  className={`flex-1 border ${errors.roofLength ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="roofLengthUnit"
                  value={fields.roofLengthUnit}
                  onChange={e => {
                    setFields(prev => ({
                      ...prev,
                      roofLengthUnit: e.target.value,
                      roofLength: convertLength(prev.roofLength, prev.roofLengthUnit, e.target.value)
                    }));
                  }}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {units.length.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.roofLength && (
                <div className="text-red-600 text-xs mt-1">{errors.roofLength}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roof width</label>
              <div className="flex">
                <input
                  type="number"
                  name="roofWidth"
                  value={fields.roofWidth}
                  onChange={handleChange}
                  className={`flex-1 border ${errors.roofWidth ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  placeholder=""
                />
                <select
                  name="roofWidthUnit"
                  value={fields.roofWidthUnit}
                  onChange={e => {
                    setFields(prev => ({
                      ...prev,
                      roofWidthUnit: e.target.value,
                      roofWidth: convertLength(prev.roofWidth, prev.roofWidthUnit, e.target.value)
                    }));
                  }}
                  className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                >
                  {units.length.map(u => (
                    <option key={u.short} value={u.short}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.roofWidth && (
                <div className="text-red-600 text-xs mt-1">{errors.roofWidth}</div>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Footprint area</label>
            <div className="flex">
              <input
                type="number"
                name="footprintArea"
                value={calculatedFootprintArea}
                readOnly
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                placeholder=""
              />
              <select
                name="footprintAreaUnit"
                value={fields.footprintAreaUnit}
                onChange={e => {
                  setFields(prev => ({
                    ...prev,
                    footprintAreaUnit: e.target.value
                  }));
                }}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {units.area.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Roof pitch (x12)</label>
            <div className="flex">
              <input
                type="number"
                name="roofPitch"
                value={fields.roofPitch}
                onChange={handleChange}
                className={`flex-1 border ${errors.roofPitch ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                placeholder=""
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">:12</span>
            </div>
            {errors.roofPitch && (
              <div className="text-red-600 text-xs mt-1">{errors.roofPitch}</div>
            )}
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="pitchType"
              checked={fields.pitchType !== 'x12'}
              onChange={e => setFields(f => ({
                ...f,
                pitchType: e.target.checked ? '%' : 'x12'
              }))}
              className="mr-2"
            />
            <label htmlFor="pitchType" className="text-sm">Enter roof pitch in % or degrees</label>
          </div>
          {/* Show these fields above Multiplier when checkbox is selected */}
          {fields.pitchType !== 'x12' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-2">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Roof pitch (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="pitchPercent"
                    value={
                      fields.roofPitch
                        ? getPitchPercentFromX12(fields.roofPitch)
                        : fields.pitchPercent || autoPitchPercent
                    }
                    onChange={handleChange}
                    className={`w-full border ${errors.pitchPercent ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none pr-10`}
                    placeholder=""
                    readOnly={!!fields.roofPitch}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
                </div>
                {errors.pitchPercent && (
                  <div className="text-red-600 text-xs mt-1">{errors.pitchPercent}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roof pitch (angle)</label>
                <div className="relative flex">
                  <input
                    type="number"
                    name="pitchDegrees"
                    value={
                      fields.roofPitch
                        ? getPitchAngleFromX12(fields.roofPitch, fields.pitchDegreesUnit)
                        : fields.pitchDegrees || autoPitchAngle
                    }
                    onChange={handleChange}
                    className={`flex-1 border ${errors.pitchDegrees ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                    placeholder=""
                    readOnly={!!fields.roofPitch}
                  />
                  <select
                    name="pitchDegreesUnit"
                    value={fields.pitchDegreesUnit}
                    onChange={handleAngleUnitChange}
                    className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    <option value="deg">degrees (deg)</option>
                    <option value="rad">radians (rad)</option>
                  </select>
                </div>
                {errors.pitchDegrees && (
                  <div className="text-red-600 text-xs mt-1">{errors.pitchDegrees}</div>
                )}
              </div>
            </div>
          )}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Multiplier</label>
            <input
              type="number"
              name="multiplier"
              value={calculatedMultiplier}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder=""
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Roof area</label>
            <div className="flex">
              <input
                type="number"
                name="roofArea"
                value={calculatedRoofArea}
                readOnly
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                placeholder=""
              />
              <select
                name="roofAreaUnit"
                value={fields.roofAreaUnit}
                onChange={e => {
                  setFields(prev => ({
                    ...prev,
                    roofAreaUnit: e.target.value
                  }));
                }}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {units.area.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Roof area in squares</label>
            <input
              type="number"
              name="roofAreaSquares"
              value={calculatedRoofAreaSquares}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="squares"
            />
          </div>
        </div>
        {/* Shingle requirements section */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h2 className="text-lg font-semibold mb-4">Shingle requirements</h2>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">One bundle roof coverage</label>
            <div className="flex">
              <input
                type="number"
                name="bundleCoverage"
                value={fields.bundleCoverage}
                onChange={handleChange}
                className={`flex-1 border ${errors.bundleCoverage ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                placeholder=""
              />
              <select
                name="bundleCoverageUnit"
                value={fields.bundleCoverageUnit}
                onChange={e => {
                  setFields(prev => ({
                    ...prev,
                    bundleCoverageUnit: e.target.value
                  }));
                }}
                className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {units.bundleCoverage.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.bundleCoverage && (
              <div className="text-red-600 text-xs mt-1">{errors.bundleCoverage}</div>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Shingle bundles</label>
            <input
              type="number"
              name="shingleBundles"
              value={calculatedShingleBundles}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder=""
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Bundle size</label>
            <input
              type="number"
              name="bundleSize"
              value={fields.bundleSize}
              onChange={handleChange}
              className={`w-full border ${errors.bundleSize ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none`}
              placeholder=""
            />
            {errors.bundleSize && (
              <div className="text-red-600 text-xs mt-1">{errors.bundleSize}</div>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Shingles</label>
            <input
              type="number"
              name="shingles"
              value={calculatedShingles}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder=""
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
  );
};

export default Page;
