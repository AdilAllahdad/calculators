'use client'
import React, { useState } from 'react'

const threadLengthUnitOptions = [
  { label: 'micrometers (µm)', value: 'µm' },
  { label: 'millimeters (mm)', value: 'mm' },
  { label: 'centimeters (cm)', value: 'cm' },
  { label: 'meters (m)', value: 'm' },
  { label: 'inches (in)', value: 'in' },
  { label: 'feet (ft)', value: 'ft' },
  { label: 'yards (yd)', value: 'yd' },
]

const threadPitchUnitOptions = [
  { label: 'micrometers (µm)', value: 'µm' },
  { label: 'millimeters (mm)', value: 'mm' },
  { label: 'centimeters (cm)', value: 'cm' },
  { label: 'inches (in)', value: 'in' },
]

type UnitKey = 'µm' | 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd'

const toMeters: Record<UnitKey, (v: number) => number> = {
  'µm': v => v / 1e6,
  'mm': v => v / 1000,
  'cm': v => v / 100,
  'm': v => v,
  'in': v => v * 0.0254,
  'ft': v => v * 0.3048,
  'yd': v => v * 0.9144,
}

const fromMeters: Record<UnitKey, (v: number) => number> = {
  'µm': v => v * 1e6,
  'mm': v => v * 1000,
  'cm': v => v * 100,
  'm': v => v,
  'in': v => v / 0.0254,
  'ft': v => v / 0.3048,
  'yd': v => v / 0.9144,
}

const InfoIcon = ({ tip }: { tip?: string }) => (
  <span className="ml-1 cursor-pointer text-gray-400" title={tip || ''}>ⓘ</span>
)

const Dropdown = ({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) => (
  <select
    className={`border border-gray-300 rounded-md h-12 w-[150px] px-2 text-base font-mono bg-white text-blue-700 focus:ring-2 focus:ring-blue-200 outline-none min-w-0 ${className}`}
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ maxWidth: '100%' }}
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
  placeholder = '',
  rightLabel,
  disabled = false,
  error,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  unitValue?: string
  onUnitChange?: (v: string) => void
  unitOptions?: { label: string; value: string }[]
  info?: string
  placeholder?: string
  rightLabel?: string
  disabled?: boolean
  error?: string
}) => (
  <div className="mb-6">
    <div className="flex items-center mb-1">
      <span className="font-medium text-gray-900">{label}</span>
      {info && <InfoIcon tip={info} />}
    </div>
    <div className="flex items-center gap-3 relative">
      <input
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder || label}
        disabled={disabled}
        className={`flex-1 px-4 py-3 border rounded-md text-lg h-12 w-full outline-none font-semibold
          ${disabled ? 'bg-gray-50 text-gray-900 border-gray-300' : 'bg-white text-gray-900 border-gray-300'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        style={{ minWidth: 0, maxWidth: '100%' }}
      />
      {unitValue && onUnitChange && unitOptions && (
        <Dropdown options={unitOptions} value={unitValue} onChange={onUnitChange} />
      )}
      {rightLabel && (
        <span className="ml-2 text-gray-700 font-mono text-lg">{rightLabel}</span>
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

function convertValue(
  value: string,
  fromUnit: string,
  toUnit: string,
  options: { label: string; value: string }[]
): string {
  if (!value) return ''
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  if (fromUnit === toUnit) return value
  // Only allow conversion if both units are in the options
  if (
    options.find(o => o.value === fromUnit) &&
    options.find(o => o.value === toUnit)
  ) {
    const meters = toMeters[fromUnit as UnitKey](num)
    const newValue = fromMeters[toUnit as UnitKey](meters)
    return String(Number(newValue.toFixed(6)))
  }
  return value
}

const validatePositive = (value: string) => {
  if (!value) return null
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return false
  return true
}

const getValidationMessage = (field: string) => {
  switch (field) {
    case 'threadLength':
      return 'Please enter a positive value for the thread length.'
    case 'totalThreads':
      return 'Please enter a positive value for the total number of threads.'
    case 'tpi':
      return 'Please enter a positive value for threads per inch.'
    case 'threadPitch':
      return 'Please enter a positive value for the thread pitch.'
    default:
      return ''
  }
}

const page = () => {
  // Each input field has its own value and unit
  const [threadLength, setThreadLength] = useState('')
  const [threadLengthUnit, setThreadLengthUnit] = useState('in')
  const [threadPitch, setThreadPitch] = useState('')
  const [threadPitchUnit, setThreadPitchUnit] = useState('in')
  const [totalThreads, setTotalThreads] = useState('')
  const [tpi, setTpi] = useState('')

  // Handle unit change for thread length
  const handleThreadLengthUnitChange = (newUnit: string) => {
    setThreadLength(
      convertValue(threadLength, threadLengthUnit, newUnit, threadLengthUnitOptions)
    )
    setThreadLengthUnit(newUnit)
  }

  // Handle unit change for thread pitch
  const handleThreadPitchUnitChange = (newUnit: string) => {
    setThreadPitch(
      convertValue(threadPitch, threadPitchUnit, newUnit, threadPitchUnitOptions)
    )
    setThreadPitchUnit(newUnit)
  }

  // Calculation logic
  let calcPitch = threadPitch
  let calcTPI = tpi
  let calcTotalThreads = totalThreads

  // Calculate pitch if possible
  if (threadLength && totalThreads && !threadPitch) {
    const lengthMeters = toMeters[threadLengthUnit as UnitKey](parseFloat(threadLength))
    const pitchMeters = lengthMeters / parseFloat(totalThreads)
    calcPitch = fromMeters[threadPitchUnit as UnitKey](pitchMeters).toFixed(6)
  }

  // Calculate TPI if possible
  if ((threadPitch || (threadLength && totalThreads)) && !tpi) {
    let pitchValue = threadPitch
    if (!pitchValue && threadLength && totalThreads) {
      // Calculate pitch in current pitch unit
      const lengthMeters = toMeters[threadLengthUnit as UnitKey](parseFloat(threadLength))
      const pitchMeters = lengthMeters / parseFloat(totalThreads)
      pitchValue = fromMeters[threadPitchUnit as UnitKey](pitchMeters).toFixed(6)
    }
    if (pitchValue) {
      const pitchMeters = toMeters[threadPitchUnit as UnitKey](parseFloat(pitchValue))
      const pitchInches = fromMeters['in'](pitchMeters)
      if (pitchInches !== 0) {
        calcTPI = (1 / pitchInches).toFixed(6)
      }
    }
  }

  // Calculate pitch if TPI is given
  if (tpi && !threadPitch) {
    const tpiNum = parseFloat(tpi)
    if (tpiNum !== 0) {
      // Pitch in inches
      const pitchInches = 1 / tpiNum
      // Convert pitchInches to meters, then to pitch unit
      const pitchMeters = toMeters['in'](pitchInches)
      calcPitch = fromMeters[threadPitchUnit as UnitKey](pitchMeters).toFixed(6)
    }
  }

  // Calculate total threads if threadLength and pitch are given
  if (threadLength && threadPitch && !totalThreads) {
    const lengthMeters = toMeters[threadLengthUnit as UnitKey](parseFloat(threadLength))
    const pitchMeters = toMeters[threadPitchUnit as UnitKey](parseFloat(threadPitch))
    if (pitchMeters !== 0) {
      calcTotalThreads = (lengthMeters / pitchMeters).toFixed(2)
    }
  }

  const handleClear = () => {
    setThreadLength('')
    setThreadPitch('')
    setTotalThreads('')
    setTpi('')
    setThreadLengthUnit('in')
    setThreadPitchUnit('in')
  }

  // Validation states
  const threadLengthValid = validatePositive(threadLength)
  const totalThreadsValid = validatePositive(totalThreads)
  const tpiValid = validatePositive(tpi)
  const threadPitchValid = validatePositive(threadPitch)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-12 flex flex-col items-center">
      <h1 className="font-bold text-3xl mb-10 tracking-tight">
        Thread pitch calculator
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8 min-w-[400px] max-w-[520px] w-full">
        <Field
          label="Thread length (L)"
          value={threadLength}
          onChange={setThreadLength}
          unitValue={threadLengthUnit}
          onUnitChange={handleThreadLengthUnitChange}
          unitOptions={threadLengthUnitOptions}
          info="Thread length"
          error={threadLength && threadLengthValid === false ? getValidationMessage('threadLength') : undefined}
        />
        <Field
          label="Total number of threads (n)"
          value={calcTotalThreads}
          onChange={setTotalThreads}
          rightLabel=""
          error={totalThreads && totalThreadsValid === false ? getValidationMessage('totalThreads') : undefined}
        />
        <Field
          label="Threads per inch (TPI)"
          value={calcTPI}
          disabled={true}
          error={tpi && tpiValid === false ? getValidationMessage('tpi') : undefined}
        />
        <Field
          label="Thread pitch (P)"
          value={calcPitch}
          onChange={setThreadPitch}
          unitValue={threadPitchUnit}
          onUnitChange={handleThreadPitchUnitChange}
          unitOptions={threadPitchUnitOptions}
          info="Thread pitch"
          error={threadPitch && threadPitchValid === false ? getValidationMessage('threadPitch') : undefined}
        />
        <button
          className="mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-400 transition w-full text-lg"
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
