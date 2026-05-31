/** 统一 API 响应结构 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/** 分页元数据 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/** 分页响应数据包裹层 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

/** 空响应 body 的 data 类型 */
export type EmptyData = null;

/** 客户端请求配置 */
export interface RequestConfig {
  /** 超时时间(ms)，默认 10000 */
  timeout?: number;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 缓存策略 */
  cache?: RequestCache;
}

/** 请求拦截器 */
export interface RequestInterceptor {
  /** 请求发出前修改配置 */
  onRequest?: (config: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>;
  /** 收到响应后转换结果 */
  onResponse?: <T>(response: Response) => T | Promise<T>;
  /** 捕获请求/响应阶段的异常 */
  onError?: (error: Error) => void;
}

/** 内部请求配置（url 已拼入） */
export interface InternalRequestConfig extends RequestInit {
  url: string;
  timeout: number;
}
