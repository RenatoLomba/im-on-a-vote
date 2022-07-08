import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getFirstValidationError } from '../../client/utils/get-first-validation-error';
import { trpc } from '../../client/utils/trpc';

interface ICreateQuestionFormFields {
  question: string;
}

interface ICreateQuestionFormProps {
  onSubmit: (data: ICreateQuestionFormFields) => void;
  isCreating: boolean;
}

const CreateQuestionForm: FC<ICreateQuestionFormProps> = ({
  onSubmit,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateQuestionFormFields>();

  return (
    <div className="py-12 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Create Question</h2>

      <div className="mt-8">
        <form
          className="w-full grid grid-cols-1 gap-6"
          onSubmit={handleSubmit((data) => {
            onSubmit(data);

            reset();
          })}
        >
          <label className="block">
            <span>Your Question</span>
            <input
              {...register('question', {
                required: {
                  value: true,
                  message: 'Required field',
                },
                minLength: {
                  value: 5,
                  message: 'Min Length 5',
                },
                maxLength: {
                  value: 600,
                  message: 'Max Length 600',
                },
              })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-800
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.question && (
              <span className="mt-2 block text-red-500 tracking-wide">
                {errors.question.message}
              </span>
            )}
          </label>

          <button
            disabled={isCreating}
            type="submit"
            className="bg-indigo-500 rounded-md py-2 shadow-sm focus:outline-none
            focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default function CreateQuestionPage() {
  const trpcClient = trpc.useContext();

  const { mutate: createQuestion, isLoading } = trpc.useMutation(
    'questions.create',
    {
      onSuccess: () => {
        trpcClient.invalidateQueries('questions.getAllMyQuestions');
      },
      onError: (error) => {
        toast(getFirstValidationError(error, 'question'), {
          type: 'error',
          theme: 'colored',
        });
      },
    },
  );

  return (
    <CreateQuestionForm
      isCreating={isLoading}
      onSubmit={(data) => {
        createQuestion({ question: data.question });
      }}
    />
  );

  // return (
  //   <form onSubmit={async (e) => {}}>
  //     <input
  //       disabled={isLoading}
  //       ref={inputRef}
  //       className="border border-gray-400 disabled:bg-gray-400"
  //       type="text"
  //     />

  //     {error && (
  //       <div className="font-bold text-red-500 text-xl">
  //         {getValidationErrorsByField(error, 'question')?.[0]}
  //       </div>
  //     )}
  //   </form>
  // );
}
