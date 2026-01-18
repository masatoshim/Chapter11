import { z } from 'zod';

export type ContactUserSchemaType = {
  name: z.ZodString
  email: z.ZodString
  message: z.ZodString
}