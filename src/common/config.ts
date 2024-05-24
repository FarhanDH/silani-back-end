export const config = () => ({
  serverPort: process.env.PORT as unknown as number,

  // load database configurations
  database: {
    url: process.env.DATABASE_URL as unknown as string,
  },
});
