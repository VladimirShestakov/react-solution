import {
  factoryProvider,
  valueProvider,
  isFactory,
  type FunctionWithDepends,
  type Provider,
} from '../solutions';
import { ENV } from '../env';
import { type TypesFromTokens, type TokenInterface } from '../token';

/**
 * Провайдер настроек.
 * Настройки можно указать в виде значения, тип которого сопоставим с типом токена.
 * Либо указать функцию, которая будет возвращать настройки. В аргумент функции будут переданы переменные
 * окружения - их можно учесть в настройках.
 *
 * @param token Токен
 * @param valueOrFactory Значение сопоставимое с типом токена или функция, возвращающее значение сопоставимое с токеном.
 */
export function configProvider<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  valueOrFactory: FunctionWithDepends<ExtT, TypesFromTokens<Deps>> | ExtT,
): Provider<T, ExtT, Deps> {
  if (isFactory<ExtT, TypesFromTokens<Deps>>(valueOrFactory)) {
    return factoryProvider({ token, factory: valueOrFactory, depends: { env: ENV } as Deps });
  } else {
    return valueProvider({ token, value: valueOrFactory });
  }
}

export const config = configProvider;
