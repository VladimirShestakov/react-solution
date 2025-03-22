import { FunctionWithDepends, ClassProvider, ValueProvider, Provider, Depends } from './types';

export function factoryProvider<Type, ExtType extends Type, DepsTokens>(
  provider: Provider<Type, ExtType, DepsTokens>,
): Provider<Type, ExtType, DepsTokens> {
  return provider;
}

export function classProvider<Type, ExtType extends Type, DepsTokens>(
  provider: ClassProvider<Type, ExtType, DepsTokens>,
): Provider<Type, ExtType, DepsTokens> {
  return {
    ...provider,
    factory: depends => {
      return new provider.constructor(depends);
    },
  };
}

export function valueProvider<Type, ExtType extends Type>(
  provider: ValueProvider<Type, ExtType>,
): Provider<Type, ExtType> {
  return {
    ...provider,
    depends: {},
    factory: () => {
      return provider.value;
    },
  };
}

export function isFactory<Type, Deps extends Depends>(
  factory: FunctionWithDepends<Type, Deps> | unknown,
): factory is FunctionWithDepends<Type, Deps> {
  return Boolean(factory && typeof factory === 'function');
}
