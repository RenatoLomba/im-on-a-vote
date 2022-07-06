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
  .query('getById', {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return prisma.pollQuestion.findUnique({
        where: { id: input.id },
      });
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
