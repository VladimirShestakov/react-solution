declare global {
  interface I18nNamespaces {
    main: typeof import('./en.js').default;
  }
}
