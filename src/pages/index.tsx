import type { GetServerSideProps, NextPage } from 'next';

import { PollQuestion } from '@prisma/client';

import { prisma } from '../db/prisma';

interface IHomeProps {
  questions: string;
}

const Home: NextPage<IHomeProps> = ({ questions }) => {
  const parsedQuestions = JSON.parse(questions) as PollQuestion[];

  return (
    <div>
      <h1 className="font-bold text-blue-500">Hello world Tailwind CSS</h1>

      <ul>
        {parsedQuestions.map((question) => (
          <li key={question.id}>{question.question}</li>
        ))}
      </ul>
    </div>
  );
};

const getServerSideProps: GetServerSideProps = async () => {
  const questions = await prisma.pollQuestion.findMany();

  return {
    props: {
      questions: JSON.stringify(questions),
    },
  };
};

export { getServerSideProps };
export default Home;
