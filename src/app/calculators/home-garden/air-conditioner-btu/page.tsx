'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const lengthUnitValues = ['m', 'ft', 'cm'];
const widthUnitValues = ['m', 'ft', 'cm'];
const floorAreaUnitValues = ['m2', 'ft2'];
const ceilingHeightUnitValues = ['m', 'ft', 'cm'];
const btuUnitValues = ['BTU', 'kW', 'watts', 'hp(l)', 'hp(E)', 'tons'];

export default function AirConditionerBTUCalculator() {
    const [roomSize,setRoomSize] = useState<string>('Bedroom');
    const [sunlightExposure, setSunlightExposure] = useState<string>('Neither shaded nor sunny');
    const [exposureimg,setexposureimg] = useState<string>('neither-shaded-nor-sunny');
    const [numPeople,setNumPeople] = useState<number>(0);
    const [currentAirConditioner,setCurrentAirConditoner] = useState<boolean>(false);
    const [length, setLength] = useState<number>(0);
    const [lengthUnit, setLengthUnit] = useState<string>('m');
    const [width, setWidth] = useState<number>(0);
    const [widthUnit, setWidthUnit] = useState<string>('m');
    const [floorArea, setFloorArea] = useState<number>(0);
    const [floorAreaUnit, setFloorAreaUnit] = useState<string>('m2');
    const [ceilingHeight, setCeilingHeight] = useState<number>(0);
    const [ceilingHeightUnit, setCeilingHeightUnit] = useState<string>('m');
    const [btu, setBTU] = useState<number>(0);
    const [btuUnit, setBTUUnit] = useState<string>('BTU');

    const calculateBTU = () => {
        // Convert length and width to meters first for consistent calculation
        const lengthInMeters = convertValue(length, lengthUnit, 'm');
        const widthInMeters = convertValue(width, widthUnit, 'm');

        // Calculate floor area in square meters
        const floorAreaInSquareMeters = lengthInMeters * widthInMeters;

        // Convert to selected floor area unit for display
        const floorAreaDisplay = convertValue(floorAreaInSquareMeters, 'm2', floorAreaUnit);

        // Convert floor area to square feet for BTU calculation (25 BTU per sq ft - Omni Calculator standard)
        const floorAreaInSquareFeet = convertValue(floorAreaInSquareMeters, 'm2', 'ft2');

        // Base BTU calculation (25 BTU per square foot - Omni Calculator methodology)
        let btuValue = floorAreaInSquareFeet * 25;

        // Adjust for ceiling height: add 1000 BTU for each WHOLE foot above 8 feet
        const ceilingHeightInFeet = convertValue(ceilingHeight, ceilingHeightUnit, 'ft');
        if (ceilingHeightInFeet > 8) {
            const extraWholeFeet = Math.max(0, Math.floor(ceilingHeightInFeet - 8));
            btuValue += 1000 * extraWholeFeet;
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
        if (numPeople > 2) {
            btuValue += (numPeople - 2) * 600;
        }

        // Convert to selected BTU unit
        const btuDisplay = convertValue(btuValue, 'BTU', btuUnit);

        setFloorArea(floorAreaDisplay);
        setBTU(btuDisplay);
    };

    useEffect(() => {
        calculateBTU();
    }, [length, lengthUnit, width, widthUnit, floorAreaUnit, ceilingHeight, ceilingHeightUnit, btuUnit, roomSize, sunlightExposure, numPeople]);

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

    const handleNumberInput = (value: string, setValue: React.Dispatch<React.SetStateAction<number>>) => {
        if (value === '' || value === '0') {
          setValue(0);
        } else {
          // Remove leading zeros and convert to number
          const cleanValue = value.replace(/^0+/, '') || '0';
          setValue(Number(cleanValue) || 0);
        }
      };

      const handleFocus = (currentValue: number, e: React.FocusEvent<HTMLInputElement>) => {
        if (currentValue === 0) {
          e.target.select();
        }
      };

      const clearAll = () => {
        setLength(0);
        setWidth(0);
        setFloorArea(0);
        setCeilingHeight(0);
        setBTU(0);
      };

      const reloadCalculator = () => {
        setLength(0);
        setWidth(0);
        setFloorArea(0);
        setCeilingHeight(0);
        setBTU(0);
      };

      const shareResult = () => {
        const result = `Length: ${length} ${lengthUnit}\nWidth: ${width} ${widthUnit}\nFloor Area: ${floorArea} ${floorAreaUnit}\nCeiling Height: ${ceilingHeight} ${ceilingHeightUnit}\nBTU: ${btu} ${btuUnit}`;
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
                            onChange={(e) => handleNumberInput(e.target.value, setBTU)}
                            onFocus={(e) => handleFocus(btu, e)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}                            
                            step="0.01"
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
            <h2 className='text-xl font-semibold mb-6 text-slate-800'>
                Room Configuration
            </h2>
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
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value) || 0)} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    min="0"
                />
            </div>        
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full mb-4 max-w-lg">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">Room Size</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Length
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => handleNumberInput(e.target.value, setLength)}
                    onFocus={(e) => handleFocus(length, e)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
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
                    type="number"
                    value={width}
                    onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                    onFocus={(e) => handleFocus(width, e)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
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
                    value={floorArea.toFixed(2)}
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
                    type="number"
                    value={ceilingHeight}
                    onChange={(e) => handleNumberInput(e.target.value, setCeilingHeight)}
                    onFocus={(e) => handleFocus(ceilingHeight, e)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    step="0.01"
                    min="0"
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
                      value={btu.toFixed(0)}
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