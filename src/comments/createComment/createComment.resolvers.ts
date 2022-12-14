import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createComment: async (
      _,
      { photoId, payload },
      { protectResolver, loggedInUser, client }
    ) => {
      protectResolver(loggedInUser);
      const ok = await client.photo.count({ where: { id: photoId } });
      if (!ok) {
        return { ok: false, error: "Photo Not Found" };
      }

      const newComment = await client.comment.create({
        data: {
          payload,
          photo: { connect: { id: photoId } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      return { ok: true, id: newComment.id };
    },
  },
};

export default resolvers;
