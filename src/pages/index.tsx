import type { NextPage } from 'next';

import { QuestionForm } from '../client/components/question-form';
import { trpc } from '../client/utils/trpc';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.getAll']);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold">Questions</h1>

        {data.map((pollQuestion) => (
          <div key={pollQuestion.id} className="my-2">
            {pollQuestion.question}
          </div>
        ))}
      </div>

      <QuestionForm />
    </div>
  );
};

export default Home;
