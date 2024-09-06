import useService from '@packages/container/use-service.ts';
import { ROUTER } from '@packages/router/token.ts';
import { Navigate } from 'react-router-dom';
import { NavigateSSRProps } from './types';

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
    if (typeof to === 'string')
      useService(ROUTER).setHttpStatus(httpStatus, to);
    return null;
  } else {
    return Navigate({ to, replace, state, relative });
  }
}
