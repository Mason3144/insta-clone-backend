import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async ({ userId }) =>
      client.user.findUnique({ where: { id: userId } }),

    hashtags: async ({ id }) =>
      client.hashtag.findMany({
        where: { photos: { some: { id } } },
      }),
    likes: async ({ id }) =>
      client.user.count({ where: { likes: { some: { photoId: id } } } }),
    commentNumber: async ({ id }) =>
      client.comment.count({ where: { photoId: id } }),
    comments: async ({ id }) =>
      client.photo
        .findUnique({ where: { id } })
        .comment({ include: { user: true } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return client.like.count({
        where: { photoId: id, user: { some: { id: loggedInUser.id } } },
      });
    },
  },

  Hashtag: {
    photos: async ({ id }, { lastId }) =>
      client.photo.findMany({
        where: { hashtags: { some: { id } } },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),

    totalPhotos: async ({ id }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};

export default resolvers;
