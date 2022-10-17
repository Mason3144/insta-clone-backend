"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolvers = {
    Query: {
        seeFeed: function (_, _a, _b) {
            var offset = _a.offset;
            var client = _b.client, protectResolver = _b.protectResolver, loggedInUser = _b.loggedInUser;
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
exports.default = resolvers;
