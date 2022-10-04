import { PrismaClient, User } from "@prisma/client";
import { NumericVersion } from "aws-sdk/clients/inspector";
import { StringValueNode } from "graphql";

type UploadFile = (file: File, userId: number, postId: number) => any;
type File = [{ file: { filename: string } }];

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
  roomId: number;
  userId: number;
  offset: number;
};

type Root = {
  id: number;
  userId: number;
};

type Resolver = (root: Root, args: Args, context: Context, info: any) => any;

export type Resolvers = {
  [key: string]: { [key: string]: Resolver };
};

export type subscriptionResolver = {
  [key: string]: { [key: string]: { [key: string]: Resolver } };
};
