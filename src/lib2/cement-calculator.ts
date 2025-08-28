// Unit conversion factors to cubic meters
export const volumeConversions = {
  m3: 1,
  cm3: 0.000001,
  ft3: 0.0283168,
  yd3: 0.764555,
  ml: 0.000001,
  l: 0.001,
  gal_us: 0.00378541,
  gal_uk: 0.00454609,
} as const;

// Weight conversion factors to kg
export const weightConversions = {
  kg: 1,
  lb: 0.453592,
  t: 1000,
  st: 6.35029,
  us_ton: 907.185,
  long_ton: 1016.05,
} as const;

// Density conversion factors to kg/m³
export const densityConversions = {
  kg_m3: 1,
  lb_ft3: 16.0185,
  lb_yd3: 0.593276,
  g_cm3: 1000,
} as const;

export type VolumeUnit = keyof typeof volumeConversions;
export type WeightUnit = keyof typeof weightConversions;
export type DensityUnit = keyof typeof densityConversions;

export interface MixRatio {
  cement: number;
  sand: number;
  gravel?: number;
}

export const mixRatios: Record<string, MixRatio> = {
  "1:5:10": { cement: 1, sand: 5, gravel: 10 },
  "1:4:8": { cement: 1, sand: 4, gravel: 8 },
  "1:3:6": { cement: 1, sand: 3, gravel: 6 },
  "1:2:4": { cement: 1, sand: 2, gravel: 4 },
  "1:1.5:3": { cement: 1, sand: 1.5, gravel: 3 },
  "1:1:2": { cement: 1, sand: 1, gravel: 2 },
  "1:2:3": { cement: 1, sand: 2, gravel: 3 },
  "1:1:1.5": { cement: 1, sand: 1, gravel: 1.5 },
};

export const mortar_ratios: Record<string, MixRatio> = {
  "1:3": { cement: 1, sand: 3 },
  "1:4": { cement: 1, sand: 4 },
  "1:5": { cement: 1, sand: 5 },
  "1:6": { cement: 1, sand: 6 },
};

export interface CalculationInputs {
  mixType: "concrete" | "mortar" | "cement-water";
  wetVolume: number;
  wetVolumeUnit: VolumeUnit;
  dryWetRatio: number;
  wastePercentage: number;
  mixRatio: string;
  cementDensity: number;
  densityUnit: DensityUnit;
  bagSize: number;
  bagUnit: WeightUnit;
}

export interface CalculationResults {
  dryVolume: number;
  totalVolume: number;
  cementVolume: number;
  sandVolume: number;
  gravelVolume: number;
  cementWeight: number;
  bagsNeeded: number;
  waterWeight: number;
  waterVolume: number;
}

export function calculateMaterials(inputs: CalculationInputs): CalculationResults {
  // Convert wet volume to cubic meters
  const wetVolumeM3 = inputs.wetVolume * volumeConversions[inputs.wetVolumeUnit];
  
  // Calculate dry volume
  const dryVolumeM3 = wetVolumeM3 * inputs.dryWetRatio;
  
  // Calculate total volume with waste
  const totalVolumeM3 = dryVolumeM3 * (1 + inputs.wastePercentage / 100);

  let cementVolumeM3 = 0;
  let sandVolumeM3 = 0;
  let gravelVolumeM3 = 0;

  if (inputs.mixType === "cement-water") {
    // For cement and water only, assume all volume is cement
    cementVolumeM3 = totalVolumeM3;
  } else {
    // Get the appropriate mix ratio
    const ratios = inputs.mixType === "mortar" ? mortar_ratios : mixRatios;
    const ratio = ratios[inputs.mixRatio];
    
    if (ratio) {
      const totalParts = ratio.cement + ratio.sand + (ratio.gravel || 0);
      
      cementVolumeM3 = totalVolumeM3 * (ratio.cement / totalParts);
      sandVolumeM3 = totalVolumeM3 * (ratio.sand / totalParts);
      gravelVolumeM3 = ratio.gravel ? totalVolumeM3 * (ratio.gravel / totalParts) : 0;
    }
  }

  // Convert cement density to kg/m³
  const cementDensityKgM3 = inputs.cementDensity * densityConversions[inputs.densityUnit];
  
  // Calculate cement weight in kg
  const cementWeightKg = cementVolumeM3 * cementDensityKgM3;
  
  // Convert bag size to kg
  const bagSizeKg = inputs.bagSize * weightConversions[inputs.bagUnit];
  
  // Calculate bags needed
  const bagsNeeded = Math.ceil(cementWeightKg / bagSizeKg);

  // Calculate water requirements (approximate 0.4-0.6 water-cement ratio, using 0.5)
  const waterWeightKg = cementWeightKg * 0.5;
  const waterVolumeL = waterWeightKg; // 1kg water ≈ 1L

  return {
    dryVolume: dryVolumeM3,
    totalVolume: totalVolumeM3,
    cementVolume: cementVolumeM3,
    sandVolume: sandVolumeM3,
    gravelVolume: gravelVolumeM3,
    cementWeight: cementWeightKg,
    bagsNeeded,
    waterWeight: waterWeightKg,
    waterVolume: waterVolumeL,
  };
}

export function convertVolume(value: number, fromUnit: VolumeUnit, toUnit: VolumeUnit): number {
  const valueInM3 = value * volumeConversions[fromUnit];
  return valueInM3 / volumeConversions[toUnit];
}

export function convertWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  const valueInKg = value * weightConversions[fromUnit];
  return valueInKg / weightConversions[toUnit];
}
