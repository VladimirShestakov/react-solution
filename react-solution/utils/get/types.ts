export interface Value {
  [key: string]: unknown | Value;
}

// /**
//  * Извлекает все возможные пути в объекте
//  * Например, ExtractPaths<{a: {b: {c: 100}}, d: 1}> => "a" | "a.b" | "a.b.c" | "d"
//  */
// export type ExtractPaths<Obj extends Value> = {
//   [Name in keyof Obj & string]: Obj[Name] extends Value
//     ? Name | `${Name}.${ExtractPaths<Obj[Name]>}`
//     : `${Name}`;
// }[keyof Obj & string];
//
// /**
//  * Извлекает тип значения по конкретному пути, включая объекты и массивы
//  * Например, PathToType<{a: {b: string[]}}, 'a'> => {b: string[]}
//  *            PathToType<{a: {b: string[]}}, 'a.b'> => string[]
//  */
// export type PathToType<T extends Value, P extends string> = P extends keyof T
//   ? T[P] // Возвращаем тип значения, будь то примитив, объект или массив
//   : P extends `${infer Key}.${infer Rest}`
//     ? Key extends keyof T
//       ? T[Key] extends Value
//         ? PathToType<T[Key], Rest>
//         : never // Если по пути не объект, путь некорректен
//       : never
//     : never;


/**
 * Извлекает все возможные пути в объекте, включая индексы массивов
 * Например, ExtractPaths<{items: string[], x: {y: number}}> => "items" | "items.0" | "items.1" | ... | "x" | "x.y"
 */
export type ExtractPaths<Obj> = {
  [Name in keyof Obj & string]: Obj[Name] extends Value
    ? Name | `${Name}.${ExtractPaths<Obj[Name]>}`
    : Obj[Name] extends Array<infer E>
      ? Name | `${Name}.${number}` | (E extends Value ? `${Name}.${number}.${ExtractPaths<E>}` : never)
      : Name;
}[keyof Obj & string];

/**
 * Извлекает тип значения по конкретному пути, включая объекты, массивы и их элементы
 * Например, PathToType<{items: string[]}, 'items.0'> => string
 */
export type PathToType<T, P extends string> = P extends keyof T
  ? T[P] // Возвращаем тип значения (примитив, объект или массив)
  : P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? T[Key] extends Value
        ? PathToType<T[Key], Rest>
        : T[Key] extends Array<infer E>
          ? Rest extends `${infer Index extends number}`
            ? E
            : Rest extends `${infer Index extends number}.${infer SubPath}`
              ? E extends Value
                ? PathToType<E, SubPath>
                : never
              : never
          : never
      : never
    : never;
