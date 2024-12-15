/**
 * Генератор чисел с шагом 1
 */
export function codeGenerator(start = 0) {
  return () => ++start;
}
