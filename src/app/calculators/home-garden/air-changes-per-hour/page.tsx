'use client';

import { useState, useEffect } from 'react';

export default function AirflowCalculator() {
  // State for all input values
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('m²');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('m');
  const [heightM, setHeightM] = useState(''); // For meters in m/cm format
  const [heightCm, setHeightCm] = useState(''); // For centimeters in m/cm format
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [airflow, setAirflow] = useState('');
  const [airflowUnit, setAirflowUnit] = useState('cu ft');
  const [airflowTimeUnit, setAirflowTimeUnit] = useState('min');
  const [ach, setAch] = useState('');

  // Handle area input with thousand separators
  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0)) {
      setArea(value);
    }
  };

  // Handle height input with thousand separators
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0)) {
      setHeight(value);
    }
  };

  // Handle height feet input
  const handleHeightFtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseInt(value) >= 0)) {
      setHeightFt(value);
    }
  };

  // Handle height inches input
  const handleHeightInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0 && parseFloat(value) < 12)) {
      setHeightIn(value);
    }
  };
  
  // Handle height meters input (for m/cm format)
  const handleHeightMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseInt(value) >= 0)) {
      setHeightM(value);
    }
  };
  
  // Handle height centimeters input (for m/cm format)
  const handleHeightCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0 && parseFloat(value) < 100)) {
      setHeightCm(value);
    }
  };

  // Handle airflow input with thousand separators
  const handleAirflowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0)) {
      setAirflow(value);
    }
  };

  // Handle ACH input with thousand separators
  const handleAchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (!isNaN(Number(value)) && parseFloat(value) >= 0)) {
      setAch(value);
    }
  };

  // Format number with thousand separators (only before decimal point)
  const formatNumber = (num: string | number) => {
    if (num === '') return '';
    
    const numString = num.toString();
    const parts = numString.split('.');
    
    // Format the integer part with thousands separators
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // If there's a decimal part, limit it to 3 digits and don't add separators
    if (parts.length > 1) {
      const decimalPart = parts[1].substring(0, 3); // Limit to 3 digits after decimal
      return `${integerPart}.${decimalPart}`;
    }
    
    return integerPart;
  };
  
  // Handle area unit change with conversion
  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (area && area !== '') {
      const areaValue = parseFloat(area.replace(/,/g, ''));
      let convertedValue = areaValue;
      
      // Convert from current unit to new unit
      if (areaUnit === 'm²' && newUnit === 'ft²') {
        convertedValue = areaValue * 10.7639; // m² to ft²
      } else if (areaUnit === 'm²' && newUnit === 'yd²') {
        convertedValue = areaValue * 1.19599; // m² to yd²
      } else if (areaUnit === 'ft²' && newUnit === 'm²') {
        convertedValue = areaValue * 0.092903; // ft² to m²
      } else if (areaUnit === 'ft²' && newUnit === 'yd²') {
        convertedValue = areaValue * 0.111111; // ft² to yd²
      } else if (areaUnit === 'yd²' && newUnit === 'm²') {
        convertedValue = areaValue * 0.836127; // yd² to m²
      } else if (areaUnit === 'yd²' && newUnit === 'ft²') {
        convertedValue = areaValue * 9; // yd² to ft²
      }
      
      setArea(convertedValue.toFixed(3));
    }
    
    setAreaUnit(newUnit);
  };
  
  // Handle height unit change with conversion
  const handleHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    
    // Handle conversion to/from ft-in or m-cm differently
    if (newUnit === 'ft-in') {
      if (height && height !== '') {
        const heightValue = parseFloat(height.replace(/,/g, ''));
        let totalInches = 0;
        
        // Convert from current unit to inches
        if (heightUnit === 'm') {
          totalInches = heightValue * 39.3701; // m to inches
        } else if (heightUnit === 'cm') {
          totalInches = heightValue * 0.393701; // cm to inches
        } else if (heightUnit === 'ft') {
          totalInches = heightValue * 12; // ft to inches
        } else if (heightUnit === 'in') {
          totalInches = heightValue; // already in inches
        }
        
        // Set feet and inches
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(3);
        
        setHeightFt(feet.toString());
        setHeightIn(inches);
        setHeight('');
      } else if (heightUnit === 'm-cm') {
        // Convert from m-cm to ft-in
        const meters = heightM ? parseFloat(heightM.replace(/,/g, '')) : 0;
        const centimeters = heightCm ? parseFloat(heightCm.replace(/,/g, '')) : 0;
        const totalMeters = meters + centimeters / 100;
        const totalInches = totalMeters * 39.3701; // meters to inches
        
        // Set feet and inches
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(3);
        
        setHeightFt(feet.toString());
        setHeightIn(inches);
        setHeightM('');
        setHeightCm('');
      }
    } else if (newUnit === 'm-cm') {
      if (height && height !== '') {
        const heightValue = parseFloat(height.replace(/,/g, ''));
        let totalCentimeters = 0;
        
        // Convert from current unit to centimeters
        if (heightUnit === 'm') {
          totalCentimeters = heightValue * 100; // m to cm
        } else if (heightUnit === 'cm') {
          totalCentimeters = heightValue; // already in cm
        } else if (heightUnit === 'ft') {
          totalCentimeters = heightValue * 30.48; // ft to cm
        } else if (heightUnit === 'in') {
          totalCentimeters = heightValue * 2.54; // in to cm
        }
        
        // Set meters and centimeters
        const meters = Math.floor(totalCentimeters / 100);
        const centimeters = (totalCentimeters % 100).toFixed(3);
        
        setHeightM(meters.toString());
        setHeightCm(centimeters);
        setHeight('');
      } else if (heightUnit === 'ft-in') {
        // Convert from ft-in to m-cm
        const feet = heightFt ? parseFloat(heightFt.replace(/,/g, '')) : 0;
        const inches = heightIn ? parseFloat(heightIn.replace(/,/g, '')) : 0;
        const totalInches = feet * 12 + inches;
        const totalCentimeters = totalInches * 2.54; // inches to cm
        
        // Set meters and centimeters
        const meters = Math.floor(totalCentimeters / 100);
        const centimeters = (totalCentimeters % 100).toFixed(3);
        
        setHeightM(meters.toString());
        setHeightCm(centimeters);
        setHeightFt('');
        setHeightIn('');
      }
    } else if (heightUnit === 'ft-in') {
      // Convert from ft-in to single unit
      if ((heightFt && heightFt !== '') || (heightIn && heightIn !== '')) {
        const feet = heightFt ? parseFloat(heightFt.replace(/,/g, '')) : 0;
        const inches = heightIn ? parseFloat(heightIn.replace(/,/g, '')) : 0;
        const totalInches = feet * 12 + inches;
        let convertedValue = 0;
        
        // Convert to new unit
        if (newUnit === 'm') {
          convertedValue = totalInches * 0.0254; // inches to m
        } else if (newUnit === 'cm') {
          convertedValue = totalInches * 2.54; // inches to cm
        } else if (newUnit === 'ft') {
          convertedValue = totalInches / 12; // inches to ft
        } else if (newUnit === 'in') {
          convertedValue = totalInches; // already in inches
        }
        
        setHeight(convertedValue.toFixed(3));
        setHeightFt('');
        setHeightIn('');
      }
    } else if (heightUnit === 'm-cm') {
      // Convert from m-cm to single unit
      if ((heightM && heightM !== '') || (heightCm && heightCm !== '')) {
        const meters = heightM ? parseFloat(heightM.replace(/,/g, '')) : 0;
        const centimeters = heightCm ? parseFloat(heightCm.replace(/,/g, '')) : 0;
        const totalMeters = meters + centimeters / 100;
        let convertedValue = 0;
        
        // Convert to new unit
        if (newUnit === 'm') {
          convertedValue = totalMeters; // already in meters
        } else if (newUnit === 'cm') {
          convertedValue = totalMeters * 100; // meters to cm
        } else if (newUnit === 'ft') {
          convertedValue = totalMeters * 3.28084; // meters to ft
        } else if (newUnit === 'in') {
          convertedValue = totalMeters * 39.3701; // meters to inches
        }
        
        setHeight(convertedValue.toFixed(3));
        setHeightM('');
        setHeightCm('');
      }
    } else if (height && height !== '') {
      // Convert between single units
      const heightValue = parseFloat(height.replace(/,/g, ''));
      let convertedValue = heightValue;
      
      // Convert from current unit to new unit
      if (heightUnit === 'm' && newUnit === 'cm') {
        convertedValue = heightValue * 100; // m to cm
      } else if (heightUnit === 'm' && newUnit === 'ft') {
        convertedValue = heightValue * 3.28084; // m to ft
      } else if (heightUnit === 'm' && newUnit === 'in') {
        convertedValue = heightValue * 39.3701; // m to in
      } else if (heightUnit === 'cm' && newUnit === 'm') {
        convertedValue = heightValue * 0.01; // cm to m
      } else if (heightUnit === 'cm' && newUnit === 'ft') {
        convertedValue = heightValue * 0.0328084; // cm to ft
      } else if (heightUnit === 'cm' && newUnit === 'in') {
        convertedValue = heightValue * 0.393701; // cm to in
      } else if (heightUnit === 'ft' && newUnit === 'm') {
        convertedValue = heightValue * 0.3048; // ft to m
      } else if (heightUnit === 'ft' && newUnit === 'cm') {
        convertedValue = heightValue * 30.48; // ft to cm
      } else if (heightUnit === 'ft' && newUnit === 'in') {
        convertedValue = heightValue * 12; // ft to in
      } else if (heightUnit === 'in' && newUnit === 'm') {
        convertedValue = heightValue * 0.0254; // in to m
      } else if (heightUnit === 'in' && newUnit === 'cm') {
        convertedValue = heightValue * 2.54; // in to cm
      } else if (heightUnit === 'in' && newUnit === 'ft') {
        convertedValue = heightValue / 12; // in to ft
      }
      
      setHeight(convertedValue.toFixed(3));
    }
    
    setHeightUnit(newUnit);
  };
  
  // Handle airflow unit change with conversion
  const handleAirflowUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (airflow && airflow !== '') {
      const airflowValue = parseFloat(airflow.replace(/,/g, ''));
      let convertedValue = airflowValue;
      
      // Convert to cubic meters as intermediate unit
      let cubicMeters = airflowValue;
      if (airflowUnit === 'cu cm') {
        cubicMeters = airflowValue * 0.000001; // cu cm to cu m
      } else if (airflowUnit === 'cu in') {
        cubicMeters = airflowValue * 0.0000163871; // cu in to cu m
      } else if (airflowUnit === 'cu ft') {
        cubicMeters = airflowValue * 0.0283168; // cu ft to cu m
      } else if (airflowUnit === 'cu yd') {
        cubicMeters = airflowValue * 0.764555; // cu yd to cu m
      } else if (airflowUnit === 'l') {
        cubicMeters = airflowValue * 0.001; // liters to cu m
      }
      
      // Convert from cubic meters to new unit
      if (newUnit === 'cu cm') {
        convertedValue = cubicMeters * 1000000; // cu m to cu cm
      } else if (newUnit === 'cu m') {
        convertedValue = cubicMeters; // already in cu m
      } else if (newUnit === 'cu in') {
        convertedValue = cubicMeters * 61023.7; // cu m to cu in
      } else if (newUnit === 'cu ft') {
        convertedValue = cubicMeters * 35.3147; // cu m to cu ft
      } else if (newUnit === 'cu yd') {
        convertedValue = cubicMeters * 1.30795; // cu m to cu yd
      } else if (newUnit === 'l') {
        convertedValue = cubicMeters * 1000; // cu m to liters
      }
      
      setAirflow(convertedValue.toFixed(3));
    }
    
    setAirflowUnit(newUnit);
  };
  
  // Handle airflow time unit change with conversion
  const handleAirflowTimeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (airflow && airflow !== '') {
      const airflowValue = parseFloat(airflow.replace(/,/g, ''));
      let convertedValue = airflowValue;
      
      // Convert to "per minute" as intermediate unit
      let perMinute = airflowValue;
      if (airflowTimeUnit === 'sec') {
        perMinute = airflowValue * 60; // per second to per minute
      } else if (airflowTimeUnit === 'hr') {
        perMinute = airflowValue / 60; // per hour to per minute
      }
      
      // Convert from per minute to new unit
      if (newUnit === 'sec') {
        convertedValue = perMinute / 60; // per minute to per second
      } else if (newUnit === 'min') {
        convertedValue = perMinute; // already per minute
      } else if (newUnit === 'hr') {
        convertedValue = perMinute * 60; // per minute to per hour
      }
      
      setAirflow(convertedValue.toFixed(3));
    }
    
    setAirflowTimeUnit(newUnit);
  };

  // Calculate ACH when inputs change
  useEffect(() => {
    if (area && heightUnit !== 'ft-in' && heightUnit !== 'm-cm' && height && airflow) {
      // Convert all values to consistent units for calculation
      let areaValue = parseFloat(area.replace(/,/g, ''));
      let heightValue = parseFloat(height.replace(/,/g, ''));
      let airflowValue = parseFloat(airflow.replace(/,/g, ''));
      
      // Convert area to square meters if needed
      if (areaUnit === 'ft²') {
        areaValue *= 0.092903; // sq ft to sq m
      } else if (areaUnit === 'yd²') {
        areaValue *= 0.836127; // sq yd to sq m
      }
      
      // Convert height to meters if needed
      if (heightUnit === 'cm') {
        heightValue *= 0.01; // cm to m
      } else if (heightUnit === 'in') {
        heightValue *= 0.0254; // inches to m
      } else if (heightUnit === 'ft') {
        heightValue *= 0.3048; // feet to m
      }
      
      // Convert airflow to cubic meters per minute if needed
      let airflowCubicMetersPerMin = airflowValue;
      if (airflowUnit === 'cu cm') {
        airflowCubicMetersPerMin *= 0.000001; // cu cm to cu m
      } else if (airflowUnit === 'cu in') {
        airflowCubicMetersPerMin *= 0.0000163871; // cu in to cu m
      } else if (airflowUnit === 'cu ft') {
        airflowCubicMetersPerMin *= 0.0283168; // cu ft to cu m
      } else if (airflowUnit === 'cu yd') {
        airflowCubicMetersPerMin *= 0.764555; // cu yd to cu m
      } else if (airflowUnit === 'l') {
        airflowCubicMetersPerMin *= 0.001; // liters to cu m
      }
      
      // Convert time unit if needed
      if (airflowTimeUnit === 'sec') {
        airflowCubicMetersPerMin *= 60; // per second to per minute
      } else if (airflowTimeUnit === 'hr') {
        airflowCubicMetersPerMin /= 60; // per hour to per minute
      }
      
      // Calculate room volume in cubic meters
      const volume = areaValue * heightValue;
      
      // Calculate ACH (air changes per hour)
      if (volume > 0) {
        const achValue = (airflowCubicMetersPerMin * 60) / volume;
        setAch(achValue.toFixed(3));
      }
    } else if (area && heightUnit === 'ft-in' && heightFt && airflow) {
      // Handle ft-in height format
      let areaValue = parseFloat(area.replace(/,/g, ''));
      const feetValue = parseFloat(heightFt.replace(/,/g, ''));
      const inchesValue = heightIn ? parseFloat(heightIn.replace(/,/g, '')) : 0;
      let airflowValue = parseFloat(airflow.replace(/,/g, ''));
      
      // Convert height to meters
      const totalInches = feetValue * 12 + inchesValue;
      const heightValue = totalInches * 0.0254; // inches to meters
      
      // Convert area to square meters if needed
      if (areaUnit === 'ft²') {
        areaValue *= 0.092903; // sq ft to sq m
      } else if (areaUnit === 'yd²') {
        areaValue *= 0.836127; // sq yd to sq m
      }
      
      // Convert airflow to cubic meters per minute if needed
      let airflowCubicMetersPerMin = airflowValue;
      if (airflowUnit === 'cu cm') {
        airflowCubicMetersPerMin *= 0.000001; // cu cm to cu m
      } else if (airflowUnit === 'cu in') {
        airflowCubicMetersPerMin *= 0.0000163871; // cu in to cu m
      } else if (airflowUnit === 'cu ft') {
        airflowCubicMetersPerMin *= 0.0283168; // cu ft to cu m
      } else if (airflowUnit === 'cu yd') {
        airflowCubicMetersPerMin *= 0.764555; // cu yd to cu m
      } else if (airflowUnit === 'l') {
        airflowCubicMetersPerMin *= 0.001; // liters to cu m
      }
      
      // Convert time unit if needed
      if (airflowTimeUnit === 'sec') {
        airflowCubicMetersPerMin *= 60; // per second to per minute
      } else if (airflowTimeUnit === 'hr') {
        airflowCubicMetersPerMin /= 60; // per hour to per minute
      }
      
      // Calculate room volume in cubic meters
      const volume = areaValue * heightValue;
      
      // Calculate ACH (air changes per hour)
      if (volume > 0) {
        const achValue = (airflowCubicMetersPerMin * 60) / volume;
        setAch(achValue.toFixed(3));
      }
    } else if (area && heightUnit === 'm-cm' && heightM && airflow) {
      // Handle m-cm height format
      let areaValue = parseFloat(area.replace(/,/g, ''));
      const metersValue = parseFloat(heightM.replace(/,/g, ''));
      const centimetersValue = heightCm ? parseFloat(heightCm.replace(/,/g, '')) : 0;
      let airflowValue = parseFloat(airflow.replace(/,/g, ''));
      
      // Convert height to meters
      const heightValue = metersValue + centimetersValue / 100;
      
      // Convert area to square meters if needed
      if (areaUnit === 'ft²') {
        areaValue *= 0.092903; // sq ft to sq m
      } else if (areaUnit === 'yd²') {
        areaValue *= 0.836127; // sq yd to sq m
      }
      
      // Convert airflow to cubic meters per minute if needed
      let airflowCubicMetersPerMin = airflowValue;
      if (airflowUnit === 'cu cm') {
        airflowCubicMetersPerMin *= 0.000001; // cu cm to cu m
      } else if (airflowUnit === 'cu in') {
        airflowCubicMetersPerMin *= 0.0000163871; // cu in to cu m
      } else if (airflowUnit === 'cu ft') {
        airflowCubicMetersPerMin *= 0.0283168; // cu ft to cu m
      } else if (airflowUnit === 'cu yd') {
        airflowCubicMetersPerMin *= 0.764555; // cu yd to cu m
      } else if (airflowUnit === 'l') {
        airflowCubicMetersPerMin *= 0.001; // liters to cu m
      }
      
      // Convert time unit if needed
      if (airflowTimeUnit === 'sec') {
        airflowCubicMetersPerMin *= 60; // per second to per minute
      } else if (airflowTimeUnit === 'hr') {
        airflowCubicMetersPerMin /= 60; // per hour to per minute
      }
      
      // Calculate room volume in cubic meters
      const volume = areaValue * heightValue;
      
      // Calculate ACH (air changes per hour)
      if (volume > 0) {
        const achValue = (airflowCubicMetersPerMin * 60) / volume;
        setAch(achValue.toFixed(3));
      }
    }
  }, [area, areaUnit, height, heightUnit, heightFt, heightIn, heightM, heightCm, airflow, airflowUnit, airflowTimeUnit]);

  // Reset calculator
  const resetCalculator = () => {
    setArea('');
    setAreaUnit('m²');
    setHeight('');
    setHeightUnit('m');
    setHeightM('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setAirflow('');
    setAirflowUnit('cu ft');
    setAirflowTimeUnit('min');
    setAch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Air Changes per Hour Calculator</h1>
          
          {/* Area Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formatNumber(area)}
                onChange={handleAreaChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter area"
              />
              <select
                value={areaUnit}
                onChange={handleAreaUnitChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="m²">m²</option>
                <option value="ft²">ft²</option>
                <option value="yd²">yd²</option>
              </select>
            </div>
          </div>
          
          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <div className="flex gap-2 mb-2">
              <select
                value={heightUnit}
                onChange={handleHeightUnitChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="ft">ft</option>
                <option value="in">in</option>
                <option value="ft-in">ft & in</option>
                <option value="m-cm">m & cm</option>
              </select>
            </div>
            
            {heightUnit !== 'ft-in' && heightUnit !== 'm-cm' ? (
              <input
                type="text"
                value={formatNumber(height)}
                onChange={handleHeightChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter height in ${heightUnit}`}
              />
            ) : heightUnit === 'ft-in' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatNumber(heightFt)}
                  onChange={handleHeightFtChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Feet"
                />
                <input
                  type="text"
                  value={formatNumber(heightIn)}
                  onChange={handleHeightInChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inches"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatNumber(heightM)}
                  onChange={handleHeightMChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meters"
                />
                <input
                  type="text"
                  value={formatNumber(heightCm)}
                  onChange={handleHeightCmChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Centimeters"
                />
              </div>
            )}
          </div>
          
          {/* Airflow Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Airflow</label>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={formatNumber(airflow)}
                onChange={handleAirflowChange}
                className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter airflow"
              />
              <select
                value={airflowUnit}
                onChange={handleAirflowUnitChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cu cm">cu cm</option>
                <option value="cu m">cu m</option>
                <option value="cu in">cu in</option>
                <option value="cu ft">cu ft</option>
                <option value="cu yd">cu yd</option>
                <option value="l">liters</option>
              </select>
              <span className="self-center">/</span>
              <select
                value={airflowTimeUnit}
                onChange={handleAirflowTimeUnitChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sec">sec</option>
                <option value="min">min</option>
                <option value="hr">hr</option>
              </select>
            </div>
          </div>
          
          {/* ACH Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Air Changes Per Hour (ACH)</label>
            <input
              type="text"
              value={ach}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Reset Button */}
          <button
            onClick={resetCalculator}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reset Calculator
          </button>
        </div>
      </div>
    </div>
  );
}