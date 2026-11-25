import { z } from 'zod';

export const authEmailSchema = z.email('Enter a valid email address.');

export const authPasswordSchema = z
  .string()
  .min(6, 'Password must contain at least 6 characters.');
