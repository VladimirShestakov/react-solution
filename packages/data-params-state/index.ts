import type { Router } from '@packages/router';
import { z } from 'zod';
import mc from 'merge-change';
import exclude from '@packages/utils/exclude';
import { State } from '@packages/state';
import type { DefaultConfig, DefaultParams, SetParamsOptions, TDataParamsState } from './types.ts';

export abstract class DataParamsState<
  Data,
  Params extends DefaultParams = DefaultParams,
  Config extends DefaultConfig = DefaultConfig
> {

  readonly state;
  protected config: Config;

  protected constructor(protected depends: {
    env: ImportMetaEnv,
    config?: Patch<Config>,
    router: Router
  }) {
    this.config = mc.merge(this.defaultConfig(), depends.config ?? {});
    this.state = new State<TDataParamsState<Data, Params>>(this.defaultState(), {
      log: this.config.log,
      name: this.config.name
    });
  }

  defaultState(): TDataParamsState<Data, Params> {
    return {
      data: {} as Data,
      params: {
        limit: 20,
        page: 1,
        sort: '',
      } as Params,
      wait: false,
      errors: null,
    };
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(): Config {
    return {
      log: true,
      name: 'dataParamsState',
      rememberParams: true,
    } as Config;
  }

  /**
   * Схема валидации параметров
   */
  paramsSchema() {
    return z.object({
      limit: z.number().gt(0).max(500).optional(),
      page: z.number().gt(0).optional(),
      sort: z.string().optional()
    });
  }

  /**
   * Инициализация и восстановление параметров
   * @param newParams Корректировка параметров по-умолчанию и восстановленных из адреса
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async initParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Параметры из URL (query string)
    const restoreParams = this.restoreParams() as Patch<Params>;
    // Сливаем все параметры
    const params = mc.merge(this.defaultState().params, restoreParams, newParams) as Patch<Params>;
    // Установка параметров и загрузка данных по ним
    return this.setParams(params, { push: false, load: true, ...options });
  }

  /**
   * Сброс параметров
   * @param newParams Корректировка параметров по-умолчанию
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async resetParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Сливаем с параметрами по умолчанию
    const params = { ...this.defaultState().params, ...newParams };
    // Установка параметров и загрузка данных по ним
    return this.setParams(params, { push: true, load: true, ...options });
  }

  /**
   * Установка новых параметров
   * @param newParams Корректировка текущих параметров
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async setParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Опции по умолчанию
    options = { load: true, push: true, ...options };
    try {
      // Новые параметры (нужно ли учитывать текущие?)
      const params: Params = mc.merge(this.state.get().params, newParams);
      if (options.clear) {
        // Сброс текущих данных (списка), установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.state.reset({
          params: { $set: params } as Patch<Params>, // Через $set, чтобы исключить слияние с текущими (оно уже выполнено)
          wait: options.load,
        }, 'Сброс текущих данных, установка параметров и статус ожидания');
      } else {
        // Установка новых параметров без сброса данных
        // Если данные будут загружаться, то установка состояние ожидания
        this.state.update({
          params: { $set: params } as Patch<Params>,
          wait: options.load,
          errors: null,
        }, 'Установка параметров и статуса ожидания');
      }
      //  Сохранить параметры
      if (this.config.rememberParams) this.saveParams(options.push);

      // Загрузка данные по новым параметрам
      if (options.load) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const apiParams = this.apiParams(params);
        // Выборка данных из АПИ
        this.state.update({
          data: await this.loadData(apiParams),
          wait: false,
          errors: null
        }, 'Список загружен');
      }
    } catch (e: any) {
      if (e.response?.data?.error?.data) {
        this.state.update({
          wait: false,
          errors: e.response.data.error.data.issues,
        }, 'Ошибка от сервера',);
      } else {
        throw e;
      }
    }
  }

  /**
   * Экспортирование параметров, например для сохранения или использования в URL
   * параметры группируются под именем модуля.
   * @param params
   * @param mergeWithCurrent
   */
  exportParams(params: Params | Patch<Params>, mergeWithCurrent = false) {
    if (mergeWithCurrent) params = mc.merge(this.state.get().params, params as Patch<Params>) as Params;
    // Исключение параметров, у которых значение по умолчанию
    const searchParams = exclude(params, this.defaultState().params) as PartialDeep<Params>;
    // Параметры группируются под именем модуля
    return { [this.config.name]: searchParams };
  }

  /**
   * Сохранение текущих параметров в history api (в search параметр адреса)
   * @param push
   */
  protected saveParams(push = true) {
    const savedParams = this.exportParams(this.state.get().params, false);
    this.depends.router.setSearchParams(savedParams, push);
  }

  /**
   * Восстановление параметров из адреса страницы (из search параметра адреса)
   */
  protected restoreParams(): PartialDeep<Params> {
    // Распарсенные параметры берутся по названию модуля состояния, так группировались по его имени
    const searchParams = this.depends.router.getSearchParams()[this.config.name];
    // После успешной валидации в searchParams останутся только допустимые параметры
    const validateParams = this.paramsSchema().safeParse(searchParams);
    if (!validateParams.success) {
      return {} as PartialDeep<Params>;
    } else {
      return validateParams.data as PartialDeep<Params>;
    }
  }

  /**
   * Параметры для АПИ запроса данных
   * @param params Исходные параметры из состояния
   */
  protected apiParams(params: Params): any {
    return {
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      sort: params.sort,
    };
  }

  /**
   * Загрузка данных
   * Необходимо реализовать логику в наследуемом классе
   * @param apiParams
   */
  protected async loadData(apiParams: any): Promise<Data> {
    return {} as Data;
  }

  getDump() {
    return this.state.get();
  }

  setDump(dump: TDataParamsState<Data, Params>) {
    this.state.set(dump);
  }
}
