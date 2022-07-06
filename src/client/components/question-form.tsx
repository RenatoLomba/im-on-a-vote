import { FC, useRef } from 'react';

import { trpc } from '../utils/trpc';

export const QuestionForm: FC = () => {
  const trpcClient = trpc.useContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createQuestion, isLoading } = trpc.useMutation(
    'questions.create',
    {
      onSuccess: () => {
        trpcClient.invalidateQueries('questions.getAll');

        if (!inputRef.current) return;

        inputRef.current.value = '';
      },
    },
  );

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();

        const question = inputRef.current?.value;

        if (!question) return;

        await createQuestion({ question });
      }}
    >
      <input
        disabled={isLoading}
        ref={inputRef}
        className="border border-gray-400 disabled:bg-gray-400"
        type="text"
      />
    </form>
  );
};
