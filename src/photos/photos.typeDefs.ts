import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
  }
  # relation field or whatever can be exposed with computed field  ex) user,hashtags

  type Hashtag {
    id: Int!
    hashtag: String!
    photo: [Photo]
    createdAt: String!
    updatedAt: String!
  }
`;
