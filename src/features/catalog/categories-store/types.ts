export type CategoriesStoreConfig = {
  log?: boolean;
  name?: string;
};

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
};
