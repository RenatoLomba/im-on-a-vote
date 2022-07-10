import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import dynamic from 'next/dynamic';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionOwnerProps } from '../../../client/components/question-owner';
import { trpc } from '../../../client/utils/trpc';
import { prisma } from '../../../server/db/client';
import { appRouter } from '../../../server/router';

const DynamicQuestionOwner = dynamic<QuestionOwnerProps>(
  () => import('../../../client/components/question-owner'),
  {
    ssr: false,
  },
);

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {
      token: undefined,
    },
    transformer: superjson,
  });

  const slug = context.params?.slug as string;

  await ssg.fetchQuery('questions.getQuestionResult', {
    slug,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
    revalidate: 60,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const questions = await prisma.question.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
    select: {
      slug: true,
    },
  });

  return {
    paths: questions.map((question) => ({
      params: {
        slug: question.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export default function QuestionResultPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { slug } = props;
  const { data, isLoading } = trpc.useQuery([
    'questions.getQuestionResult',
    { slug },
  ]);

  if (isLoading) return <div>Loading...</div>;

  if (!data?.question) return <div>Question not found</div>;

  const { question, votes } = data;

  return (
    <div className="container">
      <DynamicQuestionOwner questionOwnerToken={question.ownerToken} />

      <h1 className="mt-5 text-2xl font-bold mb-5">
        Results on Question{' '}
        <span className="text-blue-400">{question.title}</span>
      </h1>

      <ul>
        {(question.options as { id: string; text: string }[]).map(
          (option, index) => (
            <li key={option.id}>
              <p>
                <strong>{option.text}: </strong>
                <span>{votes[index]}</span>
              </p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
