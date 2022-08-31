import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: async (
      _,
      { payload, roomId, userId },
      { loggedInUser, protectResolver, client }
    ) => {
      protectResolver(loggedInUser);
      let room = null;
      if (userId) {
        const user = await client.user.count({
          where: {
            id: userId,
          },
        });
        if (!user) {
          return { ok: false, error: "the User not found" };
        }
        const newRoom = await client.room.create({
          data: {
            users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
          },
        });
        room = await client.message.create({
          data: {
            payload,
            room: { connect: { id: newRoom.id } },
            user: { connect: { id: loggedInUser.id } },
          },
        });
      } else if (roomId) {
        room = await client.room.count({
          where: {
            id: roomId,
          },
        });
        if (!room) {
          return { ok: false, error: "the Room not found" };
        }
      }
      await client.message.create({
        data: {
          payload,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      return { ok: true };
    },
  },
};

export default resolvers;