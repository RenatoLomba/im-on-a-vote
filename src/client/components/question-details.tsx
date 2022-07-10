import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '../utils/extract-error-message';
import { trpc } from '../utils/trpc';
import { QuestionOwnerProps } from './question-owner';

const DynamicQuestionOwner = dynamic<QuestionOwnerProps>(
  () => import('./question-owner'),
  {
    ssr: false,
  },
);

export const QuestionDetails: FC<{ slug: string }> = ({ slug }) => {
  const queryClient = trpc.useContext();
  const router = useRouter();
  const { data, isLoading, isError, error } = trpc.useQuery([
    'questions.getBySlug',
    { slug },
  ]);

  const {
    mutate: voteOnQuestion,
    isLoading: isVoting,
    isSuccess: isVoteSuccess,
  } = trpc.useMutation('questions.vote-on-question', {
    onSuccess() {
      router.push(`/question/${slug}/result`);

      queryClient.invalidateQueries('questions.getMyVote');
      queryClient.invalidateQueries('questions.getQuestionResult');
    },
    onError(error) {
      toast(extractErrorMessage(error), {
        type: 'error',
        theme: 'colored',
      });
    },
  });

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

  const handleOptionClick = (option: number) => {
    if (isVoting) return;

    voteOnQuestion({
      questionId: question.id,
      option,
    });
  };

  return (
    <div className="container">
      <DynamicQuestionOwner questionOwnerToken={question.ownerToken} />

      <div className="mt-5">
        <h1 className="text-2xl font-bold mb-5">{question.title}</h1>

        {isVoteSuccess && <div>Voted!</div>}

        {isVoting && <div>Voting...</div>}

        {!isVoting && !isVoteSuccess && (
          <ul className="flex flex-col align-start gap-2">
            {(question.options as { id: string; text: string }[])?.map(
              (option, index) => {
                return (
                  <li key={option.id}>
                    <button onClick={() => handleOptionClick(index)}>
                      {option.text}
                    </button>
                  </li>
                );
              },
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
