export const HTML_TAGS = new Set([
  'html',
  'head',
  'title',
  'base',
  'meta',
  'link',
  'style',
  'script',
  'noscript',
  'body',
]);

export const HTML_TAGS_SELF_CLOSE = new Set(['base', 'link', 'meta']);

export const HTML_PROPS = new Set(['id', 'className', 'textContent']);

export type HtmlPropsType = 'id' | 'className' | 'textContent';

export const HTML_PROP_RENAMES = {
  className: 'class',
  httpEquiv: 'http-equiv',
};

/**
 * Элементы, которых может быть много, поэтому их название не используется как идентификатор
 */
export const HTML_TAGS_MULTIPLE = new Set(['meta', 'link', 'script', 'style', 'noscript']);

/**
 * Атрибуты, которые можно использовать для идентификации элемента
 */
export const HTML_TAGS_UNIQUE_ATTR: Record<string, string[]> = {
  meta: ['id', 'name', 'property', 'itemprop', 'charset', 'http-equiv'],
  link: ['id'],
  style: ['id'],
  script: ['id'],
};

export const ELEMENTS_WITH_TEXT = new Set(['title', 'style', 'script']);

export const ELEMENTS_WITH_TEMPLATE = new Set(['title']);

export const ELEMENTS_WITH_MERGE_ATTR = new Set(['title']);
