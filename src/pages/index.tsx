import type { NextPage } from 'next';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const hello = trpc.useQuery(['hello', { text: 'Renato' }]);

  if (hello.isLoading || !hello.data) {
    return <div>...Loading</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-blue-500">Hello world Tailwind CSS</h1>

      <p>{hello.data.greeting}</p>
    </div>
  );
};

export default Home;
