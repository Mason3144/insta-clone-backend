import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createRoom: async (
      _,
      { userId },
      { client, loggedInUser, protectResolver }
    ) => {
      try {
        protectResolver(loggedInUser);
        const checkRoom = await client.room.findFirst({
          where: {
            AND: [
              { users: { some: { id: userId } } },
              { users: { some: { id: loggedInUser.id } } },
            ],
          },
        });
        if (checkRoom) {
          return { ok: true, id: checkRoom.id };
        }
        const room = await client.room.create({
          data: {
            users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
          },
        });
        return { ok: true, id: room.id };
      } catch (error) {
        return { ok: false, error };
      }
    },
  },
};

export default resolvers;
