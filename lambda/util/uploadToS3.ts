import S3 from "aws-sdk/clients/s3";
import { defaultMetaData } from "./s3MetaData";

export default (fileName, body) => {
  const s3 = new S3({});
  var params = { Bucket: "my-library-cover-uploads", Key: `${fileName}`, Body: body, ...defaultMetaData };

  return new Promise(res => {
    s3.upload(params, function (err, data) {
      if (err) {
        return res({ error: true, message: err });
      }
      res({ success: true, url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` });
    });
  });
};
