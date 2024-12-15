import {
  injectFactory,
  injectValue,
  isFactory,
  type FunctionWithDepends,
  type InjectFactory,
  type InjectValue,
} from '../container';
import { ENV } from '../env';
import { type TypesFromTokens, type TokenInterface } from '../token';

/**
 * Создание пары {Токен, Значение} для инъекции в DI настроек
 * Алиас injectValue
 * @param token Токен
 * @param value Значение сопоставимое с типом токена
 */
export function config<T, ExtT extends T>(
  token: TokenInterface<T>,
  value: ExtT,
): InjectValue<T, ExtT>;

/**
 * Создание пары {Токен/Функция} для инъекции в DI вычисляемых настроек.
 * Алиас injectFactory с предопределенной зависимостью на переменные окружения
 * @param token Токен
 * @param factory Функция, возвращающая значение сопоставимое с типом токена в опциональном варианте
 */
export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  factory: FunctionWithDepends<ExtT, TypesFromTokens<Deps>>,
): InjectFactory<T, ExtT, Deps>;

export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  value: FunctionWithDepends<ExtT, TypesFromTokens<Deps>> | ExtT,
): InjectFactory<T, ExtT, Deps> | InjectValue<T, ExtT> {
  if (isFactory<ExtT, TypesFromTokens<Deps>>(value)) {
    return injectFactory({ token, factory: value, depends: { env: ENV } as Deps });
  } else {
    return injectValue({ token, value });
  }
}
