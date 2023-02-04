import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";

const downloadFromUrl = url => {
  return new Promise(res => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(arrBuffer => res({ body: Buffer.from(arrBuffer) }))
      .catch(err => res({ error: true, msg: err }));
  });
};

const Bucket = "my-library-cover-uploads";

const uploadToS3 = (fileName, body) => {
  const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA5OFXDZPZ5CEYYVHI",
      secretAccessKey: "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"
    }
  });
  const key = fileName;
  var params = new PutObjectCommand({ Bucket, Key: key, Body: body });

  return new Promise(res => {
    s3.send(params, function (err, data) {
      if (err) {
        return res({ STATUS: "error", message: err });
      }
      res({ STATUS: "success", url: `https://${Bucket}.s3.amazonaws.com/${key}` });
    });
  });
};

const SIZE_WIDTHS = {
  mobile: 35,
  small: 50,
  medium: 106
};

async function processCover(url, filename) {
  const { body, error } = await downloadFromUrl(url);

  const img = sharp(body);
  const metadata = await img.metadata();
  console.log({ metadata });

  const results = {};

  let resultImage;
  if (metadata.width >= SIZE_WIDTHS.medium) {
    resultImage = img.resize(SIZE_WIDTHS.medium).jpeg({ quality: 95 });

    const buffer = await resultImage.toBuffer();
    const { status, url } = await uploadToS3(filename, buffer);
  }

  //const plaiceholderResult = await getPlaiceholder(img);
}

async function main() {
  processCover("https://m.media-amazon.com/images/I/51TCX1OukUL._SX331_BO1,204,203,200_.jpg", "foo.jpg");
}

main();
