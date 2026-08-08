import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin, unauthorizedJson } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";

export async function withAdmin<T>(
  handler: () => Promise<T> | T,
) {
  const session = await requireAdmin();
  if (!session) return unauthorizedJson();
  try {
    await connectMongo();
    const data = await handler();
    if (data instanceof Response) return data;
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    console.error("[admin-api]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function stripPasswordHash<T extends Record<string, unknown>>(doc: T) {
  const clone = { ...doc };
  delete clone.passwordHash;
  return clone;
}
