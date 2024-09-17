export type DumpConfig = {
  // Отслеживать создание экземпляров в DI контейнере и передавать им дамп, если реализуют метод setDump
  autoSendDump: boolean
}
