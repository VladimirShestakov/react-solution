import ApiCrudEndpoint from '@packages/http-client/api-crud-endpoint';
import type { ArticlesApiConfig } from './types.ts';

export class ArticlesApi extends ApiCrudEndpoint<ArticlesApiConfig> {

  protected override defaultConfig() {
    return {
      url: '/api/v1/articles',
    };
  }
}