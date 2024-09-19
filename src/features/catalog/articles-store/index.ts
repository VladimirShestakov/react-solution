import { FindQuery } from '../../../../packages/http-client/api-crud-endpoint/types.ts';
import exclude from '../../../../packages/utils/exclude';
import { z } from 'zod';
import mc from 'merge-change';
import { DataParamsState } from '../../../../packages/data-params-state';
import type { DefaultConfig } from '../../../../packages/data-params-state/types.ts';
import type { RouterService } from '../../../../packages/router';
import type { ArticlesApi } from '@src/features/catalog/articles-api';
import type { TArticleData, TArticleParams } from './types.ts';

/**
 * Детальная информация о пользователе
 */
export class ArticlesStore extends DataParamsState<TArticleData, TArticleParams> {

  constructor(protected override depends: {
    env: ImportMetaEnv,
    config?: Patch<DefaultConfig>,
    router: RouterService,
    articlesApi: ArticlesApi,
  }) {
    super(depends);
  }

  override defaultState() {
    return mc.patch(super.defaultState(), {
      data: {
        items: [],
        count: 0
      },
      params: {
        category: '',
        query: ''
      },
    });
  }

  /**
   * Схема валидации восстановленных параметров
   */
  override paramsSchema() {
    return super.paramsSchema().extend({
      // sort: z.string().optional(),
      query: z.string().optional(),
      //category: z.string().optional(), // Категорию не надо сохранять, так как будет указываться страницей
    });
  }

  /**
   * Параметры для АПИ запроса
   * @param params Параметры состояния
   */
  protected override apiParams(params: TArticleParams): FindQuery {
    const apiParams = mc.patch(super.apiParams(params), {
      fields: `items(*,category(title),madeIn(title)), count`,
      filter: {
        category: params.category,
        query: params.query
      },
    });

    return exclude(apiParams, {
      skip: 0,
      filter: {
        category: ''
      }
    });
  }

  /**
   * Загрузка данных
   * @param apiParams Параметры АПИ запроса
   */
  protected override async loadData(apiParams: FindQuery): Promise<TArticleData> {
    const response = await this.depends.articlesApi.findMany(apiParams);
    // Установка полученных данных в состояние
    return response.data.result;
  }
}
