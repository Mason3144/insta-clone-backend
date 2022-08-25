import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { photoId, lastId }, { client }) => {
      return client.comment.findMany({
        where: { photoId },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: { createdAt: "desc" },
      });
    },
  },
};

export default resolvers;
