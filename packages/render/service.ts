import mc from 'merge-change';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { type ReactNode } from 'react';
import { type Container } from '../../packages/container';
import { type DumpService } from '../../packages/dump';
import { WaitingStore } from '../../packages/waiting-store';
import { type RenderConfig, type RenderValues } from './types.ts';

export class RenderService {
  protected children?: ReactNode;
  protected hydrate: boolean = false;
  // Ожидания асинхронных операций в рендере
  readonly waiting: WaitingStore = new WaitingStore();

  protected values: RenderValues = {};

  // Настройки
  protected config: RenderConfig = {
    domId: 'root'
  };

  constructor(protected depends: {
    container: Container,
    dump?: DumpService,
    config?: Patch<RenderConfig>
  }) {
    this.config = mc.merge(this.config, depends.config || {});
  }

  public setReactElement(children: ReactNode) {
    this.children = children;
  }

  public getReactElement() {
    return this.children;
  }

  public start(dom: HTMLElement) {
    // Если есть подготовленные данные
    if (this.hydrate) {
      hydrateRoot(dom, this.children);
    } else {
      createRoot(dom).render(this.children);
    }
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
}
