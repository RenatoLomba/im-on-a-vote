import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import superjson from 'superjson';

import { createSSGHelpers } from '@trpc/react/ssg';

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
        <h1 className="text-2xl font-bold">Your Questions</h1>

        {data.map((question) => {
          const createdAtISOString = question.createdAt.toISOString();
          const createdAtFormattedString =
            question.createdAt.toLocaleDateString('en', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

          return (
            <div key={question.id} className="flex flex-col my-2">
              <Link href={`/question/${question.slug}`} passHref>
                <a>
                  <div>{question.title}</div>
                </a>
              </Link>
              <time dateTime={createdAtISOString}>
                Created on {createdAtFormattedString}
              </time>
            </div>
          );
        })}
      </div>

      <Link href={'/question/create'} passHref>
        <a>Create New Question</a>
      </Link>
    </div>
  );
}
