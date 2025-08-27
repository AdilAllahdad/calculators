'use client'
import React, { useState, useEffect } from 'react'
import { Info } from 'lucide-react'

const unitOptions = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "decimeters (dm)", value: "dm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" }
]
const areaUnitOptions = [
  { label: "square centimeters (cm²)", value: "cm2" },
  { label: "square decimeters (dm²)", value: "dm2" },
  { label: "square meters (m²)", value: "m2" },
  { label: "square inches (in²)", value: "in2" },
  { label: "square feet (ft²)", value: "ft2" },
  { label: "ares (a)", value: "a" },
  { label: "decares (da)", value: "da" },
  { label: "hectares (ha)", value: "ha" },
  { label: "acres (ac)", value: "ac" }
]

const InputRow = ({
  label,
  value,
  onValueChange,
  unit,
  unitOptions,
  onUnitChange,
  placeholder,
  info,
  disabled,
  type = "text",
  error,
}: any) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {info && (
        <span className="ml-1 text-gray-400 cursor-pointer" title={info}>
          <Info size={16} />
        </span>
      )}
    </div>
    <div className="flex">
      <input
        type={type}
        className={`flex-1 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-200 bg-red-50 text-red-700' : 'focus:ring-blue-100'} ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={e => onValueChange && onValueChange(e.target.value)}
        style={{ minWidth: 0 }}
      />
      {unitOptions && (
        <div className="relative w-20">
          <select
            className="w-full border border-l-0 border-gray-200 rounded-r-lg px-2 py-2 text-sm bg-white focus:outline-none truncate"
            disabled={disabled}
            value={unit}
            onChange={e => onUnitChange && onUnitChange(e.target.value)}
            style={{ maxWidth: '100%' }}
          >
            {unitOptions.map((opt: any) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
      )}
    </div>
    {error && (
      <div className="text-xs text-red-600 mt-1">{error}</div>
    )}
  </div>
)

const RoomShapeRadio = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-2 mb-4">
    <label className="text-sm font-medium text-gray-700 mb-1">Your room's shape</label>
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          className="accent-blue-600"
          checked={value === 'rectangle'}
          onChange={() => onChange('rectangle')}
        />
        <span className="text-gray-800">Rectangle</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          className="accent-blue-600"
          checked={value === 'square'}
          onChange={() => onChange('square')}
        />
        <span className="text-gray-800">Square</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          className="accent-blue-600"
          checked={value === 'other'}
          onChange={() => onChange('other')}
        />
        <span className="text-gray-800">Other</span>
      </label>
    </div>
  </div>
)

function convertLength(value: number, from: string, to: string): number {
  const toMeters: Record<string, number> = {
    cm: 0.01,
    dm: 0.1,
    m: 1,
    in: 0.0254,
    ft: 0.3048
  }
  if (!(from in toMeters) || !(to in toMeters)) return value
  const meters = value * toMeters[from]
  return meters / toMeters[to]
}

function convertArea(value: number, from: string, to: string): number {
  const toM2: Record<string, number> = {
    cm2: 1 / 10000,         // 1 cm² = 0.0001 m²
    dm2: 1 / 100,           // 1 dm² = 0.01 m²
    m2: 1,
    in2: 0.00064516,        // 1 in² = 0.00064516 m²
    ft2: 0.09290304,        // 1 ft² = 0.09290304 m²
    a: 100,
    da: 1000,
    ha: 10000,
    ac: 4046.8564224
  }
  if (!(from in toM2) || !(to in toM2)) return value
  const m2 = value * toM2[from]
  return m2 / toM2[to]
}

// Standard areas for doors/windows in square meters
const DOOR_AREA_M2 = 1.95
const WINDOW_AREA_M2 = 1.11

const Page = () => {
  const [shape, setShape] = useState('rectangle')
  const [wall1, setWall1] = useState('')
  const [wall1Unit, setWall1Unit] = useState('m')
  const [wall2, setWall2] = useState('')
  const [wall2Unit, setWall2Unit] = useState('m')
  const [ceiling, setCeiling] = useState('')
  const [ceilingUnit, setCeilingUnit] = useState('m')
  const [doors, setDoors] = useState('')
  const [windows, setWindows] = useState('')
  const [wallFootage, setWallFootage] = useState('')
  const [wallFootageUnit, setWallFootageUnit] = useState('m2')

  // Validation states
  const [wall1Error, setWall1Error] = useState('')
  const [wall2Error, setWall2Error] = useState('')
  const [ceilingError, setCeilingError] = useState('')
  const [doorsError, setDoorsError] = useState('')
  const [windowsError, setWindowsError] = useState('')

  // --- Independent unit conversion handlers for each input field ---
  const handleWall1UnitChange = (newUnit: string) => {
    if (wall1) {
      const converted = convertLength(Number(wall1), wall1Unit, newUnit)
      setWall1(String(Number(converted.toFixed(6))))
    }
    setWall1Unit(newUnit)
  }
  const handleWall2UnitChange = (newUnit: string) => {
    if (wall2) {
      const converted = convertLength(Number(wall2), wall2Unit, newUnit)
      setWall2(String(Number(converted.toFixed(6))))
    }
    setWall2Unit(newUnit)
  }
  const handleCeilingUnitChange = (newUnit: string) => {
    if (ceiling) {
      const converted = convertLength(Number(ceiling), ceilingUnit, newUnit)
      setCeiling(String(Number(converted.toFixed(6))))
    }
    setCeilingUnit(newUnit)
  }
  const handleWallFootageUnitChange = (newUnit: string) => {
    if (wallFootage) {
      const converted = convertArea(Number(wallFootage), wallFootageUnit, newUnit)
      setWallFootage(String(Number(converted.toFixed(6))))
    }
    setWallFootageUnit(newUnit)
  }

  // --- Checkbox selection handler (for RoomShapeRadio) ---
  const handleShapeChange = (newShape: string) => {
    setShape(newShape)
    if (newShape === 'square' || newShape === 'other') {
      setWall2('')
      setWall2Unit('m')
    }
  }

  // --- Validation and Calculation ---
  useEffect(() => {
    setWall1Error('')
    setWall2Error('')
    setCeilingError('')
    setDoorsError('')
    setWindowsError('')

    // Validate wall lengths and ceiling
    if (wall1 && (isNaN(Number(wall1)) || Number(wall1) <= 0)) {
      setWall1Error('Wall length must be greater than 0.')
    }
    if (shape === 'rectangle' && wall2 && (isNaN(Number(wall2)) || Number(wall2) <= 0)) {
      setWall2Error('Wall length must be greater than 0.')
    }
    if (ceiling && (isNaN(Number(ceiling)) || Number(ceiling) <= 0)) {
      setCeilingError('Ceiling height must be greater than 0.')
    }
    if (doors && (!/^\d+$/.test(doors) || Number(doors) < 0)) {
      setDoorsError('Doors must be a non-negative integer.')
    }
    if (windows && (!/^\d+$/.test(windows) || Number(windows) < 0)) {
      setWindowsError('Windows must be a non-negative integer.')
    }

    // Calculate wall footage if all required fields are valid and present
    let valid = true
    let wallAreaInM2 = 0

    if (wall1Error || !wall1) valid = false
    if (ceilingError || !ceiling) valid = false
    if (shape === 'rectangle' && (wall2Error || !wall2)) valid = false

    if (valid) {
      // Convert all measurements to meters for calculation
      const wall1InM = convertLength(Number(wall1), wall1Unit, 'm')
      const ceilingInM = convertLength(Number(ceiling), ceilingUnit, 'm')
      
      if (shape === 'rectangle') {
        const wall2InM = convertLength(Number(wall2), wall2Unit, 'm')
        // Rectangle: wall footage = 2*(wall1+wall2)*ceiling
        wallAreaInM2 = 2 * (wall1InM + wall2InM) * ceilingInM
      } else if (shape === 'square') {
        // Square: wall footage = 4*wall1*ceiling
        wallAreaInM2 = 4 * wall1InM * ceilingInM
      } else if (shape === 'other') {
        // Other: wall footage = wall1*ceiling
        wallAreaInM2 = wall1InM * ceilingInM
      }

      // Subtract doors/windows (convert their areas to m² first)
      const doorsNum = /^\d+$/.test(doors) ? Number(doors) : 0
      const windowsNum = /^\d+$/.test(windows) ? Number(windows) : 0
      
      const totalDoorAreaM2 = doorsNum * DOOR_AREA_M2
      const totalWindowAreaM2 = windowsNum * WINDOW_AREA_M2
      
      wallAreaInM2 -= (totalDoorAreaM2 + totalWindowAreaM2)
      if (wallAreaInM2 < 0) wallAreaInM2 = 0

      // Convert final result to desired unit
      const finalArea = convertArea(wallAreaInM2, 'm2', wallFootageUnit)
      setWallFootage(String(Number(finalArea.toFixed(4))))
    } else {
      setWallFootage('')
    }
  }, [shape, wall1, wall1Unit, wall2, wall2Unit, ceiling, ceilingUnit, doors, windows, wallFootageUnit, wall1Error, wall2Error, ceilingError])

  const handleClear = () => {
    setShape('rectangle')
    setWall1('')
    setWall1Unit('m')
    setWall2('')
    setWall2Unit('m')
    setCeiling('')
    setCeilingUnit('m')
    setDoors('')
    setWindows('')
    setWallFootage('')
    setWallFootageUnit('m2')
    setWall1Error('')
    setWall2Error('')
    setCeilingError('')
    setDoorsError('')
    setWindowsError('')
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">Wall Square Footage Calculator</h1>
        <div className="bg-white rounded-xl shadow p-5 border">
          <RoomShapeRadio value={shape} onChange={handleShapeChange} />
          {shape === 'square' ? (
            <>
              <InputRow
                label="Single wall length"
                value={wall1}
                onValueChange={setWall1}
                unit={wall1Unit}
                unitOptions={unitOptions}
                onUnitChange={handleWall1UnitChange}
                error={wall1Error}
              />
              <InputRow
                label="Ceiling height"
                value={ceiling}
                onValueChange={setCeiling}
                unit={ceilingUnit}
                unitOptions={unitOptions}
                onUnitChange={handleCeilingUnitChange}
                error={ceilingError}
              />
              <InputRow
                label="No. of doors"
                value={doors}
                onValueChange={setDoors}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of doors"
                error={doorsError}
              />
              <InputRow
                label="No. of windows"
                value={windows}
                onValueChange={setWindows}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of windows"
                error={windowsError}
              />
              <InputRow
                label="Wall footage"
                value={wallFootage}
                onValueChange={setWallFootage}
                unit={wallFootageUnit}
                unitOptions={areaUnitOptions}
                onUnitChange={handleWallFootageUnitChange}
                
              />
            </>
          ) : shape === 'other' ? (
            <>
              <InputRow
                label="Total wall length"
                value={wall1}
                onValueChange={setWall1}
                unit={wall1Unit}
                unitOptions={unitOptions}
                onUnitChange={handleWall1UnitChange}
                error={wall1Error}
              />
              <InputRow
                label="Ceiling height"
                value={ceiling}
                onValueChange={setCeiling}
                unit={ceilingUnit}
                unitOptions={unitOptions}
                onUnitChange={handleCeilingUnitChange}
                error={ceilingError}
              />
              <InputRow
                label="No. of doors"
                value={doors}
                onValueChange={setDoors}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of doors"
                error={doorsError}
              />
              <InputRow
                label="No. of windows"
                value={windows}
                onValueChange={setWindows}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of windows"
                error={windowsError}
              />
              <InputRow
                label="Wall footage"
                value={wallFootage}
                onValueChange={setWallFootage}
                unit={wallFootageUnit}
                unitOptions={areaUnitOptions}
                onUnitChange={handleWallFootageUnitChange}
              />
            </>
          ) : (
            <>
              <InputRow
                label="#1 Wall length"
                value={wall1}
                onValueChange={setWall1}
                unit={wall1Unit}
                unitOptions={unitOptions}
                onUnitChange={handleWall1UnitChange}
                error={wall1Error}
              />
              <InputRow
                label="#2 Wall length"
                value={wall2}
                onValueChange={setWall2}
                unit={wall2Unit}
                unitOptions={unitOptions}
                onUnitChange={handleWall2UnitChange}
                error={wall2Error}
              />
              <InputRow
                label="Ceiling height"
                value={ceiling}
                onValueChange={setCeiling}
                unit={ceilingUnit}
                unitOptions={unitOptions}
                onUnitChange={handleCeilingUnitChange}
                error={ceilingError}
              />
              <InputRow
                label="No. of doors"
                value={doors}
                onValueChange={setDoors}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of doors"
                error={doorsError}
              />
              <InputRow
                label="No. of windows"
                value={windows}
                onValueChange={setWindows}
                unit="#"
                unitOptions={undefined}
                onUnitChange={() => {}}
                info="Number of windows"
                error={windowsError}
              />
              <InputRow
                label="Wall footage"
                value={wallFootage}
                onValueChange={setWallFootage}
                unit={wallFootageUnit}
                unitOptions={areaUnitOptions}
                onUnitChange={handleWallFootageUnitChange}
              />
            </>
          )}
          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page