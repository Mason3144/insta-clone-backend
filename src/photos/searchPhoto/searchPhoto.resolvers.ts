import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhoto: async (_, { keyword, lastId }, { client }) => {
      return client.photo.findMany({
        where: {
          OR: [
            { caption: { startsWith: keyword.toLowerCase() } },
            { caption: { contains: keyword.toLowerCase() } },
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
