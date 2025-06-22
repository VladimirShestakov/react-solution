import mc, { type Patch } from 'merge-change';
import { type Solutions } from '../solutions';
import { type Token } from '../token';
import type { DumpConfig } from './types';

/**
 * Сервис для сбора и раздачи дампа (состояния)
 * Следит за созданием сервисов в контейнере, чтобы сразу передать им имеющеюся дамп по токену сервиса.
 * DumpService может получить дамп от всех активных сервисов. Ключом для дампа будет токен сервиса.
 * DumpService может отправить имеющиеся дампы всем активным сервисам.
 * Сервис должен реализовывать методы setDump и getDump, чтобы его "видел" DumpService.
 *
 * Сервис не отвечает за хранение и получение дампа из внешнего хранилище.
 * Начальный дамп устанавливается, например, сервисом рендера в целях синхронизации состояния после рендера на сервере.
 */
export class DumpService {
  protected data: Map<string, any> = new Map();
  protected config: DumpConfig = {
    autoSendDump: true,
  };

  constructor(
    protected depends: {
      env: Env;
      solutions: Solutions;
      config?: Patch<DumpConfig>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config);
    if (this.config.autoSendDump) {
      this.depends.solutions.events.on('onCreate', this.send);
      // @todo Как-то отписываться от события
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

  /**
   * Передать дамп сервису.
   * Используется при автоматической передаче дампа.
   * @param token Токен сервиса
   * @param value Дамп
   */
  protected send = <Type extends object>({ token, value }: { token: Token<Type>; value: Type }) => {
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
    const instances = this.depends.solutions.getInstances();
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
    const instances = this.depends.solutions.getInstances();
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
