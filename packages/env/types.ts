declare global {
  interface Env {
    [key: string]: any;

    // Запуск в Node.js
    SSR: boolean;
    // Исходное значение MODE
    MODE: 'production' | 'development' | string;
    // MODE==production
    PROD: boolean;
    // MODE!=production
    DEV: boolean;
  }
}

export {};
