import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";
import { uploadToS3 } from "../../shared/shared.utils";

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
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
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
