import mc from 'merge-change';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { type ReactNode } from 'react';
import { type Container } from '../../packages/container';
import { type DumpService } from '../../packages/dump';
import { WaitingStore } from '../../packages/waiting-store';
import { type RenderConfig, RenderDump, type RenderValues } from './types.ts';
// import { renderToPipeableStream } from 'react-dom/server';

export class RenderService {
  protected children?: ReactNode;
  protected hydrate: boolean = false;
  // Ожидания асинхронных операций в рендере
  readonly waiting: WaitingStore = new WaitingStore();

  protected values: RenderValues = {};

  // Настройки
  protected config: RenderConfig = {
    domId: 'root',
  };

  constructor(
    protected depends: {
      env: ImportMetaEnv;
      container: Container;
      dump?: DumpService;
      config?: Patch<RenderConfig>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});
  }

  public setReactElement(children: ReactNode) {
    this.children = children;
  }

  public getReactElement() {
    return this.children;
  }

  public start() {
    if (!this.depends.env.SSR) {
      const dom = document.getElementById(this.config.domId);
      if (!dom) throw new Error(`Failed to find the DOM element by "root"`);
      // Если есть подготовленные данные
      if (this.hydrate) {
        hydrateRoot(dom, this.children);
      } else {
        createRoot(dom).render(this.children);
      }
    }
  }

  public startServer() {
    // const Writable = import('stream');
    // console.log(renderToPipeableStream);
    // console.log(Writable);
  }

  public setServerValues(values: RenderValues) {
    this.values = values;
  }

  public getServerValues(): RenderValues {
    return this.values;
  }

  getRenderDump() {
    if (this.depends.dump) {
      return Object.fromEntries(this.depends.dump.collect());
    }
    return {};
  }

  // /**
  //  * Загрузка начального состояния для сервисов.
  //  * Вызывается автоматом при инициализации менеджера сервисов
  //  */
  // private async initInitialState() {
  //   if (this.hasInitialState()) {
  //     const json = parse(window.initialData);
  //     for (const [key, value] of Object.entries(json)) {
  //       this.initialState.set(key as TServiceName, value);
  //     }
  //   }
  // }
  //
  // /**
  //  * Имеется ли начальное состояние для сервисов?
  //  */
  // hasInitialState() {
  //   return !this.env.SSR && window.initialData;
  // }

  /**
   * Установка дампа
   * @param dump
   */
  setDump(dump: RenderDump) {
    this.waiting.setDump(dump.waiting);
  }

  /**
   * Экспорт дампа
   */
  getDump(): RenderDump {
    return {
      waiting: this.waiting.getDump(),
    };
  }
}
