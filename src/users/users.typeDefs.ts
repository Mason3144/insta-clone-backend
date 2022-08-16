import { gql } from "apollo-server";

export default gql`
  # type Result {
  #   ok: Boolean!
  #   error: String
  # }

  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    bio: String
    avatar: String
  }
`;
