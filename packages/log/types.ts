export type LogConfig = {
  enabled: boolean;
  disable: boolean;
  [name: string]: boolean | LogConfig;
};

export interface LogInterface {
  log(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  group(...label: any[]): void;
  groupCollapsed(...label: any[]): void;
  groupEnd(): void;

  named(name: string): LogInterface;
  getName(): string | undefined;

  // assert
  // clear
  // count
  // countReset
  // debug
  // dir
  // dirxml
  // table
  // time
  // timeEnd
  // timeLog
  // trace
}
