"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useUnitChangeHandler } from './useUnitChangeHandler';
import FormSelector from './FormSelector';
import DimensionsForm from './DimensionsForm';
import UnitDropdown from '@/components/UnitDropdown';
import { convertUnit } from '@/lib/convert-units-wrapper';

// Define available concrete forms
const CONCRETE_FORMS = [
  { id: 'slab', name: 'Slab', image: '/slab.png' },
  { id: 'wall', name: 'Wall', image: '/wall.png' },
  { id: 'footer', name: 'Footer', image: '/footer.png' },
  { id: 'column', name: 'Column', image: '/column.png' },
  { id: 'curb', name: 'Curb', image: '/concrete-curb.png' },
  { id: 'stairs', name: 'Stairs', image: '/stairs.png' },
];

const DEFAULT_FORM = CONCRETE_FORMS[0].id;

const ConcreteCalculatorPage: React.FC = () => {
  // Form selection
  const [selectedForm, setSelectedForm] = useState<string>(DEFAULT_FORM);

  // Dimension states
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [flagThickness, setFlagThickness] = useState('');
  const [gutterWidth, setGutterWidth] = useState('');
  const [quantity, setQuantity] = useState('');

  // Unit states
  const [lengthUnit, setLengthUnit] = useState('m');
  const [widthUnit, setWidthUnit] = useState('m');
  const [heightUnit, setHeightUnit] = useState('m');
  const [areaUnit, setAreaUnit] = useState('m2');
  const [volumeUnit, setVolumeUnit] = useState('m3');

  // Pre-mixed concrete states
  const [density, setDensity] = useState('2400');
  const [densityUnit, setDensityUnit] = useState('kg/m3');
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [bagSize, setBagSize] = useState('25');
  const [bagUnit, setBagUnit] = useState('kg');
  const [waste, setWaste] = useState('0');
  const [bagsNeeded, setBagsNeeded] = useState(0);

  // Results
  const [area, setArea] = useState(0);
  const [volume, setVolume] = useState(0);

  // Cost section states
  const [costPerBag, setCostPerBag] = useState('');
  const [costPerSlab, setCostPerSlab] = useState('');
  const [costPerUnitArea, setCostPerUnitArea] = useState('');
  const [costPerUnitAreaUnit, setCostPerUnitAreaUnit] = useState('m2');
  const [costPerUnitVolume, setCostPerUnitVolume] = useState('');
  const [costPerUnitVolumeUnit, setCostPerUnitVolumeUnit] = useState('m3');
  const [totalCost, setTotalCost] = useState('');

  // Handlers for cost unit changes (with conversion)
  const handleCostPerUnitAreaUnitChange = useCallback((newUnit: string) => {
    if (costPerUnitArea === '' || isNaN(Number(costPerUnitArea))) {
      setCostPerUnitAreaUnit(newUnit);
      return;
    }
    const numericValue = parseFloat(costPerUnitArea);
    // Get the conversion factor from old unit to new unit
    const factor = convertUnit(1, costPerUnitAreaUnit, newUnit);
    const valueInNewUnit = factor !== 0 ? numericValue / factor : numericValue;
    setCostPerUnitArea(valueInNewUnit === 0 ? '' : valueInNewUnit.toString());
    setCostPerUnitAreaUnit(newUnit);
  }, [costPerUnitArea, costPerUnitAreaUnit]);

  const handleCostPerUnitVolumeUnitChange = useCallback((newUnit: string) => {
    if (costPerUnitVolume === '' || isNaN(Number(costPerUnitVolume))) {
      setCostPerUnitVolumeUnit(newUnit);
      return;
    }
    const numericValue = parseFloat(costPerUnitVolume);
    // Get the conversion factor from old unit to new unit
    const factor = convertUnit(1, costPerUnitVolumeUnit, newUnit);
    const valueInNewUnit = factor !== 0 ? numericValue / factor : numericValue;
    setCostPerUnitVolume(valueInNewUnit === 0 ? '' : valueInNewUnit.toString());
    setCostPerUnitVolumeUnit(newUnit);
  }, [costPerUnitVolume, costPerUnitVolumeUnit]);

  // Auto-calculate costs when cost per bag changes
  useEffect(() => {
    const bagCount = bagsNeeded;
    const areaVal = area;
    const volumeVal = volume;
    const bagCost = parseFloat(costPerBag);
    if (!isNaN(bagCost) && bagCost > 0 && bagCount > 0) {
      // Cost per slab (if quantity is available)
      setCostPerSlab(quantity && Number(quantity) > 0 ? (bagCost * bagCount / Number(quantity)).toFixed(2) : '');
      // Cost per unit area
      setCostPerUnitArea(areaVal > 0 ? (bagCost * bagCount / areaVal).toFixed(2) : '');
      // Cost per unit volume
      setCostPerUnitVolume(volumeVal > 0 ? (bagCost * bagCount / volumeVal).toFixed(2) : '');
      // Total cost
      setTotalCost((bagCost * bagCount).toFixed(2));
    } else {
      setCostPerSlab('');
      setCostPerUnitArea('');
      setCostPerUnitVolume('');
      setTotalCost('');
    }
  }, [costPerBag, bagsNeeded, area, volume, quantity]);

  // Handlers for unit changes
  const handleLengthUnitChange = useUnitChangeHandler(length, setLength, lengthUnit, setLengthUnit);
  const handleWidthUnitChange = useUnitChangeHandler(width, setWidth, widthUnit, setWidthUnit);
  const handleHeightUnitChange = useUnitChangeHandler(height, setHeight, heightUnit, setHeightUnit);

  // Generic input handler
  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value),
    []
  );

  // Reset dimension fields when form changes
  useEffect(() => {
    setLength('');
    setWidth('');
    setHeight('');
    setFlagThickness('');
    setGutterWidth('');
    setQuantity('');
  }, [selectedForm]);

  // Calculate area and volume
  useEffect(() => {
    // Parse input strings to numbers, defaulting to 0 if empty
    const lengthVal = length === '' ? 0 : parseFloat(length);
    const widthVal = width === '' ? 0 : parseFloat(width);
    const heightVal = height === '' ? 0 : parseFloat(height);
    const quantityVal = quantity === '' ? 0 : parseFloat(quantity);
    const lengthInMeters = convertUnit(lengthVal, lengthUnit, 'm');
    const widthInMeters = convertUnit(widthVal, widthUnit, 'm');
    const heightInMeters = convertUnit(heightVal, heightUnit, 'm');
    let calculatedArea = 0;
    let calculatedVolume = 0;
    switch (selectedForm) {
      case 'slab':
      case 'wall':
      case 'footer':
        calculatedArea = lengthInMeters * widthInMeters;
        calculatedVolume = lengthInMeters * widthInMeters * heightInMeters;
        break;
      case 'column': {
        const radius = widthInMeters / 2;
        calculatedArea = Math.PI * radius * radius;
        calculatedVolume = calculatedArea * heightInMeters;
        break;
      }
      case 'curb': {
        const flagThicknessMeters = flagThickness ? convertUnit(parseFloat(flagThickness), heightUnit, 'm') : 0;
        const gutterWidthMeters = gutterWidth ? convertUnit(parseFloat(gutterWidth), widthUnit, 'm') : 0;
        calculatedArea = lengthInMeters * heightInMeters;
        calculatedVolume = lengthInMeters * widthInMeters * heightInMeters;
        if (flagThicknessMeters > 0) {
          calculatedVolume += lengthInMeters * gutterWidthMeters * flagThicknessMeters;
        }
        break;
      }
      case 'stairs':
        calculatedArea = lengthInMeters * widthInMeters;
        calculatedVolume = lengthInMeters * widthInMeters * heightInMeters / 2;
        break;
      default:
        calculatedArea = 0;
        calculatedVolume = 0;
    }
    calculatedArea *= quantityVal;
    calculatedVolume *= quantityVal;
    const finalArea = convertUnit(calculatedArea, 'm2', areaUnit);
    const finalVolume = convertUnit(calculatedVolume, 'm3', volumeUnit);
    setArea(Math.round(finalArea * 100) / 100);
    setVolume(Math.round(finalVolume * 100) / 100);
  }, [length, width, height, lengthUnit, widthUnit, heightUnit, quantity, selectedForm, flagThickness, gutterWidth, areaUnit, volumeUnit]);

  // Calculate weight and bags needed
  useEffect(() => {
    const volM3 = convertUnit(Number(volume), volumeUnit, 'm3');
    const densKgM3 = convertUnit(Number(density), densityUnit, 'kg/m3');
    let totalWeight = volM3 * densKgM3;
    const wastePercent = waste === '' ? 0 : parseFloat(waste);
    totalWeight = totalWeight * (1 + wastePercent / 100);
    const totalWeightDisplay = convertUnit(totalWeight, 'kg', weightUnit);
    setWeight(Number(totalWeightDisplay.toFixed(2)));
    const bagSizeVal = bagSize === '' ? 1 : parseFloat(bagSize);
    const bagSizeKg = convertUnit(bagSizeVal, bagUnit, 'kg');
    setBagsNeeded(bagSizeKg > 0 ? Math.ceil(totalWeight / bagSizeKg) : 0);
  }, [volume, volumeUnit, density, densityUnit, weightUnit, bagSize, bagUnit, waste]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Concrete Calculator</h1>
      <p className="mb-6 text-gray-600">
        Calculate the exact amount of concrete needed for your project by entering the dimensions.
      </p>
      <FormSelector
        selectedForm={selectedForm}
        setSelectedForm={setSelectedForm}
        CONCRETE_FORMS={CONCRETE_FORMS}
      />
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Dimensions</h2>
        <DimensionsForm
          selectedForm={selectedForm}
          length={length}
          setLength={setLength}
          width={width}
          setWidth={setWidth}
          height={height}
          setHeight={setHeight}
          flagThickness={flagThickness}
          setFlagThickness={setFlagThickness}
          gutterWidth={gutterWidth}
          setGutterWidth={setGutterWidth}
          lengthUnit={lengthUnit}
          handleLengthUnitChange={handleLengthUnitChange}
          widthUnit={widthUnit}
          handleWidthUnitChange={handleWidthUnitChange}
          heightUnit={heightUnit}
          handleHeightUnitChange={handleHeightUnitChange}
          handleInputChange={handleInputChange}
        />
        {/* Quantity input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Quantity</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange(setQuantity)}
              className="flex-1 border border-slate-300 rounded px-4 py-2"
              min="0"
            />
            <div className="w-24 border border-slate-300 rounded px-4 py-2 bg-gray-50 text-center">
              pieces
            </div>
          </div>
        </div>
        {/* Results - Total area */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Total area</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={area.toString()}
              readOnly
              className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50"
            />
            <UnitDropdown
              value={areaUnit}
              onChange={e => setAreaUnit(e.target.value)}
              unitType="area"
              className="w-24"
            />
          </div>
        </div>
        {/* Results - Volume */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Volume</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={volume.toString()}
              readOnly
              className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50"
            />
            <UnitDropdown
              value={volumeUnit}
              onChange={e => setVolumeUnit(e.target.value)}
              unitType="volume"
              className="w-24"
            />
          </div>
        </div>
      </div>
      {/* Pre-mixed concrete section */}
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Pre-mixed concrete</h2>
        </div>
        {/* Density */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Density <span title="Check your bag for the correct value">&#9432;</span></label>
          <div className="flex gap-2">
            <input
              type="number"
              value={density}
              onChange={e => setDensity(e.target.value)}
              className="flex-1 border border-slate-300 rounded px-4 py-2"
              min="0"
            />
            <UnitDropdown
              value={densityUnit}
              onChange={e => {
                if (density === '' || isNaN(Number(density))) {
                  setDensityUnit(e.target.value);
                  return;
                }
                const numericValue = parseFloat(density);
                const converted = convertUnit(numericValue, densityUnit, e.target.value);
                setDensity(converted === 0 ? '' : converted.toString());
                setDensityUnit(e.target.value);
              }}
              unitValues={['kg/m3', 'lb/ft3', 'lb/yd3', 'g/cm3']}
              unitMap={{'kg/m3':'kg/m3','lb/ft3':'lb/ft3','lb/yd3':'lb/yd3','g/cm3':'g/cm3'}}
              className="w-24"
            />
          </div>
        </div>
        {/* Weight */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Weight</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={weight}
              readOnly
              className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50"
            />
            <UnitDropdown
              value={weightUnit}
              onChange={e => setWeightUnit(e.target.value)}
              unitValues={['kg', 't', 'lb', 'st', 'US ton', 'long ton']}
              className="w-24"
            />
          </div>
        </div>
        {/* Bag size */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bag size <span title="Check your bag for the correct value">&#9432;</span></label>
          <div className="flex gap-2">
            <input
              type="number"
              value={bagSize}
              onChange={e => setBagSize(e.target.value)}
              className="flex-1 border border-slate-300 rounded px-4 py-2"
              min="1"
            />
            <UnitDropdown
              value={bagUnit}
              onChange={e => {
                if (bagSize === '' || isNaN(Number(bagSize))) {
                  setBagUnit(e.target.value);
                  return;
                }
                const numericValue = parseFloat(bagSize);
                const converted = convertUnit(numericValue, bagUnit, e.target.value);
                setBagSize(converted === 0 ? '' : converted.toString());
                setBagUnit(e.target.value);
              }}
              unitValues={['kg', 'lb']}
              className="w-24"
            />
          </div>
        </div>
        {/* Waste */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Waste <span title="Add extra for spillage, etc.">&#9432;</span></label>
          <div className="flex gap-2">
            <input
              type="number"
              value={waste}
              onChange={e => setWaste(e.target.value)}
              className="flex-1 border border-slate-300 rounded px-4 py-2"
              min="0"
              max="100"
            />
            <div className="w-24 border border-slate-300 rounded px-4 py-2 bg-gray-50 text-center">%</div>
          </div>
        </div>
        {/* Bags needed */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bags needed</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={bagsNeeded}
              readOnly
              className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50"
            />
          </div>
        </div>
      </div>

      {/* Costs section */}
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Costs</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cost per bag</label>
          <div className="flex gap-2">
            <input type="number" className="flex-1 border border-slate-300 rounded px-4 py-2" placeholder="PKR" min="0" value={costPerBag} onChange={e => setCostPerBag(e.target.value)} />
            <div className="w-24 border border-slate-300 rounded px-4 py-2 bg-gray-50 text-center">/bag</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cost per slab</label>
          <div className="flex gap-2">
            <input type="number" className="flex-1 border border-slate-300 rounded px-4 py-2" placeholder="PKR" min="0" value={costPerSlab} onChange={e => setCostPerSlab(e.target.value)} />
            <div className="w-24 border border-slate-300 rounded px-4 py-2 bg-gray-50 text-center">/piece</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cost per unit area</label>
          <div className="flex gap-2">
            <input type="number" className="flex-1 border border-slate-300 rounded px-4 py-2" placeholder="PKR" min="0" value={costPerUnitArea} onChange={e => setCostPerUnitArea(e.target.value)} />
            <UnitDropdown
              value={costPerUnitAreaUnit}
              onChange={e => handleCostPerUnitAreaUnitChange(e.target.value)}
              unitValues={['cm2', 'm2', 'in2', 'ft2', 'yd2', 'ac']}
              unitMap={{'cm2':'cm2','m2':'m2','in2':'in2','ft2':'ft2','yd2':'yd2','ac':'ac'}}
              className="w-24"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cost per unit volume</label>
          <div className="flex gap-2">
            <input type="number" className="flex-1 border border-slate-300 rounded px-4 py-2" placeholder="PKR" min="0" value={costPerUnitVolume} onChange={e => setCostPerUnitVolume(e.target.value)} />
            <UnitDropdown
              value={costPerUnitVolumeUnit}
              onChange={e => handleCostPerUnitVolumeUnitChange(e.target.value)}
              unitValues={['m3', 'ft3', 'yd3', 'gal', 'l']}
              unitMap={{'m3':'m3','ft3':'ft3','yd3':'yd3','gal':'gal','l':'l'}}
              className="w-24"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Total cost</label>
          <input type="text" className="w-full border border-slate-300 rounded px-4 py-2 bg-blue-50" placeholder="PKR" readOnly value={totalCost} />
        </div>
      </div>
      {/* Additional information */}
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Project Details</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Total concrete volume needed:</span> {volume} {volumeUnit}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total area to cover:</span> {area} {areaUnit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConcreteCalculatorPage;
 