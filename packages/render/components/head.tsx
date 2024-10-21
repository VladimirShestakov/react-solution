import react, { type ReactElement, type ReactNode, useEffect, useId, useRef } from 'react';
import { useSolution } from '../../container';
import { RENDER_SERVICE } from '../token.ts';
import type { VirtualElementPlain, VirtualElementProps } from '../meta/types.ts';

export function Head({ children, priority = 1 }: { children: ReactNode; priority?: number }) {
  const render = useSolution(RENDER_SERVICE);
  const owner = useId();
  const deps: (string | undefined)[] = [owner];
  const elements = useRef<VirtualElementPlain[]>([]);

  let index = 0;
  elements.current = [];
  react.Children.map(children, (child: ReactNode) => {
    if (react.isValidElement(child)) {
      const element = child as ReactElement;
      // Тип элемент из названия JSX тега
      const type =
        typeof element.type === 'string'
          ? element.type
          : typeof element.type === 'function' && 'name' in element.type
            ? (element.type as () => unknown).name
            : '';
      if (type) {
        // Подготовка свойств элемента
        const props: VirtualElementProps = {};
        for (const [name, value] of Object.entries(element.props)) {
          // textContent
          if (name === 'children') {
            props.textContent = typeof value === 'string' ? value : '';
          } else {
            // Остальные атрибуты
            props[name] = value as any; /// ???
          }
        }
        // Ключ элемента
        // Если не определен по свойствам (нет уникальных), то формируется уникальный ключ по owner
        const key = render.meta.makeKey(type, props) || `${type}[owner=${owner}][index=${++index}]`;

        const plainElement = { type, props, owner, priority, key };

        elements.current.push(plainElement);
        deps.push(JSON.stringify(plainElement));
      }
    }
  });

  // Метатеги устанавливаются после рендера, чтобы можно было их удалить при демонтировании компонента
  // Если хоть один элемент изменился, то хук useEffect сначала удалит все текущие варианты
  useEffect(() => {
    render.meta.setList(owner, elements.current);
    // Удаление всех своих элементов при демонтаже или перед изменением текущих
    return () => render.meta.removeList(owner, elements.current);
  }, deps);

  // На сервере вместо хука useEffect
  if (render.isSSR()) render.meta.setList(owner, elements.current);

  return null;
}
