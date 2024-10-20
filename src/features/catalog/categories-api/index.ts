import { ApiCrudEndpoint } from 'react-solution';
import type { CategoriesApiConfig } from './types.ts';

export class CategoriesApi extends ApiCrudEndpoint<CategoriesApiConfig> {
  protected override config: CategoriesApiConfig = {
    url: '/api/v1/categories',
  };
}
