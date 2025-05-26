import { useSyncExternalStore } from 'react';
import { State } from './state.ts';

/**
 * Хук для выборки состояния и слежением за его изменением.
 * Является оберткой над системным хуком useSyncExternalStore, чтобы упростить использование
 * @example
 * ```ts
 *  const data = useExternalState(someService.state)
 * ```
 */
export function useExternalState<StateType>(state: State<StateType>): StateType {
  return useSyncExternalStore(state.subscribe, state.get, state.get);
}
