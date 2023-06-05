declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USERNAME: string;
      DB_PASSWORD: string;
      ACCESS_TOKEN_JWT_SECRET: string;
      REFRESH_TOKEN_JWT_SECRET: string;
    }
  }
}
export {};
