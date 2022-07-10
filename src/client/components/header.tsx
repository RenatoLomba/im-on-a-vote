import Link from 'next/link';
import { FC } from 'react';

export const Header: FC = () => {
  return (
    <div className="bg-blue-400 flex justify-center items-center h-[75px]">
      <Link href="/" passHref>
        <a className="text-3xl font-bold">ImOnAVote</a>
      </Link>
    </div>
  );
};
