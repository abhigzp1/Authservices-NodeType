import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { userResolvers } from "./graphql/resolvers/user.resolver";
import { connectDB } from "./config/database";
import { verifyToken } from "./utils/jwt";

export const startServer = async () => {
  await connectDB();
  const app = express();

  // CORS and JSON Middleware
  app.use(cors());
  app.use(json());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: userResolvers,
  });

  await server.start();

  // Apply Apollo Middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: express.Request }) => {
        const token = req.headers.authorization || "";
        try {
          const user = token ? verifyToken(token.replace("Bearer ", "")) : null;
          return { user };
        } catch {
          return {};
        }
      },
    })
  );

  return app;
};
