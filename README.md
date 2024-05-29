# Prisma Pagination Extension

## Introduction

Prisma Client extension for pagination.


## Features

- [Page number pagination](#current-number-pagination)
- [Cursor-based pagination](#cursor-based-pagination)
- Fully tested

## Installation

```bash
pnpm install @zhangwj0520/prisma-extension-pagination
```

### Install extension to all models

```ts
import { PrismaClient } from "@prisma/client";
import { pagination } from "@zhangwj0520/prisma-extension-pagination";

const prisma = new PrismaClient().$extends(pagination());
```

### Install extension on some models

```ts
import { PrismaClient } from "@prisma/client";
import { paginate } from "@zhangwj0520/prisma-extension-pagination";

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      paginate,
    },
  },
});
```

### Change default settings

```ts
import { PrismaClient } from "@prisma/client";
import { pagination } from "@zhangwj0520/prisma-extension-pagination";

const prisma = new PrismaClient().$extends(
  pagination({
    pageSize: 10,
  })
);
```

When using the extension on some models, you need to use `createPaginator` function to set the default values:

```ts
import { PrismaClient } from "@prisma/client";
import { createPaginator } from "prisma-extension-pagination";

const paginate = createPaginator({
  pageSize: 10,
});

// You can create many paginators with different settings.
// They can be reused for different models.

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      paginate,
    },
    post: {
      paginate,
    },
  },
});
```

## Usage

### Page number pagination

Page number pagination uses `pageSize` to select a limited range and `current` to load a specific current of results.

- [Load first current](#load-first-current)
- [Load specific current](#load-specific-current)

#### Load first current

```ts
const res = await prisma.user
  .paginate({
    select: {
      id: true,
    }
  })
  .withPages({
    pageSize: 10,
  });
{
  list: users,
  total:100,
  pagination: {
    pageSize: 10
    current: 1;
  }
}  
```

#### Load specific current

```ts
const res = await prisma.user
  .paginate()
  .withPages({
    pageSize: 10,
    current: 2,
  });

// res contains the following
{
  list: users,
  total:100,
  pagination: {
    pageSize: 10
    current: 2;
  }
}  
```

### Load all results

Sometimes it's useful to return all results, if you need to do that, you can pass `pageSize: null`.

## License

This project is licensed under the terms of the MIT license.
