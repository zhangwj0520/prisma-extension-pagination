import { resetOrdering, resetSelection } from "./helpers";
import {
  PageNumberPaginationOptions,
  PrismaModel,
  PrismaQuery,
  PaginationResult,
} from "./types";

export const paginateWithPages = async <T>(
  model: PrismaModel,
  query: PrismaQuery,
  { current, pageSize }: Required<PageNumberPaginationOptions>,
): Promise<PaginationResult<T>> => {
  // ): Promise<[unknown, PageNumberPaginationMeta]> => {

  const [list, total] = await Promise.all([
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
