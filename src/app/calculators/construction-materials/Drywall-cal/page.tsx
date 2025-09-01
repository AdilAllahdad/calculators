'use client'
import React, { useState, useEffect } from 'react'
import convert from 'convert-units'

const lengthUnits = [
  { label: "centimeters(cm)", value: "cm" },
  { label: "meters(m)", value: "m" },
  { label: "inches(in)", value: "in" },
  { label: "feet(ft)", value: "ft" },
  { label: "yards(yd)", value: "yd" }
]

const areaUnits = [
  { label: "square centimeters (cm²)", value: "cm²" },
  { label: "square meters (m²)", value: "m²" },
  { label: "square inches (in²)", value: "in²" },
  { label: "square feet (ft²)", value: "ft²" },
  { label: "square yards (yd²)", value: "yd²" }
]

const boardSizes = [
  { label: "Select", value: "" },
  { label: "600 × 900 mm", value: "600x900" },
  { label: "600 × 1200 mm", value: "600x1200" },
  { label: "600 × 2000 mm", value: "600x2000" },
  { label: "600 × 2600 mm", value: "600x2600" },
  { label: "900 × 1800 mm", value: "900x1800" },
  { label: "1200 × 2000 mm", value: "1200x2000" },
  { label: "1200 × 2400 mm", value: "1200x2400" },
  { label: "1200 × 2600 mm", value: "1200x2600" },
  { label: "1200 × 3000 mm", value: "1200x3000" }
]

const initialState = {
  roomLength: '',
  roomLengthUnit: 'm',
  roomWidth: '',
  roomWidthUnit: 'm',
  roomHeight: '',
  roomHeightUnit: 'm',

  numSlopedSpaces: '',
  baseSloped: '',
  baseSlopedUnit: 'yd',
  heightSloped: '',
  heightSlopedUnit: 'm',

  includeCeiling: 'yes',
  createWaste: '0',
  createWasteUnit: '%',

  numDoors: '0',
  doorHeight: '200',
  doorHeightUnit: 'cm',
  doorWidth: '90',
  doorWidthUnit: 'cm',
  totalDoorArea: '',
  totalDoorAreaUnit: 'm²',

  numWindows: '0',
  windowHeight: '120',
  windowHeightUnit: 'cm',
  windowWidth: '90',
  windowWidthUnit: 'cm',
  totalWindowArea: '',
  totalWindowAreaUnit: 'm²',

  totalAreaUnderSlopedWalls: '',
  totalAreaUnderSlopedWallsUnit: 'ft²',

  grossRoomArea: '',
  grossRoomAreaUnit: 'm²',

  boardSize: '',
  costPerBoard: '',
  costPerBoardUnit: '',
  totalBoards: '',
  totalCost: '',
  netRoomArea: '',
  netRoomAreaUnit: 'm²',

  errors: {
    roomLength: '',
    roomWidth: '',
    roomHeight: '',
    numSlopedSpaces: '',
    baseSloped: '',
    heightSloped: '',
    numDoors: '',
    doorHeight: '',
    doorWidth: '',
    numWindows: '',
    windowHeight: '',
    windowWidth: '',
    createWaste: '',
    costPerBoard: ''
  }
}

type Fields = typeof initialState

function toNumber(val: string) {
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

function convertLength(val: string | number, from: string, to: string) {
  const n = typeof val === 'string' ? toNumber(val) : val;
  if (n === 0 || from === to) return n;
  try {
    return convert(n).from(from).to(to);
  } catch {
    return n;
  }
}

function convertArea(val: string | number, from: string, to: string) {
  const n = typeof val === 'string' ? toNumber(val) : val;
  if (n === 0 || from === to) return n;
  try {
    const fromUnit = from.replace('²', '2').replace('yd', 'yd2');
    const toUnit = to.replace('²', '2').replace('yd', 'yd2');
    return convert(n).from(fromUnit).to(toUnit);
  } catch {
    return n;
  }
}

// Main component
const Page = () => {
  const [fields, setFields] = useState<Fields>(initialState)

  const validateField = (name: string, value: string): string => {
    // Skip validation for empty fields (they'll use default values)
    if (!value) return '';
    
    const num = parseFloat(value);
    
    // Check if value is a number
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    
    // Check if value is non-negative for all fields
    if (num < 0) {
      return "Value should be greater than 0";
    }
    
    // Specific validations for certain fields could be added here
    return '';
  }

  useEffect(() => {
    // --- 1. Area under sloped walls (triangle) ---
    const numSloped = toNumber(fields.numSlopedSpaces)
    let areaSloped = 0
    if (numSloped > 0) {
      const baseM = convertLength(fields.baseSloped, fields.baseSlopedUnit, 'm')
      const heightM = convertLength(fields.heightSloped, fields.heightSlopedUnit, 'm')
      areaSloped = numSloped * (baseM * heightM / 2)
    }
    const areaSlopedDisplay = areaSloped > 0 ? convertArea(areaSloped, 'm²', fields.totalAreaUnderSlopedWallsUnit).toFixed(2) : '0.00';

    // --- 2. Total doors area ---
    const numDoors = toNumber(fields.numDoors);
    let doorArea = 0;
    if (numDoors > 0) {
      const doorHeightM = convertLength(fields.doorHeight, fields.doorHeightUnit, 'm');
      const doorWidthM = convertLength(fields.doorWidth, fields.doorWidthUnit, 'm');
      doorArea = numDoors * doorHeightM * doorWidthM;
    }
    const doorAreaDisplay = doorArea > 0 ? convertArea(doorArea, 'm²', fields.totalDoorAreaUnit).toFixed(2) : '0.00';

    // --- 3. Total windows area ---
    const numWindows = toNumber(fields.numWindows);
    let windowArea = 0;
    if (numWindows > 0) {
      const windowHeightM = convertLength(fields.windowHeight, fields.windowHeightUnit, 'm');
      const windowWidthM = convertLength(fields.windowWidth, fields.windowWidthUnit, 'm');
      windowArea = numWindows * windowHeightM * windowWidthM;
    }
    const windowAreaDisplay = windowArea > 0 ? convertArea(windowArea, 'm²', fields.totalWindowAreaUnit).toFixed(2) : '0.00';

    // --- 4. Gross room area (WALLS + CEILING + SLOPED if selected) ---
    const lengthM = convertLength(fields.roomLength, fields.roomLengthUnit, 'm');
    const widthM = convertLength(fields.roomWidth, fields.roomWidthUnit, 'm');
    const heightM = convertLength(fields.roomHeight, fields.roomHeightUnit, 'm');
    
    let grossArea = 0;
    if (lengthM > 0 && widthM > 0 && heightM > 0) {
      // Calculate all walls: 2*(L*H) + 2*(W*H)
      grossArea = 2 * (lengthM * heightM) + 2 * (widthM * heightM);
      
      // If ceiling included, add (L*W)
      if (fields.includeCeiling === 'yes') {
        grossArea += lengthM * widthM;
      }
      
      // Add sloped area to gross area calculation
      grossArea += areaSloped;
    }
    
    const grossAreaDisplay = grossArea > 0 ? convertArea(grossArea, 'm²', fields.grossRoomAreaUnit).toFixed(2) : '0.00';

    // --- 5. Net room area = gross - doors - windows ---
    // Fix: Don't add sloped area again since it's already included in gross area
    let netArea = grossArea - doorArea - windowArea;
    const waste = toNumber(fields.createWaste);
    if (waste > 0) {
      netArea = netArea * (1 + waste / 100);
    }
    if (netArea < 0) netArea = 0;
    const netAreaDisplay = netArea > 0 ? convertArea(netArea, 'm²', fields.netRoomAreaUnit).toFixed(2) : '0.00';

    // --- 6. Number of panels & cost ---
    let totalBoards = '0';
    let totalCost = '0.00';
    const boardSize = fields.boardSize;
    if (boardSize && netArea > 0) {
      const match = boardSize.match(/^(\d+)x(\d+)$/);
      if (match) {
        const widthMM = parseFloat(match[1]);
        const heightMM = parseFloat(match[2]);
        const boardAreaM2 = (widthMM / 1000) * (heightMM / 1000);
        if (boardAreaM2 > 0) {
          const boards = Math.ceil(netArea / boardAreaM2);
          totalBoards = boards.toString();
          if (fields.costPerBoard) {
            totalCost = (boards * toNumber(fields.costPerBoard)).toFixed(2);
          }
        }
      }
    }

    setFields(prev => ({
      ...prev,
      totalAreaUnderSlopedWalls: areaSlopedDisplay,
      totalDoorArea: doorAreaDisplay,
      totalWindowArea: windowAreaDisplay,
      grossRoomArea: grossAreaDisplay,
      netRoomArea: netAreaDisplay,
      totalBoards,
      totalCost
    }))
  }, [
    fields.roomLength, fields.roomLengthUnit,
    fields.roomWidth, fields.roomWidthUnit,
    fields.roomHeight, fields.roomHeightUnit,
    fields.numSlopedSpaces,
    fields.baseSloped, fields.baseSlopedUnit,
    fields.heightSloped, fields.heightSlopedUnit,
    fields.includeCeiling,
    fields.numDoors,
    fields.doorHeight, fields.doorHeightUnit,
    fields.doorWidth, fields.doorWidthUnit,
    fields.numWindows,
    fields.windowHeight, fields.windowHeightUnit,
    fields.windowWidth, fields.windowWidthUnit,
    fields.createWaste,
    fields.totalAreaUnderSlopedWallsUnit,
    fields.totalDoorAreaUnit,
    fields.totalWindowAreaUnit,
    fields.grossRoomAreaUnit,
    fields.netRoomAreaUnit,
    fields.boardSize,
    fields.costPerBoard
  ]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Skip validation for non-numeric fields
    const errorMessage = e.target.type === 'number' || name === 'costPerBoard' 
      ? validateField(name, value)
      : '';
    
    setFields(prev => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: errorMessage
      }
    }));
  };

  // Fix the handleUnitChange function to properly type fieldValue
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof Fields, isArea: boolean = false) => {
    const { value: newUnit } = e.target;
    const oldUnit = fields[`${field}Unit` as keyof Fields];
    
    // Fix: Properly type the fieldValue by asserting it as string
    const fieldValue = fields[field] as string;
    
    let convertedValue = fieldValue;
    
    if (fieldValue && oldUnit !== newUnit) {
      try {
        const val = parseFloat(fieldValue);
        if (!isNaN(val)) {
          if (isArea) {
            convertedValue = convertArea(val, oldUnit as string, newUnit).toFixed(2);
          } else {
            convertedValue = convertLength(val, oldUnit as string, newUnit).toFixed(2);
          }
        }
      } catch {
        // Keep the original value if conversion fails
      }
    }
    
    setFields(prev => ({
      ...prev,
      [field]: convertedValue,
      [`${field}Unit`]: newUnit
    }));
  };

  const handleClear = () => setFields(initialState);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Drywall Calculator</h1>

        {/* Room dimensions */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Room dimensions</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Room length</label>
            <div className="flex">
              <input
                type="number"
                name="roomLength"
                value={fields.roomLength}
                onChange={handleValueChange}
                className={`flex-1 border ${fields.errors.roomLength ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="roomLengthUnit"
                value={fields.roomLengthUnit}
                onChange={(e) => handleUnitChange(e, 'roomLength')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            {fields.errors.roomLength && (
              <p className="text-red-500 text-xs mt-1">{fields.errors.roomLength}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Room width</label>
            <div className="flex">
              <input
                type="number"
                name="roomWidth"
                value={fields.roomWidth}
                onChange={handleValueChange}
                className={`flex-1 border ${fields.errors.roomWidth ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="roomWidthUnit"
                value={fields.roomWidthUnit}
                onChange={(e) => handleUnitChange(e, 'roomWidth')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            {fields.errors.roomWidth && (
              <p className="text-red-500 text-xs mt-1">{fields.errors.roomWidth}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room height</label>
            <div className="flex">
              <input
                type="number"
                name="roomHeight"
                value={fields.roomHeight}
                onChange={handleValueChange}
                className={`flex-1 border ${fields.errors.roomHeight ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm`}
              />
              <select
                name="roomHeightUnit"
                value={fields.roomHeightUnit}
                onChange={(e) => handleUnitChange(e, 'roomHeight')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            {fields.errors.roomHeight && (
              <p className="text-red-500 text-xs mt-1">{fields.errors.roomHeight}</p>
            )}
          </div>
        </div>

        {/* Area under sloped walls */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Area under sloped walls</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 flex items-center">
              Number of triangular spaces
              <span className="ml-1 text-gray-400 cursor-pointer" title="Number of triangular spaces">ⓘ</span>
            </label>
            <input type="number" name="numSlopedSpaces" value={fields.numSlopedSpaces} onChange={handleValueChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Base of triangular space</label>
            <div className="flex">
              <input
                type="number"
                name="baseSloped"
                value={fields.baseSloped}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select
                name="baseSlopedUnit"
                value={fields.baseSlopedUnit}
                onChange={(e) => handleUnitChange(e, 'baseSloped')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Height of triangular space</label>
            <div className="flex">
              <input
                type="number"
                name="heightSloped"
                value={fields.heightSloped}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select
                name="heightSlopedUnit"
                value={fields.heightSlopedUnit}
                onChange={(e) => handleUnitChange(e, 'heightSloped')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total area under sloped walls</label>
            <div className="flex">
              <input
                type="number"
                name="totalAreaUnderSlopedWalls"
                value={fields.totalAreaUnderSlopedWalls}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                readOnly
              />
              <select
                name="totalAreaUnderSlopedWallsUnit"
                value={fields.totalAreaUnderSlopedWallsUnit}
                onChange={(e) => handleUnitChange(e, 'totalAreaUnderSlopedWalls', true)}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room surface area */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Room surface area</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 flex items-center">
              Include ceiling?
              <span className="ml-1 text-gray-400 cursor-pointer" title="Include ceiling?">ⓘ</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center text-sm">
                <input type="radio" name="includeCeiling" value="yes" checked={fields.includeCeiling === 'yes'} onChange={handleValueChange} className="mr-1" />
                Yes
              </label>
              <label className="flex items-center text-sm">
                <input type="radio" name="includeCeiling" value="no" checked={fields.includeCeiling === 'no'} onChange={handleValueChange} className="mr-1" />
                No
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              Gross room area
              <span className="ml-1 text-gray-400 cursor-pointer" title="Gross room area">ⓘ</span>
            </label>
            <div className="flex">
              <input
                type="number"
                name="grossRoomArea"
                value={fields.grossRoomArea}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                readOnly
              />
              <select
                name="grossRoomAreaUnit"
                value={fields.grossRoomAreaUnit}
                onChange={(e) => handleUnitChange(e, 'grossRoomArea', true)}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {/* Show calculated value in square meters */}
            <div className="text-xs text-gray-500 mt-1">
              Gross room area (m²): {
                (() => {
                  // Calculate gross area in m² for display
                  const lengthM = convertLength(fields.roomLength, fields.roomLengthUnit, 'm');
                  const widthM = convertLength(fields.roomWidth, fields.roomWidthUnit, 'm');
                  const heightM = convertLength(fields.roomHeight, fields.roomHeightUnit, 'm');
                  
                  // Calculate sloped area
                  let areaSloped = 0;
                  const numSloped = toNumber(fields.numSlopedSpaces);
                  if (numSloped > 0) {
                    const baseM = convertLength(fields.baseSloped, fields.baseSlopedUnit, 'm');
                    const heightM = convertLength(fields.heightSloped, fields.heightSlopedUnit, 'm');
                    areaSloped = numSloped * (baseM * heightM / 2);
                  }
                  
                  let grossAreaM2 = 0;
                  if (lengthM > 0 && widthM > 0 && heightM > 0) {
                    grossAreaM2 = 2 * (lengthM * heightM) + 2 * (widthM * heightM);
                    if (fields.includeCeiling === 'yes') {
                      grossAreaM2 += lengthM * widthM;
                    }
                    // Add sloped area to display calculation
                    grossAreaM2 += areaSloped;
                  }
                  return grossAreaM2 > 0 ? grossAreaM2.toFixed(2) : '0.00'
                })()
              } m²
            </div>
          </div>
        </div>

        {/* Doors */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Doors</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Number of doors</label>
            <input type="number" name="numDoors" value={fields.numDoors} onChange={handleValueChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Door height</label>
            <div className="flex">
              <input
                type="number"
                name="doorHeight"
                value={fields.doorHeight}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select name="doorHeightUnit" value={fields.doorHeightUnit} onChange={(e) => handleUnitChange(e, 'doorHeight')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Door width</label>
            <div className="flex">
              <input
                type="number"
                name="doorWidth"
                value={fields.doorWidth}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select name="doorWidthUnit" value={fields.doorWidthUnit} onChange={(e) => handleUnitChange(e, 'doorWidth')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total doors area</label>
            <div className="flex">
              <input
                type="number"
                name="totalDoorArea"
                value={fields.totalDoorArea}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                readOnly
              />
              <select
                name="totalDoorAreaUnit"
                value={fields.totalDoorAreaUnit}
                onChange={(e) => handleUnitChange(e, 'totalDoorArea', true)}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Windows */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Windows</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Number of windows</label>
            <input type="number" name="numWindows" value={fields.numWindows} onChange={handleValueChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Window height</label>
            <div className="flex">
              <input
                type="number"
                name="windowHeight"
                value={fields.windowHeight}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select name="windowHeightUnit" value={fields.windowHeightUnit} onChange={(e) => handleUnitChange(e, 'windowHeight')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Window width</label>
            <div className="flex">
              <input
                type="number"
                name="windowWidth"
                value={fields.windowWidth}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
              />
              <select name="windowWidthUnit" value={fields.windowWidthUnit} onChange={(e) => handleUnitChange(e, 'windowWidth')}
                className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">
                {lengthUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total windows area</label>
            <div className="flex">
              <input
                type="number"
                name="totalWindowArea"
                value={fields.totalWindowArea}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                readOnly
              />
              <select
                name="totalWindowAreaUnit"
                value={fields.totalWindowAreaUnit}
                onChange={(e) => handleUnitChange(e, 'totalWindowArea', true)}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Drywall amount */}
        <div className="bg-white rounded-xl shadow p-6 border mb-6">
          <div className="font-semibold mb-4 text-base">Drywall amount</div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 flex items-center">
              Net room area
              <span className="ml-1 text-gray-400 cursor-pointer" title="Net room area">ⓘ</span>
            </label>
            <div className="flex">
              <input
                type="number"
                name="netRoomArea"
                value={fields.netRoomArea}
                onChange={handleValueChange}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
                readOnly
              />
              <select
                name="netRoomAreaUnit"
                value={fields.netRoomAreaUnit}
                onChange={(e) => handleUnitChange(e, 'netRoomArea', true)}
                className="w-28 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Select drywall panel size</label>
            <select
              name="boardSize"
              value={fields.boardSize}
              onChange={handleValueChange}
              className="w-full border border-blue-400 rounded-lg px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 font-semibold text-blue-600"
            >
              {boardSizes.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Cost per panel</label>
            <input
              type="number"
              name="costPerBoard"
              value={fields.costPerBoard}
              onChange={handleValueChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="PKR"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Number of panels</label>
            <input
              type="number"
              name="totalBoards"
              value={fields.totalBoards}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total cost</label>
            <input
              type="number"
              name="totalCost"
              value={fields.totalCost}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
              placeholder="PKR"
            />
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex justify-center mt-6">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition text-base"
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