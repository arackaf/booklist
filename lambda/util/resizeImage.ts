import Jimp from "jimp";

export function resizeImage(src, MAX_WIDTH, MIN_WIDTH = null, quality = null) {
  return new Promise<any>(res => {
    Jimp.read(src, async function (err, image) {
      if (err || !image) {
        return res({ error: true, message: err });
      }

      if (MIN_WIDTH != null && image.bitmap.width < MIN_WIDTH) {
        return res({ error: true, message: "Min width constraint violated" });
      }

      if (image.bitmap.width > MAX_WIDTH) {
        image.resize(MAX_WIDTH, Jimp.AUTO);
      }
      if (quality != null) {
        image.quality(quality);
      }

      let preview;
      try {
        const previewImage = image.clone();
        previewImage.quality(25).blur(8);
        preview = await previewImage.getBase64Async(previewImage.getMIME());
      } catch (er) {
        return res({ error: true, message: err, previewGenerationError: true });
      }

      image.getBuffer(image.getMIME(), (err, body) => {
        if (err) {
          return res({ error: true, message: err });
        }

        return res({ body, preview });
      });
    });
  });
}
