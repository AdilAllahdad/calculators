'use client'
import React, { useState } from 'react'

const lengthUnits = [
  { value: "m", label: "meters (m)" },
  { value: "km", label: "kilometers (km)" },
  { value: "ft", label: "feet (ft)" },
  { value: "yd", label: "yards (yd)" },
  { value: "mi", label: "miles (mi)" }
]
const widthUnits = [
  { value: "cm", label: "centimeters (cm)" },
  { value: "m", label: "meters (m)" },
  { value: "ft", label: "feet (ft)" },
  { value: "yd", label: "yards (yd)" }
]
const areaUnits = [
  { value: "m²", label: "square meters (m²)" },
  { value: "km²", label: "square kilometers (km²)" },
  { value: "in²", label: "square inches (in²)" },
  { value: "ft²", label: "square feet (ft²)" }
]
const thicknessUnits = [
  { value: "mm", label: "millimeters (mm)" },
  { value: "cm", label: "centimeters (cm)" },
  { value: "m", label: "meters (m)" },
  { value: "in", label: "inches (in)" },
  { value: "ft", label: "feet (ft)" }
]
const volumeUnits = [
  { value: "m³", label: "cubic meters (m³)" },
  { value: "cu_ft", label: "cubic feet (cu ft)" },
  { value: "us_gal", label: "gallons (US) (US gal)" },
  { value: "uk_gal", label: "gallons (UK) (UK gal)" }
]
const densityUnits = [
  { value: "kg_per_m³", label: "kilograms per cubic meter (kg/m³)" },
  { value: "lb_per_cu_ft", label: "pounds per cubic feet (lb/cu ft)" }
]
const weightUnits = [
 { value: "kg", label: "kilograms (kg)" },
  { value: "t", label: "metric tons (t)" },
  { value: "lb", label: "pounds (lb)" },
  { value: "us_ton", label: "US short tons (US ton)" },
  { value: "long_ton", label: "imperial tons (long ton)" }
]


const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
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
  disabled = false,
  type = 'text',
  rightLabel,
  error,
  errorMsg,
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
  disabled?: boolean
  type?: string
  rightLabel?: string
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
        className={`flex-1 px-3 py-2 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0`}
      />
      {unitOptions && unitValue && onUnitChange && (
        <select
          className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
          value={unitValue}
          onChange={e => onUnitChange(e.target.value)}
        >
          {unitOptions.map(u => (
            <option key={u.value} value={u.value}>{u.value}</option>
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

// Conversion helpers for each unit type
const lengthToMeters: Record<string, (v: number) => number> = {
  m: v => v,
  km: v => v * 1000,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
  mi: v => v * 1609.34,
  cm: v => v / 100,
}
const metersToLength: Record<string, (v: number) => number> = {
  m: v => v,
  km: v => v / 1000,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
  mi: v => v / 1609.34,
  cm: v => v * 100,
}

const widthToMeters: Record<string, (v: number) => number> = {
  cm: v => v / 100,
  m: v => v,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
}
const metersToWidth: Record<string, (v: number) => number> = {
  cm: v => v * 100,
  m: v => v,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
}

const areaToM2: Record<string, (v: number) => number> = {
  'm²': v => v,
  'km²': v => v * 1e6,
  'in²': v => v * 0.00064516,
  'ft²': v => v * 0.092903,
}
const m2ToArea: Record<string, (v: number) => number> = {
  'm²': v => v,
  'km²': v => v / 1e6,
  'in²': v => v / 0.00064516,
  'ft²': v => v / 0.092903,
}

const thicknessToMeters: Record<string, (v: number) => number> = {
  mm: v => v / 1000,
  cm: v => v / 100,
  m: v => v,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
}
const metersToThickness: Record<string, (v: number) => number> = {
  mm: v => v * 1000,
  cm: v => v * 100,
  m: v => v,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
}

// Add conversion helpers for volume, density, and weight
const volumeToM3: Record<string, (v: number) => number> = {
  'm³': v => v,
  'cu_ft': v => v * 0.0283168,
  'us_gal': v => v * 0.00378541,
  'uk_gal': v => v * 0.00454609,
}
const m3ToVolume: Record<string, (v: number) => number> = {
  'm³': v => v,
  'cu_ft': v => v / 0.0283168,
  'us_gal': v => v / 0.00378541,
  'uk_gal': v => v / 0.00454609,
}

const densityToKgPerM3: Record<string, (v: number) => number> = {
  'kg/m³': v => v,
  'kg_per_m³': v => v,
  'lb_per_cu_ft': v => v * 16.0185,
}
const kgPerM3ToDensity: Record<string, (v: number) => number> = {
  'kg/m³': v => v,
  'kg_per_m³': v => v,
  'lb_per_cu_ft': v => v / 16.0185,
}

const weightToKg: Record<string, (v: number) => number> = {
  'kg': v => v,
  't': v => v * 1000,
  'lb': v => v * 0.453592,
  'us_ton': v => v * 907.185,
  'long_ton': v => v * 1016.05,
}
const kgToWeight: Record<string, (v: number) => number> = {
  'kg': v => v,
  't': v => v / 1000,
  'lb': v => v / 0.453592,
  'us_ton': v => v / 907.185,
  'long_ton': v => v / 1016.05,
}

const InfoSection = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asphalt Calculator</h1>
    
        
      </div>
      
    </div>
  )
}

const page = () => {
  // State for all fields and their base values
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [lengthBase, setLengthBase] = useState('')

  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [widthBase, setWidthBase] = useState('')

  const [area, setArea] = useState('')
  const [areaUnit, setAreaUnit] = useState('m²')
  const [areaBase, setAreaBase] = useState('')

  const [thickness, setThickness] = useState('')
  const [thicknessUnit, setThicknessUnit] = useState('cm')
  const [thicknessBase, setThicknessBase] = useState('')

  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('m³')
  const [density, setDensity] = useState('2400')
  const [densityUnit, setDensityUnit] = useState('kg/m³')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('t')
  const [costPerWeight, setCostPerWeight] = useState('')
  const [costUnit, setCostUnit] = useState('PKR')
  const [costWeightUnit, setCostWeightUnit] = useState('t')
  const [totalCost, setTotalCost] = useState('')

  // --- Validation state ---
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [areaError, setAreaError] = useState('')
  const [thicknessError, setThicknessError] = useState('')
  const [densityError, setDensityError] = useState('')
  const [costPerWeightError, setCostPerWeightError] = useState('')

  // Helper to parse and convert to number, fallback to 0
  const parse = (v: string) => {
    const n = parseFloat(v)
    return isNaN(n) ? 0 : n
  }

  // --- Calculation logic ---
  // Calculate area (m²) from length and width
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    if (l > 0 && w > 0) {
      const l_m = lengthToMeters[lengthUnit] ? lengthToMeters[lengthUnit](l) : l
      const w_m = widthToMeters[widthUnit] ? widthToMeters[widthUnit](w) : w
      const area_m2 = l_m * w_m
      setArea(area_m2 > 0 ? String(Number(m2ToArea[areaUnit](area_m2).toFixed(6))) : '')
      setAreaBase(String(area_m2))
    } else {
      setArea('')
      setAreaBase('')
    }
  }, [length, width, lengthUnit, widthUnit, areaUnit])

  // Calculate volume (m³) from area and thickness
  React.useEffect(() => {
    const a = parse(area)
    const t = parse(thickness)
    if (a > 0 && t > 0) {
      const a_m2 = areaToM2[areaUnit] ? areaToM2[areaUnit](a) : a
      const t_m = thicknessToMeters[thicknessUnit] ? thicknessToMeters[thicknessUnit](t) : t
      const vol_m3 = a_m2 * t_m
      setVolume(vol_m3 > 0 ? String(Number(m3ToVolume[volumeUnit](vol_m3).toFixed(6))) : '')
    } else {
      setVolume('')
    }
  }, [area, thickness, areaUnit, thicknessUnit, volumeUnit])

  // Calculate weight (kg) from volume and density
  React.useEffect(() => {
    const v = parse(volume)
    const d = parse(density)
    if (v > 0 && d > 0) {
      const v_m3 = volumeToM3[volumeUnit] ? volumeToM3[volumeUnit](v) : v
      const d_kgm3 = densityToKgPerM3[densityUnit === 'kg/m³' ? 'kg_per_m³' : densityUnit]
        ? densityToKgPerM3[densityUnit === 'kg/m³' ? 'kg_per_m³' : densityUnit](d)
        : d
      const weight_kg = v_m3 * d_kgm3
      setWeight(weight_kg > 0 ? String(Number(kgToWeight[weightUnit](weight_kg).toFixed(6))) : '')
    } else {
      setWeight('')
    }
  }, [volume, density, volumeUnit, densityUnit, weightUnit])

  // Calculate total cost (costUnit) from weight and cost per weight
  React.useEffect(() => {
    const w = parse(weight)
    const cpw = parse(costPerWeight)
    if (w > 0 && cpw > 0) {
      // Convert weight to kg, cost per weight to per kg
      const w_kg = weightToKg[weightUnit] ? weightToKg[weightUnit](w) : w
      const cost_per_kg = cpw / (weightToKg[costWeightUnit] ? weightToKg[costWeightUnit](1) : 1)
      const total = w_kg * cost_per_kg
      setTotalCost(total > 0 ? String(Number(total.toFixed(2))) : '')
    } else {
      setTotalCost('')
    }
  }, [weight, costPerWeight, weightUnit, costWeightUnit])

  // --- Validation logic ---
  React.useEffect(() => {
    // Length validation
    if (length && parse(length) <= 0) {
      setLengthError('Please input a positive value for the length.')
    } else {
      setLengthError('')
    }
    // Width validation
    if (width && parse(width) <= 0) {
      setWidthError('Please input a positive value for the width.')
    } else {
      setWidthError('')
    }
    // Area validation
    if (area && parse(area) <= 0) {
      setAreaError('Please input a positive value for the area.')
    } else {
      setAreaError('')
    }
    // Thickness validation
    if (thickness && parse(thickness) <= 0) {
      setThicknessError('Please input a positive value for the thickness.')
    } else {
      setThicknessError('')
    }
    // Density validation (2200–2400 kg/m³ or equivalent)
    if (density) {
      let d = parse(density)
      let d_kgm3 = densityToKgPerM3[densityUnit === 'kg/m³' ? 'kg_per_m³' : densityUnit]
        ? densityToKgPerM3[densityUnit === 'kg/m³' ? 'kg_per_m³' : densityUnit](d)
        : d
      if (d_kgm3 < 2100 || d_kgm3 > 2500) {
        setDensityError('Asphalt density ranges around 2200 to 2400 kg/m³ (138 to 150 lb/cu ft). Please input a value within, or near, this range.')
      } else {
        setDensityError('')
      }
    } else {
      setDensityError('')
    }
    // Cost per weight validation (must be positive)
    if (costPerWeight && parse(costPerWeight) <= 0) {
      setCostPerWeightError('Please input a positive value for the cost per weight.')
    } else {
      setCostPerWeightError('')
    }
  }, [length, width, area, thickness, density, densityUnit, costPerWeight, costWeightUnit])

  // --- Cost per weight conversion logic (independent) ---
  // When dropdown changes, convert the value to the new unit, but keep the actual cost per kg the same
  const handleCostWeightUnitChange = (unit: string) => {
    if (costPerWeight) {
      const val = parse(costPerWeight)
      if (!isNaN(val)) {
        // Convert current value (in old unit) to per kg, then to new unit
        const perKg = val / (weightToKg[costWeightUnit] ? weightToKg[costWeightUnit](1) : 1)
        const newVal = perKg * (weightToKg[unit] ? weightToKg[unit](1) : 1)
        setCostPerWeight(String(Number(newVal.toFixed(6))))
      }
    }
    setCostWeightUnit(unit)
  }

  // Length
  const handleLengthChange = (val: string) => {
    setLength(val)
    const num = parseFloat(val)
    setLengthBase(!isNaN(num) ? String(lengthToMeters[lengthUnit](num)) : '')
  }
  const handleLengthUnitChange = (unit: string) => {
    if (length) {
      const num = parseFloat(length)
      if (!isNaN(num)) {
        const meters = lengthToMeters[lengthUnit](num)
        setLength(metersToLength[unit] ? String(Number(metersToLength[unit](meters).toFixed(6))) : String(meters))
      }
    }
    setLengthUnit(unit)
  }

  // Width
  const handleWidthChange = (val: string) => {
    setWidth(val)
    const num = parseFloat(val)
    setWidthBase(!isNaN(num) ? String(widthToMeters[widthUnit](num)) : '')
  }
  const handleWidthUnitChange = (unit: string) => {
    if (width) {
      const num = parseFloat(width)
      if (!isNaN(num)) {
        const meters = widthToMeters[widthUnit](num)
        setWidth(metersToWidth[unit] ? String(Number(metersToWidth[unit](meters).toFixed(6))) : String(meters))
      }
    }
    setWidthUnit(unit)
  }

  // Area
  const handleAreaChange = (val: string) => {
    setArea(val)
    const num = parseFloat(val)
    setAreaBase(!isNaN(num) ? String(areaToM2[areaUnit](num)) : '')
  }
  const handleAreaUnitChange = (unit: string) => {
    if (area) {
      const num = parseFloat(area)
      if (!isNaN(num)) {
        const m2 = areaToM2[areaUnit](num)
        setArea(m2ToArea[unit] ? String(Number(m2ToArea[unit](m2).toFixed(6))) : String(m2))
      }
    }
    setAreaUnit(unit)
  }

  // Thickness
  const handleThicknessChange = (val: string) => {
    setThickness(val)
    const num = parseFloat(val)
    setThicknessBase(!isNaN(num) ? String(thicknessToMeters[thicknessUnit](num)) : '')
  }
  const handleThicknessUnitChange = (unit: string) => {
    if (thickness) {
      const num = parseFloat(thickness)
      if (!isNaN(num)) {
        const meters = thicknessToMeters[thicknessUnit](num)
        setThickness(metersToThickness[unit] ? String(Number(metersToThickness[unit](meters).toFixed(6))) : String(meters))
      }
    }
    setThicknessUnit(unit)
  }

  // Volume
  const handleVolumeChange = (val: string) => setVolume(val)
  const handleVolumeUnitChange = (unit: string) => {
    if (volume) {
      const num = parseFloat(volume)
      if (!isNaN(num)) {
        const m3 = volumeToM3[volumeUnit] ? volumeToM3[volumeUnit](num) : num
        setVolume(m3ToVolume[unit] ? String(Number(m3ToVolume[unit](m3).toFixed(6))) : String(m3))
      }
    }
    setVolumeUnit(unit)
  }

  // Density
  const handleDensityChange = (val: string) => setDensity(val)
  const handleDensityUnitChange = (unit: string) => {
    if (density) {
      const num = parseFloat(density)
      if (!isNaN(num)) {
        // Accept both 'kg/m³' and 'kg_per_m³' as the same
        const fromUnit = densityUnit === 'kg/m³' ? 'kg_per_m³' : densityUnit
        const toUnit = unit === 'kg/m³' ? 'kg_per_m³' : unit
        const kgm3 = densityToKgPerM3[fromUnit] ? densityToKgPerM3[fromUnit](num) : num
        setDensity(kgPerM3ToDensity[toUnit] ? String(Number(kgPerM3ToDensity[toUnit](kgm3).toFixed(6))) : String(kgm3))
      }
    }
    setDensityUnit(unit)
  }

  // Weight
  const handleWeightChange = (val: string) => setWeight(val)
  const handleWeightUnitChange = (unit: string) => {
    if (weight) {
      const num = parseFloat(weight)
      if (!isNaN(num)) {
        const kg = weightToKg[weightUnit] ? weightToKg[weightUnit](num) : num
        setWeight(kgToWeight[unit] ? String(Number(kgToWeight[unit](kg).toFixed(6))) : String(kg))
      }
    }
    setWeightUnit(unit)
  }

  // Cost per weight
  const handleCostPerWeightChange = (val: string) => setCostPerWeight(val)

  const handleClear = () => {
    setLength('')
    setLengthUnit('m')
    setWidth('')
    setWidthUnit('m')
    setArea('')
    setAreaUnit('m²')
    setThickness('')
    setThicknessUnit('cm')
    setVolume('')
    setVolumeUnit('m³')
    setDensity('2400')
    setDensityUnit('kg/m³')
    setWeight('')
    setWeightUnit('t')
    setCostPerWeight('')
    setCostUnit('PKR')
    setCostWeightUnit('t')
    setTotalCost('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-12 flex flex-col items-center">
      <InfoSection />
      <div className="w-full max-w-2xl px-6 py-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <Section title="Asphalt pavement dimensions">
          <Field
            label="Length"
            value={length}
            onChange={handleLengthChange}
            unitValue={lengthUnit}
            onUnitChange={handleLengthUnitChange}
            unitOptions={lengthUnits}
            error={!!lengthError}
            errorMsg={lengthError}
          />
          <Field
            label="Width"
            value={width}
            onChange={handleWidthChange}
            unitValue={widthUnit}
            onUnitChange={handleWidthUnitChange}
            unitOptions={widthUnits}
            error={!!widthError}
            errorMsg={widthError}
          />
          <Field
            label="Area"
            value={area}
            onChange={handleAreaChange}
            unitValue={areaUnit}
            onUnitChange={handleAreaUnitChange}
            unitOptions={areaUnits}
            info
            infoTip="Area of the pavement"
            error={!!areaError}
            errorMsg={areaError}
          />
          <Field
            label="Thickness"
            value={thickness}
            onChange={handleThicknessChange}
            unitValue={thicknessUnit}
            onUnitChange={handleThicknessUnitChange}
            unitOptions={thicknessUnits}
            info
            infoTip="Thickness of the pavement"
            error={!!thicknessError}
            errorMsg={thicknessError}
          />
        </Section>
        <Section title="Asphalt requirement">
          <Field
            label="Volume"
            value={volume}
            onChange={handleVolumeChange}
            unitValue={volumeUnit}
            onUnitChange={handleVolumeUnitChange}
            unitOptions={volumeUnits}
          />
          <Field
            label="Asphalt density"
            value={density}
            onChange={handleDensityChange}
            unitValue={densityUnit}
            onUnitChange={handleDensityUnitChange}
            unitOptions={densityUnits}
            error={!!densityError}
            errorMsg={densityError}
          />
          <Field
            label="Weight"
            value={weight}
            onChange={handleWeightChange}
            unitValue={weightUnit}
            onUnitChange={handleWeightUnitChange}
            unitOptions={weightUnits}
            info
            infoTip="Total asphalt weight"
          />
        </Section>
        <Section title="Cost of asphalt">
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Cost per weight</span>
              <span className="ml-1 text-gray-400 cursor-pointer" title="Cost per weight">⋯</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={costPerWeight}
                onChange={e => setCostPerWeight(e.target.value)}
                placeholder="PKR"
                className={`flex-1 px-4 py-3 border ${costPerWeightError ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0`}
              />
              <select
                className="border border-gray-200 rounded-lg bg-white px-3 py-3 text-blue-700 font-semibold outline-none"
                value={costWeightUnit}
                onChange={e => handleCostWeightUnitChange(e.target.value)}
              >
                {weightUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.value}</option>
                ))}
              </select>
            </div>
            {costPerWeightError && (
              <div className="mt-1 text-sm text-red-600">{costPerWeightError}</div>
            )}
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium">Total asphalt cost</span>
              <span className="ml-1 text-gray-400 cursor-pointer" title="Total asphalt cost">⋯</span>
            </div>
            <input
              type="text"
              value={totalCost}
              onChange={e => setTotalCost(e.target.value)}
              placeholder="PKR"
              disabled
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0"
            />
          </div>
        </Section>
        <button
          className="mt-5 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-400 transition text-lg font-semibold"
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
