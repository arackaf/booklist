const S3 = require("aws-sdk/clients/s3");
import { defaultMetaData } from "./s3MetaData";

type S3UploadResult = { STATUS: "error"; message: any } | { STATUS: "success"; url: string };

export default (fileName, body) => {
  const s3 = new S3({});
  var params = { Bucket: "my-library-cover-uploads", Key: `${fileName}`, Body: body, ...defaultMetaData };

  return new Promise<S3UploadResult>(res => {
    s3.upload(params, function (err, data) {
      if (err) {
        return res({ STATUS: "error", message: err });
      }
      res({ STATUS: "success", url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` });
    });
  });
};
