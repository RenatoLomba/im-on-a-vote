import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { trpc } from '../../client/utils/trpc';

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <div>No Slug</div>;
  if (Array.isArray(slug)) return <div>To Many Slugs</div>;

  const { data, isLoading, isError, error } = trpc.useQuery([
    'questions.getBySlug',
    { slug },
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

  return (
    <div className="p-8 flex flex-col">
      <h1 className="text-2xl font-bold">{data.title}</h1>

      <ul>
        {(data.options as string[])?.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionPage;
