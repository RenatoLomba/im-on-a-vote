import slugify from 'slugify';
import { z } from 'zod';

import * as trpc from '@trpc/server';

import { createQuestionValidator } from '../../shared/validators/create-question-validator';
import { createRouter } from '../context';
import { prisma } from '../db/client';

export const questionRouter = createRouter()
  .query('getAllMyQuestions', {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      const questions = await prisma.question.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          createdAt: true,
        },
      });

      return questions;
    },
  })
  .query('getBySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const question = await prisma.question.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          title: true,
          options: true,
          ownerToken: true,
        },
      });

      return { question, isOwner: ctx.token === question?.ownerToken };
    },
  })
  .mutation('create', {
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.token)
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have a token',
        });

      return prisma.question.create({
        select: {
          id: true,
          slug: true,
          title: true,
        },
        data: {
          ownerToken: ctx.token,
          title: input.question,
          slug: slugify(input.question, { lower: true, trim: true }),
          options: [],
        },
      });
    },
  });
