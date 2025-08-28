'use client'
import React, { useState } from 'react'

const unitOptions = {
  thickness: [
    { label: 'millimeters', value: 'mm' },
    { label: 'centimeters', value: 'cm' },
    { label: 'meters', value: 'm' },
    { label: 'inches', value: 'in' },
    { label: 'feet', value: 'ft' },
  ],
  radius: [
    { label: 'millimeters', value: 'mm' },
    { label: 'centimeters', value: 'cm' },
    { label: 'meters', value: 'm' },
    { label: 'inches', value: 'in' },
    { label: 'feet', value: 'ft' },
  ],
  allowance: [
    { label: 'millimeters', value: 'mm' },
    { label: 'centimeters', value: 'cm' },
    { label: 'meters', value: 'm' },
    { label: 'inches', value: 'in' },
    { label: 'feet', value: 'ft' },
  ],
  neutralAxis: [
    { label: 'millimeters', value: 'mm' },
    { label: 'centimeters', value: 'cm' },
    { label: 'meters', value: 'm' },
    { label: 'inches', value: 'in' },
    { label: 'feet', value: 'ft' },
  ],
  angle: [
    { label: 'degrees', value: 'deg' },
    { label: 'radians', value: 'rad' },
    { label: 'gradians', value: 'gon' },
  ],
}

type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft'
type AngleUnit = 'deg' | 'rad' | 'gon'

const toMeters: Record<LengthUnit, (v: number) => number> = {
  mm: v => v / 1000,
  cm: v => v / 100,
  m: v => v,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
}
const fromMeters: Record<LengthUnit, (v: number) => number> = {
  mm: v => v * 1000,
  cm: v => v * 100,
  m: v => v,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
}

const toRadians: Record<AngleUnit, (v: number) => number> = {
  deg: v => v * (Math.PI / 180),
  rad: v => v,
  gon: v => v * (Math.PI / 200),
}
const fromRadians: Record<AngleUnit, (v: number) => number> = {
  deg: v => v * (180 / Math.PI),
  rad: v => v,
  gon: v => v * (200 / Math.PI),
}

const InfoIcon = ({ tip }: { tip?: string }) => (
  <span className="ml-1 cursor-pointer text-gray-400" title={tip || ''}>ⓘ</span>
)

const Dropdown = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) => (
  <select
    className="border  bg-transparent  text-blue-600 font-medium h-10 px-2 outline-none"
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
)

const Field = ({
  label,
  value,
  onChange,
  unitValue,
  onUnitChange,
  unitOptions,
  info,
  infoTip,
  placeholder = '',
  disabled = false,
  rightLabel,
  error,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  unitValue?: string
  onUnitChange?: (v: string) => void
  unitOptions?: { label: string; value: string }[]
  info?: boolean
  infoTip?: string
  placeholder?: string
  disabled?: boolean
  rightLabel?: string
  error?: string
}) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      <span className="font-medium text-gray-900">{label}</span>
      {info && <InfoIcon tip={infoTip} />}
    </div>
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-3 py-2 border rounded-md text-base h-10 outline-none font-semibold
          ${disabled ? 'bg-gray-50 text-gray-900 border-gray-300' : 'bg-white text-gray-900 border-gray-300'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
      />
      {unitOptions && unitValue && onUnitChange && (
        <Dropdown options={unitOptions} value={unitValue} onChange={onUnitChange} />
      )}
      {rightLabel && (
        <span className="ml-2 text-blue-700 font-semibold">{rightLabel}</span>
      )}
    </div>
    {error && (
      <div className="flex items-center mt-1 text-xs text-red-600">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        {error}
      </div>
    )}
  </div>
)

const validatePositive = (value: string) => {
  if (!value) return null
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return false
  return true
}

const getValidationMessage = (field: string, value?: string) => {
  if (field === 'kFactor' && value && parseFloat(value) > 1) {
    return "The K factor can't be greater than one. The K factor generally lies between 0.3–0.5."
  }
  switch (field) {
    case 'thickness':
      return 'The material thickness must be greater than zero.'
    case 'radius':
      return 'The inside radius must be greater than zero.'
    case 'angle':
      return 'The bend angle must be greater than zero.'
    case 'allowance':
      return 'The bend allowance must be greater than zero.'
    case 'kFactor':
      return 'The K factor must be greater than zero.'
    case 'neutralAxis':
      return 'The location of neutral axis must be greater than zero.'
    default:
      return ''
  }
}

const page = () => {
  // Each input field has its own value and unit
  const [thickness, setThickness] = useState('')
  const [thicknessUnit, setThicknessUnit] = useState<LengthUnit>('mm')
  const [radius, setRadius] = useState('')
  const [radiusUnit, setRadiusUnit] = useState<LengthUnit>('mm')
  const [angle, setAngle] = useState('')
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg')
  const [allowance, setAllowance] = useState('')
  const [allowanceUnit, setAllowanceUnit] = useState<LengthUnit>('mm')
  const [kFactor, setKFactor] = useState('')
  const [neutralAxis, setNeutralAxis] = useState('')
  const [neutralAxisUnit, setNeutralAxisUnit] = useState<LengthUnit>('mm')

  // --- For Bend Angle: display value and calculation value separation ---
  const [angleDisplay, setAngleDisplay] = useState('');
  // angle: used for calculation (always in angleUnit), angleDisplay: shown in input

  // When angle changes, update both display and calculation value
  const handleAngleChange = (v: string) => {
    setAngleDisplay(v);
    setAngle(v);
  };

  // When angle unit changes, only convert and update the display value, not the calculation value
  const handleAngleUnitChangeDisplayOnly = (
    newUnit: string,
    prevUnit: AngleUnit,
    setUnit: (v: AngleUnit) => void,
    angleValue: string,
    setAngleDisplay: (v: string) => void
  ) => {
    if (angleValue) {
      const num = parseFloat(angleValue);
      if (!isNaN(num)) {
        // Convert display value to radians, then to new unit for display only
        const radians = toRadians[prevUnit](num);
        const newValue = fromRadians[newUnit as AngleUnit](radians);
        setAngleDisplay(newValue ? String(Number(newValue.toFixed(6))) : '');
      }
    }
    setUnit(newUnit as AngleUnit);
    // Do NOT update the calculation value (angle)
  };

  // Handle unit changes for each field independently
  const handleLengthUnitChange = (
    value: string,
    prevUnit: LengthUnit,
    setUnit: (v: LengthUnit) => void,
    inputValue: string,
    setInputValue: (v: string) => void
  ) => {
    if (inputValue) {
      const num = parseFloat(inputValue)
      if (!isNaN(num)) {
        const meters = toMeters[prevUnit](num)
        const newValue = fromMeters[value as LengthUnit](meters)
        setInputValue(newValue ? String(Number(newValue.toFixed(6))) : '')
      }
    }
    setUnit(value as LengthUnit)
  }

  // K-factor calculation
  // Use angle (not angleDisplay) for calculation
  let calcKFactor = kFactor
  let calcNeutralAxis = neutralAxis

  const allInputsPresent =
    thickness && radius && angle && allowance &&
    !isNaN(Number(thickness)) && !isNaN(Number(radius)) && !isNaN(Number(angle)) && !isNaN(Number(allowance))

  if (allInputsPresent) {
    // Convert all to SI units (meters, radians)
    const T = toMeters[thicknessUnit](parseFloat(thickness))
    const Ri = toMeters[radiusUnit](parseFloat(radius))
    const BA = toMeters[allowanceUnit](parseFloat(allowance))
    const theta = toRadians[angleUnit](parseFloat(angle)) // use angle, not angleDisplay

    if (T !== 0 && theta !== 0) {
      const k = ((180 * BA) / (Math.PI * parseFloat(angle) * T)) - (Ri / T)
      calcKFactor = k.toFixed(6)
      calcNeutralAxis = (k * T).toFixed(6)
    }
  }

  const handleClear = () => {
    setThickness('')
    setRadius('')
    setAngle('')
    setAllowance('')
    setKFactor('')
    setNeutralAxis('')
    setThicknessUnit('mm')
    setRadiusUnit('mm')
    setAngleUnit('deg')
    setAllowanceUnit('mm')
    setNeutralAxisUnit('mm')
  }

  // Validation states
  const thicknessValid = validatePositive(thickness)
  const radiusValid = validatePositive(radius)
  const angleValid = validatePositive(angle)
  const allowanceValid = validatePositive(allowance)
  const kFactorValid = validatePositive(calcKFactor)
  const neutralAxisValid = validatePositive(fromMeters[neutralAxisUnit](parseFloat(calcNeutralAxis || '0')).toString())
  const kFactorRangeError = calcKFactor && parseFloat(calcKFactor) > 1

  return (
    <div className="min-h-screen bg-slate-50 py-8 flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-7 tracking-tight">
        K factor calculator
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-5 min-w-[340px] max-w-[420px] w-full">
        <img
          src="/kfactor.png"
          alt="k-factor diagram"
          className="w-full mb-4 rounded"
        />
        <Field
          label="Material thickness (T)"
          value={thickness}
          onChange={setThickness}
          unitValue={thicknessUnit}
          onUnitChange={v =>
            handleLengthUnitChange(v, thicknessUnit, setThicknessUnit, thickness, setThickness)
          }
          unitOptions={unitOptions.thickness}
          info
          error={thickness && thicknessValid === false ? getValidationMessage('thickness') : undefined}
        />
        <Field
          label="Inside radius (Ri)"
          value={radius}
          onChange={setRadius}
          unitValue={radiusUnit}
          onUnitChange={v =>
            handleLengthUnitChange(v, radiusUnit, setRadiusUnit, radius, setRadius)
          }
          unitOptions={unitOptions.radius}
          info
          error={radius && radiusValid === false ? getValidationMessage('radius') : undefined}
        />
        <Field
          label="Bend angle (θ)"
          value={angleDisplay}
          onChange={handleAngleChange}
          unitValue={angleUnit}
          onUnitChange={v =>
            handleAngleUnitChangeDisplayOnly(
              v,
              angleUnit,
              setAngleUnit,
              angleDisplay,
              setAngleDisplay
            )
          }
          unitOptions={unitOptions.angle}
          info
          error={angle && angleValid === false ? getValidationMessage('angle') : undefined}
        />
        <Field
          label="Bend allowance (BA)"
          value={allowance}
          onChange={setAllowance}
          unitValue={allowanceUnit}
          onUnitChange={v =>
            handleLengthUnitChange(v, allowanceUnit, setAllowanceUnit, allowance, setAllowance)
          }
          unitOptions={unitOptions.allowance}
          info
          error={allowance && allowanceValid === false ? getValidationMessage('allowance') : undefined}
        />
        <Field
          label="K-factor (k)"
          value={calcKFactor}
          onChange={setKFactor}
          disabled
          error={
            calcKFactor && (
              kFactorRangeError
                ? getValidationMessage('kFactor', calcKFactor)
                : kFactorValid === false
                  ? getValidationMessage('kFactor')
                  : undefined
            )
          }
        />
        <Field
          label="Location of neutral axis (t)"
          value={fromMeters[neutralAxisUnit](parseFloat(calcNeutralAxis || '0')).toString()}
          onChange={setNeutralAxis}
          unitValue={neutralAxisUnit}
          onUnitChange={v => {
            const neutralAxisMeters = parseFloat(calcNeutralAxis || '0');
            setNeutralAxisUnit(v as LengthUnit);
          }}
          unitOptions={unitOptions.neutralAxis}
          info
          infoTip="Distance from the inside of the bend to the neutral axis"
          disabled
          error={
            calcNeutralAxis &&
            neutralAxisValid === false
              ? getValidationMessage('neutralAxis')
              : undefined
          }
        />
        <button
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-600 transition w-full"
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default page
