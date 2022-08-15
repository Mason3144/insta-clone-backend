import bcrypt from "bcrypt";
import client from "../client";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser.username === username) {
          throw new Error("Username already taken.");
        }
        if (existingUser.email === email) {
          throw new Error("Email already taken.");
        }
        const hash = await bcrypt.hash(password, 10);
        return client.user.create({
          data: { firstName, lastName, username, email, password: hash },
        });
      } catch (e) {
        return e;
      }
    },
    login: async (_, { username, password }) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: "User not found." };
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return { ok: false, error: "Incorrect password." };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return { ok: true, token };
    },
  },
};
