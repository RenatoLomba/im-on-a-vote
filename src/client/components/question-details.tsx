import dynamic from 'next/dynamic';
import { FC } from 'react';

import { trpc } from '../utils/trpc';
import { QuestionOwnerProps } from './question-owner';

const DynamicQuestionOwner = dynamic<QuestionOwnerProps>(
  () => import('./question-owner'),
  {
    ssr: false,
  },
);

export const QuestionDetails: FC<{ slug: string }> = ({ slug }) => {
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

  if (!data || !data.question) {
    return <div>Question not found</div>;
  }

  const { question } = data;

  return (
    <div className="container">
      <DynamicQuestionOwner questionOwnerToken={question.ownerToken} />

      <div>
        <h1 className="text-2xl font-bold">{question.title}</h1>

        <ul>
          {(question.options as { id: string; text: string }[])?.map(
            (option) => (
              <li key={option.id}>{option.text}</li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};
