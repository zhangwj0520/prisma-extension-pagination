import { resetOrdering, resetSelection } from "./helpers";
import {
  PageNumberPaginationOptions,
  PrismaModel,
  PrismaQuery,
  PaginationResult
} from "./types";

export const paginateWithPages = async (
  model: PrismaModel,
  query: PrismaQuery,
  { current, pageSize }: Required<PageNumberPaginationOptions>,
): Promise<PaginationResult<unknown>> => {
// ): Promise<[unknown, PageNumberPaginationMeta]> => {

  let list;
  let total = null;

    [list, total] = await Promise.all([
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
      list: list,
      total: total,
      pagination: {
        current,
        pageSize,
      },
    }
};
