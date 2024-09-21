import { State } from '../../packages/state';
import { WaitingStore } from '../../packages/waiting-store';
import type {
  I18nDictionary,
  I18nState,
  I18nConfig,
  I18nDictionaryInner,
  I18nPath,
  I18nTranslateOptions,
  I18nNumberOptions,
  I18nTranslation,
  I18nDump,
} from './types';
import mc from 'merge-change';
import { flat } from '../../packages/utils';
import acceptLang from 'accept-language-parser';
import cookie from 'js-cookie';

/**
 * Сервис мультиязычности
 */
export class I18n {
  // Состояние (данные про локаль и словари)
  readonly state: State<I18nState>;
  // Ожидания загрузки словарей
  protected waiting: WaitingStore = new WaitingStore();
  // Настройки
  protected config: I18nConfig = {
    log: true,
    locale: 'ru-RU', // локаль по умолчанию если не будет определена автоматически
    auto: true,
    remember: true,
  };

  constructor(
    protected depends: {
      env: ImportMetaEnv;
      config?: Patch<I18nConfig>;
      dictionary: I18nDictionary;
      initState?: I18nState;
    },
  ) {
    this.config = mc.merge(this.config, depends.config || {});
    this.state = new State(
      depends.initState ?? {
        // Доступные локали определяются по переданному словарю.
        allowedLocales: Object.keys(depends.dictionary),
        // Определение текущей локали с учётом доступных
        locale: this.getInitLocale(),
        // Словари по умолчанию не загружены
        dictionary: {} as I18nDictionaryInner,
      },
      {
        log: this.config.log,
        name: 'I18nService',
      },
    );
  }

  protected getInitLocale() {
    let locale;
    // Восстановление ранее выбранной локали
    if (this.config.remember) locale = this.restoreLocale();
    // Автоопределение локали
    if (this.config.auto) locale ??= this.detectLocale();
    // Локаль по умолчанию из конфига
    return locale ?? this.config.locale;
  }

  /**
   * Установка локали
   * @param locale
   */
  setLocale = async (locale: string) => {
    if (this.config.remember) {
      this.rememberLocale(locale);
    }
    this.state.update({ locale });
  };

  /**
   * Перевод (асинхронной)
   * С ожиданием загрузки словарей при первом обращении к нему.
   * Если перевода нет, то будет возвращаться option.fall или ключ перевода (key)
   * @param key
   * @param options
   */
  translate = async (key: I18nPath, options?: I18nTranslateOptions): Promise<string> => {
    const { realLocale, namespace, path, values, waitingKey, allowedLocales } =
      this.prepareTranslateParams(key, options);

    if (realLocale !== '*') {
      // Если словарь ещё не загружался
      if (!this.waiting.has(waitingKey)) {
        this.waiting.add(waitingKey, this.load(realLocale, namespace));
      }

      // Ждём загрузку
      await this.waiting.getPromise(waitingKey);

      // Ищем перевод в словаре (словарь возможно ещё не загружен)
      const translation = this.state.get().dictionary[realLocale]?.[namespace]?.[path];

      // Перевод найден
      if (translation) return this.replace(translation, values);

      // Перевода нет, пробуем искать в другой из допустимых локалей (удалив текущую из допустимых)
      return this.translateSync(key, {
        ...options,
        allowedLocales: allowedLocales.filter(value => value !== realLocale),
      });
    }
    // Заглушка если нет перевода
    if (options?.fall) return this.replace(options.fall, values);

    // Если ничего нет, то возвращаем ключ на искомый перевод
    return key;
  };

  /**
   * Перевод (синхронный)
   * Если словарь ещё не подгружен, то инициируется его загрузка.
   * Пока грузится словарь будет выбрасываться исключением с промисом.
   * @param key Код фразы для перевода - путь в словаре, например "basket.article.label". Путь начинается с названия словаря.
   * @param options Опции перевода.
   */
  translateSync = (key: I18nPath, options?: I18nTranslateOptions): string => {
    const { realLocale, namespace, path, values, waitingKey, allowedLocales } =
      this.prepareTranslateParams(key, options);

    if (realLocale !== '*') {
      // Если словарь ещё не загружался
      if (!this.waiting.has(waitingKey)) {
        this.waiting.add(waitingKey, this.load(realLocale, namespace));
      }

      // Если словарь ещё загружается в режиме suspense, то кидаем исключение с промисом
      if (this.waiting.isWaiting(waitingKey)) {
        throw this.waiting.getPromise(waitingKey);
      }

      // Если ошибка загрузки/обработки словаря, кидаем исключение с ошибкой
      if (this.waiting.isError(waitingKey)) {
        throw this.waiting.getError(waitingKey);
      }

      // Ищем перевод в словаре (словарь возможно ещё не загружен)
      const translation = this.state.get().dictionary[realLocale]?.[namespace]?.[path];

      // Перевод найден
      if (translation) return this.replace(translation, values);

      // Перевода нет, пробуем искать в другой из допустимых локалей (удалив текущую из допустимых)
      return this.translateSync(key, {
        ...options,
        allowedLocales: allowedLocales.filter(value => value !== realLocale),
      });
    }

    // Заглушка, если нет перевода
    if (options?.fall) return this.replace(options.fall, values);

    // Если ничего нет, то возвращаем ключ на искомый перевод
    return key;
  };

  /**
   * Форматирование числа с учётом локали и других параметров.
   * Используется Intl.NumberFormat()
   * @param value Число
   * @param [options] Опции форматирования
   */
  number = (value: number, options?: I18nNumberOptions) => {
    const { locale = this.state.get().locale } = options || {};
    return new Intl.NumberFormat(locale, options).format(value);
  };

  /**
   * Шаблонизация строки - вставка значений в именованные области.
   * Используется в функции translate если передана опция values
   * @param template
   * @param values
   */
  replace(template: string, values: Record<string, string | number> = {}) {
    let result = template;
    for (const [name, value] of Object.entries(values)) {
      result = result.replace(`{{${name}}}`, value as string);
    }
    return result;
  }

  /**
   * Загрузка словаря по названию и локали.
   * Если подключенный словарь является функцией, то она исполняется и возвращается её результат
   * Если словарь является объектом с переводами, то он возвращается без каких-либо загрузок
   * Если словаря нет по указанной локали и пространству именования, то возвращается undefined.
   * Обновляется состояние сервиса i18n (в состояние добавляется загруженный словарь)
   * @param locale Локаль словаря
   * @param namespace Название словаря
   */
  async load(locale: string, namespace: string): Promise<void> {
    if (this.depends.dictionary[locale]?.[namespace]) {
      const dic = this.depends.dictionary[locale]?.[namespace];
      const translation =
        typeof dic === 'function' ? ((await dic()).default as I18nTranslation) : dic;
      // Обновление состояния i18n
      this.state.update({
        dictionary: {
          [locale]: {
            $set: {
              [namespace]: flat(translation),
            },
          },
        },
      });
    }
  }

  protected prepareTranslateParams(key: I18nPath, options?: I18nTranslateOptions) {
    const {
      plural,
      locale = this.state.get().locale,
      allowedLocales = this.state.get().allowedLocales,
    } = options || {};
    const realLocale = acceptLang.pick(allowedLocales, locale, { loose: true }) || '*';
    let values = options?.values || {};
    // Добавление в окончание кода счисления (.zero .one .two .few .many .other)
    if (plural !== undefined) {
      key += `.${new Intl.PluralRules(realLocale).select(plural)}` as I18nPath;
      values = { ...values, plural };
    }
    const keys = key.split('.');
    const namespace = keys.shift() || '';
    const path = key.substring(namespace?.length + 1);
    const waitingKey = `${realLocale}.${namespace}`;

    return { namespace, path, values, waitingKey, realLocale, allowedLocales };
  }

  /**
   * Автоопределение локали по HTTP заголовку accept-language
   */
  detectLocale() {
    return this.depends.env.SSR && this.depends.env.req
      ? (this.depends.env.req.headers['accept-language'] as string) // на сервере
      : navigator.languages.join(','); // в браузере
  }

  /**
   * Восстановление локали из куки
   */
  restoreLocale() {
    if (this.depends.env.SSR) {
      return this.depends.env.req ? (this.depends.env.req.cookies['locale'] as string) : undefined;
    } else {
      return cookie.get('locale') as string;
    }
  }

  /**
   * Запоминание локали
   * @param locale
   */
  rememberLocale(locale: string) {
    if (!this.depends.env.SSR) {
      cookie.set('locale', locale, { expires: 30 });
    }
  }

  /**
   * Доступные локали для указанного ключа
   * @param key
   */
  getLocalesFor(key: I18nPath) {}

  setDependencies(locale: string) {
    //this.services.api.setHeader('X-Lang', locale);
  }

  /**
   * Установка дампа
   * @param dump
   */
  setDump(dump: I18nDump) {
    this.state.set(dump.state);
    this.waiting.setDump(dump.waiting);
  }

  /**
   * Экспорт дампа
   */
  getDump(): I18nDump {
    return {
      state: this.state.get(),
      waiting: this.waiting.getDump(),
    };
  }
}
