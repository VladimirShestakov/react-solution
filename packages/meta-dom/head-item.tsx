import { useEffect, useId } from 'react';
import { useSolution } from '../container';
import { META_DOM_SERVICE } from './token.ts';
import { VirtualElementProps } from './types.ts';

export function HeadItem({
  children,
  type,
  priority = 1,
}: {
  children: number | string;
  type: string
  priority?: number;
}) {
  const metaDom = useSolution(META_DOM_SERVICE);
  const owner = useId();
  const props: VirtualElementProps = {
    textContent: String(children),
  };
  const key = metaDom.makeKey(type, props) || type;

  // Метатеги устанавливаются после рендера, чтобы можно было их удалить при демонтировании компонента
  // Если хоть один элемент изменился, то хук useEffect сначала удалит все текущие варианты
  useEffect(() => {
    metaDom.set({ type, props, key, owner, priority });
    // Удаление всех своих элементов при демонтаже или перед изменением текущих
    return () => metaDom.remove(key, owner);
  }, [key, children, priority]);

  // На сервере вместо хука useEffect
  if (metaDom.isSSR()) metaDom.set({ type, props, key, owner, priority });

  return null;
}
