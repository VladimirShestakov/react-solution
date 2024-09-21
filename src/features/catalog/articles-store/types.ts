import type { DefaultParams } from '../../../../packages/data-params-state';

export type TArticleItem = {
  _id: string;
  title: string;
  madeIn: {
    _id: string;
    title: string;
  };
  category: {
    _id: string;
    title: string;
  };
};

export interface TArticleData {
  items: TArticleItem[];
  count: number;
}

export interface TArticleParams extends DefaultParams {
  // Фильтр по категории (идентификатору)
  category: string;
  query: string;
}
