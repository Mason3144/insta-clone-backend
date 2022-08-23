import { gql } from "apollo-server-express";

export default gql`
  type EditPhotoResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    editPhoto(id: Int!, file: String, caption: String): EditPhotoResult!
  }
`;
