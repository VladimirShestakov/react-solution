export type CategoriesStoreConfig = object;

export interface CategoriesStoreData {
  items: CategoryItem[];
  roots: CategoryItem[];
  wait: boolean;
  errors: any;
}

export type CategoryItem = {
  _id: string;
  title: string;
  children?: CategoryItem[];
  parent?: {
    _id: string;
  };
};
