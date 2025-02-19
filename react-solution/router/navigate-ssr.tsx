import { Navigate } from 'react-router-dom';
import { HttpLocation, HttpStatus } from '../render';
import type { NavigateSSRProps } from './types';
import { useSolution } from '../solutions';
import { ENV } from '../env';

/**
 * Аналог компонента Navigate, но умеющий работать при SSR, чтобы отдать клиенту 301 с Location
 */
export function NavigateSSR({ to, replace, state, relative, httpStatus = 301 }: NavigateSSRProps) {
  if (useSolution(ENV).SSR) {
    if (typeof to === 'string') {
      return (
        <>
          <HttpLocation>{to}</HttpLocation>
          <HttpStatus>{httpStatus}</HttpStatus>
        </>
      );
    }
  } else {
    return Navigate({ to, replace, state, relative });
  }
}
