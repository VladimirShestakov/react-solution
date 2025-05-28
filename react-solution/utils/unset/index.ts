import type { ObjectValue, PropertyPath } from './types.ts';
import { type } from '../type';
import { hasMethod } from '../has-method.ts';
import { splitPath } from '../split-path';

export function unset<Type>(value: Type, path: PropertyPath, separator: string = '.'): Type {
  if (value) {
    const source = value as unknown;
    if (hasMethod(source,'toJSON')) {
      value = source.toJSON();
    }
  }
  if (value === null || typeof value === 'undefined') return value;
  if (typeof path === 'number') path = [path];
  if (!path) return value;
  if (typeof path === 'string') return unset(value, splitPath(path, separator));

  const currentPath = path[0];

  if (currentPath === '*') {
    const t = type(value);
    // Очистка всех свойств объекта
    if (t === 'Object') {
      const source = value as ObjectValue;
      const keys = Object.keys(source);
      for (const key of keys) {
        delete (source)[key];
      }
    } else if (t === 'Array') {
      (value as []).splice(0, (value as []).length);
    }
    return value;
  }

  if (path.length === 1) {
    if (Array.isArray(value)) {
      value.splice(currentPath as number, 1);
    } else {
      delete (value as ObjectValue)[currentPath];
    }
  } else {
    const t = type((value as ObjectValue)[currentPath]);
    if (path[1] === '*' && t !== 'Object' && t !== 'Array') {
      (value as ObjectValue)[currentPath] = undefined;
    } else {
      return unset((value as ObjectValue)[currentPath], path.slice(1));
    }
  }
  return value;
}
