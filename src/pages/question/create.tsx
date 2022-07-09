import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { CreateQuestionForm } from '../../client/components/create-question-form';
import { extractErrorMessage } from '../../client/utils/extract-error-message';
import { trpc } from '../../client/utils/trpc';

export default function CreateQuestionPage() {
  const router = useRouter();
  const trpcClient = trpc.useContext();

  const {
    mutate: createQuestion,
    isLoading,
    isSuccess,
  } = trpc.useMutation('questions.create', {
    onSuccess: (question) => {
      trpcClient.invalidateQueries('questions.getAllMyQuestions');

      router.push(`/question/${question.slug}`);
    },
    onError: (error) => {
      toast(extractErrorMessage(error), {
        type: 'error',
        theme: 'colored',
      });
    },
  });

  return (
    <CreateQuestionForm
      isSuccess={isSuccess}
      isCreating={isLoading}
      onSubmit={createQuestion}
    />
  );
}
