import { NextResponse } from "next/server";
import type { ApiResponse, EmptyData, PaginatedData, PaginationMeta } from "./api/types";

// ---------------------------------------------------------------------------
// 服务端 API 响应工具 —— 用于 Route Handler 中统一返回格式
// 所有响应体结构：{ code, message, data, timestamp }
// ---------------------------------------------------------------------------

function body<T>(code: number, message: string, data: T): ApiResponse<T> {
  return { code, message, data, timestamp: Date.now() };
}

// ---- 成功响应 ---------------------------------------------------------------

/** 200 OK */
export function ok<T>(data: T, message = "OK") {
  return NextResponse.json(body(200, message, data));
}

/** 201 Created */
export function created<T>(data: T, message = "Created") {
  return NextResponse.json(body(201, message, data), { status: 201 });
}

/** 204 No Content */
export function noContent() {
  return new NextResponse(null, { status: 204 });
}

/** 分页响应 —— data 包裹为 { items, pagination } */
export function paginated<T>(
  items: T[],
  pagination: PaginationMeta,
  message = "OK",
) {
  const data: PaginatedData<T> = { items, pagination };
  return NextResponse.json(body(200, message, data));
}

// ---- 错误响应 ---------------------------------------------------------------

/** 400 Bad Request */
export function badRequest(message = "Bad Request", details?: unknown) {
  return NextResponse.json(body(400, message, details ?? null), { status: 400 });
}

/** 401 Unauthorized */
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json(body(401, message, null), { status: 401 });
}

/** 403 Forbidden */
export function forbidden(message = "Forbidden") {
  return NextResponse.json(body(403, message, null), { status: 403 });
}

/** 404 Not Found */
export function notFound(message = "Not Found") {
  return NextResponse.json(body(404, message, null), { status: 404 });
}

/** 409 Conflict */
export function conflict(message = "Conflict") {
  return NextResponse.json(body(409, message, null), { status: 409 });
}

/** 422 Unprocessable Entity — 适用于校验失败 */
export function unprocessable(message = "Unprocessable Entity", details?: unknown) {
  return NextResponse.json(body(422, message, details ?? null), { status: 422 });
}

/** 429 Too Many Requests */
export function tooManyRequests(message = "Too Many Requests") {
  return NextResponse.json(body(429, message, null), { status: 429 });
}

/** 500 Internal Server Error */
export function internalError(message = "Internal Server Error") {
  return NextResponse.json(body(500, message, null), { status: 500 });
}

/** 通用错误响应 —— 由 status 参数决定 HTTP 状态码 */
export function error(status: number, message: string, details?: unknown) {
  return NextResponse.json(body(status, message, details ?? null), { status });
}

// ---- 类型工具：从 Route Handler 返回值中提取 data 类型 ---------------------------------

/** 推导 ApiResponse<T> 中的 T */
export type InferData<R> = R extends NextResponse<infer Payload>
  ? Payload extends ApiResponse<infer D> ? D : never
  : never;
