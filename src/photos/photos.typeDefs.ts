import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    likes: Int!
    comments: Int!
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
    isMine: Boolean!
  }
  # relation field or whatever can be exposed with computed field  ex) user,hashtags
  type File {
    id: Int!
    url: String!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(lastId: Int): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
    users: [User]!
  }
`;
