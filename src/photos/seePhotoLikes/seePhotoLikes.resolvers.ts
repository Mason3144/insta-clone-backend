import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { id }, { client }) =>
      client.like.findUnique({ where: { photoId: id } }).user(),
  },
};

export default resolvers;
