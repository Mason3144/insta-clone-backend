import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
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
        room = await client.room.create({
          data: {
            users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
          },
        });
      } else if (roomId) {
        room = await client.room.findUnique({
          where: {
            id: roomId,
          },
          select: { id: true },
        });
        if (!room) {
          return { ok: false, error: "the Room not found" };
        }
      }
      const message = await client.message.create({
        data: {
          payload,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
      return { ok: true, id: message.id };
    },
  },
};

export default resolvers;
