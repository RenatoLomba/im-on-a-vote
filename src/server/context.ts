import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const pollToken = opts?.req.cookies['poll-token']!;

  return {
    pollToken,
  };
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}
