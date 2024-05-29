import { resetOrdering, resetSelection } from "./helpers";
import { Prisma } from "@prisma/client/extension";
import {
  PageNumberPaginationOptions,
  PrismaModel,
  PrismaQuery,
  PaginationResult,
} from "./types";

export const paginateWithPages = async <T, A>(
  model: PrismaModel,
  query: PrismaQuery,
  { current, pageSize }: Required<PageNumberPaginationOptions>,
): Promise<PaginationResult<Prisma.Result<T, A, "findMany">>> => {
  const [list, total]: [Prisma.Result<T, A, "findMany">, number] =
    await Promise.all([
      model.findMany({
        ...query,
        ...{
          skip: (current - 1) * (pageSize ?? 0),
          take: pageSize === null ? undefined : pageSize,
        },
      }),
      model.count({
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
