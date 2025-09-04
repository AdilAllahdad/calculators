'use client'
import React, { useState } from 'react'

const alloys = [
  { value: 'aluminum', label: 'Aluminum (average)', density: 2700 },
  { value: 'melted', label: 'Melted aluminum', density: 2600 },
  { value: '1050', label: 'Aluminum 1050', density: 2710 },
  { value: '1100', label: 'Aluminum 1100', density: 2720 },
  { value: '3103', label: 'Aluminum 3103', density: 3730 },
  { value: '5005', label: 'Aluminum 5005', density: 2700 },
  { value: '5083', label: 'Aluminum 5083', density: 2650 },
  { value: '5215', label: 'Aluminum 5215', density: 2690 },
  { value: '5454', label: 'Aluminum 5454', density: 2690 },
  { value: '5754', label: 'Aluminum 5754', density: 2660 },
  { value: '6005', label: 'Aluminum 6005', density: 2700 },
  { value: '6061', label: 'Aluminum 6061', density: 2700 },
  { value: '6063', label: 'Aluminum 6063', density: 2700 },
  { value: '6082', label: 'Aluminum 6082', density: 2700 },
  { value: '7075', label: 'Aluminum 7075', density: 2800 }
]
const shapes = [
  { value: 'rectangular', label: 'Rectangular prism (plate)' },
  { value: 'circular', label: 'Circular prism' },
  { value: 'hexagonal', label: 'Hexagonal prism' },
  { value: 'octagonal', label: 'Octagonal prism' },
  { value: 'ringprism', label: 'Ring prism' },
  { value: 'wire', label: 'Wire' },
  { value: 'tube', label: 'Tube' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'ring', label: 'Ring (torus)' },
  { value: 'can', label: 'Can' },
  { value: 'other', label: 'Other prisms' }
]
const lengthUnits = [
  { value: 'mm', label: 'millimeters (mm)' },
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'dm', label: 'decimeters (dm)' },
  { value: 'm', label: 'meters (m)' },
  { value: 'km', label: 'kilometers (km)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' },
  { value: 'yd', label: 'yards (yd)' }
]
const weightUnits = [
  { value: 'g', label: 'grams (g)' },
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 't', label: 'metric tons (t)' },
  { value: 'oz', label: 'ounces (oz)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'st', label: 'stones (st)' },
  { value: 'us_ton', label: 'US short tons (US ton)' },
  { value: 'uk_ton', label: 'imperial tons (long ton)' }
]
const volumeUnits = [
  { value: 'mm3', label: 'cubic millimeters (mm³)' },
  { value: 'cm3', label: 'cubic centimeters (cm³)' },
  { value: 'dm3', label: 'cubic decimeters (dm³)' },
  { value: 'm3', label: 'cubic meters (m³)' },
  { value: 'km3', label: 'cubic kilometers (km³)' },
  { value: 'cuin', label: 'cubic inches (cu in)' },
  { value: 'cuft', label: 'cubic feet (cu ft)' },
  { value: 'cuyd', label: 'cubic yards (cu yd)' },
  { value: 'cumi', label: 'cubic miles (cu mi)' }
]

// Unit conversion factors to meters (base unit)
interface LengthConversionFactors {
  mm: number;
  cm: number;
  dm: number;
  m: number;
  km: number;
  in: number;
  ft: number;
  yd: number;
  [key: string]: number; // Index signature
}

const lengthConversionFactors: LengthConversionFactors = {
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144
}

// Unit conversion factors to kilograms (base unit)
interface WeightConversionFactors {
  g: number;
  kg: number;
  t: number;
  oz: number;
  lb: number;
  st: number;
  us_ton: number;
  uk_ton: number;
  [key: string]: number;
}

const weightConversionFactors: WeightConversionFactors = {
  g: 0.001,
  kg: 1,
  t: 1000,
  oz: 0.0283495,
  lb: 0.453592,
  st: 6.35029,
  us_ton: 907.185,
  uk_ton: 1016.05
}

// Unit conversion factors to cubic meters (base unit)
interface VolumeConversionFactors {
  mm3: number;
  cm3: number;
  dm3: number;
  m3: number;
  km3: number;
  cuin: number;
  cuft: number;
  cuyd: number;
  cumi: number;
  [key: string]: number;
}

const volumeConversionFactors: VolumeConversionFactors = {
  mm3: 1e-9,
  cm3: 1e-6,
  dm3: 0.001,
  m3: 1,
  km3: 1e9,
  cuin: 0.0000163871,
  cuft: 0.0283168,
  cuyd: 0.764555,
  cumi: 4.168e9
}

// Helper to convert between units
function convertUnit(
  value: string,
  fromUnit: string,
  toUnit: string,
  conversionTable: { [key: string]: number }
): string {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  const base = num * (conversionTable[fromUnit] || 1)
  const converted = base / (conversionTable[toUnit] || 1)
  return converted.toFixed(6)
}

// Volume calculation functions
const calculateRectangularVolume = (length: number, width: number, thickness: number) => {
  return length * width * thickness
}

const calculateCircularVolume = (radius: number, thickness: number) => {
  return Math.PI * radius * radius * thickness
}

// Fix for Hexagonal prism calculation: use correct formula for hexagonal prism volume
const calculateHexagonalVolume = (sideLength: number, thickness: number) => {
  // Correct formula: (3 * sqrt(3) / 2) * a^2 * h
  return (3 * Math.sqrt(3) / 2) * sideLength * sideLength * thickness
}

const calculateOctagonalVolume = (sideLength: number, thickness: number) => {
  return 2 * (1 + Math.sqrt(2)) * sideLength * sideLength * thickness
}

const calculateRingPrismVolume = (outerRadius: number, innerRadius: number, thickness: number) => {
  return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * thickness
}

const calculateWireVolume = (length: number, diameter: number) => {
  const radius = diameter / 2
  return Math.PI * radius * radius * length
}

const calculateTubeVolume = (length: number, outerDiameter: number, innerDiameter: number) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2
  return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * length
}

const calculateSphereVolume = (radius: number) => {
  return (4/3) * Math.PI * radius * radius * radius
}

// Fix for Ring (torus) weight calculation
const calculateRingTorusVolume = (innerRadius: number, outerRadius: number) => {
  // Correct formula for torus: V = 2 * π^2 * R * r^2
  // R = distance from center of tube to center of torus (major radius)
  // r = radius of tube (minor radius)
  // In your UI: thickness = outer radius (R), length = inner radius (r)
  // So: major radius = (outerRadius + innerRadius) / 2
  //      minor radius = (outerRadius - innerRadius) / 2
  const majorRadius = (outerRadius + innerRadius) / 2
  const minorRadius = (outerRadius - innerRadius) / 2
  if (minorRadius <= 0) return 0
  return 2 * Math.PI * Math.PI * majorRadius * minorRadius * minorRadius
}

// Fix for Can volume calculation: use correct wall thickness, not (outerRadius - innerRadius) as thickness
const calculateCanVolume = (
  height: number,
  innerRadius: number,
  outerRadius: number,
  baseHeight: number,
  lidHeight: number = 0
) => {
  // Main body volume (hollow cylinder)
  const bodyVolume = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * height;
  
  // Base volume (solid disk)
  const baseVolume = Math.PI * outerRadius * outerRadius * baseHeight;
  
  // Lid volume (solid disk)
  const lidVolume = lidHeight > 0 ? Math.PI * outerRadius * outerRadius * lidHeight : 0;

  return bodyVolume + baseVolume + lidVolume;
}

// Define convertToMeters once at the top level
const convertToMeters = (value: string, unit: string): number => {
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num * (lengthConversionFactors[unit] || 1)
}

const page = () => {
  const [alloy, setAlloy] = useState('aluminum')
  const [shape, setShape] = useState('rectangular')
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('m')
  const [width, setWidth] = useState('')
  const [widthUnit, setWidthUnit] = useState('m')
  const [thickness, setThickness] = useState('')
  const [thicknessUnit, setThicknessUnit] = useState('m')
  const [volume, setVolume] = useState('')
  const [volumeUnit, setVolumeUnit] = useState('m3')
  const [pieces, setPieces] = useState('1')
  const [resultUnit, setResultUnit] = useState('kg')
  const [result, setResult] = useState('')
  const [canHasLid, setCanHasLid] = useState(true)
  const [lidHeight, setLidHeight] = useState('')
  const [lidHeightUnit, setLidHeightUnit] = useState('mm')
  const [baseHeight, setBaseHeight] = useState('')
  const [baseHeightUnit, setBaseHeightUnit] = useState('mm')
  const [outerRadius, setOuterRadius] = useState('')
  const [outerRadiusUnit, setOuterRadiusUnit] = useState('km')
  const [innerDiameter, setInnerDiameter] = useState('')
  const [innerDiameterUnit, setInnerDiameterUnit] = useState('dm')
  const [innerRadius, setInnerRadius] = useState('')
  const [innerRadiusUnit, setInnerRadiusUnit] = useState('km')
  const [tubeThickness, setTubeThickness] = useState('')
  const [tubeThicknessUnit, setTubeThicknessUnit] = useState('mm')

  // Tube auto-calculation logic (move these inside the component and only declare once)
  const [tubeOuterRadiusUnit, setTubeOuterRadiusUnit] = useState(widthUnit)
  const [tubeInnerRadiusUnit, setTubeInnerRadiusUnit] = useState(innerDiameterUnit)
  const [tubeThicknessDisplayUnit, setTubeThicknessDisplayUnit] = useState(thicknessUnit)

  // Calculate base values in meters (use unique variable names)
  // Make sure convertToMeters is declared before this block
  const isTubeShape = shape === 'tube'
  const tubeOuterDiameterVal = convertToMeters(width, widthUnit)
  const tubeInnerDiameterVal = convertToMeters(innerDiameter, innerDiameterUnit)
  const tubeOuterRadiusVal = tubeOuterDiameterVal / 2
  const tubeInnerRadiusVal = tubeInnerDiameterVal / 2
  const tubeThicknessVal = tubeOuterRadiusVal - tubeInnerRadiusVal

  // Conversion for display only
  const getTubeOuterRadiusDisplay = () => {
    return (tubeOuterRadiusVal / (lengthConversionFactors[tubeOuterRadiusUnit] || 1)).toFixed(6)
  }
  const getTubeInnerRadiusDisplay = () => {
    return (tubeInnerRadiusVal / (lengthConversionFactors[tubeInnerRadiusUnit] || 1)).toFixed(6)
  }
  const getTubeThicknessDisplay = () => {
    return (tubeThicknessVal / (lengthConversionFactors[tubeThicknessDisplayUnit] || 1)).toFixed(6)
  }

  // Handlers for dropdowns (display only)
  const handleTubeOuterRadiusUnitChange = (newUnit: string) => {
    setTubeOuterRadiusUnit(newUnit)
  }
  const handleTubeInnerRadiusUnitChange = (newUnit: string) => {
    setTubeInnerRadiusUnit(newUnit)
  }
  const handleTubeThicknessDisplayUnitChange = (newUnit: string) => {
    setTubeThicknessDisplayUnit(newUnit)
  }

  const handleClear = () => {
    setLength('')
    setWidth('')
    setThickness('')
    setVolume('')
    setPieces('1')
    setResult('')
    setLengthUnit('m')
    setWidthUnit('m')
    setThicknessUnit('m')
    setVolumeUnit('m3')
    setResultUnit('kg')
    setLidHeight('')
    setLidHeightUnit('mm')
    setBaseHeight('')
    setBaseHeightUnit('mm')
    setOuterRadius('')
    setOuterRadiusUnit('km')
    setInnerDiameter('')
    setInnerDiameterUnit('dm')
    setInnerRadius('')
    setInnerRadiusUnit('km')
    setTubeThickness('')
    setTubeThicknessUnit('mm')
  }

  // Helper function to render dimension input fields
  const renderDimensionField = (
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    unit: string,
    setUnit: React.Dispatch<React.SetStateAction<string>>,
    placeholder = '',
    units = lengthUnits,
    handleUnitChange?: (newUnit: string) => void
  ) => (
    <div className="mb-3">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
          placeholder={placeholder}
        />
        <select
          value={unit}
          onChange={e => handleUnitChange ? handleUnitChange(e.target.value) : setUnit(e.target.value)}
          className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none w-32"
        >
          {units.map((u: { value: string; label: string }) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    </div>
  )

  // Make static dimension field editable
  const renderStaticDimensionField = (
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    unit: string,
    setUnit: React.Dispatch<React.SetStateAction<string>>,
    placeholder = '',
    units = lengthUnits,
    handleUnitChange?: (newUnit: string) => void
  ) => (
    <div className="mb-3">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
          placeholder={placeholder}
        />
        <select
          value={unit}
          onChange={e => handleUnitChange ? handleUnitChange(e.target.value) : setUnit(e.target.value)}
          className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none w-32"
        >
          {units.map((u: { value: string; label: string }) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    </div>
  )

  // Helper function to render pieces input field
  const renderPiecesField = () => (
    <div className="mb-3">
      <label className="block text-gray-700 font-medium mb-1">Number of metal pieces</label>
      <input
        type="text"
        value={pieces}
        onChange={e => setPieces(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
        placeholder=""
      />
    </div>
  )

  // Update handlers for each field's unit dropdown
  const handleLengthUnitChange = (newUnit: string) => {
    setLength(convertUnit(length, lengthUnit, newUnit, lengthConversionFactors))
    setLengthUnit(newUnit)
  }
  const handleWidthUnitChange = (newUnit: string) => {
    setWidth(convertUnit(width, widthUnit, newUnit, lengthConversionFactors))
    setWidthUnit(newUnit)
  }
  const handleThicknessUnitChange = (newUnit: string) => {
    setThickness(convertUnit(thickness, thicknessUnit, newUnit, lengthConversionFactors))
    setThicknessUnit(newUnit)
  }
  const handleVolumeUnitChange = (newUnit: string) => {
    setVolume(convertUnit(volume, volumeUnit, newUnit, volumeConversionFactors))
    setVolumeUnit(newUnit)
  }
  const handleLidHeightUnitChange = (newUnit: string) => {
    setLidHeight(convertUnit(lidHeight, lidHeightUnit, newUnit, lengthConversionFactors))
    setLidHeightUnit(newUnit)
  }
  const handleBaseHeightUnitChange = (newUnit: string) => {
    setBaseHeight(convertUnit(baseHeight, baseHeightUnit, newUnit, lengthConversionFactors))
    setBaseHeightUnit(newUnit)
  }
  const handleOuterRadiusUnitChange = (newUnit: string) => {
    setOuterRadius(convertUnit(outerRadius, outerRadiusUnit, newUnit, lengthConversionFactors))
    setOuterRadiusUnit(newUnit)
  }
  const handleInnerDiameterUnitChange = (newUnit: string) => {
    setInnerDiameter(convertUnit(innerDiameter, innerDiameterUnit, newUnit, lengthConversionFactors))
    setInnerDiameterUnit(newUnit)
  }
  const handleInnerRadiusUnitChange = (newUnit: string) => {
    setInnerRadius(convertUnit(innerRadius, innerRadiusUnit, newUnit, lengthConversionFactors))
    setInnerRadiusUnit(newUnit)
  }
  const handleTubeThicknessUnitChange = (newUnit: string) => {
    setTubeThickness(convertUnit(tubeThickness, tubeThicknessUnit, newUnit, lengthConversionFactors))
    setTubeThicknessUnit(newUnit)
  }

  // Function to convert volume to specified unit
  const convertVolume = (volumeInCubicMeters: number, toUnit: string): string => {
    return (volumeInCubicMeters / (volumeConversionFactors[toUnit] || 1)).toString()
  }

  // Calculate weight based on current inputs
  const calculateWeight = () => {
    const alloyDensity = alloys.find(a => a.value === alloy)?.density || 2700 // kg/m³
    const numPieces = parseInt(pieces) || 1
    let volumeValue = 0 // in cubic meters

    try {
      switch (shape) {
        case 'other':
          const parsedVolume = parseFloat(volume) || 0
          volumeValue = parseFloat(convertVolume(parsedVolume, volumeUnit))
          break

        case 'rectangular':
          volumeValue = calculateRectangularVolume(
            convertToMeters(length, lengthUnit),
            convertToMeters(width, widthUnit),
            convertToMeters(thickness, thicknessUnit)
          )
          break

        case 'circular':
          volumeValue = calculateCircularVolume(
            convertToMeters(length, lengthUnit),
            convertToMeters(thickness, thicknessUnit)
          )
          break

        case 'hexagonal':
          volumeValue = calculateHexagonalVolume(
            convertToMeters(length, lengthUnit),
            convertToMeters(thickness, thicknessUnit)
          )
          break

        case 'octagonal':
          volumeValue = calculateOctagonalVolume(
            convertToMeters(length, lengthUnit),
            convertToMeters(thickness, thicknessUnit)
          )
          break

        case 'ringprism':
          volumeValue = calculateRingPrismVolume(
            convertToMeters(length, lengthUnit),
            convertToMeters(width, widthUnit),
            convertToMeters(thickness, thicknessUnit)
          )
          break

        case 'wire':
          // For wire, use radius (width field) and length
          const wireLength = convertToMeters(length, lengthUnit)
          const wireRadius = convertToMeters(width, widthUnit)
          volumeValue = Math.PI * wireRadius * wireRadius * wireLength
          break

        case 'tube':
          // Use auto-calculated radii and thickness
          volumeValue = Math.PI * (tubeOuterRadiusVal * tubeOuterRadiusVal - tubeInnerRadiusVal * tubeInnerRadiusVal) * convertToMeters(length, lengthUnit)
          break

        case 'sphere':
          volumeValue = calculateSphereVolume(
            convertToMeters(length, lengthUnit)
          )
          break

        case 'ring':
          // Only calculate if valid
          if (ringInnerRadius < ringOuterRadius) {
            // Calculate volume for one piece
            volumeValue = calculateRingTorusVolume(ringInnerRadius, ringOuterRadius) * numPieces
          } else {
            volumeValue = 0
          }
          break

        case 'can':
          // Only calculate if valid
          if (canInnerRadius < canOuterRadius && canHeight > 0 && canBaseHeight >= 0 && (!canHasLid || canLidHeight >= 0)) {
            volumeValue = calculateCanVolume(
              canHeight,
              canInnerRadius,
              canOuterRadius,
              canBaseHeight,
              canLidHeight
            ) * numPieces
          } else {
            volumeValue = 0
          }
          break
      }

      // Calculate weight in kg
      const weightInKg = volumeValue * alloyDensity

      // Convert to selected unit
      const finalWeight = weightInKg / weightConversionFactors[resultUnit]
      setResult(finalWeight.toFixed(3))

    } catch (error) {
      setResult('Error')
    }
  }

  // Add useEffect to recalculate when inputs change
  React.useEffect(() => {
    calculateWeight()
  }, [
    alloy, shape, length, lengthUnit, width, widthUnit, 
    thickness, thicknessUnit, volume, volumeUnit, pieces,
    resultUnit, canHasLid, lidHeight, lidHeightUnit,
    baseHeight, baseHeightUnit, outerRadius, outerRadiusUnit,
    innerDiameter, innerDiameterUnit, innerRadius, innerRadiusUnit,
    tubeThickness, tubeThicknessUnit
  ])

  // Validation for ring prism
  const isRingPrism = shape === 'ringprism'
  const outerRadiusValue = convertToMeters(length, lengthUnit)
  const innerRadiusValue = convertToMeters(width, widthUnit)
  const showOuterRadiusError = isRingPrism && outerRadiusValue <= innerRadiusValue
  const showInnerRadiusError = isRingPrism && innerRadiusValue >= outerRadiusValue

  // Tube auto-calculation logic
  const isTube = shape === 'tube'
  const tubeOuterDiameter = convertToMeters(width, widthUnit)
  const tubeInnerDiameter = convertToMeters(innerDiameter, innerDiameterUnit)
  const tubeOuterRadius = tubeOuterDiameter / 2
  const tubeInnerRadius = tubeInnerDiameter / 2
  const tubeThicknessValue = tubeOuterRadius - tubeInnerRadius

  // Tube validation (use unique variable names)
  const showTubeOuterError = isTubeShape && tubeOuterDiameter < tubeInnerDiameter
  const showTubeInnerError = isTubeShape && tubeInnerDiameter > tubeOuterDiameter

  // Validation for ring (torus)
  const isRingTorus = shape === 'ring'
  const ringInnerRadius = convertToMeters(length, lengthUnit)
  const ringOuterRadius = convertToMeters(thickness, thicknessUnit)
  const showRingInnerError = isRingTorus && ringInnerRadius >= ringOuterRadius
  const showRingOuterError = isRingTorus && ringOuterRadius <= ringInnerRadius

  // --- Add validation for Can shape ---
  const isCan = shape === 'can'
  const canInnerRadius = convertToMeters(width, widthUnit)
  const canOuterRadius = convertToMeters(thickness, thicknessUnit)
  const canHeight = convertToMeters(length, lengthUnit)
  const canBaseHeight = convertToMeters(baseHeight, baseHeightUnit)
  const canLidHeight = canHasLid ? convertToMeters(lidHeight, lidHeightUnit) : 0
  const showCanInnerError = isCan && canInnerRadius >= canOuterRadius
  const showCanOuterError = isCan && canOuterRadius <= canInnerRadius

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 py-8">
      <div className="w-full max-w-xs sm:max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Aluminum weight calculator</h1>
        {/* Alloy & Shape */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-5">
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Alloy</label>
            <select
              className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
              value={alloy}
              onChange={e => setAlloy(e.target.value)}
            >
              {alloys.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Shape</label>
            <select
              className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
              value={shape}
              onChange={e => setShape(e.target.value)}
            >
              {shapes.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center py-2">
            {shape === 'circular' ? (
              <img
                src="/aluminium2.png"
                alt="Circular prism"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'hexagonal' ? (
              <img
                src="/aluminium3.png"
                alt="Hexagonal prism"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'octagonal' ? (
              <img
                src="/aluminium4.png"
                alt="Octagonal prism"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'ringprism' ? (
              <img
                src="/aluminium5.png"
                alt="Ring prism"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'wire' ? (
              <img
                src="/aluminium6.png"
                alt="Wire"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'tube' ? (
              <img
                src="/aluminium7.png"
                alt="Tube"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'sphere' ? (
              <img
                src="/aluminium8.png"
                alt="Sphere"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'ring' ? (
              <img
                src="/aluminium9.png"
                alt="Ring (torus)"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'can' ? (
              <img
                src="/aluminium10.png"
                alt="Can"
                className="w-56 h-32 object-contain"
              />
            ) : shape === 'other' ? (
              <div className="text-center">
                <span className="text-xl">🤔 Didn't find the shape you need?</span>
                <p className="text-gray-600 mt-2">
                  Don't worry! We have many 3D shape calculators, so try searching for the shape.
                </p>
              </div>
            ) : (
              <img
                src="/aluminium1.png"
                alt="Rectangular prism"
                className="w-56 h-32 object-contain"
              />
            )}
          </div>
        </div>
        {/* Dimensions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-5">
          <div className="flex items-center mb-3">
            <span className="font-semibold text-gray-900">Dimensions</span>
            <span className="ml-2 text-gray-400 text-xl">...</span>
          </div>
          {shape === 'can' ? (
            <>
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-1">Does the can have a lid?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="canLid"
                      checked={canHasLid}
                      onChange={() => setCanHasLid(true)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="canLid"
                      checked={!canHasLid}
                      onChange={() => setCanHasLid(false)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
              {canHasLid ? (
                <>
                  {renderStaticDimensionField('Lid height', lidHeight, setLidHeight, lidHeightUnit, setLidHeightUnit, '', lengthUnits, handleLidHeightUnitChange)}
                  {renderDimensionField('Height', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Inner radius (r)', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                  {showCanInnerError && (
                    <div className="text-red-600 text-sm mt-1">Inner radius should be less than the outer radius.</div>
                  )}
                  {renderDimensionField('Outer radius (R)', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {showCanOuterError && (
                    <div className="text-red-600 text-sm mt-1">Outer radius should be greater than the inner radius.</div>
                  )}
                  {renderStaticDimensionField('Base height', baseHeight, setBaseHeight, baseHeightUnit, setBaseHeightUnit, '', lengthUnits, handleBaseHeightUnitChange)}
                  {renderPiecesField()}
                </>
              ) : (
                <>
                  {renderDimensionField('Height', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Inner radius (r)', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                  {showCanInnerError && (
                    <div className="text-red-600 text-sm mt-1">Inner radius should be less than the outer radius.</div>
                  )}
                  {renderDimensionField('Outer radius (R)', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {showCanOuterError && (
                    <div className="text-red-600 text-sm mt-1">Outer radius should be greater than the inner radius.</div>
                  )}
                  {renderStaticDimensionField('Base height', baseHeight, setBaseHeight, baseHeightUnit, setBaseHeightUnit, '', lengthUnits, handleBaseHeightUnitChange)}
                  {renderPiecesField()}
                </>
              )}
            </>
          ) : shape === 'ring' ? (
            <>
              {renderDimensionField('Inner radius (r)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
              {renderDimensionField('Outer radius (R)', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
              {renderPiecesField()}
            </>
          ) : shape === 'other' ? (
            <>
              <div className="text-center mb-4"></div>
              {renderDimensionField('Volume', volume, setVolume, volumeUnit, setVolumeUnit, '', volumeUnits, handleVolumeUnitChange)}
              {renderPiecesField()}
            </>
          ) : (
            <>
              {shape === 'sphere' ? (
                <>
                  {renderDimensionField('Radius (r)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderPiecesField()}
                </>
              ) : shape === 'tube' ? (
                <>
                  {renderDimensionField('Length', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Outer diameter', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                  {showTubeOuterError && (
                    <div className="text-red-600 text-sm mt-1">Outer diameter should be greater than the inner diameter.</div>
                  )}
                  {renderDimensionField('Inner diameter', innerDiameter, setInnerDiameter, innerDiameterUnit, setInnerDiameterUnit, '', lengthUnits, handleInnerDiameterUnitChange)}
                  {showTubeInnerError && (
                    <div className="text-red-600 text-sm mt-1">Inner diameter should be less than the outer diameter.</div>
                  )}
                  {/* Auto-calculated fields with independent dropdowns for display */}
                  <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Outer radius (R)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={getTubeOuterRadiusDisplay()}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
                      />
                      <select
                        value={tubeOuterRadiusUnit}
                        onChange={e => handleTubeOuterRadiusUnitChange(e.target.value)}
                        className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none w-32"
                      >
                        {lengthUnits.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Inner radius (r)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={getTubeInnerRadiusDisplay()}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
                      />
                      <select
                        value={tubeInnerRadiusUnit}
                        onChange={e => handleTubeInnerRadiusUnitChange(e.target.value)}
                        className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none w-32"
                      >
                        {lengthUnits.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Tube thickness</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={getTubeThicknessDisplay()}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
                      />
                      <select
                        value={tubeThicknessDisplayUnit}
                        onChange={e => handleTubeThicknessDisplayUnitChange(e.target.value)}
                        className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none w-32"
                      >
                        {lengthUnits.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {renderPiecesField()}
                </>
              ) : shape === 'circular' ? (
                <>
                  {renderDimensionField('Radius (r)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Thickness', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {renderPiecesField()}
                </>
              ) : shape === 'hexagonal' ? (
                <>
                  {renderDimensionField('Side length (a)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Thickness', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {renderPiecesField()}
                </>
              ) : shape === 'octagonal' ? (
                <>
                  {renderDimensionField('Side length (a)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Thickness', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {renderPiecesField()}
                </>
              ) : shape === 'ringprism' ? (
                <>
                  <div>
                    {renderDimensionField('Outer radius (R)', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                    {showOuterRadiusError && (
                      <div className="text-red-600 text-sm mt-1">Outer radius should be greater than the inner radius.</div>
                    )}
                  </div>
                  <div>
                    {renderDimensionField('Inner radius (r)', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                    {showInnerRadiusError && (
                      <div className="text-red-600 text-sm mt-1">Inner radius should be less than the outer radius.</div>
                    )}
                  </div>
                  {renderDimensionField('Thickness', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {renderPiecesField()}
                </>
              ) : shape === 'wire' ? (
                <>
                  {renderDimensionField('Length', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Radius (r)', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                  {renderPiecesField()}
                </>
              ) : (
                <>
                  {renderDimensionField('Length', length, setLength, lengthUnit, setLengthUnit, '', lengthUnits, handleLengthUnitChange)}
                  {renderDimensionField('Width', width, setWidth, widthUnit, setWidthUnit, '', lengthUnits, handleWidthUnitChange)}
                  {renderDimensionField('Thickness', thickness, setThickness, thicknessUnit, setThicknessUnit, '', lengthUnits, handleThicknessUnitChange)}
                  {renderPiecesField()}
                </>
              )}
            </>
          )}
        </div>
        {/* Result */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-5">
          <div className="flex items-center mb-3">
            <span className="font-semibold text-gray-900">Result</span>
            <span className="ml-2 text-gray-400 text-xl">...</span>
          </div>cement
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Total weight</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={result}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base font-medium outline-none"
                placeholder=""
              />
              <div className="min-w-0 max-w-[60%]">
                <select
                  value={resultUnit}
                  onChange={e => setResultUnit(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none truncate"
                  style={{ minWidth: 0 }}
                >
                  {weightUnits.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
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