import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });

        if (username.length < 3) {
          if (existingUser && existingUser.username === username) {
            return { ok: false, error: "Username already taken." };
          }
          return {
            ok: false,
            error: "Username must be more than 2 characters",
          };
        }

        if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
          if (existingUser && existingUser.email === email) {
            return { ok: false, error: "Email already taken." };
          }
          return { ok: false, error: "Wrong email address" };
        }

        if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(password)) {
          return {
            ok: false,
            error:
              "Password must be more than 7 characters, at least one letter and one number",
          };
        }
        const hash = await bcrypt.hash(password, 10);
        const newUser = await client.user.create({
          data: { firstName, lastName, username, email, password: hash },
        });
        await client.user.update({
          where: { username: "master" },
          data: {
            following: {
              connect: { username: newUser.username },
            },
            followers: {
              connect: { username: newUser.username },
            },
          },
        });
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
  },
};

export default resolvers;
