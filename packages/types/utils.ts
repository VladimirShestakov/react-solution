export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export interface ObjectPrimitive {
  [key: string]: Primitive | ObjectPrimitive;
}

/**
 * Partial в глубину для свойств объекта
 */
export type PartialDeep<T> = T extends (infer U)[]
  ? PartialDeep<U>[]
  : T extends object
    ? { [K in keyof T]?: PartialDeep<T[K]> }
    : T;


/**
 * Все названия методов из типа
 */
export type ExtractMethodNames<T, M = (...args: any[]) => any> = {
  [K in keyof T]: T[K] extends M ? K : never;
}[keyof T];


/**
 * Формирует пути на свойства объекта с учётом вложенности
 * Например NestedKeyOf<typeof {a: {b: {c: 100}}, d: 1 }> => type "a.b.c" | "d"
 */
export type NestedKeyOf<Obj extends object> = {
  [Name in keyof Obj & string]: Obj[Name] extends ObjectPrimitive // Свойство является объектом? // Перебираем ключи объекта
    ? // Если свойство объект, то рекурсия на вложенные свойства. Получится шаблон спутями на все вложенные свойства
    Name | `${Name}.${NestedKeyOf<Obj[Name]>}`
    : // Для остальных типов берем их название
    `${Name}`;
}[keyof Obj & string]; // Вытаскиваем типы всех свойств - это строковые литералы (пути на свойства)

/**
 * Операциями для merge-change
 */

export type Operations = '$set' | '$unset' | '$leave';

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
