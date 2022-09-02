import * as AWS from "aws-sdk";
import client from "../client";
import { UploadFile } from "../types";

const Bucket = "insta-clone-2022";

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const uploadFile: UploadFile = async (file, userId, postId) => {
  const fileUrl = await uploadToS3(file, userId, "photos");
  await fileUrl.map(async (eachUrl: string) => {
    const url = await eachUrl;
    await client.file.create({
      data: {
        url,
        user: { connect: { id: userId } },
        photo: { connect: { id: postId } },
      },
    });
  });
};

export const uploadToS3 = async (
  files: any,
  userId: number,
  folderName: string
) =>
  files.map(async ({ file }) => {
    const { filename, createReadStream } = file;
    const readStream = createReadStream();
    const objName = `${folderName}/${userId}-${Date.now()}-${filename
      .toLowerCase()
      .replace(/\s+/g, "")}`;
    const { Location } = await new AWS.S3()
      .upload({
        Bucket,
        Key: objName,
        ACL: "public-read",
        Body: readStream,
      })
      .promise();
    return Location;
  });
const s3 = new AWS.S3();

export const handleDeletePhotoFromAWS = async (files) => {
  const decodedUrl = decodeURI(files);
  const fileName = decodedUrl.split("amazonaws.com/")[1];
  const Key = fileName.replace("%2C", ","); //decodeURI doesn't work well with ","

  await s3
    .deleteObject({
      Bucket,
      Key,
    })
    .promise();
};
