import { useEffect, useId } from 'react';
import { useSolution } from '../../container';
import { RENDER_SERVICE } from '../token.ts';
import type { VirtualElementProps } from '../meta/types.ts';

export function HeadItem({
  children,
  type,
  priority = 1,
}: {
  children: number | string;
  type: string;
  priority?: number;
}) {
  const render = useSolution(RENDER_SERVICE);
  const owner = useId();
  const props: VirtualElementProps = {
    textContent: String(children),
  };
  const key = render.meta.makeKey(type, props) || type;

  // Метатеги устанавливаются после рендера, чтобы можно было их удалить при демонтировании компонента
  // Если хоть один элемент изменился, то хук useEffect сначала удалит все текущие варианты
  useEffect(() => {
    render.meta.set({ type, props, key, owner, priority });
    // Удаление всех своих элементов при демонтаже или перед изменением текущих
    return () => render.meta.remove(key, owner);
  }, [key, children, priority]);

  // На сервере вместо хука useEffect
  if (render.isSSR()) render.meta.set({ type, props, key, owner, priority });

  return null;
}
