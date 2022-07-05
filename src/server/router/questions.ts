import * as trpc from '@trpc/server';

import { prisma } from '../db/client';

export const questionRouter = trpc.router().query('getAll', {
  async resolve() {
    const questions = await prisma.pollQuestion.findMany();

    return { questions };
  },
});
