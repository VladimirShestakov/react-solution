import { injectFabric, injectValue, isFabric } from '../container/utils.ts';
import { ENV } from '../env/token.ts';
import type { ExtractTokensTypes, TokenInterface } from '../token/types.ts';
import type { FunctionWithDepends, InjectFabric, InjectValue } from '../container/types.ts';

/**
 * Создание пары {Токен, Значение} для инъекции в DI настроек
 * Алиас injectValue
 * @param token Токен
 * @param value Значение сопоставимое с типом токена
 */
export function config<T, ExtT extends T>(token: TokenInterface<T>, value: ExtT): InjectValue<T, ExtT>

/**
 * Создание пары {Токен/Функция} для инъекции в DI вычисляемых настроек.
 * Алиас injectFabric с предопределенной зависимостью на переменные окружения
 * @param token Токен
 * @param fabric Функция, возвращающая значение сопоставимое с типом токена в опциональном варианте
 */
export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  fabric: FunctionWithDepends<ExtT, ExtractTokensTypes<Deps>>,
): InjectFabric<T, ExtT, Deps>

export function config<T, ExtT extends T, Deps = { env: typeof ENV }>(
  token: TokenInterface<T>,
  value: FunctionWithDepends<ExtT, ExtractTokensTypes<Deps>> | ExtT,
): InjectFabric<T, ExtT, Deps> | InjectValue<T, ExtT> {
  if (isFabric<ExtT, ExtractTokensTypes<Deps>>(value)) {
    return injectFabric({ token, fabric: value, depends: { env: ENV } as Deps });
  } else {
    return injectValue({ token, value });
  }
}
