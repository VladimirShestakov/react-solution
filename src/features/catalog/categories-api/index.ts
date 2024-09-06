import ApiCrudEndpoint from '@packages/http-client/api-crud-endpoint';
import type { CategoriesApiConfig } from './types.ts';

export class CategoriesApi extends ApiCrudEndpoint<CategoriesApiConfig> {

  protected override defaultConfig() {
    return {
      url: '/api/v1/categories',
    };
  }
}
