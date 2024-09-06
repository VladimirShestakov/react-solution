type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

interface ObjectPrimitive {
  [key: string]: Primitive | ObjectPrimitive;
}

/**
 * Partial в глубину для свойств объекта
 */
type PartialDeep<T> =
  T extends (infer U)[]
    ? PartialDeep<U>[]
    : T extends object
      ? { [K in keyof T]?: PartialDeep<T[K]> }
      : T
  ;

/**
 * Операциями для merge-change
 */

type Operations = '$set' | '$unset' | '$leave';

type PatchOperation<T> = T | {
  // Переустановить значения без слияния с текущим
  $set?: T,
  // Удалить свойства
  $unset?: (keyof T | string | number | symbol)[],
  // Оставить только указанные свойства
  $leave?: (keyof T | string | number | symbol)[]
};

/**
 * Объект-патч с необязательными свойствами в глубину и с операциями для merge-change
 */
type Patch<T> = PatchOperation<
  T extends (infer U)[]
    ? U[]
    : T extends { [key: string | number | symbol]: any }
      ? { [K in keyof T]?: Patch<T[K]> }
      : T
>;

/**
 * Формирует пути на свойства объекта с учётом вложенности
 * Например NestedKeyOf<typeof {a: {b: {c: 100}}, d: 1 }> => type "a.b.c" | "d"
 */
type NestedKeyOf<Obj extends object> = {
  [Name in keyof Obj & string]: // Перебираем ключи объекта
  // Свойство является объектом?
  Obj[Name] extends ObjectPrimitive
    // Если свойство объект, то рекурсия на вложенные свойства. Получится шаблон спутями на все вложенные свойства
    ? Name | `${Name}.${NestedKeyOf<Obj[Name]>}`
    // Для остальных типов берем их название
    : `${Name}`

}[keyof Obj & string]; // Вытаскиваем типы всех свойств - это строковые литералы (пути на свойства)
