import type { NextPage } from 'next';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['getAllQuestions']);

  if (isLoading || !data) {
    return <div>...Loading</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-blue-500">Hello world Tailwind CSS</h1>

      <ul>
        {data.questions.map((question) => (
          <li key={question.id}>{question.question}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
