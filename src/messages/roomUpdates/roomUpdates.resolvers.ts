import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: () => pubsub.asyncIterator([NEW_MESSAGE]),
    },
  },
};
