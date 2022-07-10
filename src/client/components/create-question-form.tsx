import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  CreateQuestionInputType,
  createQuestionValidator,
} from '../../shared/validators/create-question-validator';

interface ICreateQuestionFormProps {
  onSubmit: (data: CreateQuestionInputType) => void;
  isCreating: boolean;
  isSuccess: boolean;
}

export const CreateQuestionForm: FC<ICreateQuestionFormProps> = ({
  onSubmit,
  isCreating,
  isSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold">Create Question</h2>

      <form
        className="w-full flex flex-col gap-6 mt-8 items-start"
        onSubmit={handleSubmit((data) => {
          if (isCreating) return;

          onSubmit(data);
        })}
      >
        <label className="block w-full">
          <span className="text-lg">Your Question</span>
          <input
            {...register('question')}
            placeholder="How do magnets work?"
            type="text"
            className="mt-1 block w-full border border-gray-300 shadow-sm
              focus:ring focus:ring-blue-500 text-gray-800"
          />
          {errors.question && (
            <span className="mt-2 block text-red-400 tracking-wide">
              {errors.question.message}
            </span>
          )}
        </label>

        <button
          disabled={isCreating}
          type="submit"
          className="bg-blue-500 py-2 px-5 shadow-sm focus:outline-none
            focus:ring focus:ring-blue-300 font-medium
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
