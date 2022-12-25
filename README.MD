## GraphQL을 이용한 인스타그램 클론 코딩(Backend)

### Server

- Node.js, Typescript
- Apollo server express, GraphQL
- AWS-S3
- Websocket (Graphql subscription)

### DB

- Postgres
- Prisma ORM

### 배포

- Heroku

### Frontend

- https://github.com/Mason3144/insta-clone-native

## 진행현황

### User:

- [x] Create Account
- [x] See Profile
- [x] Login
- [x] Edit Profile
- [x] Change Avatar (Image Upload)
- [x] Follow User
- [x] Unfollow User
- [x] SeeFollowers and See Following with Pagination
- [x] Computed Fields
- [x] Search Users

### Photos

- [x] Upload Photo (Parse #)
- [x] See Photo
- [x] See Hashtags
- [x] Search Photos
- [x] Edit Photo
- [x] Like / Unlike Photo
- [x] See Photo Likes
- [x] See Feed
- [x] See Photo Comments
- [x] Is Mine (on photo)
- [x] Delete photo
- [x] Multi file upload (https://gqlgen.com/reference/file-upload/)
- [x] Multi file delete (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property)

### Comments

- [x] Comment on Photo
- [x] Is Mine (on comment)
- [x] Delete comment
- [x] Edit Comment

### Refactor

- [x] Mutation Responses

### Extras

- [x] S3 Image Upload
- [x] S3 Delete Image Uploaded

### DMs

- [x] See Rooms
- [x] Send Message (Create Room)
- [x] See Room
- [x] Computed Field
- [x] See Message
- [x] Realtime Messages
