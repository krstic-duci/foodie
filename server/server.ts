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
import express from "express";
import { buildSchema } from "type-graphql";

import { resolvers } from "@resolvers/index";
import { AuthMiddleware } from "@middleware/auth";
import DataBase from "@utils/database";
import type { CustomContext } from "@utils/types";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
app.use(cookieParser());
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true
  })
);

const init = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      authChecker: AuthMiddleware,
      emitSchemaFile: resolve(__dirname, "./schema.gql"),
      validate: true
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" }
      })
    ],
    context: async ({ req, res }: CustomContext) => ({ req, res })
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: apolloServer.graphqlPath
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(
    `Apollo server ready =>  http://localhost:4000${apolloServer.graphqlPath}`
  );

  await DataBase.initialize();
  // await DataBase.dropDatabase();
  console.log("Connected to Postgres");
};

init();
