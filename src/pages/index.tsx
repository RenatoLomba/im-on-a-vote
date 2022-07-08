import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

import { QuestionForm } from '../client/components/question-form';
import { trpc } from '../client/utils/trpc';
import { appRouter } from '../server/router';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies['poll-token'];

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {
      token,
    },
    transformer: superjson,
  });

  await ssg.fetchQuery('questions.getAllMyQuestions');

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default function Home() {
  const { data, isLoading } = trpc.useQuery(['questions.getAllMyQuestions']);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold">Questions</h1>

        {data.map((question) => (
          <Link key={question.id} href={`/question/${question.slug}`} passHref>
            <a className="my-2 block">
              <div>{question.title}</div>
            </a>
          </Link>
        ))}
      </div>

      <QuestionForm />
    </div>
  );
}
