"use client";

import React, { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, Share2, CornerDownRight, Info } from 'lucide-react';

// Define specific unit options for different fields
type UnitOption = {
  value: string;
  label: string;
};

const lengthUnitOptions: UnitOption[] = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
  { value: 'yd', label: 'yd' },
];

const smallLengthUnitOptions: UnitOption[] = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
];

const angleUnitOptions: UnitOption[] = [
  { value: 'deg', label: 'degrees (deg)' },
  { value: 'rad', label: 'radians (rad)' },
];

type ConversionFactors = {
  [key: string]: number;
};

const conversionFactors: ConversionFactors = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
  yd: 914.4,
  deg: 1,
  rad: Math.PI / 180,
};

// Define interfaces for component props
interface CardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const Card = ({ title, children, defaultOpen = true }: CardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          {title}
        </h2>
        {isOpen ? (
          <ChevronUp className="text-gray-500 w-5 h-5" />
        ) : (
          <ChevronDown className="text-gray-500 w-5 h-5" />
        )}
      </div>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

interface InputGroupProps {
  label: string;
  value: string | number;
  unit?: string;
  onChangeValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeUnit?: (e: ChangeEvent<HTMLSelectElement>) => void;
  isReadOnly?: boolean;
  info?: string | null;
  unitOptions?: UnitOption[];
  hasUnit?: boolean;
}

const InputGroup = ({ 
  label, 
  value, 
  unit, 
  onChangeValue, 
  onChangeUnit, 
  isReadOnly = false, 
  info = null, 
  unitOptions = lengthUnitOptions, 
  hasUnit = true 
}: InputGroupProps) => {
  const valueFormatted = typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : value;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-gray-600 flex items-center">
          {label}
          {info && (
            <div className="relative group">
              <Info className="ml-1 w-3 h-3 text-gray-400 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {info}
              </div>
            </div>
          )}
        </label>
      </div>
      <div className="relative">
        <input
          type="text"
          value={valueFormatted}
          onChange={onChangeValue}
          readOnly={isReadOnly}
          className={`w-full pl-4 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-2 transition duration-200 ${isReadOnly ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-white border-gray-300 focus:ring-blue-500'}`}
        />
        {hasUnit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <select
              value={unit}
              onChange={onChangeUnit}
              className={`appearance-none bg-transparent ${isReadOnly ? 'text-gray-500' : 'text-gray-800'} border-none focus:outline-none`}
            >
              {unitOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="ml-1 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (option: string) => void;
  info?: string;
}

const RadioGroup = ({ label, options, selected, onChange, info }: RadioGroupProps) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <label className="text-gray-600 flex items-center">
        {label}
        {info && (
          <div className="relative group">
            <Info className="ml-1 w-3 h-3 text-gray-400 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              {info}
            </div>
          </div>
        )}
      </label>
    </div>
    {options.map((option: string, index: number) => (
      <div key={index} className="flex items-center mb-2">
        <input
          id={`radio-${index}`}
          type="radio"
          name="mount"
          checked={selected === option}
          onChange={() => onChange(option)}
          className="form-radio h-4 w-4 text-blue-600 transition duration-200"
        />
        <label htmlFor={`radio-${index}`} className="ml-2 text-gray-700">
          {option}
        </label>
      </div>
    ))}
  </div>
);

interface CheckboxGroupProps {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroup = ({ label, checked, onChange }: CheckboxGroupProps) => (
  <div className="flex items-center mb-4">
    <input
      id="checkbox"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="form-checkbox h-4 w-4 text-blue-600 rounded transition duration-200"
    />
    <label htmlFor="checkbox" className="ml-2 text-gray-600">
      {label}
    </label>
  </div>
);

// Define types for state objects
interface ValueWithUnit {
  value: string;
  unit: string;
  baseValue: number | null;
}

interface NumberStepsValue {
  value: string;
  baseValue: number | null;
}

interface InputState {
  run: ValueWithUnit;
  rise: ValueWithUnit;
  totalRise: ValueWithUnit;
}

interface OutputState {
  totalRun: ValueWithUnit;
  numberOfSteps: NumberStepsValue;
  stringerHeight: ValueWithUnit;
  stringerLength: ValueWithUnit;
  angle: ValueWithUnit;
}

export default function App() {
  const [mount, setMount] = useState<string>('Standard mount');
  const [showHeadroom, setShowHeadroom] = useState<boolean>(false);
  const [inputs, setInputs] = useState<InputState>({
    run: { value: '', unit: 'cm', baseValue: null },
    rise: { value: '', unit: 'cm', baseValue: null },
    totalRise: { value: '', unit: 'cm', baseValue: null },
  });

  const [outputs, setOutputs] = useState<OutputState>({
    totalRun: { value: '', unit: 'cm', baseValue: null },
    numberOfSteps: { value: '', baseValue: null },
    stringerHeight: { value: '', unit: 'cm', baseValue: null },
    stringerLength: { value: '', unit: 'cm', baseValue: null },
    angle: { value: '', unit: 'deg', baseValue: null },
  });

  const handleInputChange = (name: keyof InputState) => (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const re = /^\d*\.?\d*$/;
    if (newValue === '' || re.test(newValue)) {
      setInputs(prev => {
        let conversionFactor = 1;
        if ((prev[name] as ValueWithUnit).unit) {
          conversionFactor = conversionFactors[(prev[name] as ValueWithUnit).unit] || 1;
        }
        
        const newBaseValue = newValue === '' ? null : parseFloat(newValue) * conversionFactor;
        return {
          ...prev,
          [name]: { ...prev[name], value: newValue, baseValue: newBaseValue }
        };
      });
    }
  };

  const handleUnitChange = (name: keyof InputState) => (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setInputs(prev => {
      const { baseValue } = prev[name];
      const convertedValue = baseValue !== null ? (baseValue / conversionFactors[newUnit]).toFixed(2) : '';
      return {
        ...prev,
        [name]: { ...(prev[name] as ValueWithUnit), unit: newUnit, value: convertedValue } as any
      };
    });
  };

  const handleOutputUnitChange = (name: keyof OutputState) => (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setOutputs(prev => {
      const output = prev[name];
      if ('unit' in output) {
        const { baseValue } = output;
        const convertedValue = baseValue !== null ? (baseValue / conversionFactors[newUnit]).toFixed(2) : '';
        return {
          ...prev,
          [name]: { ...output, unit: newUnit, value: convertedValue } as any
        };
      }
      return prev;
    });
  };

  const reloadCalculator = () => {
    setMount('Standard mount');
    setShowHeadroom(false);
    setInputs({
      run: { value: '', unit: 'cm', baseValue: null },
      rise: { value: '', unit: 'cm', baseValue: null },
      totalRise: { value: '', unit: 'cm', baseValue: null },
    });
    setOutputs({
      totalRun: { value: '', unit: 'cm', baseValue: null },
      numberOfSteps: { value: '', baseValue: null },
      stringerHeight: { value: '', unit: 'cm', baseValue: null },
      stringerLength: { value: '', unit: 'cm', baseValue: null },
      angle: { value: '', unit: 'deg', baseValue: null },
    });
  };

  useEffect(() => {
    const { run, totalRise, rise } = inputs;

    // Check if the three core inputs are valid numbers
    if (run.baseValue !== null && totalRise.baseValue !== null && rise.baseValue !== null && rise.baseValue !== 0) {
      
      let calculatedSteps;
      let totalRunValue;
      let stringerHeightValue;

      if (mount === 'Standard mount') {
        // Standard mount logic based on user's new images
        calculatedSteps = Math.ceil(totalRise.baseValue / rise.baseValue) + 1;
        totalRunValue = run.baseValue * (calculatedSteps - 1);
        stringerHeightValue = totalRise.baseValue - rise.baseValue;
      } else { // Flush mount
        // Flush mount logic based on user's new images
        calculatedSteps = Math.ceil(totalRise.baseValue / rise.baseValue);
        totalRunValue = run.baseValue * calculatedSteps;
        stringerHeightValue = totalRise.baseValue;
      }

      const newOutputs: Partial<OutputState> = {
        numberOfSteps: { value: calculatedSteps.toString(), baseValue: calculatedSteps },
        totalRun: { value: totalRunValue.toString(), unit: 'cm', baseValue: totalRunValue },
        stringerHeight: { value: stringerHeightValue.toString(), unit: 'cm', baseValue: stringerHeightValue },
      };

      // Calculate stringer length using the Pythagorean theorem
      const stringerLengthValue = Math.sqrt(Math.pow(totalRunValue, 2) + Math.pow(stringerHeightValue, 2));
      newOutputs.stringerLength = { value: stringerLengthValue.toString(), unit: 'cm', baseValue: stringerLengthValue };

      // Calculate angle using arctan
      const angleValue = Math.atan(stringerHeightValue / totalRunValue) * (180 / Math.PI);
      newOutputs.angle = { value: angleValue.toString(), unit: 'deg', baseValue: angleValue };

      setOutputs(prev => {
        const updatedOutputs: OutputState = { ...prev };
        for (const key in newOutputs) {
          const outputKey = key as keyof OutputState;
          const output = newOutputs[outputKey];
          if (output) {
            if ('unit' in prev[outputKey] && 'unit' in output) {
              const unitKey = (prev[outputKey] as ValueWithUnit).unit as keyof ConversionFactors;
              const baseValue = output.baseValue || 0;
              updatedOutputs[outputKey] = {
                ...prev[outputKey],
                baseValue: output.baseValue,
                value: (baseValue / conversionFactors[unitKey]).toFixed(2),
              } as any;
            } else {
              updatedOutputs[outputKey] = {
                ...prev[outputKey],
                baseValue: output.baseValue,
                value: output.value,
              } as any;
            }
          }
        }
        return updatedOutputs;
      });
    } else {
      // Clear outputs if the required inputs are not complete or valid
      setOutputs({
        totalRun: { value: '', unit: 'cm', baseValue: null },
        numberOfSteps: { value: '', baseValue: null },
        stringerHeight: { value: '', unit: 'cm', baseValue: null },
        stringerLength: { value: '', unit: 'cm', baseValue: null },
        angle: { value: '', unit: 'deg', baseValue: null },
      });
    }
  }, [inputs, mount]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl mx-auto space-y-4">
        <Card title="Stair illustration and calculation options">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <img
              src="https://placehold.co/400x250/E2E8F0/1A202C?text=Stair+Illustration"
              alt="Stair Illustration"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="text-sm text-gray-500 mb-4 text-center">&copy; Omni Calculator</p>
          <div className="space-y-4">
            <RadioGroup
              label="Mount"
              options={["Standard mount", "Flush mount"]}
              selected={mount}
              onChange={setMount}
              info="Standard mount: The top step is supported by the floor. Flush mount: The top step is at the same level as the upper floor."
            />
            <CheckboxGroup
              label="Display headroom restriction details — appears at the end of the calculator"
              checked={showHeadroom}
              onChange={(e) => setShowHeadroom(e.target.checked)}
            />
          </div>
        </Card>

        <Card title="Your stairs">
          <InputGroup
            label="Run"
            value={inputs.run.value}
            unit={inputs.run.unit}
            onChangeValue={handleInputChange('run')}
            onChangeUnit={handleUnitChange('run')}
            unitOptions={lengthUnitOptions}
            info="The total horizontal distance of the staircase"
          />
          <InputGroup
            label="Total rise"
            value={inputs.totalRise.value}
            unit={inputs.totalRise.unit}
            onChangeValue={handleInputChange('totalRise')}
            onChangeUnit={handleUnitChange('totalRise')}
            info="The vertical distance between two floor levels"
          />
          <InputGroup
            label="Rise"
            value={inputs.rise.value}
            unit={inputs.rise.unit}
            onChangeValue={handleInputChange('rise')}
            onChangeUnit={handleUnitChange('rise')}
            unitOptions={smallLengthUnitOptions}
            info="The height of one step"
          />
          <InputGroup
            label="Number of steps"
            value={outputs.numberOfSteps.value}
            unit=""
            onChangeValue={() => {}}
            onChangeUnit={() => {}}
            isReadOnly={true}
            hasUnit={false}
            info="The total number of steps in the staircase"
          />
          <InputGroup
            label="Total run"
            value={outputs.totalRun.value}
            unit={outputs.totalRun.unit}
            onChangeValue={() => {}}
            onChangeUnit={handleOutputUnitChange('totalRun')}
            isReadOnly={true}
            unitOptions={lengthUnitOptions}
            info="Horizontal distance between the first and last risers"
          />
        </Card>

        <Card title="Stringer">
          <InputGroup
            label="Stringer height"
            value={outputs.stringerHeight.value}
            unit={outputs.stringerHeight.unit}
            onChangeValue={() => {}}
            onChangeUnit={handleOutputUnitChange('stringerHeight')}
            isReadOnly={true}
          />
          <InputGroup
            label="Stringer length"
            value={outputs.stringerLength.value}
            unit={outputs.stringerLength.unit}
            onChangeValue={() => {}}
            onChangeUnit={handleOutputUnitChange('stringerLength')}
            isReadOnly={true}
          />
          <InputGroup
            label="Angle"
            value={outputs.angle.value}
            unit={outputs.angle.unit}
            onChangeValue={() => {}}
            onChangeUnit={handleOutputUnitChange('angle')}
            isReadOnly={true}
            unitOptions={angleUnitOptions}
          />
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button className="flex items-center justify-center w-full sm:w-1/2 py-3 px-6 rounded-full bg-white text-pink-500 border border-pink-500 shadow-md transition duration-200 hover:bg-pink-50">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
            <button onClick={reloadCalculator} className="flex items-center justify-center w-full sm:w-1/2 py-3 px-6 rounded-full bg-white text-blue-500 border border-blue-500 shadow-md transition duration-200 hover:bg-blue-50">
              <CornerDownRight className="w-5 h-5 mr-2 rotate-90" />
              Reload calculator
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
