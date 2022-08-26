import * as AWS from "aws-sdk";

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
      Bucket: "insta-clone-2022",
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};
