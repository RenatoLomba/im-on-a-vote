import type { NextPage } from 'next';
import Link from 'next/link';

import { QuestionForm } from '../client/components/question-form';
import { trpc } from '../client/utils/trpc';

const Home: NextPage = () => {
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
};

export default Home;
