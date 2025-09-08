'use client'
import React, { useState } from 'react'

const initialState = {
  length: '',
  lengthUnit: 'meters (m)',
  width: '',
  widthUnit: 'millimeters (mm)',
  depth: '',
  depthUnit: 'millimeters (mm)',
  volumeNeeded: '',
  volumeUnit: 'cubic millimeters (mm³)',
  wastage: '5',
  wastageUnit: '%',
  actualVolumeNeeded: '',
  actualVolumeUnit: 'cubic millimeters (mm³)',
  packageSize: '310 mL cartridge',
  customVolumeInput: '',
  customVolumeUnit: 'ml',
  packagesNeeded: '',
  packagesUnit: 'pcs',
  pricePerPiece: '',
  pricePerPieceUnit: 'PKR',
  costOfSealant: '',
}

const lengthUnits = [
  'centimeters (cm)',
  'meters (m)',
  'inches (in)',
  'feet (ft)',
  'yards (yd)'
]
const widthDepthUnits = [
  'millimeters (mm)',
  'centimeters (cm)',
  'inches (in)'
]
const volumeUnitsFull = [
  'cubic millimeters (mm³)',
  'cubic centimeters (cm³)',
  'cubic inches (cu in)',
  'milliliters (ml)',
  'liters (l)',
  'fluid ounces (US) (US fl oz)',
  'fluid ounces (UK) (UK fl oz)',
  'pints (US) (US pt)',
  'pints (UK) (UK pt)'
]
const packageSizes = [
  '310 mL cartridge',
  '380 mL cartridge',
  '600 mL sausage',
  '10.1 oz. cartridge',
  '10.3 oz. cartridge',
  '20 oz. sausage',
  '1 qt. jar',
  '1.0 (US) gallon pail',
  '1.5 (US) gallon pail',
  'Enter custom tube volume'
]

// Conversion factors for length units
const lengthFactors: { [unit: string]: number } = {
  'millimeters (mm)': 0.001,
  'centimeters (cm)': 0.01,
  'meters (m)': 1,
  'inches (in)': 0.0254,
  'feet (ft)': 0.3048,
  'yards (yd)': 0.9144,
}
// Conversion factors for width/depth units
const widthDepthFactors: { [unit: string]: number } = {
  'millimeters (mm)': 0.001,
  'centimeters (cm)': 0.01,
  'inches (in)': 0.0254,
}
// Conversion factors for volume units
const volumeFactors: { [unit: string]: number } = {
  'cubic millimeters (mm³)': 0.000000001,
  'cubic centimeters (cm³)': 0.000001,
  'cubic inches (cu in)': 0.0000163871,
  'milliliters (ml)': 0.000001,
  'liters (l)': 0.001,
  'fluid ounces (US) (US fl oz)': 0.0000295735,
  'fluid ounces (UK) (UK fl oz)': 0.0000284131,
  'pints (US) (US pt)': 0.000473176,
  'pints (UK) (UK pt)': 0.000568261,
}

// Individual conversion functions
function convertLengthDisplay(value: string, fromUnit: string, toUnit: string): string {
  if (!value || isNaN(Number(value))) return value
  const meters = Number(value) * (lengthFactors[fromUnit] || 1)
  const converted = meters / (lengthFactors[toUnit] || 1)
  return converted.toString()
}
function convertWidthDepthDisplay(value: string, fromUnit: string, toUnit: string): string {
  if (!value || isNaN(Number(value))) return value
  const meters = Number(value) * (widthDepthFactors[fromUnit] || 1)
  const converted = meters / (widthDepthFactors[toUnit] || 1)
  return converted.toString()
}
function convertVolumeDisplay(value: string, fromUnit: string, toUnit: string): string {
  if (!value || isNaN(Number(value))) return value
  const cubicMeters = Number(value) * (volumeFactors[fromUnit] || 1)
  const converted = cubicMeters / (volumeFactors[toUnit] || 1)
  return converted.toString()
}
function convertCustomVolumeDisplay(value: string, fromUnit: string, toUnit: string): string {
  if (!value || isNaN(Number(value))) return value
  // Convert to ml first
  let mlValue = Number(value)
  if (fromUnit === 'l') mlValue *= 1000
  if (fromUnit === 'oz') mlValue *= 29.5735
  if (fromUnit === 'qt') mlValue *= 946.353
  if (fromUnit === 'gal') mlValue *= 3785.41
  
  // Convert from ml to target unit
  if (toUnit === 'l') return (mlValue / 1000).toString()
  if (toUnit === 'oz') return (mlValue / 29.5735).toString()
  if (toUnit === 'qt') return (mlValue / 946.353).toString()
  if (toUnit === 'gal') return (mlValue / 3785.41).toString()
  return mlValue.toString() // for ml
}

const page = () => {
  const [fields, setFields] = useState(initialState)

  function getValidationError(fieldName: string, value: string) {
    if (!value || value.trim() === '') return ''
    const num = parseFloat(value)
    if (isNaN(num)) return ''
    if (num <= 0) {
      if (fieldName === 'length') return 'The length of your sealant bead cannot be negative or zero.'
      if (fieldName === 'width') return 'The width of your sealant bead cannot be negative or zero.'
      if (fieldName === 'depth') return 'The depth of your sealant bead cannot be negative or zero.'
      if (fieldName === 'wastage') return 'Wastage cannot be negative or zero.'
      return 'Value cannot be negative or zero.'
    }
    return ''
  }

  function calculateVolumeNeeded(length: string, lengthUnit: string, width: string, widthUnit: string, depth: string, depthUnit: string, volumeUnit: string) {
    // Convert all to meters
    const l = parseFloat(length) * (lengthFactors[lengthUnit] || 1)
    const w = parseFloat(width) * (widthDepthFactors[widthUnit] || 1)
    const d = parseFloat(depth) * (widthDepthFactors[depthUnit] || 1)
    if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) return ''
    // Calculate volume in cubic meters
    const volumeM3 = l * w * d
    // Convert to selected unit for display
    const factor = volumeFactors[volumeUnit] || 1
    return (volumeM3 / factor).toString()
  }

  function calculateActualVolumeNeeded(volumeNeeded: string, wastage: string, volumeUnit: string) {
    const v = parseFloat(volumeNeeded)
    const w = parseFloat(wastage)
    if (isNaN(v) || isNaN(w) || v <= 0) return ''
    // Actual volume = volumeNeeded / (1 - wastage/100)
    const actual = v / (1 - w / 100)
    return actual.toString()
  }

  function calculatePackagesNeeded(actualVolume: string, packageSize: string, customVolumeInput?: string, customVolumeUnit?: string) {
    if (packageSize === 'Enter custom tube volume') {
      if (!customVolumeInput || !customVolumeUnit) return ''
      let sizeML = parseFloat(customVolumeInput)
      if (customVolumeUnit === 'l') sizeML *= 1000
      if (customVolumeUnit === 'oz') sizeML *= 29.5735
      if (customVolumeUnit === 'qt') sizeML *= 946.353
      if (customVolumeUnit === 'gal') sizeML *= 3785.41
      const actualML = parseFloat(actualVolume)
      if (isNaN(actualML) || actualML <= 0 || isNaN(sizeML) || sizeML <= 0) return ''
      return Math.ceil(actualML / sizeML).toString()
    }

    // Handle predefined package sizes
    let sizeML: number
    if (packageSize.includes('mL')) {
      sizeML = parseFloat(packageSize)
    } else if (packageSize.includes('oz')) {
      sizeML = parseFloat(packageSize) * 29.5735
    } else if (packageSize.includes('qt')) {
      sizeML = 946.353
    } else if (packageSize.includes('gallon')) {
      sizeML = parseFloat(packageSize) * 3785.41
    } else {
      return ''
    }

    const actualML = parseFloat(actualVolume)
    if (isNaN(actualML) || actualML <= 0 || isNaN(sizeML) || sizeML <= 0) return ''
    return Math.ceil(actualML / sizeML).toString()
  }

  function calculateCost(packagesNeeded: string, pricePerPiece: string) {
    const n = parseInt(packagesNeeded)
    const price = parseFloat(pricePerPiece)
    if (isNaN(n) || isNaN(price) || n <= 0 || price <= 0) return ''
    return (n * price).toString()
  }

  // Handlers for each dropdown
  const handleLengthUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      length: convertLengthDisplay(prev.length, prev.lengthUnit, newUnit),
      lengthUnit: newUnit,
    }))
  }
  const handleWidthUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      width: convertWidthDepthDisplay(prev.width, prev.widthUnit, newUnit),
      widthUnit: newUnit,
    }))
  }
  const handleDepthUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      depth: convertWidthDepthDisplay(prev.depth, prev.depthUnit, newUnit),
      depthUnit: newUnit,
    }))
  }
  
  // Volume needed dropdown - only for display conversion, doesn't affect calculation
  const handleVolumeNeededUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      volumeUnit: newUnit,
    }))
  }
  
  // Actual volume needed dropdown - only for display conversion
  const handleActualVolumeUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      actualVolumeUnit: newUnit,
    }))
  }

  // Handle custom volume unit change
  const handleCustomVolumeUnitChange = (newUnit: string) => {
    setFields(prev => ({
      ...prev,
      customVolumeInput: convertCustomVolumeDisplay(prev.customVolumeInput, prev.customVolumeUnit, newUnit),
      customVolumeUnit: newUnit,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleClear = () => {
    setFields(initialState)
  }

  // Calculate all results - always use the base calculation unit (cubic millimeters)
  const volumeNeededBase = calculateVolumeNeeded(fields.length, fields.lengthUnit, fields.width, fields.widthUnit, fields.depth, fields.depthUnit, 'cubic millimeters (mm³)')
  const actualVolumeNeededBase = calculateActualVolumeNeeded(volumeNeededBase, fields.wastage, 'cubic millimeters (mm³)')
  
  // Convert for display in selected units
  const volumeNeededDisplay = volumeNeededBase ? convertVolumeDisplay(volumeNeededBase, 'cubic millimeters (mm³)', fields.volumeUnit) : ''
  const actualVolumeNeededDisplay = actualVolumeNeededBase ? convertVolumeDisplay(actualVolumeNeededBase, 'cubic millimeters (mm³)', fields.actualVolumeUnit) : ''
  
  // For package calculation, convert actual volume to mL
  const actualVolumeML = actualVolumeNeededBase ? convertVolumeDisplay(actualVolumeNeededBase, 'cubic millimeters (mm³)', 'milliliters (ml)') : ''
  const packagesNeeded = calculatePackagesNeeded(
    actualVolumeML, 
    fields.packageSize,
    fields.customVolumeInput,
    fields.customVolumeUnit
  )
  const costOfSealant = calculateCost(packagesNeeded, fields.pricePerPiece)

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4 mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">Sealant Calculator</h1>
      <div className="space-y-6">
        {/* Details of what needs sealing */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Details of what needs sealing</h2>
          {/* Length */}
          <div className="mb-2">
            <label className="block text-sm">Length <span title="Length of joint">ℹ️</span></label>
            <div className="flex">
              <input type="number" name="length" value={fields.length} onChange={handleChange} className={`border rounded px-2 py-1 w-full${getValidationError('length', fields.length) ? ' border-red-500' : ''}`} />
              <select name="lengthUnit" value={fields.lengthUnit} onChange={e => handleLengthUnitChange(e.target.value)} className="ml-2 border rounded px-2 py-1 text-xs">
                {lengthUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {getValidationError('length', fields.length) && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getValidationError('length', fields.length)}
              </div>
            )}
          </div>
          {/* Width */}
          <div className="mb-2">
            <label className="block text-sm">Width <span title="Width of joint">ℹ️</span></label>
            <div className="flex">
              <input type="number" name="width" value={fields.width} onChange={handleChange} className={`border rounded px-2 py-1 w-full${getValidationError('width', fields.width) ? ' border-red-500' : ''}`} />
              <select name="widthUnit" value={fields.widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} className="ml-2 border rounded px-2 py-1 text-xs">
                {widthDepthUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {getValidationError('width', fields.width) && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getValidationError('width', fields.width)}
              </div>
            )}
          </div>
          {/* Depth */}
          <div className="mb-2">
            <label className="block text-sm">Depth <span title="Depth of joint">ℹ️</span></label>
            <div className="flex">
              <input type="number" name="depth" value={fields.depth} onChange={handleChange} className={`border rounded px-2 py-1 w-full${getValidationError('depth', fields.depth) ? ' border-red-500' : ''}`} />
              <select name="depthUnit" value={fields.depthUnit} onChange={e => handleDepthUnitChange(e.target.value)} className="ml-2 border rounded px-2 py-1 text-xs">
                {widthDepthUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {getValidationError('depth', fields.depth) && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getValidationError('depth', fields.depth)}
              </div>
            )}
          </div>
          {/* Volume needed */}
          <div className="mb-2">
            <label className="block text-sm">Volume needed <span title="Calculated volume">ℹ️</span></label>
            <div className="flex">
              <input type="text" name="volumeNeeded" value={volumeNeededDisplay} readOnly className="border rounded px-2 py-1 w-full bg-gray-100" />
              <select name="volumeUnit" value={fields.volumeUnit} onChange={e => handleVolumeNeededUnitChange(e.target.value)} className="ml-2 border rounded px-2 py-1 text-xs">
                {volumeUnitsFull.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {/* Wastage */}
          <div className="mb-2">
            <label className="block text-sm">Wastage <span title="Wastage percentage">ℹ️</span></label>
            <div className="flex">
              <input type="number" name="wastage" value={fields.wastage} onChange={handleChange} className={`border rounded px-2 py-1 w-full${getValidationError('wastage', fields.wastage) ? ' border-red-500' : ''}`} />
              <span className="ml-2 self-center text-xs">%</span>
            </div>
            {getValidationError('wastage', fields.wastage) && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getValidationError('wastage', fields.wastage)}
              </div>
            )}
          </div>
          {/* Actual volume needed */}
          <div className="mb-2">
            <label className="block text-sm">Actual volume needed <span title="Volume including wastage">ℹ️</span></label>
            <div className="flex">
              <input type="text" name="actualVolumeNeeded" value={actualVolumeNeededDisplay} readOnly className="border rounded px-2 py-1 w-full bg-gray-100" />
              <select name="actualVolumeUnit" value={fields.actualVolumeUnit} onChange={e => handleActualVolumeUnitChange(e.target.value)} className="ml-2 border rounded px-2 py-1 text-xs">
                {volumeUnitsFull.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
        {/* Sealant needed */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Sealant needed</h2>
          <label className="block text-sm">Package size <span title="Select package size">ℹ️</span></label>
          <select name="packageSize" value={fields.packageSize} onChange={handleChange} className="w-full border rounded px-2 py-1 mb-2">
            {packageSizes.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          {fields.packageSize === 'Enter custom tube volume' && (
            <div className="mb-2">
              <label className="block text-sm">Package content volume <span title="Enter custom volume">ℹ️</span></label>
              <div className="flex">
                <input 
                  type="number" 
                  name="customVolumeInput" 
                  value={fields.customVolumeInput} 
                  onChange={handleChange} 
                  className="border rounded px-2 py-1 w-full" 
                  placeholder="Enter volume"
                />
                <select 
                  name="customVolumeUnit" 
                  value={fields.customVolumeUnit} 
                  onChange={e => handleCustomVolumeUnitChange(e.target.value)} 
                  className="ml-2 border rounded px-2 py-1 text-xs"
                >
                  <option value="ml">milliliters (ml)</option>
                  <option value="l">liters (l)</option>
                  <option value="oz">fluid ounces (fl oz)</option>
                  <option value="qt">quarts (qt)</option>
                  <option value="gal">gallons (gal)</option>
                </select>
              </div>
            </div>
          )}
          
          <label className="block text-sm">Number of packages needed <span title="Calculated">ℹ️</span></label>
          <input type="text" name="packagesNeeded" value={packagesNeeded} readOnly className="border rounded px-2 py-1 w-full bg-gray-100 mb-2" />
        </div>
        {/* Cost */}
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Cost</h2>
          <label className="block text-sm">Price per piece <span title="PKR per package">ℹ️</span></label>
          <div className="flex mb-2">
            <input type="number" name="pricePerPiece" value={fields.pricePerPiece} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
            <span className="ml-2 text-xs">PKR /pc</span>
          </div>
          <label className="block text-sm">Cost of sealant <span title="Calculated">ℹ️</span></label>
          <input type="text" name="costOfSealant" value={costOfSealant} readOnly className="border rounded px-2 py-1 w-full bg-gray-100" />
        </div>
        <button
          onClick={handleClear}
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold mt-2"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default page