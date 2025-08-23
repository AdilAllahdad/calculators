'use client'
import React, { useState } from 'react'

const sectionClass =
  "bg-white rounded-xl shadow p-6 mb-4 border border-gray-100";
const labelClass =
  "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono";
const selectClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono";
const headingClass =
  "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2";
const subLabelClass =
  "text-xs text-gray-400 ml-1";

// Types for dropdown options
type BoltTypeOption = { label: string; k: number | null }
type UnitOption = { label: string; short: string; toBase: (v: number) => number; fromBase: (v: number) => number }
type LubricantOption = { label: string; l: number | null }
type LubricationFactorUnitOption = { label: string; short: string; toPercent: (v: number) => number; fromPercent: (v: number) => number }

const boltTypeOptions: BoltTypeOption[] = [
  { label: "Mild-steel, dry", k: 0.2 },
  { label: "Mild-steel, lubricated", k: 0.18 },
  { label: "Mild-steel, black finish", k: 0.3 },
  { label: "Mild-steel, zinc-plated", k: 0.2 },
  { label: "Mild-steel, cadmium-plated", k: 0.16 },
  { label: "Enter a custom constant K", k: null }
];

const diameterUnitOptions: UnitOption[] = [
  { label: "millimeters", short: "mm", toBase: v => v / 1000, fromBase: v => v * 1000 },
  { label: "centimeters", short: "cm", toBase: v => v / 100, fromBase: v => v * 100 },
  { label: "meters", short: "m", toBase: v => v, fromBase: v => v },
  { label: "inches", short: "in", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  { label: "feet", short: "ft", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 }
];

const lubricantOptions: LubricantOption[] = [
  { label: "No lubricant", l: 0 },
  { label: "Graphite", l: 52.5 },
  { label: "White grease", l: 40 },
  { label: "SAE 30 oil", l: 40 },
  { label: "SAE 40 oil", l: 35 },
  { label: "Enter a custom lubrication factor", l: null }
];

const lubricationFactorUnitOptions: LubricationFactorUnitOption[] = [
  { label: "decimals", short: ".", toPercent: v => v * 100, fromPercent: v => v / 100 },
  { label: "percent", short: "%", toPercent: v => v, fromPercent: v => v }
];

const clampingForceUnitOptions: UnitOption[] = [
  { label: "newtons", short: "N", toBase: v => v, fromBase: v => v },
  { label: "kilonewtons", short: "kN", toBase: v => v * 1000, fromBase: v => v / 1000 },
  { label: "meganewtons", short: "MN", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
  { label: "giganewtons", short: "GN", toBase: v => v * 1e9, fromBase: v => v / 1e9 },
  { label: "teranewtons", short: "TN", toBase: v => v * 1e12, fromBase: v => v / 1e12 },
  { label: "pounds-force", short: "lbf", toBase: v => v * 4.44822, fromBase: v => v / 4.44822 }
];

const torqueUnitOptions: UnitOption[] = [
  { label: "newton meters", short: "N·m", toBase: v => v, fromBase: v => v },
  { label: "kilogram-force centimeters", short: "kgf·cm", toBase: v => v * 0.0980665, fromBase: v => v / 0.0980665 },
  { label: "joules per radian", short: "J/rad", toBase: v => v, fromBase: v => v }, // 1 J/rad = 1 Nm
  { label: "pound-force feet", short: "lbf·ft", toBase: v => v * 1.35582, fromBase: v => v / 1.35582 },
  { label: "pound-force inches", short: "lbf·in", toBase: v => v * 0.112985, fromBase: v => v / 0.112985 }
];

const page = () => {
  // State
  const [boltType, setBoltType] = useState<string>(boltTypeOptions[0].label);
  const [customK, setCustomK] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('');
  const [diameterUnit, setDiameterUnit] = useState<string>(diameterUnitOptions[0].short);
  const [lubricant, setLubricant] = useState<string>(lubricantOptions[0].label);
  const [customL, setCustomL] = useState<string>('');
  const [lubricationFactorUnit, setLubricationFactorUnit] = useState<string>(lubricationFactorUnitOptions[0].short);
  const [clampingForce, setClampingForce] = useState<string>('');
  const [clampingForceUnit, setClampingForceUnit] = useState<string>(clampingForceUnitOptions[0].short);
  const [torque, setTorque] = useState<string>('');
  const [torqueUnit, setTorqueUnit] = useState<string>(torqueUnitOptions[0].short);
  const [mode, setMode] = useState<'torque' | 'force'>('torque'); // which to calculate

  // Helper: get K value
  const getK = (): number => {
    const opt = boltTypeOptions.find(o => o.label === boltType);
    if (opt && opt.k !== null) return opt.k;
    const val = parseFloat(customK);
    return isNaN(val) ? 0 : val;
  };

  // Helper: get l value (as percent, always for calculation)
  const getL = (): number => {
    const opt = lubricantOptions.find(o => o.label === lubricant);
    if (opt && opt.l !== null) return opt.l;
    const val = parseFloat(customL);
    if (isNaN(val)) return 0;
    // Always use percent for calculation
    const unitObj = lubricationFactorUnitOptions.find(u => u.short === lubricationFactorUnit);
    return unitObj ? unitObj.toPercent(val) : val;
  };

  // Helper: get lubrication factor display value (for input field)
  const getLDisplay = (): string => {
    const opt = lubricantOptions.find(o => o.label === lubricant);
    if (opt && opt.l !== null) {
      // Show in selected unit for display
      const unitObj = lubricationFactorUnitOptions.find(u => u.short === lubricationFactorUnit);
      return unitObj ? unitObj.fromPercent(opt.l).toString() : opt.l.toString();
    }
    // custom
    return customL;
  };

  // Helper: get diameter in meters
  const getDiameterMeters = (): number => {
    const val = parseFloat(diameter);
    if (isNaN(val)) return 0;
    const unitObj = diameterUnitOptions.find(u => u.short === diameterUnit);
    return unitObj ? unitObj.toBase(val) : val;
  };

  // Helper: get diameter in selected unit (for display)
  const getDiameterDisplay = (): string => {
    const val = parseFloat(diameter);
    if (isNaN(val)) return '';
    const unitObj = diameterUnitOptions.find(u => u.short === diameterUnit);
    if (!unitObj) return diameter;
    // Always store internally as meters, convert for display
    const meters = unitObj.toBase(val);
    return unitObj.fromBase(meters).toString();
  };

  // Helper: get clamping force in newtons (for calculation)
  const getClampingForceN = (): number => {
    const val = parseFloat(clampingForce);
    if (isNaN(val)) return 0;
    const unitObj = clampingForceUnitOptions.find(u => u.short === clampingForceUnit);
    return unitObj ? unitObj.toBase(val) : val;
  };

  // Helper: get clamping force display value (for input field)
  const getClampingForceDisplay = (): string => {
    const val = parseFloat(clampingForce);
    if (isNaN(val)) return '';
    const unitObj = clampingForceUnitOptions.find(u => u.short === clampingForceUnit);
    return unitObj ? unitObj.fromBase(unitObj.toBase(val)).toString() : clampingForce;
  };

  // Helper: get torque in Nm
  const getTorqueNm = (): number => {
    const val = parseFloat(torque);
    if (isNaN(val)) return 0;
    const unitObj = torqueUnitOptions.find(u => u.short === torqueUnit);
    return unitObj ? unitObj.toBase(val) : val;
  };

  // Calculation
  let calculatedTorqueNm = 0;
  let calculatedClampingForceN = 0;
  const K = getK();
  const F = getClampingForceN();
  const d = getDiameterMeters();
  const l = getL();

  if (mode === 'torque') {
    // Calculate torque
    calculatedTorqueNm = K * F * d * (1 - l / 100);
  } else {
    // Calculate clamping force
    if (K * d * (1 - l / 100) !== 0) {
      calculatedClampingForceN = getTorqueNm() / (K * d * (1 - l / 100));
    }
  }

  // Output values in selected units
  const torqueDisplay = mode === 'torque'
    ? (torqueUnitOptions.find(u => u.short === torqueUnit)?.fromBase(calculatedTorqueNm).toString() || '')
    : torque;
  const clampingForceDisplay = mode === 'force'
    ? (clampingForceUnitOptions.find(u => u.short === clampingForceUnit)?.fromBase(calculatedClampingForceN).toString() || '')
    : getClampingForceDisplay();

  // Clear handler
  const handleClear = () => {
    setBoltType(boltTypeOptions[0].label);
    setCustomK('');
    setDiameter('');
    setDiameterUnit(diameterUnitOptions[0].short);
    setLubricant(lubricantOptions[0].label);
    setCustomL('');
    setLubricationFactorUnit(lubricationFactorUnitOptions[0].short);
    setClampingForce('');
    setClampingForceUnit(clampingForceUnitOptions[0].short);
    setTorque('');
    setTorqueUnit(torqueUnitOptions[0].short);
    setMode('torque');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Bolt torque calculator</h1>

      {/* Mode toggle */}
      <div className="flex justify-center mb-4 gap-2">
        <button
          className={`px-4 py-1 rounded ${mode === 'torque' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setMode('torque')}
        >
          Calculate Torque
        </button>
        <button
          className={`px-4 py-1 rounded ${mode === 'force' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setMode('force')}
        >
          Calculate Clamping Force
        </button>
      </div>

      {/* Bolt details */}
      <div className={sectionClass}>
        <div className={headingClass}>
          <span>▾</span>
          Bolt details
        </div>
        <label className={labelClass}>Bolt type</label>
        <select
          className={selectClass}
          value={boltType}
          onChange={e => setBoltType(e.target.value)}
        >
          {boltTypeOptions.map(opt => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>

        <label className={labelClass} style={{ marginTop: 16 }}>
          Constant (k)
        </label>
        {boltType === "Enter a custom constant K" ? (
          <input
            className={inputClass}
            type="number"
            value={customK}
            onChange={e => setCustomK(e.target.value)}
            placeholder="Enter K"
            step="any"
          />
        ) : (
          <input
            className={inputClass + " bg-gray-100"}
            value={getK()}
            readOnly
          />
        )}

        <label className={labelClass} style={{ marginTop: 16 }}>
          Diameter (d)
          <span className={subLabelClass}>i</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className={inputClass}
            type="number"
            value={diameter}
            onChange={e => setDiameter(e.target.value)}
            placeholder="Enter diameter"
            step="any"
          />
          <select
            className={selectClass + " w-28"}
            value={diameterUnit}
            onChange={e => {
              // Convert current value to meters, then to new unit for display
              const prevUnitObj = diameterUnitOptions.find(u => u.short === diameterUnit);
              const newUnit = e.target.value;
              const newUnitObj = diameterUnitOptions.find(u => u.short === newUnit);
              let meters = 0;
              if (prevUnitObj && diameter) {
                meters = prevUnitObj.toBase(parseFloat(diameter));
              }
              let newValue = '';
              if (newUnitObj && !isNaN(meters)) {
                newValue = newUnitObj.fromBase(meters).toString();
              }
              setDiameterUnit(newUnit);
              setDiameter(newValue);
            }}
          >
            {diameterUnitOptions.map(opt => (
              <option key={opt.short} value={opt.short}>{opt.label} ({opt.short})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lubrication */}
      <div className={sectionClass}>
        <div className={headingClass}>
          <span>▾</span>
          Lubrication
        </div>
        <label className={labelClass}>Lubricant</label>
        <select
          className={selectClass}
          value={lubricant}
          onChange={e => setLubricant(e.target.value)}
        >
          {lubricantOptions.map(opt => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>

        <label className={labelClass} style={{ marginTop: 16 }}>
          Lubrication factor (l)
        </label>
        <div className="flex items-center gap-2">
          <input
            className={inputClass}
            type="number"
            value={getLDisplay()}
            onChange={e => setCustomL(e.target.value)}
            placeholder="Enter lubrication factor"
            step="any"
            disabled={lubricant !== "Enter a custom lubrication factor"}
          />
          <select
            className={selectClass + " w-24"}
            value={lubricationFactorUnit}
            onChange={e => setLubricationFactorUnit(e.target.value)}
          >
            {lubricationFactorUnitOptions.map(opt => (
              <option key={opt.short} value={opt.short}>{opt.label} ({opt.short})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Force and torque */}
      <div className={sectionClass}>
        <div className={headingClass}>
          <span>▾</span>
          Force and torque
        </div>
        <label className={labelClass}>Clamping force (F)</label>
        <div className="flex items-center gap-2">
          <input
            className={inputClass}
            type="number"
            value={clampingForceDisplay}
            onChange={e => {
              setClampingForce(e.target.value);
              setMode('torque');
            }}
            placeholder="Enter clamping force"
            step="any"
            disabled={mode === 'force'}
          />
          <select
            className={selectClass + " w-32"}
            value={clampingForceUnit}
            onChange={e => {
              // Convert current value to new unit for display only
              const prevUnitObj = clampingForceUnitOptions.find(u => u.short === clampingForceUnit);
              const newUnit = e.target.value;
              const newUnitObj = clampingForceUnitOptions.find(u => u.short === newUnit);
              let newValue = clampingForce;
              if (prevUnitObj && newUnitObj && clampingForce) {
                const base = prevUnitObj.toBase(parseFloat(clampingForce));
                newValue = newUnitObj.fromBase(base).toString();
              }
              setClampingForceUnit(newUnit);
              setClampingForce(newValue);
            }}
          >
            {clampingForceUnitOptions.map(opt => (
              <option key={opt.short} value={opt.short}>{opt.label} ({opt.short})</option>
            ))}
          </select>
        </div>

        <label className={labelClass} style={{ marginTop: 16 }}>
          Torque (T)
        </label>
        <div className="flex items-center gap-2">
          <input
            className={inputClass}
            type="number"
            value={torqueDisplay}
            onChange={e => {
              setTorque(e.target.value);
              setMode('force');
            }}
            placeholder="Enter torque"
            step="any"
            disabled={mode === 'torque'}
          />
          <select
            className={selectClass + " w-40"}
            value={torqueUnit}
            onChange={e => setTorqueUnit(e.target.value)}
          >
            {torqueUnitOptions.map(opt => (
              <option key={opt.short} value={opt.short}>{opt.label} ({opt.short})</option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="w-full mt-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
        onClick={handleClear}
        type="button"
      >
        Clear
      </button>
    </div>
  )
}

export default page
