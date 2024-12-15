// import { injectClass, injectFactory } from './utils';
// import {
//   CACHE_STORE,
//   CACHE_STORE_CFG,
//   CACHE_STORE_EXT,
//   CACHE_STORE_I
// } from '../cache-store/token';
// import { CacheStore } from '../cache-store';
// import { CONFIGS } from '../configs/token';
// import { TCacheConfig } from '../cache-store/types';
// import { SSR, SSR_CGF } from '../ssr/token';
// import { Ssr } from '../ssr';
// import { ENV } from '../env';
// import { VITE_DEV } from '../vite-dev-service/token';
// import { ViteDevService } from '../vite-dev-service';
// import { SsrOptions } from '../ssr/types';
// import { nestedToken } from '../token/utils';
//
// // Тест инъекций
// // Верно: Токен на интерфейс
// injectClass({
//   token: CACHE_STORE_I, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFactory({
//   token: CACHE_STORE_I, // <----
//   factory: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// // Верно: Класс расширенный
// injectClass({
//   token: CACHE_STORE, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFactory({
//   token: CACHE_STORE, // <----
//   factory: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// //!!!!!! Неверно: Токен на расширенный класс
// injectClass({
//   token: CACHE_STORE_EXT, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFactory({
//   token: CACHE_STORE_EXT, // <----
//   factory: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// // Верно: расширенная зависимость
// injectClass({
//   token: SSR,
//   constructor: Ssr,
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_EXT, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
// injectFactory({
//   token: SSR,
//   factory: (dep: {
//     cacheStore: CacheStore,
//     env: Env,
//     vite: ViteDevService,
//     configs: SsrOptions
//   }) => {
//     return new Ssr(dep);
//   },
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_EXT, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
//
// //!!!!!!!! Неверно: неполная реализация зависимости
// injectClass({
//   token: SSR,
//   constructor: Ssr,
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_I, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
// injectFactory({
//   token: SSR,
//   factory: (dep: {
//     cacheStore: CacheStore,
//     env: Env,
//     vite: ViteDevService,
//     configs: SsrOptions
//   }) => {
//     return new Ssr(dep);
//   },
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_I, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
