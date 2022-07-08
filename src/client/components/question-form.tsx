import { FC, useRef } from 'react';

import { trpc } from '../utils/trpc';

export const QuestionForm: FC = () => {
  const trpcClient = trpc.useContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: createQuestion,
    isLoading,
    error,
  } = trpc.useMutation('questions.create', {
    onSuccess: () => {
      trpcClient.invalidateQueries('questions.getAllMyQuestions');

      if (!inputRef.current) return;

      inputRef.current.value = '';
    },
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();

        const question = inputRef.current?.value;

        if (!question) return;

        createQuestion({ question });
      }}
    >
      <input
        disabled={isLoading}
        ref={inputRef}
        className="border border-gray-400 disabled:bg-gray-400"
        type="text"
      />

      {error && (
        <div className="font-bold text-red-500 text-xl">{error.message}</div>
      )}
    </form>
  );
};
