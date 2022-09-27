import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: async (
      _,
      { id },
      { protectResolver, loggedInUser, client }
    ) => {
      protectResolver(loggedInUser);
      const photoExsist = await client.photo.count({ where: { id } });

      if (!photoExsist) {
        return { ok: false, error: "Photo not found" };
      }
      const like = await client.like.findUnique({
        where: { photoId: id },
        include: { user: { select: { id: true } } },
      });

      if (!like) {
        await client.like.create({
          data: {
            photoId: id,
            user: { connect: { id: loggedInUser.id } },
          },
        });
      } else {
        const user = like.user.find((user) => user.id === loggedInUser.id);
        if (!user) {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { likes: { connect: { id: like.id } } },
          });
        } else {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { likes: { disconnect: { id: like.id } } },
          });
          const likeCount = await client.user.count({
            where: { likes: { some: { id: like.id } } },
          });
          if (!likeCount) {
            await client.like.delete({ where: { id: like.id } });
          }
        }
      }
      return { ok: true };
    },
  },
};

export default resolvers;
