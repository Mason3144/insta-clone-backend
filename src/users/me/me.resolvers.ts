import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    me: async (_, __, { client, protectResolver, loggedInUser }) => {
      protectResolver(loggedInUser);
      return client.user.findUnique({
        where: { id: loggedInUser.id },
      });
    },
  },
};

export default resolvers;
