export const config = () => ({
  serverPort: process.env.PORT as unknown as number,

  // load database configurations
  database: {
    url: process.env.DATABASE_URL as unknown as string,
  },

  // load jwt configuration
  jwt: {
    secret: process.env.JWT_SECRET as unknown as string,
  },

  // load storage configuration
  storage: {
    bucket: process.env.BUCKET_NAME as unknown as string,
    region: process.env.REGION as unknown as string,
    accessKeyId: process.env.ACCESS_KEY_ID as unknown as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as unknown as string,
  },

  // load google oauth configurations
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as unknown as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as unknown as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as unknown as string,
    geminiApiKey: process.env.GEMINI_API_KEY as unknown as string,
  },

  // load webhook configuration
  webhook: {
    secret: process.env.WEBHOOK_SECRET as unknown as string,
  },

  //
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY as unknown as string,
    pemPublicKey: process.env.PEM_PUBLIC_KEY as unknown as string,
    url: process.env.CLERK_ISSUER_URL as unknown as string,
  },
});
