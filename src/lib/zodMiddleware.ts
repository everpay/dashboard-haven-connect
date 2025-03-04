
import { ZodSchema } from 'zod';
import { toast } from 'sonner';

export class ValidationError extends Error {
  errors: Record<string, string[]>;
  
  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

/**
 * Validates data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns The validated data or throws a ValidationError
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.format();
    const formattedErrors: Record<string, string[]> = {};
    
    Object.entries(errors).forEach(([key, value]) => {
      if (key !== '_errors' && value?._errors) {
        formattedErrors[key] = value._errors;
      }
    });

    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  return result.data;
}

/**
 * A middleware for validating form data with Zod
 * @param schema The Zod schema to validate against
 * @param onSuccess Callback function when validation succeeds
 * @param onError Optional callback function when validation fails
 * @returns A function that handles the validation process
 */
export function withValidation<T, R>(
  schema: ZodSchema<T>, 
  onSuccess: (data: T) => R,
  onError?: (error: ValidationError) => void
) {
  return (data: unknown): R | void => {
    try {
      const validatedData = validateData(schema, data);
      return onSuccess(validatedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        if (onError) {
          onError(error);
        } else {
          // Default error handling
          toast.error('Validation error', {
            description: 'Please check the form for errors'
          });
          console.error('Validation errors:', error.errors);
        }
      } else {
        toast.error('An unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    }
  };
}

/**
 * Applies Zod validation to a form submit handler
 * @param schema The Zod schema to validate against
 * @param onSubmit The submit handler function
 * @returns A function that handles the form submit event with validation
 */
export function createFormHandler<T>(
  schema: ZodSchema<T>,
  onSubmit: (data: T) => void
) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    
    withValidation(schema, onSubmit)(formValues);
  };
}
