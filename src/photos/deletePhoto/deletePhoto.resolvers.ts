import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: async (
      _,
      { id },
      { loggedInUser, client, protectResolver }
    ) => {
      protectResolver(loggedInUser);
      const photo = await client.photo.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!photo) {
        return { ok: false, error: "Photo Not Found" };
      } else if (photo.userId !== loggedInUser.id) {
        return { ok: false, error: "You are not the owner of the photo" };
      } else {
        await client.photo.delete({ where: { id } });
        return { ok: true };
      }
    },
  },
};

export default resolvers;
