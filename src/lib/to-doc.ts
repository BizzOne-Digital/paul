/** Narrow mongoose lean results for TypeScript without fighting FlattenMaps. */
export function asDoc<T>(value: unknown): T {
  return value as T;
}
