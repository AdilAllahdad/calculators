'use client';

import { useState, useEffect } from 'react';
import { ChevronDown,ChevronUp } from '@/components/icons';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue, formatNumber } from '@/lib/utils';

// Define the unit values needed for each dropdown (avoid mixed units like ft-in to prevent inaccuracies)
const areaUnitValues = ['m2', 'ft2', 'yd2', 'cm2'];
const commonAreaUnitValues = ['m2', 'ft2', 'yd2', 'cm2', 'ha', 'ac'];

export default function FloorAreaRatioCalculator() {
    const [carpetArea, setCarpetArea] = useState<string>('');
    const [carpetAreaUnit, setCarpetAreaUnit] = useState<string>('m2');
    const [builtUpArea, setBuiltUpArea] = useState<string>('');
    const [builtUpAreaUnit, setBuiltUpAreaUnit] = useState<string>('m2');
    const [carpetRatio, setCarpetRatio] = useState<number>(0);
    const [numUnits, setNumUnits] = useState<string>('');
    const [superBuiltUpArea, setSuperBuiltUpArea] = useState<string>('');
    const [superBuiltUpAreaUnit, setSuperBuiltUpAreaUnit] = useState<string>('m2');
    const [totalBuiltUpArea, setTotalBuiltUpArea] = useState<number>(0);
    const [totalBuiltUpAreaUnit, setTotalBuiltUpAreaUnit] = useState<string>('m2');
    const [indoorArea, setIndoorArea] = useState<number>(0);
    const [indoorAreaUnit, setIndoorAreaUnit] = useState<string>('m2');
    const [wallsArea, setWallsArea] = useState<number>(0);
    const [commonArea, setCommonArea] = useState<number>(0);
    const [commonAreaUnit, setCommonAreaUnit] = useState<string>('m2');
    const [openSpaceArea, setOpenSpaceArea] = useState<string>('');
    const [openSpaceAreaUnit, setOpenSpaceAreaUnit] = useState<string>('m2');
    const [totalLandArea, setTotalLandArea] = useState<string>('');
    const [totalLandAreaUnit, setTotalLandAreaUnit] = useState<string>('m2');
    const [leadingFactor, setLeadingFactor] = useState<number>(0);
    const [openSpaceRatio, setOpenSpaceRatio] = useState<number>(0);
    const [floorAreaRatio, setFloorAreaRatio] = useState<number>(0); // also called floor space index

    const calculatecarpetToBuiltAreaRatio = () => {
        const carpetAreaNum = parseFloat(carpetArea) || 0;
        const builtUpAreaNum = parseFloat(builtUpArea) || 0;
        if (carpetAreaNum <= 0 || builtUpAreaNum <= 0) {
            setCarpetRatio(0);
            return;
        }
        else if(builtUpAreaNum <= carpetAreaNum ) {
            alert('Built-up area cannot be less than or equal to carpet area. Please enter a valid value.');
            return;
        }
        const carpetAreaInSquareMeters = convertValue(carpetAreaNum, carpetAreaUnit, 'm2');
        const builtUpAreaInSquareMeters = convertValue(builtUpAreaNum, builtUpAreaUnit, 'm2');
        const carpetRatio = carpetAreaInSquareMeters / builtUpAreaInSquareMeters;
        setCarpetRatio(carpetRatio);
    }

    const calculateTotalBuiltUpArea = () => {
        const numUnitsNum = parseFloat(numUnits) || 0;
        const builtUpAreaNum = parseFloat(builtUpArea) || 0;
        if (numUnitsNum <= 0 || builtUpAreaNum <= 0) {
            setTotalBuiltUpArea(0);
            return;
        }
        const totalBuiltUpArea = numUnitsNum * builtUpAreaNum;
        setTotalBuiltUpArea(totalBuiltUpArea);
    }

    const calculateIndoorArea = () => {
        const builtUpAreaNum = parseFloat(totalBuiltUpArea.toString()) || 0;
        const carpetRatioNum = parseFloat(carpetRatio.toString()) || 0;
        if (builtUpAreaNum <= 0 || carpetRatioNum <= 0) {
            setIndoorArea(0);
            return;
        }
        const indoorArea = builtUpAreaNum;
        setIndoorArea(indoorArea);
    }

    const calculateWallsArea = () => {
        const builtUpAreaNum = parseFloat(totalBuiltUpArea.toString()) || 0;
        const carpetAreaNum = parseFloat(carpetArea.toString()) || 0;
        if (builtUpAreaNum <= 0 || carpetAreaNum <= 0) {
            setWallsArea(0);
            return;
        }
        const wallsArea = builtUpAreaNum - carpetAreaNum;
        setWallsArea(wallsArea);
    }

    const calculateLoadingFactor = () => {
        const wallsAreaNum = parseFloat(wallsArea.toString()) || 0;
        const indoorAreaNum = parseFloat(indoorArea.toString()) || 0;
        if (wallsAreaNum <= 0 || indoorAreaNum <= 0) {
            setLeadingFactor(0);
            return;
        }
        const loadingFactor = wallsAreaNum / indoorAreaNum;
        setLeadingFactor(loadingFactor);
    }
    
    const calculateOpenSpaceRatio = () => {}

    const calculateFloorAreaRatio = () => {}
}
