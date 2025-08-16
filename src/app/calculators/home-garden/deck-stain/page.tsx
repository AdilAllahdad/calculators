'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const floorLengthUnitValues = ['m', 'ft', 'cm', 'in'];
const floorWidthUnitValues = ['m', 'ft', 'cm', 'in'];
const floorAreaUnitValues = ['m2', 'ft2', 'cm2', 'in2'];
const railingLengthUnitValues = ['m', 'ft', 'cm', 'in'];
const railingHeightUnitValues = ['m', 'ft', 'cm', 'in'];
const customRailingAreaUnitValues = ['m2', 'ft2', 'in2'];
const postsWidthUnitValues = ['mm', 'cm', 'in'];
const balustersdensityUnitValues = ['m', 'ft'];
const balustersWidthUnitValues = ['mm', 'cm', 'in'];
const balustersAreaUnitValues = ['m2', 'cm2', 'ft2', 'in2'];
const stepsWidthUnitValues = ['m', 'cm', 'in', 'ft'];
const stepsAreaUnitValues = ['m2', 'ft2', 'in2'];
const coverageFactorUnitValues = ['m2', 'ft2', 'cm2', 'in2'];
const railingAreaNoFillUnitValues = ['m2', 'ft2', 'in2'];
const railingAreaBallUnitValues = ['m2', 'ft2', 'in2'];

type DimensionsState = {
  floorLength: number | string;
  floorLengthUnit: string;
  floorWidth: number | string;
  floorWidthUnit: string;
  floorArea: string | number;
  floorAreaUnit: string;
  railingLength: number | string;
  railingLengthUnit: string;
  railingHeight: number | string;
  railingHeightUnit: string;
  RailingAreaNoFill: number | string;
  RailingAreaNoFillUnit: string;
  RailingAreaBall: number | string;
  RailingAreaBallUnit: string;
  customRailingArea: number | string;
  customRailingAreaUnit: string;
  postsWidth: number | string;
  postsWidthUnit: string;
  balustersDensity: number | string;
  balustersDensityUnit: string;
  balustersWidth: number | string;
  balustersWidthUnit: string;
  balustersArea: number | string;
  balustersAreaUnit: string;
  stepsWidth: number | string;
  stepsWidthUnit: string;
  stepsArea: number | string;
  stepsAreaUnit: string;
  coverageFactor: number | string;
  coverageFactorUnit: string;

  // toggles
  isRailingSelected: boolean;
  isCustomSelected: boolean;
  isBalustersSelected: boolean;
  isStepsSelected: boolean;
  isStepsIncluded: boolean;
  isAreaSelected: boolean;
  showFloorDimensions: boolean;
  showRailingDimensions: boolean;
  showStepsDimensions: boolean;
};

export default function DeckStainCalculator() {
    
    const [state, setState] = useState<DimensionsState>({
    floorLength: '',
    floorLengthUnit: "m",
    floorWidth: '',
    floorWidthUnit: "m",
    floorArea: '',
    floorAreaUnit: "m2",
    railingLength: '',
    railingLengthUnit: "m",
    railingHeight: '',
    railingHeightUnit: "m",
    RailingAreaNoFill: '',
    RailingAreaNoFillUnit: "m2",
    RailingAreaBall: '',
    RailingAreaBallUnit: "m2",
    customRailingArea: '',
    customRailingAreaUnit: "m2",
    postsWidth: '',
    postsWidthUnit: "mm",
    balustersDensity: '',
    balustersDensityUnit: "m",
    balustersWidth: '',
    balustersWidthUnit: "mm",
    balustersArea: '',
    balustersAreaUnit: "m2",
    stepsWidth: '',
    stepsWidthUnit: "m",
    stepsArea: '',
    stepsAreaUnit: "m2",
    coverageFactor: '',
    coverageFactorUnit: "m2",

    // toggles
    isRailingSelected: false,
    isCustomSelected: false,
    isBalustersSelected: false,
    isStepsSelected: false,
    isStepsIncluded: false,
    isAreaSelected: false,
    showFloorDimensions: true,
    showRailingDimensions: true,
    showStepsDimensions: true,
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value === "" ? '' : value,
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggle = (key: keyof DimensionsState) => {
    setState((prev) => ({
      ...prev,
      [key]: !prev[key] as boolean,
    }));
  };

  const handleFocus = (currentValue: number | string, e: React.FocusEvent<HTMLInputElement>) => {
    if (currentValue === '') {
      e.target.select();
    }
  };

  const calculateTotalArea = () => {
    let totalArea = 0;

    // Floor area
    if (state.floorArea && state.floorAreaUnit && typeof state.floorArea === 'number') {
      totalArea += convertValue(state.floorArea, state.floorAreaUnit, 'm2');
    }

    // Railing area (with ballusters)
    if (state.isRailingSelected && state.isBalustersSelected) {
      if (state.RailingAreaNoFill && state.RailingAreaNoFillUnit && typeof state.RailingAreaNoFill === 'number') {
        totalArea += convertValue(state.RailingAreaNoFill, state.RailingAreaNoFillUnit, 'm2');
      }
      if (state.RailingAreaBall && state.RailingAreaBallUnit && typeof state.RailingAreaBall === 'number') {
        totalArea += convertValue(state.RailingAreaBall, state.RailingAreaBallUnit, 'm2');
      }
      if (state.balustersArea && state.balustersAreaUnit && typeof state.balustersArea === 'number') {
        totalArea += convertValue(state.balustersArea, state.balustersAreaUnit, 'm2');
      }
    }

    // Steps area
    if (state.isStepsSelected) {
      if (state.stepsArea && state.stepsAreaUnit && typeof state.stepsArea === 'number') {
        totalArea += convertValue(state.stepsArea, state.stepsAreaUnit, 'm2');
      }
    }

    return totalArea;
  };
  
  const calculateCoverage = () => {
    const totalArea = calculateTotalArea();
    if (totalArea <= 0 || state.coverageFactor === null || state.coverageFactorUnit === null || typeof state.coverageFactor === 'string') return 0;
    return totalArea / convertValue(state.coverageFactor, state.coverageFactorUnit, 'm2');
  };

  const coverage = calculateCoverage();

  useEffect(() => {
    calculateTotalArea();
    calculateCoverage();
  }, [state]);

  const reloadCalculator = () => {
    setState({
      ...state,
      floorLength: '',
      floorWidth: '',
      floorArea: '',
      railingLength: '',
      railingHeight: '',
      RailingAreaNoFill: '',
      RailingAreaBall: '',
      customRailingArea: '',
      postsWidth: '',
      balustersDensity: '',
      balustersWidth: '',
      balustersArea: '',
      stepsWidth: '',
      stepsArea: '',
      coverageFactor: '',
    });
  };

  const clearAll = () => {
    setState({
      ...state,
      floorLength: '',
      floorWidth: '',
      floorArea: '',
      railingLength: '',
      railingHeight: '',
      RailingAreaNoFill: '',
      RailingAreaBall:'',
      customRailingArea: '',
      postsWidth: '',
      balustersDensity: '',
      balustersWidth: '',
      balustersArea: '',
      stepsWidth: '',
      stepsArea: '',
      coverageFactor: '',
    });
  };

  const shareResult = () => {
    const result = `Floor Area: ${state.floorArea} ${state.floorAreaUnit}
    \nRailing Length: ${state.railingLength} ${state.railingLengthUnit}
    \nRailing Height: ${state.railingHeight} ${state.railingHeightUnit}
    \n Railing Area (No Fill): ${state.RailingAreaNoFill} ${state.RailingAreaNoFillUnit}
    \n Railing Area (Ballusters): ${state.RailingAreaBall} ${state.RailingAreaBallUnit}
    \nPosts Width: ${state.postsWidth} ${state.postsWidthUnit}
    \nBalusters Density: ${state.balustersDensity} ${state.balustersDensityUnit}
    \nBalusters Width: ${state.balustersWidth} ${state.balustersWidthUnit}
    \nBalusters Area: ${state.balustersArea} ${state.balustersAreaUnit}
    \nSteps Width: ${state.stepsWidth} ${state.stepsWidthUnit}
    \nSteps Area: ${state.stepsArea} ${state.stepsAreaUnit}
    \nCoverage Factor: ${state.coverageFactor} ${state.coverageFactorUnit}    
    \nCoverage: ${coverage} L`;
    if (navigator.share) {
      navigator.share({
        title: 'Deck Stain Calculator Result',
        text: result
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="flex justify-center">    
        <div className="max-w-4xl mx-auto my-auto py-8">    
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
                    Deck Stain Calculator 
                    <span className="ml-3 text-2xl">🎨</span>
                </h1>
            </div>
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-between mb-6">    
                    <h2 className='text-xl font-semibold text-slate-800'>Floor Dimensions</h2>    
                    <a onClick={() => toggle('showFloorDimensions')}>    
                        {state.showFloorDimensions ? (    
                            <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />    
                        ) : (    
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
                </div>
                {state.showFloorDimensions && (
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Floor Length
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={state.floorLength}
                                onChange={handleNumberChange}
                                onFocus={(e) => handleFocus(state.floorLength, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                name="floorLength"
                                min="0"
                                placeholder="Enter length"
                            />
                            <UnitDropdown
                                value={state.floorLengthUnit}
                                onChange={handleUnitChange}
                                unitValues={floorLengthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                name="floorLengthUnit"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Floor Width
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={state.floorWidth}
                                onChange={handleNumberChange}
                                onFocus={(e) => handleFocus(state.floorWidth, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                name="floorWidth"
                                min="0"
                                placeholder="Enter width"
                            />
                            <UnitDropdown
                                value={state.floorWidthUnit}
                                onChange={handleUnitChange}
                                unitValues={floorWidthUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                name="floorWidthUnit"
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
                                value={state.floorArea}
                                onChange={handleNumberChange}
                                onFocus={(e) => handleFocus(state.floorArea, e)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                name="floorArea"
                                min="0"
                                placeholder="Enter area"
                            />
                            <UnitDropdown
                                value={state.floorAreaUnit}
                                onChange={handleUnitChange}
                                unitValues={floorAreaUnitValues}
                                className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                name="floorAreaUnit"
                            />
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-between mb-6">    
                    <h2 className='text-xl font-semibold text-slate-800'>Railing Dimensions</h2>    
                    <a onClick={() => toggle('showRailingDimensions')}>    
                        {state.showRailingDimensions ? (    
                            <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />    
                        ) : (    
                  <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                )}
              </a>
                </div>
                {state.showRailingDimensions && (
                <div>
                    <div className="mb-6">
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            Include Railing
                        </label>
                        <div className='flex flex-col gap-4'>
                                <label className='text-sm font-medium text-slate-700'>
                                    <input
                                        type="radio"
                                        name="railing-type"
                                        value="no-railing"
                                        checked={!state.isRailingSelected && !state.isCustomSelected}
                                        onChange={() => {
                                            setState(prev => ({
                                                ...prev,
                                                isRailingSelected: false,
                                                isCustomSelected: false
                                            }));
                                        }}
                                        className="text-blue-500"
                                    />
                                    <span className="ml-2">No railing</span>
                                </label>
                                <label className="text-sm font-medium text-slate-700">
                                    <input
                                        type="radio"
                                        name="railing-type"
                                        value="railing"
                                        checked={state.isRailingSelected && !state.isCustomSelected}
                                        onChange={() => {
                                            setState(prev => ({
                                                ...prev,
                                                isRailingSelected: true,
                                                isCustomSelected: false
                                            }));
                                        }}
                                        className="text-blue-500"
                                    />
                                    <span className='ml-2'>with railing</span>
                                </label>
                                <label className='text-sm font-medium text-slate-700'>
                                    <input
                                        type="radio"
                                        name="railing-type"
                                        value="custom"
                                        checked={state.isCustomSelected && !state.isRailingSelected}
                                        onChange={() => {
                                            setState(prev => ({
                                                ...prev,
                                                isRailingSelected: false,
                                                isCustomSelected: true
                                            }));
                                        }}
                                        className="text-blue-500"
                                    />
                                    <span className='ml-2'>Custom</span>
                                </label>
                        </div>
                        {state.isRailingSelected && (
                            <>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Railing Length
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={state.railingLength}
                                        onChange={handleNumberChange}
                                        onFocus={(e) => handleFocus(state.railingLength, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        name="railingLength"
                                        min="0"
                                        placeholder="Enter length"
                                    />
                                    <UnitDropdown
                                        value={state.railingLengthUnit}
                                        onChange={handleUnitChange}
                                        unitValues={railingLengthUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        name="railingLengthUnit"
                                    />
                                </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Railing Height
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={state.railingHeight}
                                        onChange={handleNumberChange}
                                        onFocus={(e) => handleFocus(state.railingHeight, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        name="railingHeight"
                                        min="0"
                                        placeholder="Enter height"
                                    />
                                    <UnitDropdown
                                        value={state.railingHeightUnit}
                                        onChange={handleUnitChange}
                                        unitValues={railingHeightUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        name="railingHeightUnit"
                                    />
                                </div>
                            </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Posts Width
                                    </label>
                                    <input
                                        type="number"
                                        value={state.postsWidth}
                                        onChange={handleNumberChange}
                                        onFocus={(e) => handleFocus(state.postsWidth, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        name="postsWidth"
                                        min="0"
                                        placeholder="Enter width"
                                    />
                                    <UnitDropdown
                                        value={state.postsWidthUnit}
                                        onChange={handleUnitChange}
                                        unitValues={postsWidthUnitValues}
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        name="postsWidthUnit"
                                    />
                                </div>
                                <div className='mt-4'>
                                    <div className='flex flex-col gap-4'>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            <input 
                                                type="radio"
                                                name='No Filling'
                                                value="yes"
                                                checked={!state.isBalustersSelected}
                                                onChange={() => toggle('isBalustersSelected')}
                                                className="text-blue-500"
                                            />
                                            <span className="ml-2">No Filling</span>
                                        </label>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            <input 
                                                type="radio"
                                                name='Ballusters'
                                                value="yes"
                                                checked={state.isBalustersSelected}
                                                onChange={() => toggle('isBalustersSelected')}
                                                className="text-blue-500"
                                            />
                                            <span className="ml-2">Include Ballusters</span>
                                        </label>
                                    </div>
                                </div>
                                {state.isBalustersSelected && (
                                <>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Balusters Density
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.balustersDensity}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.balustersDensity, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="balustersDensity"
                                            min="0"
                                            placeholder="Enter density"
                                        />
                                        <UnitDropdown
                                            value={state.balustersDensityUnit}
                                            onChange={handleUnitChange}
                                            unitValues={balustersdensityUnitValues}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="balustersDensityUnit"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Balusters Width
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.balustersWidth}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.balustersWidth, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="balustersWidth"
                                            min="0"
                                            placeholder="Enter width"
                                        />
                                        <UnitDropdown
                                            value={state.balustersWidthUnit}
                                            onChange={handleUnitChange}
                                            unitValues={balustersWidthUnitValues}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="balustersWidthUnit"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Balusters area
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.balustersArea}
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="balustersArea"
                                            min="0"
                                            placeholder="Calculated area"
                                        />
                                        <UnitDropdown
                                            value={state.balustersAreaUnit}
                                            onChange={handleUnitChange}
                                            unitValues={balustersAreaUnitValues}    
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="balustersAreaUnit"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Railing area - no filling
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.RailingAreaNoFill}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.RailingAreaNoFill, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="RailingAreaNoFill"
                                            min="0"
                                            placeholder="Enter area"
                                        />
                                        <UnitDropdown
                                            value={state.RailingAreaNoFillUnit}
                                            onChange={handleUnitChange}
                                            unitValues={railingAreaNoFillUnitValues}    
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="RailingAreaNoFillUnit"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Railing area - ballusters
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.RailingAreaBall}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.RailingAreaBall, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="RailingAreaBall"
                                            min="0"
                                            placeholder="Enter area"
                                        />
                                        <UnitDropdown
                                            value={state.RailingAreaBallUnit}
                                            onChange={handleUnitChange}
                                            unitValues={railingAreaBallUnitValues}    
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="RailingAreaBallUnit"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {!state.isBalustersSelected && (
                            <>
                            <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Railing area - no filling
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.RailingAreaNoFill}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.RailingAreaNoFill, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="RailingAreaNoFill"
                                            min="0"
                                            placeholder="Enter area"
                                        />
                                        <UnitDropdown
                                            value={state.RailingAreaNoFillUnit}
                                            onChange={handleUnitChange}
                                            unitValues={railingAreaNoFillUnitValues}    
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="RailingAreaNoFillUnit"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                            </div>
                        </>
                    )}
                    {state.isCustomSelected && (
                        <>
                            <div className='mt-4'>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    Custom Railing Area
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={state.customRailingArea}
                                        onChange={handleNumberChange}
                                        onFocus={(e) => handleFocus(state.customRailingArea, e)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                        name="customRailingArea"
                                        min="0"
                                        placeholder="Enter area"
                                    />
                                    <UnitDropdown
                                        value={state.customRailingAreaUnit}
                                        onChange={handleUnitChange}
                                        unitValues={customRailingAreaUnitValues}    
                                        className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        name="customRailingAreaUnit"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    </div>
                    </div>
                )}
                {state.isStepsSelected && (
                    <>  
                        <div className='mt-4'>
                            
                            <div className="flex flex-col gap-2">
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    <input
                                        type='radio'
                                        name='steps'
                                        value='No-Steps'
                                        checked={!state.isStepsIncluded}
                                        onChange={() => toggle('isStepsIncluded')}
                                    />
                                    <span className='ml-2 text-black'>No Steps</span>
                                </label>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                    <input
                                        type='radio'
                                        name='steps'
                                        value='With-Steps'
                                        checked={state.isStepsIncluded}
                                        onChange={() => toggle('isStepsIncluded')}
                                     />
                                </label>
                            </div>
                        </div>
                    </>
                )}
</div>
</div>
</div>
                
  )
}