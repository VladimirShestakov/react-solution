import { articlesApi } from './articles-api/provider';
import { articlesStore } from './articles-store/provider';
import { categoriesApi } from './categories-api/provider';
import { categoriesStore } from './categories-store/provider';
import { translations } from './translations/provider';

export const catalogFeature = [
  articlesApi,
  categoriesApi,
  translations,
  articlesStore,
  categoriesStore,
];
