export type PropertyPath = string | number | Array<string | number>

export interface ObjectValue {
  [key: string]: unknown | ObjectValue;
}
