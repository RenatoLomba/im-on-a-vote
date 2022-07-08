import superjson from 'superjson';
import { ZodError } from 'zod';

import { createRouter } from '../context';
import { questionRouter } from './questions';

export const appRouter = createRouter()
  .transformer(superjson)
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        validationError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  })
  .merge('questions.', questionRouter);

export type AppRouter = typeof appRouter;
