// Асинхронный импорт сервисов для деления сборки
export default {
  suspense: () => import('@src/services/suspense'),
  modals: () => import('@src/services/modals'),
};
