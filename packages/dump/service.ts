import mc from 'merge-change';
import { parse } from 'zipson';
import { type Container } from '../../packages/container';
import { type Token } from '../../packages/token';
import { type DumpConfig } from './types.ts';

export class DumpService {
  protected data: Map<string, any> = new Map();
  // Настройки
  protected config: DumpConfig = {
    autoSendDump: true,
  };

  constructor(
    protected depends: {
      env: ImportMetaEnv;
      container: Container;
      config?: Patch<DumpConfig>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});
    if (this.config.autoSendDump) {
      this.depends.container.events.on('onCreate', this.send);
      // @todo Как-то отписываться от события
    }

    if (!depends.env.SSR && window.initialData) {
      const dump = parse(window.initialData);
      this.set(dump);
    }
  }

  set(data: Record<string, any>): void {
    for (const [key, value] of Object.entries(data)) {
      this.data.set(key, value);
    }
  }

  get(): Map<string, any> {
    return this.data;
  }

  setJson(json: string) {
    this.data = new Map(JSON.parse(json));
  }

  getJson() {
    return JSON.stringify(Object.fromEntries(this.data));
  }

  protected send = <Type extends object>({ token, value }: { token: Token<Type>; value: Type }) => {
    //console.log('send', token);
    if ((value as any) !== this) {
      if (value && 'setDump' in value && typeof value.setDump === 'function') {
        const dump = this.data.get(token.key);
        if (dump) {
          value.setDump(dump);
        }
      }
    }
  };

  /**
   * Собрать дамп со всех активных сервисов
   */
  collect() {
    const result = new Map();
    const instances = this.depends.container.getInstances();
    for (const [key, instance] of instances) {
      if (instance && 'getDump' in instance && typeof instance.getDump === 'function') {
        result.set(key, instance.getDump());
      }
    }
    this.data = result;

    return this.data;
  }

  /**
   * Раздать дамп всем активным сервисам
   */
  distribute() {
    const instances = this.depends.container.getInstances();
    for (const [key, instance] of instances) {
      if ('setDump' in instance && typeof instance.setDump === 'function') {
        const dump = this.data.get(key);
        if (dump) {
          instance.setDump(dump);
        }
      }
    }
  }
}
