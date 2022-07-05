import superjson from 'superjson';

import * as trpc from '@trpc/server';

import { questionRouter } from './questions';

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('questions.', questionRouter);

export type AppRouter = typeof appRouter;
