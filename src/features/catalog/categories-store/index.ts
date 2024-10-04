import mc from 'merge-change';
import { State } from 'react-solution';
import { listToTree } from 'react-solution';
import type { Patch } from 'react-solution';
import type { CategoriesApi } from '../categories-api';
import type { CategoriesStoreConfig, CategoriesStoreData } from './types.ts';

/**
 * Детальная информация о пользователе
 */
export class CategoriesStore {
  readonly state: State<CategoriesStoreData>;
  protected config: CategoriesStoreConfig;

  constructor(
    protected depends: {
      categoriesApi: CategoriesApi;
      config?: Patch<CategoriesStoreConfig>;
    },
  ) {
    this.config = mc.merge(this.defaultConfig(), depends.config ?? {});
    this.state = new State<CategoriesStoreData>(this.defaultState(), {
      log: this.config.log,
      name: this.config.name,
    });
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
   * Конфигурация по умолчанию
   */
  defaultConfig(): CategoriesStoreConfig {
    return {
      log: true,
      name: 'Categories state',
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
      this.state.update(
        mc.patch(result, { roots: listToTree(result.items), wait: false, errors: null }),
        'Категории загружены',
      );
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
