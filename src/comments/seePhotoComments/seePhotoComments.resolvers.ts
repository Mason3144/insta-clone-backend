import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { photoId, offset }, { client }) => {
      return client.comment.findMany({
        where: { photoId:photoId },
        take: 10,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
    },
  },
};

export default resolvers;
