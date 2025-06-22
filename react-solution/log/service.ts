import mc, { type Patch } from 'merge-change';
import { LogConfig, LogInterface } from './types';

export class LogService implements LogInterface {
  protected name?: string;
  protected config: LogConfig = {
    enabled: true,
    disable: false,
  };

  constructor(
    protected depends: { config?: Patch<LogConfig> },
    name?: string,
  ) {
    this.config = mc.merge(this.config, depends.config) as LogConfig;
    this.name = name;
  }

  /**
   * Создание именованного логгера
   * Именованный логер можно точечно включать/выключать через общий конфиг
   * @param name
   */
  named(name: string): LogService {
    const namePath = this.name ? `${this.name}/${name}` : name;
    switch (typeof this.config[name]) {
      case 'object':
        return new LogService(
          {
            config: mc.merge(
              {
                enabled: this.config.enabled,
                disable: this.config.disable,
              },
              this.config[name],
            ),
          },
          namePath,
        );
      case 'boolean':
        return new LogService(
          {
            config: {
              enabled: this.config[name],
              disable: this.config.disable,
            },
          },
          namePath,
        );
      default:
        return new LogService(
          {
            config: {
              enabled: this.config.enabled,
              disable: this.config.disable,
            },
          },
          namePath,
        );
    }
  }

  getName(): string | undefined {
    return this.name;
  }

  isEnabled(): boolean {
    return this.config.enabled && !this.config.disable;
  }

  log(...data: any[]) {
    if (this.isEnabled()) console.log(...data);
  }

  group(...label: any[]) {
    if (this.isEnabled()) console.group(...label);
  }

  groupCollapsed(...label: any[]) {
    if (this.isEnabled()) console.groupCollapsed(...label);
  }

  groupEnd() {
    if (this.isEnabled()) console.groupEnd();
  }

  error(...data: any[]) {
    if (this.isEnabled()) console.error(...data);
  }

  info(...data: any[]) {
    if (this.isEnabled()) console.info(...data);
  }

  warn(...data: any[]) {
    if (this.isEnabled()) console.warn(...data);
  }
}
