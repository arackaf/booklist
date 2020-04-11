import S3 from "aws-sdk/clients/s3";
//import XMLHttpRequest from "xmlhttprequest"; //).XMLHttpRequest

//global.XMLHttpRequest = XMLHttpRequest;

exports.handler = async req => {
  try {
    //return "a";
    //if (req.queryStringParameters && req.queryStringParameters.key) {
    const s3 = new S3({
      // credentials: {
      //   accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY
      // },
      accessKeyId: "AKIAIEU33COC4BYOKJGQ", //process.env.S3_AWS_ACCESS_KEY_ID,
      secretAccessKey: "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" //process.env.S3_AWS_SECRET_ACCESS_KEY
    });
    return new Promise(res => {
      var params = { Bucket: "my-library-cover-upload-staging", Key: "key-123", Body: "Hello" };

      s3.upload(params, function(err, data) {
        res(err || "success");
      });
    });
    //}
    return "";
  } catch (err) {
    return "Err " + (err || "nothing");
  }
};
