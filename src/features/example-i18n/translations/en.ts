export default {
  title: 'Internationalization (i18n)',
  locales: {
    'ru-RU': 'Russian',
    'en-EN': 'English',
  },
  content: {
    pLocale: `Text translation is performed using a dictionary with phrase codes.
      Pluralization is supported (translation variants based on plural forms).
      It is also possible to use placeholders in translations for inserting values.
      Number formatting is supported, considering the locale.
     `,
    pDic: `Dictionaries are represented in JSON format or as JS/TS modules.
      They can have either a flat or nested structure. Dictionaries are connected via DI.
      A dynamic import of a dictionary is possible when it is first accessed through a translatable phrase.
      In this case, instead of the dictionary itself, an asynchronous dictionary loading function is imported.
      The Suspense logic is supported to wait for the loading.
      For each locale, multiple named dictionaries can be connected (e.g., one dictionary for each application module).
      The dictionary name is considered in the phrase code for translation.
      If a translation is not found in the dictionary for the current locale, the translation from the base locale is used.
     `,
    pDetect: `By default, the locale is automatically determined based on the Accept-Language header,
      considering the supported locales (for which dictionaries are available).
      The user-set locale is saved in cookies to restore the selection and take the locale into account during server-side rendering.
      When the locale changes, dependencies in other services may be updated.
      For example, API headers for fetching data in the correct locale.
     `,
    pHook: `All internationalization functions are implemented through the i18n service.
      In React components, the current locale, functions to change it, and translation functions can be accessed via the useI18n() hook.
      The hook automatically subscribes the component to locale changes and dictionary loading, ensuring the component re-renders when they are updated..
     `,
  },
};
