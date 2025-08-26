'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const unitOptions = [
  { label: 'millimeters (mm)', value: 'mm' },
  { label: 'centimeters (cm)', value: 'cm' },
  { label: 'meters (m)', value: 'm' },
  { label: 'kilometers (km)', value: 'km' },
  { label: 'inches (in)', value: 'in' },
  { label: 'feet (ft)', value: 'ft' },
  { label: 'yards (yd)', value: 'yd' },
  { label: 'miles (mi)', value: 'mi' }
]

const angleUnitOptions = [
  { label: 'degrees (deg)', value: 'deg' },
  { label: 'radians (rad)', value: 'rad' },
  { label: 'minutes of arc (arcmin)', value: 'arcmin' },
  { label: 'seconds of arc (arcsec)', value: 'arcsec' },
  { label: 'π radians (× π rad)', value: 'pi_rad' }
]

const percentageUnitOptions = [{ label: '%', value: '%' }];

// Use the same unit options as the first screen for rise/run
const runRiseUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
];

// Separate unit conversion functions for rise and run
function convertRise(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  };
  if (!(from in toMeters) || !(to in toMeters)) return value;
  const meters = value * toMeters[from];
  return meters / toMeters[to];
}
function convertRun(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  };
  if (!(from in toMeters) || !(to in toMeters)) return value;
  const meters = value * toMeters[from];
  return meters / toMeters[to];
}
function convertAngle(value: number, from: string, to: string): number {
  // deg, rad, arcmin, arcsec, pi_rad
  if (from === to) return value;
  let degValue = value;
  if (from === 'rad') degValue = value * (180 / Math.PI);
  if (from === 'arcmin') degValue = value / 60;
  if (from === 'arcsec') degValue = value / 3600;
  if (from === 'pi_rad') degValue = value * 180;
  // Now convert degValue to target
  if (to === 'deg') return degValue;
  if (to === 'rad') return degValue * (Math.PI / 180);
  if (to === 'arcmin') return degValue * 60;
  if (to === 'arcsec') return degValue * 3600;
  if (to === 'pi_rad') return degValue / 180;
  return value;
}

function toBaseMeters(value: number, unit: string): number {
  // For rise/run conversion to meters
  const toMeters: Record<string, number> = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  };
  return value * (toMeters[unit] ?? 1);
}

function fromBaseMeters(value: number, unit: string): number {
  const toMeters: Record<string, number> = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  };
  return value / (toMeters[unit] ?? 1);
}

function angleToAllUnits(angleDeg: number) {
  return {
    deg: angleDeg,
    rad: angleDeg * (Math.PI / 180),
    arcmin: angleDeg * 60,
    arcsec: angleDeg * 3600,
    pi_rad: angleDeg / 180,
  }
}

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
  type = "text"
}: any) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={info}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>
        </span>
      )}
    </div>
    <div className="flex">
      <input
        type={type}
        className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
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
        </div>
      )}
    </div>
  </div>
)

const Page = () => {
  const [vertical, setVertical] = useState('');
  const [verticalUnit, setVerticalUnit] = useState('m');
  const [horizontal, setHorizontal] = useState('');
  const [horizontalUnit, setHorizontalUnit] = useState('m');
  const [grade, setGrade] = useState('');
  const [gradePercent, setGradePercent] = useState('');
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState('deg');

  // --- Calculation logic ---
  // Convert all to base units for calculation
  const verticalNum = parseFloat(vertical);
  const horizontalNum = parseFloat(horizontal);
  const gradeNum = parseFloat(grade);
  const gradePercentNum = parseFloat(gradePercent);
  const angleNum = parseFloat(angle);

  // Determine which field was last changed (for bidirectional calculation)
  // We'll use a simple state for last changed: 'rise', 'run', 'grade', 'percent', 'angle'
  const [lastChanged, setLastChanged] = useState<'rise'|'run'|'grade'|'percent'|'angle'|null>(null);

  // Handle input changes and set lastChanged
  const handleVerticalChange = (v: string) => { setVertical(v); setLastChanged('rise'); };
  const handleHorizontalChange = (v: string) => { setHorizontal(v); setLastChanged('run'); };
  const handleGradeChange = (v: string) => { setGrade(v); setLastChanged('grade'); };
  const handleGradePercentChange = (v: string) => { setGradePercent(v); setLastChanged('percent'); };
  const handleAngleChange = (v: string) => { setAngle(v); setLastChanged('angle'); };

  // Handle unit changes for rise/run/angle
  const handleVerticalUnitChange = (newUnit: string) => {
    if (vertical) {
      const converted = convertRise(Number(vertical), verticalUnit, newUnit);
      setVertical(String(Number(converted.toFixed(6))));
    }
    setVerticalUnit(newUnit);
  };
  const handleHorizontalUnitChange = (newUnit: string) => {
    if (horizontal) {
      const converted = convertRun(Number(horizontal), horizontalUnit, newUnit);
      setHorizontal(String(Number(converted.toFixed(6))));
    }
    setHorizontalUnit(newUnit);
  };
  const handleAngleUnitChange = (newUnit: string) => {
    if (angle) {
      const converted = convertAngle(Number(angle), angleUnit, newUnit);
      setAngle(String(Number(converted.toFixed(6))));
    }
    setAngleUnit(newUnit);
  };

  // --- Bidirectional calculation logic ---
  // Only update dependent fields, not the one that was just changed
  React.useEffect(() => {
    // All calculations in meters and degrees
    let riseM = toBaseMeters(parseFloat(vertical) || 0, verticalUnit);
    let runM = toBaseMeters(parseFloat(horizontal) || 0, horizontalUnit);
    let g = gradeNum;
    let gp = gradePercentNum;
    let aDeg = angleNum;
    let calculated = false;

    if (lastChanged === 'rise' || lastChanged === 'run') {
      if (riseM && runM) {
        g = riseM / runM;
        gp = g * 100;
        aDeg = Math.atan(g) * (180 / Math.PI);
        setGrade(g ? String(Number(g.toFixed(6))) : '');
        setGradePercent(gp ? String(Number(gp.toFixed(6))) : '');
        setAngle(aDeg ? String(Number(angleToAllUnits(aDeg)[angleUnit].toFixed(6))) : '');
        calculated = true;
      }
    } else if (lastChanged === 'grade') {
      g = gradeNum;
      gp = g * 100;
      aDeg = Math.atan(g) * (180 / Math.PI);
      setGradePercent(gp ? String(Number(gp.toFixed(6))) : '');
      setAngle(aDeg ? String(Number(angleToAllUnits(aDeg)[angleUnit].toFixed(6))) : '');
      // If run is set, update rise; if rise is set, update run
      if (runM) {
        riseM = g * runM;
        setVertical(riseM ? String(Number(fromBaseMeters(riseM, verticalUnit).toFixed(6))) : '');
      } else if (riseM) {
        runM = riseM / g;
        setHorizontal(runM ? String(Number(fromBaseMeters(runM, horizontalUnit).toFixed(6))) : '');
      }
      calculated = true;
    } else if (lastChanged === 'percent') {
      gp = gradePercentNum;
      g = gp / 100;
      aDeg = Math.atan(g) * (180 / Math.PI);
      setGrade(g ? String(Number(g.toFixed(6))) : '');
      setAngle(aDeg ? String(Number(angleToAllUnits(aDeg)[angleUnit].toFixed(6))) : '');
      // If run is set, update rise; if rise is set, update run
      if (runM) {
        riseM = g * runM;
        setVertical(riseM ? String(Number(fromBaseMeters(riseM, verticalUnit).toFixed(6))) : '');
      } else if (riseM) {
        runM = riseM / g;
        setHorizontal(runM ? String(Number(fromBaseMeters(runM, horizontalUnit).toFixed(6))) : '');
      }
      calculated = true;
    } else if (lastChanged === 'angle') {
      // Convert angle to degrees for calculation
      let angleDeg = angleNum;
      if (angleUnit !== 'deg') {
        angleDeg = convertAngle(angleNum, angleUnit, 'deg');
      }
      g = Math.tan(angleDeg * (Math.PI / 180));
      gp = g * 100;
      setGrade(g ? String(Number(g.toFixed(6))) : '');
      setGradePercent(gp ? String(Number(gp.toFixed(6))) : '');
      // If run is set, update rise; if rise is set, update run
      if (runM) {
        riseM = g * runM;
        setVertical(riseM ? String(Number(fromBaseMeters(riseM, verticalUnit).toFixed(6))) : '');
      } else if (riseM) {
        runM = riseM / g;
        setHorizontal(runM ? String(Number(fromBaseMeters(runM, horizontalUnit).toFixed(6))) : '');
      }
      calculated = true;
    }
    // If clear, reset all
    if (!vertical && !horizontal && !grade && !gradePercent && !angle) {
      setLastChanged(null);
    }
    // If nothing calculated and both rise/run are set, update all
    if (!calculated && riseM && runM) {
      g = riseM / runM;
      gp = g * 100;
      aDeg = Math.atan(g) * (180 / Math.PI);
      setGrade(g ? String(Number(g.toFixed(6))) : '');
      setGradePercent(gp ? String(Number(gp.toFixed(6))) : '');
      setAngle(aDeg ? String(Number(angleToAllUnits(aDeg)[angleUnit].toFixed(6))) : '');
    }
    // eslint-disable-next-line
  }, [vertical, verticalUnit, horizontal, horizontalUnit, grade, gradePercent, angle, angleUnit, lastChanged]);

  const handleClear = () => {
    setVertical('');
    setVerticalUnit('m');
    setHorizontal('');
    setHorizontalUnit('m');
    setGrade('');
    setGradePercent('');
    setAngle('');
    setAngleUnit('deg');
    setLastChanged(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">Elevation Grade Calculator</h1>
        <div className="bg-white rounded-xl shadow p-5 border">
          <div className="mb-4">
            <Image
              src="/alevation.png"
              alt="Elevation diagram"
              width={400}
              height={160}
              className="rounded-lg w-full object-cover"
              style={{ maxHeight: 160, objectFit: 'contain' }}
            />
          </div>
          <InputRow
            label='Vertical distance ("rise")'
            value={vertical}
            onValueChange={handleVerticalChange}
            unit={verticalUnit}
            unitOptions={runRiseUnitOptions}
            onUnitChange={handleVerticalUnitChange}
            info='The vertical height'
          />
          <InputRow
            label='Horizontal distance ("run")'
            value={horizontal}
            onValueChange={handleHorizontalChange}
            unit={horizontalUnit}
            unitOptions={runRiseUnitOptions}
            onUnitChange={handleHorizontalUnitChange}
            info='The horizontal length'
          />
          <InputRow
            label="Grade"
            value={grade}
            onValueChange={handleGradeChange}
            unit={undefined}
            unitOptions={undefined}
            info="Rise / Run"
          />
          <InputRow
            label="Grade in percentage"
            value={gradePercent}
            onValueChange={handleGradePercentChange}
            unit="%"
            unitOptions={percentageUnitOptions}
            onUnitChange={() => {}}
            info="(Rise / Run) × 100"
          />
          <InputRow
            label="Angle of elevation"
            value={angle}
            onValueChange={handleAngleChange}
            unit={angleUnit}
            unitOptions={angleUnitOptions}
            onUnitChange={handleAngleUnitChange}
            info="arctan(Rise / Run)"
          />
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
    </div>
  )
}

export default Page
