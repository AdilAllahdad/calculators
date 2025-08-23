'use client'
import React, { useState } from 'react'

// Chart for header sizes and their max spans (in inches)
const headerChart = [
  { size: '4x4', height: 4, maxSpanIn: 48 },
  { size: '4x6', height: 6, maxSpanIn: 72 },
  { size: '4x8', height: 8, maxSpanIn: 96 },
  { size: '4x10', height: 10, maxSpanIn: 120 },
  { size: '4x12', height: 12, maxSpanIn: 144 },
]

// For dropdowns
const headerSizes = [
  { label: `"4" × "4"`, value: '4x4' },
  { label: `"4" × "6"`, value: '4x6' },
  { label: `"4" × "8"`, value: '4x8' },
  { label: `"4" × "10"`, value: '4x10' },
  { label: `"4" × "12"`, value: '4x12' },
]

const spanUnits = [
  { label: 'millimeters (mm)', value: 'mm' },
  { label: 'centimeters (cm)', value: 'cm' },
  { label: 'meters (m)', value: 'm' },
  { label: 'inches (in)', value: 'in' },
  { label: 'feet (ft)', value: 'ft' },
  { label: 'yards (yd)', value: 'yd' },
  
]

const findOptions = [
  { label: 'Select', value: '' },
  { label: 'maximum header span', value: 'maximum header span' },
  { label: 'recommended header size', value: 'recommended header size' },
]

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
    className={`border border-gray-300 rounded-md h-10 px-3 text-base font-mono bg-white text-gray-900 focus:ring-2 focus:ring-blue-200 outline-none w-full min-w-0 ${className}`}
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ maxWidth: '100%' }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
)

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-5 min-w-[320px] max-w-[370px] w-full">
    {children}
  </div>
)

// Conversion helpers
function toUnit(valInInches: number, unit: string): string {
  switch (unit) {
    case 'mm': return (valInInches * 25.4).toFixed(2)
    case 'cm': return (valInInches * 2.54).toFixed(2)
    case 'm': return (valInInches * 0.0254).toFixed(3)
    case 'in': return valInInches.toFixed(2)
    case 'ft': return (valInInches / 12).toFixed(3)
    case 'yd': return (valInInches / 36).toFixed(3)
    case 'ft_in': {
      const ft = Math.floor(valInInches / 12)
      const inch = (valInInches % 12)
      return `${ft} ft ${inch.toFixed(2)} in`
    }
    case 'm_cm': {
      const m = Math.floor(valInInches * 0.0254)
      const cm = ((valInInches * 2.54) % 100)
      return `${m} m ${cm.toFixed(2)} cm`
    }
    default: return valInInches.toString()
  }
}

function fromUnit(val: string, unit: string): number {
  const v = parseFloat(val)
  if (isNaN(v)) return 0
  switch (unit) {
    case 'mm': return v / 25.4
    case 'cm': return v / 2.54
    case 'm': return v / 0.0254
    case 'in': return v
    case 'ft': return v * 12
    case 'yd': return v * 36
    case 'ft_in': return v * 12 // fallback: treat as ft
    case 'm_cm': return v / 0.0254 // fallback: treat as m
    default: return v
  }
}

const MIN_ROUGH_OPENING_INCHES = 34; // 34 inches minimum rough opening
const MIN_ROUGH_OPENING_CM = 86.36;  // 34 inches in cm
const MIN_DOOR_OPENING_INCHES = 32;  // 32 inches minimum door opening
const MIN_DOOR_OPENING_CM = 81.28;   // 32 inches in cm

const page = () => {
  const [mode, setMode] = useState('maximum header span')
  const [headerSize, setHeaderSize] = useState(headerSizes[0].value)
  const [spanUnit, setSpanUnit] = useState(spanUnits[2].value) // default to meters (m)
  const [roughOpening, setRoughOpening] = useState('')
  const [roughOpeningUnit, setRoughOpeningUnit] = useState(spanUnits[2].value) // separate unit for rough opening
  const [inputTouched, setInputTouched] = useState(false)

  // Maximum header span calculation
  const maxSpanInches = headerChart.find(h => h.size === headerSize)?.maxSpanIn ?? 0
  const maxSpanDisplay = toUnit(maxSpanInches, spanUnit)

  // Validation and result for recommended header size
  let validationMsg = ''
  let recommendedHeaderValue = ''
  let showResult = false

  if (mode === 'recommended header size' && roughOpening !== '') {
    const roughOpeningNum = parseFloat(roughOpening)
    if (isNaN(roughOpeningNum) || roughOpeningNum <= 0) {
      validationMsg = 'Please enter a positive number for the rough opening.'
      showResult = false
    } else {
      const roughOpeningInches = fromUnit(roughOpening, roughOpeningUnit)
      if (roughOpeningInches < MIN_ROUGH_OPENING_INCHES) {
        validationMsg = `Rough opening must be at least 34 inches (or 86.36 cm) to meet the required minimum recommended door opening of 32 inches (or 81.28 cm).`
        showResult = false
      } else {
        const found = headerChart.find(h => roughOpeningInches <= h.maxSpanIn)
        if (!found) {
          validationMsg = 'This is a very wide door opening. Please consult a structural engineer for this rough opening size. 👷‍♂️'
          showResult = false
        } else {
          recommendedHeaderValue = found.size
          showResult = true
        }
      }
    }
  }

  // When changing unit, convert the value to the new unit for display
  const handleRoughOpeningUnitChange = (newUnit: string) => {
    if (roughOpening) {
      // Convert current value to inches, then to new unit
      const valueInInches = fromUnit(roughOpening, roughOpeningUnit)
      let newValue = ''
      if (!isNaN(valueInInches) && valueInInches > 0) {
        newValue = toUnit(valueInInches, newUnit)
      }
      setRoughOpening(newValue)
    }
    setRoughOpeningUnit(newUnit)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-8 flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-7 tracking-tight">
        Door header size calculator
      </h1>
      <Card>
        <div className="mb-2 text-gray-500 text-sm font-medium">I want to find the...</div>
        <Dropdown
          options={findOptions}
          value={mode}
          onChange={v => {
            setMode(v)
            setInputTouched(false)
            setRoughOpening('')
          }}
          className="w-full border-blue-400 text-blue-700 font-mono"
        />
      </Card>
      {mode === 'maximum header span' && (
        <Card>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="font-medium text-gray-900">Header sizes</span>
              <InfoIcon tip="Select header size" />
            </div>
            <Dropdown
              options={headerSizes}
              value={headerSize}
              onChange={setHeaderSize}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center mb-1">
              <span className="font-medium text-gray-900">Maximum header span</span>
              <InfoIcon tip="Calculated maximum span" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={maxSpanDisplay}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-base h-10 outline-none bg-gray-50 text-gray-900 font-semibold"
              />
              <Dropdown
                options={spanUnits}
                value={spanUnit}
                onChange={setSpanUnit}
              />
            </div>
          </div>
        </Card>
      )}
      {mode === 'recommended header size' && (
        <Card>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="font-medium text-gray-900">Rough opening</span>
              <InfoIcon tip="Enter the rough opening span" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={roughOpening}
                onChange={e => {
                  setRoughOpening(e.target.value)
                  setInputTouched(true)
                }}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-base h-10 outline-none bg-white text-gray-900 font-semibold ${validationMsg && inputTouched ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="Enter value"
                min={0}
              />
              <Dropdown
                options={spanUnits}
                value={roughOpeningUnit}
                onChange={handleRoughOpeningUnitChange}
              />
            </div>
          </div>
          {validationMsg && inputTouched && (
            <div className="mt-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md px-3 py-2 flex items-center">
              {validationMsg}
            </div>
          )}
          {showResult && (
            <div className="mt-4 text-base font-medium text-gray-900">
              Recommended header size: <span className="font-bold">{headerSizes.find(hs => hs.value === recommendedHeaderValue)?.label || ''}</span>
            </div>
          )}
        </Card>
      )}
      <button
        className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-600 transition"
        onClick={() => {
          setHeaderSize(headerSizes[0].value)
          setSpanUnit(spanUnits[2].value)
          setRoughOpening('')
          setRoughOpeningUnit(spanUnits[2].value)
          setInputTouched(false)
        }}
        type="button"
      >
        Clear
      </button>
    </div>
  )
}

export default page
