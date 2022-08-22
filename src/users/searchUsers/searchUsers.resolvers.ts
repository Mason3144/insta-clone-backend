import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword, lastId }, { client }) => {
      return client.user.findMany({
        where: {
          OR: [
            { username: { startsWith: keyword.toLowerCase() } },
            { username: { contains: keyword.toLowerCase() } },
          ],
        },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
    },
  },
};

export default resolvers;
