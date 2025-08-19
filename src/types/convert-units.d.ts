declare module 'convert-units' {
  interface ConvertUnits {
    (): ConvertUnits;
    from: (unit: string) => ConvertUnits;
    to: (unit: string) => number;
    possibilities: (measure?: string) => string[];
    measures: () => string[];
    list: (measure?: string) => Array<{ abbr: string; measure: string; system: string; singular: string; plural: string }>;
    describe: (unit: string) => { abbr: string; measure: string; system: string; singular: string; plural: string };
  }
  
  const convert: (value?: number) => ConvertUnits;
  export = convert;
}
