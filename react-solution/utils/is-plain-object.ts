/**
 * Проверка на простой объект
 */
export function isPlainObject(value: object | any): value is Record<string, any> {
  return (
    !!value && (!value.__proto__ || Object.getPrototypeOf(value).constructor.name === 'Object')
  );
}
