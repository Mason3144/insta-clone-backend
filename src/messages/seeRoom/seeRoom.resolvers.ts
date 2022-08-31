import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeRoom: async (_, { id }, { loggedInUser, protectResolver, client }) => {
      protectResolver(loggedInUser);
      return client.room.findFirst({
        where: { id, users: { some: { id: loggedInUser.id } } },
      });
    },
  },
};

export default resolvers;
