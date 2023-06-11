import "reflect-metadata";

import http from "http";
import { resolve } from "path";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { buildSchema } from "type-graphql";

import { UserResolver } from "./src/resolvers/user";
import AppDataSource from "./src/utils/appDataSource";

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
  await AppDataSource.initialize();
  console.log("Connected to Postgres");

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      emitSchemaFile: resolve(__dirname, "./schema.gql")
    }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ],
    context: ({ req, res }) => ({ req, res })
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
};

init();
