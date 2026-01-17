import { z } from 'zod';

export type SignUserSchemaType = {
  email: z.ZodString
  password: z.ZodString
}

export type CategorySchemaType = {
  name: z.ZodString
}

export type PostSchemaType = {
  title: z.ZodString
  content: z.ZodString
  thumbnailImageKey: z.ZodString
  categoryIds: z.ZodArray<z.ZodNumber>
}
