import { articlesApi } from './articles-api/inject.ts';
import { articlesStore } from './articles-store/inject.ts';
import { categoriesApi } from './categories-api/inject.ts';
import { categoriesStore } from './categories-store/inject.ts';
import { injectTranslations } from './translations/ingect.ts';

export const catalogFeature = [
  articlesApi,
  categoriesApi,
  injectTranslations,
  articlesStore,
  categoriesStore
];
