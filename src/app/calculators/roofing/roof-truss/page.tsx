'use client'
import React, { useState } from 'react';

// Roof length dropdown units
const roofLengthUnits = [
  { label: "meters", unit: "m" },
  { label: "feet", unit: "ft" }
];

// On-center spacing dropdown units
const spacingUnits = [
  { label: "millimeters", unit: "mm" },
  { label: "centimeters", unit: "cm" },
  { label: "meters", unit: "m" },
  { label: "kilometers", unit: "km" },
  { label: "inches", unit: "in" },
  { label: "feet", unit: "ft" },
  { label: "yards", unit: "yd" },
  { label: "miles", unit: "mi" },
  { label: "nautical miles", unit: "nmi" }
];

// Roof pitch dropdown units
const pitchUnits = [
  { label: "degrees", unit: "deg" },
  { label: "radians", unit: "rad" },
  { label: "gradians", unit: "gon" },
  { label: "turns", unit: "tr" },
  { label: "minutes of arc", unit: "arcmin" },
  { label: "seconds of arc", unit: "arcsec" },
  { label: "milliradians", unit: "mrad" },
  { label: "microradians", unit: "μrad" },
  { label: "π radians", unit: "× π rad" }
];

// Dropdown units for Rise, Run, Rafter length (all the same, but separate arrays for clarity)
const riseUnits = [
  { label: "centimeters", unit: "cm" },
  { label: "meters", unit: "m" },
  { label: "inches", unit: "in" },
  { label: "feet", unit: "ft" }
];
const runUnits = [
  { label: "centimeters", unit: "cm" },
  { label: "meters", unit: "m" },
  { label: "inches", unit: "in" },
  { label: "feet", unit: "ft" }
];
const rafterLengthUnits = [
  { label: "centimeters", unit: "cm" },
  { label: "meters", unit: "m" },
  { label: "inches", unit: "in" },
  { label: "feet", unit: "ft" }
];

// Dropdown units for Roof pitch (separate for each input)
const pitchDegUnits = [
  { label: "degrees", unit: "deg" },
  { label: "radians", unit: "rad" },
  { label: "gradians", unit: "gon" },
  { label: "turns", unit: "tr" },
  { label: "minutes of arc", unit: "arcmin" },
  { label: "seconds of arc", unit: "arcsec" },
  { label: "milliradians", unit: "mrad" },
  { label: "microradians", unit: "μrad" },
  { label: "π radians", unit: "× π rad" }
];
const pitchPercentUnits = [
  { label: "degrees", unit: "deg" },
  { label: "radians", unit: "rad" },
  { label: "gradians", unit: "gon" },
  { label: "turns", unit: "tr" },
  { label: "minutes of arc", unit: "arcmin" },
  { label: "seconds of arc", unit: "arcsec" },
  { label: "milliradians", unit: "mrad" },
  { label: "microradians", unit: "μrad" },
  { label: "π radians", unit: "× π rad" }
];
const pitch12Units = [
  { label: "degrees", unit: "deg" },
  { label: "radians", unit: "rad" },
  { label: "gradians", unit: "gon" },
  { label: "turns", unit: "tr" },
  { label: "minutes of arc", unit: "arcmin" },
  { label: "seconds of arc", unit: "arcsec" },
  { label: "milliradians", unit: "mrad" },
  { label: "microradians", unit: "μrad" },
  { label: "π radians", unit: "× π rad" }
];

// Installation cost dropdown units
const installCostUnits = [
  { label: "second", unit: "sec" },
  { label: "minute", unit: "min" },
  { label: "hour", unit: "hr" },
  { label: "day", unit: "day" }
];

// Installation duration dropdown units
const installDurationUnits = [
  { label: "hours", unit: "hrs" },
  { label: "days", unit: "days" }
];

// Add pitchUnit to initialState
const initialState = {
  mode: 'truss',
  roofLengthM: '',
  spacingM: '',
  trussCount: '',
  includeInstall: false,
  trussCost: '',
  installCost: '',
  installDuration: '',
  totalCost: '',
  rafterInclude: 'rise', // 'rise' or 'pitch'
  riseM: '',
  runM: '',
  rafterLengthM: '',
  // Display units for each input field
  roofLengthUnit: 'm',
  spacingUnit: 'cm',
  riseUnit: 'm',
  runUnit: 'm',
  rafterLengthUnit: 'm',
  pitchDeg: '',
  pitchDegUnit: 'deg',
  pitchPercent: '',
  pitchPercentUnit: 'deg',
  pitch12: '',
  pitch12Unit: 'deg',
  installCostUnit: 'hr',
  installDurationUnit: 'hrs'
};

// Conversion helpers
const toMeters = (value: string, from: string): number => {
  if (!value) return 0;
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  switch (from) {
    case 'mm': return v / 1000;
    case 'cm': return v / 100;
    case 'm': return v;
    case 'km': return v * 1000;
    case 'in': return v * 0.0254;
    case 'ft': return v * 0.3048;
    case 'yd': return v * 0.9144;
    case 'mi': return v * 1609.344;
    case 'nmi': return v * 1852;
    default: return v;
  }
};
const fromMeters = (meters: number, to: string): string => {
  switch (to) {
    case 'mm': return (meters * 1000).toString();
    case 'cm': return (meters * 100).toString();
    case 'm': return meters.toString();
    case 'km': return (meters / 1000).toString();
    case 'in': return (meters / 0.0254).toString();
    case 'ft': return (meters / 0.3048).toString();
    case 'yd': return (meters / 0.9144).toString();
    case 'mi': return (meters / 1609.344).toString();
    case 'nmi': return (meters / 1852).toString();
    default: return meters.toString();
  }
};

// Conversion helpers (add for pitch, install cost, install duration)
const convertPitch = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  if (from === to) return value;
  // deg <-> rad
  if (from === 'deg' && to === 'rad') return (v * Math.PI / 180).toString();
  if (from === 'rad' && to === 'deg') return (v * 180 / Math.PI).toString();
  // deg <-> gon
  if (from === 'deg' && to === 'gon') return (v * (200 / 180)).toString();
  if (from === 'gon' && to === 'deg') return (v * (180 / 200)).toString();
  // deg <-> tr
  if (from === 'deg' && to === 'tr') return (v / 360).toString();
  if (from === 'tr' && to === 'deg') return (v * 360).toString();
  // deg <-> arcmin
  if (from === 'deg' && to === 'arcmin') return (v * 60).toString();
  if (from === 'arcmin' && to === 'deg') return (v / 60).toString();
  // deg <-> arcsec
  if (from === 'deg' && to === 'arcsec') return (v * 3600).toString();
  if (from === 'arcsec' && to === 'deg') return (v / 3600).toString();
  // deg <-> mrad
  if (from === 'deg' && to === 'mrad') return (v * (Math.PI / 180) * 1000).toString();
  if (from === 'mrad' && to === 'deg') return (v / 1000 * (180 / Math.PI)).toString();
  // deg <-> μrad
  if (from === 'deg' && to === 'μrad') return (v * (Math.PI / 180) * 1e6).toString();
  if (from === 'μrad' && to === 'deg') return (v / 1e6 * (180 / Math.PI)).toString();
  // deg <-> × π rad
  if (from === 'deg' && to === '× π rad') return (v / 180).toString();
  if (from === '× π rad' && to === 'deg') return (v * 180).toString();
  // fallback
  return value;
};

const convertInstall = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  // Only convert between sec/min/hr/day for install cost
  const multipliers: Record<string, number> = {
    sec: 1,
    min: 60,
    hr: 3600,
    day: 86400
  };
  if (!multipliers[from] || !multipliers[to]) return value;
  return ((v * multipliers[from]) / multipliers[to]).toString();
};

const convertDuration = (value: string, from: string, to: string): string => {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  // Only convert between hrs/days for install duration
  if (from === to) return value;
  if (from === 'hrs' && to === 'days') return (v / 24).toString();
  if (from === 'days' && to === 'hrs') return (v * 24).toString();
  return value;
};

// --- Add this helper function for pitch unit conversion ---
function convertPitchValue(value: string, from: string, to: string): string {
  if (!value) return '';
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  if (from === to) return value;
  // Convert input to degrees
  let deg = v;
  switch (from) {
    case 'deg': deg = v; break;
    case 'rad': deg = v * 180 / Math.PI; break;
    case 'gon': deg = v * 0.9; break;
    case 'tr': deg = v * 360; break;
    case 'arcmin': deg = v / 60; break;
    case 'arcsec': deg = v / 3600; break;
    case 'mrad': deg = v * 180 / (Math.PI * 1000); break;
    case 'μrad': deg = v * 180 / (Math.PI * 1e6); break;
    case '× π rad': deg = v * 180; break;
    default: deg = v;
  }
  // Convert degrees to output unit
  switch (to) {
    case 'deg': return deg.toString();
    case 'rad': return (deg * Math.PI / 180).toString();
    case 'gon': return (deg / 0.9).toString();
    case 'tr': return (deg / 360).toString();
    case 'arcmin': return (deg * 60).toString();
    case 'arcsec': return (deg * 3600).toString();
    case 'mrad': return (deg * Math.PI * 1000 / 180).toString();
    case 'μrad': return (deg * Math.PI * 1e6 / 180).toString();
    case '× π rad': return (deg / 180).toString();
    default: return deg.toString();
  }
}

// --- Separate function for roof pitch dropdown conversion ---
function handlePitchDegDropdownChange(
  prevPitchDeg: string,
  prevUnit: string,
  newUnit: string
): string {
  if (!prevPitchDeg) return '';
  // Convert stored deg to previous unit for display, then to new unit, then back to deg for storage
  const displayValue = convertPitchValue(prevPitchDeg, 'deg', prevUnit);
  return displayValue ? convertPitchValue(displayValue, newUnit, 'deg') : '';
}

const Page = () => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Display helpers for each input field
  const getDisplayValue = (meterValue: string, displayUnit: string) =>
    meterValue ? fromMeters(parseFloat(meterValue), displayUnit) : '';

  // Roof length
  const handleRoofLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (value && parseFloat(value) < 0) {
      error = 'Roof length cannot be a negative number.';
    }
    setFields(prev => ({
      ...prev,
      roofLengthM: value ? toMeters(value, prev.roofLengthUnit).toString() : ''
    }));
    setErrors(prev => ({
      ...prev,
      roofLength: error
    }));
  };
  const handleRoofLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      roofLengthUnit: e.target.value
    }));
  };

  // Spacing
  const handleSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      spacingM: value ? toMeters(value, prev.spacingUnit).toString() : ''
    }));
  };
  const handleSpacingUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      spacingUnit: e.target.value
    }));
  };

  // Rise
  const handleRiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      riseM: value ? toMeters(value, prev.riseUnit).toString() : ''
    }));
  };
  const handleRiseUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      riseUnit: e.target.value
    }));
  };

  // Run
  const handleRunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      runM: value ? toMeters(value, prev.runUnit).toString() : ''
    }));
  };
  const handleRunUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      runUnit: e.target.value
    }));
  };

  // Rafter length (display only)
  const handleRafterLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      rafterLengthUnit: e.target.value
    }));
  };

  // Roof pitch (first input only) - with dropdown and display conversion
  const getPitchDegDisplay = () => {
    if (!fields.pitchDeg) return '';
    return convertPitchValue(fields.pitchDeg, 'deg', fields.pitchDegUnit);
  };

  // --- Roof pitch (truss mode) display and handlers ---
  // Display value for pitchDeg in selected unit (truss mode)
  const getPitchDegTrussDisplay = () => {
    if (!fields.pitchDeg) return '';
    // Always store as degrees, display in selected unit
    return convertPitchValue(fields.pitchDeg, 'deg', fields.pitchDegUnit);
  };

  // When user types in input (truss mode), convert from selected unit to degrees for storage
  const handlePitchDegTrussChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      pitchDeg: value
        ? convertPitchValue(value, prev.pitchDegUnit, 'deg')
        : ''
    }));
  };

  // When user changes dropdown (truss mode), update unit and convert stored value for display
  const handlePitchDegTrussUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      pitchDegUnit: e.target.value
    }));
  };

  // --- Roof pitch (rafter mode) display and handlers ---
  // Display value for pitchDeg in selected unit (rafter mode)
  const getPitchDegRafterDisplay = () => {
    if (!fields.pitchDeg) return '';
    // Always store as degrees, display in selected unit
    return convertPitchValue(fields.pitchDeg, 'deg', fields.pitchDegUnit);
  };

  // When user types in input (rafter mode), convert from selected unit to degrees for storage
  const handlePitchDegRafterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      pitchDeg: value
        ? convertPitchValue(value, prev.pitchDegUnit, 'deg')
        : ''
    }));
  };

  // When user changes dropdown (rafter mode), update unit only
  const handlePitchDegRafterUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      pitchDegUnit: e.target.value
    }));
  };

  // Installation cost (with dropdown and display conversion)
  const getInstallCostDisplay = () =>
    fields.installCost
      ? convertInstall(fields.installCost, 'hr', fields.installCostUnit)
      : '';

  const handleInstallCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always store as hr internally
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      installCost: value
        ? convertInstall(value, prev.installCostUnit, 'hr')
        : ''
    }));
  };
  const handleInstallCostUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      installCostUnit: e.target.value
    }));
  };

  // Installation duration (with dropdown and display conversion)
  const getInstallDurationDisplay = () =>
    fields.installDuration
      ? convertDuration(fields.installDuration, 'hrs', fields.installDurationUnit)
      : '';

  const handleInstallDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always store as hrs internally
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      installDuration: value
        ? convertDuration(value, prev.installDurationUnit, 'hrs')
        : ''
    }));
  };
  const handleInstallDurationUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFields(prev => ({
      ...prev,
      installDurationUnit: e.target.value
    }));
  };

  // --- Roof pitch input handlers with auto-calculation and validation ---
  // Angle (deg) input
  const handlePitchDegInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    let percent = '';
    let p12 = '';
    if (value) {
      const deg = parseFloat(value);
      if (isNaN(deg) || deg < 0) {
        error = 'Angle must be a positive number.';
      } else if (deg >= 90) {
        error = 'Angle must be smaller than 90 degrees.';
      } else if (deg > 85) {
        error = 'Warning: Angle is very steep and may not be practical.';
      } else {
        percent = (Math.tan(deg * Math.PI / 180) * 100).toFixed(3).replace(/\.?0+$/, '');
        p12 = (Math.tan(deg * Math.PI / 180) * 12).toFixed(3).replace(/\.?0+$/, '');
      }
    }
    setFields(prev => ({
      ...prev,
      pitchDeg: value,
      pitchPercent: percent,
      pitch12: p12
    }));
    setErrors(prev => ({
      ...prev,
      pitchDeg: error,
      pitchPercent: '',
      pitch12: ''
    }));
  };

  // Percent input
  const handlePitchPercentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    let deg = '';
    let p12 = '';
    if (value) {
      const percent = parseFloat(value);
      if (isNaN(percent) || percent < 0) {
        error = 'Percent must be a positive number.';
      } else if (percent > 85) {
        error = 'Percent must be less than 85.';
      } else {
        deg = (Math.atan(percent / 100) * 180 / Math.PI).toFixed(3).replace(/\.?0+$/, '');
        p12 = ((percent / 100) * 12).toFixed(3).replace(/\.?0+$/, '');
      }
    }
    setFields(prev => ({
      ...prev,
      pitchDeg: deg,
      pitchPercent: value,
      pitch12: p12
    }));
    setErrors(prev => ({
      ...prev,
      pitchDeg: '',
      pitchPercent: error,
      pitch12: ''
    }));
  };

  // :12 input
  const handlePitch12Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    let deg = '';
    let percent = '';
    if (value) {
      const p12 = parseFloat(value);
      if (isNaN(p12) || p12 < 0) {
        error = 'Value must be a positive number.';
      } else if (p12 > 12) {
        error = 'Value must be less than or equal to 12.';
      } else {
        deg = (Math.atan(p12 / 12) * 180 / Math.PI).toFixed(3).replace(/\.?0+$/, '');
        percent = ((p12 / 12) * 100).toFixed(3).replace(/\.?0+$/, '');
      }
    }
    setFields(prev => ({
      ...prev,
      pitchDeg: deg,
      pitchPercent: percent,
      pitch12: value
    }));
    setErrors(prev => ({
      ...prev,
      pitchDeg: '',
      pitchPercent: '',
      pitch12: error
    }));
  };

  // Generic handler for radio/select/checkbox/other fields
  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFields(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFields(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleClear = () => setFields(initialState);

  // --- RAFTER MODE VALIDATION HANDLERS ---
  // Only apply these when fields.mode === 'rafter'
  const handleRafterRiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (fields.mode === 'rafter') {
      if (value && parseFloat(value) < 0) {
        error = 'Rise cannot be a negative number.';
      }
    }
    setFields(prev => ({
      ...prev,
      riseM: value ? toMeters(value, prev.riseUnit).toString() : ''
    }));
    setErrors(prev => ({
      ...prev,
      rise: error
    }));
  };

  const handleRafterRunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (fields.mode === 'rafter') {
      if (value && parseFloat(value) < 0) {
        error = 'Run cannot be a negative number.';
      }
    }
    setFields(prev => ({
      ...prev,
      runM: value ? toMeters(value, prev.runUnit).toString() : ''
    }));
    setErrors(prev => ({
      ...prev,
      run: error
    }));
  };

  const handleRafterPitchDegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (fields.mode === 'rafter') {
      const deg = parseFloat(value);
      if (value && (isNaN(deg) || deg < 0)) {
        error = 'Angle must be a positive number.';
      } else if (deg >= 90) {
        error = 'Angle must be smaller than 90 degrees.';
      }
    }
    setFields(prev => ({
      ...prev,
      pitchDeg: value
        ? convertPitchValue(value, prev.pitchDegUnit, 'deg')
        : ''
    }));
    setErrors(prev => ({
      ...prev,
      pitchDeg: error
    }));
  };

  const handleRafterPitchPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (fields.mode === 'rafter') {
      const percent = parseFloat(value);
      if (value && (isNaN(percent) || percent < 0)) {
        error = 'Percent must be a positive number.';
      }
    }
    setFields(prev => ({
      ...prev,
      pitchPercent: value
    }));
    setErrors(prev => ({
      ...prev,
      pitchPercent: error
    }));
  };

  const handleRafterPitch12Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (fields.mode === 'rafter') {
      const p12 = parseFloat(value);
      if (value && (isNaN(p12) || p12 < 0)) {
        error = 'Value must be a positive number.';
      }
    }
    setFields(prev => ({
      ...prev,
      pitch12: value
    }));
    setErrors(prev => ({
      ...prev,
      pitch12: error
    }));
  };

  // --- Rafter mode: calculation helpers for all reverse flows ---
  // Helper to get pitch as percent from rise/run
  const getPitchPercentFromRiseRun = (rise: number, run: number) =>
    run !== 0 ? ((rise / run) * 100).toString() : '';

  // Helper to get pitch as :12 from rise/run
  const getPitch12FromRiseRun = (rise: number, run: number) =>
    run !== 0 ? ((rise / run) * 12).toString() : '';

  // Helper to get pitch angle (deg) from rise/run
  const getPitchDegFromRiseRun = (rise: number, run: number) =>
    run !== 0 ? (Math.atan(rise / run) * 180 / Math.PI).toString() : '';

  // Helper to get rise from run and pitch percent
  const getRiseFromRunPitchPercent = (run: number, percent: number) =>
    (run * percent / 100).toString();

  // Helper to get rise from run and pitch :12
  const getRiseFromRunPitch12 = (run: number, pitch12: number) =>
    (run * pitch12 / 12).toString();

  // Helper to get rise from run and pitch angle (deg)
  const getRiseFromRunPitchDeg = (run: number, deg: number) =>
    (run * Math.tan(deg * Math.PI / 180)).toString();

  // Helper to get run from rise and pitch percent
  const getRunFromRisePitchPercent = (rise: number, percent: number) =>
    percent !== 0 ? (rise / (percent / 100)).toString() : '';

  // Helper to get run from rise and pitch :12
  const getRunFromRisePitch12 = (rise: number, pitch12: number) =>
    pitch12 !== 0 ? (rise / (pitch12 / 12)).toString() : '';

  // Helper to get run from rise and pitch angle (deg)
  const getRunFromRisePitchDeg = (rise: number, deg: number) =>
    Math.tan(deg * Math.PI / 180) !== 0 ? (rise / Math.tan(deg * Math.PI / 180)).toString() : '';

  // Helper to get rafter length from rise/run
  const getRafterLengthFromRiseRun = (rise: number, run: number) =>
    (Math.sqrt(rise * rise + run * run)).toString();

  // Helper to get rafter length from run and pitch percent
  const getRafterLengthFromRunPitchPercent = (run: number, percent: number) =>
    (run * Math.sqrt((percent / 100) ** 2 + 1)).toString();

  // Helper to get rafter length from run and pitch :12
  const getRafterLengthFromRunPitch12 = (run: number, pitch12: number) =>
    (run * Math.sqrt((pitch12 / 12) ** 2 + 1)).toString();

  // Helper to get rafter length from run and pitch angle (deg)
  const getRafterLengthFromRunPitchDeg = (run: number, deg: number) =>
    (run / Math.cos(deg * Math.PI / 180)).toString();

  // Helper to get rise from rafter/run
  const getRiseFromRafterRun = (rafter: number, run: number) =>
    rafter > run ? Math.sqrt(rafter * rafter - run * run).toString() : '';

  // Helper to get run from rafter/rise
  const getRunFromRafterRise = (rafter: number, rise: number) =>
    rafter > rise ? Math.sqrt(rafter * rafter - rise * rise).toString() : '';

  // Helper to get run from rafter/pitch percent
  const getRunFromRafterPitchPercent = (rafter: number, percent: number) =>
    rafter > 0 ? (rafter / Math.sqrt((percent / 100) ** 2 + 1)).toString() : '';

  // Helper to get run from rafter/pitch :12
  const getRunFromRafterPitch12 = (rafter: number, pitch12: number) =>
    rafter > 0 ? (rafter / Math.sqrt((pitch12 / 12) ** 2 + 1)).toString() : '';

  // Helper to get run from rafter/pitch deg
  const getRunFromRafterPitchDeg = (rafter: number, deg: number) =>
    rafter > 0 ? (rafter * Math.cos(deg * Math.PI / 180)).toString() : '';

  // --- Rafter mode: main calculation logic ---
  let riseM = fields.riseM;
  let runM = fields.runM;
  let rafterLengthM = fields.rafterLengthM;
  let pitchDeg = fields.pitchDeg;
  let pitchPercent = fields.pitchPercent;
  let pitch12 = fields.pitch12;

  if (fields.mode === 'rafter') {
    // All values in meters and degrees
    const rise = parseFloat(fields.riseM) || 0;
    const run = parseFloat(fields.runM) || 0;
    const rafter = parseFloat(fields.rafterLengthM) || 0;
    const deg = parseFloat(fields.pitchDeg) || 0;
    const percent = parseFloat(fields.pitchPercent) || 0;
    const p12 = parseFloat(fields.pitch12) || 0;

    // --- RISE MODE ---
    if (fields.rafterInclude === 'rise') {
      // If two of rise, run, rafterLength are filled, calculate the third
      if (rise && run && !rafter) {
        rafterLengthM = getRafterLengthFromRiseRun(rise, run);
      } else if (rafter && run && !rise) {
        riseM = getRiseFromRafterRun(rafter, run);
      } else if (rafter && rise && !run) {
        runM = getRunFromRafterRise(rafter, rise);
      }
      // Calculate pitch fields from rise/run if both are present
      if (rise && run) {
        pitchDeg = getPitchDegFromRiseRun(rise, run);
        pitchPercent = getPitchPercentFromRiseRun(rise, run);
        pitch12 = getPitch12FromRiseRun(rise, run);
      }
    }
    // --- PITCH MODE ---
    if (fields.rafterInclude === 'pitch') {
      // If run and pitchDeg, pitchPercent, or pitch12 are filled, calculate rise and rafterLength
      if (run) {
        if (fields.pitchDeg) {
          const deg = parseFloat(fields.pitchDeg) || 0;
          riseM = getRiseFromRunPitchDeg(run, deg);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(riseM), run);
          pitchPercent = ((Math.tan(deg * Math.PI / 180)) * 100).toString();
          pitch12 = (Math.tan(deg * Math.PI / 180) * 12).toString();
        } else if (fields.pitchPercent) {
          const percent = parseFloat(fields.pitchPercent) || 0;
          riseM = getRiseFromRunPitchPercent(run, percent);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(riseM), run);
          pitchDeg = Math.atan(percent / 100) * 180 / Math.PI + '';
          pitch12 = (percent / 100 * 12).toString();
        } else if (fields.pitch12) {
          const p12 = parseFloat(fields.pitch12) || 0;
          riseM = getRiseFromRunPitch12(run, p12);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(riseM), run);
          pitchDeg = Math.atan(p12 / 12) * 180 / Math.PI + '';
          pitchPercent = ((p12 / 12) * 100).toString();
        }
      }
      // If rafterLength and pitchDeg, pitchPercent, or pitch12 are filled, calculate run and rise
      if (fields.rafterLengthM) {
        if (fields.pitchDeg) {
          const deg = parseFloat(fields.pitchDeg) || 0;
          runM = getRunFromRafterPitchDeg(parseFloat(fields.rafterLengthM), deg);
          riseM = getRiseFromRunPitchDeg(parseFloat(runM), deg);
          pitchPercent = ((Math.tan(deg * Math.PI / 180)) * 100).toString();
          pitch12 = (Math.tan(deg * Math.PI / 180) * 12).toString();
        } else if (fields.pitchPercent) {
          const percent = parseFloat(fields.pitchPercent) || 0;
          runM = getRunFromRafterPitchPercent(parseFloat(fields.rafterLengthM), percent);
          riseM = getRiseFromRunPitchPercent(parseFloat(runM), percent);
          pitchDeg = Math.atan(percent / 100) * 180 / Math.PI + '';
          pitch12 = (percent / 100 * 12).toString();
        } else if (fields.pitch12) {
          const p12 = parseFloat(fields.pitch12) || 0;
          runM = getRunFromRafterPitch12(parseFloat(fields.rafterLengthM), p12);
          riseM = getRiseFromRunPitch12(parseFloat(runM), p12);
          pitchDeg = Math.atan(p12 / 12) * 180 / Math.PI + '';
          pitchPercent = ((p12 / 12) * 100).toString();
        }
      }
      // If rise and pitchDeg, pitchPercent, or pitch12 are filled, calculate run and rafterLength
      if (fields.riseM) {
        if (fields.pitchDeg) {
          const deg = parseFloat(fields.pitchDeg) || 0;
          runM = getRunFromRisePitchDeg(parseFloat(fields.riseM), deg);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(fields.riseM), parseFloat(runM));
          pitchPercent = ((Math.tan(deg * Math.PI / 180)) * 100).toString();
          pitch12 = (Math.tan(deg * Math.PI / 180) * 12).toString();
        } else if (fields.pitchPercent) {
          const percent = parseFloat(fields.pitchPercent) || 0;
          runM = getRunFromRisePitchPercent(parseFloat(fields.riseM), percent);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(fields.riseM), parseFloat(runM));
          pitchDeg = Math.atan(percent / 100) * 180 / Math.PI + '';
          pitch12 = (percent / 100 * 12).toString();
        } else if (fields.pitch12) {
          const p12 = parseFloat(fields.pitch12) || 0;
          runM = getRunFromRisePitch12(parseFloat(fields.riseM), p12);
          rafterLengthM = getRafterLengthFromRiseRun(parseFloat(fields.riseM), parseFloat(runM));
          pitchDeg = Math.atan(p12 / 12) * 180 / Math.PI + '';
          pitchPercent = ((p12 / 12) * 100).toString();
        }
      }
    }
  }

  // --- Truss mode: calculation logic ---
  let trussCount = '';
  if (fields.mode === 'truss' && fields.roofLengthM && fields.spacingM) {
    const roofLenM = parseFloat(fields.roofLengthM);
    const spacingM = parseFloat(fields.spacingM);
    if (roofLenM > 0 && spacingM > 0) {
      trussCount = Math.ceil(roofLenM / spacingM + 1).toString();
    }
  }

  // --- Truss mode: total cost calculation ---
  let totalCost = '';
  if (fields.trussCost && trussCount) {
    let cost = parseFloat(fields.trussCost) * parseInt(trussCount);
    if (
      fields.mode === 'truss' &&
      fields.includeInstall &&
      fields.installCost &&
      fields.installDuration
    ) {
      const installCost = parseFloat(fields.installCost) || 0;
      const installDuration = parseFloat(fields.installDuration) || 0;
      cost += installCost * installDuration;
    }
    totalCost = cost ? cost.toFixed(2) : '';
  }

  // --- Rafter mode: update fields for UI display ---
  // These are used for display only, not for input fields
  const rafterLength =
    fields.mode === 'rafter'
      ? rafterLengthM
      : fields.mode === 'truss'
      ? ''
      : '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Roof Truss Calculator</h1>
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          {/* Mode selection */}
          <div className="mb-4 flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="truss"
                checked={fields.mode === 'truss'}
                onChange={handleOtherChange}
                className="accent-blue-600"
              />
              <span>truss count</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="rafter"
                checked={fields.mode === 'rafter'}
                onChange={handleOtherChange}
                className="accent-blue-600"
              />
              <span>rafter length</span>
            </label>
          </div>
          {/* Images and UI for truss count */}
          {fields.mode === 'truss' && (
            <>
              <div className="flex flex-col items-center mb-4">
                <img src="/truss1.svg" alt="Truss diagram" className="mb-2 w-64" />
                <img src="/truss01.svg" alt="Roof length" className="w-48" />
              </div>
              {/* Roof length */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Roof length</label>
                <div className="flex">
                  <input
                    type="number"
                    name="roofLength"
                    value={getDisplayValue(fields.roofLengthM, fields.roofLengthUnit)}
                    onChange={handleRoofLengthChange}
                    className={`flex-1 border ${errors.roofLength ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                  />
                  <select
                    name="roofLengthUnit"
                    value={fields.roofLengthUnit}
                    onChange={handleRoofLengthUnitChange}
                    className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    {roofLengthUnits.map(u => (
                      <option key={u.unit} value={u.unit}>{u.label}</option>
                    ))}
                  </select>
                </div>
                {errors.roofLength && (
                  <div className="text-xs text-red-600 mt-1">{errors.roofLength}</div>
                )}
              </div>
              {/* On-center spacing */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  On-center spacing
                  <span className="ml-1 text-gray-400" title="Distance between trusses, measured from center to center.">ⓘ</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="spacing"
                    value={getDisplayValue(fields.spacingM, fields.spacingUnit)}
                    onChange={handleSpacingChange}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <select
                    name="spacingUnit"
                    value={fields.spacingUnit}
                    onChange={handleSpacingUnitChange}
                    className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    {spacingUnits.map(u => (
                      <option key={u.unit} value={u.unit}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Truss count */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Truss count
                  <span className="ml-1 text-gray-400" title="Calculated number of trusses needed.">ⓘ</span>
                </label>
                <input
                  type="number"
                  name="trussCount"
                  value={trussCount}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  placeholder=""
                />
              </div>
              {/* Roof pitch fields (first input with dropdown and display conversion, others plain) */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Roof pitch <span className="ml-1 text-gray-400" title="Pitch in degrees">ⓘ</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="pitchDeg"
                    value={fields.pitchDeg}
                    onChange={handlePitchDegInput}
                    className={`flex-1 border ${errors.pitchDeg ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                    placeholder=""
                  />
                  <select
                    name="pitchDegUnit"
                    value={fields.pitchDegUnit}
                    onChange={handlePitchDegTrussUnitChange}
                    className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    {pitchDegUnits.map(u => (
                      <option key={u.unit} value={u.unit}>{u.label}</option>
                    ))}
                  </select>
                </div>
                {errors.pitchDeg && (
                  <div className="text-xs text-red-600 mt-1">{errors.pitchDeg}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Roof pitch <span className="ml-1 text-gray-400" title="Pitch as percent">ⓘ</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="pitchPercent"
                    value={fields.pitchPercent}
                    onChange={handlePitchPercentInput}
                    className={`flex-1 border ${errors.pitchPercent ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                    placeholder=""
                  />
                  <span className="w-20 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">%</span>
                </div>
                {errors.pitchPercent && (
                  <div className="text-xs text-red-600 mt-1">{errors.pitchPercent}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Roof pitch <span className="ml-1 text-gray-400" title="Pitch as :12">ⓘ</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="pitch12"
                    value={fields.pitch12}
                    onChange={handlePitch12Input}
                    className={`flex-1 border ${errors.pitch12 ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                    placeholder=""
                  />
                  <span className="w-20 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">:12</span>
                </div>
                {errors.pitch12 && (
                  <div className="text-xs text-red-600 mt-1">{errors.pitch12}</div>
                )}
              </div>
              {/* Rafter length */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Rafter length</label>
                <div className="flex">
                  <input
                    type="number"
                    name="rafterLength"
                    value={getDisplayValue(rafterLength, fields.rafterLengthUnit)}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                    placeholder=""
                  />
                  <select
                    name="rafterLengthUnit"
                    value={fields.rafterLengthUnit}
                    onChange={handleRafterLengthUnitChange}
                    className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                  >
                    {rafterLengthUnits.map(u => (
                      <option key={u.unit} value={u.unit}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {/* Images and UI for rafter length */}
          {fields.mode === 'rafter' && (
            <>
              <div className="flex flex-col items-center mb-4">
                <img src="/truss02.svg" alt="Rafter diagram" className="mb-2 w-64" />
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Calculation should include...</div>
                <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rafterInclude"
                      value="rise"
                      checked={fields.rafterInclude === 'rise'}
                      onChange={handleOtherChange}
                      className="accent-blue-600"
                    />
                    <span>roof rise</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rafterInclude"
                      value="pitch"
                      checked={fields.rafterInclude === 'pitch'}
                      onChange={handleOtherChange}
                      className="accent-blue-600"
                    />
                    <span>roof pitch</span>
                  </label>
                </div>
              </div>
              {fields.rafterInclude === 'rise' && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Rise</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="rise"
                        value={getDisplayValue(fields.riseM, fields.riseUnit)}
                        onChange={handleRafterRiseChange}
                        className={`flex-1 border ${errors.rise ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                      />
                      <select
                        name="riseUnit"
                        value={fields.riseUnit}
                        onChange={handleRiseUnitChange}
                        className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {riseUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.rise && (
                      <div className="text-xs text-red-600 mt-1">{errors.rise}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Run</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="run"
                        value={getDisplayValue(fields.runM, fields.runUnit)}
                        onChange={handleRafterRunChange}
                        className={`flex-1 border ${errors.run ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                      />
                      <select
                        name="runUnit"
                        value={fields.runUnit}
                        onChange={handleRunUnitChange}
                        className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {runUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.run && (
                      <div className="text-xs text-red-600 mt-1">{errors.run}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Rafter length</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="rafterLength"
                        value={getDisplayValue(rafterLength, fields.rafterLengthUnit)}
                        readOnly
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                      />
                      <select
                        name="rafterLengthUnit"
                        value={fields.rafterLengthUnit}
                        onChange={handleRafterLengthUnitChange}
                        className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {rafterLengthUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {fields.rafterInclude === 'pitch' && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Run</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="run"
                        value={getDisplayValue(fields.runM, fields.runUnit)}
                        onChange={handleRafterRunChange}
                        className={`flex-1 border ${errors.run ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                      />
                      <select
                        name="runUnit"
                        value={fields.runUnit}
                        onChange={handleRunUnitChange}
                        className="w-20 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {runUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.run && (
                      <div className="text-xs text-red-600 mt-1">{errors.run}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Roof pitch <span className="ml-1 text-gray-400" title="Pitch in degrees">ⓘ</span>
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="pitchDeg"
                        value={getPitchDegRafterDisplay()}
                        onChange={handleRafterPitchDegChange}
                        className={`flex-1 border ${errors.pitchDeg ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                        placeholder=""
                      />
                      <select
                        name="pitchDegUnit"
                        value={fields.pitchDegUnit}
                        onChange={handlePitchDegRafterUnitChange}
                        className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {pitchDegUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.pitchDeg && (
                      <div className="text-xs text-red-600 mt-1">{errors.pitchDeg}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Roof pitch <span className="ml-1 text-gray-400" title="Pitch as percent">ⓘ</span>
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="pitchPercent"
                        value={fields.pitchPercent}
                        onChange={handleRafterPitchPercentChange}
                        className={`flex-1 border ${errors.pitchPercent ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                        placeholder=""
                      />
                      <span className="w-20 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">%</span>
                    </div>
                    {errors.pitchPercent && (
                      <div className="text-xs text-red-600 mt-1">{errors.pitchPercent}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Roof pitch <span className="ml-1 text-gray-400" title="Pitch as :12">ⓘ</span>
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="pitch12"
                        value={fields.pitch12}
                        onChange={handleRafterPitch12Change}
                        className={`flex-1 border ${errors.pitch12 ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 text-sm focus:outline-none`}
                        placeholder=""
                      />
                      <span className="w-20 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white">:12</span>
                    </div>
                    {errors.pitch12 && (
                      <div className="text-xs text-red-600 mt-1">{errors.pitch12}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Rafter length</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="rafterLength"
                        value={getDisplayValue(rafterLength, fields.rafterLengthUnit)}
                        readOnly
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm bg-gray-50"
                      />
                      <select
                        name="rafterLengthUnit"
                        value={fields.rafterLengthUnit}
                        onChange={handleRafterLengthUnitChange}
                        className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                      >
                        {rafterLengthUnits.map(u => (
                          <option key={u.unit} value={u.unit}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {/* Expenses: only show if mode is 'truss' */}
        {fields.mode === 'truss' && (
          <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
            <h2 className="text-base font-semibold mb-2">Expenses</h2>
            <div className="mb-3 flex items-center gap-2">
              <input
                type="checkbox"
                name="includeInstall"
                checked={fields.includeInstall}
                onChange={handleOtherChange}
                className="accent-blue-600"
              />
              <label className="text-sm font-medium">Include installation costs</label>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Single truss cost</label>
              <input
                type="number"
                name="trussCost"
                value={fields.trussCost}
                onChange={handleOtherChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="PKR"
              />
            </div>
            {/* Show installation fields only if truss mode and includeInstall is checked */}
            {fields.includeInstall && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Installation cost</label>
                  <div className="flex">
                    <input
                      type="number"
                      name="installCost"
                      value={getInstallCostDisplay()}
                      onChange={handleInstallCostChange}
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none"
                      placeholder="PKR"
                    />
                    <select
                      name="installCostUnit"
                      value={fields.installCostUnit}
                      onChange={handleInstallCostUnitChange}
                      className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                    >
                      {installCostUnits.map(u => (
                        <option key={u.unit} value={u.unit}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Installation duration</label>
                  <div className="flex">
                    <input
                      type="number"
                      name="installDuration"
                      value={getInstallDurationDisplay()}
                      onChange={handleInstallDurationChange}
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none"
                      placeholder=""
                    />
                    <select
                      name="installDurationUnit"
                      value={fields.installDurationUnit}
                      onChange={handleInstallDurationUnitChange}
                      className="w-32 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white"
                    >
                      {installDurationUnits.map(u => (
                        <option key={u.unit} value={u.unit}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Total expenses</label>
              <input
                type="number"
                name="totalCost"
                value={totalCost}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                placeholder="PKR"
              />
            </div>
          </div>
        )}
        {/* Clear Button */}
        <div className="flex justify-center">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
            onClick={handleClear}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
