import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionOwnerProps } from '../../../client/components/question-owner';
import { VotedOnProps } from '../../../client/components/voted-on';
import { trpc } from '../../../client/utils/trpc';
import { prisma } from '../../../server/db/client';
import { appRouter } from '../../../server/router';

const DynamicQuestionOwner = dynamic<QuestionOwnerProps>(
  () => import('../../../client/components/question-owner'),
  {
    ssr: false,
  },
);

const DynamicVotedOn = dynamic<VotedOnProps>(
  () => import('../../../client/components/voted-on'),
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
  const questionOptions = question.options as { id: string; text: string }[];

  return (
    <>
      <Head>
        <title>{question.title} Results | ImOnVote</title>
      </Head>
      <div className="container">
        <DynamicQuestionOwner questionOwnerToken={question.ownerToken} />

        <h1 className="mt-5 text-2xl font-bold mb-5">
          Results on Question{' '}
          <span className="text-blue-400">{question.title}</span>
        </h1>

        <DynamicVotedOn
          questionId={question.id}
          questionSlug={slug}
          questionOptions={questionOptions}
        />

        <ul className="mt-10">
          {questionOptions.map((option, index) => (
            <li key={option.id}>
              <p>
                <strong>{option.text}: </strong>
                <span>{votes[index] ?? 0}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
