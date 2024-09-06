declare global {
  interface I18nNamespaces {
    navigation: typeof import('./en.json');
  }
}
