//client\src\types\measure-types\measureTypes.ts
export type Measure = {
  id?: string;
  name: string;
};
export type MeasureResponse = {
  success: boolean;
  data: Measure[];
};
