declare global {
  interface I18nNamespaces {
    auth: typeof import('./en.auth.json');
  }
}
