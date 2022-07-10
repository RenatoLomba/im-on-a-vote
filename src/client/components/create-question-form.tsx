import { FC, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { MdAdd, MdRemove } from 'react-icons/md';

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
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: 'Yes' }, { text: 'No' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
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

        <div className="w-full">
          <div className="flex w-full items-center gap-5">
            <span className="text-lg">Add Options</span>
            <button
              onClick={() => append({ text: `Option ${fields.length + 1}` })}
              type="button"
              className="bg-yellow-500 py-1 px-2 shadow-sm focus:outline-none
                focus:ring focus:ring-yellow-100 font-medium
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdAdd />
            </button>
          </div>

          {errors.options && (
            <span className="mt-2 block text-red-400 tracking-wide">
              {errors.options.message}
            </span>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-2">
            {fields.map((field, index) => (
              <label key={field.id} className="block">
                <div className="flex align-center gap-1">
                  <input
                    {...register(`options.${index}.text`)}
                    type="text"
                    className="flex-1 block border border-gray-300 shadow-sm
                  focus:ring focus:ring-blue-500 text-gray-800"
                  />
                  <button
                    onClick={() => remove(index)}
                    type="button"
                    className="bg-red-500 py-1 px-2 shadow-sm focus:outline-none
                    focus:ring focus:ring-red-100 font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdRemove />
                  </button>
                </div>
                {errors.options?.[index]?.text?.message && (
                  <span className="mt-2 block text-red-400 tracking-wide">
                    {errors.options?.[index]?.text?.message}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

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
