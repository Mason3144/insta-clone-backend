import { PrismaClient, User } from "@prisma/client";
import { StringValueNode } from "graphql";

type Context = {
  loggedInUser?: User;
  protectResolver?: any;
  client: PrismaClient;
};

type Args = {
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
  file: any;
  caption: string;
  id: number;
  photoId: number;
  hashtag: string;
  payload: string;
};

type Root = {
  id: number;
  userId: number;
};

type Resolver = (root: Root, args: Args, context: Context, info: any) => any;

export type Resolvers = {
  [key: string]: { [key: string]: Resolver };
};
