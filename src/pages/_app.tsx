import { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';

import { withTRPC } from '@trpc/next';

import '../client/styles/globals.css';
import { AppRouter } from '../server/router';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

const getApplicationUrl = () => {
  let url = 'http://localhost:3000/api/trpc';

  if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}/api/trpc`;
  } else if (process.env.NODE_ENV === 'production') {
    url = '/api/trpc';
  }

  return url;
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = getApplicationUrl();

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: { queries: { staleTime: 1000 * 60 } },
      },
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
