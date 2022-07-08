import { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';

import { withTRPC } from '@trpc/next';

import '../client/styles/globals.css';
import { AppRouter } from '../server/router';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

const getBaseUrl = () => {
  // CLIENT SIDE
  if (typeof window !== 'undefined') {
    return '';
  }

  // SSR PROD
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // SSR DEV
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config() {
    return {
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
      },
    };
  },
  ssr: false,
})(MyApp);
