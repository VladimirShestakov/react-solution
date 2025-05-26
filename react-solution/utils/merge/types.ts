import { Type } from '../type/types.ts';

export enum MergeChangeKind {
  MERGE = 'merge', // cloning
  PATCH = 'patch', // change in source value
  UPDATE = 'update', //immutable update (new value if there are diffs)
}

export type Action = `${Type}_${Type}`;

export enum Operations {
  '$set',
  '$unset',
  '$leave',
  '$pull',
  '$push',
  '$concat',
}

export type MergeFn = (first: any, second: any, kind: MergeChangeKind) => unknown;

export type MergeMethods = Partial<Record<Action, MergeFn>>;

export type PatchOperation<T> =
  | T
  | {
      // Переустановить значения без слияния с текущим
      $set?: T;
      // Удалить свойства
      $unset?: (keyof T | string | number | symbol)[];
      // Оставить только указанные свойства
      $leave?: (keyof T | string | number | symbol)[];
    };

/**
 * Объект-патч с необязательными свойствами в глубину и с операциями для merge-change
 */
export type Patch<T> = PatchOperation<
  T extends (infer U)[]
    ? U[]
    : T extends { [key: string | number | symbol]: any }
      ? { [K in keyof T]?: Patch<T[K]> }
      : T
>;

export type NotMerged =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined
  | Array<any>
  | Date
  | Map<any, any>
  | Set<any>
  | RegExp
  | WeakSet<any>
  | WeakMap<any, any>
  | Promise<any>
  | Error
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | ArrayBuffer;

export type Merged<T, U> = U extends undefined
  ? T
  : U extends NotMerged
    ? U
    : T extends NotMerged
      ? U
      : {
          [K in Exclude<keyof T | keyof U, Operations>]: K extends keyof T & keyof U
            ? Merged<T[K], U[K]>
            : K extends keyof T
              ? T[K]
              : K extends keyof U
                ? U[K]
                : never;
        };

export type MergedAll<T extends any[]> = T extends [infer First, infer Second, ...infer Rest]
  ? Rest extends any[]
    ? MergedAll<[Merged<First, Second>, ...Rest]>
    : Merged<First, Second>
  : T extends [infer Only]
    ? Only
    : never;
