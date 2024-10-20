import react, { ReactElement, useEffect, useId, useRef } from 'react';
import { useSolution } from '../container';
import { META_DOM_SERVICE } from './token.ts';
import { VirtualElementPlain, VirtualElementProps } from './types.ts';

export function Head({ children, priority = 1 }: { children: React.ReactNode; priority?: number }) {
  const metaDom = useSolution(META_DOM_SERVICE);
  const owner = useId();
  const deps: (string | undefined)[] = [owner];
  const elements = useRef<VirtualElementPlain[]>([]);

  let index = 0;
  elements.current = [];
  react.Children.map(children, (child: React.ReactNode) => {
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
        const key = metaDom.makeKey(type, props) || `${type}[owner=${owner}][index=${++index}]`;

        const plainElement = { type, props, owner, priority, key };

        elements.current.push(plainElement);
        deps.push(JSON.stringify(plainElement));
      }
    }
  });

  // Метатеги устанавливаются после рендера, чтобы можно было их удалить при демонтировании компонента
  // Если хоть один элемент изменился, то хук useEffect сначала удалит все текущие варианты
  useEffect(() => {
    metaDom.setList(owner, elements.current);
    // Удаление всех своих элементов при демонтаже или перед изменением текущих
    return () => metaDom.removeList(owner, elements.current);
  }, deps);

  // На сервере вместо хука useEffect
  if (metaDom.isSSR()) metaDom.setList(owner, elements.current);

  return null;
}

// const params: TitleParams = { _key: getKey().toString() };
// for (const [name, value] of Object.entries(child.props)) {
//   console.log({name, value})
//   // Текст заголовка
//   if (name === 'children' && value) {
//     params.template = typeof value === 'string' ? value : 'EMPTY';
//   } else
//   // data- атрибуты используются в качестве значений для шаблона заголовка
//   if (name.startsWith('data-')) {
//     params[name.substring(5)] = value as string;
//   } else {
//     // Остальные атрибуты
//
//   }
