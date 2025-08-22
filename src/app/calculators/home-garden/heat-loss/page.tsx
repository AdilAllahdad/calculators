'use client'

import { useState,useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import UnitDropdown from "@/components/UnitDropdown";

type SingleDimensionsUnitType = 'm' | 'ft' | 'in' | 'cm' | 'yd' | 'mm';
type CompositeDimensionsUnitType = 'ft/in' | 'm/cm';
type DimensionsUnitType = SingleDimensionsUnitType | CompositeDimensionsUnitType;
type TemperatureUnitType = 'C' | 'F' | 'K';


type ConversionMap<T extends string> = Record<T, number>;

const isSingleDimensionsUnit = (unit: string): unit is SingleDimensionsUnitType => {
    return ['m', 'ft', 'in', 'cm', 'yd', 'mm'].includes(unit);
};

const isCompositeDimensionsUnit = (unit: string): unit is CompositeDimensionsUnitType => {
    return ['ft/in', 'm/cm'].includes(unit);
};

const isDimensionsUnit = (unit: string): unit is DimensionsUnitType => {
    return isSingleDimensionsUnit(unit) || isCompositeDimensionsUnit(unit);
};

const isTemperatureUnit = (unit: string): unit is TemperatureUnitType => {
    return ['C', 'F', 'K'].includes(unit);
};