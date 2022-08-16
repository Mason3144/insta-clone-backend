require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { typeDefs, resolvers } from "./schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getLoggedinUser, protectResolver } from "./users/users.utils";
import client from "./client";
import { graphqlUploadExpress } from "graphql-upload";
import * as logger from "morgan";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getLoggedinUser(req.headers.token),
        protectResolver,
        client: client,
      };
    },
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(logger("tiny"));
  server.applyMiddleware({ app });

  await new Promise<void>((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
};
startServer();
