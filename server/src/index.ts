import * as dotenv from "dotenv";
// @ts-ignore
import { ApolloServer } from "@apollo/server";
// @ts-ignore
import { expressMiddleware } from "@apollo/server/express4";
// @ts-ignore
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { log } from "console";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import http from "http";
import { Jwt, JwtPayload, verify } from "jsonwebtoken";

import { db } from "./db/index";
import User from "./db/models/user";
// import { models } from "./db/models/index";
import { resolvers } from "./resolvers/index";
import { createTokens } from "./utils/createTokens";

dotenv.config();

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

const startApolloServer = async () => {
  await db.connect();

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await apolloServer.start();

  // FIXME: this needs to go into separate fnc
  app.use(async (req: any, res, next) => {
    const refreshToken = req.cookies["refresh-token"];
    const accessToken = req.cookies["access-token"];
    if (!refreshToken && !accessToken) {
      return next();
    }

    try {
      const data = verify(
        accessToken,
        process.env.ACCESS_TOKEN_JWT_SECRET!
      ) as any;
      req.userId = data.userId;
      return next();
    } catch {}

    if (!refreshToken) {
      return next();
    }

    let data: { userId: any; count: number };

    try {
      data = verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET!) as any;
    } catch {
      return next();
    }

    const user = await User.findById(data.userId);
    console.log(user, "USER");
    console.log(data, "DATA");
    // token has been invalidated
    console.log(user?.count, "USER COUNT");
    console.log(data.count, "DATA COUNT");
    console.log(!user || user.count !== data.count);
    if (!user || user.count !== data.count) {
      return next();
    }

    const tokens = createTokens(user);

    res.cookie("refresh-token", tokens.refreshToken);
    res.cookie("access-token", tokens.accessToken);
    req.userId = user.id;

    next();
  });

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res })
    })
  );

  httpServer.listen(4000, "localhost", () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
};

startApolloServer();
