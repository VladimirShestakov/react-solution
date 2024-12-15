import { HeadItem } from './head-item.tsx';

export function HttpLocation({ children, priority = 1 }: { children: string; priority?: number }) {
  return (
    <HeadItem type="HttpLocation" priority={priority}>
      {children}
    </HeadItem>
  );
}
