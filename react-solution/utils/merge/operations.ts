import { Operations } from './types.ts';
import { get } from '../get';
import { set } from '../set';
import { unset } from '../unset';

/**
 * Checking if a declarative operation exists
 * @param operation
 * @returns {boolean}
 */
export function isOperation(operation: unknown): operation is Operations {
  return typeof operation === 'string' && operation in operations;
}

/**
 * Extract operations from object
 * @param object
 * @returns {Object}
 */
export function extractOperations<T extends Record<string, unknown>>(object: T): Partial<T> {
  const result: Partial<T> = {};
  const keys = Object.keys(object) as Array<keyof T>;
  for (const key of keys) {
    if (isOperation(key)) {
      result[key] = object[key];
      delete object[key];
    }
  }
  return result;
}

/**
 * Execute declarative operation
 * @param source
 * @param operation
 * @param params
 * @returns {*}
 */
export function operation(source, operation, params) {
  if (operations[operation]) {
    return operations[operation](source, params);
  }
}

export const operations = {
  /**
   * $set
   * @param source
   * @param params Объект со свойствами, которые нужно добавить без слияния. Ключи свойств могут быть путями с учётом вложенности
   * @returns {boolean}
   */
  $set(source, params) {
    const fieldNames = Object.keys(params);
    for (const fieldName of fieldNames) {
      set(source, fieldName, params[fieldName]);
    }
    return fieldNames.length > 0;
  },

  /**
   * $unset
   * Удаление свойств объекта или элементов массива.
   * @param source
   * @param params Массив путей на удаляемые свойства. Учитывается вложенность
   * @returns {boolean}
   */
  $unset(source, params) {
    if (Array.isArray(params)) {
      // Перечень полей для удаления
      for (const fieldName of params) {
        unset(source, fieldName);
      }
      return params.length > 0;
    }
    return false;
  },

  /**
   * $leave
   * Удаление всех свойств или элементов за исключением указанных
   * @param source
   * @param params Массив свойств, которые не надо удалять
   * @returns {boolean}
   */
  $leave(source, params) {
    if (Array.isArray(params)) {
      if (source && typeof source.toJSON === 'function') {
        source = source.toJSON();
      }
      const names = {};
      for (const param of params) {
        let name = param;
        let subPath = '';
        if (typeof param === 'string') {
          [name, subPath] = param.split('.');
        }
        if (!names[name]) {
          names[name] = [];
        }
        if (subPath) {
          names[name].push(subPath);
        }
      }
      const type = type(source);
      if (type === 'Object') {
        const keys = Object.keys(source);
        for (const key of keys) {
          if (!names[key]) {
            delete source[key];
          } else if (names[key].length > 0) {
            operations.$leave(source[key], names[key]);
          }
        }
      } else if (type === 'Array') {
        for (let key = source.length - 1; key >= 0; key--) {
          if (!(key in names)) {
            source.splice(key, 1);
          }
        }
      }
      return params.length > 0;
    }
    return false;
  },

  /**
   * $pull
   * Удаление элементов по равенству значения
   * @param source
   * @param params
   * @returns {boolean}
   */
  $pull(source, params) {
    if (source && typeof source.toJSON === 'function') {
      source = source.toJSON();
    }
    const paths = Object.keys(params);
    for (const path of paths) {
      const cond = params[path];
      const array = get(source, path, []);
      if (Array.isArray(array)) {
        for (let i = array.length - 1; i >= 0; i--) {
          if (cond === array[i]) {
            source.splice(i, 1);
          }
        }
      } else {
        throw new Error('Cannot pull on not array');
      }
    }
    return paths.length > 0;
  },

  /**
   * $push
   * Добавление элемента
   * @param source
   * @param params
   * @returns {boolean}
   */
  $push(source, params) {
    if (source && typeof source.toJSON === 'function') {
      source = source.toJSON();
    }
    const paths = Object.keys(params);
    for (const path of paths) {
      const value = params[path];
      const array = get(source, path, []);
      if (Array.isArray(array)) {
        array.push(value);
        set(source, path, array);
      } else {
        throw new Error('Cannot push on not array');
      }
    }
    return paths.length > 0;
  },

  /**
   * $concat
   * Слияние элементов массива
   * @param source
   * @param params
   * @returns {boolean}
   */
  $concat(source, params) {
    if (source && typeof source.toJSON === 'function') {
      source = source.toJSON();
    }
    const paths = Object.keys(params);
    for (const path of paths) {
      let value = params[path];
      let array = get(source, path, []);
      if (Array.isArray(array)) {
        array = array.concat(value);
        set(source, path, array);
      } else {
        throw new Error('Cannot concat on not array');
      }
    }
    return paths.length > 0;
  },
};
