const AWS = require('aws-sdk');
const mime = require('mime-types');

const {
  AWS_ACCESS_SECRET_KEY,
  AWS_ACCESS_KEY,
  REGION,
  S3_BUCKET,
} = require('./envconfig');

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_ACCESS_SECRET_KEY,
});

const getMimeType = (imageName) => {
  const extension = imageName.split('.').pop();
  return mime.lookup(extension);
};

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const createParams = (image, imageName, mimeType) => {
  return {
    ACL: 'public-read',
    Body: image,
    Bucket: S3_BUCKET,
    Key: imageName,
    ContentType: mimeType,
  };
};

module.exports = { myBucket, createParams, getMimeType };
