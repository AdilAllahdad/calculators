"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import Image from 'next/image';



// Define types for our application
type UnitType = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd';
type WainscotingType = 'recessedPanel' | 'shadowBox';

interface UnitOption {
  value: UnitType;
  label: string;
}

interface Measurement {
  value: string;
  valueInMM: number;
  unit: UnitType;
}

interface Measurements {
  wallLength: Measurement;
  numberOfPanels: { value: string; unit: string };
  spacingOfPanels: Measurement;
  endMargin: Measurement;
  chairRailHeight: Measurement;
  capMouldingDepth: Measurement;
  topRailMargin: Measurement;
  bottomRailMargin: Measurement;
  baseboardDepth: Measurement;
}

interface CalculatedValues {
  widthOfPanels: { value: string; unit: UnitType };
  heightOfPanels: { value: string; unit: UnitType };
}

interface ValidationErrors {
  [key: string]: string;
}

// This is a single, self-contained React component that can be used as a page in a Next.js application.
const App = () => {
  // Define the conversion factors relative to millimeters (mm).
  const CONVERSION_FACTORS: Record<UnitType, number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    in: 25.4,
    ft: 304.8,
    yd: 914.4,
  };

  // Define the available unit options for all fields.
  const allUnitOptions: UnitOption[] = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
    { value: 'ft', label: 'feet (ft)' },
    { value: 'yd', label: 'yards (yd)' },
  ];

  // Define specific unit options for the "Depth of cap moulding" field.
  const capMouldingUnits: UnitOption[] = [
    { value: 'mm', label: 'millimeters (mm)' },
    { value: 'cm', label: 'centimeters (cm)' },
    { value: 'm', label: 'meters (m)' },
    { value: 'in', label: 'inches (in)' },
  ];

  // State to manage the selected wainscoting type.
  const [wainscotingType, setWainscotingType] = useState<WainscotingType>('recessedPanel');

  // State to manage the input values and their respective units for the different measurements.
  const [measurements, setMeasurements] = useState<Measurements>({
    wallLength: { value: '', valueInMM: 0, unit: 'mm' },
    numberOfPanels: { value: '', unit: '' },
    spacingOfPanels: { value: '', valueInMM: 0, unit: 'mm' },
    endMargin: { value: '', valueInMM: 0, unit: 'cm' },
    chairRailHeight: { value: '', valueInMM: 0, unit: 'cm' },
    capMouldingDepth: { value: '', valueInMM: 0, unit: 'cm' },
    topRailMargin: { value: '', valueInMM: 0, unit: 'cm' },
    bottomRailMargin: { value: '', valueInMM: 0, unit: 'cm' },
    baseboardDepth: { value: '', valueInMM: 0, unit: 'cm' },
  });

  // State to store the calculated values, separate from the input values.
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    widthOfPanels: { value: '', unit: 'cm' },
    heightOfPanels: { value: '', unit: 'cm' },
  });

  // State to store validation errors for calculated fields.
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Handler for changing wainscoting type dropdown.
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setWainscotingType(e.target.value as WainscotingType);
  };

  // The core function to handle all input value changes.
  const handleValueChange = (name: keyof Omit<Measurements, 'numberOfPanels'>) => (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isNumber = (str: string) => /^-?\d*\.?\d*$/.test(str) || str === '';

    if (isNumber(newValue)) {
      const unit = measurements[name].unit;
      const valueAsNumber = parseFloat(newValue);
      const valueInMM = isNaN(valueAsNumber) ? 0 : valueAsNumber * CONVERSION_FACTORS[unit];
      
      setMeasurements(prev => ({
        ...prev,
        [name]: { ...prev[name], value: newValue, valueInMM }
      }));
    }
  };
  
  // Handler for number of panels, which is a special case
  const handleNumberOfPanelsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isPositiveInteger = (str: string) => /^\d*$/.test(str) && (str === '' || parseInt(str) > 0);
    if (isPositiveInteger(newValue)) {
        setMeasurements(prev => ({
            ...prev,
            numberOfPanels: { ...prev.numberOfPanels, value: newValue }
        }));
    }
  };

  // Handler for changing units.
  const handleUnitChange = (name: keyof Omit<Measurements, 'numberOfPanels'>) => (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitType;
    const oldUnit = measurements[name].unit;
    const valueInMM = measurements[name].valueInMM;
    
    // Convert the value to display in the new unit while keeping the base valueInMM the same
    let newDisplayValue = '';
    if (valueInMM !== 0) {
      const convertedValue = valueInMM / CONVERSION_FACTORS[newUnit];
      newDisplayValue = convertedValue.toString();
    } else {
      newDisplayValue = measurements[name].value;
    }

    setMeasurements(prev => ({
        ...prev,
        [name]: { ...prev[name], unit: newUnit, value: newDisplayValue }
    }));
  };

  // Function to perform the main calculation.
  const performCalculations = () => {
    const newErrors: ValidationErrors = {};
    let newCalculatedWidthValue = '';
    let newCalculatedHeightValue = '';
    
    // --- Panel Width Calculation ---
    const wallLength = measurements.wallLength.valueInMM;
    const numberOfPanels = parseFloat(measurements.numberOfPanels.value);
    const spacingOfPanels = measurements.spacingOfPanels.valueInMM;
    const endMargin = wainscotingType === 'recessedPanel' ? measurements.endMargin.valueInMM : 0;
    
    if (wallLength !== 0 && !isNaN(numberOfPanels) && spacingOfPanels !== 0 && numberOfPanels > 0) {
      const totalSpacing = (numberOfPanels + 1) * spacingOfPanels;
      const availableWidth = wallLength - (2 * endMargin) - totalSpacing;
      const widthInMM = availableWidth / numberOfPanels;

      if (!isNaN(widthInMM) && isFinite(widthInMM)) {
        const currentUnit = calculatedValues.widthOfPanels.unit;
        newCalculatedWidthValue = (widthInMM / CONVERSION_FACTORS[currentUnit]).toFixed(2);
        if (widthInMM < 0) {
          newErrors.widthOfPanels = "The panel width cannot be negative.";
        }
      } else {
        newErrors.widthOfPanels = "Invalid input values for width calculation.";
      }
    }

    // --- Panel Height Calculation ---
    const chairRailHeight = measurements.chairRailHeight.valueInMM;
    const baseboardDepth = measurements.baseboardDepth.valueInMM;
    const bottomRailMargin = wainscotingType === 'shadowBox' ? measurements.bottomRailMargin.valueInMM : 0;
    const topRailMargin = measurements.topRailMargin.valueInMM;
    const capMouldingDepth = measurements.capMouldingDepth.valueInMM;
    
    if (chairRailHeight !== 0 && baseboardDepth !== 0 && topRailMargin !== 0 && capMouldingDepth !== 0) {
      const heightInMM = chairRailHeight - capMouldingDepth - topRailMargin - bottomRailMargin - baseboardDepth;

      if (!isNaN(heightInMM) && isFinite(heightInMM)) {
        const currentUnit = calculatedValues.heightOfPanels.unit;
        newCalculatedHeightValue = (heightInMM / CONVERSION_FACTORS[currentUnit]).toFixed(2);
        if (heightInMM < 0) {
          newErrors.heightOfPanels = "The height of the panels cannot be negative.";
        }
      } else {
        newErrors.heightOfPanels = "Invalid input values for height calculation.";
      }
    }

    setCalculatedValues(prev => ({
      widthOfPanels: { ...prev.widthOfPanels, value: newCalculatedWidthValue },
      heightOfPanels: { ...prev.heightOfPanels, value: newCalculatedHeightValue }
    }));
    
    setValidationErrors(newErrors);
  };
  
  // A useEffect hook to trigger calculations whenever the input measurements change.
  useEffect(() => {
    performCalculations();
  }, [measurements, wainscotingType]);

  // Handler for changing units on calculated fields.
  const handleCalculatedUnitChange = (name: keyof CalculatedValues) => (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitType;
    setCalculatedValues(prev => {
      const { value, unit: oldUnit } = prev[name];
      if (value) {
        // Convert the calculated value to the new unit
        const valueAsNumber = parseFloat(value);
        if (!isNaN(valueAsNumber)) {
          // First convert current displayed value to millimeters (base unit)
          const valueInMM = valueAsNumber * CONVERSION_FACTORS[oldUnit];
          // Then convert from millimeters to the new unit
          const convertedValue = (valueInMM / CONVERSION_FACTORS[newUnit]).toFixed(2);
          return {
            ...prev,
            [name]: { ...prev[name], value: convertedValue, unit: newUnit }
          };
        }
      }
      return {
        ...prev,
        [name]: { ...prev[name], unit: newUnit }
      };
    });
  };
  
  // Function to get the correct image URL based on the wainscoting type
  const getImageUrl = (type: WainscotingType) => {
    if (type === 'recessedPanel') {
      return "/wainscoting_recessed_panel_with_end_margin_dim.webp";
    }
    return "/wainscoting_frame-type_panel_dim.webp";
  };
  
  // Helper component to render calculated fields
  interface CalculatedInputProps {
    label: string;
    name: keyof CalculatedValues;
    info?: string;
  }
  
  const CalculatedInput = ({ label, name, info = "" }: CalculatedInputProps) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <label htmlFor={name} className="flex-grow text-gray-600">{label}</label>
        {info && (
          <div className="relative group">
            <Info size={16} className="text-gray-400 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              {info}
            </div>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <input
            type="text"
            id={name}
            name={name}
            value={calculatedValues[name].value}
            readOnly={true}
            className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-gray-200 text-gray-700 ${validationErrors[name] ? 'border-red-500' : 'border-gray-300'}`}
          />
          <div className="relative">
            <select
              value={calculatedValues[name].unit}
              onChange={handleCalculatedUnitChange(name)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {allUnitOptions.map(unit => (
                <option key={unit.value} value={unit.value}>{unit.value}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>
      {validationErrors[name] && (
        <div className="text-sm text-red-500 flex items-center space-x-1">
          <Info size={16} className="text-red-500" />
          <span>{validationErrors[name]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Wainscoting Calculator</h1>

        {/* Wainscoting type selection card */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <label htmlFor="wainscoting-type" className="block text-gray-700 font-semibold mb-2">
            Wainscoting type
          </label>
          <div className="relative">
            <select
              id="wainscoting-type"
              name="wainscotingType"
              onChange={handleTypeChange}
              value={wainscotingType}
              className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="recessedPanel">Recessed panel</option>
              <option value="shadowBox">Shadow box</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Dynamic image and horizontal measurements section */}
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="relative w-full h-[300px]">
            <Image
              src={getImageUrl(wainscotingType)}
              alt={`${wainscotingType === 'recessedPanel' ? 'Recessed Panel' : 'Shadow Box'} diagram`}
              fill
              className="rounded-lg object-contain"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Horizontal measurements</h2>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="wallLength" className="flex-grow text-gray-600">Wall length ($L$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The total length of the wall to be covered.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="wallLength"
                  name="wallLength"
                  value={measurements.wallLength.value}
                  onChange={handleValueChange('wallLength')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.wallLength ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.wallLength.unit}
                    onChange={handleUnitChange('wallLength')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {allUnitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.wallLength && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.wallLength}</span>
              </div>
            )}
          </div>

          {/* Number of panels field (no unit selector) */}
          <div className="flex items-center space-x-2">
            <label htmlFor="numberOfPanels" className="flex-grow text-gray-600">Number of panels</label>
            <div className="relative group">
              <Info size={16} className="text-gray-400 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Must be a positive whole number.
              </div>
            </div>
            <input
              type="text"
              id="numberOfPanels"
              name="numberOfPanels"
              value={measurements.numberOfPanels.value}
              onChange={handleNumberOfPanelsChange}
              className="w-32 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="spacingOfPanels" className="flex-grow text-gray-600">Spacing of panels ($s$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The width of the spacing between panels.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="spacingOfPanels"
                  name="spacingOfPanels"
                  value={measurements.spacingOfPanels.value}
                  onChange={handleValueChange('spacingOfPanels')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.spacingOfPanels ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.spacingOfPanels.unit}
                    onChange={handleUnitChange('spacingOfPanels')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {allUnitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.spacingOfPanels && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.spacingOfPanels}</span>
              </div>
            )}
          </div>
          
          {/* Conditionally rendered End margin (e) field for 'recessedPanel' */}
          {wainscotingType === 'recessedPanel' && (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <label htmlFor="endMargin" className="flex-grow text-gray-600">End margin ($e$)</label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    The space between the first/last panel and the wall corners.
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    id="endMargin"
                    name="endMargin"
                    value={measurements.endMargin.value}
                    onChange={handleValueChange('endMargin')}
                    className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.endMargin ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="relative">
                    <select
                      value={measurements.endMargin.unit}
                      onChange={handleUnitChange('endMargin')}
                      className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                      {allUnitOptions.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              {validationErrors.endMargin && (
                <div className="text-sm text-red-500 flex items-center space-x-1">
                  <Info size={16} className="text-red-500" />
                  <span>{validationErrors.endMargin}</span>
                </div>
              )}
            </div>
          )}

          <CalculatedInput label="Width of the panels ($w$)" name="widthOfPanels" info="This value is calculated automatically." />
        </div>

        {/* Vertical measurements section */}
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Vertical measurements</h2>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="chairRailHeight" className="flex-grow text-gray-600">Chair rail height ($H$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The distance from the floor to the top of the chair rail.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="chairRailHeight"
                  name="chairRailHeight"
                  value={measurements.chairRailHeight.value}
                  onChange={handleValueChange('chairRailHeight')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.chairRailHeight ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.chairRailHeight.unit}
                    onChange={handleUnitChange('chairRailHeight')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {allUnitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.chairRailHeight && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.chairRailHeight}</span>
              </div>
            )}
          </div>
          
          {/* Custom MeasurementInput with limited units for cap moulding */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="capMouldingDepth" className="flex-grow text-gray-600">Depth of cap moulding ($c$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The vertical depth of the top cap moulding.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="capMouldingDepth"
                  name="capMouldingDepth"
                  value={measurements.capMouldingDepth.value}
                  onChange={handleValueChange('capMouldingDepth')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.capMouldingDepth ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.capMouldingDepth.unit}
                    onChange={handleUnitChange('capMouldingDepth')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {capMouldingUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.capMouldingDepth && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.capMouldingDepth}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="topRailMargin" className="flex-grow text-gray-600">Top rail margin ($t$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The space between the chair rail and the top of the panel.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="topRailMargin"
                  name="topRailMargin"
                  value={measurements.topRailMargin.value}
                  onChange={handleValueChange('topRailMargin')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.topRailMargin ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.topRailMargin.unit}
                    onChange={handleUnitChange('topRailMargin')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {allUnitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.topRailMargin && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.topRailMargin}</span>
              </div>
            )}
          </div>
          
          {/* Conditionally render Bottom rail margin (br) field for 'shadowBox' */}
          {wainscotingType === 'shadowBox' && (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <label htmlFor="bottomRailMargin" className="flex-grow text-gray-600">Bottom rail margin ($b_r$)</label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    The space between the bottom of the panel and the top of the baseboard.
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    id="bottomRailMargin"
                    name="bottomRailMargin"
                    value={measurements.bottomRailMargin.value}
                    onChange={handleValueChange('bottomRailMargin')}
                    className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.bottomRailMargin ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="relative">
                    <select
                      value={measurements.bottomRailMargin.unit}
                      onChange={handleUnitChange('bottomRailMargin')}
                      className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                      {allUnitOptions.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.value}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              {validationErrors.bottomRailMargin && (
                <div className="text-sm text-red-500 flex items-center space-x-1">
                  <Info size={16} className="text-red-500" />
                  <span>{validationErrors.bottomRailMargin}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="baseboardDepth" className="flex-grow text-gray-600">Baseboard depth ($b$)</label>
              <div className="relative group">
                <Info size={16} className="text-gray-400 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The vertical depth of the baseboard.
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  id="baseboardDepth"
                  name="baseboardDepth"
                  value={measurements.baseboardDepth.value}
                  onChange={handleValueChange('baseboardDepth')}
                  className={`w-24 border rounded-md px-3 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-indigo-500 ${validationErrors.baseboardDepth ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="relative">
                  <select
                    value={measurements.baseboardDepth.unit}
                    onChange={handleUnitChange('baseboardDepth')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 px-2 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    {allUnitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.baseboardDepth && (
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <Info size={16} className="text-red-500" />
                <span>{validationErrors.baseboardDepth}</span>
              </div>
            )}
          </div>

          <CalculatedInput label="Height of panels ($h$)" name="heightOfPanels" info="This value is calculated automatically." />
        </div>
      </div>
    </div>
  );
};

export default App;
