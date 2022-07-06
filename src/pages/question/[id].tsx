import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { trpc } from '../../client/utils/trpc';

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <div>No ID</div>;
  if (Array.isArray(id)) return <div>To Many Ids</div>;

  const { data, isLoading, isError, error } = trpc.useQuery([
    'questions.getById',
    { id },
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error) {
    return (
      <div className="text-red-500 text-xl font-bold">{error.message}</div>
    );
  }

  if (!data) {
    return <div>Question not found</div>;
  }

  return <div>Question {data.question}</div>;
};

export default QuestionPage;
