import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const PORT = process.env.PORT;

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
      try {
        protectResolver(loggedInUser);
        let avatarUrl = null;
        if (avatar) {
          const {
            file: { filename, createReadStream },
          } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
            .toLowerCase()
            .replace(/\s+/g, "");
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:${PORT}/static/${newFilename}`;
          // This is temporary, file will be saved in AWS soon
          // add a feature of automatically deleting previous photoes
        }

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
            ...(avatarUrl && { avatar: avatarUrl }),
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
