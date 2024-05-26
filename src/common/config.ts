export const config = () => ({
  serverPort: process.env.PORT as unknown as number,

  // load database configurations
  database: {
    url: process.env.DATABASE_URL as unknown as string,
  },

  // load storage configuration
  storage: {
    bucket: process.env.BUCKET_NAME as unknown as string,
    region: process.env.REGION as unknown as string,
    accessKeyId: process.env.ACCESS_KEY_ID as unknown as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as unknown as string,
  },
});
