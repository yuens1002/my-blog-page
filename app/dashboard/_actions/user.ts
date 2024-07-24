import db from '@/db/prismaDb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z
    .string()
    .min(1)
    .refine((str) => str !== 'undefined', 'email is required'),
  firstName: z
    .string()
    .min(1)
    .refine((str) => str !== 'undefined', 'first name is required'),
  lastName: z
    .string()
    .min(1)
    .refine((str) => str !== 'undefined', 'last name is required'),
  bio: z.string().optional(),
  kindeId: z
    .string()
    .min(1)
    .refine((str) => str !== 'undefined', 'kindeId is required'),
});

export async function createUser(formData: FormData) {
  const result = createUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  console.log('[result]: ', result);
  if (!result.success) {
    console.log('result', result.error);
    return result.error.formErrors.fieldErrors;
  }

  const { data } = result;
  console.log('[data]:', data);
  try {
    const user = await db.user.create({ data: { ...data } });
    if (!user) {
      throw new Error(
        'something went wrong while creating the new user'
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        status: 400,
        message: error.message,
      });
    }
  }
}
