import slugify from 'slugify';
import { z } from 'zod';

import * as trpc from '@trpc/server';

import { prisma } from '../db/client';

export const questionRouter = trpc
  .router()
  .query('getAll', {
    async resolve() {
      return prisma.question.findMany();
    },
  })
  .query('getBySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      return prisma.question.findUnique({
        where: { slug: input.slug },
      });
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ input }) {
      return prisma.question.create({
        data: {
          title: input.question,
          slug: slugify(input.question, { lower: true, trim: true }),
          options: [],
        },
      });
    },
  });
