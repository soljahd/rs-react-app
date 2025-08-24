import { z } from 'zod';

export const formSchema = z
  .object({
    name: z.string().regex(/^[A-Z][a-zA-Z]*$/, 'Name must start with uppercase'),
    age: z
      .string()
      .regex(/^\d+$/, 'Age must be a number')
      .refine((age) => Number(age) > 0, 'Age must be non-negative')
      .refine((age) => Number(age) < 150, 'Age must be reasonable'),
    email: z.email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .regex(/[A-Z]/, 'At least 1 uppercase')
      .regex(/[a-z]/, 'At least 1 lowercase')
      .regex(/[0-9]/, 'At least 1 number')
      .regex(/[^a-zA-Z0-9]/, 'At least 1 special character'),
    confirmPassword: z.string().min(1, 'Please repeat password'),
    gender: z.enum(['male', 'female']),
    country: z.string().min(1, 'Country is required'),
    terms: z.boolean().refine((val) => val, {
      message: 'You must accept T&C',
    }),
    image: z.string().refine((val) => !val || val.length > 0, {
      message: 'Please provide a valid image',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }
  });

export type FormSchema = z.infer<typeof formSchema>;
