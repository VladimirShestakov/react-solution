import { Navigate } from 'react-router-dom';
import { useService } from '../container';
import { ROUTER_SERVICE } from '../router';
import type { NavigateSSRProps } from './types.ts';

/**
 * Аналог компонента Navigate, но умеющий работать при SSR, чтобы отдать клиенту 301 с Location
 */
export function NavigateSSR({
  to,
  replace,
  state,
  relative,
  httpStatus = 301,
}: NavigateSSRProps): null {
  if (import.meta.env.SSR) {
    if (typeof to === 'string') useService(ROUTER_SERVICE).setHttpStatus(httpStatus, to);
    return null;
  } else {
    return Navigate({ to, replace, state, relative });
  }
}
