import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    isMine: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};

export default resolvers;
