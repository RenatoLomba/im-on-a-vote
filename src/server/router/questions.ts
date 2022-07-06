import { z } from 'zod';

import * as trpc from '@trpc/server';

import { prisma } from '../db/client';

export const questionRouter = trpc
  .router()
  .query('getAll', {
    async resolve() {
      return prisma.pollQuestion.findMany();
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ input }) {
      return prisma.pollQuestion.create({
        data: {
          question: input.question,
        },
      });
    },
  });
