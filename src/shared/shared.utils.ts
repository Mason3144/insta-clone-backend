import * as AWS from "aws-sdk";
import client from "../client";
import { UploadFile } from "../types";

const Bucket = "insta-clone-2022";

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const uploadToS3 = async (
  file: any,
  userId: number,
  folderName: string
) => {
  const {
    file: { filename, createReadStream },
  } = await file;
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
};

const s3 = new AWS.S3();

export const handleDeletePhotoFromAWS = async (fileUrl: string) => {
  const decodedUrl = decodeURI(fileUrl);
  const Key = decodedUrl.split("amazonaws.com/")[1];

  await s3
    .deleteObject({
      Bucket,
      Key,
    })
    .promise();
};
