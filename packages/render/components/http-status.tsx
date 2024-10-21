import { HeadItem } from './head-item.tsx';

export function HttpStatus({
  children,
  priority = 1,
}: {
  children: number | string;
  priority?: number;
}) {
  return (
    <HeadItem type="HttpStatus" priority={priority}>
      {children}
    </HeadItem>
  );
}
