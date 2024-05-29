import { Prisma } from "@prisma/client/extension";
import {
  PageNumberPaginationOptions,
  PrismaModel,
  PrismaQuery,
  PaginationResult,
} from "./types";
import { paginateWithPages } from "./page-number";

type Paginator = <T, A>(
  this: T,
  args?: Prisma.Exact<
    A,
    Omit<Prisma.Args<T, "findMany">, "cursor" | "take" | "skip">
  >,
) => {
  withPages: (
    options?: PageNumberPaginationOptions,
  ) => Promise<PaginationResult<A>>;
  // ) => Promise<PaginationResult<Prisma.Result<T, A, "findMany">>>;
};

type PaginatorOptions = {
  pageSize?: number;
};

export const createPaginator = <O extends PaginatorOptions>(
  globalOptions?: O,
): Paginator =>
  function paginate(this, args) {
    return {
      withPages: async (options = {}) => {
        const { current = 1, pageSize } = {
          ...globalOptions,
          ...(options as PageNumberPaginationOptions),
        } satisfies Omit<PageNumberPaginationOptions, "pageSize">;

        if (
          typeof current !== "number" ||
          current < 1 ||
          current > Number.MAX_SAFE_INTEGER
        ) {
          throw new Error("Invalid current value");
        }

        if (pageSize !== null && typeof pageSize !== "number") {
          throw new Error("Missing pageSize value");
        }
        if (
          pageSize !== null &&
          (pageSize < 1 || pageSize > Number.MAX_SAFE_INTEGER)
        ) {
          throw new Error("Invalid pageSize value");
        }

        const query = (args ?? {}) as PrismaQuery;

        return paginateWithPages(this as PrismaModel, query, {
          pageSize,
          current,
        });
      },
    };
  };

export const paginate = createPaginator();

export const extension = <O extends PaginatorOptions>(options?: O) => {
  const paginate = createPaginator(options);

  return Prisma.defineExtension({
    name: "pagination",
    model: {
      $allModels: {
        paginate,
      },
    },
  });
};
