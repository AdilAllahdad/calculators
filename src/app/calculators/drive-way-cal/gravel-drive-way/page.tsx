'use client'
import React, { useState } from 'react'

// Add unit options
const lengthWidthDepthUnits = [
  { value: "cm", label: "centimeters (cm)" },
  { value: "m", label: "meters (m)" },
  { value: "km", label: "kilometers (km)" },
  { value: "in", label: "inches (in)" },
  { value: "ft", label: "feet (ft)" },
  { value: "yd", label: "yards (yd)" },
  { value: "mi", label: "miles (mi)" }
]
const volumeUnitsList = [
  { value: "m3", label: "cubic meters (m³)" },
  { value: "cu_ft", label: "cubic feet (cu ft)" },
  { value: "us_gal", label: "gallons (US) (US gal)" },
  { value: "uk_gal", label: "gallons (UK) (UK gal)" }
]
const materialCostUnits = [
  { value: "m3", label: "cubic meters (m³)" },
  { value: "cu_ft", label: "cubic feet (cu ft)" },
  { value: "us_gal", label: "gallons (US) (US gal)" },
  { value: "uk_gal", label: "gallons (UK) (UK gal)" }
]
const materialWeightUnits = [
  { value: "t", label: "metric tons (t)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "lb", label: "pounds (lb)" },
  { value: "us_ton", label: "US short tons (US ton)" },
  { value: "long_ton", label: "imperial tons (long ton)" }
]
const densityMassUnits = [
  { value: "kg", label: "kilograms (kg)" },
  { value: "t", label: "metric tons (t)" },
  { value: "lb", label: "pounds (lb)" },
  { value: "us_ton", label: "US short tons (US ton)" },
  { value: "long_ton", label: "imperial tons (long ton)" }
]
const densityVolumeUnits = [
  { value: "mm3", label: "cubic millimeter (mm³)" },
  { value: "cm3", label: "cubic centimeter (cm³)" },
  { value: "dm3", label: "cubic decimeter (dm³)" },
  { value: "m3", label: "cubic meter (m³)" },
  { value: "cu_in", label: "cubic inch (cu in)" },
  { value: "cu_ft", label: "cubic foot (cu ft)" },
  { value: "cu_yd", label: "cubic yard (cu yd)" }
]

const page = () => {
  // State for all fields
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [depth, setDepth] = useState('')
  const [depthUnit, setDepthUnit] = useState('cm')
  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('m3')
  const [density, setDensity] = useState('1.25')
  const [densityMassUnit, setDensityMassUnit] = useState('t')
  const [densityVolumeUnit, setDensityVolumeUnit] = useState('m3')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('t')
  const [price, setPrice] = useState('')
  const [pricePerM3, setPricePerM3] = useState('') // Store price per m3 internally for calculation
  const [priceUnit, setPriceUnit] = useState('PKR')
  const [pricePerUnit, setPricePerUnit] = useState('m3')
  const [cost, setCost] = useState('')

  // Validation state
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [depthError, setDepthError] = useState('')
  const [densityError, setDensityError] = useState('')
  const [priceError, setPriceError] = useState('')

  // Helper to parse string to number safely
  const parse = (v: string) => {
    const n = parseFloat(v)
    return isNaN(n) ? 0 : n
  }

  // --- Conversion helpers ---
  // Length/width/depth to meters
  const toMeters: Record<string, (v: number) => number> = {
    cm: v => v / 100,
    m: v => v,
    km: v => v * 1000,
    in: v => v * 0.0254,
    ft: v => v * 0.3048,
    yd: v => v * 0.9144,
    mi: v => v * 1609.34,
  }
  // Meters to unit
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
    us_gal: v => v * 0.00378541,
    uk_gal: v => v * 0.00454609,
  }
  const fromM3: Record<string, (v: number) => number> = {
    m3: v => v,
    cu_ft: v => v / 0.0283168,
    us_gal: v => v / 0.00378541,
    uk_gal: v => v / 0.00454609,
  }
  // Weight conversions
  const toKg: Record<string, (v: number) => number> = {
    kg: v => v,
    t: v => v * 1000,
    lb: v => v * 0.453592,
    us_ton: v => v * 907.185,
    long_ton: v => v * 1016.05,
  }
  const fromKg: Record<string, (v: number) => number> = {
    kg: v => v,
    t: v => v / 1000,
    lb: v => v / 0.453592,
    us_ton: v => v / 907.185,
    long_ton: v => v / 1016.05,
  }
  // Density conversions (mass/volume)
  const toDensityKgPerM3 = (val: number, massUnit: string, volUnit: string) => {
    // Convert mass to kg
    const massKg = toKg[massUnit] ? toKg[massUnit](val) : val
    // Convert volume to m3
    const volM3 = (() => {
      switch (volUnit) {
        case "mm3": return 1e-9
        case "cm3": return 1e-6
        case "dm3": return 1e-3
        case "m3": return 1
        case "cu_in": return 0.0000163871
        case "cu_ft": return 0.0283168
        case "cu_yd": return 0.764555
        default: return 1
      }
    })()
    return massKg / volM3
  }

  // --- Validation logic ---
  React.useEffect(() => {
    setLengthError(length && parse(length) <= 0 ? 'Length should be greater than 0.' : '')
    setWidthError(width && parse(width) <= 0 ? 'Width should be greater than 0.' : '')
    setDepthError(depth && parse(depth) <= 0 ? 'Depth should be greater than 0.' : '')
    setDensityError(density && parse(density) <= 0 ? 'Density should be greater than 0.' : '')
    setPriceError(price && parse(price) < 0 ? 'Price should not be negative.' : '')
  }, [length, width, depth, density, price])

  // --- Calculation logic ---
  // Calculate volume (m³) from length, width, depth
  React.useEffect(() => {
    const l = parse(length)
    const w = parse(width)
    const d = parse(depth)
    if (l > 0 && w > 0 && d > 0) {
      const l_m = toMeters[lengthUnit] ? toMeters[lengthUnit](l) : l
      const w_m = toMeters[widthUnit] ? toMeters[widthUnit](w) : w
      const d_m = toMeters[depthUnit] ? toMeters[depthUnit](d) : d
      const vol_m3 = l_m * w_m * d_m
      setVolume(vol_m3 > 0 ? String(Number(fromM3[volumeUnit] ? fromM3[volumeUnit](vol_m3) : vol_m3).toFixed(6)) : '')
    } else {
      setVolume('')
    }
    // eslint-disable-next-line
  }, [length, width, depth, lengthUnit, widthUnit, depthUnit, volumeUnit])

  // Calculate weight from volume and density
  React.useEffect(() => {
    const v = parse(volume)
    const d = parse(density)
    if (v > 0 && d > 0) {
      // Convert volume to m³
      const v_m3 = toM3[volumeUnit] ? toM3[volumeUnit](v) : v
      // Convert density to t/m³
      let dens_t_per_m3 = d
      if (densityMassUnit !== 't' || densityVolumeUnit !== 'm3') {
        // Convert to kg/m³ then to t/m³
        const dens_kg_per_m3 = toDensityKgPerM3(d, densityMassUnit, densityVolumeUnit)
        dens_t_per_m3 = dens_kg_per_m3 / 1000
      }
      const weight_t = v_m3 * dens_t_per_m3
      setWeight(weight_t > 0 ? String(Number(fromKg[weightUnit] ? fromKg[weightUnit](weight_t * 1000) : weight_t * 1000).toFixed(6)) : '')
    } else {
      setWeight('')
    }
    // eslint-disable-next-line
  }, [volume, density, volumeUnit, densityMassUnit, densityVolumeUnit, weightUnit])

  // Update internal price per m3 when price input changes
  React.useEffect(() => {
    const p = parse(price)
    if (p >= 0) {
      // Convert price to per m3 for internal storage
      if (toM3[pricePerUnit]) {
        const pricePerM3Value = p / toM3[pricePerUnit](1)
        setPricePerM3(String(pricePerM3Value))
      } else {
        setPricePerM3(price)
      }
    } else {
      setPricePerUnit('m3')
    setPricePerM3('')
    }
  }, [price, pricePerUnit])

  // Calculate cost from volume and internal price per m3 - NOT affected by price unit display
  React.useEffect(() => {
    const v = parse(volume)
    const p = parse(pricePerM3) // Use internal price per m3
    if (v > 0 && p >= 0) {
      // Convert volume to m3
      const v_m3 = toM3[volumeUnit] ? toM3[volumeUnit](v) : v
      // Calculate total cost using internal price per m3
      const total = v_m3 * p
      setCost(total > 0 ? String(Number(total.toFixed(2))) : '')
    } else {
      setCost('')
    }
  }, [volume, pricePerM3, volumeUnit]) // Removed pricePerUnit dependency

  // --- Handlers for independent dropdowns with conversion ---
  // Each input field and dropdown only updates its own value/unit, but when the unit changes, the value is converted to the new unit

  // Length
  const handleLengthUnitChange = (unit: string) => {
    if (length) {
      const val = parse(length)
      const meters = toMeters[lengthUnit] ? toMeters[lengthUnit](val) : val
      const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
      setLength(String(Number(newVal.toFixed(6))))
    }
    setLengthUnit(unit)
  }

  // Width
  const handleWidthUnitChange = (unit: string) => {
    if (width) {
      const val = parse(width)
      const meters = toMeters[widthUnit] ? toMeters[widthUnit](val) : val
      const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
      setWidth(String(Number(newVal.toFixed(6))))
    }
    setWidthUnit(unit)
  }

  // Depth
  const handleDepthUnitChange = (unit: string) => {
    if (depth) {
      const val = parse(depth)
      const meters = toMeters[depthUnit] ? toMeters[depthUnit](val) : val
      const newVal = fromMeters[unit] ? fromMeters[unit](meters) : meters
      setDepth(String(Number(newVal.toFixed(6))))
    }
    setDepthUnit(unit)
  }

  // Volume
  const handleVolumeUnitChange = (unit: string) => {
    if (volume) {
      const val = parse(volume)
      const m3 = toM3[volumeUnit] ? toM3[volumeUnit](val) : val
      const newVal = fromM3[unit] ? fromM3[unit](m3) : m3
      setVolume(String(Number(newVal.toFixed(6))))
    }
    setVolumeUnit(unit)
  }

  // Density mass unit
  const handleDensityMassUnitChange = (unit: string) => {
    if (density) {
      const val = parse(density)
      // Convert to kg/m3, then to new mass unit per current volume unit
      const kgPerM3 = toDensityKgPerM3(val, densityMassUnit, densityVolumeUnit)
      // Convert back to new mass unit per current volume unit
      // mass = kgPerM3 * volUnit (in m3)
      const volM3 = (() => {
        switch (densityVolumeUnit) {
          case "mm3": return 1e-9
          case "cm3": return 1e-6
          case "dm3": return 1e-3
          case "m3": return 1
          case "cu_in": return 0.0000163871
          case "cu_ft": return 0.0283168
          case "cu_yd": return 0.764555
          default: return 1
        }
      })()
      const massInKg = kgPerM3 * volM3
      const newVal = fromKg[unit] ? fromKg[unit](massInKg) : massInKg
      setDensity(String(Number(newVal.toFixed(6))))
    }
    setDensityMassUnit(unit)
  }

  // Density volume unit
  const handleDensityVolumeUnitChange = (unit: string) => {
    if (density) {
      const val = parse(density)
      // Convert to kg/m3, then to current mass unit per new volume unit
      const kgPerM3 = toDensityKgPerM3(val, densityMassUnit, densityVolumeUnit)
      // Convert back to current mass unit per new volume unit
      const volM3 = (() => {
        switch (unit) {
          case "mm3": return 1e-9
          case "cm3": return 1e-6
          case "dm3": return 1e-3
          case "m3": return 1
          case "cu_in": return 0.0000163871
          case "cu_ft": return 0.0283168
          case "cu_yd": return 0.764555
          default: return 1
        }
      })()
      const massInKg = kgPerM3 * volM3
      const newVal = fromKg[densityMassUnit] ? fromKg[densityMassUnit](massInKg) : massInKg
      setDensity(String(Number(newVal.toFixed(6))))
    }
    setDensityVolumeUnit(unit)
  }

  // Weight
  const handleWeightUnitChange = (unit: string) => {
    if (weight) {
      const val = parse(weight)
      const kg = toKg[weightUnit] ? toKg[weightUnit](val) : val
      const newVal = fromKg[unit] ? fromKg[unit](kg) : kg
      setWeight(String(Number(newVal.toFixed(6))))
    }
    setWeightUnit(unit)
  }

  // Price per unit - Convert display value when unit changes, but keep calculation consistent
  const handlePricePerUnitChange = (unit: string) => {
    if (price) {
      const val = parse(price)
      // Convert current price to per m3, then to new unit for display
      if (toM3[pricePerUnit] && fromM3[unit]) {
        const pricePerM3Value = val / toM3[pricePerUnit](1)
        const newVal = pricePerM3Value * toM3[unit](1)
        setPrice(String(Number(newVal.toFixed(6))))
      }
    }
    setPricePerUnit(unit)
  }

  const handleClear = () => {
    setLength('')
    setLengthUnit('m')
    setWidth('')
    setWidthUnit('m')
    setDepth('')
    setDepthUnit('cm')
    setVolume('')
    setVolumeUnit('m3')
    setDensity('1.25')
    setDensityMassUnit('t')
    setDensityVolumeUnit('m3')
    setWeight('')
    setWeightUnit('t')
    setPrice('')
    setPriceUnit('PKR')
    setPricePerM3('')
    setCost('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gravel Driveway Calculator</h1>
      <div className="w-full max-w-md space-y-6">
        {/* Driveway dimensions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
            <span>Driveway dimensions</span>
            <span className="text-gray-300 text-xl">⌄</span>
          </div>
          <div className="space-y-4">
            {/* Length */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Length</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400 ${lengthError ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder=""
                />
                <div className="w-1/2">
                  <select
                    value={lengthUnit}
                    onChange={e => handleLengthUnitChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  >
                    {lengthWidthDepthUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {lengthError && <div className="text-red-600 text-sm mt-1">{lengthError}</div>}
            </div>
            {/* Width */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Width</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400 ${widthError ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder=""
                />
                <div className="w-1/2">
                  <select
                    value={widthUnit}
                    onChange={e => handleWidthUnitChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  >
                    {lengthWidthDepthUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {widthError && <div className="text-red-600 text-sm mt-1">{widthError}</div>}
            </div>
            {/* Depth */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Depth</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={depth}
                  onChange={e => setDepth(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400 ${depthError ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder=""
                />
                <div className="w-1/2">
                  <select
                    value={depthUnit}
                    onChange={e => handleDepthUnitChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  >
                    {lengthWidthDepthUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {depthError && <div className="text-red-600 text-sm mt-1">{depthError}</div>}
            </div>
          </div>
        </div>
        {/* Volume of stone */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
            <span>Volume of stone</span>
            <span className="text-gray-300 text-xl">⌄</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Total crushed stone</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400"
                placeholder=""
              />
              <div className="w-1/2">
                <select
                  value={volumeUnit}
                  onChange={e => handleVolumeUnitChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                >
                  {volumeUnitsList.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Total weight */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
            <span>Total weight</span>
            <span className="text-gray-300 text-xl">⌄</span>
          </div>
          <div className="space-y-4">
            {/* Crushed stone density */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Crushed stone density</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={density}
                  onChange={e => setDensity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-400 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-500"
                  placeholder=""
                  style={{ minWidth: 0 }}
                />
                <div className="flex gap-1 items-center bg-white rounded-lg border border-blue-400 px-1 py-0.5 w-2/3">
                  <select
                    value={densityMassUnit}
                    onChange={e => handleDensityMassUnitChange(e.target.value)}
                    className="bg-white text-blue-700 font-semibold outline-none border-none px-1 py-1 w-1/2"
                  >
                    {densityMassUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                  <span className="mx-1 text-gray-400 font-semibold">/</span>
                  <select
                    value={densityVolumeUnit}
                    onChange={e => handleDensityVolumeUnitChange(e.target.value)}
                    className="bg-white text-blue-700 font-semibold outline-none border-none px-1 py-1 w-1/2"
                  >
                    {densityVolumeUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Material weight */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Material weight</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400"
                  placeholder=""
                  style={{ minWidth: 0 }}
                />
                <div className="w-1/2">
                  <select
                    value={weightUnit}
                    onChange={e => handleWeightUnitChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  >
                    {materialWeightUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Total cost */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
            <span>Total cost</span>
            <span className="text-gray-300 text-xl">⌄</span>
          </div>
          <div className="space-y-4">
            {/* Material price */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Material price</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400"
                  placeholder="PKR"
                />
                <span className="text-gray-400 font-semibold">/</span>
                <div className="w-1/2">
                  <select
                    value={pricePerUnit}
                    onChange={e => handlePricePerUnitChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  >
                    {materialCostUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Material cost */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium">Material cost</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none focus:border-blue-400"
                  placeholder="PKR"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Clear button */}
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