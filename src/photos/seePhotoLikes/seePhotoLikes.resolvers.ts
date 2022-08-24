import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { id }, { client }) =>
      client.like.findUnique({ where: { photoId: id } }).user({
        select: {
          id: true,
          avatar: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      }),
  },
};

export default resolvers;
