import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors, { CorsRequest } from "cors";
import express from "express";
import { readFileSync } from "fs";
import http from "http";

// FIXME: What ?!?
import { db } from "./db/index.js";
import { resolvers } from "./resolvers/index.js";

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
      // expressMiddleware accepts the same arguments:
      // an Apollo Server instance and optional configuration options
      expressMiddleware(server, {
        // TODO: check this
        context: async ({ req }) => ({ token: req.headers.token })
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
  })
  .finally(() => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
