"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../client");
var resolvers = {
    Room: {
        users: function (_a, _, _b) {
            var id = _a.id;
            var client = _b.client;
            return client.room.findUnique({ where: { id: id } }).users();
        },
        messages: function (_a) {
            var id = _a.id;
            return client_1.default.message.findMany({
                where: { roomId: id },
            });
        },
        unreadTotal: function (_a, _, _b) {
            var id = _a.id;
            var client = _b.client, loggedInUser = _b.loggedInUser;
            if (!loggedInUser) {
                return 0;
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: { id: { not: loggedInUser.id } },
                },
            });
        },
    },
    Message: {
        user: function (_a, _, _b) {
            var id = _a.id;
            var client = _b.client;
            return client.message.findUnique({ where: { id: id } }).user();
        },
    },
};
exports.default = resolvers;
