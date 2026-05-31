import type { ApiResponse, PaginatedData, RequestConfig, RequestInterceptor, InternalRequestConfig } from "./types";

// ---------------------------------------------------------------------------
// 前端 fetch 客户端 — 统一请求/响应拦截、超时、类型推导
// ---------------------------------------------------------------------------

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private _onRequest: NonNullable<RequestInterceptor["onRequest"]>[] = [];
  private _onResponse: NonNullable<RequestInterceptor["onResponse"]>[] = [];
  private _onError: NonNullable<RequestInterceptor["onError"]>[] = [];

  constructor(options?: { baseUrl?: string; timeout?: number; headers?: Record<string, string> }) {
    this.baseUrl = options?.baseUrl ?? "";
    this.defaultTimeout = options?.timeout ?? 10_000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
  }

  /** 注册拦截器，返回取消注册函数 */
  use(interceptor: RequestInterceptor): () => void {
    const unsub: (() => void)[] = [];

    if (interceptor.onRequest) {
      this._onRequest.push(interceptor.onRequest);
      unsub.push(() => {
        this._onRequest = this._onRequest.filter((h) => h !== interceptor.onRequest);
      });
    }
    if (interceptor.onResponse) {
      this._onResponse.push(interceptor.onResponse);
      unsub.push(() => {
        this._onResponse = this._onResponse.filter((h) => h !== interceptor.onResponse);
      });
    }
    if (interceptor.onError) {
      this._onError.push(interceptor.onError);
      unsub.push(() => {
        this._onError = this._onError.filter((h) => h !== interceptor.onError);
      });
    }

    return () => unsub.forEach((fn) => fn());
  }

  /** 通用请求方法 */
  async request<T>(
    method: string,
    path: string,
    options?: RequestConfig & { body?: unknown; params?: Record<string, string | number | boolean | undefined> },
  ): Promise<ApiResponse<T>> {
    const { body, params, timeout, headers: extraHeaders, ...rest } = options ?? {};

    // 拼 URL
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const search = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) search.set(k, String(v));
      }
      const qs = search.toString();
      if (qs) url += `?${qs}`;
    }

    // 构造请求配置
    let config: InternalRequestConfig = {
      url,
      method,
      headers: { ...this.defaultHeaders, ...extraHeaders },
      timeout: timeout ?? this.defaultTimeout,
      ...rest,
    };
    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }

    // onRequest 拦截
    for (const hook of this._onRequest) {
      config = await hook(config);
    }

    // 带超时的 fetch
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(config.url, config);
      clearTimeout(timer);

      // onResponse 拦截
      let result: ApiResponse<T> | undefined;
      for (const hook of this._onResponse) {
        const transformed = await hook(response);
        if (transformed !== undefined) {
          result = transformed as ApiResponse<T>;
          return result;
        }
      }

      // 默认处理
      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new HttpError(
          errBody?.message ?? response.statusText,
          response.status,
          errBody,
        );
      }

      result = (await response.json()) as ApiResponse<T>;
      return result;
    } catch (err) {
      clearTimeout(timer);
      const error = err instanceof HttpError ? err : normalizeError(err, config.timeout);

      for (const hook of this._onError) {
        hook(error);
      }

      throw error;
    }
  }

  // ---- 快捷方法 ----

  get<T>(path: string, options?: RequestConfig & { params?: Record<string, string | number | boolean | undefined> }) {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestConfig) {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestConfig) {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestConfig) {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestConfig) {
    return this.request<T>("DELETE", path, options);
  }
}

// ---------------------------------------------------------------------------
// 自定义请求错误
// ---------------------------------------------------------------------------

export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

function normalizeError(err: unknown, timeout: number): HttpError {
  if (err instanceof DOMException && err.name === "AbortError") {
    return new HttpError(`Request timed out after ${timeout}ms`, 408);
  }
  if (err instanceof TypeError) {
    return new HttpError("Network error", 0);
  }
  return err instanceof HttpError ? err : new HttpError("Unknown error", 0);
}

// ---------------------------------------------------------------------------
// 类型辅助
// ---------------------------------------------------------------------------

/** 从 ApiResponse<T> 中提取 data 的类型 */
export type ExtractData<T> = T extends ApiResponse<infer D> ? D : never;

/** 从 ApiResponse<PaginatedData<T>> 中提取 items 元素的类型 */
export type ExtractItem<T> = T extends ApiResponse<PaginatedData<infer I>> ? I : never;

// ---------------------------------------------------------------------------
// 导出单例
// ---------------------------------------------------------------------------

const http = new HttpClient();
export { HttpClient, http };
