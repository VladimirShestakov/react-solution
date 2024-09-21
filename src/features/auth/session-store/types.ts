export interface SessionStoreData {
  user: {
    _id: string;
    email: string;
    profile: {
      name: string;
    };
  } | null;
  token: string | null; // Опционально, если используется в http.js
  waiting: boolean;
  errors: Record<string, string[]> | null;
  exists: boolean;
}

export interface SessionStoreConfig {
  log?: boolean;
  name?: string;
  tokenHeader: string;
  saveToLocalStorage: boolean;
}
