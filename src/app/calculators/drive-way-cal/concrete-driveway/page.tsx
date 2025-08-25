'use client'
import React, { useState } from 'react'

const unitOptions = [
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
  { value: "ft", label: "ft" },
  { value: "in", label: "in" },
  { value: "yd", label: "yd" }
]
const priceUnitOptions = [
  { value: "PKR", label: "PKR" },
]

// Separate unit options for length/width and depth
const lengthWidthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
]
const depthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" }
]

// For Gravel depth
const gravelDepthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
]

// For Edge-rebar spacing (separate and only for this field)
const edgeRebarSpacingUnitOptionsOnly = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
]

// For Edge-rebar spacing and Single rebar length
const edgeRebarSpacingUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" }
]
const singleRebarLengthUnitOptions = edgeRebarSpacingUnitOptions

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-5">
    <div className="flex items-center mb-4">
      <span className="font-semibold text-gray-900">{title}</span>
      <span className="ml-2 text-gray-400 text-xl">⌄</span>
    </div>
    {children}
  </div>
)

const MaterialCostField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
}) => (
  <div className="mb-3">
    <div className="flex items-center mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="ml-auto text-gray-400 text-lg font-bold">...</span>
    </div>
    <div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder="PKR"
          className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none select-none">PKR</span>
      </div>
    </div>
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
  type?: string
  rightLabel?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
}) => (
  <div className="mb-3">
    <div className="flex items-center mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
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

// Detail planning unit options
const cmUnit = [{ label: "cm", value: "cm" }]
const mUnit = [{ label: "m", value: "m" }]

// For Concrete and Gravel price per unit dropdown
const concreteGravelPricePerUnitOptions = [
  { label: "cubic meter (m³)", value: "m3" },
  { label: "cubic foot (cu ft)", value: "cu_ft" },
  { label: "cubic yard (cu yd)", value: "cu_yd" }
]

// For Rebar and Form price per unit dropdown
const rebarFormPricePerUnitOptions = [
  { label: "centimeter (cm)", value: "cm" },
  { label: "meter (m)", value: "m" },
  { label: "foot (ft)", value: "ft" },
  { label: "yard (yd)", value: "yd" }
]

// For Material estimations section dropdowns
const concreteGravelVolumeUnitOptions = [
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" }
]
const gravelVolumeUnitOptions = [
  { label: "cubic centimeters (cm³)", value: "cm3" },
  { label: "cubic decimeters (dm³)", value: "dm3" },
  { label: "cubic meters (m³)", value: "m3" },
  { label: "cubic inches (cu in)", value: "cu_in" },
  { label: "cubic feet (cu ft)", value: "cu_ft" },
  { label: "cubic yards (cu yd)", value: "cu_yd" }
]
const rebarsLengthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
]
const formsLengthUnitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
]

// --- Unit conversion helpers ---

// Length/width/depth conversions
const toMeters: Record<string, (v: number) => number> = {
  cm: v => v / 100,
  m: v => v,
  km: v => v * 1000,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
  mi: v => v * 1609.34,
}
const fromMeters: Record<string, (v: number) => number> = {
  cm: v => v * 100,
  m: v => v,
  km: v => v / 1000,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
  mi: v => v / 1609.34,
}

// Volume conversions
const toM3: Record<string, (v: number) => number> = {
  m3: v => v,
  cu_ft: v => v * 0.0283168,
  cu_yd: v => v * 0.764555,
  cm3: v => v / 1e6,
  dm3: v => v / 1e3,
  cu_in: v => v * 0.0000163871,
}
const fromM3: Record<string, (v: number) => number> = {
  m3: v => v,
  cu_ft: v => v / 0.0283168,
  cu_yd: v => v / 0.764555,
  cm3: v => v * 1e6,
  dm3: v => v * 1e3,
  cu_in: v => v / 0.0000163871,
}

// Length conversions for rebar/forms
const toMetersLength: Record<string, (v: number) => number> = {
  cm: v => v / 100,
  m: v => v,
  km: v => v * 1000,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
  mi: v => v * 1609.34,
}
const fromMetersLength: Record<string, (v: number) => number> = {
  cm: v => v * 100,
  m: v => v,
  km: v => v / 1000,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
  mi: v => v / 1609.34,
}

// Helper to parse string to number safely
const parse = (v: string) => {
  const n = parseFloat(v)
  return isNaN(n) ? 0 : n
}

// --- Independent dropdown handlers for each input field ---

// Length
const handleLengthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Width
const handleWidthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Depth
const handleDepthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Gravel depth
const handleGravelDepthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMeters[prevUnit] ? toMeters[prevUnit](val) : val
    const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Edge-rebar spacing
const handleEdgeRebarSpacingUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMetersLength[prevUnit] ? toMetersLength[prevUnit](val) : val
    const newVal = fromMetersLength[unit] ? fromMetersLength[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Rebar-rebar spacing
const handleRebarRebarSpacingUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMetersLength[prevUnit] ? toMetersLength[prevUnit](val) : val
    const newVal = fromMetersLength[unit] ? fromMetersLength[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Single rebar length
const handleSingleRebarLengthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMetersLength[prevUnit] ? toMetersLength[prevUnit](val) : val
    const newVal = fromMetersLength[unit] ? fromMetersLength[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Total concrete volume
const handleTotalConcreteVolumeUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const m3 = toM3[prevUnit] ? toM3[prevUnit](val) : val
    const newVal = fromM3[unit] ? fromM3[unit](m3) : m3
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Total gravel volume
const handleTotalGravelVolumeUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const m3 = toM3[prevUnit] ? toM3[prevUnit](val) : val
    const newVal = fromM3[unit] ? fromM3[unit](m3) : m3
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Total rebars length
const handleTotalRebarsLengthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMetersLength[prevUnit] ? toMetersLength[prevUnit](val) : val
    const newVal = fromMetersLength[unit] ? fromMetersLength[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// Total forms length
const handleTotalFormsLengthUnitChange = (unit: string, value: string, prevUnit: string, setValue: (v: string) => void, setUnit: (u: string) => void) => {
  if (value) {
    const val = parse(value)
    const meters = toMetersLength[prevUnit] ? toMetersLength[prevUnit](val) : val
    const newVal = fromMetersLength[unit] ? fromMetersLength[unit](meters) : meters
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

// --- Price per unit conversion helpers ---
const handlePricePerUnitChange = (
  unit: string,
  value: string,
  prevUnit: string,
  setValue: (v: string) => void,
  setUnit: (u: string) => void,
  toBase: Record<string, (v: number) => number>,
  fromBase: Record<string, (v: number) => number>
) => {
  if (value) {
    const val = parse(value)
    // Convert to base (m3 or m), then to new unit
    const base = toBase[prevUnit] ? toBase[prevUnit](val) : val
    const newVal = fromBase[unit] ? fromBase[unit](base) : base
    setValue(String(Number(newVal.toFixed(6))))
  }
  setUnit(unit)
}

const page = () => {
  // All fields state
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [depth, setDepth] = useState('')
  const [depthUnit, setDepthUnit] = useState('cm')

  const [gravelDepth, setGravelDepth] = useState('')
  const [gravelDepthUnit, setGravelDepthUnit] = useState('cm')
  const [edgeRebarSpacing, setEdgeRebarSpacing] = useState('')
  const [edgeRebarSpacingUnit, setEdgeRebarSpacingUnit] = useState('cm')
  const [rebarRebarSpacing, setRebarRebarSpacing] = useState('')
  const [rebarRebarSpacingUnit, setRebarRebarSpacingUnit] = useState('cm')
  const [singleRebarLength, setSingleRebarLength] = useState('')
  const [singleRebarLengthUnit, setSingleRebarLengthUnit] = useState('m')

  const [concretePrice, setConcretePrice] = useState('')
  const [concretePriceUnit, setConcretePriceUnit] = useState('PKR')
  const [gravelPrice, setGravelPrice] = useState('')
  const [gravelPriceUnit, setGravelPriceUnit] = useState('PKR')
  const [rebarPrice, setRebarPrice] = useState('')
  const [rebarPriceUnit, setRebarPriceUnit] = useState('PKR')
  const [formsPrice, setFormsPrice] = useState('')
  const [formsPriceUnit, setFormsPriceUnit] = useState('PKR')

  // Update default state for price per unit dropdowns if needed
  const [concretePricePerUnit, setConcretePricePerUnit] = useState('m3')
  const [gravelPricePerUnit, setGravelPricePerUnit] = useState('m3')
  const [rebarPricePerUnit, setRebarPricePerUnit] = useState('m')
  const [formsPricePerUnit, setFormsPricePerUnit] = useState('m')

  const [totalConcreteVolume, setTotalConcreteVolume] = useState('')
  const [totalGravelVolume, setTotalGravelVolume] = useState('')
  const [totalRebarsLength, setTotalRebarsLength] = useState('')
  const [totalRebarsPieces, setTotalRebarsPieces] = useState('')
  const [totalFormsLength, setTotalFormsLength] = useState('')

  const [concreteCost, setConcreteCost] = useState('')
  const [gravelCost, setGravelCost] = useState('')
  const [rebarCost, setRebarCost] = useState('')
  const [formsCost, setFormsCost] = useState('')
  const [totalCost, setTotalCost] = useState('')

  // Add state for material estimations dropdowns
  const [totalConcreteVolumeUnit, setTotalConcreteVolumeUnit] = useState('m3')
  const [totalGravelVolumeUnit, setTotalGravelVolumeUnit] = useState('m3')
  const [totalRebarsLengthUnit, setTotalRebarsLengthUnit] = useState('m')
  const [totalFormsLengthUnit, setTotalFormsLengthUnit] = useState('m')

  const handleClear = () => {
    setLength('')
    setLengthUnit('m')
    setWidth('')
    setWidthUnit('m')
    setDepth('')
    setDepthUnit('cm')
    setGravelDepth('')
    setGravelDepthUnit('cm')
    setEdgeRebarSpacing('')
    setEdgeRebarSpacingUnit('cm')
    setRebarRebarSpacing('')
    setRebarRebarSpacingUnit('cm')
    setSingleRebarLength('')
    setSingleRebarLengthUnit('m')
    setConcretePrice('')
    setConcretePriceUnit('PKR')
    setConcretePricePerUnit('m³')
    setGravelPrice('')
    setGravelPriceUnit('PKR')
    setGravelPricePerUnit('m³')
    setRebarPrice('')
    setRebarPriceUnit('PKR')
    setRebarPricePerUnit('m')
    setFormsPrice('')
    setFormsPriceUnit('PKR')
    setFormsPricePerUnit('m')
    setTotalConcreteVolume('')
    setTotalGravelVolume('')
    setTotalRebarsLength('')
    setTotalRebarsPieces('')
    setTotalFormsLength('')
    setConcreteCost('')
    setGravelCost('')
    setRebarCost('')
    setFormsCost('')
    setTotalCost('')
  }

  // --- Calculation logic for material estimations and costs ---

  // Calculate total concrete volume (in m³)
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    const d = parse(depth)
    if (l > 0 && w > 0 && d > 0) {
      // Convert all to meters
      const l_m = toMeters[lengthUnit] ? toMeters[lengthUnit](l) : l
      const w_m = toMeters[widthUnit] ? toMeters[widthUnit](w) : w
      const d_m = toMeters[depthUnit] ? toMeters[depthUnit](d) : d
      const vol_m3 = l_m * w_m * d_m
      setTotalConcreteVolume(fromM3[totalConcreteVolumeUnit] ? String(Number(fromM3[totalConcreteVolumeUnit](vol_m3).toFixed(6))) : String(vol_m3))
    } else {
      setTotalConcreteVolume('')
    }
  }, [length, width, depth, lengthUnit, widthUnit, depthUnit, totalConcreteVolumeUnit])

  // Calculate total gravel volume (in m³)
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    const g = parse(gravelDepth)
    if (l > 0 && w > 0 && g > 0) {
      const l_m = toMeters[lengthUnit] ? toMeters[lengthUnit](l) : l
      const w_m = toMeters[widthUnit] ? toMeters[widthUnit](w) : w
      const g_m = toMeters[gravelDepthUnit] ? toMeters[gravelDepthUnit](g) : g
      const vol_m3 = l_m * w_m * g_m
      setTotalGravelVolume(fromM3[totalGravelVolumeUnit] ? String(Number(fromM3[totalGravelVolumeUnit](vol_m3).toFixed(6))) : String(vol_m3))
    } else {
      setTotalGravelVolume('')
    }
  }, [length, width, gravelDepth, lengthUnit, widthUnit, gravelDepthUnit, totalGravelVolumeUnit])

  // Calculate total rebars length (in meters)
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    const edge = parse(edgeRebarSpacing)
    const spacing = parse(rebarRebarSpacing)
    if (l > 0 && w > 0 && edge > 0 && spacing > 0) {
      // Convert all to meters
      const l_m = toMeters[lengthUnit] ? toMeters[lengthUnit](l) : l
      const w_m = toMeters[widthUnit] ? toMeters[widthUnit](w) : w
      const edge_m = toMetersLength[edgeRebarSpacingUnit] ? toMetersLength[edgeRebarSpacingUnit](edge) : edge
      const spacing_m = toMetersLength[rebarRebarSpacingUnit] ? toMetersLength[rebarRebarSpacingUnit](spacing) : spacing

      // Number of rebars in each direction (floor to integer + 1 for both sides)
      const n_rows = Math.floor((w_m - 2 * edge_m) / spacing_m) + 1
      const n_cols = Math.floor((l_m - 2 * edge_m) / spacing_m) + 1

      // Total length: rows (horizontal rebars) + columns (vertical rebars)
      const total_rows_length = n_rows * l_m
      const total_cols_length = n_cols * w_m
      const total_length_m = total_rows_length + total_cols_length

      setTotalRebarsLength(fromMetersLength[totalRebarsLengthUnit] ? String(Number(fromMetersLength[totalRebarsLengthUnit](total_length_m).toFixed(6))) : String(total_length_m))

      // Calculate number of pieces if single rebar length is set
      const singleLen = parse(singleRebarLength)
      const singleLen_m = toMetersLength[singleRebarLengthUnit] ? toMetersLength[singleRebarLengthUnit](singleLen) : singleLen
      if (singleLen_m > 0) {
        setTotalRebarsPieces(String(Math.ceil(total_length_m / singleLen_m)))
      } else {
        setTotalRebarsPieces('')
      }
    } else {
      setTotalRebarsLength('')
      setTotalRebarsPieces('')
    }
  }, [
    length, width, edgeRebarSpacing, rebarRebarSpacing, singleRebarLength,
    lengthUnit, widthUnit, edgeRebarSpacingUnit, rebarRebarSpacingUnit, singleRebarLengthUnit,
    totalRebarsLengthUnit
  ])

  // Calculate total forms length (in meters)
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    if (l > 0 && w > 0) {
      const l_m = toMeters[lengthUnit] ? toMeters[lengthUnit](l) : l
      const w_m = toMeters[widthUnit] ? toMeters[widthUnit](w) : w
      const total_forms_m = 2 * (l_m + w_m)
      setTotalFormsLength(fromMetersLength[totalFormsLengthUnit] ? String(Number(fromMetersLength[totalFormsLengthUnit](total_forms_m).toFixed(6))) : String(total_forms_m))
    } else {
      setTotalFormsLength('')
    }
  }, [length, width, lengthUnit, widthUnit, totalFormsLengthUnit])

  // --- Material costs ---
  // Concrete cost
  React.useEffect(() => {
    const vol = parse(totalConcreteVolume)
    const price = parse(concretePrice)
    if (vol > 0 && price > 0) {
      // Convert volume to m3 for cost calculation
      const vol_m3 = toM3[totalConcreteVolumeUnit] ? toM3[totalConcreteVolumeUnit](vol) : vol
      const price_per_m3 = toM3[concretePricePerUnit] ? price / toM3[concretePricePerUnit](1) : price
      setConcreteCost(String(Number((vol_m3 * price_per_m3).toFixed(2))))
    } else {
      setConcreteCost('')
    }
  }, [totalConcreteVolume, concretePrice, totalConcreteVolumeUnit, concretePricePerUnit])

  // Gravel cost
  React.useEffect(() => {
    const vol = parse(totalGravelVolume)
    const price = parse(gravelPrice)
    if (vol > 0 && price > 0) {
      const vol_m3 = toM3[totalGravelVolumeUnit] ? toM3[totalGravelVolumeUnit](vol) : vol
      const price_per_m3 = toM3[gravelPricePerUnit] ? price / toM3[gravelPricePerUnit](1) : price
      setGravelCost(String(Number((vol_m3 * price_per_m3).toFixed(2))))
    } else {
      setGravelCost('')
    }
  }, [totalGravelVolume, gravelPrice, totalGravelVolumeUnit, gravelPricePerUnit])

  // Rebar cost
  React.useEffect(() => {
    const len = parse(totalRebarsLength)
    const price = parse(rebarPrice)
    if (len > 0 && price > 0) {
      const len_m = toMetersLength[totalRebarsLengthUnit] ? toMetersLength[totalRebarsLengthUnit](len) : len
      const price_per_m = toMetersLength[rebarPricePerUnit] ? price / toMetersLength[rebarPricePerUnit](1) : price
      setRebarCost(String(Number((len_m * price_per_m).toFixed(2))))
    } else {
      setRebarCost('')
    }
  }, [totalRebarsLength, rebarPrice, totalRebarsLengthUnit, rebarPricePerUnit])

  // Forms cost
  React.useEffect(() => {
    const len = parse(totalFormsLength)
    const price = parse(formsPrice)
    if (len > 0 && price > 0) {
      const len_m = toMetersLength[totalFormsLengthUnit] ? toMetersLength[totalFormsLengthUnit](len) : len
      const price_per_m = toMetersLength[formsPricePerUnit] ? price / toMetersLength[formsPricePerUnit](1) : price
      setFormsCost(String(Number((len_m * price_per_m).toFixed(2))))
    } else {
      setFormsCost('')
    }
  }, [totalFormsLength, formsPrice, totalFormsLengthUnit, formsPricePerUnit])

  // Total cost
  React.useEffect(() => {
    const c = parse(concreteCost)
    const g = parse(gravelCost)
    const r = parse(rebarCost)
    const f = parse(formsCost)
    const sum = c + g + r + f
    setTotalCost(sum > 0 ? String(Number(sum.toFixed(2))) : '')
  }, [concreteCost, gravelCost, rebarCost, formsCost])

  // Validation logic
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')
  const [gravelDepthError, setGravelDepthError] = useState('')
  const [edgeRebarSpacingError, setEdgeRebarSpacingError] = useState('')
  const [rebarRebarSpacingError, setRebarRebarSpacingError] = useState('')
  const [singleRebarLengthError, setSingleRebarLengthError] = useState('')
  const [concretePriceError, setConcretePriceError] = useState('')
  const [gravelPriceError, setGravelPriceError] = useState('')
  const [rebarPriceError, setRebarPriceError] = useState('')
  const [formsPriceError, setFormsPriceError] = useState('')

  React.useEffect(() => {
    setLengthError(length && parse(length) <= 0 ? 'Length should be greater than 0.' : '')
    setWidthError(width && parse(width) <= 0 ? 'Width should be greater than 0.' : '')
    setDepthError(depth && parse(depth) <= 0 ? 'Depth should be greater than 0.' : '')
    setGravelDepthError(gravelDepth && parse(gravelDepth) < 0 ? 'Gravel depth cannot be negative.' : '')
    setEdgeRebarSpacingError(edgeRebarSpacing && parse(edgeRebarSpacing) < 0 ? 'Edge-rebar spacing cannot be negative.' : '')
    setRebarRebarSpacingError(rebarRebarSpacing && parse(rebarRebarSpacing) <= 0 ? 'Rebar-rebar spacing should be greater than 0.' : '')
    setSingleRebarLengthError(singleRebarLength && parse(singleRebarLength) <= 0 ? 'Single rebar length should be greater than 0.' : '')
    setConcretePriceError(concretePrice && parse(concretePrice) < 0 ? 'Concrete price cannot be negative.' : '')
    setGravelPriceError(gravelPrice && parse(gravelPrice) < 0 ? 'Gravel price cannot be negative.' : '')
    setRebarPriceError(rebarPrice && parse(rebarPrice) < 0 ? 'Rebar price cannot be negative.' : '')
    setFormsPriceError(formsPrice && parse(formsPrice) < 0 ? 'Forms price cannot be negative.' : '')
  }, [
    length, width, depth, gravelDepth, edgeRebarSpacing, rebarRebarSpacing, singleRebarLength,
    concretePrice, gravelPrice, rebarPrice, formsPrice
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Concrete Driveway Cost Calculator</h1>
      <div className="w-full max-w-xs sm:max-w-md space-y-6">
        {/* Concrete driveway dimensions */}
        <Section title="Concrete driveway dimensions">
          <Field
            label="Length"
            value={length}
            onChange={setLength}
            unitValue={lengthUnit}
            onUnitChange={u => handleLengthUnitChange(u, length, lengthUnit, setLength, setLengthUnit)}
            unitOptions={lengthWidthUnitOptions}
            error={!!lengthError}
            errorMsg={lengthError}
          />
          <Field
            label="Width"
            value={width}
            onChange={setWidth}
            unitValue={widthUnit}
            onUnitChange={u => handleWidthUnitChange(u, width, widthUnit, setWidth, setWidthUnit)}
            unitOptions={lengthWidthUnitOptions}
            error={!!widthError}
            errorMsg={widthError}
          />
          <Field
            label="Depth"
            value={depth}
            onChange={setDepth}
            unitValue={depthUnit}
            onUnitChange={u => handleDepthUnitChange(u, depth, depthUnit, setDepth, setDepthUnit)}
            unitOptions={depthUnitOptions}
            error={!!depthError}
            errorMsg={depthError}
          />
        </Section>
        {/* Detail planning */}
        <Section title="Detail planning">
          <Field
            label="Gravel depth"
            value={gravelDepth}
            onChange={setGravelDepth}
            unitValue={gravelDepthUnit}
            onUnitChange={u => handleGravelDepthUnitChange(u, gravelDepth, gravelDepthUnit, setGravelDepth, setGravelDepthUnit)}
            unitOptions={gravelDepthUnitOptions}
            error={!!gravelDepthError}
            errorMsg={gravelDepthError}
          />
          <Field
            label="Edge-rebar spacing"
            value={edgeRebarSpacing}
            onChange={setEdgeRebarSpacing}
            unitValue={edgeRebarSpacingUnit}
            onUnitChange={u => handleEdgeRebarSpacingUnitChange(u, edgeRebarSpacing, edgeRebarSpacingUnit, setEdgeRebarSpacing, setEdgeRebarSpacingUnit)}
            unitOptions={edgeRebarSpacingUnitOptionsOnly}
            error={!!edgeRebarSpacingError}
            errorMsg={edgeRebarSpacingError}
          />
          <Field
            label="Rebar-rebar spacing"
            value={rebarRebarSpacing}
            onChange={setRebarRebarSpacing}
            unitValue={rebarRebarSpacingUnit}
            onUnitChange={u => handleRebarRebarSpacingUnitChange(u, rebarRebarSpacing, rebarRebarSpacingUnit, setRebarRebarSpacing, setRebarRebarSpacingUnit)}
            unitOptions={edgeRebarSpacingUnitOptions}
            error={!!rebarRebarSpacingError}
            errorMsg={rebarRebarSpacingError}
          />
          <Field
            label="Single rebar length"
            value={singleRebarLength}
            onChange={setSingleRebarLength}
            unitValue={singleRebarLengthUnit}
            onUnitChange={u => handleSingleRebarLengthUnitChange(u, singleRebarLength, singleRebarLengthUnit, setSingleRebarLength, setSingleRebarLengthUnit)}
            unitOptions={singleRebarLengthUnitOptions}
            error={!!singleRebarLengthError}
            errorMsg={singleRebarLengthError}
          />
        </Section>
        {/* Materials prices */}
        <Section title="Materials prices">
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Concrete</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={concretePriceUnit}
                onChange={e => setConcretePriceUnit(e.target.value)}
                style={{ width: 70 }}
              >
                {priceUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={concretePrice}
                onChange={e => setConcretePrice(e.target.value)}
                placeholder=""
                className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left font-mono ${concretePriceError ? 'border-red-400' : 'border-gray-200'}`}
                style={concretePriceError ? { borderColor: '#f87171', color: '#b91c1c', background: '#fef2f2', fontWeight: 600, fontSize: 20, letterSpacing: 2 } : { fontWeight: 600, fontSize: 20, letterSpacing: 2 }}
              />
              <span className="text-gray-400 font-semibold">/</span>
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={concretePricePerUnit}
                onChange={e =>
                  handlePricePerUnitChange(
                    e.target.value,
                    concretePrice,
                    concretePricePerUnit,
                    setConcretePrice,
                    setConcretePricePerUnit,
                    toM3,
                    fromM3
                  )
                }
                style={{ width: 110 }}
              >
                {concreteGravelPricePerUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {concretePriceError && (
              <div className="mt-1 text-sm text-red-600">{concretePriceError}</div>
            )}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Gravel</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={gravelPriceUnit}
                onChange={e => setGravelPriceUnit(e.target.value)}
                style={{ width: 70 }}
              >
                {priceUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={gravelPrice}
                onChange={e => setGravelPrice(e.target.value)}
                placeholder=""
                className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left font-mono ${gravelPriceError ? 'border-red-400' : 'border-gray-200'}`}
                style={gravelPriceError ? { borderColor: '#f87171', color: '#b91c1c', background: '#fef2f2', fontWeight: 600, fontSize: 20, letterSpacing: 2 } : { fontWeight: 600, fontSize: 20, letterSpacing: 2 }}
              />
              <span className="text-gray-400 font-semibold">/</span>
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={gravelPricePerUnit}
                onChange={e =>
                  handlePricePerUnitChange(
                    e.target.value,
                    gravelPrice,
                    gravelPricePerUnit,
                    setGravelPrice,
                    setGravelPricePerUnit,
                    toM3,
                    fromM3
                  )
                }
                style={{ width: 110 }}
              >
                {concreteGravelPricePerUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {gravelPriceError && (
              <div className="mt-1 text-sm text-red-600">{gravelPriceError}</div>
            )}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Rebar</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={rebarPriceUnit}
                onChange={e => setRebarPriceUnit(e.target.value)}
                style={{ width: 70 }}
              >
                {priceUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={rebarPrice}
                onChange={e => setRebarPrice(e.target.value)}
                placeholder=""
                className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left font-mono ${rebarPriceError ? 'border-red-400' : 'border-gray-200'}`}
                style={rebarPriceError ? { borderColor: '#f87171', color: '#b91c1c', background: '#fef2f2', fontWeight: 600, fontSize: 20, letterSpacing: 2 } : { fontWeight: 600, fontSize: 20, letterSpacing: 2 }}
              />
              <span className="text-gray-400 font-semibold">/</span>
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={rebarPricePerUnit}
                onChange={e =>
                  handlePricePerUnitChange(
                    e.target.value,
                    rebarPrice,
                    rebarPricePerUnit,
                    setRebarPrice,
                    setRebarPricePerUnit,
                    toMetersLength,
                    fromMetersLength
                  )
                }
                style={{ width: 110 }}
              >
                {rebarFormPricePerUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {rebarPriceError && (
              <div className="mt-1 text-sm text-red-600">{rebarPriceError}</div>
            )}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Form</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={formsPriceUnit}
                onChange={e => setFormsPriceUnit(e.target.value)}
                style={{ width: 70 }}
              >
                {priceUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={formsPrice}
                onChange={e => setFormsPrice(e.target.value)}
                placeholder=""
                className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0 text-left font-mono ${formsPriceError ? 'border-red-400' : 'border-gray-200'}`}
                style={formsPriceError ? { borderColor: '#f87171', color: '#b91c1c', background: '#fef2f2', fontWeight: 600, fontSize: 20, letterSpacing: 2 } : { fontWeight: 600, fontSize: 20, letterSpacing: 2 }}
              />
              <span className="text-gray-400 font-semibold">/</span>
              <select
                className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                value={formsPricePerUnit}
                onChange={e =>
                  handlePricePerUnitChange(
                    e.target.value,
                    formsPrice,
                    formsPricePerUnit,
                    setFormsPrice,
                    setFormsPricePerUnit,
                    toMetersLength,
                    fromMetersLength
                  )
                }
                style={{ width: 110 }}
              >
                {rebarFormPricePerUnitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {formsPriceError && (
              <div className="mt-1 text-sm text-red-600">{formsPriceError}</div>
            )}
          </div>
        </Section>
        {/* Material estimations */}
        <Section title="Material estimations">
          <Field
            label="Total concrete volume"
            value={totalConcreteVolume}
            onChange={setTotalConcreteVolume}
            unitValue={totalConcreteVolumeUnit}
            onUnitChange={u => handleTotalConcreteVolumeUnitChange(u, totalConcreteVolume, totalConcreteVolumeUnit, setTotalConcreteVolume, setTotalConcreteVolumeUnit)}
            unitOptions={concreteGravelVolumeUnitOptions}
          />
          <Field
            label="Total gravel volume"
            value={totalGravelVolume}
            onChange={setTotalGravelVolume}
            unitValue={totalGravelVolumeUnit}
            onUnitChange={u => handleTotalGravelVolumeUnitChange(u, totalGravelVolume, totalGravelVolumeUnit, setTotalGravelVolume, setTotalGravelVolumeUnit)}
            unitOptions={gravelVolumeUnitOptions}
          />
          <Field
            label="Total rebars length"
            value={totalRebarsLength}
            onChange={setTotalRebarsLength}
            unitValue={totalRebarsLengthUnit}
            onUnitChange={u => handleTotalRebarsLengthUnitChange(u, totalRebarsLength, totalRebarsLengthUnit, setTotalRebarsLength, setTotalRebarsLengthUnit)}
            unitOptions={rebarsLengthUnitOptions}
          />
          <Field
            label="# of rebar pieces"
            value={totalRebarsPieces}
            onChange={setTotalRebarsPieces}
          />
          <Field
            label="Total forms length"
            value={totalFormsLength}
            onChange={setTotalFormsLength}
            unitValue={totalFormsLengthUnit}
            onUnitChange={u => handleTotalFormsLengthUnitChange(u, totalFormsLength, totalFormsLengthUnit, setTotalFormsLength, setTotalFormsLengthUnit)}
            unitOptions={formsLengthUnitOptions}
          />
        </Section>
        {/* Materials costs */}
        <Section title="Materials costs">
          <MaterialCostField label="Concrete" value={concreteCost} onChange={setConcreteCost} />
          <MaterialCostField label="Gravel" value={gravelCost} onChange={setGravelCost} />
          <MaterialCostField label="Rebar" value={rebarCost} onChange={setRebarCost} />
          <MaterialCostField label="Forms" value={formsCost} onChange={setFormsCost} />
          <MaterialCostField label="Total cost" value={totalCost} onChange={setTotalCost} />
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
