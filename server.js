require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema.js";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getLoggedinUser, protectResolver } from "./users/users.utils.js";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getLoggedinUser(req.headers.token),
      protectResolver,
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
