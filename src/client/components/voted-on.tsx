import Link from 'next/link';
import { FC } from 'react';

import { trpc } from '../utils/trpc';

export type VotedOnProps = {
  questionId: string;
  questionSlug: string;
  questionOptions: { id: string; text: string }[];
};

const VotedOn: FC<VotedOnProps> = ({
  questionId,
  questionSlug,
  questionOptions,
}) => {
  const { data: vote, isLoading } = trpc.useQuery([
    'questions.getMyVote',
    {
      questionId,
    },
  ]);

  if (isLoading) return <div>Loading...</div>;

  if (!vote)
    return (
      <Link href={`/question/${questionSlug}`} passHref>
        <a className="border border-blue-400 px-3 py-2 rounded-md text-blue-400 font-medium">
          Vote Now!
        </a>
      </Link>
    );

  return (
    <div className="text-xl">
      <strong className="text-blue-400">You voted on: </strong>
      <span className="font-medium">{questionOptions[vote.choice]?.text}</span>
    </div>
  );
};

export default VotedOn;
