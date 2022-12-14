import { Resolvers } from "../../types";
import { processHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: async (
      _,
      { id, file, caption },
      { protectResolver, loggedInUser, client }
    ) => {
      protectResolver(loggedInUser);

      const oldPhoto = await client.photo.findFirst({
        where: { id, userId: loggedInUser.id },
        include: { hashtags: { select: { hashtag: true } } },
      });
      if (!oldPhoto) {
        return { ok: false, error: "Photo not found or this is not your post" };
      }
      await client.photo.update({
        where: { id },
        data: {
          caption,
          hashtags: {
            disconnect: oldPhoto.hashtags,
            ...(caption && { connectOrCreate: processHashtags(caption) }),
          },
        },
      });

      return { ok: true };
    },
  },
};

export default resolvers;
