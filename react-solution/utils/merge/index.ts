import { Action, MergeChangeKind, Merged, MergedAll, MergeMethods } from './types.ts';
import { type } from '../type';
import { operation } from './operations.ts';

const operationsNames = new Set(['$set', '$unset', '$leave', '$pull', '$push', '$concat']);

export function createMergeChange(kind: MergeChangeKind, customMethods: MergeMethods = {}) {
  // Default methods for handling different type combinations
  const defaultMethods: MergeMethods = {
    unknown_unknown(first: any, second: any, kind: MergeChangeKind) {
      return mergeChange(undefined, second);
    },
    unknown_undefined(first: any, second: undefined, kind: MergeChangeKind) {
      return mergeChange(undefined, first);
    },
    undefined_unknown(first: undefined, second: any) {
      return second;
    },
    undefined_Date(first: undefined, second: Date, kind: MergeChangeKind) {
      return kind === MergeChangeKind.MERGE ? new Date(second) : second;
    },
    undefined_Set<T extends Set<any>>(first: undefined, second: T, kind: MergeChangeKind): T {
      return kind === MergeChangeKind.MERGE ? (new Set(second) as T) : second;
    },
    undefined_Map<T extends Map<any, any>>(first: undefined, second: T, kind: MergeChangeKind): T {
      return kind === MergeChangeKind.MERGE ? (new Map(second) as T) : second;
    },
    undefined_Array(first: undefined, second: any[], kind: MergeChangeKind) {
      return kind === MergeChangeKind.MERGE ? methods.Array_Array!([], second, kind) : second;
    },
    undefined_object(first: undefined, second: object, kind: MergeChangeKind) {
      return methods.object_object!(second, {}, kind);
    },
    object_object(first: any, second: any, kind: MergeChangeKind) {
      const result = kind === MergeChangeKind.PATCH ? first : {};
      let resultField;
      let isChange = kind === MergeChangeKind.MERGE;
      const operations = [];
      const keysFirst = Object.keys(first);
      const keysSecond = new Set(Object.keys(second));
      for (const key of keysFirst) {
        if (key in second) {
          resultField = mergeChange(first[key], second[key]);
          keysSecond.delete(key);
        } else {
          resultField = mergeChange(first[key], undefined);
        }
        isChange = isChange || resultField !== first[key];
        result[key] = resultField;
      }
      for (const key of keysSecond) {
        if (operationsNames.has(key)) {
          operations.push([key, second[key]]);
        } else {
          resultField = mergeChange(undefined, second[key]);
          isChange = isChange || resultField !== first[key];
          result[key] = resultField;
        }
      }
      // Execute declarative operations
      // for (const [op, params] of operations) {
      //   isChange = operation(result, op, params) || isChange;
      // }
      return isChange ? result : first;
    },
    Array_Array(first: any[], second: any[], kind: MergeChangeKind) {
      if (kind === MergeChangeKind.MERGE) {
        return second.map((item: unknown) => mergeChange(undefined, item));
      }
      return second;
    },
  };

  // Merge custom methods with default methods
  const methods: MergeMethods = { ...defaultMethods, ...customMethods };

  const mergeChange = <T extends any[]>(...values: T): MergedAll<T> => {
    return values.reduce((first: any, second: any) => {
      const firstType = type(first);
      const secondType = type(second);
      const actions: Action[] = [
        `${firstType}_${secondType}`,
        `${firstType}_unknown`,
        `unknown_${secondType}`,
        `unknown_unknown`,
      ];
      for (const action of actions) {
        if (methods[action]) {
          return methods[action](first, second, kind);
        }
      }
      return first;
    });
  };

  return mergeChange;
}

// Factory functions for the three merge types
export function createMerge(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.MERGE, customMethods);
}

export function createUpdate(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.UPDATE, customMethods);
}

export function createPatch(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.PATCH, customMethods);
}

export default {
  merge: createMergeChange(MergeChangeKind.MERGE),
  update: createMergeChange(MergeChangeKind.UPDATE),
  patch: createMergeChange(MergeChangeKind.PATCH),
};
