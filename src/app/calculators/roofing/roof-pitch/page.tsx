"use client"
import { useState, useEffect } from 'react';

// Define unit types
type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd' | 'ft-in' | 'm-cm';
type AngleUnit = 'deg' | 'rad';

export default function RoofPitchCalculator() {
  // State for input values (stored in base unit - meters)
  const [riseBase, setRiseBase] = useState<number>(0);
  const [runBase, setRunBase] = useState<number>(0);
  
  // State for displayed values
  const [riseDisplay, setRiseDisplay] = useState<string>('');
  const [runDisplay, setRunDisplay] = useState<string>('');
  
  // State for compound unit values
  const [riseFt, setRiseFt] = useState<string>('');
  const [riseIn, setRiseIn] = useState<string>('');
  const [riseM, setRiseM] = useState<string>('');
  const [riseCm, setRiseCm] = useState<string>('');
  
  const [runFt, setRunFt] = useState<string>('');
  const [runIn, setRunIn] = useState<string>('');
  const [runM, setRunM] = useState<string>('');
  const [runCm, setRunCm] = useState<string>('');
  
  const [rafterFt, setRafterFt] = useState<string>('');
  const [rafterIn, setRafterIn] = useState<string>('');
  const [rafterM, setRafterM] = useState<string>('');
  const [rafterCm, setRafterCm] = useState<string>('');
  
  // State for result values (display only)
  const [rafterDisplay, setRafterDisplay] = useState<string>('');
  const [pitchDisplay, setPitchDisplay] = useState<string>(''); // Now directly editable by user
  const [pitchPercentDisplay, setPitchPercentDisplay] = useState<string>('');
  const [pitchRatioDisplay, setPitchRatioDisplay] = useState<string>('');
  
  // State for unit selections
  const [riseUnit, setRiseUnit] = useState<LengthUnit>('mm');
  const [runUnit, setRunUnit] = useState<LengthUnit>('mm');
  const [rafterUnit, setRafterUnit] = useState<LengthUnit>('m');
  const [pitchUnit, setPitchUnit] = useState<AngleUnit>('deg');
  
  // State for calculated values (in base units)
  const [rafterBase, setRafterBase] = useState<number>(0);
  const [pitchBase, setPitchBase] = useState<number>(0);
  const [pitchPercent, setPitchPercent] = useState<number>(0);
  const [pitchRatio, setPitchRatio] = useState<number>(0);
  
  // State for validation errors
  const [errors, setErrors] = useState({
    rise: '',
    run: '',
    pitch: ''
  });

  // Conversion factors to meters
  const lengthConversion: Record<LengthUnit, number> = {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'ft-in': 0.3048,
    'm-cm': 1
  };

  // Format number with commas for thousands and max 4 decimal places
  const formatNumber = (value: number): string => {
    if (value === 0) return '0';
    
    const parts = value.toFixed(4).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0+$/, '');
      return parts[1].length > 0 ? parts.join('.') : parts[0];
    }
    
    return parts[0];
  };

  // Convert from base units to the desired unit for display
  const convertFromBase = (value: number, unit: LengthUnit): string => {
    if (value === 0) return '0';
    const converted = value / lengthConversion[unit];
    return formatNumber(converted);
  };

  // Convert displayed value to base units
  const convertToBase = (value: string, unit: LengthUnit): number => {
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return 0;
    
    return numValue * lengthConversion[unit];
  };

  // Convert compound ft-in to base units
  const convertFtInToBase = (ft: string, inches: string): number => {
    const ftValue = parseFloat(ft.replace(/,/g, '')) || 0;
    const inValue = parseFloat(inches.replace(/,/g, '')) || 0;
    return (ftValue * 0.3048) + (inValue * 0.0254);
  };

  // Convert compound m-cm to base units
  const convertMCmToBase = (m: string, cm: string): number => {
    const mValue = parseFloat(m.replace(/,/g, '')) || 0;
    const cmValue = parseFloat(cm.replace(/,/g, '')) || 0;
    return mValue + (cmValue / 100);
  };

  // Convert base units to ft-in
  const convertBaseToFtIn = (value: number): { ft: string, inches: string } => {
    if (value === 0) return { ft: '0', inches: '0' };
    
    const totalInches = value / 0.0254;
    const ft = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    
    return { ft: formatNumber(ft), inches: formatNumber(inches) };
  };

  // Convert base units to m-cm
  const convertBaseToMCm = (value: number): { m: string, cm: string } => {
    if (value === 0) return { m: '0', cm: '0' };
    
    const meters = Math.floor(value);
    const cm = (value - meters) * 100;
    
    return { m: formatNumber(meters), cm: formatNumber(cm) };
  };

  // Convert angle from degrees to the desired unit
  const convertAngle = (degrees: number, unit: AngleUnit): string => {
    if (degrees === 0) return '0';
    
    const angleValue = unit === 'deg' ? degrees : (degrees * Math.PI / 180);
    return formatNumber(angleValue);
  };

  // Update displayed values when units change
  useEffect(() => {
    if (riseBase !== 0) {
      if (riseUnit === 'ft-in') {
        const { ft, inches } = convertBaseToFtIn(riseBase);
        setRiseFt(ft);
        setRiseIn(inches);
      } else if (riseUnit === 'm-cm') {
        const { m, cm } = convertBaseToMCm(riseBase);
        setRiseM(m);
        setRiseCm(cm);
      } else {
        setRiseDisplay(convertFromBase(riseBase, riseUnit));
      }
    }
  }, [riseUnit, riseBase]);

  useEffect(() => {
    if (runBase !== 0) {
      if (runUnit === 'ft-in') {
        const { ft, inches } = convertBaseToFtIn(runBase);
        setRunFt(ft);
        setRunIn(inches);
      } else if (runUnit === 'm-cm') {
        const { m, cm } = convertBaseToMCm(runBase);
        setRunM(m);
        setRunCm(cm);
      } else {
        setRunDisplay(convertFromBase(runBase, runUnit));
      }
    }
  }, [runUnit, runBase]);

  useEffect(() => {
    if (rafterBase !== 0) {
      if (rafterUnit === 'ft-in') {
        const { ft, inches } = convertBaseToFtIn(rafterBase);
        setRafterFt(ft);
        setRafterIn(inches);
      } else if (rafterUnit === 'm-cm') {
        const { m, cm } = convertBaseToMCm(rafterBase);
        setRafterM(m);
        setRafterCm(cm);
      } else {
        setRafterDisplay(convertFromBase(rafterBase, rafterUnit));
      }
    }
  }, [rafterUnit, rafterBase]);

  useEffect(() => {
    if (pitchBase !== 0) {
      setPitchDisplay(convertAngle(pitchBase, pitchUnit));
    }
  }, [pitchUnit, pitchBase]);

  useEffect(() => {
    if (pitchPercent !== 0) {
      setPitchPercentDisplay(formatNumber(pitchPercent));
    }
  }, [pitchPercent]);

  useEffect(() => {
    if (pitchRatio !== 0) {
      setPitchRatioDisplay(formatNumber(pitchRatio));
    }
  }, [pitchRatio]);

  // Calculate all values based on rise and run
  useEffect(() => {
    if (runBase > 0 && riseBase >= 0) {
      const calculatedRafter = Math.sqrt(riseBase * riseBase + runBase * runBase);
      setRafterBase(calculatedRafter);
      
      const calculatedAngle = Math.atan(riseBase / runBase) * (180 / Math.PI);
      setPitchBase(calculatedAngle);
      
      const calculatedPercent = (riseBase / runBase) * 100;
      setPitchPercent(calculatedPercent);
      
      const calculatedRatio = (riseBase / runBase) * 12;
      setPitchRatio(calculatedRatio);
      
      // Update pitch display when rise and run change
      if (pitchUnit === 'deg') {
        setPitchDisplay(formatNumber(calculatedAngle));
      } else {
        const radians = calculatedAngle * (Math.PI / 180);
        setPitchDisplay(formatNumber(radians));
      }
    } else {
      setRafterBase(0);
      setPitchBase(0);
      setPitchPercent(0);
      setPitchRatio(0);
      setPitchDisplay('');
    }
  }, [riseBase, runBase, pitchUnit]);

  // Handle pitch input change - This is the primary input now
  const handlePitchChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    
    setPitchDisplay(value);
    
    if (cleanValue.trim() !== '' && !isNaN(parseFloat(cleanValue))) {
      const numValue = parseFloat(cleanValue);
      
      if (numValue < 0 || numValue > 89) {
        setErrors(prev => ({ ...prev, pitch: 'Value must be between 0 and 90 degrees' }));
        return;
      } else {
        setErrors(prev => ({ ...prev, pitch: '' }));
      }
      
      // Store the pitch base value
      const newPitchBase = pitchUnit === 'rad' ? numValue * (180 / Math.PI) : numValue;
      setPitchBase(newPitchBase);
      
      // Calculate the new rise based on pitch and run
      if (runBase > 0) {
        const newRiseBase = runBase * Math.tan(newPitchBase * (Math.PI / 180));
        setRiseBase(newRiseBase);
        
        // Update displayed rise value based on current unit
        if (riseUnit === 'ft-in') {
          const { ft, inches } = convertBaseToFtIn(newRiseBase);
          setRiseFt(ft);
          setRiseIn(inches);
        } else if (riseUnit === 'm-cm') {
          const { m, cm } = convertBaseToMCm(newRiseBase);
          setRiseM(m);
          setRiseCm(cm);
        } else {
          setRiseDisplay(convertFromBase(newRiseBase, riseUnit));
        }
        
        // Calculate the pitch percentage and ratio
        const calculatedPercent = (newRiseBase / runBase) * 100;
        setPitchPercent(calculatedPercent);
        
        const calculatedRatio = (newRiseBase / runBase) * 12;
        setPitchRatio(calculatedRatio);
        
        // Calculate rafter length
        const calculatedRafter = Math.sqrt(newRiseBase * newRiseBase + runBase * runBase);
        setRafterBase(calculatedRafter);
      }
    } else {
      setPitchBase(0);
      setErrors(prev => ({ ...prev, pitch: '' }));
    }
  };

  // Handle rise input change
  const handleRiseChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    
    setRiseDisplay(value);
    
    if (cleanValue.trim() !== '' && !isNaN(parseFloat(cleanValue))) {
      const numValue = parseFloat(cleanValue);
      
      if (numValue < 0) {
        setErrors(prev => ({ ...prev, rise: 'Value cannot be negative' }));
        return;
      } else {
        setErrors(prev => ({ ...prev, rise: '' }));
      }
      
      setTimeout(() => {
        setRiseBase(convertToBase(value, riseUnit));
      }, 10);
    } else {
      setRiseBase(0);
      setErrors(prev => ({ ...prev, rise: '' }));
    }
  };

  // Handle rise ft-in change
  const handleRiseFtInChange = (ft: string, inches: string) => {
    setRiseFt(ft);
    setRiseIn(inches);
    
    const ftValue = parseFloat(ft.replace(/,/g, '')) || 0;
    const inValue = parseFloat(inches.replace(/,/g, '')) || 0;
    
    if (ftValue < 0 || inValue < 0) {
      setErrors(prev => ({ ...prev, rise: 'Values cannot be negative' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, rise: '' }));
    }
    
    if ((ft.trim() !== '' && !isNaN(ftValue)) || 
        (inches.trim() !== '' && !isNaN(inValue))) {
      setTimeout(() => {
        setRiseBase(convertFtInToBase(ft, inches));
      }, 10);
    } else {
      setRiseBase(0);
    }
  };

  // Handle rise m-cm change
  const handleRiseMCmChange = (m: string, cm: string) => {
    setRiseM(m);
    setRiseCm(cm);
    
    const mValue = parseFloat(m.replace(/,/g, '')) || 0;
    const cmValue = parseFloat(cm.replace(/,/g, '')) || 0;
    
    if (mValue < 0 || cmValue < 0) {
      setErrors(prev => ({ ...prev, rise: 'Values cannot be negative' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, rise: '' }));
    }
    
    if ((m.trim() !== '' && !isNaN(mValue)) || 
        (cm.trim() !== '' && !isNaN(cmValue))) {
      setTimeout(() => {
        setRiseBase(convertMCmToBase(m, cm));
      }, 10);
    } else {
      setRiseBase(0);
    }
  };

  // Handle run input change
  const handleRunChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    
    setRunDisplay(value);
    
    if (cleanValue.trim() !== '' && !isNaN(parseFloat(cleanValue))) {
      const numValue = parseFloat(cleanValue);
      
      if (numValue <= 0) {
        setErrors(prev => ({ ...prev, run: 'Value must be positive' }));
        return;
      } else {
        setErrors(prev => ({ ...prev, run: '' }));
      }
      
      setTimeout(() => {
        setRunBase(convertToBase(value, runUnit));
      }, 10);
    } else {
      setRunBase(0);
      setErrors(prev => ({ ...prev, run: '' }));
    }
  };

  // Handle run ft-in change
  const handleRunFtInChange = (ft: string, inches: string) => {
    setRunFt(ft);
    setRunIn(inches);
    
    const ftValue = parseFloat(ft.replace(/,/g, '')) || 0;
    const inValue = parseFloat(inches.replace(/,/g, '')) || 0;
    
    if (ftValue <= 0 || inValue < 0) {
      setErrors(prev => ({ ...prev, run: 'Value must be positive' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, run: '' }));
    }
    
    if ((ft.trim() !== '' && !isNaN(ftValue)) || 
        (inches.trim() !== '' && !isNaN(inValue))) {
      setTimeout(() => {
        setRunBase(convertFtInToBase(ft, inches));
      }, 10);
    } else {
      setRunBase(0);
    }
  };

  // Handle run m-cm change
  const handleRunMCmChange = (m: string, cm: string) => {
    setRunM(m);
    setRunCm(cm);
    
    const mValue = parseFloat(m.replace(/,/g, '')) || 0;
    const cmValue = parseFloat(cm.replace(/,/g, '')) || 0;
    
    if (mValue <= 0 || cmValue < 0) {
      setErrors(prev => ({ ...prev, run: 'Value must be positive' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, run: '' }));
    }
    
    if ((m.trim() !== '' && !isNaN(mValue)) || 
        (cm.trim() !== '' && !isNaN(cmValue))) {
      setTimeout(() => {
        setRunBase(convertMCmToBase(m, cm));
      }, 10);
    } else {
      setRunBase(0);
    }
  };

  // Function to reload/clear all inputs
  const reloadCalculator = () => {
    setRiseBase(0);
    setRunBase(0);
    setRiseDisplay('');
    setRunDisplay('');
    setRiseFt('');
    setRiseIn('');
    setRiseM('');
    setRiseCm('');
    setRunFt('');
    setRunIn('');
    setRunM('');
    setRunCm('');
    setRafterFt('');
    setRafterIn('');
    setRafterM('');
    setRafterCm('');
    setRafterDisplay('');
    setPitchDisplay('');
    setPitchPercentDisplay('');
    setPitchRatioDisplay('');
    setRiseUnit('mm');
    setRunUnit('mm');
    setRafterUnit('m');
    setPitchUnit('deg');
    setErrors({
      rise: '',
      run: '',
      pitch: ''
    });
  };

  // Render compound unit inputs
  const renderCompoundUnitInputs = (type: 'rise' | 'run', unit: LengthUnit, 
                                    value1: string, value2: string, 
                                    onChange1: (val: string) => void, onChange2: (val: string) => void) => {
    if (unit === 'ft-in') {
      return (
        <div className="flex">
          <input
            type="text"
            value={value1}
            onChange={(e) => onChange1(e.target.value)}
            className={`w-16 px-2 py-1 border ${errors[type] ? 'border-red-500' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="ft"
          />
          <span className="px-2 py-1 bg-gray-100 border-t border-b border-gray-300">|</span>
          <input
            type="text"
            value={value2}
            onChange={(e) => onChange2(e.target.value)}
            className={`w-16 px-2 py-1 border ${errors[type] ? 'border-red-500' : 'border-gray-300'} rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="in"
          />
        </div>
      );
    } else if (unit === 'm-cm') {
      return (
        <div className="flex">
          <input
            type="text"
            value={value1}
            onChange={(e) => onChange1(e.target.value)}
            className={`w-16 px-2 py-1 border ${errors[type] ? 'border-red-500' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="m"
          />
          <span className="px-2 py-1 bg-gray-100 border-t border-b border-gray-300">|</span>
          <input
            type="text"
            value={value2}
            onChange={(e) => onChange2(e.target.value)}
            className={`w-16 px-2 py-1 border ${errors[type] ? 'border-red-500' : 'border-gray-300'} rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="cm"
          />
        </div>
      );
    } else {
      return (
        <input
          type="text"
          value={type === 'rise' ? riseDisplay : runDisplay}
          onChange={(e) => {
            if (type === 'rise') handleRiseChange(e.target.value);
            else handleRunChange(e.target.value);
          }}
          className={`w-20 px-2 py-1 border ${errors[type] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="0"
        />
      );
    }
  };

  // Render read-only result fields
  const renderResultField = (value: string, unit: LengthUnit | AngleUnit, isCompound: boolean = false) => {
    if (isCompound && (unit === 'ft-in' || unit === 'm-cm')) {
      const [part1, part2] = value.split('|');
      return (
        <div className="flex">
          <input
            type="text"
            value={part1}
            readOnly
            className="w-16 px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50"
          />
          <span className="px-2 py-1 bg-gray-100 border-t border-b border-gray-300">|</span>
          <input
            type="text"
            value={part2}
            readOnly
            className="w-16 px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50"
          />
        </div>
      );
    } else {
      return (
        <input
          type="text"
          value={value}
          readOnly
          className="w-20 px-2 py-1 border border-gray-300 rounded-md bg-gray-50"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <header className="bg-blue-600 text-white p-5 text-center">
          <h1 className="text-2xl font-bold">Roof Pitch Calculator</h1>
        </header>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="font-medium text-gray-700">Rise</label>
              <div className="flex items-center">
                {renderCompoundUnitInputs('rise', riseUnit, 
                  riseUnit === 'ft-in' ? riseFt : riseM, 
                  riseUnit === 'ft-in' ? riseIn : riseCm, 
                  (val) => riseUnit === 'ft-in' 
                    ? handleRiseFtInChange(val, riseIn)
                    : handleRiseMCmChange(val, riseCm),
                  (val) => riseUnit === 'ft-in' 
                    ? handleRiseFtInChange(riseFt, val)
                    : handleRiseMCmChange(riseM, val)
                )}
                <select
                  value={riseUnit}
                  onChange={(e) => setRiseUnit(e.target.value as LengthUnit)}
                  className="ml-2 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                  <option value="yd">yd</option>
                  <option value="ft-in">ft|in</option>
                  <option value="m-cm">m|cm</option>
                </select>
              </div>
            </div>
            {errors.rise && (
              <div className="mt-1 text-red-500 text-sm">{errors.rise}</div>
            )}

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium text-gray-700">Run</label>
              <div className="flex items-center">
                {renderCompoundUnitInputs('run', runUnit, 
                  runUnit === 'ft-in' ? runFt : runM, 
                  runUnit === 'ft-in' ? runIn : runCm, 
                  (val) => runUnit === 'ft-in' 
                    ? handleRunFtInChange(val, runIn)
                    : handleRunMCmChange(val, runCm),
                  (val) => runUnit === 'ft-in' 
                    ? handleRunFtInChange(runFt, val)
                    : handleRunMCmChange(runM, val)
                )}
                <select
                  value={runUnit}
                  onChange={(e) => setRunUnit(e.target.value as LengthUnit)}
                  className="ml-2 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                  <option value="yd">yd</option>
                  <option value="ft-in">ft|in</option>
                  <option value="m-cm">m|cm</option>
                </select>
              </div>
            </div>
            {errors.run && (
              <div className="mt-1 text-red-500 text-sm">{errors.run}</div>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Rafter Length</span>
              <div className="flex items-center">
                {rafterUnit === 'ft-in' ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={rafterFt}
                      readOnly
                      className="w-16 px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50"
                    />
                    <span className="px-2 py-1 bg-gray-100 border-t border-b border-gray-300">|</span>
                    <input
                      type="text"
                      value={rafterIn}
                      readOnly
                      className="w-16 px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50"
                    />
                  </div>
                ) : rafterUnit === 'm-cm' ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={rafterM}
                      readOnly
                      className="w-16 px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50"
                    />
                    <span className="px-2 py-1 bg-gray-100 border-t border-b border-gray-300">|</span>
                    <input
                      type="text"
                      value={rafterCm}
                      readOnly
                      className="w-16 px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={rafterDisplay}
                    readOnly
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md bg-gray-50"
                  />
                )}
                <select
                  value={rafterUnit}
                  onChange={(e) => setRafterUnit(e.target.value as LengthUnit)}
                  className="ml-2 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                  <option value="yd">yd</option>
                  <option value="ft-in">ft|in</option>
                  <option value="m-cm">m|cm</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Roof Pitch</span>
              <div className="flex items-center">
                <input
                  type="text"
                  value={pitchDisplay}
                  onChange={(e) => handlePitchChange(e.target.value)}
                  className={`w-20 px-2 py-1 border ${errors.pitch ? 'border-red-500' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2`}
                  placeholder="0"
                />
                <select
                  value={pitchUnit}
                  onChange={(e) => setPitchUnit(e.target.value as AngleUnit)}
                  className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="deg">deg</option>
                  <option value="rad">rad</option>
                </select>
              </div>
            </div>
            {errors.pitch && (
              <div className="mt-1 text-red-500 text-sm">{errors.pitch}</div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Roof Pitch (%)</span>
              <div className="flex items-center">
                <input
                  type="text"
                  value={pitchPercentDisplay}
                  readOnly
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 mr-2"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Roof Pitch (x:12)</span>
              <div className="flex items-center">
                <input
                  type="text"
                  value={pitchRatioDisplay}
                  readOnly
                  className="w-20 px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50 mr-2"
                />
                <span className="text-sm text-gray-500">:12</span>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="text-center">
            <button
              onClick={reloadCalculator}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Reload Calculator
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
}