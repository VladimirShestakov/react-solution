import httpProxy from 'http-proxy';
import Server from 'http-proxy';
import mc, { type Patch } from 'merge-change';
import * as http from 'node:http';
import type { ProxyOptions } from './types';

export class Proxy {
  protected config: ProxyOptions = {
    enabled: true,
    routes: {},
  };
  protected proxyServer: Server<http.IncomingMessage, http.ServerResponse>;

  constructor(
    protected depends: {
      config: Patch<ProxyOptions>;
    },
  ) {
    this.config = mc.merge(this.config, depends.config);
    // Прокси на внешний сервер по конфигу (обычно для апи)
    this.proxyServer = httpProxy.createProxyServer({ /*timeout: 5000, */ proxyTimeout: 5000 });
    this.proxyServer.on('error', function (err, req, res) {
      // @ts-ignore
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.toString());
    });
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  public requestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: () => void,
  ) => {
    for (const path of Object.keys(this.config.routes)) {
      if (
        req.url &&
        ((path[0] === '^' && new RegExp(path).test(req.url)) || req.url.startsWith(path))
      ) {
        try {
          return this.proxyServer.web(req, res, this.config.routes[path]);
        } catch (e) {
          console.error(e);
        }
      }
    }
    next();
  };
}
