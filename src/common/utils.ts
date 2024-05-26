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
