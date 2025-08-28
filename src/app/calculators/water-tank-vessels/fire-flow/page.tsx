'use client'
import React, { useState } from 'react'

// Fix: add types for conversion helpers
const lengthToMeters: Record<string, (v: number) => number> = {
  m: (v: number) => v,
  ft: (v: number) => v * 0.3048,
}
const lengthFromMeters: Record<string, (v: number) => number> = {
  m: (v: number) => v,
  ft: (v: number) => v / 0.3048,
}

const volumeToM3: Record<string, (v: number) => number> = {
  'm³': (v: number) => v,
  'ft³': (v: number) => v * 0.0283168,
  'yd³': (v: number) => v * 0.764555,
  'L': (v: number) => v / 1000,
  'gal': (v: number) => v * 0.00378541,
}
const volumeFromM3: Record<string, (v: number) => number> = {
  'm³': (v: number) => v,
  'ft³': (v: number) => v / 0.0283168,
  'yd³': (v: number) => v / 0.764555,
  'L': (v: number) => v * 1000,
  'gal': (v: number) => v / 0.00378541,
}

const flowToGpm: Record<string, (v: number) => number> = {
  'gal/s': (v: number) => v * 60,
  'gal/min': (v: number) => v,
  'gal/hr': (v: number) => v / 60,
  'gal/day': (v: number) => v / 1440,
  'ft³/s': (v: number) => v * 448.831,
  'ft³/min': (v: number) => v * 7.48052,
  'ft³/hr': (v: number) => v * 0.124675,
  'ft³/day': (v: number) => v * 0.005195,
  'm³/s': (v: number) => v * 15850.3,
  'm³/min': (v: number) => v * 264.172,
  'm³/hr': (v: number) => v * 4.40287,
  'm³/day': (v: number) => v * 0.183453,
  'L/s': (v: number) => v * 15.8503,
  'L/min': (v: number) => v * 0.264172,
  'L/hr': (v: number) => v * 0.00440287,
  'L/day': (v: number) => v * 0.000183453,
}
const flowFromGpm: Record<string, (v: number) => number> = {
  'gal/s': (v: number) => v / 60,
  'gal/min': (v: number) => v,
  'gal/hr': (v: number) => v * 60,
  'gal/day': (v: number) => v * 1440,
  'ft³/s': (v: number) => v / 448.831,
  'ft³/min': (v: number) => v / 7.48052,
  'ft³/hr': (v: number) => v / 0.124675,
  'ft³/day': (v: number) => v / 0.005195,
  'm³/s': (v: number) => v / 15850.3,
  'm³/min': (v: number) => v / 264.172,
  'm³/hr': (v: number) => v / 4.40287,
  'm³/day': (v: number) => v / 0.183453,
  'L/s': (v: number) => v / 15.8503,
  'L/min': (v: number) => v / 0.264172,
  'L/hr': (v: number) => v / 0.00440287,
  'L/day': (v: number) => v / 0.000183453,
}

const lengthUnits = [
  { label: 'm', value: 'm' },
  { label: 'ft', value: 'ft' },
]
const volumeUnits = [
  { label: 'cubic meters (m³)', value: 'm³' },
  { label: 'cubic feet (cu ft)', value: 'ft³' },
  { label: 'cubic yards (cu yd)', value: 'yd³' },
  { label: 'liters (l)', value: 'L' },
  { label: 'gallons (US) (US gal)', value: 'gal' },
]
const flowUnits = [
  { label: 'gallons (US) per second (US gal/s)', value: 'gal/s' },
  { label: 'gallons (US) per minute (US gal/min)', value: 'gal/min' },
  { label: 'gallons (US) per hour (US gal/hr)', value: 'gal/hr' },
  { label: 'gallons (US) per day (US gal/day)', value: 'gal/day' },
  { label: 'cubic feet per second (ft³/s)', value: 'ft³/s' },
  { label: 'cubic feet per minute (ft³/min)', value: 'ft³/min' },
  { label: 'cubic feet per hour (ft³/hr)', value: 'ft³/hr' },
  { label: 'cubic feet per day (ft³/day)', value: 'ft³/day' },
  { label: 'cubic meters per second (m³/s)', value: 'm³/s' },
  { label: 'cubic meters per minute (m³/min)', value: 'm³/min' },
  { label: 'cubic meters per hour (m³/hr)', value: 'm³/hr' },
  { label: 'cubic meters per day (m³/day)', value: 'm³/day' },
  { label: 'liters per second (L/s)', value: 'L/s' },
  { label: 'liters per minute (L/min)', value: 'L/min' },
  { label: 'liters per hour (L/hr)', value: 'L/hr' },
  { label: 'liters per day (L/day)', value: 'L/day' },
]

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
    className="border rounded-b-sm bg-transparent text-blue-600 font-medium h-10 px-2 min-w-0 w-full max-w-[260px] truncate"
    value={value}
    onChange={e => onChange (e.target.value)}
    style={{ maxWidth: '100%' }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value} className="truncate">{opt.label}</option>
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

const Section = ({
  title,
  children,
  collapsible,
  open,
  onToggle,
}: {
  title: string
  children: React.ReactNode
  collapsible?: boolean
  open?: boolean
  onToggle?: () => void
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-5 min-w-[340px] max-w-[420px] w-full">
    <div className="flex items-center justify-between mb-3">
      <div className="font-semibold">{title}</div>
      {collapsible && (
        <button
          className="text-blue-600 text-lg font-bold focus:outline-none"
          onClick={onToggle}
          type="button"
        >
          {open ? '▲' : '▼'}
        </button>
      )}
    </div>
    {(!collapsible || open) && children}
  </div>
)

const validatePositive = (value: string) => {
  if (!value) return null
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return false
  return true
}

const getValidationMessage = (field: string, value?: string) => {
  switch (field) {
    case 'length':
      return 'Length must be greater than zero.'
    case 'width':
      return 'Width must be greater than zero.'
    case 'height':
      return 'Height must be greater than zero.'
    case 'volume':
      return 'Volume must be greater than zero.'
    case 'fireInvolvement':
      return 'Fire involvement must be greater than zero and smaller than or equal to 100%.'
    case 'burningFloors':
      return 'Number of burning floors must be greater than zero.'
    case 'interiorExposures':
      return 'Number of interior exposures must be five at most. Enter five if you have more than five interior exposures.'
    case 'exteriorExposures':
      return 'Number of exterior exposures must be zero or greater.'
    default:
      return ''
  }
}

// Helper: convert length to feet
const toFeet = (val: string, unit: string) => {
  const num = parseFloat(val)
  if (isNaN(num)) return 0
  if (unit === 'ft') return num
  if (unit === 'm') return num * 3.28084
  return num
}

// Helper: convert height to feet (same as toFeet)
const toFeetHeight = toFeet

// Helper: convert volume to ft³
const toFt3 = (val: string, unit: string) => {
  const num = parseFloat(val)
  if (isNaN(num)) return 0
  if (unit === 'ft³') return num
  if (unit === 'm³') return num * 35.3147
  if (unit === 'yd³') return num * 27
  if (unit === 'L') return num * 0.0353147
  if (unit === 'gal') return num * 0.133681
  return num
}

// Helper: convert RFF (GPM) to selected unit
const convertRffToUnit = (gpm: number, unit: string) => {
  if (unit === 'gal/min') return gpm
  const fn = flowFromGpm[unit]
  return fn ? fn(gpm) : gpm
}

const page = () => {
  const [method, setMethod] = useState<'nfa' | 'isu'>('isu')
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [height, setHeight] = useState('')
  const [heightUnit, setHeightUnit] = useState('m')
  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('m³')
  const [rff, setRff] = useState('')
  const [rffUnit, setRffUnit] = useState('gal/min')

  // NFA only
  const [showAdditional, setShowAdditional] = useState(true)
  const [fireInvolvement, setFireInvolvement] = useState('100')
  const [burningFloors, setBurningFloors] = useState('1')
  const [showExposures, setShowExposures] = useState(true)
  const [interiorExposures, setInteriorExposures] = useState('0')
  const [exteriorExposures, setExteriorExposures] = useState('0')

  // --- Validation states ---
  const lengthValid = validatePositive(length)
  const widthValid = validatePositive(width)
  const heightValid = method === 'isu' ? validatePositive(height) : true
  const volumeValid = method === 'isu' && volume ? validatePositive(volume) : true
  const fireInvolvementNum = parseFloat(fireInvolvement)
  const fireInvolvementValid = method === 'nfa'
    ? fireInvolvement && fireInvolvementNum > 0 && fireInvolvementNum <= 100
    : true
  const burningFloorsValid = method === 'nfa' ? validatePositive(burningFloors) : true
  const interiorExposuresNum = parseInt(interiorExposures)
  const exteriorExposuresNum = parseInt(exteriorExposures)
  const interiorExposuresValid = method === 'nfa'
    ? interiorExposures && interiorExposuresNum >= 0 && interiorExposuresNum <= 5
    : true
  const exteriorExposuresValid = method === 'nfa'
    ? exteriorExposures && exteriorExposuresNum >= 0
    : true

  // --- Calculation logic ---
  let calcRffGpm = 0
  if (method === 'nfa') {
    const l = toFeet(length, lengthUnit)
    const w = toFeet(width, widthUnit)
    const floors = parseFloat(burningFloors) || 1
    let rff = (l * w) / 3 * floors

    // Fire involvement percent
    const involvement = parseFloat(fireInvolvement)
    if (!isNaN(involvement) && involvement > 0 && involvement <= 100) {
      rff = rff * (involvement / 100)
    }

    // Exposures
    let exposures = 0
    const intExp = Math.min(5, parseInt(interiorExposures) || 0)
    // For exterior exposures, use the actual value (no upper limit)
    const extExp = Math.max(0, parseInt(exteriorExposures) || 0)
    exposures = (intExp + extExp) * 0.25 * rff
    rff += exposures

    calcRffGpm = rff
  }

  // ISU calculation
  if (method === 'isu') {
    // Use volume if provided, else calculate from L*W*H
    let v = toFt3(volume, volumeUnit)
    if (!volume) {
      const l = toFeet(length, lengthUnit)
      const w = toFeet(width, widthUnit)
      const h = toFeetHeight(height, heightUnit)
      v = l * w * h
    }
    calcRffGpm = v / 100
  }

  // Display RFF in selected unit
  const calcRffDisplay = rffUnit ? String(Number(convertRffToUnit(calcRffGpm, rffUnit).toFixed(3))) : ''

  // --- Unit change handlers ---
  const handleLengthUnitChange = (newUnit: string, prevUnit: string, value: string, setValue: (v: string) => void, setUnit: (v: string) => void) => {
    if (value) {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        const meters = lengthToMeters[prevUnit as keyof typeof lengthToMeters](num)
        const newValue = lengthFromMeters[newUnit as keyof typeof lengthFromMeters](meters)
        setValue(String(Number(newValue.toFixed(6))))
      }
    }
    setUnit(newUnit)
  }
  const handleVolumeUnitChange = (newUnit: string, prevUnit: string, value: string, setValue: (v: string) => void, setUnit: (v: string) => void) => {
    if (value) {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        const m3 = volumeToM3[prevUnit as keyof typeof volumeToM3](num)
        const newValue = volumeFromM3[newUnit as keyof typeof volumeFromM3](m3)
        setValue(String(Number(newValue.toFixed(6))))
      }
    }
    setUnit(newUnit)
  }
  const handleFlowUnitChange = (newUnit: string, prevUnit: string, value: string, setValue: (v: string) => void, setUnit: (v: string) => void) => {
    if (value) {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        const gpm = flowToGpm[prevUnit as keyof typeof flowToGpm](num)
        const newValue = flowFromGpm[newUnit as keyof typeof flowFromGpm](gpm)
        setValue(String(Number(newValue.toFixed(6))))
      }
    }
    setUnit(newUnit)
  }

  const handleClear = () => {
    setLength('')
    setLengthUnit('m')
    setWidth('')
    setWidthUnit('m')
    setHeight('')
    setHeightUnit('m')
    setVolume('')
    setVolumeUnit('m³')
    setRff('')
    setRffUnit('gal/min')
    setFireInvolvement('100')
    setBurningFloors('1')
    setInteriorExposures('0')
    setExteriorExposures('0')
    setShowAdditional(true)
    setShowExposures(true)
    setMethod('isu')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-8 flex flex-col items-center">
      <Section title="Method and building dimensions">
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={method === 'nfa'}
                onChange={() => setMethod('nfa')}
                className="accent-blue-600 mr-2"
              />
              <span className="font-medium">National Fire Academy</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={method === 'isu'}
                onChange={() => setMethod('isu')}
                className="accent-blue-600 mr-2"
              />
              <span className="font-medium">Iowa State University</span>
            </label>
          </div>
        </div>
        <Field
          label="Building length"
          value={length}
          onChange={setLength}
          unitValue={lengthUnit}
          onUnitChange={v => handleLengthUnitChange(v, lengthUnit, length, setLength, setLengthUnit)}
          unitOptions={lengthUnits}
          error={length && lengthValid === false ? getValidationMessage('length') : undefined}
        />
        <Field
          label="Building width"
          value={width}
          onChange={setWidth}
          unitValue={widthUnit}
          onUnitChange={v => handleLengthUnitChange(v, widthUnit, width, setWidth, setWidthUnit)}
          unitOptions={lengthUnits}
          error={width && widthValid === false ? getValidationMessage('width') : undefined}
        />
        {method === 'isu' && (
          <>
            <Field
              label="Building height"
              value={height}
              onChange={setHeight}
              unitValue={heightUnit}
              onUnitChange={v => handleLengthUnitChange(v, heightUnit, height, setHeight, setHeightUnit)}
              unitOptions={lengthUnits}
              error={height && heightValid === false ? getValidationMessage('height') : undefined}
            />
            <Field
              label="Volume"
              value={
                length && width && height
                  ? (
                      // Calculate volume in ft³, then convert to selected unit
                      volumeFromM3[volumeUnit](
                        // L × W × H in feet, then convert ft³ to m³ for conversion
                        (toFeet(length, lengthUnit) *
                          toFeet(width, widthUnit) *
                          toFeet(height, heightUnit)) / 35.3147
                      ).toFixed(6)
                    )
                  : ''
              }
              onChange={setVolume}
              unitValue={volumeUnit}
              onUnitChange={v => setVolumeUnit(v)}
              unitOptions={volumeUnits}
              error={volume && volumeValid === false ? getValidationMessage('volume') : undefined}
              disabled
            />
          </>
        )}
      </Section>
      {method === 'nfa' && (
        <>
          <Section
            title="Additional Information"
            collapsible
            open={showAdditional}
            onToggle={() => setShowAdditional((v) => !v)}
          >
            <Field
              label="Fire involvement"
              value={fireInvolvement}
              onChange={setFireInvolvement}
              rightLabel="%"
              error={
                fireInvolvement &&
                !fireInvolvementValid
                  ? getValidationMessage('fireInvolvement')
                  : undefined
              }
            />
            <Field
              label="No. burning floors"
              value={burningFloors}
              onChange={setBurningFloors}
              error={
                burningFloors &&
                burningFloorsValid === false
                  ? getValidationMessage('burningFloors')
                  : undefined
              }
            />
          </Section>
        </>
      )}
      <Section title="Required fire flow (RFF)">
        <Field
          label="RFF"
          value={calcRffDisplay}
          onChange={setRff}
          unitValue={rffUnit}
          onUnitChange={v => handleFlowUnitChange(v, rffUnit, calcRffDisplay, setRffUnit, setRffUnit)}
          unitOptions={flowUnits}
        />
      </Section>
      {method === 'nfa' && (
        <Section
          title="Interior and exterior exposures"
          collapsible
          open={showExposures}
          onToggle={() => setShowExposures((v) => !v)}
        >
          <Field
            label="No. interior exposures"
            value={interiorExposures}
            onChange={setInteriorExposures}
            error={
              interiorExposures &&
              interiorExposuresValid === false
                ? getValidationMessage('interiorExposures')
                : undefined
            }
          />
          <Field
            label="No. exterior exposures"
            value={exteriorExposures}
            onChange={setExteriorExposures}
            error={
              exteriorExposures &&
              exteriorExposuresValid === false
                ? getValidationMessage('exteriorExposures')
                : undefined
            }
          />
        </Section>
      )}
      <button
        className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-600 transition"
        onClick={handleClear}
        type="button"
      >
        Clear
      </button>
    </div>
  )
}

export default page
