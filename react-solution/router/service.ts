import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from 'history';
import mc, { type Patch } from 'merge-change';
import qs from 'qs';
import type { RouterConfig } from './types';

export class RouterService {
  readonly history: MemoryHistory | BrowserHistory;
  // protected httpStatus: HTTPStatus[] = [{ status: 200 }];
  protected config: RouterConfig = {
    type: this.depends.env.SSR ? 'memory' : 'browser',
    basename: this.depends.env.BASE_URL,
    initialEntries: this.depends.env.REQUEST ? [this.depends.env.REQUEST.url] : undefined,
  };

  constructor(
    protected depends: {
      env: Env;
      config?: Patch<RouterConfig>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config);
    switch (this.config.type) {
      case 'memory':
        this.history = createMemoryHistory(this.config);
        break;
      case 'browser':
      default:
        this.history = createBrowserHistory(this.config);
        break;
    }
  }

  get basename() {
    return this.config.basename;
  }

  makeSearch(search: object, clear = false, prefix = false) {
    const currentParams = this.getSearchParams();
    const newParams = clear ? search : { ...currentParams, ...search };
    return qs.stringify(newParams, {
      addQueryPrefix: prefix,
      arrayFormat: 'comma',
      encode: false,
    });
  }

  /**
   * Создание ссылки с учётом текущего пути и search (query) параметров
   * @param search Объект с search параметрами.
   * @param path Новый путь. Если не указан, то используется текущий
   * @param clear Удалить все текущие search параметры
   * @returns Итоговая строка для href ссылки
   */
  makeHref(search: object, path?: string, clear = false): string {
    const newSearch = this.makeSearch(search, clear, true);
    return (
      (path || this.getPath()) + newSearch + (this.depends.env.SSR ? '' : window.location.hash)
    );
  }

  /**
   * Текуший путь в адресе
   * @returns {*}
   */
  getPath() {
    return this.history.location.pathname;
  }

  /**
   * Текущие search параметры, распаренные из строки
   * @returns {*}
   */
  getSearchParams(): any {
    // @todo Проверить this.history.location.search может быть пустым, так как в store параметры устанавливаются напрямую в window.location
    return qs.parse(this.history.location.search, { ignoreQueryPrefix: true, comma: true }) || {};
  }

  /**
   * Установка search параметров
   * @param params Новые параметры
   * @param push Способ обновления Location.search. Если false, то используется history.replace()
   * @param clear Удалить текущие параметры
   * @param path Новый путь. Если не указан, то используется текущий
   */
  setSearchParams(params: object, push = true, clear = false, path?: string) {
    if (this.depends.env.SSR) return;
    const url = this.makeHref(params, path, clear);
    if (push) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }

  /**
   * Удаление всех search параметров
   * @param push Способ обновления Location.search. Если false, то используется window.history.replaceState()
   */
  clearSearchParams(push = true) {
    if (this.depends.env.SSR) return;
    const url = window.location.pathname + window.location.hash;
    if (push) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }
}
