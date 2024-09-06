import { HttpClient } from '@packages/http-client';
import { ApiError } from '@packages/http-client/types.ts';
import { State } from '@packages/state';
import mc from 'merge-change';
import type { SignInBody } from '../users-api/types.ts';
import type { UsersApi } from '../users-api';
import type { SessionStoreConfig, SessionStoreData } from './types.ts';

/**
 * Детальная информация о пользователе
 */
export class SessionStore {
  readonly state;
  protected config: SessionStoreConfig;

  constructor(protected depends: {
    env: ImportMetaEnv,
    httpClient: HttpClient,
    usersApi: UsersApi,
    config?: Patch<SessionStoreConfig>
  }) {
    this.config = mc.merge(this.defaultConfig(), depends.config ?? {});
    this.state = new State<SessionStoreData>(this.defaultState(), {
      log: this.config.log,
      name: this.config.name
    });
  }

  defaultState(): SessionStoreData {
    return {
      user: null,
      token: null,
      waiting: true,
      errors: null,
      exists: false,
    };
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(): SessionStoreConfig {
    return {
      log: true,
      name: 'Sessions state',
      tokenHeader: 'X-Token',
      saveToLocalStorage: !this.depends.env.SSR
    };
  }

  /**
   * Авторизация (вход)
   */
  async signIn(data: SignInBody) {
    this.state.set(this.defaultState(), 'Авторизация');
    try {
      const res = await this.depends.usersApi.signIn({data});
      this.state.set({
        ...this.state.get(),
        token: res.data.result.token,
        user: res.data.result.user,
        exists: true,
        waiting: false
      }, 'Успешная авторизация');

      if (this.config.saveToLocalStorage) {
        // Запоминаем токен, чтобы потом автоматически аутентифицировать юзера
        window.localStorage.setItem('token', res.data.result.token);
      }
      // Устанавливаем токен в АПИ
      this.depends.httpClient.setHeader(this.config.tokenHeader, res.data.result.token);
      return true;
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.response?.data?.error) {
          this.state.set({
            ...this.state.get(),
            errors: this.simplifyErrors(e.response.data.error.data.issues),
            waiting: false
          }, 'Ошибка авторизации');
        }
      } else {
        console.error(e);
      }
    }
    return false;
  }

  /**
   * Отмена авторизации (выход)
   */
  async signOut() {
    try {
      await this.depends.usersApi.signOut();
      // Удаляем токен
      if (this.config.saveToLocalStorage) {
        window.localStorage.removeItem('token');
      }
      // Удаляем заголовок
      this.depends.httpClient.setHeader(this.config.tokenHeader, null);
    } catch (error) {
      console.error(error);
    }
    this.state.set({...this.defaultState(), waiting: false});
  }

  /**
   * По токену восстановление сессии
   */
  async remind() {
    const token = this.config.saveToLocalStorage ? localStorage.getItem('token') : null;
    if (token) {
      // Устанавливаем токен в АПИ
      this.depends.httpClient.setHeader(this.config.tokenHeader, token);
      // Проверяем токен выбором своего профиля
      const res = await this.depends.usersApi.current({});

      if (res.data.error) {
        // Удаляем плохой токен
        window.localStorage.removeItem('token');
        this.depends.httpClient.setHeader(this.config.tokenHeader, null);
        this.state.set({
          ...this.state.get(), exists: false, waiting: false
        }, 'Сессии нет');
      } else {
        this.state.set({
          ...this.state.get(), token: token, user: res.data.result, exists: true, waiting: false
        }, 'Успешно вспомнили сессию');
      }
    } else {
      // Если токена не было, то сбрасываем ожидание (так как по умолчанию true)
      this.state.set({
        ...this.state.get(), exists: false, waiting: false
      }, 'Сессии нет');
    }
  }

  /**
   * Сброс ошибок авторизации
   */
  resetErrors() {
    this.state.set({...this.defaultState(), errors: null});
  }

  simplifyErrors(issues: Array<{ path: string[], message: string }>) {
    const result: Record<string, string[]> = {};
    for (const issue of issues) {
      const key = issue.path.join('.') || 'other';
      if (result[key]) {
        result[key].push(issue.message);
      } else {
        result[key] = [issue.message];
      }
    }
    return result;
  }
}
