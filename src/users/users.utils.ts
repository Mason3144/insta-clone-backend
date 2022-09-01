import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import client from "../client";

export const getLoggedinUser = async (token: string | unknown) => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const protectResolver = (user: User) => {
  if (!user) {
    throw new Error("Please login first.");
  }
};
