import type { NextRequest } from "next/server";

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export function parseId(value: string | undefined | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parsePage(request: NextRequest | Request, defaultPage = 1, defaultPageSize = 20) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? defaultPage));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? defaultPageSize)));
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

export function getQuery(request: NextRequest | Request, key: string) {
  return new URL(request.url).searchParams.get(key);
}

export function getQueryBoolean(request: NextRequest | Request, key: string) {
  const value = getQuery(request, key);
  return value === "true" || value === "1";
}

export function asString(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function asNumber(value: string | null | undefined) {
  if (value == null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function safeError(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
