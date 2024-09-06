declare global {
  interface I18nNamespaces {
    'example-i18n': typeof import('./en.ts').default;
  }
}
