'use client';

import { useState, useEffect, useRef } from 'react';

// Unit configuration objects
const LENGTH_UNITS = [
  { value: 'm', label: 'meters (m)', toFeet: 3.28084 },
  { value: 'cm', label: 'centimeters (cm)', toFeet: 0.0328084 },
  { value: 'ft', label: 'feet (ft)', toFeet: 1 },
  { value: 'in', label: 'inches (in)', toFeet: 0.0833333 }
];

const AREA_UNITS = [
  { value: 'm²', label: 'square meters (m²)', toSqft: 10.7639 },
  { value: 'ft²', label: 'square feet (ft²)', toSqft: 1 },
];

const ROOM_TYPES = [
  { value: 'living', label: 'Living Room', btuFactor: 0 },
  { value: 'bedroom', label: 'Bedroom', btuFactor: 0 },
  { value: 'kitchen', label: 'Kitchen', btuFactor: 4000 },
  { value: 'basement', label: 'Basement', btuFactor: 0 },
  { value: 'attic', label: 'Attic', btuFactor: 0 },
  { value: 'other', label: 'Other', btuFactor: 0 }
];

const SUNLIGHT_OPTIONS = [
  { value: 'shaded', label: 'Shaded room', factor: 0.9 },
  { value: 'neutral', label: 'Neither shaded nor sunny', factor: 1 },
  { value: 'sunny', label: 'Sunny room', factor: 1.1 }
];

// New conversion factors for the results section
const RESULT_UNITS = [
  { value: 'tons', label: 'tons of refrigeration (TR)', toBTU: 12000 },
  { value: 'kW', label: 'kilowatts (kW)', toBTU: 3412.14 },
  { value: 'btu', label: 'British thermal units per hour (BTU/h)', toBTU: 1 }
];

export default function ACCalculator() {
  // State for the selected calculation method (quick or manualj)
  const [method, setMethod] = useState('quick');
  
  // State to hold the selected units for each input field
  const [units, setUnits] = useState({
    length: 'm',
    width: 'm',
    floorArea: 'm²',
    height: 'm',
    result: 'tons'
  });
  
  // State to hold the room size input values
  const [roomSize, setRoomSize] = useState({
    length: '',
    width: '',
    floorArea: '',
    ceilingHeight: ''
  });
  
  // State to hold the room configuration input values
  const [roomConfig, setRoomConfig] = useState({
    roomType: 'living',
    sunlight: 'neutral',
    occupants: '',
    windows: '',
    exteriorDoors: ''
  });
  
  // State to hold the final calculated BTU value
  const [totalBTU, setTotalBTU] = useState<number>(0);

  // Helper function to find the conversion factor for a given length unit
  const getLengthConversion = (unit: string) => LENGTH_UNITS.find(u => u.value === unit)?.toFeet || 1;
  
  // Helper function to find the conversion factor for a given area unit
  const getAreaConversion = (unit: string) => AREA_UNITS.find(u => u.value === unit)?.toSqft || 1;
  
  // Helper function to get the BTU factor for a room type
  const getRoomFactor = (type: string) => ROOM_TYPES.find(r => r.value === type)?.btuFactor || 0;
  
  // Helper function to get the factor for sunlight exposure
  const getSunlightFactor = (type: string) => SUNLIGHT_OPTIONS.find(s => s.value === type)?.factor || 1;
  
  // Helper function to find the BTU conversion for a given result unit
  const getResultConversion = (unit: string) => RESULT_UNITS.find(u => u.value === unit)?.toBTU || 1;

  // Function to convert a value from an old unit to a new unit
  const convertValue = (
    value: string,
    oldUnit: string,
    newUnit: string,
    conversionFunction: (unit: string) => number
  ): string => {
    if (!value || isNaN(Number(value))) return '';
    const oldConversionFactor = conversionFunction(oldUnit);
    const newConversionFactor = conversionFunction(newUnit);
    const newValue = (parseFloat(value) * oldConversionFactor / newConversionFactor).toFixed(2);
    return newValue;
  };
  
  // Main calculation effect hook - runs whenever any relevant state changes
  useEffect(() => {
    // Convert all measurements to a standard unit (feet) for calculation
    let areaInSqft = 0;
    let heightInFt = 0;
    
    // Calculate area in square feet based on user input
    // The floorArea field is now the primary source of truth for area
    if (roomSize.floorArea) {
      const area = parseFloat(roomSize.floorArea);
      const conversion = getAreaConversion(units.floorArea);
      areaInSqft = area * conversion;
    } else if (roomSize.length && roomSize.width) {
      // If floorArea is empty, fall back to calculating from length and width
      const length = parseFloat(roomSize.length);
      const width = parseFloat(roomSize.width);
      const lengthConversion = getLengthConversion(units.length);
      const widthConversion = getLengthConversion(units.width);
      areaInSqft = (length * lengthConversion) * (width * widthConversion);
    }
    
    // Calculate height in feet
    if (roomSize.ceilingHeight) {
      const height = parseFloat(roomSize.ceilingHeight);
      const conversion = getLengthConversion(units.height);
      heightInFt = height * conversion;
    } else {
      // Default to 8 feet if not specified
      heightInFt = 8;
    }
    
    let calculatedBTU = 0;
    
    // Only calculate if a room size value is available
    if (areaInSqft > 0) {
      // Apply the correct calculation method based on user selection
      if (method === 'quick') {
        const occupants = parseInt(roomConfig.occupants) || 1;
        const roomTypeFactor = getRoomFactor(roomConfig.roomType);
        const sunlightFactor = getSunlightFactor(roomConfig.sunlight);
        
        // Base BTU calculation based on documentation (200 sqft * 30 BTU/sqft = 6000)
        // This is a common starting point for quick estimates
        const baseBTU = areaInSqft * 30; 
        
        // Adjustments based on documentation rules
        const heightAdjustment = Math.max(0, heightInFt - 8) * 1000;
        const occupantAdjustment = Math.max(0, occupants - 2) * 600;
        
        calculatedBTU = (baseBTU + heightAdjustment + occupantAdjustment + roomTypeFactor) * sunlightFactor;
      } else { // Manual J method
        const occupants = parseInt(roomConfig.occupants) || 0;
        const windows = parseInt(roomConfig.windows) || 0;
        const exteriorDoors = parseInt(roomConfig.exteriorDoors) || 0;
        
        // Manual J calculation based on the provided formula and values
        calculatedBTU = (areaInSqft * heightInFt) +
                       (occupants * 100) + 
                       (windows * 1000) + 
                       (exteriorDoors * 1000);
      }
    }
    
    // Update the total BTU state
    setTotalBTU(calculatedBTU);
  }, [roomSize, roomConfig, units, method]);
  
  // Calculate the final result based on the selected result unit
  const finalResult = (): string => {
    if (!totalBTU || totalBTU <= 0) return '0.00';
    const conversion = getResultConversion(units.result);
    return (totalBTU / conversion).toFixed(2);
  };
  
  // Handle changes to the room size input fields
  const handleRoomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setRoomSize(prev => {
      let updatedRoomSize = { ...prev, [name]: value };
      
      // Auto-calculate floor area only if length and width are being updated
      if (name === 'length' || name === 'width') {
        const length = name === 'length' ? parseFloat(value) : parseFloat(prev.length);
        const width = name === 'width' ? parseFloat(value) : parseFloat(prev.width);
        
        if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
          const lengthInFt = length * getLengthConversion(units.length);
          const widthInFt = width * getLengthConversion(units.width);
          const calculatedAreaInSqft = lengthInFt * widthInFt;
          const newFloorArea = (calculatedAreaInSqft / getAreaConversion(units.floorArea)).toFixed(2);
          updatedRoomSize.floorArea = newFloorArea;
        } else {
          updatedRoomSize.floorArea = '';
        }
      }
      return updatedRoomSize;
    });
  };

  // Handle changes to the room configuration input fields
  const handleRoomConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomConfig(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle changes to the unit selection dropdowns
  const handleUnitChange = (unitType: string, value: string) => {
    setUnits(prevUnits => {
      const oldUnits = prevUnits;
      const newUnits = { ...prevUnits, [unitType]: value };

      setRoomSize(prevRoomSize => {
        let updatedRoomSize = { ...prevRoomSize };

        if (unitType === 'length') {
          updatedRoomSize.length = convertValue(prevRoomSize.length, oldUnits.length, value, getLengthConversion);
        } else if (unitType === 'width') {
          updatedRoomSize.width = convertValue(prevRoomSize.width, oldUnits.width, value, getLengthConversion);
        } else if (unitType === 'floorArea') {
          updatedRoomSize.floorArea = convertValue(prevRoomSize.floorArea, oldUnits.floorArea, value, getAreaConversion);
        } else if (unitType === 'height') {
          updatedRoomSize.ceilingHeight = convertValue(prevRoomSize.ceilingHeight, oldUnits.height, value, getLengthConversion);
        }

        return updatedRoomSize;
      });
      return newUnits;
    });
  };
  
  // Handle reloading the calculator by resetting all state
  const handleReload = () => {
    setMethod('quick');
    setUnits({
      length: 'm',
      width: 'm',
      floorArea: 'm²',
      height: 'm',
      result: 'tons'
    });
    setRoomSize({
      length: '',
      width: '',
      floorArea: '',
      ceilingHeight: ''
    });
    setRoomConfig({
      roomType: 'living',
      sunlight: 'neutral',
      occupants: '',
      windows: '',
      exteriorDoors: ''
    });
  setTotalBTU(0);
  };
  
  // Handle clearing all changes by resetting state
  const handleClear = () => {
    handleReload();
  };

  const InfoIcon = () => (
    <svg className="h-4 w-4 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const ShareIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.882 13.491 9 13.689 9 13.91V15a1 1 0 01-1.6.8L5 13.5a1 1 0 010-1.6L7.4 9.2a1 1 0 011.6.8v1.089c.148-.027.295-.06.444-.093M17 12a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 100 14 7 7 0 000-14zM10 5a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4 font-sans">
      <div className="mx-auto bg-white rounded-xl shadow-md p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          AC Calculator
        </h1>

        <div className="space-y-6">
          {/* Calculation Method Card */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              Select the method you prefer for calculating the recommended air conditioner size.
              <svg className="ml-2 w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="quick"
                  checked={method === 'quick'}
                  onChange={() => setMethod('quick')}
                  className="form-radio h-5 w-5 text-blue-600 rounded-full"
                />
                <span className="ml-2 text-gray-700 font-medium">Quick estimate</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="manualj"
                  value="manualj"
                  checked={method === 'manualj'}
                  onChange={() => setMethod('manualj')}
                  className="form-radio h-5 w-5 text-blue-600 rounded-full"
                />
                <span className="ml-2 text-gray-700 font-medium">Industry-standard Manual J method</span>
              </label>
            </div>
          </div>
          
          {/* Room Size Card */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              Room size
              <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="length"
                    value={roomSize.length}
                    onChange={handleRoomSizeChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={units.length}
                    onChange={(e) => handleUnitChange('length', e.target.value)}
                    className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                  >
                    {LENGTH_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="width"
                    value={roomSize.width}
                    onChange={handleRoomSizeChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={units.width}
                    onChange={(e) => handleUnitChange('width', e.target.value)}
                    className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                  >
                    {LENGTH_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor area
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="floorArea"
                  value={roomSize.floorArea}
                  onChange={handleRoomSizeChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  step="0.01"
                />
                <select
                  value={units.floorArea}
                  onChange={(e) => handleUnitChange('floorArea', e.target.value)}
                  className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                >
                  {AREA_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ceiling height
                <InfoIcon />
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="ceilingHeight"
                  value={roomSize.ceilingHeight}
                  onChange={handleRoomSizeChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <select
                  value={units.height}
                  onChange={(e) => handleUnitChange('height', e.target.value)}
                  className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                >
                  {LENGTH_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Room Configuration Card */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              Room configuration
              <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </h2>
            
            {method === 'quick' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room type
                  </label>
                  <select
                    value={roomConfig.roomType}
                    onChange={handleRoomConfigChange}
                    name="roomType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROOM_TYPES.map(room => (
                      <option key={room.value} value={room.value}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sunlight exposure
                    <InfoIcon />
                  </label>
                  <div className="flex flex-col space-y-2">
                    {SUNLIGHT_OPTIONS.map(option => (
                      <label key={option.value} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sunlight"
                          checked={roomConfig.sunlight === option.value}
                          onChange={handleRoomConfigChange}
                          className="form-radio h-5 w-5 text-blue-600 rounded-full"
                        />
                        <span className="ml-2 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of occupants
                    <InfoIcon />
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="occupants"
                    value={roomConfig.occupants}
                    onChange={handleRoomConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of occupants
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="occupants"
                    value={roomConfig.occupants}
                    onChange={handleRoomConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of windows
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="windows"
                    value={roomConfig.windows}
                    onChange={handleRoomConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of exterior doors
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="exteriorDoors"
                    value={roomConfig.exteriorDoors}
                    onChange={handleRoomConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </div>

          {/* Results Card */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              Results
              <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AC tonnage
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={finalResult()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-100"
                  placeholder="0.00"
                />
                <select
                  value={units.result}
                  onChange={(e) => handleUnitChange('result', e.target.value)}
                  className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                >
                  {RESULT_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center space-x-4">
              <button
                onClick={handleReload}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reload calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
