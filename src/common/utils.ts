import { AuthJWTPayload } from '~/core/models/auth.model';
import { Request } from 'express';

/**
 * Generates a unique key for a file based on the provided category and key.
 *
 * @param category - The category to include in the unique key.
 * @param key - The key to include in the unique key.
 * @returns A unique key string in the format `${category}-${Date.now()}-${key}`.
 */
export const uniqueKeyFile = (category: string, key: string): string => {
  return `${category}-${Date.now()}-${key}`;
};

/**
 * Extends the Express Request interface to include a `user` property of type `AuthJWTPayload`.
 * This is useful for accessing the authenticated user's information in request handlers.
 */
export interface RequestWithUser extends Request {
  user: AuthJWTPayload;
}
