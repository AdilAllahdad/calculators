'use client'
import { useState, useEffect } from "react";
import { z } from "zod";

// Gambrel roof calculator form data schema
export const gambrelRoofFormSchema = z.object({
  calculationMethod: z.enum(["halfCircle", "twoPitch"]).default("halfCircle"),
  buildingLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  buildingWidth: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  totalRoofHeight: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  eavesOverhangWidth: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  gableOverhangLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  upperRoofAngle: z.object({
    value: z.number().optional(),
    unit: z.enum(["deg", "rad"]).default("deg")
  }),
  upperRoofPitchPercent: z.number().optional(),
  upperRoofPitchRatio: z.number().optional(),
  upperRunLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  upperRiseHeight: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  upperRafterLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  upperRoofSegmentArea: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft2", "mm2", "cm2", "m2", "in2"]).default("ft2")
  }),
  lowerRoofAngle: z.object({
    value: z.number().optional(),
    unit: z.enum(["deg", "rad"]).default("deg")
  }),
  lowerRoofPitchPercent: z.number().optional(),
  lowerRoofPitchRatio: z.number().optional(),
  lowerRunLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  lowerRiseHeight: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  lowerRafterLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  lowerRoofOtherLength: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft", "mm", "cm", "m", "in", "ft-in", "m-cm"]).default("ft")
  }),
  lowerRoofSegmentArea: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft2", "mm2", "cm2", "m2", "in2"]).default("ft2")
  }),
  totalRoofArea: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft2", "mm2", "cm2", "m2", "in2"]).default("ft2")
  }),
  approximateRoofVolume: z.object({
    value: z.number().optional(),
    unit: z.enum(["ft3", "mm3", "cm3", "m3", "in3"]).default("ft3")
  })
});

export type GambrelRoofFormData = z.infer<typeof gambrelRoofFormSchema>;

export const lengthUnits = [
  { value: "ft", label: "ft" },
  { value: "mm", label: "mm" },
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "in", label: "in" },
];

export const angleUnits = [
  { value: "deg", label: "deg" },
  { value: "rad", label: "rad" }
];

export const areaUnits = [
  { value: "ft2", label: "ft²" },
  { value: "mm2", label: "mm²" },
  { value: "cm2", label: "cm²" },
  { value: "m2", label: "m²" },
  { value: "in2", label: "in²" }
];

export const volumeUnits = [
  { value: "ft3", label: "cu ft" },
  { value: "mm3", label: "mm³" },
  { value: "cm3", label: "cm³" },
  { value: "m3", label: "m³" },
  { value: "in3", label: "cu in" }
];

// --- Unit conversion helpers ---
function convertLength(value: number | undefined, from: LengthUnit, to: LengthUnit): number | undefined {
  if (value === undefined) return undefined;
  const toMeters: Record<LengthUnit, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048,
    "ft-in": 0.3048,
    "m-cm": 1,
  };
  const fromMeters: Record<LengthUnit, number> = {
    mm: 1000,
    cm: 100,
    m: 1,
    in: 39.3700787,
    ft: 3.2808399,
    "ft-in": 3.2808399,
    "m-cm": 1,
  };
  const meters = value * toMeters[from];
  return meters * fromMeters[to];
}

function convertAngle(value: number | undefined, from: AngleUnit, to: AngleUnit): number | undefined {
  if (value === undefined) return undefined;
  if (from === to) return value;
  if (from === "deg" && to === "rad") return value * (Math.PI / 180);
  if (from === "rad" && to === "deg") return value * (180 / Math.PI);
  return value;
}

function convertArea(value: number | undefined, from: AreaUnit, to: AreaUnit): number | undefined {
  if (value === undefined) return undefined;
  const toM2: Record<AreaUnit, number> = {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    in2: 0.00064516,
    ft2: 0.092903,
  };
  const fromM2: Record<AreaUnit, number> = {
    mm2: 1000000,
    cm2: 10000,
    m2: 1,
    in2: 1550.0031,
    ft2: 10.7639104,
  };
  const m2 = value * toM2[from];
  return m2 * fromM2[to];
}

function convertVolume(value: number | undefined, from: VolumeUnit, to: VolumeUnit): number | undefined {
  if (value === undefined) return undefined;
  const toM3: Record<VolumeUnit, number> = {
    mm3: 1e-9,
    cm3: 1e-6,
    m3: 1,
    in3: 0.000016387064,
    ft3: 0.0283168,
  };
  const fromM3: Record<VolumeUnit, number> = {
    mm3: 1e9,
    cm3: 1e6,
    m3: 1,
    in3: 61023.7441,
    ft3: 35.3146667,
  };
  const m3 = value * toM3[from];
  return m3 * fromM3[to];
}

// Helper types for units
type LengthUnit = "ft" | "mm" | "cm" | "m" | "in" | "ft-in" | "m-cm";
type AngleUnit = "deg" | "rad";
type AreaUnit = "ft2" | "mm2" | "cm2" | "m2" | "in2";
type VolumeUnit = "ft3" | "mm3" | "cm3" | "m3" | "in3";

interface InputWithUnitProps {
  label: string;
  value?: number;
  unit: LengthUnit | AngleUnit | AreaUnit | VolumeUnit;
  units: { value: string; label: string }[];
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  testId: string;
  onChange: (value: number | undefined, unit: LengthUnit | AngleUnit | AreaUnit | VolumeUnit) => void;
}

function InputWithUnit({
  label,
  value,
  unit,
  units,
  placeholder,
  readonly = false,
  required = false,
  testId,
  onChange
}: InputWithUnitProps) {
  // Always use a string for value to avoid React warnings and dropdown issues
  const inputValue = value !== undefined && !isNaN(value) ? String(value) : "";
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}>
        {label}
      </label>
      <div className="flex">
        <input
          type="number"
          step="0.01"
          value={inputValue}
          placeholder={placeholder}
          readOnly={readonly}
          data-testid={testId}
          className={`flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${readonly ? 'bg-gray-50' : 'bg-white'}`}
          onChange={e => {
            const val = e.target.value;
            onChange(val !== "" ? parseFloat(val) : undefined, unit);
          }}
        />
        <select
          value={unit}
          data-testid={`${testId}-unit`}
          className="w-24 border border-l-0 border-gray-300 rounded-r-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={e => {
            const newUnit = e.target.value as LengthUnit | AngleUnit | AreaUnit | VolumeUnit;
            let convertedValue: number | undefined = value;
            if (value !== undefined && value !== null && !isNaN(value)) {
              if (units === lengthUnits) {
                convertedValue = convertLength(value, unit as LengthUnit, newUnit as LengthUnit);
              } else if (units === angleUnits) {
                convertedValue = convertAngle(value, unit as AngleUnit, newUnit as AngleUnit);
              } else if (units === areaUnits) {
                convertedValue = convertArea(value, unit as AreaUnit, newUnit as AreaUnit);
              } else if (units === volumeUnits) {
                convertedValue = convertVolume(value, unit as VolumeUnit, newUnit as VolumeUnit);
              }
            }
            onChange(convertedValue, newUnit);
          }}
        >
          {units.map((unitOption) => (
            <option key={unitOption.value} value={unitOption.value}>
              {unitOption.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface SimpleInputProps {
  label: string;
  value?: number;
  placeholder?: string;
  suffix?: string;
  testId: string;
  readonly?: boolean;
  onChange: (value: number | undefined) => void;
}

function SimpleInput({ label, value, placeholder, suffix, testId, readonly = false, onChange }: SimpleInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex">
        <input
          type="number"
          step="0.01"
          value={value !== undefined ? value : ""}
          placeholder={placeholder}
          readOnly={readonly}
          data-testid={testId}
          className={`flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${readonly ? 'bg-gray-50' : 'bg-white'}`}
          onChange={e => onChange(
            e.target.value ? parseFloat(e.target.value) : undefined
          )}
        />
        {suffix && <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

// --- Calculation functions ---
function calculateGambrelRoof(data: GambrelRoofFormData): GambrelRoofFormData {
  const result = { ...data };

  // Convert all inputs to meters for calculation
  const buildingWidth = convertLength(data.buildingWidth.value, data.buildingWidth.unit as LengthUnit, "m");
  const buildingLength = convertLength(data.buildingLength.value, data.buildingLength.unit as LengthUnit, "m");
  const eavesOverhang = convertLength(data.eavesOverhangWidth.value, data.eavesOverhangWidth.unit as LengthUnit, "m") || 0;
  const gableOverhang = convertLength(data.gableOverhangLength.value, data.gableOverhangLength.unit as LengthUnit, "m") || 0;

  if (buildingWidth === undefined || buildingLength === undefined) {
    // Ensure all output fields are cleared if not enough input
    return {
      ...result,
      upperRiseHeight: { ...result.upperRiseHeight, value: undefined },
      upperRafterLength: { ...result.upperRafterLength, value: undefined },
      upperRoofSegmentArea: { ...result.upperRoofSegmentArea, value: undefined },
      lowerRoofAngle: { ...result.lowerRoofAngle, value: undefined },
      lowerRoofPitchPercent: undefined,
      lowerRoofPitchRatio: undefined,
      lowerRunLength: { ...result.lowerRunLength, value: undefined },
      lowerRiseHeight: { ...result.lowerRiseHeight, value: undefined },
      lowerRafterLength: { ...result.lowerRafterLength, value: undefined },
      lowerRoofOtherLength: { ...result.lowerRoofOtherLength, value: undefined },
      lowerRoofSegmentArea: { ...result.lowerRoofSegmentArea, value: undefined },
      totalRoofArea: { ...result.totalRoofArea, value: undefined },
      approximateRoofVolume: { ...result.approximateRoofVolume, value: undefined }
    };
  }

  // --- Two-pitch method ---
  if (data.calculationMethod === "twoPitch") {
    // Extract values in meters/radians
    const totalHeight = convertLength(data.totalRoofHeight.value, data.totalRoofHeight.unit as LengthUnit, "m");
    let upperAngleRad = convertAngle(data.upperRoofAngle.value, data.upperRoofAngle.unit as AngleUnit, "rad");
    let lowerAngleRad = convertAngle(data.lowerRoofAngle.value, data.lowerRoofAngle.unit as AngleUnit, "rad");
    let x2 = convertLength(data.upperRunLength.value, data.upperRunLength.unit as LengthUnit, "m");
    let x1 = convertLength(data.lowerRunLength.value, data.lowerRunLength.unit as LengthUnit, "m");
    let y2 = convertLength(data.upperRiseHeight.value, data.upperRiseHeight.unit as LengthUnit, "m");
    let y1 = convertLength(data.lowerRiseHeight.value, data.lowerRiseHeight.unit as LengthUnit, "m");
    let R2 = convertLength(data.upperRafterLength.value, data.upperRafterLength.unit as LengthUnit, "m");
    let R1 = convertLength(data.lowerRafterLength.value, data.lowerRafterLength.unit as LengthUnit, "m");

    const halfWidth = buildingWidth / 2;

    // Enforce relationships:
    // x2 + x1 = halfWidth
    // y2 + y1 = totalHeight
    // tan(upperAngleRad) = y2 / x2
    // tan(lowerAngleRad) = y1 / x1
    // sin(upperAngleRad) = y2 / R2
    // sin(lowerAngleRad) = y1 / R1

    // 1. If both angles and totalHeight are known, solve for x2, x1, y2, y1
    if (upperAngleRad !== undefined && lowerAngleRad !== undefined && totalHeight !== undefined) {
      const tanUpper = Math.tan(upperAngleRad);
      const tanLower = Math.tan(lowerAngleRad);
      x2 = (totalHeight - halfWidth * tanLower) / (tanUpper - tanLower);
      x1 = halfWidth - x2;
      y2 = x2 * tanUpper;
      y1 = totalHeight - y2;
    }

    // 2. If runs are known, solve for rises and angles
    if (x2 !== undefined && x1 !== undefined) {
      y2 = y2 ?? (upperAngleRad !== undefined ? x2 * Math.tan(upperAngleRad) : undefined);
      y1 = y1 ?? (lowerAngleRad !== undefined ? x1 * Math.tan(lowerAngleRad) : undefined);
      if (y2 !== undefined && y1 !== undefined) {
        // totalHeight = y2 + y1
        result.totalRoofHeight = {
          value: convertLength(y2 + y1, "m", result.totalRoofHeight.unit as LengthUnit),
          unit: result.totalRoofHeight.unit
        };
      }
      if (y2 !== undefined && x2 !== 0 && upperAngleRad === undefined) upperAngleRad = Math.atan(y2 / x2);
      if (y1 !== undefined && x1 !== 0 && lowerAngleRad === undefined) lowerAngleRad = Math.atan(y1 / x1);
    }

    // 3. If rises are known, solve for runs and angles
    if (y2 !== undefined && y1 !== undefined) {
      if (totalHeight === undefined) {
        result.totalRoofHeight = {
          value: convertLength(y2 + y1, "m", result.totalRoofHeight.unit as LengthUnit),
          unit: result.totalRoofHeight.unit
        };
      }
      if (x2 === undefined && x1 !== undefined) x2 = halfWidth - x1;
      if (x1 === undefined && x2 !== undefined) x1 = halfWidth - x2;
      if (x2 !== undefined && y2 !== 0 && upperAngleRad === undefined) upperAngleRad = Math.atan(y2 / x2);
      if (x1 !== undefined && y1 !== 0 && lowerAngleRad === undefined) lowerAngleRad = Math.atan(y1 / x1);
    }

    // 4. If rafter lengths are known, solve for rises
    if (R2 !== undefined && x2 !== undefined && y2 === undefined) {
      y2 = Math.sqrt(Math.max(0, R2 * R2 - x2 * x2));
      upperAngleRad = Math.atan(y2 / x2);
    }
    if (R1 !== undefined && x1 !== undefined && y1 === undefined) {
      y1 = Math.sqrt(Math.max(0, R1 * R1 - x1 * x1));
      lowerAngleRad = Math.atan(y1 / x1);
    }

    // 5. Enforce constraints
    if (x2 !== undefined && x1 === undefined) x1 = halfWidth - x2;
    if (x1 !== undefined && x2 === undefined) x2 = halfWidth - x1;
    if (y2 !== undefined && y1 === undefined && totalHeight !== undefined) y1 = totalHeight - y2;
    if (y1 !== undefined && y2 === undefined && totalHeight !== undefined) y2 = totalHeight - y1;

    // 6. Rafter lengths
    if (x2 !== undefined && y2 !== undefined) R2 = Math.sqrt(x2 * x2 + y2 * y2);
    if (x1 !== undefined && y1 !== undefined) R1 = Math.sqrt(x1 * x1 + y1 * y1);

    // Set all calculated values
    if (upperAngleRad !== undefined) {
      result.upperRoofAngle = { value: convertAngle(upperAngleRad, "rad", result.upperRoofAngle.unit as AngleUnit), unit: result.upperRoofAngle.unit };
      result.upperRoofPitchPercent = Math.tan(upperAngleRad) * 100;
      result.upperRoofPitchRatio = Math.tan(upperAngleRad) * 12;
    }
    if (lowerAngleRad !== undefined) {
      result.lowerRoofAngle = { value: convertAngle(lowerAngleRad, "rad", result.lowerRoofAngle.unit as AngleUnit), unit: result.lowerRoofAngle.unit };
      result.lowerRoofPitchPercent = Math.tan(lowerAngleRad) * 100;
      result.lowerRoofPitchRatio = Math.tan(lowerAngleRad) * 12;
    }
    if (x2 !== undefined) result.upperRunLength = { value: convertLength(x2, "m", result.upperRunLength.unit as LengthUnit), unit: result.upperRunLength.unit };
    if (x1 !== undefined) result.lowerRunLength = { value: convertLength(x1, "m", result.lowerRunLength.unit as LengthUnit), unit: result.lowerRunLength.unit };
    if (y2 !== undefined) result.upperRiseHeight = { value: convertLength(y2, "m", result.upperRiseHeight.unit as LengthUnit), unit: result.upperRiseHeight.unit };
    if (y1 !== undefined) result.lowerRiseHeight = { value: convertLength(y1, "m", result.lowerRiseHeight.unit as LengthUnit), unit: result.lowerRiseHeight.unit };
    if (R2 !== undefined) result.upperRafterLength = { value: convertLength(R2, "m", result.upperRafterLength.unit as LengthUnit), unit: result.upperRafterLength.unit };
    if (R1 !== undefined) result.lowerRafterLength = { value: convertLength(R1, "m", result.lowerRafterLength.unit as LengthUnit), unit: result.lowerRafterLength.unit };

    // Lower roof other length (R'₁) = sqrt((x₁ + e)² + y₁²)
    if (x1 !== undefined && y1 !== undefined) {
      const lowerRoofOtherLength = Math.sqrt(Math.pow(x1 + eavesOverhang, 2) + Math.pow(y1, 2));
      result.lowerRoofOtherLength = { value: convertLength(lowerRoofOtherLength, "m", result.lowerRoofOtherLength.unit as LengthUnit), unit: result.lowerRoofOtherLength.unit };
    }

    // Areas
    if (R2 !== undefined && buildingLength !== undefined) {
      const upperArea = (buildingLength + 2 * gableOverhang) * R2;
      result.upperRoofSegmentArea = { value: convertArea(upperArea, "m2", result.upperRoofSegmentArea.unit as AreaUnit), unit: result.upperRoofSegmentArea.unit };
    }
    if (x1 !== undefined && y1 !== undefined && buildingLength !== undefined) {
      const lowerRoofOtherSlope = Math.sqrt(Math.pow(x1 + eavesOverhang, 2) + Math.pow(y1, 2));
      const lowerArea = (buildingLength + 2 * gableOverhang) * lowerRoofOtherSlope;
      result.lowerRoofSegmentArea = { value: convertArea(lowerArea, "m2", result.lowerRoofSegmentArea.unit as AreaUnit), unit: result.lowerRoofSegmentArea.unit };
    }
    if (result.upperRoofSegmentArea.value !== undefined && result.lowerRoofSegmentArea.value !== undefined) {
      const upperAreaM2 = convertArea(result.upperRoofSegmentArea.value, result.upperRoofSegmentArea.unit as AreaUnit, "m2") || 0;
      const lowerAreaM2 = convertArea(result.lowerRoofSegmentArea.value, result.lowerRoofSegmentArea.unit as AreaUnit, "m2") || 0;
      result.totalRoofArea = { value: convertArea(2 * (upperAreaM2 + lowerAreaM2), "m2", result.totalRoofArea.unit as AreaUnit), unit: result.totalRoofArea.unit };
    }

    // Volume
    if (buildingLength !== undefined && x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
      // V = 2L × (x₁y₁/2 + x₂y₂/2 + x₂y₁)
      const volume = 2 * buildingLength * ((x1 * y1) / 2 + (x2 * y2) / 2 + x2 * y1);
      result.approximateRoofVolume = { value: convertVolume(volume, "m3", result.approximateRoofVolume.unit as VolumeUnit), unit: result.approximateRoofVolume.unit };
    }
    return result;
  }

  // --- Half-circle method ---
  if (data.calculationMethod === "halfCircle") {
    // The total roof height is always half the building width
    const totalHeight = buildingWidth / 2;
    result.totalRoofHeight = {
      value: convertLength(totalHeight, "m", result.totalRoofHeight.unit as LengthUnit),
      unit: result.totalRoofHeight.unit
    };

    // Lower angle is always upper + 45°
    let upperAngleRad = convertAngle(data.upperRoofAngle.value, data.upperRoofAngle.unit as AngleUnit, "rad");
    let lowerAngleRad = upperAngleRad !== undefined ? upperAngleRad + Math.PI / 4 : undefined;
    if (lowerAngleRad !== undefined) {
      result.lowerRoofAngle = {
        value: convertAngle(lowerAngleRad, "rad", result.lowerRoofAngle.unit as AngleUnit),
        unit: result.lowerRoofAngle.unit
      };
    }

    // Geometry: the roof fits a semicircle of radius r = totalHeight
    const r = totalHeight;
    // The upper run (x2) is the horizontal distance from the center to the break point
    // The lower run (x1) is from break point to eave (halfWidth - x2)
    // The upper rise (y2) is r - sqrt(r^2 - x2^2)
    // The lower rise (y1) is totalHeight - y2

    // If upper angle is given, calculate x2
    let x2: number | undefined = undefined;
    let x1: number | undefined = undefined;
    let y2: number | undefined = undefined;
    let y1: number | undefined = undefined;
    let R2: number | undefined = undefined;
    let R1: number | undefined = undefined;

    if (upperAngleRad !== undefined) {
      // x2 = r * cos(upperAngleRad)
      x2 = r * Math.cos(upperAngleRad);
      y2 = r - Math.sqrt(r * r - x2 * x2);
      x1 = (buildingWidth / 2) - x2;
      y1 = totalHeight - (y2 ?? 0);
      R2 = Math.sqrt(x2 * x2 + (y2 ?? 0) * (y2 ?? 0));
      R1 = Math.sqrt(x1 * x1 + (y1 ?? 0) * (y1 ?? 0));
    }

    // Set all calculated values
    if (upperAngleRad !== undefined) {
      result.upperRoofAngle = { value: convertAngle(upperAngleRad, "rad", result.upperRoofAngle.unit as AngleUnit), unit: result.upperRoofAngle.unit };
      result.upperRoofPitchPercent = Math.tan(upperAngleRad) * 100;
      result.upperRoofPitchRatio = Math.tan(upperAngleRad) * 12;
    }
    if (lowerAngleRad !== undefined) {
      result.lowerRoofAngle = { value: convertAngle(lowerAngleRad, "rad", result.lowerRoofAngle.unit as AngleUnit), unit: result.lowerRoofAngle.unit };
      result.lowerRoofPitchPercent = Math.tan(lowerAngleRad) * 100;
      result.lowerRoofPitchRatio = Math.tan(lowerAngleRad) * 12;
    }
    if (x2 !== undefined) result.upperRunLength = { value: convertLength(x2, "m", result.upperRunLength.unit as LengthUnit), unit: result.upperRunLength.unit };
    if (x1 !== undefined) result.lowerRunLength = { value: convertLength(x1, "m", result.lowerRunLength.unit as LengthUnit), unit: result.lowerRunLength.unit };
    if (y2 !== undefined) result.upperRiseHeight = { value: convertLength(y2, "m", result.upperRiseHeight.unit as LengthUnit), unit: result.upperRiseHeight.unit };
    if (y1 !== undefined) result.lowerRiseHeight = { value: convertLength(y1, "m", result.lowerRiseHeight.unit as LengthUnit), unit: result.lowerRiseHeight.unit };
    if (R2 !== undefined) result.upperRafterLength = { value: convertLength(R2, "m", result.upperRafterLength.unit as LengthUnit), unit: result.upperRafterLength.unit };
    if (R1 !== undefined) result.lowerRafterLength = { value: convertLength(R1, "m", result.lowerRafterLength.unit as LengthUnit), unit: result.lowerRafterLength.unit };

    // Lower roof other length (arc length of half-circle)
    if (buildingWidth !== undefined) {
      const arcLength = Math.PI * r;
      result.lowerRoofOtherLength = { value: convertLength(arcLength, "m", result.lowerRoofOtherLength.unit as LengthUnit), unit: result.lowerRoofOtherLength.unit };
    }

    // Areas
    if (buildingLength !== undefined && r !== undefined) {
      // Area of half-circle segment (per side)
      const roofArea = Math.PI * r * (buildingLength + 2 * gableOverhang);
      result.lowerRoofSegmentArea = {
        value: convertArea((Math.PI * r * buildingLength) / 2, "m2", result.lowerRoofSegmentArea.unit as AreaUnit),
        unit: result.lowerRoofSegmentArea.unit
      };
      // Total roof area (both sides)
      result.totalRoofArea = {
        value: convertArea(2 * roofArea, "m2", result.totalRoofArea.unit as AreaUnit),
        unit: result.totalRoofArea.unit
      };
      // Approximate roof volume (half-cylinder)
      const volume = Math.PI * r * r * buildingLength;
      result.approximateRoofVolume = {
        value: convertVolume(volume, "m3", result.approximateRoofVolume.unit as VolumeUnit),
        unit: result.approximateRoofVolume.unit
      };
    }
    return result;
  }

  return result;
}

export default function GambrelRoofCalculator() {
  // Separate state for user input and calculated values
  const [inputFormData, setInputFormData] = useState<GambrelRoofFormData>({
    calculationMethod: "halfCircle",
    buildingLength: { unit: "ft" },
    buildingWidth: { unit: "ft" },
    totalRoofHeight: { unit: "ft" },
    eavesOverhangWidth: { unit: "ft" },
    gableOverhangLength: { unit: "ft" },
    upperRoofAngle: { unit: "deg" },
    upperRunLength: { unit: "ft" },
    upperRiseHeight: { unit: "ft" },
    upperRafterLength: { unit: "ft" },
    upperRoofSegmentArea: { unit: "ft2" },
    lowerRoofAngle: { unit: "deg" },
    lowerRunLength: { unit: "ft" },
    lowerRiseHeight: { unit: "ft" },
    lowerRafterLength: { unit: "ft" },
    lowerRoofOtherLength: { unit: "ft" },
    lowerRoofSegmentArea: { unit: "ft2" },
    totalRoofArea: { unit: "ft2" },
    approximateRoofVolume: { unit: "ft3" }
  });

  const [formData, setFormData] = useState<GambrelRoofFormData>(() => calculateGambrelRoof(inputFormData));

  // Only recalculate when user input changes
  useEffect(() => {
    setFormData(calculateGambrelRoof(inputFormData));
  }, [
    inputFormData
  ]);

  const updateFormData = (updates: Partial<GambrelRoofFormData>) => {
    setInputFormData(prev => ({ ...prev, ...updates }));
  };

  const clearAllFields = () => {
    setInputFormData({
      calculationMethod: "halfCircle",
      buildingLength: { unit: "ft" },
      buildingWidth: { unit: "ft" },
      totalRoofHeight: { unit: "ft" },
      eavesOverhangWidth: { unit: "ft" },
      gableOverhangLength: { unit: "ft" },
      upperRoofAngle: { unit: "deg" },
      upperRunLength: { unit: "ft" },
      upperRiseHeight: { unit: "ft" },
      upperRafterLength: { unit: "ft" },
      upperRoofSegmentArea: { unit: "ft2" },
      lowerRoofAngle: { unit: "deg" },
      lowerRunLength: { unit: "ft" },
      lowerRiseHeight: { unit: "ft" },
      lowerRafterLength: { unit: "ft" },
      lowerRoofOtherLength: { unit: "ft" },
      lowerRoofSegmentArea: { unit: "ft2" },
      totalRoofArea: { unit: "ft2" },
      approximateRoofVolume: { unit: "ft3" }
    });
  };

  const formatValue = (value: number | undefined): number | undefined => {
    if (value === undefined) return undefined;
    return Math.round(value * 100) / 100; // Round to 2 decimal places
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">Gambrel Roof Calculator</h1>
          <div className="flex items-center gap-2 text-blue-700 font-medium">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700">✓</span>
            <span>Fully Functional Calculator</span>
          </div>
        </div>

        {/* Calculation Method */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h2 className="text-lg font-semibold mb-4">Calculation method</h2>
          <div className="mb-4 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="calculationMethod"
                value="halfCircle"
                checked={formData.calculationMethod === "halfCircle"}
                data-testid="radio-half-circle"
                className="accent-blue-600"
                onChange={e => updateFormData({ calculationMethod: e.target.value as "halfCircle" | "twoPitch" })}
              />
              <span className="text-sm">Half-circle method</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="calculationMethod"
                value="twoPitch"
                checked={formData.calculationMethod === "twoPitch"}
                data-testid="radio-two-pitch"
                className="accent-blue-600"
                onChange={e => updateFormData({ calculationMethod: e.target.value as "halfCircle" | "twoPitch" })}
              />
              <span className="text-sm">Two-pitch method</span>
            </label>
          </div>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-72 h-44 bg-gray-100 rounded-lg flex items-center justify-center border">
              <span className="text-gray-500 text-sm">
                {formData.calculationMethod === "halfCircle" 
                  ? "Half-circle method diagram" 
                  : "Two-pitch method diagram"}
              </span>
            </div>
          </div>
        </div>

        {/* Building Dimensions */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h3 className="text-base font-semibold mb-4">Building dimensions</h3>
          <InputWithUnit
            label="Building length (L)"
            value={formatValue(formData.buildingLength.value)}
            unit={formData.buildingLength.unit}
            units={lengthUnits}
            placeholder="22"
            required
            testId="input-building-length"
            onChange={(value, unit) => updateFormData({ buildingLength: { value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Building width (W)"
            value={formatValue(formData.buildingWidth.value)}
            unit={formData.buildingWidth.unit}
            units={lengthUnits}
            placeholder="22"
            required
            testId="input-building-width"
            onChange={(value, unit) => updateFormData({ buildingWidth: { value, unit: unit as LengthUnit } })}
          />
        </div>

        {/* Preliminary Roof Details */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h3 className="text-base font-semibold mb-4">Preliminary roof details</h3>
          <InputWithUnit
            label="Total roof height (H)"
            value={formatValue(formData.totalRoofHeight.value)}
            unit={formData.totalRoofHeight.unit}
            units={lengthUnits}
            placeholder="11"
            readonly={formData.calculationMethod === "halfCircle"}
            testId="input-total-roof-height"
            onChange={(value, unit) => updateFormData({ totalRoofHeight: { value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Eaves overhang width (e)"
            value={formatValue(formData.eavesOverhangWidth.value)}
            unit={formData.eavesOverhangWidth.unit}
            units={lengthUnits}
            testId="input-eaves-overhang"
            onChange={(value, unit) => updateFormData({ eavesOverhangWidth: { value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Gable overhang length (g)"
            value={formatValue(formData.gableOverhangLength.value)}
            unit={formData.gableOverhangLength.unit}
            units={lengthUnits}
            testId="input-gable-overhang"
            onChange={(value, unit) => updateFormData({ gableOverhangLength: { value, unit: unit as LengthUnit } })}
          />
        </div>

        {/* Upper Roof Segment Details */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h3 className="text-base font-semibold mb-4">Upper roof segment details</h3>
          <InputWithUnit
            label="Upper roof angle (Φ)"
            value={formatValue(formData.upperRoofAngle.value)}
            unit={formData.upperRoofAngle.unit}
            units={angleUnits}
            placeholder="15"
            testId="input-upper-roof-angle"
            onChange={(value, unit) => updateFormData({ upperRoofAngle: { value, unit: unit as AngleUnit } })}
          />
          <SimpleInput
            label="Upper roof pitch (%)"
            value={formatValue(formData.upperRoofPitchPercent)}
            placeholder="26.8"
            suffix="%"
            readonly={true}
            testId="input-upper-roof-pitch-percent"
            onChange={value => updateFormData({ upperRoofPitchPercent: value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Upper roof pitch (x:12)</label>
            <div className="flex">
              <input
                type="number"
                step="0.01"
                value={formatValue(formData.upperRoofPitchRatio) || ""}
                placeholder="3.2"
                readOnly={true}
                data-testid="input-upper-roof-pitch-ratio"
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                onChange={e => updateFormData({
                  upperRoofPitchRatio: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">:12</span>
            </div>
          </div>
          <InputWithUnit
            label="Upper run length (x₂)"
            value={formatValue(formData.upperRunLength.value)}
            unit={formData.upperRunLength.unit}
            units={lengthUnits}
            // Editable only for two-pitch method
            readonly={formData.calculationMethod !== "twoPitch"}
            testId="input-upper-run-length"
            onChange={(value, unit) => updateFormData({ upperRunLength: { value: formData.calculationMethod === "twoPitch" ? value : formData.upperRunLength.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Upper rise height (y₂)"
            value={formatValue(formData.upperRiseHeight.value)}
            unit={formData.upperRiseHeight.unit}
            units={lengthUnits}
            readonly={true}
            testId="input-upper-rise-height"
            onChange={(value, unit) => updateFormData({ upperRiseHeight: { value: formData.upperRiseHeight.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Upper rafter length (R₂)"
            value={formatValue(formData.upperRafterLength.value)}
            unit={formData.upperRafterLength.unit}
            units={lengthUnits}
            readonly={true}
            testId="input-upper-rafter-length"
            onChange={(value, unit) => updateFormData({ upperRafterLength: { value: formData.upperRafterLength.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Upper roof segment area (A₂)"
            value={formatValue(formData.upperRoofSegmentArea.value)}
            unit={formData.upperRoofSegmentArea.unit}
            units={areaUnits}
            readonly={true}
            testId="input-upper-roof-area"
            onChange={(value, unit) => updateFormData({ upperRoofSegmentArea: { value: formData.upperRoofSegmentArea.value, unit: unit as AreaUnit } })}
          />
        </div>

        {/* Lower Roof Segment Details */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h3 className="text-base font-semibold mb-4">Lower roof segment details</h3>
          <InputWithUnit
            label="Lower roof angle (θ)"
            value={formatValue(formData.lowerRoofAngle.value) ?? ""}
            unit={formData.lowerRoofAngle.unit}
            units={angleUnits}
            placeholder="60"
            readonly={true}
            testId="input-lower-roof-angle"
            onChange={(value, unit) => updateFormData({ lowerRoofAngle: { value: formData.lowerRoofAngle.value, unit: unit as AngleUnit } })}
          />
          <SimpleInput
            label="Lower roof pitch (%)"
            value={formatValue(formData.lowerRoofPitchPercent)}
            placeholder="173.2"
            suffix="%"
            readonly={true}
            testId="input-lower-roof-pitch-percent"
            onChange={() => {}}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lower roof pitch (x:12)</label>
            <div className="flex">
              <input
                type="number"
                step="0.01"
                value={formatValue(formData.lowerRoofPitchRatio) ?? ""}
                placeholder="20.8"
                readOnly={true}
                data-testid="input-lower-roof-pitch-ratio"
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                onChange={() => {}}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">:12</span>
            </div>
          </div>
          <InputWithUnit
            label="Lower run length (x₁)"
            value={formatValue(formData.lowerRunLength.value)}
            unit={formData.lowerRunLength.unit}
            units={lengthUnits}
            readonly={true}
            testId="input-lower-run-length"
            onChange={(value, unit) => updateFormData({ lowerRunLength: { value: formData.lowerRunLength.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Lower rise height (y₁)"
            value={
              formData.calculationMethod === "twoPitch"
                ? formatValue(formData.lowerRiseHeight.value) ?? ""
                : formatValue(formData.lowerRiseHeight.value)
            }
            unit={formData.lowerRiseHeight.unit}
            units={lengthUnits}
            readonly={formData.calculationMethod === "twoPitch"}
            testId="input-lower-rise-height"
            onChange={(value, unit) => {
              if (formData.calculationMethod === "halfCircle") {
                updateFormData({ lowerRiseHeight: { value, unit: unit as LengthUnit } });
              }
            }}
          />
          <InputWithUnit
            label="Lower rafter length (R₁)"
            value={formatValue(formData.lowerRafterLength.value)}
            unit={formData.lowerRafterLength.unit}
            units={lengthUnits}
            readonly={true}
            testId="input-lower-rafter-length"
            onChange={(value, unit) => updateFormData({ lowerRafterLength: { value: formData.lowerRafterLength.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Lower roof other length (R'₁)"
            value={formatValue(formData.lowerRoofOtherLength.value)}
            unit={formData.lowerRoofOtherLength.unit}
            units={lengthUnits}
            readonly={true}
            testId="input-lower-roof-other-length"
            onChange={(value, unit) => updateFormData({ lowerRoofOtherLength: { value: formData.lowerRoofOtherLength.value, unit: unit as LengthUnit } })}
          />
          <InputWithUnit
            label="Lower roof segment area (A₁)"
            value={formatValue(formData.lowerRoofSegmentArea.value)}
            unit={formData.lowerRoofSegmentArea.unit}
            units={areaUnits}
            readonly={true}
            testId="input-lower-roof-area"
            onChange={(value, unit) => updateFormData({ lowerRoofSegmentArea: { value: formData.lowerRoofSegmentArea.value, unit: unit as AreaUnit } })}
          />
        </div>

        {/* Other Results */}
        <div className="bg-white rounded-xl shadow-lg p-5 border mb-5">
          <h3 className="text-base font-semibold mb-4">Other results</h3>
          <InputWithUnit
            label="Total roof area (Aᴛ)"
            value={formatValue(formData.totalRoofArea.value)}
            unit={formData.totalRoofArea.unit}
            units={areaUnits}
            readonly={true}
            testId="input-total-roof-area"
            onChange={(value, unit) => updateFormData({ totalRoofArea: { value: formData.totalRoofArea.value, unit: unit as AreaUnit } })}
          />
          <InputWithUnit
            label="Approximate roof volume (V)"
            value={formatValue(formData.approximateRoofVolume.value)}
            unit={formData.approximateRoofVolume.unit}
            units={volumeUnits}
            readonly={true}
            testId="input-approximate-roof-volume"
            onChange={(value, unit) => updateFormData({ approximateRoofVolume: { value: formData.approximateRoofVolume.value, unit: unit as VolumeUnit } })}
          />
        </div>

        {/* Clear Button */}
        <div className="flex justify-center">
          <button
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-300 transition"
            data-testid="button-clear-all"
            onClick={clearAllFields}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}