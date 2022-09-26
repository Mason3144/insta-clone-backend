import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import client from "../client";

export const getLoggedinUser = async (token: string | unknown) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    if (!id) {
      return null;
    }
    const user = await client.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
};

export const protectResolver = (user: User) => {
  if (!user) {
    throw new Error("Token doesn't exist");
  }
};
