"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var apollo_server_express_1 = require("apollo-server-express");
var express = require("express");
var schema_1 = require("./schema");
var users_utils_1 = require("./users/users.utils");
var client_1 = require("./client");
var graphql_upload_1 = require("graphql-upload");
var http_1 = require("http");
var apollo_server_core_1 = require("apollo-server-core");
var ws_1 = require("ws");
var ws_2 = require("graphql-ws/lib/use/ws");
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, httpServer, wsServer, serverCleanup, apollo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express();
                app.use((0, graphql_upload_1.graphqlUploadExpress)());
                // app.use(logger("tiny"));
                app.use("/static", express.static("uploads"));
                httpServer = (0, http_1.createServer)(app);
                wsServer = new ws_1.WebSocketServer({
                    server: httpServer,
                    path: "/graphql",
                });
                serverCleanup = (0, ws_2.useServer)({
                    schema: schema_1.default,
                    context: function (_a) {
                        var connectionParams = _a.connectionParams;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = {};
                                        return [4 /*yield*/, (0, users_utils_1.getLoggedinUser)(connectionParams.token)];
                                    case 1: return [2 /*return*/, (_b.loggedInUser = _c.sent(),
                                            _b.protectResolver = users_utils_1.protectResolver,
                                            _b.client = client_1.default,
                                            _b)];
                                }
                            });
                        });
                    },
                }, wsServer);
                apollo = new apollo_server_express_1.ApolloServer({
                    schema: schema_1.default,
                    context: function (_a) {
                        var req = _a.req;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = {};
                                        return [4 /*yield*/, (0, users_utils_1.getLoggedinUser)(req.headers.token)];
                                    case 1: return [2 /*return*/, (_b.loggedInUser = _c.sent(),
                                            _b.protectResolver = users_utils_1.protectResolver,
                                            _b.client = client_1.default,
                                            _b)];
                                }
                            });
                        });
                    },
                    csrfPrevention: true,
                    cache: "bounded",
                    plugins: [
                        (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer: httpServer }),
                        {
                            serverWillStart: function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, {
                                                drainServer: function () {
                                                    return __awaiter(this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, serverCleanup.dispose()];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    });
                                                },
                                            }];
                                    });
                                });
                            },
                        },
                        (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
                        // ApolloServerPluginLandingPageGraphQLPlayground(),
                    ],
                });
                return [4 /*yield*/, apollo.start()];
            case 1:
                _a.sent();
                apollo.applyMiddleware({ app: app });
                httpServer.listen(process.env.PORT, function () {
                    return console.log("\uD83D\uDE80 Server: http://localhost:".concat(process.env.PORT).concat(apollo.graphqlPath));
                });
                return [2 /*return*/];
        }
    });
}); };
startServer();
