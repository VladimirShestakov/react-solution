export type EventsMap = {
  [key: string]: any;
};

export type Listener<P = any> = (params: P) => any;
