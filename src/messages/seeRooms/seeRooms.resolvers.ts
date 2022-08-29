import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeRooms: async (_, __, { loggedInUser, client, protectResolver }) => {
      protectResolver(loggedInUser);
      return client.room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
      });
    },
  },
};

export default resolvers;
