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
          throw new Error("Username already taken.");
        }
        if (existingUser && existingUser.email === email) {
          throw new Error("Email already taken.");
        }
        const hash = await bcrypt.hash(password, 10);
        await client.user.create({
          data: { firstName, lastName, username, email, password: hash },
        });
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
  },
};

export default resolvers;