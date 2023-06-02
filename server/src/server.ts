// @ts-ignore
import { ApolloServer } from "@apollo/server";
// @ts-ignore
import { expressMiddleware } from "@apollo/server/express4";
// @ts-ignore
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors, { CorsRequest } from "cors";
import express from "express";
import { readFileSync } from "fs";
import http from "http";

import { db } from "./db/index";
import { models } from "./db/models/index";
import { resolvers } from "./resolvers/index";
import { getToken } from "./utils/getToken";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const app = express();
app.disable("x-powered-by");

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

db.connect()
  .then(async () => {
    await server.start();

    app.use(
      "/graphql",
      cors<CorsRequest>(),
      // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
      bodyParser.json({ limit: "50mb" }),
      expressMiddleware(server, {
        // TODO: check this
        // @ts-ignore
        context: ({ req, res }) => {
          const token = req.headers.authorization;
          const user = getToken(token);
          return { models, user };
        }
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
  })
  .finally(() => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
