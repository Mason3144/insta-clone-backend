import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: async (
      _,
      {
        firstName,
        lastName,
        username,
        email,
        password: newPassword,
        bio,
        avatar,
      },
      { loggedInUser, protectResolver, client }
    ) => {
      const {
        file: { filename, createReadStream },
      } = await avatar;
      const readStream = createReadStream();
      const writeStream = createWriteStream(
        process.cwd() + "/uploads/" + filename
      );
      readStream.pipe(writeStream);
      try {
        protectResolver(loggedInUser);
        if (!loggedInUser) {
          return { ok: false, error: "Please login first" };
        }
        let hash = null;
        if (newPassword) {
          hash = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(hash && { password: hash }), //if "hash" exsists password is "hash"
          },
        });
        if (!updatedUser.id) {
          return { ok: false, error: "Could not update" };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
  },
};

export default resolvers;
