import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionDetails } from '../../../client/components/question-details';
import { prisma } from '../../../server/db/client';
import { appRouter } from '../../../server/router';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>,
) {
  const token = context.req.cookies['poll-token']!;

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: { token: undefined },
    transformer: superjson,
  });

  const slug = context.params?.slug as string;

  const data = await ssg.fetchQuery('questions.getBySlug', { slug });

  const myVote = await prisma.vote.findFirst({
    where: {
      questionId: data.question?.id,
      voterToken: token,
    },
  });

  if (myVote) {
    return {
      redirect: {
        destination: `/question/${slug}/result`,
        permanent: false,
      },
    };
  }

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
