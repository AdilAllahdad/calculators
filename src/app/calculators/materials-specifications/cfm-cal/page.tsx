'use client'
import React, { useState } from 'react'

const lengthUnits = [
  { label: "millimeters", short: "mm", toMeter: (v: number) => v / 1000, fromMeter: (v: number) => v * 1000 },
  { label: "centimeters", short: "cm", toMeter: (v: number) => v / 100, fromMeter: (v: number) => v * 100 },
  { label: "meters", short: "m", toMeter: (v: number) => v, fromMeter: (v: number) => v },
  { label: "inches", short: "in", toMeter: (v: number) => v * 0.0254, fromMeter: (v: number) => v / 0.0254 },
  { label: "feet", short: "ft", toMeter: (v: number) => v * 0.3048, fromMeter: (v: number) => v / 0.3048 },
  { label: "yards", short: "yd", toMeter: (v: number) => v * 0.9144, fromMeter: (v: number) => v / 0.9144 },
]

const areaUnits = [
  { label: "square meters", short: "m²", toSqMeter: (v: number) => v, fromSqMeter: (v: number) => v },
  { label: "square feet", short: "ft²", toSqMeter: (v: number) => v * 0.092903, fromSqMeter: (v: number) => v / 0.092903 },
  { label: "square yards", short: "yd²", toSqMeter: (v: number) => v * 0.836127, fromSqMeter: (v: number) => v / 0.836127 },
]

const volumeUnits = [
  { label: "cubic meters", short: "m³", toCuMeter: (v: number) => v, fromCuMeter: (v: number) => v },
  { label: "cubic feet", short: "cu ft", toCuMeter: (v: number) => v * 0.0283168, fromCuMeter: (v: number) => v / 0.0283168 },
  { label: "cubic yards", short: "cu yd", toCuMeter: (v: number) => v * 0.764555, fromCuMeter: (v: number) => v / 0.764555 },
]

const airflowOtherUnits = [
  { label: "cubic feet per second", short: "ft³/s", toCfm: (v: number) => v * 60, fromCfm: (v: number) => v / 60 },
  { label: "cubic feet per hour", short: "ft³/hr", toCfm: (v: number) => v / 60, fromCfm: (v: number) => v * 60 },
  { label: "cubic feet per day", short: "ft³/day", toCfm: (v: number) => v / 1440, fromCfm: (v: number) => v * 1440 },
  { label: "cubic meters per second", short: "m³/s", toCfm: (v: number) => v * 2118.88, fromCfm: (v: number) => v / 2118.88 },
  { label: "cubic meters per minute", short: "m³/min", toCfm: (v: number) => v * 35.3147, fromCfm: (v: number) => v / 35.3147 },
  { label: "cubic meters per hour", short: "m³/hr", toCfm: (v: number) => v * 0.588577, fromCfm: (v: number) => v / 0.588577 },
  { label: "cubic meters per day", short: "m³/day", toCfm: (v: number) => v * 0.024524, fromCfm: (v: number) => v / 0.024524 },
]

const InfoIcon: React.FC<{ tip?: string }> = ({ tip }) => (
  <span className="ml-1 cursor-pointer text-gray-400" title={tip || ''}>ⓘ</span>
)

interface DropdownProps {
  options: { label: string, short: string }[]
  value: string
  onChange: (v: string) => void
}
const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => (
  <select
    className="border border-gray-700 bg-white text-blue-500 font-medium rounded-md h-10 px-2 min-w-[70px] outline-none text-base"
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ minWidth: 70 }}
  >
    {options.map(opt => (
      <option key={opt.short} value={opt.short}>{opt.short}</option>
    ))}
  </select>
)

interface FieldProps {
  label: string
  unitOptions?: { label: string, short: string }[]
  unitValue?: string
  onUnitChange?: (v: string) => void
  info?: boolean
  infoTip?: string
  placeholder?: string
  disabled?: boolean
  value?: string
  onChange?: (v: string) => void
  rightLabel?: string
}
const Field: React.FC<FieldProps & { error?: string }> = ({
  label,
  unitOptions,
  unitValue,
  onUnitChange,
  info,
  infoTip,
  placeholder = '',
  disabled = false,
  value = '',
  onChange,
  rightLabel,
  error,
}) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      <span className="font-medium text-gray-900">{label}</span>
      {info && <InfoIcon tip={infoTip} />}
    </div>
    <div className="flex items-center gap-2">
      <div className="flex flex-row w-full">
        <input
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={`flex-1 px-3 py-2 border rounded-l-md text-base h-10 outline-none font-semibold
            ${disabled ? 'bg-gray-50 text-gray-900 border-gray-700' : 'bg-white text-gray-900 border-gray-700'}
            ${error === undefined ? '' : error ? 'border-red-500 bg-red-50' : 'border-gray-700'}
            ${unitOptions ? 'rounded-r-none' : 'rounded-r-md'}
          `}
          readOnly={disabled}
        />
        {unitOptions && unitValue && onUnitChange && (
          <Dropdown options={unitOptions} value={unitValue} onChange={onUnitChange} />
        )}
      </div>
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

interface SectionProps {
  title: string
  children: React.ReactNode
}
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-5 min-w-[320px] max-w-[370px]">
    <div className="font-semibold mb-3">{title}</div>
    {children}
  </div>
)

const getLengthUnit = (short: string) => lengthUnits.find(u => u.short === short)!
const getAreaUnit = (short: string) => areaUnits.find(u => u.short === short)!
const getVolumeUnit = (short: string) => volumeUnits.find(u => u.short === short)!
const getAirflowOtherUnit = (short: string) => airflowOtherUnits.find(u => u.short === short)!

type LastEdit = 'ach' | 'cfm' | null

const Page: React.FC = () => {
  // Store all values in meters for length/width/height, m² for area, m³ for volume
  const [inputs, setInputs] = useState({
    length: '', // meters
    width: '',  // meters
    ceilingHeight: '', // meters
    floorArea: '', // m² (optional, if user enters directly)
    ach: '', // air changes per hour
    cfm: '', // cubic feet per minute
  })
  // Store selected display units for each field
  const [unitsState, setUnitsState] = useState({
    length: 'm',
    width: 'm',
    ceilingHeight: 'm',
    floorArea: 'm²',
    volume: 'm³',
    airflowOther: 'ft³/s',
  })
  // Track which field was last edited for ACH/CFM calculation direction
  const [lastEdit, setLastEdit] = useState<LastEdit>(null)

  // Helper to get display value for a field
  const getDisplayValue = (field: 'length' | 'width' | 'ceilingHeight') => {
    const value = parseFloat(inputs[field])
    if (isNaN(value)) return ''
    const fromMeter = getLengthUnit(unitsState[field]).fromMeter
    return fromMeter(value).toString()
  }

  // Helper to set value in meters when user types in display unit
  const handleDisplayChange = (field: 'length' | 'width' | 'ceilingHeight') => (displayValue: string) => {
    const num = parseFloat(displayValue)
    if (isNaN(num)) {
      setInputs(prev => ({ ...prev, [field]: '' }))
      return
    }
    const toMeter = getLengthUnit(unitsState[field]).toMeter
    setInputs(prev => ({ ...prev, [field]: toMeter(num).toString() }))
  }

  // Floor area: allow user to enter directly, or calculate from length/width
  const getFloorArea = () => {
    if (inputs.floorArea) {
      // User entered area directly (stored in m²)
      const area_m2 = parseFloat(inputs.floorArea)
      if (isNaN(area_m2)) return ''
      return (getAreaUnit(unitsState.floorArea).fromSqMeter(area_m2)).toString()
    }
    // Otherwise, calculate from length and width
    const l = parseFloat(inputs.length)
    const w = parseFloat(inputs.width)
    if (isNaN(l) || isNaN(w)) return ''
    const area_m2 = l * w
    return (getAreaUnit(unitsState.floorArea).fromSqMeter(area_m2)).toFixed(3)
  }

  // Set floor area (convert to m²)
  const handleFloorAreaChange = (displayValue: string) => {
    const num = parseFloat(displayValue)
    if (isNaN(num)) {
      setInputs(prev => ({ ...prev, floorArea: '' }))
      return
    }
    const toSqMeter = getAreaUnit(unitsState.floorArea).toSqMeter
    setInputs(prev => ({ ...prev, floorArea: toSqMeter(num).toString() }))
  }

  // Volume calculation (always in meters, convert for display)
  const getVolume = () => {
    // Use floorArea if provided, else length*width
    const area_m2 = inputs.floorArea
      ? parseFloat(inputs.floorArea)
      : (() => {
          const l = parseFloat(inputs.length)
          const w = parseFloat(inputs.width)
          if (isNaN(l) || isNaN(w)) return NaN
          return l * w
        })()
    const h = parseFloat(inputs.ceilingHeight)
    if (isNaN(area_m2) || isNaN(h)) return ''
    const vol_m3 = area_m2 * h
    return (getVolumeUnit(unitsState.volume).fromCuMeter(vol_m3)).toFixed(3)
  }

  // Set volume (not user-editable)
  // CFM calculation: if lastEdit is 'ach', calculate CFM; if 'cfm', calculate ACH
  const getCFM = () => {
    const vol = parseFloat(getVolume())
    if (isNaN(vol)) return ''
    // Convert volume to cubic feet for CFM calculation
    const vol_ft3 = getVolumeUnit(unitsState.volume).toCuMeter(vol) / 0.0283168
    if (lastEdit === 'ach' || !inputs.cfm) {
      const ach = parseFloat(inputs.ach)
      if (isNaN(ach)) return ''
      return ((vol_ft3 * ach) / 60).toFixed(2)
    } else if (lastEdit === 'cfm') {
      return inputs.cfm
    }
    return ''
  }

  // ACH calculation: if lastEdit is 'cfm', calculate ACH; if 'ach', use input
  const getACH = () => {
    const vol = parseFloat(getVolume())
    if (isNaN(vol)) return ''
    const vol_ft3 = getVolumeUnit(unitsState.volume).toCuMeter(vol) / 0.0283168
    if (lastEdit === 'cfm') {
      const cfm = parseFloat(inputs.cfm)
      if (isNaN(cfm)) return ''
      return ((cfm * 60) / vol_ft3).toFixed(2)
    } else if (lastEdit === 'ach' || !inputs.ach) {
      return inputs.ach
    }
    return ''
  }

  // Airflow in other units
  const getAirflowOther = () => {
    const cfm = parseFloat(getCFM())
    if (isNaN(cfm)) return ''
    return getAirflowOtherUnit(unitsState.airflowOther).fromCfm(cfm).toFixed(3)
  }

  // Handlers for CFM/ACH input
  const handleACHChange = (v: string) => {
    setInputs(prev => ({ ...prev, ach: v }))
    setLastEdit('ach')
  }
  const handleCFMChange = (v: string) => {
    setInputs(prev => ({ ...prev, cfm: v }))
    setLastEdit('cfm')
  }

  // When user changes the unit, update only the display unit, keep value in meters/m²/m³
  const handleUnitChange = (field: keyof typeof unitsState) => (value: string) => {
    setUnitsState(prev => ({ ...prev, [field]: value }))
  }

  const handleClear = () => {
    setInputs({
      length: '',
      width: '',
      ceilingHeight: '',
      floorArea: '',
      ach: '',
      cfm: '',
    })
    setLastEdit(null)
  }

  // Add validation helpers
  const validatePositive = (value: string) => {
    if (!value) return null
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return false
    return true
  }

  const getValidationMessage = (field: string) => {
    switch (field) {
      case 'length':
        return 'Please input a positive value for the length of the room.'
      case 'width':
        return 'Please input a positive value for the width of the room.'
      case 'ceilingHeight':
        return 'Please input a positive value for the ceiling height of the room.'
      case 'floorArea':
        return 'Please input a positive value for the floor area of the room.'
      case 'ach':
        return 'Please input a positive value for air changes per hour.'
      case 'cfm':
        return 'Please input a positive value for airflow (CFM).'
      default:
        return ''
    }
  }

  // Validation states
  const lengthValid = validatePositive(getDisplayValue('length'))
  const widthValid = validatePositive(getDisplayValue('width'))
  const ceilingHeightValid = validatePositive(getDisplayValue('ceilingHeight'))
  const floorAreaValid = validatePositive(getFloorArea())
  const achValid = validatePositive(getACH())
  const cfmValid = validatePositive(getCFM())

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-8 flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-7 tracking-tight">
        CFM Calculator
      </h1>
      <div className="flex flex-col gap-5">
        <Section title="Room dimensions">
          <Field
            label="Length"
            unitOptions={lengthUnits}
            unitValue={unitsState.length}
            onUnitChange={handleUnitChange('length')}
            info
            infoTip="Room length"
            value={getDisplayValue('length')}
            onChange={handleDisplayChange('length')}
            error={lengthValid === false ? getValidationMessage('length') : undefined}
          />
          <Field
            label="Width"
            unitOptions={lengthUnits}
            unitValue={unitsState.width}
            onUnitChange={handleUnitChange('width')}
            info
            infoTip="Room width"
            value={getDisplayValue('width')}
            onChange={handleDisplayChange('width')}
            error={widthValid === false ? getValidationMessage('width') : undefined}
          />
          <div className="text-xs text-gray-500 mb-2 -mt-2">
            Or enter floor area directly:
          </div>
          <Field
            label="Floor area"
            unitOptions={areaUnits}
            unitValue={unitsState.floorArea}
            onUnitChange={handleUnitChange('floorArea')}
            info
            infoTip="Room floor area"
            value={getFloorArea()}
            onChange={handleFloorAreaChange}
            error={inputs.floorArea && floorAreaValid === false ? getValidationMessage('floorArea') : undefined}
          />
          <Field
            label="Ceiling height"
            unitOptions={lengthUnits}
            unitValue={unitsState.ceilingHeight}
            onUnitChange={handleUnitChange('ceilingHeight')}
            info
            infoTip="Room ceiling height"
            value={getDisplayValue('ceilingHeight')}
            onChange={handleDisplayChange('ceilingHeight')}
            error={ceilingHeightValid === false ? getValidationMessage('ceilingHeight') : undefined}
          />
          <Field
            label="Volume"
            unitOptions={volumeUnits}
            unitValue={unitsState.volume}
            onUnitChange={handleUnitChange('volume')}
            disabled
            value={getVolume()}
          />
        </Section>
        <Section title="Airflow requirements">
          <Field
            label="Air changes per hour (ACH)"
            info
            infoTip="Number of times the air in the room is replaced per hour"
            value={getACH()}
            onChange={handleACHChange}
            error={inputs.ach && achValid === false ? getValidationMessage('ach') : undefined}
          />
          <Field
            label="Required airflow"
            disabled={false}
            value={getCFM()}
            rightLabel="CFM"
            onChange={handleCFMChange}
            info
            infoTip="Cubic feet per minute"
            error={inputs.cfm && cfmValid === false ? getValidationMessage('cfm') : undefined}
          />
          <Field
            label="Airflow rate in other units"
            unitOptions={airflowOtherUnits}
            unitValue={unitsState.airflowOther}
            onUnitChange={handleUnitChange('airflowOther')}
            info
            infoTip="Airflow in other units"
            disabled
            value={getAirflowOther()}
          />
        </Section>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-600 transition"
        onClick={handleClear}
        type="button"
      >
        Clear
      </button>
      <div className="max-w-xl mt-8 text-gray-700 text-sm leading-relaxed px-2">
        <p>
          <b>How to use:</b> Enter the room's length and width (or floor area), ceiling height, and either the desired air changes per hour (ACH) or required airflow (CFM). The calculator will compute the other value automatically. You can also view the airflow in other units.
        </p>
        <p className="mt-2">
          <b>Formula:</b> <br />
          <span className="font-mono">Airflow (CFM) = Floor Area × Ceiling Height (ft) × ACH / 60</span>
        </p>
        <p className="mt-2">
          <b>Typical ACH values:</b> Bedrooms: 5-6, Bathrooms: 6-7, Kitchens: 7-8, Offices: 6-8, Classrooms: 6-20, etc.
        </p>
      </div>
    </div>
  )
}

export default Page
