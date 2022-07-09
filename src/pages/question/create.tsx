import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { CreateQuestionForm } from '../../client/components/create-question-form';
import { getFirstValidationError } from '../../client/utils/get-first-validation-error';
import { trpc } from '../../client/utils/trpc';

export default function CreateQuestionPage() {
  const router = useRouter();
  const trpcClient = trpc.useContext();

  const { mutate: createQuestion, isLoading } = trpc.useMutation(
    'questions.create',
    {
      onSuccess: (question) => {
        trpcClient.invalidateQueries('questions.getAllMyQuestions');

        router.push(`/question/${question.slug}`);
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
    <CreateQuestionForm isCreating={isLoading} onSubmit={createQuestion} />
  );
}
