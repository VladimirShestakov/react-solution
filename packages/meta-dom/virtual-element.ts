import mc from 'merge-change';
import shallowequal from 'shallowequal';
import { b } from 'vite/dist/node/types.d-aGj9QkWt';
import { replaceTemplate } from '../utils';
import { HTML_TAGS_SELF_CLOSE } from './constants.ts';
import { VirtualElementProps, VirtualElementString, VirtualElementVariant } from './types.ts';
import { escape } from 'html-escaper';
import format from 'string-template';

export class VirtualElement {
  // Идентификатор элемента
  readonly key: string;
  // Тип элемента (название тега)
  readonly type: string;
  // Варианты свойств элемента от разных владельцах
  readonly variants: Map<string, VirtualElementVariant> = new Map();
  // Расчётный финальный вариант
  protected finalVariant?: VirtualElementVariant;
  //
  // protected options = {
  //   merge: false,
  //   templated: false
  // }

  public merge: boolean = false;
  public templated: boolean = false;
  public emptyTextIsUndefined: boolean = false;

  constructor(
    key: string,
    type: string,
    props: VirtualElementProps,
    owner: string,
    priority: number = 1,
  ) {
    this.key = key;
    this.type = type;
    this.variants.set(owner, { props, priority });
  }

  /**
   * Установка варианта по owner
   * Если вариант уже есть и совпадает по props и priority, то возвращается false
   * @param owner
   * @param props
   * @param priority
   */
  setVariant(owner: string, props: VirtualElementProps, priority: number = 1): boolean {
    if (('textContent' in props) && !props.textContent) {
      delete props.textContent;
    }
    if (this.variants.has(owner)) {
      const current = this.variants.get(owner)!;
      if (current.priority === priority && shallowequal(current.props, props)) return false;
    }
    this.variants.set(owner, { props, priority });
    this.finalVariant = undefined;

    return true;
  }

  /**
   * Удаление варианта по owner
   * Если варианта нет, то возвращается false, как признак отсутствия изменения.
   * @param owner
   */
  unsetVariant(owner: string): boolean {
    if (this.variants.has(owner)) {
      this.variants.delete(owner);
      this.finalVariant = undefined;
      return true;
    }

    return false;
  }

  /**
   * Итоговый вариант
   */
  getVariantFinal(): VirtualElementVariant | undefined {
    if (!this.finalVariant) {
      const ordered = Array.from(this.variants.values()).sort((a, b) => {
        return (a.priority || 0) - (b.priority || 0);
      });
      if (this.merge) {
        this.finalVariant = mc.merge(...ordered);
      } else {
        this.finalVariant = ordered.length > 0 ? ordered[ordered.length - 1] : undefined;
      }
      if (this.templated && this.finalVariant?.props.textContent) {
        this.finalVariant.props.textContent = replaceTemplate(
          this.finalVariant.props.textContent,
          this.finalVariant.props,
        );
      }
    }

    return this.finalVariant;
  }

  /**
   * Проверка наличия варианта по owner
   * @param owner
   */
  hasVariant(owner: string): boolean {
    return this.variants.has(owner);
  }

  /**
   * Возвращает строковое представление элемента и дополнительные сведения о нём
   * Название, атрибуты и вложенный текст экранируются.
   */
  getStringParts() {
    const variant = this.getVariantFinal();
    if (variant) {
      const props = { ...variant.props };
      const result: VirtualElementString = {
        name: escape(this.type),
        attributes: [],
        full: '',
        open: '',
        close: '',
        textContent: props.textContent ? props.textContent : '',
        selfClose: HTML_TAGS_SELF_CLOSE.has(this.type),
      };

      if ('textContent' in props) delete props.textContent;

      for (const name of Object.keys(props)) {
        if (typeof props[name] === 'string') {
          let realName = escape(name);
          if (name === 'className') realName = 'class';
          result.attributes.push(`${realName}="${escape(props[name])}"`);
        }
      }

      const nameWithAttr = `${result.name} ${result.attributes.join(' ')}`.trim();

      if (result.selfClose) {
        result.open = `<${nameWithAttr} />`;
        result.full = result.open;
      } else {
        result.open = `<${nameWithAttr}>`;
        result.close = `</${result.name}>`;
        result.full = result.open + result.textContent + result.close;
      }

      return result;
    }

    return undefined;
  }
}
