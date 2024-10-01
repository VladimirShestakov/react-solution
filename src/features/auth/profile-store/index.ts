import mc from 'merge-change';
import { State } from 'react-solution/state';
import type { UsersApi } from '../users-api';
import type { ProfileStoreConfig, ProfileStoreData } from './types.ts';

/**
 * Детальная информация о пользователе
 */
export class ProfileStore {
  readonly state;
  protected config: ProfileStoreConfig;

  constructor(
    protected depends: {
      usersApi: UsersApi;
      config?: Patch<ProfileStoreConfig>;
    },
  ) {
    this.config = mc.merge(this.defaultConfig(), depends.config ?? {});
    this.state = new State<ProfileStoreData>(this.defaultState(), {
      log: this.config.log,
      name: this.config.name,
    });
  }

  defaultState(): ProfileStoreData {
    return {
      data: null,
      waiting: false, // признак ожидания загрузки
    };
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(): ProfileStoreConfig {
    return {
      log: true,
      name: 'Profile state',
    };
  }

  /**
   * Загрузка профиля
   */
  async load() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.state.set({
      data: null,
      waiting: true,
    });

    // Выбор своего профиля из АПИ
    const { data } = await this.depends.usersApi.current({});

    // Профиль загружен успешно
    this.state.set(
      {
        data: data.result,
        waiting: false,
      },
      'Загружен профиль из АПИ',
    );
  }
}
