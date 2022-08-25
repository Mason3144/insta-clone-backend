import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    editComment: async (
      _,
      { id, payload },
      { protectResolver, loggedInUser, client }
    ) => {
      protectResolver(loggedInUser);
      const comment = await client.comment.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!comment) {
        return { ok: false, error: "Comment not found" };
      } else if (comment.userId !== loggedInUser.id) {
        return { ok: false, error: "Not the owner of the comment" };
      } else {
        await client.comment.update({ where: { id }, data: { payload } });
        return { ok: true };
      }
    },
  },
};

export default resolvers;
