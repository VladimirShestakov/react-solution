import type { FunctionWithDepends, ClassProvider, FactoryProvider, ValueProvider } from './types';

export function classProvider<Type, ExtType extends Type, Deps>(
  provider: ClassProvider<Type, ExtType, Deps>,
): ClassProvider<Type, ExtType, Deps> {
  return provider;
}

export function factoryProvider<Type, ExtType extends Type, Deps>(
  provider: FactoryProvider<Type, ExtType, Deps>,
): FactoryProvider<Type, ExtType, Deps> {
  return provider;
}

export function valueProvider<Type, ExtType extends Type>(
  provider: ValueProvider<Type, ExtType>,
): ValueProvider<Type, ExtType> {
  return provider;
}

export function isClassProvider<Type, ExtType extends Type, Deps>(
  provider: ClassProvider<Type, ExtType, Deps> | unknown,
): provider is ClassProvider<Type, ExtType, Deps> {
  return Boolean(
    provider &&
      typeof provider === 'object' &&
      'token' in provider &&
      'depends' in provider &&
      'constructor' in provider,
  );
}

export function isFactoryProvider<Type, ExtType extends Type, Deps>(
  provider: FactoryProvider<Type, ExtType, Deps> | unknown,
): provider is FactoryProvider<Type, ExtType, Deps> {
  return Boolean(
    provider &&
      typeof provider === 'object' &&
      'token' in provider &&
      'depends' in provider &&
      'factory' in provider &&
      typeof provider.factory === 'function',
  );
}

export function isValueProvider<Type, ExtType extends Type = Type>(
  provider: ValueProvider<Type, ExtType> | unknown,
): provider is ValueProvider<Type, ExtType> {
  return Boolean(
    provider && typeof provider === 'object' && 'token' in provider && 'value' in provider,
  );
}

export function isProvider<Type, ExtType extends Type, Deps>(
  provider: ClassProvider<Type, ExtType, Deps> | FactoryProvider<Type, ExtType, Deps> | unknown,
): provider is FactoryProvider<Type, ExtType, Deps> | ClassProvider<Type, ExtType, Deps> {
  return isClassProvider(provider) || isFactoryProvider(provider) || isValueProvider(provider);
}

export function isFactory<Type, Deps>(
  value: FunctionWithDepends<Type, Deps> | unknown,
): value is FunctionWithDepends<Type, Deps> {
  return Boolean(value && typeof value === 'function');
}
