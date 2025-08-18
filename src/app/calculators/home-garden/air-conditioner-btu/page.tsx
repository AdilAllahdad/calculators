'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const lengthUnitValues = ['m', 'ft', 'cm'];
const widthUnitValues = ['m', 'ft', 'cm'];
const floorAreaUnitValues = ['m2', 'ft2'];
const ceilingHeightUnitValues = ['m', 'ft', 'cm'];
const btuUnitValues = ['BTU', 'kW', 'watts', 'hp(l)', 'hp(E)', 'tons'];

// Reference table: area (ft²) -> base BTU per hour
const areaToBTUTable: { min: number; max: number; btu: number }[] = [
  { min: 100, max: 150, btu: 5000 },
  { min: 150, max: 250, btu: 6000 },
  { min: 250, max: 300, btu: 7000 },
  { min: 300, max: 350, btu: 8000 },
  { min: 350, max: 400, btu: 9000 },
  { min: 400, max: 450, btu: 10000 },
  { min: 450, max: 550, btu: 12000 },
  { min: 550, max: 700, btu: 14000 },
  { min: 700, max: 1000, btu: 18000 },
  { min: 1000, max: 1200, btu: 21000 },
  { min: 1200, max: 1400, btu: 23000 },
  { min: 1400, max: 1500, btu: 24000 },
  { min: 1500, max: 2000, btu: 30000 },
  { min: 2000, max: 2500, btu: 34000 },
];

const lookupBaseBTU = (areaFt2: number): number => {
  if (!areaFt2 || areaFt2 <= 0) return 0;
  if (areaFt2 < areaToBTUTable[0].min) return areaToBTUTable[0].btu;
  for (const row of areaToBTUTable) {
    if (areaFt2 >= row.min && areaFt2 <= row.max) return row.btu;
  }
  // If area exceeds table max, extrapolate conservatively at 12 BTU/ft² beyond 2,500 ft²
  const last = areaToBTUTable[areaToBTUTable.length - 1];
  const extra = areaFt2 - last.max;
  return Math.round(last.btu + extra * 12);
};


export default function AirConditionerBTUCalculator() {
    const [roomSizeDisplay,setRoomSizeDisplay] = useState<boolean>(false);
    const [roomConfigurationDisplay,setRoomConfigurationDisplay] = useState<boolean>(false);
    const [roomSize,setRoomSize] = useState<string>('Bedroom');
    const [sunlightExposure, setSunlightExposure] = useState<string>('Neither shaded nor sunny');
    const [exposureimg,setexposureimg] = useState<string>('neither-shaded-nor-sunny');
    const [numPeopleStr,setNumPeopleStr] = useState<string>('');
    const [currentAirConditioner,setCurrentAirConditoner] = useState<boolean>(false);
    const [lengthStr, setLengthStr] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<string>('m');
    const [widthStr, setWidthStr] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<string>('m');
    const [floorArea, setFloorArea] = useState<number>(0);
    const [floorAreaUnit, setFloorAreaUnit] = useState<string>('m2');
    const [ceilingHeightStr, setCeilingHeightStr] = useState<string>('');
    const [ceilingHeightUnit, setCeilingHeightUnit] = useState<string>('m');
    const [btu, setBTU] = useState<number>(0);
    const [btuUnit, setBTUUnit] = useState<string>('BTU');

    const calculateBTU = () => {
        // Parse numeric values from inputs (empty string -> 0)
        const length = parseFloat(lengthStr) || 0;
        const width = parseFloat(widthStr) || 0;
        const ceilingHeight = parseFloat(ceilingHeightStr) || 0;

        // Convert length and width to meters first for consistent calculation
        const lengthInMeters = convertValue(length, lengthUnit, 'm');
        const widthInMeters = convertValue(width, widthUnit, 'm');

        // Calculate floor area in square meters
        const floorAreaInSquareMeters = lengthInMeters * widthInMeters;

        // Convert to selected floor area unit for display
        const floorAreaDisplay = convertValue(floorAreaInSquareMeters, 'm2', floorAreaUnit);

        // Convert floor area to square feet for BTU calculation
        const floorAreaInSquareFeet = convertValue(floorAreaInSquareMeters, 'm2', 'ft2');

        // Base BTU from reference table (ranges of area in ft²)
        let btuValue = lookupBaseBTU(floorAreaInSquareFeet);

        // Adjust for ceiling height: add 1000 BTU for each foot above 8 feet (fractional allowed)
        const ceilingHeightInFeet = convertValue(ceilingHeight, ceilingHeightUnit, 'ft');
        if (ceilingHeightInFeet > 8) {
            const extraFeet = Math.max(0, ceilingHeightInFeet - 8);
            btuValue += 1000 * extraFeet;
        }

        // Adjust for room type (kitchen gets additional 4000 BTU)
        if (roomSize === 'Kitchen') {
            btuValue += 4000;
        }

        // Adjust for sunlight exposure
        switch (sunlightExposure) {
            case 'Sunny':
                btuValue *= 1.1;  // Add 10% for sunny rooms
                break;
            case 'Shaded':
                btuValue *= 0.9;  // Reduce 10% for shaded rooms
                break;
        }
        const people = Math.max(0, Math.floor(parseFloat(numPeopleStr) || 0));
        if (people > 2) {
            btuValue += (people - 2) * 600;
        }

        // Convert to selected BTU unit
        const btuDisplay = convertValue(btuValue, 'BTU', btuUnit);

        setFloorArea(floorAreaDisplay);
        setBTU(btuDisplay);
    };

    useEffect(() => {
        calculateBTU();
    }, [lengthStr, lengthUnit, widthStr, widthUnit, floorAreaUnit, ceilingHeightStr, ceilingHeightUnit, btuUnit, roomSize, sunlightExposure, numPeopleStr]);

    const getExposureImage = () => {
    const getImageSrc = () => {
      switch (sunlightExposure) {
        case 'Neither shaded nor sunny':
          return '/neither-shaded-nor-sunny.png';
        case 'Shaded':
            return '/shaded.png';
        case 'Sunny':
            return '/sunny.png';
        default:
          return null;
      }
    };

    const imageSrc = getImageSrc();

    if (!imageSrc) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center">
          <div className="text-green-700 text-lg font-semibold">Select an exposure</div>
        </div>
      );
    }
    return (
      <div className="w-full h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center relative overflow-hidden">
        <img
          src={imageSrc}
          alt={sunlightExposure}
          className="max-h-full max-w-full object-contain rounded-lg"
        />
      </div>
    );

    }

    const handleTextNumberInput = (value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        // Allow only digits and a single dot
        let sanitized = value.replace(/[^0-9.]/g, '');
        const firstDot = sanitized.indexOf('.');
        if (firstDot !== -1) {
          sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
        }
        setValue(sanitized);
      };

      const handleIntegerTextInput = (value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        const digitsOnly = value.replace(/[^0-9]/g, '');
        setValue(digitsOnly);
      };

      const handleFocusStr = (currentValue: string, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === '' || currentValue === '0') {
          e.target.select();
        }
      };

      const clearAll = () => {
        setLengthStr('');
        setWidthStr('');
        setFloorArea(0);
        setCeilingHeightStr('');
        setBTU(0);
      };

      const reloadCalculator = () => {
        setLengthStr('');
        setWidthStr('');
        setFloorArea(0);
        setCeilingHeightStr('');
        setBTU(0);
      };

      const shareResult = () => {
        const result = `Length: ${lengthStr || 0} ${lengthUnit}\nWidth: ${widthStr || 0} ${widthUnit}\nFloor Area: ${floorArea} ${floorAreaUnit}\nCeiling Height: ${ceilingHeightStr || 0} ${ceilingHeightUnit}\nBTU: ${btu} ${btuUnit}`;
        if (navigator.share) {
          navigator.share({
            title: 'Air Conditioner BTU Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

      return (
        <div className="max-w-lg mx-auto py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
              Air Conditioner BTU Calculator
              <span className="ml-3 text-2xl">❄️</span>
            </h1>
          </div>
          <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
            <p className='text-md text-slate-600'>Choosing the right size of air conditioner not only allows you to cool your room properly but can also help you <b>efficiently use energy. ⚡</b> Use this calculator to know the <b>recommended air conditioner size</b> for your room or to check if your current air conditioner is enough or too much for your room. 🙂</p>
            <label className='block pt-4 text-sm font-medium text-slate-700 mb-2'>
                I want to..
            </label>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="calculatorType"
                            value="calculate"
                            checked={!currentAirConditioner}
                            onChange={(e) => setCurrentAirConditoner(e.target.value === 'check')}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Purchase an Air Conditioner</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="calculatorType"
                            value="check"
                            checked={currentAirConditioner}
                            onChange={(e) => setCurrentAirConditoner(e.target.value === 'check')}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Check my Air Conditioner Size</span>
                    </label>
                </div>
                {currentAirConditioner && (
                    <div>
                        <label className='block pt-4 text-sm font-medium text-slate-700 mb-2'>
                            Current Air Conditioner Size
                        </label>
                        <div className="flex gap-2">
                        <input
                            type="number"
                            value={btu}
                            onChange={(e) => setBTU(Number(e.target.value) || 0)}
                            onFocus={(e) => { if (btu === 0) e.target.select(); }}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                            step="any"
                            min="0"
                        />
                        <UnitDropdown
                            value={btuUnit}
                            onChange={(e) => setBTUUnit(e.target.value)}
                            unitValues={btuUnitValues}
                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        />
                        </div>
                    </div>
                )}
          </div>
          <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
            <div className="flex items-center justify-between mb-6">
              <h2 className='text-xl font-semibold text-slate-800'>Room Configuration</h2>
              <a onClick={() => setRoomConfigurationDisplay(!roomConfigurationDisplay)}>
                {roomConfigurationDisplay ? (
                  <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
            </div>
            {roomConfigurationDisplay && (
              <div>
            <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Room Size
                </label>
                <div className="flex gap-2">
                    <select
                        value={roomSize}
                        onChange={(e) => setRoomSize(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                        <option value="Bedroom">Bedroom</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Office">Office</option>
                    </select>
                </div>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sunlight Exposure
                </label>
                <label className='flex items-center mb-2 space-x-2'>
                    <input
                        type="radio"
                        name="sunlightExposure"
                        value="Neither shaded nor sunny"
                        checked={sunlightExposure === 'Neither shaded nor sunny'}
                        onChange={(e) =>
                        {
                            setSunlightExposure(e.target.value);
                            setexposureimg('neither-shaded-nor-sunny')
                        }}
                        className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className='text-sm text-slate-700'>Neither shaded nor sunny</span>
                </label>

                <label className='flex items-center mb-2 space-x-2'>
                    <input
                        type="radio"
                        name="sunlightExposure"
                        value="Shaded"
                        checked={sunlightExposure === 'Shaded'}
                        onChange={(e) =>
                            {
                                setSunlightExposure(e.target.value);
                                setexposureimg('shaded')
                            }}
                        className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className='text-sm text-slate-700'>Shaded</span>
                </label>

                <label className='flex items-center mb-2 space-x-2'>
                    <input
                        type="radio"
                        name="sunlightExposure"
                        value="Sunny"
                        checked={sunlightExposure === 'Sunny'}
                        onChange={(e) =>
                            {
                                setSunlightExposure(e.target.value);
                                setexposureimg('sunny')
                            }}
                        className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className='text-sm text-slate-700'>Sunny</span>
                </label>
            </div>
            <div className='mb-6'>
                {getExposureImage()}
            </div>
            <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Number of People in Room
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={numPeopleStr}
                    onChange={(e) => handleIntegerTextInput(e.target.value, setNumPeopleStr)}
                    onFocus={(e) => handleFocusStr(numPeopleStr, e)}
                    placeholder="e.g., 2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
            </div>
            </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full mb-4 max-w-lg">
              <div className="flex items-center justify-between mb-6">
              <h2 className='text-xl font-semibold text-slate-800'>Room Size</h2>
              <a onClick={() => setRoomSizeDisplay(!roomSizeDisplay)}>
                {roomSizeDisplay ? (
                  <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
            </div>
              {roomSizeDisplay && (
                <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Length
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={lengthStr}
                    onChange={(e) => handleTextNumberInput(e.target.value.replace(',', '.'), setLengthStr)}
                    onFocus={(e) => handleFocusStr(lengthStr, e)}
                    placeholder="e.g., 10"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  <UnitDropdown
                    value={lengthUnit}
                    onChange={(e) => setLengthUnit(e.target.value)}
                    unitValues={lengthUnitValues}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Width
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={widthStr}
                    onChange={(e) => handleTextNumberInput(e.target.value.replace(',', '.'), setWidthStr)}
                    onFocus={(e) => handleFocusStr(widthStr, e)}
                    placeholder="e.g., 10"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  <UnitDropdown
                    value={widthUnit}
                    onChange={(e) => setWidthUnit(e.target.value)}
                    unitValues={widthUnitValues}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Floor Area
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formatNumber(floorArea)}
                    readOnly
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                    style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                  />
                  <UnitDropdown
                    value={floorAreaUnit}
                    onChange={(e) => setFloorAreaUnit(e.target.value)}
                    unitValues={floorAreaUnitValues}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ceiling Height
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={ceilingHeightStr}
                    onChange={(e) => handleTextNumberInput(e.target.value.replace(',', '.'), setCeilingHeightStr)}
                    onFocus={(e) => handleFocusStr(ceilingHeightStr, e)}
                    placeholder="e.g., 2.7"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  <UnitDropdown
                    value={ceilingHeightUnit}
                    onChange={(e) => setCeilingHeightUnit(e.target.value)}
                    unitValues={ceilingHeightUnitValues}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
              )}
          </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-6 text-slate-800">Results</h2>
                <p className='text-sm-center text-slate-700 mb-2'>Purchase an air conditioner with a cooling capacity of at least:</p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recommended Air Conditioner Size
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formatNumber(btu, btuUnit === 'BTU' ? 0 : 2)}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                      style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                    />
                    <UnitDropdown
                      value={btuUnit}
                      onChange={(e) => setBTUUnit(e.target.value)}
                      unitValues={btuUnitValues}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={shareResult}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <span className="text-white">🔗</span>
                    Share result
                  </button>
                  <button
                    onClick={reloadCalculator}
                    className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Reload calculator
                  </button>
                </div>
                <button
                  onClick={clearAll}
                  className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Clear all changes
                </button>
              </div>
              </div>
            </div>
)}