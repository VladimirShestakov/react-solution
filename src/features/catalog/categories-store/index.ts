import mc, { type Patch } from 'merge-change';
import { type LogInterface, State } from 'react-solution';
import { listToTree } from 'react-solution';
import type { CategoriesApi } from '../categories-api';
import { CategoriesStoreConfig, CategoriesStoreData, CategoryItem } from './types.ts';

/**
 * Детальная информация о пользователе
 */
export class CategoriesStore {
  readonly state: State<CategoriesStoreData>;
  protected config: CategoriesStoreConfig = {};

  constructor(
    protected depends: {
      categoriesApi: CategoriesApi;
      config?: Patch<CategoriesStoreConfig>;
      logger: LogInterface;
    },
  ) {
    this.config = mc.merge(this.config, depends.config);
    this.depends.logger = this.depends.logger.named(this.constructor.name);
    this.state = new State<CategoriesStoreData>(this.defaultState(), this.depends.logger);
  }

  defaultState(): CategoriesStoreData {
    return {
      items: [],
      roots: [],
      wait: false,
      errors: null,
    };
  }

  /**
   * Загрузка списка из апи
   * @param params Параметры запроса
   * @returns {Promise<*>}
   */
  async load(params: any) {
    this.state.update({ wait: true, errors: null }, 'Статус ожидания');
    try {
      const response = await this.depends.categoriesApi.findMany(params);
      const result = response.data.result;
      const items: Array<CategoryItem> = result.items;
      const patch: Patch<CategoriesStoreData> = {
        roots: listToTree(items, '_id', 'parent._id'),
        wait: false,
        errors: null,
      };
      this.state.update(mc.patch(result, patch), 'Категории загружены');
      return result;
    } catch (e: any) {
      if (e.response?.data?.error?.data) {
        this.state.update(
          { wait: false, errors: e.response.data.error.data.issues },
          'Ошибка от сервера',
        );
      } else {
        throw e;
      }
    }
  }

  getDump() {
    return this.state.get();
  }

  setDump(dump: CategoriesStoreData) {
    this.state.set(dump);
  }
}
