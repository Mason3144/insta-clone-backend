import { withFilter } from "graphql-subscriptions";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { subscriptionResolver } from "../../types";

const resolvers: subscriptionResolver = {
  Subscription: {
    roomUpdates: {
      subscribe: async (_, { id }, { client, loggedInUser }) => {
        const room = await client.room.findFirst({
          where: { id, users: { some: { id: loggedInUser.id } } },
          select: { id: true },
        });
        if (!room) {
          throw new Error("Room not found");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: { id, users: { some: { id: loggedInUser.id } } },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }
          }
        )(_, { id }, { loggedInUser });
      },
    },
  },
};

export default resolvers;
