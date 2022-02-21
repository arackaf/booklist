const { S3 } = require("aws-sdk");
const https = require("https");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const del = require("del");

const quality = 75;

const s3 = new S3();

const users = [
  "bookSummary/",
  "02033a47-5a17-4285-a87e-2cdc4d43c9da/",
  "169f08b9-7ee2-4cdf-8553-a86029dc2569/",
  "2d09916a-29c1-4feb-8ad4-eb9dd0054ab9/",
  "556a8966-33aa-49a6-9f3b-fc811ee9a363/",
  "56f34a2748243210269ecd66/",
  "573a98b53fa63ad82acc0f69/",
  "573d1b97120426ef0078aa92/",
  "57486bb7425464000319f060/",
  "57486bb7425464000319f062/",
  "5748c880a607c2f4005a05d0/",
  "583a83878d9110f200d29f8f/",
  "5873fb4c4dd860ef00b546ed/",
  "58889793168d82f500e5e2b1/",
  "589ac6158e4394f60026d452/",
  "58aaa7cfe0fbfbef000ab7ec/",
  "58bccd1a8c7a93f300d3b09f/",
  "58c860a2045a43f9008fd3c0/",
  "58cac166045a43f9008fd3e0/",
  "58cb0ea7045a43f9008fd3f0/",
  "58cbdf40045a43f9008fd435/",
  "58d25e6c5633f7f3005ce8a6/",
  "59103d71ffd0601000989614/",
  "59145084fc62f4100009e951/",
  "59196b021a3dc811001853d4/",
  "592eddbd0881711100af8283/",
  "594cbdb57c384a1100c06d31/",
  "5953b4376bd3bb1100f78acf/",
  "59589fb5c34583110035a501/",
  "595ef997631b761100a03414/",
  "598c732a512d2611000e8064/",
  "59b2dbeb480b821200993dc5/",
  "59b97c7261d14b120031daf1/",
  "59bf1c2baa13b71200846b82/",
  "59de5900baa03f12007c698b/",
  "5a0cdd3cefec071200fa9a59/",
  "5a22381b7edc6314002da93b/",
  "5a2a9040bdc75414003026c6/",
  "5a2fa794e5d0e91400879fd8/",
  "5a40f2109eb87e14007f263e/",
  "5a537231f0b9a314004c47d2/",
  "5a6b676b83284700149552f7/",
  "5a80c9f1920a07001458356b/",
  "5a8246c6d3362b0014781c16/",
  "5ab2df2108c6ca00141881ee/",
  "5abaf9b1c2ad4c0014d6daf3/",
  "5acf467fa9fd960014b9f421/",
  "5ad8a75dbb48710014deb77d/",
  "5af1f77c7d3b730014d0e87b/",
  "5b0ec25fc2e4d20014f48aac/",
  "5b2159e6b75b500014da12de/",
  "5b3fa219219c3700149fb587/",
  "5b53cda39507d00014becc5e/",
  "5b57f71b6871ae00145198ff/",
  "5b68a6eecc54ab0014203e09/",
  "5ba3e556bf73c00013b02d85/",
  "5bfd0f3ce01a5e0013469db4/",
  "5c067d9e089c380013597d2a/",
  "5c10defe1ff61f00137831ea/",
  "5c266de6967e9b904df20e77/",
  "5c482bb00d86d40014abd4de/",
  "5c715e469f3ed6001480e8c6/",
  "5c74174f01842d3d8f24c3de/",
  "5cc5aea6d6d88800146b75d5/",
  "5ce4d1aae7703e001593521f/",
  "5ce9ef0c95c15d0015528db7/",
  "5d2baf2d3e572d001552e389/",
  "5d35bb0142babf0015e12e95/",
  "5d3f2898042ae1001505c9e6/",
  "5d6027d37166db0015bc535e/",
  "5df692fae34a83f9c74ac701/",
  "5df6af99c65cf80fad0d3678/",
  "5e223f20a746c70015013877/",
  "5e2f5a418f370a00154ab43d/",
  "5e5a9fca28bff6001784a0d0/",
  "5e5cc3071e41d90017cbe2ac/",
  "5e73cee54f46080017abd06b/",
  "5e7885ce0439830017d6bc2c/",
  "5e90140cf12a8e001781f923/",
  "5ea4120f92bf2d0017e75f12/",
  "5eaf73a50d1a550017a41c74/",
  "5eaf7a1e433b4a0017fd69f1/",
  "5eaf7a5a433b4a0017fd69f9/",
  "5ebf5ce829c53200175e4b90/",
  "5eca219c53146b0017a84fe0/",
  "5ed407e7a7112c0017632a70/",
  "5ee852128008a00017567768/",
  "5f28eb93ab1be50017e5faf0/",
  "5f35e8675f1f8b0017a9acd7/",
  "5f528ea9bab7320017063bcc/",
  "5f6537ac8006d8001701be17/",
  "5f737d777d171800177cb565/",
  "5f96d2a2fc31950017a03174/",
  "5fa6386657bac1001768d0c7/",
  "5fbafbfe63e9f90017c506d8/",
  "5fbe2a2bda42eb001764e3f0/",
  "5fda2600e78a920017fc2864/",
  "6011856f91958c00176197fd/",
  "6013bbe85d10d400176ef93c/",
  "6045dd1a88861b0017901109/",
  "605271c47ea9517fbc7034bd/",
  "607622ec-9159-4961-89a4-694045d9a86a/",
  "60784ebe89cb9c0017f9bbd3/",
  "60924f1c91980900178de628/",
  "6095c6e0d181f90017228da7/",
  "60a93babcc3928454b5d1cc6/",
  "60bd7673539de90017f0e579/",
  "60d757689a9c630017212386/",
  "755fe1fe-230d-42a5-bb97-c8d1e29a39df/",
  "9d8e2247-8009-4ccd-96a5-30ae67b56b96/",
  "dca3016c-9be4-4449-a7ea-0f17f53590f0/",
  "f1ae2ef5-cc3a-4bd3-b382-385f4620889e/",
  "f3b55e0d-ecbc-4a0d-aaf0-5183137842be/"
];
const IMG_DIR_NAME = "./temp";

const getFileName = filename => "./temp/" + filename;
const getConvertedFilename = filename => "./temp/converted-" + filename;

function removeTempFolder() {
  try {
    del.sync(IMG_DIR_NAME);
  } catch (er) {}
}

async function getS3File(key) {
  const url = `https://my-library-cover-uploads.s3.amazonaws.com/${key}`;

  const filename = path.basename(key);
  if (!fs.existsSync(IMG_DIR_NAME)) {
    fs.mkdirSync(IMG_DIR_NAME);
  }

  let file = fs.createWriteStream(getFileName(filename));

  return new Promise(res => {
    https
      .get(url, response => {
        response.pipe(file);
        file.on("finish", async () => {
          await file.close();
          res(null);
        });

        file.on("error", async err => {
          console.log("File error", err);
          res(null);
        });
      })
      .on("error", err => {
        console.log("Request error", err);
        res(null);
      });
  });
}

async function updateImage(key) {
  const filename = path.basename(key);

  return new Promise(res => {
    Jimp.read(getFileName(filename), async function (err, image) {
      if (err || !image) {
        console.log("Failed to read", filename);
        return res({ error: true, message: err });
      }

      if (image.bitmap.width > 55) {
        return res({ body: null, largeImage: true });
      }
      image.quality(quality);

      try {
        await image.writeAsync(getConvertedFilename(filename));
        image.getBuffer(image.getMIME(), (err, body) => {
          if (err) {
            return rej({ error: true, message: err });
          }

          return res({ body });
        });
      } catch (er) {
        console.log("Failed to save", filename, er);
      }
    });
  });
}

async function uploadNewImage(body, filename, key) {
  const defaultMetaData = {
    CacheControl: "max-age=630720000,public",
    ContentType: "image/jpeg"
  };

  const s3 = new S3({});
  var params = { Bucket: "my-library-cover-uploads", Key: key, Body: body, ...defaultMetaData };

  return new Promise((res, rej) => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        return rej({ error: true, message: err });
      }

      console.log("Uploaded to", key, "from", filename);
      res({ success: true });
    });
  });
}

async function processBucket(userId, nextContinuation) {
  return new Promise((res, rej) => {
    s3.listObjectsV2(
      { Bucket: "my-library-cover-uploads", Prefix: "bookCovers/" + userId, ContinuationToken: nextContinuation || void 0 },
      async (err, data) => {
        if (err) {
          console.log("ERROR", err);
          return rej(err);
        }

        let i = 0;
        for (const obj of data.Contents) {
          console.log("\n", i++, obj.Key);
          if (obj.Size > 2500) {
            try {
              await getS3File(obj.Key);
              const { body, largeImage } = await updateImage(obj.Key);
              if (largeImage) {
                console.log("---- Not a small image. Skipping ----");
                continue;
              }

              const convertedFilename = getConvertedFilename(path.basename(obj.Key));

              const newSize = fs.statSync(convertedFilename).size;
              if (newSize < obj.Size) {
                await uploadNewImage(body, convertedFilename, obj.Key);
                console.log("🚀 Success 🚀");
              } else {
                console.log("---- No size improvement ----");
              }
            } catch (er) {
              console.log("ERROR", er);
            }
          } else {
            console.log("---- Skipping file ----", obj.Key);
          }
        }

        res({ contents: data.Contents, nextToken: data.NextContinuationToken });
      }
    );
  });
}

let i = 1;
async function processUser(userId) {
  let nextToken;
  let contents;
  removeTempFolder();

  do {
    console.log(i++, " ============ UserId:", userId, "============");
    ({ nextToken, contents } = await processBucket(userId, nextToken));
  } while (nextToken);
}

(async function () {
  for (const user of users.filter(u => u !== "573d1b97120426ef0078aa92/" && u !== "5b57f71b6871ae00145198ff/")) {
    await processUser(user);
    break;
  }
})();
