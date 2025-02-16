import {
  factoryProvider,
  valueProvider,
  isFactory,
  type FunctionWithDepends,
  type FactoryProvider,
  type ValueProvider,
} from '../solutions';
import { ENV } from '../env';
import { type TypesFromTokens, type TokenInterface } from '../token';

export function config<T, ExtT extends T>(
  token: TokenInterface<T>,
  value: ExtT,
): ValueProvider<T, ExtT>;

export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  value: FunctionWithDepends<ExtT, TypesFromTokens<Deps>>,
): FactoryProvider<T, ExtT, Deps>;

/**
 * Провайдер настроек.
 * Настройки можно указать в виде значения, тип которого сопоставим с типом токена.
 * Либо указать функцию, которая будет возвращать настройки. В аргумент функции передаются переменные
 * окружения - их можно учесть в настройках.
 *
 * @param token Токен
 * @param value Значение сопоставимое с типом токена или функция, возвращающее значение сопоставимое с токеном.
 */
export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  value: FunctionWithDepends<ExtT, TypesFromTokens<Deps>> | ExtT,
): FactoryProvider<T, ExtT, Deps> | ValueProvider<T, ExtT> {
  if (isFactory<ExtT, TypesFromTokens<Deps>>(value)) {
    return factoryProvider({ token, factory: value, depends: { env: ENV } as Deps });
  } else {
    return valueProvider({ token, value });
  }
}
