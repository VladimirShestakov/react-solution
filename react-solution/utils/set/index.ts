import { splitPath } from '../split-path';

/**
 * Установка значения по пути. Если в obj путь не найден, то будут созданы соотв сойства
 * @param obj
 * @param path
 * @param value
 * @param doNotReplace
 * @param separator
 * @returns {*}
 */
export function set(obj, path, value, doNotReplace, separator = '.') {
  if (obj && typeof obj.toJSON === 'function') {
    obj = obj.toJSON();
  }
  if (typeof path === 'number') {
    path = [path];
  }
  if (!path || !path.length) {
    return obj;
  }
  if (!Array.isArray(path)) {
    return set(obj, splitPath(path, separator), value, doNotReplace);
  }
  const currentPath = path[0];
  const currentValue = obj[currentPath];
  if (path.length === 1) {
    // Если последний элемент пути, то установка значения
    if (!doNotReplace || currentValue === void 0) {
      obj[currentPath] = value;
    }
    return currentValue;
  }
  // Если путь продолжается, а текущего элемента нет, то создаётся пустой объект
  if (currentValue === void 0) {
    obj[currentPath] = {};
  }
  return set(obj[currentPath], path.slice(1), value, doNotReplace, separator);
}
