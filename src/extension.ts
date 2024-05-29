import { Prisma } from "@prisma/client/extension";
import {
  PaginationOptions,
  PrismaModel,
  PrismaQuery,
  GlobalOptions,
} from "./types";
import { resetOrdering, resetSelection } from "./helpers";

export const createPaginator = (globalOptions?: GlobalOptions) =>
  async function paginate<T, A>(
    this: T,
    args?: Prisma.Exact<
      A,
      Prisma.Args<T, "findMany"> & {
        pagination?: PaginationOptions;
      }
    >,
  ) {
    const { pagination, ...query } = (args ?? {}) as PrismaQuery & {
      pagination: PaginationOptions;
    };
    const { current = 1, pageSize } = {
      ...globalOptions,
      ...(pagination as PaginationOptions),
    };

    const [list, total] = await Promise.all([
      (this as PrismaModel).findMany({
        ...query,
        ...{
          skip: (current - 1) * (pageSize ?? 0),
          take: pageSize === null ? undefined : pageSize,
        },
      }),
      (this as PrismaModel).count({
        ...query,
        ...resetSelection,
        ...resetOrdering,
      }),
    ]);

    // pageCount = pageSize === null ? 1 : Math.ceil(total / pageSize);

    return {
      list,
      total,
      pagination: {
        current,
        pageSize,
      },
    };
  };

export const paginate = createPaginator();

export const extension = (options?: GlobalOptions) => {
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
