'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)

const sideUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];
const areaUnitvalues = ['cm2', 'dm2', 'm2', 'yd2', 'ft2', 'in2'];
const priceUnitvalues = ['cm2', 'dm2', 'm2', 'yd2', 'ft2', 'in2'];

export default function CarpetCalculator() {
    const [length,setLength] = useState<number>(0);
    const [width,setWidth] = useState<number>(0);
    const [lengthUnit,setLengthUnit] = useState<string>('m');
    const [widthUnit,setWidthUnit] = useState<string>('m');
    const [radius, setRadius] = useState<number>(0);
    const [radiusUnit, setRadiusUnit] = useState<string>('m');
    const [axisA, setAxisA] = useState<number>(0);
    const [axisAUnit, setAxisAUnit] = useState<string>('m');
    const [axisB, setAxisB] = useState<number>(0);
    const [axisBUnit, setAxisBUnit] = useState<string>('m');
    const [side,setSide] = useState<number>(0);
    const [shape, setShape] = useState<string>('square');
    const [sideUnit,setSideUnit] = useState<string>('m');
    const [area,setArea] = useState<number>(0);
    const [areaUnit,setAreaUnit] = useState<string>('m2');
    const [price,setPrice] = useState<number>(0);
    const [priceUnit,setPriceUnit] = useState<string>('m2');
    const [totalCost,setTotalCost] = useState<number>(0);

    const lengthUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];
    const widthUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];
    const radiusUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];
    const axisAUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];
    const axisBUnitvalues = ['cm', 'dm', 'm', 'yd', 'ft', 'in', 'ft-in', 'm-cm'];

    useEffect(() => {
        calculateArea();
        calculateCost();
    }, [length, width, lengthUnit, widthUnit, radius, radiusUnit, axisA, axisB, axisAUnit, axisBUnit, side, sideUnit, shape, area, areaUnit, price, priceUnit]);

    const calculateArea = () => {
        const roundToThreeDecimals = (num: number) => {
            return Math.round(num * 1000) / 1000;
        };

        if (shape === 'rectangle') {
            if (length <= 0 || width <= 0) {
                setArea(0);
                return;
            }
            const lengthInMeters = convertValue(length, lengthUnit, 'm');
            const widthInMeters = convertValue(width, widthUnit, 'm');
            const areaInSquareMeters = roundToThreeDecimals(lengthInMeters * widthInMeters);
            const areaDisplay = roundToThreeDecimals(convertValue(areaInSquareMeters, 'm2', areaUnit));
            setArea(areaDisplay);
        };
        if (shape === 'circle') {
            if (radius <= 0) {
                setArea(0);
                return;
            }
            const radiusInMeters = convertValue(radius, radiusUnit, 'm');
            const areaInSquareMeters = roundToThreeDecimals(Math.PI * radiusInMeters * radiusInMeters);
            const areaDisplay = roundToThreeDecimals(convertValue(areaInSquareMeters, 'm2', areaUnit));
            setArea(areaDisplay);
        };
        if (shape === 'ellipse') {
            if (axisA <= 0 || axisB <= 0) {
                setArea(0);
                return;
            }
            const axisAInMeters = convertValue(axisA, axisAUnit, 'm');
            const axisBInMeters = convertValue(axisB, axisBUnit, 'm');
            const areaInSquareMeters = roundToThreeDecimals(Math.PI * axisAInMeters * axisBInMeters);
            const areaDisplay = roundToThreeDecimals(convertValue(areaInSquareMeters, 'm2', areaUnit));
            setArea(areaDisplay);
        };
        if (shape === 'pentagon') {
            if (side <= 0) {
                setArea(0);
                return;
            }
            const sideInMeters = convertValue(side, sideUnit, 'm');
            const areaInSquareMeters = roundToThreeDecimals((Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) / 4) * Math.pow(sideInMeters, 2));
            const areaDisplay = roundToThreeDecimals(convertValue(areaInSquareMeters, 'm2', areaUnit));
            setArea(areaDisplay);
        }
        if (shape === 'hexagon') {
            if (side <= 0) {
                setArea(0);
                return;
            }
            const sideInMeters = convertValue(side, sideUnit, 'm');
            const areaInSquareMeters = roundToThreeDecimals((3 * Math.sqrt(3) / 2) * Math.pow(sideInMeters, 2));
            const areaDisplay = roundToThreeDecimals(convertValue(areaInSquareMeters, 'm2', areaUnit));
            setArea(areaDisplay);
        }
    };

    const getShapesImg = () => {
        const getImageSrc = () => {
          switch (shape) {
            case 'rectangle':
              return '/rectangle.png';
            case 'circle':
              return '/circle.png';
            case 'ellipse':
              return '/ellipse.png';
            case 'pentagon':
              return '/pentagon.png';
            case 'hexagon':
              return '/hexagon.png';
            default:
              return null;
          }
        };
        const imageSrc = getImageSrc();

        if (!imageSrc) {
          return (
            <div className="w-full mt-4 mb-4 h-48 bg-gradient-to-br from-green-200 to-green-400 rounded-lg flex items-center justify-center">
              <div className="text-green-700 text-lg font-semibold">Select a shape</div>
            </div>
          );
        }
        return (
          <div className="w-full mt-4 mb-4 h-48 bg-gradient-to-br from-white-200 to-white-400 rounded-lg flex items-center justify-center relative overflow-hidden">
            <img
              src={imageSrc}
              alt={shape}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        );
    }

    const calculateCost = () => {
        if (price <= 0) {
            setTotalCost(0);
            return;
        }
        const areaInPricingUnit = convertValue(area, areaUnit, priceUnit);
        const cost = price * areaInPricingUnit;
        setTotalCost(cost);
    };

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
        setSide(0);
        setArea(0);
        setPrice(0);
        setTotalCost(0);
      };

      const reloadCalculator = () => {
        setSide(0);
        setArea(0);
        setPrice(0);
        setTotalCost(0);
      };

      const shareResult = () => {
        const result = `Side: ${side} ${sideUnit}\nArea: ${area} ${areaUnit}\nPrice: ${price} ${priceUnit}\nTotal Cost: ${totalCost}`;
        if (navigator.share) {
          navigator.share({
            title: 'Carpet Calculator Result',
            text: result
          });
        } else {
          navigator.clipboard.writeText(result);
          alert('Result copied to clipboard!');
        }
      };

      return (
        <div className="flex justify-center">
            <div className="max-w-4xl mx-auto py-8">    
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                        Carpet Calculator 
                        <span className="ml-3 text-2xl">🧷</span>
                    </h1>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-6 text-slate-800">Carpet dimensions</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select a Shape
                            <select
                                value={shape}
                                onChange={(e) => setShape(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                                <option value="ellipse">Ellipse</option>
                                <option value="pentagon">Pentagon</option>
                                <option value="hexagon">Hexagon</option>
                            </select>
                        </label>
                        {getShapesImg()}
                    </div>
                    {shape === 'rectangle' && (
                        <div>
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
                                        min="0"
                                        placeholder="Enter length"
                                    />
                                    <UnitDropdown
                                        value={lengthUnit}
                                        onChange={(e) => setLengthUnit(e.target.value)}
                                        unitValues={lengthUnitvalues}
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
                                        min="0"
                                        placeholder="Enter width"
                                    />
                                    <UnitDropdown
                                        value={widthUnit}
                                        onChange={(e) => setWidthUnit(e.target.value)}
                                        unitValues={widthUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                                        style={{ color: '#1e293b' }}
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            
                        </div>
                    )}
                    {shape === 'circle' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Radius
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={radius}
                                        onChange={(e) => handleNumberInput(e.target.value, setRadius)}
                                        onFocus={(e) => handleFocus(radius, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter radius"
                                    />
                                    <UnitDropdown
                                        value={radiusUnit}
                                        onChange={(e) => setRadiusUnit(e.target.value)}
                                        unitValues={radiusUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {shape === 'ellipse' && (
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Axis A
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={axisA}
                                        onChange={(e) => handleNumberInput(e.target.value, setAxisA)}
                                        onFocus={(e) => handleFocus(axisA, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter axis A"
                                    />
                                    <UnitDropdown
                                        value={axisAUnit}
                                        onChange={(e) => setAxisAUnit(e.target.value)}
                                        unitValues={axisAUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />    
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Axis B
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={axisB}
                                        onChange={(e) => handleNumberInput(e.target.value, setAxisB)}
                                        onFocus={(e) => handleFocus(axisB, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Enter axis B"
                                    />
                                    <UnitDropdown
                                        value={axisBUnit}
                                        onChange={(e) => setAxisBUnit(e.target.value)}
                                        unitValues={axisBUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                     )}
                     { shape === 'pentagon' && (
                      <div>
                        <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Side
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={side}
                                        onChange={(e) => handleNumberInput(e.target.value, setSide)}
                                        onFocus={(e) => handleFocus(side, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter side"
                                    />
                                    <UnitDropdown
                                        value={sideUnit}
                                        onChange={(e) => setSideUnit(e.target.value)}
                                        unitValues={sideUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        step="0.01"
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                          </div>
                     )}
                     { shape === 'hexagon' && (
                      <div>
                        <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Side
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={side}
                                        onChange={(e) => handleNumberInput(e.target.value, setSide)}
                                        onFocus={(e) => handleFocus(side, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        placeholder="Enter side"
                                    />
                                    <UnitDropdown
                                        value={sideUnit}
                                        onChange={(e) => setSideUnit(e.target.value)}
                                        unitValues={sideUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={area}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        step="0.01"
                                        min="0"
                                        placeholder="Calculated area"
                                    />
                                    <UnitDropdown
                                        value={areaUnit}
                                        onChange={(e) => setAreaUnit(e.target.value)}
                                        unitValues={areaUnitvalues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    />
                              </div>
                            </div>
                          </div>
                     )}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-lg">
                     <h2 className='text-xl font-semibold mb-6 text-slate-800'> Cost Calculations</h2>
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Price per unit area
                        </label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                PKR
                            </div>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => handleNumberInput(e.target.value, setPrice)}
                                onFocus={(e) => handleFocus(price, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                min="0"
                                placeholder="Enter price"
                            />
                            <UnitDropdown
                                value={priceUnit}
                                onChange={(e) => setPriceUnit(e.target.value)}
                                unitValues={priceUnitvalues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                     </div>
                     <div className='mb-6'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            Carpet Cost
                        </label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                                PKR
                            </div>
                            <input
                                type="number"
                                value={totalCost}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                style={{ color: '#374151', backgroundColor: '#f8fafc' }}
                            />
                        </div>
                     </div>
                </div>
        </div>
        </div>
      );
}