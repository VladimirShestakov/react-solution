import { ExtractPaths, PathToType, Value } from './types.ts';

export function get<D, P extends ExtractPaths<D>>(
  data: D,
  path: P,
  defaultValue: any = undefined,
): PathToType<D, P> {
  const parts = path.split('.');
  let current: unknown = data;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else if (Array.isArray(current) && /^\d+$/.test(part)) {
      const index = parseInt(part, 10);
      if (index < current.length) {
        current = current[index];
      } else {
        return defaultValue as PathToType<D, P>;
      }
    } else {
      return defaultValue as PathToType<D, P>;
    }
  }

  return current as PathToType<D, P>;
}
