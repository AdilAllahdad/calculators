'use client';

import { useState, useMemo } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';

// Type definitions for unit system
type LengthUnitType = 'm' | 'ft' | 'cm' | 'in' | 'mm';
type AreaUnitType = 'm2' | 'ft2' | 'cm2' | 'in2';
type ConversionMap<T extends string> = Record<T, number>;

// Helper functions for type safety
const isLengthUnit = (unit: string): unit is LengthUnitType => {
  return ['m', 'ft', 'cm', 'in', 'mm'].includes(unit);
};

const isAreaUnit = (unit: string): unit is AreaUnitType => {
  return ['m2', 'ft2', 'cm2', 'in2'].includes(unit);
};

// Define the unit values needed for each dropdown
const floorLengthUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const floorWidthUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const floorAreaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'cm2', 'in2'];
const railingLengthUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const railingHeightUnitValues: LengthUnitType[] = ['m', 'ft', 'cm', 'in'];
const customRailingAreaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'in2'];
const postsWidthUnitValues: LengthUnitType[] = ['mm', 'cm', 'in'];
const balustersdensityUnitValues: LengthUnitType[] = ['m', 'ft'];
const balustersWidthUnitValues: LengthUnitType[] = ['mm', 'cm', 'in'];
const balustersAreaUnitValues: AreaUnitType[] = ['m2', 'cm2', 'ft2', 'in2'];
const stepsWidthUnitValues: LengthUnitType[] = ['m', 'cm', 'in', 'ft'];
const stepsAreaUnitValues: AreaUnitType[] = ['m2', 'ft2', 'in2'];
const coverageFactorUnitValues: AreaUnitType[] = ['m2', 'ft2', 'cm2', 'in2'];
const railingAreaNoFillUnitValues: AreaUnitType[] = ['m2', 'ft2', 'in2'];
const railingAreaBallUnitValues: AreaUnitType[] = ['m2', 'ft2', 'in2'];

// Conversion maps (all to base units)
const lengthConversions: ConversionMap<LengthUnitType> = {
  'm': 1,           // meters (base)
  'ft': 0.3048,     // feet to meters
  'cm': 0.01,       // centimeters to meters
  'in': 0.0254,     // inches to meters
  'mm': 0.001       // millimeters to meters
};

const areaConversions: ConversionMap<AreaUnitType> = {
  'm2': 1,          // square meters (base)
  'ft2': 0.092903,  // square feet to square meters
  'cm2': 0.0001,    // square centimeters to square meters
  'in2': 0.00064516 // square inches to square meters
};

// Unit conversion helper
const handleUnitConversion = <T extends string>(
  currentUnit: T,
  newUnit: T,
  value: number | string,
  conversionTable: ConversionMap<T>
): number => {
  const numValue = Number(value);
  if (!numValue || isNaN(numValue)) return 0;
  const standardValue = numValue * conversionTable[currentUnit];
  return standardValue / conversionTable[newUnit];
};

// Format number helper
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value % 1 === 0) return value.toString();
  return value.toFixed(decimals);
};

type DimensionsState = {
  floorLength: number | string;
  floorLengthUnit: LengthUnitType;
  floorWidth: number | string;
  floorWidthUnit: LengthUnitType;
  floorArea: string | number;
  floorAreaUnit: AreaUnitType;
  railingLength: number | string;
  railingLengthUnit: LengthUnitType;
  railingHeight: number | string;
  railingHeightUnit: LengthUnitType;
  RailingAreaNoFill: number | string;
  RailingAreaNoFillUnit: AreaUnitType;
  RailingAreaBall: number | string;
  RailingAreaBallUnit: AreaUnitType;
  customRailingArea: number | string;
  customRailingAreaUnit: AreaUnitType;
  postsWidth: number | string;
  postsWidthUnit: LengthUnitType;
  balustersDensity: number | string;
  balustersDensityUnit: LengthUnitType;
  balustersWidth: number | string;
  balustersWidthUnit: LengthUnitType;
  balustersArea: number | string;
  balustersAreaUnit: AreaUnitType;
  stepsCount: number | string;
  stepsWidth: number | string;
  stepsWidthUnit: LengthUnitType;
  stepsArea: number | string;
  stepsAreaUnit: AreaUnitType;
  coatsNumber: number | string;
  coverageFactor: number | string;
  coverageFactorUnit: AreaUnitType;

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
    stepsCount: '',
    stepsWidth: '',
    stepsWidthUnit: "m",
    stepsArea: '',
    stepsAreaUnit: "m2",
    coatsNumber: '',
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



  // Type-safe unit change handlers with value preservation
  const handleFloorLengthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.floorLength || state.floorLength === '') {
      setState(prev => ({ ...prev, floorLengthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.floorLengthUnit, newUnit, Number(state.floorLength), lengthConversions);
    setState(prev => ({
      ...prev,
      floorLength: result.toFixed(4),
      floorLengthUnit: newUnit
    }));
  };

  const handleFloorWidthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.floorWidth || state.floorWidth === '') {
      setState(prev => ({ ...prev, floorWidthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.floorWidthUnit, newUnit, Number(state.floorWidth), lengthConversions);
    setState(prev => ({
      ...prev,
      floorWidth: result.toFixed(4),
      floorWidthUnit: newUnit
    }));
  };

  const handleFloorAreaUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    setState(prev => ({ ...prev, floorAreaUnit: newUnitValue }));
  };

  const handleRailingLengthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.railingLength || state.railingLength === '') {
      setState(prev => ({ ...prev, railingLengthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.railingLengthUnit, newUnit, Number(state.railingLength), lengthConversions);
    setState(prev => ({
      ...prev,
      railingLength: result.toFixed(4),
      railingLengthUnit: newUnit
    }));
  };

  const handleRailingHeightUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.railingHeight || state.railingHeight === '') {
      setState(prev => ({ ...prev, railingHeightUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.railingHeightUnit, newUnit, Number(state.railingHeight), lengthConversions);
    setState(prev => ({
      ...prev,
      railingHeight: result.toFixed(4),
      railingHeightUnit: newUnit
    }));
  };

  // Additional unit change handlers for remaining components
  const handleCoverageFactorUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.coverageFactor || state.coverageFactor === '') {
      setState(prev => ({ ...prev, coverageFactorUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.coverageFactorUnit, newUnit, Number(state.coverageFactor), areaConversions);
    setState(prev => ({
      ...prev,
      coverageFactor: result.toFixed(4),
      coverageFactorUnit: newUnit
    }));
  };

  const handleStepsWidthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.stepsWidth || state.stepsWidth === '') {
      setState(prev => ({ ...prev, stepsWidthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.stepsWidthUnit, newUnit, Number(state.stepsWidth), lengthConversions);
    setState(prev => ({
      ...prev,
      stepsWidth: result.toFixed(4),
      stepsWidthUnit: newUnit
    }));
  };

  const handleStepsAreaUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    setState(prev => ({ ...prev, stepsAreaUnit: newUnitValue }));
  };

  const handleCustomRailingAreaUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    setState(prev => ({ ...prev, customRailingAreaUnit: newUnitValue }));
  };

  const handlePostsWidthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.postsWidth || state.postsWidth === '') {
      setState(prev => ({ ...prev, postsWidthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.postsWidthUnit, newUnit, Number(state.postsWidth), lengthConversions);
    setState(prev => ({
      ...prev,
      postsWidth: result.toFixed(4),
      postsWidthUnit: newUnit
    }));
  };

  const handleBalustersDensityUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.balustersDensity || state.balustersDensity === '') {
      setState(prev => ({ ...prev, balustersDensityUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.balustersDensityUnit, newUnit, Number(state.balustersDensity), lengthConversions);
    setState(prev => ({
      ...prev,
      balustersDensity: result.toFixed(4),
      balustersDensityUnit: newUnit
    }));
  };

  const handleBalustersWidthUnitChange = (newUnitValue: string) => {
    if (!isLengthUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.balustersWidth || state.balustersWidth === '') {
      setState(prev => ({ ...prev, balustersWidthUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.balustersWidthUnit, newUnit, Number(state.balustersWidth), lengthConversions);
    setState(prev => ({
      ...prev,
      balustersWidth: result.toFixed(4),
      balustersWidthUnit: newUnit
    }));
  };

  const handleBalustersAreaUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    setState(prev => ({ ...prev, balustersAreaUnit: newUnitValue }));
  };

  const handleRailingAreaNoFillUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    const newUnit = newUnitValue;

    if (!state.RailingAreaNoFill || state.RailingAreaNoFill === '') {
      setState(prev => ({ ...prev, RailingAreaNoFillUnit: newUnit }));
      return;
    }

    const result = handleUnitConversion(state.RailingAreaNoFillUnit, newUnit, Number(state.RailingAreaNoFill), areaConversions);
    setState(prev => ({
      ...prev,
      RailingAreaNoFill: result.toFixed(4),
      RailingAreaNoFillUnit: newUnit
    }));
  };

  const handleRailingAreaBallUnitChange = (newUnitValue: string) => {
    if (!isAreaUnit(newUnitValue)) return;
    setState(prev => ({ ...prev, RailingAreaBallUnit: newUnitValue }));
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

  // Derived values (computed, not stored) - using type-safe conversions
  const floorAreaDerivedM2 = useMemo(() => {
    const lengthNum = parseFloat(String(state.floorLength));
    const widthNum = parseFloat(String(state.floorWidth));
    if (isNaN(lengthNum) || lengthNum <= 0 || isNaN(widthNum) || widthNum <= 0) return 0;

    // Convert to meters using type-safe conversion
    const lengthM = lengthNum * lengthConversions[state.floorLengthUnit];
    const widthM = widthNum * lengthConversions[state.floorWidthUnit];
    return lengthM * widthM;
  }, [state.floorLength, state.floorLengthUnit, state.floorWidth, state.floorWidthUnit]);

  const floorAreaDisplay = useMemo(() => {
    // Convert from m2 to selected unit using type-safe conversion
    const areaInSelected = floorAreaDerivedM2 / areaConversions[state.floorAreaUnit];
    return areaInSelected ? Number(formatNumber(areaInSelected, 4)) : '';
  }, [floorAreaDerivedM2, state.floorAreaUnit]);

  const stepsAreaDerivedM2 = useMemo(() => {
        const stepsCountNum = parseFloat(String(state.stepsCount));
        const stepsWidthNum = parseFloat(String(state.stepsWidth));
        if (isNaN(stepsCountNum) || stepsCountNum <= 0 || isNaN(stepsWidthNum) || stepsWidthNum <= 0) return 0;

        // Convert to meters using type-safe conversion
        const widthM = stepsWidthNum * lengthConversions[state.stepsWidthUnit];
        // Assuming standard step depth of 0.3m (approximately 1 foot)
        const stepDepth = 0.3;
        // Calculate total area: width * depth * number of steps
        return widthM * stepDepth * stepsCountNum;
    }, [state.stepsCount, state.stepsWidth, state.stepsWidthUnit]);

    const stepsAreaDisplay = useMemo(() => {
        // Convert from m2 to selected unit using type-safe conversion
        const areaInSelected = stepsAreaDerivedM2 / areaConversions[state.stepsAreaUnit];
        return areaInSelected ? Number(formatNumber(areaInSelected, 4)) : '';
    }, [stepsAreaDerivedM2, state.stepsAreaUnit]);

  // Railing derived areas
  const railingNoFillDerivedM2 = useMemo(() => {
    const lenNum = parseFloat(String(state.railingLength));
    const hNum = parseFloat(String(state.railingHeight));
    if (isNaN(lenNum) || lenNum <= 0 || isNaN(hNum) || hNum <= 0) return 0;

    // Convert to meters using type-safe conversion
    const lenM = lenNum * lengthConversions[state.railingLengthUnit];
    const hM = hNum * lengthConversions[state.railingHeightUnit];
    return lenM * hM;
  }, [state.railingLength, state.railingLengthUnit, state.railingHeight, state.railingHeightUnit]);

  const balustersAreaDerivedM2 = useMemo(() => {
    const lenNum = parseFloat(String(state.railingLength));
    const hNum = parseFloat(String(state.railingHeight));
    const densityNum = parseFloat(String(state.balustersDensity));
    const widthNum = parseFloat(String(state.balustersWidth));
    if (
      isNaN(lenNum) || lenNum <= 0 ||
      isNaN(hNum) || hNum <= 0 ||
      isNaN(densityNum) || densityNum <= 0 ||
      isNaN(widthNum) || widthNum <= 0
    ) return 0;

    // Convert length to the density unit using type-safe conversion
    const lengthInDensityUnit = lenNum * lengthConversions[state.railingLengthUnit] / lengthConversions[state.balustersDensityUnit];
    const balustersCount = densityNum * lengthInDensityUnit; // count can be fractional

    // Convert height and width to meters using type-safe conversion
    const hM = hNum * lengthConversions[state.railingHeightUnit];
    const wM = widthNum * lengthConversions[state.balustersWidthUnit];
    const perBalusterAreaM2 = hM * wM;

    return balustersCount * perBalusterAreaM2;
  }, [
    state.railingLength,
    state.railingLengthUnit,
    state.railingHeight,
    state.railingHeightUnit,
    state.balustersDensity,
    state.balustersDensityUnit,
    state.balustersWidth,
    state.balustersWidthUnit,
  ]);

  const railingBallDerivedM2 = useMemo(() => {
    const diff = railingNoFillDerivedM2 - balustersAreaDerivedM2;
    return diff > 0 ? diff : 0;
  }, [railingNoFillDerivedM2, balustersAreaDerivedM2]);

  // Display conversions using type-safe conversion
  const railingNoFillDisplay = useMemo(() =>
    Number(formatNumber(railingNoFillDerivedM2 / areaConversions[state.RailingAreaNoFillUnit], 4))
  , [railingNoFillDerivedM2, state.RailingAreaNoFillUnit]);

  const balustersAreaDisplay = useMemo(() =>
    Number(formatNumber(balustersAreaDerivedM2 / areaConversions[state.balustersAreaUnit], 4))
  , [balustersAreaDerivedM2, state.balustersAreaUnit]);

  const railingBallDisplay = useMemo(() =>
    Number(formatNumber(railingBallDerivedM2 / areaConversions[state.RailingAreaBallUnit], 4))
  , [railingBallDerivedM2, state.RailingAreaBallUnit]);


  // Total area functions

  const getTotalAreaM2 = () => {
    let total = 0;
    // Floor: include if provided
    if (typeof floorAreaDisplay === 'number') {
      total += floorAreaDisplay * areaConversions[state.floorAreaUnit];
    }

    // Railing: custom overrides standard railing
    if (state.isCustomSelected) {
      if (typeof state.customRailingArea === 'number' && state.customRailingArea > 0) {
        total += state.customRailingArea * areaConversions[state.customRailingAreaUnit];
      }
    } else if (state.isRailingSelected) {
      // With railing
      if (state.isBalustersSelected) {
        // Include the no-fill panel area and the balusters area; exclude the 'balusters' voids
        total += railingNoFillDerivedM2;
        total += balustersAreaDerivedM2;
      } else {
        // No filling: include the simple panel area
        total += railingNoFillDerivedM2;
      }
    }

    // Steps: prefer manual steps area if provided; otherwise use derived
    if (state.isStepsSelected) {
      if (typeof state.stepsArea === 'number' && state.stepsArea > 0) {
        total += state.stepsArea * areaConversions[state.stepsAreaUnit];
      } else if (stepsAreaDerivedM2 > 0) {
        total += stepsAreaDerivedM2;
      }
    }

    return total;
  };


  const getTotalAreaFt2 = () => getTotalAreaM2() / areaConversions['ft2'];

  const totalAreaM2 = useMemo(() => getTotalAreaM2(), [
    floorAreaDisplay,
    state.floorAreaUnit,
    state.isCustomSelected,
    state.customRailingArea,
    state.customRailingAreaUnit,
    state.isRailingSelected,
    state.isBalustersSelected,
    state.RailingAreaNoFill,
    state.RailingAreaNoFillUnit,
    state.RailingAreaBall,
    state.RailingAreaBallUnit,
    state.balustersArea,
    state.balustersAreaUnit,
    state.isStepsSelected,
    state.stepsArea,
    state.stepsAreaUnit,
    stepsAreaDerivedM2,
  ]);

  // Stain calculation (placed after totalAreaM2 to avoid TDZ)
  const coveragePerGallonM2 = useMemo(() => {
    const cf = parseFloat(String(state.coverageFactor));
    if (isNaN(cf) || cf <= 0) return 0;
    // Convert to m2 using type-safe conversion
    return cf * areaConversions[state.coverageFactorUnit];
  }, [state.coverageFactor, state.coverageFactorUnit]);

  const totalStainGallons = useMemo(() => {
    if (coveragePerGallonM2 <= 0) return 0;
    const coats = parseFloat(String(state.coatsNumber));
    const coatsNum = isNaN(coats) || coats <= 0 ? 1 : coats;
    return (totalAreaM2 / coveragePerGallonM2) * coatsNum;
  }, [coveragePerGallonM2, totalAreaM2, state.coatsNumber]);

  const totalStainLiters = useMemo(() => totalStainGallons * 3.78541, [totalStainGallons]);




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
      stepsCount: '',
      stepsWidth: '',
      stepsArea: '',
      coatsNumber: '',
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
      stepsCount: '',
      stepsWidth: '',
      stepsArea: '',
      coatsNumber: '',
      coverageFactor: '',
    });
  };

  const shareResult = () => {
    const result = `Floor Area: ${floorAreaDisplay} ${state.floorAreaUnit}
    \nRailing Length: ${state.railingLength} ${state.railingLengthUnit}
    \nRailing Height: ${state.railingHeight} ${state.railingHeightUnit}
    \n Railing Area (No Fill): ${railingNoFillDisplay} ${state.RailingAreaNoFillUnit}
    \n Railing Area (Balusters): ${railingBallDisplay} ${state.RailingAreaBallUnit}
    \nPosts Width: ${state.postsWidth} ${state.postsWidthUnit}
    \nBalusters Density: ${state.balustersDensity} ${state.balustersDensityUnit}
    \nBalusters Width: ${state.balustersWidth} ${state.balustersWidthUnit}
    \nBalusters Area: ${balustersAreaDisplay} ${state.balustersAreaUnit}
    \nSteps Count: ${state.stepsCount}
    \nSteps Width: ${state.stepsWidth} ${state.stepsWidthUnit}
    \nSteps Area: ${stepsAreaDisplay} ${state.stepsAreaUnit}
    \nNumber of Coats: ${state.coatsNumber}
    \nCoverage Factor: ${state.coverageFactor} ${state.coverageFactorUnit} per US gal
    \nTotal Stain: ${formatNumber(totalStainGallons)} US gal (${formatNumber(totalStainLiters)} L)`;
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
                                onChange={(e) => handleFloorLengthUnitChange(e.target.value)}
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
                                onChange={(e) => handleFloorWidthUnitChange(e.target.value)}
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
                                value={floorAreaDisplay}
                                readOnly
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                style={{ color: '#1e293b' }}
                                name="floorArea"
                                min="0"
                                placeholder="Calculated area"
                            />
                            <UnitDropdown
                                value={state.floorAreaUnit}
                                onChange={(e) => handleFloorAreaUnitChange(e.target.value)}
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
                                        onChange={(e) => handleRailingLengthUnitChange(e.target.value)}
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
                                        onChange={(e) => handleRailingHeightUnitChange(e.target.value)}
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
                                        onChange={(e) => handlePostsWidthUnitChange(e.target.value)}
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
                                            onChange={(e) => handleBalustersDensityUnitChange(e.target.value)}
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
                                            onChange={(e) => handleBalustersWidthUnitChange(e.target.value)}
                                            unitValues={balustersWidthUnitValues}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="balustersWidthUnit"
                                        />
                                    </div>
                                </div>
                                {state.isAreaSelected && (
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            Balusters area (calculated)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={balustersAreaDisplay}
                                                readOnly
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                                style={{ color: '#1e293b' }}
                                                name="balustersArea"
                                                min="0"
                                                placeholder="Calculated area"
                                                key={`balusters-area-${state.isAreaSelected}`}
                                            />
                                            <UnitDropdown
                                                value={state.balustersAreaUnit}
                                                onChange={(e) => handleBalustersAreaUnitChange(e.target.value)}
                                                unitValues={balustersAreaUnitValues}
                                                className="w-28 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                name="balustersAreaUnit"
                                            />
                                        </div>
                                    </div>
                                )}
                                {state.isAreaSelected && (
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            Railing area - no filling (calculated)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={railingNoFillDisplay}
                                                readOnly
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                                style={{ color: '#1e293b' }}
                                                name="RailingAreaNoFill"
                                                min="0"
                                                placeholder="Calculated area"
                                            />
                                            <UnitDropdown
                                                value={state.RailingAreaNoFillUnit}
                                                onChange={(e) => handleRailingAreaNoFillUnitChange(e.target.value)}
                                                unitValues={railingAreaNoFillUnitValues}
                                                className="w-28 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                name="RailingAreaNoFillUnit"
                                            />
                                        </div>
                                    </div>
                                )}
                                {state.isAreaSelected && (
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            Railing area - balusters (calculated)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={railingBallDisplay}
                                                readOnly
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                                style={{ color: '#1e293b' }}
                                                name="RailingAreaBall"
                                                min="0"
                                                placeholder="Calculated area"
                                            />
                                            <UnitDropdown
                                                value={state.RailingAreaBallUnit}
                                                onChange={(e) => handleRailingAreaBallUnitChange(e.target.value)}
                                                unitValues={railingAreaBallUnitValues}
                                                className="w-28 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                name="RailingAreaBallUnit"
                                            />
                                        </div>
                                    </div>
                                )}
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
                                            onChange={(e) => handleRailingAreaNoFillUnitChange(e.target.value)}
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
                                        onChange={(e) => handleCustomRailingAreaUnitChange(e.target.value)}
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

            </div>
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Steps Dimensions</h2>
                    <a onClick={() => toggle('showStepsDimensions')}>
                        {state.showStepsDimensions ? (
                            <ChevronUp className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                        ) : (
                            <ChevronDown className="text-blue-500 hover:scale-110 transition-transform duration-200" />
                        )}
                    </a>
                </div>
                {state.showStepsDimensions && (
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
                                     <span className='ml-2 text-black'>With Steps</span>
                                </label>
                            </div>
                            {state.isStepsIncluded && (
                                <>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Number of Steps
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.stepsCount}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.stepsCount, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="stepsCount"
                                            min="0"
                                            placeholder="Enter number of steps"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                                        Step Width
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={state.stepsWidth}
                                            onChange={handleNumberChange}
                                            onFocus={(e) => handleFocus(state.stepsWidth, e)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                                            name="stepsWidth"
                                            min="0"
                                            placeholder="Enter width"
                                        />
                                        <UnitDropdown
                                            value={state.stepsWidthUnit}
                                            onChange={(e) => handleStepsWidthUnitChange(e.target.value)}
                                            unitValues={stepsWidthUnitValues}
                                            className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            name="stepsWidthUnit"
                                        />
                                    </div>
                                </div>
                                {state.isAreaSelected && (
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                                            Steps Area (calculated)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={stepsAreaDisplay}
                                                readOnly
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                                                style={{ color: '#1e293b' }}
                                                name="stepsArea"
                                                min="0"
                                                placeholder="Calculated area"
                                            />
                                            <UnitDropdown
                                                value={state.stepsAreaUnit}
                                                onChange={(e) => handleStepsAreaUnitChange(e.target.value)}
                                                unitValues={stepsAreaUnitValues}
                                                className="w-28 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                name="stepsAreaUnit"
                                            />
                                        </div>
                                    </div>
                                )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-center">
                    <p className='text-sm text-slate-700 mb-2'>Total deck area: <b>{formatNumber(totalAreaM2)}</b> m² / <b>{formatNumber(getTotalAreaFt2())}</b> ft²</p>
                </div>
            </div>
            <div className='bg-white rounded-xl p-6 mb-4 shadow-lg border border-slate-200 w-full max-w-lg'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl font-semibold text-slate-800'>Amount of Stain</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Number of Coats</label>
                    <input
                        type="number"
                        value={state.coatsNumber}
                        onChange={handleNumberChange}
                        onFocus={(e) => handleFocus(state.coatsNumber, e)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                        name="coatsNumber"
                        min="0"
                        placeholder="Enter number of coats"
                    />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Coverage Factor</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={state.coverageFactor}
                            onChange={handleNumberChange}
                            onFocus={(e) => handleFocus(state.coverageFactor, e)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                            name="coverageFactor"
                            min="0"
                            placeholder="Enter coverage factor"
                        />
                        <UnitDropdown
                            value={state.coverageFactorUnit}
                            onChange={(e) => handleCoverageFactorUnitChange(e.target.value)}
                            unitValues={coverageFactorUnitValues}
                            className="w-28 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            name="coverageFactorUnit"
                        />
                    </div>
                    <p className="text-xs text-slate-500">Coverage factor is area per US gallon (e.g., 175 ft²/gal)</p>
                </div>
                <div className="flex items-center justify-between mb-6 mt-4">
                    <p className='text-sm text-slate-700 mb-2'>
                        Total amount of stain:
                        <b className='ml-1'>{formatNumber(totalStainGallons)}</b> US gal
                        (<b className='ml-1'>{formatNumber(totalStainLiters)}</b> L)
                    </p>
                </div>
                <div className="mt-4">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        <input type="checkbox"
                            name="isAreaSelected"
                            checked={state.isAreaSelected}
                            onChange={() => toggle('isAreaSelected')}
                        />
                        <span className='ml-2 text-black'>Show areas of each element</span>
                    </label>
                </div>
                <hr className='border-black opacity-10 m-8' />
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
    </div>
    )
}