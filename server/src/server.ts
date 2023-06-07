import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { resolve } from "path";
import http from "http";
// @ts-expect-error
import { ApolloServer } from "@apollo/server";
// @ts-expect-error
import { expressMiddleware } from "@apollo/server/express4";
// @ts-expect-error
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { json } from "body-parser";
import cors, { CorsRequest } from "cors";
import { buildSchema } from "type-graphql";

import { db } from "./db/index";
import { UserResolver } from "./resolvers/UserResolver";

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  await db.connect();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      emitSchemaFile: resolve(__dirname, "../schema.gql"),
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({ origin: "*", credentials: true }),
    json(),
    expressMiddleware(server)
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server ready at http://localhost:4000/graphql`);
})();
