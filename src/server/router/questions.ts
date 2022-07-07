import slugify from 'slugify';
import { z } from 'zod';

import { createRouter } from '../context';
import { prisma } from '../db/client';

export const questionRouter = createRouter()
  .query('getAll', {
    async resolve() {
      return prisma.question.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
        },
      });
    },
  })
  .query('getBySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      return prisma.question.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          title: true,
          options: true,
        },
      });
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ input, ctx }) {
      return prisma.question.create({
        select: {
          id: true,
          slug: true,
          title: true,
        },
        data: {
          ownerToken: ctx.pollToken,
          title: input.question,
          slug: slugify(input.question, { lower: true, trim: true }),
          options: [],
        },
      });
    },
  });
