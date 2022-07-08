import type { TRPCClientErrorLike } from '@trpc/client';

import type { AppRouter } from '../../server/router';

export const getValidationErrorsByField = (
  error: TRPCClientErrorLike<AppRouter>,
  field: string,
) => {
  return error.data?.validationError?.fieldErrors?.[field];
};
