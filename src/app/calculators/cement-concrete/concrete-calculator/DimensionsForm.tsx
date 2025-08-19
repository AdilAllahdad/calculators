import React from 'react';
import { formatCompoundLength } from '@/lib/format-compound-length';
import UnitDropdown from '@/components/UnitDropdown';

interface DimensionsFormProps {
  selectedForm: string;
  length: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
  width: string;
  setWidth: React.Dispatch<React.SetStateAction<string>>;
  height: string;
  setHeight: React.Dispatch<React.SetStateAction<string>>;
  flagThickness: string;
  setFlagThickness: React.Dispatch<React.SetStateAction<string>>;
  gutterWidth: string;
  setGutterWidth: React.Dispatch<React.SetStateAction<string>>;
  lengthUnit: string;
  handleLengthUnitChange: (u: string) => void;
  widthUnit: string;
  handleWidthUnitChange: (u: string) => void;
  heightUnit: string;
  handleHeightUnitChange: (u: string) => void;
  handleInputChange: (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DimensionsForm: React.FC<DimensionsFormProps> = ({
  selectedForm,
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight,
  flagThickness,
  setFlagThickness,
  gutterWidth,
  setGutterWidth,
  lengthUnit,
  handleLengthUnitChange,
  widthUnit,
  handleWidthUnitChange,
  heightUnit,
  handleHeightUnitChange,
  handleInputChange,
}) => {
  if (selectedForm === 'select') {
    return (
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <div className="text-center p-4 text-gray-500">
          Please select a concrete form to see dimension inputs
        </div>
      </div>
    );
  }

  // Slab, Wall, Footer
  if (selectedForm === 'slab' || selectedForm === 'wall' || selectedForm === 'footer') {
    return (
      <div className="mb-8  rounded-lg p-6 bg-white">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Dimensions</h2>
        </div> */}
        {/* Length */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Length</label>
          <div className="flex gap-2">
            {lengthUnit === 'ft-in' || lengthUnit === 'm-cm' ? (
              <div className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50">
                {length !== '' ? formatCompoundLength(Number(length), 'm', lengthUnit as 'ft-in' | 'm-cm') : ''}
              </div>
            ) : (
              <input type="number" value={length} onChange={handleInputChange(setLength)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            )}
            <UnitDropdown value={lengthUnit} onChange={e => handleLengthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Width */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Width</label>
          <div className="flex gap-2">
            {widthUnit === 'ft-in' || widthUnit === 'm-cm' ? (
              <div className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50">
                {width !== '' ? formatCompoundLength(Number(width), 'm', widthUnit as 'ft-in' | 'm-cm') : ''}
              </div>
            ) : (
              <input type="number" value={width} onChange={handleInputChange(setWidth)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            )}
            <UnitDropdown value={widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Height/depth */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Height/depth</label>
          <div className="flex gap-2">
            {heightUnit === 'ft-in' || heightUnit === 'm-cm' ? (
              <div className="flex-1 border border-slate-300 rounded px-4 py-2 bg-blue-50">
                {height !== '' ? formatCompoundLength(Number(height), 'm', heightUnit as 'ft-in' | 'm-cm') : ''}
              </div>
            ) : (
              <input type="number" value={height} onChange={handleInputChange(setHeight)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            )}
            <UnitDropdown value={heightUnit} onChange={e => handleHeightUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Column
  if (selectedForm === 'column') {
    return (
      <div className="mb-8  rounded-lg p-6 bg-white">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Dimensions</h2>
        </div> */}
        {/* Diameter */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Diameter</label>
          <div className="flex gap-2">
            <input type="number" value={width} onChange={handleInputChange(setWidth)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Height */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Height</label>
          <div className="flex gap-2">
            <input type="number" value={height} onChange={handleInputChange(setHeight)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={heightUnit} onChange={e => handleHeightUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Curb, Gutter Barrier
  if (selectedForm === 'curb') {
    return (
      <div className="mb-8  rounded-lg p-6 bg-white">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Dimensions</h2>
        </div> */}
        {/* Length */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Length</label>
          <div className="flex gap-2">
            <input type="number" value={length} onChange={handleInputChange(setLength)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={lengthUnit} onChange={e => handleLengthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Curb depth */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Curb depth</label>
          <div className="flex gap-2">
            <input type="number" value={width} onChange={handleInputChange(setWidth)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Curb height */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Curb height</label>
          <div className="flex gap-2">
            <input type="number" value={height} onChange={handleInputChange(setHeight)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={heightUnit} onChange={e => handleHeightUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Flag thickness */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Flag thickness</label>
          <div className="flex gap-2">
            <input type="number" value={flagThickness} onChange={handleInputChange(setFlagThickness)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={heightUnit} onChange={e => handleHeightUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Gutter width */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Gutter width</label>
          <div className="flex gap-2">
            <input type="number" value={gutterWidth} onChange={handleInputChange(setGutterWidth)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Stairs
  if (selectedForm === 'stairs') {
    return (
      <div className="mb-8  rounded-lg p-6 bg-white">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Dimensions</h2>
        </div> */}
        {/* Length */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Length</label>
          <div className="flex gap-2">
            <input type="number" value={length} onChange={handleInputChange(setLength)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={lengthUnit} onChange={e => handleLengthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Width */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Width</label>
          <div className="flex gap-2">
            <input type="number" value={width} onChange={handleInputChange(setWidth)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={widthUnit} onChange={e => handleWidthUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
        {/* Height */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Height</label>
          <div className="flex gap-2">
            <input type="number" value={height} onChange={handleInputChange(setHeight)} className="flex-1 border border-slate-300 rounded px-4 py-2" min="0" />
            <UnitDropdown value={heightUnit} onChange={e => handleHeightUnitChange(e.target.value)} unitType="length" className="w-24" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DimensionsForm;
