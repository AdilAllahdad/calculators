'use client'
import React, { useState, useEffect } from 'react'

const sectionClass =
  "bg-white rounded-xl shadow p-6 mb-4 border border-gray-100";
const labelClass =
  "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono";
const selectClass =
  "ml-2 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono text-blue-600 min-w-[90px]";
const rowClass = "mb-4";
const rowFlexClass = "flex items-center gap-2";

// Updated dropdown values
const diameterUnits = [
  { label: "millimeters", short: "mm" },
  { label: "centimeters", short: "cm" },
  { label: "meters", short: "m" },
  { label: "inches", short: "in" }
];
const cuttingSpeedUnits = [
  { label: "feet per minute", short: "ft/min" },
  { label: "inches per minute", short: "in/min" },
  { label: "millimeters per minute", short: "mm/min" },
  { label: "meters per minute", short: "m/min" }
];
const feedPerToothUnits = [
  { label: "millimeters", short: "mm" },
  { label: "centimeters", short: "cm" },
  { label: "meters", short: "m" },
  { label: "inches", short: "in" },
  { label: "feet", short: "ft" }
];
const spindleSpeedUnits = [
  { label: "rpm", value: "rpm" }
];
const feedRateUnits = [
  { label: "feet per minute", short: "ft/min" },
  { label: "inches per minute", short: "in/min" },
  { label: "millimeters per minute", short: "mm/min" },
  { label: "meters per minute", short: "m/min" }
];

// Conversion helpers (to base unit, then to selected)
const convertValue = (value: number, from: string, to: string, type: 'length' | 'speed') => {
  if (isNaN(value)) return '';
  let base = value;
  // Convert to base unit (mm for length, mm/min for speed)
  if (type === 'length') {
    // to mm
    if (from === 'mm') base = value;
    else if (from === 'cm') base = value * 10;
    else if (from === 'm') base = value * 1000;
    else if (from === 'in') base = value * 25.4;
    else if (from === 'ft') base = value * 304.8;
    // from mm to target
    if (to === 'mm') return base;
    if (to === 'cm') return base / 10;
    if (to === 'm') return base / 1000;
    if (to === 'in') return base / 25.4;
    if (to === 'ft') return base / 304.8;
  } else if (type === 'speed') {
    // to mm/min
    if (from === 'mm/min') base = value;
    else if (from === 'm/min') base = value * 1000;
    else if (from === 'in/min') base = value * 25.4;
    else if (from === 'ft/min') base = value * 304.8;
    // from mm/min to target
    if (to === 'mm/min') return base;
    if (to === 'm/min') return base / 1000;
    if (to === 'in/min') return base / 25.4;
    if (to === 'ft/min') return base / 304.8;
  }
  return value;
};

const page = () => {
  // State for values and units
  const [diameter, setDiameter] = useState('');
  const [diameterUnit, setDiameterUnit] = useState('mm');
  const [cuttingSpeed, setCuttingSpeed] = useState('');
  const [cuttingSpeedUnit, setCuttingSpeedUnit] = useState('ft/min');
  const [feedPerTooth, setFeedPerTooth] = useState('');
  const [feedPerToothUnit, setFeedPerToothUnit] = useState('mm');
  const [numTeeth, setNumTeeth] = useState('');
  const [spindleSpeed, setSpindleSpeed] = useState('');
  const [feedRate, setFeedRate] = useState('');
  const [feedRateUnit, setFeedRateUnit] = useState('ft/min');

  // Validation states
  const isNegative = (val: string) => val !== '' && !isNaN(Number(val)) && Number(val) < 0;

  // Handlers for unit change with conversion
  const handleDiameterUnitChange = (newUnit: string) => {
    if (diameter !== '') {
      const converted = convertValue(Number(diameter), diameterUnit, newUnit, 'length');
      setDiameter(converted === '' ? '' : String(Number(converted.toFixed(4))));
    }
    setDiameterUnit(newUnit);
  };
  const handleCuttingSpeedUnitChange = (newUnit: string) => {
    if (cuttingSpeed !== '') {
      const converted = convertValue(Number(cuttingSpeed), cuttingSpeedUnit, newUnit, 'speed');
      setCuttingSpeed(converted === '' ? '' : String(Number(converted.toFixed(4))));
    }
    setCuttingSpeedUnit(newUnit);
  };
  const handleFeedPerToothUnitChange = (newUnit: string) => {
    if (feedPerTooth !== '') {
      const converted = convertValue(Number(feedPerTooth), feedPerToothUnit, newUnit, 'length');
      setFeedPerTooth(converted === '' ? '' : String(Number(converted.toFixed(4))));
    }
    setFeedPerToothUnit(newUnit);
  };
  const handleFeedRateUnitChange = (newUnit: string) => {
    if (feedRate !== '') {
      const converted = convertValue(Number(feedRate), feedRateUnit, newUnit, 'speed');
      setFeedRate(converted === '' ? '' : String(Number(converted.toFixed(4))));
    }
    setFeedRateUnit(newUnit);
  };

  // Calculation logic
  useEffect(() => {
    // Calculate spindle speed (Ns) if diameter and cutting speed are valid and positive
    const d = Number(diameter);
    const v = Number(cuttingSpeed);
    if (
      diameter !== '' &&
      cuttingSpeed !== '' &&
      !isNaN(d) &&
      !isNaN(v) &&
      d > 0 &&
      v > 0
    ) {
      // Convert diameter to mm, cutting speed to m/min
      const d_mm = convertValue(d, diameterUnit, 'mm', 'length');
      const v_mmin = convertValue(v, cuttingSpeedUnit, 'm/min', 'speed');
      // Ns = (1000 * V) / (π * D)
      const ns = (1000 * Number(v_mmin)) / (Math.PI * Number(d_mm));
      setSpindleSpeed(ns ? ns.toFixed(4) : '');
    } else {
      setSpindleSpeed('');
    }
  }, [diameter, diameterUnit, cuttingSpeed, cuttingSpeedUnit]);

  useEffect(() => {
    // Calculate feed rate (Fr) if spindle speed, feed per tooth, and numTeeth are valid and positive
    const ns = Number(spindleSpeed);
    const ft = Number(feedPerTooth);
    const z = Number(numTeeth);
    if (
      spindleSpeed !== '' &&
      feedPerTooth !== '' &&
      numTeeth !== '' &&
      !isNaN(ns) &&
      !isNaN(ft) &&
      !isNaN(z) &&
      ns > 0 &&
      ft > 0 &&
      z > 0
    ) {
      // Convert feed per tooth to mm
      const ft_mm = convertValue(ft, feedPerToothUnit, 'mm', 'length');
      // Fr = Ns * Ft * Z (Ft in mm)
      let fr_mmmin = ns * Number(ft_mm) * z;
      // Convert fr_mmmin to selected feedRateUnit
      const fr_converted = convertValue(fr_mmmin, 'mm/min', feedRateUnit, 'speed');
      setFeedRate(fr_converted ? Number(fr_converted).toFixed(4) : '');
    } else {
      setFeedRate('');
    }
  }, [spindleSpeed, feedPerTooth, feedPerToothUnit, numTeeth, feedRateUnit]);

  // When user edits spindle speed manually, clear feed rate (to avoid confusion)
  const handleSpindleSpeedChange = (val: string) => {
    setSpindleSpeed(val.replace(/[^0-9.-]/g, ''));
    setFeedRate('');
  };

  // When user edits feed rate manually, clear spindle speed (to avoid confusion)
  const handleFeedRateChange = (val: string) => {
    setFeedRate(val.replace(/[^0-9.-]/g, ''));
    setSpindleSpeed('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafd]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Spindle speed calculator</h1>
        <div className={sectionClass}>
          {/* Diameter of part */}
          <div className={rowClass}>
            <label className={labelClass}>Diameter of part (D)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (isNegative(diameter) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={diameter}
                onChange={e => setDiameter(e.target.value.replace(/[^0-9.-]/g, ''))}
              />
              <select
                className={selectClass}
                value={diameterUnit}
                onChange={e => handleDiameterUnitChange(e.target.value)}
              >
                {diameterUnits.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
            {isNegative(diameter) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Diameter must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Cutting speed */}
          <div className={rowClass}>
            <label className={labelClass}>Cutting speed (V)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (isNegative(cuttingSpeed) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={cuttingSpeed}
                onChange={e => setCuttingSpeed(e.target.value.replace(/[^0-9.-]/g, ''))}
              />
              <select
                className={selectClass}
                value={cuttingSpeedUnit}
                onChange={e => handleCuttingSpeedUnitChange(e.target.value)}
              >
                {cuttingSpeedUnits.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
            {isNegative(cuttingSpeed) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Cutting speed must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Number of teeth */}
          <div className={rowClass}>
            <label className={labelClass}>Number of teeth (Z)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (isNegative(numTeeth) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={numTeeth}
                onChange={e => setNumTeeth(e.target.value.replace(/[^0-9.-]/g, ''))}
              />
            </div>
            {isNegative(numTeeth) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Number of teeth must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Feed per tooth */}
          <div className={rowClass}>
            <label className={labelClass}>Feed per tooth (F<sub>t</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (isNegative(feedPerTooth) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={feedPerTooth}
                onChange={e => setFeedPerTooth(e.target.value.replace(/[^0-9.-]/g, ''))}
              />
              <select
                className={selectClass}
                value={feedPerToothUnit}
                onChange={e => handleFeedPerToothUnitChange(e.target.value)}
              >
                {feedPerToothUnits.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
            {isNegative(feedPerTooth) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Feed per tooth must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Spindle speed */}
          <div className={rowClass}>
            <label className={labelClass}>Spindle speed (N<sub>s</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass + " pr-12" +
                  (isNegative(spindleSpeed) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={spindleSpeed}
                onChange={e => handleSpindleSpeedChange(e.target.value)}
                readOnly={
                  diameter !== '' &&
                  cuttingSpeed !== '' &&
                  !isNegative(diameter) &&
                  !isNegative(cuttingSpeed)
                }
              />
              <span className="ml-[-2.5rem] text-gray-400 text-base font-mono pointer-events-none select-none" style={{marginLeft: '-3.5rem', position: 'relative', left: '-2.5rem'}} >rpm</span>
            </div>
            {isNegative(spindleSpeed) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Spindle speed must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Feed rate */}
          <div className={rowClass}>
            <label className={labelClass}>Feed rate (F<sub>r</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (isNegative(feedRate) ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={feedRate}
                onChange={e => handleFeedRateChange(e.target.value)}
                readOnly={
                  spindleSpeed !== '' &&
                  feedPerTooth !== '' &&
                  numTeeth !== '' &&
                  !isNegative(spindleSpeed) &&
                  !isNegative(feedPerTooth) &&
                  !isNegative(numTeeth)
                }
              />
              <select
                className={selectClass}
                value={feedRateUnit}
                onChange={e => handleFeedRateUnitChange(e.target.value)}
              >
                {feedRateUnits.map(u => (
                  <option key={u.short} value={u.short}>{u.label}</option>
                ))}
              </select>
            </div>
            {isNegative(feedRate) && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>Feed rate must be greater than zero.</span>
              </div>
            )}
          </div>
          {/* Clear button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              onClick={() => {
                setDiameter('');
                setCuttingSpeed('');
                setNumTeeth('');
                setFeedPerTooth('');
                setSpindleSpeed('');
                setFeedRate('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page

