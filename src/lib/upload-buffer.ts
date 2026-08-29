import { Binary } from "bson";

/** Normalize MongoDB / Mongoose binary fields into a Node Buffer for HTTP responses. */
export function bufferFromStoredData(data: unknown): Buffer | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (data instanceof Binary) return Buffer.from(data.buffer);

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    if (record.type === "Buffer" && Array.isArray(record.data)) {
      return Buffer.from(record.data as number[]);
    }

    if ("_bsontype" in record && record._bsontype === "Binary" && "_buffer" in record) {
      const inner = record._buffer;
      if (inner instanceof Uint8Array) return Buffer.from(inner);
    }

    if ("buffer" in record) {
      const inner = record.buffer;
      if (inner instanceof Uint8Array) return Buffer.from(inner);
      if (Buffer.isBuffer(inner)) return inner;
    }
  }

  return null;
}
