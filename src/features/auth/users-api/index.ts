import { ApiBaseEndpoint, queryParams } from 'react-solution';
import type { UsersApiConfig, SignInBody } from './types.ts';

export class UsersApi extends ApiBaseEndpoint<UsersApiConfig> {
  protected override defaultConfig(): UsersApiConfig {
    return {
      url: '/api/v1/users',
    };
  }

  /**
   * Выбор одного юзера по токену (текущего авторизованного)
   */
  async current({ fields = '*', ...other }) {
    return this.request({
      method: 'GET',
      url: `${this.config.url}/self`,
      params: queryParams({ fields, ...other }),
    });
  }

  /**
   * Авторизация
   * @param data
   * @param fields
   * @param other
   */
  async signIn({ data, fields = '*', ...other }: { data: SignInBody; fields?: string }) {
    return this.request({
      method: 'POST',
      data: data,
      url: `${this.config.url}/sign`,
      params: queryParams({ fields, ...other }),
    });
  }

  /**
   * Выход
   */
  async signOut() {
    return this.request({
      method: 'DELETE',
      url: `${this.config.url}/sign`,
    });
  }
}
