import { gql } from "apollo-server";

export default gql`
  scalar Upload

  type EditProfileResponse {
    user: User
    ok: Boolean!
    error: String
  }
  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      password: String
      bio: String
      avatar: Upload
    ): EditProfileResponse
  }
`;
