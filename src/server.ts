require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getLoggedinUser, protectResolver } from "./users/users.utils";
import client from "./client";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getLoggedinUser(req.headers.token),
      protectResolver,
      client: client,
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
