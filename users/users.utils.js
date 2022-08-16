import jwt from "jsonwebtoken";
import client from "../client";

export const getLoggedinUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const protectResolver = (user) => {
  if (!user) {
    throw new Error("Please login first.");
  }
};