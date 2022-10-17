"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolvers = {
    Query: {
        seeProfile: function (_, _a, _b) {
            var username = _a.username;
            var client = _b.client;
            return client.user.findUnique({
                where: { username: username },
                include: { followers: true, following: true },
            });
        },
    },
};
exports.default = resolvers;
