import { uploadFile } from "../../shared/shared.utils";
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
      const post = await client.photo.update({
        where: { id },
        data: {
          caption,
          hashtags: {
            disconnect: oldPhoto.hashtags,
            ...(caption && { connectOrCreate: processHashtags(caption) }),
          },
        },
      });
      if (file) {
        await Promise.all([uploadFile(file, loggedInUser.id, post.id)]);
        //Array 데이터를 받을때 Promise.all을 사용하여
        //모든 데이터를 받고 넘어갈수있도록 동기식 처리해주어야함
      }

      return { ok: true };
    },
  },
};

export default resolvers;
