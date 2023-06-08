import "reflect-metadata";

import http from "http";
import { resolve } from "path";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";

import { User } from "./src/entity/User";
import { UserResolver } from "./src/resolvers/user";

dotenv.config();

(async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "foodie",
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: []
  });

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );
  app.use(cookieParser());

  await AppDataSource.initialize();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      emitSchemaFile: resolve(__dirname, "./schema.gql")
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" });

  app.listen(4000, () => {
    console.log("Apollo server started - http://localhost:4000/graphql");
  });
})();
