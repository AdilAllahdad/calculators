'use client'
import React, { useState } from 'react'

// Volume dropdown for input field
const volumeUnits = [
  { label: "cubic meters", symbol: "m³" },
  { label: "cubic feet", symbol: "cu ft" },
  { label: "milliliters", symbol: "ml" },
  { label: "centiliters", symbol: "cl" },
  { label: "liters", symbol: "l" },
  { label: "gallons (US)", symbol: "US gal" },
  { label: "gallons (UK)", symbol: "UK gal" },
  { label: "cubic centimeters", symbol: "cc" }
]

// Time dropdown for input field
const timeUnits = [
  { label: "seconds", symbol: "sec" },
  { label: "minutes", symbol: "min" },
  { label: "hours", symbol: "hrs" },
  { label: "days", symbol: "days" },
  { label: "weeks", symbol: "wks" },
  { label: "months", symbol: "mos" },
  { label: "years", symbol: "yrs" }
]

// Flow rate dropdowns
const flowRateVolumeUnits = volumeUnits
const flowRateTimeUnits = [
  { label: "second", symbol: "sec" },
  { label: "minute", symbol: "min" },
  { label: "hour", symbol: "hr" },
  { label: "day", symbol: "day" }
]

// Conversion factors to base units (m³ for volume, seconds for time)
const volumeToM3: Record<string, (v: number) => number> = {
  'm³': v => v,
  'cu ft': v => v * 0.0283168,
  'ml': v => v / 1_000_000,
  'cl': v => v / 100_000,
  'l': v => v / 1000,
  'US gal': v => v * 0.00378541,
  'UK gal': v => v * 0.00454609,
  'cc': v => v / 1_000_000,
}
const m3ToVolume: Record<string, (v: number) => number> = {
  'm³': v => v,
  'cu ft': v => v / 0.0283168,
  'ml': v => v * 1_000_000,
  'cl': v => v * 100_000,
  'l': v => v * 1000,
  'US gal': v => v / 0.00378541,
  'UK gal': v => v / 0.00454609,
  'cc': v => v * 1_000_000,
}
const timeToSec: Record<string, (v: number) => number> = {
  'sec': v => v,
  'min': v => v * 60,
  'hr': v => v * 3600,
  'hrs': v => v * 3600,
  'day': v => v * 86400,
  'days': v => v * 86400,
  'wks': v => v * 604800,
  'mos': v => v * 2_629_746, // average month in seconds
  'yrs': v => v * 31_556_952, // average year in seconds
}
const secToTime: Record<string, (v: number) => number> = {
  'sec': v => v,
  'min': v => v / 60,
  'hr': v => v / 3600,
  'hrs': v => v / 3600,
  'day': v => v / 86400,
  'days': v => v / 86400,
  'wks': v => v / 604800,
  'mos': v => v / 2_629_746,
  'yrs': v => v / 31_556_952,
}

// Helper to check if a value is a valid positive number
const isPositive = (v: string) => {
  const n = parseFloat(v)
  return !isNaN(n) && n > 0
}

const Field = ({
  label,
  value,
  onChange,
  unitDropdown,
  disabled = false,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  unitDropdown: React.ReactNode
  disabled?: boolean
  error?: string
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-1">
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md bg-gray-50 text-base font-semibold outline-none focus:border-blue-400 flex-1
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}
        `}
      />
      {unitDropdown}
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

const getValidationMessage = (field: string, value: string) => {
  if (!value) return undefined
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) {
    switch (field) {
      case 'volume':
        return 'Volume should be greater than 0.'
      case 'time':
        return 'Time should be greater than 0.'
      case 'flowRate':
        return 'Flow rate should be greater than 0.'
      default:
        return 'Value should be greater than 0.'
    }
  }
  return undefined
}

const page = () => {
  // State for all fields and units
  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('m³')
  const [time, setTime] = useState('')
  const [timeUnit, setTimeUnit] = useState('sec')
  const [flowVolumeUnit, setFlowVolumeUnit] = useState('US gal')
  const [flowTimeUnit, setFlowTimeUnit] = useState('min')
  const [flowRate, setFlowRate] = useState('')
  const [lastEdit, setLastEdit] = useState<'volume' | 'time' | 'flow' | null>(null)

  // Store base values for calculation (m³ and sec)
  const [baseVolume, setBaseVolume] = useState('')
  const [baseTime, setBaseTime] = useState('')
  const [baseFlow, setBaseFlow] = useState('')

  // When user changes volume input, update both display and base value
  const handleVolumeChange = (val: string) => {
    setVolume(val)
    setLastEdit('volume')
    const num = parseFloat(val)
    if (!isNaN(num)) {
      setBaseVolume(volumeToM3[volumeUnit] ? String(volumeToM3[volumeUnit](num)) : val)
    } else {
      setBaseVolume('')
    }
  }
  // When user changes time input, update both display and base value
  const handleTimeChange = (val: string) => {
    setTime(val)
    setLastEdit('time')
    const num = parseFloat(val)
    if (!isNaN(num)) {
      setBaseTime(timeToSec[timeUnit] ? String(timeToSec[timeUnit](num)) : val)
    } else {
      setBaseTime('')
    }
  }
  // When user changes flow rate input, update both display and base value
  const handleFlowChange = (val: string) => {
    setFlowRate(val)
    setLastEdit('flow')
    const num = parseFloat(val)
    if (!isNaN(num)) {
      // Convert to m³/sec for calculation
      const flowM3PerSec = volumeToM3[flowVolumeUnit] && timeToSec[flowTimeUnit]
        ? volumeToM3[flowVolumeUnit](num) / timeToSec[flowTimeUnit](1)
        : num
      setBaseFlow(String(flowM3PerSec))
    } else {
      setBaseFlow('')
    }
  }
  // When user changes volume unit, convert display value but keep base value for calculation
  const handleVolumeUnitChange = (unit: string) => {
    if (baseVolume) {
      const num = parseFloat(baseVolume)
      setVolume(m3ToVolume[unit] ? String(Number(m3ToVolume[unit](num).toFixed(6))) : baseVolume)
    }
    setVolumeUnit(unit)
  }
  // When user changes time unit, convert display value but keep base value for calculation
  const handleTimeUnitChange = (unit: string) => {
    if (baseTime) {
      const num = parseFloat(baseTime)
      setTime(secToTime[unit] ? String(Number(secToTime[unit](num).toFixed(6))) : baseTime)
    }
    setTimeUnit(unit)
  }
  // When user changes flow rate volume unit, convert display value but keep base value for calculation
  const handleFlowVolumeUnitChange = (unit: string) => {
    if (baseFlow) {
      const num = parseFloat(baseFlow)
      // Convert m³/sec to new unit
      const flowInUnit = m3ToVolume[unit] ? m3ToVolume[unit](num) : num
      const timeDiv = secToTime[flowTimeUnit] ? secToTime[flowTimeUnit](1) : 1
      setFlowRate(String(Number((flowInUnit / timeDiv).toFixed(6))))
    }
    setFlowVolumeUnit(unit)
  }
  // When user changes flow rate time unit, convert display value but keep base value for calculation
  const handleFlowTimeUnitChange = (unit: string) => {
    if (baseFlow) {
      const num = parseFloat(baseFlow)
      const flowInUnit = m3ToVolume[flowVolumeUnit] ? m3ToVolume[flowVolumeUnit](num) : num
      const timeDiv = secToTime[unit] ? secToTime[unit](1) : 1
      setFlowRate(String(Number((flowInUnit / timeDiv).toFixed(6))))
    }
    setFlowTimeUnit(unit)
  }

  // Main calculation logic: update the other fields when two are filled
  React.useEffect(() => {
    // If two fields are filled, calculate the third
    const v = parseFloat(baseVolume)
    const t = parseFloat(baseTime)
    const f = parseFloat(baseFlow)
    // If user last edited flow, calculate volume or time if possible
    if (lastEdit === 'flow' && isPositive(baseFlow)) {
      if (isPositive(baseTime) && !isPositive(baseVolume)) {
        // V = F × T
        const calcV = f * t
        setBaseVolume(String(calcV))
        setVolume(m3ToVolume[volumeUnit] ? String(Number(m3ToVolume[volumeUnit](calcV).toFixed(6))) : String(calcV))
      } else if (isPositive(baseVolume) && !isPositive(baseTime)) {
        // T = V / F
        const calcT = v / f
        setBaseTime(String(calcT))
        setTime(secToTime[timeUnit] ? String(Number(secToTime[timeUnit](calcT).toFixed(6))) : String(calcT))
      }
    }
    // If user last edited volume, calculate flow if time is present
    else if (lastEdit === 'volume' && isPositive(baseVolume) && isPositive(baseTime)) {
      // F = V / T
      const calcF = v / t
      setBaseFlow(String(calcF))
      const flowInUnit = m3ToVolume[flowVolumeUnit] ? m3ToVolume[flowVolumeUnit](calcF) : calcF
      const timeDiv = secToTime[flowTimeUnit] ? secToTime[flowTimeUnit](1) : 1
      setFlowRate(String(Number((flowInUnit / timeDiv).toFixed(6))))
    }
    // If user last edited time, calculate flow if volume is present
    else if (lastEdit === 'time' && isPositive(baseVolume) && isPositive(baseTime)) {
      // F = V / T
      const calcF = v / t
      setBaseFlow(String(calcF))
      const flowInUnit = m3ToVolume[flowVolumeUnit] ? m3ToVolume[flowVolumeUnit](calcF) : calcF
      const timeDiv = secToTime[flowTimeUnit] ? secToTime[flowTimeUnit](1) : 1
      setFlowRate(String(Number((flowInUnit / timeDiv).toFixed(6))))
    }
    // If only flow and volume are present, calculate time
    else if (isPositive(baseFlow) && isPositive(baseVolume) && !isPositive(baseTime)) {
      // T = V / F
      const calcT = v / f
      setBaseTime(String(calcT))
      setTime(secToTime[timeUnit] ? String(Number(secToTime[timeUnit](calcT).toFixed(6))) : String(calcT))
    }
    // If only flow and time are present, calculate volume
    else if (isPositive(baseFlow) && isPositive(baseTime) && !isPositive(baseVolume)) {
      // V = F × T
      const calcV = f * t
      setBaseVolume(String(calcV))
      setVolume(m3ToVolume[volumeUnit] ? String(Number(m3ToVolume[volumeUnit](calcV).toFixed(6))) : String(calcV))
    }
    // If only volume and time are present, calculate flow
    else if (isPositive(baseVolume) && isPositive(baseTime) && !isPositive(baseFlow)) {
      // F = V / T
      const calcF = v / t
      setBaseFlow(String(calcF))
      const flowInUnit = m3ToVolume[flowVolumeUnit] ? m3ToVolume[flowVolumeUnit](calcF) : calcF
      const timeDiv = secToTime[flowTimeUnit] ? secToTime[flowTimeUnit](1) : 1
      setFlowRate(String(Number((flowInUnit / timeDiv).toFixed(6))))
    }
    // If all are empty, clear all
    else if (!isPositive(baseVolume) && !isPositive(baseTime) && !isPositive(baseFlow)) {
      setFlowRate('')
      setVolume('')
      setTime('')
    }
  // eslint-disable-next-line
  }, [baseVolume, baseTime, baseFlow, volumeUnit, timeUnit, flowVolumeUnit, flowTimeUnit, lastEdit])

  const handleClear = () => {
    setVolume('')
    setVolumeUnit('m³')
    setTime('')
    setTimeUnit('sec')
    setFlowVolumeUnit('US gal')
    setFlowTimeUnit('min')
    setFlowRate('')
    setBaseVolume('')
    setBaseTime('')
    setBaseFlow('')
    setLastEdit(null)
  }

  // Validation messages
  const volumeError = getValidationMessage('volume', volume)
  const timeError = getValidationMessage('time', time)
  const flowRateError = getValidationMessage('flowRate', flowRate)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-7 text-center tracking-tight">
          Gallons Per Minute Calculator (GPM)
        </h1>
        <Field
          label="Volume"
          value={volume}
          onChange={handleVolumeChange}
          unitDropdown={
            <select
              className="bg-transparent outline-none text-blue-700 font-semibold"
              value={volumeUnit}
              onChange={e => handleVolumeUnitChange(e.target.value)}
            >
              {volumeUnits.map(u => (
                <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
              ))}
            </select>
          }
          error={volumeError}
        />
        <Field
          label="Time"
          value={time}
          onChange={handleTimeChange}
          unitDropdown={
            <select
              className="bg-transparent outline-none text-blue-700 font-semibold"
              value={timeUnit}
              onChange={e => handleTimeUnitChange(e.target.value)}
            >
              {timeUnits.map(u => (
                <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
              ))}
            </select>
          }
          error={timeError}
        />
        <Field
          label="Flow rate"
          value={flowRate}
          onChange={handleFlowChange}
          unitDropdown={
            <div className="flex border rounded-lg px-2 py-1 bg-white w-full max-w-xs items-center">
              <select
                className="bg-transparent outline-none text-blue-700 font-semibold"
                value={flowVolumeUnit}
                onChange={e => handleFlowVolumeUnitChange(e.target.value)}
              >
                {flowRateVolumeUnits.map(u => (
                  <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
                ))}
              </select>
              <span className="mx-1 text-gray-500">/</span>
              <select
                className="bg-transparent outline-none text-blue-700 font-semibold"
                value={flowTimeUnit}
                onChange={e => handleFlowTimeUnitChange(e.target.value)}
              >
                {flowRateTimeUnits.map(u => (
                  <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
                ))}
              </select>
            </div>
          }
          error={flowRateError}
        />
        <button
          className="mt-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-400 transition"
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
