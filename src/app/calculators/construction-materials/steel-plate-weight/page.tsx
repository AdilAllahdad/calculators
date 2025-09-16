'use client'
import React, { useState } from 'react'

const steelTypes = [
  { label: 'Tool steel (7750 kg/m³)', value: 'tool', density: 7750 },
  { label: 'Mild steel (7850 kg/m³)', value: 'mild', density: 7850 },
  { label: 'Stainless steel (8000 kg/m³)', value: 'stainless', density: 8000 },
  { label: 'Other', value: 'other', density: '' },
];

const shapeTypes = [
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Square', value: 'square' },
  { label: 'Circular', value: 'circular' },
  { label: 'Other shapes', value: 'other' },
];

const units = {
  length: ['mm', 'cm', 'm', 'in', 'ft', 'yd'],
  area: ['mm²', 'cm²', 'm²', 'in²', 'ft²', 'yd²'],
  thickness: ['mm', 'cm', 'm', 'in', 'ft', 'yd'],
  volume: ['mm³', 'cm³', 'm³', 'in³', 'ft³', 'yd³'],
  weight: ['kg', 'g', 'lb', 'ton'],
};

const initialState = {
  steelType: 'tool',
  shape: 'rectangle',
  length: '',
  lengthUnit: 'cm',
  width: '',
  widthUnit: 'cm',
  area: '',
  areaUnit: 'cm²',
  thickness: '',
  thicknessUnit: 'cm',
  volume: '',
  volumeUnit: 'cm³',
  quantity: '1',
  weight: '',
  weightUnit: 'kg',
};

const page = () => {
  const [fields, setFields] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFields(initialState);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-4 mt-8 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Steel Plate Weight Calculator</h1>
      {/* Material and shape */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="font-semibold mb-2">Material and shape</div>
        <label className="block text-sm mb-2">Steel type</label>
        <select name="steelType" value={fields.steelType} onChange={handleChange} className="w-full border rounded px-2 py-2 mb-3">
          {steelTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <label className="block text-sm mb-2">Shape of the plate</label>
        <div className="flex gap-6 mb-3">
          {shapeTypes.map(s => (
            <label key={s.value} className="flex items-center gap-1 text-sm">
              <input type="radio" name="shape" value={s.value} checked={fields.shape === s.value} onChange={handleChange} />
              {s.label}
            </label>
          ))}
        </div>
        <div className="flex justify-center mb-2">
          <img src={fields.shape === 'square' ? '/steel2.webp' : fields.shape === 'circular' ? '/steel3.webp' : fields.shape === 'other' ? '/steel4.webp' : '/steel1.webp'} alt="Plate shape" className="w-40 h-28 object-contain rounded bg-gray-100" />
        </div>
        <div className="text-xs text-center text-gray-500">{fields.shape === 'square' ? 's x s x t' : fields.shape === 'circular' ? 'D x t' : fields.shape === 'other' ? 'Area x t' : 'L x W x T'}</div>
      </div>
      {/* Plate details */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="font-semibold mb-2">Plate details</div>
        {fields.shape === 'other' ? (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1">Area</label>
              <div className="input-unit-group">
                <input type="number" name="area" value={fields.area} onChange={handleChange} />
                <select name="areaUnit" value={fields.areaUnit} onChange={handleChange}>
                  {units.area.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1">{fields.shape === 'square' ? 'Side (s)' : fields.shape === 'circular' ? 'Diameter (D)' : 'Length (l)'}</label>
              <div className="input-unit-group">
                <input type="number" name="length" value={fields.length} onChange={handleChange} />
                <select name="lengthUnit" value={fields.lengthUnit} onChange={handleChange}>
                  {units.length.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">{fields.shape === 'square' ? 'Side (s)' : fields.shape === 'circular' ? 'Diameter (D)' : 'Width (w)'}</label>
              <div className="input-unit-group">
                <input type="number" name="width" value={fields.width} onChange={handleChange} />
                <select name="widthUnit" value={fields.widthUnit} onChange={handleChange}>
                  {units.length.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        <div className="mb-3">
          <label className="block text-sm mb-1">Thickness (t)</label>
          <div className="input-unit-group">
            <input type="number" name="thickness" value={fields.thickness} onChange={handleChange} />
            <select name="thicknessUnit" value={fields.thicknessUnit} onChange={handleChange}>
              {units.thickness.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Volume</label>
          <div className="input-unit-group">
            <input type="text" name="volume" value={fields.volume} readOnly />
            <select name="volumeUnit" value={fields.volumeUnit} onChange={handleChange}>
              {units.volume.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Quantity of plates</label>
          <input type="number" name="quantity" value={fields.quantity} onChange={handleChange} className="w-full h-11 px-3 border rounded bg-white" />
        </div>
      </div>
      {/* Final result */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="font-semibold mb-2">Final result</div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Total weight</label>
          <div className="input-unit-group">
            <input type="text" name="weight" value={fields.weight} readOnly />
            <select name="weightUnit" value={fields.weightUnit} onChange={handleChange}>
              {units.weight.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleClear} className="w-full bg-blue-500 text-white py-2 rounded font-semibold mt-2">Clear</button>
      <style jsx global>{`
        .input-unit-group {
          position: relative;
          width: 100%;
        }
        .input-unit-group input {
          width: 100%;
          height: 44px;
          padding-right: 60px;
          background: #f7f8fa;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 16px;
        }
        .input-unit-group select {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #2563eb;
          font-weight: 500;
          font-size: 15px;
          padding: 0 8px;
          min-width: 48px;
          height: 32px;
        }
        .input-unit-group select:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default page;
