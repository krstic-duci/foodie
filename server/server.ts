import "reflect-metadata";

import http from "http";
import { resolve } from "path";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { NextFunction, Response } from "express";
import {
  expressjwt,
  Request as JWTRequest,
  UnauthorizedError
} from "express-jwt";
import { buildSchema } from "type-graphql";

import { resolvers } from "@resolvers/index";
import { authMiddleware } from "@middleware/auth";
import AppDataSource from "@utils/appDataSource";
import type { CustomContext } from "@utils/types";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
app.disable("x-powered-by");
app.use(cookieParser());
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true
  })
);

app.use(
  expressjwt({
    secret: process.env.ACCESS_TOKEN_JWT_SECRET!,
    algorithms: ["HS256"],
    credentialsRequired: false
    // FIXME: How to handle
    // onExpired: async (_req, err) => {
    //   // @ts-expect-error
    //   if (new Date() - err.inner.expiredAt < 5000) {
    //     return;
    //   }
    //   throw err;
    // }
  }),
  (
    err: UnauthorizedError,
    _req: JWTRequest,
    _res: Response,
    next: NextFunction
  ) => {
    // TODO: move to constant
    if (err.code === "invalid_token") return next();
    return next(err);
  }
);

const init = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      authChecker: authMiddleware,
      emitSchemaFile: resolve(__dirname, "./schema.gql")
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }: CustomContext) => {
      return { req, res };
    }
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: apolloServer.graphqlPath });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(
    `Apollo server ready =>  http://localhost:4000${apolloServer.graphqlPath}`
  );

  await AppDataSource.initialize();
  console.log("Connected to Postgres");
};

init();
