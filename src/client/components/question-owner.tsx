import { getCookie } from 'cookies-next';
import { FC } from 'react';

export type QuestionOwnerProps = { questionOwnerToken: string };

const QuestionOwner: FC<QuestionOwnerProps> = ({ questionOwnerToken }) => {
  const currentUserToken = getCookie('poll-token');
  const isOwner = currentUserToken === questionOwnerToken;

  return (
    <>
      {isOwner && (
        <div className="m-4 bg-red-700 rounded-md p-3 text-white">
          You made this!
        </div>
      )}
    </>
  );
};

export default QuestionOwner;
