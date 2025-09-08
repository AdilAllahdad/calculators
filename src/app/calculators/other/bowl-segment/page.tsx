'use client';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


export default function BowlSegmentCalculator() {
  // Value states
  const [segments, setSegments] = useState<string>("");
  const [outerRadius, setOuterRadius] = useState<string>("");
  const [outerFudge, setOuterFudge] = useState<string>("");
  const [ringThickness, setRingThickness] = useState<string>("");
  const [innerRadius, setInnerRadius] = useState<string>("");
  const [innerFudge, setInnerFudge] = useState<string>("");
  const [showOtherParams, setShowOtherParams] = useState<boolean>(false);
  // Error states for negative values
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Unit states
  const [outerRadiusUnit, setOuterRadiusUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [outerFudgeUnit, setOuterFudgeUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [ringThicknessUnit, setRingThicknessUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [innerRadiusUnit, setInnerRadiusUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [innerFudgeUnit, setInnerFudgeUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [interiorAngleUnit, setInteriorAngleUnit] = useState<'deg'|'rad'>("deg");
  const [cuttingAngleUnit, setCuttingAngleUnit] = useState<'deg'|'rad'>("deg");
  // Units for calculated fields
  const [outerDiameterUnit, setOuterDiameterUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [innerDiameterUnit, setInnerDiameterUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [outerCircumferenceUnit, setOuterCircumferenceUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [innerCircumferenceUnit, setInnerCircumferenceUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [segmentThicknessUnit, setSegmentThicknessUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [outerLengthUnit, setOuterLengthUnit] = useState<'mm'|'cm'|'in'>("cm");
  const [innerLengthUnit, setInnerLengthUnit] = useState<'mm'|'cm'|'in'>("cm");

  // Conversion helpers
  const convertLength = (value: number, from: string, to: string) => {
    if (from === to) return value;
    // Convert to cm first
    let cmValue = value;
    if (from === 'mm') cmValue = value / 10;
    if (from === 'in') cmValue = value * 2.54;
    // Convert from cm to target
    if (to === 'mm') return cmValue * 10;
    if (to === 'in') return cmValue / 2.54;
    return cmValue;
  };
  const convertAngle = (value: number, from: string, to: string) => {
    if (from === to) return value;
    if (from === 'deg' && to === 'rad') return value * Math.PI / 180;
    if (from === 'rad' && to === 'deg') return value * 180 / Math.PI;
    return value;
  };

  // Calculated values
  const [interiorAngle, setInteriorAngle] = useState<number>(0);
  const [cuttingAngle, setCuttingAngle] = useState<number>(0);
  const [outerLength, setOuterLength] = useState<number>(0);
  const [innerLength, setInnerLength] = useState<number>(0);
  const [segmentThickness, setSegmentThickness] = useState<number>(0);
  const [outerCircumference, setOuterCircumference] = useState<number>(0);
  const [innerCircumference, setInnerCircumference] = useState<number>(0);

  useEffect(() => {
    // Always convert all input values to cm for calculation
    const segNum = Number(segments);
    const oRadius = convertLength(Number(outerRadius), outerRadiusUnit, 'cm');
    const oFudge = convertLength(Number(outerFudge), outerFudgeUnit, 'cm');
    const rThickness = convertLength(Number(ringThickness), ringThicknessUnit, 'cm');
    const iRadius = convertLength(Number(innerRadius), innerRadiusUnit, 'cm');
    const iFudge = convertLength(Number(innerFudge), innerFudgeUnit, 'cm');
    if (!isNaN(segNum) && segNum >= 3) {
      // Calculate interior angle
      const interior = 360 / segNum;
      setInteriorAngle(interior);

      // Calculate cutting angle
      const cutting = 180 / segNum;
      setCuttingAngle(cutting);

      if (oRadius > 0 && iRadius > 0) {
        // Calculate outer length
        const oLength = 2 * Math.tan(cutting * Math.PI / 180) * (oRadius + oFudge);
        setOuterLength(oLength);

        // Calculate inner length
        const iLength = 2 * Math.sin(cutting * Math.PI / 180) * (iRadius - iFudge);
        setInnerLength(iLength);

        // Validation: inner length must be greater than zero
        if (iLength <= 0) {
          setErrors(prev => ({ ...prev, innerLength: "The inner length of your segment must be greater than zero." }));
        } else {
          setErrors(prev => { const { innerLength, ...rest } = prev; return rest; });
        }

        // Calculate segment thickness
        const thickness = (oRadius + oFudge) - 
                        Math.cos(cutting * Math.PI / 180) * (iRadius - iFudge);
        setSegmentThickness(thickness);

        // Calculate circumferences (use only actual radii, not fudge factors)
        setOuterCircumference(2 * Math.PI * oRadius);
        setInnerCircumference(2 * Math.PI * iRadius);
      }
    }
  }, [segments, outerRadius, outerFudge, ringThickness, innerRadius, innerFudge, outerRadiusUnit, outerFudgeUnit, ringThicknessUnit, innerRadiusUnit, innerFudgeUnit]);

  // Clear all fields
  const clearAll = () => {
    setSegments("");
    setOuterRadius("");
    setOuterFudge("");
    setRingThickness("");
    setInnerRadius("");
    setInnerFudge("");
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Bowl Segment Calculator
          <span className="ml-3 text-2xl">🥣</span>
        </h1>
        <p className="text-gray-600">Calculate the proper measurements and angles to cut your wooden boards for creating beautiful segmented wood bowls.</p>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculator</h2>
        {/* Basic Parameters */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 mr-2">📐</span>
            <h3 className="text-lg font-semibold text-slate-800">Segment parameters</h3>
          </div>
          {/* Bowl image inside segment parameters */}
          <img src="/bowl.png" alt="Bowl" className="w-40 h-40 object-contain mb-4 mx-auto" />
          <div className="flex flex-col gap-4">
            {/* Number of segments */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of segments</label>
              <input
                type="number"
                min="3"
                value={segments}
                onChange={e => {
                  const val = e.target.value;
                  setSegments(val);
                  if (val === "") {
                    setErrors(prev => ({ ...prev, segments: '' }));
                  } else if (!/^[0-9]+$/.test(val)) {
                    setErrors(prev => ({ ...prev, segments: 'Enter a valid number' }));
                  } else if (parseInt(val) < 3) {
                    setErrors(prev => ({ ...prev, segments: 'Minimum 3 segments' }));
                  } else {
                    setErrors(prev => ({ ...prev, segments: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border ${errors.segments ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter number of segments (min 3)"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              />
              {errors.segments && <p className="text-red-500 text-xs mt-1">{errors.segments}</p>}
            </div>
            {/* Outer ring radius */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Outer ring radius (Ro)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={outerRadius}
                  onChange={e => {
                    const value = e.target.value;
                    setErrors(prev => ({ ...prev, outerRadius: '' }));
                    if (value !== '' && parseFloat(value) < 0) {
                      setErrors(prev => ({ ...prev, outerRadius: 'Negative values are not allowed' }));
                      return;
                    }
                    setOuterRadius(value);
                  }}
                  className={`w-full px-3 py-2 border ${errors.outerRadius ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
                <select
                  value={outerRadiusUnit}
                  onChange={e => {
                    const newUnit = e.target.value as 'mm'|'cm'|'in';
                    if (outerRadius !== "") {
                      const val = parseFloat(outerRadius);
                      const converted = convertLength(val, outerRadiusUnit, newUnit);
                      setOuterRadius(converted === 0 ? "" : converted.toFixed(3).replace(/\.0+$/, ""));
                    }
                    setOuterRadiusUnit(newUnit);
                  }}
                  className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="in">inches (in)</option>
                </select>
              </div>
              {errors.outerRadius && <p className="text-red-500 text-xs mt-1">{errors.outerRadius}</p>}
            </div>

            {/* Outer fudge factor */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Outer fudge factor (ao)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={outerFudge}
                  onChange={e => {
                    const value = e.target.value;
                    setErrors(prev => ({ ...prev, outerFudge: '' }));
                    if (value !== '' && parseFloat(value) < 0) {
                      setErrors(prev => ({ ...prev, outerFudge: 'Negative values are not allowed' }));
                      return;
                    }
                    setOuterFudge(value);
                  }}
                  className={`w-full px-3 py-2 border ${errors.outerFudge ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
                <select
                  value={outerFudgeUnit}
                  onChange={e => {
                    const newUnit = e.target.value as 'mm'|'cm'|'in';
                    if (outerFudge !== "") {
                      const val = parseFloat(outerFudge);
                      const converted = convertLength(val, outerFudgeUnit, newUnit);
                      setOuterFudge(converted === 0 ? "" : converted.toFixed(3).replace(/\.0+$/, ""));
                    }
                    setOuterFudgeUnit(newUnit);
                  }}
                  className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="in">inches (in)</option>
                </select>
              </div>
              {errors.outerFudge && <p className="text-red-500 text-xs mt-1">{errors.outerFudge}</p>}
            </div>

            {/* Ring thickness */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Ring thickness (Tr)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ringThickness}
                  onChange={e => {
                    const value = e.target.value;
                    setErrors(prev => ({ ...prev, ringThickness: '' }));
                    if (value !== '' && parseFloat(value) < 0) {
                      setErrors(prev => ({ ...prev, ringThickness: 'Negative values are not allowed' }));
                      return;
                    }
                    setRingThickness(value);
                  }}
                  className={`w-full px-3 py-2 border ${errors.ringThickness ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
                <select
                  value={ringThicknessUnit}
                  onChange={e => {
                    const newUnit = e.target.value as 'mm'|'cm'|'in';
                    if (ringThickness !== "") {
                      const val = parseFloat(ringThickness);
                      const converted = convertLength(val, ringThicknessUnit, newUnit);
                      setRingThickness(converted === 0 ? "" : converted.toFixed(3).replace(/\.0+$/, ""));
                    }
                    setRingThicknessUnit(newUnit);
                  }}
                  className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="in">inches (in)</option>
                </select>
              </div>
              {errors.ringThickness && <p className="text-red-500 text-xs mt-1">{errors.ringThickness}</p>}
            </div>

            {/* Inner ring radius */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Inner ring radius (Ri)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={innerRadius}
                  onChange={e => {
                    const value = e.target.value;
                    setErrors(prev => ({ ...prev, innerRadius: '' }));
                    if (value !== '' && parseFloat(value) < 0) {
                      setErrors(prev => ({ ...prev, innerRadius: 'Negative values are not allowed' }));
                      return;
                    }
                    setInnerRadius(value);
                  }}
                  className={`w-full px-3 py-2 border ${errors.innerRadius ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
                <select
                  value={innerRadiusUnit}
                  onChange={e => {
                    const newUnit = e.target.value as 'mm'|'cm'|'in';
                    if (innerRadius !== "") {
                      const val = parseFloat(innerRadius);
                      const converted = convertLength(val, innerRadiusUnit, newUnit);
                      setInnerRadius(converted === 0 ? "" : converted.toFixed(3).replace(/\.0+$/, ""));
                    }
                    setInnerRadiusUnit(newUnit);
                  }}
                  className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="in">inches (in)</option>
                </select>
              </div>
              {errors.innerRadius && <p className="text-red-500 text-xs mt-1">{errors.innerRadius}</p>}
            </div>

            {/* Inner fudge factor */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Inner fudge factor (ai)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={innerFudge}
                  onChange={e => {
                    const value = e.target.value;
                    setErrors(prev => ({ ...prev, innerFudge: '' }));
                    if (value !== '' && parseFloat(value) < 0) {
                      setErrors(prev => ({ ...prev, innerFudge: 'Negative values are not allowed' }));
                      return;
                    }
                    setInnerFudge(value);
                  }}
                  className={`w-full px-3 py-2 border ${errors.innerFudge ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                />
                <select
                  value={innerFudgeUnit}
                  onChange={e => {
                    const newUnit = e.target.value as 'mm'|'cm'|'in';
                    if (innerFudge !== "") {
                      const val = parseFloat(innerFudge);
                      const converted = convertLength(val, innerFudgeUnit, newUnit);
                      setInnerFudge(converted === 0 ? "" : converted.toFixed(3).replace(/\.0+$/, ""));
                    }
                    setInnerFudgeUnit(newUnit);
                  }}
                  className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                >
                  <option value="mm">millimeters (mm)</option>
                  <option value="cm">centimeters (cm)</option>
                  <option value="in">inches (in)</option>
                </select>
              </div>
              {errors.innerFudge && <p className="text-red-500 text-xs mt-1">{errors.innerFudge}</p>}
            </div>
          </div>

          {/* Additional Parameters Section (now above the toggle) */}
          {showOtherParams && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Additional Parameters</h3>
              <div className="flex flex-col gap-4">
                {/* Interior angle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interior angle (θ)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertAngle(interiorAngle, 'deg', interiorAngleUnit).toFixed(3)}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                      style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                    />
                    <select
                      value={interiorAngleUnit}
                      onChange={e => setInteriorAngleUnit(e.target.value as 'deg'|'rad')}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="deg">degrees (deg)</option>
                      <option value="rad">radians (rad)</option>
                    </select>
                  </div>
                </div>
                {/* Outer ring diameter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Outer ring diameter (Do)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertLength(Number(outerRadius) * 2, outerRadiusUnit, outerDiameterUnit).toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                      style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                    />
                    <select
                      value={outerDiameterUnit}
                      onChange={e => setOuterDiameterUnit(e.target.value as 'mm'|'cm'|'in')}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="mm">millimeters (mm)</option>
                      <option value="cm">centimeters (cm)</option>
                      <option value="in">inches (in)</option>
                    </select>
                  </div>
                </div>
                {/* Outer ring circumference */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Outer ring circumference (Co)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertLength(outerCircumference, 'cm', outerCircumferenceUnit).toFixed(1)}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                      style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                    />
                    <select
                      value={outerCircumferenceUnit}
                      onChange={e => setOuterCircumferenceUnit(e.target.value as 'mm'|'cm'|'in')}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="mm">millimeters (mm)</option>
                      <option value="cm">centimeters (cm)</option>
                      <option value="in">inches (in)</option>
                    </select>
                  </div>
                </div>
                {/* Inner ring diameter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Inner ring diameter (Di)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertLength(Number(innerRadius) * 2, innerRadiusUnit, innerDiameterUnit).toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                      style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                    />
                    <select
                      value={innerDiameterUnit}
                      onChange={e => setInnerDiameterUnit(e.target.value as 'mm'|'cm'|'in')}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="mm">millimeters (mm)</option>
                      <option value="cm">centimeters (cm)</option>
                      <option value="in">inches (in)</option>
                    </select>
                  </div>
                </div>
                {/* Inner ring circumference */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Inner ring circumference (Ci)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertLength(innerCircumference, 'cm', innerCircumferenceUnit).toFixed(1)}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                      style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                    />
                    <select
                      value={innerCircumferenceUnit}
                      onChange={e => setInnerCircumferenceUnit(e.target.value as 'mm'|'cm'|'in')}
                      className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="mm">millimeters (mm)</option>
                      <option value="cm">centimeters (cm)</option>
                      <option value="in">inches (in)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show Other Parameters Toggle */}
          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="showOtherParams"
                value="hide"
                checked={!showOtherParams}
                onChange={() => setShowOtherParams(false)}
                className="accent-blue-500"
              />
              <span className="text-slate-700">Hide other parameters</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="showOtherParams"
                value="show"
                checked={showOtherParams}
                onChange={() => setShowOtherParams(true)}
                className="accent-blue-500"
              />
              <span className="text-slate-700">Show other parameters</span>
            </label>
          </div>

          {/* Results Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Segment Details</h2>
            {/* Detail image for segment details */}
            <img src="/detail.png" alt="Segment Detail" className="w-40 h-40 object-contain mb-4 mx-auto" />
            <div className="flex flex-col gap-4">
              {/* Segment thickness */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Segment's thickness (Ts)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={convertLength(segmentThickness, 'cm', segmentThicknessUnit).toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                    style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                  />
                  <select
                    value={segmentThicknessUnit}
                    onChange={e => setSegmentThicknessUnit(e.target.value as 'mm'|'cm'|'in')}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="mm">millimeters (mm)</option>
                    <option value="cm">centimeters (cm)</option>
                    <option value="in">inches (in)</option>
                  </select>
                </div>
              </div>
              {/* Segment inner length */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Segment's inner length (Li)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={convertLength(innerLength, 'cm', innerLengthUnit).toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                    style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                  />
                  <select
                    value={innerLengthUnit}
                    onChange={e => setInnerLengthUnit(e.target.value as 'mm'|'cm'|'in')}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="mm">millimeters (mm)</option>
                    <option value="cm">centimeters (cm)</option>
                    <option value="in">inches (in)</option>
                  </select>
                </div>
                {errors.innerLength && (
                  <p className="text-red-600 text-xs mt-1">{errors.innerLength}</p>
                )}
              </div>
              {/* Segment outer length */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Segment's outer length (Lo)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={convertLength(outerLength, 'cm', outerLengthUnit).toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                    style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                  />
                  <select
                    value={outerLengthUnit}
                    onChange={e => setOuterLengthUnit(e.target.value as 'mm'|'cm'|'in')}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="mm">millimeters (mm)</option>
                    <option value="cm">centimeters (cm)</option>
                    <option value="in">inches (in)</option>
                  </select>
                </div>
              </div>
              {/* Cutting angle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cutting angle (α)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={convertAngle(cuttingAngle, 'deg', cuttingAngleUnit).toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600"
                    style={{ color: '#2563eb', backgroundColor: '#f8fafc' }}
                  />
                  <select
                    value={cuttingAngleUnit}
                    onChange={e => setCuttingAngleUnit(e.target.value as 'deg'|'rad')}
                    className="w-32 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  >
                    <option value="deg">degrees (deg)</option>
                    <option value="rad">radians (rad)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <button
            onClick={clearAll}
            className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear all changes
          </button>
        </div>
      </div>
    </div>
  );
}
