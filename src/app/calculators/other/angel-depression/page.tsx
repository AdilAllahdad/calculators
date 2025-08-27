'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const unitOptions = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" },
  { label: "nautical miles (nmi)", value: "nmi" }
]

const angleUnitOptions = [
  { label: 'degrees (deg)', value: 'deg' },
  { label: 'radians (rad)', value: 'rad' },
  { label: 'minutes of arc (arcmin)', value: 'arcmin' },
  { label: 'seconds of arc (arcsec)', value: 'arcsec' },
  { label: 'π radians (× π rad)', value: 'pi_rad' }
]

// --- Unit Conversion Functions ---
function convertVertical(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nmi: 1852
  };
  if (!(from in toMeters) || !(to in toMeters)) return value;
  const meters = value * toMeters[from];
  return meters / toMeters[to];
}
function convertHorizontal(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nmi: 1852
  };
  if (!(from in toMeters) || !(to in toMeters)) return value;
  const meters = value * toMeters[from];
  return meters / toMeters[to];
}
function convertAngle(value: number, from: string, to: string): number {
  if (from === to) return value;
  let degValue = value;
  if (from === 'rad') degValue = value * (180 / Math.PI);
  if (from === 'arcmin') degValue = value / 60;
  if (from === 'arcsec') degValue = value / 3600;
  if (from === 'pi_rad') degValue = value * 180;
  if (to === 'deg') return degValue;
  if (to === 'rad') return degValue * (Math.PI / 180);
  if (to === 'arcmin') return degValue * 60;
  if (to === 'arcsec') return degValue * 3600;
  if (to === 'pi_rad') return degValue / 180;
  return value;
}

// --- InputRow with validation/error ---
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
        className={`flex-1 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-200 bg-red-50 text-red-700' : 'focus:ring-blue-100'} ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
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
    {error && (
      <div className="text-xs text-red-600 mt-1">{error}</div>
    )}
  </div>
)

const Page = () => {
  const [vertical, setVertical] = useState('');
  const [verticalUnit, setVerticalUnit] = useState('m');
  const [horizontal, setHorizontal] = useState('');
  const [horizontalUnit, setHorizontalUnit] = useState('m');
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState('deg');

  // Validation states
  const [verticalError, setVerticalError] = useState('');
  const [horizontalError, setHorizontalError] = useState('');
  const [angleError, setAngleError] = useState('');

  // Track last changed field for bidirectional calculation
  const [lastChanged, setLastChanged] = useState<'vertical'|'horizontal'|'angle'|null>(null);

  // Handle unit changes
  const handleVerticalUnitChange = (newUnit: string) => {
    if (vertical) {
      const converted = convertVertical(Number(vertical), verticalUnit, newUnit);
      setVertical(String(Number(converted.toFixed(6))));
    }
    setVerticalUnit(newUnit);
  };
  const handleHorizontalUnitChange = (newUnit: string) => {
    if (horizontal) {
      const converted = convertHorizontal(Number(horizontal), horizontalUnit, newUnit);
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

  // Handle input changes and set lastChanged
  const handleVerticalChange = (v: string) => { setVertical(v); setLastChanged('vertical'); };
  const handleHorizontalChange = (v: string) => { setHorizontal(v); setLastChanged('horizontal'); };
  const handleAngleChange = (v: string) => { setAngle(v); setLastChanged('angle'); };

  // --- Calculation and Validation Logic ---
  useEffect(() => {
    setVerticalError('');
    setHorizontalError('');
    setAngleError('');

    const v = parseFloat(vertical);
    const h = parseFloat(horizontal);
    const a = parseFloat(angle);

    // Validation
    if (vertical && (isNaN(v) || v <= 0)) {
      setVerticalError('Please enter a positive value for the vertical distance.');
    }
    if (horizontal && (isNaN(h) || h <= 0)) {
      setHorizontalError('Please enter a positive value for the horizontal distance.');
    }
   

    // Calculation logic
    // Convert to meters for calculation
    const vM = v > 0 ? convertVertical(v, verticalUnit, 'm') : undefined;
    const hM = h > 0 ? convertHorizontal(h, horizontalUnit, 'm') : undefined;
    let aDeg: number | undefined = undefined;
    if (a >= 0 && a <= 90) {
      aDeg = angleUnit === 'deg' ? a
        : angleUnit === 'rad' ? a * (180 / Math.PI)
        : angleUnit === 'arcmin' ? a / 60
        : angleUnit === 'arcsec' ? a / 3600
        : angleUnit === 'pi_rad' ? a * 180
        : a;
    }

    // Bidirectional calculation
    if (lastChanged === 'vertical' || lastChanged === 'horizontal') {
      if (vM && hM) {
        const angleDeg = Math.atan(vM / hM) * (180 / Math.PI);
        const angleVal = convertAngle(angleDeg, 'deg', angleUnit);
        setAngle(angleVal ? String(Number(angleVal.toFixed(6))) : '');
      }
    } else if (lastChanged === 'angle') {
      if (aDeg !== undefined && aDeg > 0 && aDeg < 90) {
        // If horizontal is set, update vertical; else if vertical is set, update horizontal
        if (hM) {
          const vMcalc = Math.tan(aDeg * Math.PI / 180) * hM;
          setVertical(vMcalc ? String(Number(convertVertical(vMcalc, 'm', verticalUnit).toFixed(6))) : '');
        } else if (vM) {
          const hMcalc = vM / Math.tan(aDeg * Math.PI / 180);
          setHorizontal(hMcalc ? String(Number(convertHorizontal(hMcalc, 'm', horizontalUnit).toFixed(6))) : '');
        }
      }
    }
    // eslint-disable-next-line
  }, [vertical, verticalUnit, horizontal, horizontalUnit, angle, angleUnit, lastChanged]);

  const handleClear = () => {
    setVertical('');
    setVerticalUnit('m');
    setHorizontal('');
    setHorizontalUnit('m');
    setAngle('');
    setAngleUnit('deg');
    setVerticalError('');
    setHorizontalError('');
    setAngleError('');
    setLastChanged(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">Angle of Depression Calculator</h1>
        <div className="bg-white rounded-xl shadow p-5 border">
          <div className="mb-4">
            <Image
              src="/angelDepression.png"
              alt="Angle of depression diagram"
              width={400}
              height={160}
              className="rounded-lg w-full object-cover"
              style={{ maxHeight: 160, objectFit: 'contain' }}
            />
          </div>
          <InputRow
            label='Vertical distance'
            value={vertical}
            onValueChange={handleVerticalChange}
            unit={verticalUnit}
            unitOptions={unitOptions}
            onUnitChange={handleVerticalUnitChange}
            info='The vertical distance'
            error={verticalError}
          />
          <InputRow
            label='Horizontal distance'
            value={horizontal}
            onValueChange={handleHorizontalChange}
            unit={horizontalUnit}
            unitOptions={unitOptions}
            onUnitChange={handleHorizontalUnitChange}
            info='The horizontal distance'
            error={horizontalError}
          />
          <InputRow
            label="Angle of depression"
            value={angle}
            onValueChange={handleAngleChange}
            unit={angleUnit}
            unitOptions={angleUnitOptions}
            onUnitChange={handleAngleUnitChange}
            info="arctan(vertical/horizontal)"
            error={angleError}
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
