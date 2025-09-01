'use client'
import React, { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'

// Add all rock types and densities from the screenshot
const rockTypeOptions = [
  { label: 'Standard river rock', value: 'standard', density: 1425 },
  { label: 'Bank gravel', value: 'bank_gravel', density: 1483 },
  { label: 'Cheshire pink gravel', value: 'cheshire_pink_gravel', density: 1545 },
  { label: 'Congo River rock', value: 'congo_river_rock', density: 1314 },
  { label: 'Cotswold buff', value: 'cotswold_buff', density: 1670 },
  { label: 'Cotswold Gold gravel', value: 'cotswold_gold_gravel', density: 2098 },
  { label: 'Crushed asphalt', value: 'crushed_asphalt', density: 721 },
  { label: 'Crushed granite', value: 'crushed_granite', density: 1320 },
  { label: 'Crushed stone', value: 'crushed_stone', density: 1602 },
  { label: 'Crystal River rock', value: 'crystal_river_rock', density: 1522 },
  { label: 'Dolomite gravel', value: 'dolomite_gravel', density: 1865 },
  { label: 'Granite', value: 'granite', density: 2650 },
  { label: 'Ivory Coast gravel', value: 'ivory_coast_gravel', density: 1506 },
  { label: 'Pea gravel', value: 'pea_gravel', density: 1788 },
  { label: 'Peace River rock', value: 'peace_river_rock', density: 1490 },
  { label: 'Quartzite', value: 'quartzite', density: 2700 },
  { label: 'Regular gravel', value: 'regular_gravel', density: 1346 },
  { label: 'Sunset gold gravel', value: 'sunset_gold_gravel', density: 1505 },
  { label: 'White marble chips', value: 'white_marble_chips', density: 1430 },
  { label: 'Enter a custom', value: 'custom', density: 0 },
]

// Density dropdown units
const densityUnits = [
  { label: 'tons per cubic meter(t/m³)', value: 't/m³' },
  { label: 'kilograms per cubic meter(kg/m³)', value: 'kg/m³' },
  { label: 'grams per cubic centimeter(g/cm³)', value: 'g/cm³' },
  { label: 'pounds per cubic inch(lb/cu in)', value: 'lb/cu in' },
  { label: 'pounds per cubic feet(lb/cu ft)', value: 'lb/cu ft' },
  { label: 'pounds per cubic yard(lb/cu yd)', value: 'lb/cu yd' },
]

// Length units
const lengthUnits = [
  { label: 'centimeters(cm)', value: 'cm' },
  { label: 'meters(m)', value: 'm' },
  { label: 'kilometers(km)', value: 'km' },
  { label: 'inches(in)', value: 'in' },
  { label: 'feet(ft)', value: 'ft' },
  { label: 'yards(yd)', value: 'yd' },
  { label: 'miles(mi)', value: 'mi' },
]

// Area units
const areaUnits = [
  { label: 'square centimeters(cm²)', value: 'cm²' },
  { label: 'square meters(m²)', value: 'm²' },
  { label: 'square kilometers(km²)', value: 'km²' },
  { label: 'square inches(in²)', value: 'in²' },
  { label: 'square feet(ft²)', value: 'ft²' },
  { label: 'square yards(yd²)', value: 'yd²' },
  { label: 'square miles(mi²)', value: 'mi²' },
]

// Volume units
const volumeUnits = [
  { label: 'cubic centimeters(cm³)', value: 'cm³' },
  { label: 'cubic meters(m³)', value: 'm³' },
  { label: 'cubic inches(cu in)', value: 'cu in' },
  { label: 'cubic feet(cu ft)', value: 'cu ft' },
  { label: 'cubic yards(cu yd)', value: 'cu yd' },
]

const wastageUnits = [
  { label: '%', value: '%' }
]

// Weight units
const weightUnits = [
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'stones (st)', value: 'st' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' }
]

// Price mass units
const priceMassUnits = [
  { label: 'kilograms (kg)', value: 'kg' },
  { label: 'metric tons (t)', value: 't' },
  { label: 'pounds (lb)', value: 'lb' },
  { label: 'stones (st)', value: 'st' },
  { label: 'US short tons (US ton)', value: 'us_ton' },
  { label: 'imperial tons (long ton)', value: 'long_ton' }
]

// Price volume units
const priceVolumeUnits = [
  { label: 'cubic centimeters (cm³)', value: 'cm³' },
  { label: 'cubic meters (m³)', value: 'm³' },
  { label: 'cubic inches (cu in)', value: 'cu in' },
  { label: 'cubic feet (cu ft)', value: 'cu ft' },
  { label: 'cubic yards (cu yd)', value: 'cu yd' }
]

const initialState = {
  rockType: 'standard',
  density: '1425',
  densityUnit: 'kg/m³',
  length: '',
  lengthUnit: 'm',
  width: '',
  widthUnit: 'm',
  area: '',
  areaUnit: 'm²',
  depth: '',
  depthUnit: 'cm',
  volume: '',
  volumeUnit: 'm³',
  wastage: '5',
  wastageUnit: '%',
  volumeNeeded: '',
  volumeNeededUnit: 'm³',
  weightNeeded: '',
  weightNeededUnit: 'long_ton',
  pricePerMass: '',
  pricePerMassUnit: 'kg',
  pricePerVolume: '',
  pricePerVolumeUnit: 'm³',
  totalCost: '',
  // Store actual calculation values separately (always in standard units)
  lengthBase: '', // Always in meters for calculations
  widthBase: '', // Always in meters for calculations
  pricePerMassBase: '', // Always in PKR per kg for calculations
  depthBase: '', // Always in meters for calculations
  areaBase: '', // Always in m² for calculations
  volumeBase: '', // Always in m³ for calculations
  volumeNeededBase: '', // Always in m³ for calculations
  weightNeededBase: '', // Always in kg for calculations
}

// --- ALL display values in dropdowns are converted using standard units. Only display changes! ---
// --- Calculation logic is untouched ---

// Density: standard is kg/m³
function convertDensityToKgM3(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 't/m³': return v * 1000
    case 'kg/m³': return v
    case 'g/cm³': return v * 1000
    case 'lb/cu in': return v * 27679.9
    case 'lb/cu ft': return v * 16.0185
    case 'lb/cu yd': return v * 0.593276
    default: return v
  }
}
function convertDensityFromKgM3(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 't/m³': return (value / 1000).toString()
    case 'kg/m³': return value.toString()
    case 'g/cm³': return (value / 1000).toString()
    case 'lb/cu in': return (value / 27679.9).toString()
    case 'lb/cu ft': return (value / 16.0185).toString()
    case 'lb/cu yd': return (value / 0.593276).toString()
    default: return value.toString()
  }
}

// Length: standard is meters
function convertLengthToM(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 'cm': return v / 100
    case 'm': return v
    case 'km': return v * 1000
    case 'in': return v * 0.0254
    case 'ft': return v * 0.3048
    case 'yd': return v * 0.9144
    case 'mi': return v * 1609.344
    default: return v
  }
}
function convertLengthFromM(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 'cm': return (value * 100).toString()
    case 'm': return value.toString()
    case 'km': return (value / 1000).toString()
    case 'in': return (value / 0.0254).toString()
    case 'ft': return (value / 0.3048).toString()
    case 'yd': return (value / 0.9144).toString()
    case 'mi': return (value / 1609.344).toString()
    default: return value.toString()
  }
}

// Area: standard is m²
function convertAreaToM2(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 'cm²': return v / 10000
    case 'm²': return v
    case 'km²': return v * 1000000
    case 'in²': return v * 0.00064516
    case 'ft²': return v * 0.092903
    case 'yd²': return v * 0.836127
    case 'mi²': return v * 2590000
    default: return v
  }
}
function convertAreaFromM2(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 'cm²': return (value * 10000).toString()
    case 'm²': return value.toString()
    case 'km²': return (value / 1000000).toString()
    case 'in²': return (value / 0.00064516).toString()
    case 'ft²': return (value / 0.092903).toString()
    case 'yd²': return (value / 0.836127).toString()
    case 'mi²': return (value / 2590000).toString()
    default: return value.toString()
  }
}

// Volume: standard is m³
function convertVolumeToM3(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 'cm³': return v / 1000000
    case 'm³': return v
    case 'cu in': return v * 0.0000163871
    case 'cu ft': return v * 0.0283168
    case 'cu yd': return v * 0.764555
    default: return v
  }
}
function convertVolumeFromM3(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 'cm³': return (value * 1000000).toString()
    case 'm³': return value.toString()
    case 'cu in': return (value / 0.0000163871).toString()
    case 'cu ft': return (value / 0.0283168).toString()
    case 'cu yd': return (value / 0.764555).toString()
    default: return value.toString()
  }
}

// Weight: standard is kg
function convertWeightToKg(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 'kg': return v
    case 't': return v * 1000
    case 'lb': return v * 0.453592
    case 'st': return v * 6.35029
    case 'us_ton': return v * 907.185
    case 'long_ton': return v * 1016.05
    default: return v
  }
}
function convertWeightFromKg(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 'kg': return value.toString()
    case 't': return (value / 1000).toString()
    case 'lb': return (value / 0.453592).toString()
    case 'st': return (value / 6.35029).toString()
    case 'us_ton': return (value / 907.185).toString()
    case 'long_ton': return (value / 1016.0469088).toString()
    default: return value.toString()
  }
}

// Price per mass conversion
function convertPricePerMassToKg(value: string, from: string): number {
  const v = parseFloat(value)
  if (isNaN(v)) return 0
  switch (from) {
    case 'kg': return v
    case 't': return v / 1000
    case 'lb': return v / 0.453592
    case 'st': return v / 6.35029
    case 'us_ton': return v / 907.185
    case 'long_ton': return v / 1016.05
    default: return v
  }
}
function convertPricePerMassFromKg(value: number, to: string): string {
  if (isNaN(value)) return ''
  switch (to) {
    case 'kg': return value.toString()
    case 't': return (value * 1000).toString()
    case 'lb': return (value * 0.453592).toString()
    case 'st': return (value * 6.35029).toString()
    case 'us_ton': return (value * 907.185).toString()
    case 'long_ton': return (value * 1016.05).toString()
    default: return value.toString()
  }
}

const InfoIcon = ({ title }: { title: string }) => (
  <span className="ml-1 text-gray-400 cursor-pointer" title={title}>ⓘ</span>
)

type Fields = typeof initialState

const initialErrors = {
  length: '',
  width: '',
  area: '',
  depth: '',
  volume: '',
  wastage: '',
  volumeNeeded: '',
  weightNeeded: '',
  density: '',
  pricePerMass: '',
  pricePerVolume: '',
  totalCost: ''
}

const Page = () => {
  const [fields, setFields] = useState<Fields>(initialState)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string }>(initialErrors)

  // Validation handler for negative values
  const validateField = (name: string, value: string) => {
    if (
      [
        'length', 'width', 'area', 'depth', 'volume', 'wastage',
        'volumeNeeded', 'weightNeeded', 'density', 'pricePerMass', 'pricePerVolume', 'totalCost'
      ].includes(name)
    ) {
      if (value && parseFloat(value) < 0) {
        let msg = 'Please input a positive value'
        if (name === 'length') msg += ' for the length of your river rock bed.'
        else if (name === 'width') msg += ' for the width of your river rock bed.'
        else if (name === 'area') msg += ' for the area.'
        else if (name === 'depth') msg += ' for the depth.'
        else if (name === 'volume') msg += ' for the volume.'
        else if (name === 'wastage') msg += ' for the wastage.'
        else if (name === 'volumeNeeded') msg += ' for the volume needed.'
        else if (name === 'weightNeeded') msg += ' for the weight needed.'
        else if (name === 'density') msg += ' for the density.'
        else if (name === 'pricePerMass') msg += ' for the price per mass.'
        else if (name === 'pricePerVolume') msg += ' for the price per volume.'
        else if (name === 'totalCost') msg += ' for the total cost.'
        setErrors(prev => ({ ...prev, [name]: msg }))
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  useEffect(() => {
    if (isCalculating) return
    setIsCalculating(true)

    // Get standard values for calculations using BASE values
    const lengthM = parseFloat(fields.lengthBase) || 0
    const widthM = parseFloat(fields.widthBase) || 0
    const depthM = parseFloat(fields.depthBase) || 0
    const areaM2 = parseFloat(fields.areaBase) || 0
    const volumeM3 = parseFloat(fields.volumeBase) || 0
    const wastagePercent = parseFloat(fields.wastage) || 0
    const densityKgM3 = convertDensityToKgM3(fields.density, fields.densityUnit)
    const pricePerMassBasePKRperKG = parseFloat(fields.pricePerMassBase) || 0

    // Use a typed updates object
    let updates: Partial<Fields> = {}

    // 1. Area calculation (A = length × width) using BASE values
    let finalAreaM2 = 0
    if (lengthM > 0 && widthM > 0) {
      finalAreaM2 = lengthM * widthM
      updates.areaBase = finalAreaM2.toString()
      updates.area = convertAreaFromM2(finalAreaM2, fields.areaUnit)
    } else if (areaM2 > 0) {
      finalAreaM2 = areaM2
    }

    // 2. Volume calculation (V = A × depth) using BASE depth value
    let finalVolumeM3 = 0
    if (finalAreaM2 > 0 && depthM > 0) {
      finalVolumeM3 = finalAreaM2 * depthM
      updates.volumeBase = finalVolumeM3.toString()
      updates.volume = convertVolumeFromM3(finalVolumeM3, fields.volumeUnit)
    } else if (volumeM3 > 0) {
      finalVolumeM3 = volumeM3
    }

    // 3. Volume needed = Volume × (1 + wastage%)
    let volumeNeededM3 = 0
    if (finalVolumeM3 > 0) {
      volumeNeededM3 = finalVolumeM3 * (1 + wastagePercent / 100)
      updates.volumeNeededBase = volumeNeededM3.toString()
      updates.volumeNeeded = convertVolumeFromM3(volumeNeededM3, fields.volumeNeededUnit)
    }

    // 4. Weight needed = Volume needed × density
    let weightNeededKg = 0
    if (volumeNeededM3 > 0 && densityKgM3 > 0) {
      weightNeededKg = volumeNeededM3 * densityKgM3
      updates.weightNeededBase = weightNeededKg.toString()
      updates.weightNeeded = convertWeightFromKg(weightNeededKg, fields.weightNeededUnit)
    }

    // 5. Price per volume calculation
    if (pricePerMassBasePKRperKG > 0 && densityKgM3 > 0) {
      const pricePerM3 = pricePerMassBasePKRperKG * densityKgM3
      const pricePerVolumeUnit = pricePerM3 * convertVolumeToM3('1', fields.pricePerVolumeUnit)
      updates.pricePerVolume = pricePerVolumeUnit.toFixed(2)
    }

    // 6. Total cost calculation
    if (pricePerMassBasePKRperKG > 0 && weightNeededKg > 0) {
      const totalCost = weightNeededKg * pricePerMassBasePKRperKG
      updates.totalCost = totalCost.toFixed(2)
    }

    // Format calculated values properly
    if ('area' in updates && updates.area && parseFloat(updates.area) > 0) {
      updates.area = parseFloat(updates.area).toFixed(1)
    }
    if ('volume' in updates && updates.volume && parseFloat(updates.volume) > 0) {
      updates.volume = parseFloat(updates.volume).toFixed(1)
    }
    if ('volumeNeeded' in updates && updates.volumeNeeded && parseFloat(updates.volumeNeeded) > 0) {
      updates.volumeNeeded = parseFloat(updates.volumeNeeded).toFixed(1)
    }
    if ('weightNeeded' in updates && updates.weightNeeded && parseFloat(updates.weightNeeded) > 0) {
      updates.weightNeeded = parseFloat(updates.weightNeeded).toFixed(1)
    }
    if ('totalCost' in updates && updates.totalCost && parseFloat(updates.totalCost) > 0) {
      updates.totalCost = parseFloat(updates.totalCost).toFixed(2)
    }
    if ('pricePerVolume' in updates && updates.pricePerVolume && parseFloat(updates.pricePerVolume) > 0) {
      updates.pricePerVolume = parseFloat(updates.pricePerVolume).toFixed(2)
    }

    if (Object.keys(updates).length > 0) {
      setFields(prev => ({
        ...prev,
        ...updates
      }))
    }

    setTimeout(() => setIsCalculating(false), 50)
  }, [
    fields.lengthBase,
    fields.widthBase,
    fields.areaBase,
    fields.depthBase,
    fields.volumeBase,
    fields.wastage,
    fields.density,
    fields.densityUnit,
    fields.pricePerMassBase,
    fields.pricePerVolumeUnit,
    fields.volumeNeededUnit,
    fields.weightNeededUnit,
    isCalculating
  ])

  // Handlers for input changes
  const handleLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('length', value)
    const lengthInMeters = convertLengthToM(value || '0', fields.lengthUnit)
    setFields(prev => ({
      ...prev,
      length: value,
      lengthBase: lengthInMeters.toString()
    }))
  }

  const handleLengthUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const meters = parseFloat(fields.lengthBase) || 0
    setFields(prev => ({
      ...prev,
      lengthUnit: newUnit,
      length: meters ? convertLengthFromM(meters, newUnit) : ''
    }))
  }

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('width', value)
    const widthInMeters = convertLengthToM(value || '0', fields.widthUnit)
    setFields(prev => ({
      ...prev,
      width: value,
      widthBase: widthInMeters.toString()
    }))
  }

  const handleWidthUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const meters = parseFloat(fields.widthBase) || 0
    setFields(prev => ({
      ...prev,
      widthUnit: newUnit,
      width: meters ? convertLengthFromM(meters, newUnit) : ''
    }))
  }

  const handleAreaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('area', value)
    const areaInM2 = convertAreaToM2(value || '0', fields.areaUnit)
    setFields(prev => ({
      ...prev,
      area: value,
      areaBase: areaInM2.toString()
    }))
  }

  const handleAreaUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const m2 = parseFloat(fields.areaBase) || 0
    setFields(prev => ({
      ...prev,
      areaUnit: newUnit,
      area: m2 ? convertAreaFromM2(m2, newUnit) : ''
    }))
  }

  const handleDepthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('depth', value)
    const depthInMeters = convertLengthToM(value || '0', fields.depthUnit)
    setFields(prev => ({
      ...prev,
      depth: value,
      depthBase: depthInMeters.toString()
    }))
  }

  const handleDepthUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const meters = parseFloat(fields.depthBase) || 0
    setFields(prev => ({
      ...prev,
      depthUnit: newUnit,
      depth: meters ? convertLengthFromM(meters, newUnit) : ''
    }))
  }

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('volume', value)
    const volumeInM3 = convertVolumeToM3(value || '0', fields.volumeUnit)
    setFields(prev => ({
      ...prev,
      volume: value,
      volumeBase: volumeInM3.toString()
    }))
  }

  const handleVolumeUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const m3 = parseFloat(fields.volumeBase) || 0
    setFields(prev => ({
      ...prev,
      volumeUnit: newUnit,
      volume: m3 ? convertVolumeFromM3(m3, newUnit) : ''
    }))
  }

  const handleVolumeNeededUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const m3 = parseFloat(fields.volumeNeededBase) || 0
    setFields(prev => ({
      ...prev,
      volumeNeededUnit: newUnit,
      volumeNeeded: m3 ? convertVolumeFromM3(m3, newUnit) : ''
    }))
  }

  const handleWeightNeededUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const kg = parseFloat(fields.weightNeededBase) || 0
    setFields(prev => ({
      ...prev,
      weightNeededUnit: newUnit,
      weightNeeded: kg ? convertWeightFromKg(kg, newUnit) : ''
    }))
  }

  const handlePricePerMassChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('pricePerMass', value)
    const pricePerKg = convertPricePerMassToKg(value || '0', fields.pricePerMassUnit)
    setFields(prev => ({
      ...prev,
      pricePerMass: value,
      pricePerMassBase: pricePerKg.toString()
    }))
  }

  const handlePricePerMassUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    const kg = parseFloat(fields.pricePerMassBase) || 0
    setFields(prev => ({
      ...prev,
      pricePerMassUnit: newUnit,
      pricePerMass: kg ? convertPricePerMassFromKg(kg, newUnit) : ''
    }))
  }

  const handleDensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateField('density', value)
    setFields(prev => ({
      ...prev,
      density: value
    }))
  }

  const handleDensityUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value
    // Convert the current density value to the new unit
    const currentDensityKgM3 = convertDensityToKgM3(fields.density, fields.densityUnit)
    const newDensityValue = convertDensityFromKgM3(currentDensityKgM3, newUnit)
    setFields(prev => ({
      ...prev,
      densityUnit: newUnit,
      density: newDensityValue
    }))
  }

  const handleRockTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = rockTypeOptions.find(rt => rt.value === e.target.value)
    if (selected) {
      const densityInNewUnit = convertDensityFromKgM3(selected.density, fields.densityUnit)
      setFields(prev => ({
        ...prev,
        rockType: e.target.value,
        density: densityInNewUnit
      }))
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    validateField(name, value)
    setFields(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClear = () => {
    setFields(initialState)
    setErrors(initialErrors)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">River rock calculator</h1>
        
        {/* River rock specifications */}
        <div className="bg-white rounded-xl shadow p-5 border mb-5">
          <div className="font-semibold mb-3 flex items-center gap-2">
            <span>River rock specifications</span>
          </div>
          {/* Rock type styling */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rock type</label>
            <select
              name="rockType"
              value={fields.rockType}
              onChange={handleRockTypeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {rockTypeOptions.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>
          {/* Density styling */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">Density</label>
            <div className="flex">
              <input
                type="number"
                name="density"
                value={fields.density}
                onChange={handleDensityChange}
                className={`flex-1 border ${errors.density ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              <select
                name="densityUnit"
                value={fields.densityUnit}
                onChange={handleDensityUnitChange}
                className="w-44 border border-l-0 border-gray-300 rounded-r-lg px-2 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {densityUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.density && <div className="text-red-500 text-xs mt-1">{errors.density}</div>}
          </div>
        </div>

        {/* How much river rock do you need? */}
        <div className="bg-white rounded-xl shadow p-5 border mb-5">
          <div className="font-semibold mb-3 flex items-center gap-2">
            <span>How much river rock do you need?</span>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Length <InfoIcon title="Length" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="length"
                value={fields.length}
                onChange={handleLengthChange}
                className={`flex-1 border ${errors.length ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="lengthUnit"
                value={fields.lengthUnit}
                onChange={handleLengthUnitChange}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.length && <div className="text-red-500 text-xs mt-1">{errors.length}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Width <InfoIcon title="Width" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="width"
                value={fields.width}
                onChange={handleWidthChange}
                className={`flex-1 border ${errors.width ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="widthUnit"
                value={fields.widthUnit}
                onChange={handleWidthUnitChange}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.width && <div className="text-red-500 text-xs mt-1">{errors.width}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Area <InfoIcon title="Area" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="area"
                value={fields.area}
                onChange={handleAreaChange}
                className={`flex-1 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="areaUnit"
                value={fields.areaUnit}
                onChange={handleAreaUnitChange}
                className="w-36 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.area && <div className="text-red-500 text-xs mt-1">{errors.area}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Depth <InfoIcon title="Depth" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="depth"
                value={fields.depth}
                onChange={handleDepthChange}
                className={`flex-1 border ${errors.depth ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="depthUnit"
                value={fields.depthUnit}
                onChange={handleDepthUnitChange}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.depth && <div className="text-red-500 text-xs mt-1">{errors.depth}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Volume <InfoIcon title="Volume" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="volume"
                value={fields.volume}
                onChange={handleVolumeChange}
                className={`flex-1 border ${errors.volume ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="volumeUnit"
                value={fields.volumeUnit}
                onChange={handleVolumeUnitChange}
                className="w-36 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {volumeUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.volume && <div className="text-red-500 text-xs mt-1">{errors.volume}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Wastage <InfoIcon title="Wastage" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="wastage"
                value={fields.wastage}
                onChange={handleChange}
                className={`flex-1 border ${errors.wastage ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="wastageUnit"
                value={fields.wastageUnit}
                onChange={handleChange}
                className="w-16 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {wastageUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.wastage && <div className="text-red-500 text-xs mt-1">{errors.wastage}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Volume needed <InfoIcon title="Volume needed" />
            </label>
            <div className="flex">
              <input
                type="number"
                name="volumeNeeded"
                value={fields.volumeNeeded}
                readOnly
                className={`flex-1 border ${errors.volumeNeeded ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm bg-gray-100`}
              />
              <select
                name="volumeNeededUnit"
                value={fields.volumeNeededUnit}
                onChange={handleVolumeNeededUnitChange}
                className="w-36 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {volumeUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.volumeNeeded && <div className="text-red-500 text-xs mt-1">{errors.volumeNeeded}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Weight needed
            </label>
            <div className="flex">
              <input
                type="number"
                name="weightNeeded"
                value={fields.weightNeeded}
                readOnly
                className={`flex-1 border ${errors.weightNeeded ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm bg-gray-100`}
              />
              <select
                name="weightNeededUnit"
                value={fields.weightNeededUnit}
                onChange={handleWeightNeededUnitChange}
                className="w-40 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {weightUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.weightNeeded && <div className="text-red-500 text-xs mt-1">{errors.weightNeeded}</div>}
          </div>
        </div>

        {/* How much will the river rock cost you? */}
        <div className="bg-white rounded-xl shadow p-5 border mb-5">
          <div className="font-semibold mb-3 flex items-center gap-2">
            <span>How much will the river rock cost you?</span>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Price per one unit of mass
            </label>
            <div className="flex">
              <input
                type="number"
                name="pricePerMass"
                value={fields.pricePerMass}
                onChange={handlePricePerMassChange}
                className={`flex-1 border ${errors.pricePerMass ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
                placeholder="PKR"
              />
              <select
                name="pricePerMassUnit"
                value={fields.pricePerMassUnit}
                onChange={handlePricePerMassUnitChange}
                className="w-40 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {priceMassUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.pricePerMass && <div className="text-red-500 text-xs mt-1">{errors.pricePerMass}</div>}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Price per one unit of volume
            </label>
            <div className="flex">
              <input
                type="number"
                name="pricePerVolume"
                value={fields.pricePerVolume}
                readOnly
                className={`flex-1 border ${errors.pricePerVolume ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm bg-gray-100`}
                placeholder="PKR"
              />
              <select
                name="pricePerVolumeUnit"
                value={fields.pricePerVolumeUnit}
                onChange={handleChange}
                className="w-40 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {priceVolumeUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {errors.pricePerVolume && <div className="text-red-500 text-xs mt-1">{errors.pricePerVolume}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Total cost
            </label>
            <input
              type="number"
              name="totalCost"
              value={fields.totalCost}
              readOnly
              className={`w-full border ${errors.totalCost ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm bg-gray-100`}
              placeholder="PKR"
            />
            {errors.totalCost && <div className="text-red-500 text-xs mt-1">{errors.totalCost}</div>}
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex justify-center">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
            onClick={handleClear}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page