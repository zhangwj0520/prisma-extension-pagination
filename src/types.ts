export type PrismaModel = {
  [k in "findMany" | "count"]: CallableFunction;
};

export type PrismaQuery = {
  where: Record<string, unknown>;
};

export type GlobalOptions = {
  pageSize?: number;
};
export type PaginationOptions = {
  pageSize?: number | null;
  current?: number;
};

export type PageNumberPagination = {
  isFirstPage: boolean;
  isLastPage: boolean;
  current: number;
  previousPage: number | null;
  nextPage: number | null;
};

export type PageNumberCounters = {
  pageCount: number;
  totalCount: number;
};

export type PaginationResult<T> = {
  list: T;
  total?: number;
  pagination?: PaginationOptions;
};

export type GetCursorFunction<R> = (result: R) => string;

export type ParseCursorFunction<C> = (cursor: string) => C;

export type CursorPaginationOptions<Result, Condition> = {
  pageSize: number | null;
  after?: string;
  before?: string;
  getCursor?: GetCursorFunction<Result>;
  parseCursor?: ParseCursorFunction<Condition>;
};

export type CursorPaginationMeta = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};
