import { useRef } from 'react';

import { getValidationErrorsByField } from '../../client/utils/get-validation-errors-by-field';
import { trpc } from '../../client/utils/trpc';

export default function CreateQuestionPage() {
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
      className="flex flex-col p-6"
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
        <div className="font-bold text-red-500 text-xl">
          {getValidationErrorsByField(error, 'question')?.[0]}
        </div>
      )}
    </form>
  );
}
