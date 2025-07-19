import { z } from 'zod';

export const UserPermissionsSchema = z.object({
  canAccessEcommerce: z.boolean().default(false),
  canAccessEditorial: z.boolean().default(false),
  canPublishContent: z.boolean().default(false),
  isSuperAdmin: z.boolean().default(false),
});

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().url().optional(),
  permissions: UserPermissionsSchema,
}); 