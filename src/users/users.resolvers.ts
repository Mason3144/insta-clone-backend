import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({
        where: { followers: { some: { id } } },
      }),

    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: { following: { some: { id } } },
      }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, {}, { client, loggedInUser }) => {
      if (!loggedInUser) return false;
      const isFollow = await client.user.count({
        where: { username: loggedInUser.username, following: { some: { id } } },
        // DB에서 loggedInUser.username를 찾고 그 username의 following안에서 id를 찾는다면 리턴함
      });
      return Boolean(isFollow);
    },
    photos: async ({ id }, { lastId }) => {
      return client.user.findUnique({ where: { id } }).photos({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
    },
  },
};

export default resolvers;
