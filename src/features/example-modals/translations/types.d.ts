declare global {
  interface I18nNamespaces {
    'example-modals': typeof import('./en.json');
  }
}
