import AWS from "aws-sdk";
const { S3 } = AWS;

export default (fileName, body) => {
  const s3 = new S3({});
  var params = { Bucket: "my-library-cover-uploads", Key: `${fileName}`, Body: body };

  return new Promise(res => {
    s3.upload(params, function (err, data) {
      if (err) {
        return res({ error: true, message: err });
      }
      res({ success: true, url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` });
    });
  });
};
