import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFeed: (_, { offset }, { client, protectResolver, loggedInUser }) => {
      protectResolver(loggedInUser);
      return client.photo.findMany({
        take: 3,
        skip: offset,
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
