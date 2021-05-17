import { useCallback } from 'react';
import * as yup from 'yup';

export const useYupValidationResolver = (
  validationSchema: yup.ObjectSchema<any, any, any>,
) =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors:
            errors.inner &&
            errors.inner.reduce(
              (allErrors: any, currentError: any) => ({
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? 'validation',
                  message: currentError.message,
                },
              }),
              {},
            ),
        };
      }
    },
    [validationSchema],
  );
