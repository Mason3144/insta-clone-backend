require("dotenv").config();
import { ApolloServer, ExpressContext } from "apollo-server-express";
import * as express from "express";
import schema from "./schema";
import { getLoggedinUser, protectResolver } from "./users/users.utils";
import client from "./client";
import { graphqlUploadExpress } from "graphql-upload";
import { createServer, Server } from "http";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import * as logger from "morgan";

const startServer = async (): Promise<void> => {
  const app = express();
  app.use(graphqlUploadExpress());
  // app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));

  const httpServer: Server = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);

  const apollo: ApolloServer<ExpressContext> = new ApolloServer({
    schema,

    context: async ({ req }) => {
      return {
        loggedInUser: await getLoggedinUser(req.headers.token),
        protectResolver,
        client: client,
      };
    },
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      // ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await apollo.start();

  apollo.applyMiddleware({ app });

  httpServer.listen(process.env.PORT, () =>
    console.log(
      `🚀 Server: http://localhost:${process.env.PORT}${apollo.graphqlPath}`
    )
  );

  // await new Promise<void>((func) => httpServer.listen({ port: PORT }, func));
  // console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
};
startServer();
