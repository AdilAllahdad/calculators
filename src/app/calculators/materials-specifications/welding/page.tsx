'use client'
import React, { useState } from 'react'

const weldTypes = [
  { label: 'Transverse weld (single)', value: 'transverse_single' },
  { label: 'Transverse weld (double)', value: 'transverse_double' },
  { label: 'Parallel weld', value: 'parallel' },
  { label: 'Combined weld', value: 'combined' },
  { label: 'Single butt weld', value: 'single_butt' },
  { label: 'Double butt weld', value: 'double_butt' }
]

const lengthUnitDropdown = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" }
];

const unitOptions = {
  tensile: [
  { label: "pascals (Pa)", value: "Pa" },
  { label: "pounds per square inch (psi)", value: "psi" },
  { label: "kilopascals (kPa)", value: "kPa" },
  { label: "megapascals (MPa)", value: "MPa" },
  { label: "gigapascals (GPa)", value: "GPa" }
  ],
  strength: [
  { label: "newtons (N)", value: "N" },
  { label: "kilonewtons (kN)", value: "kN" },
  { label: "giganewtons (GN)", value: "GN" },
  { label: "pounds-force (lbf)", value: "lbf" }
  ]
}

type WeldFields = {
  weldType: string
  length: string
  lengthUnit: string
  size: string
  sizeUnit: string
  tensile: string
  tensileUnit: string
  strength: string
  strengthUnit: string
}

const initialState: WeldFields = {
  weldType: 'transverse_single',
  length: '',
  lengthUnit: 'mm',
  size: '',
  sizeUnit: 'mm',
  tensile: '',
  tensileUnit: 'MPa',
  strength: '',
  strengthUnit: 'N'
}

type CombinedWeldFields = WeldFields & {
  lengthTransverse?: string
  lengthTransverseUnit?: string
  lengthParallel?: string
  lengthParallelUnit?: string
  shear?: string
  shearUnit?: string
  totalLength?: string
  totalLengthUnit?: string
}

const initialCombinedState: CombinedWeldFields = {
  ...initialState,
  lengthTransverse: '',
  lengthTransverseUnit: 'mm',
  lengthParallel: '',
  lengthParallelUnit: 'mm',
  shear: '',
  shearUnit: 'MPa',
  totalLength: '',
  totalLengthUnit: 'mm'
}

// --- Calculation helpers for each weld type ---
function calcTransverseSingle(length: number, size: number, tensile: number) {
  // P = 0.707 * s * σt * l
  return 0.707 * size * tensile * length;
}
function calcTransverseDouble(length: number, size: number, tensile: number) {
  // P = 2 * 0.707 * s * σt * l
  return 2 * 0.707 * size * tensile * length;
}
// Fix: For parallel weld, correct formula is P = 0.5 * s * τ * l
function calcParallel(length: number, size: number, shear: number) {
  // P = 0.5 * s * τ * l
  return 0.5 * size * shear * length;
}
function calcCombined(
  l1: number, l2: number, size: number, tensile: number, shear: number
) {
  // P = 0.707 * s * σt * l1 + 2 * 0.707 * s * τ * l2
  return 0.707 * size * tensile * l1 + 2 * 0.707 * size * shear * l2;
}
function calcSingleButt(length: number, size: number, tensile: number) {
  // P = t * l * σt
  return size * length * tensile;
}
function calcDoubleButt(length: number, t1: number, t2: number, tensile: number) {
  // P = (t1 + t2) * l * σt
  return (t1 + t2) * length * tensile;
}

// --- Unit conversion helpers ---
const convertLength = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048,
  };
  const fromMeters: Record<string, number> = {
    mm: 1000,
    cm: 100,
    m: 1,
    in: 39.3700787,
    ft: 3.2808399,
  };
  if (!(from in toMeters) || !(to in fromMeters)) return value;
  const meters = num * toMeters[from];
  return (meters * fromMeters[to]).toString();
};

const convertForce = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const toN: Record<string, number> = {
    N: 1,
    kN: 1000,
    GN: 1e9,
    lbf: 4.44822162,
  };
  const fromN: Record<string, number> = {
    N: 1,
    kN: 0.001,
    GN: 1e-9,
    lbf: 0.224808943,
  };
  if (!(from in toN) || !(to in fromN)) return value;
  const newtons = num * toN[from];
  return (newtons * fromN[to]).toString();
};

const convertStress = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const toPa: Record<string, number> = {
    Pa: 1,
    kPa: 1000,
    MPa: 1e6,
    GPa: 1e9,
    psi: 6894.75729,
  };
  const fromPa: Record<string, number> = {
    Pa: 1,
    kPa: 0.001,
    MPa: 1e-6,
    GPa: 1e-9,
    psi: 0.000145037738,
  };
  if (!(from in toPa) || !(to in fromPa)) return value;
  const pascals = num * toPa[from];
  return (pascals * fromPa[to]).toString();
};

const Page = () => {
  const [fields, setFields] = useState<CombinedWeldFields>(initialCombinedState)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // --- Validation helper ---
  const validateField = (key: keyof CombinedWeldFields, value: string) => {
    if (value === '' || value === undefined) return '';
    const num = parseFloat(value);
    if (['length', 'size', 'tensile', 'shear', 'lengthTransverse', 'lengthParallel', 'totalLength'].includes(key)) {
      if (isNaN(num) || num <= 0) {
        return 'Value must be greater than zero.';
      }
    }
    return '';
  };

  // --- Handlers for independent dropdown conversions ---
  const handleLengthUnitChange = (fieldValue: keyof CombinedWeldFields, fieldUnit: keyof CombinedWeldFields, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertLength(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };
  const handleSizeUnitChange = (fieldValue: keyof CombinedWeldFields, fieldUnit: keyof CombinedWeldFields, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertLength(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };
  const handleTensileUnitChange = (fieldValue: keyof CombinedWeldFields, fieldUnit: keyof CombinedWeldFields, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertStress(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };
  const handleStrengthUnitChange = (fieldValue: keyof CombinedWeldFields, fieldUnit: keyof CombinedWeldFields, newUnit: string) => {
    setFields(f => ({
      ...f,
      [fieldValue]: convertForce(String(f[fieldValue] ?? ''), String(f[fieldUnit] ?? ''), newUnit),
      [fieldUnit]: newUnit
    }));
  };

  const handleChange = (key: keyof CombinedWeldFields, value: string) => {
    setFields(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: validateField(key, value) }))
  }

  const handleClear = () => {
    setFields(initialCombinedState)
    setErrors({})
  }

  // Select image based on weld type
  let weldImage = '/welding1.png';
  if (fields.weldType === 'transverse_double') {
    weldImage = '/welding2.png';
  } else if (fields.weldType === 'parallel') {
    weldImage = '/welding3.png';
  } else if (fields.weldType === 'combined') {
    weldImage = '/welding4.png';
  } else if (fields.weldType === 'single_butt') {
    weldImage = '/welding5.png';
  } else if (fields.weldType === 'double_butt') {
    weldImage = '/welding6.png';
  }

  // --- Calculation logic for weld strength (P) ---
  let calculatedStrength = '';
  // Convert all inputs to SI units for calculation
  const lengthSI = parseFloat(convertLength(fields.length, fields.lengthUnit || 'mm', 'mm'));
  const sizeSI = parseFloat(convertLength(fields.size, fields.sizeUnit || 'mm', 'mm'));
  const tensileSI = parseFloat(convertStress(fields.tensile, fields.tensileUnit || 'MPa', 'MPa'));
  const shearSI = parseFloat(convertStress(fields.shear ?? '', fields.shearUnit || 'MPa', 'MPa'));
  const l1SI = parseFloat(convertLength(fields.lengthTransverse ?? '', fields.lengthTransverseUnit || 'mm', 'mm'));
  const l2SI = parseFloat(convertLength(fields.lengthParallel ?? '', fields.lengthParallelUnit || 'mm', 'mm'));
  const t1SI = parseFloat(convertLength(fields.size, fields.sizeUnit || 'mm', 'mm'));
  const t2SI = parseFloat(convertLength(fields.shear ?? '', fields.shearUnit || 'mm', 'mm'));

  // --- Calculate total weld length for combined weld ---
  let totalWeldLength = '';
  if (
    fields.weldType === 'combined' &&
    l1SI && l2SI
  ) {
    // L = l1 + l2 + 12.5 (in mm)
    const totalLengthMM = l1SI + l2SI + 12.5;
    // Convert to selected unit
    totalWeldLength = convertLength(String(totalLengthMM), 'mm', fields.totalLengthUnit || 'mm');
  }

  // Only auto-calculate for transverse_single, transverse_double, parallel, single_butt
  if (
    (fields.weldType === 'transverse_single' || fields.weldType === 'transverse_double') &&
    lengthSI && sizeSI && tensileSI
  ) {
    if (fields.weldType === 'transverse_single') {
      calculatedStrength = calcTransverseSingle(lengthSI, sizeSI, tensileSI).toFixed(2);
    } else if (fields.weldType === 'transverse_double') {
      calculatedStrength = calcTransverseDouble(lengthSI, sizeSI, tensileSI).toFixed(2);
    }
  } else if (
    fields.weldType === 'parallel' &&
    lengthSI && sizeSI && shearSI
  ) {
    calculatedStrength = calcParallel(lengthSI, sizeSI, shearSI).toFixed(2);
  } else if (
    fields.weldType === 'combined' &&
    l1SI && l2SI && sizeSI && tensileSI && shearSI
  ) {
    calculatedStrength = calcCombined(l1SI, l2SI, sizeSI, tensileSI, shearSI).toFixed(2);
  } else if (
    fields.weldType === 'single_butt' &&
    lengthSI && sizeSI && tensileSI
  ) {
    calculatedStrength = calcSingleButt(lengthSI, sizeSI, tensileSI).toFixed(2);
  } else if (fields.weldType === 'double_butt' && lengthSI && t1SI && t2SI && tensileSI) {
    calculatedStrength = calcDoubleButt(lengthSI, t1SI, t2SI, tensileSI).toFixed(2);
  }

  // Convert calculated strength to selected output unit
  let displayedStrength = calculatedStrength;
  if (calculatedStrength && fields.strengthUnit && fields.strengthUnit !== 'N') {
    displayedStrength = convertForce(calculatedStrength, 'N', fields.strengthUnit);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">Welding calculator</h1>
      <div className="w-full max-w-md">
        {/* Weld type */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col items-center">
              <img
                src={weldImage}
                alt="Weld type"
                className="w-58 h-40 object-contain mb-2"
                style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb' }}
              />
            </div>
          </div>
          <div className="mb-2 font-semibold">Weld type</div>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={fields.weldType}
            onChange={e => handleChange('weldType', e.target.value)}
          >
            {weldTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Weld properties */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="mb-4 font-semibold">Weld properties</div>
          {(fields.weldType === 'transverse_single' || fields.weldType === 'transverse_double') ? (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length of weld (l)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.length ? ' border-red-500' : ''}`}
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleLengthUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.length && (
                  <div className="text-xs text-red-600 mt-1">{errors.length}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Size of weld (s)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tensile Strength (σ<sub>t</sub>)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.tensile ? ' border-red-500' : ''}`}
                    value={fields.tensile}
                    onChange={e => handleChange('tensile', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.tensileUnit}
                    onChange={e => handleTensileUnitChange('tensile', 'tensileUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.tensile && (
                  <div className="text-xs text-red-600 mt-1">{errors.tensile}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={displayedStrength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : fields.weldType === 'parallel' ? (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length of weld (l)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.length ? ' border-red-500' : ''}`}
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleLengthUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.length && (
                  <div className="text-xs text-red-600 mt-1">{errors.length}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Size of weld (s)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Shear strength (τ)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.shear ? ' border-red-500' : ''}`}
                    value={fields.shear || ''}
                    onChange={e => handleChange('shear', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.shearUnit}
                    onChange={e => handleTensileUnitChange('shear', 'shearUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.shear && (
                  <div className="text-xs text-red-600 mt-1">{errors.shear}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={displayedStrength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : fields.weldType === 'combined' ? (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Length of transverse weld (l<sub>1</sub>)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.lengthTransverse ? ' border-red-500' : ''}`}
                    value={fields.lengthTransverse || ''}
                    onChange={e => handleChange('lengthTransverse', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthTransverseUnit}
                    onChange={e => handleLengthUnitChange('lengthTransverse', 'lengthTransverseUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.lengthTransverse && (
                  <div className="text-xs text-red-600 mt-1">{errors.lengthTransverse}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Length of parallel weld (l<sub>2</sub>)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.lengthParallel ? ' border-red-500' : ''}`}
                    value={fields.lengthParallel || ''}
                    onChange={e => handleChange('lengthParallel', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthParallelUnit}
                    onChange={e => handleLengthUnitChange('lengthParallel', 'lengthParallelUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.lengthParallel && (
                  <div className="text-xs text-red-600 mt-1">{errors.lengthParallel}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Size of weld (s)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tensile Strength (σ<sub>t</sub>)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.tensile ? ' border-red-500' : ''}`}
                    value={fields.tensile}
                    onChange={e => handleChange('tensile', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.tensileUnit}
                    onChange={e => handleTensileUnitChange('tensile', 'tensileUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.tensile && (
                  <div className="text-xs text-red-600 mt-1">{errors.tensile}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Shear strength (τ)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.shear ? ' border-red-500' : ''}`}
                    value={fields.shear || ''}
                    onChange={e => handleChange('shear', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.shearUnit}
                    onChange={e => handleTensileUnitChange('shear', 'shearUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.shear && (
                  <div className="text-xs text-red-600 mt-1">{errors.shear}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={displayedStrength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Total weld length (L)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={totalWeldLength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.totalLengthUnit}
                    onChange={e => handleLengthUnitChange('totalLength', 'totalLengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : fields.weldType === 'single_butt' ? (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length of weld (l)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.length ? ' border-red-500' : ''}`}
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleLengthUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.length && (
                  <div className="text-xs text-red-600 mt-1">{errors.length}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Throat thickness (t)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tensile Strength (σ<sub>t</sub>)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.tensile ? ' border-red-500' : ''}`}
                    value={fields.tensile}
                    onChange={e => handleChange('tensile', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.tensileUnit}
                    onChange={e => handleTensileUnitChange('tensile', 'tensileUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.tensile && (
                  <div className="text-xs text-red-600 mt-1">{errors.tensile}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={displayedStrength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : fields.weldType === 'double_butt' ? (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length of weld (l)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.length ? ' border-red-500' : ''}`}
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleLengthUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.length && (
                  <div className="text-xs text-red-600 mt-1">{errors.length}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Throat thickness (t₁)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Throat thickness (t₂)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.shear ? ' border-red-500' : ''}`}
                    value={fields.shear || ''}
                    onChange={e => handleChange('shear', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.shearUnit}
                    onChange={e => handleSizeUnitChange('shear', 'shearUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.shear && (
                  <div className="text-xs text-red-600 mt-1">{errors.shear}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tensile Strength (σ<sub>t</sub>)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.tensile ? ' border-red-500' : ''}`}
                    value={fields.tensile}
                    onChange={e => handleChange('tensile', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.tensileUnit}
                    onChange={e => handleTensileUnitChange('tensile', 'tensileUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.tensile && (
                  <div className="text-xs text-red-600 mt-1">{errors.tensile}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={displayedStrength}
                    readOnly
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Length of weld (l)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.length ? ' border-red-500' : ''}`}
                    value={fields.length}
                    onChange={e => handleChange('length', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.lengthUnit}
                    onChange={e => handleLengthUnitChange('length', 'lengthUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.length && (
                  <div className="text-xs text-red-600 mt-1">{errors.length}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Size of weld (s)</label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.size ? ' border-red-500' : ''}`}
                    value={fields.size}
                    onChange={e => handleChange('size', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.sizeUnit}
                    onChange={e => handleSizeUnitChange('size', 'sizeUnit', e.target.value)}
                  >
                    {lengthUnitDropdown.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {errors.size && (
                  <div className="text-xs text-red-600 mt-1">{errors.size}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {fields.weldType === 'parallel'
                    ? <>Shear strength (τ)</>
                    : <>Tensile Strength (σ<sub>t</sub>)</>
                  }
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm${errors.tensile ? ' border-red-500' : ''}`}
                    value={fields.tensile}
                    onChange={e => handleChange('tensile', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.tensileUnit}
                    onChange={e => handleTensileUnitChange('tensile', 'tensileUnit', e.target.value)}
                  >
                    {unitOptions.tensile.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weld strength (P)</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm"
                    value={fields.strength}
                    onChange={e => handleChange('strength', e.target.value)}
                  />
                  <select
                    className="w-24 border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white"
                    value={fields.strengthUnit}
                    onChange={e => handleStrengthUnitChange('strength', 'strengthUnit', e.target.value)}
                  >
                    {unitOptions.strength.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
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
