import { PostResult } from '@/app/dashboard/_actions/managePosts';
import { FormDataObject } from './types';

type ErrorType = 'object' | 'text' | undefined; //prettier-ignore';

type CustomErrorProps = {
  type: ErrorType;
  message: string | FormDataObject;
};

export default class CustomError extends Error {
  type: ErrorType;
  customMessage: string | FormDataObject;

  constructor({ type, message }: CustomErrorProps) {
    super(
      typeof message === 'string' ? message : 'An error occurred'
    );
    this.type = type;
    this.customMessage = message;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

type PostErrorType = {
  type: ErrorType;
  message: string;
  customMessage: string | FormDataObject;
};

export function handleError({
  type,
  message,
  customMessage,
}: PostErrorType): Omit<PostResult, 'data'> {
  switch (type) {
    case 'object':
      console.error(JSON.stringify(customMessage, null, 2));
      return {
        status: 'error',
        message: customMessage,
      };
    case 'text':
      console.error(message);
      return {
        status: 'error',
        message,
      };
    default:
      console.error('Something went wrong while creating a post 😔');
      return {
        status: 'error',
        message: 'Something went wrong while creating a post 😔',
      };
  }
}
