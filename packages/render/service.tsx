import mc from 'merge-change';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { type ReactNode } from 'react';
import { stringify, parse } from 'zipson';
import { type Container, SolutionsProvider } from '../container';
import { type DumpService } from '../dump';
import type { Patch } from '../types';
import { replaceInner } from '../utils';
import { WaitingStore } from '../waiting-store';
import { asyncRender } from './lib/async-render.ts';
import { Meta } from './meta';
import { type RenderConfig, RenderDump, SsrResult } from './types';
import { HTML_TAGS } from './meta/constants.ts';

export class RenderService {
  protected children?: ReactNode;
  protected hydrate: boolean = false;
  // Ожидания асинхронных операций в рендере
  readonly waiting: WaitingStore = new WaitingStore();
  readonly meta: Meta = new Meta();

  // Настройки
  protected config: RenderConfig = {
    domId: 'root',
    renderTimeout: 6000,
  };

  constructor(
    protected depends: {
      env: Env;
      container: Container;
      dump?: DumpService;
      config?: Patch<RenderConfig>;
      children?: ReactNode;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});

    if (!this.isSSR() && depends.dump && window.initialData) {
      this.hydrate = true;
      const w: Window = window;
      const dump = parse(w.initialData);
      depends.dump.set(dump);
      console.log('initialData', dump)
    }

    this.children = (
      <SolutionsProvider solutions={depends.container}>
        {this.depends.children || 'Не установлен React элемент в сервис рендера!'}
      </SolutionsProvider>
    );
  }

  /**
   * Выполнение рендера в браузере
   */
  public start() {
    if (!this.isSSR()) {
      this.meta.initFromDocument();

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

  /**
   * Рендер на сервере в html шаблон.
   * Используется потоковый рендер для поддержки Suspense, но поток не отправляется клиенту.
   * Возвращается HTML корневого компонента.
   * Рендер, вероятно, изменит состояние других сервисов, поэтому должен использоваться для целевой задачи (SSR), а не как утилита
   */
  async ssr(template: string): Promise<SsrResult> {
    // Итоговый HTML и HTTP статусы
    const result: SsrResult = {
      html: template,
      status: 200,
    };

    // Перед рендером метаданные инициализируются из html шаблона, чтобы после рендера прописать актуальный <head>
    this.meta.initFromHtml(template);

    // Рендер (асинхронный с поддержкой suspense)
    const appHtml = await asyncRender(this.children, this.config.renderTimeout);

    // Дамп состояния, с которым выпален рендер
    const dump = this.depends.dump ? Object.fromEntries(this.depends.dump.collect()) : {};
    const dumpStr = JSON.stringify(stringify(dump));

    // Дамп добавляется в html для передачи клиенту
    this.meta.set({
      type: 'script',
      props: { textContent: `window.initialData=${dumpStr}` },
      key: 'script[owner=ssr-dump]',
      owner: 'ssr-dump',
    });

    // Установка тегов в <head>, а также атрибутов для <html>, <body>, <head>
    let headTags = '';
    for (const key of this.meta.getKeys()) {
      const element = this.meta.get(key)!;
      const parts = element.getStringParts();
      if (HTML_TAGS.has(element.type) && parts) {
        if (element.type === 'html' || element.type === 'head' || element.type === 'body') {
          result.html = result.html.replace(new RegExp(`<${key}[^>]*>`, 'ui'), parts.open);
        } else {
          headTags += parts.full + '\n';
        }
      }
    }
    result.html = replaceInner(result.html, /<head([^>]*)>/iu, /<\/head>/iu, headTags);

    // HTTP Статус
    if (this.meta.has('HttpStatus')) {
      const variant = this.meta.get('HttpStatus')!.getVariantFinal();
      if (variant) result.status = Number(variant.props.textContent);
    }

    if (this.meta.has('HttpLocation')) {
      const variant = this.meta.get('HttpLocation')!.getVariantFinal();
      if (variant) result.location = variant.props.textContent;
    }

    // Вставка рендера в тег HTML
    result.html = result.html.replace(`<div id="${this.config.domId}">`, match => {
      return match + appHtml;
    });

    console.log('- render success', result.status);

    return result;
  }

  /**
   * Установка дампа (восстановление состояния сервиса)
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

  /**
   * Выполняется рендер на сервере
   */
  isSSR(){
    return this.depends.env.SSR;
  }

  /**
   * Был рендер на сервере при этом приложение выполняется в браузере.
   */
  wasSSR() {
    return !this.depends.env.SSR && this.hydrate;
  }
}
