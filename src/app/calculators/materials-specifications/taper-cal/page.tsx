'use client'
import React, { useState, useEffect } from 'react'

const sectionClass =
  "bg-white rounded-xl shadow p-6 mb-4 border border-gray-100";
const labelClass =
  "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono";
const selectClass =
  "ml-2 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono text-blue-600 min-w-[60px]";
const rowClass = "mb-4";
const rowFlexClass = "flex items-center gap-2";

const diameterUnits = [
  { label: "mm", value: "mm" },
  { label: "cm", value: "cm" },
  { label: "m", value: "m" },
  { label: "in", value: "in" },
  { label: "ft", value: "ft" }
];
const lengthUnits = [
  { label: "mm", value: "mm" },
  { label: "cm", value: "cm" },
  { label: "m", value: "m" },
  { label: "in", value: "in" },
  { label: "ft", value: "ft" }
];
const angleUnits = [
  { label: "deg", value: "deg" },
  { label: "rad", value: "rad" },
  { label: "gon", value: "gon" }
];
const taperNumeratorUnits = [
  { label: "millimeter (mm)", value: "mm" },
  { label: "centimeter (cm)", value: "cm" },
  { label: "meter (m)", value: "m" },
  { label: "kilometer (km)", value: "km" },
  { label: "inch (in)", value: "in" },
  { label: "foot (ft)", value: "ft" },
  { label: "yard (yd)", value: "yd" },
  { label: "mile (mi)", value: "mi" },
  { label: "nautical mile (nmi)", value: "nmi" }
];
const taperDenominatorUnits = [
  { label: "millimeter (mm)", value: "mm" },
  { label: "centimeter (cm)", value: "cm" },
  { label: "meter (m)", value: "m" },
  { label: "kilometer (km)", value: "km" },
  { label: "inch (in)", value: "in" },
  { label: "foot (ft)", value: "ft" },
  { label: "yard (yd)", value: "yd" },
  { label: "mile (mi)", value: "mi" },
  { label: "nautical mile (nmi)", value: "nmi" }
];

const convertLength = (value: number, from: string, to: string) => {
  if (isNaN(value)) return '';
  let mm = value;
  switch (from) {
    case 'mm': mm = value; break;
    case 'cm': mm = value * 10; break;
    case 'm': mm = value * 1000; break;
    case 'km': mm = value * 1_000_000; break;
    case 'in': mm = value * 25.4; break;
    case 'ft': mm = value * 304.8; break;
    case 'yd': mm = value * 914.4; break;
    case 'mi': mm = value * 1_609_344; break;
    case 'nmi': mm = value * 1_852_000; break;
    default: mm = value;
  }
  switch (to) {
    case 'mm': return mm;
    case 'cm': return mm / 10;
    case 'm': return mm / 1000;
    case 'km': return mm / 1_000_000;
    case 'in': return mm / 25.4;
    case 'ft': return mm / 304.8;
    case 'yd': return mm / 914.4;
    case 'mi': return mm / 1_609_344;
    case 'nmi': return mm / 1_852_000;
    default: return mm;
  }
};

const convertAngle = (value: number, from: string, to: string) => {
  if (isNaN(value)) return '';
  let deg = value;
  switch (from) {
    case 'deg': deg = value; break;
    case 'rad': deg = value * (180 / Math.PI); break;
    case 'gon': deg = value * 0.9; break;
    default: deg = value;
  }
  switch (to) {
    case 'deg': return deg;
    case 'rad': return deg * (Math.PI / 180);
    case 'gon': return deg / 0.9;
    default: return deg;
  }
};

const parseTaper = (taper: string) => {
  const [num, den] = taper.split('/');
  return [num ? num.trim() : '', den ? den.trim() : ''];
};

const convertTaperNumerator = (taper: string, fromUnit: string, toUnit: string) => {
  const [num, den] = parseTaper(taper);
  if (!num) return taper;
  const convertedNum = convertLength(Number(num), fromUnit, toUnit);
  return (convertedNum === '' ? '' : String(Number(convertedNum.toFixed(6)))) + (den !== '' ? '/' + den : '');
};

const convertTaperDenominator = (taper: string, fromUnit: string, toUnit: string) => {
  const [num, den] = parseTaper(taper);
  if (!den || isNaN(Number(den))) return taper;
  const convertedDen = convertLength(Number(den), fromUnit, toUnit);
  return (num !== '' ? num : '') + (convertedDen === '' ? '' : '/' + String(Number(convertedDen.toFixed(6))));
};

const Page = () => {
  const [d1, setD1] = useState('');
  const [d1Unit, setD1Unit] = useState('ft');
  const [d2, setD2] = useState('');
  const [d2Unit, setD2Unit] = useState('m');
  const [l, setL] = useState('');
  const [lUnit, setLUnit] = useState('m');
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState('gon');
  const [taper, setTaper] = useState('');
  const [taperNumUnit, setTaperNumUnit] = useState('mm');
  const [taperDenUnit, setTaperDenUnit] = useState('mm');

  // Calculated fields
  const [calcTaper, setCalcTaper] = useState('');
  const [calcAngle, setCalcAngle] = useState('');
  const [calcLength, setCalcLength] = useState('');
  // Add state for calculated taper value (as a number)
  const [calcTaperValue, setCalcTaperValue] = useState('');

  // Handlers for unit change with conversion
  const handleD1UnitChange = (newUnit: string) => {
    if (d1 !== '') {
      const converted = convertLength(Number(d1), d1Unit, newUnit);
      setD1(converted === '' ? '' : String(Number(converted.toFixed(6))));
    }
    setD1Unit(newUnit);
  };
  const handleD2UnitChange = (newUnit: string) => {
    if (d2 !== '') {
      const converted = convertLength(Number(d2), d2Unit, newUnit);
      setD2(converted === '' ? '' : String(Number(converted.toFixed(6))));
    }
    setD2Unit(newUnit);
  };
  const handleLUnitChange = (newUnit: string) => {
    if (l !== '') {
      const converted = convertLength(Number(l), lUnit, newUnit);
      setL(converted === '' ? '' : String(Number(converted.toFixed(6))));
    }
    setLUnit(newUnit);
  };
  const handleAngleUnitChange = (newUnit: string) => {
    if (angle !== '') {
      const converted = convertAngle(Number(angle), angleUnit, newUnit);
      setAngle(converted === '' ? '' : String(Number(converted.toFixed(6))));
    }
    setAngleUnit(newUnit);
  };

  const handleTaperNumUnitChange = (newUnit: string) => {
    setTaper(prev => convertTaperNumerator(prev, taperNumUnit, newUnit));
    setTaperNumUnit(newUnit);
  };

  const handleTaperDenUnitChange = (newUnit: string) => {
    setTaper(prev => convertTaperDenominator(prev, taperDenUnit, newUnit));
    setTaperDenUnit(newUnit);
  };

  // Calculation logic
  useEffect(() => {
    // Calculate Taper (T) and Angle (θ) if D1, D2, L are provided
    const d1Val = Number(d1);
    const d2Val = Number(d2);
    const lVal = Number(l);

    // Convert all to mm for calculation
    const d1_mm = convertLength(d1Val, d1Unit, 'mm');
    const d2_mm = convertLength(d2Val, d2Unit, 'mm');
    const l_mm = convertLength(lVal, lUnit, 'mm');

    if (
      d1 !== '' &&
      d2 !== '' &&
      l !== '' &&
      !isNaN(Number(d1_mm)) &&
      !isNaN(Number(d2_mm)) &&
      !isNaN(Number(l_mm)) &&
      Number(l_mm) !== 0
    ) {
      // Taper per mm (dimensionless)
      const taperPerMM = (Number(d1_mm) - Number(d2_mm)) / Number(l_mm);
      // Convert to selected units
      const taperNum = convertLength(Number(d1_mm) - Number(d2_mm), 'mm', taperNumUnit);
      const taperDen = convertLength(Number(l_mm), 'mm', taperDenUnit);
      setCalcTaper(
        (taperNum ? Number(taperNum).toFixed(6) : '') +
        '/' +
        (taperDen ? Number(taperDen).toFixed(6) : '')
      );
      // Set calculated taper value as a number (division)
      if (taperNum && taperDen && Number(taperDen) !== 0) {
        setCalcTaperValue((Number(taperNum) / Number(taperDen)).toFixed(6));
      } else {
        setCalcTaperValue('');
      }
      // Angle θ = atan((D1-D2)/L / 2)
      const thetaRad = Math.atan(taperPerMM / 2);
      const theta = convertAngle(thetaRad, 'rad', angleUnit);
      setCalcAngle(theta !== '' ? Number(theta).toFixed(6) : '');
    } else {
      setCalcTaper('');
      setCalcAngle('');
      setCalcTaperValue('');
    }

    // Calculate Length if D1, D2, and angle are provided
    if (
      d1 !== '' &&
      d2 !== '' &&
      angle !== '' &&
      !isNaN(Number(d1_mm)) &&
      !isNaN(Number(d2_mm)) &&
      !isNaN(Number(angle))
    ) {
      // θ in degrees
      const thetaDeg = convertAngle(Number(angle), angleUnit, 'deg');
      // Taper per mm = 2 * tan(θ)
      const taperPerMM = 2 * Math.tan(Number(thetaDeg) * Math.PI / 180);
      // L = (D1 - D2) / taperPerMM
      if (taperPerMM !== 0) {
        const l_mm_calc = (Number(d1_mm) - Number(d2_mm)) / taperPerMM;
        const l_conv = convertLength(l_mm_calc, 'mm', lUnit);
        setCalcLength(l_conv !== '' ? Number(l_conv).toFixed(6) : '');
      } else {
        setCalcLength('');
      }
    } else {
      setCalcLength('');
    }
  }, [
    d1, d1Unit, d2, d2Unit, l, lUnit, angle, angleUnit,
    taperNumUnit, taperDenUnit
  ]);

  // Show calculated angle in input if angle is blank and calcAngle exists
  const angleInputValue = angle === '' && calcAngle ? calcAngle : angle;

  // Show calculated taper division in input if taper is blank and calcTaperValue exists
  const taperInputValue = taper === '' && calcTaperValue ? calcTaperValue : taper;

  // Validation helpers
  const isNegative = (val: string) => val !== '' && !isNaN(Number(val)) && Number(val) < 0;
  const isZeroOrNegative = (val: string) => val !== '' && !isNaN(Number(val)) && Number(val) <= 0;
  const isEmptyOrInvalid = (val: string) => val === '' || isNaN(Number(val));

  // Major/minor diameter logic for validation
  const d1Num = Number(d1);
  const d2Num = Number(d2);

  const d1NotGreaterThanZero = isZeroOrNegative(d1);
  const d2NotGreaterThanZero = isZeroOrNegative(d2);
  const lNotGreaterThanZero = isZeroOrNegative(l);

  const d1NotGreaterThanD2 = !isEmptyOrInvalid(d1) && !isEmptyOrInvalid(d2) && d1Num <= d2Num;
  const d2NotLessThanD1 = !isEmptyOrInvalid(d1) && !isEmptyOrInvalid(d2) && d2Num >= d1Num;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f8fafd] py-8">
      <h1 className="text-2xl font-bold mb-8 text-center capitalize">taper calculator</h1>
      <div className="w-full max-w-md">
        <div className={sectionClass}>
          <img
            src="/Taper.png"
            alt="A labelled taper."
            className="mx-auto mb-2"
            style={{ maxHeight: 120 }}
          />
          <div className="text-xs text-gray-500 mb-6 text-center">A labelled taper.</div>
          {/* Major diameter */}
          <div className={rowClass}>
            <label className={labelClass}>Major diameter (D<sub>1</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (d1NotGreaterThanZero || d1NotGreaterThanD2 ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={d1}
                onChange={e => setD1(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <select
                className={selectClass}
                value={d1Unit}
                onChange={e => handleD1UnitChange(e.target.value)}
              >
                {diameterUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {d1NotGreaterThanZero && (
              <div className="text-red-500 text-xs mt-1">The larger diameter must be greater than zero.</div>
            )}
            {d1NotGreaterThanD2 && !d1NotGreaterThanZero && (
              <div className="text-red-500 text-xs mt-1">The larger diameter must be greater than the smaller diameter.</div>
            )}
          </div>
          {/* Minor diameter */}
          <div className={rowClass}>
            <label className={labelClass}>Minor diameter (D<sub>2</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (d2NotGreaterThanZero || d2NotLessThanD1 ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={d2}
                onChange={e => setD2(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <select
                className={selectClass}
                value={d2Unit}
                onChange={e => handleD2UnitChange(e.target.value)}
              >
                {diameterUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {d2NotGreaterThanZero && (
              <div className="text-red-500 text-xs mt-1">The smaller diameter must be greater than zero.</div>
            )}
            {d2NotLessThanD1 && !d2NotGreaterThanZero && (
              <div className="text-red-500 text-xs mt-1">The larger diameter must be greater than the smaller diameter.</div>
            )}
          </div>
          {/* Length of taper */}
          <div className={rowClass}>
            <label className={labelClass}>Length of taper (T<sub>l</sub>)</label>
            <div className={rowFlexClass}>
              <input
                className={
                  inputClass +
                  (lNotGreaterThanZero ? " border-red-500 ring-2 ring-red-200" : "")
                }
                value={l}
                onChange={e => setL(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter or leave blank to auto-calculate"
              />
              <select
                className={selectClass}
                value={lUnit}
                onChange={e => handleLUnitChange(e.target.value)}
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {lNotGreaterThanZero && (
              <div className="text-red-500 text-xs mt-1">The taper length must be greater than zero.</div>
            )}
            {calcLength && l === '' && (
              <div className="text-blue-600 text-xs mt-1">Calculated length: {calcLength} {lUnit}</div>
            )}
          </div>
          {/* Taper angle */}
          <div className={rowClass}>
            <label className={labelClass}>Taper angle (θ)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass}
                value={angleInputValue}
                onChange={e => setAngle(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter or leave blank to auto-calculate"
              />
              <select
                className={selectClass}
                value={angleUnit}
                onChange={e => handleAngleUnitChange(e.target.value)}
              >
                {angleUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Taper */}
          <div className={rowClass}>
            <label className={labelClass}>Taper (T)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass}
                value={taperInputValue}
                onChange={e => setTaper(e.target.value.replace(/[^0-9./]/g, ''))}
                placeholder="e.g. 1/10"
              />
              <select
                className={selectClass}
                value={taperNumUnit}
                onChange={e => handleTaperNumUnitChange(e.target.value)}
              >
                {taperNumeratorUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <span className="mx-1 text-gray-500 font-bold">/</span>
              <select
                className={selectClass}
                value={taperDenUnit}
                onChange={e => handleTaperDenUnitChange(e.target.value)}
              >
                {taperDenominatorUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Clear button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              onClick={() => {
                setD1('');
                setD2('');
                setL('');
                setAngle('');
                setTaper('');
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

export default Page
