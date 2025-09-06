'use client'
import React, { useState, useEffect } from 'react'

const initialState = {
  shedRoofType: 'Slanted roof',
  shedWidth: '',
  shedWidthUnit: 'feet (ft)',
  shedLength: '',
  shedLengthUnit: 'feet (ft)',
  wallHeight: '',
  wallHeightUnit: 'feet (ft)',
  roofRise: '',
  roofRiseUnit: 'feet (ft)',
  overhang: '',
  overhangUnit: 'feet (ft)',
  rafterLength: '',
  rafterLengthUnit: 'feet (ft)',
  rafterLengthDisplayUnit: 'meters (m)',
  pricePerAreaSlab: '',
  pricePerAreaSlabUnit: 'square foot (ft²)',
  costSlab: '',
  pricePerAreaWall: '',
  pricePerAreaWallUnit: 'square foot (ft²)',
  costWall: '',
  pricePerAreaRoofing: '',
  pricePerAreaRoofingUnit: 'square foot (ft²)',
  costRoofing: '',
  floorAreaUnit: 'square feet (ft²)',
  wallAreaUnit: 'square feet (ft²)',
  roofAreaUnit: 'square feet (ft²)',
}

const unitOptions = {
  length: ['centimeters (cm)', 'meters (m)', 'inches (in)', 'feet (ft)', 'yards (yd)'],
  area: [
    'square centimeters (cm²)',
    'square meters (m²)',
    'square inches (in²)',
    'square feet (ft²)',
    'square yards (yd²)'
  ],
  price: [
    'square centimeter (cm²)',
    'square meter (m²)',
    'square inch (in²)',
    'square foot (ft²)',
    'square yard (yd²)'
  ],
  cost: ['PKR'],
}

// Conversion factors to meters for length units
const lengthFactors: { [unit: string]: number } = {
  'centimeters (cm)': 0.01,
  'meters (m)': 1,
  'inches (in)': 0.0254,
  'feet (ft)': 0.3048,
  'yards (yd)': 0.9144,
}

// Conversion factors to square meters for area units
const areaFactors: { [unit: string]: number } = {
  'square centimeters (cm²)': 0.0001,
  'square meters (m²)': 1,
  'square inches (in²)': 0.00064516,
  'square feet (ft²)': 0.092903,
  'square yards (yd²)': 0.836127,
}

// Conversion factors from PKR/m² to other price units
const priceFactors: { [unit: string]: number } = {
  'square centimeter (cm²)': 10000,
  'square meter (m²)': 1,
  'square inch (in²)': 1550.0031,
  'square foot (ft²)': 10.7639,
  'square yard (yd²)': 1.19599,
}

// Helper to convert length - FIXED VERSION
function convertLength(value: string, fromUnit: string, toUnit: string) {
  if (!value || value.trim() === '') return ''
  const val = parseFloat(value)
  if (isNaN(val)) return value
  if (fromUnit === toUnit) return value
  
  const meters = val * lengthFactors[fromUnit]
  const converted = meters / lengthFactors[toUnit]
  return converted.toFixed(6).replace(/\.?0+$/, '')
}

// Helper to convert area - FIXED VERSION
function convertArea(value: number, fromUnit: string, toUnit: string) {
  if (fromUnit === toUnit) return value
  const sqm = value * areaFactors[fromUnit]
  return sqm / areaFactors[toUnit]
}

// Helper to convert price - FIXED VERSION
function convertPrice(value: string, fromUnit: string, toUnit: string) {
  if (!value || value.trim() === '') return ''
  const val = parseFloat(value)
  if (isNaN(val)) return value
  if (fromUnit === toUnit) return value
  
  const perSqm = val * priceFactors[fromUnit]
  const converted = perSqm / priceFactors[toUnit]
  return converted.toFixed(6).replace(/\.?0+$/, '')
}

// Convert all inputs to meters for calculations
function convertToMeters(value: string, unit: string): number {
  if (!value || value.trim() === '') return 0
  const val = parseFloat(value)
  if (isNaN(val)) return 0
  return val * lengthFactors[unit]
}

// Convert PKR/unit to PKR/m² for calculations
function convertPriceToPerSqM(value: string, unit: string): number {
  if (!value || value.trim() === '') return 0
  const val = parseFloat(value)
  if (isNaN(val)) return 0
  return val * priceFactors[unit]
}

// Calculate areas based on shed dimensions
function calculateAreas(fields: typeof initialState) {
  const L = convertToMeters(fields.shedLength, fields.shedLengthUnit)
  const W = convertToMeters(fields.shedWidth, fields.shedWidthUnit)
  const H = convertToMeters(fields.wallHeight, fields.wallHeightUnit)
  const R = convertToMeters(fields.roofRise, fields.roofRiseUnit)
  const O = convertToMeters(fields.overhang, fields.overhangUnit)

  if (L <= 0 || W <= 0 || H <= 0) {
    return { floorArea: 0, wallArea: 0, roofArea: 0, rafterLength: 0 }
  }

  // Floor area: Af = L × W
  const floorArea = L * W

  // Constants based on roof type
  let c = 0 // roof-type constant
  let t = 1 // rafter constant
  
  if (fields.shedRoofType === 'Slanted roof') {
    c = 1
    t = 1
  } else if (fields.shedRoofType === 'Gable roof') {
    c = 1
    t = 2
  } else if (fields.shedRoofType === 'Flat roof') {
    c = 0
    t = 1
  }

  // Wall area: Aw = 2 × (L + W) × H + (W × R × c)
  const wallArea = 2 * (L + W) * H + (W * R * c)

  // Rafter span calculation
  const rafterLength = Math.sqrt(
    Math.pow(W + 2 * O, 2) + Math.pow(c * R * t * (1 + (2 * O) / W), 2)
  ) / t

  // Roof area: Ar = S × t × (L + 2 × O)
  const roofArea = rafterLength * t * (L + 2 * O)

  return { floorArea, wallArea, roofArea, rafterLength }
}

// Calculate total cost
function calculateTotalCost(fields: typeof initialState, areas: { floorArea: number, wallArea: number, roofArea: number }) {
  const priceFloor = convertPriceToPerSqM(fields.pricePerAreaSlab, fields.pricePerAreaSlabUnit)
  const priceWall = convertPriceToPerSqM(fields.pricePerAreaWall, fields.pricePerAreaWallUnit)
  const priceRoof = convertPriceToPerSqM(fields.pricePerAreaRoofing, fields.pricePerAreaRoofingUnit)

  const costFloor = areas.floorArea * priceFloor
  const costWall = areas.wallArea * priceWall
  const costRoof = areas.roofArea * priceRoof

  const totalCost = costFloor + costWall + costRoof
  
  return { costFloor, costWall, costRoof, totalCost }
}

// FIXED Individual handlers for each input field unit change
function handleUnitChange(
  fieldName: string,
  unitName: string,
  value: string,
  oldUnit: string,
  newUnit: string,
  setFields: React.Dispatch<React.SetStateAction<typeof initialState>>
) {
  let converted = value
  
  // Only convert if we have a value and units are different
  if (value && value.trim() !== '' && oldUnit !== newUnit) {
    if (
      fieldName === 'shedWidth' ||
      fieldName === 'shedLength' ||
      fieldName === 'wallHeight' ||
      fieldName === 'roofRise' ||
      fieldName === 'overhang' ||
      fieldName === 'rafterLength'
    ) {
      converted = convertLength(value, oldUnit, newUnit)
    }
  }
  
  setFields(prev => ({
    ...prev,
    [fieldName]: converted,
    [unitName]: newUnit,
  }))
}

function handlePriceUnitChange(
  fieldName: string,
  unitName: string,
  value: string,
  oldUnit: string,
  newUnit: string,
  setFields: React.Dispatch<React.SetStateAction<typeof initialState>>
) {
  let converted = value
  if (value && value.trim() !== '' && oldUnit !== newUnit) {
    converted = convertPrice(value, oldUnit, newUnit)
  }
  
  setFields(prev => ({
    ...prev,
    [fieldName]: converted,
    [unitName]: newUnit,
  }))
}

const MAX_OVERHANG_METERS = 0.6096 // 2 feet in meters

function getValidationError(fieldName: string, value: string, unit: string) {
  if (!value || value.trim() === '') return ''
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  if (num <= 0) {
    if (fieldName === 'shedWidth') return "Please enter a positive value for your shed's width."
    if (fieldName === 'shedLength') return "Please enter a positive value for your shed's length."
    if (fieldName === 'wallHeight') return "Please enter a positive value for your shed's wall height."
    if (fieldName === 'roofRise') return "Please enter a positive value for your shed's roof rise."
    if (fieldName === 'overhang') return "Please enter a positive value for your shed's overhang."
    if (fieldName === 'rafterLength') return "Please enter a positive value for your shed's rafter length."
    return "Please enter a positive value."
  }
  if (fieldName === 'overhang') {
    const meters = num * lengthFactors[unit]
    if (meters > MAX_OVERHANG_METERS) {
      return `The roof overhang can only have a maximum length of 2 feet (0.6096 meters).`
    }
  }
  return ''
}

const rafterLengthUnits = [
  'centimeters (cm)',
  'meters (m)',
  'inches (in)',
  'feet (ft)',
  'yards (yd)'
]

// Helper for rafter length display conversion
function convertRafterLengthDisplay(value: number, toUnit: string): string {
  if (!value || isNaN(value)) return ''
  // value is always in meters
  const factor = lengthFactors[toUnit]
  if (!factor) return value.toString()
  let converted = value / lengthFactors[toUnit]
  // For meters, show 4 decimals, for others show 2
  const decimals = toUnit === 'meters (m)' ? 4 : 2
  return converted.toFixed(decimals).replace(/\.?0+$/, '')
}

const ShedCalculator = () => {
  const [fields, setFields] = useState(initialState)
  const [calculatedValues, setCalculatedValues] = useState({
    floorArea: 0,
    wallArea: 0,
    roofArea: 0,
    rafterLength: 0,
    costFloor: 0,
    costWall: 0,
    costRoof: 0,
    totalCost: 0
  })

  // Recalculate whenever relevant fields change
  useEffect(() => {
    const areas = calculateAreas(fields)
    const costs = calculateTotalCost(fields, areas)
    
    setCalculatedValues({
      ...areas,
      ...costs
    })

    // Update individual cost fields
    setFields(prev => ({
      ...prev,
      costSlab: costs.costFloor > 0 ? costs.costFloor.toFixed(2) : '',
      costWall: costs.costWall > 0 ? costs.costWall.toFixed(2) : '',
      costRoofing: costs.costRoof > 0 ? costs.costRoof.toFixed(2) : '',
    }))
  }, [
    fields.shedRoofType,
    fields.shedWidth, fields.shedWidthUnit,
    fields.shedLength, fields.shedLengthUnit,
    fields.wallHeight, fields.wallHeightUnit,
    fields.roofRise, fields.roofRiseUnit,
    fields.overhang, fields.overhangUnit,
    fields.pricePerAreaSlab, fields.pricePerAreaSlabUnit,
    fields.pricePerAreaWall, fields.pricePerAreaWallUnit,
    fields.pricePerAreaRoofing, fields.pricePerAreaRoofingUnit
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleClear = () => {
    setFields(initialState)
    setCalculatedValues({
      floorArea: 0,
      wallArea: 0,
      roofArea: 0,
      rafterLength: 0,
      costFloor: 0,
      costWall: 0,
      costRoof: 0,
      totalCost: 0
    })
  }

  // Handler for output area unit dropdowns (display only, doesn't affect calculations)
  const handleOutputAreaUnitChange = (unitField: string, newUnit: string) => {
    setFields(prev => ({
      ...prev,
      [unitField]: newUnit,
    }))
  }

  // Format area values for display based on selected units
  const formatAreaForDisplay = (areaInSqM: number, targetUnit: string): string => {
    if (areaInSqM === 0) return ''
    const converted = convertArea(areaInSqM, 'square meters (m²)', targetUnit)
    return converted.toFixed(4).replace(/\.?0+$/, '')
  }

  // Handler for rafter length display unit dropdown
  const handleRafterLengthUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      rafterLengthDisplayUnit: newUnit,
    }))
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4 mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">DIY Shed Cost Calculator</h1>
      <div className="space-y-6">
        {/* Shed details */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Shed details</h2>
          <label className="block mb-2 text-sm font-medium">Shed roof type</label>
          <select
            name="shedRoofType"
            value={fields.shedRoofType}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mb-3"
          >
            <option value="">Select</option>
            <option value="Slanted roof">Slanted roof</option>
            <option value="Flat roof">Flat roof</option>
            <option value="Gable roof">Gable roof</option>
          </select>
          {fields.shedRoofType === 'Slanted roof' && (
            <>
              <div className="flex items-center justify-center mb-3">
                <img src="/diy1.png" alt="Slanted Roof View" className="w-32 h-24 border rounded object-contain" />
              </div>
              {/* Input fields with dropdowns for units */}
              {[
                { label: 'Shed width (w)', name: 'shedWidth', unitName: 'shedWidthUnit' },
                { label: 'Shed length (l)', name: 'shedLength', unitName: 'shedLengthUnit' },
                { label: 'Wall height (h)', name: 'wallHeight', unitName: 'wallHeightUnit' },
                { label: 'Roof rise (s)', name: 'roofRise', unitName: 'roofRiseUnit' },
                { label: 'Overhang (o)', name: 'overhang', unitName: 'overhangUnit' },
              ].map(field => {
                const error = getValidationError(field.name, fields[field.name as keyof typeof fields] as string, fields[field.unitName as keyof typeof fields] as string)
                return (
                  <div key={field.name} className="mb-2">
                    <label className="block text-sm">{field.label}</label>
                    <div className="flex">
                      <input
                        type="number"
                        name={field.name}
                        value={fields[field.name as keyof typeof fields]}
                        onChange={handleChange}
                        className={`border rounded px-2 py-1 w-full ${error ? 'border-red-500' : ''}`}
                        step="any"
                      />
                      <select
                        name={field.unitName}
                        value={fields[field.unitName as keyof typeof fields]}
                        onChange={e =>
                          handleUnitChange(
                            field.name,
                            field.unitName,
                            fields[field.name as keyof typeof fields] as string,
                            fields[field.unitName as keyof typeof fields] as string,
                            e.target.value,
                            setFields
                          )
                        }
                        className="ml-2 border rounded px-2 py-1 text-xs"
                      >
                        {unitOptions.length.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    {error && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {error}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="mb-2">
                <label className="block text-sm">Rafter length (calculated)</label>
                <div className="flex">
                  <input
                    type="text"
                    value={
                      calculatedValues.rafterLength > 0
                        ? convertRafterLengthDisplay(
                            calculatedValues.rafterLength,
                            fields.rafterLengthDisplayUnit
                          )
                        : ''
                    }
                    readOnly
                    className="border rounded px-2 py-1 w-full bg-gray-100"
                  />
                  <select
                    name="rafterLengthDisplayUnit"
                    value={fields.rafterLengthDisplayUnit}
                    onChange={e => handleRafterLengthUnitChange(e.target.value)}
                    className="ml-2 border rounded px-2 py-1 text-xs"
                  >
                    {rafterLengthUnits.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {fields.shedRoofType === 'Flat roof' && (
            <>
              <div className="flex items-center justify-center mb-3">
                <img src="/diy2.png" alt="Flat Roof View" className="w-32 h-24 border rounded object-contain" />
              </div>
              {/* Only show these fields for Flat roof */}
              {[
                { label: 'Shed width (w)', name: 'shedWidth', unitName: 'shedWidthUnit' },
                { label: 'Shed length (l)', name: 'shedLength', unitName: 'shedLengthUnit' },
                { label: 'Wall height (h)', name: 'wallHeight', unitName: 'wallHeightUnit' },
                { label: 'Overhang (o)', name: 'overhang', unitName: 'overhangUnit' },
              ].map(field => {
                const error = getValidationError(field.name, fields[field.name as keyof typeof fields] as string, fields[field.unitName as keyof typeof fields] as string)
                return (
                  <div key={field.name} className="mb-2">
                    <label className="block text-sm">{field.label}</label>
                    <div className="flex">
                      <input
                        type="number"
                        name={field.name}
                        value={fields[field.name as keyof typeof fields]}
                        onChange={handleChange}
                        className={`border rounded px-2 py-1 w-full ${error ? 'border-red-500' : ''}`}
                        step="any"
                      />
                      <select
                        name={field.unitName}
                        value={fields[field.unitName as keyof typeof fields]}
                        onChange={e =>
                          handleUnitChange(
                            field.name,
                            field.unitName,
                            fields[field.name as keyof typeof fields] as string,
                            fields[field.unitName as keyof typeof fields] as string,
                            e.target.value,
                            setFields
                          )
                        }
                        className="ml-2 border rounded px-2 py-1 text-xs"
                      >
                        {unitOptions.length.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    {error && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {error}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="mb-2">
                <label className="block text-sm">Rafter length (calculated)</label>
                <div className="flex">
                  <input
                    type="text"
                    value={calculatedValues.rafterLength > 0 ? calculatedValues.rafterLength.toFixed(4).replace(/\.?0+$/, '') : ''}
                    readOnly
                    className="border rounded px-2 py-1 w-full bg-gray-100"
                  />
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 border rounded">meters (m)</span>
                </div>
              </div>
            </>
          )}
          {fields.shedRoofType === 'Gable roof' && (
            <>
              <div className="flex items-center justify-center mb-3">
                <img src="/diy3.png" alt="Gable Roof View" className="w-32 h-24 border rounded object-contain" />
              </div>
              {/* Only show these fields for Gable roof */}
              {[
                { label: 'Shed width (W)', name: 'shedWidth', unitName: 'shedWidthUnit' },
                { label: 'Shed length (L)', name: 'shedLength', unitName: 'shedLengthUnit' },
                { label: 'Wall height (H)', name: 'wallHeight', unitName: 'wallHeightUnit' },
                { label: 'Roof rise (R)', name: 'roofRise', unitName: 'roofRiseUnit' },
                { label: 'Overhang (O)', name: 'overhang', unitName: 'overhangUnit' },
              ].map(field => {
                const error = getValidationError(field.name, fields[field.name as keyof typeof fields] as string, fields[field.unitName as keyof typeof fields] as string)
                return (
                  <div key={field.name} className="mb-2">
                    <label className="block text-sm">{field.label}</label>
                    <div className="flex">
                      <input
                        type="number"
                        name={field.name}
                        value={fields[field.name as keyof typeof fields]}
                        onChange={handleChange}
                        className={`border rounded px-2 py-1 w-full ${error ? 'border-red-500' : ''}`}
                        step="any"
                      />
                      <select
                        name={field.unitName}
                        value={fields[field.unitName as keyof typeof fields]}
                        onChange={e =>
                          handleUnitChange(
                            field.name,
                            field.unitName,
                            fields[field.name as keyof typeof fields] as string,
                            fields[field.unitName as keyof typeof fields] as string,
                            e.target.value,
                            setFields
                          )
                        }
                        className="ml-2 border rounded px-2 py-1 text-xs"
                      >
                        {unitOptions.length.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    {error && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {error}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="mb-2">
                <label className="block text-sm">Rafter length (calculated)</label>
                <div className="flex">
                  <input
                    type="text"
                    value={calculatedValues.rafterLength > 0 ? calculatedValues.rafterLength.toFixed(4).replace(/\.?0+$/, '') : ''}
                    readOnly
                    className="border rounded px-2 py-1 w-full bg-gray-100"
                  />
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 border rounded">meters (m)</span>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Output areas */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Output areas</h2>
          {[
            { label: 'Floor area', name: 'floorArea', unitName: 'floorAreaUnit', value: calculatedValues.floorArea },
            { label: 'Wall area', name: 'wallArea', unitName: 'wallAreaUnit', value: calculatedValues.wallArea },
            { label: 'Roof area', name: 'roofArea', unitName: 'roofAreaUnit', value: calculatedValues.roofArea },
          ].map(field => (
            <div key={field.name} className="mb-2">
              <label className="block text-sm">{field.label}</label>
              <div className="flex">
                <input
                  type="text"
                  value={formatAreaForDisplay(field.value, fields[field.unitName as keyof typeof fields] as string)}
                  readOnly
                  className="border rounded px-2 py-1 w-full bg-gray-100"
                />
                <select
                  name={field.unitName}
                  value={fields[field.unitName as keyof typeof fields]}
                  onChange={e => handleOutputAreaUnitChange(field.unitName, e.target.value)}
                  className="ml-2 border rounded px-2 py-1 text-xs"
                >
                  {unitOptions.area.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        {/* Cost of materials */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Cost of materials</h2>
          {/* Slab/foundation */}
          <label className="block text-sm">Price per area of slab or foundation</label>
          <div className="flex mb-2">
            <input
              type="number"
              name="pricePerAreaSlab"
              value={fields.pricePerAreaSlab}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              step="any"
            />
            <select
              name="pricePerAreaSlabUnit"
              value={fields.pricePerAreaSlabUnit}
              onChange={e =>
                handlePriceUnitChange(
                  'pricePerAreaSlab',
                  'pricePerAreaSlabUnit',
                  fields.pricePerAreaSlab,
                  fields.pricePerAreaSlabUnit,
                  e.target.value,
                  setFields
                )
              }
              className="ml-2 border rounded px-2 py-1 text-xs"
            >
              {unitOptions.price.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <label className="block text-sm">Cost of slab or foundation</label>
          <div className="flex mb-2">
            <input
              type="text"
              name="costSlab"
              value={fields.costSlab}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 border rounded">{unitOptions.cost[0]}</span>
          </div>
          {/* Wall */}
          <label className="block text-sm">Price per area of wall</label>
          <div className="flex mb-2">
            <input
              type="number"
              name="pricePerAreaWall"
              value={fields.pricePerAreaWall}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              step="any"
            />
            <select
              name="pricePerAreaWallUnit"
              value={fields.pricePerAreaWallUnit}
              onChange={e =>
                handlePriceUnitChange(
                  'pricePerAreaWall',
                  'pricePerAreaWallUnit',
                  fields.pricePerAreaWall,
                  fields.pricePerAreaWallUnit,
                  e.target.value,
                  setFields
                )
              }
              className="ml-2 border rounded px-2 py-1 text-xs"
            >
              {unitOptions.price.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <label className="block text-sm">Cost of wall</label>
          <div className="flex mb-2">
            <input
              type="text"
              name="costWall"
              value={fields.costWall}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 border rounded">{unitOptions.cost[0]}</span>
          </div>
          {/* Roofing */}
          <label className="block text-sm">Price per area of the roofing</label>
          <div className="flex mb-2">
            <input
              type="number"
              name="pricePerAreaRoofing"
              value={fields.pricePerAreaRoofing}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              step="any"
            />
            <select
              name="pricePerAreaRoofingUnit"
              value={fields.pricePerAreaRoofingUnit}
              onChange={e =>
                handlePriceUnitChange(
                  'pricePerAreaRoofing',
                  'pricePerAreaRoofingUnit',
                  fields.pricePerAreaRoofing,
                  fields.pricePerAreaRoofingUnit,
                  e.target.value,
                  setFields
                )
              }
              className="ml-2 border rounded px-2 py-1 text-xs"
            >
              {unitOptions.price.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <label className="block text-sm">Cost of roofing</label>
          <div className="flex mb-2">
            <input
              type="text"
              name="costRoofing"
              value={fields.costRoofing}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 border rounded">{unitOptions.cost[0]}</span>
          </div>
          {/* Total cost */}
          <label className="block text-sm font-semibold">Total cost of shed</label>
          <input
            type="text"
            name="totalCost"
            value={calculatedValues.totalCost > 0 ? calculatedValues.totalCost.toFixed(2) : ''}
            readOnly
            className="border rounded px-2 py-1 w-full bg-yellow-50 mb-2 font-semibold text-lg"
          />
        </div>
        {/* Clear button */}
        <button
          onClick={handleClear}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold mt-2 transition-colors"
        >
          Clear All Fields
        </button>
      </div>
    </div>
  )
}

export default ShedCalculator