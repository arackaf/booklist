import fetch from "node-fetch";
import sharp from "sharp";

import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3.js";

const downloadFromUrl = (url, minSizeToAccept = null) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(body => ({ body: Buffer.from(body) }))
    .then(packet => {
      if (minSizeToAccept && packet.body.byteLength < minSizeToAccept) {
        return null;
      } else {
        return packet;
      }
    })
    .catch(err => ({ error: true, msg: err }));
};

async function go() {
  try {
    const res = await downloadFromUrl("https://images-na.ssl-images-amazon.com/images/I/510FXFd+04L._SX379_BO1,204,203,200_.jpg");
    const { body, error } = res;
    await sharp(body).resize(80, undefined, { withoutEnlargement: true }).toFile("./junk-80.jpg");

    const X = sharp(body);
    console.log("width", (await X.metadata()).width);

    await sharp("./junk-80.jpg").resize(200, undefined, { withoutEnlargement: true }).toFile("./junk-200.jpg");
    const buff = await sharp("./junk-80.jpg").resize(200, undefined, { withoutEnlargement: true }).toBuffer();

    await saveContentToS3(buff, "__adam_temp/some-file.jpg");
  } catch (er) {
    console.log(er);
  }
}

go();

export function saveContentToS3(content, s3Key) {
  return new Promise(res => {
    let s3bucket = new S3({ params: { Bucket: "my-library-cover-uploads" } });

    let params = {
      Key: s3Key,
      Body: content
    };

    s3bucket.upload(params, function (err) {
      if (err) {
        console.log("Error uploading to S3", { s3Key, err });
        res(err);
      } else {
        console.log("S3 File Saved");
        res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      }
    });
  });
}
