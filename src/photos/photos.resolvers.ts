import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async ({ userId }) =>
      client.user.findUnique({ where: { id: userId } }),

    hashtags: async ({ id }) =>
      client.hashtag.findMany({
        where: { photos: { some: { id } } },
      }),
  },
};

export default resolvers;
