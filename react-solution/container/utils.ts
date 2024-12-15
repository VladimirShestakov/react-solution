import type { FunctionWithDepends, InjectClass, InjectFactory, InjectValue } from './types';

export function injectClass<Type, ExtType extends Type, Deps>(
  inject: InjectClass<Type, ExtType, Deps>,
): InjectClass<Type, ExtType, Deps> {
  return inject;
}

export function injectFactory<Type, ExtType extends Type, Deps>(
  inject: InjectFactory<Type, ExtType, Deps>,
): InjectFactory<Type, ExtType, Deps> {
  return inject;
}

export function injectValue<Type, ExtType extends Type>(
  inject: InjectValue<Type, ExtType>,
): InjectValue<Type, ExtType> {
  return inject;
}

export function isInjectClass<Type, ExtType extends Type, Deps>(
  inject: InjectClass<Type, ExtType, Deps> | unknown,
): inject is InjectClass<Type, ExtType, Deps> {
  return Boolean(
    inject &&
      typeof inject === 'object' &&
      'token' in inject &&
      'depends' in inject &&
      'constructor' in inject,
  );
}

export function isInjectFactory<Type, ExtType extends Type, Deps>(
  inject: InjectFactory<Type, ExtType, Deps> | unknown,
): inject is InjectFactory<Type, ExtType, Deps> {
  return Boolean(
    inject &&
      typeof inject === 'object' &&
      'token' in inject &&
      'depends' in inject &&
      'factory' in inject &&
      typeof inject.factory === 'function',
  );
}

export function isInjectValue<Type, ExtType extends Type = Type>(
  inject: InjectValue<Type, ExtType> | unknown,
): inject is InjectValue<Type, ExtType> {
  return Boolean(inject && typeof inject === 'object' && 'token' in inject && 'value' in inject);
}

export function isInject<Type, ExtType extends Type, Deps>(
  inject: InjectClass<Type, ExtType, Deps> | InjectFactory<Type, ExtType, Deps> | unknown,
): inject is InjectFactory<Type, ExtType, Deps> | InjectClass<Type, ExtType, Deps> {
  return isInjectClass(inject) || isInjectFactory(inject) || isInjectValue(inject);
}

export function isFactory<Type, Deps>(
  value: FunctionWithDepends<Type, Deps> | unknown,
): value is FunctionWithDepends<Type, Deps> {
  return Boolean(value && typeof value === 'function');
}
