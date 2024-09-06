import mc from 'merge-change';
import type { Container, Inject } from '@packages/container/types.ts';
import type { ExtractTokenType, TokenInterface } from '@packages/token/types.ts';

export class Configs {

  constructor(protected depends: {
    env: ImportMetaEnv
    container: Container
  }) {}

  async load(loader: (env: ImportMetaEnv) => Inject): Promise<void> {
    const configsItems = loader(this.depends.env);
    this.depends.container.set(configsItems);
  }

  async get<T extends TokenInterface, D extends ExtractTokenType<T> | undefined>(token: T, defaultValue?: D): Promise<ExtractTokenType<T> & D> {
    const value = await this.depends.container.get(token);
    return mc.merge(defaultValue, value) as ExtractTokenType<T> & D;
  }

  set<T extends TokenInterface>(token: T, value: ExtractTokenType<T>): void {
    this.depends.container.set({ token, value });
  }
}
