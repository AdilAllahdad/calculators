'use client';

import { useState, useEffect } from 'react';

// Define the mix options
const mixOptions = [
  { value: 'concrete', label: 'concrete' },
  { value: 'cement_and_water', label: 'cement and water only' },
  { value: 'mortar', label: 'mortar' }
];

const concreteMixRatios = [
  { value: '1:5:10', label: '1:5:10 (5.0 MPa or 725 psi)' },
  { value: '1:4:8', label: '1:4:8 (7.5 MPa or 1085 psi)' },
  { value: '1:3:6', label: '1:3:6 (10.0 MPa or 1450 psi)' },
  { value: '1:2:4', label: '1:2:4 (15.0 MPa or 2175 psi)' },
  { value: '1:1.5:3', label: '1:1.5:3 (20.0 MPa or 2900 psi)' },
  { value: '1:1:2', label: '1:1:2 (25.0 MPa or 3625 psi)' },
  { value: '1:2:3', label: '1:2:3 (31.0 MPa or 4500 psi)' }
];

const mortarMixRatios = [
  { value: '1:2', label: '1:2 (Strong mortar)' },
  { value: '1:3', label: '1:3 (Standard mortar)' },
  { value: '1:4', label: '1:4 (For exterior plaster)' },
  { value: '1:5', label: '1:5 (Weak mortar)' },
  { value: '1:6', label: '1:6 (Basic mortar)' }
];

const volumeUnits = [
  { value: 'cubic-centimeters', label: 'cubic centimeters (cm³)' },
  { value: 'cubic-meters', label: 'cubic meters (m³)' },
  { value: 'cubic-feet', label: 'cubic feet (cu ft)' },
  { value: 'cubic-yards', label: 'cubic yards (cu yd)' },
  { value: 'milliliters', label: 'milliliters (ml)' },
  { value: 'liters', label: 'liters (l)' },
  { value: 'gallons-us', label: 'gallons (US) (US gal)' },
  { value: 'gallons-uk', label: 'gallons (UK) (UK gal)' }
];

const weightUnits = [
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'st', label: 'stones (st)' },
  { value: 't', label: 'metric tons (t)' },
  { value: 'us-ton', label: 'US short tons (US ton)' },
  { value: 'long-ton', label: 'imperial tons (long ton)' }
];

const densityUnits = [
  { value: 'kg/m3', label: 'kilograms per cubic meter (kg/m³)' },
  { value: 'lb/cuft', label: 'pounds per cubic feet (lb/cu ft)' },
  { value: 'lb/cuyd', label: 'pounds per cubic yard (lb/cu yd)' },
  { value: 'g/cm3', label: 'grams per cubic centimeter (g/cm³)' }
];

export default function CementCalculatorPage() {
  // Mix selection state
  const [selectedMix, setSelectedMix] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [mixExpanded, setMixExpanded] = useState(true);

  // Mix quantity states
  const [wetVolume, setWetVolume] = useState('20');
  const [wetVolumeUnit, setWetVolumeUnit] = useState('cubic-meters');
  const [isCustomRatio, setIsCustomRatio] = useState(false);
  const [customRatio, setCustomRatio] = useState('1.54');
  const [dryVolume, setDryVolume] = useState('20');
  const [dryVolumeUnit, setDryVolumeUnit] = useState('cubic-meters');
  const [waste, setWaste] = useState('10');
  const [totalVolume, setTotalVolume] = useState('22');

  // Cement needed states
  const [isCementExpanded, setIsCementExpanded] = useState(true);
  const [concreteMixRatio, setConcreteMixRatio] = useState('1:1.5:3');
  const [mortarMixRatio, setMortarMixRatio] = useState('1:3');
  const [volumeOfCement, setVolumeOfCement] = useState('');
  const [volumeOfCementUnit, setVolumeOfCementUnit] = useState('cubic-meters');
  const [cementDensity, setCementDensity] = useState('1440');
  const [cementDensityUnit, setCementDensityUnit] = useState('kg/m3');
  const [weightOfCement, setWeightOfCement] = useState('');
  const [weightOfCementUnit, setWeightOfCementUnit] = useState('kg');
  const [bagSize, setBagSize] = useState('50');
  const [bagSizeUnit, setBagSizeUnit] = useState('kg');
  const [bagsOfCement, setBagsOfCement] = useState('');

  // Other materials states
  const [isOtherMaterialsExpanded, setIsOtherMaterialsExpanded] = useState(true);
  const [volumeOfSand, setVolumeOfSand] = useState('');
  const [volumeOfSandUnit, setVolumeOfSandUnit] = useState('cubic-meters');
  const [volumeOfGravel, setVolumeOfGravel] = useState('');
  const [volumeOfGravelUnit, setVolumeOfGravelUnit] = useState('cubic-meters');
  const [weightOfWater, setWeightOfWater] = useState('');
  const [weightOfWaterUnit, setWeightOfWaterUnit] = useState('kg');
  const [volumeOfWater, setVolumeOfWater] = useState('');
  const [volumeOfWaterUnit, setVolumeOfWaterUnit] = useState('liters');

  // Material costs states
  const [isMaterialCostsExpanded, setIsMaterialCostsExpanded] = useState(true);
  const [priceOfCementPerBag, setPriceOfCementPerBag] = useState('');
  const [costOfCement, setCostOfCement] = useState('');
  const [priceOfSandPerVolume, setPriceOfSandPerVolume] = useState('');
  const [priceOfGravelPerVolume, setPriceOfGravelPerVolume] = useState('');
  const [totalCostOfConcreteMix, setTotalCostOfConcreteMix] = useState('');
  const [costOfConcretePerUnitVolume, setCostOfConcretePerUnitVolume] = useState('');

  // Add these state variables to track units
  const [pricePerVolumeUnit, setPricePerVolumeUnit] = useState('cubic-meters');
  const [costPerVolumeUnit, setCostPerVolumeUnit] = useState('cubic-meters');

  // Conversion utility functions
  const convertVolume = (value: string, fromUnit: string, toUnit: string): number => {
    if (!value || isNaN(parseFloat(value))) return 0;
    const val = parseFloat(value);
    
    // Conversion factors to cubic meters
    const toM3 = {
      'cubic-centimeters': 1e-6,
      'cubic-meters': 1,
      'cubic-feet': 0.0283168,
      'cubic-yards': 0.764555,
      'milliliters': 1e-6,
      'liters': 0.001,
      'gallons-us': 0.00378541,
      'gallons-uk': 0.00454609
    };
    
    // Convert to cubic meters first, then to target unit
    const m3Value = val * (toM3[fromUnit as keyof typeof toM3] || 1);
    const result = m3Value / (toM3[toUnit as keyof typeof toM3] || 1);
    
    return result;
  };

  const convertWeight = (value: string, fromUnit: string, toUnit: string): number => {
    if (!value || isNaN(parseFloat(value))) return 0;
    const val = parseFloat(value);
    
    // Conversion factors to kg
    const toKg = {
      'kg': 1,
      'lb': 0.453592,
      'st': 6.35029,
      't': 1000,
      'us-ton': 907.185,
      'long-ton': 1016.05
    };
    
    // Convert to kg first, then to target unit
    const kgValue = val * (toKg[fromUnit as keyof typeof toKg] || 1);
    const result = kgValue / (toKg[toUnit as keyof typeof toKg] || 1);
    
    return result;
  };

  const convertDensity = (value: string, fromUnit: string, toUnit: string): number => {
    if (!value || isNaN(parseFloat(value))) return 0;
    const val = parseFloat(value);
    
    // Conversion factors to kg/m3
    const toKgM3 = {
      'kg/m3': 1,
      'lb/cuft': 16.0185,
      'lb/cuyd': 0.593276,
      'g/cm3': 1000
    };
    
    // Convert to kg/m3 first, then to target unit
    const kgm3Value = val * (toKgM3[fromUnit as keyof typeof toKgM3] || 1);
    const result = kgm3Value / (toKgM3[toUnit as keyof typeof toKgM3] || 1);
    
    return result;
  };

  // Handle input changes
  const handleNumberInput = (value: string, setter: (value: string) => void) => {
    if (value === '' || /^(\d+\.?\d*|\.\d+)$/.test(value)) {
      setter(value);
    }
  };

  // Calculate volumes when inputs change
  useEffect(() => {
    // Calculate dry volume with different ratio for mortar
    const ratio = selectedMix === 'mortar'
      ? 1.22 // Fixed ratio for mortar
      : (isCustomRatio ? parseFloat(customRatio) || 1 : 1.54);

    const wetVolumeNum = parseFloat(wetVolume) || 0;
    const wetVolumeInM3 = convertVolume(wetVolume.toString(), wetVolumeUnit, 'cubic-meters');
    const calculatedDryVolume = (wetVolumeInM3 * ratio);
    setDryVolume(calculatedDryVolume.toFixed(2));

    // Calculate total volume with waste
    const wastePercent = parseFloat(waste) || 0;
    const calculatedTotalVolume = (wetVolumeInM3 * (1 + wastePercent / 100));
    setTotalVolume(calculatedTotalVolume.toFixed(2));
  }, [wetVolume, wetVolumeUnit, isCustomRatio, customRatio, waste, selectedMix]);

  // Calculate cement quantities
  useEffect(() => {
    if (selectedMix && dryVolume) {
      const dryVolumeNum = parseFloat(dryVolume) || 0;
      let cementRatio = 0;
      
      if (selectedMix === 'concrete') {
        const [cement, sand, gravel] = concreteMixRatio.split(':').map(Number);
        const totalParts = cement + sand + gravel;
        cementRatio = cement / totalParts;
      } else if (selectedMix === 'mortar') {
        const [cement, sand] = mortarMixRatio.split(':').map(Number);
        cementRatio = cement / (cement + sand);
      } else if (selectedMix === 'cement_and_water') {
        cementRatio = 1;
      }

      const calculatedVolumeOfCement = (dryVolumeNum * cementRatio);
      setVolumeOfCement(calculatedVolumeOfCement.toFixed(2));

      // Calculate weight of cement
      const density = parseFloat(cementDensity) || 1440;
      const densityInKgM3 = convertDensity(cementDensity.toString(), cementDensityUnit, 'kg/m3');
      const calculatedWeightOfCement = (calculatedVolumeOfCement * densityInKgM3);
      setWeightOfCement(calculatedWeightOfCement.toFixed(2));

      // Calculate bags of cement
      const bagSizeNum = parseFloat(bagSize) || 50;
      const bagSizeInKg = convertWeight(bagSize.toString(), bagSizeUnit, 'kg');
      const calculatedBags = (calculatedWeightOfCement / bagSizeInKg);
      setBagsOfCement(calculatedBags.toFixed(2));
    }
  }, [dryVolume, selectedMix, concreteMixRatio, mortarMixRatio, cementDensity, cementDensityUnit, bagSize, bagSizeUnit]);

  // Calculate other materials
  useEffect(() => {
    if (selectedMix && dryVolume) {
      const dryVolumeNum = parseFloat(dryVolume) || 0;
      
      if (selectedMix === 'concrete') {
        const [cement, sand, gravel] = concreteMixRatio.split(':').map(Number);
        const totalParts = cement + sand + gravel;
        
        const sandRatio = sand / totalParts;
        const gravelRatio = gravel / totalParts;
        
        const calculatedVolumeOfSand = (dryVolumeNum * sandRatio);
        const calculatedVolumeOfGravel = (dryVolumeNum * gravelRatio);
        
        setVolumeOfSand(calculatedVolumeOfSand.toFixed(2));
        setVolumeOfGravel(calculatedVolumeOfGravel.toFixed(2));
      } else if (selectedMix === 'mortar') {
        const [cement, sand] = mortarMixRatio.split(':').map(Number);
        const sandRatio = sand / (cement + sand);
        
        const calculatedVolumeOfSand = (dryVolumeNum * sandRatio);
        setVolumeOfSand(calculatedVolumeOfSand.toFixed(2));
        setVolumeOfGravel('0');
      } else if (selectedMix === 'cement_and_water') {
        setVolumeOfSand('0');
        setVolumeOfGravel('0');
      }

      // Calculate water quantities
      let waterWeight = 0;
      if (selectedMix === 'concrete') {
        // Typical water-cement ratio for concrete is 0.5
        const weightOfCementNum = parseFloat(weightOfCement) || 0;
        waterWeight = weightOfCementNum * 0.5;
      } else if (selectedMix === 'mortar') {
        // Typical water-cement ratio for mortar is 0.6
        const weightOfCementNum = parseFloat(weightOfCement) || 0;
        waterWeight = weightOfCementNum * 0.6;
      } else if (selectedMix === 'cement_and_water') {
        // Use custom ratio for cement and water
        const ratio = parseFloat(customRatio) || 0.5;
        const weightOfCementNum = parseFloat(weightOfCement) || 0;
        waterWeight = weightOfCementNum * ratio;
      }
      
      setWeightOfWater(waterWeight.toFixed(2));
      setVolumeOfWater(waterWeight.toFixed(2)); // 1kg water ≈ 1 liter
    }
  }, [dryVolume, selectedMix, concreteMixRatio, mortarMixRatio, weightOfCement, customRatio]);

  // Calculate material costs
  useEffect(() => {
    if (selectedMix) {
      // Calculate cost of cement
      const bags = parseFloat(bagsOfCement) || 0;
      const pricePerBag = parseFloat(priceOfCementPerBag) || 0;
      const calculatedCostOfCement = (bags * pricePerBag);
      setCostOfCement(calculatedCostOfCement.toFixed(2));

      let calculatedTotalCost = calculatedCostOfCement || 0;

      if (selectedMix === 'concrete' || selectedMix === 'mortar') {
        // Add sand cost
        const sandVolume = parseFloat(volumeOfSand) || 0;
        const sandVolumeInPriceUnit = convertVolume(volumeOfSand, volumeOfSandUnit, pricePerVolumeUnit);
        const priceOfSand = parseFloat(priceOfSandPerVolume) || 0;
        calculatedTotalCost += sandVolumeInPriceUnit * priceOfSand;

        if (selectedMix === 'concrete') {
          // Add gravel cost
          const gravelVolume = parseFloat(volumeOfGravel) || 0;
          const gravelVolumeInPriceUnit = convertVolume(volumeOfGravel, volumeOfGravelUnit, pricePerVolumeUnit);
          const priceOfGravel = parseFloat(priceOfGravelPerVolume) || 0;
          calculatedTotalCost += gravelVolumeInPriceUnit * priceOfGravel;
        }
      }

      setTotalCostOfConcreteMix(calculatedTotalCost.toFixed(2));

      // Calculate cost per unit volume
      const totalVolumeNum = parseFloat(totalVolume) || 1;
      const totalVolumeInCostUnit = convertVolume(totalVolume, wetVolumeUnit, costPerVolumeUnit);
      const calculatedCostPerUnitVolume = (calculatedTotalCost / totalVolumeInCostUnit);
      setCostOfConcretePerUnitVolume(calculatedCostPerUnitVolume.toFixed(2));
    }
  }, [
    selectedMix,
    bagsOfCement,
    priceOfCementPerBag,
    volumeOfSand,
    volumeOfSandUnit,
    priceOfSandPerVolume,
    volumeOfGravel,
    volumeOfGravelUnit,
    priceOfGravelPerVolume,
    totalVolume,
    wetVolumeUnit,
    pricePerVolumeUnit,
    costPerVolumeUnit
  ]);

  // Convert display values when units change
  useEffect(() => {
    if (volumeOfCement) {
      const displayValue = convertVolume(volumeOfCement, 'cubic-meters', volumeOfCementUnit);
      setVolumeOfCement(displayValue.toFixed(2));
    }
  }, [volumeOfCementUnit]);

  useEffect(() => {
    if (volumeOfSand) {
      const displayValue = convertVolume(volumeOfSand, 'cubic-meters', volumeOfSandUnit);
      setVolumeOfSand(displayValue.toFixed(2));
    }
  }, [volumeOfSandUnit]);

  useEffect(() => {
    if (volumeOfGravel) {
      const displayValue = convertVolume(volumeOfGravel, 'cubic-meters', volumeOfGravelUnit);
      setVolumeOfGravel(displayValue.toFixed(2));
    }
  }, [volumeOfGravelUnit]);

  useEffect(() => {
    if (volumeOfWater) {
      const displayValue = convertVolume(volumeOfWater, 'liters', volumeOfWaterUnit);
      setVolumeOfWater(displayValue.toFixed(2));
    }
  }, [volumeOfWaterUnit]);

  useEffect(() => {
    if (weightOfCement) {
      const displayValue = convertWeight(weightOfCement, 'kg', weightOfCementUnit);
      setWeightOfCement(displayValue.toFixed(2));
    }
  }, [weightOfCementUnit]);

  useEffect(() => {
    if (weightOfWater) {
      const displayValue = convertWeight(weightOfWater, 'kg', weightOfWaterUnit);
      setWeightOfWater(displayValue.toFixed(2));
    }
  }, [weightOfWaterUnit]);

  const handleClearCalculator = () => {
    setWetVolume('20');
    setDryVolume('20');
    setWaste('10');
    setTotalVolume('22');
    setVolumeOfCement('');
    setWeightOfCement('');
    setBagsOfCement('');
    setVolumeOfSand('');
    setVolumeOfGravel('');
    setWeightOfWater('');
    setVolumeOfWater('');
    setPriceOfCementPerBag('');
    setCostOfCement('');
    setPriceOfSandPerVolume('');
    setPriceOfGravelPerVolume('');
    setTotalCostOfConcreteMix('');
    setCostOfConcretePerUnitVolume('');
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Add a handler for when changing concrete mix ratio
  const handleConcreteMixRatioChange = (newRatio: string) => {
    setConcreteMixRatio(newRatio);
    
    // Recalculate volumes based on new ratio
    if (selectedMix === 'concrete' && dryVolume) {
      const dryVolumeNum = parseFloat(dryVolume) || 0;
      const [cement, sand, gravel] = newRatio.split(':').map(Number);
      const totalParts = cement + sand + gravel;
      
      const cementRatio = cement / totalParts;
      const sandRatio = sand / totalParts;
      const gravelRatio = gravel / totalParts;
      
      setVolumeOfCement((dryVolumeNum * cementRatio).toFixed(2));
      setVolumeOfSand((dryVolumeNum * sandRatio).toFixed(2));
      setVolumeOfGravel((dryVolumeNum * gravelRatio).toFixed(2));
    }
  };

  // Add a handler for mortar mix ratio change
  const handleMortarMixRatioChange = (newRatio: string) => {
    setMortarMixRatio(newRatio);
    
    // Recalculate volumes based on new ratio
    if (selectedMix === 'mortar' && dryVolume) {
      const dryVolumeNum = parseFloat(dryVolume) || 0;
      const [cement, sand] = newRatio.split(':').map(Number);
      const totalParts = cement + sand;
      
      const cementRatio = cement / totalParts;
      const sandRatio = sand / totalParts;
      
      setVolumeOfCement((dryVolumeNum * cementRatio).toFixed(2));
      setVolumeOfSand((dryVolumeNum * sandRatio).toFixed(2));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Mix Selection Section */}
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-600 font-medium mb-4"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} inline-block mr-2`}>
              ∧
            </span>
            What do you want to mix?
          </button>

          {isExpanded && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  I want to mix..
                </label>
                <div className="relative">
                  <select
                    value={selectedMix}
                    onChange={(e) => setSelectedMix(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                  >
                    <option value="" disabled>Select</option>
                    {mixOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {selectedMix && (
                <div className="mt-6">
                  {/* Mix Quantity Section */}
                  <div className="mb-6">
                    <button
                      onClick={() => setMixExpanded(!mixExpanded)}
                      className="flex items-center text-blue-600 font-medium mb-4"
                    >
                      <span className={`transform transition-transform ${mixExpanded ? 'rotate-180' : ''} inline-block mr-2`}>
                        ∧
                      </span>
                      Mix quantity
                    </button>

                    {mixExpanded && (
                      <div className="space-y-4">
                        {/* Wet volume */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Wet volume
                            <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Volume after mixing">ℹ</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={wetVolume}
                              onChange={(e) => handleNumberInput(e.target.value, setWetVolume)}
                              placeholder="Enter volume"
                              className="flex-1 p-2 border border-gray-300 rounded-md text-left text-gray-600"
                            />
                            <div className="relative w-32">
                              <select
                                value={wetVolumeUnit}
                                onChange={(e) => setWetVolumeUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                              >
                                {volumeUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dry volume to wet volume ratio */}
                        {selectedMix === 'mortar' ? (
                          <div>
                            <label className="flex text-sm text-gray-600 mb-2 items-center">
                              Dry volume to wet volume for mortar
                              <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                title="Ratio of dry materials to final volume">ℹ</span>
                            </label>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="ratio-1.22"
                                  checked={!isCustomRatio}
                                  onChange={() => {
                                    setIsCustomRatio(false);
                                    setCustomRatio('1.22');
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="ratio-1.22" className="text-gray-700">1.22 :1</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="custom-ratio"
                                  checked={isCustomRatio}
                                  onChange={() => setIsCustomRatio(true)}
                                  className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="custom-ratio" className="text-gray-700">custom :1</label>
                              </div>

                              {isCustomRatio && (
                                <div className="mt-4">
                                  <label className="block text-sm text-gray-600 mb-2 flex items-center">
                                    Dry to wet volume for mortar
                                    <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                      title="Ratio of dry materials to wet volume">ℹ</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={customRatio}
                                      onChange={(e) => handleNumberInput(e.target.value, setCustomRatio)}
                                      placeholder="Enter ratio"
                                      className="w-full p-2 pr-8 border border-gray-300 rounded-md text-gray-600"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                      :1
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : selectedMix === 'cement_and_water' ? (
                          <div className="space-y-4">
                            {/* Water to cement ratio */}
                            <div>
                              <label className="flex text-sm text-gray-600 mb-2 items-center">
                                Water to cement ratio
                                <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                  title="Ratio of water to cement">ℵ</span>
                              </label>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    id="ratio-0.5"
                                    checked={!isCustomRatio}
                                    onChange={() => {
                                      setIsCustomRatio(false);
                                      setCustomRatio('0.5');
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                  />
                                  <label htmlFor="ratio-0.5" className="text-gray-700">0.5 :1</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    id="custom-water-ratio"
                                    checked={isCustomRatio}
                                    onChange={() => setIsCustomRatio(true)}
                                    className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                  />
                                  <label htmlFor="custom-water-ratio" className="text-gray-700">custom :1</label>
                                </div>

                                {isCustomRatio && (
                                  <div className="mt-4">
                                    <label className="block text-sm text-gray-600 mb-2 flex items-center">
                                      Custom water to cement ratio
                                      <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                        title="Enter your custom water to cement ratio">ℵ</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={customRatio}
                                        onChange={(e) => handleNumberInput(e.target.value, setCustomRatio)}
                                        placeholder="Enter ratio"
                                        className="w-full p-2 pr-8 border border-gray-300 rounded-md text-gray-600"
                                      />
                                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                        :1
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="flex text-sm text-gray-600 mb-2 items-center">
                              Dry volume to wet volume ratio
                              <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Ratio of dry materials to final volume">ℵ</span>
                            </label>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="ratio-1.54"
                                  checked={!isCustomRatio}
                                  onChange={() => {
                                    setIsCustomRatio(false);
                                    setCustomRatio('1.54');
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="ratio-1.54" className="text-gray-700">1.54 :1</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="custom-ratio"
                                  checked={isCustomRatio}
                                  onChange={() => setIsCustomRatio(true)}
                                  className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="custom-ratio" className="text-gray-700">custom :1</label>
                              </div>

                              {isCustomRatio && (
                                <div className="mt-4">
                                  <label className="block text-sm text-gray-600 mb-2 flex items-center">
                                    Dry to wet volume for concrete
                                    <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Ratio of dry materials to wet volume">ℵ</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={customRatio}
                                      onChange={(e) => handleNumberInput(e.target.value, setCustomRatio)}
                                      placeholder="Enter ratio"
                                      className="w-full p-2 pr-8 border border-gray-300 rounded-md text-gray-600"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                      :1
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Dry volume */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Dry volume
                            <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Volume of dry materials needed">ℵ</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={dryVolume}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                            />
                            <div className="relative w-32">
                              <select
                                value={dryVolumeUnit}
                                onChange={(e) => setDryVolumeUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                              >
                                {volumeUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Waste */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Waste
                            <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Additional material to account for waste">ℵ</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={waste}
                                onChange={(e) => handleNumberInput(e.target.value, setWaste)}
                                placeholder="Enter percentage"
                                className="w-full p-2 border border-gray-300 rounded-md text-left text-gray-600 pr-8"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                %
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Total volume */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Total volume
                            <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Total volume including waste">ℵ</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={totalVolume}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                            />
                            <div className="relative w-32">
                              <select
                                value={wetVolumeUnit}
                                onChange={(e) => setWetVolumeUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                              >
                                {volumeUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cement needed section */}
                  <div className="mt-8">
                    <button
                      onClick={() => setIsCementExpanded(!isCementExpanded)}
                      className="flex items-center text-blue-600 font-medium mb-4"
                    >
                      <span className={`transform transition-transform ${isCementExpanded ? 'rotate-180' : ''} inline-block mr-2`}>
                        ∧
                      </span>
                      Cement needed
                    </button>

                    {isCementExpanded && (
                      <div className="space-y-6">
                        {selectedMix === 'mortar' ? (
                          <>
                            {/* Mortar mix ratio */}
                            <div>
                              <label className="flex text-sm text-gray-600 mb-2 items-center">
                                Mortar mix ratio
                                <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                  title="Ratio of cement to sand">ℹ</span>
                              </label>
                              <div className="relative">
                                <select
                                  value={mortarMixRatio}
                                  onChange={(e) => handleMortarMixRatioChange(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                                >
                                  {mortarMixRatios.map(ratio => (
                                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : selectedMix === 'cement_and_water' ? (
                          <>
                            {/* No ratio selection for cement and water */}
                          </>
                        ) : (
                          <>
                            {/* Concrete mix ratio */}
                            <div>
                              <label className="flex text-sm text-gray-600 mb-2 items-center">
                                Concrete mix ratio
                                <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                  title="Ratio of cement:sand:aggregate">ℹ</span>
                              </label>
                              <div className="relative">
                                <select
                                  value={concreteMixRatio}
                                  onChange={(e) => handleConcreteMixRatioChange(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-gray-800"
                                >
                                  {concreteMixRatios.map(ratio => (
                                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Volume of cement */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Volume of cement
                            <span className="ml-1 text-blue-600">✓</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={volumeOfCement}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                            />
                            <div className="relative w-40">
                              <select
                                value={volumeOfCementUnit}
                                onChange={(e) => setVolumeOfCementUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                              >
                                {volumeUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cement density */}
                        <div>
                          <div className="flex justify-between items-center">
                            <label className="flex text-sm text-gray-600 mb-2 items-center">
                              Cement density
                              <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Density of cement">ℵ</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cementDensity}
                              onChange={(e) => handleNumberInput(e.target.value, setCementDensity)}
                              className="flex-1 p-2 border border-gray-300 rounded-md text-left text-gray-600"
                            />
                            <div className="relative w-56">
                              <select
                                value={cementDensityUnit}
                                onChange={(e) => setCementDensityUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                              >
                                {densityUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Weight of cement */}
                        <div>
                          <div className="flex justify-between items-center">
                            <label className="flex text-sm text-gray-600 mb-2 items-center">
                              Weight of cement
                              <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Weight of cement needed">ℵ</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={weightOfCement}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                            />
                            <div className="relative w-48">
                              <select
                                value={weightOfCementUnit}
                                onChange={(e) => setWeightOfCementUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                              >
                                {weightUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bag size */}
                        <div>
                          <div className="flex justify-between items-center">
                            <label className="flex text-sm text-gray-600 mb-2 items-center">
                              Bag size
                              <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Size of cement bag">ℵ</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bagSize}
                              onChange={(e) => handleNumberInput(e.target.value, setBagSize)}
                              className="flex-1 p-2 border border-gray-300 rounded-md text-left text-gray-600"
                            />
                            <div className="relative w-40">
                              <select
                                value={bagSizeUnit}
                                onChange={(e) => setBagSizeUnit(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                              >
                                <option value="kg">kilograms (kg)</option>
                                <option value="lb">pounds (lb)</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bags of cement needed */}
                        <div>
                          <label className="flex text-sm text-gray-600 mb-2 items-center">
                            Bags of cement needed
                            <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Number of cement bags needed">ℵ</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={bagsOfCement}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                            />
                            <span className="p-2 text-gray-600">bags</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Other materials needed for the mix */}
                  <div className="mt-8">
                    <button
                      onClick={() => setIsOtherMaterialsExpanded(!isOtherMaterialsExpanded)}
                      className="flex items-center text-blue-600 font-medium mb-4"
                    >
                      <span className={`transform transition-transform ${isOtherMaterialsExpanded ? 'rotate-180' : ''} inline-block mr-2`}>
                        ∧
                      </span>
                      Other materials needed for the mix
                    </button>
                    {isOtherMaterialsExpanded && (
                      <div className="space-y-6">
                        {selectedMix === 'cement_and_water' ? (
                          <>
                            {/* Weight of water */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2">
                                Weight of water
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={weightOfWater}
                                  readOnly
                                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                />
                                <div className="relative w-48">
                                  <select
                                    value={weightOfWaterUnit}
                                    onChange={(e) => setWeightOfWaterUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                  >
                                    {weightUnits.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Volume of water */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Volume of water <span className="ml-1">💧</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={volumeOfWater}
                                  readOnly
                                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                />
                                <div className="relative w-48">
                                  <select
                                    value={volumeOfWaterUnit}
                                    onChange={(e) => setVolumeOfWaterUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                  >
                                    {volumeUnits.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Volume of sand */}
                            {selectedMix !== 'cement_and_water' && (
                              <div>
                                <label className="text-sm text-gray-600 mb-2 flex items-center">
                                  Volume of sand
                                  <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Volume of sand needed">ℵ</span>
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={volumeOfSand}
                                    readOnly
                                    className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                  <div className="relative w-48">
                                    <select
                                      value={volumeOfSandUnit}
                                      onChange={(e) => setVolumeOfSandUnit(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                    >
                                      {volumeUnits.map(unit => (
                                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Volume of gravel */}
                            {selectedMix === 'concrete' && (
                              <div>
                                <label className="text-sm text-gray-600 mb-2 flex items-center">
                                  Volume of gravel
                                  <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="Volume of gravel needed">ℵ</span>
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={volumeOfGravel}
                                    readOnly
                                    className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                  <div className="relative w-48">
                                    <select
                                      value={volumeOfGravelUnit}
                                      onChange={(e) => setVolumeOfGravelUnit(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                    >
                                      {volumeUnits.map(unit => (
                                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Weight of water */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2">
                                Weight of water
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={weightOfWater}
                                  readOnly
                                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                />
                                <div className="relative w-48">
                                  <select
                                    value={weightOfWaterUnit}
                                    onChange={(e) => setWeightOfWaterUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                  >
                                    {weightUnits.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Volume of water */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Volume of water <span className="ml-1">💧</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={volumeOfWater}
                                  readOnly
                                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                />
                                <div className="relative w-48">
                                  <select
                                    value={volumeOfWaterUnit}
                                    onChange={(e) => setVolumeOfWaterUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                  >
                                    {volumeUnits.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Material costs section */}
                  <div className="mt-8">
                    <button
                      onClick={() => setIsMaterialCostsExpanded(!isMaterialCostsExpanded)}
                      className="flex items-center text-blue-600 font-medium mb-4"
                    >
                      <span className={`transform transition-transform ${isMaterialCostsExpanded ? 'rotate-180' : ''} inline-block mr-2`}>
                        ∧
                      </span>
                      Material costs
                    </button>
                    {isMaterialCostsExpanded && (
                      <div className="space-y-6">
                        {selectedMix === 'cement_and_water' ? (
                          <>
                            {/* For cement_and_water, only show these two fields */}
                            {/* Price of cement per bag */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Price of cement per bag
                                <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help">⋯</span>
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="text"
                                    value={priceOfCementPerBag}
                                    onChange={(e) => handleNumberInput(e.target.value, setPriceOfCementPerBag)}
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-100 text-left text-gray-600"
                                    placeholder="Enter price"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/bag</span>
                                </div>
                              </div>
                            </div>

                            {/* Cost of cement */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Cost of cement
                                <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help">⋯</span>
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="number"
                                    value={costOfCement}
                                    readOnly
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Original fields for concrete and mortar */}
                            {/* Price of cement per bag */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Price of cement per bag
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="text"
                                    value={priceOfCementPerBag}
                                    onChange={(e) => handleNumberInput(e.target.value, setPriceOfCementPerBag)}
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-100 text-left text-gray-600"
                                    placeholder="Enter price"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/bag</span>
                                </div>
                              </div>
                            </div>

                            {/* Cost of cement */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Cost of cement
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="number"
                                    value={costOfCement}
                                    readOnly
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Price of sand per volume - only show for concrete and mortar */}
                            {(selectedMix === 'concrete' || selectedMix === 'mortar') && (
                              <div>
                                <label className="text-sm text-gray-600 mb-2 flex items-center">
                                  Price of sand per volume
                                </label>
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                    <input
                                      type="text"
                                      value={priceOfSandPerVolume}
                                      onChange={(e) => handleNumberInput(e.target.value, setPriceOfSandPerVolume)}
                                      className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-100 text-left text-gray-600"
                                      placeholder="Enter price"
                                    />
                                  </div>
                                  <div className="relative w-40">
                                    <select
                                      value={pricePerVolumeUnit}
                                      onChange={(e) => setPricePerVolumeUnit(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                    >
                                      {volumeUnits.map(unit => (
                                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                                      ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Price of gravel per volume - only show for concrete */}
                            {selectedMix === 'concrete' && (
                              <div>
                                <label className="text-sm text-gray-600 mb-2 flex items-center">
                                  Price of gravel per volume
                                </label>
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                    <input
                                      type="text"
                                      value={priceOfGravelPerVolume}
                                      onChange={(e) => handleNumberInput(e.target.value, setPriceOfGravelPerVolume)}
                                      className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-100 text-left text-gray-600"
                                      placeholder="Enter price"
                                    />
                                  </div>
                                  <div className="relative w-40">
                                    <select
                                      value={pricePerVolumeUnit}
                                      onChange={(e) => setPricePerVolumeUnit(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                    >
                                      {volumeUnits.map(unit => (
                                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                                      ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Total cost */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Total cost
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="number"
                                    value={totalCostOfConcreteMix}
                                    readOnly
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Cost per unit volume */}
                            <div>
                              <label className="text-sm text-gray-600 mb-2 flex items-center">
                                Cost per unit volume
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
                                  <input
                                    type="number"
                                    value={costOfConcretePerUnitVolume}
                                    readOnly
                                    className="w-full p-2 pl-12 border border-gray-300 rounded-md bg-gray-50 text-left text-gray-600"
                                  />
                                </div>
                                <div className="relative w-40">
                                  <select
                                    value={costPerVolumeUnit}
                                    onChange={(e) => setCostPerVolumeUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-blue-600"
                                  >
                                    {volumeUnits.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Add these buttons at the bottom of the Material costs section */}
                        <div className="flex gap-4 mt-8">
                          <button
                            onClick={handleClearCalculator}
                            className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            Clear all calculations
                          </button>
                          <button
                            onClick={handleReload}
                            className="flex-1 p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            Reload calculator
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}