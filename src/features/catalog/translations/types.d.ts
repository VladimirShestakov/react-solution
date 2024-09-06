declare global {
  interface I18nNamespaces {
    catalog: typeof import('./en.json');
  }
}
