import { InferGetServerSidePropsType } from 'next';
import type { GetServerSidePropsContext } from 'next';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionDetails } from '../../client/components/question-details';
import { appRouter } from '../../server/router';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>,
) {
  const token = context.req.cookies['poll-token'];

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {
      token,
    },
    transformer: superjson,
  });

  const slug = context.params?.slug as string;

  await ssg.fetchQuery('questions.getBySlug', { slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
}

export default function QuestionPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { slug } = props;

  return <QuestionDetails slug={slug} />;
}
