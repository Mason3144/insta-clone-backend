import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      console.log(username);
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
        return client.user.create({
          data: { firstName, lastName, username, email, password: hash },
        });
      } catch (e) {
        return e;
      }
    },
  },
};
