import { ExtractPaths, ExtractPathsAny, get } from 'merge-change';

export type Item<
  RequiredKey extends string = '_id',
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  [key in RequiredKey]: unknown;
};

// Тип узла дерева с детьми
export type TreeNode<
  T extends Record<string, unknown>,
  Pkey extends string = '_id',
  CKey extends string = 'children',
> = T & {
  [key in Pkey]: unknown;
} & {
  [key in CKey]: TreeNode<T, Pkey, CKey>[];
};

/**
 * Преобразование списка в иерархию
 */
export function listToTree<
  T extends Record<string, unknown>,
  Pkey extends string = '_id',
  CKey extends string = 'children',
  ParentPath extends string = ExtractPaths<Item<Pkey, T>, '.'>,
>(
  list: Array<Item<Pkey, T>>,
  privateKey: Pkey = '_id' as Pkey,
  parentKey: ParentPath = 'parent._id' as ParentPath,
  childrenKey: CKey = 'children' as CKey,
): TreeNode<T, Pkey, CKey>[] {
  const trees: Record<string, any> = {};
  const roots: Record<string, any> = {};

  for (const item of list) {
    const id = item[privateKey] as string;

    if (!trees[id]) {
      trees[id] = { ...item, [childrenKey]: [] };
      roots[id] = trees[id];
    } else {
      trees[id] = Object.assign(trees[id], item);
      trees[id][childrenKey] = trees[id][childrenKey] || [];
      roots[id] = trees[id];
    }

    const parentId = get(item, parentKey as ExtractPathsAny<Item<Pkey, T>, '.'>) as string | undefined;
    if (parentId) {
      if (!trees[parentId]) {
        trees[parentId] = { [childrenKey]: [] };
      }
      trees[parentId][childrenKey].push(trees[id]);
      if (roots[id]) {
        delete roots[id];
      }
    }
  }

  return Object.values(roots);
}
