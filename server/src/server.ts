// @ts-ignore
import { ApolloServer } from "@apollo/server";
// @ts-ignore
import { expressMiddleware } from "@apollo/server/express4";
// @ts-ignore
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import cors, { CorsRequest } from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { readFileSync } from "fs";
import http from "http";

import { db } from "./db/index";
import { resolvers } from "./resolvers/index";
import getUserFromToken from "./utils/getUserFromToken";

dotenv.config();

interface AppContext {
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    firstName: string;
  };
}

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const app = express();
app.disable("x-powered-by");

const httpServer = http.createServer(app);

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

const corsOptions = {};

const startApolloServer = async () => {
  await db.connect();

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({
      credentials: true,
      origin: "http://localhost:4000/graphql"
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res })
      // context: async ({ req, res }) => {
      //   console.log(req.headers);
      //   const user = getUserFromToken(req.headers.authorization || "");
      //   console.log(user)

      //   return { req, res };
      // }
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server ready at http://localhost:4000/graphql`);
};

startApolloServer();
