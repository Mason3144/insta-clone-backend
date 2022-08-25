import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: async (
      _,
      { id },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      const comment = await client.comment.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!comment) {
        return { ok: false, error: "Comment not found" };
      } else if (comment.userId !== loggedInUser.id) {
        return { ok: false, error: "Not owner of the comment" };
      } else {
        await client.comment.delete({ where: { id } });
        return { ok: true };
      }
    },
  },
};

export default resolvers;
