'use client'
import React, { useState, useEffect } from 'react'

const lengthWidthDepthUnits = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" }
]

// Rectangular & Circular quantity units (same as per prompt)
const quantityUnitsRect = [
  { label: "cubic centimeters (cm³)", value: "cm3" },
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic inches (cu in)", value: "cu_in" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" }
]
const quantityUnitsCirc = [
  { label: "cubic centimeters (cm³)", value: "cm3" },
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic inches (cu in)", value: "cu_in" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" }
]

// Rectangular & Circular weight units (same as per prompt)
const weightUnitsRect = [
  { label: "kilograms (kg)", value: "kg" },
  { label: "metric tons (t)", value: "t" },
  { label: "pounds (lb)", value: "lb" },
  { label: "US short tons (US ton)", value: "us_ton" },
  { label: "imperial tons (long ton)", value: "long_ton" }
]
const weightUnitsCirc = [
  { label: "kilograms (kg)", value: "kg" },
  { label: "metric tons (t)", value: "t" },
  { label: "pounds (lb)", value: "lb" },
  { label: "US short tons (US ton)", value: "us_ton" },
  { label: "imperial tons (long ton)", value: "long_ton" }
]

// --- Unit conversion helpers ---

// Length/width/depth conversions (to meters and from meters)
const toMeters: Record<string, (v: number) => number> = {
  cm: v => v / 100,
  m: v => v,
  km: v => v * 1000,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
}
const fromMeters: Record<string, (v: number) => number> = {
  cm: v => v * 100,
  m: v => v,
  km: v => v / 1000,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
}

// Volume conversions (to m3 and from m3)
const toM3: Record<string, (v: number) => number> = {
  m3: v => v,
  cm3: v => v / 1e6,
  cu_in: v => v * 0.0000163871,
  cu_ft: v => v * 0.0283168,
  cu_yd: v => v * 0.764555,
}
const fromM3: Record<string, (v: number) => number> = {
  m3: v => v,
  cm3: v => v * 1e6,
  cu_in: v => v / 0.0000163871,
  cu_ft: v => v / 0.0283168,
  cu_yd: v => v / 0.764555,
}

// Weight conversions (to kg and from kg)
const toKg: Record<string, (v: number) => number> = {
  kg: v => v,
  t: v => v * 1000,
  lb: v => v * 0.453592,
  us_ton: v => v * 907.185,
  long_ton: v => v * 1016.05,
}
const fromKg: Record<string, (v: number) => number> = {
  kg: v => v,
  t: v => v / 1000,
  lb: v => v / 0.453592,
  us_ton: v => v / 907.185,
  long_ton: v => v / 1016.05,
}

// Helper to parse string to number safely
const parse = (v: string) => {
  const n = parseFloat(v)
  return isNaN(n) ? 0 : n
}

// --- Independent dropdown handlers for each input field ---

// Surface length
const handleLengthUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void
) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Surface width
const handleWidthUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void
) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Depth
const handleDepthUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void
) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Quantity
const handleQuantityUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void
) => {
  if (value) {
    const val = parse(value)
    const m3 = toM3[prevUnit] ? toM3[prevUnit](val) : val
    const newVal = fromM3[unit] ? fromM3[unit](m3) : m3
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Weight
const handleWeightUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void
) => {
  if (value) {
    const val = parse(value)
    const kg = toKg[prevUnit] ? toKg[prevUnit](val) : val
    const newVal = fromKg[unit] ? fromKg[unit](kg) : kg
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <span className="font-semibold text-gray-900">{title}</span>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
)

const Field = ({
  label,
  value,
  onChange,
  unitValue,
  onUnitChange,
  unitOptions,
  placeholder = '',
  info,
  infoTip,
  type = 'text',
  rightLabel,
  disabled = false,
  error = false,
  errorMsg = '',
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  unitValue?: string
  onUnitChange?: (v: string) => void
  unitOptions?: { label: string; value: string }[]
  placeholder?: string
  info?: boolean
  infoTip?: string
  type?: string
  rightLabel?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
}) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={infoTip || ''}>ⓘ</span>
      )}
    </div>
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left ${error ? 'border-red-400' : 'border-gray-200'}`}
        style={error ? { borderColor: '#f87171', color: '#b91c1c', background: '#fef2f2' } : {}}
      />
      {unitOptions && unitValue && onUnitChange && (
        <select
          className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
          value={unitValue}
          onChange={e => onUnitChange(e.target.value)}
        >
          {unitOptions.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      )}
      {rightLabel && (
        <span className="ml-2 text-gray-700 font-semibold">{rightLabel}</span>
      )}
    </div>
    {error && errorMsg && (
      <div className="mt-1 text-sm text-red-600">{errorMsg}</div>
    )}
  </div>
)

const page = () => {
  const [shape, setShape] = useState<'rect' | 'circ'>('rect')
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [depth, setDepth] = useState('')
  const [depthUnit, setDepthUnit] = useState('cm')
  const [waste, setWaste] = useState('10')
  const [wasteUnit] = useState('%')

  const [quantity, setQuantity] = useState('')
  const [quantityUnit, setQuantityUnit] = useState('cu_yd')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('us_ton')

  // --- Validation state ---
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')

  // --- Validation logic ---
  useEffect(() => {
    setLengthError(length && parse(length) <= 0 ? 'Surface length should be greater than 0.' : '')
    setWidthError(width && parse(width) <= 0 ? 'Surface width should be greater than 0.' : '')
    setDepthError(depth && parse(depth) <= 0 ? 'Depth should be greater than 0.' : '')
  }, [length, width, depth, waste])

  // Calculation logic for quantity and weight
  useEffect(() => {
    // Convert all to feet for formula
    const l = parse(length)
    const w = parse(width)
    const d = parse(depth)
    const wastePct = parse(waste) || 0

    // Convert to feet
    const l_ft = toMeters[lengthUnit] ? toMeters[lengthUnit](l) / 0.3048 : l // meters to feet
    const w_ft = toMeters[widthUnit] ? toMeters[widthUnit](w) / 0.3048 : w
    const d_ft = toMeters[depthUnit] ? toMeters[depthUnit](d) / 0.3048 : d

    let yards = 0
    if (shape === 'rect') {
      yards = (l_ft * w_ft * d_ft) / 27
    } else {
      // For circle: S = (π × L × W × D) / 27, L and W are diameters in feet
      yards = (Math.PI * (l_ft / 2) * (w_ft / 2) * d_ft) / 27
    }
    // Add waste factor
    let yardsWithWaste = yards + (yards * (wastePct / 100))

    // Set quantity in selected unit
    if (yardsWithWaste > 0) {
      // Convert cubic yards to m3 for base, then to selected unit
      const m3 = yardsWithWaste * 0.764555
      setQuantity(fromM3[quantityUnit] ? String(Number(fromM3[quantityUnit](m3).toFixed(6))) : String(m3))
      // Weight: 1 cubic yard ≈ 1.5 US tons (default), so weight in tons
      const tons = yardsWithWaste * 1.5
      const kg = tons * 907.185
      setWeight(fromKg[weightUnit] ? String(Number(fromKg[weightUnit](kg).toFixed(6))) : String(kg))
    } else {
      setQuantity('')
      setWeight('')
    }
  }, [
    shape, length, width, depth, waste,
    lengthUnit, widthUnit, depthUnit, wasteUnit,
    quantityUnit, weightUnit
  ])

  // Ensure that when shape changes, the quantity/weight unit is always valid for the new shape
  React.useEffect(() => {
    if (shape === 'rect') {
      if (!quantityUnitsRect.some(u => u.value === quantityUnit)) setQuantityUnit(quantityUnitsRect[0].value)
      if (!weightUnitsRect.some(u => u.value === weightUnit)) setWeightUnit(weightUnitsRect[0].value)
    } else {
      if (!quantityUnitsCirc.some(u => u.value === quantityUnit)) setQuantityUnit(quantityUnitsCirc[0].value)
      if (!weightUnitsCirc.some(u => u.value === weightUnit)) setWeightUnit(weightUnitsCirc[0].value)
    }
  }, [shape])

  const handleClear = () => {
    setShape('rect')
    setLength('')
    setLengthUnit('m')
    setWidth('')
    setWidthUnit('m')
    setDepth('')
    setDepthUnit('cm')
    setWaste('10')
    setQuantity('')
    setQuantityUnit('cu_yd')
    setWeight('')
    setWeightUnit('us_ton')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crushed Stone Calculator</h1>
      <div className="w-full max-w-sm space-y-4">
        <Section title="Shape and dimensions">
          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={shape === 'rect'}
                onChange={() => setShape('rect')}
                className="accent-blue-600"
              />
              <span>Rectangular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={shape === 'circ'}
                onChange={() => setShape('circ')}
                className="accent-blue-600"
              />
              <span>Circular</span>
            </label>
          </div>
          <Field
            label={shape === 'rect' ? "Surface length" : "Surface length"}
            value={length}
            onChange={setLength}
            unitValue={lengthUnit}
            onUnitChange={u => handleLengthUnitChange(u, length, lengthUnit, setLength, setLengthUnit)}
            unitOptions={lengthWidthDepthUnits}
            info
            infoTip={shape === 'rect' ? "Length of the surface" : "Length of the circle"}
            error={!!lengthError}
            errorMsg={lengthError}
          />
          {shape === 'rect' ? (
            <Field
              label="Surface width"
              value={width}
              onChange={setWidth}
              unitValue={widthUnit}
              onUnitChange={u => handleWidthUnitChange(u, width, widthUnit, setWidth, setWidthUnit)}
              unitOptions={lengthWidthDepthUnits}
              info
              infoTip="Width of the surface"
              error={!!widthError}
              errorMsg={widthError}
            />
          ) : (
            <Field
              label="Surface width"
              value={width}
              onChange={setWidth}
              unitValue={widthUnit}
              onUnitChange={u => handleWidthUnitChange(u, width, widthUnit, setWidth, setWidthUnit)}
              unitOptions={lengthWidthDepthUnits}
              info
              infoTip="Width of the circle"
              error={!!widthError}
              errorMsg={widthError}
            />
          )}
          <Field
            label="Depth"
            value={depth}
            onChange={setDepth}
            unitValue={depthUnit}
            onUnitChange={u => handleDepthUnitChange(u, depth, depthUnit, setDepth, setDepthUnit)}
            unitOptions={lengthWidthDepthUnits}
            info
            infoTip="Depth of the layer"
            error={!!depthError}
            errorMsg={depthError}
          />
          <Field
            label="Waste factor"
            value={waste}
            onChange={setWaste}
            unitValue={wasteUnit}
            unitOptions={[{ value: "%", label: "%" }]}
            info
            infoTip="Waste factor in percent"
          />
        </Section>
        <Section title="Required crushed stone">
          <Field
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            unitValue={quantityUnit}
            onUnitChange={u => handleQuantityUnitChange(
              u,
              quantity,
              quantityUnit,
              setQuantity,
              setQuantityUnit
            )}
            unitOptions={shape === 'rect' ? quantityUnitsRect : quantityUnitsCirc}
          />
          <Field
            label="Weight"
            value={weight}
            onChange={setWeight}
            unitValue={weightUnit}
            onUnitChange={u => handleWeightUnitChange(
              u,
              weight,
              weightUnit,
              setWeight,
              setWeightUnit
            )}
            unitOptions={shape === 'rect' ? weightUnitsRect : weightUnitsCirc}
          />
        </Section>
        <button
          className="w-full mt-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-400 transition text-lg font-semibold"
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
