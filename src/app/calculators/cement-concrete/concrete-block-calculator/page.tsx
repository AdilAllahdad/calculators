"use client"
import React, { useState, useEffect, Dispatch, SetStateAction, ReactNode, ChangeEvent } from 'react';
import Image from 'next/image';
// Define types for our unit conversion factors
type UnitKey = 'm' | 'cm' | 'mm' | 'km' | 'in' | 'ft' | 'yd' | 'm²' | 'in²' | 'ft²' | 'yd²';
type BlockSizeKey = '8x8' | '12x8' | '16x8' | '8x4' | '12x4' | '16x4';
type SectionKey = 'wall' | 'concrete' | 'costs' | 'mortar';

// Define interfaces for component props
interface SectionCardProps {
  title: string;
  children: ReactNode;
  sectionKey: SectionKey;
}

interface LabeledInputProps {
  label: string;
  unit: string;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  isReadOnly?: boolean;
}

interface SelectOption {
  label: string;
  value: string;
}

interface LabeledSelectProps<T extends string = string> {
  label: string;
  options: SelectOption[];
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

interface LabeledInputWithUnitProps {
  label: string;
  units: SelectOption[];
  value: string;
  setValue: ((value: string) => void) | Dispatch<SetStateAction<string>>;
  selectedUnit: string;
  setSelectedUnit?: Dispatch<SetStateAction<string>>;
  onUnitChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isReadOnly?: boolean;
}

// ---
// CUSTOM HOOK: useDebounce
// This hook delays updating a value in state until the user has stopped typing.
// This is a common and effective pattern to prevent rapid re-renders and
// performance issues caused by a chain of state updates.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer that will update the debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value or delay changes before the timer fires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
// ---

// Renders a collapsible card section
const SectionCard: React.FC<SectionCardProps> = ({ title, children, sectionKey }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSection = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <h2 className="text-xl font-semibold ml-2 text-gray-800">{title}</h2>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        {children}
      </div>
    </div>
  );
};

// Renders a single input field with label and unit
const LabeledInput: React.FC<LabeledInputProps> = ({ label, unit, placeholder, value, setValue, isReadOnly = false }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        className="block w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4"
        placeholder={placeholder || ''}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={isReadOnly}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{unit}</span>
      </div>
    </div>
  </div>
);

// Renders a single dropdown field with label and options
const LabeledSelect = <T extends string>({ label, options, value, setValue }: LabeledSelectProps<T>) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <select
        className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4"
        value={value}
        onChange={(e) => setValue(e.target.value as unknown as T)}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Renders a Labeled input with a unit selection dropdown
const LabeledInputWithUnit: React.FC<LabeledInputWithUnitProps> = ({
  label,
  units,
  value,
  setValue,
  selectedUnit,
  setSelectedUnit,
  onUnitChange,
  isReadOnly = false
}) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm flex items-stretch">
        <input
          type="text"
          className="block w-full rounded-l-md border-gray-300 pr-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4"
          placeholder=""
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={isReadOnly}
        />
        <select
          className="flex-shrink-0 w-24 rounded-r-md border-l-0 border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-2 text-gray-500"
          value={selectedUnit}
          onChange={onUnitChange}
        >
          {units.map((unit, index) => (
            <option key={index} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};


// Main App component that contains the entire UI
export default function App() {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    wall: true,
    concrete: true,
    costs: true,
    mortar: true,
  });
  const [blockSizeOption, setBlockSizeOption] = useState<'preset' | 'custom'>('preset');
  
  // Store original values in meters for precise calculations
  // This approach ensures that when changing units back and forth (e.g., m to km and back to m),
  // we maintain the exact original values without rounding errors
  const [wallHeightInMeters, setWallHeightInMeters] = useState<number | null>(null);
  const [wallWidthInMeters, setWallWidthInMeters] = useState<number | null>(null);
  const [wallAreaInSqMeters, setWallAreaInSqMeters] = useState<number | null>(null);
  const [blockHeightInMeters, setBlockHeightInMeters] = useState<number | null>(null);
  const [blockWidthInMeters, setBlockWidthInMeters] = useState<number | null>(null);
  
  // Display values in selected units
  const [wallHeight, setWallHeight] = useState<string>('');
  const [wallHeightUnit, setWallHeightUnit] = useState<UnitKey>('m');
  const [wallWidth, setWallWidth] = useState<string>('');
  const [wallWidthUnit, setWallWidthUnit] = useState<UnitKey>('m');
  const [wallArea, setWallArea] = useState<string>('');
  const [wallAreaUnit, setWallAreaUnit] = useState<UnitKey>('m²');

  // State variables for block and cost calculations
  const [blockHeight, setBlockHeight] = useState<string>('');
  const [blockHeightUnit, setBlockHeightUnit] = useState<UnitKey>('cm');
  const [blockWidth, setBlockWidth] = useState<string>('');
  const [blockWidthUnit, setBlockWidthUnit] = useState<UnitKey>('mm');
  const [selectedBlockSize, setSelectedBlockSize] = useState<BlockSizeKey>('16x8');
  const [blocksNeeded, setBlocksNeeded] = useState<string>('');
  const [singleBlockPrice, setSingleBlockPrice] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [mortarBags, setMortarBags] = useState<string>('');

  // Use the useDebounce hook to delay calculations until the user stops typing
  const debouncedWallHeight = useDebounce(wallHeight, 500);
  const debouncedWallWidth = useDebounce(wallWidth, 500);
  const debouncedBlockHeight = useDebounce(blockHeight, 500);
  const debouncedBlockWidth = useDebounce(blockWidth, 500);
  const debouncedSingleBlockPrice = useDebounce(singleBlockPrice, 500);
  
  // Debounce the meter values too for calculations
  const debouncedWallHeightInMeters = useDebounce(wallHeightInMeters, 500);
  const debouncedWallWidthInMeters = useDebounce(wallWidthInMeters, 500);
  const debouncedBlockHeightInMeters = useDebounce(blockHeightInMeters, 500);
  const debouncedBlockWidthInMeters = useDebounce(blockWidthInMeters, 500);

  // Conversion factors to convert everything to square meters for calculation
  const conversionFactors: Record<UnitKey, number> = {
    'm': 1,
    'cm': 0.01,
    'mm': 0.001,
    'km': 1000,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'm²': 1,
    'in²': 0.00064516,
    'ft²': 0.092903,
    'yd²': 0.836127,
  };

  // Block dimensions for preset options
  const blockConversionFactors: Record<BlockSizeKey, { h: number, w: number }> = {
    '8x8': { h: 0.2032, w: 0.2032 },
    '12x8': { h: 0.3048, w: 0.2032 },
    '16x8': { h: 0.4064, w: 0.2032 },
    '8x4': { h: 0.2032, w: 0.1016 },
    '12x4': { h: 0.3048, w: 0.1016 },
    '16x4': { h: 0.4064, w: 0.1016 },
  };

  // Split the calculations into separate useEffect hooks to manage dependencies better
  
  // First useEffect for wall area calculation
  useEffect(() => {
    // Wall Area Calculation using the stored meter values
    if (debouncedWallHeightInMeters !== null && debouncedWallWidthInMeters !== null) {
      // Calculate area in square meters
      const areaInSqMeters = debouncedWallHeightInMeters * debouncedWallWidthInMeters;
      // Store the area in square meters for precise calculations
      setWallAreaInSqMeters(areaInSqMeters);
      // Display the area in the selected unit
      const areaInCurrentUnit = areaInSqMeters / conversionFactors[wallAreaUnit];
      setWallArea(areaInCurrentUnit.toFixed(4).replace(/\.?0+$/, ''));
    } else {
      setWallAreaInSqMeters(null);
      setWallArea('');
    }
  }, [debouncedWallHeightInMeters, debouncedWallWidthInMeters, wallAreaUnit]);

  // Second useEffect for block, cost, and mortar calculations
  useEffect(() => {
    if (wallAreaInSqMeters !== null && wallAreaInSqMeters > 0) {
      // Use wallAreaInSqMeters directly for calculations
      const areaInSqMeters = wallAreaInSqMeters;

      // Concrete Block, Cost, and Mortar Calculations
      let blockAreaInMeters = 0;
      if (blockSizeOption === 'preset') {
        const block = blockConversionFactors[selectedBlockSize];
        blockAreaInMeters = block.h * block.w;
      } else {
        if (debouncedBlockHeightInMeters !== null && debouncedBlockWidthInMeters !== null) {
          // Use the stored meter values directly
          blockAreaInMeters = debouncedBlockHeightInMeters * debouncedBlockWidthInMeters;
        }
      }

      if (blockAreaInMeters > 0) {
        const blocks = Math.ceil(areaInSqMeters / blockAreaInMeters);
        setBlocksNeeded(blocks.toString());

        // Cost Calculation
        if (debouncedSingleBlockPrice !== '') {
          const price = parseFloat(debouncedSingleBlockPrice);
          if (!isNaN(price)) {
            const cost = blocks * price;
            setTotalCost(cost.toFixed(2));
          } else {
            setTotalCost('');
          }
        } else {
          setTotalCost('');
        }

        // Mortar Calculation using the new formula
        const bags = Math.ceil(blocks / 33.3);
        setMortarBags(bags.toString());
      } else {
        setBlocksNeeded('');
        setTotalCost('');
        setMortarBags('');
      }
    } else {
      setBlocksNeeded('');
      setTotalCost('');
      setMortarBags('');
    }
  }, [
    wallAreaInSqMeters,
    blockSizeOption, selectedBlockSize, debouncedBlockHeightInMeters, debouncedBlockWidthInMeters,
    debouncedSingleBlockPrice
  ]);

  // Update input handlers to handle conversions
  const handleWallHeightChange = (value: string) => {
    setWallHeight(value);
    if (value && !isNaN(parseFloat(value))) {
      // Store the value in meters for precise calculations
      const valueInMeters = parseFloat(value) * conversionFactors[wallHeightUnit];
      setWallHeightInMeters(valueInMeters);
    } else {
      setWallHeightInMeters(null);
    }
  };

  const handleWallWidthChange = (value: string) => {
    setWallWidth(value);
    if (value && !isNaN(parseFloat(value))) {
      // Store the value in meters for precise calculations
      const valueInMeters = parseFloat(value) * conversionFactors[wallWidthUnit];
      setWallWidthInMeters(valueInMeters);
    } else {
      setWallWidthInMeters(null);
    }
  };
  
  const handleBlockHeightChange = (value: string) => {
    setBlockHeight(value);
    if (value && !isNaN(parseFloat(value))) {
      // Store the value in meters for precise calculations
      const valueInMeters = parseFloat(value) * conversionFactors[blockHeightUnit];
      setBlockHeightInMeters(valueInMeters);
    } else {
      setBlockHeightInMeters(null);
    }
  };

  const handleBlockWidthChange = (value: string) => {
    setBlockWidth(value);
    if (value && !isNaN(parseFloat(value))) {
      // Store the value in meters for precise calculations
      const valueInMeters = parseFloat(value) * conversionFactors[blockWidthUnit];
      setBlockWidthInMeters(valueInMeters);
    } else {
      setBlockWidthInMeters(null);
    }
  };

  const blockSizes: SelectOption[] = [
    { label: '8" x 8"', value: '8x8' },
    { label: '12" x 8"', value: '12x8' },
    { label: '16" x 8"', value: '16x8' },
    { label: '8" x 4"', value: '8x4' },
    { label: '12" x 4"', value: '12x4' },
    { label: '16" x 4"', value: '16x4' },
  ];

  const lengthUnits: SelectOption[] = [
    { label: 'centimeters (cm)', value: 'cm' },
    { label: 'meters (m)', value: 'm' },
    { label: 'kilometers (km)', value: 'km' },
    { label: 'inches (in)', value: 'in' },
    { label: 'feet (ft)', value: 'ft' },
    { label: 'yards (yd)', value: 'yd' },
  ];
  
  const blockLengthUnits: SelectOption[] = [
    { label: 'millimeters (mm)', value: 'mm' },
    { label: 'centimeters (cm)', value: 'cm' },
    { label: 'meters (m)', value: 'm' },
    { label: 'kilometers (km)', value: 'km' },
    { label: 'inches (in)', value: 'in' },
    { label: 'feet (ft)', value: 'ft' },
    { label: 'yards (yd)', value: 'yd' },
  ];

  const areaUnits: SelectOption[] = [
    { label: 'square meters (m²)', value: 'm²' },
    { label: 'square inches (in²)', value: 'in²' },
    { label: 'square feet (ft²)', value: 'ft²' },
    { label: 'square yards (yd²)', value: 'yd²' },
  ];

  const handleReset = () => {
    // Reset display values
    setWallHeight('');
    setWallHeightUnit('m');
    setWallWidth('');
    setWallWidthUnit('m');
    setWallArea('');
    setWallAreaUnit('m²');
    
    // Reset stored meter values
    setWallHeightInMeters(null);
    setWallWidthInMeters(null);
    setWallAreaInSqMeters(null);
    setBlockHeightInMeters(null);
    setBlockWidthInMeters(null);
    
    // Reset other values
    setBlockSizeOption('preset');
    setBlockHeight('');
    setBlockHeightUnit('cm');
    setBlockWidth('');
    setBlockWidthUnit('mm');
    setSelectedBlockSize('16x8');
    setBlocksNeeded('');
    setSingleBlockPrice('');
    setTotalCost('');
    setMortarBags('');
  };

  const handleWallHeightUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitKey;
    // Convert from stored meter value to the new unit
    if (wallHeightInMeters !== null) {
      // Use the stored meter value for precise conversion
      const newValue = wallHeightInMeters / conversionFactors[newUnit];
      // Format with more decimal places for better precision
      setWallHeight(newValue.toFixed(4).replace(/\.?0+$/, ''));
    }
    setWallHeightUnit(newUnit);
  };

  const handleWallWidthUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitKey;
    // Convert from stored meter value to the new unit
    if (wallWidthInMeters !== null) {
      // Use the stored meter value for precise conversion
      const newValue = wallWidthInMeters / conversionFactors[newUnit];
      // Format with more decimal places for better precision
      setWallWidth(newValue.toFixed(4).replace(/\.?0+$/, ''));
    }
    setWallWidthUnit(newUnit);
  };

  const handleWallAreaUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitKey;
    // Convert from stored square meter value to the new unit
    if (wallAreaInSqMeters !== null) {
      // Use the stored meter value for precise conversion
      const newValue = wallAreaInSqMeters / conversionFactors[newUnit];
      // Format with more decimal places for better precision
      setWallArea(newValue.toFixed(4).replace(/\.?0+$/, ''));
    }
    setWallAreaUnit(newUnit);
  };
  
  const handleBlockHeightUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitKey;
    // Convert from stored meter value to the new unit
    if (blockHeightInMeters !== null) {
      // Use the stored meter value for precise conversion
      const newValue = blockHeightInMeters / conversionFactors[newUnit];
      // Format with more decimal places for better precision
      setBlockHeight(newValue.toFixed(4).replace(/\.?0+$/, ''));
    }
    setBlockHeightUnit(newUnit);
  };

  const handleBlockWidthUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitKey;
    // Convert from stored meter value to the new unit
    if (blockWidthInMeters !== null) {
      // Use the stored meter value for precise conversion
      const newValue = blockWidthInMeters / conversionFactors[newUnit];
      // Format with more decimal places for better precision
      setBlockWidth(newValue.toFixed(4).replace(/\.?0+$/, ''));
    }
    setBlockWidthUnit(newUnit);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start font-inter">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Concrete Calculator
        </h1>

        <SectionCard title="Wall calculations" sectionKey="wall">
          <LabeledInputWithUnit
            label="Wall height"
            units={lengthUnits}
            value={wallHeight}
            setValue={handleWallHeightChange}
            selectedUnit={wallHeightUnit}
            onUnitChange={handleWallHeightUnitChange}
          />
          <LabeledInputWithUnit
            label="Wall width"
            units={lengthUnits}
            value={wallWidth}
            setValue={handleWallWidthChange}
            selectedUnit={wallWidthUnit}
            onUnitChange={handleWallWidthUnitChange}
          />
          <LabeledInputWithUnit
            label="Wall area"
            units={areaUnits}
            value={wallArea}
            setValue={setWallArea}
            selectedUnit={wallAreaUnit}
            onUnitChange={handleWallAreaUnitChange}
            isReadOnly={true}
          />
        </SectionCard>

        <SectionCard title="Concrete block calculations" sectionKey="concrete">
          <p className="text-sm text-gray-500">I want to...</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                id="preset-block"
                name="block-size"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                checked={blockSizeOption === 'preset'}
                onChange={() => setBlockSizeOption('preset')}
              />
              <label htmlFor="preset-block" className="ml-2 block text-sm font-medium text-gray-700">
                choose preset block size.
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="custom-block"
                name="block-size"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                checked={blockSizeOption === 'custom'}
                onChange={() => setBlockSizeOption('custom')}
              />
              <label htmlFor="custom-block" className="ml-2 block text-sm font-medium text-gray-700">
                input custom block size.
              </label>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            You can either choose from the common block sizes found in the U.S.A, or input a custom block size.
          </p>
          {blockSizeOption === 'custom' && (
            <div className="my-6">
              <div className="flex justify-center items-center relative">
               
                 
                 <Image src="/concreteblock.jpeg" alt="Concrete Block" width={300} height={180} />
              </div>
            </div>
          )}
          {blockSizeOption === 'preset' ? (
            <LabeledSelect label="Block size" options={blockSizes} value={selectedBlockSize} setValue={setSelectedBlockSize} />
          ) : (
            <>
              <LabeledInputWithUnit
                label="Block height"
                units={blockLengthUnits}
                value={blockHeight}
                setValue={handleBlockHeightChange}
                selectedUnit={blockHeightUnit}
                onUnitChange={handleBlockHeightUnitChange}
              />
              <LabeledInputWithUnit
                label="Block width"
                units={blockLengthUnits}
                value={blockWidth}
                setValue={handleBlockWidthChange}
                selectedUnit={blockWidthUnit}
                onUnitChange={handleBlockWidthUnitChange}
              />
            </>
          )}
          <LabeledInput label="Number of blocks needed" unit="" value={blocksNeeded} setValue={setBlocksNeeded} isReadOnly={true} />
        </SectionCard>

        <SectionCard title="Costs calculations" sectionKey="costs">
          <LabeledInput label="Single block's price" unit="PKR" value={singleBlockPrice} setValue={setSingleBlockPrice} />
          <LabeledInput label="Total cost" unit="PKR" value={totalCost} setValue={setTotalCost} isReadOnly={true} />
        </SectionCard>

        <SectionCard title="Mortar estimation" sectionKey="mortar">
          <LabeledInput label="Standard bags of mortar" unit="" value={mortarBags} setValue={setMortarBags} isReadOnly={true} />
        </SectionCard>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8">
          <button
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors duration-200 shadow-md"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
