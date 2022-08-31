import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: async (
      _,
      { id },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      const message = await client.message.findFirst({
        where: {
          id,
          userId: { not: loggedInUser.id },
          room: { users: { some: { id: loggedInUser.id } } },
        },
        select: { id: true },
      });
      if (!message) {
        return { ok: false, error: "Message not found" };
      }
      await client.message.update({ where: { id }, data: { read: true } });
      return { ok: true };
    },
  },
};

export default resolvers;
