import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFeed: (_, __, { client, protectResolver, loggedInUser }) => {
      protectResolver(loggedInUser);
      return client.photo.findMany({
        where: {
          OR: [
            { user: { followers: { some: { id: loggedInUser.id } } } },
            { userId: loggedInUser.id },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};

export default resolvers;
