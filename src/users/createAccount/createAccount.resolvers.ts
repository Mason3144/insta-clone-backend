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
        if (existingUser && existingUser.username === username) {
          return { ok: false, error: "Username already taken." };
        }
        if (existingUser && existingUser.email === email) {
          return { ok: false, error: "Email already taken." };
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
