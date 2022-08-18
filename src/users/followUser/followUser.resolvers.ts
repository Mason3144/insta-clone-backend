import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    followUser: async (
      _,
      { username },
      { loggedInUser, protectResolver, client }
    ) => {
      try {
        protectResolver(loggedInUser);
        const userExisting = await client.user.findUnique({
          where: { username },
        });
        if (!userExisting) return { ok: false, error: "User doesn't exist" };
        if (username === loggedInUser.username)
          return { ok: false, error: "Cannot follow yourself" };

        const isFollow = await client.user.findFirst({
          where: { following: { some: { username } } },
        });
        if (isFollow) {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { disconnect: { username } } },
          });
          console.log(`${loggedInUser.username} is Unfollowing ${username}`);
        } else {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              following: {
                connect: { username },
              },
            },
          });
          console.log(`${loggedInUser.username} is Following ${username}`);
        }
        return { ok: true };
      } catch (error) {
        return { ok: true, error };
      }
    },
  },
};

export default resolvers;
