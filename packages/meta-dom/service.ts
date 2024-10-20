import { escape } from 'html-escaper';
import { parse, HTMLElement } from 'node-html-parser';
import mc from 'merge-change';
import type { Patch } from '../types';
import {
  ELEMENTS_WITH_TEXT,
  HTML_PROPS,
  HTML_TAGS,
  HTML_TAGS_MULTIPLE,
  HTML_TAGS_UNIQUE_ATTR,
  type HtmlPropsType,
} from './constants.ts';
import { MetaDomConfig, VirtualElementPlain, VirtualElementProps } from './types';
import { VirtualElement } from './virtual-element.ts';

export class MetaDomService {
  // Настройки
  protected config: MetaDomConfig = {};
  // Виртуальные элементы со всеми вариантами
  protected elements: Map<string, VirtualElement> = new Map();
  // Ключи изменившихся элементов
  protected changed: Set<string> = new Set();
  // Связка DOM элемента с виртуальным
  protected domMap: Map<string, Element> = new Map();

  constructor(
    protected depends: {
      env: Env;
      config?: Patch<MetaDomConfig>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});
    this.initFromDocument();
  }

  reset(){
    this.elements = new Map();
    this.changed = new Set();
    this.domMap = new Map();
  }

  /**
   * Признак исполнения на сервере
   */
  isSSR() {
    return this.depends.env.SSR;
  }

  /**
   * Выбор элемента по его ключу
   * @param key
   */
  get(key: string) {
    return this.elements.get(key);
  }

  has(key: string) {
    return this.elements.has(key);
  }

  getKeys() {
    return this.elements.keys();
  }

  /**
   * Установка виртуального элемента
   * Если уже существует (по key), то к элементу добавляется вариант
   * Если вариант тоже существует, то обновляется вариант в элементе по owner
   * @param plainElement
   */
  set(plainElement: VirtualElementPlain) {
    const { type, props, key, owner, priority = 1 } = plainElement;
    let changed = false;
    if (key && owner) {
      if (this.elements.has(key)) {
        if (this.elements.get(key)!.setVariant(owner, props, priority)) changed = true;
      } else {
        const virtual = new VirtualElement(key, type, props, owner, priority);
        if (virtual && virtual.type === 'title') {
          virtual.merge = true;
          virtual.templated = true;
          virtual.emptyTextIsUndefined = true;
        }
        this.elements.set(key, virtual);
        changed = true;
      }
      if (changed) this.changed.add(key);

      return this.elements.get(key);
    }

    return undefined;
  }

  /**
   * Удаление варианта в элементе
   * @param key
   * @param owner
   */
  remove(key: string, owner: string) {
    if (this.elements.has(key)) {
      this.elements.get(key)!.unsetVariant(owner);
      this.changed.add(key);
    }
  }

  /**
   * Установка множества элементов от одного owner и обновление DOM
   * При этом удаляются старые варианты от owner, если не было их обновлений
   * @param owner
   * @param elements
   */
  setList(owner: string, elements: VirtualElementPlain[]) {
    const trashKeys = new Set<string>();
    this.elements.forEach((element, key) => {
      if (element.hasVariant(owner)) trashKeys.add(key);
    });

    // Добавление новых или изменившихся элементов
    elements.forEach(element => {
      this.set(element);
      trashKeys.delete(element.key!);
    });

    // Удаление прошлых элементов, которые пропали в новом рендере
    trashKeys.forEach(key => this.remove(key, owner));
    this.patchDOM();
  }

  /**
   * Удаление вариантов по owner во всех элементах и обновление DOM
   * @param owner
   * @param elements
   */
  removeList(owner: string, elements: VirtualElementPlain[]) {
    elements.forEach(element => this.remove(element.key!, owner));
    this.patchDOM();
  }

  /**
   * Установка виртуального элемента на основе DOM элемента
   * @param element
   * @param owner
   * @param priority
   */
  setFromDOMElement(element: Element, owner: string = 'origin', priority: number = 0) {
    const type = element.tagName.toLowerCase();
    const props: VirtualElementProps = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attribute = element.attributes.item(i);
      if (attribute) {
        if (attribute.name === 'class') break;
        props[attribute.name] = attribute.value;
      }
    }

    for (const propName of HTML_PROPS) {
      const propNameTyped = propName as HtmlPropsType;
      if (element[propNameTyped]) props[propNameTyped] = element[propNameTyped];
    }

    const virtual = this.set({
      type,
      props,
      owner,
      priority,
      key: this.makeKey(type, props),
    });

    if (virtual) this.domMap.set(virtual.key, element);

    return virtual;
  }

  /**
   * Инициализация исходными head элементами из документа.
   * Учитываются только те элементы, которые можно идентифицировать.
   */
  initFromDocument() {
    if (!this.depends.env.SSR) {
      // html
      this.setFromDOMElement(document.documentElement);
      // head
      this.setFromDOMElement(document.head);
      // body
      this.setFromDOMElement(document.body);
      // base, title, meta, link, style, script, noscript and all other...
      const head = document.head;
      for (let i = 0; i < head.children.length; i++) {
        const element = head.children.item(i);
        if (element) {
          this.setFromDOMElement(element);
        }
      }
    }
  }

  initFromHtml(html: string) {
    this.reset();
    const owner = 'initFromHtml';
    let index = 0;
    const transform = (child: HTMLElement, withTextContent: boolean) => {
      const props: VirtualElementProps = { ...child.attributes };
      if (withTextContent && child.textContent) props.textContent = child.textContent;
      if (child.id) props.id = child.id;
      if (child.classNames) props.className = child.classNames;
      this.set({
        type: child.rawTagName,
        props,
        priority: 0,
        key:
          this.makeKey(child.rawTagName, props) ||
          `${child.rawTagName}[owner=${owner}][index=${++index}]`,
        owner,
      });
    };

    const root = parse(html);
    // html tag
    const documentElement = root.getElementsByTagName('html');
    if (documentElement.length) transform(documentElement[0], false);
    // body tag
    const bodyElement = root.getElementsByTagName('body');
    if (bodyElement.length) transform(bodyElement[0], false);
    // head tag and inner elements
    const headElement = root.getElementsByTagName('head');
    if (headElement.length) {
      const head = headElement[0];
      transform(head, false);
      for (const child of head.childNodes) {
        if (child instanceof HTMLElement) {
          transform(child, true);
        }
      }
    }
  }

  /**
   * Обновление DOM
   */
  patchDOM() {
    if (!this.isSSR()) {
      for (const key of this.changed) {
        const virtual = this.elements.get(key);
        let real = this.domMap.get(key);
        if (virtual && HTML_TAGS.has(virtual.type)) {
          const variant = virtual.getVariantFinal();

          if (variant) {
            const params = variant.props;
            if (!real) {
              real = document.createElement(virtual.type);
              document.head.append(real);
              this.domMap.set(key, real);
            }

            const trashAttributes = new Set(real.getAttributeNames());
            // Сбросить className если его больше нет
            if (!params.className && real.className) real.className = '';

            // Назначение свойств и атрибутов
            for (const name of Object.keys(params)) {
              if (typeof params[name] === 'string') {
                if (HTML_PROPS.has(name)) {
                  if (
                    name === 'textContent' &&
                    !ELEMENTS_WITH_TEXT.has(real.tagName.toLowerCase())
                  ) {
                    continue;
                  }
                  // @ts-ignore
                  real[name] = params[name];
                } else {
                  real.setAttribute(name, params[name]);
                  trashAttributes.delete(name);
                }
              }
            }
            // Удалить старые аттрибуты
            for (const name of trashAttributes) real.removeAttribute(name);
          } else {
            // Удаление DOM элемента
            if (real) {
              real.remove();
              this.domMap.delete(key);
            }
          }
        }
      }
      this.changed.clear();
    }
    console.log(this)
  }

  /**
   * Формирует уникальное значение для элемента на основе его типа и свойств
   * Если элемент уникальный, то ключом будет его тип (название)
   * Если у элемента есть уникальные атрибуты, то используется один из ник (приоритет зависит от порядка в uniqAttr)
   * Иначе ключ не будет определен.
   * @param type
   * @param props
   */
  makeKey(type: string, props: Record<string, string | undefined>) {
    if (HTML_TAGS_MULTIPLE.has(type)) {
      const names = HTML_TAGS_UNIQUE_ATTR[type] || [];
      for (const name of names) {
        if (name in props) {
          return `${type}[${escape(name)}="${escape(props[name] || '')}"]`;
        }
      }
    } else {
      return type;
    }

    return undefined;
  }

  // testForSSR() {
  //   const result = [];
  //   for (const element of this.elements) {
  //     result.push(this.getString(element[0]));
  //   }
  //
  //   return result;
  // }

  // setTitle(params: TitleParams) {
  //   if ('_delete' in params) {
  //     this.title.delete(params._key);
  //   } else {
  //     this.title.set(params._key, params);
  //   }
  //
  //   // Формирование итогового заголовка
  //   const all_params = Array.from(this.title.values()).sort((a , b) => {
  //     return (a.order || 0) - (b.order || 0);
  //   })
  //   const merged_params: Record<string, string> = mc.merge({}, ...all_params)
  //
  //   //console.log(merged_params)
  //
  //   if (!this.depends.env.SSR) {
  //
  //
  //
  //     const element = document.createElement('title');
  //     const t = format(merged_params.template || '', merged_params);
  //     element.textContent = t;
  //     //console.log(t)
  //     const list = document.head.getElementsByTagName('title');
  //     if (list.length > 0) {
  //       document.head.replaceChild(element, list.item(0)!);
  //       for (let i = 1; i < list.length; i++) list.item(i)!.remove();
  //     } else {
  //       document.head.prepend(element);
  //     }
  //   }
  // }
}
