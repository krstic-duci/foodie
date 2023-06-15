import "reflect-metadata";

import http from "http";
import { resolve } from "path";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(cookieParser());

const init = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      authChecker: authMiddleware,
      emitSchemaFile: resolve(__dirname, "./schema.gql")
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" }
      })
    ],
    context: async ({ req, res }: CustomContext) => {
      return { req, res };
    }
  });

  await apolloServer.start();

  app.use((req: JWTRequest, res, next) => {
    const handleErrorNext = (err: string | UnauthorizedError) => {
      // TODO: do we need this if
      if (typeof err === "string") {
        return next();
      }
      if (
        err instanceof UnauthorizedError &&
        err.name === "UnauthorizedError"
      ) {
        return next();
      }
      next(err);
    };
    const middleware = expressjwt({
      secret: process.env.ACCESS_TOKEN_JWT_SECRET!,
      algorithms: ["HS256"],
      credentialsRequired: false
      // FIXME: How not to logout active users...?!?
      // onExpired: async (_, err) => {}
    });

    middleware(req, res, handleErrorNext);
  });

  // TODO: cors: false???
  apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" });

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
