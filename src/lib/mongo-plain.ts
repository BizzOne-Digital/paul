import { toPlain } from "@/lib/utils";

/** Safely cast Mongoose lean() results through unknown for admin UI typing. */
export function asPlain<T>(doc: unknown): T {
  return toPlain(doc) as T;
}
