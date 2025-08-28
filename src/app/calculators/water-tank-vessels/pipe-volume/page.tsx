'use client'
import React, { useState } from 'react'

// Inner diameter and length units
const lengthUnits = [
  { label: "millimeters", symbol: "mm" },
  { label: "centimeters", symbol: "cm" },
  { label: "meters", symbol: "m" },
  { label: "inches", symbol: "in" },
  { label: "feet", symbol: "ft" },
  { label: "yards", symbol: "yd" }
]

// Liquid density units
const densityUnits = [
  { label: "kilograms per cubic meter", symbol: "kg/m³" },
  { label: "kilograms per cubic decimeter", symbol: "kg/dm³" },
  { label: "kilograms per liter", symbol: "kg/L" },
  { label: "grams per liter", symbol: "g/L" },
  { label: "grams per deciliter", symbol: "g/dL" },
  { label: "grams per milliliter", symbol: "g/mL" },
  { label: "grams per cubic centimeter", symbol: "g/cm³" },
  { label: "ounces per cubic inch", symbol: "oz/cu in" },
  { label: "pounds per cubic inch", symbol: "lb/cu in" },
  { label: "pounds per cubic feet", symbol: "lb/cu ft" },
  { label: "pounds per gallon (US)", symbol: "lb/US gal" },
  { label: "milligrams per liter", symbol: "mg/L" }
]

// Mass units
const massUnits = [
  { label: "milligrams", symbol: "mg" },
  { label: "grams", symbol: "g" },
  { label: "decagrams", symbol: "dag" },
  { label: "kilograms", symbol: "kg" },
  { label: "ounces", symbol: "oz" },
  { label: "pounds", symbol: "lb" }
]

// Volume units
const volumeUnits = [
  { label: "cubic centimeters", symbol: "cm³" },
  { label: "cubic decimeters", symbol: "dm³" },
  { label: "cubic meters", symbol: "m³" },
  { label: "cubic inches", symbol: "cu in" },
  { label: "cubic feet", symbol: "cu ft" },
  { label: "cubic yards", symbol: "cu yd" },
  { label: "milliliters", symbol: "ml" },
  { label: "liters", symbol: "l" },
  { label: "gallons (US)", symbol: "US gal" },
  { label: "gallons (UK)", symbol: "UK gal" },
  { label: "fluid ounces (US)", symbol: "US fl oz" },
  { label: "fluid ounces (UK)", symbol: "UK fl oz" }
]

// Standard conversion helpers (to SI base and from SI base)
const lengthToMeters: Record<string, (v: number) => number> = {
  mm: v => v / 1000,
  cm: v => v / 100,
  m: v => v,
  in: v => v * 0.0254,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
}
const metersToLength: Record<string, (v: number) => number> = {
  mm: v => v * 1000,
  cm: v => v * 100,
  m: v => v,
  in: v => v / 0.0254,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
}
const densityToKgPerM3: Record<string, (v: number) => number> = {
  'kg/m³': v => v,
  'kg/dm³': v => v * 1000,
  'kg/L': v => v * 1000,
  'g/L': v => v,
  'g/dL': v => v * 10,
  'g/mL': v => v * 1000,
  'g/cm³': v => v * 1000,
  'oz/cu in': v => v * 1729.994,
  'lb/cu in': v => v * 27679.9,
  'lb/cu ft': v => v * 16.0185,
  'lb/US gal': v => v * 119.826,
  'mg/L': v => v / 1000,
}
const kgPerM3ToDensity: Record<string, (v: number) => number> = {
  'kg/m³': v => v,
  'kg/dm³': v => v / 1000,
  'kg/L': v => v / 1000,
  'g/L': v => v,
  'g/dL': v => v / 10,
  'g/mL': v => v / 1000,
  'g/cm³': v => v / 1000,
  'oz/cu in': v => v / 1729.994,
  'lb/cu in': v => v / 27679.9,
  'lb/cu ft': v => v / 16.0185,
  'lb/US gal': v => v / 119.826,
  'mg/L': v => v * 1000,
}
const massToKg: Record<string, (v: number) => number> = {
  mg: v => v / 1e6,
  g: v => v / 1000,
  dag: v => v / 100,
  kg: v => v,
  oz: v => v * 0.0283495,
  lb: v => v * 0.453592,
}
const kgToMass: Record<string, (v: number) => number> = {
  mg: v => v * 1e6,
  g: v => v * 1000,
  dag: v => v * 100,
  kg: v => v,
  oz: v => v / 0.0283495,
  lb: v => v / 0.453592,
}
const volumeToM3: Record<string, (v: number) => number> = {
  'cm³': v => v / 1e6,
  'dm³': v => v / 1000,
  'm³': v => v,
  'cu in': v => v * 1.63871e-5,
  'cu ft': v => v * 0.0283168,
  'cu yd': v => v * 0.764555,
  'ml': v => v / 1e6,
  'l': v => v / 1000,
  'US gal': v => v * 0.00378541,
  'UK gal': v => v * 0.00454609,
  'US fl oz': v => v * 2.9574e-5,
  'UK fl oz': v => v * 2.8413e-5,
}
const m3ToVolume: Record<string, (v: number) => number> = {
  'cm³': v => v * 1e6,
  'dm³': v => v * 1000,
  'm³': v => v,
  'cu in': v => v / 1.63871e-5,
  'cu ft': v => v / 0.0283168,
  'cu yd': v => v / 0.764555,
  'ml': v => v * 1e6,
  'l': v => v * 1000,
  'US gal': v => v / 0.00378541,
  'UK gal': v => v / 0.00454609,
  'US fl oz': v => v / 2.9574e-5,
  'UK fl oz': v => v / 2.8413e-5,
}

const Section = ({
  title,
  children,
  open = true,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <span className="font-semibold text-gray-900">{title}</span>
    </div>
    {open && <div className="px-4 py-3">{children}</div>}
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
  disabled = false,
  type = 'text',
  error,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  unitValue?: string
  onUnitChange?: (v: string) => void
  unitOptions?: { label: string; symbol: string }[]
  placeholder?: string
  disabled?: boolean
  type?: string
  error?: string
}) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 text-base font-medium outline-none focus:border-blue-400 min-w-0
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}
        `}
      />
      {unitOptions && unitValue && onUnitChange && (
        <select
          className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
          value={unitValue}
          onChange={e => onUnitChange(e.target.value)}
        >
          {unitOptions.map(u => (
            <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
          ))}
        </select>
      )}
    </div>
    {error && (
      <div className="flex items-center mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        {error}
      </div>
    )}
  </div>
)

const page = () => {
  // State for all fields and their display units
  const [innerDiameter, setInnerDiameter] = useState('')
  const [innerDiameterUnit, setInnerDiameterUnit] = useState('cm')
  const [innerDiameterBase, setInnerDiameterBase] = useState('')

  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('cm')
  const [lengthBase, setLengthBase] = useState('')

  const [liquidDensity, setLiquidDensity] = useState(' ')
  const [liquidDensityUnit, setLiquidDensityUnit] = useState('kg/m³')
  const [liquidDensityBase, setLiquidDensityBase] = useState('')

  const [mass, setMass] = useState('')
  const [massUnit, setMassUnit] = useState('kg')
  const [massBase, setMassBase] = useState('')

  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('l')
  const [volumeBase, setVolumeBase] = useState('')

  // --- Handlers for each field/unit to keep conversions independent ---

  // Inner diameter
  const handleInnerDiameterChange = (val: string) => {
    setInnerDiameter(val)
    const num = parseFloat(val)
    setInnerDiameterBase(!isNaN(num) ? String(lengthToMeters[innerDiameterUnit](num)) : '')
  }
  const handleInnerDiameterUnitChange = (unit: string) => {
    if (innerDiameter) {
      const num = parseFloat(innerDiameter)
      if (!isNaN(num)) {
        const meters = lengthToMeters[innerDiameterUnit](num)
        setInnerDiameter(metersToLength[unit] ? String(Number(metersToLength[unit](meters).toFixed(6))) : String(meters))
      }
    }
    setInnerDiameterUnit(unit)
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

  // Liquid density
  const handleLiquidDensityChange = (val: string) => {
    setLiquidDensity(val)
    const num = parseFloat(val)
    setLiquidDensityBase(!isNaN(num) ? String(densityToKgPerM3[liquidDensityUnit](num)) : '')
  }
  const handleLiquidDensityUnitChange = (unit: string) => {
    if (liquidDensity) {
      const num = parseFloat(liquidDensity)
      if (!isNaN(num)) {
        const base = densityToKgPerM3[liquidDensityUnit](num)
        setLiquidDensity(kgPerM3ToDensity[unit] ? String(Number(kgPerM3ToDensity[unit](base).toFixed(6))) : String(base))
      }
    }
    setLiquidDensityUnit(unit)
  }

  // Mass
  const handleMassChange = (val: string) => {
    // Prevent manual editing, mass is always auto-calculated
  }
  const handleMassUnitChange = (unit: string) => {
    // Only convert the display value for mass, not the base or any other field
    if (massBase) {
      const num = parseFloat(massBase)
      setMass(kgToMass[unit] ? String(Number(kgToMass[unit](num).toFixed(6))) : massBase)
    }
    setMassUnit(unit)
  }

  // Volume
  const handleVolumeChange = (val: string) => {
    setVolume(val)
    const num = parseFloat(val)
    setVolumeBase(!isNaN(num) ? String(volumeToM3[volumeUnit](num)) : '')
  }
  const handleVolumeUnitChange = (unit: string) => {
    if (volume) {
      const num = parseFloat(volume)
      if (!isNaN(num)) {
        const base = volumeToM3[volumeUnit](num)
        setVolume(m3ToVolume[unit] ? String(Number(m3ToVolume[unit](base).toFixed(6))) : String(base))
      }
    }
    setVolumeUnit(unit)
  }

  // --- Calculation logic for pipe volume and mass ---
  React.useEffect(() => {
    // Calculate volume if inner diameter and length are present
    const d = parseFloat(innerDiameterBase)
    const l = parseFloat(lengthBase)
    if (!isNaN(d) && !isNaN(l) && d > 0 && l > 0) {
      // V = π × (d/2)^2 × l
      const radius = d / 2
      const v_m3 = Math.PI * radius * radius * l
      setVolumeBase(String(v_m3))
      setVolume(m3ToVolume[volumeUnit] ? String(Number(m3ToVolume[volumeUnit](v_m3).toFixed(6))) : String(v_m3))
      // If density is present, calculate mass
      const density = parseFloat(liquidDensityBase)
      if (!isNaN(density) && density > 0) {
        const m_kg = v_m3 * density
        setMassBase(String(m_kg))
        setMass(kgToMass[massUnit] ? String(Number(kgToMass[massUnit](m_kg).toFixed(6))) : String(m_kg))
      } else {
        setMass('')
        setMassBase('')
      }
    } else {
      setVolume('')
      setVolumeBase('')
      setMass('')
      setMassBase('')
    }
    // eslint-disable-next-line
  }, [innerDiameterBase, lengthBase, volumeUnit, liquidDensityBase, massUnit])

  // When density or mass unit changes, update mass display
  React.useEffect(() => {
    const m_kg = parseFloat(massBase)
    if (!isNaN(m_kg)) {
      setMass(kgToMass[massUnit] ? String(Number(kgToMass[massUnit](m_kg).toFixed(6))) : String(m_kg))
    }
    // eslint-disable-next-line
  }, [massUnit, massBase])

  // When volume unit changes, update volume display
  React.useEffect(() => {
    const v_m3 = parseFloat(volumeBase)
    if (!isNaN(v_m3)) {
      setVolume(m3ToVolume[volumeUnit] ? String(Number(m3ToVolume[volumeUnit](v_m3).toFixed(6))) : String(v_m3))
    }
    // eslint-disable-next-line
  }, [volumeUnit])

  const handleClear = () => {
    setInnerDiameter('')
    setInnerDiameterUnit('cm')
    setInnerDiameterBase('')
    setLength('')
    setLengthUnit('cm')
    setLengthBase('')
    setLiquidDensity('997')
    setLiquidDensityUnit('kg/m³')
    setLiquidDensityBase('')
    setMass('')
    setMassUnit('kg')
    setMassBase('')
    setVolume('')
    setVolumeUnit('l')
    setVolumeBase('')
  }

  const validatePositive = (value: string) => {
    if (!value) return null
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return false
    return true
  }

  const getValidationMessage = (field: string) => {
    switch (field) {
      case 'innerDiameter':
        return 'Diameter must be more than 0.'
      case 'length':
        return 'Length must be more than 0.'
      case 'liquidDensity':
        return 'Density must be more than 0.'
      case 'mass':
        return 'Mass must be more than 0.'
      case 'volume':
        return 'Volume must be more than 0.'
      default:
        return ''
    }
  }

  // Validation states
  const innerDiameterValid = validatePositive(innerDiameter)
  const lengthValid = validatePositive(length)
  const liquidDensityValid = validatePositive(liquidDensity)
  const massValid = validatePositive(mass)
  const volumeValid = validatePositive(volume)

  return (
    <div className="min-h-screen bg-[#f7f9fd] flex flex-col items-center py-8">
      <h1 className="font-bold text-2xl mb-6 tracking-tight">Pipe Volume Calculator</h1>
      <div className="w-full max-w-md">
        <Section title="Pipe dimensions">
          <Field
            label="Inner diameter"
            value={innerDiameter}
            onChange={handleInnerDiameterChange}
            unitValue={innerDiameterUnit}
            onUnitChange={handleInnerDiameterUnitChange}
            unitOptions={lengthUnits}
            error={innerDiameterValid === false ? getValidationMessage('innerDiameter') : undefined}
          />
          <Field
            label="Length"
            value={length}
            onChange={handleLengthChange}
            unitValue={lengthUnit}
            onUnitChange={handleLengthUnitChange}
            unitOptions={lengthUnits}
            error={lengthValid === false ? getValidationMessage('length') : undefined}
          />
        </Section>
        <Section title="Liquid">
          <Field
            label="Liquid density"
            value={liquidDensity}
            onChange={handleLiquidDensityChange}
            unitValue={liquidDensityUnit}
            onUnitChange={handleLiquidDensityUnitChange}
            unitOptions={densityUnits}
            error={liquidDensityValid === false ? getValidationMessage('liquidDensity') : undefined}
          />
          <Field
            label="Mass of liquid"
            value={mass}
            onChange={handleMassChange}
            unitValue={massUnit}
            onUnitChange={handleMassUnitChange}
            unitOptions={massUnits}
            error={mass && massValid === false ? getValidationMessage('mass') : undefined}
            disabled
          />
        </Section>
        <Section title="Result">
          <Field
            label="Volume"
            value={volume}
            onChange={handleVolumeChange}
            unitValue={volumeUnit}
            onUnitChange={handleVolumeUnitChange}
            unitOptions={volumeUnits}
            error={volume && volumeValid === false ? getValidationMessage('volume') : undefined}
          />
        </Section>
        <button
          className="mt-3 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-400 transition"
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
997