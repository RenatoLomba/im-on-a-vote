import type { TRPCClientErrorLike } from '@trpc/client';

import type { AppRouter } from '../../server/router';

export const getFirstValidationError = (
  error: TRPCClientErrorLike<AppRouter>,
  field: string,
) => {
  if (error.data?.validationError) {
    return error.data?.validationError?.fieldErrors?.[field]?.[0];
  }

  return error.message;
};
