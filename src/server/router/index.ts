import superjson from 'superjson';
import { ZodError } from 'zod';

import { createRouter } from '../context';
import { questionRouter } from './questions';

export const appRouter = createRouter()
  .transformer(superjson)
  .formatError(({ shape, error }) => {
    const zodValidationErrorCause =
      error.cause instanceof ZodError ? error.cause.flatten() : null;

    const validationError = zodValidationErrorCause?.fieldErrors;

    return {
      ...shape,
      data: {
        ...shape.data,
        validationError,
      },
    };
  })
  .merge('questions.', questionRouter);

export type AppRouter = typeof appRouter;
