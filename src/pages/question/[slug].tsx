import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
} from 'next';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionDetails } from '../../client/components/question-details';
import { prisma } from '../../server/db/client';
import { appRouter } from '../../server/router';

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: { token: undefined },
    transformer: superjson,
  });

  const slug = context.params?.slug as string;

  await ssg.fetchQuery('questions.getBySlug', { slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
    revalidate: 60 * 5,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const questions = await prisma.question.findMany({
    select: { slug: true },
    take: 20,
    orderBy: { createdAt: 'desc' },
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

export default function QuestionPage(
  props: InferGetServerSidePropsType<typeof getStaticProps>,
) {
  const { slug } = props;

  return <QuestionDetails slug={slug} />;
}
