import { AppType } from 'next/dist/shared/lib/utils';
import { ToastContainer } from 'react-toastify';
import superjson from 'superjson';

import { withTRPC } from '@trpc/next';

import '../client/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../client/components/header';
import { AppRouter } from '../server/router';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
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
