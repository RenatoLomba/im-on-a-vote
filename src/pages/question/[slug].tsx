import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { QuestionDetails } from '../../client/components/question-details';

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug || Array.isArray(slug)) return <div>No slug</div>;

  return <QuestionDetails slug={slug} />;
};

export default QuestionPage;
