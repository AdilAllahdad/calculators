'use client'
import React, { useState } from 'react'

const units = [
  { label: 'm', value: 'm' },
  { label: 'ft', value: 'ft' },
  { label: 'yd', value: 'yd' },
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
]

const poolVolumeUnits = [
  { label: 'cubic meters (m³)', value: 'm³' },
  { label: 'cubic feet (cu ft)', value: 'ft³' },
  { label: 'cubic yards (cu yd)', value: 'yd³' },
  { label: 'liters (l)', value: 'l' },
  { label: 'gallons (US) (US gal)', value: 'US gal' },
  { label: 'gallons (UK) (UK gal)', value: 'UK gal' },
  { label: 'tablespoons (15ml) (tbsp)', value: 'tbsp' },
  { label: 'teaspoons (5ml) (tsp)', value: 'tsp' },
]

// Only for water price dropdown, use values as in the screenshot
const waterPriceUnits = [
  { label: 'cubic meter (m³)', value: 'm³' },
  { label: 'cubic foot (cu ft)', value: 'ft³' },
  { label: 'cubic yard (cu yd)', value: 'yd³' },
  { label: 'liter (l)', value: 'l' },
  { label: 'gallon (US) (US gal)', value: 'US gal' },
  { label: 'gallon (UK) (UK gal)', value: 'UK gal' },
  { label: '1000 US gallon (1k US gal)', value: '1000 US gal' },
]

// Standard conversion helpers for length and volume
const lengthToMeters: Record<string, (v: number) => number> = {
  m: v => v,
  ft: v => v * 0.3048,
  yd: v => v * 0.9144,
  cm: v => v / 100,
  in: v => v * 0.0254,
}
const metersToLength: Record<string, (v: number) => number> = {
  m: v => v,
  ft: v => v / 0.3048,
  yd: v => v / 0.9144,
  cm: v => v * 100,
  in: v => v / 0.0254,
}
const volumeToLiters: Record<string, (v: number) => number> = {
  'l': v => v,
  'm³': v => v * 1000,
  'ft³': v => v * 28.3168,
  'yd³': v => v * 764.555,
  'US gal': v => v * 3.78541,
  'UK gal': v => v * 4.54609,
  'tbsp': v => v * 0.015,
  'tsp': v => v * 0.005,
}
const litersToVolume: Record<string, (v: number) => number> = {
  'l': v => v,
  'm³': v => v / 1000,
  'ft³': v => v / 28.3168,
  'yd³': v => v / 764.555,
  'US gal': v => v / 3.78541,
  'UK gal': v => v / 4.54609,
  'tbsp': v => v / 0.015,
  'tsp': v => v / 0.005,
}
const priceToLiter: Record<string, (v: number) => number> = {
  'm³': v => v * 1000,
  'ft³': v => v * 28.3168,
  'yd³': v => v * 764.555,
  'l': v => v,
  'US gal': v => v * 3.78541,
  'UK gal': v => v * 4.54609,
  '1000 US gal': v => v * 3785.41,
}
const literToPrice: Record<string, (v: number) => number> = {
  'm³': v => v / 1000,
  'ft³': v => v / 28.3168,
  'yd³': v => v / 764.555,
  'l': v => v,
  'US gal': v => v / 3.78541,
  'UK gal': v => v / 4.54609,
  '1000 US gal': v => v / 3785.41,
}

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
  error,
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
  error?: string
}) => (
  <div className="mb-3">
    <div className="flex items-center mb-1">
      <span className="text-[15px] text-gray-700">{label}</span>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={infoTip || ''}>ⓘ</span>
      )}
    </div>
    <div className="flex items-center gap-2">
      <input
        type="text"
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
          className="border border-gray-200 rounded-md bg-white px-2 py-2 text-blue-700 font-semibold outline-none max-w-[110px] truncate"
          value={unitValue}
          onChange={e => onUnitChange(e.target.value)}
        >
          {unitOptions.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
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

const Section = ({
  title,
  children,
  open,
  onToggle,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
  onToggle?: () => void
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-3">
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
      <span className="font-semibold text-gray-800">{title}</span>
      {onToggle && (
        <button
          className="text-blue-600 text-lg font-bold focus:outline-none"
          onClick={onToggle}
          type="button"
        >
          {open ? '▲' : '▼'}
        </button>
      )}
    </div>
    {(!onToggle || open) && <div className="px-4 py-3">{children}</div>}
  </div>
)

// Validation helpers
const getValidationMessage = (field: string, value: string) => {
  if (!value) return undefined
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) {
    switch (field) {
      case 'length':
        return 'Length must be positive.'
      case 'width':
        return 'Width must be positive.'
      case 'depth1':
        return 'Depth 1 must be positive.'
      case 'depth2':
        return 'Depth 2 must be positive.'
      case 'poolVolume':
        return 'Pool volume must be positive.'
      case 'waterPrice':
        return 'Water price must be positive.'
      default:
        return 'Value must be positive.'
    }
  }
  return undefined
}

const page = () => {
  const [shape, setShape] = useState<'rectangle' | 'oval'>('rectangle')
  const [dimOpen, setDimOpen] = useState(true)
  const [volOpen, setVolOpen] = useState(true)
  const [costOpen, setCostOpen] = useState(true)

  // Inputs and their base values (meters/liters)
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [lengthBase, setLengthBase] = useState('')

  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [widthBase, setWidthBase] = useState('')

  const [depth1, setDepth1] = useState('')
  const [depth1Unit, setDepth1Unit] = useState('m')
  const [depth1Base, setDepth1Base] = useState('')

  const [depth2, setDepth2] = useState('')
  const [depth2Unit, setDepth2Unit] = useState('m')
  const [depth2Base, setDepth2Base] = useState('')

  const [poolVolume, setPoolVolume] = useState('')
  const [poolVolumeUnit, setPoolVolumeUnit] = useState('l')
  const [poolVolumeBase, setPoolVolumeBase] = useState('')

  const [waterPrice, setWaterPrice] = useState('')
  const [waterPriceUnit, setWaterPriceUnit] = useState('UK gal')
  const [waterPriceBase, setWaterPriceBase] = useState('') // This stores PKR per liter for calculation

  const [waterCost, setWaterCost] = useState('')

  // --- Handlers for each field/unit to keep conversions independent ---

  // Length
  const handleLengthChange = (val: string) => {
    setLength(val)
    const num = parseFloat(val)
    setLengthBase(!isNaN(num) ? String(lengthToMeters[lengthUnit](num)) : '')
  }
  const handleLengthUnitChange = (unit: string) => {
    if (lengthBase) {
      const num = parseFloat(lengthBase)
      setLength(metersToLength[unit] ? String(Number(metersToLength[unit](num).toFixed(6))) : lengthBase)
    }
    setLengthUnit(unit)
  }

  // Width
  const handleWidthChange = (val: string) => {
    setWidth(val)
    const num = parseFloat(val)
    setWidthBase(!isNaN(num) ? String(lengthToMeters[widthUnit](num)) : '')
  }
  const handleWidthUnitChange = (unit: string) => {
    if (widthBase) {
      const num = parseFloat(widthBase)
      setWidth(metersToLength[unit] ? String(Number(metersToLength[unit](num).toFixed(6))) : widthBase)
    }
    setWidthUnit(unit)
  }

  // Depth 1
  const handleDepth1Change = (val: string) => {
    setDepth1(val)
    const num = parseFloat(val)
    setDepth1Base(!isNaN(num) ? String(lengthToMeters[depth1Unit](num)) : '')
  }
  const handleDepth1UnitChange = (unit: string) => {
    if (depth1Base) {
      const num = parseFloat(depth1Base)
      setDepth1(metersToLength[unit] ? String(Number(metersToLength[unit](num).toFixed(6))) : depth1Base)
    }
    setDepth1Unit(unit)
  }

  // Depth 2
  const handleDepth2Change = (val: string) => {
    setDepth2(val)
    const num = parseFloat(val)
    setDepth2Base(!isNaN(num) ? String(lengthToMeters[depth2Unit](num)) : '')
  }
  const handleDepth2UnitChange = (unit: string) => {
    if (depth2Base) {
      const num = parseFloat(depth2Base)
      setDepth2(metersToLength[unit] ? String(Number(metersToLength[unit](num).toFixed(6))) : depth2Base)
    }
    setDepth2Unit(unit)
  }

  // Pool volume
  const handlePoolVolumeChange = (val: string) => {
    setPoolVolume(val)
    // Do not update poolVolumeBase here; only display changes
  }
  const handlePoolVolumeUnitChange = (unit: string) => {
    // Only convert the display value for poolVolume, not the base or any other field
    if (poolVolume) {
      const num = parseFloat(poolVolume)
      if (!isNaN(num)) {
        // Convert current value to liters, then to new unit for display
        const liters = volumeToLiters[poolVolumeUnit] ? volumeToLiters[poolVolumeUnit](num) : num
        setPoolVolume(litersToVolume[unit] ? String(Number(litersToVolume[unit](liters).toFixed(6))) : String(liters))
      }
    }
    setPoolVolumeUnit(unit)
  }

  // Water price - FIXED VERSION
  const handleWaterPriceChange = (val: string) => {
    setWaterPrice(val)
    // Update the base value (PKR per liter) for calculation
    const num = parseFloat(val)
    if (!isNaN(num)) {
      // Convert from current unit to PKR per liter
      const pricePerLiter = priceToLiter[waterPriceUnit] ? num / priceToLiter[waterPriceUnit](1) : num
      setWaterPriceBase(String(pricePerLiter))
    } else {
      setWaterPriceBase('')
    }
  }

  const handleWaterPriceUnitChange = (unit: string) => {
    // Only convert the display value, don't change the base calculation value
    if (waterPrice) {
      const num = parseFloat(waterPrice)
      if (!isNaN(num)) {
        // Convert from current unit to new unit for display only
        const currentPricePerLiter = priceToLiter[waterPriceUnit] ? num / priceToLiter[waterPriceUnit](1) : num
        const newDisplayValue = priceToLiter[unit] ? currentPricePerLiter * priceToLiter[unit](1) : currentPricePerLiter
        setWaterPrice(String(Number(newDisplayValue.toFixed(6))))
        // Don't change waterPriceBase - it should remain the same for consistent calculation
      }
    }
    setWaterPriceUnit(unit)
  }

  // --- Calculation logic for pool volume and water cost ---
  React.useEffect(() => {
    // Calculate pool volume if all dimensions are present
    const l = parseFloat(lengthBase)
    const w = parseFloat(widthBase)
    const d1 = parseFloat(depth1Base)
    const d2 = parseFloat(depth2Base)
    if (!isNaN(l) && !isNaN(w) && !isNaN(d1) && !isNaN(d2)) {
      let liters = 0
      if (shape === 'rectangle') {
        // V = l * w * (d1 + d2) / 2
        liters = l * w * ((d1 + d2) / 2)
      } else if (shape === 'oval') {
        // V = π * l * w / 4 * (d1 + d2) / 2
        liters = (Math.PI * l * w / 4) * ((d1 + d2) / 2)
      }
      // Convert m³ to liters for base calculation
      const litersValue = liters * 1000
      setPoolVolumeBase(String(litersValue))

      // For display: convert liters to selected display unit
      setPoolVolume(
        litersToVolume[poolVolumeUnit]
          ? String(Number(litersToVolume[poolVolumeUnit](litersValue).toFixed(2)))
          : String(litersValue)
      )
    }
    // eslint-disable-next-line
  }, [lengthBase, widthBase, depth1Base, depth2Base, shape, poolVolumeUnit])

  React.useEffect(() => {
    // Calculate water cost using waterPriceBase (which is always PKR per liter)
    const liters = parseFloat(poolVolumeBase)
    const pricePerLiter = parseFloat(waterPriceBase)
    
    if (!isNaN(liters) && !isNaN(pricePerLiter) && pricePerLiter > 0) {
      setWaterCost((liters * pricePerLiter).toFixed(2))
    } else {
      setWaterCost('')
    }
  }, [poolVolumeBase, waterPriceBase]) // Only depend on waterPriceBase, not waterPrice or waterPriceUnit

  const handleClear = () => {
    setLength('')
    setLengthUnit('m')
    setLengthBase('')
    setWidth('')
    setWidthUnit('m')
    setWidthBase('')
    setDepth1('')
    setDepth1Unit('m')
    setDepth1Base('')
    setDepth2('')
    setDepth2Unit('m')
    setDepth2Base('')
    setPoolVolume('')
    setPoolVolumeUnit('l')
    setPoolVolumeBase('')
    setWaterPrice('')
    setWaterPriceUnit('UK gal')
    setWaterPriceBase('')
    setWaterCost('')
  }

  // Validation messages
  const lengthError = getValidationMessage('length', length)
  const widthError = getValidationMessage('width', width)
  const depth1Error = getValidationMessage('depth1', depth1)
  const depth2Error = getValidationMessage('depth2', depth2)
  const poolVolumeError = getValidationMessage('poolVolume', poolVolume)
  const waterPriceError = getValidationMessage('waterPrice', waterPrice)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-8 flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-6 tracking-tight">Pool Calculator</h1>
      <div className="w-[340px]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-3 px-4 py-3">
          <div className="font-semibold text-gray-800 mb-2">Pool shape</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={shape === 'rectangle'}
                onChange={() => setShape('rectangle')}
                className="accent-blue-600 mr-2"
              />
              <span className="font-medium">Rectangle</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={shape === 'oval'}
                onChange={() => setShape('oval')}
                className="accent-blue-600 mr-2"
              />
              <span className="font-medium">Oval</span>
            </label>
          </div>
        </div>
        <Section title="Dimensions" open={dimOpen} onToggle={() => setDimOpen(v => !v)}>
          <Field
            label="Length"
            value={length}
            onChange={handleLengthChange}
            unitValue={lengthUnit}
            onUnitChange={handleLengthUnitChange}
            unitOptions={units}
            error={lengthError}
          />
          <Field
            label="Width"
            value={width}
            onChange={handleWidthChange}
            unitValue={widthUnit}
            onUnitChange={handleWidthUnitChange}
            unitOptions={units}
            info
            infoTip="Width of the pool"
            error={widthError}
          />
          <Field
            label="Depth 1"
            value={depth1}
            onChange={handleDepth1Change}
            unitValue={depth1Unit}
            onUnitChange={handleDepth1UnitChange}
            unitOptions={units}
            info
            infoTip="Shallow end"
            error={depth1Error}
          />
          <Field
            label="Depth 2"
            value={depth2}
            onChange={handleDepth2Change}
            unitValue={depth2Unit}
            onUnitChange={handleDepth2UnitChange}
            unitOptions={units}
            info
            infoTip="Deep end"
            error={depth2Error}
          />
        </Section>
        <Section title="Volume" open={volOpen} onToggle={() => setVolOpen(v => !v)}>
          <Field
            label="Pool volume"
            value={poolVolume}
            onChange={handlePoolVolumeChange}
            unitValue={poolVolumeUnit}
            onUnitChange={handlePoolVolumeUnitChange}
            unitOptions={poolVolumeUnits}
            error={poolVolumeError}
          />
        </Section>
        <Section title="Water cost" open={costOpen} onToggle={() => setCostOpen(v => !v)}>
          <Field
            label="Water price"
            value={waterPrice}
            onChange={handleWaterPriceChange}
            unitValue={waterPriceUnit}
            onUnitChange={handleWaterPriceUnitChange}
            unitOptions={waterPriceUnits}
            placeholder="PKR"
            error={waterPriceError}
          />
          <Field
            label={`Water cost (for this ${shape} pool)`}
            value={waterCost}
            onChange={setWaterCost}
            placeholder="PKR"
            disabled
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