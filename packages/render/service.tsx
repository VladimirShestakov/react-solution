import mc from 'merge-change';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { type ReactNode } from 'react';
import { type Container, SolutionsProvider } from '../container';
import { type DumpService } from '../dump';
import { MetaDomService } from '../meta-dom';
import type { Patch } from '../types';
import { asyncRender } from './lib/async-render.ts';
import { type RenderConfig, RenderDump, SsrResult } from './types';
import { WaitingStore } from '../waiting-store';
import { stringify } from 'zipson';
import { replaceInner } from '../utils';
import { HTML_TAGS } from '../meta-dom/constants.ts';

export class RenderService {
  protected children?: ReactNode;
  protected hydrate: boolean = false;
  // Ожидания асинхронных операций в рендере
  readonly waiting: WaitingStore = new WaitingStore();

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
      meta?: MetaDomService;
      config?: Patch<RenderConfig>;
      children?: ReactNode;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});
    this.children = (
      <SolutionsProvider solutions={depends.container}>
        {this.depends.children || 'Не установлен React элемент в сервис рендера!'}
      </SolutionsProvider>
    );
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

  getRenderDump() {
    if (this.depends.dump) {
      return Object.fromEntries(this.depends.dump.collect());
    }
    return {};
  }

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

  /**
   * Рендер на сервере в html шаблон.
   * Используется потоковый рендер для поддержки Suspense, но поток не отправляется клиенту.
   * Возвращается HTML корневого компонента.
   * Рендер, вероятно, изменит состояние других сервисов, поэтому должен использовать для целевой задачи (SSR), а не как утилита
   */
  async ssr(template: string): Promise<SsrResult> {
    // Итоговый HTML и HTTP статусы
    const result: SsrResult = {
      html: template,
      status: 200,
    };

    // Перед рендером метаданные инициализируются из html шаблона, чтобы после рендера прописать актуальный <head>
    if (this.depends.meta) this.depends.meta.initFromHtml(template);

    // Рендер (асинхронный с поддержкой suspense)
    const appHtml = await asyncRender(this.children, this.config.renderTimeout);

    // Дамп состояния, с которым выпален рендер
    const dump = this.getRenderDump();
    const dumpStr = JSON.stringify(stringify(dump));

    if (this.depends.meta) {
      // Дамп добавляется в html для передачи клиенту
      this.depends.meta.set({
        type: 'script',
        props: { textContent: `window.initialData=${dumpStr}` },
        key: 'script[owner=ssr-dump]',
        owner: 'ssr-dump',
      });

      // Установка тегов в <head>, а также атрибутов для <html>, <body>, <head>
      let headTags = '';
      for (const key of this.depends.meta.getKeys()) {
        const element = this.depends.meta.get(key)!;
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
      if (this.depends.meta.has('HttpStatus')) {
        const variant = this.depends.meta.get('HttpStatus')!.getVariantFinal();
        if (variant) result.status = Number(variant.props.textContent);
      }

      if (this.depends.meta.has('HttpLocation')) {
        const variant = this.depends.meta.get('HttpLocation')!.getVariantFinal();
        if (variant) result.location = variant.props.textContent;
      }
    }

    // Вставка рендера в тег HTML
    result.html = result.html.replace(`<div id="${this.config.domId}">`, match => {
      return match + appHtml;
    });

    console.log('- render success', result.status);

    return result;
  }
}
