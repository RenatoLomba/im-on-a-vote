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
      <div className="flex w-full justify-between items-start">
        <h1 className="text-2xl font-bold">Your Questions</h1>

        <Link href={'/question/create'} passHref>
          <a className="bg-gray-200 rounded text-gray-800 p-3">
            Create New Question
          </a>
        </Link>
      </div>

      <div className="flex flex-col items-start">
        {data.map((question) => {
          const createdAtISOString = question.createdAt.toISOString();
          const createdAtFormattedString =
            question.createdAt.toLocaleDateString('en', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

          return (
            <Link
              key={question.id}
              href={`/question/${question.slug}`}
              passHref
            >
              <a className="my-2">
                <strong className="block">{question.title}</strong>

                <time dateTime={createdAtISOString}>
                  Created on {createdAtFormattedString}
                </time>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
