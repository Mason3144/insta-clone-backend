import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { processHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: async (
      _,
      { file, caption },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      const fileUrl = await uploadToS3(file, loggedInUser.id, "photos");
      return client.photo.create({
        data: {
          file: fileUrl,
          caption,
          hashtags: {
            ...(caption && { connectOrCreate: processHashtags(caption) }),
          },
          user: {
            connect: {
              id: loggedInUser.id,
              /// one to one or one to many relation must connect
            },
          },
        },
      });
    },
  },
};

export default resolvers;
