import { FunctionWithDepends, ClassProvider, ValueProvider, Provider } from './types';

export function factoryProvider<Type, ExtType extends Type, Deps>(
  provider: Provider<Type, ExtType, Deps>,
): Provider<Type, ExtType, Deps> {
  return provider;
}

export function classProvider<Type, ExtType extends Type, Deps>(
  provider: ClassProvider<Type, ExtType, Deps>,
): Provider<Type, ExtType, Deps> {
  return {
    ...provider,
    factory: depends => {
      return new provider.constructor(depends);
    },
  };
}

export function valueProvider<Type, ExtType extends Type, Deps>(
  provider: ValueProvider<Type, ExtType>,
): Provider<Type, ExtType, Deps> {
  return {
    ...provider,
    depends: {} as Deps,
    factory: () => {
      return provider.value;
    },
  };
}

export function isFactory<Type, Deps>(
  factory: FunctionWithDepends<Type, Deps> | unknown,
): factory is FunctionWithDepends<Type, Deps> {
  return Boolean(factory && typeof factory === 'function');
}
