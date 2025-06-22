# Модальные окна

Решения для управления модальными окнами в React-приложении с использованием DI-контейнера.

## Основные компоненты

### `service.ts`

Сервис управления модальными окнами. Содержит стек (массив) с параметрами открытых окон, что
обеспечивает одновременное отображение множества окон. 
Сервисом модалок реализуется паттерн наблюдателя.

Сервис предоставляет методы:

- `open(token, props)` - открытие модалки по токену с передачей свойств компоненту модалки.
- `getStack()` - стек открытых окон.
- `subscribe(listener)` - подписка на изменение стека открытых окон.

При открытии модалки добавляется информация об окне в стек.
При закрытии модалки информация о ней удаляется из стека.
Допустимо многократно отрывать одну и ту же модалку — будет открыто множество одинаковых модалок.
Для каждой открываемой модалки генерируется временный уникальный ключ, чтобы по нему закрывать модалку.
Под каждую модалку создаётся функция закрытия, которая передаётся в компонент модалки автоматически.
При закрытии будет завершено ожидание (promise) функции открытия модалки.

### `container.tsx`

Контейнер рендерит компоненты модальных окон в соответствии с информацией в стеке и отслеживает
изменения в стеке для последующего перерендера модалок. Контейнер необходимо вывести в корне
приложения, например в App.

```tsx
import { ModalsContainer } from 'react-solution';

function App() {
  return (
    <div>
      <Routes>{/*роуты на страницы*/}</Routes>
      <ModalsContainer /> {/* <--- рендер всех модалок поверх страниц */}
    </div>
  );
}
```

### `types.ts`

Модуль предоставляет следующие типы:

- `ModalWithClose<Result>` - интерфейс для типизации свойств компонента модального окна с функцией
  закрытия

## Подключение в приложение

Для подключения модуля модалок в приложение необходимо зарегистрировать провайдер сервиса модалок в
DI-контейнере Solutions:

```tsx
// src/index.tsx
import { Solutions, modalsService } from 'react-solution';

export default async function prepareSolutions() {
  return (
    new Solutions()
      // Другие сервисы...
      .register(modalsService)
    // Фичи проекта...
  );
}
```

## Создание своего модального окна

Модальным окном может быть любой React компонент. Для удобства свойства компонента модульного
окна предлагается расширять от дженерика `ModalWithClose<ResultType>` для определения колбэка
закрытия окна.

Для создания модального окна необходимо:

1. Создать компонент модального окна:

За визуализацию компонента как модального ответственен сам компонент. В примере ниже прмиеняется
разметка обертка `<ModalLayout>`.

```tsx
// confirm/index.tsx
import { memo, useCallback } from 'react';
import { useTranslate } from 'react-solution';
import type { ModalWithClose } from 'react-solution';
import ModalLayout from '@src/ui/layout/modal-layout';

export interface ConfirmModalProps extends ModalWithClose<boolean> {
  title: string;
  message: string;
}

function ConfirmModal(props: ConfirmModalProps) {
  const t = useTranslate();
  const callbacks = {
    onSuccess: useCallback(() => props.close(true), []),
    onCancel: useCallback(() => props.close(false), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <div>
        <button onClick={callbacks.onSuccess}>{t('example-modals.ok')}</button>
        <button onClick={callbacks.onCancel}>{t('example-modals.cancel')}</button>
      </div>
    </ModalLayout>
  );
}

export default memo(ConfirmModal);
```

2. Создать токен на компонент модального окна:

```tsx
// confirm/token.ts
import { newToken } from 'react-solution';
import type ConfirmModal from './index.tsx';

export const CONFIRM_MODAL = newToken<typeof ConfirmModal>('@project/example-modals/confirm');
```

3. Создать провайдер компонента модального окна:

```tsx
// confirm/provider.ts
import { valueProvider } from 'react-solution';
import ConfirmModal from './index.tsx';
import { CONFIRM_MODAL } from './token.ts';

export const confirmModal = valueProvider({
  token: CONFIRM_MODAL,
  value: ConfirmModal,
});
```

4. Зарегистрировать провайдер в DI-контейнере:

```tsx
// src/index.tsx
import { Solutions, modalsService } from 'react-solution';
import { exampleModalsFeature } from '@src/features/example-modals/providers.ts';

export default async function prepareSolutions() {
  return (
    new Solutions()
      // Сервис модальных окон и дургие сервисы...
      .register(modalsService)
      // Компонент модалки
      .register(confirmModal)
  );
}
```

5. Использование модальных окон

Для открытия модального окна необходимо обратиться к сервису модальных окон и вызвать метод `open()`
с токеном модального окна, которое необходимо открыть. Вторым аргументом передаются свойства для
модального окна (для компонента окна). Метод `open()` асинхронный - будет ожидаться закрытие окна и
вернется результат закрытия окна. Результатом может быть, например, веденные пользователем данные
или просто признак, на какую кнопку нажал пользователь.

1. Импортировать токен модального окна и токен сервиса модалок:

```tsx
import { MODALS } from 'react-solution';
import { CONFIRM_MODAL } from '@src/features/example-modals/modals/confirm/token.ts';

function Page() {
  // Сервис модалок
  const modals = useSolution(MODALS);

  // Колбэк отктия модалки
  const openConfirm = useCallback(async () => {
    const result = await modals.open(CONFIRM_MODAL, {
      title: 'Подтвердите действие!',
      message:
        'Вы действительно хотите выполнить некое действие? Ваш выбор отобразится в консоле браузера.',
    });
    // После закрытия модалки выводим в консоль результат
    console.log('confirm', result);
  }, []);

  return (
    <PageLayout>
      <h2>Пример открыия модалки</h2>
      <p>
        <button onClick={openConfirm}>Открыть модалку</button>
      </p>
    </PageLayout>
  );
}
```
