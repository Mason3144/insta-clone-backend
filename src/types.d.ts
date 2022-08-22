import { PrismaClient, User } from "@prisma/client";

type Context = {
  loggedInUser?: User;
  protectResolver?: any;
  client: PrismaClient;
};

export type args = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar: any;
  page: number;
  lastId: number;
  keyword: string;
};

export type Resolver = (
  root: any,
  args: args,
  context: Context,
  info: any
) => any;

export type Resolvers = {
  [key: string]: { [key: string]: Resolver };
};
