import { z } from 'zod';

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(600),
  options: z
    .array(
      z.object({
        text: z.string().min(1).max(200),
      }),
    )
    .min(2, { message: 'At least 2 options' })
    .max(10, { message: 'Maximum of 10 options' }),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;
