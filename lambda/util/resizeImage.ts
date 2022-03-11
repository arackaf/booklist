import Jimp from "jimp";

export type ResizeImageFailure = { STATUS: "error"; message?: string; previewGenerationError?: boolean };

export type ResizeImageResult = ResizeImageFailure | { STATUS: "success"; image: Jimp; preview: string };

export function resizeImage(src, MAX_WIDTH, MIN_WIDTH = null, quality = null) {
  return new Promise<ResizeImageResult>(res => {
    Jimp.read(src, async function (err, image) {
      if (err || !image) {
        console.log("Error reading file", err);
        return res({ STATUS: "error" });
      }

      if (MIN_WIDTH != null && image.bitmap.width < MIN_WIDTH) {
        return res({ STATUS: "error", message: "Min width constraint violated" });
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
        console.log("Error generating preview", err);
        return res({ STATUS: "error", previewGenerationError: true });
      }

      res({ STATUS: "success", image, preview });
    });
  });
}

type GetBufferResult = ResizeImageFailure | { STATUS: "success"; body: any; preview: string };
export async function getBuffer(result: ResizeImageResult): Promise<GetBufferResult> {
  if (result.STATUS === "error") {
    return result;
  }
  const { image, preview } = result;

  return new Promise(res => {
    if (image && preview) {
      image.getBuffer(image.getMIME(), (err, body) => {
        if (err || !body) {
          console.log("Get buffer error", err);
          return res({ STATUS: "error" });
        }

        return res({ STATUS: "success", body, preview });
      });
    }
  });
}
