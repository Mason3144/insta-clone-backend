import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    followUser: async (
      _,
      { username },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      // check username existing
      const userExisting = await client.user.findUnique({
        where: { username },
      });
      if (!userExisting) return { ok: false, error: "User doesn't exist" };
      await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            connect: { username },
          },
        },
      });
      return { ok: true };
    },
  },
};

export default resolvers;
