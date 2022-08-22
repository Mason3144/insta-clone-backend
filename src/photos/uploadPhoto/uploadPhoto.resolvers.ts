import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: async (
      _,
      { file, caption },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      let hashtagObjs = [];
      if (caption) {
        const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
        hashtagObjs = hashtags.map((hashtag) => ({
          where: { hashtag },
          create: { hashtag },
        }));
      }
      return await client.photo.create({
        include: { hashtags: true, user: true },
        data: {
          file,
          caption,
          user: {
            connect: {
              id: loggedInUser.id,
              /// relation must connect
            },
          },
          ...(hashtagObjs.length > 0 && {
            hashtags: {
              connectOrCreate: hashtagObjs,
            },
          }),
        },
      });
    },
  },
};

export default resolvers;
