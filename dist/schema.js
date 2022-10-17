"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var load_files_1 = require("@graphql-tools/load-files");
var merge_1 = require("@graphql-tools/merge");
var schema_1 = require("@graphql-tools/schema");
var typeDefsArray = (0, load_files_1.loadFilesSync)("".concat(__dirname, "/**/*.typeDefs.{js,ts}"));
var resolversArray = (0, load_files_1.loadFilesSync)("".concat(__dirname, "/**/*.resolvers.{js,ts}"));
var mergedTypeDefs = (0, merge_1.mergeTypeDefs)(typeDefsArray);
var mergedResolvers = (0, merge_1.mergeResolvers)(resolversArray);
var schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
});
exports.default = schema;
