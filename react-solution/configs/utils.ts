import {
  factoryProvider,
  valueProvider,
  isFactory,
  type FunctionWithDepends,
  type Provider,
} from '../solutions';
import { ENV } from '../env';
import { type TokenInterface, type TypesFromTokens } from '../token';

/**
 * Провайдер настроек.
 * Настройки можно указать в виде значения, тип которого сопоставим с типом токена.
 * Либо указать функцию, которая будет возвращать настройки. В аргумент функции будут переданы переменные
 * окружения - их можно учесть в настройках.
 *
 * @param token Токен
 * @param config Значение сопоставимое с типом токена или функция, возвращающее значение сопоставимое с токеном.
 */
export function configProvider<Type, ExtType extends Type, DepsTokens = { env: typeof ENV }>(
  token: TokenInterface<Type>,
  config: ExtType | FunctionWithDepends<ExtType, TypesFromTokens<DepsTokens>>,
): Provider<Type, ExtType, DepsTokens> {
  if (isFactory<ExtType, TypesFromTokens<DepsTokens>>(config)) {
    return factoryProvider({ token, factory: config, depends: { env: ENV } as DepsTokens });
  } else {
    return valueProvider({ token, value: config });
  }
}

export const config = configProvider;
