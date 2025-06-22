# Менеджер состояния - State

Менеджер состояния на основе паттерна наблюдателя (Observer).

## Функциональные возможности

- **Легкость** — простейшая реализация, легкое внедрение под разные задачи;
- **Поддержка сложных обновлений** — использование библиотеки merge-change для сложных обновлений;
- **Иммутабельность** — обеспечение иммутабельности состояния при обновлениях;
- **Подписка на изменения** — автоматическое уведомление подписчиков при изменении состояния;
- **Интеграция с React** — хук для использования состояния в React-компонентах;
- **Логирование изменений** — опциональное логирование изменения состояния;

## Структура модуля

- `index.ts` — Экспортирует все компоненты модуля
- `state.ts` — Содержит основной класс State для управления состоянием
- `use-external-state.ts` — Предоставляет React-хук для работы с состоянием

## Класс State

Класс `State` предоставляет API для управления состоянием.
Используется для создания множества объектов состояния.
Если новому решению (сервису, модулю, классу) необходимо состояние, то внутри него создаётся поле (свойство)
класса State. В редких случаях применяется наследование класса State.

Любая структура данных может быть состоянием и храниться в экземпляре State.
Через дженерик указывается тип структуры данных, например `State<MyState>`.

Подписчики уведомляются на любое изменение в структуре данных.
Подписка на отельное свойство в структуре данных не предоставляется.
За счёт этого обеспечивается простейшая логика класса State, так как не нужно вычислять, что именно
изменилось и кого конкретно уведомлять.
Если нужно следить за изменениями отдельных свойств, то нужно создавать отдельные экземпляры класса
Sate на каждое свойство — выполнить декомпозицию состояния.

### Создание экземпляра

```ts
import { State } from 'react-solution';

// Определение типа состояния
interface MyState {
  data: string[];
  loading: boolean;
  error: string | null;
}

// Создание экземпляра State с начальным состоянием
const state = new State<MyState>(
  {
    data: [],
    loading: false,
    error: null,
  },
  logger,
); // logger опционален, и им может быть console
```

### Основные методы

#### `get()`

Возвращает текущее значение состояния.

```ts
const currentState = state.get();
console.log(currentState.data);
```

#### `set(newState, description?)`

Устанавливает новое значение в состояние, полностью заменяя текущее.

```ts
state.set(
  {
    data: ['item1', 'item2'],
    loading: false,
    error: null,
  },
  'Установка новых данных',
); // description опционален для логирования
```

#### `update(update, description?)`

Обновляет часть состояния, используя merge-change для слияния с текущим состоянием.

```ts
state.update(
  {
    data: ['new item'],
    loading: false,
  },
  'Обновление данных',
); // description опционален для логирования
```

#### `reset(update?, description?)`

Сбрасывает состояние к начальному значению с возможностью применения обновлений.

```ts
state.reset(
  {
    loading: true,
  },
  'Сброс состояния',
); // description опционален для логирования
```

#### `subscribe(listener)`

Подписка на изменения состояния. Возвращает функцию для отписки. При установке состояния будут
вызываться все слушатели, добавленные методом subscribe.

```ts
const unsubscribe = state.subscribe(() => {
  console.log('Состояние изменилось:', state.get());
});

// Позже, для отписки
unsubscribe();
```

## Хук useExternalState

Хук `useExternalState` используется для получения и отслеживания состояния в React-компонентах.
Хук является оберткой над стандартным `useSyncExternalStore` упрощая подписку на состояние.
Хук возвращает текущее состояние и заставляет компонент перерендериватся в случаи изменения
состояния. При очередном рендере компонент получает обновленное состояние.

В хук нужно передать объект состояния. В примере ниже состоянием является поле сервиса myService.

```tsx
import { useExternalState } from 'react-solution';

function MyComponent() {
  // Получение экземпляра State из контекста или пропсов
  const myService = useSolution(MY_SERVICE);

  // Получение и подписка на изменения состояния
  const myState = useExternalState(myService.state);

  return (
    <div>
      {myState.loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul>
          {myState.data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {myState.error && <p>Ошибка: {myState.error}</p>}
    </div>
  );
}
```

## Примеры использования

### Пример 1: Создание сервиса с состоянием

```ts
import { State, type LogInterface } from 'react-solution';

interface ProfileStoreData {
  data: any | null;
  waiting: boolean;
}

// Сервис управления профилем поьзователя. Содержит состояние с текущи профилем
export class ProfileStore {
  readonly state;

  constructor(
    protected depends: {
      logger: LogInterface;
      profileApi: ProfileApi;
    },
  ) {
    this.depends.logger = this.depends.logger.named(this.constructor.name);
    this.state = new State<ProfileStoreData>({ data: null, waiting: false }, this.depends.logger);
  }

  async load() {
    // Установка состояния загрузки
    this.state.set({
      data: null,
      waiting: true,
    });

    try {
      // Загрузка данных
      const data = await this.profileApi.get();

      // Обновление состояния
      this.state.set(
        {
          data,
          waiting: false,
        },
        'Профиль загружен',
      );
    } catch (error) {
      this.state.set(
        {
          data: null,
          waiting: false,
        },
        'Ошибка загрузки профиля',
      );
    }
  }
}

//... На класс ProfileStore созадётся провайдер с токеном PROFILE_STORE и регистрируется в DI
```

### Пример 2: Использование в React-компоненте

```tsx
import { useExternalState, useSolution } from 'react-solution';
import { PROFILE_STORE } from './tokens';

function ProfilePage() {
  const profile = useSolution(PROFILE_STORE);
  const profileState = useExternalState(profile.state);

  useInit(async () => {
    await profile.load();
  });

  if (profileState.waiting) {
    return <div>Загрузка...</div>;
  }

  if (!profileState.data) {
    return <div>Профиль не найден</div>;
  }

  return (
    <div>
      <h1>{profileState.data.name}</h1>
      <p>{profileState.data.email}</p>
    </div>
  );
}
```

### Пример 3: Сложные обновления состояния

```ts
// Обновление вложенных свойств - выполняется глубоке слияние с текущим состяонием.
state.update({
  user: {
    profile: {
      name: 'Новое имя',
    },
  },
});

// Использование операторов merge-change
state.update({
  settings: {
    $set: { theme: { name: 'dark', mode: 'large' } }, // Полная замена объекта theme
  },
});

state.update({
  items: {
    $push: ['новый элемент'], // Добавление в массив
  },
});

state.update({
  users: {
    $unset: ['admin'], // Удаление свойства
  },
});
```
