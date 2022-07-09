import type { TRPCClientErrorLike } from '@trpc/client';

import type { AppRouter } from '../../server/router';

export const extractErrorMessage = (error: TRPCClientErrorLike<AppRouter>) => {
  if (error.data?.validationError) {
    const fieldErrors = Object.values(error.data.validationError);
    const errors = fieldErrors.flat();
    return errors[0];
  }

  return error.message;
};
