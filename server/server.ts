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
import { buildSchema } from "type-graphql";
import { Context } from "types";

import { User } from "./src/entity/User";
import { authChecker } from "./src/middleware/auth";
import { UserResolver } from "./src/resolvers/user";
import AppDataSource from "./src/utils/appDataSource";
import { verifyAccessToken, verifyRefreshToken } from "./src/utils/jwtTokens";

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
      resolvers: [UserResolver],
      authChecker,
      emitSchemaFile: resolve(__dirname, "./schema.gql")
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "same-origin" }
      })
    ],
    context: async ({ req, res, user }: Context) => {
      const accessToken = req.cookies["x-access-token"];
      const refreshToken = req.cookies["x-refresh-token"];

      if (accessToken) {
        const currentUser = verifyAccessToken<User>(accessToken);
        user = currentUser;
      }

      return { req, res, user };
      // 1. check if either access token and refresh token is valid, if not
      // deny access to private query/mutation/subscription

      // 2. if refresh token is valid, but access token isn't re-send the cookies

      // 3. all good, user can have access
    }
  });

  await apolloServer.start();
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
