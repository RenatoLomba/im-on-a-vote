import superjson from 'superjson';

import { createRouter } from '../context';
import { questionRouter } from './questions';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('questions.', questionRouter);

export type AppRouter = typeof appRouter;
