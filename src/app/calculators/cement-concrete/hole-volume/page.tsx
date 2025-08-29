'use client'
import React, { useState, useEffect } from 'react'
import { FiInfo, FiChevronDown } from 'react-icons/fi'

const lengthUnits = [
  { label: "millimeters", value: "mm" },
  { label: "centimeters", value: "cm" },
  { label: "decimeters", value: "dm" },
  { label: "meters", value: "m" },
  { label: "kilometers", value: "km" },
  { label: "inches", value: "in" },
  { label: "feet", value: "ft" }
]
const areaUnits = [
  { label: 'square meters (m²)', value: 'm2' },
  { label: 'square centimeters (cm²)', value: 'cm2' },
  { label: 'square feet (ft²)', value: 'ft2' }
]
const volumeUnits = [
  { label: "cubic centimeters", value: "cm³" },
  { label: "cubic meters", value: "m³" },
  { label: "cubic inches", value: "cu in" },
  { label: "cubic feet", value: "cu ft" },
  { label: "cubic yards", value: "cu yd" },
  { label: "centiliters", value: "cl" },
  { label: "liters", value: "l" },
  { label: "gallons (US)", value: "US gal" },
  { label: "gallons (UK)", value: "UK gal" },
  { label: "fluid ounces (US)", value: "US fl oz" },
  { label: "fluid ounces (UK)", value: "UK fl oz" },
  { label: "quarts (US)", value: "US qt" },
  { label: "quarts (UK)", value: "UK qt" },
  { label: "pints (US)", value: "US pt" },
  { label: "pints (UK)", value: "UK pt" }
]
const percentUnits = [{ label: '%', value: '%' }]
const units = { length: lengthUnits, area: areaUnits, volume: volumeUnits, percent: percentUnits, count: [{ label: 'units', value: 'units' }] }

// --- Unit conversion helpers ---
const toMeters: Record<string, (v: number) => number> = {
  mm: v => v / 1000,
  cm: v => v / 100,
  dm: v => v / 10,
  m: v => v,
  km: v => v * 1000,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
}
const fromMeters: Record<string, (v: number) => number> = {
  mm: v => v * 1000,
  cm: v => v * 100,
  dm: v => v * 10,
  m: v => v,
  km: v => v / 1000,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
}

// --- Volume conversion helpers ---
const toM3: Record<string, (v: number) => number> = {
  'cm³': v => v / 1e6,
  'm³': v => v,
  'cu in': v => v * 0.000016387064,
  'cu ft': v => v * 0.028316846592,
  'cu yd': v => v * 0.764554857984,
  cl: v => v / 100000,
  l: v => v / 1000,
  'US gal': v => v * 0.003785411784,
  'UK gal': v => v * 0.00454609,
  'US fl oz': v => v * 2.957352956e-5,
  'UK fl oz': v => v * 2.841306e-5,
  'US qt': v => v * 0.000946352946,
  'UK qt': v => v * 0.0011365225,
  'US pt': v => v * 0.000473176473,
  'UK pt': v => v * 0.00056826125,
}
const fromM3: Record<string, (v: number) => number> = {
  'cm³': v => v * 1e6,
  'm³': v => v,
  'cu in': v => v / 0.000016387064,
  'cu ft': v => v / 0.028316846592,
  'cu yd': v => v / 0.764554857984,
  cl: v => v * 100000,
  l: v => v * 1000,
  'US gal': v => v / 0.003785411784,
  'UK gal': v => v / 0.00454609,
  'US fl oz': v => v / 2.957352956e-5,
  'UK fl oz': v => v / 2.841306e-5,
  'US qt': v => v / 0.000946352946,
  'UK qt': v => v / 0.0011365225,
  'US pt': v => v / 0.000473176473,
  'UK pt': v => v / 0.00056826125,
}

// Helper to map unit value to conversion key for volume
const getVolumeConvKey = (unit: string) => {
  const validKeys = [
    'cm³', 'm³', 'cu in', 'cu ft', 'cu yd', 'cl', 'l', 'US gal', 'UK gal',
    'US fl oz', 'UK fl oz', 'US qt', 'UK qt', 'US pt', 'UK pt'
  ];
  if (validKeys.includes(unit)) return unit;
  const normalized = unit.replace(/[\s.]/g, '').toLowerCase();
  for (const key of validKeys) {
    if (key.replace(/[\s.]/g, '').toLowerCase() === normalized) return key;
  }
  return unit;
};

const InputRow = ({
  label,
  value,
  onValueChange,
  unit,
  unitOptions,
  onUnitChange,
  placeholder,
  info,
  disabled,
  type = "text",
  error,
}: any) => (
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={info}>
          <FiInfo size={16} />
        </span>
      )}
    </div>
    <div className="flex">
      <input
        type={type}
        className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${error ? 'border-red-500 bg-red-50' : ''} ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={e => onValueChange && onValueChange(e.target.value)}
        style={{ minWidth: 0 }}
      />
      {unitOptions && (
        <div className="relative w-28">
          <select
            className="w-full border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white focus:outline-none truncate"
            disabled={disabled}
            value={unit}
            onChange={e => onUnitChange && onUnitChange(e.target.value)}
            style={{ maxWidth: '100%' }}
          >
            {unitOptions.map((opt: any) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
          <span className="absolute right-2 top-2 text-gray-400 pointer-events-none">
            <FiChevronDown size={14} />
          </span>
        </div>
      )}
    </div>
    {error && (
      <div className="text-xs text-red-600 mt-1 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        {error}
      </div>
    )}
  </div>
)

const Page = () => {
  // Circular hole
  const [cDepth, setCDepth] = useState('')
  const [cDepthUnit, setCDepthUnit] = useState('cm')
  const [cRadius, setCRadius] = useState('')
  const [cRadiusUnit, setCRadiusUnit] = useState('cm')
  const [cDiameter, setCDiameter] = useState('')
  const [cDiameterUnit, setCDiameterUnit] = useState('cm')
  const [cVolume, setCVolume] = useState('')
  const [cVolumeUnit, setCVolumeUnit] = useState('cm³')

  // Rectangular hole
  const [rDepth, setRDepth] = useState('')
  const [rDepthUnit, setRDepthUnit] = useState('cm')
  const [rLength, setRLength] = useState('')
  const [rLengthUnit, setRLengthUnit] = useState('cm')
  const [rWidth, setRWidth] = useState('')
  const [rWidthUnit, setRWidthUnit] = useState('cm')
  const [rVolume, setRVolume] = useState('')
  const [rVolumeUnit, setRVolumeUnit] = useState('cm³')

  // Volume of concrete for a post
  const [postQty, setPostQty] = useState('')
  const [postQtyUnit, setPostQtyUnit] = useState('units')
  const [waste, setWaste] = useState('7')
  const [wasteUnit, setWasteUnit] = useState('%')
  const [reqCVolume, setReqCVolume] = useState('')
  const [reqCVolumeUnit, setReqCVolumeUnit] = useState('cm³')
  const [reqRVolume, setReqRVolume] = useState('')
  const [reqRVolumeUnit, setReqRVolumeUnit] = useState('cm³')

  // --- Independent unit change handlers for each input field ---
  const handleCDepthUnitChange = (newUnit: string) => {
    if (cDepth) {
      const meters = toMeters[cDepthUnit](parseFloat(cDepth));
      const newValue = fromMeters[newUnit](meters);
      setCDepth(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setCDepthUnit(newUnit);
  };
  const handleCRadiusUnitChange = (newUnit: string) => {
    if (cRadius) {
      const meters = toMeters[cRadiusUnit](parseFloat(cRadius));
      const newValue = fromMeters[newUnit](meters);
      setCRadius(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setCRadiusUnit(newUnit);
  };
  const handleCDiameterUnitChange = (newUnit: string) => {
    if (cDiameter) {
      const meters = toMeters[cDiameterUnit](parseFloat(cDiameter));
      const newValue = fromMeters[newUnit](meters);
      setCDiameter(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setCDiameterUnit(newUnit);
  };
  const handleCVolumeUnitChange = (newUnit: string) => {
    if (cVolume) {
      const fromKey = getVolumeConvKey(cVolumeUnit);
      const toKey = getVolumeConvKey(newUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const m3 = fromFn(parseFloat(cVolume));
        const newValue = toFn(m3);
        setCVolume(newValue ? String(Number(newValue.toFixed(6))) : '');
      }
    }
    setCVolumeUnit(newUnit);
  };
  const handleRDepthUnitChange = (newUnit: string) => {
    if (rDepth) {
      const meters = toMeters[rDepthUnit](parseFloat(rDepth));
      const newValue = fromMeters[newUnit](meters);
      setRDepth(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setRDepthUnit(newUnit);
  };
  const handleRLengthUnitChange = (newUnit: string) => {
    if (rLength) {
      const meters = toMeters[rLengthUnit](parseFloat(rLength));
      const newValue = fromMeters[newUnit](meters);
      setRLength(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setRLengthUnit(newUnit);
  };
  const handleRWidthUnitChange = (newUnit: string) => {
    if (rWidth) {
      const meters = toMeters[rWidthUnit](parseFloat(rWidth));
      const newValue = fromMeters[newUnit](meters);
      setRWidth(newValue ? String(Number(newValue.toFixed(6))) : '');
    }
    setRWidthUnit(newUnit);
  };
  const handleRVolumeUnitChange = (newUnit: string) => {
    if (rVolume) {
      const fromKey = getVolumeConvKey(rVolumeUnit);
      const toKey = getVolumeConvKey(newUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const m3 = fromFn(parseFloat(rVolume));
        const newValue = toFn(m3);
        setRVolume(newValue ? String(Number(newValue.toFixed(6))) : '');
      }
    }
    setRVolumeUnit(newUnit);
  };
  const handlePostQtyUnitChange = (newUnit: string) => {
    setPostQtyUnit(newUnit);
  };
  const handleWasteUnitChange = (newUnit: string) => {
    setWasteUnit(newUnit);
  };
  const handleReqCVolumeUnitChange = (newUnit: string) => {
    if (reqCVolume) {
      const fromKey = getVolumeConvKey(reqCVolumeUnit);
      const toKey = getVolumeConvKey(newUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const m3 = fromFn(parseFloat(reqCVolume));
        const newValue = toFn(m3);
        setReqCVolume(newValue ? String(Number(newValue.toFixed(6))) : '');
      }
    }
    setReqCVolumeUnit(newUnit);
  };
  const handleReqRVolumeUnitChange = (newUnit: string) => {
    if (reqRVolume) {
      const fromKey = getVolumeConvKey(reqRVolumeUnit);
      const toKey = getVolumeConvKey(newUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const m3 = fromFn(parseFloat(reqRVolume));
        const newValue = toFn(m3);
        setReqRVolume(newValue ? String(Number(newValue.toFixed(6))) : '');
      }
    }
    setReqRVolumeUnit(newUnit);
  };

  // --- Auto-calculate diameter and volume for circular hole ---
  useEffect(() => {
    // Calculate diameter if radius is entered
    if (cRadius && !isNaN(Number(cRadius))) {
      const radiusMeters = toMeters[cRadiusUnit](parseFloat(cRadius));
      const diameterMeters = radiusMeters * 2;
      const newDiameter = fromMeters[cDiameterUnit](diameterMeters);
      setCDiameter(newDiameter ? String(Number(newDiameter.toFixed(6))) : '');
    }
    // Calculate volume if depth and radius are entered
    if (cDepth && cRadius && !isNaN(Number(cDepth)) && !isNaN(Number(cRadius))) {
      const depthM = toMeters[cDepthUnit](parseFloat(cDepth));
      const radiusM = toMeters[cRadiusUnit](parseFloat(cRadius));
      const volumeM3 = Math.PI * Math.pow(radiusM, 2) * depthM;
      const toKey = getVolumeConvKey(cVolumeUnit);
      const toFn = fromM3[toKey];
      if (typeof toFn === 'function') {
        const vol = toFn(volumeM3);
        setCVolume(vol ? String(Number(vol.toFixed(6))) : '');
      }
    }
  // Only recalculate when these change
  // eslint-disable-next-line
  }, [cDepth, cDepthUnit, cRadius, cRadiusUnit, cDiameterUnit, cVolumeUnit]);

  // --- Auto-calculate volume for rectangular hole ---
  useEffect(() => {
    if (
      rDepth && rLength && rWidth &&
      !isNaN(Number(rDepth)) && !isNaN(Number(rLength)) && !isNaN(Number(rWidth))
    ) {
      const depthM = toMeters[rDepthUnit](parseFloat(rDepth));
      const lengthM = toMeters[rLengthUnit](parseFloat(rLength));
      const widthM = toMeters[rWidthUnit](parseFloat(rWidth));
      const volumeM3 = lengthM * widthM * depthM;
      const toKey = getVolumeConvKey(rVolumeUnit);
      const toFn = fromM3[toKey];
      if (typeof toFn === 'function') {
        const vol = toFn(volumeM3);
        setRVolume(vol ? String(Number(vol.toFixed(6))) : '');
      }
    }
  // eslint-disable-next-line
  }, [rDepth, rDepthUnit, rLength, rLengthUnit, rWidth, rWidthUnit, rVolumeUnit]);

  // --- Auto-calculate required concrete for posts (circular and rectangular) ---
  useEffect(() => {
    // Circular
    if (
      cVolume && postQty && !isNaN(Number(cVolume)) && !isNaN(Number(postQty))
    ) {
      const wastePercent = !isNaN(Number(waste)) ? Number(waste) : 0;
      const nPosts = Number(postQty);
      const fromKey = getVolumeConvKey(cVolumeUnit);
      const toKey = getVolumeConvKey(reqCVolumeUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const baseVolM3 = fromFn(Number(cVolume));
        const reqVolM3 = baseVolM3 * (1 + wastePercent / 100) * nPosts;
        const reqVol = toFn(reqVolM3);
        setReqCVolume(reqVol ? String(Number(reqVol.toFixed(6))) : '');
      }
    }
    // Rectangular
    if (
      rVolume && postQty && !isNaN(Number(rVolume)) && !isNaN(Number(postQty))
    ) {
      const wastePercent = !isNaN(Number(waste)) ? Number(waste) : 0;
      const nPosts = Number(postQty);
      const fromKey = getVolumeConvKey(rVolumeUnit);
      const toKey = getVolumeConvKey(reqRVolumeUnit);
      const fromFn = toM3[fromKey];
      const toFn = fromM3[toKey];
      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        const baseVolM3 = fromFn(Number(rVolume));
        const reqVolM3 = baseVolM3 * (1 + wastePercent / 100) * nPosts;
        const reqVol = toFn(reqVolM3);
        setReqRVolume(reqVol ? String(Number(reqVol.toFixed(6))) : '');
      }
    }
  // eslint-disable-next-line
  }, [cVolume, cVolumeUnit, rVolume, rVolumeUnit, postQty, reqCVolumeUnit, reqRVolumeUnit, waste]);

  const handleClear = () => {
    setCDepth(''); setCDepthUnit('cm');
    setCRadius(''); setCRadiusUnit('cm');
    setCDiameter(''); setCDiameterUnit('cm');
    setCVolume(''); setCVolumeUnit('cm³');
    setRDepth(''); setRDepthUnit('cm');
    setRLength(''); setRLengthUnit('cm');
    setRWidth(''); setRWidthUnit('cm');
    setRVolume(''); setRVolumeUnit('cm³');
    setPostQty(''); setPostQtyUnit('units');
    setWaste('7'); setWasteUnit('%');
    setReqCVolume(''); setReqCVolumeUnit('cm³');
    setReqRVolume(''); setReqRVolumeUnit('cm³');
  }

  // --- Validation logic for all input fields ---
  const getPositiveError = (v: string) =>
    v && (!/^-?\d*\.?\d*$/.test(v) || Number(v) <= 0)
      ? 'The hole depth, radius and diameter must be more than 0.'
      : undefined;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">Hole Volume Calculator</h1>
      <div className="w-full max-w-sm">
        {/* Circular hole */}
        <div className="bg-white rounded-xl shadow p-5 border mb-6">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-medium text-gray-800">Circular hole</span>
          </div>
          <InputRow
            label="Depth"
            value={cDepth}
            onValueChange={setCDepth}
            unit={cDepthUnit}
            unitOptions={units.length}
            onUnitChange={handleCDepthUnitChange}
            info
            error={getPositiveError(cDepth)}
          />
          <InputRow
            label="Radius"
            value={cRadius}
            onValueChange={setCRadius}
            unit={cRadiusUnit}
            unitOptions={units.length}
            onUnitChange={handleCRadiusUnitChange}
            info
            error={getPositiveError(cRadius)}
          />
          <InputRow
            label="Diameter"
            value={cDiameter}
            onValueChange={setCDiameter}
            unit={cDiameterUnit}
            unitOptions={units.length}
            onUnitChange={handleCDiameterUnitChange}
            error={getPositiveError(cDiameter)}
          />
          <InputRow
            label="Volume"
            value={cVolume}
            onValueChange={setCVolume}
            unit={cVolumeUnit}
            unitOptions={units.volume}
            onUnitChange={handleCVolumeUnitChange}
            error={getPositiveError(cVolume)}
          />
        </div>
        {/* Rectangular hole */}
        <div className="bg-white rounded-xl shadow p-5 border mb-6">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-medium text-gray-800">Rectangular hole</span>
          </div>
          <InputRow
            label="Depth"
            value={rDepth}
            onValueChange={setRDepth}
            unit={rDepthUnit}
            unitOptions={units.length}
            onUnitChange={handleRDepthUnitChange}
            info
            error={getPositiveError(rDepth)}
          />
          <InputRow
            label="Length"
            value={rLength}
            onValueChange={setRLength}
            unit={rLengthUnit}
            unitOptions={units.length}
            onUnitChange={handleRLengthUnitChange}
            error={getPositiveError(rLength)}
          />
          <InputRow
            label="Width"
            value={rWidth}
            onValueChange={setRWidth}
            unit={rWidthUnit}
            unitOptions={units.length}
            onUnitChange={handleRWidthUnitChange}
            error={getPositiveError(rWidth)}
          />
          <InputRow
            label="Volume"
            value={rVolume}
            onValueChange={setRVolume}
            unit={rVolumeUnit}
            unitOptions={units.volume}
            onUnitChange={handleRVolumeUnitChange}
            error={getPositiveError(rVolume)}
          />
        </div>
        {/* Volume of concrete for a post */}
        <div className="bg-white rounded-xl shadow p-5 border mb-6">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-medium text-gray-800">Volume of concrete for a post</span>
          </div>
          <InputRow
            label="Quantity of posts"
            value={postQty}
            onValueChange={setPostQty}
            unit={postQtyUnit}
            unitOptions={units.count}
            onUnitChange={handlePostQtyUnitChange}
            error={getPositiveError(postQty)}
          />
          <InputRow
            label="Waste"
            value={waste}
            onValueChange={setWaste}
            unit={wasteUnit}
            unitOptions={units.percent}
            onUnitChange={handleWasteUnitChange}
            info
            error={getPositiveError(waste)}
          />
          <InputRow
            label="Required concrete (circular hole)"
            value={reqCVolume}
            onValueChange={setReqCVolume}
            unit={reqCVolumeUnit}
            unitOptions={units.volume}
            onUnitChange={handleReqCVolumeUnitChange}
            error={getPositiveError(reqCVolume)}
          />
          <InputRow
            label="Required concrete (rectangular hole)"
            value={reqRVolume}
            onValueChange={setReqRVolume}
            unit={reqRVolumeUnit}
            unitOptions={units.volume}
            onUnitChange={handleReqRVolumeUnitChange}
            error={getPositiveError(reqRVolume)}
          />
        </div>
        <div className="mt-4">
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
