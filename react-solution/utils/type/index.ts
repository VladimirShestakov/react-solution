import { Type } from './types.ts';

const toLowerCase = new Set(['Number', 'String', 'Boolean', 'Object', 'Symbol'])

/**
 * Тип значения - название конструктора
 * Number, String, Boolean, Object, Array, Date, RegExp, Function, Symbol, Set, Map and other system and custom constructor names
 * @param value
 */
export function type(value: unknown): Type {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'undefined') {
    return 'undefined';
  }
  if (typeof value === 'object' && !('__proto__' in value)) {
    return 'object';
  }

  const name = Object.getPrototypeOf(value).constructor.name;

  return toLowerCase.has(name) ? name.toLowerCase() : name;
}
