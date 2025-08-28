'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import Image from "next/image"


const unitOptions = {
  length: [
    { label: 'millimeters (mm)', value: 'mm' },
    { label: 'centimeters (cm)', value: 'cm' },
    { label: 'meters (m)', value: 'm' },
    { label: 'inches (in)', value: 'in' },
    { label: 'feet (ft)', value: 'ft' },
  ],
  angle: [
    { label: 'degrees (deg)', value: 'deg' },
    { label: 'radians (rad)', value: 'rad' }
  ],
  area: [
    { label: 'square millimeters (mm²)', value: 'mm2' },
    { label: 'square centimeters (cm²)', value: 'cm2' },
    { label: 'square meters (m²)', value: 'm2' },
    { label: 'square inches (in²)', value: 'in2' },
    { label: 'square feet (ft²)', value: 'ft2' }
  ],
  volume: [
    { label: 'cubic centimeters (cm³)', value: 'cm3' },
    { label: 'cubic meters (m³)', value: 'm3' },
    { label: 'cubic feet (ft³)', value: 'ft3' },
    { label: 'liters (L)', value: 'l' }
  ],
  percent: [
    { label: '%', value: '%' }
  ]
}

const concreteVolumeUnitOptions = [
  { label: "cubic millimeters (mm³)", value: "mm³" },
  { label: "cubic centimeters (cm³)", value: "cm³" },
  { label: "cubic meters (m³)", value: "m³" },
  { label: "cubic inches (cu in)", value: "cu in" },
  { label: "cubic feet (cu ft)", value: "cu ft" },
  { label: "cubic yards (cu yd)", value: "cu yd" }
]

const InputRow = ({
  label,
  value,
  onValueChange,
  unit,
  unitOptions,
  onUnitChange,
  placeholder,
  info,
  type = "text",
  disabled = false
}: {
  label: string,
  value: string,
  onValueChange: (v: string) => void,
  unit: string,
  unitOptions?: { label: string; value: string }[],
  onUnitChange?: (v: string) => void,
  placeholder?: string,
  info?: boolean,
  type?: string,
  disabled?: boolean
}) => (
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={info === true ? '' : String(info)}>
          <Info size={16} />
        </span>
      )}
    </div>
    <div className="flex">
      <input
        type={type}
        className={`flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
        placeholder={placeholder || "0"}
        disabled={disabled}
        value={value}
        onChange={e => onValueChange && onValueChange(e.target.value)}
        style={{ minWidth: 0 }}
      />
      {unitOptions && (
        <div className="relative w-28">
          <select
            className={`w-full border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white focus:outline-none truncate ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
            disabled={disabled}
            value={unit}
            onChange={e => onUnitChange && onUnitChange(e.target.value)}
            style={{ maxWidth: '100%' }}
          >
            {unitOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
          <span className="absolute right-2 top-2 text-gray-400 pointer-events-none">
            <ChevronDown size={14} />
          </span>
        </div>
      )}
    </div>
  </div>
)

const CheckboxRow = ({
  label,
  checked,
  onChange,
  info
}: {
  label: string,
  checked: boolean,
  onChange: (v: boolean) => void,
  info?: boolean
}) => (
  <div className="flex items-center mb-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange && onChange(e.target.checked)}
      className="mr-2 accent-blue-600"
    />
    <span className="text-sm text-gray-700">{label}</span>
    {info && (
      <span className="ml-1 text-gray-400 cursor-pointer" title={info === true ? '' : String(info)}>
        <Info size={16} />
      </span>
    )}
  </div>
)

const initialState = {
  steps: '0',
  stepsUnit: 'steps',
  treadRun: '0',
  treadRunUnit: 'cm',
  riserRise: '0',
  riserRiseUnit: 'cm',
  useGrid: false,
  throatDepth: '0',
  throatDepthUnit: 'cm',
  stairWidth: '0',
  stairWidthUnit: 'cm',
  concreteVolume: '0',
  concreteVolumeUnit: 'mm³',
  wastage: '5',
  wastageUnit: '%',
  concreteToPurchase: '0',
  concreteToPurchaseUnit: 'm3',
  stairPitch: '0',
  stairPitchUnit: 'deg',
  totalRise: '0',
  totalRiseUnit: 'cm',
  totalRun: '0',
  totalRunUnit: 'cm',
  totalCarriageLength: '0',
  totalCarriageLengthUnit: 'cm',
  endAreaTriangle: '0',
  endAreaTriangleUnit: 'cm2',
  areaCarriagePortion: '0',
  areaCarriagePortionUnit: 'cm2',
  endAreaStep: '0',
  endAreaStepUnit: 'cm2',
  totalEndAreaSteps: '0',
  totalEndAreaStepsUnit: 'cm2',
  nosingDepth: '0',
  nosingDepthUnit: 'cm',
  riserAngle: '0',
  riserAngleUnit: 'deg'
}

// Unit conversion helpers
const toLengthMeters: Record<string, (v: number) => number> = {
  mm: v => v / 1000,
  cm: v => v / 100,
  m: v => v,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
}
const fromLengthMeters: Record<string, (v: number) => number> = {
  mm: v => v * 1000,
  cm: v => v * 100,
  m: v => v,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
}

const toAngleDeg: Record<string, (v: number) => number> = {
  deg: v => v,
  rad: v => v * (180 / Math.PI),
}
const fromAngleDeg: Record<string, (v: number) => number> = {
  deg: v => v,
  rad: v => v * (Math.PI / 180),
}

const toAreaM2: Record<string, (v: number) => number> = {
  mm2: v => v / 1000000,
  cm2: v => v / 10000,
  m2: v => v,
  in2: v => v * 0.00064516,
  ft2: v => v * 0.09290304,
}
const fromAreaM2: Record<string, (v: number) => number> = {
  mm2: v => v * 1000000,
  cm2: v => v * 10000,
  m2: v => v,
  in2: v => v / 0.00064516,
  ft2: v => v / 0.09290304,
}

const toVolumeM3: Record<string, (v: number) => number> = {
  "mm³": v => v / 1e9,
  "cm³": v => v / 1e6,
  "m³": v => v,
  "cu in": v => v * 0.000016387064,
  "cu ft": v => v * 0.028316846592,
  "cu yd": v => v * 0.764554857984,
  "cm3": v => v / 1e6,
  "m3": v => v,
  "ft3": v => v * 0.028316846592,
  "l": v => v / 1000,
}
const fromVolumeM3: Record<string, (v: number) => number> = {
  "mm³": v => v * 1e9,
  "cm³": v => v * 1e6,
  "m³": v => v,
  "cu in": v => v / 0.000016387064,
  "cu ft": v => v / 0.028316846592,
  "cu yd": v => v / 0.764554857984,
  "cm3": v => v * 1e6,
  "m3": v => v,
  "ft3": v => v / 0.028316846592,
  "l": v => v * 1000,
}

function convertConcreteVolumeNeeded(value: string, fromUnit: string, toUnit: string): string {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  const toM3: Record<string, number> = {
    "mm³": 1e-9,
    "cm³": 1e-6,
    "m³": 1,
    "cu in": 0.000016387064,
    "cu ft": 0.028316846592,
    "cu yd": 0.764554857984,
  };
  const fromM3: Record<string, number> = {
    "mm³": 1e9,
    "cm³": 1e6,
    "m³": 1,
    "cu in": 1 / 0.000016387064,
    "cu ft": 1 / 0.028316846592,
    "cu yd": 1 / 0.764554857984,
  };

  if (fromUnit === toUnit) return value;
  if (!(fromUnit in toM3) || !(toUnit in fromM3)) return value;

  const valueInM3 = num * toM3[fromUnit];
  const result = valueInM3 * fromM3[toUnit];
  return Number(result.toFixed(12)).toString();
}

const useUnitConversion = (
  value: string,
  fromUnit: string,
  toUnit: string,
  toBase: Record<string, (v: number) => number>,
  fromBase: Record<string, (v: number) => number>
) => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const base = toBase[fromUnit]?.(num);
  if (typeof base !== 'number') return value;
  const converted = fromBase[toUnit]?.(base);
  return converted !== undefined ? String(Number(converted.toFixed(6))) : value;
}

const DEFAULT_RISER_ANGLE_DEG = 15;

const inputFieldKeys: (keyof typeof initialState)[] = [
  'steps', 'treadRun', 'riserRise', 'throatDepth', 'stairWidth',
  'nosingDepth', 'riserAngle', 'wastage'
];

const Page = () => {
  const [fields, setFields] = useState(initialState);

  // --- Validation state for negative numbers and riser angle ---
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const errors: { [key: string]: string } = {};
    inputFieldKeys.forEach(key => {
      const val = fields[key];
      if (
        typeof val === 'string' &&
        val.trim() !== '' &&
        /^-\d*\.?\d*$/.test(val.trim())
      ) {
        errors[key] = 'The field input value is  must be a positive whole number.';
      }
    });
    // Riser angle validation (deg only, but also handle rad)
    if (fields.useGrid && fields.riserAngle) {
      let angle = parseFloat(fields.riserAngle);
      if (fields.riserAngleUnit === 'rad') {
        angle = angle * (180 / Math.PI);
      }
      if (angle >= 90) {
        errors.riserAngle = 'The riser angle cannot be greater than or equal to 90°.';
      }
    }
    setInputErrors(errors);
  }, [
    fields.steps, fields.treadRun, fields.riserRise, fields.throatDepth, fields.stairWidth,
    fields.nosingDepth, fields.riserAngle, fields.riserAngleUnit, fields.useGrid, fields.wastage
  ]);

  // --- Auto-calculate nosing depth when using angled risers ---
  useEffect(() => {
    if (fields.useGrid) {
      // Only auto-calculate if treadRun and riserRise are valid numbers
      const treadRun = parseFloat(fields.treadRun) || 0;
      const riserRise = parseFloat(fields.riserRise) || 0;
      // Use riser angle from input (do not set any default)
      const riserAngle = parseFloat(fields.riserAngle) || 0;

      // Calculate nosing depth in meters
      const treadRunM = toLengthMeters[fields.treadRunUnit]?.(treadRun) || 0;
      const riserRiseM = toLengthMeters[fields.riserRiseUnit]?.(riserRise) || 0;
      const riserAngleRad = (fields.riserAngleUnit === 'rad')
        ? riserAngle
        : riserAngle * (Math.PI / 180);

      // Formula: nosingDepth = riserRise * tan(riserAngle)
      const nosingDepthM = riserRiseM * Math.tan(riserAngleRad);

      // Convert nosingDepthM to current nosingDepthUnit for display
      const nosingDepthDisplay = fromLengthMeters[fields.nosingDepthUnit]?.(nosingDepthM) || 0;

      setFields(f => ({
        ...f,
        // Do not set riserAngle here, only update nosingDepth
        nosingDepth: String(Number(nosingDepthDisplay.toFixed(3)))
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fields.useGrid,
    fields.treadRun,
    fields.treadRunUnit,
    fields.riserRise,
    fields.riserRiseUnit,
    fields.nosingDepthUnit,
    fields.riserAngle,
    fields.riserAngleUnit
  ]);

  // Unit change handlers
  const handleLengthUnitChange = (keyValue: keyof typeof initialState, keyUnit: keyof typeof initialState, newUnit: string) => {
    setFields(f => {
      const converted = useUnitConversion(f[keyValue] as string, f[keyUnit] as string, newUnit, toLengthMeters, fromLengthMeters);
      return { ...f, [keyValue]: converted, [keyUnit]: newUnit };
    });
  }

  const handleAngleUnitChange = (keyValue: keyof typeof initialState, keyUnit: keyof typeof initialState, newUnit: string) => {
    setFields(f => {
      const converted = useUnitConversion(f[keyValue] as string, f[keyUnit] as string, newUnit, toAngleDeg, fromAngleDeg);
      return { ...f, [keyValue]: converted, [keyUnit]: newUnit };
    });
  }

  const handleAreaUnitChange = (keyValue: keyof typeof initialState, keyUnit: keyof typeof initialState, newUnit: string) => {
    setFields(f => {
      const converted = useUnitConversion(f[keyValue] as string, f[keyUnit] as string, newUnit, toAreaM2, fromAreaM2);
      return { ...f, [keyValue]: converted, [keyUnit]: newUnit };
    });
  }

  const handleVolumeUnitChange = (keyValue: keyof typeof initialState, keyUnit: keyof typeof initialState, newUnit: string) => {
    setFields(f => {
      const converted = useUnitConversion(f[keyValue] as string, f[keyUnit] as string, newUnit, toVolumeM3, fromVolumeM3);
      return { ...f, [keyValue]: converted, [keyUnit]: newUnit };
    });
  }

  const handleConcreteVolumeUnitChange = (newUnit: string) => {
    setFields(f => {
      const value = f.concreteVolume;
      const fromUnit = f.concreteVolumeUnit;
      if (value) {
        const converted = convertConcreteVolumeNeeded(value, fromUnit, newUnit);
        return {
          ...f,
          concreteVolume: converted,
          concreteVolumeUnit: newUnit
        };
      }
      return { ...f, concreteVolumeUnit: newUnit };
    });
  }

  const handleChange = (key: keyof typeof initialState, value: string | boolean) => {
    setFields(f => ({ ...f, [key]: value }))
  }

  const handleClear = () => setFields(initialState)

  // Calculation functions
  const calculateAll = () => {
    const steps = parseFloat(fields.steps) || 0
    const treadRunM = toLengthMeters[fields.treadRunUnit]?.(parseFloat(fields.treadRun) || 0) || 0
    const riserRiseM = toLengthMeters[fields.riserRiseUnit]?.(parseFloat(fields.riserRise) || 0) || 0
    const throatDepthM = toLengthMeters[fields.throatDepthUnit]?.(parseFloat(fields.throatDepth) || 0) || 0
    const stairWidthM = toLengthMeters[fields.stairWidthUnit]?.(parseFloat(fields.stairWidth) || 0) || 0
    const nosingDepthM = toLengthMeters[fields.nosingDepthUnit]?.(parseFloat(fields.nosingDepth) || 0) || 0
    const riserAngleDeg = toAngleDeg[fields.riserAngleUnit]?.(parseFloat(fields.riserAngle) || 0) || 0
    const wastagePercent = parseFloat(fields.wastage) || 0

    // Calculate step area
    let stepAreaM2 = 0
    if (fields.useGrid) {
      // For angled risers
      if (nosingDepthM > 0) {
        stepAreaM2 = (treadRunM + nosingDepthM) * riserRiseM / 2
      } else if (riserAngleDeg > 0) {
        const riserAngleRad = riserAngleDeg * (Math.PI / 180)
        stepAreaM2 = (treadRunM + riserRiseM * Math.tan(riserAngleRad)) * riserRiseM / 2
      } else {
        stepAreaM2 = treadRunM * riserRiseM / 2
      }
    } else {
      // For vertical risers
      stepAreaM2 = treadRunM * riserRiseM / 2
    }

    // Calculate carriage portion area
    const diagonalLength = Math.sqrt(treadRunM * treadRunM + riserRiseM * riserRiseM)
    const carriagePortionAreaM2 = diagonalLength * throatDepthM

    // Calculate total end area
    const totalEndAreaM2 = steps * (stepAreaM2 + carriagePortionAreaM2)

    // Calculate concrete volume
    const concreteVolumeM3 = totalEndAreaM2 * stairWidthM

    // Calculate stair pitch
    const stairPitchDeg = treadRunM > 0 ? Math.atan(riserRiseM / treadRunM) * (180 / Math.PI) : 0

    // Calculate total rise and run
    const totalRiseM = steps * riserRiseM
    const totalRunM = steps > 1 ? (steps - 1) * treadRunM : 0

    // Calculate total carriage length
    const totalCarriageLengthM = Math.sqrt(totalRiseM * totalRiseM + totalRunM * totalRunM)

    // Calculate concrete to purchase with wastage
    const concreteToPurchaseM3 = concreteVolumeM3 * (1 + wastagePercent / 100)

    // Update all calculated fields
    setFields(f => ({
      ...f,
      stairPitch: fromAngleDeg[f.stairPitchUnit]?.(stairPitchDeg).toFixed(3) || '0',
      totalRise: fromLengthMeters[f.totalRiseUnit]?.(totalRiseM).toFixed(3) || '0',
      totalRun: fromLengthMeters[f.totalRunUnit]?.(totalRunM).toFixed(3) || '0',
      totalCarriageLength: fromLengthMeters[f.totalCarriageLengthUnit]?.(totalCarriageLengthM).toFixed(3) || '0',
      endAreaTriangle: fromAreaM2[f.endAreaTriangleUnit]?.(stepAreaM2).toFixed(6) || '0',
      areaCarriagePortion: fromAreaM2[f.areaCarriagePortionUnit]?.(carriagePortionAreaM2).toFixed(6) || '0',
      endAreaStep: fromAreaM2[f.endAreaStepUnit]?.(stepAreaM2 + carriagePortionAreaM2).toFixed(6) || '0',
      totalEndAreaSteps: fromAreaM2[f.totalEndAreaStepsUnit]?.(totalEndAreaM2).toFixed(6) || '0',
      concreteVolume: fromVolumeM3[f.concreteVolumeUnit]?.(concreteVolumeM3).toFixed(6) || '0',
      concreteToPurchase: fromVolumeM3[f.concreteToPurchaseUnit]?.(concreteToPurchaseM3).toFixed(6) || '0'
    }))
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateAll()
  }, [
    fields.steps, fields.treadRun, fields.treadRunUnit, fields.riserRise, fields.riserRiseUnit,
    fields.throatDepth, fields.throatDepthUnit, fields.stairWidth, fields.stairWidthUnit,
    fields.useGrid, fields.nosingDepth, fields.nosingDepthUnit, fields.riserAngle, fields.riserAngleUnit,
    fields.wastage, fields.stairPitchUnit, fields.totalRiseUnit, fields.totalRunUnit,
    fields.totalCarriageLengthUnit, fields.endAreaTriangleUnit, fields.areaCarriagePortionUnit,
    fields.endAreaStepUnit, fields.totalEndAreaStepsUnit, fields.concreteToPurchaseUnit
  ])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">Concrete Stairs Calculator</h1>
      <div className="w-full max-w-md">
        {/* Stair details */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="flex items-center mb-3">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-semibold text-lg text-gray-800">Stair details</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center text-gray-600">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
              {fields.useGrid ? (
                <Image
                  src="/concrete-stairs1.png" // <-- put your angled riser image in public/images
                  alt="Angled Riser Stairs"
                  width={200}
                  height={150}
                  className="rounded"
                />
              ) : (
                <Image
                  src="/concrete-stairs2.png" // <-- put your vertical riser image in public/images
                  alt="Vertical Riser Stairs"
                  width={200}
                  height={150}
                  className="rounded"
                />
              )}
            </div>          </div>

          <InputRow
            label="Number of steps"
            value={fields.steps}
            onValueChange={v => handleChange('steps', v)}
            unit="steps"
            unitOptions={[{ label: 'steps', value: 'steps' }]}
            info
          />
          {inputErrors.steps && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.steps}</div>
          )}
          <InputRow
            label="Effective tread run (l₁)"
            value={fields.treadRun}
            onValueChange={v => handleChange('treadRun', v)}
            unit={fields.treadRunUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('treadRun', 'treadRunUnit', u)}
            info
          />
          {inputErrors.treadRun && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.treadRun}</div>
          )}
          <InputRow
            label="Riser rise (l₂)"
            value={fields.riserRise}
            onValueChange={v => handleChange('riserRise', v)}
            unit={fields.riserRiseUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('riserRise', 'riserRiseUnit', u)}
            info
          />
          {inputErrors.riserRise && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.riserRise}</div>
          )}
          <CheckboxRow
            label="I am using angled risers."
            checked={fields.useGrid}
            onChange={v => handleChange('useGrid', v)}
            info
          />

          {fields.useGrid && (
            <>
              <InputRow
                label="Nosing depth (dₙ)"
                value={fields.nosingDepth}
                onValueChange={v => handleChange('nosingDepth', v)}
                unit={fields.nosingDepthUnit}
                unitOptions={unitOptions.length}
                onUnitChange={u => handleLengthUnitChange('nosingDepth', 'nosingDepthUnit', u)}
                info
              />
              {inputErrors.nosingDepth && (
                <div className="text-xs text-red-600 mt-1">{inputErrors.nosingDepth}</div>
              )}
              <InputRow
                label="Riser angle (Φ)"
                value={fields.riserAngle}
                onValueChange={v => handleChange('riserAngle', v)}
                unit={fields.riserAngleUnit}
                unitOptions={unitOptions.angle}
                onUnitChange={u => handleAngleUnitChange('riserAngle', 'riserAngleUnit', u)}
                info
                disabled={false} // Ensure riser angle is always editable
              />
              {inputErrors.riserAngle && (
                <div className="text-xs text-red-600 mt-1">{inputErrors.riserAngle}</div>
              )}
            </>
          )}

          <InputRow
            label="Throat depth (d₁)"
            value={fields.throatDepth}
            onValueChange={v => handleChange('throatDepth', v)}
            unit={fields.throatDepthUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('throatDepth', 'throatDepthUnit', u)}
            info
          />
          {inputErrors.throatDepth && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.throatDepth}</div>
          )}
          <InputRow
            label="Stair width"
            value={fields.stairWidth}
            onValueChange={v => handleChange('stairWidth', v)}
            unit={fields.stairWidthUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('stairWidth', 'stairWidthUnit', u)}
            info
          />
          {inputErrors.stairWidth && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.stairWidth}</div>
          )}
        </div>

        {/* Concrete needed */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="flex items-center mb-3">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-semibold text-lg text-gray-800">Concrete needed</span>
          </div>
          <InputRow
            label="Concrete volume needed"
            value={fields.concreteVolume ? Number(fields.concreteVolume).toFixed(3) : '0'}
            onValueChange={v => handleChange('concreteVolume', v)}
            unit={fields.concreteVolumeUnit}
            unitOptions={concreteVolumeUnitOptions}
            onUnitChange={handleConcreteVolumeUnitChange}
          />
          <InputRow
            label="Wastage"
            value={fields.wastage}
            onValueChange={v => handleChange('wastage', v)}
            unit={fields.wastageUnit}
            unitOptions={unitOptions.percent}
            onUnitChange={v => handleChange('wastageUnit', v)}
          />
          {inputErrors.wastage && (
            <div className="text-xs text-red-600 mt-1">{inputErrors.wastage}</div>
          )}
          <InputRow
            label="Concrete volume to purchase"
            value={fields.concreteToPurchase ? Number(fields.concreteToPurchase).toFixed(3) : '0'}
            onValueChange={v => handleChange('concreteToPurchase', v)}
            unit={fields.concreteToPurchaseUnit}
            unitOptions={unitOptions.volume}
            onUnitChange={u => handleVolumeUnitChange('concreteToPurchase', 'concreteToPurchaseUnit', u)}
          />
          <div className="text-xs text-gray-500 mt-2">
            You can use our general calculator to find out how much cement, sand, and gravel you'll use if you want to mix concrete yourself.
          </div>
        </div>

        {/* More stairs measurements */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <div className="flex items-center mb-3">
            <span className="font-semibold text-blue-700 mr-2">▸</span>
            <span className="font-semibold text-lg text-gray-800">More stairs measurements</span>
          </div>
          <InputRow
            label="Stair pitch"
            value={fields.stairPitch ? Number(fields.stairPitch).toFixed(3) : '0'}
            onValueChange={v => handleChange('stairPitch', v)}
            unit={fields.stairPitchUnit}
            unitOptions={unitOptions.angle}
            onUnitChange={u => handleAngleUnitChange('stairPitch', 'stairPitchUnit', u)}
          />
          <InputRow
            label="Total rise"
            value={fields.totalRise ? Number(fields.totalRise).toFixed(3) : '0'}
            onValueChange={v => handleChange('totalRise', v)}
            unit={fields.totalRiseUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('totalRise', 'totalRiseUnit', u)}
          />
          <InputRow
            label="Total run"
            value={fields.totalRun ? Number(fields.totalRun).toFixed(3) : '0'}
            onValueChange={v => handleChange('totalRun', v)}
            unit={fields.totalRunUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('totalRun', 'totalRunUnit', u)}
          />
          <InputRow
            label="Total carriage length"
            value={fields.totalCarriageLength ? Number(fields.totalCarriageLength).toFixed(3) : '0'}
            onValueChange={v => handleChange('totalCarriageLength', v)}
            unit={fields.totalCarriageLengthUnit}
            unitOptions={unitOptions.length}
            onUnitChange={u => handleLengthUnitChange('totalCarriageLength', 'totalCarriageLengthUnit', u)}
          />
          <InputRow
            label="End area of a step's triangle"
            value={fields.endAreaTriangle ? Number(fields.endAreaTriangle).toFixed(3) : '0'}
            onValueChange={v => handleChange('endAreaTriangle', v)}
            unit={fields.endAreaTriangleUnit}
            unitOptions={unitOptions.area}
            onUnitChange={u => handleAreaUnitChange('endAreaTriangle', 'endAreaTriangleUnit', u)}
          />
          <InputRow
            label="Area of carriage portion"
            value={fields.areaCarriagePortion ? Number(fields.areaCarriagePortion).toFixed(3) : '0'}
            onValueChange={v => handleChange('areaCarriagePortion', v)}
            unit={fields.areaCarriagePortionUnit}
            unitOptions={unitOptions.area}
            onUnitChange={u => handleAreaUnitChange('areaCarriagePortion', 'areaCarriagePortionUnit', u)}
          />
          <InputRow
            label="End area of each step"
            value={fields.endAreaStep ? Number(fields.endAreaStep).toFixed(3) : '0'}
            onValueChange={v => handleChange('endAreaStep', v)}
            unit={fields.endAreaStepUnit}
            unitOptions={unitOptions.area}
            onUnitChange={u => handleAreaUnitChange('endAreaStep', 'endAreaStepUnit', u)}
          />
          <InputRow
            label="Total end area of steps"
            value={fields.totalEndAreaSteps ? Number(fields.totalEndAreaSteps).toFixed(3) : '0'}
            onValueChange={v => handleChange('totalEndAreaSteps', v)}
            unit={fields.totalEndAreaStepsUnit}
            unitOptions={unitOptions.area}
            onUnitChange={u => handleAreaUnitChange('totalEndAreaSteps', 'totalEndAreaStepsUnit', u)}
          />
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
        {/* Riser angle error message */}
        {fields.useGrid && inputErrors.riserAngle && (
          <div className="text-xs text-red-600 mt-1">{inputErrors.riserAngle}</div>
        )}
      </div>
    </div>
  )
}

export default Page