import { Navigate } from 'react-router-dom';
import { HttpLocation, HttpStatus } from '../meta-dom';
import type { NavigateSSRProps } from './types';

/**
 * Аналог компонента Navigate, но умеющий работать при SSR, чтобы отдать клиенту 301 с Location
 */
export function NavigateSSR({
  to,
  replace,
  state,
  relative,
  httpStatus = 301,
}: NavigateSSRProps) {
  if (import.meta.env.SSR) {
    if (typeof to === 'string') {
      return <>
        <HttpLocation>{to}</HttpLocation>
        <HttpStatus>{httpStatus}</HttpStatus>
      </>
    }
  } else {
    return Navigate({ to, replace, state, relative });
  }
}
