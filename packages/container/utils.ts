import type { FunctionWithDepends, InjectClass, InjectFabric, InjectValue } from './types.ts';

export function injectClass<Type, ExtType extends Type, Deps>(
  inject: InjectClass<Type, ExtType, Deps>
): InjectClass<Type, ExtType, Deps> {
  return inject;
}

export function injectFabric<Type, ExtType extends Type, Deps>(
  inject: InjectFabric<Type, ExtType, Deps>
): InjectFabric<Type, ExtType, Deps> {
  return inject;
}

export function injectValue<Type, ExtType extends Type>(
  inject: InjectValue<Type, ExtType>
): InjectValue<Type, ExtType> {
  return inject;
}

export function isInjectClass<Type, ExtType extends Type, Deps>(
  inject: InjectClass<Type, ExtType, Deps> | unknown
): inject is InjectClass<Type, ExtType, Deps> {
  return Boolean(inject
    && typeof inject === 'object'
    && 'token' in inject
    && 'depends' in inject
    && 'constructor' in inject
  );
}

export function isInjectFabric<Type, ExtType extends Type, Deps>(
  inject: InjectFabric<Type, ExtType, Deps> | unknown
): inject is InjectFabric<Type, ExtType, Deps> {
  return Boolean(inject
    && typeof inject === 'object'
    && 'token' in inject
    && 'depends' in inject
    && 'fabric' in inject
    && typeof inject.fabric === 'function'
  );
}

export function isInjectValue<Type, ExtType extends Type = Type>(
  inject: InjectValue<Type, ExtType> | unknown
): inject is InjectValue<Type, ExtType> {
  return Boolean(inject
    && typeof inject === 'object'
    && 'token' in inject
    && 'value' in inject
  );
}

export function isInject<Type, ExtType extends Type, Deps>(
  value: InjectClass<Type, ExtType, Deps> | InjectFabric<Type, ExtType, Deps> | unknown
): value is InjectFabric<Type, ExtType, Deps> | InjectClass<Type, ExtType, Deps> {
  return isInjectClass(value) || isInjectFabric(value) || isInjectValue(value);
}

export function isFabric<Type, Deps>(value: FunctionWithDepends<Type, Deps> | unknown): value is FunctionWithDepends<Type, Deps> {
  return Boolean(value && typeof value === 'function');
}
